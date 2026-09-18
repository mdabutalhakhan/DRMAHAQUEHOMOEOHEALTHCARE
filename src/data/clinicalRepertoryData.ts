import { EXPANDED_CLINICAL_CONDITIONS } from './expandedClinicalConditions';
import { ADDITIONAL_CLINICAL_CONDITIONS } from './additionalClinicalConditions';
import { synthesizeMateriaMedicaOffline } from '../services/materiaMedicaEngine';
import { MALE_GENITO_URINARY_CONDITIONS } from './rubrics/maleGenitoUrinary';
import { DIGESTIVE_RECTAL_CONDITIONS } from './rubrics/digestiveRectal';
import { RESPIRATORY_THROAT_CONDITIONS } from './rubrics/respiratoryThroat';
import { DERMATOLOGY_HAIR_CONDITIONS } from './rubrics/dermatologyHair';
import { MUSCULOSKELETAL_CONDITIONS } from './rubrics/musculoskeletal';
import { NEUROLOGICAL_CONDITIONS } from './rubrics/neurological';
import { FEMALE_HORMONAL_CONDITIONS } from './rubrics/femaleHormonal';
import { FEVER_SYSTEMIC_CONDITIONS } from './rubrics/feverSystemic';

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
  ...MALE_GENITO_URINARY_CONDITIONS,
  ...DIGESTIVE_RECTAL_CONDITIONS,
  ...RESPIRATORY_THROAT_CONDITIONS,
  ...DERMATOLOGY_HAIR_CONDITIONS,
  ...MUSCULOSKELETAL_CONDITIONS,
  ...NEUROLOGICAL_CONDITIONS,
  ...FEMALE_HORMONAL_CONDITIONS,
  ...FEVER_SYSTEMIC_CONDITIONS,
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
      },
      {
        name: 'New Life NL-12 (Calculi Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Effective in renal calculi, sharp pain radiating to thighs, burning urination and red urinary gravel.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 145,
        aliases: ['nl-12', 'nl 12', 'new life 12', 'calculi drops']
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
    id: 'fever-pyrexia',
    nameEn: 'Fever, Pyrexia & Acute Inflammatory Heat',
    nameBn: 'জ্বর, গা গরম ও তীব্র প্রদাহজনিত তাপমাত্রা',
    chipLabel: 'Fever / জ্বর',
    pathology: 'Acute Pyrexia, Viral Fever, Inflammatory Hyperthermia & Febrile Rigors',
    miasm: 'Acute Psora with Inflammatory Hyperdynamic Congestion',
    typicalPresentation: 'Sudden onset fever, hot dry skin, burning heat, chills, bodyache, delirium or restlessness',
    keywords: [
      'fever', 'pyrexia', 'high fever', 'acute fever', 'febrile', 'chills', 'rigors', 'hyperthermia',
      'temperature', 'hot body', 'burning heat', 'bodyache',
      // Bengali
      'জ্বর', 'গা গরম', 'তীব্র জ্বর', 'শীত লাগা', 'কাঁপুনি দিয়ে জ্বর', 'গা পুড়ে যাওয়া', 'জ্বরের তাপমাত্রা', 'জ্বর ও শরীর ব্যথা'
    ],
    classicalRemedies: [
      {
        name: 'Aconitum Napellus',
        commonName: "Monk's Hood",
        potency: '30C',
        dosage: '4 pills every 2-3 hours in acute stage, reduce as fever subsides',
        keynotes: [
          'Sudden, violent onset of high fever after exposure to dry cold wind',
          'Intense heat, burning dry skin, full bounding pulse, red face turning pale on sitting up',
          'Agonizing physical restlessness, extreme anxiety, fear of death, unquenchable thirst for cold water'
        ],
        materiaMedicaNotes: 'Boericke: Aconite is the king of acute inflammatory fevers. Physical and mental restlessness, fright and sudden violence of onset are its hallmarks.',
        modalities: {
          worse: 'Warm room, evening and night, lying on affected side, dry cold wind',
          better: 'Open air, resting quietly, profuse perspiration'
        },
        aliases: ['aconite', 'aconitum', 'aconitum napellus']
      },
      {
        name: 'Belladonna',
        commonName: 'Deadly Nightshade',
        potency: '30C',
        dosage: '4 drops in a spoonful of water every 3-4 hours',
        keynotes: [
          'High inflammatory fever with burning heat radiating from body, red flushed face, throbbing carotids',
          'Dilated pupils, delirium, hot head with cold extremities',
          'Sudden onset and sudden decline; hypersensitive to light, noise, touch, and jarring'
        ],
        materiaMedicaNotes: 'Kent: Great heat, redness, and throbbing. Skin is so hot it imparts a burning sensation to the examining hand.',
        modalities: {
          worse: 'Touch, jar, noise, draught of air, after 3 PM, lying down',
          better: 'Semi-erect position, resting quietly in dark warm room'
        },
        aliases: ['belladonna', 'bell']
      },
      {
        name: 'Bryonia Alba',
        commonName: 'White Bryony',
        potency: '30C',
        dosage: '4 pills 3 times daily before meals',
        keynotes: [
          'Slowly developing fever with great thirst for large quantities of cold water at long intervals',
          'Bursting frontal headache and severe aching in all muscles and joints',
          'Sharp aggravation from the slightest motion; patient wants to lie completely still'
        ],
        materiaMedicaNotes: 'Boericke: Sluggish insidious onset fever. Irritable, dry mucous membranes, white coated tongue, motion aggravates.',
        modalities: {
          worse: 'Any motion, morning, warm weather, exertion',
          better: 'Absolute rest, lying on painful side, cool open air'
        },
        aliases: ['bryonia', 'bryonia alba', 'bry']
      },
      {
        name: 'Gelsemium Sempervirens',
        commonName: 'Yellow Jasmine',
        potency: '30C',
        dosage: '4 pills 3-4 times daily in warm water',
        keynotes: [
          'The 4 D’s: Dizziness, Drowsiness, Dullness, and Drooping eyelids with muscular prostration',
          'Slow, insidious onset of viral fever or flu-like illness; complete lack of thirst',
          'Chills running up and down the spine with occipital heaviness and motor weakness'
        ],
        materiaMedicaNotes: 'Kent: Indicated in sluggish, congestive, catarrhal fevers, influenza, and warm-weather fevers with heavy, aching muscles.',
        modalities: {
          worse: 'Damp weather, fog, before a thunderstorm, emotions or bad news',
          better: 'Bending forward, profuse urination, open air, motion'
        },
        aliases: ['gelsemium', 'gelsemium sempervirens', 'gels']
      },
      {
        name: 'Eupatorium Perfoliatum',
        commonName: 'Bone-set',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Intense, deep aching in bones as if broken or bruised from head to foot',
          'Fever paroxysm preceded by intense bone pain, soreness of eyeballs, and great thirst',
          'Bitter vomiting of bile at the close of chill or during heat'
        ],
        materiaMedicaNotes: 'Boericke: Known as Bone-set for its unmatched ability to relieve aching in the bones of limbs and back during acute malaria, dengue, or influenza.',
        modalities: {
          worse: 'Periodically 7-9 AM, cold air, motion',
          better: 'Rest, talking, warm room'
        },
        aliases: ['eupatorium', 'eupatorium perf', 'eupatorium perfoliatum', 'boneset']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R1 (Inflammation/Fever Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Biological formula for acute and chronic local inflammation, catarrhal fever, anginas, and inflammatory hyperthermia.',
        dosage: '10-15 drops in water every 2-3 hours in acute fever; reduce to 3 times daily as condition normalizes.',
        mrp: 310,
        aliases: ['r1', 'r-1', 'reckeweg 1', 'dr reckeweg r1', 'r1 drops']
      },
      {
        name: 'Bakson Febro Aid Syrup / Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Effective antipyretic formulation for temperature control, bodyaches, post-viral chills and fatigue.',
        dosage: '1 teaspoonful or 10-15 drops in lukewarm water 3 times daily.',
        mrp: 145,
        aliases: ['febro aid', 'bakson febro aid', 'febro-aid']
      },
      {
        name: 'Wheezal WL-14 (Fever Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Broad-spectrum fever drops for viral pyrexia, catarrhal influenza, headache and muscle ache.',
        dosage: '10-15 drops in 1/4 cup water every 3-4 hours.',
        mrp: 165,
        aliases: ['wl-14', 'wl 14', 'wheezal wl 14', 'wheezal fever']
      },
      {
        name: 'New Life NL-7 (Fever Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Therapeutic formula for acute pyrexia, shivering, headache, malaise and febrile delirium.',
        dosage: '15-20 drops in warm water 3-4 times daily.',
        mrp: 140,
        aliases: ['nl-7', 'nl 7', 'new life 7', 'new life fever drops', 'nl7']
      },
      {
        name: 'SBL Ferrum Phosphoricum 6X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Biochemic Tablets',
        indications: 'The premier first-stage inflammatory and fever biochemic tissue salt for rapid temperature regulation and oxygenation.',
        dosage: '4 tablets dissolved in lukewarm water 3-4 times daily.',
        mrp: 120,
        aliases: ['ferrum phos', 'ferrum phos 6x', 'sbl ferrum phos', 'ferrum phosphoricum']
      }
    ],
    dietAndRegimen: 'Drink plenty of warm boiled fluids (barley water, fresh coconut water, light soup). Avoid cold drinks, oily foods, and direct air drafts. Rest completely in a well-ventilated room.',
    warningNotes: 'Monitor temperature closely with a thermometer. If fever exceeds 103°F or is accompanied by stiff neck, convulsions, or rash, immediate clinical evaluation is required.'
  },
  {
    id: 'dysentery-diarrhea',
    nameEn: 'Dysentery, Diarrhea & Enteric Spasms',
    nameBn: 'আমাশয়, ডায়রিয়া, পেট খারাপ ও পেটে মোচড়',
    chipLabel: 'Dysentery & Diarrhea / আমাশয় ও পেট খারাপ',
    pathology: 'Amoebic & Bacillary Dysentery, Acute Enterocolitis, Gastroenteritis & Colic',
    miasm: 'Psoric-Sycotic Intestinal Catarrh with Tenesmus',
    typicalPresentation: 'Frequent loose watery or bloody mucoid stools, cutting abdominal cramps, straining before and after stool',
    keywords: [
      'dysentery', 'diarrhea', 'diarrhoea', 'loose motion', 'loose stools', 'amoebiasis', 'enteritis',
      'gastroenteritis', 'stomach upset', 'mucus stool', 'blood in stool', 'tenesmus', 'griping',
      // Bengali
      'আমাশয়', 'আমআশা', 'ডায়রিয়া', 'পেট খারাপ', 'পাতলা পায়খানা', 'পেটে মোচড়', 'রক্ত আমাশয়', 'পেট কামড়ানো', 'ঘন ঘন পায়খানা'
    ],
    classicalRemedies: [
      {
        name: 'Mercurius Solubilis (Merc Sol)',
        commonName: 'Quicksilver / Hydrargyrum',
        potency: '30C',
        dosage: '4 pills 3 times daily away from food',
        keynotes: [
          'Pre-eminent remedy for dysentery with slimy, bloody stool and persistent "never-get-done" feeling',
          'Severe tenesmus during and after stool; violent griping and cutting colic',
          'Offensive breath, flabby indented tongue, night aggravation, and profuse perspiration that gives no relief'
        ],
        materiaMedicaNotes: 'Kent: The cardinal keynote is "cannot get done straining." Stools are greenish, slimy, bloody with constant urgency.',
        modalities: {
          worse: 'Night, damp weather, lying on right side, warmth of bed',
          better: 'Rest, moderate dry temperature'
        },
        aliases: ['merc sol', 'mercurius solubilis', 'mercurius', 'merc']
      },
      {
        name: 'Nux Vomica',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills twice daily, especially at bedtime',
        keynotes: [
          'Frequent, small, ineffectual urging to stool; relief felt immediately after passing small quantity',
          'Ailments from dietary excesses, rich spicy food, stimulants, purgatives, or sedentary lifestyle',
          'Irritable disposition, hypersensitive to cold air and noise; morning diarrhea or alternating constipation'
        ],
        materiaMedicaNotes: 'Boericke: Unsurpassed in toxic, spicy-food induced enteritis with ineffectual desire. Modality: Better after momentary evacuation.',
        modalities: {
          worse: 'Morning, mental exertion, spices, stimulants, cold dry weather',
          better: 'Evening, rest, warm wet weather, covering head'
        },
        aliases: ['nux vomica', 'nux', 'nux vom']
      },
      {
        name: 'Aloe Socotrina',
        commonName: 'Socotrine Aloes',
        potency: '30C',
        dosage: '4 pills 3 times daily before meals',
        keynotes: [
          'Sudden urgency driving patient out of bed early in the morning (5 AM)',
          'Sensation of insecurity in the rectum; fear of passing flatus lest stool should escape',
          'Stools contain jelly-like lumps of mucus; accompanied by loud rumbling and flatulence'
        ],
        materiaMedicaNotes: 'Kent: Paralytic weakness of the rectal sphincter. Stool escapes while passing flatus or urine. Colic relieved by passing stool.',
        modalities: {
          worse: 'Early morning, hot dry weather, after eating or drinking',
          better: 'Cold water, cold open air, passing flatus or stool'
        },
        aliases: ['aloe', 'aloe socotrina', 'aloes']
      },
      {
        name: 'Colocynthis',
        commonName: 'Bitter Apple',
        potency: '30C',
        dosage: '4 pills in warm water every 2-3 hours during acute cramps',
        keynotes: [
          'Excruciating cutting, gripping abdominal colic causing patient to bend double and press hard for relief',
          'Dysenteric stools provoked by anger, vexation, or indigestion',
          'Severe intestinal cramps followed immediately by thin, frothy, yellowish or mucoid evacuations'
        ],
        materiaMedicaNotes: 'Boericke: The great homoeopathic pain reliever in violent abdominal colic. Ameliorated by firm pressure and doubling up.',
        modalities: {
          worse: 'Anger, eating or drinking, standing erect',
          better: 'Doubling up, hard pressure, heat, warm drinks'
        },
        aliases: ['colocynth', 'colocynthis']
      },
      {
        name: 'Ipecacuanha (Ipecac)',
        commonName: 'Ipecac Root',
        potency: '30C',
        dosage: '4 drops in water 3 times daily',
        keynotes: [
          'Persistent, unyielding nausea and vomiting accompanying every diarrheic stool; clean tongue despite nausea',
          'Green, frothy, pitch-like or fermented stools like frothy molasses, with umbilical griping',
          'Lack of thirst, pale face with blue rings around eyes, prostration'
        ],
        materiaMedicaNotes: 'Kent: Constant nausea that is not relieved by vomiting is the guiding keynote across all complaints including dysentery.',
        modalities: {
          worse: 'Periodically, warm moist winds, rich food, lying down',
          better: 'Open air, resting quietly'
        },
        aliases: ['ipecac', 'ipecacuanha']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R4 (Enteritis & Dysentery Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Amoebic and bacillary dysentery, chronic intestinal catarrh, flatulent colic, and summer diarrhea.',
        dosage: '10-15 drops in water 3-4 times daily; in acute attacks every 1-2 hours.',
        mrp: 310,
        aliases: ['r4', 'r-4', 'reckeweg 4', 'dr reckeweg r4', 'enteritis drops']
      },
      {
        name: 'SBL Dysentrin Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Specifically formulated for acute and chronic amoebic dysentery, blood and mucus in stool, and griping pain.',
        dosage: '10-15 drops in 1/4 cup lukewarm water 3-4 times daily.',
        mrp: 160,
        aliases: ['dysentrin', 'sbl dysentrin', 'dysentrin drops']
      },
      {
        name: 'Bakson Diarrhoea Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets / 30 ml Drops',
        indications: 'Effective management for loose watery stools, abdominal cramps, gastroenteritis and traveler’s diarrhea.',
        dosage: '1 tablet 3 times daily or 10-15 drops in water.',
        mrp: 150,
        aliases: ['diarrhoea aid', 'diarrhea aid', 'bakson diarrhoea aid']
      },
      {
        name: 'New Life NL-4 (Gastroenteritis & Dysentery Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Intestinal infections, dysentery, loose motions, dehydration risk, and abdominal flatulence.',
        dosage: '15-20 drops in water 3-4 times daily.',
        mrp: 140,
        aliases: ['nl-4', 'nl 4', 'new life 4', 'new life dysentery', 'nl4']
      },
      {
        name: 'Wheezal WL-11 (Diarrhoea Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Formulated for gastrointestinal spasms, acute summer diarrhea, mucus in stools, and tenesmus.',
        dosage: '10-15 drops in water every 2-3 hours until relieved.',
        mrp: 165,
        aliases: ['wl-11', 'wl 11', 'wheezal wl 11', 'wheezal diarrhoea']
      }
    ],
    dietAndRegimen: 'Drink Oral Rehydration Salts (ORS), rice congee (জাউ ভাত), boiled green banana mash, and coconut water. Avoid whole milk, greasy spices, raw vegetables, and tea/coffee.',
    warningNotes: 'Watch for signs of dehydration (sunken eyes, dry mouth, oliguria). Seek immediate hospitalization if high fever, severe bloody stool, or circulatory collapse occurs.'
  },
  {
    id: 'sciatica-nerve-pain',
    nameEn: 'Sciatica, Lumbago & Radiating Nerve Pain',
    nameBn: 'সায়াটিকা, কোমর থেকে পা ব্যথা ও স্নায়ুশূল',
    chipLabel: 'Sciatica & Nerve Pain / সায়াটিকা',
    pathology: 'Sciatic Neuralgia, Lumbar Radiculopathy, L4-L5/S1 Disc Compression & Piriformis Syndrome',
    miasm: 'Sycotic-Syphilitic Neuralgic and Structural Degenerative Diathesis',
    typicalPresentation: 'Shooting, lightning-like pain from lower back down the posterior thigh to calf and foot, numbness and paresthesia',
    keywords: [
      'sciatica', 'sitica', 'sciatic pain', 'sciatic nerve', 'shooting pain', 'radiating pain',
      'lower back to leg', 'lumbar disc', 'lumbago', 'disc herniation', 'radiculopathy',
      // Bengali
      'সায়াটিকা', 'সায়াটিকা', 'সিটিকা', 'কোমর থেকে পা', 'কোমর থেকে পায়ে ব্যথা', 'পা ব্যথা', 'পায়ে টান লাগা', 'রগে টান', 'রগ টান'
    ],
    classicalRemedies: [
      {
        name: 'Colocynthis',
        commonName: 'Bitter Apple',
        potency: '30C / 200C',
        dosage: '4 pills twice daily or in warm water during severe paroxysms',
        keynotes: [
          'Excruciating shooting, cramping pain in sciatic nerve, predominantly left-sided (hip down to knee and foot)',
          'Pain is sharply ameliorated by hard pressure, warm applications, and lying on the affected side',
          'Numbness with pains; sudden attacks provoked by cold dry wind, exposure, or emotional vexation'
        ],
        materiaMedicaNotes: 'Boericke: Specifically curative in left-sided sciatica. Modality is distinctive: Ameliorated by firm, hard pressure and heat; aggravated by gentle touch or motion.',
        modalities: {
          worse: 'Gentle touch, motion, cold air, extending the limb',
          better: 'Hard pressure, warmth, bending limb, lying on painful side'
        },
        aliases: ['colocynthis', 'colocynth']
      },
      {
        name: 'Magnesia Phosphorica',
        commonName: 'Phosphate of Magnesia',
        potency: '6X / 30C',
        dosage: '4 tablets dissolved in warm water 3 times daily',
        keynotes: [
          'Sudden, sharp, shooting, lightning-like, spasmodic neuralgic pains along the sciatic path',
          'Right-sided sciatica; pains dart like electric shocks',
          'Prompt and unmistakable relief from hot water bottles, warm fomentation, and hard pressure'
        ],
        materiaMedicaNotes: 'Kent: The great anti-spasmodic and neuralgic tissue remedy. Warmth and pressure are the absolute keynotes.',
        modalities: {
          worse: 'Cold drafts, cold water, washing with cold water, touch',
          better: 'Warm applications, hot water fomentation, hard pressure, doubling up'
        },
        aliases: ['mag phos', 'magnesia phos', 'magnesia phosphorica']
      },
      {
        name: 'Gnaphalium Polycephalum',
        commonName: 'Cud-weed',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Intense pain along the course of the sciatic nerve alternating with numbness of the affected thigh and leg',
          'Frequent cramping in calves and feet; worse when walking or stepping',
          'Remarkable relief experienced only when sitting in a comfortable chair with thighs flexed on pelvis'
        ],
        materiaMedicaNotes: 'Boericke: A specific remedy for sciatica when numbness is associated with pain. Better sitting in a chair.',
        modalities: {
          worse: 'Motion, walking, stepping, lying down flat',
          better: 'Sitting in a chair with legs drawn up'
        },
        aliases: ['gnaphalium', 'gnaphalium polycephalum', 'gnaph']
      },
      {
        name: 'Rhus Toxicodendron (Rhus Tox)',
        commonName: 'Poison Ivy',
        potency: '200C',
        dosage: '4 pills morning and evening',
        keynotes: [
          'Sciatica and lumbago resulting from lifting heavy weights, straining muscles, or exposure to cold damp weather',
          'Severe stiffness and tearing pain worse on first starting to move; gradually relieved by continued gentle movement',
          'Restless at night; must constantly shift position in bed'
        ],
        materiaMedicaNotes: 'Kent: In chronic sciatica with fibrous tissue stiffness. Modality: Worse on beginning motion, better with continued motion and dry warmth.',
        modalities: {
          worse: 'Rest, beginning of motion, cold damp weather, night',
          better: 'Continued gentle walking, warm dry heat, dry weather'
        },
        aliases: ['rhus tox', 'rhus toxicodendron', 'rhus']
      },
      {
        name: 'Hypericum Perforatum',
        commonName: "St. John's Wort",
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'King of remedies for nerve injury, spinal compression, and lacerated or compressed nerve roots',
          'Darting, tearing, shooting pains travelling along the path of nerve trunks upwards towards spine',
          'Numbness, burning, and tingling in the affected leg; hypersensitive to touch and cold air'
        ],
        materiaMedicaNotes: 'Boericke: The great remedy for mechanical injuries to nerves. In radiculopathy and sciatica caused by disc compression.',
        modalities: {
          worse: 'Cold, damp, fog, touch, jarring',
          better: 'Bending head back, rest'
        },
        aliases: ['hypericum', 'hypericum perforatum', 'hyper']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R71 (Sciatica Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Sciatica, neuralgic pains along the sciatic nerve, lumbago, paresthesia and lumbar disc compression syndrome.',
        dosage: '10-15 drops in water 3-4 times daily; during acute crisis take every 1-2 hours.',
        mrp: 310,
        aliases: ['r71', 'r-71', 'reckeweg 71', 'dr reckeweg r71', 'sciatica drops']
      },
      {
        name: 'Bakson Rheum Aid Syrup / Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 75 Tablets',
        indications: 'Relieves chronic sciatic neuralgia, radiating leg stiffness, muscular spasms, and joint inflammation.',
        dosage: '1 teaspoonful or 1 tablet 3 times daily with warm water.',
        mrp: 155,
        aliases: ['rheum aid', 'bakson rheum aid', 'rheum-aid']
      },
      {
        name: 'SBL Orthomuv Syrup & Massage Oil',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup / 60 ml Oil',
        indications: 'Synergistic formulation for lumbago, radiating thigh nerve pain, spinal disc strain, and morning stiffness.',
        dosage: '1 teaspoon syrup 3 times daily; apply oil gently along nerve path twice daily.',
        mrp: 190,
        aliases: ['orthomuv', 'sbl orthomuv', 'orthomuv oil', 'orthomuv syrup']
      },
      {
        name: 'New Life NL-1 (Rheumatex & Sciatica Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Sciatic nerve shooting pain, severe leg stiffness, lumbar spondylosis and muscular rheumatism.',
        dosage: '15-20 drops in warm water 3 times daily.',
        mrp: 140,
        aliases: ['nl-1', 'nl 1', 'new life 1', 'rheumatex', 'nl1']
      }
    ],
    dietAndRegimen: 'Sleep on a firm orthopaedic mattress. Avoid bending forward at waist or lifting heavy loads. Apply dry warm compresses to lower back and gluteal region. Perform gentle hamstring stretches under medical guidance.',
    warningNotes: 'If progressive foot drop (loss of dorsiflexion) or bowel/bladder incontinence occurs (Cauda Equina Syndrome), emergency neurosurgical consultation is imperative.'
  },
  {
    id: 'neuro-problem-neuropathy',
    nameEn: 'Neurological Disorders, Neuropathy & Paralytic Weakness',
    nameBn: 'নার্ভের সমস্যা, নিউরোপ্যাথি ও স্নায়বিক দুর্বলতা',
    chipLabel: 'Neuro Problem / নার্ভের সমস্যা',
    pathology: 'Peripheral Neuropathy, Diabetic Nerve Damage, Neuralgia, Hemiplegia & Motor Weakness',
    miasm: 'Syphilitic-Sycotic Neurodegenerative and Psoric Asthenic Diathesis',
    typicalPresentation: 'Numbness, tingling "pins and needles", burning soles, muscle twitching, tremors, or partial paralytic weakness',
    keywords: [
      'neuro', 'nerve', 'neuropathy', 'neurological', 'paralysis', 'paresis', 'numbness', 'tingling',
      'pins and needles', 'burning soles', 'motor weakness', 'tremor', 'bell palsy', 'facial paralysis',
      // Bengali
      'নার্ভ', 'নার্ভের সমস্যা', 'স্নায়বিক দুর্বলতা', 'অসারতা', 'প্যারালাইসিস', 'ঝিঁঝিঁ ধরা', 'অবশ লাগা', 'হাত পা কাঁপা', 'নার্ভের ব্যথা'
    ],
    classicalRemedies: [
      {
        name: 'Hypericum Perforatum',
        commonName: "St. John's Wort",
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Pre-eminent constitutional remedy for peripheral nerve trauma, compression, and neuritis',
          'Sharp, shooting, lancinating pains following the course of peripheral nerves; extreme hypersensitivity to touch',
          'Phantom pains, burning sensation, and numbness in limbs following nerve damage'
        ],
        materiaMedicaNotes: 'Kent: What Arnica is to bruises of soft tissues, Hypericum is to injuries and inflammatory destruction of nerves.',
        modalities: {
          worse: 'Cold, damp weather, fog, motion, touch',
          better: 'Bending head back, lying quiet in warm room'
        },
        aliases: ['hypericum', 'hypericum perforatum']
      },
      {
        name: 'Kali Phosphoricum',
        commonName: 'Phosphate of Potassium',
        potency: '6X / 30C',
        dosage: '4 tablets in warm water 3 times daily',
        keynotes: [
          'Great biochemic nerve nutrient for nervous exhaustion, prostration, brain fag, and neuralgic pain',
          'Numbness, weakness of limbs, tremors with mental fatigue, depression, and loss of memory',
          'Diabetic neuropathy, burning of soles and palms with nervous restlessness'
        ],
        materiaMedicaNotes: 'Boericke: One of the greatest nerve remedies in Materia Medica. Indicated for conditions arising from lack of nerve power and exhaustion.',
        modalities: {
          worse: 'Mental exertion, physical fatigue, cold, morning',
          better: 'Warmth, rest, gentle movement, eating'
        },
        aliases: ['kali phos', 'kali phosphoricum', 'kali-phos']
      },
      {
        name: 'Causticum',
        commonName: 'Hahnemann’s Tinctura Acris Sine Kali',
        potency: '200C',
        dosage: '4 pills once every 3 days in the evening',
        keynotes: [
          'Paralysis of single nerves or local parts: facial paralysis (Bell’s palsy), vocal cords, bladder, or right-sided hemiplegia',
          'Ailments from exposure to dry, cold winds, or chronic debilitating neurological disease',
          'Muscular contractions, stiffness, unsteadiness of gait, and weakness of flexor tendons'
        ],
        materiaMedicaNotes: 'Kent: Deep-acting polychrest for progressive paralytic states, hemiplegia, and chorea. Characterized by intolerance of dry cold wind.',
        modalities: {
          worse: 'Dry cold winds, clear fine weather, morning',
          better: 'Damp wet weather, warm bed, gentle warmth'
        },
        aliases: ['causticum', 'caust']
      },
      {
        name: 'Zincum Metallicum',
        commonName: 'Metallic Zinc',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Continuous restlessness of feet and lower legs; cannot keep feet still, must constantly move them',
          'Tremors, chorea, twitching of muscles, and cerebral depression following suppressed eruptions',
          'Tingling and numbness along nerve tracts with muscular twitching during sleep'
        ],
        materiaMedicaNotes: 'Boericke: Profound action upon the nervous system. Defective vitality and nerve exhaustion with continuous fidgety legs.',
        modalities: {
          worse: 'Mental exertion, evening, cold wine/stimulants',
          better: 'Free discharges (perspiration, menses), open air'
        },
        aliases: ['zincum met', 'zincum metallicum', 'zincum']
      },
      {
        name: 'Gelsemium Sempervirens',
        commonName: 'Yellow Jasmine',
        potency: '30C',
        dosage: '4 drops twice daily in water',
        keynotes: [
          'Motor paralysis with gradual loss of muscular control and heavy prostration',
          'Drooping of eyelids (ptosis), tremors of hands, tongue and legs with extreme dizziness',
          'Post-viral neuropathy and weakness; muscular coordination severely impaired'
        ],
        materiaMedicaNotes: 'Kent: Gelsemium paralyzes the motor nerves. The muscles refuse to obey the will; limbs feel heavy as lead.',
        modalities: {
          worse: 'Emotional excitement, bad news, hot humid weather',
          better: 'Profuse urination, open air, bending forward'
        },
        aliases: ['gelsemium', 'gelsemium sempervirens', 'gels']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R36 (Chorea & Nervous Disorder Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Chorea, nervous twitches, muscular spasms, involuntary movements, neuropathy and paralytic tremors.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 320,
        aliases: ['r36', 'r-36', 'reckeweg 36', 'dr reckeweg r36', 'chorea drops']
      },
      {
        name: 'Dr. Reckeweg R14 (Nerve & Sleep Sedative Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Central and autonomic nervous exhaustion, insomnia, neurovegetative dystonia, and nervous debility.',
        dosage: '10-15 drops in water in afternoon and before sleep.',
        mrp: 310,
        aliases: ['r14', 'r-14', 'reckeweg 14', 'dr reckeweg r14', 'quietude']
      },
      {
        name: 'Wheezal WL-28 (Neuralgia Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Severe facial neuralgia, peripheral nerve tingling, numbness, and burning sensation.',
        dosage: '10-15 drops in 1/4 cup water 3 times daily.',
        mrp: 170,
        aliases: ['wl-28', 'wl 28', 'wheezal wl 28', 'neuralgia drops']
      },
      {
        name: 'Schwabe Ginseng 1X / Tonic',
        brand: 'Schwabe',
        company: 'Dr. Willmar Schwabe (Germany/India)',
        country: 'Germany',
        bottleSize: '30 ml Drops / 100 ml Tonic',
        indications: 'Renowned German adaptogen and revitalizing nerve tonic for neuromuscular weakness, paresthesia, and exhaustion.',
        dosage: '15 drops in water twice daily or 1 teaspoonful twice daily.',
        mrp: 260,
        aliases: ['ginseng', 'schwabe ginseng', 'ginseng tonic']
      },
      {
        name: 'New Life NL-15 (Nervous Exhaustion Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Nerve weakness, tremors, tingling sensation in hands and feet, and mental exhaustion.',
        dosage: '15-20 drops in water 3 times daily.',
        mrp: 145,
        aliases: ['nl-15', 'nl 15', 'new life 15', 'new life nerve', 'nl15']
      }
    ],
    dietAndRegimen: 'Ensure adequate vitamin B12 rich nutrition, soaked almonds, walnuts, and green leafy vegetables. Avoid smoking, alcohol, and refined sugars which exacerbate peripheral neuropathy. Perform gentle physiotherapy.',
    warningNotes: 'Sudden onset of facial asymmetry, unilateral arm weakness, or speech slurring may signal acute cerebrovascular accident (Stroke); require immediate emergency hospital transfer.'
  },
  {
    id: 'arthritis-joint-pain',
    nameEn: 'Arthritis, Osteoarthritis & Knee Joint Inflammation',
    nameBn: 'বাত, অস্টিওআর্থ্রাইটিস, হাঁটু ও গাঁটের ব্যথা',
    chipLabel: 'Arthritis & Joint Pain / বাত ও গাঁটের ব্যথা',
    pathology: 'Osteoarthritis, Rheumatoid Arthritis, Synovitis, Gout & Articular Degeneration',
    miasm: 'Sycotic Diathesis with Syphilitic Articular Cartilage Erosion',
    typicalPresentation: 'Morning stiffness in joints, swelling, pain in knees and knuckles, difficulty climbing stairs or getting up',
    keywords: [
      'arthritis', 'osteoarthritis', 'rheumatoid arthritis', 'joint pain', 'knee pain', 'knee',
      'swollen joint', 'morning stiffness', 'gout', 'cartilage', 'synovial', 'crepitus',
      // Bengali
      'বাত', 'বাতের ব্যথা', 'হাঁটু ব্যথা', 'হাঁটু', 'গাঁটের ব্যথা', 'গাঁটে ব্যথা', 'সকালের জড়তা', 'পায়ের জয়েন্টে ব্যথা', 'বাতরোগ'
    ],
    classicalRemedies: [
      {
        name: 'Rhus Toxicodendron (Rhus Tox)',
        commonName: 'Poison Ivy',
        potency: '200C',
        dosage: '4 pills twice daily morning and evening',
        keynotes: [
          'Severe stiffness and lameness in joints, distinctly worse on first movement after resting',
          'Pains markedly ameliorated by continued gentle walking and warm dry fomentation',
          'Aggravated by wet, rainy, cold damp weather and getting soaked while perspiring'
        ],
        materiaMedicaNotes: 'Boericke: Cardinal remedy for fibrous tissues, ligaments, and tendons. The modalities of relief from continuous motion and warmth are pathognomonic.',
        modalities: {
          worse: 'Rest, beginning of motion, cold damp weather, night',
          better: 'Continued gentle motion, warm applications, dry heat'
        },
        aliases: ['rhus tox', 'rhus toxicodendron', 'rhus']
      },
      {
        name: 'Bryonia Alba',
        commonName: 'White Bryony',
        potency: '200C',
        dosage: '4 drops twice daily before meals',
        keynotes: [
          'Stitching, tearing joint pains sharply aggravated by the slightest movement or jarring',
          'Affected joints are hot, swollen, and red; patient demands absolute stillness',
          'Distinct relief from firm bandaging, pressure, and lying directly on the painful joint'
        ],
        materiaMedicaNotes: 'Kent: The cardinal modality is "Worse from motion, better from absolute rest and pressure." Thirst for large quantities of water.',
        modalities: {
          worse: 'Any movement, jarring, morning, warm room',
          better: 'Absolute rest, firm pressure, lying on painful side'
        },
        aliases: ['bryonia', 'bryonia alba', 'bry']
      },
      {
        name: 'Ledum Palustre',
        commonName: 'Marsh Tea',
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Rheumatic and gouty pains that ascend from lower extremities upward (ankles to knees to hips)',
          'Joints are swollen, purple, yet lack natural animal warmth',
          'Peculiar diagnostic keynote: Pains are distinctly relieved by ice-cold water compresses, worse from warmth of bed'
        ],
        materiaMedicaNotes: 'Boericke: Excellent for gout and acute articular rheumatism. The affected joints are cool yet patient insists on ice-cold applications for relief.',
        modalities: {
          worse: 'Warmth of bed, heat of stove, night, motion',
          better: 'Ice-cold applications, cold compresses, resting quietly'
        },
        aliases: ['ledum pal', 'ledum', 'ledum palustre']
      },
      {
        name: 'Colchicum Autumnale',
        commonName: 'Meadow Saffron',
        potency: '30C',
        dosage: '4 drops twice daily in water',
        keynotes: [
          'Specific remedy for acute gouty paroxysms, swollen red painful big toe, and small joints',
          'Extreme hypersensitivity to touch and vibration; smell of cooking food causes intense nausea',
          'High uric acid diathesis with tearing pains in joints and dark scanty urine'
        ],
        materiaMedicaNotes: 'Kent: Colchicum has great power over acute gouty inflammation. Intolerance of the smell of food is constant.',
        modalities: {
          worse: 'Motion, touch, smell of food, evening, cold damp',
          better: 'Warmth, rest, doubling up'
        },
        aliases: ['colchicum', 'colchicum autumnale']
      },
      {
        name: 'Causticum',
        commonName: 'Hahnemann’s Tinctura Acris',
        potency: '200C',
        dosage: '4 pills once every 3 days in the evening',
        keynotes: [
          'Chronic progressive rheumatoid arthritis with contracture of tendons and stiffening of joints',
          'Deformities of fingers and toes; cracking of knee joints on walking',
          'Pains worse in clear fine weather and dry cold winds; distinctly relieved by warm bed and wet weather'
        ],
        materiaMedicaNotes: 'Boericke: Manifests action in chronic rheumatic, arthritic, and paralytic affections. Indurated ligaments and contracted joints.',
        modalities: {
          worse: 'Dry cold air, clear fine weather, morning',
          better: 'Damp wet weather, warm applications'
        },
        aliases: ['causticum', 'caust']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R11 (Lumbago & Joint Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic articular rheumatism, osteoarthritis of large joints, knee pain, and lumbago.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r11', 'r-11', 'reckeweg 11', 'dr reckeweg r11', 'lumbacon']
      },
      {
        name: 'Bakson Rheum Aid Syrup / Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Comprehensive formulation for joint stiffness, knee osteophytes, osteoarthritis, and morning stiffness.',
        dosage: '1 teaspoonful or 10-15 drops in warm water 3 times daily.',
        mrp: 155,
        aliases: ['rheum aid', 'bakson rheum aid', 'rheum-aid']
      },
      {
        name: 'SBL Orthomuv Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup',
        indications: 'Symptomatic relief for arthritis, inflammatory joint swelling, cartilage erosion, and limited mobility.',
        dosage: '1 teaspoon syrup 3 times daily after meals.',
        mrp: 190,
        aliases: ['orthomuv', 'sbl orthomuv', 'orthomuv syrup']
      },
      {
        name: 'New Life NL-1 (Joint Pain & Rheumatic Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Severe knee pain, swelling in finger joints, synovial inflammation and chronic osteoarthritis.',
        dosage: '15-20 drops in warm water 3 times daily.',
        mrp: 140,
        aliases: ['nl-1', 'nl 1', 'new life 1', 'new life joint pain', 'nl1']
      }
    ],
    dietAndRegimen: 'Avoid high-purine foods (red meat, organ meats, lentils at night), sour curd, and excess tomatoes. Maintain gentle non-impact joint mobility (isometric quad exercises). Apply warm dry heat.',
    warningNotes: 'Monitor ESR, CRP, and Serum Uric Acid. If a single joint becomes acutely red, hot, and severely swollen with high fever, rule out septic arthritis.'
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
  },
  {
    id: 'uterine-fibroid-tumor',
    nameEn: 'Uterine Fibroid, Myoma & Benign Tumors',
    nameBn: 'জরায়ু ফাইব্রয়েড, টিউমার ও আর্বুদ',
    chipLabel: 'Fibroid & Tumors / ফাইব্রয়েড',
    pathology: 'Uterine Leiomyoma, Benign Fibro-Myoma, Glandular Hyperplasia & Pelvic Tumors',
    miasm: 'Sycotic Miasm with Proliferative Cellular Induration',
    typicalPresentation: 'Uterine fibroid with lower pelvic dragging, excessive prolonged menses, lower abdominal lump and bearing down pain',
    keywords: [
      'fibroid', 'fibroids', 'uterine fibroid', 'uterine fibroids', 'tumor', 'tumour', 'tumors', 'tumours',
      'myoma', 'leiomyoma', 'uterine tumor', 'uterus lump', 'bulky uterus', 'menorrhagia',
      'ovarian cyst', 'pelvic mass', 'lump', 'neoplasm', 'induration',
      // Bengali
      'ফাইব্রয়েড', 'ফাইব্রয়েড', 'টিউমার', 'জরায়ু টিউমার', 'জরায়ু টিউমার', 'আর্বুদ', 'জরায়ুতে টিউমার',
      'জরায়ু বৃদ্ধি', 'অতিরিক্ত ঋতুস্রাব', 'পেটে টিউমার', 'মাংসপিণ্ড'
    ],
    classicalRemedies: [
      {
        name: 'Thuja Occidentalis',
        commonName: 'Arbor Vitae / White Cedar',
        potency: '200C',
        dosage: '4 pills once weekly in the morning on empty stomach',
        keynotes: [
          'King of sycotic remedies; specific for fleshy growths, condylomata, fibroids, polypi and glandular indurations',
          'Left ovarian and uterine hyper-sensitiveness; pelvic fullness and bearing down sensation',
          'Vaginal and cervical hypertrophy; copious thick greenish leucorrhoea and sycotic diathesis'
        ],
        materiaMedicaNotes: 'Kent Repertory: Pre-eminent anti-sycotic constitutional remedy for all benign neo-formations, polypi, and uterine fibromyomata.',
        modalities: {
          worse: 'Cold, damp air, periodic aggravation at 3 AM and 3 PM, after vaccination',
          better: 'Warmth, dry weather, gentle movement, drawing limbs up'
        },
        aliases: ['thuja', 'thuja occidentalis', 'thuja occ']
      },
      {
        name: 'Calcarea Fluorica',
        commonName: 'Fluoride of Lime',
        potency: '6X / 12X',
        dosage: '4 tablets dissolved in warm water 3 times daily',
        keynotes: [
          'Specific tissue salt for stony-hard fibroids, glandular enlargements, and inelastic connective tissues',
          'Hard, knotty lumps and bulky, indurated fibrous tumors in the uterus',
          'Bearing-down sensation in pelvic floor accompanied by chronic dragging lumbar backache'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Powerful tissue remedy for hard fibroid tumors, enlarged veins, and tissue indurations of stony hardness.',
        modalities: {
          worse: 'During rest, cold, drafts of air, changes of weather',
          better: 'Heat, warm applications, rubbing, continuous motion'
        },
        aliases: ['calc fluor', 'calcarea fluorica', 'calcarea fluor', 'calc-fluor']
      },
      {
        name: 'Fraxinus Americana',
        commonName: 'White Ash',
        potency: 'Q (Mother Tincture)',
        dosage: '10-15 drops in 1/4 cup water, 3 times daily before meals',
        keynotes: [
          'Renowned organopathic remedy specifically for uterine enlargement, subinvolution, and fibrous growth',
          'Enlarged, heavy uterus dragging down into the pelvis, dysmenorrhoea with uterine cramps',
          'Prolonged, profuse watery or clotted menses directly associated with uterine fibroid formation'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Specifically indicated for uterine tumors, fibroids with pelvic dragging. A genuine homoeopathic organ remedy.',
        modalities: {
          worse: 'Standing, walking, menstrual periods',
          better: 'Lying flat on back, rest'
        },
        aliases: ['fraxinus americana', 'fraxinus', 'white ash']
      },
      {
        name: 'Aurum Muriaticum Natronatum',
        commonName: 'Sodium Chloroaurate',
        potency: '3X / 6X',
        dosage: '2 tablets twice daily after meals',
        keynotes: [
          'Pre-eminent remedy for chronic indurated uterine fibromyomata, chronic metritis, and ovarian cysts',
          'Ulceration of cervix, burning sensation in pelvic cavity, coldness in abdomen',
          'Mental depression accompanied by chronic organic pelvic pathology in females'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Has the most pronounced action on female pelvic organs, chronic induration of uterus, and fibroid tumors of enormous size.',
        modalities: {
          worse: 'Cold weather, rest, mental depression',
          better: 'Warm dry weather, open air'
        },
        aliases: ['aurum mur nat', 'aurum muriaticum natronatum', 'aurum mur']
      },
      {
        name: 'Sepia Officinalis',
        commonName: 'Inky Juice of Cuttlefish',
        potency: '200C',
        dosage: '4 pills once every 3 days in the evening',
        keynotes: [
          'Constant bearing-down sensation in uterus as if pelvic contents would protrude from vagina; must cross legs tightly',
          'Fibroids with pelvic congestion, yellow saddle across nose, painful coitus, and severe apathy towards loved ones',
          'Menses irregular, either profuse or scanty, with intense sacral backache ameliorated by hard pressure'
        ],
        materiaMedicaNotes: 'Kent Repertory: Deep-acting constitutional anti-psoric & sycotic polychrest for uterine engorgement, prolapsus, and pelvic fibroid indurations.',
        modalities: {
          worse: 'Forenoons, evenings, cold air, laundry work, standing',
          better: 'Vigorous exercise, warm bed, crossing legs, hard pressure on back'
        },
        aliases: ['sepia', 'sepia officinalis']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R17 (Tumor Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Biological formula for benign and malignant neoplasms, glandular swelling, uterine fibroids, cysts and indurated tissues.',
        dosage: '10-15 drops in a little water 3 times daily before meals.',
        mrp: 320,
        aliases: ['r17', 'r-17', 'reckeweg 17', 'dr reckeweg r17', 'cobapec', 'tumor drops']
      },
      {
        name: 'SBL Tumorin Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Effective therapeutic formulation for benign lumps, fibroids, cysts, glandular enlargements and cellular indurations.',
        dosage: '10-15 drops in 1/4 cup water 3-4 times daily.',
        mrp: 175,
        aliases: ['tumorin', 'sbl tumorin', 'tumorin drops']
      },
      {
        name: 'Bakson Ovi-Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets / 30 ml Drops',
        indications: 'Specially formulated for uterine fibroids, ovarian cysts, PCOS, lower abdominal heaviness and irregular painful bleeding.',
        dosage: '1 tablet 3 times a day or 15 drops in water twice daily.',
        mrp: 230,
        aliases: ['ovi-aid', 'ovi aid', 'bakson ovi aid']
      },
      {
        name: 'New Life NL-17 (Tumor Drops)',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Indicated for fibroid tumors, cysts, nodular indurations, breast lumps and glandular swelling.',
        dosage: '15-20 drops in water 3 times daily.',
        mrp: 155,
        aliases: ['nl-17', 'nl 17', 'new life 17', 'new life tumor drops', 'nl17']
      }
    ],
    dietAndRegimen: 'Adopt a hormone-balancing plant-rich diet with cruciferous vegetables (cabbage, broccoli). Avoid excess dairy, poultry with synthetic hormones, red meat, processed sugar, and trans-fats.',
    warningNotes: 'Pelvic Ultrasonography (USG Pelvis TVS) recommended to monitor fibroid dimensions and exclude malignant transformation. Urgent evaluation if severe bleeding causes acute anaemia.'
  },
  {
    id: 'appetite-digestion',
    nameEn: 'Loss of Appetite & Dyspepsia / Indigestion',
    nameBn: 'ক্ষুধামন্দা, অরুচি ও দুর্বল পরিপাকতন্ত্র',
    chipLabel: 'Appetite & Indigestion / ক্ষুধামন্দা',
    pathology: 'Anorexia, Gastric Hypo-secretion, Atonic Dyspepsia & Nutritional Impairment',
    miasm: 'Psoric Diathesis with Gastro-Intestinal Atony',
    typicalPresentation: 'Loss of appetite, aversion to food, bitter taste, post-prandial heaviness, dyspepsia and weak assimilation',
    keywords: [
      'appetite', 'loss of appetite', 'anorexia', 'poor appetite', 'no appetite', 'appetite problem',
      'indigestion', 'dyspepsia', 'malnutrition', 'weak digestion', 'no hunger', 'atonic dyspepsia',
      'eating problem', 'taste lost', 'slow digestion',
      // Bengali
      'ক্ষুধামন্দা', 'খিদে নেই', 'খিদে পায় না', 'খিদে নাই', 'অরুচি', 'অজীর্ণ', 'খাবারে রুচি নেই',
      'হজম হচ্ছে না', 'হজম সমস্যা', 'বুক ভারী', 'পেট ফাঁপা', 'খাবার অনিচ্ছা'
    ],
    classicalRemedies: [
      {
        name: 'Nux Vomica',
        commonName: 'Poison Nut',
        potency: '30C / 200C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Total loss of appetite in sedentary, stressed persons; frequent ineffectual urging for stool',
          'Heavy pressure in stomach 1-2 hours after eating like a stone; sour or bitter eructations',
          'Craves stimulants, spicy foods, yet they aggravate; irritable, impatient and hypochondriacal'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Primary digestive tonic for toxic gastropathy, loss of appetite from sedentary life, coffee, stimulants, and mental strain.',
        modalities: {
          worse: 'Morning, mental exertion, after eating, cold air, stimulants',
          better: 'Evening, warm food, restful sleep, damp wet weather'
        },
        aliases: ['nux vomica', 'nux vom', 'nux']
      },
      {
        name: 'Alfalfa',
        commonName: 'Medicago Sativa / Lucerne',
        potency: 'Q (Mother Tincture)',
        dosage: '10-15 drops in 1/4 cup water before meals, 3 times daily',
        keynotes: [
          'Premier physiological appetite stimulant, promoting profound physical and mental vigour',
          'Improves nitrogenous assimilation and digestion; acts as a natural restorative for debility and anorexia',
          'Clean tongue, craving for food about 11 AM; enhances weight gain in malnourished children and adults'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: From its action on digestion and assimilation, it acts as a tonic to restore normal appetite and induce healthy weight gain.',
        modalities: {
          worse: 'Irregular eating, fatigue',
          better: 'Regular nourishing food, fresh air'
        },
        aliases: ['alfalfa', 'medicago sativa']
      },
      {
        name: 'Lycopodium Clavatum',
        commonName: 'Club Moss',
        potency: '30C / 200C',
        dosage: '4 pills in the evening',
        keynotes: [
          'Excessive hunger, but after eating the very first few mouthfuls, feels intensely full and bloated',
          'Marked flatulent distension of lower abdomen; symptoms consistently worse between 4:00 PM and 8:00 PM',
          'Craves warm foods and sweet desserts; sour stomach regurgitations and sluggish hepatic function'
        ],
        materiaMedicaNotes: 'Kent Repertory: Atonic dyspepsia with early satiety, excessive flatulence, and sluggish digestion originating from hepatic insufficiency.',
        modalities: {
          worse: '4 PM to 8 PM, cold food, cabbage, beans, right side',
          better: 'Warm drinks, motion, eructations, loosening garments'
        },
        aliases: ['lycopodium', 'lyco']
      },
      {
        name: 'China (Cinchona Officinalis)',
        commonName: 'Peruvian Bark',
        potency: 'Q / 30C',
        dosage: '10 drops in water twice daily before meals',
        keynotes: [
          'Anorexia and flatulent dyspepsia after debilitating illness or loss of vital fluids',
          'Entire abdomen feels packed full, tight and distended; eructations give no relief whatever',
          'Aversion to all food, bitter taste in mouth, general exhaustion, anemia and pale sallow complexion'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Restores lost appetite and tone to gastrointestinal mucosa following prostration and fluid depletion.',
        modalities: {
          worse: 'Slightest touch, drafts, after eating, night, loss of fluids',
          better: 'Hard pressure, warmth, bending double'
        },
        aliases: ['china', 'cinchona officinalis', 'china off']
      },
      {
        name: 'Gentiana Lutea',
        commonName: 'Yellow Gentian',
        potency: 'Q (Mother Tincture)',
        dosage: '5-10 drops in water 20 minutes before meals',
        keynotes: [
          'Classical bitter tonic acting directly on gastric salivary glands and peptic enzymes',
          'Complete anorexia with thick yellowish coated tongue and acid taste',
          'Atonic sluggish stomach with dull umbilical fullness and nausea after eating'
        ],
        materiaMedicaNotes: 'Boericke Materia Medica: Acts as a powerful bitter tonic to kindle natural digestive appetite and gastric peristalsis.',
        modalities: {
          worse: 'Heavy cold foods',
          better: 'Light warm meals'
        },
        aliases: ['gentiana lutea', 'gentiana']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Alfalfa Tonic',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml / 500 ml Syrup',
        indications: 'Rejuvenating health and appetite tonic; stimulates wholesome appetite, aids digestion and counteracts fatigue.',
        dosage: '1-2 teaspoonfuls before meals 3 times daily.',
        mrp: 150,
        aliases: ['alfalfa tonic', 'sbl alfalfa', 'alfalfa syrup']
      },
      {
        name: 'Bakson Appetiser',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml / 200 ml Syrup',
        indications: 'Effective pediatric and adult appetite restorative; eliminates anorexia, improves digestive fire and assimilation.',
        dosage: '1 teaspoonful 3 times daily before meals.',
        mrp: 140,
        aliases: ['appetiser', 'bakson appetiser', 'appetiser syrup']
      },
      {
        name: 'Dr. Reckeweg R31 (Anorexia Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Biological remedy for lack of appetite, weight loss, digestive debility and nutritional deficiencies.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r31', 'r-31', 'reckeweg 31', 'dr reckeweg r31']
      },
      {
        name: 'New Life Appetex',
        brand: 'New Life',
        company: 'New Life Laboratories',
        country: 'India',
        bottleSize: '100 ml Syrup',
        indications: 'Restores natural hunger, cures atonic dyspepsia, eliminates poor food absorption in children and adults.',
        dosage: '1-2 teaspoons 3 times a day before meals.',
        mrp: 120,
        aliases: ['appetex', 'new life appetex', 'nl appetex']
      }
    ],
    dietAndRegimen: 'Eat frequent small, freshly cooked warm meals. Include ginger water, cumin decoction, and fresh seasonal fruits. Avoid excess cold sodas, greasy fried snacks, and irregular snacking.',
    warningNotes: 'If loss of appetite persists with unprovoked significant weight loss or pale conjunctiva, check Complete Blood Count (CBC) and ESR to rule out occult systemic pathology.'
  },
  {
    id: 'vomiting-nausea',
    nameEn: 'Vomiting, Nausea & Gastric Regurgitation',
    nameBn: 'বমি, বমি বমি ভাব ও পাকস্থলীর অস্বস্তি',
    chipLabel: 'Vomiting / বমি',
    pathology: 'Acute Gastritis, Dyspepsia, Motion Sickness, Hyperemesis & Gastro-esophageal Reflux',
    miasm: 'Psoric Gastric Catarrh with Spasmodic Vomiting Diathesis',
    typicalPresentation: 'Persistent nausea, vomiting of food or bile, retching, cold sweat, motion sickness and gastric irritation',
    keywords: [
      'vomiting', 'nausea', 'vomit', 'emesis', 'retching', 'hyperemesis', 'morning sickness',
      'motion sickness', 'sick to stomach', 'throw up', 'throwing up', 'nauseous',
      // Bengali
      'বমি', 'বমি বমি ভাব', 'বমি হওয়া', 'বমি হওয়া', 'বমিভাব', 'গা গুলানো', 'অতিরিক্ত বমি', 'বমি ও পেটের সমস্যা'
    ],
    classicalRemedies: [
      {
        name: 'Ipecacuanha 30C',
        commonName: 'Ipecac Root',
        potency: '30C',
        dosage: '4 pills every 2-3 hours during acute nausea and vomiting',
        keynotes: [
          'Persistent nausea, clean tongue with unyielding desire to vomit',
          'Vomiting does not relieve the nausea; constant distress in stomach',
          'Profuse salivation, thirstlessness, vomiting of white glairy mucus or ingested food'
        ],
        materiaMedicaNotes: 'Boericke: Incessant, violent nausea and vomiting with clean, uncoated tongue. Nausea not relieved by vomiting.',
        modalities: {
          worse: 'Warm room, periodic, lying down, rich food',
          better: 'Open air, resting quietly'
        },
        aliases: ['ipecac', 'ipecacuanha', 'ipecacuanha 30c']
      },
      {
        name: 'Arsenicum Album 30C',
        commonName: 'White Oxide of Arsenic',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Vomiting with burning thirst, immediately after eating or drinking the least food or water',
          'Burning pains in epigastrium temporarily relieved by warm drinks or warmth',
          'Rapid prostration, great anxiety, restlessness, and fear of death'
        ],
        materiaMedicaNotes: 'Kent: Intense burning in stomach, vomiting provoked by the slightest sip of water. Great thirst for frequent sips of warm water.',
        modalities: {
          worse: 'Cold drinks, midnight (1-2 AM), sight or smell of food',
          better: 'Warm drinks, heat, warm room'
        },
        aliases: ['arsenicum', 'arsenicum album', 'ars alb', 'arsenicum album 30c']
      },
      {
        name: 'Tabacum 30C',
        commonName: 'Tobacco',
        potency: '30C',
        dosage: '4 drops in water during acute motion sickness or nausea',
        keynotes: [
          'Deathly nausea and violent vomiting with cold sweat, particularly on forehead',
          'Motion sickness, car sickness, sea sickness with pale sunken face and faintness',
          'Uncovering the abdomen and exposing body to cool fresh open air brings marked relief'
        ],
        materiaMedicaNotes: 'Boericke: Incessant nausea, vomiting with deathly pallor and cold clammy sweat. Ameliorated by cool open air and uncovering belly.',
        modalities: {
          worse: 'Motion, warmth, opening eyes, smell of tobacco',
          better: 'Fresh cold open air, uncovering abdomen'
        },
        aliases: ['tabacum', 'tabacum 30c', 'tabac']
      },
      {
        name: 'Nux Vomica 30C',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills twice daily, especially at night and early morning',
        keynotes: [
          'Ineffectual retching, constant nausea; feelings that if one could only vomit one would feel better',
          'Vomiting from dietary indiscretions, rich spicy foods, coffee, alcohol, or gastric overload',
          'Hypersensitive, chilly, irritable disposition with sour bitter eructations'
        ],
        materiaMedicaNotes: 'Kent: The patient gags and retches ineffectually in the morning. Great gastric distress relieved after vomiting occurs.',
        modalities: {
          worse: 'Morning, after eating, cold air, mental strain',
          better: 'Warmth, rest, momentary relief after vomiting'
        },
        aliases: ['nux vomica', 'nux', 'nux vomica 30c']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R52 (Vomiting / Gastric Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nausea, vomiting, morning sickness of pregnancy, sea sickness, nervous gastropathy and pylorospasm.',
        dosage: '10-15 drops in water every 1-2 hours in acute vomiting; reduce to 3 times daily before meals.',
        mrp: 310,
        aliases: ['r52', 'r-52', 'reckeweg 52', 'dr reckeweg r52', 'vomiting drops']
      },
      {
        name: 'Bakson Gastro Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 75 Tablets',
        indications: 'Effective formulation for nausea, persistent vomiting, dyspepsia, gastric acidity and digestive reflux.',
        dosage: '1 teaspoonful or 1 tablet dissolved in warm water 3 times daily before meals.',
        mrp: 150,
        aliases: ['gastro aid', 'bakson gastro aid', 'gastro-aid']
      },
      {
        name: 'SBL Nux Vomica Mother Q',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Mother Tincture',
        indications: 'Classical mother tincture formulation for toxic stomach irritation, nausea, ineffectual retching, and digestive spasms.',
        dosage: '5-10 drops in 1/4 cup lukewarm water after meals or during acute retching.',
        mrp: 140,
        aliases: ['sbl nux vomica q', 'nux vomica q', 'nux vomica mother q', 'nux vomica tincture']
      }
    ],
    dietAndRegimen: 'Sip cold ice chips or lukewarm mint/ginger water in small spoonfuls. Avoid solid, spicy, or fried meals until vomiting ceases. Maintain hydration with electrolyte water.',
    warningNotes: 'If vomiting is accompanied by blood (hematemesis), severe abdominal rigidity, or acute dehydration, immediately refer for intravenous fluid support and ultrasound.'
  },
  {
    id: 'body-pain-myalgia',
    nameEn: 'Body Pain, Generalized Aches & Myalgia',
    nameBn: 'গা হাত পা ব্যথা, শরীর ব্যথা ও মাংসপেশির যন্ত্রণা',
    chipLabel: 'Body Pain / শরীর ব্যথা',
    pathology: 'Generalized Myalgia, Musculoskeletal Strain, Post-viral Bodyache & Fibrositis',
    miasm: 'Psoric-Sycotic Musculoskeletal Diathesis',
    typicalPresentation: 'Generalized soreness, aching in limbs and trunk, stiffness after rest, muscular fatigue',
    keywords: [
      'body pain', 'pain', 'body ache', 'myalgia', 'aching', 'muscular pain', 'sore muscles',
      'muscle ache', 'generalized ache', 'physical exhaustion',
      // Bengali
      'ব্যথা', 'গা হাত পা ব্যথা', 'শরীর ব্যথা', 'গা ব্যথা', 'মাংসপেশির ব্যথা', 'বেদনা', 'যন্ত্রণা', 'শরীর ম্যাচ ম্যাচ করা'
    ],
    classicalRemedies: [
      {
        name: 'Rhus Tox 200C',
        commonName: 'Poison Ivy',
        potency: '200C',
        dosage: '4 pills twice daily in morning and evening',
        keynotes: [
          'Severe stiffness and aching in muscles and fibrous tissues; worse on first beginning to move',
          'Distinctly relieved by continued gentle motion, walking, and warm dry applications',
          'Ailments from getting wet in rain, cold damp weather, or severe over-exertion'
        ],
        materiaMedicaNotes: 'Boericke: Rhus Tox is the premier remedy for strained, stiff, painful muscles and ligaments relieved by continuous movement.',
        modalities: {
          worse: 'Rest, beginning of motion, cold damp weather, midnight',
          better: 'Continued motion, warm dry heat, warm baths'
        },
        aliases: ['rhus tox', 'rhus toxicodendron', 'rhus tox 200c']
      },
      {
        name: 'Bryonia Alba 200C',
        commonName: 'White Bryony',
        potency: '200C',
        dosage: '4 pills twice daily before meals',
        keynotes: [
          'Sharp, tearing, stitching muscular aches aggravated by the slightest motion',
          'Great desire to lie perfectly still in bed; pressure on painful side gives relief',
          'Associated with excessive dryness of mucous membranes and thirst for large drinks of cold water'
        ],
        materiaMedicaNotes: 'Kent: Cardinal modality is aggravation from any movement, even breathing deeply. Relief from absolute quiet and pressure.',
        modalities: {
          worse: 'Any movement, morning, warm rooms',
          better: 'Lying on painful side, absolute rest, cold drinks'
        },
        aliases: ['bryonia', 'bryonia alba', 'bryonia alba 200c']
      },
      {
        name: 'Mag Phos 6X',
        commonName: 'Phosphate of Magnesia',
        potency: '6X',
        dosage: '4 tablets dissolved in warm water 3 times daily',
        keynotes: [
          'Spasmodic muscular cramps, sudden shooting darting pains, and neuralgic twitches',
          'Prompt and unmistakable relief from hot water bottles, warm fomentation, and hard pressure',
          'Worse from cold drafts, cold touch, and exposure to cold wind'
        ],
        materiaMedicaNotes: 'Boericke: The great analgesic and antispasmodic tissue remedy for cramps and sharp pains. Heat and pressure are keynotes.',
        modalities: {
          worse: 'Cold drafts, cold touch, cold air',
          better: 'Warmth, hot fomentation, pressure, doubling up'
        },
        aliases: ['mag phos', 'magnesia phos', 'mag phos 6x']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R11 (Lumbago & Body Pain Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic muscular aches, lumbago, backache, and rheumatic stiffness.',
        dosage: '10-15 drops in water 3 times daily; in acute flare-ups every 2 hours.',
        mrp: 310,
        aliases: ['r11', 'r-11', 'reckeweg 11', 'dr reckeweg r11']
      },
      {
        name: 'Bakson Rheum Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 75 Tablets',
        indications: 'Relieves general bodyaches, muscular tension, limb pain, fatigue and stiffness.',
        dosage: '1 teaspoonful or 1 tablet dissolved in warm water 3 times daily.',
        mrp: 155,
        aliases: ['rheum aid', 'bakson rheum aid', 'b11']
      },
      {
        name: 'SBL Orthomuv',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup / 60 ml Oil',
        indications: 'Soothing biological formula for musculoskeletal aches, joint stiffness, and physical exhaustion.',
        dosage: '1 teaspoonful 3 times daily after meals.',
        mrp: 190,
        aliases: ['orthomuv', 'sbl orthomuv', 'orthomuv oil']
      }
    ],
    dietAndRegimen: 'Keep warm and protected from cold drafts. Drink warm soups or ginger decoction. Ensure adequate physical rest and avoid heavy strenuous lifting.',
    warningNotes: 'If body pain is accompanied by high spiking fever with rash or neck stiffness, evaluate for acute systemic infection.'
  },
  {
    id: 'spondylitis-cervical',
    nameEn: 'Cervical Spondylitis & Neck Pain',
    nameBn: 'সার্ভাইকাল স্পন্ডিলাইটিস ও ঘাড়ের তীব্র ব্যথা',
    chipLabel: 'Spondylitis / ঘাড় ব্যথা',
    pathology: 'Cervical Spondylosis, Disc Prolapse, Suboccipital Neuralgia & Stiff Neck',
    miasm: 'Sycotic-Rheumatic Spine Degenerative Diathesis',
    typicalPresentation: 'Severe stiffness and aching pain in cervical spine radiating to shoulders, numbness in fingers, aggravated by turning head or cold',
    keywords: [
      'spondylitis', 'cervical spondylitis', 'cervical spondylosis', 'neck pain', 'stiff neck', 'cervical',
      // Bengali
      'ঘাড় ব্যথা', 'ঘাড় ব্যথা', 'ঘাড়ে ব্যথা', 'ঘাড়ের ব্যথা', 'ঘাড় শক্ত', 'ঘাড় শক্ত', 'সার্ভাইকাল', 'spondin'
    ],
    classicalRemedies: [
      {
        name: 'Rhus Tox 200C',
        commonName: 'Poison Ivy',
        potency: '200C',
        dosage: '4 pills twice daily in morning and evening',
        keynotes: [
          'Stiff, aching neck and trapezius muscles on waking; worse on first beginning to move',
          'Relieved by continuous gentle movement, stretching, and hot dry applications',
          'Ailments from cold drafts on neck, sleeping in front of air conditioners or fans'
        ],
        materiaMedicaNotes: 'Boericke: Premier polychrest for cervical stiffness, ligamentous strain and rheumatic tension relieved by continued motion.',
        modalities: {
          worse: 'Beginning of motion, cold damp drafts, rest',
          better: 'Continued motion, hot fomentation, warmth'
        },
        aliases: ['rhus tox', 'rhus toxicodendron', 'rhus tox 200c']
      },
      {
        name: 'Kalmia Lat 30C',
        commonName: 'Mountain Laurel',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Neuralgic pain in cervical spine rapidly shooting downwards into shoulder, arm and fingers',
          'Numbness, tingling and cracking in cervical vertebrae on turning head',
          'Pain shifts rapidly; accompanied by stiff feeling in neck muscles'
        ],
        materiaMedicaNotes: 'Kent: Severe neuralgic pains following nerves from neck down the arm to fingertips with numbness and weakness.',
        modalities: {
          worse: 'Moving neck, stooping, cold air',
          better: 'Rest, lying flat with head supported'
        },
        aliases: ['kalmia', 'kalmia lat', 'kalmia latifolia', 'kalmia lat 30c']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Spondin Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Renowned formulation for spondylitis, cervical and lumbosacral pain, stiff neck, vertiginous sensation, and shooting radiating pain into shoulders and arms.',
        dosage: '10-15 drops in 1/4 cup lukewarm water 3-4 times daily.',
        mrp: 155,
        aliases: ['spondin', 'sbl spondin', 'spondin drops']
      },
      {
        name: 'Dr. Reckeweg R11 (Lumbago & Spine Pain Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Myalgia, cervical syndrome, acute rheumatic stiffness, lumbago, and spinal disc discomfort.',
        dosage: '10-15 drops in water 3 times daily; in acute agony every 2 hours.',
        mrp: 310,
        aliases: ['r11', 'r-11', 'reckeweg 11', 'dr reckeweg r11']
      }
    ],
    dietAndRegimen: 'Use thin orthopaedic pillow. Avoid sleeping with high pillows or looking down at phone screens for prolonged periods. Do gentle neck isometric exercises. Apply warm fomentation.',
    warningNotes: 'If neck pain causes progressive arm weakness, loss of grip, or persistent dizziness on turning neck, obtain cervical spine X-ray/MRI to evaluate nerve root compression.'
  },
  {
    id: 'corn-callus',
    nameEn: 'Corns, Callosities & Plantar Hyperkeratosis',
    nameBn: 'পায়ের কড়া, কড়া ও চামড়া শক্ত হওয়া',
    chipLabel: 'Corn / কড়া',
    pathology: 'Circumscribed Hyperkeratosis, Clavus, Plantar Callus & Painful Pressure Keratoma',
    miasm: 'Sycotic Cutaneous Proliferative Diathesis',
    typicalPresentation: 'Painful localized thickening of epidermis on soles or toes with central hard core, extremely sensitive to walking, touch and pressure',
    keywords: [
      'corn', 'corns', 'callus', 'calluses', 'callosity', 'clavus', 'hyperkeratosis',
      // Bengali
      'কড়া', 'কড়া', 'পায়ের কড়া', 'পায়ের কড়া', 'পায়ের কড়া', 'চামড়া শক্ত', 'কড়া পড়া'
    ],
    classicalRemedies: [
      {
        name: 'Antim Crudum 200C',
        commonName: 'Black Sulphide of Antimony',
        potency: '200C',
        dosage: '4 pills once daily at night or alternate days',
        keynotes: [
          'Horny, thick, hard callosities and corns on soles of feet and palms',
          'Feet so tender and painful the patient can scarcely walk on pavement or hard floor',
          'Thick milky white coated tongue with gastric irritability'
        ],
        materiaMedicaNotes: 'Boericke: Specific for horny cutaneous excrescences, painful corns and callosities where feet are exceedingly tender to walking.',
        modalities: {
          worse: 'Walking on bare feet, heat of sun, cold baths',
          better: 'Rest, open air, resting feet elevated'
        },
        aliases: ['antim crud', 'antim crudum', 'antimonium crudum', 'antim crud 200c']
      },
      {
        name: 'Thuja Occ 200C',
        commonName: 'Arbor Vitae',
        potency: '200C',
        dosage: '4 pills twice weekly in the morning',
        keynotes: [
          'Chief sycotic remedy for epithelial overgrowth, painful corns, warts, and excrescences',
          'Stinging, burning pains in corns with hyperesthesia of the affected sole',
          'Skin hyperkeratosis with tendency to glandular indurations'
        ],
        materiaMedicaNotes: 'Kent: Master sycotic remedy for dissolving morbid cutaneous excrescences, corns, warty outgrowths and callous skin.',
        modalities: {
          worse: 'Cold damp weather, 3 AM and 3 PM',
          better: 'Warm dry conditions'
        },
        aliases: ['thuja', 'thuja occ', 'thuja occidentalis', 'thuja 200c']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Thuja Ointment / Corn Paint',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube / 15 ml Liquid Paint',
        indications: 'Topical therapeutic application for softening and dissolving painful corns, plantar calluses, hard fissures and warty excrescences.',
        dosage: 'Clean and dry affected foot with warm water, apply gently twice daily onto the corn.',
        mrp: 110,
        aliases: ['thuja ointment', 'corn paint', 'sbl thuja ointment', 'sbl corn paint']
      },
      {
        name: 'Dr. Reckeweg R21 (Skin Reconstitution Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Biological terrain remedy for chronic cutaneous proliferation, indurated tissues, corns and dermopathy.',
        dosage: '10-15 drops in water twice daily before meals.',
        mrp: 310,
        aliases: ['r21', 'r-21', 'reckeweg 21']
      }
    ],
    dietAndRegimen: 'Wear well-fitted, wide-toed cushioned footwear with silicon orthotic pads to relieve direct pressure. Never cut or scrape corns with blades or unsterilized tools.',
    warningNotes: 'Diabetic patients with corns or callosities must never self-excise lesions due to high risk of diabetic foot ulcers and secondary infection.'
  },
  {
    id: 'travel-sickness-motion',
    nameEn: 'Travel Sickness, Motion Sickness & Car Sickness',
    nameBn: 'গাড়িতে বমি, গতিজনিত অসুস্থতা ও মাথা ঘোরা',
    chipLabel: 'Motion Sickness / গাড়িতে বমি',
    pathology: 'Kinetosis, Vestibular-Ocular Mismatch, Car/Sea/Air Sickness & Acute Vertiginous Nausea',
    miasm: 'Psoric Neuropathic & Vestibular Hyperreactivity',
    typicalPresentation: 'Nausea, vomiting, cold clammy sweat, dizziness and extreme malaise triggered by travelling in car, bus, boat, train or airplane',
    keywords: [
      'travel sickness', 'motion sickness', 'car sickness', 'sea sickness', 'air sickness', 'kinetosis',
      // Bengali
      'গাড়িতে বমি', 'গাড়িতে বমি', 'বাসে বমি', 'ভ্রমণে বমি', 'গাড়ি চড়লে বমি', 'গাড়ি চড়লে বমি', 'গাড়িতে মাথা ঘোরা', 'জার্নিতে বমি'
    ],
    classicalRemedies: [
      {
        name: 'Cocculus Indicus 30C',
        commonName: 'Indian Cockle',
        potency: '30C',
        dosage: '4 pills 1 hour before travel, repeat during journey every 2-3 hours if needed',
        keynotes: [
          'Specific simillimum for motion sickness, sea sickness, and car or train travel distress',
          'Deathly nausea, vertigo with sensation of hollowness or emptiness in head and stomach',
          'Aversion to food; sight or smell of food disgusts; worse from lack of sleep or night watching'
        ],
        materiaMedicaNotes: 'Boericke: Invaluable remedy for car sickness, sea sickness, and nausea from traveling or passive motion.',
        modalities: {
          worse: 'Motion of car or carriage, sitting up, lack of sleep',
          better: 'Lying quietly on side, warmth'
        },
        aliases: ['cocculus', 'cocculus indicus', 'cocculus 30c']
      },
      {
        name: 'Tabacum 30C',
        commonName: 'Tobacco',
        potency: '30C',
        dosage: '4 drops in water immediately on onset of nausea or cold sweating',
        keynotes: [
          'Deathly sinking nausea with icy cold sweat, especially on forehead and face',
          'Violent vomiting aggravated by opening eyes or moving head',
          'Uncovering the abdomen and exposing body to cool fresh open air brings instant relief'
        ],
        materiaMedicaNotes: 'Kent: Most violent motion sickness with pale, cold skin, cold clammy sweat and intense nausea; relieved by uncovering belly and cool air.',
        modalities: {
          worse: 'Motion, warmth, opening eyes',
          better: 'Fresh cold open air, uncovering abdomen'
        },
        aliases: ['tabacum', 'tabacum 30c', 'tabac']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R52 (Vomiting & Motion Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nausea, vomiting, motion sickness in cars, trains, boats or planes, morning sickness and hyperemesis.',
        dosage: '10-15 drops in a tablespoon of water before starting journey; repeat every 1-2 hours during journey.',
        mrp: 310,
        aliases: ['r52', 'r-52', 'reckeweg 52', 'dr reckeweg r52']
      },
      {
        name: 'Bakson Gastro Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 75 Tablets',
        indications: 'Soothes digestive nausea, motion regurgitation, nervous vomiting and acidity during journey.',
        dosage: '1 tablet or 1 teaspoonful before journey.',
        mrp: 150,
        aliases: ['gastro aid', 'bakson gastro aid']
      }
    ],
    dietAndRegimen: 'Eat a light, non-greasy snack before travelling; avoid empty stomach or overeating heavy oily foods. Sit in front seat facing direction of travel. Keep car window cracked for fresh airflow.',
    warningNotes: 'If motion sickness is accompanied by persistent nystagmus, ear ringing (tinnitus) or focal neurological signs outside of travel, evaluate for inner ear labyrinthitis or Ménière’s disease.'
  },
  {
    id: 'tingling-numbness-paresthesia',
    nameEn: 'Tingling, Numbness & Paresthesia (পা চিনচিন / ঝিঁঝিঁ)',
    nameBn: 'পা চিনচিন করা, অবশ ভাব ও হাত পায়ে ঝিঁঝিঁ ধরা',
    chipLabel: 'Tingling / পা চিনচিন',
    pathology: 'Peripheral Paresthesia, Nerve Irritation, Sensory Neuropathy & Acroparesthesia',
    miasm: 'Psoric-Sycotic Neuro-sensory Diathesis',
    typicalPresentation: 'Pins and needles sensation, prickling (চিনচিন), crawling insects sensation, burning numbness in feet, soles or fingers',
    keywords: [
      'পা চিনচিন', 'চিনচিন', 'হাত পা চিনচিন', 'পায়ে চিনচিন', 'পা ঝিঁঝিঁ', 'ঝিঁঝিঁ', 'হাত পা ঝিঁঝিঁ', 'অবশ', 'হাত পা অবশ',
      'tingling', 'numbness', 'pins and needles', 'paresthesia', 'prickling', 'burning soles', 'formication'
    ],
    classicalRemedies: [
      {
        name: 'Hypericum 200C',
        commonName: "'Arnica of the Nerves' (St. John's Wort)",
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Premier remedy for nerve injury, nerve irritation, shooting darting pains and tingling paresthesia',
          'Crawling, prickling sensations in extremities, hypersensitivity along peripheral nerve paths',
          'Relieves nerve inflammation, trauma, and burning neuralgic dysesthesia'
        ],
        materiaMedicaNotes: 'Boericke: Hypericum is to nerves what Arnica is to bruises. Indicated for intolerable tingling, burning and numbness along nerve tracts.',
        modalities: {
          worse: 'Cold, damp, fog, touch',
          better: 'Rest, warmth'
        },
        aliases: ['hypericum', 'hypericum perf', 'hypericum 200c']
      },
      {
        name: 'Kali Phos 6X',
        commonName: 'Phosphate of Potassium',
        potency: '6X',
        dosage: '4 tablets dissolved in warm water 3 times daily',
        keynotes: [
          'The supreme nerve nutrient tissue salt for nerve exhaustion, numbness, and tingling extremities',
          'Pins and needles feeling in hands and feet accompanied by nervous debility and physical fatigue',
          'Restores cellular nerve conduction and soothes irritable nerve fibers'
        ],
        materiaMedicaNotes: 'Schuessler & Boericke: Master biochemic nerve tissue salt for peripheral neuropathic numbness, pricking, and mental-physical exhaustion.',
        modalities: {
          worse: 'Physical exertion, cold air, after midnight',
          better: 'Warmth, rest, nourishment'
        },
        aliases: ['kali phos', 'kali phos 6x', 'potassium phosphate']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R36 (Neuralgia & Nervous Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nerve irritation, tingling, numbness, choreatic twitches, paresthesia and peripheral neuropathic sensitivity.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r36', 'r-36', 'reckeweg 36', 'dr reckeweg r36']
      },
      {
        name: 'SBL Five Phos 6X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g / 450g Tablets',
        indications: 'Comprehensive biochemic tonic for nerve vitality, peripheral paresthesias, numbness, and chronic neuromuscular fatigue.',
        dosage: '4 tablets dissolved in warm water 3 times daily.',
        mrp: 140,
        aliases: ['five phos', 'sbl five phos', '5 phos']
      }
    ],
    dietAndRegimen: 'Check Vitamin B12 and blood glucose levels. Ensure diet includes leafy greens, nuts, and whole grains. Avoid walking barefoot on ice-cold tiles or crossing legs for prolonged duration.',
    warningNotes: 'If tingling and numbness are progressive with loss of sensation, balance instability or foot drop, investigate for diabetic neuropathy or lumbar disc herniation.'
  },
  {
    id: 'fish-bone-throat',
    nameEn: 'Foreign Body Sensation & Fish Bone in Throat',
    nameBn: 'গলায় কাঁটা বা সূঁচ ফোটার অনুভূতি ও ক্ষত',
    chipLabel: 'Fish Bone / গলায় কাঁটা',
    pathology: 'Foreign Body Sensation & Fish Bone in Throat / গলায় কাঁটা বা সূঁচ ফোটার অনুভূতি',
    miasm: 'Psoric-Sycotic Irritation with Needle-like Pains',
    typicalPresentation: 'Sensation of a fish bone, needle or sharp splinter sticking in the throat; sharp stitching, pricking pain aggravated by swallowing saliva or food; persistent urge to swallow or cough.',
    keywords: [
      'কাঁটা', 'গলায় কাঁটা', 'মাছের কাঁটা', 'fish bone', 'bone in throat', 'splinter', 'foreign body throat',
      'গলায় কাঁটা', 'গলার কাঁটা', 'মাছের কাটা', 'গলায় কাটা', 'গলায় কাটা', 'কাটা', 'throat bone', 'splinter in throat', 'fishbone'
    ],
    classicalRemedies: [
      {
        name: 'Silicea (Silica) 30C / 200C',
        commonName: 'Pure Flint',
        potency: '30C / 200C',
        dosage: '4 pills twice daily or 4 pills every 3 hours in acute distress',
        keynotes: [
          'Promotes expulsion of foreign bodies, fish bones, splinters from tissues',
          'Sharp needle-like stitching sensations in throat aggravated on swallowing cold drinks',
          'Suppurative tendency and profound sensitivity to cold drafts; chilly patient'
        ],
        materiaMedicaNotes: 'Kent & Boericke: Master remedy to promote suppuration and expulsion of foreign bodies, fish bones, and splinters embedded in tissues; needle-like stitching sensations.',
        modalities: {
          worse: 'Cold drafts, swallowing, morning, uncovery',
          better: 'Warmth, warm drinks, wrapping head and neck warmly'
        },
        aliases: ['silicea', 'silica', 'silicea 200c', 'silicea 30c']
      },
      {
        name: 'Hepar Sulphuris Calcareum 30C / 200C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily dissolved in warm water',
        keynotes: [
          'Sticking, splinter-like pain in throat on swallowing, extending to ears',
          'Extreme hypersensitivity to cold air, touching neck, or swallowing the slightest morsel',
          'Throat feels plugged, inflamed with sharp sticking like a fish bone or thorn'
        ],
        materiaMedicaNotes: 'Boericke: Sharp splinter-like pains extending to ears on swallowing. Extreme chilliness and hypersensitivity to touch and cold air.',
        modalities: {
          worse: 'Cold air, swallowing saliva or cold food, drafts, touch',
          better: 'Warmth, warm drinks, wrapping neck warmly'
        },
        aliases: ['hepar sulph', 'hepar sulphuris', 'hepar sulph 200c', 'hepar']
      },
      {
        name: 'Argentum Nitricum 30C',
        commonName: 'Silver Nitrate',
        potency: '30C',
        dosage: '4 pills 3 times daily away from meals',
        keynotes: [
          'Sensation of a fish bone or splinter embedded in throat when swallowing',
          'Painful raw inflammation, dark redness of fauces, uvula relaxed and elongated',
          'Persistent clearing of tenacious mucus with tickling cough'
        ],
        materiaMedicaNotes: 'Kent: Sensation as if a splinter or fish bone were lodged in the pharynx; worse swallowing food or turning neck.',
        modalities: {
          worse: 'Warm room, swallowing food, emotional agitation',
          better: 'Cool open air, cold drinks'
        },
        aliases: ['arg nit', 'argentum nitricum', 'argentum']
      },
      {
        name: 'Nitricum Acidum 30C',
        commonName: 'Nitric Acid',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Sharp splinter-like pains on swallowing food or liquids',
          'Stitching pains as if sticking with pins or sharp fish needles, agonizing on swallowing',
          'Ulcerated sore throat with putrid breath and offensive secretions'
        ],
        materiaMedicaNotes: 'Boericke: Splinter-like pains appearing and disappearing quickly. Mucous membranes stitch and burn like a needle on deglutition.',
        modalities: {
          worse: 'Swallowing, cold changes of weather, night, jarring',
          better: 'Warmth, gentle warmth'
        },
        aliases: ['nitric acid', 'nitricum acidum', 'nit acid']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Throat Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves sharp stabbing pain & inflamed throat tissue, sensation of throat obstruction and painful swallowing.',
        dosage: '1 tablet dissolved or chewed in mouth every 2 hours until relief.',
        mrp: 165,
        aliases: ['throat aid', 'bakson throat aid', 'throat tablets']
      },
      {
        name: 'Dr. Reckeweg R1 (Biological Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Reduces local throat inflammation, catarrhal congestion, glandular swelling and mucosal irritation.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 310,
        aliases: ['r1', 'r-1', 'reckeweg 1', 'dr reckeweg r1']
      },
      {
        name: 'SBL Tonsilat Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Relieves pain on swallowing & throat soreness, painful inflamed tonsils and pharyngeal irritation.',
        dosage: '2-4 tablets dissolved in mouth 3 times daily.',
        mrp: 155,
        aliases: ['tonsilat', 'sbl tonsilat', 'tonsil aid']
      }
    ],
    dietAndRegimen: 'Drink warm water, lukewarm honey-lemon water, or soft boiled rice. Avoid hard dry crusts, chips, sharp crunchy snacks, and very cold drinks that aggravate throat spasm.',
    warningNotes: 'If persistent foreign body sensation with breathing difficulty, acute stridor, or active bleeding occurs, seek immediate laryngoscopy/ENT examination for direct foreign body extraction.'
  },
  ...EXPANDED_CLINICAL_CONDITIONS,
  ...ADDITIONAL_CLINICAL_CONDITIONS
];

/**
 * Dynamically constructs a tailored ClinicalCondition for symptoms that do not match
 * any predefined database condition. This guarantees that unrelated symptoms NEVER default to generic remedies.
 */
function buildDynamicCondition(symptomQuery: string): ClinicalCondition | null {
  const q = symptomQuery.toLowerCase().trim();

  // 0. FISH BONE / FOREIGN BODY IN THROAT / গলায় কাঁটা
  if (
    q.includes('কাঁটা') ||
    (q.includes('কাটা') && (q.includes('গলা') || q.includes('throat'))) ||
    q.includes('গলায় কাঁটা') ||
    q.includes('গলায় কাঁটা') ||
    q.includes('মাছের কাঁটা') ||
    q.includes('মাছের কাটা') ||
    q.includes('fish bone') ||
    q.includes('bone in throat') ||
    q.includes('splinter') ||
    q.includes('foreign body throat') ||
    q.includes('fishbone')
  ) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'fish-bone-throat');
    if (cond) return cond;
  }

  // 0A. SPONDYLITIS & NECK PAIN / ঘাড় ব্যথা
  if (q.includes('spondylitis') || q.includes('cervical') || q.includes('neck pain') || q.includes('stiff neck') || q.includes('ঘাড় ব্যথা') || q.includes('ঘাড় ব্যথা') || q.includes('ঘাড়ে ব্যথা') || q.includes('ঘাড়ের ব্যথা') || q.includes('ঘাড় শক্ত') || q.includes('ঘাড় শক্ত') || q.includes('সার্ভাইকাল') || q.includes('spondin')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'spondylitis-cervical');
    if (cond) return cond;
  }

  // 0B. CORN / CALLUS / কড়া
  if (q.includes('corn') || q.includes('corns') || q.includes('callus') || q.includes('calluses') || q.includes('callosity') || q.includes('কড়া') || q.includes('কড়া') || q.includes('পায়ের কড়া') || q.includes('পায়ের কড়া') || q.includes('পায়ের কড়া') || q.includes('চামড়া শক্ত') || q.includes('clavus')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'corn-callus');
    if (cond) return cond;
  }

  // 0C. TRAVEL SICKNESS / MOTION SICKNESS / গাড়িতে বমি
  if (q.includes('travel sickness') || q.includes('motion sickness') || q.includes('car sickness') || q.includes('sea sickness') || q.includes('গাড়িতে বমি') || q.includes('গাড়িতে বমি') || q.includes('বাসে বমি') || q.includes('ভ্রমণে বমি') || q.includes('গাড়ি চড়লে বমি') || q.includes('গাড়ি চড়লে বমি') || q.includes('গাড়িতে মাথা ঘোরা') || q.includes('জার্নিতে বমি')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'travel-sickness-motion');
    if (cond) return cond;
  }

  // 0D. PA CHINCHIN / TINGLING / NUMBNESS / পা চিনচিন
  if (q.includes('পা চিনচিন') || q.includes('চিনচিন') || q.includes('হাত পা চিনচিন') || q.includes('পায়ে চিনচিন') || q.includes('পা ঝিঁঝিঁ') || q.includes('ঝিঁঝিঁ') || q.includes('হাত পা ঝিঁঝিঁ') || q.includes('অবশ') || q.includes('হাত পা অবশ') || q.includes('tingling') || q.includes('numbness') || q.includes('pins and needles') || q.includes('paresthesia') || q.includes('burning soles')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'tingling-numbness-paresthesia');
    if (cond) return cond;
  }

  // 1. VOMITING / NAUSEA / বমি
  if (q.includes('vomit') || q.includes('nausea') || q.includes('বমি') || q.includes('nauseous') || q.includes('retching') || q.includes('emesis') || q.includes('গা গুলানো') || q.includes('morning sickness')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'vomiting-nausea');
    if (cond) return cond;
  }

  // 2. FEVER / PYREXIA / জ্বর
  if (q.includes('fever') || q.includes('জ্বর') || q.includes('গা গরম') || q.includes('pyrexia') || q.includes('febrile') || q.includes('তাপমাত্রা') || q.includes('chills') || q.includes('rigor')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'fever-pyrexia');
    if (cond) return cond;
  }

  // 3. DYSENTERY & DIARRHEA / আমাশয় ও পেট খারাপ
  if (q.includes('dysentery') || q.includes('diarrhea') || q.includes('diarrhoea') || q.includes('loose motion') || q.includes('loose stool') || q.includes('আমাশয়') || q.includes('আমআশা') || q.includes('ডায়রিয়া') || q.includes('পেট খারাপ') || q.includes('পাতলা পায়খানা') || q.includes('পেটে মোচড়') || q.includes('tenesmus') || q.includes('amoebic')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'dysentery-diarrhea');
    if (cond) return cond;
  }

  // 4. SCIATICA & NERVE PAIN / সায়াটিকা ও কোমর-পা ব্যথা
  if (q.includes('sciatica') || q.includes('sitica') || q.includes('সায়াটিকা') || q.includes('সায়াটিকা') || q.includes('সিটিকা') || q.includes('কোমর থেকে পা') || q.includes('কোমর-পা') || q.includes('কোমর-পা ব্যথা') || q.includes('পা ব্যথা') || q.includes('পায়ে টান') || q.includes('রগে টান') || q.includes('shooting pain') || q.includes('radiculopathy') || q.includes('sciatic')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'sciatica-nerve-pain');
    if (cond) return cond;
  }

  // 5. NEURO PROBLEM / NEUROPATHY / নার্ভের সমস্যা
  if (q.includes('neuro') || q.includes('nerve') || q.includes('neuropathy') || q.includes('paralysis') || q.includes('paresis') || q.includes('numbness') || q.includes('tingling') || q.includes('pins and needles') || q.includes('burning soles') || q.includes('নার্ভ') || q.includes('নার্ভের সমস্যা') || q.includes('স্নায়বিক') || q.includes('অসারতা') || q.includes('প্যারালাইসিস') || q.includes('ঝিঁঝিঁ') || q.includes('হাত পা কাঁপা')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'neuro-problem-neuropathy');
    if (cond) return cond;
  }

  // 6. BODY PAIN / GENERAL PAIN / ব্যথা / গা হাত পা ব্যথা
  if (q.includes('pain') || q.includes('body pain') || q.includes('body ache') || q.includes('ব্যথা') || q.includes('গা হাত পা ব্যথা') || q.includes('শরীর ব্যথা') || q.includes('গা ব্যথা') || q.includes('myalgia') || q.includes('মাংসপেশির ব্যথা') || q.includes('বেদনা') || q.includes('যন্ত্রণা') || q.includes('ম্যাচ ম্যাচ')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'body-pain-myalgia');
    if (cond) return cond;
  }

  // 7. ARTHRITIS & JOINT PAIN / বাত ও গাঁটের ব্যথা
  if (q.includes('arthritis') || q.includes('osteoarthritis') || q.includes('joint pain') || q.includes('knee') || q.includes('gout') || q.includes('morning stiffness') || q.includes('বাত') || q.includes('বাতের ব্যথা') || q.includes('হাঁটু ব্যথা') || q.includes('হাঁটু') || q.includes('গাঁটের ব্যথা') || q.includes('গাঁটে ব্যথা') || q.includes('ইউরিক অ্যাসিড') || q.includes('বাতরোগ')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'arthritis-joint-pain');
    if (cond) return cond;
  }

  // 8. UTERINE FIBROID & TUMORS / ফাইব্রয়েড ও টিউমার
  if (q.includes('fibroid') || q.includes('tumor') || q.includes('tumour') || q.includes('ফাইব্রয়েড') || q.includes('ফাইব্রয়েড') || q.includes('টিউমার') || q.includes('myoma') || q.includes('আর্বুদ') || q.includes('গিলটি') || q.includes('uterine fibroid')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'uterine-fibroid-tumor');
    if (cond) return cond;
  }

  // 9. KIDNEY STONE / রেনাল স্টোন
  if (q.includes('kidney stone') || q.includes('renal calculus') || q.includes('পাথর') || q.includes('কিডনি পাথর') || q.includes('nephrolithiasis') || q.includes('ureteric stone') || q.includes('calculi')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'kidney-stone');
    if (cond) return cond;
  }

  // 10. ACIDITY / GERD / গ্যাস
  if (q.includes('acidity') || q.includes('gas') || q.includes('heartburn') || q.includes('gerd') || q.includes('গ্যাস') || q.includes('এসিডিটি') || q.includes('অম্বল') || q.includes('বুক জ্বালা') || q.includes('ঢেকুর')) {
    const cond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'acidity-gerd');
    if (cond) return cond;
  }

  // 11. HEADACHE / MIGRAINE
  if (q.includes('headache') || q.includes('migraine') || q.includes('মাথা') || q.includes('শিরঃপীড়া') || q.includes('মাথাব্যথা')) {
    return {
      id: 'dynamic-headache',
      nameEn: `Headache & Cephalalgia: ${symptomQuery}`,
      nameBn: 'মাথাব্যথা ও মাইগ্রেনের চিকিৎসাসূচক বিশ্লেষণ',
      chipLabel: 'Headache Repertory',
      pathology: 'Cephalalgia, Vasomotor Migraine & Tension-type Headaches',
      miasm: 'Psoric-Sycotic Neuralgic Diathesis',
      typicalPresentation: symptomQuery,
      keywords: [symptomQuery],
      classicalRemedies: [
        {
          name: 'Belladonna',
          commonName: 'Deadly Nightshade',
          potency: '30C / 200C',
          dosage: '4 pills every 3 hours during acute throbbing',
          keynotes: ['Violent throbbing congestive headache; flushed red face, dilated pupils', 'Worse from light, noise, jar, motion, lying flat; better from tight wrapping and dark quiet room'],
          materiaMedicaNotes: 'Boericke: Sudden onset, violent congestion, throbbing carotids. Relieved by pressure and quietude.',
          modalities: { worse: 'Touch, jar, noise, light, motion', better: 'Semi-erect posture, tight bandaging' },
          aliases: ['belladonna', 'bell']
        },
        {
          name: 'Spigelia Anthelmia',
          commonName: 'Pinkroot',
          potency: '30C / 200C',
          dosage: '4 pills 3 times daily',
          keynotes: ['Left-sided headache and orbital neuralgia; begins at sunrise, reaches peak at noon, declines at sunset', 'Violent sharp stitching pain as if head would burst'],
          materiaMedicaNotes: 'Kent: Periodic left-sided supraorbital neuralgia following sun path.',
          modalities: { worse: 'Motion, noise, stooping, looking down', better: 'Lying with head high, warmth' },
          aliases: ['spigelia']
        },
        {
          name: 'Glonoine',
          commonName: 'Nitroglycerine',
          potency: '30C',
          dosage: '4 drops in water during sun-induced pain',
          keynotes: ['Sun headache, pulsating surges of blood to head; sensation as if skull were too small', 'Cannot bear anything tight around neck or warmth on head'],
          materiaMedicaNotes: 'Boericke: Surging rushes of blood to head and heart from heat of sun.',
          modalities: { worse: 'Sun, heat of fire, stooping, wine', better: 'Cold applications, holding head straight' },
          aliases: ['glonoine', 'glonoin']
        }
      ],
      patentFormulations: [
        {
          name: 'Dr. Reckeweg R16 (Migraine Drops)',
          brand: 'Dr. Reckeweg',
          company: 'Dr. Reckeweg & Co (Germany)',
          country: 'Germany',
          bottleSize: '22 ml Drops',
          indications: 'Migraine, nervous headaches, neuralgia of the head and tension cephalalgia.',
          dosage: '10-15 drops in water 3-4 times daily.',
          mrp: 310,
          aliases: ['r16', 'r-16', 'reckeweg 16']
        },
        {
          name: 'SBL Relax-B Drops',
          brand: 'SBL',
          company: 'SBL Pvt Ltd',
          country: 'India',
          bottleSize: '30 ml Drops',
          indications: 'Relieves acute throbbing and periodic headaches, sinus tension and heaviness.',
          dosage: '10-15 drops in 1/4 cup water 3 times daily.',
          mrp: 140,
          aliases: ['relax-b', 'relax b', 'sbl relax b']
        },
        {
          name: 'Bakson Mig Aid',
          brand: "Bakson's",
          company: 'Bakson Drugs & Pharmaceuticals',
          country: 'India',
          bottleSize: '30 ml Drops',
          indications: 'Effective relief from unilateral headaches, visual disturbances and nausea associated with migraine.',
          dosage: '10-15 drops in water 3 times a day.',
          mrp: 160,
          aliases: ['mig aid', 'bakson mig aid']
        }
      ],
      dietAndRegimen: 'Rest in a quiet, dark, well-ventilated room. Sip warm chamomile or peppermint tea. Avoid chocolate, aged cheeses, excess caffeine, and staring at bright screens.',
      warningNotes: 'If headache is accompanied by projectile vomiting, sudden onset neurological deficits, or neck stiffness, rule out acute intracranial pathology.'
    };
  }

  // 12. SKIN / ITCHING / ECZEMA / RASH
  if (q.includes('skin') || q.includes('itch') || q.includes('rash') || q.includes('eczema') || q.includes('চুলকানি') || q.includes('চর্মরোগ') || q.includes('দাদ') || q.includes('পাঁচড়া')) {
    return {
      id: 'dynamic-skin',
      nameEn: `Dermatological & Skin Condition: ${symptomQuery}`,
      nameBn: 'চর্মরোগ, চুলকানি ও ত্বকের প্রদাহ বিশ্লেষণ',
      chipLabel: 'Skin Repertory',
      pathology: 'Dermatitis, Pruritus, Urticaria & Cutaneous Inflammatory Reactions',
      miasm: 'Psoric Constitutional Diathesis',
      typicalPresentation: symptomQuery,
      keywords: [symptomQuery],
      classicalRemedies: [
        {
          name: 'Sulphur',
          commonName: 'Sublimed Sulphur',
          potency: '200C / 1M',
          dosage: '4 pills once weekly in the morning on empty stomach',
          keynotes: ['Intense voluptuous itching, burning after scratching; distinctly aggravated from water and washing', 'Aversion to washing; heat of bed aggravates skin eruption and restlessness'],
          materiaMedicaNotes: 'Kent: King of anti-psoric polychrests for burning pruritus aggravated by warmth of bed and washing.',
          modalities: { worse: 'Warmth of bed, washing, standing, 11 AM', better: 'Dry warm weather, open air' },
          aliases: ['sulphur', 'sulfur']
        },
        {
          name: 'Graphites',
          commonName: 'Black Lead',
          potency: '30C / 200C',
          dosage: '4 pills twice daily',
          keynotes: ['Cracks and fissures behind ears, bends of limbs, corners of mouth; oozing thick sticky honey-like fluid', 'Dry, rough, hard skin with intense itching and constipation'],
          materiaMedicaNotes: 'Boericke: Characteristically exudes a transparent, sticky, honey-like fluid.',
          modalities: { worse: 'Warmth, at night, during and after menses', better: 'Walking in open air, dark room' },
          aliases: ['graphites']
        },
        {
          name: 'Rhus Toxicodendron',
          commonName: 'Poison Ivy',
          potency: '30C',
          dosage: '4 pills 3 times daily',
          keynotes: ['Vesicular erythematous eruptions with intense itching and burning; relieved by scalding hot water', 'Herpetic, urticarial eruptions with swelling and restlessness'],
          materiaMedicaNotes: 'Boericke: Red swollen skin with vesicles and burning; temporary relief from very hot water.',
          modalities: { worse: 'Cold damp air, scratching, night', better: 'Hot water application, motion' },
          aliases: ['rhus tox', 'rhus']
        }
      ],
      patentFormulations: [
        {
          name: 'Dr. Reckeweg R23 (Nosoderm Drops)',
          brand: 'Dr. Reckeweg',
          company: 'Dr. Reckeweg & Co (Germany)',
          country: 'Germany',
          bottleSize: '22 ml Drops',
          indications: 'Chronic eczema, dermatitis, herpes, acute and chronic skin eruptions.',
          dosage: '10-15 drops in water 3 times daily.',
          mrp: 310,
          aliases: ['r23', 'r-23', 'reckeweg 23']
        },
        {
          name: 'Bakson Baksonite / Dermat Aid',
          brand: "Bakson's",
          company: 'Bakson Drugs & Pharmaceuticals',
          country: 'India',
          bottleSize: '30 ml Drops / 75g Soap',
          indications: 'Effective formulation for pruritus, urticaria, dry and weeping eczema, and fungal rashes.',
          dosage: '10-15 drops in water twice daily.',
          mrp: 165,
          aliases: ['dermat aid', 'bakson dermat aid']
        },
        {
          name: 'New Life NL-14 (Skin Drops)',
          brand: 'New Life',
          company: 'New Life Laboratories',
          country: 'India',
          bottleSize: '30 ml Drops',
          indications: 'Soothes persistent skin allergies, dry scales, hives, and burning itchy lesions.',
          dosage: '15 drops in water 3 times a day.',
          mrp: 140,
          aliases: ['nl-14', 'nl 14', 'new life 14']
        }
      ],
      dietAndRegimen: 'Wear loose cotton clothing. Avoid harsh chemical soaps; use neem or Calendula washing. Strictly eliminate eggs, sour pickles, brinjal (eggplant), and artificial preservatives.',
      warningNotes: 'If lesion exhibits rapid cellulitis, weeping golden crusts with fever, evaluate for secondary bacterial impetigo.'
    };
  }

  // 13. DYNAMIC CONSTITUTIONAL INDIVIDUALIZATION (STRICTLY NO ARBITRARY ARNICA)
  const isExhaustion = q.includes('weak') || q.includes('fatigue') || q.includes('tired') || q.includes('দুর্বলতা') || q.includes('ক্লান্তি');
  const isCough = q.includes('cough') || q.includes('chest') || q.includes('cold') || q.includes('throat') || q.includes('কাশি') || q.includes('কফ') || q.includes('গলা');

  if (isExhaustion) {
    return {
      id: `dynamic-vitality-${Date.now()}`,
      nameEn: `Vital Debility & Asthenia: ${symptomQuery}`,
      nameBn: 'শারীরিক দুর্বলতা ও শক্তিক্ষয় বিশ্লেষণ',
      chipLabel: 'Vitality Repertory',
      pathology: `Vital Energy Depletion & Debility: ${symptomQuery}`,
      miasm: 'Psoric Constitutional Asthenia',
      typicalPresentation: symptomQuery,
      keywords: [symptomQuery],
      classicalRemedies: [
        {
          name: 'China Officinalis (Cinchona)',
          commonName: 'Peruvian Bark',
          potency: '30C',
          dosage: '4 pills twice daily after meals',
          keynotes: ['Debility from loss of vital fluids, exhaustive discharges, prolonged illness or perspiration', 'Periodicity of symptoms, tympanitic abdominal distension, hypersensitive nervous system'],
          materiaMedicaNotes: 'Kent: Premier restorative when vitality is exhausted by hemorrhage, diarrhea or vital loss.',
          modalities: { worse: 'Slightest touch, drafts of air, periodic', better: 'Hard pressure, warmth' },
          aliases: ['china', 'cinchona', 'china off']
        },
        {
          name: 'Kali Phosphoricum',
          commonName: 'Phosphate of Potassium',
          potency: '6X / 30C',
          dosage: '4 tablets dissolved in warm water 3 times daily',
          keynotes: ['Great biochemic nerve restorative for brain fag, physical prostration and nervous exhaustion', 'Weakness of heart and limbs with gloomy mental despondency'],
          materiaMedicaNotes: 'Boericke: Conditions arising from lack of nerve power. Restores nervous energy.',
          modalities: { worse: 'Mental & physical exertion, cold', better: 'Warmth, rest, nourishment' },
          aliases: ['kali phos', 'kali phosphoricum']
        },
        {
          name: 'Ferrum Metallicum',
          commonName: 'Metallic Iron',
          potency: '30C',
          dosage: '4 pills in morning and evening',
          keynotes: ['Pseudo-plethora; flushing of face on least excitement or exertion with severe underlying anemia and weakness', 'Extreme pallor of mucous membranes, debility from least effort'],
          materiaMedicaNotes: 'Boericke: Irregular distribution of blood, severe prostration and anemia with sudden vasomotor flushing.',
          modalities: { worse: 'At rest, midnight, sweating', better: 'Slow gentle walking' },
          aliases: ['ferrum met', 'ferrum metallicum']
        }
      ],
      patentFormulations: [
        {
          name: 'SBL Alfalfa Tonic',
          brand: 'SBL',
          company: 'SBL Pvt Ltd',
          country: 'India',
          bottleSize: '115 ml Syrup',
          indications: 'Wholesome natural tonic for general debility, loss of appetite, convalescence and nervous fatigue.',
          dosage: '1-2 teaspoonfuls twice daily before meals.',
          mrp: 150,
          aliases: ['alfalfa', 'sbl alfalfa tonic']
        },
        {
          name: 'Bakson Tone Aid',
          brand: "Bakson's",
          company: 'Bakson Drugs & Pharmaceuticals',
          country: 'India',
          bottleSize: '115 ml Syrup',
          indications: 'Revitalizes nervous and muscular exhaustion, restores mental stamina and physical vigor.',
          dosage: '1 teaspoonful twice daily.',
          mrp: 160,
          aliases: ['tone aid', 'bakson tone aid']
        },
        {
          name: 'SBL Five Phos 6X',
          brand: 'SBL',
          company: 'SBL Pvt Ltd',
          country: 'India',
          bottleSize: '25g Tablets',
          indications: 'Classic biochemic combination of 5 phosphates to nourish tissue cells and combat chronic exhaustion.',
          dosage: '4 tablets 3 times daily with warm water.',
          mrp: 135,
          aliases: ['five phos', 'sbl five phos']
        }
      ],
      dietAndRegimen: 'Nourishing warm soups, fresh milk or almond beverage, soaked raisins and fresh fruits. Avoid skipping meals and mental over-strain.',
      warningNotes: 'If debility is progressive with severe unprovoked weight loss, screen for occult anemia, thyroid dysfunction, or chronic infection.'
    };
  }

  if (isCough) {
    const coughCond = CLINICAL_REPERTORY_DATABASE.find(c => c.id === 'cough-bronchitis');
    if (coughCond) return coughCond;
  }

  // If symptoms do not match any known clinical condition, return null.
  // Strictly no generic Belladonna/Nux Vomica fallback.
  return null;
}

