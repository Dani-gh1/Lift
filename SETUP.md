# LIFT – opsætning (dansk guide)

Appen virker uden noget af dette. Følg de dele, du vil slå til.
Alt redigeres i **`data.js`** (øverst i `CONFIG`).

---

## 1. Måling med GoatCounter (5 min, gratis)

1. Gå til **https://www.goatcounter.com/signup**.
2. Vælg en kode, fx `lift-app`. Din side bliver `https://lift-app.goatcounter.com`.
3. Skriv koden i `data.js`: `goatcounterCode: 'lift-app',`
4. Læg ændringen på GitHub. Efter et par minutter kan du se tallene på din GoatCounter-side under **Events**.

Det bliver målt (uden cookies og uden personlige data):

| Event | Betyder |
|---|---|
| `evt-onboarding-done` | Har valgt program |
| `evt-workout-complete` | Har gennemført en træning |
| `evt-reached-week-2` / `evt-reached-week-4` | Har nået uge 2 / uge 4 (tælles én gang pr. bruger) |
| `evt-program-complete` | Har gennemført hele programmet |
| `evt-premium-view`, `evt-premium-click-*` | Har åbnet Premium (og hvorfra) |
| `evt-trial-click-*`, `evt-waitlist-join` | Interesse uden betaling |
| `evt-checkout-start-*`, `evt-checkout-success` | Har startet / gennemført betaling |
| `evt-backup`, `evt-calendar`, `evt-installed` | Backup, kalender, hjemmeskærm |

---

## 2. Venteliste med Tally (5 min, gratis)

Bruges kun, så længe betaling (punkt 3) ikke er slået til.

1. Gå til **https://tally.so** og opret en gratis formular med ét felt: *E-mail*.
2. Tryk **Publish** og kopiér linket, fx `https://tally.so/r/abc123`.
3. Skriv det i `data.js`: `waitlistUrl: 'https://tally.so/r/abc123',`
4. Tilmeldinger kan du se i Tally. Du kan få dem på mail eller trække dem ud til Google Sheets.

---

## 3. Login og betaling (Supabase + Stripe), ca. 45 min

**Sådan virker det:** Brugeren logger ind med sin e-mail og får en 6-cifret kode (ingen adgangskode). Betaling foregår på Stripes egen sikre side. Bagefter fortæller Stripe Supabase, at brugeren har Premium. **Træningsdata gemmes stadig kun på telefonen.** Serveren ved kun, om man har Premium.

Du skal bruge en computer med en terminal.

### 3a. Supabase (database og login)
1. Opret en gratis konto på **https://supabase.com**, og opret et nyt projekt (vælg region *Central EU (Frankfurt)*).
2. **SQL Editor** → *New query* → indsæt hele indholdet af `supabase/migrations/001_subscriptions.sql` → **Run**.
3. **Authentication → Sign In / Providers → Email**: sørg for, at *Email* er slået til. Sæt *Email OTP Length* til **6**.
4. **Authentication → Emails → Magic Link**: skift teksten, så koden står i mailen, fx:
   ```html
   <h2>Your LIFT code</h2>
   <p>Enter this code in the app:</p>
   <p style="font-size:28px;letter-spacing:4px"><b>{{ .Token }}</b></p>
   ```
   Gør det samme under **Confirm signup**.
5. **Authentication → URL Configuration**: *Site URL* = `https://flowersmokeapp.github.io/Lift/`
6. **Project Settings → API**: kopiér *Project URL* og *anon public*-nøglen ind i `data.js`:
   ```js
   supabaseUrl: 'https://xxxx.supabase.co',
   supabaseAnonKey: 'eyJ...',
   ```
   Begge må gerne være offentlige. Del **aldrig** *service_role*-nøglen.
7. ⚠️ Supabases indbyggede mail-afsender kan kun sende ganske få mails i timen. Før du åbner for rigtige brugere, så opsæt din egen afsender under **Authentication → Emails → SMTP Settings**, fx med Resend (gratis til start).

### 3b. Stripe (betaling)
Start i **testtilstand** (knappen *Test mode* øverst i Stripe).
1. Opret konto på **https://stripe.com**.
2. **Product catalog → Add product**: "LIFT Premium" med to priser:
   - 49 DKK, gentages **månedligt**
   - 349 DKK, gentages **årligt**

   Kopiér begge **Price ID'er** (starter med `price_`).
3. **Settings → Billing → Customer portal**: slå til, og tillad *opsig abonnement* og *skift plan*.
4. **Developers → API keys**: kopiér *Secret key* (`sk_test_...`).

### 3c. Læg serverfunktionerne op
Installer Supabase CLI (https://supabase.com/docs/guides/cli), åbn en terminal i mappen med koden og kør:
```bash
supabase login
supabase link --project-ref DIT_PROJEKT_ID
supabase functions deploy create-checkout
supabase functions deploy customer-portal
supabase functions deploy stripe-webhook --no-verify-jwt
```

### 3d. Webhook (Stripe → Supabase)
1. Stripe → **Developers → Webhooks → Add endpoint**
   - URL: `https://DIT_PROJEKT_ID.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
2. Kopiér *Signing secret* (`whsec_...`).

### 3e. Hemmelige nøgler (kun på serveren)
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  STRIPE_PRICE_MONTH=price_... \
  STRIPE_PRICE_YEAR=price_... \
  APP_URL=https://flowersmokeapp.github.io/Lift/ \
  TRIAL_DAYS=7
```

### 3f. Test det
1. Læg den nye `data.js` på GitHub, og åbn appen.
2. Premium → indtast din e-mail → indtast koden → **Start 7-day free trial**.
3. Betal med testkortet **4242 4242 4242 4242**, en vilkårlig fremtidig dato og CVC 123.
4. Du kommer tilbage til appen, og efter få sekunder står der **You have Premium**.
5. Tjek i Supabase → *Table Editor → subscriptions*, at der er en række.
6. Prøv **Manage subscription** → opsig. Når perioden slutter, forsvinder Premium.

### 3g. Gå live
Slå *Test mode* fra i Stripe, og gentag 3b (produkt og priser), 3d (webhook) og 3e med de rigtige `sk_live_`- og `whsec_`-nøgler. Husk også handelsbetingelser og privatlivspolitik. Brugerne er 15–22 år, og under 18 kan kræve forældres samtykke til køb.

---

## 4. Testknapper
Knapperne "Turn Premium on" og "Sample data" er skjult for brugere. Du kan se dem ved at åbne
`https://flowersmokeapp.github.io/Lift/?app&test` (de bliver synlige på den enhed fremover).

## 5. Når du ændrer filer
Hæv tallet `?v=` i `index.html` og `CACHE` i `sw.js` (fx `lift-v5` → `lift-v6`), så telefonerne henter den nye version.
