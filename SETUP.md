# LIFT – opsætning trin for trin (Firebase)

Alt foregår i browseren. Du behøver ikke terminal eller programmer.
Appen virker uden noget af dette – hver del slår en ekstra funktion til.

> **Sådan ændrer du `data.js`** – eller send værdierne til Claude, så sætter Claude dem ind:
> 1. Åbn https://github.com/dani-gh1/Lift/blob/main/data.js
> 2. Tryk på blyanten ✏️, ret linjen, og tryk **Commit changes…** → **Commit changes**.
> 3. Vent ca. 2 minutter, og genindlæs appen.
>
> **Send aldrig hemmelige nøgler** til nogen (heller ikke Claude): `sk_…`, `rk_…`, `whsec_…`.
> Firebase-konfigurationen (`apiKey: "AIza…"` osv.) og Stripe Price ID'er (`price_…`) er **ikke** hemmelige.

**Har du allerede lavet del 1–3?** Så start ved **del 4**.

---

## Del 1 – Måling med GoatCounter (5 min) ✅ lavet
Konto på https://www.goatcounter.com · koden står i `data.js` (`goatcounterCode`).

## Del 2 – Venteliste med Tally (5 min) ✅ lavet
Formularen står i `data.js` (`waitlistUrl`). Vises kun, indtil betaling er slået til.

## Del 3 – Stripe: produkt og priser (10 min) ✅ lavet
Hvis ikke: https://dashboard.stripe.com (med **Test mode** slået til) → **Product catalog** → **Add product** "LIFT Premium" med to priser: **49 DKK månedligt** og **349 DKK årligt**. Slå kundeportalen til på https://dashboard.stripe.com/test/settings/billing/portal (tillad opsigelse og skift af plan).

---

## Del 4 – Opret Firebase-projektet (5 min)
1. Gå til **https://console.firebase.google.com** og log ind med din Google-konto.
2. Tryk **Create a project** (eller *Add project*) → navn: `lift` → **Continue**.
3. **Google Analytics:** slå det **fra** (vi bruger GoatCounter) → **Create project** → **Continue**.
4. På projektets forside: tryk på **web-ikonet `</>`** (*Add app → Web*).
5. Navn: `LIFT` → lad *Firebase Hosting* være fravalgt → **Register app**.
6. Firebase viser en kodeblok med `const firebaseConfig = { apiKey: "...", authDomain: "...", projectId: "...", ... }`.
   **Kopiér hele blokken og send den til Claude** – den er offentlig og skal ind i `data.js`.
   *(Du finder den igen under ⚙️ **Project settings** → **General** → **Your apps**.)*

## Del 5 – Login (3 min)
Firebase sender selv login-mails – du skal **ikke** sætte en mail-afsender op.
1. Venstremenuen → **Build** → **Authentication** → **Get started**.
2. Fanen **Sign-in method** → **Email/Password** →
   - slå **Email/Password** til
   - slå **Email link (passwordless sign-in)** til → **Save**.
3. Fanen **Settings** → **Authorized domains** → **Add domain** → `dani-gh1.github.io` → **Add**.

## Del 6 – Databasen (3 min)
1. **Build** → **Firestore Database** → **Create database**.
2. **Location:** vælg `eur3 (europe)` – det kan **ikke** ændres senere → **Next**.
3. Vælg **Start in production mode** → **Create**.
4. Fanen **Rules**: slet alt, og indsæt hele indholdet af
   https://github.com/dani-gh1/Lift/blob/main/firebase/firestore.rules → **Publish**.
   *(Reglerne sikrer, at hver bruger kun kan se sine egne data, og at ingen kan give sig selv Premium.)*

✅ **Nu virker login og "gem på kontoen"**, så snart Claude har sat din `firebaseConfig` ind. Du kan teste det med det samme (del 9, punkt 1–3).

---

## Del 7 – Betaling: Stripe-udvidelsen (15 min)
Betaling kører via Firebases færdige udvidelse **"Run Payments with Stripe"**. Den kræver Firebases **Blaze-plan** (betal efter forbrug). Små apps ligger typisk inden for de gratis kvoter, men der skal være et kort tilknyttet.

**A. Skift til Blaze**
1. Nederst i venstremenuen står **Spark** → **Upgrade** → **Blaze** → opret/vælg en betalingskonto.
2. Sæt en **budgetadvarsel**, fx 50 kr., så du får en mail, hvis der mod forventning kommer en regning.

