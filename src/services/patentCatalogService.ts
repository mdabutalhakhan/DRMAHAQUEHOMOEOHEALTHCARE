import type { PatentFormulation } from '../data/clinicalRepertoryData';

/**
 * Strict, Medically Accurate Offline Patent Lookup Catalog
 * Dr. M. A. Haque, M.D. (Homoeo) - Homoeo Health Care
 *
 * Rules:
 * 1. R-Series products (R1 through R89) belong SOLELY to Dr. Reckeweg & Co. GmbH (Germany).
 *    NEVER attribute R-numbers to Adel, SBL, Bakson, or any other manufacturer.
 * 2. Enuresis (Bedwetting) must NEVER display R52 (Vomiting Drops). Enuresis drops = Dr. Reckeweg R74.
 * 3. Vitiligo / Leucoderma must use SBL Babchi Oil, Dr. Reckeweg R60, Bakson B27.
 * 4. If no verified patent matches the clinical query, return empty list so UI displays:
 *    "No specific patent formulation recommended for this condition. Rely on Classical Simillimum."
 */

export interface VerifiedPatentCondition {
  id: string;
  names: string[];
  keywords: string[];
  patents: PatentFormulation[];
}

export const VERIFIED_PATENT_CATALOG: VerifiedPatentCondition[] = [
  // 1. Vitiligo / Leucoderma
  {
    id: 'vitiligo',
    names: ['Vitiligo', 'Leucoderma', 'শ্বেতী রোগ', 'শ্বেতকুষ্ঠ', 'সাদা দাগ', 'ত্বকের সাদা দাগ'],
    keywords: [
      'vitiligo', 'leucoderma', 'শ্বেতী', 'শ্বেতকুষ্ঠ', 'সাদা দাগ', 'white patch', 
      'white spots', 'depigmentation', 'melanin', 'hypopigmentation', 'বালি দাগ'
    ],
    patents: [
      {
        name: 'SBL Babchi Oil / Psoralea Corylifolia (External & Drops)',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml / 60 ml Oil & Drops',
        indications: 'Depigmentation of skin, vitiligo, leucoderma, white patches, accelerates melanin synthesis.',
        dosage: 'Apply oil externally over white spots and expose to mild morning sunlight for 10-15 mins; 10-15 drops orally in water twice daily.',
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
    ]
  },

  // 2. Enuresis (Bedwetting / Nocturnal Incontinence) - NEVER R52!
  {
    id: 'enuresis',
    names: ['Enuresis', 'Bedwetting', 'Nocturnal Incontinence', 'শয্যামূত্র', 'বিছানায় প্রস্রাব', 'ঘুমের মধ্যে প্রস্রাব'],
    keywords: [
      'enuresis', 'bedwetting', 'bed wetting', 'nocturnal enuresis', 'শয্যামূত্র', 
      'বিছানায় প্রস্রাব', 'বিছানায় প্রস্রাব', 'ঘুমের মধ্যে প্রস্রাব', 'incontinence', 
      'involuntary urination', 'bladder weakness', 'night urination', 'peeing in bed'
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R74 (Enuresis Nocturna Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nocturnal enuresis in children, bedwetting, bladder weakness, nervous bladder incontinence. (Specific for nocturnal enuresis).',
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
    ]
  },

  // 3. Vomiting / Nausea / Motion Sickness
  {
    id: 'vomiting',
    names: ['Vomiting', 'Nausea', 'Motion Sickness', 'বমি', 'বমি ভাব', 'মোশন সিকনেস'],
    keywords: [
      'vomit', 'vomiting', 'nausea', 'motion sickness', 'travel sickness', 'morning sickness',
      'বমি', 'বমি বমি ভাব', 'বমি ভাব', 'গাড়ি চড়লে বমি', 'গাড়ি চড়লে বমি', 'hyperemesis',
      'retching', 'car sickness', 'seasickness'
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R52 (Vomiting Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Nausea, vomiting of pregnancy (hyperemesis gravidarum), motion sickness, travel sickness, acute gastroenteritis.',
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
    ]
  },

  // 4. Skin Diseases / Eczema
  {
    id: 'skin_eczema',
    names: ['Skin Diseases', 'Eczema', 'Dermatitis', 'চর্মরোগ', 'একজিমা', 'চুলকানি', 'দাঁদ'],
    keywords: [
      'eczema', 'skin disease', 'dermatitis', 'itching', 'pruritus', 'eruption',
      'চর্মরোগ', 'একজিমা', 'চুলকানি', 'দাঁদ', 'খোস পাঁচড়া', 'চামড়ার রোগ', 'rash',
      'psoriasis', 'skin affections', 'dry eczema', 'weeping eczema'
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R21 (Skin Reconstitution Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Chronic skin affections, constitutional eczema, scrofulous dermatitis, psoric skin eruptions.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r21', 'r-21', 'reckeweg 21', 'dr reckeweg r21']
      },
      {
        name: 'Dr. Reckeweg R23 (Nosoderm / Skin Affections Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic eczema, pimples, scabies, herpes, pruritus, allergic dermatitis.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r23', 'r-23', 'reckeweg 23', 'dr reckeweg r23', 'nosoderm']
      },
      {
        name: 'SBL Bio-Combination 20 (Skin Diseases)',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Acne, eczema, herpes, crusted eruptions, dry and weeping skin diseases, intense itching.',
        dosage: '4 tablets 3-4 times daily with warm water.',
        mrp: 140,
        aliases: ['bc 20', 'bc20', 'bio-combination 20', 'sbl bc 20', 'sbl bio-combination 20']
      },
      {
        name: 'Bakson B22 / B56 Skin Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Eczema, dry skin, urticaria, eruptions with burning and itching.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 210,
        aliases: ['b22', 'bakson b22', 'b56', 'bakson b56']
      }
    ]
  },

  // 5. Memory / Brain Exhaustion
  {
    id: 'memory_brain',
    names: ['Memory Loss', 'Brain Exhaustion', 'স্মৃতিশক্তি হ্রাস', 'মানসিক ক্লান্তি', 'ব্রেন ফগ'],
    keywords: [
      'memory', 'brain exhaustion', 'mental fatigue', 'forgetfulness', 'brain fog',
      'intellectual exhaustion', 'স্মৃতিশক্তি', 'মনে থাকে না', 'মানসিক ক্লান্তি',
      'ব্রেন ফগ', 'পড়া মনে থাকে না', 'পড়া মনে থাকে না', 'lack of concentration'
    ],
    patents: [
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
    ]
  },

  // 6. Renal Calculi / Kidney Stone
  {
    id: 'renal_calculi',
    names: ['Renal Calculi', 'Kidney Stone', 'কিডনির পাথর', 'মূত্রপাথরী'],
    keywords: [
      'kidney stone', 'renal calculi', 'calculi', 'nephrolithiasis', 'কিডনির পাথর',
      'পাথরী', 'প্রস্রাবে পাথর', 'renal colic', 'ureteric stone'
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R27 (Renocalcin Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Renal calculi, gravel, kidney colic, sharp pains in ureter and bladder.',
        dosage: '10-15 drops in water 3 times daily; in acute colic every 15-30 minutes.',
        mrp: 310,
        aliases: ['r27', 'r-27', 'reckeweg 27', 'renocalcin']
      },
      {
        name: 'SBL ClearStone Drops',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Dissolves and expels kidney and ureteric stones, relieves renal colic and burning urination.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 180,
        aliases: ['clearstone', 'sbl clearstone']
      },
      {
        name: 'Bakson B36 Calculi Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Renal colic, kidney gravel, painful micturition with stone diathesis.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 205,
        aliases: ['b36', 'bakson b36']
      }
    ]
  },

  // 7. Piles / Hemorrhoids
  {
    id: 'piles_hemorrhoids',
    names: ['Piles', 'Hemorrhoids', 'অর্শ', 'পাইলস', 'মলদ্বারে রক্ত'],
    keywords: [
      'piles', 'hemorrhoids', 'haemorrhoids', 'anal fissure', 'অর্শ', 'পাইলস',
      'মলদ্বারে রক্ত', 'মলদ্বারে বলি', 'bleeding piles', 'blind piles'
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R13 (Proctosan Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Bleeding and blind hemorrhoids, anal itching, burning, rectal prolapse, and painful varices.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r13', 'r-13', 'reckeweg 13', 'proctosan']
      },
      {
        name: 'SBL FP Tabs & Ointment',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '25g Tablets / 30g Ointment',
        indications: 'Relieves pain, bleeding, venous congestion, and burning in piles and anal fissures.',
        dosage: '2 tablets 3 times daily; apply ointment locally before and after stool.',
        mrp: 165,
        aliases: ['fp tabs', 'sbl fp', 'fp ointment']
      },
      {
        name: 'Bakson B9 Piles Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Blind or bleeding piles, fissures, burning sensations and constipation.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 200,
        aliases: ['b9', 'bakson b9']
      }
    ]
  },

  // 8. Tonsillitis / Sore Throat
  {
    id: 'tonsillitis',
    names: ['Tonsillitis', 'Sore Throat', 'Pharyngitis', 'টনসিল', 'গলা ব্যথা'],
    keywords: ['tonsil', 'tonsillitis', 'sore throat', 'pharyngitis', 'টনসিল', 'গলা ব্যথা', 'গলায় কাঁটা', 'throat pain'],
    patents: [
      {
        name: 'Dr. Reckeweg R1 (Anginacid Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Local acute and subacute inflammation of catarrhal, purulent tonsils, pharyngitis, and glandular swellings.',
        dosage: '10-15 drops in water 3 times daily; in acute inflammation every 1-2 hours.',
        mrp: 310,
        aliases: ['r1', 'r-1', 'reckeweg 1', 'anginacid']
      },
      {
        name: 'Bakson Throat Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves sore throat, tonsillitis, hoarseness, difficulty swallowing, and dry cough.',
        dosage: '1 tablet dissolved in mouth every 2-3 hours.',
        mrp: 170,
        aliases: ['throat aid', 'bakson throat aid']
      },
      {
        name: 'SBL Tonsilat Tablets',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Acute and chronic tonsillitis, throat congestion, burning pain upon swallowing.',
        dosage: '2 tablets 3 times daily.',
        mrp: 155,
        aliases: ['tonsilat', 'sbl tonsilat']
      }
    ]
  },

  // 9. Asthma & Bronchitis
  {
    id: 'asthma_bronchitis',
    names: ['Asthma', 'Bronchitis', 'Dyspnea', 'হাঁপানি', 'শ্বাসকষ্ট'],
    keywords: ['asthma', 'bronchitis', 'wheezing', 'dyspnea', 'হাঁপানি', 'শ্বাসকষ্ট', 'বুকে ঘড়ঘড়', 'কফ-কাশি'],
    patents: [
      {
        name: 'Dr. Reckeweg R43 (Herban Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Constitutional asthma, spastic bronchial constriction, nocturnal dyspnea, cardiac asthma.',
        dosage: '10-15 drops in water 3 times daily; during paroxysm every 15-30 mins.',
        mrp: 310,
        aliases: ['r43', 'r-43', 'reckeweg 43', 'herban']
      },
      {
        name: 'Bakson Astha Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 30 ml Drops',
        indications: 'Bronchial spasms, breathless choking, wheezing rattling and tight chest.',
        dosage: '1 teaspoonful 3 times daily in water.',
        mrp: 175,
        aliases: ['astha aid', 'bakson astha aid']
      },
      {
        name: 'SBL Bio-Combination 2 (Asthma)',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Spasmodic cough, bronchial asthma, tightness of chest with labored breathing.',
        dosage: '4 tablets 3 times daily with warm water.',
        mrp: 140,
        aliases: ['bc 2', 'bc2', 'sbl bc 2']
      }
    ]
  },

  // 10. Sciatica & Neuralgia
  {
    id: 'sciatica',
    names: ['Sciatica', 'Neuralgia', 'সায়াটিকা', 'কোমর থেকে পা পর্যন্ত ব্যথা'],
    keywords: ['sciatica', 'sciatic', 'neuralgia', 'সায়াটিকা', 'কোমর থেকে পা', 'কোমর ও পায়ের টান'],
    patents: [
      {
        name: 'Dr. Reckeweg R71 (Ischialgin Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Sciatica, ischialgia, sharp tearing shooting pains along the sciatic nerve down the leg.',
        dosage: '10-15 drops in water 3 times daily; in acute pain every 1-2 hours.',
        mrp: 310,
        aliases: ['r71', 'r-71', 'reckeweg 71', 'ischialgin']
      },
      {
        name: 'Bakson B11 Pain Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Sciatic pain, joint stiffness, neuralgic drawing pains in extremities.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 205,
        aliases: ['b11', 'bakson b11']
      },
      {
        name: 'SBL Drops No. 4',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Shooting radiating pain along the sciatic nerve with numbness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['sbl drops 4', 'sbl 4', 'drops 4']
      }
    ]
  },

  // 11. Lumbago / Joint Pain / Rheumatism
  {
    id: 'lumbago_arthritis',
    names: ['Lumbago', 'Arthritis', 'Joint Pain', 'বাত ব্যথা', 'কোমর ব্যথা', 'হাঁটু ব্যথা'],
    keywords: ['lumbago', 'backache', 'arthritis', 'joint pain', 'rheumatism', 'বাত ব্যথা', 'কোমর ব্যথা', 'হাঁটু ব্যথা', 'মেরুদণ্ডের ব্যথা'],
    patents: [
      {
        name: 'Dr. Reckeweg R11 (Lumbago Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Acute and chronic lumbago, back muscle sprain, intercostal neuralgia, rheumatic stiffness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r11', 'r-11', 'reckeweg 11']
      },
      {
        name: 'Dr. Reckeweg R73 (Arthrosan Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Osteoarthritis, especially of large joints, knee joint, hip joint and spondyloarthritis.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r73', 'r-73', 'reckeweg 73', 'arthrosan']
      },
      {
        name: 'Bakson Rheum Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup / 75 Tablets',
        indications: 'Rheumatic arthritis, lumbago, gout, muscular and joint stiffness.',
        dosage: '1 teaspoonful or 1 tablet twice daily.',
        mrp: 185,
        aliases: ['rheum aid', 'bakson rheum aid']
      }
    ]
  },

  // 12. Hair Fall / Alopecia
  {
    id: 'hair_fall',
    names: ['Hair Fall', 'Alopecia', 'চুল পড়া', 'চুল পড়ে যাওয়া', 'টাক'],
    keywords: ['hair fall', 'hair loss', 'alopecia', 'baldness', 'dandruff', 'চুল পড়া', 'চুল পড়া', 'মাথায় টাক', 'খুশকি'],
    patents: [
      {
        name: 'Dr. Reckeweg R89 (Lipocol / Hair Care Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '30 ml Drops',
        indications: 'Alopecia, premature baldness, thinning of hair, hair fall after severe illness or mental stress.',
        dosage: '20-30 drops in water 3 times daily; massage 20 drops gently on scalp at bedtime.',
        mrp: 330,
        aliases: ['r89', 'r-89', 'reckeweg 89', 'lipocol']
      },
      {
        name: 'SBL Scalptone Tablets',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Prevents excessive hair fall, strengthens hair roots, combats dandruff and itchy scalp.',
        dosage: '2 tablets 3 times daily.',
        mrp: 155,
        aliases: ['scalptone', 'sbl scalptone']
      },
      {
        name: 'Bakson B2 Hair Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Arrests hair fall, premature graying, split ends and dandruff.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 205,
        aliases: ['b2', 'bakson b2']
      }
    ]
  },

  // 13. Hypertension / High Blood Pressure
  {
    id: 'hypertension',
    names: ['Hypertension', 'High Blood Pressure', 'উচ্চ রক্তচাপ', 'হাই প্রেশার'],
    keywords: ['hypertension', 'high bp', 'blood pressure', 'উচ্চ রক্তচাপ', 'হাই প্রেশার', 'pressure'],
    patents: [
      {
        name: 'Dr. Reckeweg R85 (Cephapress Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '30 ml Drops',
        indications: 'Essential and secondary hypertension, vascular resistance, throbbing head congestion.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 330,
        aliases: ['r85', 'r-85', 'reckeweg 85', 'cephapress']
      },
      {
        name: 'SBL Rauvolfia Serpentina Drops',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Reduces elevated systolic and diastolic blood pressure, calms nervous excitation.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 175,
        aliases: ['rauvolfia', 'sbl rauvolfia']
      },
      {
        name: 'Bakson B10 Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Regulates arterial blood pressure and relieves headache due to hypertension.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 200,
        aliases: ['b10', 'bakson b10']
      }
    ]
  },

  // 14. Diabetes Mellitus
  {
    id: 'diabetes',
    names: ['Diabetes Mellitus', 'High Blood Sugar', 'ডায়াবেটিস', 'বহুমূত্র'],
    keywords: ['diabetes', 'sugar', 'hyperglycemia', 'ডায়াবেটিস', 'ডায়াবেটিস', 'বহুমূত্র', 'blood sugar'],
    patents: [
      {
        name: 'Dr. Reckeweg R40 (Diabetosan Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Adjuvant in diabetes mellitus, polyuria, polydipsia, metabolic imbalance.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r40', 'r-40', 'reckeweg 40', 'diabetosan']
      },
      {
        name: 'SBL Dibonil Drops',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Regulates glucose metabolism, relieves frequent urination, thirst and prostration.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 185,
        aliases: ['dibonil', 'sbl dibonil']
      },
      {
        name: 'Bakson B34 Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Blood sugar regulation support, combats fatigue and weakness from diabetes.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 200,
        aliases: ['b34', 'bakson b34']
      }
    ]
  },

  // 15. Cough / Bronchitis
  {
    id: 'cough_cold',
    names: ['Cough', 'Cold', 'Bronchitis', 'কাশি', 'সর্দি-কাশি'],
    keywords: ['cough', 'cold', 'bronchial catarrh', 'কাশি', 'সর্দি-কাশি', 'শুকনো কাশি', 'কফ কাশি', 'dry cough', 'wet cough'],
    patents: [
      {
        name: 'Dr. Reckeweg R8 (Jus-Tuss Cough Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Spasmodic cough, bronchial catarrh, whooping-like paroxysms, tickling throat cough.',
        dosage: '10-15 drops in water every 2-3 hours; children 5-8 drops.',
        mrp: 310,
        aliases: ['r8', 'r-8', 'reckeweg 8', 'jus-tuss']
      },
      {
        name: 'Bakson Kof Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Dry irritating and loose productive cough, laryngeal tickling and chest soreness.',
        dosage: '1-2 teaspoonfuls 3 times daily in warm water.',
        mrp: 155,
        aliases: ['kof aid', 'bakson kof aid']
      },
      {
        name: 'SBL Stobal Cough Syrup',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'All types of cough, throat irritation, bronchitis, non-drowsy formulation.',
        dosage: '1-2 teaspoonfuls 3 times daily.',
        mrp: 140,
        aliases: ['stobal', 'sbl stobal']
      }
    ]
  },

  // 16. Liver / Jaundice / Fatty Liver
  {
    id: 'liver_jaundice',
    names: ['Liver Disorders', 'Jaundice', 'Fatty Liver', 'যকৃতের সমস্যা', 'জন্ডিস', 'লিভার'],
    keywords: ['liver', 'jaundice', 'fatty liver', 'hepatitis', 'হেপাটাইটিস', 'জন্ডিস', 'যকৃৎ', 'লিভার বড়', 'biliary colic'],
    patents: [
      {
        name: 'Dr. Reckeweg R7 (Hepagalen Liver Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Organic and functional liver complaints, hepatitis, fatty liver, sluggish gallbladder.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r7', 'r-7', 'reckeweg 7', 'hepagalen']
      },
      {
        name: 'SBL Liv-T Syrup',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Rejuvenates sluggish liver, improves appetite, relieves nausea and fullness in right hypochondrium.',
        dosage: '1-2 teaspoonfuls twice daily.',
        mrp: 150,
        aliases: ['liv-t', 'sbl liv-t']
      },
      {
        name: 'Bakson B42 Liver Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Liver dysfunction, biliary colic, jaundice, loss of appetite, alcohol-induced liver toxicity.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 205,
        aliases: ['b42', 'bakson b42']
      }
    ]
  },

  // 17. Insomnia / Sleeplessness
  {
    id: 'insomnia',
    names: ['Insomnia', 'Sleep Disorders', 'অনিদ্রা', 'ঘুম না হওয়া'],
    keywords: ['insomnia', 'sleeplessness', 'sleep disorder', 'অনিদ্রা', 'ঘুম হয় না', 'ঘুম না হওয়া', 'restless sleep'],
    patents: [
      {
        name: 'Dr. Reckeweg R14 (Quieta Nerve & Sleep Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co. GmbH (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Insomnia, restlessness, nervous excitement, sleep disturbances due to anxiety or overwork.',
        dosage: '15-20 drops in water in the evening and at bedtime.',
        mrp: 310,
        aliases: ['r14', 'r-14', 'reckeweg 14', 'quieta']
      },
      {
        name: 'SBL Tranquil Tablets',
        brand: 'SBL',
        company: 'SBL Pvt. Ltd.',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Promotes natural sleep, relieves stress, anxiety and tension headaches without hangover.',
        dosage: '2 tablets dissolved in mouth at bedtime.',
        mrp: 160,
        aliases: ['tranquil', 'sbl tranquil']
      },
      {
        name: 'Bakson B1 Sleep Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Nervous insomnia, restless sleep with anxious dreams, night awakenings.',
        dosage: '10-15 drops in water at bedtime.',
        mrp: 200,
        aliases: ['b1', 'bakson b1']
      }
    ]
  }
];

