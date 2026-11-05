// Stripe kalder denne, når et abonnement oprettes, ændres eller opsiges.
// Den er den ENESTE der skriver Premium-status i databasen.
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

const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const cryptoProvider = Stripe.createSubtleCryptoProvider();

async function save(sub: Stripe.Subscription) {
  const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  let userId = sub.metadata?.user_id;
  if (!userId) {
    const c = await stripe.customers.retrieve(customer);
    userId = (c as Stripe.Customer).metadata?.user_id;
  }
  if (!userId) { console.error('no user_id for', customer); return; }
  const item = sub.items.data[0];
  const interval = item?.price?.recurring?.interval;
  // current_period_end ligger på abonnementet (ældre API) eller på linjen (nyere API)
  const end = (sub as any).current_period_end ?? (item as any)?.current_period_end;
  const { error } = await admin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customer,
    stripe_subscription_id: sub.id,
    status: sub.status,
    plan: interval === 'year' ? 'year' : 'month',
    current_period_end: end ? new Date(end * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

Deno.serve(async (req) => {
  const sig = req.headers.get('Stripe-Signature');
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, secret, undefined, cryptoProvider);
  } catch (e) {
    return new Response(`Bad signature: ${(e as Error).message}`, { status: 400 });
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.subscription) await save(await stripe.subscriptions.retrieve(s.subscription as string));
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await save(event.data.object as Stripe.Subscription);
        break;
    }
    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response('handler error', { status: 500 }); // Stripe prøver igen
  }
});