**B. Installer udvidelsen**
1. Venstremenuen → **Extensions** (eller *Build → Extensions*) → **Explore extensions** → søg `Run Payments with Stripe` → **Install** → følg trinene.
2. Udfyld:

   | Felt | Værdi |
   |---|---|
   | Cloud Functions deployment location | `europe-west1` (Belgium) |
   | Products and pricing plans collection | `products` |
   | Customer details and subscriptions collection | `customers` |
   | Sync new users to Stripe customers and Cloud Firestore | `Do not sync` |
   | Automatically delete Stripe customer objects | `Auto delete` |
   | Stripe API key with restricted access | din **Secret key** fra https://dashboard.stripe.com/test/apikeys (`sk_test_…`) → **Create secret** |
   | Stripe webhook secret | lad den være tom/standard indtil videre |
   | Øvrige felter | lad standardværdien stå |
3. **Install extension** – det tager 3–5 minutter.

**C. Webhook (Stripe → Firebase)**
1. Åbn udvidelsen i Firebase → fanen **How this extension works**. Find adressen, der ligner
   `https://europe-west1-DIT-PROJEKT.cloudfunctions.net/ext-firestore-stripe-payments-handleWebhookEvents`
2. Stripe → **https://dashboard.stripe.com/test/webhooks** → **Add destination** → vælg disse events:
   `product.created`, `product.updated`, `product.deleted`, `price.created`, `price.updated`, `price.deleted`,
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
   `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   → **Continue** → **Webhook endpoint** → indsæt adressen fra punkt 1 → **Create destination**.
3. Tryk **Reveal** ved **Signing secret** og kopiér (`whsec_…`).
4. Firebase → **Extensions** → Run Payments with Stripe → **Manage** → **Reconfigure extension** → indsæt `whsec_…` i **Stripe webhook secret** → **Save**.

**D. Send Claude dine to Price ID'er**
Stripe → **Product catalog** → LIFT Premium → tryk på hver pris → kopiér ID'et (`price_…`). Send begge (måned og år) til Claude – de er offentlige.

---

## Del 8 – Ryd op i Supabase (2 min)
1. Stripe → **https://dashboard.stripe.com/test/webhooks** → **slet** den gamle webhook, der peger på `…supabase.co/functions/v1/stripe-webhook`. Ellers bliver Stripe ved med at sende til den.
2. Når alt virker: Supabase → dit projekt → **Project Settings** → **General** → **Pause project** (eller *Delete project*).
   *Brugernes data ligger på deres telefoner og uploades til Firebase, første gang de logger ind. Testdata i Supabase flyttes ikke.*

## Del 9 – Test (5 min)
1. Åbn **https://dani-gh1.github.io/Lift/?app&test** på din telefon (`&test` viser betaling, indtil den er slået til for alle).
2. Skriv din e-mail → **Continue** → åbn mailen fra Firebase **på samme telefon** → tryk linket. Du er logget ind.
3. Lav en træning. Tjek i Firebase → **Firestore Database** → `users` → dit id → `items`, at den ligger der.
4. **Premium** → **Start 7-day free trial** → betal med testkortet **4242 4242 4242 4242**, udløb 12/30, CVC 123.
5. Tilbage i appen står der efter få sekunder **You have Premium** ✅. I Firestore: `customers` → dit id → `subscriptions` → *status: trialing*.
6. **Manage subscription** åbner Stripes kundeportal.

**Virker det ikke?**

| Problem | Løsning |
|---|---|
| Ingen login-mail | Tjek spam. Er `dani-gh1.github.io` tilføjet under *Authorized domains* (del 5)? Den gratis Spark-plan har en lav daglig grænse for login-mails – med Blaze er den meget højere. |
| "Payment is not ready yet" | Er udvidelsen installeret i `europe-west1`? Er Price ID'erne sat ind? Se Firestore → `customers` → dit id → `checkout_sessions` – står der et `error`-felt, fortæller det hvad der er galt. |
| Betalt, men ingen Premium | Stripe → Webhooks → din destination → fejler leveringerne? Tjek at *Stripe webhook secret* i udvidelsen er den rigtige `whsec_…`. |
| Linket åbner, men du er ikke logget ind | Åbn linket på samme telefon og i samme browser. Ellers beder appen dig bekræfte din e-mail. |
| "Missing or insufficient permissions" | Reglerne fra del 6 er ikke publiceret. |

## Del 10 – Før rigtige brugere
1. **Stripe live:** slå *Test mode* fra. Opret produkt og priser igen, ny Secret key → i udvidelsen: **Reconfigure** med den nye nøgle. Lav en ny webhook (live) og indsæt dens `whsec_…`. Send Claude de nye Price ID'er.
2. **Bed Claude om** at slå `paymentsLive` og `requireAccount` til.
3. **Jura:** handelsbetingelser og privatlivspolitik ligger i appen. Brugere under 18 kan kræve forældres samtykke for at købe.

---

## Testknapper
Åbn `https://dani-gh1.github.io/Lift/?app&test` for at se testknapperne (Premium til/fra, eksempeldata).

## Når du selv ændrer i filerne
Hæv tallet `?v=` i `index.html` og `CACHE` i `sw.js` (fx `lift-v14` → `lift-v15`), så telefonerne henter den nye version.
