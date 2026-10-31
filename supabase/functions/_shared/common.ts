import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
export const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
// Adressen hvor appen ligger, fx https://flowersmokeapp.github.io/Lift/
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
