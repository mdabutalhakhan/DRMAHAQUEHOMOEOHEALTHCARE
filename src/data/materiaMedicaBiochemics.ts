import { MateriaMedicaRemedy } from './materiaMedicaDatabase';

export const BIOCHEMIC_MATERIA_MEDICA: Record<string, MateriaMedicaRemedy> = {
  // 1. CALCAREA FLUORICA
  'calcarea-fluorica': {
    id: 'calcarea-fluorica',
    latinName: 'Calcarea Fluorica (Calc Fluor)',
    nameBn: 'ক্যালকেরিয়া ফ্লোরিকা (ক্যাল্ক ফ্লোর)',
    commonName: 'Fluoride of Lime (Calcium Fluoride)',
    familySource: 'Mineral Tissue Salt - Elastic Fibres & Bone Periosteum',
    category: 'biochemic',
    sphereOfActionEn: 'Elastic fibres, periosteum, tooth enamel, vascular walls, ligaments & glandular tissue.',
    sphereOfActionBn: 'ইলাস্টিক ফাইবার, অস্থির পেরিওস্টিয়াম, দাঁতের এনামেল, শিরা ও ধমনীর প্রাচীর, লিগামেন্ট এবং শক্ত গ্ল্যান্ড।',
    primaryIndications: [
      { en: 'Hard, stony, indurated glandular enlargements, tonsillar hardness, breast knots', bn: 'পাথরের মতো শক্ত গ্রন্থি বা টিউমার, টনসিলের শক্ত ভাব, ব্রেস্টে শক্ত দলা' },
      { en: 'Varicose veins, dilated hemorrhoidal veins, vascular engorgement of legs', bn: 'শিরার স্থিতিস্থাপকতা নষ্ট হয়ে ভ্যারিকোজ ভেইন, পা ফুলে যাওয়া ও অর্শের নীলচে বলি' },
      { en: 'Bone spurs, exostoses, calcaneal spur (heel pain), joint crepitation', bn: 'অতিরিক্ত হাড় বৃদ্ধি, গোড়ালির হাড় বেড়ে গিয়ে সকালে হাঁটার সময় তীব্র ব্যথা (ক্যালকেনিয়াল স্পার)' },
      { en: 'Chapped, cracked skin on palms, fingers and soles; hard calluses and corns', bn: 'হাতের তালু বা পায়ের তলার ত্বক শক্ত হয়ে ফেটে যাওয়া, গভীর কড়া ও ফাটা দাগ' },
      { en: 'Relaxation of elastic tissue leading to uterine prolapse and sagging ligaments', bn: 'লিগামেন্ট ঢিলে হয়ে অঙ্গের স্থানচ্যুতি (যেমন জরায়ু নেমে আসা)' }
    ],
    guidingKeynotes: [
      { en: 'Restores elasticity to relaxed and hardened tissues; master remedy for stone-like hardness.', bn: 'টিস্যুর স্থিতিস্থাপকতা ফিরিয়ে আনে; যে কোনো জায়গায় পাথরের মতো শক্তভাবের পরম বন্ধু।' },
      { en: 'Joint pain worse on beginning motion, but relieved after moving around continuous motion.', bn: 'প্রথম নড়াচড়ায় ব্যথা বেশি, কিন্তু কিছুক্ষণ একটানা হাঁটাহাঁটি করলে ব্যথা উপশম হয়।' }
    ],
    modalities: {
      worseEn: 'Rest, beginning of motion, cold damp weather, drafts of air',
      worseBn: 'বিশ্রামে, প্রথম নড়াচড়ায়, ঠান্ডা স্যাঁতসেঁতে আবহাওয়ায় বাড়ে',
      betterEn: 'Continuous motion, heat, warm applications, rubbing',
      betterBn: 'একটানা নড়াচড়া করলে, গরম সেঁকে ও মালিশে উপশম'
    },
    recommendedPotency: '3X, 6X, 12X (Biochemic)',
    dosageGuidelines: '4 tablets dissolved in lukewarm water 3-4 times daily for 3 months.',
    clinicalPearls: 'Indispensable in heel spurs combined with Rhus Tox or Hekla Lava.',
    aliases: ['calc fluor', 'calcarea fluorica', 'ক্যাল্ক ফ্লোর', 'ক্যালকেরিয়া ফ্লোরিকা']
  },

  // 2. FERRUM PHOSPHORICUM
  'ferrum-phosphoricum': {
    id: 'ferrum-phosphoricum',
    latinName: 'Ferrum Phosphoricum (Ferrum Phos)',
    nameBn: 'ফেরাম ফসফরিকাম (ফেরাম ফস)',
    commonName: 'Phosphate of Iron',
    familySource: 'Mineral Tissue Salt - Red Blood Cells & Hemoglobin',
    category: 'biochemic',
    sphereOfActionEn: 'Red blood corpuscles, vascular walls, acute early inflammation & fever.',
    sphereOfActionBn: 'লোহিত রক্তকণিকা, হিমোগ্লোবিন, রক্তনালী এবং যে কোনো রোগের প্রথম প্রদাহজনিত অবস্থা।',
    primaryIndications: [
      { en: 'First stage of all inflammatory and febrile conditions before exudation begins', bn: 'যে কোনো জ্বর ও প্রদাহের প্রথম স্তর, যখন এখনও কফ বা পুঁজ জমতে শুরু করেনি' },
      { en: 'High fever with soft, full, quick pulse, red flushed cheeks without restlessness', bn: 'গায়ে জ্বর, নাড়ির গতি দ্রুত, দুই গাল লাল কিন্তু একোনাইটের মতো অত ছটফটানি থাকে না' },
      { en: 'Congestive headache, throbbing in temples with flushed face, relieved by cold application', bn: 'মাথায় রক্ত উঠে রগ দপদপ করা, মুখমণ্ডল রক্তিম, মাথায় ঠান্ডা পানি দিলে আরাম' },
      { en: 'Epistaxis (nosebleed), coughing up streaks of bright red blood in early bronchitis', bn: 'নাক দিয়ে উজ্জ্বল লাল রক্ত পড়া, ব্রঙ্কাইটিসের শুরুতে কাশির সাথে সামান্য রক্তের দাগ' },
      { en: 'Nutritional iron deficiency anemia with pale, bloodless lips and fatigue', bn: 'রক্তস্বল্পতা বা রক্তহীনতা, চেহারা ফ্যাকাশে ও শরীর সামান্য পরিশ্রমেই দুর্বল হয়ে পড়া' }
    ],
    guidingKeynotes: [
      { en: 'The Schüssler first-aid anti-inflammatory remedy bridging Aconite and Gelsemium.', bn: 'বায়োকেমিক চিকিৎসায় যে কোনো প্রদাহ ও জ্বরের প্রথম মহৌষধ; কোনো পার্শ্বপ্রতিক্রিয়াহীন।' },
      { en: 'Relieves congestion and strengthens vascular wall tone in young children and women.', bn: 'বাচ্চাদের ও নারীদের রক্তস্বল্পতা এবং ঠান্ডা লাগার প্রবণতা দূর করতে অনন্য।' }
    ],
    modalities: {
      worseEn: 'Night, 4 to 6 AM, motion, touch, jarring',
      worseBn: 'রাতে, ভোর ৪টা থেকে ৬টায় ও নড়াচড়ায় বাড়ে',
      betterEn: 'Cold applications, slow gentle movement, resting in cool room',
      betterBn: 'ঠান্ডা সেঁকে, ধীরে ধীরে হাঁটলে এবং শান্ত হয়ে শুয়ে থাকলে কমে'
    },
    recommendedPotency: '3X, 6X, 12X',
    dosageGuidelines: 'Acute fever: 4 tablets in half cup warm water every 2 hours. Anemia: 4 tablets 3 times daily.',
    clinicalPearls: 'Best safe fever controller for infants and elderly without heart suppression.',
    aliases: ['ferrum phos', 'ferrum phosphoricum', 'ফেরাম ফস', 'ফেরাম ফসফরিকাম']
  },

  // 3. KALI MURIATICUM
  'kali-muriaticum': {
    id: 'kali-muriaticum',
    latinName: 'Kali Muriaticum (Kali Mur)',
    nameBn: 'ক্যালি মিউরিয়াটিকাম (ক্যালি মিউর)',
    commonName: 'Chloride of Potassium',
    familySource: 'Mineral Tissue Salt - Fibrin Formations & Glands',
    category: 'biochemic',
    sphereOfActionEn: 'Fibrinous exudations, glandular enlargement, Eustachian tube & respiratory tract.',
    sphereOfActionBn: 'ফাইব্রিন জাতীয় সাদা কফ, লসিকাগ্রন্থি, মধ্যকর্ণ ও ইউস্টেশিয়ান নালী এবং পরিপাকতন্ত্র।',
    primaryIndications: [
      { en: 'Second stage of inflammations with thick, white, milky, fibrinous discharges', bn: 'প্রদাহের দ্বিতীয় স্তর: স্রাব বা কফ যখন ঘন, দুধের মতো সাদা ও আঠালো আকার ধারণ করে' },
      { en: 'Thick white or grayish-white coating on base of tongue with indigestion', bn: 'জিহ্বার গোড়ায় ঘন সাদা বা ধূসর রঙের পরত পড়া এবং পেটে গ্যাস ও বদহজম' },
      { en: 'Catarrh of the middle ear, Eustachian tube block, post-nasal deafness', bn: 'সর্দির কারণে কান বন্ধ হয়ে যাওয়া, কানে শোঁ-শোঁ শব্দ হওয়া বা কানে কম শোনা' },
      { en: 'Swollen tonsils covered with thick white patches or follicular deposits', bn: 'টনসিল ফুলে যাওয়া এবং তার ওপর দুধের সরের মতো সাদা সাদা দাগ পড়া' },
      { en: 'Skin eruptions with thick white crusts and flour-like scales', bn: 'ত্বকে সাদা আটার মতো খসখসে শুষ্ক খুশকি বা খোসপাঁচড়ার ওপর সাদা খোসা' }
    ],
    guidingKeynotes: [
      { en: 'Indicated whenever discharges or tongue coats are distinctly thick and white.', bn: 'রোগের মূল নির্দেশক: যেকোনো স্রাব, থুতু বা জিহ্বার প্রলেপ যদি স্পষ্ট সাদা ও আঠালো হয়।' }
    ],
    modalities: {
      worseEn: 'Rich fatty foods, pastry, motion, damp cold',
      worseBn: 'চর্বিযুক্ত খাবার, মিষ্টি, পেস্ট্রি খেলে ও নড়াচড়ায় বাড়ে',
      betterEn: 'Cold drinks, rubbing, resting',
      betterBn: 'ঠান্ডা পানি পানে ও বিশ্রাম নিলে কমে'
    },
    recommendedPotency: '3X, 6X, 12X',
    dosageGuidelines: '4 tablets dissolved in lukewarm water 3 times a day.',
    clinicalPearls: 'Follows Ferrum Phos when inflammatory discharges turn thick and whitish.',
    aliases: ['kali mur', 'kali muriaticum', 'ক্যালি মিউর', 'ক্যালি মিউরিয়াটিকাম']
  },

  // 4. KALI PHOSPHORICUM
  'kali-phosphoricum': {
    id: 'kali-phosphoricum',
    latinName: 'Kali Phosphoricum (Kali Phos)',
    nameBn: 'ক্যালি ফসফরিকাম (ক্যালি ফস)',
    commonName: 'Phosphate of Potassium',
    familySource: 'Mineral Tissue Salt - Brain & Nerve Cells',
    category: 'biochemic',
    sphereOfActionEn: 'Brain cells, nerves, grey matter, spinal cord, psychic states & heart muscle.',
    sphereOfActionBn: 'মস্তিষ্কের কোষকলা, স্নায়ুতন্ত্র, মানসিক ভারসাম্য, স্মৃতিশক্তি এবং হৃদযন্ত্রের পেশী।',
    primaryIndications: [
      { en: 'Mental and physical exhaustion, brain-fag from overwork, study or prolonged anxiety', bn: 'অতিরিক্ত পড়াশোনা বা মানসিক দুশ্চিন্তায় ব্রেন-ফ্যাগ, স্মরণশক্তি হ্রাস ও মানসিক অবসাদ' },
      { en: 'Nervous dread, anxiety, fear of business failure, palpitation from slightest cause', bn: 'অহেতুক ভয়, বুক ধড়ফড় করা, সামান্যতেই চমকে ওঠা ও বিষণ্ণতা' },
      { en: 'Nervous insomnia: sleeplessness from sheer exhaustion, restless dreams', bn: 'অনিদ্রা: স্নায়বিক ক্লান্তির কারণে ঘুম না হওয়া, সারারাত এপাশ-ওপাশ করা' },
      { en: 'Nervous dyspepsia: empty hollow sensation at stomach after mental effort', bn: 'মানসিক কাজের পর পেটে শূন্যতা, গ্যাস ও হজমের দুর্বলতা' },
      { en: 'Offensive discharges: breath, sweat and stool have a foul carrion-like odor', bn: 'মুখের নিঃশ্বাস, ঘাম ও মলে তীব্র পচা বা বিষাক্ত দুর্গন্ধ' }
    ],
    guidingKeynotes: [
      { en: 'The greatest nerve tonic in biochemic medicine; revitalizes exhausted neurons.', bn: 'স্নায়ু সবলকারী সর্বশ্রেষ্ঠ বায়োকেমিক টনিক; দুর্বল ব্রেনের সঞ্জীবনী সুধা।' }
    ],
    modalities: {
      worseEn: 'Mental and physical exertion, worry, cold air, 3 to 5 AM',
      worseBn: 'মানসিক পরিশ্রমে, দুশ্চিন্তায়, ভোর ৩-৫টায় ও শীতে বাড়ে',
      betterEn: 'Warmth, gentle motion, rest, eating meals, cheerful company',
      betterBn: 'উষ্ণতায়, বিশ্রাম নিলে, আহারের পর এবং প্রফুল্ল পরিবেশে কমে'
    },
    recommendedPotency: '6X, 12X',
    dosageGuidelines: '4 tablets dissolved in warm water twice to thrice daily (morning and bedtime).',
    clinicalPearls: 'The top non-addictive nerve rebuilder for students, professionals, and postpartum women.',
    aliases: ['kali phos', 'kali phosphoricum', 'ক্যালি ফস', 'ক্যালি ফসফরিকাম']
  },

  // 5. MAGNESIA PHOSPHORICA
  'magnesia-phosphorica': {
    id: 'magnesia-phosphorica',
    latinName: 'Magnesia Phosphorica (Mag Phos)',
    nameBn: 'ম্যাগনেসিয়া ফসফরিকাম (ম্যাগ ফস)',
    commonName: 'Phosphate of Magnesium',
    familySource: 'Mineral Tissue Salt - Muscle Fibres & Nerve Terminals',
    category: 'biochemic',
    sphereOfActionEn: 'Nerves, motor endplates, smooth and skeletal muscles, intestinal & uterine walls.',
    sphereOfActionBn: 'স্নায়ুপ্রান্ত, মাংসপেশী, জরায়ুর পেশী, অন্ত্রের প্রাচীর ও দাঁতের স্নায়ু।',
    primaryIndications: [
      { en: 'Excruciating cramping pains in stomach, abdomen, intestines, uterus and limbs', bn: 'পেটে, অন্ত্রে, জরায়ুতে বা পেশীতে তীব্র খিল ধরা বা মোচড়ানো যন্ত্রণা' },
      { en: 'Spasmodic dysmenorrhea: violent menstrual cramps, must double up and apply heat', bn: 'মাসিকের সময় তীব্র ব্যথায় কুঁকড়ে যাওয়া; গরম সেঁক দিলে সাথে সাথে আরাম পাওয়া' },
      { en: 'Relieved dramatically by hot applications, warmth and bending double (keynote)', bn: 'গরম পানির বোতল দিয়ে সেঁক দিলে এবং পেটের ওপর সামনে ঝুঁকে চাপলে উপশম' },
      { en: 'Trigeminal neuralgia, darting shooting facial nerve pains, toothache relieved by hot drinks', bn: 'মুখের স্নায়ুশূল (ট্রাইজেমিনাল নিউরালজিয়া) ও বিদ্যুৎ চমকানোর মতো তীব্র দাঁতব্যথা' },
      { en: 'Writers cramp, piano players cramp, muscular twitches and involuntary spasms', bn: 'লিখতে গেলে বা কাজ করতে গেলে হাত-পায়ের আঙুলে খিল ধরা ও পেশীর কাঁপুনি' }
    ],
    guidingKeynotes: [
      { en: 'Homoeopathic analgesic and anti-spasmodic: works as an immediate pain reliever.', bn: 'বায়োকেমিক অ্যাসপিরিন বা পেনকিলার; কোনো প্রকার কিডনি ক্ষতি ছাড়াই ব্যথা দূর করে।' }
    ],
    modalities: {
      worseEn: 'Cold drafts, cold water touch, uncovering, right side',
      worseBn: 'ঠান্ডা বাতাসে, ঠান্ডা পানি লাগলে ও ডান পাশে শুলে বাড়ে',
      betterEn: 'Warmth, hot applications, hard pressure, bending double',
      betterBn: 'গরম সেঁকে, পেটে শক্ত চাপে এবং শরীর দ্বিগুণ ভাঁজ করলে কমে'
    },
    recommendedPotency: '6X, 12X',
    dosageGuidelines: 'Dissolve 4 tablets in hot water; sip in sips every 10-15 minutes until pain ceases.',
    clinicalPearls: 'Always give in hot water for lightning-fast absorption and relief.',
    aliases: ['mag phos', 'magnesia phosphorica', 'ম্যাগ ফস', 'ম্যাগনেসিয়া ফস']
  },

  // 6. NATRUM PHOSPHORICUM
  'natrum-phosphoricum': {
    id: 'natrum-phosphoricum',
    latinName: 'Natrum Phosphoricum (Nat Phos)',
    nameBn: 'ন্যাট্রাম ফসফরিকাম (ন্যাট ফস)',
    commonName: 'Phosphate of Sodium',
    familySource: 'Mineral Tissue Salt - Lactic Acid Metabolism & Digestion',
    category: 'biochemic',
    sphereOfActionEn: 'Lactic acid metabolism, gastric glands, duodenum, intestinal mucosa & joints.',
    sphereOfActionBn: 'ল্যাকটিক এসিড ভাঙা, পাকস্থলী ও অন্ত্র, গ্যাস্ট্রিক রস, রক্ত এবং জয়েন্ট।',
    primaryIndications: [
      { en: 'Hyperacidity: sour eructations, sour vomiting, heartburn, acid stomach', bn: 'তীব্র অ্যাসিডিটি, মুখে টক পানি ওঠা, টক বমি, বুক জ্বলা ও অম্লরোগ' },
      { en: 'Golden-yellow or creamy coating on the back part of tongue and roof of mouth', bn: 'জিহ্বার গোড়ায় এবং তালুতে সোনালী-হলুদ বা ঘন মাখনের মতো প্রলেপ' },
      { en: 'Uric acid diathesis, gouty joints, arthritis aggravated by acid meals', bn: 'রক্তে ইউরিক এসিড বৃদ্ধি, বাতের ব্যথা ও গাঁটে ক্যালসিয়াম বা ইউরেট জমা' },
      { en: 'Intestinal worms (pinworms, roundworms) causing picking at the nose and grinding teeth', bn: 'কৃমির সমস্যা: বিশেষ করে রাতে ঘুমের মধ্যে দাঁত কিড়মিড় করা ও নাকে হাত দেওয়া' },
      { en: 'Greenish sour diarrhea in infants fed artificial or cow milk', bn: 'শিশুদের দুধ না সওয়া, সবুজ রঙের দুর্গন্ধযুক্ত টক পাতলা পায়খানা' }
    ],
    guidingKeynotes: [
      { en: 'Neutralizes excess acid and regulates bile and uric acid excretion naturally.', bn: 'শরীরের বাড়তি এসিড প্রশমিত করে এবং হজম ক্ষমতা স্বাভাবিক করে তোলে।' }
    ],
    modalities: {
      worseEn: 'Acids, fat foods, sugar, sour fruit, storms',
      worseBn: 'টক খাবার খেলে, মিষ্টি খেলে ও ঝড়-বৃষ্টির আগে বাড়ে',
      betterEn: 'Open air, warm dry weather',
      betterBn: 'খোলা বাতাসে ও শুকনো আবহাওয়ায় কমে'
    },
    recommendedPotency: '3X, 6X, 12X',
    dosageGuidelines: '4 tablets after meals twice or thrice daily for acidity and gas.',
    clinicalPearls: 'The most reliable biochemic antacid without chalky residue or rebound acidity.',
    aliases: ['nat phos', 'natrum phos', 'ন্যাট ফস', 'ন্যাট্রাম ফসফরিকাম']
  },

  // 7. NATRUM SULPHURICUM
  'natrum-sulphuricum': {
    id: 'natrum-sulphuricum',
    latinName: 'Natrum Sulphuricum (Nat Sulph)',
    nameBn: 'ন্যাট্রাম সালফিউরিকাম (ন্যাট সালফ)',
    commonName: "Glauber's Salt (Sulphate of Sodium)",
    familySource: 'Mineral Tissue Salt - Water Elimination & Liver',
    category: 'biochemic',
    sphereOfActionEn: 'Liver, bile secretion, respiratory system, intestinal tract & base of brain.',
    sphereOfActionBn: 'লিভার, পিত্ত নিঃসরণ, ফুসফুস ও শ্বাসনালী এবং অতিরিক্ত পানি নিষ্কাশন।',
    primaryIndications: [
      { en: 'Asthma and bronchial catarrh dramatically aggravated by wet, damp weather and rainy season', bn: 'স্যাঁতসেঁতে ভেজা আবহাওয়ায় ও বর্ষাকালে শ্বাসকষ্ট ও ব্রঙ্কাইটিসের তীব্র বৃদ্ধি' },
      { en: 'Must hold chest with hands when coughing; loose cough with greenish-grey thick sputum', bn: 'কাশির সময় তীব্র ব্যথায় দুই হাত দিয়ে বুক চেপে ধরে রাখা; সবুজ বা হলদে কফ পড়া' },
      { en: 'Hepatitis, fatty liver, sluggish liver: bitter taste in mouth with brown tongue coat', bn: 'লিভারের প্রদাহ বা ফ্যাটি লিভার: মুখে তিতা স্বাদ ও জিহ্বায় সবুজাভ-বাদামী প্রলেপ' },
      { en: 'Morning diarrhea: stool rushes out as soon as patient sets foot on floor', bn: 'ভোরে ঘুম ভাঙার পর বিছানা থেকে পা ফেলা মাত্রই পায়খানায় দৌড়াতে বাধ্য হওয়া' },
      { en: 'Mental depression, suicidal melancholy or chronic headache after head injury', bn: 'মাথায় আঘাত লাগার পর থেকে দীর্ঘস্থায়ী মাথাব্যথা বা গভীর বিষণ্ণতা' }
    ],
    guidingKeynotes: [
      { en: 'The great hydrogenoid constitutional remedy; eliminates stagnant fluids from body.', bn: 'শরীরে জলীয় অংশের আধিক্য দূর করে এবং লিভার ও প্লীহার ভারমুক্ত করে।' }
    ],
    modalities: {
      worseEn: 'Dampness, rainy weather, living in cellars or waterlogged rooms, lying on left side',
      worseBn: 'বৃষ্টিতে, স্যাঁতসেঁতে ঘরে থাকলে ও বাম পাশে শুলে বাড়ে',
      betterEn: 'Dry warm weather, open air, changing positions',
      betterBn: 'শুকনো উষ্ণ আবহাওয়ায় ও খোলা বাতাসে কমে'
    },
    recommendedPotency: '3X, 6X, 12X',
    dosageGuidelines: '4 tablets 3 times daily in warm water. Indispensable during monsoon season.',
    clinicalPearls: 'The definitive remedy for post-concussion syndrome and humidity asthma.',
    aliases: ['nat sulph', 'natrum sulph', 'ন্যাট সালফ', 'ন্যাট্রাম সালফ']
  },

  // 8. SILICEA BIOCHEMIC
  'silicea-biochemic': {
    id: 'silicea-biochemic',
    latinName: 'Silicea (Silica Tissue Salt)',
    nameBn: 'সিলিসিয়া (বায়োকেমিক)',
    commonName: 'Pure Silica (Silicon Dioxide)',
    familySource: 'Mineral Tissue Salt - Connective Tissues, Bones, Hair & Nails',
    category: 'biochemic',
    sphereOfActionEn: 'Connective tissues, bones, periosteum, hair follicles, nails & cell walls.',
    sphereOfActionBn: 'সংযোজক কলা, হাড়, ত্বক, চুল ও নখ এবং লসিকাগ্রন্থি।',
    primaryIndications: [
      { en: 'Promotes maturation and painless expulsion of pus, abscesses, boils, and splinters', bn: 'শরীরের ভেতর থেকে পুঁজ, কাঁটা বা যেকোনো বাহ্যিক বস্তু নিরাপদে বের করে দেওয়া' },
      { en: 'Defective nutrition: thin, chilly, weak children with large head and open fontanelles', bn: 'রোগা-পাতলা শিশু, রিকেটস বা পুষ্টিহীনতা, মাথার খুলি দেরিতে জোড়া লাগা' },
      { en: 'Offensive foot sweat that excoriates toes; ailments from suppressed foot sweat', bn: 'পায়ের পাতায় দুর্গন্ধযুক্ত ঘাম; এই ঘাম কোনো মলম দিয়ে চাপা দেওয়ার পর জটিল অসুখ' },
      { en: 'Crippled, brittle, splitting nails with white spots; ingrown toenails', bn: 'নখে সাদা দাগ, নখ ফেটে যাওয়া এবং পায়ের বুড়ো আঙুলের মাংসের ভেতর নখ ঢোকা' },
      { en: 'Extreme lack of physical and moral stamina; stage fright yet performs masterfully', bn: 'আত্মবিশ্বাসের অভাব, তবে দায়িত্ব দিলে খুব নিখুঁতভাবে শেষ করতে পারে' }
    ],
    guidingKeynotes: [
      { en: 'The "homeopathic surgeon": opens suppurations without scalpel.', bn: 'হোমিওপ্যাথিক সার্জন: অপারেশনের ছুরি ছাড়াই ফোড়া ফাটিয়ে পুঁজ বের করে দেয়।' }
    ],
    modalities: {
      worseEn: 'Cold, drafts of air, uncovering head, morning, washing',
      worseBn: 'শীতকালে, মাথায় বাতাস লাগলে ও শরীর অনাবৃত করলে বাড়ে',
      betterEn: 'Warmth, bundling up head warmly, summer',
      betterBn: 'গরম কাপড়ে মাথা ঢেকে রাখলে ও উষ্ণতায় উপশম'
    },
    recommendedPotency: '6X, 12X',
    dosageGuidelines: '4 tablets dissolved in warm water 3 times a day.',
    clinicalPearls: 'Avoid giving high potency if foreign surgical implants or pace-makers are present.',
    aliases: ['silicea 6x', 'silica biochemic', 'সিলিসিয়া ৬এক্স']
  },

  // 9. BIO-COMBINATION BC-19 (RHEUMATISM & JOINT PAIN)
  'bio-combination-19': {
    id: 'bio-combination-19',
    latinName: 'Bio-Combination 19 (BC-19)',
    nameBn: 'বায়ো-কম্বিনেশন ১৯ (বাতের ব্যথা)',
    commonName: 'Biochemic Joint & Rheumatic Tablet',
    familySource: 'Schüssler Combination (Ferrum Phos, Mag Phos, Kali Sulph, Nat Sulph)',
    category: 'biochemic',
    sphereOfActionEn: 'Musculoskeletal system, synovial membranes, joint capsules & nerves.',
    sphereOfActionBn: 'শরীরের বিভিন্ন গাঁট, লিগামেন্ট, মাংসপেশী এবং বাতের ব্যথা ও আড়ষ্টতা।',
    primaryIndications: [
      { en: 'Acute and chronic articular rheumatism, lumbago, stiff neck and muscular aches', bn: 'তীব্র বা দীর্ঘস্থায়ী বাতের ব্যথা, কোমর ব্যথা, ঘাড় শক্ত হয়ে যাওয়া ও মাংসপেশীর টান' },
      { en: 'Pain worse in cold, damp weather, change of season, relieved by hot fomentation', bn: 'শীতকালে ও বৃষ্টিতে ব্যথা বৃদ্ধি, গরম সেঁক দিলে তীব্র উপশম অনুভূত হওয়া' },
      { en: 'Swelling and crackling sensation in knees, fingers and ankles', bn: 'হাঁটু, গোড়ালি ও আঙুলের গাঁট ফুলে যাওয়া এবং নড়াচড়া করলে মটমট শব্দ হওয়া' }
    ],
    guidingKeynotes: [
      { en: 'Synergistic combination of anti-inflammatory and anti-spasmodic tissue salts.', bn: 'চারটি প্রধান বায়োকেমিক লবণের সমন্বয়ে তৈরি ব্যথানাশক নিরাপদ ফর্মুলা।' }
    ],
    modalities: {
      worseEn: 'Cold damp weather, movement after rest, night',
      worseBn: 'স্যাঁতসেঁতে ঠান্ডায় ও রাতে বাড়ে',
      betterEn: 'Warmth, dry heat, rest',
      betterBn: 'গরম সেঁকে ও বিশ্রামে উপশম'
    },
    recommendedPotency: 'Combination 6X/12X Tablets',
    dosageGuidelines: '4 tablets dissolved in half cup warm water 3 times daily after meals.',
    clinicalPearls: 'Excellent adjuvant alongside Arnica, Rhus Tox or Bryonia.',
    aliases: ['bc 19', 'bc-19', 'bio combination 19', 'বিসি ১৯']
  },

  // 10. BIO-COMBINATION BC-20 (SKIN DISEASES)
  'bio-combination-20': {
    id: 'bio-combination-20',
    latinName: 'Bio-Combination 20 (BC-20)',
    nameBn: 'বায়ো-কম্বিনেশন ২০ (চর্মরোগ)',
    commonName: 'Biochemic Skin Affections Tablet',
    familySource: 'Schüssler Combination (Calc Fluor, Calc Sulph, Kali Sulph, Nat Mur, Nat Sulph)',
    category: 'biochemic',
    sphereOfActionEn: 'Epidermis, dermis, sebaceous glands & subcutaneous tissue.',
    sphereOfActionBn: 'ত্বকের এপিডার্মিস, তৈলগ্রন্থি, চুলকানি ও একজিমা।',
    primaryIndications: [
      { en: 'Eczema, psoriasis, dry eruptions, scaly skin, cracks and peeling fissures', bn: 'একজিমা, সোরিয়াসিস, খসখসে চামড়া, ত্বক ফেটে যাওয়া ও শুষ্ক চুলকানি' },
      { en: 'Acne vulgaris, herpes, pustules and recurrent boils with yellowish discharge', bn: 'মুখে ব্রণ, ফোঁড়া, ফুসকুড়ি ও চামড়ার ওপর আঠালো রস বা আঁশ ওঠা' },
      { en: 'Intense itching worse from warmth of bed or scratching', bn: 'চুলকানি বিছানার গরমে তীব্র আকার ধারণ করা' }
    ],
    guidingKeynotes: [
      { en: 'Purifies the skin cells and restores epithelial integrity from within.', bn: 'রক্ত ও ত্বকের কোষকলা পরিষ্কার করে ভেতরের থেকে আরোগ্য এনে দেয়।' }
    ],
    modalities: {
      worseEn: 'Warmth, washing with cold water',
      worseBn: 'গরমে ও বেশি পানি লাগলে বাড়ে',
      betterEn: 'Cool open air, keeping clean and dry',
      betterBn: 'পরিচ্ছন্ন ও শুষ্ক থাকলে ভালো থাকে'
    },
    recommendedPotency: 'Combination 6X/12X Tablets',
    dosageGuidelines: '4 tablets 3 times daily for 4-8 weeks.',
    clinicalPearls: 'Combine with Berberis Aquifolium Q for radiant and blemish-free skin.',
    aliases: ['bc 20', 'bc-20', 'bio combination 20', 'বিসি ২০']
  },

  // 11. BIO-COMBINATION BC-25 (ACIDITY & INDIGESTION)
  'bio-combination-25': {
    id: 'bio-combination-25',
    latinName: 'Bio-Combination 25 (BC-25)',
    nameBn: 'বায়ো-কম্বিনেশন ২৫ (গ্যাস্ট্রিক ও অম্বল)',
    commonName: 'Biochemic Gastric & Acidity Formula',
    familySource: 'Schüssler Combination (Nat Phos, Nat Sulph, Silicea)',
    category: 'biochemic',
    sphereOfActionEn: 'Gastric mucosa, hepatic bile, duodenum & intestinal digestion.',
    sphereOfActionBn: 'পাকস্থলী, বুক জ্বালাপোড়া, টক ঢেকুর ও বদহজম।',
    primaryIndications: [
      { en: 'Gastric hyperacidity, sour eructations, heartburn, fullness after food', bn: 'বুক জ্বালাপোড়া, গলায় টক পানি ওঠা, খাওয়ার পর পেট ভারী লাগা' },
      { en: 'Dyspepsia, flatulence, nausea and bitter taste in mouth', bn: 'পেটে গ্যাস, পেট ফাঁপা, বমি বমি ভাব এবং মুখে তিতা স্বাদ' }
    ],
    guidingKeynotes: [
      { en: 'Immediate natural neutralization of stomach acid without chemicals.', bn: 'কোনো ক্ষতিকর কেমিক্যাল ছাড়াই পেটের গ্যাস ও এসিড দূর করার নিরাপদ মাধ্যম।' }
    ],
    modalities: {
      worseEn: 'Spicy rich meals, irregular food timings',
      worseBn: 'তেল-মশলাযুক্ত খাবার খেলে বাড়ে',
      betterEn: 'Bland diet, warm water',
      betterBn: 'হালকা খাবার ও কুসুম গরম পানিতে কমে'
    },
    recommendedPotency: 'Combination 6X Tablets',
    dosageGuidelines: '4 tablets chewed or dissolved in warm water after heavy meals.',
    clinicalPearls: 'A must-have chamber dispenser tablet for modern lifestyle indigestion.',
    aliases: ['bc 25', 'bc-25', 'bio combination 25', 'বিসি ২৫']
  }
};
