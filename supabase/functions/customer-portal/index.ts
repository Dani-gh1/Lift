// Åbner Stripes kundeportal, hvor brugeren kan skifte plan, opdatere kort eller opsige.
import { stripe, admin, APP_URL, cors, json, getUser } from '../_shared/common.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: 'not_signed_in' }, 401);
    const { data } = await admin.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    if (!data?.stripe_customer_id) return json({ error: 'no_customer' }, 404);
    const s = await stripe.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${APP_URL}?app` });
    return json({ url: s.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'server_error' }, 500);
  }
});
