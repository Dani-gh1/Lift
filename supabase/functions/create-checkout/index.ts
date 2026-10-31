// Opretter en Stripe Checkout-side for Premium (måned eller år) med gratis prøveperiode.
import { stripe, admin, APP_URL, cors, json, getUser, customerFor } from '../_shared/common.ts';

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
