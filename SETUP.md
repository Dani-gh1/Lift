# LIFT – opsætning trin for trin

Alt foregår i browseren. Du behøver ikke terminal eller programmer.
Tag delene i rækkefølge. Hver del virker for sig, så du kan stoppe efter hvilken som helst.

> **Sådan ændrer du `data.js` på GitHub** (bruges flere gange):
> 1. Åbn https://github.com/FlowerSmokeapp/Lift/blob/main/data.js
> 2. Tryk på blyanten ✏️ (øverst til højre i filen).
> 3. Ret linjen, og tryk den grønne **Commit changes…** → **Commit changes**.
> 4. Vent ca. 2 minutter, og genindlæs appen.
>
> Du kan også bare sende værdierne til Claude, så sætter Claude dem ind.
> **Send aldrig hemmelige nøgler** (dem der starter med `sk_`, `whsec_` eller hedder *service_role*) til nogen, heller ikke Claude.

---

## Del 1 – Måling med GoatCounter (5 min)

1. Gå til **https://www.goatcounter.com/signup**
2. Udfyld:
   - **Code:** fx `liftapp` (bliver til `liftapp.goatcounter.com`)
   - Din e-mail og en adgangskode
3. Tryk **Sign up**, og bekræft mailen, du får.
4. Ret i `data.js`:
   ```js
   goatcounterCode: 'liftapp',
   ```
5. **Tjek:** Åbn appen på din telefon, og lav en træning. Gå til `https://liftapp.goatcounter.com`. Efter et par minutter kan du se besøg, og under *Events* står fx `evt-workout-complete`.

---

## Del 2 – Venteliste med Tally (5 min)

*(Bruges kun, indtil betaling i del 3–6 er slået til.)*

1. Gå til **https://tally.so**, og opret en gratis konto.
2. Tryk **Create form**, og skriv titlen *LIFT Premium – venteliste*.
3. Skriv `/email`, og tryk Enter for at tilføje et e-mailfelt. Marker det som **Required**.
4. Tryk **Publish** og kopiér linket, fx `https://tally.so/r/abc123`.
5. Ret i `data.js`:
   ```js
   waitlistUrl: 'https://tally.so/r/abc123',
   ```
6. **Tjek:** Appen → Premium → **Join the waitlist** åbner din formular. Tilmeldinger kan ses i Tally under *Submissions*.

---

## Del 3 – Stripe: produkt og priser (10 min)

1. Gå til **https://dashboard.stripe.com/register**, og opret en konto.
2. Sørg for, at **Test mode** er slået TIL (kontakten øverst til højre). Alt herunder laves i testtilstand først.
3. Venstremenuen → **Product catalog** → **+ Add product**:
   - **Name:** `LIFT Premium`
   - **Pricing:** *Recurring*, **49,00 DKK**, *Billing period:* **Monthly**
   - Tryk **Add product**.
4. Åbn produktet → **+ Add another price**: *Recurring*, **349,00 DKK**, **Yearly** → **Add price**.
5. Tryk på hver af de to priser, og kopiér deres **Price ID** (starter med `price_…`). Skriv dem ned som *MÅNED* og *ÅR*.
6. Venstremenuen → **Settings** (tandhjul) → **Billing** → **Customer portal** → tryk **Activate**. Slå til:
   - *Customers can cancel subscriptions*
   - *Customers can switch plans* (vælg LIFT Premium)
   
   og tryk **Save**.
7. **Developers** (nederst til venstre) → **API keys** → ved *Secret key* tryk **Reveal**, og kopiér nøglen (`sk_test_…`). Den er hemmelig, så gem den kun et sikkert sted.

---

## Del 4 – Supabase: database og login (10 min)

1. Gå til **https://supabase.com/dashboard**, og opret en konto (fx med GitHub).
2. **New project**:
   - **Name:** `lift`
   - **Database password:** tryk *Generate*, og gem koden et sikkert sted
   - **Region:** *Central EU (Frankfurt)*
   - Tryk **Create new project**, og vent 1–2 minutter.
