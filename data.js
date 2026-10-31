/* =====================================================================
   LIFT – DATAFIL
   Her kan du tilføje/ændre øvelser og programmer UDEN at røre app.js.

   ØVELSE (i EX):
     nøgle: {
       n:     'Navn der vises',
       t:     'w' = med vægt (kg) | 'bw' = kropsvægt (gentagelser) | 's' = tid (sekunder)
       inc:   hvor meget der lægges til ved fremgang (kg, gentagelser eller sekunder)
       start: startvægt / start-gentagelser første gang
       needs: udstyr der kræves, fx ['haandvaegte'] (se UDSTYR) – [] = intet
       alt:   øvelse der bruges i stedet, hvis man mangler udstyret (Premium)
       a:     animation: squat | push | bench | hinge | press | pike | chestpress | row | invrow | bridge | lunge | plank | pull | swing
       vis:   (valgfri) udstyr i animationen: barbell | dumbbell | kb | band | cable | sled | table
       rest:  pause i sekunder efter hvert sæt
       cue:   2-3 korte tekniktrin
       video: (valgfri) sti til EGEN video, fx 'videos/squat.mp4'. Brug kun egne
              eller frit licenserede videoer.
     }

   PROGRAM (i PROGRAMS):
     days:  træningsdage (Dag A, B, C …) der skiftes rundt.
            Hver øvelse skrives som ['øvelses-nøgle', sæt, gentagelser]
            (for tid-øvelser er tallet sekunder)
     weeks: 4 uger. sets/reps lægges til grundtallet den uge (kan være negativt).
   ===================================================================== */

const CONFIG = {
  appName: 'LIFT',
  currency: 'DKK',
  priceMonth: 49,          // kr./md.
  priceYear: 349,          // kr./år
  trialDays: 7,
  weeks: 4,                // programlængde i uger
  // Privatlivsvenlig måling med GoatCounter (gratis): opret en konto på goatcounter.com
  // og skriv din kode her, fx 'lift-app'. Tom = ingen måling.
  goatcounterCode: '',
  // Venteliste: link til fx en gratis Tally- eller Google-formular. Tom = gem kun interesse lokalt.
  waitlistUrl: '',
  // Testknapper i Profil (slå Premium til, eksempeldata). false = skjult for brugere.
  // Du kan stadig se dem ved at åbne appen med ?test, fx .../Lift/?app&test
  showTestTools: false,
  // Betaling og login (Supabase + Stripe). Tom = Premium-siden viser venteliste i stedet.
  // Se SETUP.md for hvordan du får dem. Begge værdier må gerne være offentlige.
  supabaseUrl: '',        // fx 'https://abcdefgh.supabase.co'
  supabaseAnonKey: '',    // "anon public" nøglen fra Supabase
};

const UDSTYR = {stang:'Barbell + rack', baenk:'Bench', haandvaegte:'Dumbbells', kettlebell:'Kettlebell', elastik:'Resistance band', pullupbar:'Pull-up bar', maskiner:'Cables & machines'};

const MAAL = {
  styrke:  {n:'Get stronger',   d:'Lift heavier with fewer reps',  icon:'bolt'},
  form:    {n:'Get fit',        d:'More energy and better fitness', icon:'heart'},
  muskler: {n:'Build muscle',   d:'More reps and more volume',      icon:'dumbbell'},
};

