// Opretter en Stripe Checkout-side for Premium (måned eller år) med gratis prøveperiode.
// Én samlet fil: kan kopieres direkte ind i Supabase → Edge Functions → editor.
import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

// ---- Fælles hjælpere (samme i alle tre funktioner) ----
export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
export const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
// Adressen hvor appen ligger, fx https://dani-gh1.github.io/Lift/
export const APP_URL = Deno.env.get('APP_URL')!;

export const cors = {
  'Access-Control-Allow-Origin': new URL(APP_URL).origin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Finder den indloggede bruger ud fra appens login-token
export async function getUser(req: Request) {
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user;
}

// Henter (eller opretter) Stripe-kunden for en bruger
export async function customerFor(user: { id: string; email?: string }) {
  const { data } = await admin.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id as string;
  const c = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
  await admin.from('subscriptions').upsert({ user_id: user.id, stripe_customer_id: c.id, updated_at: new Date().toISOString() });
  return c.id;
}
// ---- Slut på fælles hjælpere ----

const PRICES: Record<string, string | undefined> = {
  month: Deno.env.get('STRIPE_PRICE_MONTH'),
  year: Deno.env.get('STRIPE_PRICE_YEAR'),
};
const TRIAL_DAYS = Number(Deno.env.get('TRIAL_DAYS') || '7');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: 'not_signed_in' }, 401);
    const { plan } = await req.json().catch(() => ({}));
    const price = PRICES[plan];
    if (!price) return json({ error: 'unknown_plan' }, 400);

    // Allerede Premium? Så send brugeren til administration i stedet
    const { data: sub } = await admin.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle();
    if (sub && ['active', 'trialing'].includes(sub.status)) return json({ error: 'already_premium' }, 409);

    const customer = await customerFor(user);
    // Kun én gratis prøveperiode pr. kunde
    const earlier = await stripe.subscriptions.list({ customer, status: 'all', limit: 1 });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [{ price, quantity: 1 }],
      subscription_data: {
        metadata: { user_id: user.id, plan },
        ...(earlier.data.length === 0 && TRIAL_DAYS > 0 ? { trial_period_days: TRIAL_DAYS } : {}),
      },
      metadata: { user_id: user.id, plan },
      allow_promotion_codes: true,
      locale: 'auto',
      success_url: `${APP_URL}?app&checkout=success`,
      cancel_url: `${APP_URL}?app&checkout=cancel`,
    });
    return json({ url: session.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'server_error' }, 500);
  }
});