3. **Opret tabellen:** Venstremenuen → **SQL Editor** → **+ New query**. Kopiér HELE indholdet af
   https://github.com/FlowerSmokeapp/Lift/blob/main/supabase/migrations/001_subscriptions.sql
   ind, og tryk **Run**. Der skal stå *Success. No rows returned*.
4. **Login-kode i stedet for link:** Venstremenuen → **Authentication** → **Sign In / Providers** → **Email**:
   - *Enable Email provider*: **til**
   - *Email OTP Length*: **6**
   - Tryk **Save**.
5. **Mails:** Du behøver ikke ændre noget. Supabases standardmail sender et **login-link**, som appen forstår.
   *(Supabase kræver egen mail-afsender (SMTP) for at redigere skabelonerne. Det sætter du op i del 8, og så kan mailen også vise en 6-cifret kode. Koden er bedst, hvis appen er gemt på hjemmeskærmen på iPhone, for der åbner linket i Safari i stedet for i appen.)*
6. **Adresser:** **Authentication** → **URL Configuration**:
   - *Site URL* = `https://flowersmokeapp.github.io/Lift/` → **Save**
   - Under *Redirect URLs* → **Add URL** → `https://flowersmokeapp.github.io/Lift/**` → **Save**
7. **Nøgler til appen:** Tryk **Connect** øverst (eller **Project Settings → API Keys**). Kopiér:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon / public key** (lang tekst der starter med `eyJ…`, eller `sb_publishable_…`)

   Ret i `data.js`. Begge må gerne være offentlige:
   ```js
   supabaseUrl: 'https://xxxx.supabase.co',
   supabaseAnonKey: 'eyJ...',
   ```
   Brug **aldrig** *service_role*- eller *secret*-nøglen i appen.

---

## Del 5 – Supabase: de 3 serverfunktioner (10 min)

Gør dette 3 gange, én gang for hver funktion:

| Funktionsnavn (skal staves præcis sådan) | Kode at kopiere |
|---|---|
| `create-checkout` | https://github.com/FlowerSmokeapp/Lift/blob/main/supabase/functions/create-checkout/index.ts |
| `customer-portal` | https://github.com/FlowerSmokeapp/Lift/blob/main/supabase/functions/customer-portal/index.ts |
| `stripe-webhook` | https://github.com/FlowerSmokeapp/Lift/blob/main/supabase/functions/stripe-webhook/index.ts |

1. Åbn kode-linket, og tryk på **Copy raw file**-ikonet (to firkanter øverst til højre i filen).
2. Supabase → venstremenuen → **Edge Functions** → **Deploy a new function** → **Via Editor**.
3. Slet eksempelkoden, og indsæt din kopi.
4. Skriv funktionsnavnet nederst (fx `create-checkout`), og tryk **Deploy function**.

**Kun for `stripe-webhook`:** Åbn funktionen → fanen **Details** (eller *Settings*). Slå **Verify JWT / Enforce JWT verification** **FRA**, og gem. Stripe kan ikke logge ind, så her er det Stripes signatur, der beskytter funktionen.

Kopiér adressen på `stripe-webhook`. Den står øverst på funktionen og ser sådan ud:
`https://xxxx.supabase.co/functions/v1/stripe-webhook`

---

## Del 6 – Forbind Stripe og Supabase (10 min)

**A. Webhook i Stripe**
1. Stripe → **Developers** → **Webhooks** → **+ Add destination** (eller *Add endpoint*).
2. Vælg events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` og `customer.subscription.deleted` → **Continue**.
3. *Destination type*: **Webhook endpoint** → **Endpoint URL**: adressen fra del 5 → **Create destination**.
4. Tryk **Reveal** ved **Signing secret**, og kopiér (`whsec_…`). Den er hemmelig.

**B. Hemmelige nøgler i Supabase**
Supabase → **Edge Functions** → **Secrets**. Tilføj disse 6 (navn til venstre, værdi til højre), og tryk **Save**:

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` fra del 3, trin 7 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` fra del 6A |
| `STRIPE_PRICE_MONTH` | Price ID for *MÅNED* |
| `STRIPE_PRICE_YEAR` | Price ID for *ÅR* |
| `APP_URL` | `https://flowersmokeapp.github.io/Lift/` |
| `TRIAL_DAYS` | `7` |