/**
 * Strict R-Series Attribution and Brand Normalizer
 * Rule: R-series products (R1 through R89) belong ONLY to Dr. Reckeweg & Co. GmbH (Germany).
 * Never allow Adel, SBL, Bakson, or any other company to be attributed with an R-series drop!
 */
export function sanitizeBrandAttribution(
  name: string,
  brand: string,
  company?: string,
  country?: string
): { brand: string; company: string; country: string } {
  const cleanName = (name || '').trim();
  const cleanBrand = (brand || '').trim();

  // Check if name has R-series pattern: R1, R52, R-74, Dr. Reckeweg R...
  const isRSeries =
    /\bdr\.?\s*reckeweg\b/i.test(cleanName) ||
    /\br-?\d+\b/i.test(cleanName) ||
    /^(?:r|r-)\d+/i.test(cleanName);

  if (isRSeries) {
    return {
      brand: 'Dr. Reckeweg',
      company: 'Dr. Reckeweg & Co. GmbH (Germany)',
      country: 'Germany'
    };
  }

  // Adel Pekana normalization
  if (/\badel\b/i.test(cleanName) || /\badel\b/i.test(cleanBrand)) {
    return {
      brand: 'Adel Pekana',
      company: 'Adel Pekana (Germany)',
      country: 'Germany'
    };
  }

  // SBL normalization
  if (/\bsbl\b/i.test(cleanName) || /\bsbl\b/i.test(cleanBrand)) {
    return {
      brand: 'SBL',
      company: 'SBL Pvt. Ltd.',
      country: 'India'
    };
  }

  // Bakson normalization
  if (/\bbakson\b/i.test(cleanName) || /\bbakson\b/i.test(cleanBrand)) {
    return {
      brand: "Bakson's",
      company: 'Bakson Drugs & Pharmaceuticals',
      country: 'India'
    };
  }

  // Schwabe normalization
  if (/\bschwabe\b/i.test(cleanName) || /\bschwabe\b/i.test(cleanBrand)) {
    return {
      brand: 'Schwabe',
      company: 'Dr. Willmar Schwabe India / Germany',
      country: 'Germany'
    };
  }

  return {
    brand: cleanBrand || 'Homeopathic Patent',
    company: (company || '').trim() || 'GMP Certified Manufacturer',
    country: (country || '').trim() || 'India'
  };
}

