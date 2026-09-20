import { ClinicalCondition } from './clinicalRepertoryData';

export const ADDITIONAL_CLINICAL_CONDITIONS: ClinicalCondition[] = [
  // 9. SINUSITIS & NASAL CATARRH
  {
    id: 'sinusitis-coryza',
    nameEn: 'Sinusitis, Nasal Polyps & Chronic Catarrh',
    nameBn: 'সাইনুসাইটিস, নাকের পলিপ ও সর্দি',
    chipLabel: 'Sinusitis / সাইনুসাইটিস',
    pathology: 'Frontal & Maxillary Sinusitis, Ethmoidal Congestion & Hypertrophic Rhinitis',
    miasm: 'Sycotic-Tubercular Diathesis with Catarrhal Obstruction',
    typicalPresentation: 'Throbbing frontal headache, facial heaviness, thick yellowish-green nasal discharge, nasal blockage',
    keywords: [
      'sinusitis', 'sinus', 'সাইনুসাইটিস', 'সাইনাস', 'নাকের পলিপ', 'polyp', 'nasal polyp',
      'বন্ধ নাক', 'সর্দি', 'chronic cold', 'coryza', 'frontal headache', 'catarrh'
    ],
    classicalRemedies: [
      {
        name: 'Kali Bichromicum',
        commonName: 'Bichromate of Potash',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Thick, ropy, stringy, yellowish-green nasal mucus that can be drawn into long elastic cords',
          'Pain at the root of nose or small circumscribed spots over frontal sinuses',
          'Tough, hard, elastic plugs or clinkers dislodged from nasal cavities with bleeding'
        ],
        materiaMedicaNotes: 'Kent: Discharges are tough, stringy, ropy. Plugs and clinkers from the nose. Pain in small spots.',
        modalities: { worse: 'Beer, morning, hot weather', better: 'Heat, warm room' },
        aliases: ['kali bich', 'kali bichromicum']
      },
      {
        name: 'Teucrium Marum Verum',
        commonName: 'Cat Thyme',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Specific remedy for nasal polyps with chronic obstruction and loss of smell',
          'Large quantities of dry greenish crusts blown from nose without much relief',
          'Crawling tingling in nostrils with violent paroxysms of sneezing'
        ],
        materiaMedicaNotes: 'Boericke: Specific for polypus with hypertrophy of nasal mucous membrane. Obstruction of nostrils.',
        modalities: { worse: 'Damp weather, warmth of bed', better: 'Open dry air' },
        aliases: ['teucrium', 'teucrium marum']
      },
      {
        name: 'Pulsatilla Nigricans',
        commonName: 'Wind Flower',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Bland, thick, yellowish-green morning coryza with evening nasal stoppage',
          'Loss of smell and taste; frontal heaviness relieved in cool fresh air',
          'Mild, weepy temperament with complete absence of thirst'
        ],
        materiaMedicaNotes: 'Boericke: Bland, thick, yellowish-green discharge. Stuffy nose in evening, running in morning.',
        modalities: { worse: 'Warm close room, evening', better: 'Open cool air' },
        aliases: ['pulsatilla', 'puls']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R49 (Rhinopulsan Sinusitis Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic sinusitis, maxillary/frontal catarrh, nasal obstruction and post-nasal drip.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r49', 'r-49', 'reckeweg sinusitis']
      },
      {
        name: 'Bakson Sinus Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves sinus headache, nasal congestion, frontal pressure and sneezing.',
        dosage: '1 tablet 3 times daily.',
        mrp: 165,
        aliases: ['sinus aid', 'bakson sinus']
      }
    ],
    dietAndRegimen: 'Steam inhalation with eucalyptus or plain water twice daily. Avoid chilled drinks, ice, and curd. Keep forehead warm.',
    warningNotes: 'If high fever, swelling around orbit or vision change occurs, urgently rule out orbital cellulitis.'
  },

  // 10. ECZEMA & PRURITIC DERMATITIS
  {
    id: 'eczema-dermatitis',
    nameEn: 'Eczema, Pruritus & Chronic Dermatitis',
    nameBn: 'একজিমা, চর্মরোগ ও তীব্র চুলকানি',
    chipLabel: 'Eczema / একজিমা',
    pathology: 'Atopic Dermatitis, Vesicular Eczema, Lichenification & Severe Pruritus',
    miasm: 'Psoric-Sycotic Cutaneous Diathesis',
    typicalPresentation: 'Oozing, crusting, or dry cracked skin lesions with violent itching worse at night and from warmth of bed',
    keywords: [
      'eczema', 'dermatitis', 'একজিমা', 'চর্মরোগ', 'চুলকানি', 'pruritus', 'skin rash',
      'oozing skin', 'dry skin', 'cracked skin', 'atopic dermatitis'
    ],
    classicalRemedies: [
      {
        name: 'Graphites',
        commonName: 'Black Lead',
        potency: '30C / 200C',
        dosage: '4 pills twice daily (30C) or weekly (200C)',
        keynotes: [
          'Eczema with discharge of thick, sticky, glutinous, honey-like fluid from cracks and crusts',
          'Skin rough, hard, dry, and prone to crack at bends of joints and behind ears',
          'Chilly, stout constitution prone to stubborn constipation'
        ],
        materiaMedicaNotes: 'Kent: Eruptions oozing a thick, honey-like, sticky fluid. Fissures at muco-cutaneous borders.',
        modalities: { worse: 'Warmth, night, menstruation', better: 'Dark, wrapping up' },
        aliases: ['graphites', 'graph']
      },
      {
        name: 'Sulphur',
        commonName: 'Sublimed Sulphur',
        potency: '200C',
        dosage: '4 pills once every 10 days in morning',
        keynotes: [
          'Voluptuous itching that is intensely pleasurable to scratch, followed by burning soreness',
          'Skin dry, scaly, unhealthy; aggravated by bathing and heat of bed',
          'Hungry at 11 AM, burning sensations in soles and vertex'
        ],
        materiaMedicaNotes: 'Kent: King of anti-psorics. Severe burning pruritus aggravated by heat of bed and washing.',
        modalities: { worse: 'Warmth of bed, washing, 11 AM', better: 'Dry warm weather' },
        aliases: ['sulphur', 'sulph']
      },
      {
        name: 'Mezereum',
        commonName: 'Spurge Olive',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Intolerable itching worse warmth of bed; scratching changes location of itch',
          'Thick leather-like crusts under which thick white pus collects',
          'Eczema around scalp, face, and flexures'
        ],
        materiaMedicaNotes: 'Boericke: Eruptions ulcerate and form thick scabs under which purulent matter exudes.',
        modalities: { worse: 'Warmth of bed, night, cold air', better: 'Open air' },
        aliases: ['mezereum', 'mez']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R23 (Eczema & Dermatosis Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Purifies blood and clears vesicular and dry eczema, scaly skin and pruritus.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r23', 'reckeweg eczema']
      },
      {
        name: 'SBL Graphites Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube',
        indications: 'Soothes dry, cracked, oozing eczema, fissures and rough lichenified skin.',
        dosage: 'Apply gently locally 2 times daily.',
        mrp: 85,
        aliases: ['graphites ointment', 'sbl graphites']
      }
    ],
    dietAndRegimen: 'Moisturize skin with pure coconut oil. Avoid scented chemical soaps, hot water showers, egg, prawns, and refined sugar.',
    warningNotes: 'Never use topical steroid ointments, which cause severe rebound exacerbation.'
  },

  // 11. HYPERTENSION & HIGH BLOOD PRESSURE
  {
    id: 'hypertension-high-bp',
    nameEn: 'Hypertension & Arterial Tension',
    nameBn: 'উচ্চ রক্তচাপ (হাই ব্লাড প্রেশার)',
    chipLabel: 'Hypertension / উচ্চ রক্তচাপ',
    pathology: 'Essential Hypertension, Arteriosclerosis & Vasomotor Instability',
    miasm: 'Syphilitic-Sycotic Vascular Diathesis',
    typicalPresentation: 'Occipital throbbing headache, flushed face, dizziness, palpitations, insomnia, elevated systolic/diastolic pressure',
    keywords: [
      'hypertension', 'high blood pressure', 'high bp', 'উচ্চ রক্তচাপ', 'ব্লাড প্রেশার',
      'প্রেশার', 'bp high', 'palpitation', 'মাথা গরম', 'ঘাড় ব্যথা প্রেশার'
    ],
    classicalRemedies: [
      {
        name: 'Rauvolfia Serpentina',
        commonName: 'Snakeroot / Sarpagandha',
        potency: 'Q / 1X',
        dosage: '10-15 drops in 1/4 cup water twice daily after meals',
        keynotes: [
          'Premier natural botanical hypotensive; calms nervous agitation and reduces peripheral vascular resistance',
          'Congestive headache, heat in head, restless sleep and palpitations',
          'Gently normalizes elevated systolic and diastolic blood pressure'
        ],
        materiaMedicaNotes: 'Boericke: Well established hypotensive and sedative. Calms the vascular and central nervous system.',
        modalities: { worse: 'Stress, mental worry', better: 'Quiet rest' },
        aliases: ['rauvolfia', 'rauwolfia', 'sarpagandha']
      },
      {
        name: 'Crataegus Oxyacantha',
        commonName: 'Hawthorn Berries',
        potency: 'Q',
        dosage: '10-15 drops in lukewarm water twice daily',
        keynotes: [
          'Supreme heart tonic; acts on heart muscle and dissolves atheromatous deposits in coronary and systemic arteries',
          'Arteriosclerosis, high blood pressure with myocardial weakness and dyspnea on slight exertion',
          'Sustained cardiovascular tonic without cumulative toxicity'
        ],
        materiaMedicaNotes: 'Boericke: A cardiac tonic. Lowers arterial tension. Acts on heart muscle as a gentle restorative.',
        modalities: { worse: 'Warm room, exertion', better: 'Fresh cool air, rest' },
        aliases: ['crataegus', 'crataegus oxyacantha']
      },
      {
        name: 'Glonoinum',
        commonName: 'Nitroglycerine',
        potency: '30C',
        dosage: '4 pills during acute congestive high BP spikes',
        keynotes: [
          'Violent throbbing pulsating congestive headache with surge of blood to head and carotid pulsation',
          'Cannot bear least heat of sun or warm room; sensation as if skull would burst',
          'Face flushed, hot, with pounding temporal vessels'
        ],
        materiaMedicaNotes: 'Kent: Surges of blood to the head and heart. Throbbing carotids. Cannot bear warmth or sun.',
        modalities: { worse: 'Sun, heat, stooping, jar', better: 'Cold applications, sitting erect' },
        aliases: ['glonoinum', 'glonoin']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R85 (Cardioten High BP Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '30 ml Drops',
        indications: 'Regulates arterial hypertension, stabilizes blood pressure, relieves cardiac palpitations and vascular tension.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 335,
        aliases: ['r85', 'r-85', 'reckeweg bp', 'reckeweg high blood pressure']
      },
      {
        name: 'SBL Rauvolfia Mother Tincture Q',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Natural hypotensive mother tincture to lower high blood pressure and soothe sleeplessness.',
        dosage: '15 drops in 1/4 cup water twice daily.',
        mrp: 140,
        aliases: ['sbl rauvolfia', 'sarpagandha q']
      }
    ],
    dietAndRegimen: 'Low sodium diet (<2g salt/day). Regular daily 30-minute brisk walk. Avoid tobacco, alcohol, and stress. Monitor BP weekly.',
    warningNotes: 'If systolic BP exceeds 180 mmHg or diastolic exceeds 110 mmHg with severe headache or visual disturbance, urgently seek emergency medical care.'
  },

  // 12. DIABETES MELLITUS
  {
    id: 'diabetes-glycemia',
    nameEn: 'Diabetes Mellitus & Glycemic Support',
    nameBn: 'ডায়াবেটিস ও রক্তে শর্করা নিয়ন্ত্রণ',
    chipLabel: 'Diabetes / ডায়াবেটিস',
    pathology: 'Metabolic Glycemia, Polyuria, Polydipsia, Diabetic Debility & Neuropathy',
    miasm: 'Sycotic-Tubercular Metabolic Diathesis',
    typicalPresentation: 'Frequent urination, excessive unquenchable thirst, ravenous appetite with progressive loss of weight, weakness',
    keywords: [
      'diabetes', 'sugar', 'ডায়াবেটিস', 'বহুমূত্র', 'রক্তে সুগার', 'polyuria', 'polydipsia',
      'সুগার বেশি', 'উচ্চ সুগার', 'ঘন ঘন প্রস্রাব', 'দুর্বলতা সুগার'
    ],
    classicalRemedies: [
      {
        name: 'Syzygium Jambolanum',
        commonName: 'Jamun / Black Plum Seeds',
        potency: 'Q',
        dosage: '15 drops in 1/4 cup lukewarm water 3 times daily before meals',
        keynotes: [
          'Premier homoeopathic specific for reducing glycemic levels and arresting glycosuria',
          'Polyuria, profuse urination of high specific gravity with constant unquenchable thirst',
          'Diabetic skin ulcers, prickly heat, and severe physical exhaustion'
        ],
        materiaMedicaNotes: 'Boericke: Has prompt effect in causing a decrease of sugar in urine. Tremendous thirst, weakness, large amounts of urine.',
        modalities: { worse: 'Sugar, carbohydrate heavy meals', better: 'Rest, hydration' },
        aliases: ['syzygium', 'syzygium jambolanum', 'jamun q']
      },
      {
        name: 'Gymnema Sylvestre',
        commonName: 'Gurmar (Sugar Destroyer)',
        potency: 'Q',
        dosage: '10-15 drops in water twice daily',
        keynotes: [
          'Direct botanical action on beta cells of pancreas; abolishes the taste for sweet substances',
          'Reduces post-prandial glucose excursions and aids metabolic control',
          'Profound diabetic debility and burning extremities'
        ],
        materiaMedicaNotes: 'Boericke: Abolishes the taste for sweet and bitter things. Regulates urinary sugar.',
        modalities: { worse: 'Sweets', better: 'Regular light diet' },
        aliases: ['gymnema', 'gurmar']
      },
      {
        name: 'Uranium Nitricum',
        commonName: 'Nitrate of Uranium',
        potency: '3X / 30C',
        dosage: '2 tablets (3X) or 4 pills (30C) twice daily',
        keynotes: [
          'Diabetes with prominent gastric symptoms, voracious appetite, and gastric ulceration',
          'Great emaciation despite eating heavily; polyuria with debility',
          'Burning in urethra with excessive urination'
        ],
        materiaMedicaNotes: 'Boericke: High blood sugar, profuse urination, great thirst, and rapid emaciation with indigestion.',
        modalities: { worse: 'Heavy meals', better: 'Moderate light nourishment' },
        aliases: ['uranium nit', 'uranium nitricum']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R40 (Diacardon Diabetes Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Supportive biological remedy for diabetes mellitus, metabolic exhaustion and polyuria.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r40', 'reckeweg diabetes']
      },
      {
        name: 'Bakson Diab Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Helps regulate blood sugar levels, mitigates fatigue, polyuria, and polydipsia.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['diab aid', 'bakson diabetes']
      }
    ],
    dietAndRegimen: 'Strictly avoid refined sugars, sweetened beverages, white bread, and fried sweets. Emphasize bitter gourd (karela), methi seeds, leafy greens, and whole grains. Walk daily.',
    warningNotes: 'Never discontinue prescribed insulin or oral antidiabetic drugs abruptly without endocrinologist guidance.'
  },

  // 13. LEUCORRHOEA & PELVIC CATARRH
  {
    id: 'leucorrhoea-discharge',
    nameEn: 'Leucorrhoea & Pelvic Inflammatory Catarrh',
    nameBn: 'শ্বেতপ্রদর ও জরায়ুর স্রাব (লিকোরিয়া)',
    chipLabel: 'Leucorrhoea / শ্বেতপ্রদর',
    pathology: 'Cervicitis, Vaginal Mucosal Catarrh & Chronic Pelvic Leucorrhoea',
    miasm: 'Sycotic-Psoric Diathesis with Pelvic Catarrh',
    typicalPresentation: 'Acrid, profuse, yellow/white vaginal discharge, severe pelvic weakness, lower backache, genital burning and itching',
    keywords: [
      'leucorrhoea', 'leucorrhea', 'white discharge', 'শ্বেতপ্রদর', 'লিকোরিয়া', 'সাদা স্রাব',
      'যোনিপথে স্রাব', 'vaginal discharge', 'pelvic discharge', 'সাদা স্রাব সমস্যা'
    ],
    classicalRemedies: [
      {
        name: 'Kreosotum',
        commonName: 'Beechwood Creosote',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Acrid, corrosive, foul-smelling, yellowish leucorrhoea that causes violent burning and excoriation of thighs',
          'Discharge stains linen yellow and stiffens like starch',
          'Severe post-menstrual leucorrhoea with bearing down and pruritus'
        ],
        materiaMedicaNotes: 'Kent: Acrid, corrosive, offensive leucorrhoea. Stiffens linen like starch. Violent burning in genitals.',
        modalities: { worse: 'Open air, cold, after menses', better: 'Warmth, motion' },
        aliases: ['kreosote', 'kreosotum']
      },
      {
        name: 'Sepia',
        commonName: 'Inky Juice of Cuttlefish',
        potency: '200C',
        dosage: '4 pills once weekly in morning',
        keynotes: [
          'Bearing down sensation as if all pelvic organs would protrude through vulva; must cross limbs to prevent it',
          'Yellowish-green, milky, or offensive leucorrhoea with intense pelvic heaviness and sacroiliac backache',
          'Apathetic, irritable to family members, dark pigmentation across nose and cheeks'
        ],
        materiaMedicaNotes: 'Boericke: Leucorrhoea yellow, greenish; bearing down sensation in pelvis; crossing legs relieves.',
        modalities: { worse: 'Forenoon, laundry work, cold air', better: 'Warmth of bed, vigorous exercise' },
        aliases: ['sepia', 'sep']
      },
      {
        name: 'Alumina',
        commonName: 'Pure Clay / Oxide of Aluminium',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Profuse, transparent, ropy, acrid leucorrhoea running down to heels',
          'Discharge during daytime only, relieved by cold water bathing',
          'Severe constipation with sluggish rectum; stool requires great straining even when soft'
        ],
        materiaMedicaNotes: 'Kent: Leucorrhoea acrid, profuse, transparent, running down to the heels; worse during day.',
        modalities: { worse: 'Periodical, afternoon, artificial foods', better: 'Cold water, open air' },
        aliases: ['alumina']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R38 (Ligamentous & Ovarian Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Regulates pelvic inflammation, relieves acrid white discharge, ovarian pain and lumbar backache.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r38', 'reckeweg leucorrhoea']
      },
      {
        name: 'Bakson Fem Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Restorative uterine tonic for leucorrhoea, menstrual irregularities and pelvic dragging pain.',
        dosage: '1 teaspoonful twice daily.',
        mrp: 155,
        aliases: ['fem aid', 'bakson fem aid']
      }
    ],
    dietAndRegimen: 'Maintain strict genital hygiene with clean boiled water. Wear dry cotton underwear. Avoid heavy spicy oily food and excessive tea/coffee.',
    warningNotes: 'If blood-stained discharge, pelvic mass, or foul necrotic odor occurs, urgently perform gynecological speculum examination.'
  },

  // 14. DYSMENORRHOEA & MENSTRUAL COLIC
  {
    id: 'dysmenorrhoea-painful-menses',
    nameEn: 'Dysmenorrhoea & Menstrual Spasmodic Colic',
    nameBn: 'কষ্টরজঃ ও ঋতুস্রাবের তীব্র পেট ব্যথা',
    chipLabel: 'Dysmenorrhoea / কষ্টরজঃ',
    pathology: 'Primary & Secondary Dysmenorrhoea, Uterine Spasm & Pelvic Congestion',
    miasm: 'Sycotic Diathesis with Myometrial Hypertonia',
    typicalPresentation: 'Severe cramping, radiating abdominal pain preceding or during menses, relieved by heat and bending double',
    keywords: [
      'dysmenorrhoea', 'dysmenorrhea', 'painful menses', 'কষ্টরজঃ', 'মাসিকের ব্যথা',
      'পিরিয়ডে ব্যথা', 'menstrual cramps', 'period pain', 'মেন্সের ব্যথা', 'তলপেটে টান'
    ],
    classicalRemedies: [
      {
        name: 'Magnesia Phosphorica',
        commonName: 'Phosphate of Magnesia',
        potency: '6X / 30C',
        dosage: '4 tablets (6X) dissolved in hot water every 1-2 hours during pain',
        keynotes: [
          'Master homoeopathic antispasmodic for violent cramping menstrual colic',
          'Pains shoot like lightning, causing patient to double up; distinct relief from hot water bottle and firm pressure',
          'Sudden onset and departure of pains'
        ],
        materiaMedicaNotes: 'Boericke: The great anti-spasmodic remedy. Menstrual colic, relieved by warmth and bending double.',
        modalities: { worse: 'Cold air, touch, uncovering', better: 'Warmth, bending double, friction, pressure' },
        aliases: ['mag phos', 'magnesia phosphorica']
      },
      {
        name: 'Colocynthis',
        commonName: 'Bitter Apple',
        potency: '30C',
        dosage: '4 pills every 2 hours in acute pain',
        keynotes: [
          'Violent agonizing cramping colic in abdomen and pelvis, compelling patient to bend double and press firmly with hands',
          'Severe irritability and anger; ailments from indignation or emotional vexation',
          'Pains relieved by hard pressure and warm applications'
        ],
        materiaMedicaNotes: 'Kent: Agonizing cutting pain causing the patient to bend double. Relieved by hard pressure.',
        modalities: { worse: 'Anger, food, touch', better: 'Doubling up, hard pressure, heat' },
        aliases: ['colocynth', 'colocynthis']
      },
      {
        name: 'Viburnum Opulus',
        commonName: 'High Cranberry / Cramp Bark',
        potency: 'Q / 30C',
        dosage: '10 drops in warm water (Q) or 4 pills (30C) 3 times daily',
        keynotes: [
          'Spasmodic dysmenorrhoea with bearing down pains radiating from sacrum around pelvis into thighs',
          'Pains feel as if breath would leave body; spasmodic contraction of pelvic floor',
          'Prevents habitual miscarriage and spasmodic dysmenorrhoea'
        ],
        materiaMedicaNotes: 'Boericke: A remedy for cramps, colicky pains in pelvic organs. Spasmodic and membranous dysmenorrhoea.',
        modalities: { worse: 'Before menses, lying on affected side', better: 'Rest, open air' },
        aliases: ['viburnum', 'viburnum opulus']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R75 (Dolomens Dysmenorrhoea Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Relieves spasmodic menstrual cramps, uterine colic, pelvic congestion and lumbar ache.',
        dosage: '10-15 drops in warm water every 1-2 hours during pain.',
        mrp: 310,
        aliases: ['r75', 'reckeweg dysmenorrhoea']
      },
      {
        name: 'SBL Mensovit Plus Capsules',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '10 Capsules',
        indications: 'Herbal & homoeopathic uterine regulator for painful, delayed or scanty menses.',
        dosage: '1 capsule twice daily starting 2-3 days before expected period.',
        mrp: 145,
        aliases: ['mensovit', 'sbl mensovit']
      }
    ],
    dietAndRegimen: 'Apply warm heating pad to lower abdomen. Sip warm chamomile or ginger tea. Avoid cold sour foods and excessive physical strain during menses.',
    warningNotes: 'If agonizing pain persists despite antispasmodics, evaluate for pelvic endometriosis or adenomyosis via pelvic ultrasound.'
  },

  // 15. MIGRAINE & VASCULAR HEMICRANIA
  {
    id: 'migraine-hemicrania',
    nameEn: 'Migraine & Vascular Hemicrania',
    nameBn: 'মাইগ্রেন ও একপাশীয় তীব্র মাথাব্যথা',
    chipLabel: 'Migraine / মাইগ্রেন',
    pathology: 'Neurovascular Hemicrania, Trigeminal Sensitization & Throbbing Cephalea',
    miasm: 'Psoric-Sycotic Vasomotor Diathesis',
    typicalPresentation: 'Unilateral pulsating headache, visual aura/photophobia, nausea, aggravated by bright light, sun, and noise',
    keywords: [
      'migraine', 'hemicrania', 'মাইগ্রেন', 'একপাশে মাথাব্যথা', 'অর্ধকপালে', 'মাথাব্যথা',
      'throbbing headache', 'vascular headache', 'মাথা যন্ত্রণা', 'মাথা দপদপ'
    ],
    classicalRemedies: [
      {
        name: 'Sanguinaria Canadensis',
        commonName: 'Blood Root',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Periodical right-sided sick headache; begins in occiput, ascends and settles over right eye',
          'Pain begins in morning, increases till midday, and declines at sunset',
          'Relieved by vomiting, quiet dark room, and sleep'
        ],
        materiaMedicaNotes: 'Boericke: Right-sided headache, begins in occiput, spreads upwards and settles over right eye. Worse sun, better sleep.',
        modalities: { worse: 'Sun, motion, noise, light', better: 'Sleep, vomiting, dark quiet room' },
        aliases: ['sanguinaria', 'sanguinaria canadensis']
      },
      {
        name: 'Spigelia Anthelmia',
        commonName: 'Pinkroot',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Violent left-sided neuralgia and migraine settling over left eye; eyeball feels too large for socket',
          'Follows the sun: begins at sunrise, reaches peak at noon, and gradually diminishes at sunset',
          'Aggravated by least noise, touch, or jar of bed'
        ],
        materiaMedicaNotes: 'Kent: Left-sided facial neuralgia and headache. Eye feels as if too large for orbit. Follows the course of the sun.',
        modalities: { worse: 'Touch, motion, noise, looking down', better: 'Lying with head high, washing with cold water' },
        aliases: ['spigelia']
      },
      {
        name: 'Iris Versicolor',
        commonName: 'Blue Flag',
        potency: '30C',
        dosage: '4 pills every 2 hours in acute migraine attack',
        keynotes: [
          'Sick migraine headache preceded by blur of vision (aura) before eyes',
          'Violent vomiting of sour, bitter, bilious fluid that burns the entire throat',
          'Periodical Sunday or weekend headache in brain workers'
        ],
        materiaMedicaNotes: 'Boericke: Sick headache with blurred vision. Vomiting of sour, bitter fluid. Periodical weekend headache.',
        modalities: { worse: 'Rest, spring, autumn', better: 'Gentle motion' },
        aliases: ['iris vers', 'iris versicolor']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R16 (Migraine & Neuralgia Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Relieves vascular hemicrania, throbbing migraine, ocular neuralgia and nervous cephalalgia.',
        dosage: '10-15 drops in water 3 times daily; in acute attack, every 30 minutes.',
        mrp: 310,
        aliases: ['r16', 'reckeweg migraine']
      },
      {
        name: 'Bakson Mig Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves unilateral throbbing migraine, nausea, visual aura and photophobia.',
        dosage: '1 tablet 3 times daily.',
        mrp: 170,
        aliases: ['mig aid', 'bakson migraine']
      }
    ],
    dietAndRegimen: 'Rest in a cool, dark, soundproof room. Avoid migraine triggers (aged cheese, chocolate, artificial sweeteners, monosodium glutamate, skipping meals). Drink adequate water.',
    warningNotes: 'If thunderclap headache with stiff neck, confusion, or speech disturbance develops, rule out intracranial hemorrhage.'
  },

  // 16. URTICARIA & ALLERGIC RASH
  {
    id: 'urticaria-hives',
    nameEn: 'Urticaria, Hives & Allergic Angioedema',
    nameBn: 'আমবাত ও এলার্জি (চুলকানি ও লাল চাকা চাকা দাগ)',
    chipLabel: 'Urticaria / আমবাত',
    pathology: 'Cutaneous Histaminic Vasodilation, Wheals, Pruritus & Allergic Angioedema',
    miasm: 'Psoric-Sycotic Hypersensitivity Diathesis',
    typicalPresentation: 'Sudden eruption of large red burning, stinging wheals all over body, violent itching worse from heat and exercise',
    keywords: [
      'urticaria', 'hives', 'আমবাত', 'এলার্জি', 'চাকা চাকা দাগ', 'wheals', 'allergy rash',
      'ত্বক ফুলে লাল', 'চুলকিয়ে চাকা', 'nettle rash'
    ],
    classicalRemedies: [
      {
        name: 'Apis Mellifica',
        commonName: 'Honey Bee Poison',
        potency: '30C / 200C',
        dosage: '4 pills every 2 hours in acute urticaria',
        keynotes: [
          'Large red, rosy, puffy, edematous wheals with stinging, burning, prickling pains like bee stings',
          'Intolerance of heat in any form; dramatic relief from cold water bathing or cold wet wraps',
          'Complete absence of thirst despite high fever or generalized puffiness'
        ],
        materiaMedicaNotes: 'Kent: Sudden puffing and edema. Stinging burning pains. Ameliorated by cold water; aggravated by heat.',
        modalities: { worse: 'Heat, warm room, touch', better: 'Cold water washing, cool air' },
        aliases: ['apis', 'apis mel', 'apis mellifica']
      },
      {
        name: 'Urtica Urens',
        commonName: 'Stinging Nettle',
        potency: 'Q / 30C',
        dosage: '10 drops in water (Q) or 4 pills (30C) 3 times daily',
        keynotes: [
          'Supreme specific for urticaria nodosa and nettle rash with intolerable burning and stinging heat',
          'Hives alternate with rheumatism or follow ingestion of shellfish, prawns, or crabs',
          'Skin feels like fire; violent itching of whole surface'
        ],
        materiaMedicaNotes: 'Boericke: Urticaria, burning heat, formication. Urticaria alternating with joint rheumatism or from shellfish.',
        modalities: { worse: 'Snow-air, touch, water, cool bathing', better: 'Gentle warmth' },
        aliases: ['urtica', 'urtica urens']
      },
      {
        name: 'Dulcamara',
        commonName: 'Bitter Sweet',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Urticaria erupting after exposure to sudden damp cold or sitting on cold ground after getting heated',
          'Wheals all over body with violent itching; scratching causes burning',
          'Chilly constitution aggravated by autumn wet changes'
        ],
        materiaMedicaNotes: 'Boericke: Urticaria brought on by exposure to cold, especially wet cold weather.',
        modalities: { worse: 'Cold damp weather, night', better: 'Warm dry room' },
        aliases: ['dulcamara', 'dulc']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R23 (Allergic Dermatosis Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Purifies blood, clears histaminic wheals, relieves intense burning pruritus and allergic urticaria.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r23', 'reckeweg urticaria']
      },
      {
        name: 'Bakson Aller Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Anti-allergic homoeopathic tablets for urticaria, allergic rhinitis, and cutaneous itching.',
        dosage: '1 tablet 3 times daily.',
        mrp: 165,
        aliases: ['aller aid', 'bakson allergy']
      }
    ],
    dietAndRegimen: 'Identify and eliminate food allergens (prawns, crabs, brinjal/eggplant, eggs, nuts, food colorings). Drink cool water. Wear loose cotton garments.',
    warningNotes: 'If lip, tongue, or laryngeal swelling (angioedema) causes breathing stridor, urgently administer emergency epinephrine.'
  },

  // 17. VERTIGO, DIZZINESS & MENIERE'S
  {
    id: 'vertigo-dizziness',
    nameEn: 'Vertigo, Dizziness & Meniere’s Syndrome',
    nameBn: 'মাথা ঘোরা ও ভারসাম্যহীনতা (ভার্টিগো)',
    chipLabel: 'Vertigo / মাথা ঘোরা',
    pathology: 'Benign Paroxysmal Positional Vertigo, Vestibular Neuritis & Labyrinthine Hydrops',
    miasm: 'Sycotic-Psoric Vestibular Diathesis',
    typicalPresentation: 'Room spinning sensation when turning head in bed, staggering gait, nausea, tinnitus, postural imbalance',
    keywords: [
      'vertigo', 'dizziness', 'মাথা ঘোরা', 'মাথা ঘোরে', 'ভার্টিগো', 'চক্ষু অন্ধকার',
      'spinning head', 'meniere', 'loss of balance', 'vestibular'
    ],
    classicalRemedies: [
      {
        name: 'Conium Maculatum',
        commonName: 'Poison Hemlock',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Master remedy for vertigo on turning head to left or right or rolling over in bed',
          'Sensation as if bed or surroundings were turning in a circle; worse on looking up or moving eyes',
          'Especially indicated in elderly patients with cerebral arteriosclerosis'
        ],
        materiaMedicaNotes: 'Boericke: Vertigo on turning head or rolling over in bed. Bed seems to spin. Elderly people.',
        modalities: { worse: 'Turning head, lying down, moving eyes', better: 'Dark, letting head hang down' },
        aliases: ['conium', 'conium maculatum']
      },
      {
        name: 'Cocculus Indicus',
        commonName: 'Indian Cockle',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Vertigo with severe nausea and vomiting, aggravated by riding in a car, bus, boat, or looking at moving objects',
          'Vertigo after night-watching, nursing the sick, or chronic loss of sleep',
          'Head feels hollow, heavy, and empty with mental sluggishness'
        ],
        materiaMedicaNotes: 'Kent: Vertigo from motion of carriage, boat, or cars. Associated with nausea and loss of sleep.',
        modalities: { worse: 'Motion of carriage, lack of sleep, sitting up', better: 'Lying quiet in bed' },
        aliases: ['cocculus', 'cocculus indicus']
      },
      {
        name: 'Gelsemium Sempervirens',
        commonName: 'Yellow Jasmine',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Dizziness spreading from occiput with heavy droopy eyelids and muscular weakness',
          'Trembling, staggering gait; patient wants to lie quiet with head elevated',
          'Complete lack of thirst with dull heavy mental state'
        ],
        materiaMedicaNotes: 'Boericke: Vertigo spreading from occiput with blurred vision and heavy eyelids. Muscular weakness.',
        modalities: { worse: 'Mental anticipation, sudden shock', better: 'Profuse urination, rest' },
        aliases: ['gelsemium', 'gels']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R29 (Theridion Vertigo Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Relieves vestibular vertigo, travel sickness, Meniere’s syndrome, dizziness and tinnitus.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r29', 'reckeweg vertigo']
      },
      {
        name: 'Bakson Vert Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Stabilizes vestibular balance, relieves spinning sensation and postural imbalance.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['vert aid', 'bakson vertigo']
      }
    ],
    dietAndRegimen: 'Perform vestibular rehabilitation exercises (Epley maneuver if BPPV). Avoid sudden jerky head movements. Limit high salt intake and caffeine.',
    warningNotes: 'If acute vertigo accompanied by facial droop, limb numbness, double vision, or slurred speech occurs, immediately rule out cerebellar stroke.'
  },

  // 18. INSOMNIA & SLEEPLESSNESS
  {
    id: 'insomnia-sleeplessness',
    nameEn: 'Insomnia, Sleeplessness & Restlessness',
    nameBn: 'অনিদ্রা ও ঘুমের সমস্যা (ইনসোমনিয়া)',
    chipLabel: 'Insomnia / অনিদ্রা',
    pathology: 'Psychogenic & Organic Insomnia, Hyperarousal & Circadian Dysregulation',
    miasm: 'Psoric-Syphilitic Nervous Diathesis',
    typicalPresentation: 'Inability to fall asleep due to racing thoughts, frequent nocturnal waking, restless tossing in bed, morning exhaustion',
    keywords: [
      'insomnia', 'sleeplessness', 'sleep disorder', 'অনিদ্রা', 'ঘুম না হওয়া', 'ঘুম হয় না',
      'ঘুমের সমস্যা', 'রাতে ঘুম নেই', 'restless sleep', 'রাত্রি জাগরণ'
    ],
    classicalRemedies: [
      {
        name: 'Coffea Cruda',
        commonName: 'Unroasted Coffee',
        potency: '30C / 200C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Wide awake state with rapid flow of creative ideas and nervous over-excitability; mind cannot stop thinking',
          'Slightest sound or clock tick disturbs sleep; nervous hypersensitivity to all impressions',
          'Ailments from pleasant surprises, joy, or mental overwork'
        ],
        materiaMedicaNotes: 'Boericke: Sleeplessness, wide awake, mind active; easy comprehension, influx of ideas. Intolerant of pain.',
        modalities: { worse: 'Night, noise, strong emotions', better: 'Warmth, lying quiet' },
        aliases: ['coffea', 'coffea cruda']
      },
      {
        name: 'Passiflora Incarnata',
        commonName: 'Passion Flower',
        potency: 'Q',
        dosage: '20-30 drops in 1/4 cup lukewarm water 30 minutes before bedtime',
        keynotes: [
          'Natural non-habit forming homoeopathic sedative; produces calm refreshing physiological sleep',
          'Restless, worried sleep in overworked business people and aged individuals',
          'Quiets nocturnal nervous excitement without morning grogginess'
        ],
        materiaMedicaNotes: 'Boericke: An efficient sedative. Induces normal sleep without narcotic after-effects.',
        modalities: { worse: 'Mental exhaustion, worry', better: 'Warm beverage, rest' },
        aliases: ['passiflora', 'passiflora incarnata']
      },
      {
        name: 'Kali Phosphoricum',
        commonName: 'Phosphate of Potassium',
        potency: '6X / 30C',
        dosage: '4 tablets (6X) dissolved in warm water at bedtime',
        keynotes: [
          'Insomnia from cerebral anemia, intellectual fatigue, mental burnout, and anxiety',
          'Patient wakes at 2 AM or 3 AM with anxious palpitating heart and nervous dread',
          'Supreme tissue salt for nervous exhaustion and depression'
        ],
        materiaMedicaNotes: 'Kent: Great nerve remedy for prostration, weak memory, and insomnia following mental strain.',
        modalities: { worse: 'Mental exertion, cold, worry', better: 'Warmth, gentle movement, eating' },
        aliases: ['kali phos', 'kali phosphoricum']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R14 (Quietude Sleep Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Natural non-addictive drops for chronic insomnia, nervous restlessness, neurasthenia and sleep disturbances.',
        dosage: '20 drops in water at bedtime.',
        mrp: 310,
        aliases: ['r14', 'reckeweg sleep', 'reckeweg insomnia']
      },
      {
        name: 'SBL Tranquil Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Relieves mental stress, daytime anxiety and promotes calm, restful nocturnal sleep.',
        dosage: '2-4 tablets dissolved in mouth at bedtime.',
        mrp: 160,
        aliases: ['tranquil', 'sbl tranquil']
      }
    ],
    dietAndRegimen: 'Maintain strict sleep hygiene (same sleep and wake time daily). Avoid blue light screens, tea, coffee, and nicotine after 6 PM. Keep bedroom dark and quiet.',
    warningNotes: 'Do not rely on chemical sedatives/benzodiazepines, which disrupt REM architecture and cause physical addiction.'
  },

  // 19. GOUT & HYPERURICEMIA
  {
    id: 'gout-uric-acid',
    nameEn: 'Gout & Hyperuricemic Arthritis',
    nameBn: 'গেঁটেবাত ও ইউরিক অ্যাসিড বৃদ্ধি (গাউট)',
    chipLabel: 'Gout / গেঁটেবাত',
    pathology: 'Monosodium Urate Crystal Deposition, Acute Podagra & Hyperuricemia',
    miasm: 'Sycotic Diathesis with Lithic Acid Dysplasia',
    typicalPresentation: 'Excruciating throbbing pain in great toe or ankle, joint fiery red, swollen, hypersensitive to touch or jarring of bed',
    keywords: [
      'gout', 'uric acid', 'গেঁটেবাত', 'ইউরিক অ্যাসিড', 'পায়ের বুড়ো আঙুল ব্যথা',
      'podagra', 'high uric acid', 'গাঁটে লাল ব্যথা', 'গেঁটে বাত'
    ],
    classicalRemedies: [
      {
        name: 'Colchicum Autumnale',
        commonName: 'Meadow Saffron',
        potency: '30C / 200C',
        dosage: '4 pills every 3 hours in acute attack',
        keynotes: [
          'Supreme specific for acute paroxysms of gout in big toe and small joints of feet and hands',
          'Joint is fiery red, swollen, hot; parts are so tender that patient screams at the sight of someone approaching',
          'Extreme aversion to the smell of cooking food, which causes nausea and faintness'
        ],
        materiaMedicaNotes: 'Boericke: Specifically indicated in gout. Big toe affected, hot, red, swollen; cannot bear touch or motion. Smell of food nauseates.',
        modalities: { worse: 'Touch, motion, cold damp weather, night', better: 'Warmth, doubling up' },
        aliases: ['colchicum', 'colchicum autumnale']
      },
      {
        name: 'Benzoicum Acidum',
        commonName: 'Benzoic Acid',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Gouty arthritis with highly offensive, strong, pungent urine smelling intensely of horse’s urine',
          'Uric acid deposits (tophi) in knuckles and Achilles tendons with cracking on motion',
          'Alternation of urinary symptoms with severe articular pains'
        ],
        materiaMedicaNotes: 'Kent: Great keynote is the intensely offensive urine like horse urine. Gouty deposits in joints.',
        modalities: { worse: 'Open air, uncovering, morning', better: 'Warmth' },
        aliases: ['benzoic acid', 'benzoicum acidum']
      },
      {
        name: 'Ledum Palustre',
        commonName: 'Marsh Tea',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Gout begins in feet and travels upwards; small joints of feet, heels, and ankles affected',
          'Lack of vital heat, yet parts are intensely relieved by cold water immersion or ice applications',
          'Warmth of bed is intolerable'
        ],
        materiaMedicaNotes: 'Boericke: Gouty pains travel upwards. Affected joints are relieved by cold applications and cold water.',
        modalities: { worse: 'Warmth of bed, heat, night', better: 'Cold water bathing, ice compresses' },
        aliases: ['ledum', 'ledum palustre']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R11 (Lumbago & Gout Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Alleviates uric acid diathesis, eliminates crystalline deposits, relieves acute podagra and joint swelling.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r11', 'reckeweg gout']
      },
      {
        name: 'Bakson Rheum Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves hyperuricemic arthralgia, joint stiffness and swelling of toes.',
        dosage: '1 tablet 3 times daily.',
        mrp: 175,
        aliases: ['rheum aid', 'bakson gout']
      }
    ],
    dietAndRegimen: 'Low purine diet: strictly avoid red meat, organ meats (liver/kidney), seafood, beer, and high fructose corn syrup. Drink 3-4 liters of water daily.',
    warningNotes: 'Monitor serum uric acid levels periodically to prevent chronic renal calculus and tophaceous nephropathy.'
  },

  // 20. CONJUNCTIVITIS & EYE INFECTION
  {
    id: 'conjunctivitis-eye-infection',
    nameEn: 'Conjunctivitis, Eye Inflammation & Styes',
    nameBn: 'চোখ ওঠা, কনজাংটিভাইটিস ও চোখের অঞ্জনী',
    chipLabel: 'Conjunctivitis / চোখ ওঠা',
    pathology: 'Catarrhal & Bacterial Conjunctivitis, Ciliary Injection & Hordeolum / Stye',
    miasm: 'Psoric-Sycotic Ocular Diathesis',
    typicalPresentation: 'Red, fiery eyes, burning, gritty foreign body sensation, morning agglutination of eyelids with purulent discharge',
    keywords: [
      'conjunctivitis', 'eye infection', 'চোখ ওঠা', 'চোখ লাল', 'চোখ দিয়ে জল',
      'stye', 'অঞ্জনী', 'অঞ্জনি', 'red eye', 'pink eye', 'চোখে পিঁচুটি'
    ],
    classicalRemedies: [
      {
        name: 'Euphrasia Officinalis',
        commonName: 'Eyebright',
        potency: '30C (Oral) & Eye Drops',
        dosage: '4 pills 3 times daily; also instil Euphrasia eye drops 1 drop twice daily',
        keynotes: [
          'Acrid, burning, excoriating lachrymation that burns and reddens the cheeks',
          'Profuse bland coryza contrasting with sharp acrid tears; sensation of sand in eyes',
          'Photophobia, worse in daylight and wind; eyelids gummed up in morning'
        ],
        materiaMedicaNotes: 'Boericke: Eyes watery all the time; tears acrid, burning, excoriating cheeks. Eyelids swollen and glued.',
        modalities: { worse: 'Light, sun, wind, evening', better: 'Dark room, wiping eyes' },
        aliases: ['euphrasia', 'eyebright']
      },
      {
        name: 'Staphysagria',
        commonName: 'Stavesacre',
        potency: '200C',
        dosage: '4 pills twice weekly',
        keynotes: [
          'Premier homoeopathic specific for recurring styes, chalazions, and blepharitis on margins of eyelids',
          'Styes that leave hard chronic indurations behind; itching of margin of lids',
          'Suppressed anger, resentment, and mortification in sensitive persons'
        ],
        materiaMedicaNotes: 'Kent: Recurrent styes and chalazia on eyelids, one after another, leaving hard nodules.',
        modalities: { worse: 'Touch, anger, morning', better: 'Rest, warmth' },
        aliases: ['staphysagria', 'staph']
      },
      {
        name: 'Argentum Nitricum',
        commonName: 'Nitrate of Silver',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Acute purulent ophthalmia with profuse thick, bland, yellowish pus oozing from eyes',
          'Conjunctiva intensely red, swollen, chemotic; caruncula inflamed and enlarged',
          'Relieved by cool air and cold washing, aggravated by warm close room'
        ],
        materiaMedicaNotes: 'Boericke: Great remedy for purulent ophthalmia. Discharge is thick, profuse, yellow. Better in cold air.',
        modalities: { worse: 'Warm room, heat', better: 'Cold fresh air, cold water' },
        aliases: ['arg nit', 'argentum nitricum']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Euphrasia Eye Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '10 ml Eye Drops',
        indications: 'Isotonic soothing herbal eye drops for conjunctivitis, eye redness, irritation, and allergic watering.',
        dosage: '1-2 drops into affected eye 3 times a day.',
        mrp: 85,
        aliases: ['euphrasia eye drops', 'sbl eye drops']
      },
      {
        name: 'Bakson Cineraria Maritima Eye Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '10 ml Eye Drops',
        indications: 'Soothes inflamed conjunctiva, clears corneal fatigue and prevents recurring ocular catarrh.',
        dosage: '1 drop into each eye twice daily.',
        mrp: 95,
        aliases: ['cineraria eye drops', 'bakson eye drops']
      }
    ],
    dietAndRegimen: 'Wash eyes with boiled lukewarm water. Wear dark sunglasses outdoors. Avoid rubbing eyes and never share eye towels.',
    warningNotes: 'If deep severe eyeball pain, corneal haze, or reduced visual acuity develops, consult an ophthalmologist immediately.'
  },

  // 21. OTITIS MEDIA & EARACHE
  {
    id: 'otitis-earache',
    nameEn: 'Otitis Media, Earache & Otorrhoea',
    nameBn: 'কান পাকা ও কানের তীব্র ব্যথা (ওটিটিস মিডিয়া)',
    chipLabel: 'Otitis / কান পাকা',
    pathology: 'Acute Catarrhal & Suppurative Otitis Media, Tympanic Congestion & Otorrhoea',
    miasm: 'Tubercular-Sycotic Diathesis with Aural Suppuration',
    typicalPresentation: 'Severe lancinating throbbing ear pain, yellow purulent discharge, temporary hearing loss, fever',
    keywords: [
      'otitis', 'earache', 'ear pain', 'কান পাকা', 'কানে ব্যথা', 'কান দিয়ে পুঁজ',
      'otorrhoea', 'ear discharge', 'কানে পুঁজ', 'কান ভোঁ ভোঁ'
    ],
    classicalRemedies: [
      {
        name: 'Chamomilla',
        commonName: 'German Chamomile',
        potency: '30C',
        dosage: '4 pills every 2 hours in acute excruciating pain',
        keynotes: [
          'Intolerable, agonizing ear pain driving patient to distraction and frenzy; child screams and demands to be carried',
          'One cheek is red and hot, the other pale and cold',
          'Extremely irritable, capricious; cannot bear anyone near'
        ],
        materiaMedicaNotes: 'Kent: Pain is unendurable, drives to madness. Child must be carried constantly. One cheek red, other pale.',
        modalities: { worse: 'Night, anger, wind, warmth', better: 'Being carried around' },
        aliases: ['chamomilla', 'cham']
      },
      {
        name: 'Pulsatilla Nigricans',
        commonName: 'Wind Flower',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Subacute or chronic otitis media with thick, bland, yellowish-green foul pus discharge without excoriation',
          'Sensation of fullness and plugging in ear with pulsating ache worse evening and in warm room',
          'Mild, weepy, gentle temperament with thirstlessness'
        ],
        materiaMedicaNotes: 'Boericke: Otorrhoea, thick, bland, yellowish-green discharge. Earache worse night and warm room.',
        modalities: { worse: 'Warm room, evening, lying on affected ear', better: 'Open cool air' },
        aliases: ['pulsatilla', 'puls']
      },
      {
        name: 'Silicea',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills twice weekly',
        keynotes: [
          'Chronic, indolent otorrhoea with foul, curd-like or watery discharge and perforation of eardrum',
          'Promotes resorption and healing of chronic mastoid or tympanic suppuration',
          'Chilly patient, sensitive to cold drafts, profuse offensive sweat'
        ],
        materiaMedicaNotes: 'Kent: Chronic suppurative otitis media. Foul offensive discharges with caries of ossicles.',
        modalities: { worse: 'Cold air, drafts', better: 'Warm wrapping, heat' },
        aliases: ['silicea', 'silica']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R1 (Biological Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Controls acute middle ear inflammation, reduces fever and resolves suppurative exudation.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 310,
        aliases: ['r1', 'reckeweg ear']
      },
      {
        name: 'Bakson Mullein Oil Ear Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '10 ml Drops',
        indications: 'Soothing natural ear drops for earache, dry ear canal, sensation of ear blockage and mild otorrhoea.',
        dosage: '2-3 drops into affected ear twice daily.',
        mrp: 85,
        aliases: ['mullein oil', 'bakson ear drops']
      }
    ],
    dietAndRegimen: 'Keep ears strictly dry during bathing (use dry cotton with petroleum jelly). Avoid inserting cotton buds, pins, or sharp objects into ear canal. Avoid swimming until eardrum heals.',
    warningNotes: 'If mastoid tenderness, post-auricular swelling, or persistent facial weakness appears, immediately seek ENT consultation.'
  },

  // 22. VITILIGO & LEUCODERMA (শ্বেতী রোগ ও লিকোডার্মা)
  {
    id: 'vitiligo-leucoderma',
    nameEn: 'Vitiligo, Leucoderma & Pigmentary Disorders',
    nameBn: 'শ্বেতী রোগ, লিকোডার্মা ও ত্বকের সাদা দাগ',
    chipLabel: 'Vitiligo / শ্বেতী রোগ',
    pathology: 'Autoimmune Melanocyte Destruction, Hypopigmentation & Cutaneous Dyscrasia',
    miasm: 'Syco-Syphilitic with Deep Constitutional Psoric Diathesis',
    typicalPresentation: 'Progressive depigmented milky-white macules and patches on hands, face, trunk or genitalia without sensation loss',
    keywords: [
      'vitiligo', 'leucoderma', 'শ্বেতী', 'শ্বেতকুষ্ঠ', 'সাদা দাগ', 'ত্বকের সাদা দাগ',
      'white patch', 'white spots', 'depigmentation', 'melanin loss', 'hypopigmentation',
      'vitiligo vulgaris', 'bason'
    ],
    classicalRemedies: [
      {
        name: 'Arsenicum Sulphuratum Flavum',
        commonName: 'Yellow Orpiment',
        potency: '3X / 6X / 30C',
        dosage: '2 tablets or 4 pills twice daily after meals',
        keynotes: [
          'Pre-eminent specific constitutional simillimum for vitiligo and patchy leucoderma',
          'Depigmentation with dry, scaly skin and scrofulous or tubercular diathesis',
          'Gradually stimulates dormant dermal melanocytes to restore natural skin color'
        ],
        materiaMedicaNotes: 'Boericke: Leucoderma, squamous skin eruptions, sciatica and constitutional skin dyscrasia. Highly praised by master homoeopaths for vitiligo.',
        modalities: { worse: 'Cold damp air, night', better: 'Warm applications, dry weather' },
        aliases: ['ars sulph flav', 'arsenicum sulphuratum flavum', 'yellow orpiment']
      },
      {
        name: 'Hydrocotyle Asiatica',
        commonName: 'Indian Pennywort (Thankuni)',
        potency: 'Q (Mother Tincture) / 30C',
        dosage: '10 drops in water twice daily orally',
        keynotes: [
          'Potent action on the malpighian layer of the epidermis, stimulating pigment restoration',
          'Circumscribed circular spots of skin thickening, depigmentation and exfoliating scales',
          'Accelerates cutaneous blood perfusion and epidermal regeneration'
        ],
        materiaMedicaNotes: 'Boericke: Great remedy for skin diseases, circular spots, epidermal thickening, and pigmentary changes. Psoriasis, erythema, and leucoderma.',
        modalities: { worse: 'Heat, morning', better: 'Cool bathing' },
        aliases: ['hydrocotyle', 'hydrocotyle asiatica', 'thankuni']
      },
      {
        name: 'Sepia Officinalis',
        commonName: 'Inky Juice of Cuttlefish',
        potency: '200C',
        dosage: '4 pills once every 3 days in the morning',
        keynotes: [
          'Chloasma, saddle-like brown or white discoloration across bridge of nose and face',
          'Hormonal pigmentary dyscrasia with venous stasis and pelvic relaxation',
          'Chilly constitution with apathy and constitutional pigmentation anomalies'
        ],
        materiaMedicaNotes: 'Kent & Boericke: Brown spots on chest and abdomen, yellow saddle across nose. Leucoderma associated with neuro-endocrine disharmony.',
        modalities: { worse: 'Cold air, laundry work, dampness', better: 'Vigorous physical exercise, warmth' },
        aliases: ['sepia', 'sepia officinalis']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Babchi Oil / Psoralea Corylifolia (External & Drops)',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml / 60 ml Oil & Drops',
        indications: 'Depigmentation of skin, vitiligo, leucoderma, white patches, accelerates melanin synthesis.',
        dosage: 'Apply externally over white spots and expose to mild morning sunlight for 10-15 mins; 10-15 drops orally in water twice daily.',
        mrp: 180,
        aliases: ['babchi', 'babchi oil', 'psoralea corylifolia', 'sbl babchi', 'vitiligo oil']
      },
      {
        name: 'Dr. Reckeweg R60 (Blood Purifier / Impure Skin)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Constitutional blood purifier, deep-seated skin dyscrasias, vitiligo, scrofulous diathesis, stimulates cellular skin metabolism.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r60', 'r-60', 'reckeweg 60', 'dr reckeweg r60', 'purisan']
      },
      {
        name: 'Bakson Baksoin Drops / B27',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Pigmentary disorders, leucoderma, vitiligo, patchy skin discoloration, stimulates melanocytes and repigmentation.',
        dosage: '10-15 drops in lukewarm water 3 times daily.',
        mrp: 210,
        aliases: ['baksoin', 'b27', 'bakson b27', 'baksoin drops']
      }
    ],
    dietAndRegimen: 'Consume copper-enriched water (stored overnight in copper vessel). Increase intake of green leafy vegetables, figs, walnuts, and carrots. Avoid citrus sour fruits (lemon, tamarind), pickles, vinegar, and artificial food preservatives during treatment.',
    warningNotes: 'Protect depigmented lesions from severe sunburn. Rule out autoimmune thyroiditis (Hashimoto) and pernicious anemia through serum TSH and Vitamin B12 panels.'
  },

  // 23. ENURESIS & NOCTURNAL BEDWETTING (শয্যামূত্র ও বিছানায় প্রস্রাব) - STRICTLY NEVER R52!
  {
    id: 'enuresis-bedwetting',
    nameEn: 'Enuresis, Nocturnal Bedwetting & Urinary Incontinence',
    nameBn: 'শয্যামূত্র, বিছানায় প্রস্রাব ও মূত্র অসাড়তা',
    chipLabel: 'Enuresis / শয্যামূত্র',
    pathology: 'Detrusor Muscle Instability, Nocturnal Polyuria & Neurological Bladder Sphincter Weakness',
    miasm: 'Psoro-Sycotic Diathesis with Neuro-Muscular Atony',
    typicalPresentation: 'Involuntary urination during sleep at night in children or adults; dreams of urinating, difficult to awaken',
    keywords: [
      'enuresis', 'bedwetting', 'bed wetting', 'nocturnal enuresis', 'শয্যামূত্র',
      'বিছানায় প্রস্রাব', 'বিছানায় প্রস্রাব', 'ঘুমের মধ্যে প্রস্রাব', 'incontinence',
      'involuntary urination', 'peeing in bed', 'night incontinence', 'bladder weakness'
    ],
    classicalRemedies: [
      {
        name: 'Causticum',
        commonName: "Hahnemann's Tinctura Acris Sine Kali",
        potency: '200C',
        dosage: '4 pills at bedtime once every 2 days',
        keynotes: [
          'Involuntary urination during first sleep; bladder neck weakness and paresis',
          'Urine passes easily without awareness while coughing, sneezing, or walking',
          'Sympathetic, anxious children with neuromuscular weakness'
        ],
        materiaMedicaNotes: 'Boericke: Involuntary passage of urine when coughing, sneezing, or during the first sleep at night. Weakness of the bladder sphincter.',
        modalities: { worse: 'Clear fine weather, cold dry wind', better: 'Damp wet weather, warm bed' },
        aliases: ['causticum', 'caust']
      },
      {
        name: 'Kreosotum',
        commonName: 'Beechwood Kreosote',
        potency: '200C',
        dosage: '4 pills at bedtime in acute cases',
        keynotes: [
          'Enuresis during very profound sleep; child is exceedingly difficult to awaken',
          'Dreams that he is urinating in a decent place or pot, and wakes up wet',
          'Offensive dark urine with smarting of vulva and genitalia'
        ],
        materiaMedicaNotes: 'Kent & Boericke: Can only urinate when lying down. Dreams he is urinating in a proper place. Enuresis during early deep sleep.',
        modalities: { worse: 'Open air, cold, resting in bed', better: 'Warmth, hot food' },
        aliases: ['kreosotum', 'kreosote']
      },
      {
        name: 'Equisetum Hyemale',
        commonName: 'Horsetail / Scouring Rush',
        potency: '30C',
        dosage: '4 pills twice daily (evening and bedtime)',
        keynotes: [
          'Habitual bedwetting in children with no evident organic cause',
          'Enuresis associated with night terrors or dreams of urinating',
          'Dull full ache in bladder not relieved by micturition'
        ],
        materiaMedicaNotes: 'Boericke: Principal action on the urinary bladder. Enuresis nocturna in children, when there is no organic disease other than habits. Dysuria.',
        modalities: { worse: 'Right side, movement, pressure', better: 'After urination, lying down' },
        aliases: ['equisetum', 'equisetum hyemale', 'horsetail']
      },
      {
        name: 'Cina Maritima',
        commonName: 'Wormseed',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in children with parasite history',
        keynotes: [
          'Bedwetting associated with intestinal worm infestation (Enterobius/Oxyuris)',
          'Child grinds teeth in sleep, picks at nose, irritable and restless at night',
          'Turbid white urine turning milky on standing'
        ],
        materiaMedicaNotes: 'Boericke: Twitching of facial muscles and nocturnal enuresis associated with worms. Involuntary urination at night in cross, irritable children.',
        modalities: { worse: 'Touch, looking at him, night', better: 'Lying on abdomen' },
        aliases: ['cina', 'cina maritima']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R74 (Enuresis Nocturna Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nocturnal enuresis in children, bedwetting, bladder weakness, nervous bladder incontinence. (Strictly for nocturnal enuresis).',
        dosage: '10-15 drops in 1/4 glass of water before bedtime and twice during the day.',
        mrp: 310,
        aliases: ['r74', 'r-74', 'reckeweg 74', 'dr reckeweg r74', 'nocturnisan']
      },
      {
        name: 'SBL Drops No. 7 / EnurAid',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Nocturnal enuresis, involuntary bedwetting in children, diurnal incontinence, weak bladder sphincter.',
        dosage: '10-15 drops in water 3 times daily; last dose at bedtime.',
        mrp: 175,
        aliases: ['sbl drops 7', 'sbl drops no 7', 'enuraid', 'sbl enuraid', 'enuresis drops']
      },
      {
        name: 'Bakson B45 Enuresis Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Bedwetting, nocturnal enuresis during deep sleep, nervous incontinence in children and elders.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 200,
        aliases: ['b45', 'bakson b45', 'enuresis drops b45']
      }
    ],
    dietAndRegimen: 'Restrict fluids 2 hours before bedtime. Empty bladder strictly twice before sleeping (double-voiding). Wake child up once at night around 2 AM to void. Avoid sugary sodas, dairy milk, and cold watermelon in the late evening.',
    warningNotes: 'If associated with painful burning micturition, fever, or day-time dribbling, perform urine routine and culture to exclude urinary tract infection or posterior urethral valve.'
  },

  // 24. VOMITING, NAUSEA & MOTION SICKNESS (বমি ও মোশন সিকনেস)
  {
    id: 'vomiting-nausea',
    nameEn: 'Vomiting, Nausea & Motion Sickness',
    nameBn: 'বমি, বমি ভাব ও মোশন সিকনেস (গাড়ি চড়লে বমি)',
    chipLabel: 'Vomiting / বমি ভাব',
    pathology: 'Gastric Irritation, Vestibular Reflex Emesis, Hyperemesis Gravidarum',
    miasm: 'Acute Psoric with Reflex Autonomic Dysregulation',
    typicalPresentation: 'Persistent nausea, violent retching, vomiting of food or bile, motion sickness during travel in car or boat',
    keywords: [
      'vomiting', 'nausea', 'motion sickness', 'travel sickness', 'morning sickness',
      'বমি', 'বমি ভাব', 'বমি বমি ভাব', 'গাড়ি চড়লে বমি', 'গাড়ি চড়লে বমি', 'hyperemesis',
      'seasickness', 'car sickness', 'retching'
    ],
    classicalRemedies: [
      {
        name: 'Ipecacuanha',
        commonName: 'Ipecac Root',
        potency: '30C',
        dosage: '4 pills every 1-2 hours in acute nausea and vomiting',
        keynotes: [
          'Persistent constant nausea not relieved for a moment even by vomiting',
          'Clean, red, uncoated tongue despite constant violent retching and salivation',
          'Empty stomach vomiting, gastro-enteritis, nausea from dietary indiscretion'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy for persistent nausea and vomiting, which does not relieve. Clean tongue, profuse salivation.',
        modalities: { worse: 'Periodically, warm moist winds, lying down', better: 'Open fresh air' },
        aliases: ['ipecac', 'ipecacuanha']
      },
      {
        name: 'Tabacum',
        commonName: 'Tobacco',
        potency: '30C',
        dosage: '4 pills dissolved in water before and during travel',
        keynotes: [
          'Incessant deathly nausea and motion sickness with cold clammy perspiration',
          'Terrible sinking sensation in pit of stomach; relieved by uncovering the abdomen',
          'Relieved by fresh cold air, opening the window of moving car or boat'
        ],
        materiaMedicaNotes: 'Boericke: Incessant nausea, vomiting, icy coldness and sweat. Seasickness, car sickness. Patient wants abdomen uncovered and cool fresh air.',
        modalities: { worse: 'Least motion, heat, tobacco smoke', better: 'Open cool air, uncovering abdomen' },
        aliases: ['tabacum', 'tobacco']
      },
      {
        name: 'Cocculus Indicus',
        commonName: "Indian Cockle / Fisher's Berries",
        potency: '30C / 200C',
        dosage: '4 pills before travel or every 2 hours in vertigo and nausea',
        keynotes: [
          'Nausea and motion sickness from riding in cars, carriages, boats, or trains',
          'Sickness aggravated by loss of sleep, night nursing, or watching over sick',
          'Nausea at thought or smell of food, accompanied by dizzy whirling vertigo'
        ],
        materiaMedicaNotes: 'Kent & Boericke: Affections caused by the motion of a carriage, swing, or car; seasickness. Nausea with faintness and vomiting.',
        modalities: { worse: 'Motion of vehicle, lack of sleep, cold drafts', better: 'Lying quiet in dark warm room' },
        aliases: ['cocculus', 'cocculus indicus']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R52 (Vomiting Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nausea, vomiting of pregnancy (hyperemesis gravidarum), motion sickness, travel sickness, acute gastritis.',
        dosage: '10-15 drops in water every 1-2 hours in acute vomiting, then 3 times daily.',
        mrp: 310,
        aliases: ['r52', 'r-52', 'reckeweg 52', 'dr reckeweg r52', 'vomisan']
      },
      {
        name: 'Bakson B33 Vomiting Drops / Vomitaid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Nausea, vomiting, motion sickness, gastroduodenal reflex and nausea after dietary indiscretions.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 190,
        aliases: ['b33', 'bakson b33', 'vomitaid']
      },
      {
        name: 'Dr. Reckeweg R29 (Vertigo & Motion Sickness Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Vertigo, travel dizziness, motion sickness, Meniere syndrome with nausea.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r29', 'r-29', 'reckeweg 29', 'theridon']
      }
    ],
    dietAndRegimen: 'Sip oral rehydration salts (ORS) or electrolyte water slowly in teaspoonfuls. Ginger tea or sucked ice chips calm vomiting reflex. Avoid heavy greasy food and strong odors.',
    warningNotes: 'In hyperemesis gravidarum or intractable vomiting with severe dehydration (sunken eyes, ketonuria, hypotension), refer for urgent IV hydration.'
  },

  // 25. MEMORY, BRAIN EXHAUSTION & MENTAL FATIGUE (স্মৃতিশক্তি হ্রাস ও ব্রেন ফগ)
  {
    id: 'memory-mental-fatigue',
    nameEn: 'Memory Loss, Brain Exhaustion & Mental Fatigue',
    nameBn: 'স্মৃতিশক্তি হ্রাস, ব্রেন ফগ ও মানসিক অবসাদ',
    chipLabel: 'Memory / স্মৃতিশক্তি',
    pathology: 'Cerebral Neurasthenia, Cognitive Fatigue & Intellectual Overwork',
    miasm: 'Psoro-Tubercular Diathesis with Nervous Atony',
    typicalPresentation: 'Forgetfulness, inability to concentrate, brain fog in students during exams, mental fatigue in professionals and elderly',
    keywords: [
      'memory', 'brain exhaustion', 'mental fatigue', 'forgetfulness', 'brain fog',
      'স্মৃতিশক্তি', 'মনে থাকে না', 'মানসিক ক্লান্তি', 'ব্রেন ফগ', 'পড়া মনে থাকে না',
      'intellectual exhaustion', 'lack of concentration'
    ],
    classicalRemedies: [
      {
        name: 'Anacardium Orientale',
        commonName: 'Marking Nut',
        potency: '200C',
        dosage: '4 pills twice weekly in the morning',
        keynotes: [
          'Sudden complete loss of memory from over-study, mental strain, or anxiety',
          'Examination funk; students unable to remember what they prepared so well',
          'Internal conflict, irritability, relieved temporarily while eating'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy for loss of memory, brain-fag, nervous exhaustion in students and mental workers. Symptoms disappear while eating.',
        modalities: { worse: 'Mental exertion, empty stomach, cold', better: 'While eating, warmth' },
        aliases: ['anacardium', 'anacardium orientale']
      },
      {
        name: 'Kali Phosphoricum',
        commonName: 'Phosphate of Potassium',
        potency: '6X / 30C',
        dosage: '4 tablets or 4 pills 3 times daily in warm water',
        keynotes: [
          'Sovereign nerve and brain nutrient for brain fag, intellectual exhaustion and neurasthenia',
          'Memory weak, cannot bear mental labor, headaches with nervous dread',
          'Relieves mental prostration, night terrors, and muscular weakness'
        ],
        materiaMedicaNotes: 'Boericke & Schussler: One of the greatest nerve remedies. Prostration, mental and physical depression from overwork and worry. Brain fag.',
        modalities: { worse: 'Mental exertion, cold, worry', better: 'Warmth, rest, nourishment' },
        aliases: ['kali phos', 'kali phosphoricum']
      },
      {
        name: 'Baryta Carbonica',
        commonName: 'Carbonate of Barium',
        potency: '30C / 200C',
        dosage: '4 pills twice weekly in seniors or slow-developing children',
        keynotes: [
          'Weakness of memory in elderly individuals with cerebral arteriosclerosis',
          'Slow mental comprehension, bashful children with dwarfish physical and mental development',
          'Frequent throat catarrh and chronically enlarged tonsils'
        ],
        materiaMedicaNotes: 'Boericke: Memory deficient; forgetful, inattentive. Specially indicated in infancy and old age. Senile mental decay.',
        modalities: { worse: 'Cold damp air, thinking of symptoms', better: 'Walking in open air' },
        aliases: ['baryta carb', 'baryta carbonica']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R54 (Cerebral / Intellectual Exhaustion)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Mental fatigue, intellectual exhaustion, lack of concentration, memory loss, brain fog in students and seniors.',
        dosage: '10-15 drops in quarter cup water 3 times daily.',
        mrp: 310,
        aliases: ['r54', 'r-54', 'reckeweg 54', 'dr reckeweg r54', 'cerebrol']
      },
      {
        name: 'SBL Brahmi / Ginkgo Biloba Drops',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Cognitive enhancer, sharpens memory, relieves cerebral fatigue, nervousness and mental strain.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 195,
        aliases: ['brahmi drops', 'ginkgo drops', 'sbl brahmi', 'brahmi']
      },
      {
        name: 'Bakson B62 Memory Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Weak memory, mental dullness, forgetfulness, brain exhaustion from prolonged study or work.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 210,
        aliases: ['b62', 'bakson b62', 'memory drops']
      }
    ],
    dietAndRegimen: 'Adequate sleep (7-8 hours). Daily consumption of soaked almonds, walnuts, pumpkin seeds and fresh berries. Take short breaks during intense mental work. Practice deep diaphragmatic breathing (pranayama) outdoors.',
    warningNotes: 'If memory impairment is rapidly progressive with disorientation or motor tremors, evaluate for dementia or neurological conditions.'
  }
];

