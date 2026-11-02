/* =====================================================================
   LIFT – DATAFIL
   Her kan du ændre indstillinger, øvelser, skabeloner og næringsstoffer
   UDEN at røre resten af koden.

   ØVELSE (i EX):
     nøgle: {
       n:   'Navn der vises'
       m:   muskelgruppe: 'Chest' | 'Back' | 'Legs' | 'Glutes' | 'Shoulders' | 'Arms' | 'Core' | 'Full body'
       t:   'w' = vægt + reps | 'bw' = kun reps (kropsvægt) | 's' = tid i sekunder
       inc: (valgfri) hvor meget vægten øges, når man klarer alle sæt (standard 2.5)
       needs: (valgfri) udstyr – bruges til animationen: ['stang'] | ['haandvaegte'] | ['kettlebell'] | ['elastik'] | ['maskiner']
       a:   (valgfri) animation: squat | push | bench | hinge | press | pike | chestpress | row | invrow | bridge | lunge | plank | pull | swing
       cue: (valgfri) 2–3 korte tekniktrin
     }

   SKABELON (i TEMPLATES): færdige rutiner man kan starte med ét tryk.
     ex: [['øvelses-nøgle', sæt, reps], ...]   (for tid-øvelser er reps = sekunder)
   ===================================================================== */

const CONFIG = {
  appName: 'LIFT',
  currency: 'DKK',
  priceMonth: 49,          // kr./md.
  priceYear: 349,          // kr./år
  trialDays: 7,
  // Privatlivsvenlig måling med GoatCounter. Tom = ingen måling.
  goatcounterCode: 'liftapp',
  // Venteliste (vises indtil betaling er slået til for alle)
  waitlistUrl: 'https://tally.so/r/gbaZlJ',
  // Testknapper i Profil. Vises altid, når appen åbnes med ?app&test
  showTestTools: false,
  // Login, konto-data og betaling (Supabase + Stripe). Begge værdier er offentlige.
  supabaseUrl: 'https://akcqdkekmxfpudicacod.supabase.co',
  supabaseAnonKey: 'sb_publishable_RskGvaF5kH3o-d-UEbFRaA__2AU-Di6',
  // false = BETALING vises kun i testtilstand (?app&test). Login og gem-på-konto virker for alle.
  paymentsLive: false,
  // true = man SKAL oprette konto før appen kan bruges. false = login-skærmen har også "Continue without account".
  // Sæt kun til true, når du har din egen mail-afsender (SMTP) i Supabase – ellers får brugerne ikke login-mailen.
  requireAccount: false,
  // Varedata til stregkode-scanning og søgning (gratis, åben database)
  foodApi: 'https://world.openfoodfacts.org',
};

const MUSCLES = ['Chest','Back','Legs','Glutes','Shoulders','Arms','Core','Full body'];