/**
 * Searches the strict offline Patent Lookup Catalog for the user's clinical query.
 * If query matches one of the conditions (e.g. vitiligo, enuresis, vomiting, eczema, memory),
 * returns the exact, verified, medically accurate patent list.
 */
export function lookupVerifiedPatents(query: string): PatentFormulation[] {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];

  // 1. High-priority exact keyword / disease condition checks
  // Check Enuresis / Bedwetting first to strictly prevent R52 hallucination
  const isEnuresis =
    q.includes('enuresis') ||
    q.includes('bedwetting') ||
    q.includes('bed wetting') ||
    q.includes('শয্যামূত্র') ||
    q.includes('বিছানায় প্রস্রাব') ||
    q.includes('বিছানায় প্রস্রাব') ||
    q.includes('ঘুমের মধ্যে প্রস্রাব') ||
    (q.includes('nocturnal') && (q.includes('urination') || q.includes('incontinence')));

  if (isEnuresis) {
    const cond = VERIFIED_PATENT_CATALOG.find((c) => c.id === 'enuresis');
    return cond ? cond.patents : [];
  }

  // Check Vitiligo / Leucoderma
  const isVitiligo =
    q.includes('vitiligo') ||
    q.includes('leucoderma') ||
    q.includes('শ্বেতী') ||
    q.includes('শ্বেতকুষ্ঠ') ||
    q.includes('সাদা দাগ') ||
    q.includes('white patch') ||
    q.includes('white spot') ||
    q.includes('depigmentation');

  if (isVitiligo) {
    const cond = VERIFIED_PATENT_CATALOG.find((c) => c.id === 'vitiligo');
    return cond ? cond.patents : [];
  }

  // Check Vomiting / Nausea / Motion Sickness
  const isVomiting =
    q.includes('vomit') ||
    q.includes('nausea') ||
    q.includes('বমি') ||
    q.includes('motion sickness') ||
    q.includes('travel sickness') ||
    q.includes('morning sickness') ||
    q.includes('hyperemesis');

  if (isVomiting) {
    const cond = VERIFIED_PATENT_CATALOG.find((c) => c.id === 'vomiting');
    return cond ? cond.patents : [];
  }

  // Check Memory / Brain Exhaustion
  const isMemory =
    q.includes('memory') ||
    q.includes('brain exhaustion') ||
    q.includes('mental fatigue') ||
    q.includes('স্মৃতিশক্তি') ||
    q.includes('মনে থাকে না') ||
    q.includes('মানসিক ক্লান্তি') ||
    q.includes('brain fog') ||
    q.includes('intellectual exhaustion') ||
    q.includes('forgetful');

  if (isMemory) {
    const cond = VERIFIED_PATENT_CATALOG.find((c) => c.id === 'memory_brain');
    return cond ? cond.patents : [];
  }

  // Check Skin Diseases / Eczema
  const isSkin =
    q.includes('eczema') ||
    q.includes('skin disease') ||
    q.includes('dermatitis') ||
    q.includes('চর্মরোগ') ||
    q.includes('একজিমা') ||
    q.includes('চুলকানি') ||
    q.includes('দাঁদ') ||
    q.includes('pruritus');

  if (isSkin) {
    const cond = VERIFIED_PATENT_CATALOG.find((c) => c.id === 'skin_eczema');
    return cond ? cond.patents : [];
  }

  // 2. Comprehensive catalog scoring
  let bestMatch: VerifiedPatentCondition | null = null;
  let highestScore = 0;

  for (const cond of VERIFIED_PATENT_CATALOG) {
    let score = 0;
    for (const kw of cond.keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (!kwLower) continue;

      if (q === kwLower) {
        score += 25;
      } else if (q.includes(kwLower)) {
        score += kwLower.length > 5 ? 12 : 7;
      } else if (kwLower.includes(q) && q.length >= 4) {
        score += 5;
      }
    }

    for (const name of cond.names) {
      if (q.includes(name.toLowerCase())) {
        score += 15;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = cond;
    }
  }

  if (bestMatch && highestScore >= 7) {
    return bestMatch.patents;
  }

  return [];
}

