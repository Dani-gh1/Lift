# LIFT – strength training for beginners

Mobile-first web app (PWA) for young beginners (15–22). Ready-made 4-week programs, rest timer, automatic workout log, progress charts. All data is stored locally on the device – no backend.

## Filer
| Fil | Hvad |
|---|---|
| `data.js` | **Øvelser, programmer, opvarmning, priser og indstillinger.** Her tilføjer du nye programmer/øvelser (se forklaringen øverst i filen). |
| `app.js` | Al logik og skærme. |
| `styles.css` | Design. |
| `index.html` | Skal der indlæser filerne. |
| `computer.html` | Viser appen i en telefonramme på computer. |
| `sw.js` | Offline-cache. Hæv `CACHE`-versionen og `?v=`-tallet i `index.html`, når du ændrer filer. |

## Opsætning
Se **SETUP.md** for måling (GoatCounter), venteliste (Tally) og login + betaling (Supabase + Stripe).
Serverkoden ligger i `supabase/` (hver funktion er én fil, der kan kopieres ind i Supabases webeditor).

## Måling (valgfri)
Opret en gratis konto på goatcounter.com og skriv din kode i `CONFIG.goatcounterCode` i `data.js`.
Events: `evt-onboarding-done`, `evt-workout-complete`, `evt-reached-week-2`, `evt-reached-week-4`, `evt-program-complete`, `evt-premium-view`, `evt-premium-click-*`, `evt-trial-click-*`, `evt-waitlist-join`, `evt-backup`, `evt-calendar`.

## Testknapper
Åbn appen med `?app&test` for at se testknapperne.

Kør lokalt: `python3 -m http.server` og åbn http://localhost:8000/?app
