export interface OrganRemedyProfile {
  remedyId: string;
  name: string;
  nameBn: string;
  category: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent';
  specificActionEn: string;
  specificActionBn: string;
  keyDifferentiator: string;
  recommendedPotency: string;
}

export interface OrganFilterItem {
  id: string;
  icon: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  keywords: string[];
  remedyIds: string[];
  primaryRemedies: OrganRemedyProfile[];
}

export interface SymptomDifferentialRemedy {
  remedyId: string;
  name: string;
  nameBn: string;
  category: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent';
  keynoteEn: string;
  keynoteBn: string;
  modalityEn: string;
  modalityBn: string;
  differentiatingFeature: string;
  potency: string;
}

export interface SymptomFilterItem {
  id: string;
  icon: string;
  nameEn: string;
  nameBn: string;
  definitionEn: string;
  definitionBn: string;
  keywords: string[];
  remedyIds: string[];
  differentials: SymptomDifferentialRemedy[];
}

export const ORGAN_LIST: OrganFilterItem[] = [
  {
    id: 'heart',
    icon: '🫀',
    nameEn: 'Heart & Cardiovascular System',
    nameBn: 'হৃদযন্ত্র ও রক্তসঞ্চালনতন্ত্র',
    descriptionEn: 'Myocardium, coronary circulation, arterial tension, angina pectoris, palpitations, and cardiac arrhythmias.',
    descriptionBn: 'হৃদপেশি, করোনারি ধমনীর রক্তসঞ্চালন, রক্তচাপ, অ্যানজাইনা, বুক ধড়ফড় ও অনিয়মিত হৃদস্পন্দন।',
    keywords: ['heart', 'cardiac', 'pulse', 'angina', 'palpitation', 'blood pressure', 'hypertension', 'হৃদযন্ত্র', 'হার্ট', 'বুক ধড়ফড়', 'রক্তচাপ', 'coronary'],
    remedyIds: ['terminalia-arjuna-q', 'crataegus-q', 'cactus-grandiflorus', 'digitalis-purpurea', 'lachesis-mutus', 'aconitum-napellus'],
    primaryRemedies: [
      {
        remedyId: 'terminalia-arjuna-q',
        name: 'Terminalia Arjuna (Arjuna) Q',
        nameBn: 'অর্জুন মাদার টিংচার',
        category: 'mother_tincture',
        specificActionEn: 'Premier cardiac muscle tonic; strengthens myocardium, nourishes coronary vessels, and normalizes rhythm.',
        specificActionBn: 'হৃদপেশির শক্তিবর্ধক শ্রেষ্ঠ মহৌষধ; করোনারি ধমনীকে পুষ্ট করে এবং হৃদস্পন্দনকে স্বাভাবিক ছন্দে ফিরিয়ে আনে।',
        keyDifferentiator: 'Post-cardiac strain recovery, weakness after angina or infarct, palpitation from least exertion.',
        recommendedPotency: 'Q (Mother Tincture) 10-15 drops 3 times daily in water'
      },
      {
        remedyId: 'crataegus-q',
        name: 'Crataegus Oxyacantha Q',
        nameBn: 'ক্রেটেগাস মাদার টিংচার',
        category: 'mother_tincture',
        specificActionEn: 'Sovereign heart tonic; dissolves calcareous deposits in sclerotic arteries; reduces arterial resistance.',
        specificActionBn: 'ধমনীর শক্তভাব ও চর্বি জমাট দূর করে; রক্তচাপ কমায় এবং দুর্বল হৃদযন্ত্রের কার্যক্ষমতা বৃদ্ধি করে।',
        keyDifferentiator: 'High blood pressure with cardiac dyspnea, feeble irregular pulse, extreme coldness of extremities.',
        recommendedPotency: 'Q (Mother Tincture) 10-12 drops twice daily'
      },
      {
        remedyId: 'cactus-grandiflorus',
        name: 'Cactus Grandiflorus',
        nameBn: 'ক্যাকটাস গ্র্যান্ডিফ্লোরাস',
        category: 'dilution',
        specificActionEn: 'Pathognomonic constriction of heart muscle as if gripped by an iron band or tight wire.',
        specificActionBn: 'হৃদযন্ত্রে লোহার বেড়ি বা শক্ত তার দিয়ে আঁটোসাঁটো চেপে ধরার মতো অনুভূতি এবং তীব্র অ্যানজাইনা ব্যথা।',
        keyDifferentiator: 'Violent cardiac suffocation with shooting pain down left arm; worse lying on left side.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'digitalis-purpurea',
        name: 'Digitalis Purpurea',
        nameBn: 'ডিজিট্যালিস পারপিউরিয়া',
        category: 'dilution',
        specificActionEn: 'Abnormally slow, intermittent, or irregular pulse; sensation that heart will stop beating if moving.',
        specificActionBn: 'অস্বাভাবিক ধীরগতির নাড়ি; রোগী মনে করে সামান্য নড়াচড়া করলেই হৃদস্পন্দন চিরতরে বন্ধ হয়ে যাবে।',
        keyDifferentiator: 'Slow pulse with cardiac dropsy, blueness of lips and fingertips, fainting upon sitting up.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'lachesis-mutus',
        name: 'Lachesis Mutus',
        nameBn: 'ল্যাকেসিস মিউটাস',
        category: 'dilution',
        specificActionEn: 'Sudden nocturnal cardiac smothering; patient wakes from sleep gasping for air; intolerance to tight neckbands.',
        specificActionBn: 'ঘুমের মধ্যে হঠাৎ দমবন্ধ ভাব হয়ে জেগে ওঠা; গলার কাছে কোনো কাপড় বা বোতাম সহ্য করতে পারে না।',
        keyDifferentiator: 'Left-sided chest distress, purple cyanotic lips, palpitations worse after sleep and in hot weather.',
        recommendedPotency: '200C / 1M'
      },
      {
        remedyId: 'aconitum-napellus',
        name: 'Aconitum Napellus',
        nameBn: 'একোনাইট ন্যাপেলাস',
        category: 'dilution',
        specificActionEn: 'Acute violent cardiac storm; bounding pulse with agonizing restlessness and terror of impending death.',
        specificActionBn: 'হঠাৎ তীব্র বুক ধড়ফড়, দ্রুত ও লাফানো নাড়ি, চরম অস্থিরতা এবং আসন্ন মৃত্যুর স্পষ্ট আতঙ্ক।',
        keyDifferentiator: 'Sudden onset after cold dry wind; feverish skin; patient predicts the hour of death.',
        recommendedPotency: '30C / 200C'
      }
    ]
  },
  {
    id: 'liver',
    icon: '🩺',
    nameEn: 'Liver & Gallbladder',
    nameBn: 'যকৃৎ ও পিত্তথলি',
    descriptionEn: 'Hepatic parenchyma, bile metabolism, jaundice, fatty liver infiltration, biliary colic, and portal congestion.',
    descriptionBn: 'যকৃৎ কোষের কার্যকারিতা, পিত্ত নিঃসরণ, জন্ডিস, ফ্যাটি লিভার, পিত্তথলির শূলব্যথা ও পোর্টাল রক্তজমাট।',
    keywords: ['liver', 'hepatic', 'gallbladder', 'bile', 'jaundice', 'fatty liver', 'যকৃৎ', 'লিভার', 'পিত্তথলি', 'জন্ডিস', 'hepatitis'],
    remedyIds: ['chelidonium-majus', 'carduus-marianus-q', 'lycopodium-clavatum', 'nux-vomica', 'berberis-vulgaris', 'reckeweg-r7'],
    primaryRemedies: [
      {
        remedyId: 'chelidonium-majus',
        name: 'Chelidonium Majus',
        nameBn: 'চেলিডোনিয়াম মেজাস',
        category: 'dilution',
        specificActionEn: 'Fixed dull aching pain under the inferior angle of right scapula; marked jaundice with yellow-coated tongue.',
        specificActionBn: 'ডান কাঁধের হাড়ের (স্ক্যাপুলা) নিচের কোণায় স্থায়ী নিস্তেজ ব্যথা; হলদেটে চোখ-জিভ ও জন্ডিস।',
        keyDifferentiator: 'Craves boiling hot drinks or milk which temporarily relieve stomach and liver pain.',
        recommendedPotency: 'Q / 6C / 30C'
      },
      {
        remedyId: 'carduus-marianus-q',
        name: 'Carduus Marianus Q',
        nameBn: 'কার্ডুয়াস মেরিয়ানাস মাদার টিংচার',
        category: 'mother_tincture',
        specificActionEn: 'Marvelous organ remedy for portal stasis, enlarged swollen liver, fatty liver, and biliary vomiting.',
        specificActionBn: 'লিভারের রক্তজমাট ভাব, ফ্যাটি লিভার, যকৃৎ বৃদ্ধি এবং পিত্তবমি উপশমে এক নম্বর অর্গান রেমেডি।',
        keyDifferentiator: 'Left lobe of liver very sensitive; golden yellow urine; fullness and soreness in right hypochondrium.',
        recommendedPotency: 'Q (Mother Tincture) 10-15 drops before meals'
      },
      {
        remedyId: 'lycopodium-clavatum',
        name: 'Lycopodium Clavatum',
        nameBn: 'লাইকোপোডিয়াম ক্ল্যাভাটাম',
        category: 'dilution',
        specificActionEn: 'Chronic hepatic sluggishness; painful tension in right hypochondrium with severe 4-8 PM abdominal bloating.',
        specificActionBn: 'লিভারের দীর্ঘস্থায়ী অকার্যকারিতা; বিকেল ৪টা থেকে রাত ৮টার মধ্যে পেটের নিচের অংশে অতিরিক্ত গ্যাস ও ফাঁপা।',
        keyDifferentiator: 'Cannot bear tight waistband; fullness after a few mouthfuls; desires warm food and sweets.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'nux-vomica',
        name: 'Nux Vomica',
        nameBn: 'নাক্স ভমিকা',
        category: 'dilution',
        specificActionEn: 'Enlarged tender liver from sedentary lifestyle, alcohol, spices, purgatives; morning bilious distress.',
        specificActionBn: 'অলস জীবনযাপন, অতিরিক্ত কফি, মসলা বা অ্যালকোহল সেবনের ফলে লিভারের প্রদাহ ও সকালের বমিভাব।',
        keyDifferentiator: 'Frequent ineffectual urging for stool; irritable, impatient temperament; chilly.',
        recommendedPotency: '30C / 200C at bedtime'
      },
      {
        remedyId: 'berberis-vulgaris',
        name: 'Berberis Vulgaris Q',
        nameBn: 'বারবারিস ভালগারিস মাদার টিংচার',
        category: 'mother_tincture',
        specificActionEn: 'Radiating biliary colic shooting outward from liver and gallbladder; clay-colored stools.',
        specificActionBn: 'পিত্তথলি থেকে চারদিকে ছড়িয়ে পড়া তীব্র শূলব্যথা; কাদামাটির মতো ফ্যাকাশে মল ও গাঢ় প্রস্রাব।',
        keyDifferentiator: 'Combined renal and hepatic symptoms; bubbling sensation in liver region.',
        recommendedPotency: 'Q 10 drops in warm water'
      },
      {
        remedyId: 'reckeweg-r7',
        name: 'Dr. Reckeweg R7 (Hepagalen)',
        nameBn: 'ডাঃ রেকেওয়েগ আর৭ (হেপাগ্যালেন)',
        category: 'patent',
        specificActionEn: 'Comprehensive German biological formula for liver insufficiency, chronic hepatitis, and gallbladder irritation.',
        specificActionBn: 'জার্মান ফর্মুলেশন যা লিভারের কার্যক্ষমতা বাড়ায়, পিত্তথলির প্রদাহ রোধ করে এবং হজমশক্তি উন্নত করে।',
        keyDifferentiator: 'Synergistic combination of Carduus, Chelidonium, and Cholesterinum for organic liver complaints.',
        recommendedPotency: '10-15 drops in water 3 times daily'
      }
    ]
  },
  {
    id: 'stomach',
    icon: '🥣',
    nameEn: 'Stomach & Gastrointestinal',
    nameBn: 'পাকস্থলী ও পরিপাকতন্ত্র',
    descriptionEn: 'Gastric mucosa, acid secretion, GERD, nausea, dyspepsia, peptic ulcers, and functional bowel dynamics.',
    descriptionBn: 'পাকস্থলীর শ্লেষ্মাঝিল্লি, অ্যাসিড ক্ষরণ, গ্যাস্ট্রিক আলসার, বুকজ্বালা, বদহজম এবং পরিপাক গোলযোগ।',
    keywords: ['stomach', 'gastric', 'gerd', 'acid', 'acidity', 'dyspepsia', 'nausea', 'vomit', 'পেট', 'পাকস্থলী', 'বদহজম', 'গ্যাস্ট্রিক', 'অম্ল'],
    remedyIds: ['nux-vomica', 'lycopodium-clavatum', 'arsenicum-album', 'pulsatilla-nigricans', 'carbo-vegetabilis', 'bio-combination-25'],
    primaryRemedies: [
      {
        remedyId: 'nux-vomica',
        name: 'Nux Vomica',
        nameBn: 'নাক্স ভমিকা',
        category: 'dilution',
        specificActionEn: 'Weight and severe distress in stomach 1-2 hours after food; sour bitter eructations; heavy heartburn.',
        specificActionBn: 'খাবার খাওয়ার ১-২ ঘণ্টা পর পেটে পাথরের মতো ভারী চাপ ও অস্বস্তি; টক-তিক্ত ঢেকুর ও বুকজ্বালা।',
        keyDifferentiator: 'Aggravated by coffee, alcohol, smoking, spices; ineffectual urging for stool.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'lycopodium-clavatum',
        name: 'Lycopodium Clavatum',
        nameBn: 'লাইকোপোডিয়াম ক্ল্যাভাটাম',
        category: 'dilution',
        specificActionEn: 'Immediate uncomfortable fullness after eating very little; excessive fermentative flatulence.',
        specificActionBn: 'কয়েক লোকমা খাওয়ার পরই পেট অতিরিক্ত ভরে যাওয়ার অনুভূতি; পেটে ভুটভাট শব্দ ও প্রচুর গ্যাস।',
        keyDifferentiator: 'Lower abdomen severely distended; worse 4:00 PM to 8:00 PM; desires hot food and drinks.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'arsenicum-album',
        name: 'Arsenicum Album',
        nameBn: 'আর্সেনিকাম অ্যালবাম',
        category: 'dilution',
        specificActionEn: 'Intense burning pain in stomach as from hot coals; nausea and vomiting after cold drinks or food poisoning.',
        specificActionBn: 'পাকস্থলীতে জ্বলন্ত কয়লা রাখার মতো তীব্র জ্বালা; ঠান্ডা পানি পানের পরক্ষণেই বমি এবং চরম দুর্বলতা।',
        keyDifferentiator: 'Burning relieved only by warm drinks; thirsty for frequent small sips of warm water.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'pulsatilla-nigricans',
        name: 'Pulsatilla Nigricans',
        nameBn: 'পালসেটিলা নাইগ্রিক্যান্স',
        category: 'dilution',
        specificActionEn: 'Gastric distress after eating rich, fatty, greasy foods, pork, pastries, or ice cream.',
        specificActionBn: 'তেল-চর্বিযুক্ত গুরুপাক খাবার, পোলাও বা আইসক্রিম খাওয়ার পর পেট ফাঁপা ও অস্বস্তি।',
        keyDifferentiator: 'Total absence of thirst with coated white or yellow tongue; better in open cool fresh air.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'carbo-vegetabilis',
        name: 'Carbo Vegetabilis',
        nameBn: 'কার্বো ভেজিটেবিলিস',
        category: 'dilution',
        specificActionEn: 'Extreme upper abdominal meteorism; stomach feels ready to burst; belching brings temporary relief.',
        specificActionBn: 'পেটের উপরিভাগে অতিরিক্ত গ্যাস জমে ড্রামের মতো ফুলে থাকা; ঢেকুর তুললে সাময়িক শান্তি মেলে।',
        keyDifferentiator: 'Complete digestive collapse with cold breath and cold skin; air hunger—wants to be fanned.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'bio-combination-25',
        name: 'Bio-Combination 25',
        nameBn: 'বায়ো-কম্বিনেশন ২৫ (গ্যাস ও অম্বল)',
        category: 'biochemic',
        specificActionEn: 'Biochemic tissue salt combination for acute flatulence, hyperacidity, bilious vomiting, and heartburn.',
        specificActionBn: 'বায়োকেমিক লবণের মিশ্রণ যা গ্যাস্ট্রিকের অম্লতা দূর করে এবং পেটের ফাঁপাভাব কমায়।',
        keyDifferentiator: 'Safe daily tissue salt maintenance for chronic acid peptic disease.',
        recommendedPotency: '4 tablets dissolved in lukewarm water 3 times daily'
      }
    ]
  },
  {
    id: 'joints',
    icon: '🦴',
    nameEn: 'Joints, Bones & Musculoskeletal',
    nameBn: 'অস্থিসন্ধি, হাড় ও পেশীতন্ত্র',
    descriptionEn: 'Synovial membranes, cartilage, ligaments, rheumatoid arthritis, gout, stiffness, and joint effusion.',
    descriptionBn: 'অস্থিসন্ধির সাইনোভিয়াল পর্দা, কার্টিলেজ, লিগামেন্ট, বাতরোগ, গেঁটেবাত, শক্তভাব ও অস্থি প্রদাহ।',
    keywords: ['joint', 'bone', 'arthritis', 'rheumatism', 'gout', 'knee', 'stiffness', 'cartilage', 'অস্থিসন্ধি', 'হাড়', 'বাত', 'হাঁটু', 'গেঁটেবাত'],
    remedyIds: ['rhus-toxicodendron', 'bryonia-alba', 'arnica-montana', 'ruta-graveolens', 'ledum-palustre', 'reckeweg-r11'],
    primaryRemedies: [
      {
        remedyId: 'rhus-toxicodendron',
        name: 'Rhus Toxicodendron',
        nameBn: 'রাস টক্সিকোডেনড্রন',
        category: 'dilution',
        specificActionEn: 'Severe joint stiffness and tearing pain; worse on beginning to move and in cold damp weather.',
        specificActionBn: 'অস্থিসন্ধির তীব্র আড়ষ্টতা ও টান লাগা ব্যথা; বিশ্রাম শেষে নড়াচড়া শুরুর মুহূর্তে ব্যথা তীব্রতম।',
        keyDifferentiator: 'Great relief from continuous motion and warm dry applications; physically restless.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'bryonia-alba',
        name: 'Bryonia Alba',
        nameBn: 'ব্রায়োনিয়া অ্যালবা',
        category: 'dilution',
        specificActionEn: 'Hot, red, swollen joints; excruciating stitching pain provoked by the slightest physical movement.',
        specificActionBn: 'সন্ধি লাল, উত্তপ্ত ও ফোলা; সামান্যতম নড়াচড়াতেও সুচ ফোটার মতো তীব্র যন্ত্রণাদায়ক ব্যথা।',
        keyDifferentiator: 'Relief only from absolute rest and firm pressure or lying on the painful side.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'arnica-montana',
        name: 'Arnica Montana',
        nameBn: 'আর্নিকা মন্টানা',
        category: 'dilution',
        specificActionEn: 'Sore bruised lame feeling in joints and muscles after mechanical trauma, sprain, or overexertion.',
        specificActionBn: 'আঘাত, মোচড় বা অতিরিক্ত শারীরিক পরিশ্রমের পর লাঠিপেটা করার মতো ভোঁতা থেঁতলে যাওয়া ব্যথা।',
        keyDifferentiator: 'Bed feels too hard; claims nothing is wrong; fear of anyone approaching the painful joint.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'ruta-graveolens',
        name: 'Ruta Graveolens',
        nameBn: 'রুটা গ্রাভিওলেন্স',
        category: 'dilution',
        specificActionEn: 'Affinity for fibrous tissue, tendons, periosteum, particularly wrists, ankles, and knee ligaments.',
        specificActionBn: 'হাতের কব্জি, পায়ের গোড়ালি, টেন্ডন এবং হাড়ের আবরণী বা পেরিওস্টিয়ামের আঘাত ও ব্যথায় অদ্বিতীয়।',
        keyDifferentiator: 'Bruised soreness of bone; sprains from lifting; worse resting and cold wet weather.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'ledum-palustre',
        name: 'Ledum Palustre',
        nameBn: 'লিডাম পালস্টার',
        category: 'dilution',
        specificActionEn: 'Ascending rheumatic pains travelling from feet upwards; acute gouty inflammation of small joints.',
        specificActionBn: 'নিচ থেকে উপরের দিকে ছড়িয়ে পড়া বাতব্যথা; পা বা গোড়ালি থেকে শুরু হয়ে হাঁটু ও কোমরে ওঠে।',
        keyDifferentiator: 'Affected joint feels cold to touch yet patient insists on ice-cold water compresses for relief.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'reckeweg-r11',
        name: 'Dr. Reckeweg R11 (Lumbagin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর১১ (লাম্বাজিন)',
        category: 'patent',
        specificActionEn: 'German biological drops for acute articular rheumatism, lumbago, sciatica, and intercostal neuralgia.',
        specificActionBn: 'জার্মান ফর্মুলেশন যা কোমর ব্যথা, বাতের প্রদাহ, সায়াটিকা ও অস্থিসন্ধির আড়ষ্টতা দ্রুত নিরাময় করে।',
        keyDifferentiator: 'Formulated with Berberis, Calcium phosphoricum, and Rhus tox for deep musculoskeletal relief.',
        recommendedPotency: '10-15 drops in water 3-4 times daily'
      }
    ]
  },
  {
    id: 'head',
    icon: '🧠',
    nameEn: 'Head, Brain & Nervous System',
    nameBn: 'মাথা, মস্তিষ্ক ও স্নায়ুতন্ত্র',
    descriptionEn: 'Cerebrospinal axis, cranial nerves, migraines, congestive headaches, vertigo, and nervous exhaustion.',
    descriptionBn: 'মস্তিষ্ক, মাথার খুলির স্নায়ু, মাইগ্রেন, রক্তাধিক্যজনিত মাথাব্যথা, মাথাঘোরা ও স্নায়বিক ক্লান্তি।',
    keywords: ['head', 'brain', 'migraine', 'headache', 'vertigo', 'neuralgia', 'nervous', 'মাথা', 'মাথাব্যথা', 'মাইগ্রেন', 'মাথাঘোরা', 'মস্তিষ্ক'],
    remedyIds: ['belladonna', 'gelsemium-sempervirens', 'spigelia-anthelmia', 'sanguinaria-canadensis', 'kali-phosphoricum-6x', 'reckeweg-r16'],
    primaryRemedies: [
      {
        remedyId: 'belladonna',
        name: 'Belladonna',
        nameBn: 'বেলাডোনা',
        category: 'dilution',
        specificActionEn: 'Violent throbbing headache with visibly bounding carotid arteries; flushed hot scarlet face.',
        specificActionBn: 'মাথায় হাতুড়ি পেটার মতো তীব্র দপদপানি ব্যথা; ঘাড়ের রক্তনালী ফুলে ওঠা এবং মুখমণ্ডল লালবর্ণ।',
        keyDifferentiator: 'Extremely worse from light, noise, jar, lying flat; pupils dilated; sudden onset.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'gelsemium-sempervirens',
        name: 'Gelsemium Sempervirens',
        nameBn: 'জেলসেমিয়াম সেম্পারভাইরেন্স',
        category: 'dilution',
        specificActionEn: 'Dull, heavy, drowsy headache beginning in occiput and settling over forehead and eyes.',
        specificActionBn: 'মাথার পেছনের দিক থেকে শুরু হয়ে কপালে আসা ভারী ঝিমুনিযুক্ত মাথাব্যথা; চোখের পাতা ভারী হয়ে থাকা।',
        keyDifferentiator: 'Motor weakness, trembling, lack of thirst; relief after copious urination.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'spigelia-anthelmia',
        name: 'Spigelia Anthelmia',
        nameBn: 'স্পাইজেলিয়া অ্যান্থেলমিয়া',
        category: 'dilution',
        specificActionEn: 'Left-sided piercing needle-like headache and neuralgia centering over or behind left eye.',
        specificActionBn: 'বাম চোখের ভেতরে বা উপরে সূচ ফোটানোর মতো তীব্র মাইগ্রেন ও নিউরালজিয়া ব্যথা।',
        keyDifferentiator: 'Sun headache: begins at sunrise, reaches peak at noon, declines and disappears at sunset.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'sanguinaria-canadensis',
        name: 'Sanguinaria Canadensis',
        nameBn: 'স্যাঙ্গুইনারিয়া ক্যানাডেনসিস',
        category: 'dilution',
        specificActionEn: 'Right-sided sick headache rising from neck and occiput, settling above right eye.',
        specificActionBn: 'ডান দিকের মাইগ্রেন যা ঘাড় থেকে উঠে ডান চোখের ওপর বসে; পিত্তবমি হওয়া।',
        keyDifferentiator: 'Seventh-day periodic headache; better lying quiet in dark room and after sleep.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'kali-phosphoricum-6x',
        name: 'Kali Phosphoricum 6X',
        nameBn: 'ক্যালি ফসফোরিকাম ৬এক্স',
        category: 'biochemic',
        specificActionEn: 'Biochemic nerve nutrient for mental fatigue, brain fag, nervous tension headaches, and exam anxiety.',
        specificActionBn: 'স্নায়ুকোষের পুষ্টিকারক লবণ; অতিরিক্ত মানসিক চাপ, পড়াশোনা বা চিন্তায় মাথা ভার হওয়া ও স্নায়ুর দুর্বলতা কমায়।',
        keyDifferentiator: 'Exhausted nerve state; memory lapses; sleeplessness from worry.',
        recommendedPotency: '6X 4 tablets dissolved in warm water'
      },
      {
        remedyId: 'reckeweg-r16',
        name: 'Dr. Reckeweg R16 (Migranin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর১৬ (মাইগ্রানিন)',
        category: 'patent',
        specificActionEn: 'German biological formulation specifically targeting chronic migraine, cranial neuralgia, and tension headaches.',
        specificActionBn: 'জার্মান ড্রপ যা দীর্ঘদিনের ক্রনিক মাইগ্রেন, আধকপালি ও স্নায়বিক মাথাব্যথা স্থায়ীভাবে প্রশমিত করে।',
        keyDifferentiator: 'Synergistic action of Cimicifuga, Gelsemium, Iris, and Sanguinaria.',
        recommendedPotency: '10-15 drops in water 3 times daily'
      }
    ]
  },
  {
    id: 'chest',
    icon: '🫁',
    nameEn: 'Chest, Lungs & Respiratory',
    nameBn: 'বুক, ফুসফুস ও শ্বাসতন্ত্র',
    descriptionEn: 'Bronchial tree, lung parenchyma, pleural membranes, coughs, asthma, bronchitis, and dyspnea.',
    descriptionBn: 'শ্বাসনালী, ফুসফুসের কোষকলা, প্লুরা পর্দা, কাশি, হাঁপানি, ব্রঙ্কাইটিস ও শ্বাসকষ্ট।',
    keywords: ['chest', 'lung', 'respiratory', 'cough', 'asthma', 'bronchitis', 'pleurisy', 'বুক', 'ফুসফুস', 'কাশি', 'শ্বাসকষ্ট', 'কফ'],
    remedyIds: ['bryonia-alba', 'antimonium-tartaricum', 'drosera-rotundifolia', 'aconitum-napellus', 'arsenicum-album', 'reckeweg-r8'],
    primaryRemedies: [
      {
        remedyId: 'bryonia-alba',
        name: 'Bryonia Alba',
        nameBn: 'ব্রায়োনিয়া অ্যালবা',
        category: 'dilution',
        specificActionEn: 'Hard, dry, painful hacking cough; patient holds chest firmly with both hands while coughing.',
        specificActionBn: 'বুক চিরে যাওয়া শুষ্ক খুসখুসে কাশি; কাশির সময় যন্ত্রণায় দুই হাত দিয়ে বুক চেপে ধরে রাখতে হয়।',
        keyDifferentiator: 'Sharp stitching pain in chest; aggravated by any motion or deep breathing; great thirst.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'antimonium-tartaricum',
        name: 'Antimonium Tartaricum',
        nameBn: 'অ্যান্টিমোনিয়াম টার্টারিকাম',
        category: 'dilution',
        specificActionEn: 'Tremendous rattling of mucus in bronchi with inability to raise or expectorate; chest weakness.',
        specificActionBn: 'বুকে ঘড়ঘড় শব্দে প্রচুর শ্লেষ্মা বা কফ জমা থাকা সত্ত্বেও কাশির দুর্বলতায় কফ তুলতে না পারা।',
        keyDifferentiator: 'Drowsy, sweaty, pale patient; nausea with suffocative respiratory distress.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'drosera-rotundifolia',
        name: 'Drosera Rotundifolia',
        nameBn: 'ড্রসেরা রোটান্ডিফোলিয়া',
        category: 'dilution',
        specificActionEn: 'Paroxysmal spasmodic barking cough coming in violent rapid fits that threaten suffocation.',
        specificActionBn: 'দম আটকানো খিঁচুনিযুক্ত মারাত্মক কাশি; একটানা এত দ্রুত কাশির দমক আসে যে রোগী শ্বাস নিতে পারে না।',
        keyDifferentiator: 'Worse the moment head touches pillow at night; coughing spells end in retching or nosebleed.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'aconitum-napellus',
        name: 'Aconitum Napellus',
        nameBn: 'একোনাইট ন্যাপেলাস',
        category: 'dilution',
        specificActionEn: 'Sudden dry croupy cough following exposure to cold dry north winds; high fever and panic.',
        specificActionBn: 'শীতের শুকনো ঠান্ডা বাতাস লাগার পর হঠাৎ শুষ্ক তীব্র কাশি, গলা করকর করা ও দ্রুত জ্বর ওঠা।',
        keyDifferentiator: 'Loud barking croup with dry skin, rapid bounding pulse, and terror.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'arsenicum-album',
        name: 'Arsenicum Album',
        nameBn: 'আর্সেনিকাম অ্যালবাম',
        category: 'dilution',
        specificActionEn: 'Asthmatic wheezing and suffocative cough waking patient between 1:00 AM and 2:00 AM.',
        specificActionBn: 'রাত ১টা থেকে ২টার মধ্যে হাঁপানি ও দমবন্ধ কাশি; বিছানায় শুতে পারে না, উঠে বসতে বাধ্য হয়।',
        keyDifferentiator: 'Burning in chest relieved by warm drinks; extreme weakness, anxiety, and chilliness.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'reckeweg-r8',
        name: 'Dr. Reckeweg R8 (Jutussin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর৮ (জুটাসিন)',
        category: 'patent',
        specificActionEn: 'German biological drops for acute and chronic bronchitis, spasmodic cough, and respiratory catarrh.',
        specificActionBn: 'জার্মান ফর্মুলেশন যা শ্বাসনালীর শ্লেষ্মা পাতলা করে এবং শুষ্ক ও কফযুক্ত উভয় কাশির তীব্রতা কমায়।',
        keyDifferentiator: 'Synergy of Belladonna, Bryonia, Coccus cacti, Drosera, and Spongia.',
        recommendedPotency: '10-15 drops in lukewarm water 3-4 times daily'
      }
    ]
  },
  {
    id: 'kidney',
    icon: '💧',
    nameEn: 'Kidneys, Bladder & Urinary Tract',
    nameBn: 'বৃক্ক, মূত্রথলি ও মূত্রনালী',
    descriptionEn: 'Renal parenchyma, nephrolithiasis (kidney stones), ureters, bladder inflammation, and painful urination.',
    descriptionBn: 'বৃক্ক, কিডনির পাথর, মূত্রনালী, মূত্রথলির প্রদাহ ও প্রস্রাবে তীব্র জ্বালাপোড়া।',
    keywords: ['kidney', 'renal', 'urinary', 'bladder', 'urine', 'stone', 'calculus', 'cystitis', 'বৃক্ক', 'কিডনি', 'মূত্র', 'প্রস্রাব', 'পাথর'],
    remedyIds: ['berberis-vulgaris', 'cantharis-vesicatoria', 'sarsaparilla-officinalis', 'lycopodium-clavatum', 'reckeweg-r27'],
    primaryRemedies: [
      {
        remedyId: 'berberis-vulgaris',
        name: 'Berberis Vulgaris Q',
        nameBn: 'বারবারিস ভালগারিস মাদার টিংচার',
        category: 'mother_tincture',
        specificActionEn: 'Kidney stone colic with sharp darting pains radiating from renal region downwards into ureter, bladder, and thighs.',
        specificActionBn: 'কিডনিতে পাথরের তীব্র ব্যথা যা কোমর থেকে নিচের দিকে মূত্রথলি ও উরুতে ছড়িয়ে পড়ে; বুদবুদ ওঠার মতো অনুভূতি।',
        keyDifferentiator: 'Bubbling sensation in kidney region; red turbid urine with mealy sediment; worse jarring.',
        recommendedPotency: 'Q (Mother Tincture) 10-15 drops in half glass of warm water'
      },
      {
        remedyId: 'cantharis-vesicatoria',
        name: 'Cantharis Vesicatoria',
        nameBn: 'ক্যান্থারিস ভেসিকাটোরিয়া',
        category: 'dilution',
        specificActionEn: 'Intolerable constant urging to urinate with burning, scalding cutting pains like fire before, during, and after.',
        specificActionBn: 'প্রস্রাবে আগুনের মতো তীব্র অসহ্য জ্বালা; ফোঁটা ফোঁটা রক্তমিশ্রিত প্রস্রাব ও অবিরাম বেগ।',
        keyDifferentiator: 'Urine passes drop by drop with unbearable tenesmus; patient screams from scalding agony.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'sarsaparilla-officinalis',
        name: 'Sarsaparilla Officinalis',
        nameBn: 'সারসাপ্যারিলা অফিসিনালিস',
        category: 'dilution',
        specificActionEn: 'Excruciating severe pain at the conclusion of urination; sandy white or grey gravel in urine.',
        specificActionBn: 'প্রস্রাবের একদম শেষ মুহূর্তে অসহ্য তীব্র ব্যথা; প্রস্রাবের সাথে বালির মতো সাদা বা ধূসর তলানি নির্গমন।',
        keyDifferentiator: 'Can only urinate while standing; bladder distended but unable to void while sitting.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'lycopodium-clavatum',
        name: 'Lycopodium Clavatum',
        nameBn: 'লাইকোপোডিয়াম ক্ল্যাভাটাম',
        category: 'dilution',
        specificActionEn: 'Right-sided renal colic with red brick-dust sand in urine; severe backache relieved by passing urine.',
        specificActionBn: 'ডান দিকের কিডনিতে ব্যথা; প্রস্রাবের পাত্রে লাল ইটের গুঁড়োর মতো বালুকণা তলানি জমে থাকা।',
        keyDifferentiator: 'Urine flow delayed; worse late afternoon 4:00 PM to 8:00 PM.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'reckeweg-r27',
        name: 'Dr. Reckeweg R27 (Renocalcin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর২৭ (রেনোক্যালসিন)',
        category: 'patent',
        specificActionEn: 'Specialized German biological formula for renal calculi, kidney gravel, and uric acid urinary inflammation.',
        specificActionBn: 'জার্মান ড্রপ যা কিডনির ছোট পাথর অপসারণে সাহায্য করে এবং মূত্রনালীর প্রদাহ দূর করে।',
        keyDifferentiator: 'Synergy of Acidum nitricum, Berberis, Lycopodium, and Sarsaparilla.',
        recommendedPotency: '10-15 drops in water 3-4 times daily'
      }
    ]
  },
  {
    id: 'skin',
    icon: '🩹',
    nameEn: 'Skin & Cutaneous Tissues',
    nameBn: 'ত্বক, চর্মরোগ ও এলার্জি',
    descriptionEn: 'Dermis, epidermis, eczema, dermatitis, urticaria, psoriasis, boils, warts, and cutaneous eruptions.',
    descriptionBn: 'ত্বক, ডার্মাটাইটিস, একজিমা, চুলকানি, আমবাত, সোরিয়াসিস, আঁচিল ও ফোড়া।',
    keywords: ['skin', 'dermatitis', 'eczema', 'itching', 'psoriasis', 'urticaria', 'wart', 'boil', 'ত্বক', 'চামড়া', 'একজিমা', 'চুলকানি', 'আঁচিল'],
    remedyIds: ['sulphur', 'graphites', 'thuja-occidentalis', 'arsenicum-album', 'silicea', 'reckeweg-r23'],
    primaryRemedies: [
      {
        remedyId: 'sulphur',
        name: 'Sulphur',
        nameBn: 'সালফার',
        category: 'dilution',
        specificActionEn: 'Voluptuous itching of skin; intense burning after scratching; dry, harsh, dirty-looking skin.',
        specificActionBn: 'ত্বকে তীব্র সুখানুভূতির চুলকানি; চুলকানোর পর আগুনের মতো জ্বালাপোড়া; রুক্ষ ও মলিন ত্বক।',
        keyDifferentiator: 'Aggravated by washing with water and warmth of bed; aversion to bathing.',
        recommendedPotency: '30C / 200C / 1M'
      },
      {
        remedyId: 'graphites',
        name: 'Graphites',
        nameBn: 'গ্র্যাফাইটিস',
        category: 'dilution',
        specificActionEn: 'Moist eczema discharging thick, sticky, glutinous honey-like moisture; fissures and cracks in skin.',
        specificActionBn: 'একজিমা থেকে মধুর মতো আঠালো তরল নিঃসৃত হওয়া; কানের পেছনে ও কুঁচকিতে চামড়া ফেটে যাওয়া।',
        keyDifferentiator: 'Skin eruptions behind ears, bend of elbows, and groins; thick brittle deformed nails.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'thuja-occidentalis',
        name: 'Thuja Occidentalis',
        nameBn: 'থুজা অক্সিডেন্টালিস',
        category: 'dilution',
        specificActionEn: 'Specific constitutional remedy for warts, condylomata, skin tags, fleshy excrescences, and polypi.',
        specificActionBn: 'শরীরের যেকোনো স্থানের আঁচিল, পলিপ ও চামড়ার অতিরিক্ত মাংসল বৃদ্ধি দূর করতে প্রধান ঔষধ।',
        keyDifferentiator: 'Greasy oily skin; cauliflower-like warts that bleed easily; history of vaccination reactions.',
        recommendedPotency: '200C / 1M'
      },
      {
        remedyId: 'arsenicum-album',
        name: 'Arsenicum Album',
        nameBn: 'আর্সেনিকাম অ্যালবাম',
        category: 'dilution',
        specificActionEn: 'Dry, scaly, intensely burning eruptions with restlessness; itching worse from cold air and cold washing.',
        specificActionBn: 'শুকনো আঁশটে তীব্র জ্বালাযুক্ত চর্মরোগ; ঠান্ডা পানি লাগালে মারাত্মকভাবে বৃদ্ধি পায়।',
        keyDifferentiator: 'Burning itching relieved dramatically by hot fomentation or warm dry heat.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'silicea',
        name: 'Silicea 6X',
        nameBn: 'সিলিসিয়া ৬এক্স',
        category: 'biochemic',
        specificActionEn: 'Tissue salt that ripens and expels abscesses, boils, foreign bodies (splinters), and ingrown nails.',
        specificActionBn: 'শরীরে পুঁজ তৈরি ও তা দ্রুত বের করে দেওয়া; বারবার ফোড়া হওয়া ও নখকুনির ব্যথায় অব্যর্থ।',
        keyDifferentiator: 'Unhealthy skin that festers from every small scratch; chilly patient who sweats profusely on head and feet.',
        recommendedPotency: '6X 4 tablets twice daily'
      },
      {
        remedyId: 'reckeweg-r23',
        name: 'Dr. Reckeweg R23 (Nosothesin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর২৩ (নোসোথেসিন)',
        category: 'patent',
        specificActionEn: 'German biological drops for chronic eczema, acne vulgaris, and dermal allergic reactivity.',
        specificActionBn: 'জার্মান ফর্মুলেশন যা দীর্ঘস্থায়ী একজিমা, ব্রণ ও ত্বকের এলার্জি চিকিৎসায় অত্যন্ত কার্যকর।',
        keyDifferentiator: 'Synergistic constitutional dermal detoxifier.',
        recommendedPotency: '10-15 drops in water 3 times daily'
      }
    ]
  },
  {
    id: 'throat',
    icon: '🗣️',
    nameEn: 'Throat, Tonsils & Larynx',
    nameBn: 'গলা, টনসিল ও স্বরযন্ত্র',
    descriptionEn: 'Pharyngeal mucosa, tonsils, uvula, larynx, hoarseness, dysphagia, and acute tonsillitis.',
    descriptionBn: 'গলবিল, টনসিল, আলজিভ, স্বরভঙ্গ, গিলতে কষ্ট এবং তীব্র টনসিলাইটিস।',
    keywords: ['throat', 'tonsil', 'larynx', 'pharynx', 'hoarseness', 'tonsillitis', 'swallow', 'গলা', 'টনসিল', 'গলাব্যথা', 'স্বরভঙ্গ'],
    remedyIds: ['belladonna', 'mercurius-solubilis', 'phytolacca-decandra', 'hepar-sulphuris', 'reckeweg-r1'],
    primaryRemedies: [
      {
        remedyId: 'belladonna',
        name: 'Belladonna',
        nameBn: 'বেলাডোনা',
        category: 'dilution',
        specificActionEn: 'Bright red, inflamed, swollen tonsils and throat; dry glazed mucosa; excruciating pain when swallowing liquids.',
        specificActionBn: 'টকটকে লাল ও ফোলা টনসিল; গলা একদম শুকনো ও চকচকে; তরল কিছু গিলতে গেলে প্রচণ্ড ব্যথা।',
        keyDifferentiator: 'Rapid onset with high fever, hot crimson face, and throbbing pain; worse turning head.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'mercurius-solubilis',
        name: 'Mercurius Solubilis',
        nameBn: 'মারকিউরিয়াস সলিউবিলিস',
        category: 'dilution',
        specificActionEn: 'Ulcerated tonsils with dirty grey-white patches; profuse foul-smelling salivation that wets pillow.',
        specificActionBn: 'টনসিলে ক্ষত ও সাদা পর্দা; মুখে অতিরিক্ত দুর্গন্ধযুক্ত লালা যা ঘুমের মধ্যে বালিশ ভিজিয়ে দেয়।',
        keyDifferentiator: 'Flabby tongue showing clear teeth indentations on sides; worse at night and from bed warmth.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'phytolacca-decandra',
        name: 'Phytolacca Decandra',
        nameBn: 'ফাইটোলাক্কা ডিক্যান্ড্রা',
        category: 'dilution',
        specificActionEn: 'Dark red or bluish-red throat; excruciating shooting pain radiating directly into both ears on swallowing.',
        specificActionBn: 'গাঢ় লাল বা বেগুনি গলা; ঢোক গিলার সাথে সাথে ব্যথা সরাসরি দুই কানের ভেতরে তীব্রভাবে তীরবেগে ছুটে যায়।',
        keyDifferentiator: 'Throat feels like a burning ball of hot coal; cannot drink hot liquids; aching all over.',
        recommendedPotency: '30C'
      },
      {
        remedyId: 'hepar-sulphuris',
        name: 'Hepar Sulphuris',
        nameBn: 'হেপার সালফার',
        category: 'dilution',
        specificActionEn: 'Sensation of a sharp fishbone or splinter sticking in throat; throbbing pain radiating to ears.',
        specificActionBn: 'গলায় মাছের কাঁটা বা ধারালো কাঠের খোঁচা বিঁধে থাকার অনুভূতি; কানের দিকে ব্যথা ছড়িয়ে পড়া।',
        keyDifferentiator: 'Hypersensitive to slightest cold draft or uncovering; relieved by warm wraps.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'reckeweg-r1',
        name: 'Dr. Reckeweg R1 (Anginacid)',
        nameBn: 'ডাঃ রেকেওয়েগ আর১ (অ্যাঞ্জিনাসিড)',
        category: 'patent',
        specificActionEn: 'Universal German biological antibiotic complex for acute tonsillitis, pharyngitis, and swollen glands.',
        specificActionBn: 'জার্মান ফর্মুলেশন যা তীব্র গলাব্যথা, টনসিলাইটিস ও গলার লসিকা গ্রন্থির ফোলা দ্রুত কমায়।',
        keyDifferentiator: 'Contains Apis, Belladonna, Calcarea iodata, Hepar sulph, Kalium bichromicum, and Mercurius.',
        recommendedPotency: '10-15 drops in water 3-4 times daily'
      }
    ]
  },
  {
    id: 'spine',
    icon: '🧍',
    nameEn: 'Spine, Lumbar & Sciatic Nerve',
    nameBn: 'মেরুদণ্ড, কোমর ও সায়াটিকা স্নায়ু',
    descriptionEn: 'Vertebral column, lumbar discs, lumbago, sacral strain, sciatica, and spinal neuralgia.',
    descriptionBn: 'মেরুদণ্ড, কোমরের ডিস্ক, লাম্বাগো, কোমর ব্যথা, সায়াটিকা স্নায়ুশূল ও স্পন্ডিলোসিস।',
    keywords: ['spine', 'back', 'lumbar', 'sciatica', 'backache', 'lumbago', 'vertebra', 'মেরুদণ্ড', 'কোমর', 'পিঠ', 'সায়াটিকা', 'কোমরব্যথা'],
    remedyIds: ['rhus-toxicodendron', 'magnesia-phosphorica', 'colocynthis', 'kali-carbonicum', 'reckeweg-r71'],
    primaryRemedies: [
      {
        remedyId: 'rhus-toxicodendron',
        name: 'Rhus Toxicodendron',
        nameBn: 'রাস টক্সিকোডেনড্রন',
        category: 'dilution',
        specificActionEn: 'Lumbago and sciatica from lifting, over-straining, or cold damp exposure; stiff back on rising from seat.',
        specificActionBn: 'ভারী জিনিস তোলা বা ঠান্ডা লাগার পর কোমর ও সায়াটিকা ব্যথা; বসা থেকে ওঠার সময় কোমর সোজা করতে কষ্ট।',
        keyDifferentiator: 'Worse initial movement; relieved by continuous walking and firm hard pressure on lumbar area.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'magnesia-phosphorica',
        name: 'Magnesia Phosphorica 6X',
        nameBn: 'ম্যাগনেসিয়া ফসফোরিকা ৬এক্স',
        category: 'biochemic',
        specificActionEn: 'Lightning-like, shooting cramping neuralgic pains along sciatic nerve tract and lumbar spine.',
        specificActionBn: 'সায়াটিকা স্নায়ু ধরে বিদ্যুৎ চমকানোর মতো তীব্র খিঁচুনিযুক্ত ব্যথা; গরম সেঁক দিলে যাদুকরী উপশম।',
        keyDifferentiator: 'Remarkable relief from hot water bottles, warm fomentation, and firm hard pressure.',
        recommendedPotency: '6X 4 tablets dissolved in boiling hot water'
      },
      {
        remedyId: 'colocynthis',
        name: 'Colocynthis',
        nameBn: 'কলোসিন্থিস',
        category: 'dilution',
        specificActionEn: 'Sciatic pain down right leg; sharp cramping shooting pains that cause patient to cry out.',
        specificActionBn: 'ডান পায়ের সায়াটিকা স্নায়ুর তীব্র খিঁচুনিযুক্ত ব্যথা; রোগী ব্যথায় কুঁকড়ে দুই ভাঁজ হয়ে যায়।',
        keyDifferentiator: 'Better bending double and pressing hard against the hip; worse light touch or stretching leg.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'kali-carbonicum',
        name: 'Kali Carbonicum',
        nameBn: 'ক্যালি কার্বনিকাম',
        category: 'dilution',
        specificActionEn: 'Severe weakness and sharp stitching pains in small of back; feels as if back would give way completely.',
        specificActionBn: 'কোমরের নিচের অংশে তীব্র দুর্বলতা ও সূচ ফোটানো ব্যথা; মনে হয় কোমর ভেঙে যাবে।',
        keyDifferentiator: 'Worse at 3:00 AM; cannot lie down; better sitting up with knees pulled up.',
        recommendedPotency: '30C / 200C'
      },
      {
        remedyId: 'reckeweg-r71',
        name: 'Dr. Reckeweg R71 (Ischialgin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর৭১ (ইশ্চিয়ালজিন)',
        category: 'patent',
        specificActionEn: 'Specialized German biological drops for acute and chronic sciatica, spinal stiffness, and femoral neuralgia.',
        specificActionBn: 'জার্মান ফর্মুলেশন যা সায়াটিকার তীব্র স্নায়ুশূল, পায়ের অসাড়তা ও মেরুদণ্ডের আড়ষ্টতা দ্রুত সারিয়ে তোলে।',
        keyDifferentiator: 'Synergy of Aconitum, Arsenicum, Colocynthis, Gnaphalium, and Magnesia phosphorica.',
        recommendedPotency: '10-15 drops in water 3-4 times daily'
      }
    ]
  }
];