/**
 * Validates and sanitizes a patent formulation, strictly adhering to medical accuracy:
 * - NEVER allow R52 to be used for enuresis or bedwetting.
 * - Disallow R-numbers under Adel, SBL, or Bakson.
 * - Forces correct brand/company attributions.
 */
export function sanitizeAndFilterPatents(
  rawPatents: any[],
  query: string
): PatentFormulation[] {
  if (!Array.isArray(rawPatents) || rawPatents.length === 0) {
    return [];
  }

  const q = (query || '').toLowerCase();
  const isBedwettingQuery =
    q.includes('enuresis') ||
    q.includes('bedwetting') ||
    q.includes('bed wetting') ||
    q.includes('শয্যামূত্র') ||
    q.includes('বিছানায় প্রস্রাব') ||
    q.includes('বিছানায় প্রস্রাব');

  const seenKeys = new Set<string>();
  const sanitized: PatentFormulation[] = [];

  for (const p of rawPatents) {
    if (!p || typeof p !== 'object') continue;
    const name = String(p.name || '').trim();
    if (!name || name.length < 3) continue;

    // RULE: NEVER allow R52 (Vomiting Drops) for Bedwetting / Enuresis!
    if (isBedwettingQuery && (/\br-?52\b/i.test(name) || /vomit/i.test(name) || /বমি/i.test(name))) {
      continue;
    }

    // Determine brand attribution
    const rawBrand = String(p.brand || '').trim();
    const rawCompany = String(p.company || '').trim();
    const rawCountry = String(p.country || '').trim();
    const brandAttrs = sanitizeBrandAttribution(name, rawBrand, rawCompany, rawCountry);

    // Filter duplicate or non-sensical R-numbers (e.g. made-up numbers like R199)
    const rMatch = name.match(/\br-?(\d+)\b/i);
    if (rMatch) {
      const rNum = parseInt(rMatch[1], 10);
      // Genuine Dr. Reckeweg R numbers run up to ~90
      if (rNum < 1 || rNum > 95) {
        continue; // drop hallucinated high numbers
      }
    }

    const dedupeKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);

    sanitized.push({
      name: name,
      brand: brandAttrs.brand,
      company: brandAttrs.company,
      country: brandAttrs.country,
      bottleSize: p.bottleSize || p.bottle_size || (brandAttrs.brand === 'Dr. Reckeweg' ? '22 ml Drops' : '30 ml Drops'),
      indications: String(p.indications || 'Clinical therapeutic indication based on symptomatology.').trim(),
      dosage: String(p.dosage || '10-15 drops in water 3 times daily.').trim(),
      mrp: typeof p.mrp === 'number' ? p.mrp : (brandAttrs.brand === 'Dr. Reckeweg' ? 310 : 190),
      aliases: Array.isArray(p.aliases) ? p.aliases : [name.toLowerCase()]
    });
  }

  return sanitized;
}
