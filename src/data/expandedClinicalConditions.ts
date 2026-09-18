import { ClinicalCondition } from './clinicalRepertoryData';

export const EXPANDED_CLINICAL_CONDITIONS: ClinicalCondition[] = [
  // 1. HYDROCELE / TESTICULAR SWELLING
  {
    id: 'hydrocele-testicular-swelling',
    nameEn: 'Hydrocele & Testicular Swelling / Orchitis',
    nameBn: 'হাইড্রোসিল ও অণ্ডকোষ বৃদ্ধি (অণ্ডকোষে জল জমা)',
    chipLabel: 'Hydrocele / হাইড্রোসিল',
    pathology: 'Hydrocele & Scrotal Fluid Accumulation / অণ্ডকোষে জল জমা',
    miasm: 'Sycotic-Tubercular Diathesis with Serous Effusion',
    typicalPresentation: 'Enlarged scrotum with serous fluid accumulation, bruised testicular ache aggravated before damp stormy weather',
    keywords: [
      'hydrocele', 'হাইড্রোসিল', 'অণ্ডকোষ বৃদ্ধি', 'testicle', 'scrotum', 'orchitis', 'scrotal swelling',
      'water in testicle', 'swollen testicle', 'hydrocoele', 'অণ্ডকোষ ফোলা', 'অণ্ডকোষে জল', 'অণ্ডকোষে ব্যথা',
      'টেস্টিস ফোলা', 'অণ্ডকোষ', 'water in scrotum', 'testicular inflammation'
    ],
    classicalRemedies: [
      {
        name: 'Rhododendron Chrysanthum',
        commonName: 'Yellow Snow-Rose',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Master remedy for chronic hydrocele in boys and adults with bruised, crushed pain in testicles',
          'Testicles feel swollen, drawn up, and contused; severe aggravation before a thunderstorm or windy weather',
          'Drawing pains extending into thighs and abdomen; scrotum feels cold'
        ],
        materiaMedicaNotes: 'Boericke: Chronic hydrocele in boys and adults. Testicles swollen, drawn up, bruised pain. Aggravated before storms, windy weather.',
        modalities: {
          worse: 'Before a storm, windy wet weather, rest',
          better: 'Warmth, gentle motion, dry weather'
        },
        aliases: ['rhododendron', 'rhodo', 'rhododendron chrysanthum']
      },
      {
        name: 'Clematis Erecta',
        commonName: 'Virgin’s Bower',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Right-sided hydrocele and orchitis; testicle inflamed, swollen, hard and intensely painful to touch',
          'Painful urination with interrupted or dribbling flow; aggravated by warmth of bed',
          'Aching drawing pains extending through spermatic cord into groin'
        ],
        materiaMedicaNotes: 'Kent: Great remedy for inflammatory and painful right-sided hydrocele and orchitis following gonorrhoeal suppression. Hard induration of testicle.',
        modalities: {
          worse: 'Warmth of bed, night, touch',
          better: 'Open air, cold bathing'
        },
        aliases: ['clematis', 'clematis erecta']
      },
      {
        name: 'Pulsatilla Nigricans',
        commonName: 'Wind Flower',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Hydrocele with aching drawing pains extending into abdomen, testicle swollen and hanging low',
          'Mild, yielding, tearful disposition; distinct relief from cool open air and cold applications',
          'Complete absence of thirst with chilliness even in warm rooms'
        ],
        materiaMedicaNotes: 'Boericke: Testicles inflamed, painful, swollen with drawing pain extending into abdomen. Ameliorated by open cold air.',
        modalities: {
          worse: 'Warm stuffy room, evening, lying on affected side',
          better: 'Open cool air, cold applications, slow gentle walking'
        },
        aliases: ['pulsatilla', 'puls', 'pulsatilla nigricans']
      },
      {
        name: 'Silicea',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills once daily in morning for 2 weeks',
        keynotes: [
          'Chronic fluid collection in tunica vaginalis; accelerates biological resorption of hydrocele fluid',
          'Scrotum feels cold and relaxed with offensive, profuse perspiration around genitalia',
          'Chilly constitution, sensitive to cold drafts, deficient assimilation'
        ],
        materiaMedicaNotes: 'Kent: Deep antipsoric and antisycotic. Absorbs chronic serous effusions, hydrocele, and indolent cystic swellings.',
        modalities: {
          worse: 'Cold air, drafts, uncovering',
          better: 'Warm wrapping, heat to parts'
        },
        aliases: ['silicea', 'silica']
      },
      {
        name: 'Conium Maculatum',
        commonName: 'Poison Hemlock',
        potency: '200C',
        dosage: '4 pills once every alternate day',
        keynotes: [
          'Hard, stony induration of testicle and chronic hydrocele following physical injury, contusion, or blow',
          'Heavy dragging sensation in scrotum with piercing stitching pains',
          'Associated urinary difficulty with intermittent flow'
        ],
        materiaMedicaNotes: 'Boericke: Contusions and indurations of glandular tissue. Testicles swollen and stony hard following trauma.',
        modalities: {
          worse: 'Lying down, motion, cold air',
          better: 'Dark, letting limbs hang down, warm room'
        },
        aliases: ['conium', 'conium maculatum']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R16 / R1 (Inflammation & Serous Effusion Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Reduces scrotal fluid accumulation, inflammatory orchitis, testicular induration and serous exudation.',
        dosage: '10-15 drops in 1/4 cup water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r16', 'r1', 'reckeweg hydrocele', 'reckeweg orchitis']
      },
      {
        name: 'Wheezal WL-33 (Hydrocele & Orchitis Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Clinically proven patent formulation for hydrocele, epididymitis, acute/chronic orchitis and scrotal swelling.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 180,
        aliases: ['wl-33', 'wl 33', 'wheezal hydrocele', 'wheezal wl-33']
      },
      {
        name: 'Bakson Orchitis Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves scrotal enlargement, dragging testicle pain, fluid accumulation in tunica vaginalis, and inflammatory swelling.',
        dosage: '10-15 drops in lukewarm water 3 times daily.',
        mrp: 175,
        aliases: ['bakson orchitis', 'orchitis drops', 'bakson hydrocele']
      },
      {
        name: 'SBL Drops No. 3',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves testicular swelling, tenderness, hydrocele fluid retention, and dragging ache in spermatic cord.',
        dosage: '10-15 drops in 1/4 cup water 3 times daily.',
        mrp: 160,
        aliases: ['sbl drops no 3', 'sbl drops 3', 'sbl no 3', 'sbl hydrocele']
      }
    ],
    dietAndRegimen: 'Wear a supportive scrotal suspensory bandage during daytime walking. Avoid heavy weight lifting, cycling, and strenuous physical straining. Drink clean boiled water.',
    warningNotes: 'If acute severe unilateral pain, nausea, or fever develops suddenly, urgently rule out testicular torsion via testicular Doppler ultrasound.'
  },

  // 2. PILES & HAEMORRHOIDS
  {
    id: 'piles-haemorrhoids',
    nameEn: 'Piles & Haemorrhoids (Bleeding & Blind)',
    nameBn: 'অর্শ ও পাইলস (রক্তক্ষরণ ও মলদ্বারে মাংসপিণ্ড)',
    chipLabel: 'Piles / অর্শ',
    pathology: 'Haemorrhoidal Congestion, Varicose Rectal Veins & Anal Bleeding / অর্শ ও রক্তক্ষরণ',
    miasm: 'Psora-Sycotic Diathesis with Venous Engorgement',
    typicalPresentation: 'Painful purple piles protruding after stool, bleeding bright or dark blood, severe backache and rectal fullness',
    keywords: [
      'piles', 'haemorrhoids', 'hemorrhoids', 'অর্শ', 'পাইলস', 'মলদ্বারে রক্ত', 'bleeding piles', 'anal piles',
      'rectal piles', 'পাইলস রোগ', 'অর্শ রোগ', 'মলদ্বারে মাংসপিণ্ড', 'bawasir', 'arsha', 'blood in stool',
      'anal bleeding', 'rectal bleeding'
    ],
    classicalRemedies: [
      {
        name: 'Aesculus Hippocastanum',
        commonName: 'Horse Chestnut',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Dry, aching rectum feeling full of small sticks, knives, or splinters; blind or purple piles',
          'Severe dull aching sacroiliac backache; back gives out during walking or stooping',
          'Piles rarely bleed but are intensely painful, burning, and purple-congested'
        ],
        materiaMedicaNotes: 'Kent: Characteristic sensation of dryness and sticks in rectum with prominent lumbosacral aching. Veins engorged and purple.',
        modalities: {
          worse: 'Morning, walking, stooping, standing',
          better: 'Cool open air, summer, rest'
        },
        aliases: ['aesculus', 'aesculus hipp', 'horse chestnut']
      },
      {
        name: 'Collinsonia Canadensis',
        commonName: 'Stone Root',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Chronic painful bleeding piles with obstinate constipation and dry, hard, knotty stools',
          'Sensation of sharp gravel or sand lodged in the rectum with intense pelvic vascular congestion',
          'Alternation of piles with cardiac or chest symptoms; particularly useful in pregnancy'
        ],
        materiaMedicaNotes: 'Boericke: Pelvic and portal congestion resulting in dysmenorrhoea and haemorrhoids. Sensation of sharp gravel in rectum.',
        modalities: {
          worse: 'Cold, slight emotion, pregnancy',
          better: 'Warmth, lying down quietly'
        },
        aliases: ['collinsonia', 'collinsonia canadensis']
      },
      {
        name: 'Hamamelis Virginica',
        commonName: 'Witch Hazel',
        potency: 'Q / 30C',
        dosage: '10 drops in 1/4 cup water (Q) or 4 pills (30C) 3 times daily',
        keynotes: [
          'Profuse dark, passive, venous rectal haemorrhage without excessive straining',
          'Rectum feels bruised, sore, raw, and aching as if torn apart',
          'Large pulsating varicose haemorrhoids that bleed freely with weakness disproportionate to blood loss'
        ],
        materiaMedicaNotes: 'Kent: Supreme venous vascular remedy. Relieves passive dark venous oozing and bruised soreness in mucosal beds.',
        modalities: {
          worse: 'Warm moist air, pressure, touch, jar',
          better: 'Rest, quietude'
        },
        aliases: ['hamamelis', 'hamamelis virginica', 'witch hazel']
      },
      {
        name: 'Nux Vomica',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Blind or bleeding piles in sedentary patients; frequent ineffectual urging for stool',
          'Aggravated by spicy rich foods, alcohol, coffee, purgatives, and high living',
          'Sensation of constricted, spasmodic rectum; stool passes only with great effort'
        ],
        materiaMedicaNotes: 'Kent: The leading remedy for haemorrhoids in modern sedentary life. Frequent fruitless urge with irritable gastrointestinal tract.',
        modalities: {
          worse: 'Morning, mental exertion, spices, stimulants',
          better: 'Evening, rest, warmth'
        },
        aliases: ['nux vomica', 'nux vom']
      },
      {
        name: 'Nitricum Acidum',
        commonName: 'Nitric Acid',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Haemorrhoids with agonizing sharp splinter-like or cutting pains lasting hours after defecation',
          'Profuse bleeding with bright red blood; fissures and painful ulcerations at anal margin',
          'Violent burning and constrictive spasm of anal sphincter'
        ],
        materiaMedicaNotes: 'Boericke: Sharp sticking pains like splinters or needles in rectum. Pain continues for hours after stool.',
        modalities: {
          worse: 'After stool, evening and night, cold weather, touch',
          better: 'Warmth, gentle driving in carriage'
        },
        aliases: ['nitric acid', 'nitricum acidum', 'nit acid']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R13 (Haemorrhoidal Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Regulates portal-venous circulation, relieves bleeding piles, anal fissures, rectal eczema and aching prolapse.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r13', 'r-13', 'reckeweg piles', 'reckeweg r13']
      },
      {
        name: 'SBL FP-Tabs / FP-Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets + 25g Tube',
        indications: 'Dual oral and topical therapy for bleeding piles, painful blind haemorrhoids, fissure in ano and anal itching.',
        dosage: '2 tablets 3 times daily; apply FP-ointment locally morning and night.',
        mrp: 170,
        aliases: ['fp tabs', 'fp ointment', 'sbl fp', 'sbl piles']
      },
      {
        name: 'Bakson Pilgo Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves painful bleeding piles, rectal prolapse, burning and constipation associated with haemorrhoids.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['pilgo', 'bakson pilgo', 'pilgo drops']
      },
      {
        name: 'Wheezal WL-29 (Piles Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Alleviates vascular engorgement of anal veins, stops rectal bleeding and mitigates tenesmus.',
        dosage: '10-15 drops in 1/4 cup water 3 times daily.',
        mrp: 180,
        aliases: ['wl-29', 'wl 29', 'wheezal piles', 'wheezal wl-29']
      }
    ],
    dietAndRegimen: 'High fiber diet (papaya, green leafy vegetables, oats, isabgol husk). Drink 3-4 liters of water daily. Avoid red meat, fried snacks, chilli, alcohol, and prolonged sitting on toilet seats.',
    warningNotes: 'If large volumes of blood pass or severe dizziness/anemia occurs, perform proctoscopy to evaluate internal haemorrhoids.'
  },

  // 3. FISSURE & ANAL PAIN
  {
    id: 'anal-fissure',
    nameEn: 'Anal Fissure & Spasmodic Rectal Pain',
    nameBn: 'এনাল ফিসার ও মলদ্বারে তীব্র জ্বালা-যন্ত্রণা',
    chipLabel: 'Anal Fissure / এনাল ফিসার',
    pathology: 'Anal Fissure, Sphincter Spasm & Post-Defecation Tenesmus / মলদ্বারে ক্ষত ও কাটার মত ব্যথা',
    miasm: 'Syphilitic-Psoric Ulcerative Diathesis',
    typicalPresentation: 'Agonizing cutting, burning pain during and for hours after stool, feeling as if broken glass or splinters were in rectum',
    keywords: [
      'fissure', 'anal fissure', 'এনাল ফিসার', 'ফিসার', 'মলদ্বারে জ্বালা ও কাটার মত ব্যথা', 'মলদ্বারে কাটা ব্যথা',
      'মলদ্বারে জ্বালা', 'anal pain', 'burning in anus', 'rectal fissure', 'মলদ্বারে কাটার মত যন্ত্রণা',
      'মলত্যাগের পর জ্বালা', 'মলদ্বারে ক্ষত', 'anal sphincter spasm'
    ],
    classicalRemedies: [
      {
        name: 'Ratanhia Peruviana',
        commonName: 'Mapato / Rhatany',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Supreme remedy for acute and chronic anal fissure with burning like fire for hours after stool',
          'Sensation as if the rectum were full of broken glass or dry burning coals',
          'Violent constriction of the anus; temporary relief by bathing with cold water'
        ],
        materiaMedicaNotes: 'Boericke: Anus aches and burns for hours after stool. Feels as if full of broken glass. Great constriction.',
        modalities: {
          worse: 'Defecation, hard stool, sitting',
          better: 'Cold water washing, walking about'
        },
        aliases: ['ratanhia', 'ratanhia peruviana', 'rhatany']
      },
      {
        name: 'Nitricum Acidum',
        commonName: 'Nitric Acid',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Violent cutting, stitching, and splinter-like pains during and hours after passing stool',
          'Fissures that bleed easily with bright red blood; base of fissure is ulcerated and raw',
          'Patient irritable, chilly, and hypersensitive to touch and noise'
        ],
        materiaMedicaNotes: 'Kent: Splinter-like pains in rectum. The pain is severe, cutting, lasting for hours after defecation.',
        modalities: {
          worse: 'After stool, touch, night, change of weather',
          better: 'Riding in a carriage, gentle warmth'
        },
        aliases: ['nitric acid', 'nitricum acidum', 'nit acid']
      },
      {
        name: 'Paeonia Officinalis',
        commonName: 'Peony',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Fissure in ano with unbearable oozing, burning, and biting itching around the perineum',
          'Anus feels ulcerated, swollen, and extremely tender; cannot bear clothes or touch',
          'Pain continues for long periods after stool with offensive moisture'
        ],
        materiaMedicaNotes: 'Boericke: Chronic ulcers, fissures, and rhagades of anus with intolerable pain and oozing.',
        modalities: {
          worse: 'Touch, motion, after stool, evening',
          better: 'Gentle warmth, quiet rest'
        },
        aliases: ['paeonia', 'paeonia officinalis']
      },
      {
        name: 'Graphites',
        commonName: 'Black Lead',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Fissures associated with hard, knotty, large stools united by threads of white mucus',
          'Skin at muco-cutaneous junctions cracks easily, bleeding or oozing thick honey-like sticky fluid',
          'Constipation with sluggish peristalsis; stout, chilly, fair complexioned patients'
        ],
        materiaMedicaNotes: 'Kent: Fissures in anus that crack open, bleed and ooze glutinous sticky moisture. Hard knotty stools.',
        modalities: {
          worse: 'Warmth of bed, menstruation, night',
          better: 'Dark, wrapping up warmly'
        },
        aliases: ['graphites', 'graph']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R13 (Haemorrhoidal & Fissure Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Relieves agonizing anal pain, sphincter constriction, fissure ulceration and burning tenesmus.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r13', 'reckeweg fissure', 'reckeweg r13']
      },
      {
        name: 'SBL FP Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube with Applicator',
        indications: 'Topical soothing ointment for acute anal fissure, lacerations, violent burning and sphincter spasm.',
        dosage: 'Apply locally using applicator before and after bowel movement.',
        mrp: 90,
        aliases: ['fp ointment', 'sbl fp ointment', 'fissure ointment']
      },
      {
        name: 'Bakson Fissure Care Cream / Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops / 30g Cream',
        indications: 'Promotes rapid epithelial healing of mucosal tears, relieves anal spasms and painful defecation.',
        dosage: '10-15 drops in water 3 times daily + local cream application.',
        mrp: 185,
        aliases: ['fissure care', 'bakson fissure', 'bakson fissure care']
      },
      {
        name: 'Wheezal WL-29 (Anorectal Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Mitigates post-defecation burning, eases anal hypertonia and reduces laceration bleeding.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 180,
        aliases: ['wl-29', 'wheezal fissure']
      }
    ],
    dietAndRegimen: 'Sitz bath in lukewarm water for 15 minutes twice daily after defecation. Apply pure coconut oil or calendula ointment. Soften stools with prunes, ripe papaya, and fiber supplements.',
    warningNotes: 'Do not strain at stool. If agonizing sphincter spasm prevents defecation for multiple days, seek proctological assessment.'
  },

  // 4. ALOPECIA & HAIR FALL
  {
    id: 'alopecia-hair-fall',
    nameEn: 'Alopecia, Hair Fall & Scalp Dyscrasia',
    nameBn: 'চুল পড়া, টাক ও খুশকি (অ্যালোপিসিয়া)',
    chipLabel: 'Hair Fall / চুল পড়া',
    pathology: 'Alopecia Areata, Telogen Effluvium, Diffuse Hair Thinning & Scalp Seborrhea / চুল ঝরে পড়া',
    miasm: 'Psora-Syphilitic Follicular Dyscrasia',
    typicalPresentation: 'Excessive diffuse hair shedding during combing/washing, circular bald patches, premature greying, dry scaly dandruff',
    keywords: [
      'hair fall', 'hair loss', 'alopecia', 'চুল পড়া', 'চুল পরা', 'খুশকি', 'baldness', 'টাক', 'মাথার চুল পড়া',
      'dandruff', 'alopecia areata', 'hair thinning', 'hair shedding', 'টাক পড়া', 'খুস্কি', 'মাথায় টাক'
    ],
    classicalRemedies: [
      {
        name: 'Arnica Montana Q (External & Internal)',
        commonName: 'Leopard’s Bane',
        potency: 'Q (External application) & 30C (Oral)',
        dosage: 'External: 20 drops mixed with 2 tablespoons coconut oil applied to scalp; Oral: 4 pills twice daily',
        keynotes: [
          'Invigorates hair bulb microcirculation, halts post-debility or traumatic hair shedding, strengthens follicles',
          'Prevents premature hair thinning and restores dormant roots after febrile illnesses',
          'Sore bruised scalp sensation, hair roots feel sensitive to touch'
        ],
        materiaMedicaNotes: 'Boericke: Promotes healthy hair growth. External application of tincture invigorates hair follicles and removes scalp soreness.',
        modalities: {
          worse: 'Touch, brushing hair roughly, damp cold',
          better: 'Gentle warm oil massage'
        },
        aliases: ['arnica q', 'arnica hair', 'arnica montana q']
      },
      {
        name: 'Acidum Phosphoricum',
        commonName: 'Phosphoric Acid',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Hair falls out rapidly following grief, sorrow, emotional shock, depression, or severe exhausting acute illness',
          'Premature greying of hair in young individuals; hair turns grey and thins in clumps',
          'Profound mental and physical apathy; indifferent to everything'
        ],
        materiaMedicaNotes: 'Kent: Hair becomes grey early, falls out from debilitating illnesses, grief, sorrow, and loss of vital fluids.',
        modalities: {
          worse: 'Mental exertion, grief, loss of fluids',
          better: 'Warmth, rest, short sleep'
        },
        aliases: ['acid phos', 'acidum phosphoricum', 'phos acid']
      },
      {
        name: 'Lycopodium Clavatum',
        commonName: 'Club Moss',
        potency: '30C',
        dosage: '4 pills at 5 PM daily',
        keynotes: [
          'Premature baldness and greying, especially after severe abdominal or liver complaints or post-pregnancy',
          'Hair falls out from crown and temples with severe dry burning scalp and dandruff',
          'Craving for warm food and sweets; late afternoon aggravation'
        ],
        materiaMedicaNotes: 'Kent: Premature baldness and grey hair in people with digestive and hepatic derangements. Hair falls in great handfuls.',
        modalities: {
          worse: '4 PM to 8 PM, cold food, right side',
          better: 'Warm drinks, motion in open air'
        },
        aliases: ['lycopodium', 'lyc', 'lycopodium clavatum']
      },
      {
        name: 'Fluoricum Acidum',
        commonName: 'Hydrofluoric Acid',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Hair falls in circumscribed round bald patches (Alopecia Areata)',
          'Hair becomes dry, breaks off easily, tangles into unmanageable mats, and sheds rapidly',
          'Warm-blooded patient with warm palms and soles; relieved by cold applications'
        ],
        materiaMedicaNotes: 'Boericke: Alopecia, hair falls out in spots, new hair breaks off easily. Vertex feels hot.',
        modalities: {
          worse: 'Warmth, morning, standing',
          better: 'Cold bathing, walking rapidly'
        },
        aliases: ['fluoric acid', 'fluoricum acidum']
      },
      {
        name: 'Wiesbaden',
        commonName: 'Spring Water of Wiesbaden',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Remarkable power to stimulate new hair growth, darken hair pigmentation, and thicken follicular shafts',
          'Hair grows rapidly, becomes thick, soft, and dark; nails grow rapidly',
          'Revitalizes depleted follicles after chronic illnesses'
        ],
        materiaMedicaNotes: 'Boericke: Hastens the growth of hair, makes it dark and soft. Strengthens nails.',
        modalities: {
          worse: 'Cold weather',
          better: 'Warm gentle washing'
        },
        aliases: ['wiesbaden', 'wies']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R89 (Lipocol / Hair Care Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '30 ml Drops',
        indications: 'Premier German formulation for alopecia, diffuse hair loss, premature greying, and follicular revitalisation.',
        dosage: '20-30 drops in water 3 times daily before meals; also rub 20 drops onto bald areas.',
        mrp: 335,
        aliases: ['r89', 'r-89', 'reckeweg hair', 'reckeweg r89']
      },
      {
        name: 'SBL Scalptone Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Checks excessive hair fall, eliminates stubborn dandruff, prevents split ends and premature baldness.',
        dosage: '2 tablets 3 times daily dissolved in mouth.',
        mrp: 165,
        aliases: ['scalptone', 'sbl scalptone', 'hair tablets']
      },
      {
        name: 'Bakson Hair Revival Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Nutritional and restorative support for dry, brittle hair, alopecia areata, and telogen effluvium.',
        dosage: '10-15 drops in lukewarm water 3 times daily.',
        mrp: 180,
        aliases: ['hair revival', 'bakson hair', 'bakson hair revival']
      },
      {
        name: 'Wheezal Hair Plus Drops',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Stimulates follicular blood supply, counters excessive shedding and arrests circular bald spots.',
        dosage: '15 drops in water twice daily.',
        mrp: 175,
        aliases: ['hair plus', 'wheezal hair', 'wheezal hair plus']
      }
    ],
    dietAndRegimen: 'Ensure adequate iron, protein, and zinc intake (eggs, lentils, almonds, green vegetables). Wash hair with mild chemical-free homoeopathic Arnica shampoo. Avoid harsh chemical dyes and hot hair-dryers.',
    warningNotes: 'If sudden total hair loss or accompanying thyroid symptoms occur, check serum ferritin, TSH, and vitamin D levels.'
  },

  // 5. TONSILLITIS & SORE THROAT
  {
    id: 'tonsillitis-sore-throat',
    nameEn: 'Tonsillitis & Acute Sore Throat',
    nameBn: 'টনসিলাইটিস ও গলা ব্যথা (টনসিল প্রদাহ)',
    chipLabel: 'Tonsillitis / টনসিল',
    pathology: 'Acute & Chronic Follicular Tonsillitis & Pharyngeal Erythema / টনসিলের প্রদাহ',
    miasm: 'Tubercular-Sycotic Diathesis with Glandular Hypertrophy',
    typicalPresentation: 'Swollen fiery red tonsils, agonizing pain on swallowing liquids/solids, shooting ear pain, high fever, foul breath',
    keywords: [
      'tonsil', 'tonsillitis', 'টনসিল', 'টনসিলাইটিস', 'গলা ব্যথা', 'sore throat', 'throat pain',
      'pharyngitis', 'difficulty swallowing', 'গলা ফোলা', 'টনসিল বৃদ্ধি', 'গলা ফুলা', 'quinsy'
    ],
    classicalRemedies: [
      {
        name: 'Belladonna',
        commonName: 'Deadly Nightshade',
        potency: '30C',
        dosage: '4 pills every 3 hours in acute fever',
        keynotes: [
          'Acute onset of fiery red, swollen, throbbing tonsils with high fever and flushed face',
          'Sensation of choking constriction; throat feels as if scraped and dry, worse swallowing liquids',
          'Right tonsil predominantly affected; rapid pulse and dilated pupils'
        ],
        materiaMedicaNotes: 'Boericke: Tonsils inflamed, enlarged, fiery red; painful swallowing, worse liquids. Violent throbbing.',
        modalities: {
          worse: 'Swallowing, turning head, touch, lying down',
          better: 'Rest in quiet, semi-erect posture'
        },
        aliases: ['belladonna', 'bell']
      },
      {
        name: 'Baryta Carbonica',
        commonName: 'Barium Carbonate',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Chronic hypertrophy of tonsils in scrofulous children; prone to suppurate on every exposure to cold air',
          'Child takes cold easily; chronic tonsillar enlargement that impedes breathing and speech',
          'Mentally timid, slow to comprehend, enlarged cervical lymph nodes'
        ],
        materiaMedicaNotes: 'Kent: Leading remedy for chronically enlarged, indurated tonsils in delicate, chilly children.',
        modalities: {
          worse: 'Exposure to cold air, thinking of symptoms',
          better: 'Warm room, walking in warm air'
        },
        aliases: ['baryta carb', 'baryta carbonica']
      },
      {
        name: 'Phytolacca Decandra',
        commonName: 'Poke Root',
        potency: '30C',
        dosage: '4 pills 3 times daily in warm water',
        keynotes: [
          'Dark purple-red swollen tonsils and fauces; sharp pain shoots like lightning into ears on swallowing',
          'Sensation of a hot ball or red-hot iron in throat; painful deglutition worse warm drinks',
          'Tongue is red-tipped with protruding papillae; great aching in neck and back'
        ],
        materiaMedicaNotes: 'Kent: Dark red or bluish tonsils. Intense pain shooting up to ears upon swallowing.',
        modalities: {
          worse: 'Swallowing warm drinks, cold damp weather, night',
          better: 'Cool liquids, dry weather'
        },
        aliases: ['phytolacca', 'phytolacca decandra']
      },
      {
        name: 'Mercurius Solubilis',
        commonName: 'Quick Silver',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Tonsils swollen, dark red with whitish follicular patches or ulcerations',
          'Profuse, fetid salivation; flabby swollen tongue showing deep imprints of teeth',
          'Severe aggravation at night and from both heat and cold; profuse nighttime perspiration'
        ],
        materiaMedicaNotes: 'Boericke: Tonsils dark red, ulcerated, with white spots. Profuse offensive saliva and night aggravation.',
        modalities: {
          worse: 'Night, warmth of bed, drafts, damp weather',
          better: 'Moderate uniform temperature'
        },
        aliases: ['merc sol', 'mercurius solubilis', 'mercurius']
      },
      {
        name: 'Hepar Sulphuris Calcareum',
        commonName: 'Hahnemann’s Calcium Sulphide',
        potency: '30C',
        dosage: '4 pills 3 times daily in warm water',
        keynotes: [
          'Threatened tonsillar abscess (quinsy) with sharp splinter-like pain shooting into ears on swallowing',
          'Extremely chilly patient; cannot bear the least draft of cold air or uncovering of neck',
          'Throat feels as if a fish bone or sharp pin were lodged in tonsil'
        ],
        materiaMedicaNotes: 'Kent: Sticking splinter pain in tonsils shooting to ear on swallowing. Intensely sensitive to cold air.',
        modalities: {
          worse: 'Cold dry air, uncovering, touching parts',
          better: 'Wrapping up head and throat warmly, hot drinks'
        },
        aliases: ['hepar sulph', 'hepar sulphuris']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R1 (Biological Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Universal acute biological complex for follicular tonsillitis, quinsy, pharyngeal congestion and fever.',
        dosage: '10-15 drops in warm water every 2 hours in acute states, then 3 times daily.',
        mrp: 310,
        aliases: ['r1', 'r-1', 'reckeweg tonsil', 'dr reckeweg r1']
      },
      {
        name: 'SBL Tonsilat Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Relieves inflamed tonsils, sore throat, painful deglutition, throat hoarseness and cervical adenitis.',
        dosage: '2 tablets dissolved in mouth every 2 hours until relief.',
        mrp: 155,
        aliases: ['tonsilat', 'sbl tonsilat', 'tonsil aid']
      },
      {
        name: 'Bakson Throat Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Soothes pharyngeal mucosa, relieves sharp stabbing pain in tonsils and facilitates comfortable swallowing.',
        dosage: '1 tablet dissolved in mouth every 2 hours.',
        mrp: 165,
        aliases: ['throat aid', 'bakson throat aid', 'throat tablets']
      },
      {
        name: 'Adel Pekana Adel 24 (Septonsil Drops)',
        brand: 'Adel',
        company: 'Adel Pekana (Germany)',
        country: 'Germany',
        bottleSize: '20 ml Drops',
        indications: 'Renowned German drops for acute and chronic tonsillitis, lymphadenitis, sore throat and quinsy.',
        dosage: '15-20 drops in water 3 times daily.',
        mrp: 320,
        aliases: ['adel 24', 'septonsil', 'adel septonsil']
      }
    ],
    dietAndRegimen: 'Gargle with warm salt water or diluted calendula water 3 times daily. Sip warm ginger-honey water. Avoid chilled beverages, ice cream, curd, and sour foods.',
    warningNotes: 'If breathing difficulty, severe trismus (inability to open mouth), or high toxic fever develops, urgently evaluate for peritonsillar abscess.'
  },

  // 6. ASTHMA & BREATHLESSNESS
  {
    id: 'asthma-breathlessness',
    nameEn: 'Bronchial Asthma & Dyspnea',
    nameBn: 'হাঁপানি, শ্বাসকষ্ট ও দম বন্ধ ভাব (অ্যাজমা)',
    chipLabel: 'Asthma / হাঁপানি',
    pathology: 'Bronchial Asthma, Bronchospasm & Expiratory Dyspnea / ব্রঙ্কিয়াল অ্যাজমা',
    miasm: 'Tubercular-Sycotic Diathesis with Bronchial Spasm',
    typicalPresentation: 'Suffocative suffocating attacks of wheezing dyspnea, aggravated after midnight, must sit bent forward to breathe',
    keywords: [
      'asthma', 'breathless', 'breathlessness', 'হাঁপানি', 'হাপানি', 'দম বন্ধ', 'শ্বাসকষ্ট', 'dyspnea',
      'wheezing', 'bronchospasm', 'বুক ধড়ফড় শ্বাসকষ্ট', 'দম আটকে আসা', 'বুকে ঘড়ঘড়', 'অ্যাজমা'
    ],
    classicalRemedies: [
      {
        name: 'Arsenicum Album',
        commonName: 'White Oxide of Arsenic',
        potency: '30C',
        dosage: '4 pills every 2-3 hours during acute paroxysm',
        keynotes: [
          'Agonizing suffocative paroxysms worse midnight to 2 AM; patient cannot lie flat, must sit bent forward',
          'Intense anxiety, fear of death, and extreme physical restlessness; exhausted from slightest movement',
          'Burning pains in chest relieved by warm drinks and heat; burning thirst for small frequent sips'
        ],
        materiaMedicaNotes: 'Kent: Suffocative attacks worse midnight to 2 AM. Cannot lie down for fear of suffocation. Extreme restlessness and thirst for sips.',
        modalities: {
          worse: 'Midnight to 2 AM, cold air, lying flat',
          better: 'Sitting bent forward, warm drinks, warmth'
        },
        aliases: ['ars alb', 'arsenicum', 'arsenicum album']
      },
      {
        name: 'Blatta Orientalis',
        commonName: 'Indian Cockroach',
        potency: 'Q / 30C',
        dosage: '10-15 drops in warm water (Q) or 4 pills (30C) 3 times daily',
        keynotes: [
          'Supreme specific homoeopathic remedy for acute and chronic bronchial asthma with thick purulent mucus',
          'Especially suited to stout, corpulent patients; asthma aggravated in rainy weather and damp basements',
          'Severe cough with dyspnea and wheezing rattling in bronchi'
        ],
        materiaMedicaNotes: 'Boericke: A remedy for asthma. Especially when associated with bronchitis. Indicated in corpulent people and damp climates.',
        modalities: {
          worse: 'Rainy damp weather, exertion',
          better: 'Warm room, expectoration'
        },
        aliases: ['blatta', 'blatta orientalis']
      },
      {
        name: 'Ipecacuanha',
        commonName: 'Ipecac Root',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Spasmodic suffocative asthma with constant nausea and retching; clean coated tongue',
          'Chest seems full of phlegm but nothing is coughed up; constriction in chest with blue face',
          'Dry suffocative spasmodic cough with each breath'
        ],
        materiaMedicaNotes: 'Boericke: Constant nausea with clean tongue. Incessant violent suffocative cough. Chest feels full of phlegm without expectoration.',
        modalities: {
          worse: 'Warm moist air, periodic attacks, lying down',
          better: 'Open air'
        },
        aliases: ['ipecac', 'ipecacuanha']
      },
      {
        name: 'Antimonium Tartaricum',
        commonName: 'Tartar Emetic',
        potency: '30C',
        dosage: '4 pills 3 times daily in warm water',
        keynotes: [
          'Loud coarse rattling of mucus in bronchial tubes, but too weak to expectorate',
          'Patient is drowsy, cyanotic, exhausted, and bathed in cold clammy sweat; must sit up to breathe',
          'Relieved by coughing up a small amount of phlegm or sitting upright'
        ],
        materiaMedicaNotes: 'Kent: Great rattling of mucus in chest with inability to expectorate. Impending paralysis of lungs in weak individuals.',
        modalities: {
          worse: 'Warm room, lying down flat, damp weather',
          better: 'Sitting erect, expectoration, open air'
        },
        aliases: ['antim tart', 'antimonium tartaricum']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R43 (Asthma Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Alleviates bronchial asthma, asthmatic bronchitis, spastic dyspnea and wheezing respiration.',
        dosage: '10-15 drops in warm water 3 times daily; in acute paroxysm, every 15-30 minutes.',
        mrp: 310,
        aliases: ['r43', 'r-43', 'reckeweg asthma', 'reckeweg r43']
      },
      {
        name: 'SBL Astha Aid Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Bronchodilator and mucolytic syrup for asthma, breathlessness, spastic bronchial cough and wheezing.',
        dosage: '1-2 teaspoonfuls with warm water 3 times daily.',
        mrp: 145,
        aliases: ['astha aid', 'sbl astha aid', 'sbl asthma']
      },
      {
        name: 'Bakson Astha Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Relieves constriction of airways, liquefies tenacious phlegm and eases respiratory distress.',
        dosage: '1 teaspoonful twice daily in lukewarm water.',
        mrp: 155,
        aliases: ['bakson astha aid', 'bakson asthma']
      },
      {
        name: 'Wheezal WL-5 (Asthma Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Antispasmodic drops for bronchial spasm, expiratory wheeze and nocturnal breathlessness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 180,
        aliases: ['wl-5', 'wl 5', 'wheezal asthma', 'wheezal wl-5']
      }
    ],
    dietAndRegimen: 'Avoid cold refrigerated foods, ice cream, dust, smoke, pet dander, and sudden exposure to cold air. Inhale mild steam. Maintain clean dust-free bedding.',
    warningNotes: 'If acute severe respiratory distress, cyanosis of lips/nails, or oxygen saturation falls below 92%, seek urgent emergency hospital care.'
  },

  // 7. RINGWORM & FUNGAL INFECTIONS
  {
    id: 'ringworm-fungal-infection',
    nameEn: 'Ringworm & Fungal Dermatomycosis',
    nameBn: 'দাদ ও ছত্রাকজনিত চর্মরোগ (টিনিয়া)',
    chipLabel: 'Ringworm / দাদ',
    pathology: 'Tinea Corporis, Tinea Cruris, Dermatophytosis & Ringworm / দাদ ও ছত্রাক',
    miasm: 'Psoric-Sycotic Diathesis with Fungal Dermatosis',
    typicalPresentation: 'Circular, ring-shaped vesicular or scaly lesions with raised erythematous borders and intense nocturnal itching',
    keywords: [
      'ringworm', 'fungal', 'fungus', 'tinea', 'দাদ', 'খোস পাঁচড়া', 'খোস পাঁচড়া', 'চুলকানি দাদ',
      'ring worm', 'itchy round rash', 'দাদ রোগ', 'ছত্রাক সংক্রমণ', 'tinea cruris', 'tinea corporis'
    ],
    classicalRemedies: [
      {
        name: 'Sepia',
        commonName: 'Inky Juice of Cuttlefish',
        potency: '200C',
        dosage: '4 pills once weekly in morning',
        keynotes: [
          'Premier constitutional simillimum for circular ringworm eruptions in isolated rings on upper body, neck, and bends of elbows',
          'Brownish pigmented patches with intense itching that is not relieved by scratching',
          'Indifferent temperament, pelvic bearing-down sensation, chilly disposition'
        ],
        materiaMedicaNotes: 'Boericke: Ringworm-like eruptions in isolated spots on upper part of body. Brownish discoloration.',
        modalities: {
          worse: 'Forenoon and evening, cold air, washing',
          better: 'Vigorous exercise, warmth of bed'
        },
        aliases: ['sepia', 'sep']
      },
      {
        name: 'Tellurium',
        commonName: 'Metallic Tellurium',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Ringworm covering extensive body parts in intersecting geometric rings (herpes circinatus)',
          'Distinctive offensive garlic-like odor from body and perspiration',
          'Intense itching and stinging, severely aggravated at night in bed'
        ],
        materiaMedicaNotes: 'Kent: Ringworm in intersecting rings over the body. Eruptions itch violently, with garlic-like body odor.',
        modalities: {
          worse: 'At night, warmth of bed, cold air, touch',
          better: 'Cool open air'
        },
        aliases: ['tellurium', 'tellur']
      },
      {
        name: 'Chrysarobinum',
        commonName: 'Goa Powder',
        potency: '3X / 30C',
        dosage: '2 tablets (3X) or 4 pills (30C) twice daily',
        keynotes: [
          'Specific biological remedy for violent ringworm, herpes circinatus, and crusty fungal scaling with oozing foul fluid',
          'Eruptions around groin, thighs, and genitals with violent pruritus',
          'Clears stubborn recalcitrant fungal plaques'
        ],
        materiaMedicaNotes: 'Boericke: Successfully used in ringworm, psoriasis, and herpes circinatus. Powerful cellular stimulant.',
        modalities: {
          worse: 'Heat, friction of clothing',
          better: 'Cool dry air'
        },
        aliases: ['chrysarobinum', 'chrysarobin', 'goa powder']
      },
      {
        name: 'Sulphur',
        commonName: 'Sublimed Sulphur',
        potency: '200C',
        dosage: '4 pills once every 10 days in morning',
        keynotes: [
          'King of anti-psoric polychrests for burning pruritus aggravated by washing and heat of bed',
          'Scratching provides voluptuous pleasure followed by intense burning and soreness',
          'Skin dry, scaly, unhealthy; aversion to bathing'
        ],
        materiaMedicaNotes: 'Kent: The King of Anti-Psorics. Unhealthy skin; voluptuous itching, scratching burns. Worse washing and heat of bed.',
        modalities: {
          worse: 'Warmth of bed, washing, standing, 11 AM',
          better: 'Dry warm weather'
        },
        aliases: ['sulphur', 'sulph']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R23 (Eczema & Dermatosis Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Purifies blood and clears stubborn dermatomycosis, ringworm, scaly eruptions and pruritus.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r23', 'r-23', 'reckeweg ringworm', 'reckeweg r23']
      },
      {
        name: 'SBL Thuja Ointment / B-Trim',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube',
        indications: 'Antifungal and antibacterial soothing topical ointment for ringworm, fungal plaques and itchy rash.',
        dosage: 'Apply gently over affected fungal patches 2-3 times daily.',
        mrp: 85,
        aliases: ['thuja ointment', 'sbl thuja', 'sbl ringworm']
      },
      {
        name: 'Bakson Bakso-Derm Drops / Cream',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops / 30g Cream',
        indications: 'Relieves fungal dermatosis, ringworm of groin (jock itch) and body, scaling and nocturnal itching.',
        dosage: '10-15 drops in water 3 times daily + apply cream locally.',
        mrp: 185,
        aliases: ['baksoderm', 'bakson derm', 'bakso-derm']
      },
      {
        name: 'Wheezal WL-38 (Skin & Fungal Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Arrests fungal sporulation, clears circular erythematous rings and prevents reinfection.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 180,
        aliases: ['wl-38', 'wheezal fungal', 'wheezal wl-38']
      }
    ],
    dietAndRegimen: 'Keep affected skin areas dry and clean. Wear loose cotton clothing. Never share towels, combs, or bedsheets. Avoid excessive sugar, fermented foods, and damp environments.',
    warningNotes: 'Do not suppress with corticosteroid creams, which drive the fungal dyscrasia deeper into the vital tissues.'
  },

  // 8. CORNS & WARTS
  {
    id: 'corns-warts-hyperkeratosis',
    nameEn: 'Corns, Calluses & Warts / Verrucae',
    nameBn: 'কড়া ও আঁচিল (পায়ের কড়া ও ত্বকের আঁচিল)',
    chipLabel: 'Corns & Warts / কড়া ও আঁচিল',
    pathology: 'Hyperkeratosis, Verruca Vulgaris, Clavus & Cutaneous Excrescences / চামড়া শক্ত ও আঁচিল',
    miasm: 'Sycotic Diathesis with Epithelial Proliferation',
    typicalPresentation: 'Horny, thick, painful corns on soles/toes; hard or pedunculated warts on hands, fingers, and face',
    keywords: [
      'corn', 'corns', 'wart', 'warts', 'কড়া', 'কড়া', 'আঁচিল', 'আচিল', 'verruca', 'callus',
      'calluses', 'পায়ের কড়া', 'পায়ের কড়া', 'পায়ের আঁচিল', 'মুখের আঁচিল', 'আঁচিলের ওষুধ'
    ],
    classicalRemedies: [
      {
        name: 'Antimonium Crudum',
        commonName: 'Black Sulphide of Antimony',
        potency: '200C',
        dosage: '4 pills once daily at night',
        keynotes: [
          'Large, thick, hard, horny corns and calluses on soles of feet and palms; extremely tender to walk upon',
          'Walking causes agonizing bruised burning pain as if stepping on sharp nails',
          'Thick milky-white coated tongue; irritable temperament, sentimental in moonlight'
        ],
        materiaMedicaNotes: 'Boericke: Horny excrescences. Large, horny callosities on soles of feet and hands. Sensitive soles when walking.',
        modalities: {
          worse: 'Heat of sun, cold baths, walking',
          better: 'Open air, rest'
        },
        aliases: ['antim crud', 'antimonium crudum']
      },
      {
        name: 'Thuja Occidentalis',
        commonName: 'Arbor Vitae',
        potency: '200C',
        dosage: '4 pills twice weekly in morning',
        keynotes: [
          'Premier anti-sycotic remedy for soft, pedunculated, fig-warts, cauliflower excrescences, and bleeding warts',
          'Warts on hands, fingers, eyelids, face, and genitalia that sting and bleed easily',
          'Chronic sycotic dyscrasia with oily skin and brittle, ridged nails'
        ],
        materiaMedicaNotes: 'Kent: Master sycotic remedy. Specific for warts, condylomata, polypi, and abnormal fleshy excrescences.',
        modalities: {
          worse: 'Damp cold weather, 3 AM and 3 PM, vaccination',
          better: 'Warm dry weather, drawing up limbs'
        },
        aliases: ['thuja', 'thuja occidentalis']
      },
      {
        name: 'Causticum',
        commonName: 'Hahnemann’s Tinctura Acris Sine Kali',
        potency: '200C',
        dosage: '4 pills twice weekly',
        keynotes: [
          'Hard, horny, pedunculated warts especially located on fingertips, near nails, eyelids, or tip of nose',
          'Warts bleed easily and are accompanied by paralytic weakness or urinary incontinence',
          'Chilly patient aggravated by dry clear weather, distinctly relieved in damp humid air'
        ],
        materiaMedicaNotes: 'Boericke: Warts, large, jagged, bleeding easily, on fingertips and nose. Better in damp wet weather.',
        modalities: {
          worse: 'Dry cold winds, fine clear weather',
          better: 'Damp wet weather, warm bed'
        },
        aliases: ['causticum', 'caust']
      },
      {
        name: 'Nitricum Acidum',
        commonName: 'Nitric Acid',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Warts and corns that have sharp splinter-like, sticking pains when touched or during walking',
          'Jagged warts with moist, oozing bleeding surfaces; fissures around nails',
          'Chilly, resentful temperament; offensive foot sweat'
        ],
        materiaMedicaNotes: 'Kent: Warts with splinter-like pains. Ragged, pedunculated, weeping and bleeding easily.',
        modalities: {
          worse: 'Touch, walking, cold changes of weather',
          better: 'Warmth, gentle driving'
        },
        aliases: ['nitric acid', 'nitricum acidum']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Thuja Ointment / Corn Paint',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '15 ml Paint / 25g Tube',
        indications: 'Targeted topical application for softening corns, resolving warts and exfoliating hyperkeratotic tissue.',
        dosage: 'Apply locally over the wart or corn with applicator twice daily after washing.',
        mrp: 95,
        aliases: ['corn paint', 'sbl corn paint', 'sbl wart paint', 'thuja paint']
      },
      {
        name: 'Dr. Reckeweg R17 (Tumor & Excrescence Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Biological remedy for abnormal tissue proliferations, stubborn warts, corns, and indurated dermal growths.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r17', 'r-17', 'reckeweg warts', 'reckeweg r17']
      },
      {
        name: 'Bakson Wart Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Oral systemic treatment for flat, pedunculated or hard warts, corns, and hyperkeratosis.',
        dosage: '1 tablet 3 times daily dissolved in mouth.',
        mrp: 170,
        aliases: ['wart aid', 'bakson wart aid', 'bakson wart']
      },
      {
        name: 'Wheezal Wart Cure Drops / Paint',
        brand: 'Wheezal',
        company: 'Wheezal Homoeopathic Pharmacy',
        country: 'India',
        bottleSize: '30 ml Drops + 15 ml Paint',
        indications: 'Dual oral and topical therapy to eradicate cutaneous warts and stubborn painful corns.',
        dosage: '10 drops in water 3 times daily + paint locally.',
        mrp: 195,
        aliases: ['wart cure', 'wheezal wart', 'wheezal wart cure']
      }
    ],
    dietAndRegimen: 'Wear properly fitted, cushioned shoes. Never cut, blade, or burn corns with acids at home. Soak feet in warm water with Epsom salt before applying homoeopathic paint.',
    warningNotes: 'Diabetic patients should never attempt mechanical removal of corns due to high risk of diabetic foot ulcers.'
  }
];