*(`SUPABASE_URL` og `SUPABASE_SERVICE_ROLE_KEY` findes automatisk, dem skal du ikke tilføje.)*

---

## Del 7 – Test betaling (5 min)

1. Åbn **https://flowersmokeapp.github.io/Lift/?app** på din telefon.
2. **Premium** → skriv din e-mail → **Send** → åbn mailen fra Supabase på **samme telefon** → tryk **Sign in**-linket. Appen åbner, og du er logget ind.
3. Vælg *Monthly* eller *Yearly* → **Start 7-day free trial**.
4. På Stripes side bruger du testkortet:
   - Kortnummer **4242 4242 4242 4242**
   - Udløb fx **12/30**, CVC **123**, vilkårligt navn
5. Du sendes tilbage til appen, og efter få sekunder står der **You have Premium**. ✅
6. **Tjek:** Supabase → **Table Editor** → `subscriptions` har en række med *status = trialing*.
7. **Test opsigelse:** Premium → **Manage subscription** → *Cancel subscription*. Appen viser nu "ends …".

**Virker det ikke?**

| Problem | Løsning |
|---|---|
| Ingen mail | Tjek spam. Supabases standard-afsender kan kun sende få mails i timen, så vent lidt. |
| Linket åbner, men du er ikke logget ind | Tjek *Redirect URLs* (del 4, trin 6). Åbn linket på samme enhed og i samme browser, som du bad om det fra. |
| "Something went wrong" ved betaling | Supabase → Edge Functions → `create-checkout` → **Logs**. Tjek stavningen af nøglerne i del 6B. |
| Betalt, men ingen Premium | Stripe → Webhooks → din destination → se om events fejler. Er JWT-verificering slået fra på `stripe-webhook` (del 5)? Er `STRIPE_WEBHOOK_SECRET` rigtig? |

---

## Del 8 – Før rigtige brugere

1. **Egen mail-afsender** (Supabase sender kun få mails i timen):
   - **Har du et domæne** (fx liftapp.dk): opret en gratis konto på **https://resend.com**, bekræft domænet, og indsæt Resends SMTP-oplysninger under Supabase → Authentication → Emails → **SMTP Settings**.
   - **Uden domæne**: brug Gmail. Slå 2-trins-bekræftelse til på din Google-konto, og lav en *App-adgangskode* (myaccount.google.com/apppasswords). I Supabase SMTP: Host `smtp.gmail.com`, Port `465`, Username = din Gmail, Password = app-adgangskoden.
   - Når SMTP er sat op: gå til **Authentication → Emails → Magic Link** og **Confirm signup**, og tilføj koden til mailen:
     ```html
     <h2>Your LIFT sign-in</h2>
     <p><a href="{{ .ConfirmationURL }}">Tap here to sign in</a></p>
     <p>Or enter this code in the app: <b style="font-size:24px;letter-spacing:4px">{{ .Token }}</b></p>
     ```
2. **Live-betaling:** I Stripe slår du *Test mode* FRA. Gentag del 3 (produkt, priser, nøgle) og del 6 med de nye `sk_live_…`- og `whsec_…`-værdier, og opdatér de 4 Stripe-secrets i Supabase.
3. **Jura:** Lav handelsbetingelser og en privatlivspolitik, og link til dem. Brugere under 18 kan kræve forældres samtykke for at købe abonnement. Spørg evt. en rådgiver.
4. **Testknapperne** ser kun du, når du åbner `…/Lift/?app&test`.

---

## Når du selv ændrer i filerne
Hæv tallet `?v=` i `index.html` og `CACHE` i `sw.js` (fx `lift-v5` → `lift-v6`), så telefonerne henter den nye version.
