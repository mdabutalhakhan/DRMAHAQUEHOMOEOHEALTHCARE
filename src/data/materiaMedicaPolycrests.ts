import { MateriaMedicaRemedy, RemedyIndexItem } from './materiaMedicaDatabase';

export const POLYCREST_MATERIA_MEDICA: Record<string, MateriaMedicaRemedy> = {
  // SULPHUR
  'sulphur': {
    id: 'sulphur',
    latinName: 'Sulphur',
    nameBn: 'সালফার',
    commonName: 'Sublimated Sulphur / Brimstone',
    familySource: 'Mineral Element - Pure Sulphur',
    category: 'dilution',
    sphereOfActionEn: 'Venous portal circulation, sympathetic nervous system, skin, serous membranes & lymphatic glands.',
    sphereOfActionBn: 'পোর্টাল রক্তসঞ্চালন, শিরা, ত্বক ও শ্লৈষ্মিক ঝিল্লি, লসিকা গ্রন্থি এবং সার্বিক মেটাবলিজম।',
    primaryIndications: [
      { en: 'Voluptuous skin itching with burning; scratching feels good but followed by burning', bn: 'ত্বকে তীব্র চুলকানি, চুলকাতে অদ্ভুত আরাম লাগে কিন্তু চুলকানোর পরেই তীব্র জ্বালা শুরু হয়' },
      { en: 'Burning sensations everywhere: soles of feet, top of head, eyes, anus', bn: 'শরীরের বিভিন্ন অংশে তীব্র উত্তাপ ও জ্বালা: বিশেষ করে পায়ের তালু, মাথার চাঁদি ও মলদ্বারে' },
      { en: 'Cannot bear to stand; standing is the most difficult and uncomfortable posture', bn: 'সোজা হয়ে দাঁড়িয়ে থাকতে পারে না; দাঁড়ানো তার জন্য সবচেয়ে কষ্টদায়ক ও যন্ত্রণাকর ভঙ্গি' },
      { en: 'All orifices of the body are intensely red (lips, eyelids, ears, anus)', bn: 'শরীরের সব বহিরঙ্গ ছিদ্র অস্বাভাবিক লাল টকটকে (ঠোঁট, চোখের পাতা, কান, পায়ুপথ)' },
      { en: '11:00 AM empty, faint, all-gone sinking sensation in the epigastrium', bn: 'সকাল ১১টায় পেটের ভেতর হাহাকার করা তীব্র ক্ষুধা ও নাড়িপুঁড়ি খালি হওয়ার মতো দুর্বলতা' }
    ],
    guidingKeynotes: [
      { en: 'King of anti-psoric remedies; clears suppressed eruptions and unblocks remedies.', bn: 'হোমিওপ্যাথিতে সোরিক দোষ নাশক সেরা মধ্যমণি; চাপা পড়া রোগ বা ওষুধের কাজ থেমে গেলে কার্যকর।' },
      { en: 'Aversion to washing and bathing; bathing aggravates skin and constitutional complaints.', bn: 'গোসল করতে চরম অনিহা ও ভয়; গোসল করলে চুলকানি ও অন্যান্য সমস্যা বাড়ে।' },
      { en: 'Untidy, ragged philosopher: intellectual yet dirty, stoop-shouldered walking.', bn: 'কুঁজো হয়ে হাঁটে, অগোছালো, নিজেকে বড় জ্ঞানী মনে করে কিন্তু পোশাক-আশাকে অপরিচ্ছন্ন।' }
    ],
    modalities: {
      worseEn: 'Warmth of bed, washing, standing, 11 AM, night, sweets, suppressed eruptions',
      worseBn: 'বিছানার গরমে, গোসল করলে, দাঁড়িয়ে থাকলে, সকাল ১১টায় ও মিষ্টি খেলে বাড়ে',
      betterEn: 'Dry warm weather, lying on right side, motion in fresh air',
      betterBn: 'শুকনো উষ্ণ আবহাওয়ায় ও ডান পাশে শুলে কিছুটা ভালো বোধ করে'
    },
    recommendedPotency: '30C, 200C, 1M',
    dosageGuidelines: 'Constitutional deep-acting anti-psoric: 4 pills in morning once weekly in 200C. Do not repeat too frequently.',
    complementary: 'Aloe, Psorinum, Nux Vomica, Aconite',
    antidotes: 'Camphora, Chamomilla, Pulsatilla',
    aliases: ['sulphur', 'sulph', 'সালফার']
  },

  // LACHESIS MUTUS
  'lachesis-mutus': {
    id: 'lachesis-mutus',
    latinName: 'Lachesis Mutus',
    nameBn: 'ল্যাকেসিস মিউটাস',
    commonName: 'Bushmaster Snake Venom (Surukuku)',
    familySource: 'Animal Kingdom - Snake Venom',
    category: 'dilution',
    sphereOfActionEn: 'Blood decomposition, circulation, autonomic nervous system, left-sided organs, throat & heart.',
    sphereOfActionBn: 'রক্তের বিশৃঙ্খলা, রক্ত জমাট বাঁধা, বাম দিকের অঙ্গসমূহ, গলা, জরায়ু ও হৃদযন্ত্র।',
    primaryIndications: [
      { en: 'Intolerance of tight clothing, neckbands, collars or waistbands', bn: 'গলায় বা কোমরে সামান্য টাইট কাপড়, কলার বা বেল্ট একেবারেই সহ্য করতে পারে না' },
      { en: 'Sleep into an aggravation: sleeps well but awakens choked, distressed and worse', bn: 'ঘুমালেই রোগ বৃদ্ধি: ঘুম থেকে উঠার পর নিজেকে তীব্র অসুস্থ ও দমবন্ধ বোধ করে' },
      { en: 'Left-sided affinity: symptoms begin on left side and spread to the right side', bn: 'বাম পাশে আক্রমণ বেশি: রোগ বাম দিক (বাম টনসিল, বাম ডিম্বাশয়) থেকে শুরু হয়ে ডানে যায়' },
      { en: 'Excessive loquacity: talks continuously with rapid jumping from topic to topic', bn: 'অস্বাভাবিক বাচালতা: অনর্গল কথা বলে এবং দ্রুত এক প্রসঙ্গ থেকে অন্য প্রসঙ্গে যায়' },
      { en: 'Dramatic relief of all symptoms as soon as a normal discharge begins (menses, sweating)', bn: 'যেকোনো স্বাভাবিক স্রাব (মাসিক বা ঘাম) শুরু হওয়া মাত্রই কষ্টের জাদুকরী উপশম' }
    ],
    guidingKeynotes: [
      { en: 'Suspicious, jealous, revengeful mental disposition.', bn: 'অহেতুক সন্দেহপ্রবণ, পরশ্রীকাতর ও ঈর্ষাপরায়ণ মানসিকতা।' },
      { en: 'Purplish, bluish, dusky congestion in throat, boils, and ulcers.', bn: 'আক্রান্ত স্থান (টনসিল, ফোঁড়া, আলসার) কালচে-নীল বা গাঢ় বেগুনি বর্ণ ধারণ করে।' },
      { en: 'Warm drinks choke and cause violent throat spasms; liquids swallowed with difficulty.', bn: 'গরম তরল গিলতে বেশি কষ্ট হয়, বরং শক্ত খাবার তুলনামূলক সহজে গিলতে পারে।' }
    ],
    modalities: {
      worseEn: 'After sleep, touch of neck, hot baths, warm weather, left side, pressure',
      worseBn: 'ঘুম থেকে উঠলে, গলায় স্পর্শ লাগলে, গরম আবহাওয়ায় ও বাম পাশে শুলে বাড়ে',
      betterEn: 'Onset of discharges (menses), cool open air, cold drinks, loosening clothes',
      betterBn: 'মাসিক বা যেকোনো স্রাব শুরু হলে, খোলা ঠান্ডা বাতাসে ও ঢিলেঢালা পোশাকে কমে'
    },
    recommendedPotency: '30C, 200C, 1M',
    dosageGuidelines: '4 pills 200C once weekly or 30C single dose. Avoid frequent repetitions.',
    complementary: 'Lycopodium, Hepar Sulph, Nitric Acid',
    antidotes: 'Camphora, Belladonna, Coffea',
    aliases: ['lachesis', 'lach', 'ল্যাকেসিস', 'bushmaster']
  },

  // PHOSPHORUS
  'phosphorus': {
    id: 'phosphorus',
    latinName: 'Phosphorus',
    nameBn: 'ফসফরাস',
    commonName: 'Yellow Phosphorus',
    familySource: 'Mineral Kingdom - Elementary Substance',
    category: 'dilution',
    sphereOfActionEn: 'Blood, nervous system, spinal cord, bones, respiratory tract, stomach, liver & retina.',
    sphereOfActionBn: 'রক্তনালী, ফুসফুস ও শ্বাসনালী, স্নায়ুতন্ত্র, পাকস্থলী, লিভার এবং রেটিনা।',
    primaryIndications: [
      { en: 'Intense craving for ice-cold water and ice cream; drinks are vomited as soon as warm in stomach', bn: 'বরফ ঠান্ডা পানি ও আইসক্রিমের তীব্র তৃষ্ণা; পানি পেটে গিয়ে গরম হওয়া মাত্রই বমি' },
      { en: 'Hemorrhagic diathesis: slight wounds bleed profusely; bright red blood flows easily', bn: 'রক্তক্ষরণ প্রবণতা: সামান্য কাটাছেঁড়া থেকে প্রচুর রক্ত ঝরে, রক্ত পাতলা ও উজ্জ্বল লাল' },
      { en: 'Burning sensations along the spine, between shoulder blades, and in palms of hands', bn: 'মেরুদণ্ডে, দুই কাঁধের মাঝখানে এবং হাতের তালুতে কয়লার মতো তীব্র জ্বালাপোড়া' },
      { en: 'Great dread of being alone, fears darkness, thunder and lightning storms', bn: 'একা থাকতে ভীষণ ভয়, অন্ধকার, ঝড়-বৃষ্টি ও মেঘের গর্জনে প্রচণ্ড আতঙ্কিত হয়ে পড়ে' },
      { en: 'Tall, slender, narrow-chested, delicate individuals with quick perceptions', bn: 'লম্বা, পাতলা-ছিপছিপে গড়ন, সংবেদনশীল মন ও চমৎকার শৈল্পিক ব্যক্তিত্ব' }
    ],
    guidingKeynotes: [
      { en: 'Destructive cellular degenerations, fatty liver, lung hepatization, retinal bleeding.', bn: 'টিস্যুর অবক্ষয়, ফ্যাটি লিভার, নিউমোনিয়ায় ফুসফুসে কফ জমা ও চোখের রক্তক্ষরণ প্রতিরোধ করে।' },
      { en: 'Hoarseness worse in the evening; cannot talk on account of pain in larynx.', bn: 'সন্ধ্যার দিকে গলার স্বরভঙ্গ ও ফ্যাঁসফেঁসে ভাব; স্বরযন্ত্রে ব্যথার কারণে কথা বলতে কষ্ট।' }
    ],
    modalities: {
      worseEn: 'Lying on left side, twilight, physical/mental exertion, thunderstorms, change of weather',
      worseBn: 'বাম পাশে শুলে, গোধূলিলগ্নে, ঝড়ের আগে ও ঠান্ডা বাতাস লাগলে বাড়ে',
      betterEn: 'Dark room, sleep, cold food/drinks, lying on right side, rubbing',
      betterBn: 'অন্ধকার ঘরে, ঘুমালে, বরফ ঠান্ডা খাবারে ও ডান পাশে শুলে উপশম'
    },
    recommendedPotency: '30C, 200C',
    dosageGuidelines: '4 pills dissolved in water twice weekly in 200C. In acute chest congestion, 30C 3 times daily.',
    complementary: 'Arsenicum Album, Allium Cepa, Lycopodium',
    antidotes: 'Nux Vomica, Camphora',
    aliases: ['phosphorus', 'phos', 'ফসফরাস']
  },

  // SEPIA OFFICINALIS
  'sepia-officinalis': {
    id: 'sepia-officinalis',
    latinName: 'Sepia Officinalis',
    nameBn: 'সিপিয়া',
    commonName: 'Inky Juice of Cuttlefish',
    familySource: 'Animal Kingdom - Cuttlefish Ink Sac',
    category: 'dilution',
    sphereOfActionEn: 'Venous circulation, pelvic viscera, female reproductive system, portal system & skin.',
    sphereOfActionBn: 'শ্রোণীদেশের অঙ্গসমূহ (জরায়ু ও ডিম্বাশয়), পোর্টাল শিরা রক্তসঞ্চালন ও ত্বক।',
    primaryIndications: [
      { en: 'Bearing down sensation in pelvic region: feels uterus would drop out, must cross legs', bn: 'তলপেটে বা জরায়ুতে নিচের দিকে তীব্র চাপ; মনে হয় সব খসে পড়বে, তাই দুই পা আড়াআড়ি করে চেপে বসে' },
      { en: 'Indifference to family, children, and loved ones; loses affection and joy', bn: 'নিজের সন্তান, পরিবার ও ভালোবাসার মানুষদের প্রতি উদাসীনতা ও ভালোবাসাহীন নিস্পৃহ মনোভাব' },
      { en: 'Yellowish-brown saddle across the bridge of nose and cheeks (chloasma / melasma)', bn: 'নাকের ডগা ও দুই গালে প্রজাপতির ডানার মতো কালচে-বাদামী ছোপ বা মেছতা' },
      { en: 'Aversion to food, nausea from the smell or sight of cooking food', bn: 'রান্নার গন্ধে বমি ভাব এবং খাবারের প্রতি তীব্র অরুচি (বিশেষ করে মাংস ও চর্বিতে)' },
      { en: 'Vigorous physical exercise (dancing, running, fast walking) brings dramatic relief', bn: 'তীব্র শারীরিক পরিশ্রম, নাচ বা দ্রুত হাঁটলে সমস্ত অবসাদ দূর হয়ে শরীর চাঙ্গা লাগে' }
    ],
    guidingKeynotes: [
      { en: 'The great female polychrest for prolapse, hormonal dysregulation and menopause.', bn: 'মহিলাদের জরায়ু স্থানচ্যুতি, হরমোনের গোলযোগ ও মেনোপজের সর্বশ্রেষ্ঠ মহৌষধ।' },
      { en: 'Weeping when asked about her sickness, yet irritable and easily offended.', bn: 'নিজের কষ্টের কথা বলতে গেলে চোখ দিয়ে পানি পড়ে, অথচ মেজাজ খিটখিটে থাকে।' }
    ],
    modalities: {
      worseEn: 'Morning & evening, damp cold, washing clothes, before menses, standing still',
      worseBn: 'সকালে ও সন্ধ্যায়, ঠান্ডা পানিতে কাপড় ধুলে, মাসিকের আগে ও স্থির দাঁড়ালে বাড়ে',
      betterEn: 'Violent exercise, warmth of bed, hot applications, crossing limbs, drawing knees up',
      betterBn: 'দ্রুত হাঁটলে, ভারী পরিশ্রমে, পা চেপে বসলে এবং গরম সেঁকে কমে'
    },
    recommendedPotency: '30C, 200C, 1M',
    dosageGuidelines: 'Constitutional depth: 4 pills in morning once weekly in 200C.',
    complementary: 'Natrum Muriaticum, Phosphorus, Guaiacum',
    antidotes: 'Antimonium Crudum, Camphora',
    aliases: ['sepia', 'সিপিয়া', 'সিপিয়া', 'cuttlefish']
  },

  // NATRUM MURIATICUM
  'natrum-muriaticum': {
    id: 'natrum-muriaticum',
    latinName: 'Natrum Muriaticum',
    nameBn: 'ন্যাট্রাম মিউরিয়েটিকাম (ন্যাট মিউর)',
    commonName: 'Common Salt (Sodium Chloride)',
    familySource: 'Mineral Kingdom - Purified Rock Salt',
    category: 'dilution',
    sphereOfActionEn: 'Cellular nutrition, blood, mucous membranes, glands, skin & nervous system.',
    sphereOfActionBn: 'রক্তকণিকা, কোষকলার পুষ্টি, শ্লৈষ্মিক ঝিল্লি, লালাগ্রন্থি, ত্বক ও স্নায়ুতন্ত্র।',
    primaryIndications: [
      { en: 'Ailments from long-standing silent grief, disappointed love, and suppressed emotion', bn: 'অতীতের গভীর দুঃখ, ভালোবাসায় ব্যর্থতা বা অপ্রকাশিত মানসিক কষ্টের দীর্ঘমেয়াদী কুফল' },
      { en: 'Consolation infuriates and worsens the patient; prefers solitary weeping', bn: 'সান্ত্বনা দিলে রাগ ও কষ্ট বাড়ে; একা একা নির্জনে বসে কাঁদতে পছন্দ করে' },
      { en: 'Throbbing, blinding headache from 10:00 AM to 3:00 PM, worse from sun glare', bn: 'সকাল ১০টা থেকে দুপুর ৩টা পর্যন্ত মাথায় হাতুড়ি পেটার মতো যন্ত্রণা, রোদের তাপে বাড়ে' },
      { en: 'Deep painful crack in the middle of lower lip; mapping of the tongue', bn: 'নিচের ঠোঁটের ঠিক মাঝখানে গভীর ফাটল ও জ্বালা; জিহ্বায় মানচিত্রের মতো দাগ' },
      { en: 'Craving for salt and salty food; emaciation most marked around the neck', bn: 'খাবারে আলাদা কাঁচা লবণ খাওয়ার তীব্র লোভ; শরীর শুকিয়ে যায়, বিশেষ করে গলার কাছে' }
    ],
    guidingKeynotes: [
      { en: 'Awkward, drops things from hands easily; difficulty urinating in presence of others.', bn: 'হাত থেকে জিনিসপত্র পিছলে পড়ে যায়; কাছে কেউ উপস্থিত থাকলে প্রস্রাব করতে পারে না।' },
      { en: 'Dry mouth and mucus membranes with glistening watery discharges like raw white of egg.', bn: 'মুখ ও ঠোঁট শুকনো কিন্তু স্রাব কাঁচা ডিমের লালার মতো পিচ্ছিল ও স্বচ্ছ।' }
    ],
    modalities: {
      worseEn: '10 AM to 11 AM, hot sun, heat of summer, seashore, consolation, mental work',
      worseBn: 'সকাল ১০-১১টায়, কড়া রোদে, গ্রীষ্মকালে, সমুদ্রের কাছে ও সান্ত্বনা দিলে বাড়ে',
      betterEn: 'Open cool air, cold baths, skipping meals, lying on right side, hard pressure',
      betterBn: 'খোলা বাতাসে, ঠান্ডা পানিতে গোসল করলে এবং শক্ত চাপে কমে'
    },
    recommendedPotency: '30C, 200C, 1M',
    dosageGuidelines: 'Deep constitutional: 4 pills in morning once weekly in 200C.',
    complementary: 'Sepia, Apis Mellifica, Ignatia',
    antidotes: 'Camphora, Arsenicum Album',
    aliases: ['nat mur', 'natrum mur', 'ন্যাট মিউর', 'ন্যাট্রাম মিউর']
  },

  // CAUSTICUM
  'causticum': {
    id: 'causticum',
    latinName: 'Causticum',
    nameBn: 'কস্টিকাম',
    commonName: "Hahnemann's Tinctura Acris Sine Kali",
    familySource: 'Chemical Compound (Slaked lime + Potassium bisulphate)',
    category: 'dilution',
    sphereOfActionEn: 'Motor nerves, central nervous system, vocal cords, urinary bladder sphincter & tendons.',
    sphereOfActionBn: 'মোটর স্নায়ু, কণ্ঠনালী ও স্বরযন্ত্র, মূত্রথলির স্ফিংকটার পেশী এবং টেন্ডন।',
    primaryIndications: [
      { en: 'Involuntary urination when coughing, sneezing, laughing or walking', bn: 'কাশি দিলে, হাঁচি দিলে, হাসলে বা হাঁটার সময় নিজের অজান্তেই ফোঁটা ফোঁটা প্রস্রাব ঝরে পড়া' },
      { en: 'Gradual paralysis of single muscle groups (facial palsy, vocal cords, bladder)', bn: 'শরীরের নির্দিষ্ট অংশের ধীরে ধীরে প্যারালাইসিস (মুখ বাঁকা হওয়া, স্বরভঙ্গ, প্রস্রাব আটকে থাকা)' },
      { en: 'Intense sympathy for others; cannot bear injustice or cruelty to people or animals', bn: 'অন্যের কষ্টের প্রতি অতিরিক্ত সহানুভূতি; মানুষের ওপর কোনো অবিচার দেখলে সহ্য করতে পারে না' },
      { en: 'Hoarseness with raw burning pain in larynx and trachea, worse in the morning', bn: 'ভোরে ঘুম ভাঙার পর তীব্র স্বরভঙ্গ ও গলায় কাঁচা ক্ষত থাকার মতো জ্বালা' },
      { en: 'Symptoms dramatically improve in damp, wet, rainy weather (unique keynote)', bn: 'স্যাঁতসেঁতে ভেজা বা বৃষ্টির দিনে সমস্ত শারীরিক কষ্ট আশ্চর্যজনকভাবে কমে যায়' }
    ],
    guidingKeynotes: [
      { en: 'The great paralytic and anti-sycotic remedy for chronic hoarseness and facial palsy.', bn: 'প্যারালাইসিস, মুখ বাঁকা হয়ে যাওয়া (বেলস্ পলসি) এবং দীর্ঘস্থায়ী স্বরভঙ্গের মহৌষধ।' },
      { en: 'Large jagged warts on face, eyelids, and fingertips.', bn: 'চোখের পাতায়, নাকের ডগায় ও আঙুলে শক্ত খসখসে রক্তপাতহীন আঁচিল।' }
    ],
    modalities: {
      worseEn: 'Dry cold clear winds, winter weather, morning, coffee, motion of carriage',
      worseBn: 'শুকনো ঠান্ডা বাতাসে, পরিষ্কার রৌদ্রোজ্জ্বল শীতে ও সকালে রোগ বাড়ে',
      betterEn: 'Damp wet rainy weather, warm air, warm bed, drinking cold water',
      betterBn: 'স্যাঁতসেঁতে ভেজা বৃষ্টিমুখর দিনে ও ঠান্ডা পানি পানে উপশম হয়'
    },
    recommendedPotency: '30C, 200C',
    dosageGuidelines: '4 pills twice weekly in 200C for chronic vocal palsy or urinary incontinence.',
    complementary: 'Carbo Veg, Petroselinum, Staphysagria',
    antidotes: 'Coffea, Nux Vomica, Colocynthis',
    aliases: ['causticum', 'caust', 'কস্টিকাম']
  },

  // HEPAR SULPHURIS CALCAREUM
  'hepar-sulphuris': {
    id: 'hepar-sulphuris',
    latinName: 'Hepar Sulphuris Calcareum',
    nameBn: 'হিপার সালফার (হিপার সালফ)',
    commonName: "Hahnemann's Calcium Sulphide",
    familySource: 'Chemical compound (Oyster shell lime + pure flowers of sulphur)',
    category: 'dilution',
    sphereOfActionEn: 'Lymphatic glands, skin, mucous membranes, throat & respiratory tract.',
    sphereOfActionBn: 'লসিকা গ্রন্থি, ত্বক, ফোঁড়া, গলা ও টনসিল এবং শ্বাসনালী।',
    primaryIndications: [
      { en: 'Extreme sensitiveness to cold drafts; uncovering a single hand causes violent cough or chill', bn: 'ঠান্ডা বাতাসের প্রতি চরম স্পর্শকাতরতা; লেপ থেকে হাত বের করলেই প্রচণ্ড কাশি বা কাঁপুনি' },
      { en: 'Sharp stitching pains like splinters or fish-bones in throat on swallowing', bn: 'ঢোক গিলার সময় গলায় সূঁচ বা মাছের কাঁটা বিঁধে থাকার মতো তীব্র তীক্ষ্ণ যন্ত্রণা' },
      { en: 'Abscesses, boils, and carbuncles exquisite to the slightest touch of cloth', bn: 'ফোঁড়া বা পুঁজপূর্ণ ক্ষত এতটাই ব্যথাতুর যে কাপড়ের মৃদু ছোঁয়াও সহ্য করতে পারে না' },
      { en: 'Suppuration: low potencies (3X/6X) promote pus formation; high potencies (200C/1M) abort it', bn: 'পুঁজোৎপত্তি: নিম্ন শক্তি পুঁজ পাকিয়ে ফাটায়, আর উচ্চ শক্তি পুঁজ জমতে না দিয়ে শুকিয়ে ফেলে' },
      { en: 'Violent, angry, impulsive temper; wishes to burn down houses or kill', bn: 'উগ্র ও হিংস্র মেজাজ; সামান্যতেই অন্ধ ক্রোধে ধ্বংসাত্মক কাণ্ড ঘটিয়ে ফেলতে চায়' }
    ],
    guidingKeynotes: [
      { en: 'Sour smell of the entire body; profuse sour sweat that gives no relief.', bn: 'সারা শরীর থেকে টক গন্ধ বের হয়; প্রচুর টক ঘাম হয় কিন্তু তাতে কোনো আরাম মেলে না।' }
    ],
    modalities: {
      worseEn: 'Cold dry wind, drafts, slightest touch, uncovering, winter',
      worseBn: 'শুকনো হিমেল বাতাসে, সামান্য স্পর্শে ও শরীর অনাবৃত করলে বাড়ে',
      betterEn: 'Warmth, bundling up head warmly, damp wet weather',
      betterBn: 'উষ্ণতায়, মাথা গরম কাপড়ে শক্ত করে জড়িয়ে রাখলে কমে'
    },
    recommendedPotency: '6C, 30C, 200C',
    dosageGuidelines: 'To abort an early boil: 200C single dose. To ripen and break open an old hard abscess: 6C every 3 hours.',
    complementary: 'Calendula, Silicea, Spongia',
    antidotes: 'Belladonna, Chamomilla',
    aliases: ['hepar sulph', 'hepar', 'হিপার সালফার', 'হিপার সালফ']
  },

  // MERCURIUS SOLUBILIS
  'mercurius-solubilis': {
    id: 'mercurius-solubilis',
    latinName: 'Mercurius Solubilis',
    nameBn: 'মারকিউরিয়াস সলুবিলিস (মারক সল)',
    commonName: "Hahnemann's Soluble Mercury",
    familySource: 'Mineral Kingdom - Hydrargyrum nitrate and ammonia precipitate',
    category: 'dilution',
    sphereOfActionEn: 'Lymphatic glands, oral cavity, salivary glands, mucous membranes, liver, bones & skin.',
    sphereOfActionBn: 'লালাগ্রন্থি, মুখগহ্বর, জিহ্বা, মাড়ি, টনসিল, অন্ত্র ও হাড়।',
    primaryIndications: [
      { en: 'Profuse salivation wetting pillow at night with metallic taste in mouth and foul breath', bn: 'রাতে ঘুমালে মুখ থেকে প্রচুর লালা ঝরে বালিশ ভিজে যাওয়া, মুখে ধাতব স্বাদ ও দুর্গন্ধ' },
      { en: 'Large, flabby, wet tongue taking the imprint of teeth along the edges', bn: 'জিহ্বা ভেজা, থলথলে ও পুরু, জিহ্বার দুই পাশে দাঁতের স্পষ্ট ছাপ বসে যাওয়া' },
      { en: 'Nightly aggravation of all symptoms; night sweat without giving any relief', bn: 'রাতের বেলা সমস্ত রোগ ও ব্যথার তীব্র বৃদ্ধি; রাতে প্রচুর ঘাম হলেও রোগী কোনো আরাম পায় না' },
      { en: 'Dysentery with never-get-done tenesmus; passes slime and blood with chilliness', bn: 'আমাশয়: পায়খানা করার পরও মনে হয় পেট পরিষ্কার হয়নি; পেটে মোচড় ও আম-রক্ত পড়া' },
      { en: 'Human thermometer: equally sensitive to both extreme heat and extreme cold', bn: 'মানব থার্মোমিটার: অতিরিক্ত ঠান্ডাও সহ্য করতে পারে না, আবার অতিরিক্ত গরমও সইতে পারে না' }
    ],
    guidingKeynotes: [
      { en: 'Destructive ulcerations with ragged edges, bleeding easily and discharging offensive pus.', bn: 'মুখে ঘা বা আলসার, সহজে রক্ত পড়ে এবং ক্ষত থেকে দুর্গন্ধযুক্ত পুঁজ বের হয়।' }
    ],
    modalities: {
      worseEn: 'Night, warmth of bed, damp cold weather, perspiring, lying on right side',
      worseBn: 'রাতে, বিছানার গরমে, স্যাঁতসেঁতে আবহাওয়ায় ও ডান পাশে শুলে বাড়ে',
      betterEn: 'Moderate even temperature, dry day',
      betterBn: 'না-ঠান্ডা না-গরম নাতিশীতোষ্ণ পরিবেশে ভালো থাকে'
    },
    recommendedPotency: '30C, 200C',
    dosageGuidelines: '4 pills 3 times daily in water during acute oral thrush or dysenteric colic.',
    complementary: 'Badiega, Belladonna, Silicea',
    antidotes: 'Hepar Sulph, Aurum, Nitric Acid',
    aliases: ['merc sol', 'mercurius', 'মারক সল', 'মারকিউরিয়াস']
  },

  // IGNATIA AMARA
  'ignatia-amara': {
    id: 'ignatia-amara',
    latinName: 'Ignatia Amara',
    nameBn: 'ইগ্নেশিয়া আমারা',
    commonName: "St. Ignatius Bean",
    familySource: 'Loganiaceae - Strychnos ignatii seeds',
    category: 'dilution',
    sphereOfActionEn: 'Cerebrospinal system, emotions, emotional nervous center & sensory coordination.',
    sphereOfActionBn: 'আবেগপ্রবণ স্নায়ুতন্ত্র, মানসিক ভারসাম্য, কন্ঠনালী ও পরিপাকতন্ত্র।',
    primaryIndications: [
      { en: 'Acute effects of sudden grief, emotional shock, bereavement, loss of loved one', bn: 'হঠাৎ শোক, প্রিয়জন হারানো বা ভালোবাসায় প্রতারিত হওয়ার তীব্র মানসিক আঘাত ও কান্না' },
      { en: 'Frequent involuntary deep sighing and sobbing; silent inward brooding', bn: 'ঘন ঘন অজান্তেই দীর্ঘশ্বাস ফেলা; নিজের ভেতরে শোক চেপে রেখে একা গুমরে কাঁদা' },
      { en: 'Globus hystericus: sensation of a lump or ball rising in the throat that cannot be swallowed', bn: 'গলায় যেন একটি দলা বা মাংসপিণ্ড আটকে আছে, যা ঢোক গিলে কিছুতেই নামানো যায় না' },
      { en: 'Contradictory and paradoxical symptoms: headache relieved by lying on it, sore throat relieved by swallowing solids', bn: 'বিপরীতধর্মী অদ্ভুত লক্ষণ: গলাব্যথা শক্ত খাবার গিললে কমে, মাথাব্যথা চেপে শুলে কমে' },
      { en: 'Rapidly alternating moods: hysterical laughter instantly turning into weeping', bn: 'মেজাজের দ্রুত পরিবর্তন: এই হাসছে আবার মুহূর্তের মধ্যেই কান্নায় ভেঙে পড়ছে' }
    ],
    guidingKeynotes: [
      { en: 'The greatest acute emotional emergency remedy in homoeopathic pharmacopeia.', bn: 'হোমিওপ্যাথির সর্বশ্রেষ্ঠ তাৎক্ষণিক শোক ও মানসিক শকের জরুরি উপশমকারী মহৌষধ।' },
      { en: 'Extreme intolerance of tobacco smoke; tobacco smoke produces violent headache and nausea.', bn: 'তামাক বা সিগারেটের ধোঁয়া একেবারেই সহ্য করতে পারে না; তীব্র মাথাব্যথা শুরু হয়।' }
    ],
    modalities: {
      worseEn: 'Grief, emotional excitement, tobacco smoke, coffee, touch, 11 AM',
      worseBn: 'শোক, সান্ত্বনা দিলে, মানসিক পরিশ্রমে ও ধূমপানের ধোঁয়ায় বাড়ে',
      betterEn: 'Changing position, swallowing solid food, lying on painful side, hard pressure',
      betterBn: 'শক্ত খাবার গিললে, অবস্থান পরিবর্তন করলে ও ব্যথার পাশে চেপে শুলে কমে'
    },
    recommendedPotency: '30C, 200C, 1M',
    dosageGuidelines: '4 pills 200C in water immediately after emotional trauma. Repeat once next day.',
    complementary: 'Natrum Muriaticum (chronic of Ignatia)',
    antidotes: 'Pulsatilla, Chamomilla, Zincum',
    aliases: ['ignatia', 'ign', 'ইগ্নেসিয়া', 'ইগ্নেশিয়া']
  },

  // GELSEMIUM SEMPERVIRENS
  'gelsemium': {
    id: 'gelsemium',
    latinName: 'Gelsemium Sempervirens',
    nameBn: 'জেলসিমিয়াম সেম্পারভাইরেন্স',
    commonName: 'Yellow Jasmine',
    familySource: 'Loganiaceae - Fresh root',
    category: 'dilution',
    sphereOfActionEn: 'Motor nervous system, muscular coordination, spinal cord, base of brain & ocular muscles.',
    sphereOfActionBn: 'মোটর স্নায়ুতন্ত্র, মাংসপেশীর শক্তি, চোখের পাতা ও স্নায়বিক অবসাদ।',
    primaryIndications: [
      { en: 'The great "D" trio: Dizziness, Drowsiness, and Dullness with muscular weakness', bn: 'জেলসিমিয়ামের ৩টি মূল লক্ষণ: মাথাঘোরা, প্রচণ্ড তন্দ্রাচ্ছন্ন ভাব এবং শারীরিক অবসন্নতা' },
      { en: 'Heavy, drooping eyelids (ptosis); can hardly keep eyes open during fever or headache', bn: 'চোখের পাতা অতিরিক্ত ভারী হয়ে ঝুলে পড়া; জোর করেও চোখ খুলে রাখতে পারে না' },
      { en: 'Trembling from anticipation, stage fright, fear of examination or public speech', bn: 'পরীক্ষার ভয়, স্টেজে কথা বলার ভয় বা জরুরি খবরের আশঙ্কায় হাত-পা কাঁপুনি ও ডায়রিয়া' },
      { en: 'Complete thirstlessness during high fever and influenza chills', bn: 'তীব্র ইনফ্লুয়েঞ্জা বা সর্দিকাশির জ্বরেও শরীরে কোনো পানির পিপাসা না থাকা' },
      { en: 'Headache beginning in the nape of neck, relieved by profuse clear urination', bn: 'ঘাড়ের পেছন থেকে শুরু হওয়া মাথাব্যথা, যা প্রচুর পরিমাণে স্বচ্ছ প্রস্রাব হলে সেরে যায়' }
    ],
    guidingKeynotes: [
      { en: 'Muscles refuse to obey the will; knees tremble when attempting to walk.', bn: 'পেশী মনের কথা শোনে না; উঠে দাঁড়াতে গেলে হাঁটু কেঁপে ওঠে ও শরীর অবশ লাগে।' },
      { en: 'Sensation as if heart would cease beating unless constantly kept in motion.', bn: 'অদ্ভুত অনুভূতি: মনে হয় নড়াচড়া না করলে হৃৎপিণ্ড হঠাৎ বন্ধ হয়ে যাবে।' }
    ],
    modalities: {
      worseEn: 'Damp weather, bad news, anticipation, smoking, 10 AM, heat of sun',
      worseBn: 'স্যাঁতসেঁতে আবহাওয়ায়, খারাপ সংবাদে, পরীক্ষার উত্তেজনায় ও সকালে বাড়ে',
      betterEn: 'Profuse urination, open fresh air, motion, stimulant drinks',
      betterBn: 'প্রচুর প্রস্রাব হলে, খোলা বাতাসে এবং মাথা উঁচু করে শুলে কমে'
    },
    recommendedPotency: '30C, 200C',
    dosageGuidelines: 'Acute flu/fever: 4 pills in water every 2 hours. Anticipatory anxiety: 200C 1 hour before event.',
    complementary: 'Sepia, Bryonia, Baptisia',
    antidotes: 'Coffea, Digitalis, China',
    aliases: ['gelsemium', 'gels', 'জেলসিমিয়াম', 'yellow jasmine']
  },

  // CARBO VEGETABILIS
  'carbo-vegetabilis': {
    id: 'carbo-vegetabilis',
    latinName: 'Carbo Vegetabilis',
    nameBn: 'কার্বো ভেজিটেবিলিস (কার্বোভেজ)',
    commonName: 'Vegetable Charcoal',
    familySource: 'Carbonaceous Mineral - Beechwood Charcoal',
    category: 'dilution',
    sphereOfActionEn: 'Venous circulation, capillaries, vital energy, gastrointestinal tract & respiratory system.',
    sphereOfActionBn: 'শিরা রক্তসঞ্চালন, জীবনীশক্তি পুনরুদ্ধার, পাকস্থলী ও ফুসফুস।',
    primaryIndications: [
      { en: 'The "corpse reviver": collapsed, icy-cold body yet demands to be fanned vigorously', bn: 'মৃত্যুমুখী রোগীর মহৌষধ: শরীর বরফের মতো ঠান্ডা, নাড়ি ক্ষীণ, তবুও জোরে বাতাস করতে বলে' },
      { en: 'Excessive upward abdominal flatulence; stomach distended to bursting point', bn: 'পেটের উপরের অংশে তীব্র গ্যাস আটকে পেট ঢোলের মতো ফোলা, ঢেকুর তুললে সাময়িক শান্তি' },
      { en: 'Cold breath, cold tongue, cold knees, yet cannot bear a warm close room', bn: 'মুখের নিঃশ্বাস ও জিহ্বা ঠান্ডা, তবুও বন্ধ ঘরের বাতাস সহ্য করতে পারে না' },
      { en: 'Oxygen hunger: desires windows and doors thrown wide open for fresh air', bn: 'অক্সিজেনের তীব্র ক্ষুধা: ঘরের সব দরজা-জানালা খুলে দিতে বলে যাতে বাতাস গায়ে লাগে' },
      { en: 'Never fully recovered since a previous severe exhausting illness (typhoid, malaria)', bn: 'পুরনো কোনো মারাত্মক রোগ (টাইফয়েড বা ম্যালেরিয়া) থেকে সেরে ওঠার পর থেকেই শরীর দুর্বল' }
    ],
    guidingKeynotes: [
      { en: 'Restores vital reactive power when the life force is rapidly sinking.', bn: 'যখন জীবনীশক্তি একদম নিভে আসছে, তখন শরীরে নতুন প্রাণের স্পন্দন জাগিয়ে তোলে।' }
    ],
    modalities: {
      worseEn: 'Rich fatty foods, milk, warm damp weather, lying down flat, walking uphill',
      worseBn: 'চর্বিযুক্ত খাবার, মাখন, দুধ খেলে, শুয়ে থাকলে ও গরমে বাড়ে',
      betterEn: 'Being fanned vigorously, belching up flatus, cool fresh air',
      betterBn: 'জোরে পাখা দিয়ে বাতাস করলে, বড় বড় ঢেকুর তুললে ও খোলা বাতাসে কমে'
    },
    recommendedPotency: '30C, 200C',
    dosageGuidelines: '4 pills every 30 minutes in acute collapse or respiratory crisis; 200C single dose in chronic dyspepsia.',
    complementary: 'Kali Carb, Drosera, Phosphorus',
    antidotes: 'Camphora, Arsenicum Album',
    aliases: ['carbo veg', 'carbo vegetabilis', 'কার্বোভেজ', 'কার্বো ভেজিটেবিলিস']
  }
};
