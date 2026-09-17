export interface ClassicalRemedy {
  name: string;
  commonName: string;
  potency: string;
  dosage: string;
  keynotes: string[];
  materiaMedicaNotes: string;
  modalities: {
    worse: string;
    better: string;
  };
  aliases: string[];
}

export interface PatentFormulation {
  name: string;
  brand: string;
  company: string;
  country: string;
  bottleSize: string;
  indications: string;
  dosage: string;
  mrp: number;
  aliases: string[];
}

export interface ClinicalCondition {
  id: string;
  nameEn: string;
  nameBn: string;
  chipLabel: string;
  pathology: string;
  miasm: string;
  keywords: string[];
  typicalPresentation: string;
  classicalRemedies: ClassicalRemedy[];
  patentFormulations: PatentFormulation[];
  dietAndRegimen: string;
  warningNotes: string;
}

export const CLINICAL_REPERTORY_DATABASE: ClinicalCondition[] = [
  {
    id: 'kidney-stone',
    nameEn: 'Kidney Stone / Renal Calculi',
    nameBn: 'মূত্রপাথুরী ও প্রস্রাবে পাথর',
    chipLabel: 'Kidney Stone / মূত্রপাথুরী',
    pathology: 'Nephrolithiasis, Ureteric Calculi & Urinary Tract Crystal Deposition',
    miasm: 'Sycotic Diathesis with Lithic Acid Dysplasia',
    typicalPresentation: 'Kidney stone right flank pain radiating down ureter to groin, red gravel and burning micturition',
    keywords: [
      'kidney stone', 'renal stone', 'calculi', 'calculus', 'nephrolithiasis', 'ureter', 'ureteric stone',
      'stone', 'gravel', 'sand in urine', 'renal colic', 'kidney pain', 'burning micturition', 'dysuria',
      'flank pain', 'back pain to groin', 'urine burning', 'lithiasis',
      // Bengali
      'মূত্রপাথুরী', 'পাথুরী', 'প্রস্রাবে পাথর', 'কিডনি পাথর', 'কিডনিতে পাথর', 'কিডনি স্টোন',
      'প্রস্রাবে জ্বালা', 'কোমরে তীব্র ব্যথা', 'প্রস্রাবে রক্ত', 'প্রস্রাবে লাল বালি'
    ],
    classicalRemedies: [
      {
        name: 'Berberis Vulgaris',
        commonName: 'Barberry',
        potency: 'Q / 30C',
        dosage: '10-15 drops in 1/4 cup warm water, 3 times daily',
        keynotes: [
          'Radiating, tearing, bubbling, stinging pains shooting from kidneys radiating downward to bladder and urethra',
          'Urine thick, turbid with heavy red sand and crystalline uric acid sediment',
          'Characteristic bubbling sensation or bruised soreness in renal region, worse on jarring'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Primary affinity for kidneys, ureters and bladder. Radiating pains from one point to all directions. Aggravated by motion, jar, standing; ameliorated by rest.',
        modalities: {
          worse: 'Motion, jarring, standing, pressure on lumbar region',
          better: 'Rest, warm fomentation, quiet lying down'
        },
        aliases: ['berberis', 'berberis vulgaris', 'berb', 'barberry']
      },
      {
        name: 'Lycopodium Clavatum',
        commonName: 'Club Moss',
        potency: '200C',
        dosage: '4 pills once daily in the evening',
        keynotes: [
          'Predominantly right-sided renal calculi; severe right flank pain extending along right ureter to bladder',
          'Red sand or reddish-brick dust sediment in urine; child cries before urinating',
          'Symptoms markedly aggravated between 4:00 PM and 8:00 PM; excessive abdominal flatulence'
        ],
        materiaMedicaNotes: 'Kent Repertory: Right-sided remedy for lithic diathesis. Renal colic with backache relieved after passing urine. Deep seated sycotic miasm.',
        modalities: {
          worse: '4 PM to 8 PM, right side, warm enclosed rooms, pressure of clothes',
          better: 'Warm drinks, cold air, moving about, passing flatus or urine'
        },
        aliases: ['lycopodium', 'lycopodium clavatum', 'lyco']
      },
      {
        name: 'Cantharis Vesicatoria',
        commonName: 'Spanish Fly',
        potency: '30C / 200C',
        dosage: '4 drops in 2 spoons water every 3-4 hours during acute burning',
        keynotes: [
          'Violent, paroxysmal cutting and burning pains in urethra before, during, and after urination',
          'Intense vesical tenesmus; constant intolerable urge to urinate, passed drop by drop with scalding agony',
          'Urine passed in tiny quantities, often blood-streaked or containing shreds of mucous membrane'
        ],
        materiaMedicaNotes: 'Boericke: Unsurpassed in acute cystitis and intense irritation of bladder. Raw burning pain as if scalded with boiling water.',
        modalities: {
          worse: 'Urinating, touch, drinking cold water, coffee',
          better: 'Rest, gentle warmth, lying quietly'
        },
        aliases: ['cantharis', 'cantharis vesicatoria', 'canth']
      },
      {
        name: 'Sarsaparilla Officinalis',
        commonName: 'Wild Licorice',
        potency: 'Q / 30C',
        dosage: '10 drops in 1/4 cup water twice daily',
        keynotes: [
          'Severe unbearable agonizing pain at the conclusion of urination; patient screams when finishing',
          'Passage of white gravel or sand in urine, with extreme tenderness in renal area',
          'Can only pass urine freely while standing erect; dribbles when sitting'
        ],
        materiaMedicaNotes: 'Kent: The hallmark keynote is agonizing pain at the close of micturition. Indispensable for renal sand and gravel in children and elderly.',
        modalities: {
          worse: 'End of urination, sitting down, cold damp weather',
          better: 'Standing erect, warm dry room'
        },
        aliases: ['sarsaparilla', 'sarsa', 'sarsaparilla officinalis']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Calculi Aid Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Disintegrates and expels renal and ureteric calculi, relieves severe renal colic, dysuria and burning micturition.',
        dosage: '10-15 drops in 1/4 cup lukewarm water 3 times daily; in acute colic every 20-30 minutes.',
        mrp: 165,
        aliases: ['calculi aid', 'bakson calculi aid', 'b16', 'b-16', 'bakson b16']
      },
      {
        name: 'SBL Clearstone Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Clinically proven herbal-homeopathic drops that dissolve and expel kidney & ureteric stones; relieves dysuria, gravel & burning.',
        dosage: '10-15 drops in 1/4 cup water 3 times a day.',
        mrp: 160,
        aliases: ['clearstone', 'sbl clearstone', 'clear stone']
      },
      {
        name: 'Dr. Reckeweg R27 (Renal Calculi)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Renal calculi, gravel, kidney colic, sharp stabbing pains in the kidneys radiating into bladder.',
        dosage: '10-15 drops in water 3-4 times daily; during acute colic, every 15-30 minutes.',
        mrp: 310,
        aliases: ['r27', 'r-27', 'reckeweg 27', 'dr reckeweg r27', 'r 27']
      },
      {
        name: 'Adel 22 (Renelix Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'German biological drops for kidney detox, urinary tract infections, micro-calculi and renal colic spasms.',
        dosage: '15-20 drops in 1/4 cup water 3 times daily.',
        mrp: 335,
        aliases: ['adel 22', 'adel-22', 'renelix', 'adel renelix']
      },
      {
        name: 'Wheezal WL-14 (Renal Calculi Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Dissolves and expels oxalate and phosphate calculi, relieves violent agonizing spasmodic backache.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 170,
        aliases: ['wl-14', 'wl 14', 'wheezal wl 14', 'wheezal wl-14', 'renal calculi']
      },
      {
        name: 'Schwabe Berberis Pentarkan Drops',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '30 ml Drops',
        indications: 'WSG German proprietary formulation for renal calculi, hyperuricemia, lower back pain and uric acid diathesis.',
        dosage: '10-15 drops 3 times daily before meals.',
        mrp: 220,
        aliases: ['berberis pentarkan', 'pentarkan', 'schwabe berberis']
      },
      {
        name: 'Allen A56 Renal Calculi Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Acute nephrolithiasis, sharp piercing flank pain, urinary tract gravel, relieves painful spasms of the ureter.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a56', 'a56', 'allen renal']
      },
      {
        name: 'Medisynth Renal Forte Drops',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Aids in spontaneous expulsion of small to medium renal calculi, relieves dysuria, hematuria and gravel.',
        dosage: '10-15 drops in 1/4 cup water 3 times daily.',
        mrp: 180,
        aliases: ['renal forte', 'medisynth renal', 'aquifolium']
      }
    ],
    dietAndRegimen: 'Drink 3 to 4 liters of filtered water daily. Consume barley water and tender coconut water. Strictly avoid tomatoes, spinach, beetroots, red meat, excessive calcium supplements, and high-oxalate foods.',
    warningNotes: 'Sonography (USG KUB) recommended to evaluate exact calculus size and location. If stone exceeds 9mm or causes hydronephrosis, continuous medical supervision is required.'
  },
  {
    id: 'prostate-bph',
    nameEn: 'Prostate Problem / BPH / Prostatitis',
    nameBn: 'প্রস্টেট বৃদ্ধি ও প্রস্রাব আটকে যাওয়া',
    chipLabel: 'Prostate & BPH / প্রস্টেট বৃদ্ধি',
    pathology: 'Benign Prostatic Hyperplasia (BPH), Prostatitis, Bladder Outlet Obstruction',
    miasm: 'Sycotic Hypertrophy with Senile Degenerative Diathesis',
    typicalPresentation: 'Enlarged prostate, hesitant weak stream, nocturnal frequency, post-void dribbling and urinary urgency',
    keywords: [
      'prostate', 'bph', 'prostatitis', 'prostate enlargement', 'enlarged prostate', 'retention of urine',
      'hesitancy', 'weak stream', 'dribbling', 'nocturia', 'urinary urgency', 'straining to urinate',
      'bladder obstruction', 'prostate hypertrophy', 'perineal pain',
      // Bengali
      'প্রস্টেট', 'প্রস্টেট বৃদ্ধি', 'প্রস্রাব আটকে যাওয়া', 'প্রস্রাব কম হওয়া', 'ফোঁটা ফোঁটা প্রস্রাব',
      'রাতে ঘন ঘন প্রস্রাব', 'প্রস্টেট সমস্যা', 'প্রস্রাবে বেগ না আসা', 'প্রস্রাবের চাপ'
    ],
    classicalRemedies: [
      {
        name: 'Sabal Serrulata',
        commonName: 'Saw Palmetto',
        potency: 'Q (Mother Tincture) / 30C',
        dosage: '15-20 drops in 1/4 cup warm water, 3 times daily',
        keynotes: [
          'Premier organ-specific remedy for benign prostatic hypertrophy in elderly men',
          'Constant desire to urinate at night; difficult start, painful dribbling, sense of weight in perineum',
          'Enlarged, boggy prostate gland with loss of sexual vitality and testicular shrinkage'
        ],
        materiaMedicaNotes: 'Boericke: Sabal has a well-earned reputation in prostatic enlargement and urinary difficulties of elderly men. Relieves bladder irritability and tenesmus.',
        modalities: {
          worse: 'Cold damp air, night, sitting prolonged on hard seats',
          better: 'Warmth, passing urine, gentle walking'
        },
        aliases: ['sabal', 'sabal serrulata', 'saw palmetto']
      },
      {
        name: 'Thuja Occidentalis',
        commonName: 'Arbor Vitae / Tree of Life',
        potency: '200C',
        dosage: '4 pills once weekly or 3 doses on alternate nights',
        keynotes: [
          'Sycotic miasmatic foundation of benign prostatic hyperplasia and urinary tract hypertrophy',
          'Interrupted, split, or forked urinary stream; severe cutting in urethra during and after micturition',
          'Sensation as if urine were trickling down urethra drop by drop constantly'
        ],
        materiaMedicaNotes: 'Kent: The greatest sycotic antipsoric. Prostatic hypertrophy with history of suppressed gonorrhoea or warts. Modality: Worse 3 AM and cold damp.',
        modalities: {
          worse: '3:00 AM, cold damp weather, vaccination, fatty food',
          better: 'Warm dry air, drawing legs up, warmth'
        },
        aliases: ['thuja', 'thuja occidentalis']
      },
      {
        name: 'Conium Maculatum',
        commonName: 'Poison Hemlock',
        potency: '200C',
        dosage: '4 pills once every 3 days at night',
        keynotes: [
          'Hard, indurated, stone-like enlargement of prostate gland in elderly men',
          'Characteristic intermittent urinary flow: stream starts, stops, starts again before bladder empties',
          'Dribbling in old men with vertigo worse on lying down or turning head'
        ],
        materiaMedicaNotes: 'Boericke: Induration and stony hardness of glandular structures. Interrupted urine stream is an infallible keynote for Conium.',
        modalities: {
          worse: 'Lying down, turning over in bed, celibacy, cold',
          better: 'Letting limbs hang down, darkness, fasting'
        },
        aliases: ['conium', 'conium maculatum']
      },
      {
        name: 'Baryta Carbonica',
        commonName: 'Barium Carbonate',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Hypertrophy and induration of prostate in senile individuals with arterial sclerosis',
          'Urgent nocturnal calls; constant heavy dragging pressure in perineum and rectum',
          'General mental and physical sluggishness, chilly patient with swollen glands'
        ],
        materiaMedicaNotes: 'Kent: In senile enlargement of the prostate, Baryta Carb stands alongside Sabal and Conium for degenerative sycotic hypertrophy.',
        modalities: {
          worse: 'Cold air, washing head, thinking of symptoms',
          better: 'Warmth, walking in open air'
        },
        aliases: ['baryta carb', 'baryta carbonica']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Prost Aid Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves symptoms of benign prostatic hypertrophy (BPH): weak stream, hesitant urination, post-void dribbling and urgency.',
        dosage: '10-15 drops in lukewarm water 3 times daily.',
        mrp: 175,
        aliases: ['prost aid', 'bakson prost aid', 'b34', 'b-34', 'bakson b34']
      },
      {
        name: 'SBL Prostonum Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Clinically indicated for enlarged prostate: reduces frequency, urgency, hesitant stream, pain and dysuria.',
        dosage: '10-15 drops in 1/4 cup water 3 times a day.',
        mrp: 165,
        aliases: ['prostonum', 'sbl prostonum']
      },
      {
        name: 'Dr. Reckeweg R25 (Prostate Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic prostatitis, benign prostatic hypertrophy (BPH), painful urination, post-void dribbling.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r25', 'r-25', 'reckeweg 25', 'dr reckeweg r25', 'r 25']
      },
      {
        name: 'Adel 21 (Proscat Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'German biological patent for benign prostate enlargement, resolves glandular congestion and relieves urinary urgency.',
        dosage: '15-20 drops in 1/4 cup water 3-4 times daily.',
        mrp: 335,
        aliases: ['adel 21', 'adel-21', 'proscat', 'adel proscat']
      },
      {
        name: 'Wheezal WL-30 (Prostate Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Indicated for enlargement of prostate gland, frequent nocturnal urging, painful interrupted flow.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 170,
        aliases: ['wl-30', 'wl 30', 'wheezal wl 30', 'wheezal wl-30']
      },
      {
        name: 'Schwabe Sabal Pentarkan Drops',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '30 ml Drops',
        indications: 'WSG German formulation for functional urinary disturbances in BPH, reduces bladder irritability.',
        dosage: '10-15 drops 3 times daily before meals.',
        mrp: 220,
        aliases: ['sabal pentarkan', 'pentarkan', 'schwabe sabal']
      },
      {
        name: 'Allen A44 Prostate Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Enlarged prostate gland, frequent nocturnal calls, hesitant interrupted flow, dribbling.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a44', 'a44', 'allen prostate']
      },
      {
        name: 'Medisynth Sabal Forte Drops',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Effective formulation for enlarged prostate, painful straining, nocturnal enuresis and dribbling.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 180,
        aliases: ['sabal forte', 'medisynth sabal', 'prostate forte']
      }
    ],
    dietAndRegimen: 'Avoid retaining urine when urge arises. Reduce fluid intake 2 hours before bedtime. Avoid alcohol, caffeine, and cold exposure. Perform daily pelvic floor (Kegel) exercises and sitz baths.',
    warningNotes: 'Monitor PSA (Prostate Specific Antigen) levels regularly. In case of acute complete urinary retention, immediate medical catheterization is imperative.'
  },
  {
    id: 'abdominal-colic',
    nameEn: 'Abdominal Colic / Stomach Spasm',
    nameBn: 'পেটে তীব্র কলিক ব্যথা ও খিল ধরা যন্ত্রণা',
    chipLabel: 'Abdominal Colic / পেটে তীব্র ব্যথা',
    pathology: 'Gastrointestinal Spasms, Enteralgia, Spastic Colon, Flatulent Colic',
    miasm: 'Psoric Hypersensitivity with Spastic Neuro-Muscular Excitation',
    typicalPresentation: 'Agonizing cutting griping abdominal cramps relieved by bending double and pressing hard into abdomen',
    keywords: [
      'colic', 'abdominal colic', 'stomach pain', 'stomach spasm', 'belly pain', 'cramps', 'cramping pain',
      'griping', 'intestinal colic', 'spastic colon', 'gas pain', 'flatulent colic', 'doubling up',
      // Bengali
      'পেটে ব্যথা', 'পেটে কলিক', 'খিল ধরা', 'পেট কামড়ানো', 'পেটে তীব্র যন্ত্রণা', 'পেট ফাঁপা',
      'কোঁকড়ানো ব্যথা', 'পেট মোচড়ানো', 'পেটে গ্যাস'
    ],
    classicalRemedies: [
      {
        name: 'Colocynthis',
        commonName: 'Bitter Apple',
        potency: '30C / 200C',
        dosage: '4 drops in spoon of warm water every 20-30 minutes during acute paroxysms',
        keynotes: [
          'Agonizing, cutting, griping spasmodic colic causing the patient to bend double and press firmly into abdomen',
          'Pains are violent, intermittent, and often brought on by emotional indignation, anger, or vexation',
          'Marked relief obtained by hard external pressure, heat, and bending completely double'
        ],
        materiaMedicaNotes: 'Boericke: Produces violent neuralgic pain in the abdominal nerve plexus. Keynote modality: Doubling up and hard pressure brings relief.',
        modalities: {
          worse: 'Anger, standing upright, gentle touch, eating or drinking',
          better: 'Doubling completely double, hard firm pressure, warmth, passing flatus'
        },
        aliases: ['colocynth', 'colocynthis', 'coloc']
      },
      {
        name: 'Magnesia Phosphorica',
        commonName: 'Phosphate of Magnesia',
        potency: '6X / 30C',
        dosage: '4 tablets dissolved in a cup of hot water, sipped frequently',
        keynotes: [
          'Chief homeopathic anti-spasmodic remedy for lightning-like shooting, cramping neuralgic pains',
          'Rapidly relieved by warm drinks, hot applications, and firm pressure',
          'Flatulent colic of infants and adults with painful abdomen; must loosen clothes'
        ],
        materiaMedicaNotes: 'Kent: The great analgesic and antispasmodic biochemic remedy. Action is prompt when administered in hot water. Worse from cold, better from heat.',
        modalities: {
          worse: 'Cold air, cold water, uncovering, right side',
          better: 'Hot applications, warmth of bed, firm pressure, bending double'
        },
        aliases: ['mag phos', 'magnesia phos', 'magnesia phosphorica']
      },
      {
        name: 'Nux Vomica',
        commonName: 'Poison Nut',
        potency: '30C / 200C',
        dosage: '4 pills at bedtime or twice daily',
        keynotes: [
          'Colic from rich spicy food, sedentary habits, alcohol, coffee, or pharmaceutical drug abuse',
          'Griping colic with ineffectual urging to pass stool; temporary relief following bowel evacuation',
          'Spasmodic contraction of stomach, irritability, chilly patient'
        ],
        materiaMedicaNotes: 'Kent: The polychrest for modern sedentary lifestyle. Fits of colic accompanied by nausea, constipation, and constant fruitless urge to stool.',
        modalities: {
          worse: 'Morning, cold air, mental exertion, spices, stimulants',
          better: 'Warm drinks, resting quietly, warmth, momentary relief after stool'
        },
        aliases: ['nux vomica', 'nux vom', 'nux']
      },
      {
        name: 'Carbo Vegetabilis',
        commonName: 'Vegetable Charcoal',
        potency: '30C',
        dosage: '4 pills twice daily before meals',
        keynotes: [
          'Great flatulent colic with enormous distension of upper abdomen; feels like a drum',
          'Patient craves to be fanned constantly with cool air; sluggish digestion',
          'Temporary relief experienced only after copious upward eructations or downward flatus'
        ],
        materiaMedicaNotes: 'Boericke: The "corpse reviver". Disintegration of digestive power, excessive flatulence with dyspnoea. Modality: Better from being fanned.',
        modalities: {
          worse: 'Rich fatty foods, evening, lying down flat',
          better: 'Eructations (belching), passing flatus, being fanned'
        },
        aliases: ['carbo veg', 'carbo vegetabilis', 'carbo']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Colic Aid Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Rapid relief from flatulent colic, intestinal spasms, griping abdominal pain and bloating.',
        dosage: '10-15 drops in warm water every 30 minutes in acute colic; 3 times daily normally.',
        mrp: 155,
        aliases: ['colic aid', 'bakson colic aid', 'b37', 'bakson b37']
      },
      {
        name: 'Dr. Reckeweg R37 (Colinteston Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Intestinal colic, spastic colon, flatulent colic, bilious colic, painful gastrointestinal cramps.',
        dosage: '10-15 drops in a little warm water every 15-30 minutes during acute attack.',
        mrp: 310,
        aliases: ['r37', 'r-37', 'colinteston', 'reckeweg 37', 'dr reckeweg r37']
      },
      {
        name: 'SBL Colic Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Immediate soothing relief from spasmodic abdominal colic, intestinal wind, flatulence & bloating.',
        dosage: '10-15 drops in warm water every 30 minutes until relieved.',
        mrp: 155,
        aliases: ['sbl colic', 'sbl colic drops', 'colic drops']
      },
      {
        name: 'Adel 19 (Mellistren Spasm Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'German biological anti-spasmodic for visceral cramps, intestinal colic and gastrointestinal spasms.',
        dosage: '15-20 drops in warm water 3 times daily.',
        mrp: 335,
        aliases: ['adel 19', 'mellistren', 'adel-19']
      },
      {
        name: 'Wheezal WL-9 (Cramps & Colic Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves agonizing griping colic, muscular cramps, spastic abdomen and wind pain.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 170,
        aliases: ['wl-9', 'wl 9', 'wheezal wl 9']
      },
      {
        name: 'Medisynth Colikid Drops',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Safe and fast relief from infant and adult colic, spasmodic intestinal cramps and belching.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 160,
        aliases: ['colikid', 'medisynth colic']
      },
      {
        name: 'Schwabe Magnesia Pentarkan Drops',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '30 ml Drops',
        indications: 'German anti-spasmodic formula for lightning-like cramps, intestinal spasms and gastrointestinal neuralgia.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 215,
        aliases: ['magnesia pentarkan', 'schwabe mag phos', 'colikind']
      },
      {
        name: 'Allen A10 Colic Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Effective for acute spasmodic and flatulent colic with cutting intestinal pains.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a10', 'a10', 'allen colic']
      }
    ],
    dietAndRegimen: 'Apply hot water bag fomentation over the abdomen. Sip warm water or ginger tea. Avoid cold refrigerated drinks, pulses, cabbage, cauliflower, and deep-fried spicy snacks during recovery.',
    warningNotes: 'Carefully rule out acute appendicitis (McBurney point tenderness), intestinal obstruction, or perforation if severe rebound tenderness or high fever is present.'
  },
  {
    id: 'acidity-gerd',
    nameEn: 'Acidity, GERD, Heartburn & Gastric',
    nameBn: 'অম্বল, বুকজ্বালা ও গ্যাস্ট্রিক সমস্যা',
    chipLabel: 'Acidity & GERD / অম্বল-গ্যাস',
    pathology: 'Gastroesophageal Reflux Disease (GERD), Hyperchlorhydria, Dyspepsia, Gastritis',
    miasm: 'Psoric Irritation with Acid-Peptic Diathesis',
    typicalPresentation: 'Heartburn, retrosternal burning, acid regurgitation, sour waterbrash and upper abdominal fullness',
    keywords: [
      'acidity', 'gerd', 'heartburn', 'gastric', 'acid reflux', 'sour eructations', 'burning in chest',
      'indigestion', 'dyspepsia', 'sour waterbrash', 'acid stomach', 'gastritis', 'bloating after meals',
      // Bengali
      'অম্বল', 'বুকজ্বালা', 'গ্যাস', 'পেট ফাঁপা', 'টক জল ওঠা', 'টক ঢেকুর', 'গ্যাস্ট্রিক',
      'হজম সমস্যা', 'বুকের মাঝে জ্বালা', 'বদহজম'
    ],
    classicalRemedies: [
      {
        name: 'Robinia Pseudacacia',
        commonName: 'Yellow Locust',
        potency: 'Q / 30C',
        dosage: '10 drops in 1/4 cup water or 4 pills after meals',
        keynotes: [
          'Pronounced, intense sourness of all digestive secretions; sour vomiting that sets teeth on edge',
          'Severe heartburn and acid reflux worse at night on lying flat in bed',
          'Frontal headache with gastric acidity and sour eructations'
        ],
        materiaMedicaNotes: 'Boericke: Gastric symptoms with marked acidity are most characteristic. Acidity of child smells sour all over. Modality: Worse at night.',
        modalities: {
          worse: 'Night, lying flat, fats, cabbage',
          better: 'Warm drinks, sitting upright, copious burping'
        },
        aliases: ['robinia', 'robinia pseudacacia']
      },
      {
        name: 'Iris Versicolor',
        commonName: 'Blue Flag',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Burning throughout whole alimentary tract from mouth, tongue, esophagus down to anus',
          'Profuse vomiting of intensely sour, greasy fluids accompanied by periodic sick headache (migraine with gastric aura)',
          'Hyperacidity with pancreatic and hepatic sluggishness'
        ],
        materiaMedicaNotes: 'Kent: The burning sensation in the whole gastrointestinal tract is unique to Iris. Sour vomiting with headache over one eye.',
        modalities: {
          worse: 'Evening, night, spring, sweets',
          better: 'Continued gentle motion'
        },
        aliases: ['iris versicolor', 'iris vers']
      },
      {
        name: 'Nux Vomica',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Weight and pain in stomach 1 to 2 hours after meals, as if a stone were lodged there',
          'Sour, bitter eructations; heartburn following spicy, rich food, coffee, or irregular hours',
          'Irritable temperament, hypochondriacal, habitually abuses antacids and stimulants'
        ],
        materiaMedicaNotes: 'Kent: Classic medicine for gastric disorders of students and brain-workers. Great dyspepsia from toxic stimulants and sedentary work.',
        modalities: {
          worse: 'Morning, spices, stimulants, cold air',
          better: 'Warmth, rest, evening'
        },
        aliases: ['nux vomica', 'nux']
      },
      {
        name: 'Carbo Vegetabilis',
        commonName: 'Vegetable Charcoal',
        potency: '30C',
        dosage: '4 pills twice daily before meals',
        keynotes: [
          'Upper abdominal distension; simplest food disagrees and turns to gas',
          'Sour, offensive eructations with temporary relief; sensation of chest tightness',
          'Loves cool circulating air and must be fanned'
        ],
        materiaMedicaNotes: 'Boericke: Sluggish digestion, putrid flatulence. The patient wants to be fanned to relieve dyspnoea from gastric pressure.',
        modalities: {
          worse: 'Fatty foods, lying down, warmth',
          better: 'Belching, fresh cool air'
        },
        aliases: ['carbo veg', 'carbo']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Gastro Aid Syrup / Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Hyperacidity, heartburn, sour eructations, epigastric pain, flatulence and dyspepsia.',
        dosage: '1-2 teaspoons or 10-15 drops before meals 3 times daily.',
        mrp: 145,
        aliases: ['gastro aid', 'bakson gastro aid', 'b2', 'b-2', 'bakson b2']
      },
      {
        name: 'Dr. Reckeweg R5 (Gastreu)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic gastritis, heartburn, sour regurgitation, flatulent dyspepsia, epigastric pressure.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r5', 'r-5', 'gastreu', 'reckeweg 5', 'dr reckeweg r5']
      },
      {
        name: 'SBL Nixocid Syrup / Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup / 50 Tabs',
        indications: 'Fast natural antacid relief for burning in chest, throat, sour waterbrash, GERD and heavy abdomen.',
        dosage: '1-2 teaspoons or 2 tablets after meals.',
        mrp: 140,
        aliases: ['nixocid', 'sbl nixocid']
      },
      {
        name: 'Adel 5 (Apo-Stom Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'German biological drops for regulating hyperacidity, peptic ulcer symptoms and gastroduodenal inflammation.',
        dosage: '15-20 drops in water 3 times daily.',
        mrp: 335,
        aliases: ['adel 5', 'apo-stom', 'adel-5']
      },
      {
        name: 'Wheezal WL-13 (Gastritis Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Acute and chronic gastritis, burning sensation in stomach, sour belching and fullness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 170,
        aliases: ['wl-13', 'wl 13', 'wheezal wl 13', 'wheezal gastritis']
      },
      {
        name: 'Medisynth Gastrocine Tablets / Drops',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '30 ml Drops / 25g Tabs',
        indications: 'Relieves hyperacidity, acid reflux, heartburn, sour regurgitation and gas distension.',
        dosage: '10-15 drops in water or 2 tablets after food 3 times daily.',
        mrp: 165,
        aliases: ['gastrocine', 'medisynth gastrocine']
      },
      {
        name: 'Schwabe Dizester Herbal / Alpha-DP',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '100 ml Syrup / 20g Tabs',
        indications: 'Comprehensive digestive tonic for dyspepsia, acidity, bloating and slow gastric motility.',
        dosage: '1-2 teaspoons or 1-2 tablets twice daily after meals.',
        mrp: 160,
        aliases: ['dizester', 'alpha dp', 'schwabe dizester']
      },
      {
        name: 'Allen A04 Gastritis Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relief from burning stomach pain, waterbrash, hyperacidity and flatulence.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a04', 'a04', 'allen acidity']
      }
    ],
    dietAndRegimen: 'Eat meals at fixed times and in moderate portions. Avoid lying down immediately after eating; keep head elevated 6 inches during sleep. Strictly avoid tobacco, alcohol, carbonated drinks, excess chillies, and fried foods.',
    warningNotes: 'Endoscopy advised if difficulty swallowing (dysphagia), unexplained weight loss, persistent vomiting, or black tarry stools (melena) occur.'
  },
  {
    id: 'joint-pain-gout',
    nameEn: 'Joint Pain, Arthritis, Sciatica & Gout',
    nameBn: 'বাতের ব্যথা, গাউট ও গাঁটে ফোলা যন্ত্রণা',
    chipLabel: 'Joint Pain & Gout / বাতের ব্যথা',
    pathology: 'Osteoarthritis, Rheumatoid Arthritis, Sciatic Neuralgia, Gouty Arthritis',
    miasm: 'Sycotic Diathesis with Syphilitic Articular Degeneration',
    typicalPresentation: 'Morning stiffness, swollen painful joints, shooting sciatic nerve pain and high uric acid gout',
    keywords: [
      'joint pain', 'arthritis', 'osteoarthritis', 'gout', 'sciatica', 'rheumatism', 'knee pain',
      'morning stiffness', 'swollen joint', 'uric acid', 'lumbago', 'backache', 'cervical spondylitis',
      'ankles', 'shoulder pain', 'rheumatic',
      // Bengali
      'বাতের ব্যথা', 'গাঁটে ব্যথা', 'হাঁটু ব্যথা', 'গাউট', 'কোমর ব্যথা', 'বাতের যন্ত্রণা',
      'পায়ের জয়েন্টে ব্যথা', 'ইউরিক অ্যাসিড', 'সায়াটিকা', 'সকালের জড়তা'
    ],
    classicalRemedies: [
      {
        name: 'Rhus Toxicodendron (Rhus Tox)',
        commonName: 'Poison Ivy',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in morning and evening',
        keynotes: [
          'Stiffness worse on first beginning to move, distinctly relieved by continued gentle motion',
          'Ailments brought on by exposure to cold damp weather, rain, or getting wet while perspiring',
          'Restlessness at night in bed; cannot stay in one position, must toss and turn for momentary relief'
        ],
        materiaMedicaNotes: 'Boericke: Primary affinity for fibrous tissue, tendons, ligaments, and joints. Aggravation from rest and initial movement; amelioration from warm dry heat and continued movement.',
        modalities: {
          worse: 'Rest, beginning of motion, cold damp weather, night',
          better: 'Continued gentle motion, warm applications, dry heat'
        },
        aliases: ['rhus tox', 'rhus toxicodendron', 'rhus']
      },
      {
        name: 'Bryonia Alba',
        commonName: 'White Bryony',
        potency: '30C / 200C',
        dosage: '4 drops twice daily before meals',
        keynotes: [
          'Severe stitching and tearing joint pains sharply aggravated by the slightest movement or jarring',
          'Great relief experienced by absolute rest and firm pressure or lying on the affected painful joint',
          'Dryness of mucous membranes with thirst for large quantities of cold water at long intervals'
        ],
        materiaMedicaNotes: 'Kent: Complete immobility gives comfort. Modality is diagnostic: Worse from motion; better from absolute rest and pressure.',
        modalities: {
          worse: 'Any movement, jarring, morning, warm room',
          better: 'Absolute rest, firm pressure, lying on painful side'
        },
        aliases: ['bryonia', 'bryonia alba', 'bry']
      },
      {
        name: 'Ledum Palustre',
        commonName: 'Marsh Tea',
        potency: '30C / 200C',
        dosage: '4 pills twice daily for 7 days',
        keynotes: [
          'Gouty and rheumatic pains that ascend from lower extremities upward (ankles to knees to hips)',
          'Affected joints are purple, swollen, yet lack natural vital heat',
          'Peculiar modality: Intolerant of warm blankets; pains are distinctly relieved by ice-cold water applications'
        ],
        materiaMedicaNotes: 'Boericke: Invaluable in gout and chronic rheumatism. Patient puts feet in a tub of ice-cold water for relief.',
        modalities: {
          worse: 'Warmth of bed, heat of stove, night, motion',
          better: 'Ice-cold applications, cold compresses, rest'
        },
        aliases: ['ledum pal', 'ledum', 'ledum palustre']
      },
      {
        name: 'Colchicum Autumnale',
        commonName: 'Meadow Saffron',
        potency: '30C',
        dosage: '4 drops twice daily',
        keynotes: [
          'Specific for acute gouty paroxysms, especially of the big toe and small joints',
          'Extreme hypersensitivity to touch and vibration; smell of cooking food causes intense nausea',
          'Joints are red, swollen, hot, with tearing stitching pains'
        ],
        materiaMedicaNotes: 'Boericke: Has a specific power of relieving the gouty paroxysms. Modality: Smell of food sickens; worse from motion and touch.',
        modalities: {
          worse: 'Motion, touch, smell of food, evening',
          better: 'Warmth, doubling up, resting quietly'
        },
        aliases: ['colchicum', 'colchicum autumnale']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Rheum Aid Syrup / Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Arthritis, rheumatism, osteoarthritis, gout, sciatica, joint stiffness and swelling.',
        dosage: '1 teaspoon or 10-15 drops in warm water 3 times daily.',
        mrp: 155,
        aliases: ['rheum aid', 'bakson rheum aid', 'b11', 'bakson b11']
      },
      {
        name: 'SBL Orthomuv Syrup & Oil',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup / 60 ml Oil',
        indications: 'Synergistic oral syrup and topical oil for arthritis, joint inflammation, morning stiffness.',
        dosage: '1 teaspoon syrup 3 times daily + apply oil gently twice daily.',
        mrp: 190,
        aliases: ['orthomuv', 'sbl orthomuv', 'orthomuv oil']
      },
      {
        name: 'Dr. Reckeweg R11 (Lumbacon) & R73',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic muscular rheumatism, lumbago, back pain, sciatica, and osteoarthritis of large joints.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r11', 'r73', 'r-11', 'r-73', 'lumbacon', 'reckeweg 11', 'reckeweg 73']
      },
      {
        name: 'Adel 24 (Septonsil / Joint Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'Rheumatic and arthritic ailments, reduces inflammatory swelling and restores joint flexibility.',
        dosage: '15-20 drops in water 3 times daily.',
        mrp: 335,
        aliases: ['adel 24', 'adel-24', 'adel joint']
      },
      {
        name: 'Wheezal WL-35 (Rheumatic Pain Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Joint pain, rheumatoid arthritis, uric acid diathesis, morning joint stiffness and backache.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 170,
        aliases: ['wl-35', 'wl 35', 'wheezal wl 35']
      },
      {
        name: 'Medisynth Rheuma-Saj Forte',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '30 ml Drops / 60 ml Oil',
        indications: 'Deep-acting anti-rheumatic formulation for arthritic inflammation, high uric acid, and sciatica.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 185,
        aliases: ['rheuma saj', 'rheuma-saj', 'medisynth rheuma']
      },
      {
        name: 'Schwabe Topi MP Gel / Bryorheum',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '30 ml Drops / 30g Gel',
        indications: 'WSG German proprietary formula for acute and chronic articular rheumatism, sciatica, and muscle ache.',
        dosage: '10-15 drops 3 times daily; apply Topi MP Gel locally twice daily.',
        mrp: 235,
        aliases: ['bryorheum', 'topi mp', 'schwabe bryorheum']
      },
      {
        name: 'Allen A15 Rheumatic Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Rheumatic pains in joints, back, muscles, knees with morning stiffness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a15', 'a15', 'allen rheumatic']
      }
    ],
    dietAndRegimen: 'Maintain gentle daily walking and mobility exercises without overstraining inflamed joints. Avoid sour curd at night, red meat, and high-purine foods. Apply warm dry fomentation on stiff joints.',
    warningNotes: 'Check Serum Uric Acid, ESR, and Rheumatoid Factor (RA) if acute polyarthritis persists. Avoid sudden weight lifting.'
  },
  {
    id: 'toothache-pyorrhea',
    nameEn: 'Toothache, Pyorrhea & Dental Pain',
    nameBn: 'দাঁতে তীব্র যন্ত্রণা, মাড়ি ফোলা ও পাইওরিয়া',
    chipLabel: 'Toothache & Pyorrhea / দাঁতে যন্ত্রণা',
    pathology: 'Dental Caries, Pulpitis, Gingivitis, Pyorrhea Alveolaris, Periodontitis',
    miasm: 'Syphilitic Destructive Ulceration with Psoric Hypersensitivity',
    typicalPresentation: 'Severe throbbing toothache radiating to ears, sensitive cavities, spongy bleeding gums and loose teeth',
    keywords: [
      'toothache', 'pyorrhea', 'dental pain', 'tooth pain', 'swollen gums', 'bleeding gums',
      'tooth sensitivity', 'cavity pain', 'gum pain', 'gingivitis', 'loose teeth', 'decayed tooth',
      // Bengali
      'দাঁতে ব্যথা', 'দাঁতে যন্ত্রণা', 'দাঁত শিরশির', 'মাড়ি ফোলা', 'মাড়ি দিয়ে রক্ত পড়া',
      'দাঁতের পোকা', 'পাইওরিয়া', 'দাঁত কনকন', 'মাড়িতে পুঁজ'
    ],
    classicalRemedies: [
      {
        name: 'Plantago Major',
        commonName: 'Plantain / Ribwort',
        potency: 'Q / 30C',
        dosage: '10 drops in water + apply Q directly onto painful cavity with cotton wool',
        keynotes: [
          'Premier homeopathic medicine for severe toothache, dental neuralgia, sensitive teeth and pyorrhea',
          'Pains are sharp, shooting, radiating to ear and cheek; teeth feel elongated and sore',
          'Rapid topical and constitutional relief in dental emergencies'
        ],
        materiaMedicaNotes: 'Boericke: Causes a distaste for tobacco. Its local use in toothache is unequaled. Moderates pain and stops bleeding.',
        modalities: {
          worse: 'Touch, cold air, pressure on teeth',
          better: 'Eating temporarily, warm applications'
        },
        aliases: ['plantago', 'plantago major', 'plantago q']
      },
      {
        name: 'Chamomilla',
        commonName: 'German Chamomile',
        potency: '30C / 200C',
        dosage: '4 pills every 2-3 hours during acute paroxysms of pain',
        keynotes: [
          'Unbearable, agonizing toothache driving patient frantic, irritable, and uncivil',
          'One cheek is hot and red, the other cheek is pale and cold',
          'Toothache distinctly aggravated by warm drinks or warm food; relieved by holding cold water in mouth'
        ],
        materiaMedicaNotes: 'Kent: The mental irritability and intolerable sensitivity to pain is the supreme guiding keynote for Chamomilla.',
        modalities: {
          worse: 'Warm drinks, warm food, night, anger, coffee',
          better: 'Holding cold water in mouth, walking quietly about'
        },
        aliases: ['chamomilla', 'cham']
      },
      {
        name: 'Mercurius Solubilis (Merc Sol)',
        commonName: 'Quicksilver',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Spongy, inflamed bleeding gums with fetid offensive breath; teeth feel loose and elongated',
          'Pulsating toothache worse at night and from the warmth of the bed',
          'Excessive profuse salivation at night staining the pillow; flabby tongue with teeth indentations'
        ],
        materiaMedicaNotes: 'Kent: Classic medicine for destructive ulceration and pyorrhea. Crown of teeth decay; spongy scorbutic gums.',
        modalities: {
          worse: 'Night, warmth of bed, drafts, damp cold',
          better: 'Moderate uniform temperature, resting'
        },
        aliases: ['merc sol', 'mercurius solubilis', 'merc']
      },
      {
        name: 'Hepar Sulphuris Calcareum',
        commonName: 'Hahnemann Sulphuret of Lime',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Extreme hypersensitivity to pain and the slightest draft of cold air or touch',
          'Throbbing abscess at the root of tooth with acute tendency to pus formation',
          'Pain is sharp like a splinter or fishbone sticking in the gum'
        ],
        materiaMedicaNotes: 'Boericke: Promotes suppuration or aborts it depending on potency. Hypersensitive physically and mentally.',
        modalities: {
          worse: 'Cold air, cold drafts, cold drinks, touching',
          better: 'Warmth, hot compresses, covering head warmly'
        },
        aliases: ['hepar sulph', 'hepar sulphuris', 'hepar']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Dental Aid Drops & Gel',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '30 ml Drops / 50g Gel',
        indications: 'Relieves toothache, sensitivity, swollen bleeding gums, mouth ulcers and halitosis.',
        dosage: '10-15 drops in water 3 times daily + apply gel locally on gums.',
        mrp: 145,
        aliases: ['dental aid', 'bakson dental aid']
      },
      {
        name: 'Dr. Reckeweg R35 (Dentition & Toothache)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Painful dentition, toothache, neuralgic facial and dental pains, swollen tender gums.',
        dosage: '10-15 drops in water every 1-2 hours in acute pain; 3 times daily routinely.',
        mrp: 310,
        aliases: ['r35', 'r-35', 'reckeweg 35', 'dr reckeweg r35']
      },
      {
        name: 'SBL Pyorin Drops & Plantago Spray',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops / Spray',
        indications: 'Pyorrhea, gingivitis, loose teeth, bleeding tender gums and acute throbbing toothache.',
        dosage: '10-15 drops in water 3 times daily; spray directly onto affected gum area.',
        mrp: 150,
        aliases: ['pyorin', 'sbl pyorin', 'plantago spray']
      },
      {
        name: 'Wheezal WL-38 (Toothache Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Acute throbbing toothache, exposed pulp pain, dental sensitivity and gum soreness.',
        dosage: '10-15 drops in water 3 times daily + apply with cotton plug on cavity.',
        mrp: 170,
        aliases: ['wl-38', 'wl 38', 'wheezal wl 38']
      },
      {
        name: 'Schwabe Biocombination No. 18 / 23',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '20g Tablets',
        indications: 'BC 18 for pyorrhea, spongy bleeding gums; BC 23 for acute toothache and neuralgia.',
        dosage: '4 tablets dissolved in mouth 3 times daily.',
        mrp: 175,
        aliases: ['bc 18', 'bc 23', 'biocombination 18', 'biocombination 23']
      },
      {
        name: 'Medisynth Dentolith Drops',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves acute dental neuralgia, painful caries, inflammation of the periodontal membrane.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 165,
        aliases: ['dentolith', 'medisynth dental']
      },
      {
        name: 'Allen A62 Toothache Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Fast-acting dental drops for cavities, acute throbbing toothache, nerve pain and gum swelling.',
        dosage: '10-15 drops in water 3 times daily + soak cotton plug in drops and apply locally.',
        mrp: 175,
        aliases: ['allen a62', 'a62', 'allen toothache']
      },
      {
        name: "Lord's Kaltoth Tooth Drops",
        brand: "Lord's",
        company: "Lord's Homoeopathic Laboratories",
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Instant relief from painful dental caries, inflamed dental pulp and gum swelling.',
        dosage: '10-15 drops in water or apply cotton pellet to aching tooth.',
        mrp: 140,
        aliases: ['kaltoth', 'lords kaltoth']
      }
    ],
    dietAndRegimen: 'Rinse mouth with warm saline or Plantago Q lotion after every meal. Maintain gentle oral hygiene. Avoid excessively sugary foods, extreme ice-cold beverages, and biting hard objects.',
    warningNotes: 'Consult dental surgeon if severe structural root cavity, cellulitis, or facial edema is present.'
  },
  {
    id: 'cough-bronchitis',
    nameEn: 'Cough, Bronchitis & Respiratory Asthma',
    nameBn: 'কাশি, হাঁপানি ও ব্রঙ্কাইটিস',
    chipLabel: 'Cough & Bronchitis / কাশি-হাঁপানি',
    pathology: 'Acute & Chronic Bronchitis, Spasmodic Cough, Bronchial Asthma, Tracheitis',
    miasm: 'Psoric-Tubercular Diathesis',
    typicalPresentation: 'Persistent dry or rattling cough, wheezing, suffocative nocturnal dyspnoea and bronchial congestion',
    keywords: [
      'cough', 'bronchitis', 'asthma', 'dry cough', 'wet cough', 'chest congestion', 'phlegm',
      'wheezing', 'shortness of breath', 'suffocation', 'breathlessness', 'whooping cough',
      // Bengali
      'কাশি', 'হাঁপানি', 'শ্বাসকষ্ট', 'বুকে কফ', 'শুকনো কাশি', 'খুকখুকে কাশি', 'ব্রঙ্কাইটিস', 'কফ ওঠা'
    ],
    classicalRemedies: [
      {
        name: 'Justicia Adhatoda',
        commonName: 'Vasaka',
        potency: 'Q / 30C',
        dosage: '10-15 drops in lukewarm water, 3 times daily',
        keynotes: [
          'Premier Indian medicine for acute respiratory catarrh, bronchial tightness and suffocative cough',
          'Violent paroxysmal cough with tightness in chest and copious expectoration',
          'Sensation of dryness and constriction in larynx and bronchial tree'
        ],
        materiaMedicaNotes: 'Boericke: Highly efficacious in respiratory catarrh. Whooping cough and bronchial asthma with severe chest tightness.',
        modalities: {
          worse: 'Warm closed room, evening, lying down',
          better: 'Open fresh air, upright position'
        },
        aliases: ['justicia', 'adhatoda', 'vasaka', 'justicia adhatoda']
      },
      {
        name: 'Drosera Rotundifolia',
        commonName: 'Round-leaved Sundew',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Spasmodic, deep, dry barking cough in rapid paroxysms following each other so rapidly patient can scarcely breathe',
          'Cough worse immediately after midnight and on lying down in bed',
          'Retching and vomiting of food with the severe cough paroxysms'
        ],
        materiaMedicaNotes: 'Kent: The principal remedy for whooping cough and spasmodic laryngo-bronchial paroxysms.',
        modalities: {
          worse: 'After midnight, lying down in bed, warmth of bed',
          better: 'Sitting up, quiet motion'
        },
        aliases: ['drosera', 'drosera rotundifolia']
      },
      {
        name: 'Bryonia Alba',
        commonName: 'White Bryony',
        potency: '30C',
        dosage: '4 drops twice daily',
        keynotes: [
          'Hard, dry painful cough; patient must hold chest with hands while coughing to prevent stitching agony',
          'Dry lips, mouth dry with great thirst for large quantities of water',
          'Aggravated by coming into a warm room from cold outdoor air'
        ],
        materiaMedicaNotes: 'Kent: Dry hacking cough from irritation in upper trachea. Patient presses hand to chest.',
        modalities: {
          worse: 'Movement, entering warm room from cold air',
          better: 'Absolute rest, firm pressure, cold drinks'
        },
        aliases: ['bryonia', 'bryonia alba']
      },
      {
        name: 'Antimonium Tartaricum',
        commonName: 'Tartar Emetic',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Great rattling of mucous in chest with little or no expectoration; chest sounds full of phlegm',
          'Patient is too weak or exhausted to cough out the secretions; suffocative dyspnoea',
          'Drowsiness, prostration, white coated tongue'
        ],
        materiaMedicaNotes: 'Boericke: Characterized by excessive mucous secretion with lack of expectorative power.',
        modalities: {
          worse: 'Warm room, lying down at night, damp cold',
          better: 'Sitting upright, expectoration, cold air'
        },
        aliases: ['antim tart', 'antimonium tart', 'antimonium tartaricum']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Kof Aid Syrup / B33 Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Dry, hacking, allergic or wet productive cough, bronchitis, clears bronchial congestion.',
        dosage: '1-2 teaspoons or 10-15 drops in warm water 3 times daily.',
        mrp: 135,
        aliases: ['kof aid', 'bakson kof aid', 'b33', 'bakson b33']
      },
      {
        name: 'SBL Stodal Cough Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml / 180 ml Syrup',
        indications: 'Clinically trusted non-drowsy cough syrup for dry, productive and allergic coughs.',
        dosage: '1-2 teaspoons 3 times daily with warm water.',
        mrp: 125,
        aliases: ['stodal', 'sbl stodal', 'stobal']
      },
      {
        name: 'Dr. Reckeweg R8 & R9 (Jutussin Drops & Syrup)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops / 100 ml Syrup',
        indications: 'Spasmodic bronchitis, persistent irritative cough, whooping cough, clears bronchial congestion.',
        dosage: '10-15 drops or 1 teaspoon 3-4 times daily.',
        mrp: 310,
        aliases: ['r8', 'r9', 'r-8', 'r-9', 'jutussin', 'reckeweg jutussin']
      },
      {
        name: 'Wheezal De-Kof Syrup / WL-11',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Effective for acute and chronic bronchitis, allergic bronchial asthma and hacking cough.',
        dosage: '1-2 teaspoons 3 times daily with warm water.',
        mrp: 130,
        aliases: ['de-kof', 'de kof', 'wheezal de kof', 'wl-11']
      },
      {
        name: 'Adel 83 (Bronchi-Pertu Syrup)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '100 ml Syrup',
        indications: 'German biological cough syrup for deep chest coughs, clears thick phlegm.',
        dosage: '1 teaspoon 3 times daily.',
        mrp: 360,
        aliases: ['adel 83', 'bronchi pertu', 'adel-83']
      },
      {
        name: 'Schwabe Alpha-CC Tablets / Nisikind',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '20g (100 Tabs)',
        indications: 'Relieves cough, congestion, catarrhal headache and throat soreness.',
        dosage: '1-2 tablets dissolved in mouth 3 times daily.',
        mrp: 185,
        aliases: ['alpha cc', 'alpha-cc', 'schwabe alpha']
      },
      {
        name: 'Allen A05 Cough Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Acute and chronic bronchitis, suffocative spasmodic cough and bronchial irritation.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a05', 'a05', 'allen cough', 'a07']
      },
      {
        name: 'Medisynth Kofeez Syrup',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Soothes irritated bronchial lining, liquefies tenacious sputum, eases nocturnal breathing.',
        dosage: '1-2 teaspoons 3 times daily with warm water.',
        mrp: 140,
        aliases: ['kofeez', 'medisynth kofeez']
      }
    ],
    dietAndRegimen: 'Inhale warm steam vapor with eucalyptus oil twice daily. Drink warm water throughout the day. Avoid refrigerated food, ice-cream, cold exposure, and dusty environments.',
    warningNotes: 'Seek immediate pulmonology care if oxygen saturation (SpO2) drops below 94% or severe cyanosis develops.'
  },
  {
    id: 'liver-jaundice',
    nameEn: 'Liver, Jaundice & Gallbladder Disorders',
    nameBn: 'লিভার সমস্যা, জন্ডিস ও পিত্তশূল',
    chipLabel: 'Liver & Jaundice / লিভার সমস্যা',
    pathology: 'Hepatitis, Fatty Liver (NAFLD), Cholecystitis, Jaundice, Bilious Dyspepsia',
    miasm: 'Psoric-Sycotic Hepatic Congestion',
    typicalPresentation: 'Dull ache in right hypochondrium under right shoulder blade, yellow sclera, bitter mouth taste and sluggish digestion',
    keywords: [
      'liver', 'jaundice', 'hepatitis', 'fatty liver', 'bilious', 'gallbladder', 'sluggish liver',
      'enlarged liver', 'loss of appetite', 'bitter taste', 'right side pain', 'elevated sgpt',
      // Bengali
      'লিভার', 'জন্ডিস', 'হেপাটাইটিস', 'ফ্যাটি লিভার', 'ক্ষুধামন্দা', 'মুখ তিতো', 'হজমের সমস্যা',
      'পেটের ডানদিকে ব্যথা', 'লিভার বৃদ্ধি'
    ],
    classicalRemedies: [
      {
        name: 'Chelidonium Majus',
        commonName: 'Greater Celandine',
        potency: 'Q / 30C',
        dosage: '10 drops in 1/4 cup warm water, twice daily',
        keynotes: [
          'Unquestioned keynote: Constant dull aching pain under the inferior angle of the right scapula',
          'Jaundiced yellow skin, yellow sclera, thick yellow tongue coating with red margins',
          'Liver enlarged, congested and sensitive to pressure; craves very hot drinks'
        ],
        materiaMedicaNotes: 'Boericke: A prominent liver remedy. Keynote is fixed pain under inner angle of right shoulder blade.',
        modalities: {
          worse: 'Right side, motion, touch, 4 AM and 4 PM',
          better: 'Very hot drinks, warm food, pressure'
        },
        aliases: ['chelidonium', 'chelidonium majus', 'cheli']
      },
      {
        name: 'Carduus Marianus',
        commonName: "St. Mary's Thistle / Milk Thistle",
        potency: 'Q (Mother Tincture)',
        dosage: '15 drops in water twice daily before meals',
        keynotes: [
          'Premier remedy for fatty liver disease, hepatic cirrhosis, and portal venous stasis',
          'Pain in region of liver with sensation of fullness and heaviness in right hypochondrium',
          'Dark golden bilious urine with clay-colored or knotty stools'
        ],
        materiaMedicaNotes: 'Boericke: The action of this drug is centered in the liver and portal system. Prevents alcoholic and toxic hepatic cirrhosis.',
        modalities: {
          worse: 'Lying on left side, motion, pressure',
          better: 'Warm drinks, resting quietly on right side'
        },
        aliases: ['carduus', 'carduus marianus', 'milk thistle']
      },
      {
        name: 'Lycopodium Clavatum',
        commonName: 'Club Moss',
        potency: '200C',
        dosage: '4 pills once daily in the evening',
        keynotes: [
          'Chronic hepatic congestion with right-sided abdominal distension; clothes feel too tight',
          'Eating small amount causes extreme sensation of fullness in stomach',
          'Craving for warm food and sweets; aggravated 4:00 PM to 8:00 PM'
        ],
        materiaMedicaNotes: 'Kent: Deep-acting antipsoric and sycotic polychrest for chronic liver diseases with uric acid diathesis.',
        modalities: {
          worse: '4 PM to 8 PM, right side, warm room',
          better: 'Warm drinks, moving about, passing flatus'
        },
        aliases: ['lycopodium', 'lycopodium clavatum', 'lyco']
      },
      {
        name: 'Chionanthus Virginica',
        commonName: 'Fringe Tree',
        potency: 'Q / 30C',
        dosage: '10 drops in water twice daily',
        keynotes: [
          'Hypertrophy of liver with intense jaundice; sick headache over eyes',
          'Stools clay-colored with dark amber bilious urine; pancreatic dysfunction',
          'Soreness, dull aching in right hypochondrium with enlarged spleen'
        ],
        materiaMedicaNotes: 'Boericke: Specifically indicated in acute catarrhal jaundice, gallstones, and bilious sick headaches.',
        modalities: {
          worse: 'Motion, cold weather',
          better: 'Warmth, lying on abdomen'
        },
        aliases: ['chionanthus', 'chionanthus virginica']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Liv Aid Syrup / B18 Drops',
        brand: "Bakson's",
        company: "Bakson Drugs & Pharmaceuticals",
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Protects and rejuvenates hepatic cells in fatty liver, sluggish liver, hepatitis and loss of appetite.',
        dosage: '1-2 teaspoons or 10-15 drops 3 times daily before meals.',
        mrp: 145,
        aliases: ['liv aid', 'bakson liv aid', 'b18', 'bakson b18']
      },
      {
        name: 'Dr. Reckeweg R7 (Hepagalen Liver Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Liver and gallbladder disorders, hepatitis, sluggish bile flow, fatty liver, bitter taste in mouth.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r7', 'r-7', 'hepagalen', 'reckeweg 7', 'dr reckeweg r7']
      },
      {
        name: 'SBL Liv-T Liver Tonic',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml / 180 ml Syrup',
        indications: 'Rejuvenates liver cells, treats sluggish liver, fatty liver, loss of appetite, protects against hepatotoxins.',
        dosage: '1-2 teaspoons 3 times daily before food.',
        mrp: 135,
        aliases: ['liv-t', 'liv t', 'sbl liv-t', 'sbl liv t']
      },
      {
        name: 'Adel 7 (Apo-Hepat Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'German biological drops for liver and gallbladder detoxification, supports metabolic clearance.',
        dosage: '15-20 drops in water 3 times daily.',
        mrp: 335,
        aliases: ['adel 7', 'apo-hepat', 'adel-7']
      },
      {
        name: 'Wheezal WL-24 (Liver & Gall Bladder Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Sluggish liver, bilious headaches, hepatic enlargement and jaundice.',
        dosage: '10-15 drops in water 3 times daily before food.',
        mrp: 170,
        aliases: ['wl-24', 'wl 24', 'wheezal wl 24']
      },
      {
        name: 'Schwabe Alpha-Liv Syrup',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe',
        country: 'Germany / India',
        bottleSize: '100 ml / 500 ml Syrup',
        indications: 'Fast-acting liver syrup that stimulates digestion, improves hepatic bile secretion and appetite.',
        dosage: '1-2 teaspoons twice daily.',
        mrp: 160,
        aliases: ['alpha liv', 'alpha-liv', 'schwabe alpha liv']
      },
      {
        name: 'Medisynth Jondila Sugar Free Syrup',
        brand: 'Medisynth',
        company: 'Medisynth Chemicals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Diabetic-safe liver remedy for jaundice, hepatic congestion, anorexia and elevated liver enzymes.',
        dosage: '1-2 teaspoons 3 times daily before meals.',
        mrp: 160,
        aliases: ['jondila', 'medisynth jondila', 'jondila sugar free']
      },
      {
        name: 'Allen A25 Liver Drops',
        brand: 'Allen',
        company: 'Allen Homoeo',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Hepatic dysfunction, bilious colic, jaundice and enlargement of liver.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['allen a25', 'a25']
      }
    ],
    dietAndRegimen: 'Drink warm water with fresh lemon in the morning. Eat light, fresh, boiled vegetables and fruits (papaya, apples). Strictly eliminate alcohol, heavy oils, fried snacks, and processed sugar.',
    warningNotes: 'Order Liver Function Tests (LFT: Bilirubin, SGPT, SGOT, Alk Phos) and abdominal USG to rule out acute viral hepatitis or choledocholithiasis.'
  }
];

export function findRepertoryMatch(symptomQuery: string): ClinicalCondition {
  const query = symptomQuery.toLowerCase().trim();
  if (!query) return CLINICAL_REPERTORY_DATABASE[0];

  let bestMatch = CLINICAL_REPERTORY_DATABASE[0];
  let maxScore = -1;

  for (const cond of CLINICAL_REPERTORY_DATABASE) {
    let score = 0;

    // Check direct id or name match
    if (query.includes(cond.id)) score += 10;
    if (query.includes(cond.nameEn.toLowerCase())) score += 8;
    if (query.includes(cond.nameBn.toLowerCase())) score += 8;

    for (const kw of cond.keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += kw.length > 5 ? 4 : 2;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = cond;
    }
  }

  return bestMatch;
}