const EX = {
  // Bryst
  bench:{n:'Bench press',m:'Chest',t:'w',needs:['stang'],a:'bench',cue:['Squeeze your shoulder blades together','Lower the bar slowly to your chest','Press up over your shoulders']},
  db_bench:{n:'Dumbbell bench press',m:'Chest',t:'w',needs:['haandvaegte'],a:'bench',cue:['Weights over your chest','Lower until elbows are about 45° from your body','Press back up']},
  incline_db:{n:'Incline dumbbell press',m:'Chest',t:'w',needs:['haandvaegte'],a:'bench',cue:['Bench at about 30°','Lower to upper chest','Press up and slightly in']},
  chest_fly:{n:'Cable chest fly',m:'Chest',t:'w',needs:['maskiner'],cue:['Slight bend in the elbows','Bring your hands together in front of your chest','Open slowly']},
  pushup:{n:'Push-ups',m:'Chest',t:'bw',a:'push',cue:['Hands slightly wider than shoulders','Body straight like a plank','Too hard? Knees on the floor']},
  dips:{n:'Dips',m:'Chest',t:'bw',cue:['Lean slightly forward','Lower until shoulders are at elbow height','Push back up']},
  band_press:{n:'Band chest press',m:'Chest',t:'bw',needs:['elastik'],a:'chestpress',cue:['Band behind your back','Press your arms forward','Return with control']},
  // Ryg
  deadlift:{n:'Deadlift',m:'Back',t:'w',inc:5,needs:['stang'],a:'hinge',cue:['Bar over mid-foot','Flat back, chest up','Push the floor away and stand tall']},
  row_bb:{n:'Barbell row',m:'Back',t:'w',needs:['stang'],a:'row',cue:['Hips back, flat back','Pull the bar to your belly button','Lower slowly']},
  db_row:{n:'One-arm dumbbell row',m:'Back',t:'w',needs:['haandvaegte'],a:'row',cue:['Hand and knee on a bench','Pull the weight to your hip','Switch sides after the set']},
  latpull:{n:'Lat pulldown',m:'Back',t:'w',needs:['maskiner'],a:'pull',cue:['Wide grip, lean back slightly','Pull the bar to your chest','Straighten your arms fully on the way up']},
  cable_row:{n:'Seated cable row',m:'Back',t:'w',needs:['maskiner'],cue:['Sit tall','Pull the handle to your stomach','Squeeze your shoulder blades']},
  pullup:{n:'Pull-ups',m:'Back',t:'bw',a:'pull',cue:['Hang with straight arms','Pull your chin over the bar','Lower with control']},
  table_row:{n:'Table row',m:'Back',t:'bw',a:'invrow',cue:['Lie under a sturdy table','Keep your body straight','Pull your chest to the edge']},
  band_row:{n:'Band row',m:'Back',t:'bw',needs:['elastik'],a:'row',cue:['Anchor the band at chest height','Pull your elbows back','Release slowly']},
  face_pull:{n:'Face pull',m:'Back',t:'w',needs:['maskiner'],cue:['Rope at face height','Pull towards your forehead','Elbows high and wide']},
  // Ben
  squat_bb:{n:'Barbell squat',m:'Legs',t:'w',needs:['stang'],a:'squat',cue:['Bar on your upper back','Sit down and back – knees follow toes','Down until thighs are level, then up']},
  goblet:{n:'Goblet squat',m:'Legs',t:'w',needs:['haandvaegte'],a:'squat',cue:['Dumbbell close to your chest','Back straight, elbows down','Sit deep and stand up']},
  squat_bw:{n:'Bodyweight squat',m:'Legs',t:'bw',a:'squat',cue:['Feet shoulder-width apart','Sit down and back','Knees follow your toes']},
  legpress:{n:'Leg press',m:'Legs',t:'w',inc:5,needs:['maskiner'],a:'squat',cue:['Feet in the middle of the platform','Lower until knees are about 90°','Press without locking your knees']},
  lunge:{n:'Lunges',m:'Legs',t:'bw',a:'lunge',cue:['Take a long step forward','Lower your back knee towards the floor','Reps are per leg']},
  db_lunge:{n:'Dumbbell lunges',m:'Legs',t:'w',needs:['haandvaegte'],a:'lunge',cue:['Weights at your sides','Long step forward','Reps are per leg']},
  leg_ext:{n:'Leg extension',m:'Legs',t:'w',needs:['maskiner'],cue:['Back against the pad','Straighten your legs','Lower slowly']},
  leg_curl:{n:'Leg curl',m:'Legs',t:'w',needs:['maskiner'],cue:['Pad just above your heels','Curl your heels towards your bum','Lower slowly']},
  calf_raise:{n:'Calf raise',m:'Legs',t:'w',cue:['Stand on the balls of your feet','Rise as high as you can','Lower below the step']},
  // Baller / hofte
  rdl:{n:'Romanian deadlift',m:'Glutes',t:'w',needs:['stang'],a:'hinge',cue:['Slightly bent knees, bar close to legs','Push hips back with a flat back','Stand up by driving hips forward']},
  db_rdl:{n:'Dumbbell Romanian deadlift',m:'Glutes',t:'w',needs:['haandvaegte'],a:'hinge',cue:['Weights in front of your thighs','Hips back, back straight','Drive your hips forward']},
  hip_thrust:{n:'Hip thrust',m:'Glutes',t:'w',needs:['stang'],a:'bridge',cue:['Upper back on a bench','Drive your hips up','Squeeze your glutes at the top']},
  glute_bridge:{n:'Glute bridge',m:'Glutes',t:'bw',a:'bridge',cue:['Feet close to your bum','Push your hips up','Squeeze at the top']},
  kb_swing:{n:'Kettlebell swing',m:'Glutes',t:'w',inc:4,needs:['kettlebell'],a:'swing',cue:['Feet wider than hips','Swing the bell back between your legs','Snap your hips forward']},
  // Skuldre
  ohp:{n:'Overhead press',m:'Shoulders',t:'w',needs:['stang'],a:'press',cue:['Brace abs and glutes','Press the bar straight up','Lower to your chin']},
  db_ohp:{n:'Dumbbell shoulder press',m:'Shoulders',t:'w',needs:['haandvaegte'],a:'press',cue:['Weights at shoulder height','Press up to straight arms','Lower slowly']},
  lat_raise:{n:'Lateral raise',m:'Shoulders',t:'w',inc:1,needs:['haandvaegte'],cue:['Slight bend in your elbows','Raise to shoulder height','Lower slowly']},
  pike_pushup:{n:'Pike push-up',m:'Shoulders',t:'bw',a:'pike',cue:['Hips high like an upside-down V','Lower your head to the floor','Push back up']},
  // Arme
  db_curl:{n:'Dumbbell curl',m:'Arms',t:'w',inc:1,needs:['haandvaegte'],cue:['Elbows close to your body','Curl up without swinging','Lower slowly']},
  bb_curl:{n:'Barbell curl',m:'Arms',t:'w',needs:['stang'],cue:['Elbows still','Curl the bar up','Lower with control']},
  hammer_curl:{n:'Hammer curl',m:'Arms',t:'w',inc:1,needs:['haandvaegte'],cue:['Palms facing each other','Curl up','Lower slowly']},
  triceps_push:{n:'Triceps pushdown',m:'Arms',t:'w',needs:['maskiner'],cue:['Elbows tight to your sides','Push down until arms are straight','Return slowly']},
  skull_crusher:{n:'Skull crusher',m:'Arms',t:'w',needs:['stang'],cue:['Lie on a bench, arms up','Bend elbows to lower bar to forehead','Straighten your arms']},
  // Core
  plank:{n:'Plank',m:'Core',t:'s',inc:5,a:'plank',cue:['Elbows under shoulders','Brace abs and glutes','Body straight, breathe calmly']},
  crunch:{n:'Crunch',m:'Core',t:'bw',cue:['Lie on your back, knees bent','Curl your shoulders off the floor','Lower slowly']},
  leg_raise:{n:'Hanging leg raise',m:'Core',t:'bw',cue:['Hang from a bar','Lift your legs to hip height','Lower without swinging']},
  russian_twist:{n:'Russian twist',m:'Core',t:'bw',cue:['Sit with feet off the floor','Rotate side to side','Reps count both sides']},
  // Hele kroppen
  burpee:{n:'Burpees',m:'Full body',t:'bw',cue:['Squat down, hands on the floor','Jump back to a plank, then forward','Jump up']},
  kb_goblet:{n:'Kettlebell goblet squat',m:'Legs',t:'w',inc:4,needs:['kettlebell'],a:'squat',cue:['Hold the bell at your chest','Sit down deep','Stand up tall']},
};

