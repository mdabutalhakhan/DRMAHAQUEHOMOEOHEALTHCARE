import type { ClinicalCondition } from '../clinicalRepertoryData';

export const MALE_GENITO_URINARY_CONDITIONS: ClinicalCondition[] = [
  // 1. Hydrocele (হাইড্রোসিল / অণ্ডকোষে জল জমা)
  {
    id: 'hydrocele-scrotal-swelling',
    nameEn: 'Hydrocele & Testicular Swelling',
    nameBn: 'হাইড্রোসিল ও অণ্ডকোষ বৃদ্ধি (অণ্ডকোষে জল জমা)',
    chipLabel: 'Hydrocele / হাইড্রোসিল',
    pathology: 'Scrotal Serous Fluid Accumulation between parietal and visceral layers of tunica vaginalis',
    miasm: 'Sycotic-Tubercular Diathesis with Chronic Serous Effusion',
    typicalPresentation: 'Enlarged, fluctuating, painless or dragging scrotal enlargement, bruised testicular ache aggravated before damp or stormy weather',
    keywords: [
      'hydrocele', 'হাইড্রোসিল', 'অণ্ডকোষ বৃদ্ধি', 'scrotum swelling', 'water in testicle', 'hydrocoele',
      'অণ্ডকোষে জল', 'অণ্ডকোষ ফোলা', 'টেস্টিস ফোলা', 'water in scrotum', 'scrotal fluid', 'swollen scrotum',
      'orchitis', 'অণ্ডকোষ', 'অণ্ডকোষে পানি', 'অণ্ডকোষ ফুলে যাওয়া'
    ],
    classicalRemedies: [
      {
        name: 'Rhododendron Chrysanthum 200C',
        commonName: 'Yellow Snow-Rose',
        potency: '200C',
        dosage: '4 pills twice daily in empty stomach',
        keynotes: [
          'Specific simillimum for chronic hydrocele in boys and adults; testicles swollen, drawn up, crushed feeling',
          'Intense aggravation before thunderstorms, electrical changes in atmosphere, and windy weather',
          'Contused, bruised drawing pain extending into abdomen and thighs'
        ],
        materiaMedicaNotes: 'Boericke: Chronic hydrocele in boys and men. Testicles swollen, drawn up with bruised crushed pain. Worse before storms and rough windy weather.',
        modalities: { worse: 'Before a storm, rough windy weather, rest', better: 'Warmth, gentle motion, dry weather' },
        aliases: ['rhododendron', 'rhodo']
      },
      {
        name: 'Clematis Erecta 30C',
        commonName: "Virgin's Bower",
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Right-sided hydrocele and orchitis; testicle hard, indurated, exquisitely tender to slightest touch',
          'Interrupted or dribbling urine flow, urethral constriction after chronic catarrhal inflammation',
          'Aching drawing pain traveling along spermatic cord'
        ],
        materiaMedicaNotes: 'Kent: Great remedy for inflammatory and painful right-sided hydrocele and orchitis following gonorrhoeal suppression. Hard induration of testicle.',
        modalities: { worse: 'Warmth of bed, night, touch', better: 'Open cool air, cold washing' },
        aliases: ['clematis', 'clematis erecta']
      },
      {
        name: 'Pulsatilla Nigricans 30C',
        commonName: 'Wind Flower',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Hydrocele with heavy, hanging, bruised scrotal weight; mild, gentle, tearful temperament',
          'Aching pain extends to abdomen and loins; worse in warm room, distinctly relieved in open fresh air',
          'Thirstlessness with dry mouth; testicle feels hot and congested'
        ],
        materiaMedicaNotes: 'Boericke: Inflammatory orchitis and hydrocele with hanging weight. Relieved by cool open air and cold applications.',
        modalities: { worse: 'Warm closed room, evening, heat', better: 'Open cool air, cold bathing, slow walking' },
        aliases: ['pulsatilla', 'puls']
      },
      {
        name: 'Silicea 200C',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills once weekly',
        keynotes: [
          'Promotes systemic reabsorption of chronic serous fluid accumulations in tunica vaginalis',
          'Chilly constitution, offensive sweaty feet, slow metabolic resorption of chronic effusions',
          'Scrotum feels cold and heavy with indurated epididymis'
        ],
        materiaMedicaNotes: 'Kent: Deep-acting anti-sycotic tissue salt that stimulates lymphatic drainage and absorption of chronic hydrocele fluid.',
        modalities: { worse: 'Cold drafts, dampness, uncovering', better: 'Warm wrapping, heat' },
        aliases: ['silicea', 'silica']
      }
    ],
    patentFormulations: [
      {
        name: 'Wheezal WL-33 (Hydrocele Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Specifically formulated for enlargement of scrotum, hydrocele, orchitis, and testicular heaviness.',
        dosage: '10-15 drops in 1/4th cup water 3 times daily before meals.',
        mrp: 175,
        aliases: ['wl-33', 'wl 33', 'wheezal hydrocele']
      },
      {
        name: 'Dr. Reckeweg R16 (Hydrocele & Orchitis Adjuvant)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German neuralgic and lymphatic formula relieving testicular dragging, hydrocele, and scrotal inflammation.',
        dosage: '10-15 drops in lukewarm water 3 times daily.',
        mrp: 310,
        aliases: ['r16', 'reckeweg 16']
      },
      {
        name: 'Bakson Orchitis & Scrotal Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Soothes inflamed scrotal tissues, testicular congestion, and accelerates hydrocele absorption.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 180,
        aliases: ['bakson orchitis']
      }
    ],
    dietAndRegimen: 'Wear a supportive scrotal suspensory bandage to prevent dragging tension. Avoid lifting heavy weights and strenuous cycling. Rest in supine position during acute discomfort.',
    warningNotes: 'If scrotum is suddenly painful, dusky-red or tender with fever and nausea, urgently rule out acute testicular torsion or strangulated inguinoscrotal hernia via scrotal ultrasound Doppler.'
  },

  // 2. Kidney Stone / Renal Calculi (কিডনি পাথর / প্রস্রাবে পাথর)
  {
    id: 'kidney-stone-renal-calculi',
    nameEn: 'Kidney Stone & Renal Calculi',
    nameBn: 'কিডনি পাথর ও মূত্রপাথুরী (প্রস্রাবে পাথর)',
    chipLabel: 'Kidney Stone / কিডনি পাথর',
    pathology: 'Nephrolithiasis, Urolithiasis with acute ureteric spasms and crystalline gravel',
    miasm: 'Sycotic Diathesis with Lithic Acid & Urate Dysplasia',
    typicalPresentation: 'Severe agonizing sharp stabbing flank pain radiating along ureter downwards into groin, bladder, and thighs with hematuria and burning',
    keywords: [
      'kidney stone', 'renal calculi', 'পাথর', 'কিডনি স্টোন', 'stone in urine', 'nephrolithiasis',
      'কিডনি পাথর', 'প্রস্রাবে পাথর', 'মূত্রপাথুরী', 'renal stone', 'ureteric stone', 'urine stone',
      'পাথুরী', 'কোমরের পেছনে তীব্র ব্যথা', 'red sand urine', 'renal colic', 'urine burning'
    ],
    classicalRemedies: [
      {
        name: 'Berberis Vulgaris Mother Tincture (Q)',
        commonName: 'Barberry',
        potency: 'Q',
        dosage: '15 drops in 1/2 cup warm water 3-4 times daily',
        keynotes: [
          'Master remedy for left or right renal colic; sharp radiating stitching pain from kidney down ureter into bladder, testes, and thighs',
          'Bubbling, sore sensation in renal region; pain aggravated by jarring and motion',
          'Thick turbid urine with red sandy crystalline gravel deposit'
        ],
        materiaMedicaNotes: 'Boericke: Renal colic, burning and soreness in kidney region; pains radiate outward into groin, thighs, and calves.',
        modalities: { worse: 'Jarring, motion, standing', better: 'Rest, lying on unpainful side' },
        aliases: ['berberis vulgaris', 'berberis', 'berberis q']
      },
      {
        name: 'Lycopodium Clavatum 200C',
        commonName: 'Club Moss',
        potency: '200C',
        dosage: '4 pills in evening on empty stomach',
        keynotes: [
          'Predominantly right-sided kidney stones; agonizing pain in right loin relieved after passage of urine',
          'Characteristic red brick-dust sandy sediment in urine; patient strains before urination',
          'Associated with severe flatulence, gas distension, and sweet cravings; worse 4 PM to 8 PM'
        ],
        materiaMedicaNotes: 'Kent: Right kidney colic with red sand in clear urine. Great straining to pass urine with sharp cutting pains in right ureter.',
        modalities: { worse: '4 PM to 8 PM, right side, warmth', better: 'Warm drinks, urination, motion' },
        aliases: ['lycopodium', 'lyco']
      },
      {
        name: 'Sarsaparilla 30C / Q',
        commonName: 'Wild Licorice',
        potency: '30C / Q',
        dosage: '4 pills 3 times daily, or 10 drops Q in warm water',
        keynotes: [
          'Severe intolerable pain and burning at the very close of urination; screams when finishing urination',
          'Can pass urine only while standing; white or gray sandy sediment',
          'Right kidney colic extending downward with tender bladder'
        ],
        materiaMedicaNotes: 'Boericke: Urine dribbles while sitting; passes freely standing. Agonizing burning and pain at the conclusion of urination.',
        modalities: { worse: 'End of urination, damp cold weather', better: 'Standing to urinate, warmth' },
        aliases: ['sarsaparilla', 'sarsa']
      },
      {
        name: 'Hydrangea Arborescens Mother Tincture (Q)',
        commonName: 'Seven-Barks / Stone-Root',
        potency: 'Q',
        dosage: '10-15 drops in warm water 3 times daily',
        keynotes: [
          'Renal stone solvent remedy; assists in breaking down and dissolving calcium oxalate and phosphate calculi',
          'Sharp cutting aching pain in lumbar region and loins with bloody sandy urine',
          'Relieves ureteric spasm and promotes painless expulsion of small gravel'
        ],
        materiaMedicaNotes: 'Boericke: A remedy for gravel and profuse deposits of white amorphous salts in urine. Relieves severe pain from kidney stones passing down ureter.',
        modalities: { worse: 'Physical exertion, sitting', better: 'Warm fluids, rest' },
        aliases: ['hydrangea', 'hydrangea q']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL ClearStone Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Proven formulation for renal calculi, ureteric gravel, burning dysuria, and flank pain.',
        dosage: '10-15 drops in 1/4 cup water 3 times daily before meals.',
        mrp: 165,
        aliases: ['clearstone', 'sbl clearstone', 'clear stone']
      },
      {
        name: 'Dr. Reckeweg R27 (Renal Calculi Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation indicated for kidney stones, nephrolithiasis, renal colic, and gravel in urine.',
        dosage: '15 drops in water 3-4 times daily; during acute colic, every 30 minutes.',
        mrp: 310,
        aliases: ['r27', 'reckeweg 27']
      },
      {
        name: 'Bakson Stonerid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Alleviates agonizing renal pain, dissolves urinary calculi, and clears burning urine.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 170,
        aliases: ['stonerid', 'bakson stonerid']
      }
    ],
    dietAndRegimen: 'Drink 3 to 4 liters of clean lukewarm water daily. Sip barley water and tender coconut water. Restrict oxalate-rich foods (spinach, beetroot, chocolate, excessive tea) and red meat.',
    warningNotes: 'If high fever with chills (rigors), intractable vomiting, or total cessation of urine (anuria) occurs, suspect acute pyelonephritis or complete ureteral obstruction. Perform immediate USG KUB and serum creatinine.'
  },

  // 3. Prostatitis & BPH (প্রস্টেট বৃদ্ধি / প্রস্রাবের বেগ আটকে থাকা)
  {
    id: 'prostatitis-bph-enlarged',
    nameEn: 'Prostatitis & Benign Prostatic Hyperplasia (BPH)',
    nameBn: 'প্রস্টেট বৃদ্ধি ও মূত্রনালীর বাধা (প্রস্রাবের বেগ আটকে থাকা)',
    chipLabel: 'Prostate / প্রস্টেট বৃদ্ধি',
    pathology: 'Benign Prostatic Hyperplasia (BPH) & Chronic Prostatic Congestion with urethral obstruction',
    miasm: 'Sycotic Induration & Proliferative Diathesis',
    typicalPresentation: 'Hesitancy, weak urinary stream, terminal dribbling, frequent nocturnal urination, sensation of incomplete bladder emptying',
    keywords: [
      'prostate', 'bph', 'প্রস্টেট', 'প্রস্রাব আটকে যাওয়া', 'frequent urination night', 'enlarged prostate',
      'প্রস্টেট বৃদ্ধি', 'প্রস্রাবের বেগ', 'প্রস্রাব ফোঁটা ফোঁটা', 'dribbling urine', 'nocturia', 'hesitancy',
      'প্রস্টেটাইটিস', 'প্রস্রাব আটকে থাকা', 'prostatitis', 'weak urine stream'
    ],
    classicalRemedies: [
      {
        name: 'Sabal Serrulata Mother Tincture (Q)',
        commonName: 'Saw Palmetto',
        potency: 'Q',
        dosage: '15 drops in warm water 3 times daily',
        keynotes: [
          'Premier organopathic remedy for senile prostatic enlargement (BPH) with difficult, slow micturition',
          'Sensation of weight and fullness in perineum; constantly waking at night to pass urine',
          'Loss of sexual power, coldness and atrophy of external genitalia with enlarged prostate'
        ],
        materiaMedicaNotes: 'Boericke: Homeopathic catheter. Promotes easy urination and reduces prostatic hypertrophy and nocturia in elderly men.',
        modalities: { worse: 'Cold damp air, lying down at night', better: 'Warmth, upright position' },
        aliases: ['sabal serrulata', 'sabal', 'sabal q']
      },
      {
        name: 'Conium Maculatum 200C',
        commonName: 'Poison Hemlock',
        potency: '200C',
        dosage: '4 pills twice weekly in evening',
        keynotes: [
          'Stony-hard induration of the prostate gland; intermittent urinary stream (starts and stops repeatedly)',
          'Dribbling of urine in old men with severe urethral burning',
          'Vertigo when turning head or turning over in bed'
        ],
        materiaMedicaNotes: 'Kent: Characteristic intermittent flow: urine flows, stops, flows again. Hardness of prostate gland like stone.',
        modalities: { worse: 'Turning in bed, night, cold', better: 'Letting limbs hang down, warmth' },
        aliases: ['conium', 'conium mac']
      },
      {
        name: 'Thuja Occidentalis 200C',
        commonName: 'Arbor Vitae',
        potency: '200C',
        dosage: '4 pills once weekly in the morning',
        keynotes: [
          'Specific for sycotic overgrowth and benign adenomatous hypertrophy of the prostate',
          'Sudden urgent desire to urinate, severe burning in urethra while urinating and long after',
          'History of chronic gonorrhea or suppressed discharges; fork-stream micturition'
        ],
        materiaMedicaNotes: 'Boericke: Enlarged prostate; urgent desire, burning in neck of bladder. Forked urine stream with feeling as if a drop were running down urethra.',
        modalities: { worse: 'Cold damp weather, 3 AM', better: 'Warm dry weather, drawing up limbs' },
        aliases: ['thuja', 'thuja occ']
      },
      {
        name: 'Chimaphila Umbellata Mother Tincture (Q)',
        commonName: 'Pipsissewa',
        potency: 'Q',
        dosage: '10-15 drops in warm water twice daily',
        keynotes: [
          'Patient must strain forward with feet wide apart and body bent forward to start urination',
          'Sensation of a hard ball sitting in perineum when sitting down',
          'Thick, ropy, mucous sediment in urine with enlarged prostate'
        ],
        materiaMedicaNotes: 'Boericke: Must flex body forward to pass urine. Feeling of a ball in perineum when sitting. Chronic prostatitis with catarrhal urine.',
        modalities: { worse: 'Sitting on hard seat, cold dampness', better: 'Walking, standing bent forward' },
        aliases: ['chimaphila', 'chimaphila q']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R25 (Prostate Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Highly renowned German formula for acute and chronic prostatitis, senile prostate adenoma, and nocturnal dribbling.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r25', 'reckeweg 25']
      },
      {
        name: 'SBL Prostonum Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves difficulty in starting urination, frequent urge at night, and sensation of incomplete emptying from BPH.',
        dosage: '10-15 drops in 1/4 cup water 3-4 times daily.',
        mrp: 160,
        aliases: ['prostonum', 'sbl prostonum']
      },
      {
        name: 'Bakson Sabal Pentarkan',
        brand: "Bakson's",
        company: 'Schwabe / Bakson',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Targeted formulation providing relief from urinary retention, dysuria, and functional prostate troubles.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 190,
        aliases: ['sabal pentarkan']
      }
    ],
    dietAndRegimen: 'Avoid retaining urine when desire arises. Eliminate alcohol, excess caffeine, and spicy curries. Stop drinking excessive fluids 2 hours before bedtime. Practice regular pelvic floor exercises.',
    warningNotes: 'If sudden complete inability to pass urine (acute urinary retention) occurs with agonizing hypogastric distension, arrange urgent bladder catheterization. Monitor serum PSA periodically.'
  },

  // 4. UTI & Burning Micturition (ইউরিন ইনফেকশন / প্রস্রাবে জ্বালা)
  {
    id: 'uti-burning-micturition',
    nameEn: 'Urinary Tract Infection (UTI) & Burning Micturition',
    nameBn: 'ইউরিন ইনফেকশন ও প্রস্রাবে তীব্র জ্বালা (সিস্টাইটিস)',
    chipLabel: 'UTI / প্রস্রাবে জ্বালা',
    pathology: 'Acute Cystitis, Urethritis & Lower Urinary Tract Mucosal Infection with burning dysuria',
    miasm: 'Acute Inflammatory Flare on Psoric-Sycotic Diathesis',
    typicalPresentation: 'Scalding burning pain like fire along urethra before, during, and after urination; constant urge to pass urine drop by drop with cloudy or blood-tinged urine',
    keywords: [
      'uti', 'burning urine', 'প্রস্রাবে জ্বালা', 'urine infection', 'dysuria', 'cystitis',
      'প্রস্রাবে আগুন জ্বালা', 'প্রস্রাব করতে কষ্ট', 'বার বার প্রস্রাবের বেগ', 'burning micturition',
      'ইউরিন ইনফেকশন', 'urethritis', 'cloudy urine', 'blood in urine', 'strangury'
    ],
    classicalRemedies: [
      {
        name: 'Cantharis Vesicatoria 30C',
        commonName: 'Spanish Fly',
        potency: '30C',
        dosage: '4 pills every 2 hours during acute agony, then 3 times daily',
        keynotes: [
          'Intolerable, agonizing scalding burning like boiling oil or fire in urethra during micturition',
          'Constant, furious tenesmus; urine passed drop by drop with cutting pinching spasms',
          'Urine contains shreds of mucus and red blood droplets'
        ],
        materiaMedicaNotes: 'Boericke: Premier remedy for acute violent cystitis. Furious tenesmus, burning cutting pains in entire urinary tract, passes only drops of bloody urine.',
        modalities: { worse: 'During micturition, motion, coffee', better: 'Warmth, quiet rest' },
        aliases: ['cantharis', 'canth']
      },
      {
        name: 'Apis Mellifica 30C',
        commonName: 'Honey Bee',
        potency: '30C',
        dosage: '4 pills 3 times daily in cold water',
        keynotes: [
          'Stinging, pricking, smarting burning pain with scanty, hot urine',
          'Extreme soreness of abdominal wall and bladder region; aggravated by heat and warm drinks',
          'Thirstlessness; puffiness and edema of eyelids or extremities'
        ],
        materiaMedicaNotes: 'Kent: Stinging burning pain, urine scanty and scalding. Thirstless, worse from heat of room or warm applications.',
        modalities: { worse: 'Heat, warm drinks, touch', better: 'Cold water applications, open cool air' },
        aliases: ['apis', 'apis mel']
      },
      {
        name: 'Sarsaparilla 30C',
        commonName: 'Wild Licorice',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Agonizing cutting pain at the very close of urination, causing patient to cry out',
          'Passes urine freely only when standing erect; dribbles while sitting down',
          'Urine cloudy with white crystalline sediment and gravel'
        ],
        materiaMedicaNotes: 'Boericke: Severe pain at the conclusion of urination. Urine dribbles sitting, passes freely standing.',
        modalities: { worse: 'End of urination, sitting down', better: 'Standing to urinate, warm drinks' },
        aliases: ['sarsaparilla', 'sarsa']
      },
      {
        name: 'Equisetum Hyemale Mother Tincture (Q)',
        commonName: 'Scouring Rush',
        potency: 'Q',
        dosage: '10-15 drops in water 3 times daily',
        keynotes: [
          'Severe dull ache and feeling of fullness in bladder not relieved by passing urine',
          'Constant desire to urinate, large quantity passed without commensurate relief',
          'Deep tenderness over pubic region with irritation of bladder neck'
        ],
        materiaMedicaNotes: 'Boericke: Severe, dull pain and feeling of fullness in bladder not relieved by micturition. Dysuria in women and children.',
        modalities: { worse: 'Right side, movement, after urination', better: 'Lying quiet, continued rest' },
        aliases: ['equisetum', 'equisetum q']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R18 (Cystitis & Kidney Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for inflammation of kidneys, renal pelvis, acute cystitis, and burning urination.',
        dosage: '10-15 drops in water 3 times daily; in acute inflammation, every 2 hours.',
        mrp: 310,
        aliases: ['r18', 'reckeweg 18']
      },
      {
        name: 'SBL UTI-Care / Cantharis Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Comprehensive antiseptic and soothing formula for acute urinary burning, frequent urination, and bladder discomfort.',
        dosage: '10-15 drops in 1/4 cup water 3 times a day.',
        mrp: 145,
        aliases: ['uti-care', 'sbl uti']
      },
      {
        name: 'Bakson Uterine/Urinary Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves burning micturition, tenesmus, and inflammatory irritation of the bladder and urethra.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 165,
        aliases: ['bakson urinary']
      }
    ],
    dietAndRegimen: 'Drink abundant fluids (at least 3 liters daily). Sip barley water, fresh cranberry juice, and coconut water. Strictly avoid chili, sour vinegar, mustard, and carbonated beverages during acute infection.',
    warningNotes: 'If accompanied by high spiking fever, shaking chills, and bilateral flank pain, rule out acute ascending pyelonephritis. Perform routine Urine R/M/E and Culture/Sensitivity.'
  },

  // 5. Varicocele & Orchitis (ভ্যারিকোসিল / অণ্ডকোষে শিরা ফোলা ও ব্যথা)
  {
    id: 'varicocele-orchitis-scrotal-pain',
    nameEn: 'Varicocele & Testicular Orchitis',
    nameBn: 'ভ্যারিকোসিল ও অণ্ডকোষে শিরা ফোলা (অণ্ডকোষে শিরাস্ফীতি ও টানটান ব্যথা)',
    chipLabel: 'Varicocele / ভ্যারিকোসিল',
    pathology: 'Dilatation, elongation and tortuosity of pampiniform venous plexus with testicular congestion and dragging ache',
    miasm: 'Sycotic Venous Stasis & Tubercular Laxity',
    typicalPresentation: 'Scrotum feels like a "bag of worms" (predominantly left side), dull dragging heavy ache worse after prolonged standing or exertion, relieved by lying flat',
    keywords: [
      'varicocele', 'orchitis', 'ভ্যারিকোসিল', 'অণ্ডকোষ ব্যথা', 'scrotal pain', 'bag of worms',
      'অণ্ডকোষের শিরা ফোলা', 'বাম অণ্ডকোষে শিরা ফোলা', 'venous stasis scrotum', 'testicular ache',
      'অণ্ডকোষে টান লাগা', 'টেস্টিসের শিরা বড় হওয়া', 'scrotal varicosity', 'testicular heaviness'
    ],
    classicalRemedies: [
      {
        name: 'Hamamelis Virginiana 30C / Q',
        commonName: 'Witch Hazel',
        potency: '30C / Q',
        dosage: '4 pills 3 times daily, or 10 drops Q in water',
        keynotes: [
          'Master venous tonic for dilated, congested, tortuous veins of the spermatic cord and scrotum',
          'Severe dragging, aching pain in testicles extending through spermatic cords into abdomen',
          'Testicles exquisitely tender to touch; sensation as if testicles would be crushed'
        ],
        materiaMedicaNotes: 'Boericke: Great venous congestion. Testicles enlarged, hot, and painful. Orchitis with intense aching and dragging down spermatic cords.',
        modalities: { worse: 'Warm moist air, prolonged standing, motion', better: 'Lying flat with hips elevated, rest' },
        aliases: ['hamamelis', 'hamamelis virg']
      },
      {
        name: 'Pulsatilla Nigricans 200C',
        commonName: 'Wind Flower',
        potency: '200C',
        dosage: '4 pills in evening in water',
        keynotes: [
          'Varicocele with heavy drawing pain extending into groin; testicle hangs low and feels hot',
          'Pain moves from one part to another; patient is relieved by cold bathing and open fresh air',
          'Venous engorgement and blue discoloration of scrotal veins'
        ],
        materiaMedicaNotes: 'Kent: Orchitis and varicocele with venous engorgement; severe drawing pain into groin. Worse from warmth, better in cool fresh air.',
        modalities: { worse: 'Warm room, heat, prolonged standing', better: 'Cool open air, cold water washing, elevation' },
        aliases: ['pulsatilla', 'puls']
      },
      {
        name: 'Spongia Tosta 30C',
        commonName: 'Roasted Sponge',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Swelling, hardness, and induration of testicles and spermatic cord with shooting squeezing pain',
          'Testicle feels bruised, heavy, and hot; painful pinching in cord extending into abdomen',
          'Aggravated by slightest touch or movement of scrotum'
        ],
        materiaMedicaNotes: 'Boericke: Swelling and induration of testicles with squeezing pain; spermatic cord swollen and painful.',
        modalities: { worse: 'Touch, motion, warmth', better: 'Rest in horizontal posture' },
        aliases: ['spongia', 'spongia tosta']
      },
      {
        name: 'Arnica Montana 200C',
        commonName: "Leopard's Bane",
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Varicocele and orchitis resulting from physical strain, lifting heavy weights, or direct scrotal injury',
          'Scrotum feels bruised, beaten, and sore as if kicked',
          'Accelerates restoration of capillary and venous tone in pampiniform plexus'
        ],
        materiaMedicaNotes: 'Kent: Sore, bruised, lame feeling after physical overstrain or mechanical trauma to testes and spermatic cord.',
        modalities: { worse: 'Motion, touch, exertion', better: 'Lying quietly flat' },
        aliases: ['arnica', 'arnica mont']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R42 (Haemavenin / Varicose Veins Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for venous stasis, varicocele, varicose veins, and venous inflammation.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r42', 'reckeweg 42']
      },
      {
        name: 'Wheezal WL-33 (Hydrocele & Orchitis Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves scrotal heaviness, dilated venous cord congestion, and testicular soreness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['wl-33', 'wheezal 33']
      },
      {
        name: 'SBL Hamamelis Ointment / Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops / 25g Ointment',
        indications: 'Strengthens venous walls, decreases engorgement of scrotal plexus, and relieves dragging ache.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 135,
        aliases: ['hamamelis drops', 'sbl hamamelis']
      }
    ],
    dietAndRegimen: 'Wear a supportive scrotal suspensory or snug briefs during daytime. Avoid prolonged standing, heavy weight-lifting, and chronic constipation. Lie down with legs slightly elevated after long work hours.',
    warningNotes: 'If varicocele is sudden-onset, non-reducible when supine, or isolated to the right side, urgently perform abdominal ultrasound to rule out retroperitoneal mass or renal vein thrombosis.'
  },

  // 6. Nocturnal Emission & Spermatorrhea (স্বপ্নদোষ / শুক্রতারল্য)
  {
    id: 'nocturnal-emission-spermatorrhea',
    nameEn: 'Nocturnal Emission & Spermatorrhea',
    nameBn: 'স্বপ্নদোষ ও ধাতু দুর্বলতা (শুক্রতারল্য ও স্নায়বিক দুর্বলতা)',
    chipLabel: 'Spermatorrhea / স্বপ্নদোষ',
    pathology: 'Functional Neurological & Seminal Vesicle Irritation with involuntary seminal loss, neurasthenia, and lumbar aching',
    miasm: 'Psoric-Sycotic Nervous Exhaustion & Seminal Weakness',
    typicalPresentation: 'Frequent involuntary nocturnal emissions with or without dreams, premature discharge, mental despondency, sunken eyes, trembling knees and backache',
    keywords: [
      'wet dream', 'spermatorrhea', 'স্বপ্নদোষ', 'ধাতু দুর্বলতা', 'nocturnal emission', 'involuntary semen',
      'শুক্রতারল্য', 'বীর্যপাত', 'বীর্য পাতলা', 'শারীরিক দুর্বলতা', 'seminal loss', 'nightfall',
      'weak semen', 'sexual neurasthenia', 'ঘন ঘন স্বপ্নদোষ', 'মাথা ঘোরা ও কোমর ব্যথা'
    ],
    classicalRemedies: [
      {
        name: 'Nuphar Lutea Mother Tincture (Q)',
        commonName: 'Yellow Pond-Lily',
        potency: 'Q',
        dosage: '10-15 drops in 1/4 cup water twice daily after meals',
        keynotes: [
          'Complete absence of sexual desire; penis relaxed, scrotum retracted and cold',
          'Involuntary seminal emissions during sleep or with soft stool without erection',
          'Extreme physical weakness and morning diarrhea with seminal discharge'
        ],
        materiaMedicaNotes: 'Boericke: Complete absence of sexual desire; parts relaxed; involuntary emissions during stool and urination. Spermatorrhea with morning exhaustion.',
        modalities: { worse: 'Morning, mental strain', better: 'Quiet rest, nutritious food' },
        aliases: ['nuphar lutea', 'nuphar', 'nuphar q']
      },
      {
        name: 'Acidum Phosphoricum 30C / Q',
        commonName: 'Phosphoric Acid',
        potency: '30C / Q',
        dosage: '4 pills twice daily, or 10 drops Q in water',
        keynotes: [
          'Profound physical and mental debility following acute or chronic seminal loss',
          'Patient is listless, apathetic, memory impaired, pale face with dark circles around sunken eyes',
          'Frequent involuntary emissions at night followed by severe weakness in spine and knees'
        ],
        materiaMedicaNotes: 'Kent: Great remedy for the nervous exhaustion and mental apathy following frequent seminal emissions. Spine feels weak and bruised.',
        modalities: { worse: 'Seminal loss, mental exertion, cold', better: 'Warmth, short sleep' },
        aliases: ['acid phos', 'phosphoric acid']
      },
      {
        name: 'Agnus Castus 30C',
        commonName: 'Chaste Tree',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Complete sexual impotence; genitalia cold, flaccid, and relaxed',
          'Involuntary seminal emissions without erections; profound mental depression with conviction of impending death',
          'Premature aging from early sexual excesses or frequent masturbation'
        ],
        materiaMedicaNotes: 'Boericke: Premature old age from abuse of sexual power. Complete flaccidity of parts with loss of all desire and involuntary loss of semen.',
        modalities: { worse: 'Cold, exertion', better: 'Warm nourishing regimen' },
        aliases: ['agnus castus', 'agnus']
      },
      {
        name: 'Selenium Metallicum 30C',
        commonName: 'The Element Selenium',
        potency: '30C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Dribbling of prostatic fluid and semen while walking, during sitting, or after stool',
          'Great sexual desire with complete physical inability to perform',
          'Extreme fatigue and debility; emaciation, hair falls out from beard, eyebrows, and genitals'
        ],
        materiaMedicaNotes: 'Boericke: Involuntary dribbling of semen and prostatic fluid. Great debility following seminal emission. Worse from hot weather.',
        modalities: { worse: 'Heat of sun, after stool, after emission', better: 'Taking cold water in mouth' },
        aliases: ['selenium', 'sel']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R41 (Fortivirone / Sexual Asthenia Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Highly reputed German tonic for sexual asthenia, spermatorrhea, nervous exhaustion, and seminal weakness.',
        dosage: '15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r41', 'reckeweg 41']
      },
      {
        name: 'SBL Damiagra Forte Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Nervine restorative tonic that curbs involuntary nocturnal losses, improves stamina, and relieves fatigue.',
        dosage: '15-20 drops in 1/4 cup water twice daily after meals.',
        mrp: 230,
        aliases: ['damiagra', 'sbl damiagra']
      },
      {
        name: 'Bakson Super Tonic / Damiana Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Revitalizes nervous system, counteracts seminal debility, and relieves lumbar aching and mental depression.',
        dosage: '1 teaspoonful twice daily after food.',
        mrp: 175,
        aliases: ['super tonic', 'bakson damiana']
      }
    ],
    dietAndRegimen: 'Empty bladder before going to sleep. Sleep on a firm mattress on side position; avoid sleeping flat on back. Avoid erotically stimulating screens before bedtime. Eat soaked almonds, dates, and fresh milk. Take regular physical exercise.',
    warningNotes: 'Assure patient that occasional nocturnal emission is a natural physiological phenomenon. If accompanied by severe painful urination, urethral discharge, or testicular pain, screen for urethritis and chronic prostatitis.'
  }
];