const EX = {
  squat_bw:{n:'Squat',t:'bw',inc:1,start:10,needs:[],a:'squat',rest:60,cue:['Feet shoulder-width apart, arms forward','Sit down and back – like onto a chair','Knees follow your toes, back straight']},
  pushup:{n:'Push-ups',t:'bw',inc:1,start:6,needs:[],a:'push',rest:60,cue:['Hands slightly wider than your shoulders','Keep your body straight like a plank','Too hard? Put your knees on the floor']},
  table_row:{n:'Table row',t:'bw',inc:1,start:6,needs:[],a:'invrow',rest:60,cue:['Lie under a sturdy table and grab the edge','Keep your body straight','Pull your chest up towards the edge']},
  glute_bridge:{n:'Glute bridge',t:'bw',inc:1,start:12,needs:[],a:'bridge',rest:45,cue:['Lie on your back, feet close to your bum','Push your hips up into a straight line','Squeeze your glutes at the top']},
  lunge:{n:'Lunges',t:'bw',inc:1,start:8,needs:[],a:'lunge',rest:60,cue:['Take a long step forward','Lower your back knee towards the floor','Reps are per leg']},
  pike_pushup:{n:'Pike push-up',t:'bw',inc:1,start:5,needs:[],a:'pike',rest:60,cue:['Hips high – body like an upside-down V','Bend your arms and lower your head to the floor','Push back up']},
  plank:{n:'Plank',t:'s',inc:5,start:20,needs:[],a:'plank',rest:45,cue:['Elbows under your shoulders','Brace your abs and glutes','Keep your body straight – breathe calmly']},
  squat_bb:{n:'Barbell squat',t:'w',inc:2.5,start:20,needs:['stang'],alt:'goblet',a:'squat',rest:120,cue:['The bar rests on your upper back','Sit down and back – knees follow your toes','Go down until your thighs are level, then push up']},
  goblet:{n:'Goblet squat',t:'w',inc:2.5,start:8,needs:['haandvaegte'],alt:'squat_bw',a:'squat',rest:90,cue:['Hold the dumbbell close to your chest','Back straight, elbows pointing down','Sit deep and stand up']},
  bench:{n:'Bench press',t:'w',inc:2.5,start:20,needs:['stang','baenk'],alt:'db_bench',a:'bench',rest:120,cue:['Squeeze your shoulder blades together','Lower the bar slowly to your chest','Press up over your shoulders']},
  db_bench:{n:'Dumbbell chest press',t:'w',inc:2.5,start:8,needs:['haandvaegte'],alt:'pushup',a:'bench',rest:90,cue:['Lie on a bench or the floor, weights over your chest','Lower until elbows are about 45° from your body','Press back up']},
  row_bb:{n:'Barbell row',t:'w',inc:2.5,start:20,needs:['stang'],alt:'db_row',a:'row',rest:90,cue:['Hips back, flat back','Pull the bar to your belly button','Lower slowly']},
  db_row:{n:'One-arm row',t:'w',inc:2.5,start:8,needs:['haandvaegte'],alt:'table_row',a:'row',rest:75,cue:['Support your hand and knee on a bench','Pull the weight up towards your hip','Switch sides after the set']},
  ohp:{n:'Barbell overhead press',t:'w',inc:2.5,start:20,needs:['stang'],alt:'db_ohp',a:'press',rest:90,cue:['Stand firm, brace abs and glutes','Press the bar straight up','Lower it to your chin']},
  db_ohp:{n:'Dumbbell shoulder press',t:'w',inc:2.5,start:6,needs:['haandvaegte'],alt:'pike_pushup',a:'press',rest:75,cue:['Weights at shoulder height','Press up until your arms are straight','Lower slowly']},
  rdl:{n:'Romanian deadlift',t:'w',inc:2.5,start:30,needs:['stang'],alt:'db_rdl',a:'hinge',rest:120,cue:['Slightly bent knees, bar close to your legs','Push your hips back with a straight back','Stop when you feel the back of your thighs']},
  db_rdl:{n:'Dumbbell Romanian deadlift',t:'w',inc:2.5,start:10,needs:['haandvaegte'],alt:'glute_bridge',a:'hinge',rest:90,cue:['Weights in front of your thighs','Hips back, back straight','Stand up by pushing your hips forward']},
  latpull:{n:'Lat pulldown',t:'w',inc:2.5,start:25,needs:['maskiner'],alt:'table_row',a:'pull',rest:90,cue:['Wide grip, lean back slightly','Pull the bar to your chest','Fully straighten your arms on the way up']},
  legpress:{n:'Leg press',t:'w',inc:5,start:40,needs:['maskiner'],alt:'goblet',a:'squat',rest:90,cue:['Feet in the middle of the platform','Lower until your knees are about 90°','Press up without locking your knees']},
  kb_swing:{n:'Kettlebell swing',t:'w',inc:4,start:12,needs:['kettlebell'],alt:'glute_bridge',a:'swing',rest:75,cue:['Feet slightly wider than your hips','Swing the bell back between your legs','Snap your hips forward – your arms are just ropes']},
  kb_goblet:{n:'Kettlebell goblet squat',t:'w',inc:4,start:8,needs:['kettlebell'],alt:'squat_bw',a:'squat',rest:75,cue:['Hold the bell in front of your chest','Sit down deep','Stand up with a straight back']},
  band_row:{n:'Band row',t:'bw',inc:1,start:12,needs:['elastik'],alt:'table_row',a:'row',rest:60,cue:['Anchor the band at chest height','Pull your elbows back','Release slowly']},
  band_press:{n:'Band chest press',t:'bw',inc:1,start:12,needs:['elastik'],alt:'pushup',a:'chestpress',rest:60,cue:['Band behind your back','Press your arms forward','Return with control']},
};