export function findRepertoryMatch(symptomQuery: string): ClinicalCondition | null {
  const query = (symptomQuery || '').toLowerCase().trim();
  if (!query) return null;

  let bestMatch: ClinicalCondition | null = null;
  let maxScore = 0;

  for (const cond of CLINICAL_REPERTORY_DATABASE) {
    let score = 0;

    // Check direct id or name match
    if (query === cond.id || query.includes(cond.id)) score += 20;
    if (query.includes(cond.nameEn.toLowerCase())) score += 15;
    if (query.includes(cond.nameBn.toLowerCase())) score += 15;

    for (const kw of cond.keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (!kwLower) continue;

      if (query === kwLower) {
        score += 30; // Exact keyword match takes top priority
      } else if (query.includes(kwLower)) {
        score += kwLower.length > 5 ? 10 : 6;
      } else if (kwLower.includes(query) && query.length >= 3) {
        score += 6;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = cond;
    }
  }

  // If a predefined condition matched with a positive score, return it
  if (bestMatch && maxScore > 0) {
    return bestMatch;
  }

  // Dynamically synthesize a condition based on the user's specific query
  const dynamic = buildDynamicCondition(symptomQuery);
  if (dynamic) return dynamic;

  // Zero-Dependency Boericke/Kent Materia Medica & Organ-Sensation Engine Fallback
  return synthesizeMateriaMedicaOffline(symptomQuery);
}