// Færdige rutiner (skabeloner). Brugeren kan gemme sine egne i appen.
const TEMPLATES = [
  {id:'t_home_a', name:'Home – Full body A', tag:'Beginner · No equipment', ex:[['squat_bw',3,12],['pushup',3,8],['table_row',3,8],['glute_bridge',3,15],['plank',2,30]]},
  {id:'t_home_b', name:'Home – Full body B', tag:'Beginner · No equipment', ex:[['lunge',3,10],['pike_pushup',3,6],['glute_bridge',3,15],['table_row',3,8],['crunch',3,15]]},
  {id:'t_gym_a', name:'Gym – Full body A', tag:'Beginner · Gym', ex:[['legpress',3,10],['db_bench',3,10],['latpull',3,10],['plank',2,30]]},
  {id:'t_gym_b', name:'Gym – Full body B', tag:'Beginner · Gym', ex:[['goblet',3,10],['db_ohp',3,10],['cable_row',3,10],['db_rdl',3,10]]},
  {id:'t_push', name:'Push', tag:'Intermediate · Gym', ex:[['bench',4,6],['incline_db',3,10],['ohp',3,8],['lat_raise',3,12],['triceps_push',3,12]]},
  {id:'t_pull', name:'Pull', tag:'Intermediate · Gym', ex:[['deadlift',3,5],['pullup',3,8],['row_bb',3,8],['face_pull',3,15],['db_curl',3,12]]},
  {id:'t_legs', name:'Legs', tag:'Intermediate · Gym', ex:[['squat_bb',4,6],['rdl',3,8],['legpress',3,12],['leg_curl',3,12],['calf_raise',3,15]]},
  {id:'t_db', name:'Dumbbells only', tag:'Any level · Dumbbells', ex:[['goblet',3,10],['db_bench',3,10],['db_row',3,10],['db_ohp',3,10],['db_curl',3,12]]},
];