// Opvarmning og nedkøling (bruges i alle programmer)
const OPVARMNING = [
  {n:'Jog or march on the spot', sek:60},
  {n:'Arm circles forwards and backwards', sek:30},
  {n:'Hip circles', sek:30},
  {n:'10 slow squats', sek:45},
  {n:'10 push-ups against a wall or table', sek:45},
];
const NEDKOELING = [
  {n:'Front thigh stretch (30 sec per leg)', sek:60},
  {n:'Back thigh stretch', sek:30},
  {n:'Chest stretch in a doorway', sek:30},
  {n:'Slow, deep breaths', sek:30},
];

const PROGRAMS = [
  {id:'hjem', name:'Get Started', place:'Home or gym', free:true, level:'Level 1', equip:'No equipment', minutes:30,
   desc:'Your first program. Bodyweight only, so you can train anywhere. You learn the key movements and get stronger week by week.',
   weeks:[
     {focus:'Learn the moves', tip:'It should feel easy. Focus on doing it right.', sets:-1, reps:0},
     {focus:'Build the habit', tip:'One more set. Stick to your training days.', sets:0, reps:0},
     {focus:'A bit more', tip:'2 more reps in every set. You can do it!', sets:0, reps:2},
     {focus:'Test yourself', tip:'Final week – give it everything and beat your records.', sets:0, reps:3},
   ],
   days:[
     {n:'Day A', ex:[['squat_bw',3,10],['pushup',3,6],['table_row',3,6],['glute_bridge',3,12],['plank',2,20]]},
     {n:'Day B', ex:[['lunge',3,8],['pike_pushup',3,5],['glute_bridge',3,12],['table_row',3,6],['plank',2,25]]},
     {n:'Day C', ex:[['squat_bw',3,12],['pushup',3,6],['lunge',3,8],['table_row',3,8],['plank',2,20]]},
   ]},
  {id:'maskine', name:'Gym Start', place:'Gym', level:'Level 1', equip:'Machines + dumbbells', minutes:40,
   desc:'Safe and simple: machines and dumbbells, so you can train at the gym without a partner.',
   weeks:[
     {focus:'Find your starting weights', tip:'Pick a weight where the last 2 reps are hard.', sets:-1, reps:0},
     {focus:'Build the habit', tip:'Hit all your reps and we increase the weight.', sets:0, reps:0},
     {focus:'More weight', tip:'Follow the suggestions – a little heavier each time.', sets:0, reps:0},
     {focus:'Beat your records', tip:'Final week. Go for new records!', sets:0, reps:0},
   ],
   days:[
     {n:'Day A', ex:[['legpress',3,10],['db_bench',3,10],['latpull',3,10],['plank',2,30]]},
     {n:'Day B', ex:[['goblet',3,10],['db_ohp',3,10],['db_row',3,10],['db_rdl',3,10]]},
     {n:'Day C', ex:[['legpress',3,12],['db_bench',3,12],['latpull',3,12],['glute_bridge',3,15]]},
   ]},
  {id:'gym', name:'Gym Basics', place:'Gym', level:'Level 2', equip:'Barbell, bench, machines', minutes:50,
   desc:'The next level: the classic barbell lifts. Get stronger fast.',
   weeks:[
     {focus:'Learn the technique', tip:'Start with the empty bar (20 kg) and learn the movement.', sets:-1, reps:0},
     {focus:'Build up', tip:'Hit all your reps and we add 2.5 kg.', sets:0, reps:0},
     {focus:'Heavier', tip:'Follow the suggestions – technique first.', sets:0, reps:0},
     {focus:'Beat your records', tip:'Final week. Go for new records!', sets:0, reps:0},
   ],
   days:[
     {n:'Day A', ex:[['squat_bb',3,5],['bench',3,5],['row_bb',3,8],['plank',3,30]]},
     {n:'Day B', ex:[['rdl',3,8],['ohp',3,5],['latpull',3,10],['lunge',3,10]]},
     {n:'Day C', ex:[['squat_bb',3,5],['db_bench',3,10],['row_bb',3,8],['latpull',3,10]]},
   ]},
  {id:'haandvaegt', name:'Dumbbells at Home', place:'Home', level:'Level 2', equip:'A pair of dumbbells', minutes:40,
   desc:'When bodyweight gets too easy: build strength at home with a pair of dumbbells.',
   weeks:[
     {focus:'Find your starting weights', tip:'Pick a weight where the last 2 reps are hard.', sets:-1, reps:0},
     {focus:'Build the habit', tip:'Hit all your reps and we increase the weight.', sets:0, reps:0},
     {focus:'More weight', tip:'A little heavier each time.', sets:0, reps:0},
     {focus:'Beat your records', tip:'Final week. Go for new records!', sets:0, reps:0},
   ],
   days:[
     {n:'Day A', ex:[['goblet',3,10],['db_bench',3,10],['db_row',3,10],['plank',3,30]]},
     {n:'Day B', ex:[['db_rdl',3,10],['db_ohp',3,10],['lunge',3,10],['db_row',3,10]]},
     {n:'Day C', ex:[['goblet',3,12],['db_bench',3,8],['db_rdl',3,10],['glute_bridge',3,15]]},
   ]},
  {id:'kb', name:'Kettlebell & Band', place:'Home', level:'Level 2', equip:'Kettlebell + band', minutes:35,
   desc:'Compact and effective. Strength and cardio in one – needs very little space.',
   weeks:[
     {focus:'Learn the moves', tip:'The swing is a hip movement – not an arm movement.', sets:-1, reps:0},
     {focus:'Build the habit', tip:'Keep a steady pace.', sets:0, reps:0},
     {focus:'More work', tip:'Follow the suggestions.', sets:0, reps:2},
     {focus:'Test yourself', tip:'Beat your records!', sets:0, reps:3},
   ],
   days:[
     {n:'Day A', ex:[['kb_goblet',3,10],['band_press',3,12],['band_row',3,12],['kb_swing',3,15]]},
     {n:'Day B', ex:[['kb_swing',4,12],['pushup',3,8],['lunge',3,10],['band_row',3,12]]},
     {n:'Day C', ex:[['kb_goblet',3,10],['band_press',3,15],['glute_bridge',3,15],['plank',3,40]]},
   ]},
];

const ROS = ['Great job!', 'Nice! Another workout in the bank.', 'You get stronger every time.', 'Well fought – be proud of yourself.', 'That was a good one!'];
