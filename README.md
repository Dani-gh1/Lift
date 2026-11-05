# LIFT – strength training for beginners

Mobile-first web app (PWA) for everyone who trains: workout log that remembers what you lifted last time, routines, calorie tracking with barcode scanning, stats and an optional account that saves your data across devices (Firebase Authentication + Firestore). Premium via Stripe (Firebase-udvidelsen "Run Payments with Stripe").

## Filer
| Fil | Hvad |
|---|---|
| `data.js` | **Øvelser, programmer, opvarmning, priser og indstillinger.** Her tilføjer du nye programmer/øvelser (se forklaringen øverst i filen). |
| `core.js` | Data, synkronisering med Firestore, login (Firebase), betaling, fælles hjælpere. |
| `train.js` | Træningslog (repcount), rutiner, skabeloner, historik, kropsvægt. |
| `food.js` | Kalorier, søgning, stregkode-scanning, makro- og mikronæringsstoffer. |
| `home.js` | Home: overblik over i dag, ugen og mål. |
| `goals.js` | Mål: daglige/ugentlige mål og egne mål (kropsvægt, øvelser) med fremgang. |
| `stats.js` | Statistik (Premium) – vises som fane under Goals. |
| `profile.js` | Opret konto, Premium-tilbud, profil, mål, kropsvægt, backup. |
| `styles.css` | Design. |
| `index.html` | Skal der indlæser filerne. |
| `computer.html` | Viser appen i en telefonramme på computer. |
| `sw.js` | Offline-cache. Hæv `CACHE`-versionen og `?v=`-tallet i `index.html`, når du ændrer filer. |

## Opsætning
Se **SETUP.md** for måling (GoatCounter), venteliste (Tally) og login + database + betaling (Firebase + Stripe).
Sikkerhedsreglerne til Firestore ligger i `firebase/firestore.rules`.

## Måling (valgfri)
Opret en gratis konto på goatcounter.com og skriv din kode i `CONFIG.goatcounterCode` i `data.js`.
Events: `evt-onboarding-done`, `evt-workout-complete`, `evt-reached-week-2`, `evt-reached-week-4`, `evt-program-complete`, `evt-premium-view`, `evt-premium-click-*`, `evt-trial-click-*`, `evt-waitlist-join`, `evt-backup`, `evt-calendar`.

## Testknapper
Åbn appen med `?app&test` for at se testknapperne.

Kør lokalt: `python3 -m http.server` og åbn http://localhost:8000/?app