// Næringsstoffer. ff = nøgle i Open Food Facts, x = omregning fra deres enhed (gram) til vores enhed.
// ri = dagligt referenceindtag (voksen). Premium viser alle; gratis viser kun kalorier.
const NUTRIENTS = [
  {k:'p',      n:'Protein',        u:'g',  ff:'proteins',      x:1},
  {k:'c',      n:'Carbs',          u:'g',  ff:'carbohydrates', x:1},
  {k:'f',      n:'Fat',            u:'g',  ff:'fat',           x:1},
  {k:'fiber',  n:'Fiber',          u:'g',  ff:'fiber',         x:1,    ri:30},
  {k:'sugar',  n:'Sugar',          u:'g',  ff:'sugars',        x:1,    ri:90},
  {k:'satfat', n:'Saturated fat',  u:'g',  ff:'saturated-fat', x:1,    ri:20},
  {k:'salt',   n:'Salt',           u:'g',  ff:'salt',          x:1,    ri:6},
  {k:'potassium', n:'Potassium',   u:'mg', ff:'potassium',     x:1000, ri:2000},
  {k:'calcium',n:'Calcium',        u:'mg', ff:'calcium',       x:1000, ri:800},
  {k:'iron',   n:'Iron',           u:'mg', ff:'iron',          x:1000, ri:14},
  {k:'magnesium', n:'Magnesium',   u:'mg', ff:'magnesium',     x:1000, ri:375},
  {k:'zinc',   n:'Zinc',           u:'mg', ff:'zinc',          x:1000, ri:10},
  {k:'vitc',   n:'Vitamin C',      u:'mg', ff:'vitamin-c',     x:1000, ri:80},
  {k:'vitd',   n:'Vitamin D',      u:'µg', ff:'vitamin-d',     x:1e6,  ri:5},
  {k:'b12',    n:'Vitamin B12',    u:'µg', ff:'vitamin-b12',   x:1e6,  ri:2.5},
];
const MEALS = ['Breakfast','Lunch','Dinner','Snacks'];

const GOALS = {
  muscle:   {n:'Build muscle',  d:'Gain size and strength', kcal:+250},
  strength: {n:'Get stronger',  d:'Lift heavier weights',   kcal:+150},
  fat:      {n:'Lose fat',      d:'Keep muscle, lose fat',  kcal:-400},
  fit:      {n:'Stay fit',      d:'Feel good and healthy',  kcal:0},
};
const ACTIVITY = [
  {v:1.375, n:'Light',    d:'1–3 workouts a week'},
  {v:1.55,  n:'Moderate', d:'3–5 workouts a week'},
  {v:1.725, n:'High',     d:'6–7 workouts or a physical job'},
];

const ROS = ['Great job!', 'Nice! Another workout in the bank.', 'You get stronger every time.', 'Well fought!', 'That was a good one!'];
