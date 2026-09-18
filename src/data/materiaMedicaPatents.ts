import { MateriaMedicaRemedy } from './materiaMedicaDatabase';

export const PATENT_MATERIA_MEDICA: Record<string, MateriaMedicaRemedy> = {
  // 1. DR. RECKEWEG R1 (INFLAMMATION DROPS)
  'reckeweg-r1': {
    id: 'reckeweg-r1',
    latinName: 'Dr. Reckeweg R1 (Anginacid)',
    nameBn: 'ডাঃ রেকেওয়েগ আর-১ (ইনফ্ল্যামেশন ড্রপস)',
    commonName: 'Anti-Inflammatory & Tonsillitis Drops',
    familySource: 'Dr. Reckeweg Germany - Proprietary Formulation',
    category: 'patent',
    sphereOfActionEn: 'Mucous membranes of respiratory tract, tonsils, lymph glands, pharynx & serous tissues.',
    sphereOfActionBn: 'গলা, টনসিল, লসিকা গ্রন্থি, স্বরযন্ত্র ও যে কোনো তীব্র প্রদাহ।',
    primaryIndications: [
      { en: 'Acute inflammation of the throat, tonsillitis, pharyngitis, laryngitis with high fever', bn: 'গলাব্যথা, টনসিলের তীব্র প্রদাহ, খাবার গিলতে কষ্ট ও জ্বরের সাথে গলার লালচে ভাব' },
      { en: 'Early stage of appendicitis, arthritis, mumps, glandular swelling and localized heat', bn: 'অ্যাপেন্ডিক্স বা লসিকাগ্রন্থি ফোলা এবং শরীরের যে কোনো অংশে লাল হয়ে জ্বালা করা প্রদাহ' }
    ],
    guidingKeynotes: [
      { en: 'Synergistic German blend of Apis, Belladonna, Calcium iodatum, Hepar sulph, Kalium bichromicum, Lachesis, Marum verum, Mercurius sublimatus corrosivus, and Phytolacca.', bn: 'জার্মান রেকেওয়েগ ফর্মুলেশন যা সব ধরনের তীব্র জীবাণুঘটিত প্রদাহ দ্রুত নিরাময় করে।' }
    ],
    modalities: {
      worseEn: 'Swallowing, cold air, touch of throat',
      worseBn: 'ঢোক গিললে ও ঠান্ডা বাতাসে বাড়ে',
      betterEn: 'Warm drinks, rest',
      betterBn: 'গরম পানীয় ও বিশ্রামে উপশম'
    },
    recommendedPotency: 'German Oral Drops',
    dosageGuidelines: 'Acute cases: 10-15 drops in water every 1-2 hours. Maintenance: 10-15 drops 3 times daily before meals.',
    clinicalPearls: 'The definitive gold-standard German drop for acute follicular tonsillitis.',
    aliases: ['r1', 'r-1', 'reckeweg r1', 'anginacid', 'আর ১', 'আর-১']
  },

  // 2. DR. RECKEWEG R7 (LIVER & GALLBLADDER DROPS)
  'reckeweg-r7': {
    id: 'reckeweg-r7',
    latinName: 'Dr. Reckeweg R7 (Hepagalen)',
    nameBn: 'ডাঃ রেকেওয়েগ আর-৭ (লিভার ও পিত্ত ড্রপস)',
    commonName: 'Liver & Gallbladder Drops',
    familySource: 'Dr. Reckeweg Germany - Proprietary Formulation',
    category: 'patent',
    sphereOfActionEn: 'Hepatocytes, bile ducts, gallbladder, portal venous circulation & pancreatic drainage.',
    sphereOfActionBn: 'লিভার, পিত্তথলি, পিত্তনালী, জন্ডিস ও হজম প্রক্রিয়া।',
    primaryIndications: [
      { en: 'Hepatitis, fatty liver, sluggish liver, portal congestion, and gallbladder dyskinesia', bn: 'ফ্যাটি লিভার, জন্ডিস, পিত্তনালীর দুর্বলতা ও লিভারের অকার্যকারিতা' },
      { en: 'Pain in right hypochondrium extending to right shoulder blade, bitter taste in mouth', bn: 'পেটের ডান পাশে পাঁজরের নিচে চিনচিন ব্যথা যা ডান কাঁধ পর্যন্ত ছড়ায়' },
      { en: 'Dyspepsia, flatulence, yellow coated tongue, constipation alternating with diarrhea', bn: 'পেট ফাঁপা, মুখে তিতা ভাব, জিহ্বায় হলদে প্রলেপ ও ফ্যাটি খাবারের পর বদহজম' }
    ],
    guidingKeynotes: [
      { en: 'Contains Carduus marianus, Chelidonium, Cholesterinum, Colocynthis, Lycopodium, and Nux vomica.', bn: 'লিভারের কার্যক্ষমতা ফিরিয়ে আনতে ও পিত্তের প্রবাহ স্বাভাবিক রাখতে জার্মানির এক নম্বর ড্রপ।' }
    ],
    modalities: {
      worseEn: 'Fatty rich meals, sitting still, pressure on liver',
      worseBn: 'তেল-চর্বি খেলে বাড়ে',
      betterEn: 'Lying on right side, warm liquids',
      betterBn: 'কুসুম গরম পানিতে উপশম'
    },
    recommendedPotency: 'German Oral Drops',
    dosageGuidelines: '10-15 drops in quarter glass of water 3 times daily before meals.',
    clinicalPearls: 'Indispensable in fatty liver disease alongside Carduus Marianus Q.',
    aliases: ['r7', 'r-7', 'reckeweg r7', 'hepagalen', 'আর ৭', 'আর-৭']
  },

  // 3. DR. RECKEWEG R11 (LUMBAGO & RHEUMATISM DROPS)
  'reckeweg-r11': {
    id: 'reckeweg-r11',
    latinName: 'Dr. Reckeweg R11',
    nameBn: 'ডাঃ রেকেওয়েগ আর-১১ (কোমর ও বাতের ব্যথা)',
    commonName: 'Lumbago & Rheumatic Drops',
    familySource: 'Dr. Reckeweg Germany - Proprietary Formulation',
    category: 'patent',
    sphereOfActionEn: 'Lumbar spine, sciatic nerve, back muscles, ligaments & intervertebral discs.',
    sphereOfActionBn: 'কোমর, মেরুদণ্ড, সায়াটিকা স্নায়ু, জয়েন্ট ও পেশীর বাতব্যথা।',
    primaryIndications: [
      { en: 'Acute lumbago, lower backache, stiffness in sacroiliac joint, sciatic nerve pain', bn: 'হঠাৎ কোমর আটকে যাওয়া (লুম্বাগো), পিঠের মাংসপেশীর টান ও সায়াটিকার ব্যথা' },
      { en: 'Pain worse on rising from a chair or beginning to move, better after continued motion', bn: 'চেয়ার থেকে উঠতে গেলে তীব্র ব্যথা, তবে কিছুক্ষণ হাঁটলে আরাম বোধ' }
    ],
    guidingKeynotes: [
      { en: 'Contains Berberis, Calcium phosphoricum, Causticum, Dulcamara, Nux vomica, Rhododendron, and Rhus tox.', bn: 'কোমর ব্যথার জন্য একটি নির্ভরযোগ্য ও বহুল ব্যবহৃত জার্মান ফর্মুলেশন।' }
    ],
    modalities: {
      worseEn: 'Cold drafts, lifting weights, morning',
      worseBn: 'ভারী জিনিস তুললে ও শীতে বাড়ে',
      betterEn: 'Warmth, gentle motion, hot bath',
      betterBn: 'গরম সেঁক ও হালকা নড়াচড়ায় কমে'
    },
    recommendedPotency: 'German Oral Drops',
    dosageGuidelines: '10-15 drops in water 3-4 times daily.',
    clinicalPearls: 'Combine with Arnica 200C or Bryonia for rapid structural spine relief.',
    aliases: ['r11', 'r-11', 'reckeweg r11', 'আর ১১', 'আর-১১']
  },

  // 4. DR. RECKEWEG R27 (RENAL CALCULI DROPS)
  'reckeweg-r27': {
    id: 'reckeweg-r27',
    latinName: 'Dr. Reckeweg R27 (Renocalcin)',
    nameBn: 'ডাঃ রেকেওয়েগ আর-২৭ (কিডনি পাথর ড্রপস)',
    commonName: 'Renal Calculi & Kidney Stones Drops',
    familySource: 'Dr. Reckeweg Germany - Proprietary Formulation',
    category: 'patent',
    sphereOfActionEn: 'Kidneys, renal calyces, ureters, bladder & urinary tract epithelium.',
    sphereOfActionBn: 'কিডনি, ইউরেটার, প্রস্রাবের থলি এবং মূত্রনালীর পাথর ও ইউরিক এসিড।',
    primaryIndications: [
      { en: 'Kidney stones, renal colic, gravel in urine, sharp cutting pains radiating to groin', bn: 'কিডনিতে পাথর, তলপেটে ও কোমরে মারাত্মক মোচড়ানো ব্যথা যা কুঁচকিতে নেমে আসে' },
      { en: 'Dysuria, burning micturition, bloody streaks in urine due to sharp oxalate calculi', bn: 'প্রস্রাবে তীব্র জ্বালাপোড়া, ফোঁটা ফোঁটা প্রস্রাব ও পাথরের ঘর্ষণে সামান্য রক্তক্ষরণ' }
    ],
    guidingKeynotes: [
      { en: 'Contains Acidum nitricum, Berberis vulgaris, Lycopodium, Rubia tinctorum, and Sarsaparilla.', bn: 'কিডনির পাথর ভেঙে গুঁড়ো করে প্রস্রাবের সাথে বের করে দেওয়ার জার্মান ওষুধ।' }
    ],
    modalities: {
      worseEn: 'Jarring, motion, riding in cars',
      worseBn: 'গাড়িতে ঝাঁকুনি লাগলে বাড়ে',
      betterEn: 'Abundant warm water, rest',
      betterBn: 'প্রচুর পানি পানে ও বিশ্রামে কমে'
    },
    recommendedPotency: 'German Oral Drops',
    dosageGuidelines: 'Acute colic: 10 drops in warm water every 30 minutes. Chronic: 15 drops 3 times daily before meals.',
    clinicalPearls: 'Advise patient to consume 3-4 liters of water daily while taking R27.',
    aliases: ['r27', 'r-27', 'reckeweg r27', 'renocalcin', 'আর ২৭', 'আর-২৭']
  },

  // 5. DR. RECKEWEG R41 (FORTIVIRONE / SEXUAL DEBILITY)
  'reckeweg-r41': {
    id: 'reckeweg-r41',
    latinName: 'Dr. Reckeweg R41 (Fortivirone / Curaver)',
    nameBn: 'ডাঃ রেকেওয়েগ আর-৪১ (যৌন শক্তি ড্রপস)',
    commonName: 'Sexual Asthenia & Vitality Drops',
    familySource: 'Dr. Reckeweg Germany - Proprietary Formulation',
    category: 'patent',
    sphereOfActionEn: 'Male endocrine glands, nervous system, testicular tissue & mental vigor.',
    sphereOfActionBn: 'পুরুষের জীবনীশক্তি, প্রজনন গ্রন্থি, শারীরিক অবসাদ ও স্নায়বিক দুর্বলতা।',
    primaryIndications: [
      { en: 'Male sexual debility, erectile weakness, premature ejaculation, lack of vitality', bn: 'পুরুষের যৌন দুর্বলতা, দ্রুত বীর্যপাত, শারীরিক উদ্যমহীনতা ও অবসাদ' },
      { en: 'General physical and mental fatigue in middle-aged and elderly men', bn: 'বয়স বৃদ্ধির কারণে শারীরিক দুর্বলতা, ক্লান্তি ও অনিদ্রা' }
    ],
    guidingKeynotes: [
      { en: 'Contains Acidum phosphoricum, Agnus castus, China, Conium, Damiana, Phosphorus, Sepia, and Testis.', bn: 'আন্তর্জাতিকভাবে সর্বাধিক বিক্রিত ও নির্ভরযোগ্য জার্মান পুরুষ জীবনীশক্তি টনিক।' }
    ],
    modalities: {
      worseEn: 'Overexertion, mental stress, lack of sleep',
      worseBn: 'মানসিক দুশ্চিন্তা ও ক্লান্তিতে বাড়ে',
      betterEn: 'Healthy balanced lifestyle, restful sleep',
      betterBn: 'বিশ্রামে ও সুষম খাদ্যে কমে'
    },
    recommendedPotency: 'German Oral Drops',
    dosageGuidelines: '15 drops in a little water twice to thrice daily before meals.',
    clinicalPearls: 'One of the most trusted outpatient drops for sexual neurasthenia.',
    aliases: ['r41', 'r-41', 'reckeweg r41', 'fortivirone', 'curaver', 'আর ৪১', 'আর-৪১']
  },

  // 6. DR. RECKEWEG R89 (LIPOCOL / HAIR CARE DROPS)
  'reckeweg-r89': {
    id: 'reckeweg-r89',
    latinName: 'Dr. Reckeweg R89 (Lipocol)',
    nameBn: 'ডাঃ রেকেওয়েগ আর-৮৯ (চুল পড়া রোধ ড্রপস)',
    commonName: 'Alopecia & Hair Loss Drops',
    familySource: 'Dr. Reckeweg Germany - Proprietary Formulation',
    category: 'patent',
    sphereOfActionEn: 'Hair follicles, scalp circulation, sebum production & endocrine hair roots.',
    sphereOfActionBn: 'মাথার ত্বকের রক্তসঞ্চালন, চুলের গোড়া শক্ত করা, চুল পড়া রোধ ও খুশকি।',
    primaryIndications: [
      { en: 'Excessive hair loss, thinning of hair, premature greying, bald patches (alopecia areata)', bn: 'অতিরিক্ত চুল পড়া, চুল পাতলা হয়ে যাওয়া, অকালে চুল পাকা ও চুল উঠে ফাঁকা হওয়া' },
      { en: 'Dandruff, itchy scalp, weakness of hair roots due to hormonal fluctuations or stress', bn: 'মাথায় খুশকি, চুলকানি ও মানসিক ক্লান্তির কারণে চুলের গোড়া দুর্বল হওয়া' }
    ],
    guidingKeynotes: [
      { en: 'Contains Alfalfa, Juglans, Kalium phosphoricum, Lactuca sativa, Polysorbate, and Testis.', bn: 'চুল পড়া বন্ধ করতে ও নতুন চুল গজাতে বিশ্বখ্যাত জার্মান ফর্মুলা।' }
    ],
    modalities: {
      worseEn: 'Stress, chemical hair dyes, malnutrition',
      worseBn: 'কেমিক্যাল ব্যবহারে বাড়ে',
      betterEn: 'Gentle scalp massage, balanced diet',
      betterBn: 'মাথায় মৃদু মালিশে কমে'
    },
    recommendedPotency: 'German Oral Drops',
    dosageGuidelines: 'Internal: 20-30 drops in water 3 times daily. External: Rub 20-30 drops directly onto dry bald spots at bedtime.',
    clinicalPearls: 'Unique dual-acting drop: works both orally and as an external scalp application.',
    aliases: ['r89', 'r-89', 'reckeweg r89', 'lipocol', 'আর ৮৯', 'আর-৮৯']
  },

  // 7. DR. WILLMAR SCHWABE DAMIAPLANT
  'schwabe-damiaplant': {
    id: 'schwabe-damiaplant',
    latinName: 'Dr. Willmar Schwabe Damiaplant Drops',
    nameBn: 'ডাঃ উইলমার শোয়াবে ড্যামিয়াপ্ল্যান্ট ড্রপস',
    commonName: 'German Aphrodisiac & Vitality Drops',
    familySource: 'Dr. Willmar Schwabe Germany - Classical German Formula',
    category: 'patent',
    sphereOfActionEn: 'Central nervous system, penile vasculature, spinal reflex centers & adrenal glands.',
    sphereOfActionBn: 'পুরুষ প্রজনন স্বাস্থ্য, স্নায়বিক অবসাদ, স্ট্যামিনা ও রক্তসঞ্চালন।',
    primaryIndications: [
      { en: 'Male sexual dysfunction, psychogenic impotence, premature emission, lack of stamina', bn: 'মানসিক অবসাদের কারণে যৌন অনীহা, দুর্বলতা ও শারীরিক ক্লান্তিবোধ' },
      { en: 'Restores nervous vigor and hormonal endurance without dangerous cardiovascular spikes', bn: 'রক্তচাপের কোনো ক্ষতি ছাড়াই স্বাভাবিক শারীরিক ও মানসিক শক্তি ফিরিয়ে আনে' }
    ],
    guidingKeynotes: [
      { en: 'Original Schwabe combination of Damiana, Ginseng, Agnus Castus, Nuphar Luteum, and Muira Puama.', bn: 'বিশ্ববিখ্যাত জার্মান শোয়াবে ল্যাবরেটরির সেরা পুরুষ ভাইটালিটি ফর্মুলা।' }
    ],
    modalities: {
      worseEn: 'Stress, exhaustion, smoking',
      worseBn: 'মানসিক পরিশ্রমে বাড়ে',
      betterEn: 'Proper rest, nutritious food',
      betterBn: 'পুষ্টিকর খাদ্য ও বিশ্রামে কমে'
    },
    recommendedPotency: 'German Oral Liquid Drops',
    dosageGuidelines: '10 to 15 drops in water 3 times daily after meals.',
    clinicalPearls: 'Renowned for high efficacy and zero cardiac side effects compared to chemical pills.',
    aliases: ['damiaplant', 'schwabe damiaplant', 'ড্যামিয়াপ্ল্যান্ট']
  },

  // 8. SBL CLEARSTONE DROPS
  'sbl-clearstone': {
    id: 'sbl-clearstone',
    latinName: 'SBL Clearstone Drops',
    nameBn: 'এসবিএল ক্লিয়ারস্টোন ড্রপস (কিডনি পাথর)',
    commonName: 'Renal & Ureteric Calculus Drops',
    familySource: 'SBL Global Homoeopathy - Research Formulation',
    category: 'patent',
    sphereOfActionEn: 'Kidneys, ureters, urinary bladder, renal pelvis & oxalate dissolution.',
    sphereOfActionBn: 'কিডনির পাথর, মূত্রনালীতে পাথর আটকে যাওয়া ও প্রস্রাবে তীব্র জ্বালা।',
    primaryIndications: [
      { en: 'Renal calculi, ureteric stones, excruciating kidney back pain radiating downwards', bn: 'কিডনি ও ইউরেটারে পাথর, কোমরে তীব্র ব্যথা যা তলপেটের দিকে নামে' },
      { en: 'Painful, burning urination, cloudy or bloody urine, frequent urge with little output', bn: 'প্রস্রাবের সময় জ্বালাপোড়া ও পাথরের কারণে প্রস্রাবে রক্ত বা পুঁজ' }
    ],
    guidingKeynotes: [
      { en: 'Contains Berberis vulgaris Q, Sarsaparilla Q, Ocimum canum Q, Solidago Q, and Pareira brava Q.', bn: 'ভারতের অন্যতম বিশ্বস্ত ও পরীক্ষিত কিডনির পাথর বের করার হোমিওপ্যাথিক ফর্মুলা।' }
    ],
    modalities: {
      worseEn: 'Sudden movement, dehydration',
      worseBn: 'পানি কম খেলে বাড়ে',
      betterEn: 'Copious water intake',
      betterBn: 'প্রচুর পানি পানে কমে'
    },
    recommendedPotency: 'Oral Liquid Drops',
    dosageGuidelines: '10-15 drops in quarter cup of water 3-4 times daily.',
    clinicalPearls: 'One of the most prescribed proprietary drops for kidney stones in India and Bangladesh.',
    aliases: ['clearstone', 'sbl clearstone', 'ক্লিয়ারস্টোন']
  },

  // 9. SBL LIV-T TONIC
  'sbl-liv-t': {
    id: 'sbl-liv-t',
    latinName: 'SBL Liv-T Tonic',
    nameBn: 'এসবিএল লিভ-টি টনিক (লিভার সুরক্ষা)',
    commonName: 'Herbal Liver Health & Appetite Tonic',
    familySource: 'SBL Global Homoeopathy - Botanical Liver Tonic',
    category: 'patent',
    sphereOfActionEn: 'Hepatic parenchyma, bile synthesis, gastric enzymes & fat digestion.',
    sphereOfActionBn: 'লিভারের কার্যক্ষমতা, ক্ষুধাবৃদ্ধি, হজমশক্তি ও জন্ডিস নিরাময়।',
    primaryIndications: [
      { en: 'Fatty liver, sluggish hepatic functions, loss of appetite, indigestion after heavy meals', bn: 'ফ্যাটি লিভার, মুখে অরুচি, ক্ষুধা না লাগা এবং খাওয়ার পর পেটে ভারি ভাব' },
      { en: 'Jaundice, post-hepatitis liver damage, hepatic sluggishness from alcohol or medications', bn: 'জন্ডিস, লিভার এনজাইম বৃদ্ধি (SGPT/SGOT) এবং লিভার ডিটক্সিফিকেশন' }
    ],
    guidingKeynotes: [
      { en: 'Contains Carduus marianus, Chelidonium majus, Andrographis paniculata (Kalmegh), Hydrastis, and Taraxacum.', bn: 'ছোট-বড় সবার জন্য অত্যন্ত সুস্বাদু ও নিরাপদ ক্ষুধা বাড়ানোর লিভার টনিক।' }
    ],
    modalities: {
      worseEn: 'Alcohol, fatty junk food',
      worseBn: 'তেলে ভাজা খাবারে বাড়ে',
      betterEn: 'Clean diet, fresh fruits',
      betterBn: 'হালকা খাবারে কমে'
    },
    recommendedPotency: 'Oral Liquid Tonic',
    dosageGuidelines: 'Adults: 2 teaspoonfuls 3 times daily before food. Children: 1 teaspoonful.',
    clinicalPearls: 'Excellent first-line liver prescription for chronic gastrointestinal clinic patients.',
    aliases: ['liv-t', 'sbl liv-t', 'liv t', 'লিভ-টি']
  },

  // 10. BAKSON RHEUM AID SYRUP & TABLETS
  'bakson-rheum-aid': {
    id: 'bakson-rheum-aid',
    latinName: 'Bakson Rheum Aid Syrup',
    nameBn: 'বাকসন রিউম এইড সিরাপ (বাতের ওষুধ)',
    commonName: 'Anti-Rheumatic & Joint Relief Formula',
    familySource: 'Bakson Drugs & Pharmaceuticals - Joint Care',
    category: 'patent',
    sphereOfActionEn: 'Synovial fluid, joint capsules, cartilage, ligaments, lumbar spine & nerves.',
    sphereOfActionBn: 'হাঁটু ও গাঁটের বাতব্যথা, জয়েন্ট শক্ত হওয়া ও সায়াটিকা।',
    primaryIndications: [
      { en: 'Osteoarthritis, rheumatoid arthritis, gout, stiffness of joints, morning stiffness', bn: 'হাঁটুর বাতব্যথা, সকালে ঘুম থেকে উঠলে শরীর আড়ষ্ট হয়ে থাকা ও আঙুল বাঁকা হওয়া' },
      { en: 'Sciatica, chronic lumbago, neuralgic body aches from damp weather and cold exposure', bn: 'কোমর থেকে পা পর্যন্ত টান ধরা তীব্র সায়াটিকার ব্যথা' }
    ],
    guidingKeynotes: [
      { en: 'Contains Acidum formicicum, Colchicum, Rhus tox, Natrum salicylicum, Ledum pal, and Dulcamara.', bn: 'শরীরের সমস্ত গাঁটের ব্যথা ও ফোলা ভাব দূর করার সুপরিচিত ফর্মুলেশন।' }
    ],
    modalities: {
      worseEn: 'Cold damp weather, winter, morning',
      worseBn: 'শীতকালে ও ভেজা বাতাসে বাড়ে',
      betterEn: 'Warmth, dry heat, hot fomentation',
      betterBn: 'গরম সেঁকে কমে'
    },
    recommendedPotency: 'Oral Syrup / Tablets',
    dosageGuidelines: '1-2 teaspoonfuls 3 times daily with water after meals.',
    clinicalPearls: 'Provides long-lasting relief without irritating gastric mucosa or stomach ulcers.',
    aliases: ['rheum aid', 'bakson rheum aid', 'রিউম এইড']
  },

  // 11. WHEEZAL WL-33 (SINUSITIS DROPS)
  'wheezal-wl-33': {
    id: 'wheezal-wl-33',
    latinName: 'Wheezal WL-33 Sinusitis Drops',
    nameBn: 'হুইজাল ডব্লিউএল-৩৩ (সাইনোসাইটিস ড্রপস)',
    commonName: 'Sinusitis & Blocked Nose Drops',
    familySource: 'Wheezal Homoeo Pharma - WL Series',
    category: 'patent',
    sphereOfActionEn: 'Frontal, maxillary and ethmoidal sinuses, nasal mucosa & post-nasal drip.',
    sphereOfActionBn: 'মাথার সাইনাস, কপাল ও নাকের ওপর চাপ, নাক বন্ধ হওয়া ও মাথাব্যথা।',
    primaryIndications: [
      { en: 'Acute and chronic sinusitis, frontal headache, pressure above eyebrows and root of nose', bn: 'কপালে সাইনাসের তীব্র মাথাব্যথা, নাকের দুই পাশে ও চোখের ওপর ভারী চাপ' },
      { en: 'Nasal obstruction, thick yellowish green discharge, post-nasal drip, loss of smell', bn: 'নাক বন্ধ হয়ে থাকা, মুখে দুর্গন্ধযুক্ত কফ পড়া এবং ঘ্রাণশক্তি কমে যাওয়া' }
    ],
    guidingKeynotes: [
      { en: 'Combines Arsenicum album, Calcarea fluorica, Hydrastis canadensis, Kalium bichromicum, and Teucrium.', bn: 'সাইনাস পরিষ্কার ও শ্বাসপ্রশ্বাস স্বাভাবিক করার শীর্ষস্থানীয় ড্রপ।' }
    ],
    modalities: {
      worseEn: 'Cold drafts, air conditioning, dust',
      worseBn: 'এসি বা ঠান্ডা বাতাসে বাড়ে',
      betterEn: 'Steam inhalation, warm room',
      betterBn: 'গরম পানির ভাপ নিলে কমে'
    },
    recommendedPotency: 'Oral Liquid Drops',
    dosageGuidelines: '10 to 15 drops in warm water 3 times a day.',
    clinicalPearls: 'Advise steam inhalation 5 minutes after taking dose for best results.',
    aliases: ['wl-33', 'wl 33', 'wheezal wl-33', 'wheezal 33', 'ডব্লিউএল-৩৩']
  },

  // 12. ADEL 89 (APO-STOM / DEEP DIGESTIVE DROPS)
  'adel-89': {
    id: 'adel-89',
    latinName: 'Adel 89 (Apo-STOM Drops)',
    nameBn: 'এডেল ৮৯ (এপো-স্টম ড্রপস)',
    commonName: 'German Deep Digestive & Gastric Drops',
    familySource: 'Adelpek / Pekana Germany - Spagyric-Homoeopathic Complex',
    category: 'patent',
    sphereOfActionEn: 'Stomach mucosa, hydrochloric acid regulation, pyloric sphincter & autonomic gut nerves.',
    sphereOfActionBn: 'পাকস্থলী, গ্যাস্ট্রিক আলসার, বুক জ্বলা, এসিড রিফ্লাক্স ও গভীর পরিপাক জটিলতা।',
    primaryIndications: [
      { en: 'Severe chronic gastritis, peptic ulcers, acid reflux (GERD), heartburn and nausea', bn: 'গ্যাস্ট্রিক ও পেপটিক আলসার, বুক জ্বালাপোড়া ও পেটের ওপর তীব্র জ্বালাময় অস্বস্তি' },
      { en: 'Stomach cramps, nervous dyspepsia, burning pain radiating to back after eating', bn: 'খাওয়ার পর পেটে খিল ধরা ব্যথা যা পিঠের দিকে ছড়ায়' }
    ],
    guidingKeynotes: [
      { en: 'Premium German spagyric complex: Antimonium crudum, Belladonna, Colocynthis, Lycopodium, Natrium phosphoricum, and Nux vomica.', bn: 'জার্মানির পেকানা ল্যাবরেটরির সেরা প্রিমিয়াম গ্যাস্ট্রিক ড্রপস।' }
    ],
    modalities: {
      worseEn: 'Stress, sour foods, irregular meals',
      worseBn: 'অনিয়মিত খাওয়াদাওয়া ও টকে বাড়ে',
      betterEn: 'Bland warm water, relaxation',
      betterBn: 'কুসুম গরম পানিতে কমে'
    },
    recommendedPotency: 'German Spagyric Drops',
    dosageGuidelines: '15-20 drops in warm water 3 times daily before meals.',
    clinicalPearls: 'Superb results in stubborn gastritis resistant to standard antacids.',
    aliases: ['adel 89', 'adel-89', 'apo-stom', 'এডেল ৮৯']
  }
};