export const SYMPTOM_LIST: SymptomFilterItem[] = [
  {
    id: 'trauma',
    icon: '🩹',
    nameEn: 'Sprain, Injury & Trauma',
    nameBn: 'আঘাত, মচকানো ও ক্ষত',
    definitionEn: 'Mechanical trauma, joint sprains, blunt contusions, muscle tears, ligament strain, and extravasation of blood.',
    definitionBn: 'পড়ে গিয়ে ভোঁতা আঘাত, গিঁট মচকে যাওয়া, লিগামেন্ট বা টেন্ডন ছিঁড়ে যাওয়া, হাড়ের উপরিভাগের চোট ও রক্ত জমাট বাঁধা।',
    keywords: ['trauma', 'sprain', 'injury', 'contusion', 'bruise', 'blunt', 'fall', 'hematoma', 'আঘাত', 'মচকে', 'থেঁতলে', 'ক্ষত'],
    remedyIds: ['arnica-montana', 'rhus-toxicodendron', 'ruta-graveolens', 'bellis-perennis', 'symphytum'],
    differentials: [
      {
        remedyId: 'arnica-montana',
        name: 'Arnica Montana',
        nameBn: 'আর্নিকা মন্টানা',
        category: 'dilution',
        keynoteEn: 'Immediate trauma, sore bruised feeling as if beaten, extravasation of blood (hematoma/black-and-blue marks).',
        keynoteBn: 'আঘাত পাওয়ার সাথে সাথে লাঠিপেটা করার মতো ভোঁতা থেঁতলে যাওয়া অনুভূতি ও চামড়ার নিচে রক্ত জমাট বাঁধা।',
        modalityEn: 'Worse: least touch, movement. Better: lying with head low, absolute rest.',
        modalityBn: 'সামান্য ছোঁয়ায় ও নড়াচড়ায় বাড়ে; মাথা নিচু করে শুয়ে থাকলে স্বস্তি মেলে।',
        differentiatingFeature: 'Bed feels too hard; asserts "there is nothing the matter with me" despite severe injury.',
        potency: '200C / 1M'
      },
      {
        remedyId: 'rhus-toxicodendron',
        name: 'Rhus Toxicodendron',
        nameBn: 'রাস টক্সিকোডেনড্রন',
        category: 'dilution',
        keynoteEn: 'Sprain from lifting, over-reaching, or wrestling; fibrous tissues and tendons affected.',
        keynoteBn: 'ভারী জিনিস তুলতে গিয়ে বা শরীর মোচড় খেয়ে মচকে যাওয়া; পেশী ও টেন্ডনের টান।',
        modalityEn: 'Worse: first motion, rest, cold damp. Better: continuous motion, warm dry heat.',
        modalityBn: 'বিশ্রাম শেষে নড়াচড়ার শুরুতে তীব্র ব্যথা, কিন্তু ক্রমাগত হাঁটলে বা গরম সেঁক দিলে স্বস্তি।',
        differentiatingFeature: 'Classic "Restless" pacing modality—patient cannot sit still.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'ruta-graveolens',
        name: 'Ruta Graveolens',
        nameBn: 'রুটা গ্রাভিওলেন্স',
        category: 'dilution',
        keynoteEn: 'Sprain of fibrous cords, ligaments, and periosteum, particularly wrists, ankles, and Achilles tendon.',
        keynoteBn: 'হাতের কব্জি, পায়ের গোড়ালি ও টেন্ডনের তীব্র মচকানো ও হাড়ের উপরিভাগের ক্ষতযুক্ত ব্যথা।',
        modalityEn: 'Worse: cold, damp, sitting, resting. Better: motion, gentle warmth.',
        modalityBn: 'ঠান্ডা ও স্যাঁতসেঁতে অবস্থায় বাড়ে; মৃদু নড়াচড়া ও গরমে কিছুটা কমে।',
        differentiatingFeature: 'Specific affinity for wrist and ankle sprains with bruised bone pain.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'bellis-perennis',
        name: 'Bellis Perennis',
        nameBn: 'বেলিস পেরেনিস',
        category: 'dilution',
        keynoteEn: 'Deep muscle and pelvic trauma; bruised soreness after railway spine or abdominal contusions.',
        keynoteBn: 'গভীর মাংসপেশী, তলপেট বা পেলভিসের গভীর আঘাত ও থেঁতলে যাওয়া ব্যথা।',
        modalityEn: 'Worse: cold bath, exposure to cold when overheated. Better: continued gentle motion.',
        modalityBn: 'উত্তপ্ত শরীরে ঠান্ডা পানি লাগালে বাড়ে; মৃদু নড়াচড়ায় উপশম।',
        differentiatingFeature: '"Gardeners and laborers Arnica" for deeper muscular and pelvic structures.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'symphytum',
        name: 'Symphytum Officinale',
        nameBn: 'সিমফাইটাম অফিসিনেল',
        category: 'dilution',
        keynoteEn: 'Blunt injury to eyeball/orbit and periosteal fractures; accelerates bone callus formation.',
        keynoteBn: 'চোখের খাঁচায় ভোঁতা আঘাত এবং হাড় ভাঙা বা হাড়ের উপরিভাগের চোট জোড়া লাগাতে শ্রেষ্ঠ।',
        modalityEn: 'Worse: touch, movement. Better: quiet rest.',
        modalityBn: 'স্পর্শে বাড়ে; পূর্ণ বিশ্রামে ভালো থাকে।',
        differentiatingFeature: 'Pricking, stitching pains after bone trauma and non-union of fractures.',
        potency: '30C / 200C'
      }
    ]
  },
  {
    id: 'acidity',
    icon: '🔥',
    nameEn: 'Acidity, Heartburn & GERD',
    nameBn: 'অম্লতা, বুকজ্বালা ও গ্যাস্ট্রিক',
    definitionEn: 'Gastric hyperacidity, sour waterbrash, retrosternal burning, acid reflux, and dyspeptic distress.',
    definitionBn: 'পাকস্থলীর অতিরিক্ত অ্যাসিড ক্ষরণ, বুকজ্বালা, টক ঢেকুর, অম্লশূল ও পেটের অস্বস্তি।',
    keywords: ['acidity', 'heartburn', 'sour', 'gerd', 'eructation', 'acid', 'অম্ল', 'টক ঢেকুর', 'বুকজ্বালা', 'টক স্বাদ'],
    remedyIds: ['nux-vomica', 'lycopodium-clavatum', 'arsenicum-album', 'pulsatilla-nigricans', 'bio-combination-25'],
    differentials: [
      {
        remedyId: 'nux-vomica',
        name: 'Nux Vomica',
        nameBn: 'নাক্স ভমিকা',
        category: 'dilution',
        keynoteEn: 'Sour, bitter eructations and burning 1-2 hours after meals; toxic acidity from coffee, spices, or alcohol.',
        keynoteBn: 'খাওয়ার ১-২ ঘণ্টা পর টক-তিক্ত ঢেকুর ও বুকজ্বালা; কফি, মসলা বা অ্যালকোহল সেবনের কুফল।',
        modalityEn: 'Worse: morning, sedentary life, stimulants. Better: evening, after undisturbed rest.',
        modalityBn: 'সকালে ও কফি পানে বাড়ে; সন্ধ্যায় ও পূর্ণ বিশ্রামে কমে।',
        differentiatingFeature: 'Ineffectual urging for stool; irritable executive temperament.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'lycopodium-clavatum',
        name: 'Lycopodium Clavatum',
        nameBn: 'লাইকোপোডিয়াম ক্ল্যাভাটাম',
        category: 'dilution',
        keynoteEn: 'Excessive sour acid waterbrash with lower abdominal bloating; fullness after a few mouthfuls.',
        keynoteBn: 'মুখ দিয়ে টক পানি ওঠা; পেটের নিচের অংশে অতিরিক্ত গ্যাস ও সামান্য খেলেই পেট ভরে যাওয়া।',
        modalityEn: 'Worse: 4:00 PM to 8:00 PM, cold drinks. Better: warm food and drinks.',
        modalityBn: 'বিকেল ৪টা থেকে রাত ৮টায় বাড়ে; গরম খাবার ও চা পানে কমে।',
        differentiatingFeature: 'Flatulent dyspepsia localized in lower abdomen; desires sweets.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'arsenicum-album',
        name: 'Arsenicum Album',
        nameBn: 'আর্সেনিকাম অ্যালবাম',
        category: 'dilution',
        keynoteEn: 'Burning in stomach like red-hot coals; nausea and burning after cold food or drinks.',
        keynoteBn: 'পাকস্থলীতে জ্বলন্ত কয়লা রাখার মতো তীব্র জ্বালা; ঠান্ডা খাবার বা পানিতে বাড়ে।',
        modalityEn: 'Worse: midnight 1:00 AM - 2:00 AM, cold applications. Better: hot sips of water.',
        modalityBn: 'রাত ১টা-২টায় বাড়ে; গরম পানির চুমুকে আরাম মেলে।',
        differentiatingFeature: 'Extreme prostration, restlessness, and anxiety with the burning.',
        potency: '30C'
      },
      {
        remedyId: 'pulsatilla-nigricans',
        name: 'Pulsatilla Nigricans',
        nameBn: 'পালসেটিলা নাইগ্রিক্যান্স',
        category: 'dilution',
        keynoteEn: 'Acidity and heartburn after eating rich, fatty, oily foods, pastries, or dairy.',
        keynoteBn: 'তেল-চর্বিযুক্ত গুরুপাক খাবার বা মিষ্টি খাওয়ার পর বুকজ্বালা ও অম্লভাব।',
        modalityEn: 'Worse: warm close room, rich food. Better: cool open air, gentle walking.',
        modalityBn: 'গরম বন্ধ ঘরে বাড়ে; মুক্ত বাতাসে হাঁটাহাঁটি করলে কমে।',
        differentiatingFeature: 'Complete absence of thirst with coated tongue; mild yielding disposition.',
        potency: '30C'
      },
      {
        remedyId: 'bio-combination-25',
        name: 'Bio-Combination 25',
        nameBn: 'বায়ো-কম্বিনেশন ২৫ (গ্যাস ও অম্বল)',
        category: 'biochemic',
        keynoteEn: 'Synergistic tissue salt formulation for rapid neutralization of gastric acidity and flatulence.',
        keynoteBn: 'বায়োকেমিক লবণের মিশ্রণ যা পাকস্থলীর অ্যাসিডের ভারসাম্য রক্ষা করে ও জ্বালাপোড়া কমায়।',
        modalityEn: 'Safe for daily maintenance across all age groups.',
        modalityBn: 'সকল বয়সের রোগীর জন্য নিরাপদ ও কার্যকর।',
        differentiatingFeature: 'Gentle ionic tissue salt action without chemical rebound.',
        potency: '4 tablets dissolved in lukewarm water'
      }
    ]
  },
  {
    id: 'vomiting',
    icon: '🤢',
    nameEn: 'Vomiting, Nausea & Motion Sickness',
    nameBn: 'বমি, বমিভাব ও মোশন সিকনেস',
    definitionEn: 'Emesis, constant nausea, retching, regurgitation, morning sickness of pregnancy, and motion sickness.',
    definitionBn: 'বমি, অনবরত বমিভাব, গা গুলানো, গর্ভাবস্থায় সকালের বমি ও গাড়িতে মোশন সিকনেস।',
    keywords: ['vomiting', 'nausea', 'retching', 'motion', 'morning sickness', 'বমি', 'বমিভাব', 'গা গুলানো'],
    remedyIds: ['ipecacuanha', 'arsenicum-album', 'nux-vomica', 'pulsatilla-nigricans'],
    differentials: [
      {
        remedyId: 'ipecacuanha',
        name: 'Ipecacuanha',
        nameBn: 'ইপিকাকুয়ানহা',
        category: 'dilution',
        keynoteEn: 'Persistent, unrelenting nausea not relieved by vomiting; clean, pink, uncoated tongue.',
        keynoteBn: 'অনবরত তীব্র বমিভাব যা বমি করার পরেও কমে না; পরিষ্কার ও গোলাপী জিভ।',
        modalityEn: 'Worse: lying down, warmth. Better: open air.',
        modalityBn: 'শুয়ে থাকলে বাড়ে; খোলা বাতাসে কিছুটা ভালো লাগে।',
        differentiatingFeature: 'Clean tongue despite severe gastric distress; profuse salivation.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'arsenicum-album',
        name: 'Arsenicum Album',
        nameBn: 'আর্সেনিকাম অ্যালবাম',
        category: 'dilution',
        keynoteEn: 'Violent vomiting immediately after eating or drinking; cold water ejected at once; burning and prostration.',
        keynoteBn: 'খাবার বা পানি মুখে দেওয়ার সাথে সাথেই বমি; ঠান্ডা পানি পেটে টিকতেই পারে না।',
        modalityEn: 'Worse: midnight, cold food/drinks. Better: warm sips of water.',
        modalityBn: 'মধ্যরাতে বাড়ে; গরম পানির চুমুকে ভালো থাকে।',
        differentiatingFeature: 'Burning stomach pain and intense weakness after vomiting.',
        potency: '30C'
      },
      {
        remedyId: 'nux-vomica',
        name: 'Nux Vomica',
        nameBn: 'নাক্স ভমিকা',
        category: 'dilution',
        keynoteEn: 'Ineffectual retching: "If I could only vomit I would feel so much better"; morning nausea from indulgence.',
        keynoteBn: 'অবিরাম বমির নিষ্ফল চেষ্টা—মনে হয় বমি করতে পারলে আরাম মিলত; সকালের গা গুলানো।',
        modalityEn: 'Worse: morning, mental exertion, stimulants. Better: rest, warmth.',
        modalityBn: 'সকালে ও কফিতে বাড়ে; উষ্ণতায় আরাম।',
        differentiatingFeature: 'Irritable, toxic nausea with bitter sour taste.',
        potency: '30C'
      },
      {
        remedyId: 'pulsatilla-nigricans',
        name: 'Pulsatilla Nigricans',
        nameBn: 'পালসেটিলা নাইগ্রিক্যান্স',
        category: 'dilution',
        keynoteEn: 'Nausea from rich, greasy foods; coated white tongue; total absence of thirst.',
        keynoteBn: 'তেলাক্ত খাবার খাওয়ার পর বমিভাব; জিভে সাদা প্রলেপ ও তৃষ্ণাহীনতা।',
        modalityEn: 'Worse: warm close room, evening. Better: cool fresh open air.',
        modalityBn: 'উষ্ণ বন্ধ ঘরে বাড়ে; ঠান্ডা মুক্ত বাতাসে উপশম।',
        differentiatingFeature: 'Dry mouth yet never thirsty; weepy emotional state.',
        potency: '30C'
      }
    ]
  },
  {
    id: 'migraine',
    icon: '⚡',
    nameEn: 'Migraine & Congestive Headache',
    nameBn: 'মাইগ্রেন ও তীব্র মাথাব্যথা',
    definitionEn: 'Hemicrania, throbbing vascular cephalalgia, ocular migraines, photophobia, and neuralgic cranial pain.',
    definitionBn: 'আধকপালি বা একপাশের তীব্র মাথাব্যথা, দপদপ করা রক্তাধিক্যজনিত যন্ত্রণা, চোখের ভেতরের ব্যথা ও আলোতে কষ্ট।',
    keywords: ['migraine', 'headache', 'throbbing', 'congestive', 'হেডেক', 'মাইগ্রেন', 'মাথাব্যথা', 'আধকপালি'],
    remedyIds: ['belladonna', 'sanguinaria-canadensis', 'spigelia-anthelmia', 'magnesia-phosphorica', 'reckeweg-r16'],
    differentials: [
      {
        remedyId: 'belladonna',
        name: 'Belladonna',
        nameBn: 'বেলাডোনা',
        category: 'dilution',
        keynoteEn: 'Sudden throbbing, hammering vascular headache with flushed crimson face and bounding carotid pulses.',
        keynoteBn: 'মাথায় হাতুড়ি মারার মতো তীব্র দপদপানি ব্যথা; চোখ-মুখ লালবর্ণ ও ঘাড়ের নাড়ি ধড়ফড় করা।',
        modalityEn: 'Worse: light, noise, touch, jar, lying flat. Better: semi-erect rest, tight bandaging.',
        modalityBn: 'আলো, শব্দ, ঝাঁকুনি ও মাথা নিচু করলে বাড়ে; কপালে শক্ত করে বাঁধলে কমে।',
        differentiatingFeature: 'Extreme photophobia; pupils dilated; sudden violent onset and cessation.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'sanguinaria-canadensis',
        name: 'Sanguinaria Canadensis',
        nameBn: 'স্যাঙ্গুইনারিয়া ক্যানাডেনসিস',
        category: 'dilution',
        keynoteEn: 'Right-sided sick headache rising from neck and occiput, settling above the right eye; bilious vomiting.',
        keynoteBn: 'ডান দিকের মাইগ্রেন যা ঘাড় থেকে উঠে এসে ডান চোখের ওপর স্থির হয়; সাথে পিত্তবমি।',
        modalityEn: 'Worse: motion, light, noise. Better: lying quiet in a dark room and after sleeping.',
        modalityBn: 'নড়াচড়া ও আলোতে বাড়ে; অন্ধকার ঘরে চুপচাপ শুয়ে ঘুমালে উপশম।',
        differentiatingFeature: 'Seventh-day periodic recurrence; circumscribed redness of right cheek.',
        potency: '30C'
      },
      {
        remedyId: 'spigelia-anthelmia',
        name: 'Spigelia Anthelmia',
        nameBn: 'স্পাইজেলিয়া অ্যান্থেলমিয়া',
        category: 'dilution',
        keynoteEn: 'Left-sided piercing needle-like neuralgia and migraine centered over or behind left eye.',
        keynoteBn: 'বাম চোখের ভেতর ও চারপাশে সুচ ফোটার মতো সূক্ষ্ম কিন্তু তীব্র যন্ত্রণাদায়ক মাইগ্রেন।',
        modalityEn: 'Worse: sunrise to sunset, motion, stooping. Better: lying with head high.',
        modalityBn: 'সূর্য ওঠার সাথে বাড়ে ও সূর্যাস্তে কমে; মাথা উঁচু করে শুলে ভালো লাগে।',
        differentiatingFeature: 'Synchronous with course of the sun; violent palpitation accompanying headache.',
        potency: '30C'
      },
      {
        remedyId: 'magnesia-phosphorica',
        name: 'Magnesia Phosphorica 6X',
        nameBn: 'ম্যাগনেসিয়া ফসফোরিকা ৬এক্স',
        category: 'biochemic',
        keynoteEn: 'Sharp, shooting, darting cramping neuralgic headaches dramatically relieved by heat and pressure.',
        keynoteBn: 'বিদ্যুৎ চমকানোর মতো ক্ষিপ্র স্নায়বিক মাথাব্যথা; গরম সেঁক ও শক্ত চাপে সাথে সাথে কমে।',
        modalityEn: 'Worse: cold drafts, cold washing. Better: hot water bags, warm wraps, hard pressure.',
        modalityBn: 'ঠান্ডা বাতাসে বাড়ে; গরম পানির সেঁক ও কপালে চেপে ধরলে কমে।',
        differentiatingFeature: 'Purely spasmodic neuralgic nature; lack of vascular throbbing.',
        potency: '6X in hot water'
      },
      {
        remedyId: 'reckeweg-r16',
        name: 'Dr. Reckeweg R16 (Migranin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর১৬ (মাইগ্রানিন)',
        category: 'patent',
        keynoteEn: 'Comprehensive German biological formula for chronic migraine, cranial neuralgia, and tension headaches.',
        keynoteBn: 'জার্মান ফর্মুলেশন যা দীর্ঘমেয়াদী মাইগ্রেন ও নার্ভাস মাথাব্যথা নির্মূল করতে ব্যবহৃত হয়।',
        modalityEn: 'Taken regularly to prevent recurrent migraine attacks.',
        modalityBn: 'নিয়মিত সেবনে মাইগ্রেনের আক্রমণ প্রতিরোধ করে।',
        differentiatingFeature: 'Broad-spectrum synergy across left, right, and occipital headaches.',
        potency: '10-15 drops 3 times daily'
      }
    ]
  },
  {
    id: 'sciatica',
    icon: '⚡',
    nameEn: 'Sciatica & Neuralgic Nerve Pain',
    nameBn: 'সায়াটিকা ও স্নায়ুশূল',
    definitionEn: 'Sciatic nerve compression, shooting pains down the leg, femoral neuralgia, and lumbar disc radiculopathy.',
    definitionBn: 'সায়াটিকা স্নায়ুর প্রদাহ, কোমর থেকে পায়ের পাতা পর্যন্ত বিদ্যুৎ চমকানোর মতো টান ও অবশভাব।',
    keywords: ['sciatica', 'nerve pain', 'neuralgia', 'shooting', 'radiating', 'সায়াটিকা', 'স্নায়ুশূল', 'কোমর ব্যথা'],
    remedyIds: ['rhus-toxicodendron', 'colocynthis', 'magnesia-phosphorica', 'reckeweg-r71'],
    differentials: [
      {
        remedyId: 'rhus-toxicodendron',
        name: 'Rhus Toxicodendron',
        nameBn: 'রাস টক্সিকোডেনড্রন',
        category: 'dilution',
        keynoteEn: 'Sciatica from cold damp exposure or muscular strain; worse on first moving; relieved by limbering up.',
        keynoteBn: 'ঠান্ডা লাগা বা মোচড় খাওয়ার পর সায়াটিকা ব্যথা; নড়াচড়ার শুরুতে তীব্র কষ্ট, কিন্তু ক্রমাগত হাঁটলে কমে।',
        modalityEn: 'Worse: rest, cold wet weather, first step. Better: continuous walking, warm applications.',
        modalityBn: 'বিশ্রামে ও প্রথম পদক্ষেপে বাড়ে; ক্রমাগত হাঁটাহাঁটি ও গরমে কমে।',
        differentiatingFeature: 'Restless pacing; tingling and numbness in affected limb.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'colocynthis',
        name: 'Colocynthis',
        nameBn: 'কলোসিন্থিস',
        category: 'dilution',
        keynoteEn: 'Violent cramping, shooting sciatic pain down right leg; patient bends double or presses thigh to abdomen.',
        keynoteBn: 'ডান পায়ের সায়াটিকার তীব্র খিঁচুনিযুক্ত ব্যথা; রোগী দুই ভাঁজ হয়ে শুতে বাধ্য হয়।',
        modalityEn: 'Worse: motion, touch, stretching leg. Better: firm hard pressure, bending double, heat.',
        modalityBn: 'পা সোজা করলে বাড়ে; শক্ত করে চেপে ধরে পা পেটের সাথে গুটিয়ে রাখলে কমে।',
        differentiatingFeature: 'Pain like an iron band; right-sided predominance; relieved by hard pressure.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'magnesia-phosphorica',
        name: 'Magnesia Phosphorica 6X',
        nameBn: 'ম্যাগনেসিয়া ফসফোরিকা ৬এক্স',
        category: 'biochemic',
        keynoteEn: 'Lightning-like, shooting sciatic nerve cramps; dramatic instant relief from boiling hot compresses.',
        keynoteBn: 'বিদ্যুৎগতির তীব্র সায়াটিকা স্নায়ুশূল; গরম পানির সেঁক দিলে অবিলম্বে নাটকীয় উপশম।',
        modalityEn: 'Worse: cold, touching lightly. Better: boiling hot applications, firm pressure.',
        modalityBn: 'ঠান্ডায় বাড়ে; ফুটন্ত গরম সেঁকে উপশম।',
        differentiatingFeature: 'Purely antispasmodic neuralgic salt; great for acute painful flares.',
        potency: '6X dissolved in hot water'
      },
      {
        remedyId: 'reckeweg-r71',
        name: 'Dr. Reckeweg R71 (Ischialgin)',
        nameBn: 'ডাঃ রেকেওয়েগ আর৭১ (ইশ্চিয়ালজিন)',
        category: 'patent',
        keynoteEn: 'German biological drops specifically indicated for severe sciatica, femoral neuralgia, and lumbar disc irritation.',
        keynoteBn: 'জার্মান ফর্মুলেশন যা সায়াটিকার তীব্র স্নায়ুশূল ও পায়ের অসাড়তা দ্রুত সারিয়ে তোলে।',
        modalityEn: 'Taken regularly in acute and chronic sciatic nerve inflammation.',
        modalityBn: 'তীব্র ও দীর্ঘস্থায়ী উভয় সায়াটিকায় কার্যকর।',
        differentiatingFeature: 'Combined biological synergy targeting disc and nerve sheath.',
        potency: '10-15 drops in warm water 3-4 times daily'
      }
    ]
  },
  {
    id: 'dyspepsia',
    icon: '💨',
    nameEn: 'Dyspepsia, Flatulence & Bloating',
    nameBn: 'অজীর্ণ, গ্যাস ও পেট ফাঁপা',
    definitionEn: 'Fermentative intestinal gas, meteorological abdominal distension, sluggish digestion, and painful bloating.',
    definitionBn: 'পেটে গ্যাস জমে পেট ফাঁপা, ভুটভাট শব্দ, অজীর্ণতা, অপাচ্য খাবার ও পেটে অস্বস্তিকর টানটান ভাব।',
    keywords: ['dyspepsia', 'gas', 'flatulence', 'bloating', 'fullness', 'গ্যাস', 'অজীর্ণ', 'পেট ফাঁপা', 'বায়ু'],
    remedyIds: ['carbo-vegetabilis', 'lycopodium-clavatum', 'nux-vomica'],
    differentials: [
      {
        remedyId: 'carbo-vegetabilis',
        name: 'Carbo Vegetabilis',
        nameBn: 'কার্বো ভেজিটেবিলিস',
        category: 'dilution',
        keynoteEn: 'Upper abdominal meteorism; stomach bloated like a tight drum; belching provides temporary relief.',
        keynoteBn: 'পেটের উপরিভাগে অতিরিক্ত গ্যাস জমে ড্রামের মতো ফুলে থাকা; ঢেকুর তুললে সাময়িক শান্তি মেলে।',
        modalityEn: 'Worse: lying down, after eating, rich food. Better: eructation, fanning.',
        modalityBn: 'শুয়ে থাকলে বাড়ে; ঢেকুর উঠলে ও বাতাস করলে ভালো লাগে।',
        differentiatingFeature: 'Air hunger—wants to be fanned rapidly; cold breath and extremities.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'lycopodium-clavatum',
        name: 'Lycopodium Clavatum',
        nameBn: 'লাইকোপোডিয়াম ক্ল্যাভাটাম',
        category: 'dilution',
        keynoteEn: 'Lower intestinal flatulence with rumbling; abdomen tender; cannot bear tight clothing or waistband.',
        keynoteBn: 'পেটের নিচের অংশে প্রচুর গ্যাস ও ডাক; পেটে কোনো শক্ত বেল্ট বা কাপড় সহ্য করতে না পারা।',
        modalityEn: 'Worse: 4:00 PM to 8:00 PM. Better: passing flatus, warm drinks.',
        modalityBn: 'বিকেল ৪টা থেকে রাত ৮টায় বৃদ্ধি; বায়ু নির্গমন ও গরম চায়ে কমে।',
        differentiatingFeature: 'Fullness after very few mouthfuls; constant loud gurgling in bowels.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'nux-vomica',
        name: 'Nux Vomica',
        nameBn: 'নাক্স ভমিকা',
        category: 'dilution',
        keynoteEn: 'Gastro-intestinal sluggishness, weight like a stone after eating; irritable, hasty temper; sour eructations.',
        keynoteBn: 'খাওয়ার পর পেটে পাথরের মতো ভারী চাপ; খিটখিটে মেজাজ ও টক ঢেকুর।',
        modalityEn: 'Worse: morning, sedentary habits, coffee. Better: uninterrupted rest.',
        modalityBn: 'সকালে ও অলস বসে থাকলে বাড়ে; বিশ্রামে ভালো থাকে।',
        differentiatingFeature: 'Ineffectual urging for stool; toxic dyspepsia from overindulgence.',
        potency: '30C'
      }
    ]
  },
  {
    id: 'constipation',
    icon: '🚽',
    nameEn: 'Constipation & Straining',
    nameBn: 'কোষ্ঠকাঠিন্য ও মল কাঠিন্য',
    definitionEn: 'Inactivity of bowel, hard dry burnt-looking stool, ineffectual rectal straining, and painful evacuation.',
    definitionBn: 'অন্ত্রের নিষ্ক্রিয়তা, মল শুষ্ক ও শক্ত পোড়াটে হওয়া, মলত্যাগে নিষ্ফল বেগ এবং তীব্র কষ্ট।',
    keywords: ['constipation', 'hard stool', 'straining', 'ineffectual', 'কোষ্ঠকাঠিন্য', 'মল কাঠিন্য', 'কষা'],
    remedyIds: ['nux-vomica', 'bryonia-alba', 'silicea'],
    differentials: [
      {
        remedyId: 'nux-vomica',
        name: 'Nux Vomica',
        nameBn: 'নাক্স ভমিকা',
        category: 'dilution',
        keynoteEn: 'Frequent ineffectual urging for stool; passes small quantities; unfinished sensation; feels better after.',
        keynoteBn: 'বারবার পায়খানার বেগ কিন্তু অল্প একটু হয়েই থেমে যায়; মনে হয় আরও বাকি রয়ে গেল।',
        modalityEn: 'Worse: morning, sedentary lifestyle. Better: after complete evacuation.',
        modalityBn: 'সকালে বাড়ে; পেট পুরোপুরি পরিষ্কার হলে শান্তি।',
        differentiatingFeature: 'Spasmodic dyssynergia of rectal sphincters from sedentary lifestyle.',
        potency: '30C / 200C at night'
      },
      {
        remedyId: 'bryonia-alba',
        name: 'Bryonia Alba',
        nameBn: 'ব্রায়োনিয়া অ্যালবা',
        category: 'dilution',
        keynoteEn: 'Total absence of urging; stool is unusually large, dry, hard, dark, and burnt-looking as if scorched.',
        keynoteBn: 'পায়খানার কোনো বেগই থাকে না; মল অস্বাভাবিক বড়, শক্ত, খটখটে ও আগুনে পোড়া কাঠের মতো।',
        modalityEn: 'Worse: morning, movement. Better: quiet rest.',
        modalityBn: 'নড়াচড়ায় কষ্ট বাড়ে; বিশ্রামে ভালো থাকে।',
        differentiatingFeature: 'Extreme systemic dryness of all mucous membranes; unquenchable thirst.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'silicea',
        name: 'Silicea 6X',
        nameBn: 'সিলিসিয়া ৬এক্স',
        category: 'biochemic',
        keynoteEn: 'Stool partly expelled and then recedes back into rectum; lack of expulsive muscular power in rectum.',
        keynoteBn: 'মল কিছুটা বের হয়ে আবার মলদ্বারের ভেতরে ঢুকে যায়; মলত্যাগে পেশির শক্তির অভাব।',
        modalityEn: 'Worse: cold, winter. Better: warmth, wrapping up head.',
        modalityBn: 'শীতকালে বাড়ে; শরীর ও মাথা গরম কাপড়ে ঢেকে রাখলে আরাম।',
        differentiatingFeature: 'Bashful stool that slips back; hard straining required even for soft stool.',
        potency: '6X 4 tablets twice daily'
      }
    ]
  },
  {
    id: 'fever',
    icon: '🌡️',
    nameEn: 'Acute Fever & Chills',
    nameBn: 'তীব্র জ্বর ও শীতভাব',
    definitionEn: 'Pyrexia, rigors, sudden inflammatory fever, bounding pulse, thirst variations, and restless agitation.',
    definitionBn: 'উচ্চ তাপমাত্রা, কাঁপুনি দিয়ে জ্বর, শরীরের উত্তাপ, দ্রুত নাড়ি, অস্থিরতা ও শীতভাব।',
    keywords: ['fever', 'chill', 'pyrexia', 'influenza', 'high temperature', 'heat', 'জ্বর', 'সর্দিজ্বর', 'শীতভাব', 'তাপ'],
    remedyIds: ['aconitum-napellus', 'belladonna', 'bryonia-alba', 'reckeweg-r1'],
    differentials: [
      {
        remedyId: 'aconitum-napellus',
        name: 'Aconitum Napellus',
        nameBn: 'একোনাইট ন্যাপেলাস',
        category: 'dilution',
        keynoteEn: 'Sudden storm after exposure to dry cold wind; hot dry skin, full bounding pulse, extreme panic.',
        keynoteBn: 'শুকনো ঠান্ডা বাতাস লাগার পর হঠাৎ প্রচণ্ড জ্বর; চামড়া উত্তপ্ত ও খটখটে শুকনো; মৃত্যুভয় ও অস্থিরতা।',
        modalityEn: 'Worse: evening, night, cold wind. Better: open air.',
        modalityBn: 'সন্ধ্যা ও রাতে বাড়ে; খোলা বাতাসে উপশম।',
        differentiatingFeature: 'Extreme physical restlessness with agony and terror of death.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'belladonna',
        name: 'Belladonna',
        nameBn: 'বেলাডোনা',
        category: 'dilution',
        keynoteEn: 'High sudden fever with delirium, burning hot radiant skin, flushed crimson face, dilated pupils.',
        keynoteBn: 'উচ্চ তাপমাত্রা, প্রলাপ বকা, শরীর থেকে আগুনের মতো তাপ বের হওয়া, চোখ-মুখ টকটকে লাল।',
        modalityEn: 'Worse: light, noise, touch, jar, lying flat. Better: semi-erect rest.',
        modalityBn: 'আলো, শব্দ ও ঝাঁকুনিতে বাড়ে; আধশোয়া হয়ে থাকলে ভালো লাগে।',
        differentiatingFeature: 'Intense carotid pulsations; throbbing headache with burning dry heat.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'bryonia-alba',
        name: 'Bryonia Alba',
        nameBn: 'ব্রায়োনিয়া অ্যালবা',
        category: 'dilution',
        keynoteEn: 'High fever with bursting headache; desires large quantities of water at long intervals; worse least motion.',
        keynoteBn: 'মাথা ফাটা যন্ত্রণাসহ জ্বর; দীর্ঘ বিরতিতে প্রচুর পরিমাণে ঠান্ডা পানি পানের তীব্র তৃষ্ণা; নড়াচড়ায় মারাত্মক বৃদ্ধি।',
        modalityEn: 'Worse: slightest motion, warm room. Better: absolute rest, cold drinks.',
        modalityBn: 'সামান্য নড়াচড়াতেও বাড়ে; একদম চুপচাপ শুয়ে থাকলে আরাম।',
        differentiatingFeature: 'Apathy and desire to be left alone; holds head when coughing.',
        potency: '30C'
      },
      {
        remedyId: 'reckeweg-r1',
        name: 'Dr. Reckeweg R1 (Anginacid)',
        nameBn: 'ডাঃ রেকেওয়েগ আর১ (অ্যাঞ্জিনাসিড)',
        category: 'patent',
        keynoteEn: 'German biological antibiotic complex for acute inflammation, high fever, and glandular swelling.',
        keynoteBn: 'জার্মান ফর্মুলেশন যা তীব্র প্রদাহজনিত জ্বর ও গলার গ্রন্থির ফোলা দ্রুত প্রশমিত করে।',
        modalityEn: 'Acute dosing every 1-2 hours during high fever spike.',
        modalityBn: 'তীব্র জ্বরের সময় ১-২ ঘণ্টা পর পর সেব্য।',
        differentiatingFeature: 'Multi-target inflammatory biological modulation.',
        potency: '10-15 drops in water'
      }
    ]
  },
  {
    id: 'cough',
    icon: '🗣️',
    nameEn: 'Cough & Bronchitis',
    nameBn: 'কাশি ও ব্রঙ্কাইটিস',
    definitionEn: 'Dry hacking cough, spasmodic coughing paroxysms, bronchial mucus rattling, and nocturnal cough fits.',
    definitionBn: 'শুষ্ক খুসখুসে কাশি, দম আটকানো কাশির দমক, বুকে কফ ঘড়ঘড় করা ও রাতে কাশির তীব্রতা বৃদ্ধি।',
    keywords: ['cough', 'dry cough', 'wet cough', 'wheezing', 'rattling', 'কাশি', 'কফ', 'খুকখুকে কাশি'],
    remedyIds: ['bryonia-alba', 'drosera-rotundifolia', 'antimonium-tartaricum', 'arsenicum-album'],
    differentials: [
      {
        remedyId: 'bryonia-alba',
        name: 'Bryonia Alba',
        nameBn: 'ব্রায়োনিয়া অ্যালবা',
        category: 'dilution',
        keynoteEn: 'Hard, dry, hacking cough; must hold chest firmly with both hands while coughing; sharp stitching pain.',
        keynoteBn: 'শুষ্ক বুক চিরে যাওয়া কাশি; কাশির সময় যন্ত্রণায় দুই হাত দিয়ে বুক চেপে ধরে রাখতে হয়।',
        modalityEn: 'Worse: entering warm room, movement, deep breathing. Better: rest, pressure.',
        modalityBn: 'গরম ঘরে ঢুকলে বা নড়াচড়ায় বাড়ে; বুকে চেপে ধরে থাকলে কমে।',
        differentiatingFeature: 'Sharp stitching pleuritic chest pain aggravated by motion.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'drosera-rotundifolia',
        name: 'Drosera Rotundifolia',
        nameBn: 'ড্রসেরা রোটান্ডিফোলিয়া',
        category: 'dilution',
        keynoteEn: 'Paroxysmal spasmodic barking whooping cough coming in violent rapid fits that threaten suffocation.',
        keynoteBn: 'দম আটকানো খিঁচুনিযুক্ত মারাত্মক কাশি; একটানা এত দ্রুত কাশির দমক আসে যে রোগী শ্বাস নিতে পারে না।',
        modalityEn: 'Worse: lying down after midnight, warm bed. Better: sitting up.',
        modalityBn: 'মধ্যরাতের পর শুয়ে পড়লে বাড়ে; উঠে বসলে কিছুটা ভালো লাগে।',
        differentiatingFeature: 'Cough fits end in retching, vomiting, or nosebleed.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'antimonium-tartaricum',
        name: 'Antimonium Tartaricum',
        nameBn: 'অ্যান্টিমোনিয়াম টার্টারিকাম',
        category: 'dilution',
        keynoteEn: 'Profuse rattling of mucus in bronchi with little expectoration; chest too weak to raise phlegm.',
        keynoteBn: 'বুকে ঘড়ঘড় শব্দে প্রচুর শ্লেষ্মা বা কফ জমা থাকা সত্ত্বেও কাশির দুর্বলতায় কফ তুলতে না পারা।',
        modalityEn: 'Worse: lying flat, warm room. Better: sitting erect, vomiting.',
        modalityBn: 'সোজা শুলে বাড়ে; উঠে বসলে বা কফ বমি হলে শ্বাস নিতে সুবিধা হয়।',
        differentiatingFeature: 'Drowsiness, weakness, and cool perspiration with the rattling.',
        potency: '30C'
      },
      {
        remedyId: 'arsenicum-album',
        name: 'Arsenicum Album',
        nameBn: 'আর্সেনিকাম অ্যালবাম',
        category: 'dilution',
        keynoteEn: 'Asthmatic suffocative cough waking patient between 1:00 AM and 2:00 AM; unable to lie flat.',
        keynoteBn: 'রাত ১টা থেকে ২টার মধ্যে হাঁপানি ও দমবন্ধ কাশি; বিছানায় শুতে পারে না, উঠে বসতে বাধ্য হয়।',
        modalityEn: 'Worse: midnight to 2:00 AM, cold air. Better: warm drinks, sitting propped up.',
        modalityBn: 'রাত ১টা-২টায় ও ঠান্ডায় বাড়ে; গরম চা বা পানিতে কমে।',
        differentiatingFeature: 'Burning in chest relieved by warm drinks; extreme anxiety.',
        potency: '30C'
      }
    ]
  },
  {
    id: 'insomnia',
    icon: '🌙',
    nameEn: 'Insomnia & Restlessness',
    nameBn: 'অনিদ্রা ও অস্থিরতা',
    definitionEn: 'Sleeplessness, nocturnal agitation, brain fatigue, mental hyperactivity, racing thoughts, and sleep anxiety.',
    definitionBn: 'ঘুম না হওয়া, রাতে অস্থির পায়চারি, মানসিক ক্লান্তি, অতিরিক্ত চিন্তাভাবনায় মস্তিষ্ক উত্তেজিত থাকা।',
    keywords: ['insomnia', 'sleeplessness', 'anxiety', 'wakeful', 'night', 'অনিদ্রা', 'ঘুম না হওয়া', 'অস্থিরতা'],
    remedyIds: ['passiflora-incarnata', 'coffea-cruda', 'kali-phosphoricum-6x', 'aconitum-napellus'],
    differentials: [
      {
        remedyId: 'passiflora-incarnata',
        name: 'Passiflora Incarnata Q',
        nameBn: 'প্যাসিফ্লোরা মাদার টিংচার',
        category: 'mother_tincture',
        keynoteEn: 'Natural non-addictive sedative; quiets the nervous system after mental strain, worry, and sleepless night tossing.',
        keynoteBn: 'প্রাকৃতিক নিরাপদ স্নায়ু প্রশান্তিকারক; অতিরিক্ত মানসিক ক্লান্তি ও বিছানায় এপাশ-ওপাশ করা দূর করে স্বাভাবিক ঘুম আনে।',
        modalityEn: 'Taken 20-30 drops in half glass of water before retiring at night.',
        modalityBn: 'রাতে ঘুমানোর ৩০ মিনিট আগে ২০-৩০ ফোঁটা পানিতে সেব্য।',
        differentiatingFeature: 'Direct physiological calming of agitated cerebral cortex.',
        potency: 'Q (Mother Tincture)'
      },
      {
        remedyId: 'coffea-cruda',
        name: 'Coffea Cruda',
        nameBn: 'কফিয়া ক্রুডা',
        category: 'dilution',
        keynoteEn: 'Sleeplessness from agreeable excitement or rush of joyful thoughts; mind is hyperactive with vivid ideas.',
        keynoteBn: 'কোনো সুখবর পেয়ে আনন্দ বা উত্তেজনায় ঘুম না হওয়া; মাথায় অবিরাম নতুন নতুন ভাবনা খেলা করা।',
        modalityEn: 'Worse: night, coffee, mental excitement. Better: quiet.',
        modalityBn: 'উত্তেজনায় বাড়ে; নিরবতায় কমে।',
        differentiatingFeature: 'Wide awake; senses acutely sharp; hears slightest ticking of clock.',
        potency: '30C / 200C'
      },
      {
        remedyId: 'kali-phosphoricum-6x',
        name: 'Kali Phosphoricum 6X',
        nameBn: 'ক্যালি ফসফোরিকাম ৬এক্স',
        category: 'biochemic',
        keynoteEn: 'Nervous exhaustion, brain fag, study stress; exhausted yet cannot fall asleep due to nervous twitching.',
        keynoteBn: 'পড়াশোনা বা কাজের চাপে স্নায়ু ক্লান্ত কিন্তু বিছানায় শুলে স্নায়বিক অস্থিরতায় ঘুম আসে না।',
        modalityEn: 'Worse: mental effort. Better: warmth, gentle nourishment.',
        modalityBn: 'মানসিক পরিশ্রমে বাড়ে; বিশ্রামে ভালো থাকে।',
        differentiatingFeature: 'Restores phosphorus balance in exhausted nerve tissue.',
        potency: '6X in warm water at bedtime'
      },
      {
        remedyId: 'aconitum-napellus',
        name: 'Aconitum Napellus',
        nameBn: 'একোনাইট ন্যাপেলাস',
        category: 'dilution',
        keynoteEn: 'Sleeplessness with frightful dreams, nightmare, tossing about in agony, fear, and rapid heart action.',
        keynoteBn: 'ভয়ংকর দুঃস্বপ্ন দেখে আঁতকে ওঠা, বুক ধড়ফড় ও মৃত্যুর ভয়ে বিছানায় ছটফট করা।',
        modalityEn: 'Worse: night, after midnight. Better: open air.',
        modalityBn: 'মধ্যরাতে বাড়ে; খোলা বাতাসে স্বস্তি।',
        differentiatingFeature: 'Panic, terror, and agonizing restlessness preventing sleep.',
        potency: '30C / 200C'
      }
    ]
  }
];
