import { MateriaMedicaRemedy } from './materiaMedicaDatabase';

export const MOTHER_TINCTURE_MATERIA_MEDICA: Record<string, MateriaMedicaRemedy> = {
  // 1. CASSIA FISTULA Q
  'cassia-fistula-q': {
    id: 'cassia-fistula-q',
    latinName: 'Cassia Fistula Q',
    nameBn: 'ক্যাসিয়া ফিস্টুলা মাদার (সোঁদাল / বাঁদরলাঠি)',
    commonName: 'Golden Shower Tree / Indian Laburnum',
    familySource: 'Fabaceae / Leguminosae - Pulp of ripe pods',
    category: 'mother_tincture',
    sphereOfActionEn: 'Liver, colon, peristalsis, biliary secretion, rectum & intestinal mucosa.',
    sphereOfActionBn: 'বৃহদন্ত্র, কোষ্ঠকাঠিন্য, পিত্ত নিঃসরণ, লিভার ও মলদ্বারের মাংসপেশী।',
    primaryIndications: [
      { en: 'Chronic obstinate constipation with sluggish bowel inertia and hard dry feces', bn: 'দীর্ঘস্থায়ী কোষ্ঠকাঠিন্য, অন্ত্রের জড়তা এবং শুকনো শক্ত মল' },
      { en: 'Safe, non-habit forming laxative ideal for infants, children, pregnant and elderly patients', bn: 'নিরাপদ জোলাপ; শিশু, বৃদ্ধ ও গর্ভবতী মায়েদের জন্য কোনো প্রকার পেট কামড়ানো ছাড়া মল পরিষ্কারকারী' },
      { en: 'Jaundice, sluggish bilious liver with dull aching pain in right hypochondrium', bn: 'জন্ডিস, পিত্তের স্থবিরতা এবং লিভারের ওপর ভোঁতা ব্যথা' }
    ],
    guidingKeynotes: [
      { en: 'Gently cleanses intestinal tract without griping, irritation, or chemical dependence.', bn: 'পেটে কোনো মোচড় ছাড়াই স্বাভাবিক মলত্যাগ করায়; কোনো অভ্যাস তৈরি করে না।' }
    ],
    modalities: {
      worseEn: 'Sedentary habits, heavy meals, hot weather',
      worseBn: 'একটানা বসে থাকলে ও ভারী খাবারে বাড়ে',
      betterEn: 'Abundant warm water, physical walk',
      betterBn: 'পর্যাপ্ত পানি পানে ও হাঁটাহাঁটি করলে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15-20 drops in half glass of lukewarm water at bedtime.',
    clinicalPearls: 'Excellent natural substitute for harsh chemical senna laxatives.',
    aliases: ['cassia fistula', 'cassia fistula q', 'সোঁদাল', 'ক্যাসিয়া']
  },

  // 2. SYZYGIUM JAMBOLANUM Q
  'syzygium-jambolanum-q': {
    id: 'syzygium-jambolanum-q',
    latinName: 'Syzygium Jambolanum Q',
    nameBn: 'সিজিজিয়াম জাম্বোলানাম মাদার (কালোজাম বীজ)',
    commonName: 'Java Plum / Black Plum / Jamun Seeds',
    familySource: 'Myrtaceae - Powdered fresh seeds',
    category: 'mother_tincture',
    sphereOfActionEn: 'Pancreatic islets of Langerhans, glycogen metabolism, renal threshold & glucose regulation.',
    sphereOfActionBn: 'অগ্ন্যাশয়, রক্তের গ্লুকোজ নিয়ন্ত্রণ, ডায়াবেটিস মেলিটাস ও কিডনির ছাঁকন ক্ষমতা।',
    primaryIndications: [
      { en: 'Diabetes Mellitus with high blood sugar, presence of glucose in urine (glycosuria)', bn: 'ডায়াবেটিস: রক্তে ও প্রস্রাবে চিনির পরিমাণ অস্বাভাবিক বেশি' },
      { en: 'Excessive unquenchable thirst (polydipsia) and constant dry mouth', bn: 'প্রচণ্ড পানির পিপাসা, প্রচুর পানি খাওয়ার পরও মুখ ও জিহ্বা শুকিয়ে কাঠ হয়ে থাকা' },
      { en: 'Profuse and frequent urination, especially awakening at night (polyuria)', bn: 'ঘন ঘন প্রচুর পরিমাণে প্রস্রাব হওয়া, বিশেষ করে রাতে বারবার প্রস্রাবের বেগ' },
      { en: 'Great progressive physical weakness, rapid weight loss and diabetic ulcers/boils', bn: 'শরীরে কোনো বল না থাকা, ওজন দ্রুত কমে যাওয়া এবং ডায়াবেটিক ঘা দেরিতে শুকানো' }
    ],
    guidingKeynotes: [
      { en: 'Most authoritative natural remedy to rapidly reduce blood sugar spikes and urinary sugar.', bn: 'হোমিওপ্যাথির প্রধান এন্টি-ডায়াবেটিক ঔষধ; রক্তের সুগার নিয়ন্ত্রণে চমৎকার প্রমাণিত।' }
    ],
    modalities: {
      worseEn: 'Carbohydrates, sweets, mental worry, night',
      worseBn: 'মিষ্টি বা কার্বোহাইড্রেট খেলে ও মানসিক চিন্তায় বাড়ে',
      betterEn: 'Strict dietary discipline, light walking',
      betterBn: 'খাদ্যাভ্যাস নিয়ন্ত্রণ ও নিয়মিত হাঁটাহাঁটিতে ভালো থাকে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '10 to 15 drops in half glass of plain water 3 times daily, 20 minutes before meals.',
    clinicalPearls: 'Combine with Gymnema Sylvestre Q and Cephalandra Indica Q for synergistic glycemic control.',
    aliases: ['syzygium', 'syzygium jambolanum', 'jamun', 'কালোজাম', 'সিজিজিয়াম']
  },

  // 3. CRATAEGUS OXYACANTHA Q
  'crataegus-oxyacantha-q': {
    id: 'crataegus-oxyacantha-q',
    latinName: 'Crataegus Oxyacantha Q',
    nameBn: 'ক্র্যাটেগাস অক্সিয়াকান্থা মাদার (হার্ট টনিক)',
    commonName: 'Hawthorn Berries',
    familySource: 'Rosaceae - Fresh ripe berries',
    category: 'mother_tincture',
    sphereOfActionEn: 'Myocardium, coronary arteries, cardiac conduction system & arterial elasticity.',
    sphereOfActionBn: 'হৃদপেশী (মায়োকার্ডিয়াম), করোনারি ধমনী, রক্তচাপ ও পালস রেট।',
    primaryIndications: [
      { en: 'Cardiac tonic: chronic heart weakness, myocardial insufficiency, heart failure support', bn: 'হৃদযন্ত্রের সর্বশ্রেষ্ঠ টনিক: হার্টের পাম্পিং ক্ষমতা বৃদ্ধি ও দুর্বল হৃদপেশী সবল করে' },
      { en: 'High arterial blood pressure (Hypertension) with atherosclerosis and aortic murmur', bn: 'উচ্চ রক্তচাপ, রক্তনালীতে চর্বি জমে শক্ত হওয়া এবং বুকে চাপ চাপ অস্বস্তি' },
      { en: 'Angina pectoris, precordial pain under left clavicle radiating down left arm', bn: 'এনজাইনা পেক্টোরিস: বুকের বাম পাশে তীক্ষ্ণ ব্যথা যা বাম হাত পর্যন্ত ছড়িয়ে পড়ে' },
      { en: 'Extreme dyspnea, shortness of breath and cold sweat on slightest physical exertion', bn: 'সামান্য একটু হাঁটলে বা সিঁড়ি ভাঙলে বুকে দম আটকে আসা ও ঠান্ডা ঘাম' }
    ],
    guidingKeynotes: [
      { en: 'Acts as a natural mild digitalis without the danger of cumulative myocardial toxicity.', bn: 'কোনো ক্ষতিকর পার্শ্বপ্রতিক্রিয়া ছাড়াই হৃদযন্ত্রের কার্যক্ষমতা ফিরিয়ে দেয়।' }
    ],
    modalities: {
      worseEn: 'Physical exertion, climbing stairs, excitement, warm closed room',
      worseBn: 'সিঁড়ি ভাঙলে, পরিশ্রমে ও অতিরিক্ত উত্তেজনায় বাড়ে',
      betterEn: 'Complete rest, quiet open air',
      betterBn: 'শান্তভাবে বিশ্রাম নিলে ও খোলা বাতাসে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '10-15 drops in a little water 3 times daily after meals for at least 3 months.',
    clinicalPearls: 'An exceptional cardiac protector for high-stress executives and geriatric heart patients.',
    aliases: ['crataegus', 'crataegus oxy', 'hawthorn', 'ক্র্যাটেগাস']
  },

  // 4. RAUWOLFIA SERPENTINA Q
  'rauwolfia-serpentina-q': {
    id: 'rauwolfia-serpentina-q',
    latinName: 'Rauwolfia Serpentina Q',
    nameBn: 'রাউওলফিয়া সার্পেন্টিনা মাদার (সর্পগন্ধা)',
    commonName: "Indian Snakeroot / Sarpagandha",
    familySource: 'Apocynaceae - Dried root',
    category: 'mother_tincture',
    sphereOfActionEn: 'Sympathetic nervous system, peripheral vasomotor tone, brain stem & arterial blood pressure.',
    sphereOfActionBn: 'স্নায়ুতন্ত্র, উচ্চ রক্তচাপ, অনিদ্রা, মস্তিষ্কের উত্তেজনা ও রক্তনালীর চাপ।',
    primaryIndications: [
      { en: 'Essential hypertension: brings high blood pressure down smoothly and steadily', bn: 'উচ্চ রক্তচাপ: নিয়মিত সেবনে রক্তচাপ প্রাকৃতিকভাবে স্বাভাবিক মাত্রায় নামিয়ে আনে' },
      { en: 'Violent throbbing headache, dizziness and flushed red face from arterial pressure', bn: 'উচ্চ রক্তচাপের কারণে মাথায় রক্ত ওঠা, ঘাড় শক্ত হওয়া ও মাথা ঘোরা' },
      { en: 'Severe chronic insomnia and agitated restlessness; calms nervous agitation', bn: 'মারাত্মক অনিদ্রা: রাতে দুশ্চিন্তা ও উত্তেজনায় একদম ঘুম না হওয়া' },
      { en: 'Irritability, anger, manic states and heart palpitations from stress', bn: 'মেজাজ অতিরিক্ত খিটখিটে হওয়া, হুট করে রেগে যাওয়া ও দুশ্চিন্তায় বুক ধড়ফড়' }
    ],
    guidingKeynotes: [
      { en: 'Standard botanical hypotensive and central sedative; natural reserpine source.', bn: 'প্রকৃতির শ্রেষ্ঠ রক্তচাপ নিয়ন্ত্রক ও নিরাপদ ঘুমের সহায়তা প্রদানকারী ভেষজ।' }
    ],
    modalities: {
      worseEn: 'Mental anxiety, lack of sleep, anger, sun exposure',
      worseBn: 'দুশ্চিন্তা, অনিদ্রা ও অতিরিক্ত উত্তেজনায় বাড়ে',
      betterEn: 'Quiet sleep, dark room, cool wash',
      betterBn: 'শান্ত ঘুম ও বিশ্রামে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '10 to 15 drops in half glass of water twice daily (evening and bedtime).',
    clinicalPearls: 'Monitor BP regularly; gently adjust dose as pressure stabilizes.',
    aliases: ['rauwolfia', 'sarpagandha', 'রাউওলফিয়া', 'সর্পগন্ধা']
  },

  // 5. GYMNEMA SYLVESTRE Q
  'gymnema-sylvestre-q': {
    id: 'gymnema-sylvestre-q',
    latinName: 'Gymnema Sylvestre Q',
    nameBn: 'জিমনীমা সিলভেস্ট্রে মাদার (মধুনাশী / গুড়মার)',
    commonName: 'Sugar Destroyer / Gurmar',
    familySource: 'Asclepiadaceae - Dried leaves',
    category: 'mother_tincture',
    sphereOfActionEn: 'Taste buds, intestinal glucose absorption, pancreas & metabolic syndrome.',
    sphereOfActionBn: 'স্বাদকোরক, মিষ্টির প্রতি আকর্ষণ, অন্ত্রে গ্লুকোজ শোষণ এবং অগ্ন্যাশয়।',
    primaryIndications: [
      { en: 'Destroys the taste for sweet food: after administration, sugar tastes completely flat or sandy', bn: 'জিহ্বার মিষ্টি স্বাদ নষ্ট করে দেয়; ফলে চিনি বা মিষ্টি খাবার প্রতি তীব্র আকর্ষণ কমে' },
      { en: 'Diabetes Mellitus: reduces glucose absorption in intestines and enhances insulin release', bn: 'ডায়াবেটিসে রক্তে চিনির মাত্রা কমাতে এবং অন্ত্রে অতিরিক্ত চিনি শোষণ ঠেকাতে সাহায্য করে' },
      { en: 'Metabolic obesity, craving for sweets, chocolates, pastries and sweet beverages', bn: 'মিষ্টি খাওয়ার তীব্র নেশা এবং মেদভুঁড়ি বা অতিরিক্ত স্থূলতা কমাতে কার্যকর' }
    ],
    guidingKeynotes: [
      { en: 'Unique ability to temporarily eliminate the perception of sweetness on the tongue.', bn: 'মিষ্টির তৃষ্ণা ও আসক্তি নিয়ন্ত্রণে প্রকৃতির সেরা উপহার।' }
    ],
    modalities: {
      worseEn: 'Excessive sweet consumption, stress',
      worseBn: 'মিষ্টি বেশি খেলে বাড়ে',
      betterEn: 'Low glycemic diet, regular exercise',
      betterBn: 'নিয়ন্ত্রিত খাদ্যাভ্যাসে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15 drops in quarter cup of water 15 minutes before lunch and dinner.',
    clinicalPearls: 'Pair with Syzygium Jambolanum Q for comprehensive glycemic protocol.',
    aliases: ['gymnema', 'gurmar', 'মধুনাশী', 'গুড়মার', 'জিমনীমা']
  },

  // 6. BOERHAVIA DIFFUSA Q
  'boerhavia-diffusa-q': {
    id: 'boerhavia-diffusa-q',
    latinName: 'Boerhavia Diffusa Q',
    nameBn: 'বোয়েরহাভিয়া ডিফিউসা মাদার (পুনর্নবা)',
    commonName: 'Punarnava / Red Spiderling / Hogweed',
    familySource: 'Nyctaginaceae - Whole fresh plant',
    category: 'mother_tincture',
    sphereOfActionEn: 'Kidneys, renal glomeruli, liver, heart, lymphatic system & fluid balance.',
    sphereOfActionBn: 'কিডনি, মূত্রনালী, পা ফোলা, শোথ (ড্রপসি), লিভার ও শরীরের জলীয় ভারসাম্য।',
    primaryIndications: [
      { en: 'General edema, anasarca, swelling of feet, ankles, hands and face', bn: 'সারা শরীর বা পা, গোড়ালি ও মুখমণ্ডল ফুলে যাওয়া (শোথ রোগ বা ড্রপসি)' },
      { en: 'Renal dropsy: poor urine output, albuminuria, burning urination with puffiness under eyes', bn: 'কিডনির দুর্বলতায় কম প্রস্রাব হওয়া, প্রস্রাবে প্রোটিন যাওয়া ও চোখের নিচে ফোলা' },
      { en: 'Hepatic congestion, ascites, liver cirrhosis support and jaundice with water retention', bn: 'লিভারের অসুখ বা ফ্যাটি লিভারের কারণে পেটে পানি জমা এবং জন্ডিস' }
    ],
    guidingKeynotes: [
      { en: 'Meaning "that which renews the body"; powerful natural diuretic and renal restorer.', bn: 'নামের অর্থই শরীরকে নতুন রূপ দেওয়া; কিডনির কার্যক্ষমতা বাড়াতে প্রকৃতির সেরা ভেষজ।' }
    ],
    modalities: {
      worseEn: 'Salt intake, standing for long periods, cold damp',
      worseBn: 'কাঁচা লবণ খেলে ও বেশিক্ষণ দাঁড়িয়ে থাকলে বাড়ে',
      betterEn: 'Elevating legs, warmth, resting',
      betterBn: 'পা উঁচু করে শুলে ও কুসুম গরম পানিতে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15-20 drops in half glass of water 3 times daily before meals.',
    clinicalPearls: 'Combines powerfully with Apocynum or Crataegus in cardiac-renal dropsy.',
    aliases: ['boerhavia', 'punarnava', 'পুনর্নবা', 'বোয়েরহাভিয়া']
  },

  // 7. CEANOTHUS AMERICANUS Q
  'ceanothus-americanus-q': {
    id: 'ceanothus-americanus-q',
    latinName: 'Ceanothus Americanus Q',
    nameBn: 'সিয়ানোথাস আমেরিকানাস মাদার (প্লীহা টনিক)',
    commonName: 'New Jersey Tea / Red Root',
    familySource: 'Rhamnaceae - Fresh leaves and root',
    category: 'mother_tincture',
    sphereOfActionEn: 'Spleen, portal venous circulation, liver, lymphatic system & left hypochondrium.',
    sphereOfActionBn: 'প্লীহা (Spleen), বাম পাশের পাঁজরের নিচ, পোর্টাল শিরা ও রক্তকণিকা।',
    primaryIndications: [
      { en: 'Splenomegaly: enlarged, painful, congested spleen following malaria or viral fevers', bn: 'প্লীহা বড় হয়ে যাওয়া (স্প্লিনোমেগালি): ম্যালেরিয়া বা টাইফয়েডের পর পেটের বাম পাশে ব্যথা' },
      { en: 'Deep, constant, dull aching pain in the left side under lower ribs', bn: 'বুকের নিচের দিকে বাম পাঁজরের নিচে একটানা ভারী ব্যথা ও অস্বস্তি' },
      { en: 'Cannot lie on the left side due to fullness, pain and drag in spleen region', bn: 'বাম দিকে চেপে শুতে পারে না; মনে হয় বাম পাশে কোনো ভারী বোঝা ঝুলে আছে' }
    ],
    guidingKeynotes: [
      { en: 'The greatest organ remedy for the spleen in the homoeopathic Materia Medica.', bn: 'প্লীহার যে কোনো রোগ ও বৃদ্ধির ক্ষেত্রে হোমিওপ্যাথির সর্বশ্রেষ্ঠ স্পেসিফিক ঔষধ।' }
    ],
    modalities: {
      worseEn: 'Lying on left side, cold damp weather, motion',
      worseBn: 'বাম পাশে শুলে ও নড়াচড়া করলে বাড়ে',
      betterEn: 'Lying on right side, warmth',
      betterBn: 'ডান পাশে শুলে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '10 to 15 drops in quarter glass of water 3 times a day.',
    clinicalPearls: 'Specific for splenic stitches and chronic post-malarial cachexia.',
    aliases: ['ceanothus', 'ceanothus americanus', 'সিয়ানোথাস']
  },

  // 8. TERMINALIA ARJUNA Q
  'terminalia-arjuna-q': {
    id: 'terminalia-arjuna-q',
    latinName: 'Terminalia Arjuna Q',
    nameBn: 'টার্মিনালিয়া অর্জুনা মাদার (অর্জুন ছাল)',
    commonName: 'Arjuna Bark / White Marudah',
    familySource: 'Combretaceae - Dried bark',
    category: 'mother_tincture',
    sphereOfActionEn: 'Cardiovascular system, endothelial lining, cardiac muscle, lipids & coronary circulation.',
    sphereOfActionBn: 'হৃদযন্ত্রের প্রাচীর, রক্তনালী, কোলেস্টেরল নিয়ন্ত্রণ, রক্তচাপ ও হার্টবিট।',
    primaryIndications: [
      { en: 'Ischemic heart disease, coronary artery blockage support, angina and palpitation', bn: 'করোনারি ধমনীতে রক্ত চলাচল স্বাভাবিক রাখা, বুকে ধড়ফড়ানি ও রক্তচাপ নিয়ন্ত্রণ' },
      { en: 'High cholesterol, hyperlipidemia, high triglycerides and arteriosclerosis', bn: 'রক্তে কোলেস্টেরল ও ট্রাইগ্লিসারাইড আধিক্য কমানো এবং রক্তনালীর চর্বি দূর করা' },
      { en: 'Cardiac arrhythmias, fluttering pulse, emotional distress affecting heart rhythm', bn: 'হৃদস্পন্দনের ছন্দপতন (অ্যারিদমিয়া) এবং অল্পতেই বুক কেঁপে ওঠা' }
    ],
    guidingKeynotes: [
      { en: 'Ancient Vedic and homoeopathic cardioprotective herb; strengthens heart contraction.', bn: 'হৃদযন্ত্রের সুরক্ষা ও দীর্ঘস্থায়ী সুস্থতার জন্য পরীক্ষিত ভেষজ অমৃত।' }
    ],
    modalities: {
      worseEn: 'Fast climbing, emotional stress',
      worseBn: 'মানসিক চাপে ও দৌড়ালে বাড়ে',
      betterEn: 'Deep breathing, rest',
      betterBn: 'বিশ্রামে ও বুক ভরে শ্বাস নিলে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15-20 drops in lukewarm water twice daily after meals.',
    clinicalPearls: 'Often prescribed together with Crataegus Oxyacantha for complete cardiac defense.',
    aliases: ['terminalia arjuna', 'arjuna', 'অর্জুন', 'টার্মিনালিয়া']
  },

  // 9. ECHINACEA ANGUSTIFOLIA Q
  'echinacea-angustifolia-q': {
    id: 'echinacea-angustifolia-q',
    latinName: 'Echinacea Angustifolia Q',
    nameBn: 'ইচিনেশিয়া অ্যাঙ্গুস্টিফোলিয়া মাদার',
    commonName: 'Purple Coneflower / Kansas Snakeroot',
    familySource: 'Compositae - Fresh whole plant in flower',
    category: 'mother_tincture',
    sphereOfActionEn: 'Reticuloendothelial system, leukocytes, blood, lymphatic nodes, venomous bites & septicemia.',
    sphereOfActionBn: 'শ্বেত রক্তকণিকা, ইমিউন সিস্টেম, রক্তদূষণ, বিষাক্ত পোকামাকড়ের কামড়, ফোঁড়া ও ঘা।',
    primaryIndications: [
      { en: 'Septic states, blood poisoning, foul gangrenous ulcers, non-healing boils and carbuncles', bn: 'রক্তদূষণ, পচাগলা দুর্গন্ধযুক্ত ঘা, মারাত্মক ফোঁড়া ও কার্বাঙ্কেল' },
      { en: 'Bites of poisonous snakes, spiders, wasps, scorpions, rabid dog bites (internal & external)', bn: 'বিষাক্ত মাকড়সা, বিচ্ছু, মৌমাছির কামড় ও বিষক্রিয়া প্রতিরোধ' },
      { en: 'Recurrent low-grade fevers, recurring tonsillitis, low immune vitality and boils', bn: 'বারবার জ্বর বা টনসিল হওয়া এবং শরীরে রোগের বিরুদ্ধে প্রতিরোধ ক্ষমতা কমে যাওয়া' }
    ],
    guidingKeynotes: [
      { en: 'The great herbal "corrector of blood dyscrasia"; stimulates phagocytosis and natural immunity.', bn: 'হোমিওপ্যাথিক প্রাকৃতিক অ্যান্টিবায়োটিক ও রক্ত পরিশোধক।' }
    ],
    modalities: {
      worseEn: 'Cold drafts, exhausting mental and physical labor',
      worseBn: 'পরিশ্রমে ও ঠান্ডায় বাড়ে',
      betterEn: 'Warm rest, cleanliness',
      betterBn: 'পরিচ্ছন্নতায় ও বিশ্রামে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: 'Internal: 10-15 drops in water 3 times daily. External: 20 drops in sterile water for wound cleaning.',
    clinicalPearls: 'Superior natural antiseptic wash for diabetic carbuncles and infected lacerations.',
    aliases: ['echinacea', 'echinacea q', 'ইচিনেশিয়া']
  },

  // 10. TRIBULUS TERRESTRIS Q
  'tribulus-terrestris-q': {
    id: 'tribulus-terrestris-q',
    latinName: 'Tribulus Terrestris Q',
    nameBn: 'ট্রিবিউলাস টেরেস্ট্রিস মাদার (গোক্ষুর)',
    commonName: 'Puncture Vine / Gokshura',
    familySource: 'Zygophyllaceae - Whole plant with fruits',
    category: 'mother_tincture',
    sphereOfActionEn: 'Genitourinary organs, male hormonal axis, prostate, kidneys & urinary bladder.',
    sphereOfActionBn: 'প্রস্টেট গ্ল্যান্ড, পুরুষ হরমোন (টেস্টোস্টেরন), যৌন দুর্বলতা, কিডনির পাথর ও প্রস্রাবে জ্বালা।',
    primaryIndications: [
      { en: 'Male sexual debility, low testosterone, weak erections, premature ejaculation', bn: 'পুরুষের যৌন দুর্বলতা, অকাল বীর্যপাত ও শারীরিক ক্লান্তি' },
      { en: 'Urinary gravel, kidney calculi, dysuria, burning during urination', bn: 'কিডনিতে বালু বা পাথর, প্রস্রাব করার সময় তীব্র জ্বালাপোড়া ও ফোঁটা ফোঁটা প্রস্রাব' },
      { en: 'Prostatic enlargement with urinary hesitation and nocturnal frequency', bn: 'প্রস্টেট বৃদ্ধিজনিত কারণে প্রস্রাব আটকে থাকা ও রাতে বারবার প্রস্রাবের চাপ' }
    ],
    guidingKeynotes: [
      { en: 'Renowned Ayurvedic and homoeopathic tonic for male endocrine vitality and renal flushing.', bn: 'পুরুষের জীবনীশক্তি বৃদ্ধি এবং কিডনির পাথর পরিষ্কার করার প্রাকৃতিক ভেষজ।' }
    ],
    modalities: {
      worseEn: 'Sexual excesses, alcohol, dehydration',
      worseBn: 'অ্যালকোহল ও অনিয়ন্ত্রিত জীবনযাপনে বাড়ে',
      betterEn: 'Lots of water, restorative sleep',
      betterBn: 'প্রচুর পানি পানে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15-20 drops in half glass of water twice daily after food.',
    clinicalPearls: 'Synergizes wonderfully with Ashwagandha Q and Sabal Serrulata Q.',
    aliases: ['tribulus', 'gokshura', 'গোক্ষুর', 'ট্রিবিউলাস']
  },

  // 11. ASHWAGANDHA (WITHANIA SOMNIFERA) Q
  'ashwagandha-q': {
    id: 'ashwagandha-q',
    latinName: 'Withania Somnifera (Ashwagandha) Q',
    nameBn: 'অশ্বগন্ধা মাদার (উইথেনিয়া সোমনিফেরা)',
    commonName: 'Indian Ginseng / Winter Cherry',
    familySource: 'Solanaceae - Dried root',
    category: 'mother_tincture',
    sphereOfActionEn: 'Hypothalamic-pituitary-adrenal (HPA) axis, brain cells, muscles, reproductive tissue.',
    sphereOfActionBn: 'মস্তিষ্ক, স্নায়ুতন্ত্র, মাংসপেশীর শক্তি, স্ট্রেস হরমোন (কর্টিসোল) ও পুরুষ প্রজনন অঙ্গ।',
    primaryIndications: [
      { en: 'General physical debility, emaciation, chronic fatigue syndrome and muscular weakness', bn: 'শারীরিক দুর্বলতা, ওজন কমে যাওয়া, অতিরিক্ত ক্লান্তি ও মাংসপেশীর শক্তিহীনতা' },
      { en: 'Mental stress, chronic anxiety, nervous breakdown, brain fog and loss of memory', bn: 'মানসিক দুশ্চিন্তা, স্মরণশক্তি হ্রাস, মানসিক চাপ ও ব্রেন দুর্বলতা' },
      { en: 'Insomnia, disturbed sleep, waking unrefreshed with palpitations', bn: 'অনিদ্রা, রাতে ঘন ঘন ঘুম ভেঙে যাওয়া এবং সকালে ঘুম থেকে উঠলে ক্লান্তি না কাটা' },
      { en: 'Spermatorrhea, oligospermia, erectile dysfunction, loss of vitality in men', bn: 'পুরুষের শুক্রাণুর স্বল্পতা, ধাতুদৌর্বল্য ও যৌনশক্তি হ্রাস' }
    ],
    guidingKeynotes: [
      { en: 'Premier adaptogen in homoeopathic medicine; balances endocrine glands without sedation.', bn: 'হোমিওপ্যাথিক সঞ্জীবনী ভেষজ; শরীরের সমস্ত ক্লান্তি দূর করে প্রাণবন্ত শক্তি যোগায়।' }
    ],
    modalities: {
      worseEn: 'Overwork, sleeplessness, mental worry',
      worseBn: 'পরিশ্রম ও অনিদ্রায় বাড়ে',
      betterEn: 'Warm milk, calm music, restful environment',
      betterBn: 'উষ্ণ দুধে বা হালকা গরম পানিতে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15-20 drops in half cup of lukewarm milk or water twice daily (after lunch and at bedtime).',
    clinicalPearls: 'Safe long-term natural restorative for both men and women.',
    aliases: ['ashwagandha', 'withania somnifera', 'withania', 'অশ্বগন্ধা']
  },

  // 12. HYDRANGEA ARBORESCENS Q
  'hydrangea-arborescens-q': {
    id: 'hydrangea-arborescens-q',
    latinName: 'Hydrangea Arborescens Q',
    nameBn: 'হাইড্রেনজিয়া আর্বোরেসেন্স মাদার (পাথরি নাশক)',
    commonName: 'Seven-barks / Wild Hydrangea',
    familySource: 'Hydrangeaceae - Fresh root',
    category: 'mother_tincture',
    sphereOfActionEn: 'Kidneys, ureters, urinary bladder, prostate gland & uric acid deposition.',
    sphereOfActionBn: 'কিডনি, ইউরেটার (মূত্রনালী), মূত্রথলি এবং ইউরিক এসিডের পাথর ভাঙা।',
    primaryIndications: [
      { en: 'Renal calculus, gravel, sand in urine, deposits of uric acid and oxalates', bn: 'কিডনিতে পাথর, প্রস্রাবের সাথে সাদা বা লালচে বালুকণা যাওয়া ও ইউরিক এসিডের পাথর' },
      { en: 'Severe cutting pain in loins and ureters during passage of gravel', bn: 'কোমর থেকে তলপেট ও মূত্রনালীর দিকে তীব্র কেটে ফেলার মতো ব্যথা নামা' },
      { en: 'Enlarged prostate with severe aching in the perineum and difficulty starting urination', bn: 'প্রস্টেট গ্রন্থি বৃদ্ধি, তলপেটে ভারি যন্ত্রণা ও প্রস্রাব শুরু করতে বেগ পেতে হওয়া' }
    ],
    guidingKeynotes: [
      { en: 'Renowned as the "gravel root"; dissolves and flushes renal stones and crystals.', bn: 'কিডনির পাথর গলিয়ে নিরাপদে বের করে দেওয়ার জন্য সুপরিচিত প্রাকৃতিক ভেষজ।' }
    ],
    modalities: {
      worseEn: 'Motion, walking, dehydration',
      worseBn: 'হাঁটাহাঁটিতে ও পানি কম খেলে বাড়ে',
      betterEn: 'Lots of water, quiet rest',
      betterBn: 'প্রচুর পানি পানে উপশম'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15 drops in half glass of water 3-4 times daily.',
    clinicalPearls: 'Combine with Berberis Vulgaris Q and Ocimum Canum for renal calculus expulsion.',
    aliases: ['hydrangea', 'hydrangea arborescens', 'হাইড্রেনজিয়া']
  },

  // 13. PASSIFLORA INCARNATA Q
  'passiflora-incarnata-q': {
    id: 'passiflora-incarnata-q',
    latinName: 'Passiflora Incarnata Q',
    nameBn: 'প্যাসিফ্লোরা ইনকারনাটা মাদার (ঝুমকালতা)',
    commonName: 'Passion Flower',
    familySource: 'Passifloraceae - Fresh leaves and flowers',
    category: 'mother_tincture',
    sphereOfActionEn: 'Central nervous system, cerebral cortex, sleep centers & autonomic reflexes.',
    sphereOfActionBn: 'কেন্দ্রীয় স্নায়ুতন্ত্র, ঘুমের কেন্দ্র, মানসিক উত্তেজনা ও মাংসপেশীর খিঁচুনি।',
    primaryIndications: [
      { en: 'Natural non-addictive sedative for insomnia, sleeplessness from worry, exhaustion or alcoholism', bn: 'কোনো প্রকার অভ্যাস বা সাইড-ইফেক্ট ছাড়া প্রাকৃতিক ঘুমের ওষুধ; দুশ্চিন্তাজনিত অনিদ্রা' },
      { en: 'Nocturnal cough of elderly, asthmatic spasms preventing sleep', bn: 'বৃদ্ধদের রাতের বিরক্তিকর কাশি যার জন্য ঘুমানো যায় না' },
      { en: 'Infantile convulsions, dentition restlessness and muscular twitches', bn: 'দাঁত ওঠার সময় শিশুদের ছটফটানি, খিঁচুনি ও ঘুমে চমকে ওঠা' }
    ],
    guidingKeynotes: [
      { en: 'Produces quiet, restful natural sleep without narcotic hangover or morning dullness.', bn: 'সকালে কোনো মাথাভার ছাড়াই রাতে গভীর ও শান্ত ঘুম এনে দেয়।' }
    ],
    modalities: {
      worseEn: 'Night, mental excitement, caffeine',
      worseBn: 'রাতে ও উত্তেজনায় বাড়ে',
      betterEn: 'Quietness, dark bedroom',
      betterBn: 'নীরব অন্ধকার ঘরে কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '20 to 30 drops in quarter cup of water 30 minutes before bedtime.',
    clinicalPearls: 'The safest sleep solution for hypertensive patients and students during exams.',
    aliases: ['passiflora', 'passion flower', 'প্যাসিফ্লোরা']
  },

  // 14. SABAL SERRULATA Q
  'sabal-serrulata-q': {
    id: 'sabal-serrulata-q',
    latinName: 'Sabal Serrulata Q',
    nameBn: 'সাবাল সেরুলেটা মাদার (স পালমেটো)',
    commonName: 'Saw Palmetto',
    familySource: 'Palmaceae - Fresh ripe berries',
    category: 'mother_tincture',
    sphereOfActionEn: 'Prostate gland, bladder neck, male and female reproductive tissue, urinary flow.',
    sphereOfActionBn: 'প্রস্টেট গ্ল্যান্ড (BPH), মূত্রথলির মুখ, ফোঁটা ফোঁটা প্রস্রাব ও যৌন অঙ্গ।',
    primaryIndications: [
      { en: 'Benign Prostatic Hyperplasia (BPH): enlarged prostate, difficulty initiating urination', bn: 'প্রস্টেট বৃদ্ধি (BPH): প্রস্রাব শুরু করতে কষ্ট, ধীর ধারায় প্রস্রাব হওয়া' },
      { en: 'Frequent nighttime urination (nocturia) with dribbling of urine after voiding', bn: 'রাতে বারবার প্রস্রাবের জন্য ঘুম ভাঙা এবং প্রস্রাব শেষ করার পরও ফোঁটা ফোঁটা পড়া' },
      { en: 'Sexual neurosis, prostatic pain extending into abdomen and thighs', bn: 'প্রস্টেটে ভারি ব্যথা যা কুঁচকি ও উরু পর্যন্ত ছড়িয়ে যায়' }
    ],
    guidingKeynotes: [
      { en: 'The "homoeopathic catheter": relieves urinary retention caused by enlarged prostate.', bn: 'হোমিওপ্যাথিক ক্যাথেটার: প্রস্টেট বৃদ্ধির কারণে প্রস্রাব আটকে থাকার প্রধান প্রতিষেধক।' }
    ],
    modalities: {
      worseEn: 'Cold, damp, night',
      worseBn: 'ঠান্ডায় ও রাতে বাড়ে',
      betterEn: 'Warmth, gentle warmth',
      betterBn: 'উষ্ণতায় কমে'
    },
    recommendedPotency: 'Mother Tincture Q',
    dosageGuidelines: '15-20 drops in half glass of water twice or thrice daily.',
    clinicalPearls: 'Long-term administration shrinks glandular swelling and restores urinary stream.',
    aliases: ['sabal', 'sabal serrulata', 'saw palmetto', 'সাবাল']
  }
};
