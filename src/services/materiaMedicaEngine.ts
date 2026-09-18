import type { ClinicalCondition, ClassicalRemedy, PatentFormulation } from '../data/clinicalRepertoryData';

/**
 * Organ & Sensation Dictionary based on Kent & Boericke Repertories
 */

export interface OrganDefinition {
  id: string;
  nameEn: string;
  nameBn: string;
  keywords: string[];
}

export interface SensationDefinition {
  id: string;
  nameEn: string;
  nameBn: string;
  keywords: string[];
  remedies: ClassicalRemedy[];
  patents: PatentFormulation[];
  dietAndRegimen?: string;
  warningNotes?: string;
}

export const ANATOMICAL_ORGANS: OrganDefinition[] = [
  {
    id: 'throat',
    nameEn: 'Throat & Pharynx',
    nameBn: 'গলা ও খাদ্যনালী',
    keywords: ['গলা', 'throat', 'swallow', 'গিলতে', 'pharynx', 'larynx', 'tonsil', 'টনসিল', 'গলায়', 'গলায়']
  },
  {
    id: 'head',
    nameEn: 'Head, Forehead & Temples',
    nameBn: 'মাথা, কপাল ও রগ',
    keywords: ['মাথা', 'head', 'forehead', 'temple', 'কপাল', 'headache', 'migraine', 'মাথায়', 'মাথায়']
  },
  {
    id: 'skin',
    nameEn: 'Skin & Integumentary',
    nameBn: 'চামড়া ও ত্বক',
    keywords: ['চামড়া', 'ত্বক', 'skin', 'কড়া', 'কড়া', 'আঁচিল', 'ঘা', 'corn', 'wart', 'boil', 'চামড়া', 'rash', 'eczema', 'চুলকানি']
  },
  {
    id: 'nerve_spine',
    nameEn: 'Nerve & Spine',
    nameBn: 'স্নায়ু ও মেরুদণ্ড',
    keywords: ['নার্ভ', 'স্নায়ু', 'ঝিনঝিন', 'অবশ', 'মেরুদণ্ড', 'nerve', 'tingling', 'numbness', 'spine', 'মেরুদন্ড', 'স্নায়বিক', 'চিনচিন']
  },
  {
    id: 'stomach_abdomen',
    nameEn: 'Stomach & Abdomen',
    nameBn: 'পেট ও পরিপাকতন্ত্র',
    keywords: ['পেট', 'stomach', 'abdomen', 'gastric', 'লিভার', 'liver', 'নাভি', 'পেটে', 'গ্যাস', 'অম্বল', 'বমি']
  },
  {
    id: 'chest_respiratory',
    nameEn: 'Chest & Respiratory',
    nameBn: 'বুক ও ফুসফুস',
    keywords: ['বুক', 'কাশি', 'শ্বাস', 'chest', 'cough', 'breath', 'lungs', 'বুকে', 'হাঁপানি', 'কফ']
  },
  {
    id: 'joints_extremities',
    nameEn: 'Joints & Extremities',
    nameBn: 'হাত-পা ও জয়েন্ট',
    keywords: ['হাত', 'পা', 'হাঁটু', 'কোমর', 'joint', 'knee', 'leg', 'arm', 'back', 'হাটু', 'গাঁট', 'বাতের', 'হাড়']
  },
  {
    id: 'eye_ear',
    nameEn: 'Eye & Ear',
    nameBn: 'চোখ ও কান',
    keywords: ['চোখ', 'কান', 'eye', 'ear', 'অঞ্জনি', 'stye', 'চোখে', 'কানে', 'অঞ্জনী']
  }
];

export const CLINICAL_SENSATIONS: SensationDefinition[] = [
  // 1. SPLINTER / FISH BONE / সূঁচ-কাঁটা ফোটা
  {
    id: 'splinter_fish_bone',
    nameEn: 'Splinter / Fish Bone Sensation / Sharp Needle-Like Pain',
    nameBn: 'সূঁচ-কাঁটা ফোটার অনুভূতি ও ক্ষত',
    keywords: ['কাঁটা', 'কাটা', 'সূঁচ', 'splinter', 'fish bone', 'needle', 'বিঁধে', 'stitching', 'pricking', 'fishbone', 'ফুটছে', 'কাঁটাযুক্ত'],
    remedies: [
      {
        name: 'Silicea (Silica) 200C',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills twice daily, or dissolved in warm water in acute pain',
        keynotes: [
          'Promotes expulsion of foreign bodies, fish bones, splinters from tissues',
          'Sharp needle-like stitching sensations aggravated on cold contact',
          'Chilly constitution with suppurative tendency and throat constriction'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy to stimulate cellular reaction to expel fish bones, needles, splinters embedded in tissues. Relieves pricking like a needle.',
        modalities: { worse: 'Cold drafts, swallowing, dampness', better: 'Warmth, warm drinks, wrapping warmly' },
        aliases: ['silicea', 'silica', 'silicea 200c']
      },
      {
        name: 'Hepar Sulphuris Calcareum 200C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '200C',
        dosage: '4 pills 3 times daily dissolved in warm water',
        keynotes: [
          'Sticking, splinter-like pain in throat or tissues on swallowing, extending to ears',
          'Extreme hypersensitivity to cold air, touching neck or swallowing',
          'Throat feels plugged, inflamed with sharp sticking like a fish bone or thorn'
        ],
        materiaMedicaNotes: 'Kent: Splinters, fish bones sticking into the throat; sensation of a fish bone in the throat. Pains radiate into ears on swallowing.',
        modalities: { worse: 'Cold air, swallowing saliva or cold food, drafts', better: 'Warmth, warm wraps, warm moist heat' },
        aliases: ['hepar sulph', 'hepar sulphuris', 'hepar sulph 200c']
      },
      {
        name: 'Nitricum Acidum 30C',
        commonName: 'Nitric Acid',
        potency: '30C',
        dosage: '4 pills twice daily away from meals',
        keynotes: [
          'Sharp splinter-like pains on swallowing food or liquids',
          'Stitching pains as if sticking with pins or sharp fish needles, agonizing on deglutition',
          'Ulcerated sore throat or fissured mucous membranes with raw burning'
        ],
        materiaMedicaNotes: 'Boericke: Splinter-like pains appearing and disappearing quickly. Mucous membranes stitch and burn like a needle on deglutition.',
        modalities: { worse: 'Swallowing, cold changes of weather, night, touch', better: 'Riding in a carriage, gentle warmth' },
        aliases: ['nitric acid', 'nitricum acidum', 'nit acid']
      },
      {
        name: 'Argentum Nitricum 30C',
        commonName: 'Silver Nitrate',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Sensation of a fish bone or splinter embedded in throat when swallowing',
          'Painful raw inflammation, dark redness of fauces, uvula relaxed and elongated',
          'Persistent clearing of tenacious mucus with tickling irritable cough'
        ],
        materiaMedicaNotes: 'Kent: Sensation as if a splinter or fish bone were lodged in the pharynx; worse swallowing food or turning neck.',
        modalities: { worse: 'Warm room, swallowing food, emotional agitation', better: 'Cool open air, cold sips' },
        aliases: ['arg nit', 'argentum nitricum', 'argentum']
      }
    ],
    patents: [
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
        indications: 'Reduces local throat inflammation, mucosal irritation, catarrhal congestion, and glandular swelling.',
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
        aliases: ['tonsilat', 'sbl tonsilat']
      }
    ],
    dietAndRegimen: 'Sip warm water or lukewarm honey-lemon water. Avoid hard dry crusts, crunchy crackers, and chilled beverages that aggravate pharyngeal spasms.',
    warningNotes: 'If acute respiratory distress, severe stridor, or active bleeding is present, seek immediate ENT examination for direct laryngoscopic extraction.'
  },

  // 2. NUMBNESS / TINGLING / অবশ ও ঝিনঝিন
  {
    id: 'numbness_tingling',
    nameEn: 'Numbness, Tingling & Paresthesia / Peripheral Neuralgia',
    nameBn: 'হাত-পা অবশ, ঝিনঝিন ও চিনচিন করা',
    keywords: ['অবশ', 'ঝিনঝিন', 'চিনচিন', 'tingling', 'numbness', 'ঝিঁঝিঁ', 'paresthesia', 'pins and needles', 'অবশভাব', 'স্নায়ু দুর্বলতা'],
    remedies: [
      {
        name: 'Hypericum Perforatum 200C',
        commonName: "St. John's Wort",
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Premier remedy for nerve injury, nerve compression, and intense tingling',
          'Sharp darting, shooting pains along the nerve pathway with numbness',
          'Crawling sensations, hypersensitivity alternating with anesthesia'
        ],
        materiaMedicaNotes: 'Kent: The great remedy for injured nerves. Tingling, burning, and numbness following nerve irritation or trauma.',
        modalities: { worse: 'Cold, dampness, fog, touch', better: 'Bending head back, gentle rest' },
        aliases: ['hypericum', 'hypericum 200c', 'hypericum perf']
      },
      {
        name: 'Kali Phosphoricum 6X / 30C',
        commonName: 'Phosphate of Potassium',
        potency: '6X / 30C',
        dosage: '4 tablets dissolved in warm water 3 times daily',
        keynotes: [
          'Master biochemic nerve restorative for paresthesia, tingling, and nerve debility',
          'Numbness of extremities with physical exhaustion and mental fatigue',
          'Weakness of limbs, dragging sensations, nervous prostration'
        ],
        materiaMedicaNotes: 'Boericke: Conditions arising from lack of nerve power. Restores nerve conductivity and relieves numbness.',
        modalities: { worse: 'Mental & physical exertion, cold', better: 'Warmth, rest, gentle nourishment' },
        aliases: ['kali phos', 'kali phosphoricum', 'kali phos 6x']
      },
      {
        name: 'Causticum 200C',
        commonName: "Hahnemann's Tinctura Acris Sine Kali",
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Progressive numbness and weakness of peripheral nerves and single muscle groups',
          'Tingling and loss of muscular power from exposure to dry cold winds',
          'Heaviness of limbs with unsteady gait and tendency to drop objects'
        ],
        materiaMedicaNotes: 'Boericke: Local paralysis, vocal cords, muscles of deglutition, bladder, face, extremities. Numbness and loss of sensation.',
        modalities: { worse: 'Dry cold winds, clear fine weather', better: 'Damp wet weather, warm bed' },
        aliases: ['causticum', 'causticum 200c']
      },
      {
        name: 'Gnaphalium Polycephalum 30C',
        commonName: 'Sweet-scented Cudweed',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Intense pain along sciatic nerve followed by profound numbness of leg and foot',
          'Numbness alternating with sharp, darting neuralgic cramps',
          'Frequent tingling in toes and calves'
        ],
        materiaMedicaNotes: 'Boericke: Intense pain along the sciatic nerve; numbness alternates with pain. Better sitting in a chair.',
        modalities: { worse: 'Motion, walking, lying down', better: 'Sitting in a chair, drawing limbs up' },
        aliases: ['gnaphalium', 'gnaph']
      }
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R36 (Biological Neuralgia Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Re-establishes neuromuscular transmission, relieves numbness, tingling, sciatica, and nerve irritation.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r36', 'r-36', 'reckeweg 36', 'dr reckeweg r36']
      },
      {
        name: 'Wheezal WL-28 (Nerve Drops)',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Targeted homeopathic complex for tingling sensations, numbness in hands and feet, neural debility.',
        dosage: '10-15 drops in a little water 3 times daily.',
        mrp: 165,
        aliases: ['wl-28', 'wl 28', 'wheezal 28']
      },
      {
        name: 'SBL Five Phos 6X Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Essential 5-tissue biochemic mineral salts to nourish degraded nerve cells and alleviate numbness.',
        dosage: '4 tablets dissolved in warm water 3 times daily.',
        mrp: 135,
        aliases: ['five phos', 'sbl five phos']
      }
    ],
    dietAndRegimen: 'Rich source of Vitamin B-complex, leafy greens, nuts, seeds, and lukewarm water. Avoid prolonged sitting with legs crossed or pressure on nerves.',
    warningNotes: 'If weakness is rapidly ascending or accompanied by loss of bladder/bowel control, urgently refer for neurological assessment.'
  },

  // 3. BURNING / জ্বালা
  {
    id: 'burning_heat',
    nameEn: 'Burning Sensation & Metabolic Heat / Irritative Inflammation',
    nameBn: 'জ্বালা-পোড়া অনুভূতি ও অম্লপিত্ত',
    keywords: ['জ্বালা', 'পোড়া', 'burning', 'heat', 'burns', 'পোড়া', 'জ্বলন', 'জ্বলাপোড়া', 'জ্বলছে'],
    remedies: [
      {
        name: 'Arsenicum Album 30C',
        commonName: 'White Oxide of Arsenic',
        potency: '30C',
        dosage: '4 pills every 4 to 6 hours during acute burning',
        keynotes: [
          'Intense burning pains like hot coals, paradoxically relieved by heat and warm sips',
          'Great restlessness, anguish, driving patient out of bed or pacing room',
          'Thirst for small quantities of water at frequent intervals'
        ],
        materiaMedicaNotes: 'Kent: Burning is a supreme characteristic. Burning in chest, stomach, throat, skin. All burnings relieved by heat except headache.',
        modalities: { worse: 'Midnight (1-2 AM), cold air, cold drinks', better: 'Heat in general, warm applications, hot drinks' },
        aliases: ['arsenicum', 'ars alb', 'arsenicum album']
      },
      {
        name: 'Cantharis 30C',
        commonName: 'Spanish Fly',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Furious, violent burning sensations in urinary tract, stomach, or cutaneous lesions',
          'Burning, cutting pains like fire, intolerance to slightest pressure',
          'Vesicular eruptions with intense stinging and burning'
        ],
        materiaMedicaNotes: 'Boericke: Raw, burning pain; unquenchable thirst with disgust for all drinks. Constant desire to urinate with burning.',
        modalities: { worse: 'Touch, cold water, urinating', better: 'Warmth, gentle rubbing, rest' },
        aliases: ['cantharis', 'cantharis 30c']
      },
      {
        name: 'Sulphur 200C',
        commonName: 'Sublimed Sulphur',
        potency: '200C',
        dosage: '4 pills once in morning on empty stomach',
        keynotes: [
          'Burning of soles of feet (puts feet out of bed covers at night), palms, and vertex',
          'Burning of all orifices of the body with redness and acrid discharges',
          'Heat flashes, sinking sensation at epigastrium at 11 AM'
        ],
        materiaMedicaNotes: 'Kent: King of remedies for burning. Burning soles, burning skin, burning discharges, worse heat of bed.',
        modalities: { worse: 'Warmth of bed, bathing, standing, 11 AM', better: 'Dry warm weather, lying on right side' },
        aliases: ['sulphur', 'sulphur 200c']
      },
      {
        name: 'Phosphorus 30C',
        commonName: 'Yellow Phosphorus',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Burning sensations in spots along the spine, stomach, chest, or hands',
          'Great thirst for ice-cold water, which vomits as soon as it gets warm in stomach',
          'Burning heat running up the back'
        ],
        materiaMedicaNotes: 'Boericke: Burning pains in stomach, abdomen, between shoulder blades. Craves cold food and drinks.',
        modalities: { worse: 'Lying on left side, evening, physical exertion', better: 'Cold food, sleep, dark room' },
        aliases: ['phosphorus', 'phos']
      }
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R5 (Gastric & Epigastric Burning Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Neutralizes mucosal hyperacidity, epigastric burning, acid reflux, and mucosal inflammation.',
        dosage: '10-15 drops in a little water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r5', 'r-5', 'reckeweg 5', 'dr reckeweg r5']
      },
      {
        name: 'SBL Liv-T (Liver & Detox Tonic)',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Clears hepatobiliary congestion, regulates bile flow, and calms internal metabolic heat and burning.',
        dosage: '1-2 teaspoonfuls 3 times a day before meals.',
        mrp: 145,
        aliases: ['liv-t', 'sbl liv-t', 'liv t']
      },
      {
        name: 'Bakson Gastro Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Calms burning sensation in stomach and esophagus, relieves sour eructations and burning dyspepsia.',
        dosage: '1-2 tablets chewed or dissolved after meals.',
        mrp: 175,
        aliases: ['gastro aid', 'bakson gastro aid']
      }
    ],
    dietAndRegimen: 'Drink cooling coconut water, barley water, and stay adequately hydrated. Strictly avoid deep-fried foods, hot chili spices, and excess tea or coffee.',
    warningNotes: 'If burning is retrosternal with radiation to jaw/left arm or accompanied by cold sweat, immediately rule out acute coronary syndrome.'
  },

  // 4. CRAMP / SPASM / খিল ধরা
  {
    id: 'cramp_spasm',
    nameEn: 'Cramp, Muscular Spasm & Colic / Neuralgic Gripping',
    nameBn: 'খিল ধরা, পেশির টান ও তীব্র পেট মোচড়ানো',
    keywords: ['খিল', 'টান', 'মোচড়', 'spasm', 'cramp', 'colic', 'মোচড়', 'খিঁচুনি', 'টান ধরা', 'খিলধরা'],
    remedies: [
      {
        name: 'Magnesia Phosphorica 6X / 30C',
        commonName: 'Phosphate of Magnesia',
        potency: '6X / 30C',
        dosage: '4 tablets dissolved in hot water every 15-30 minutes during spasms',
        keynotes: [
          'Great anti-spasmodic biochemic remedy for sharp cramping pains and neuralgic spasms',
          'Pains darting, lightning-like, boring, relieved by warmth and hard pressure',
          'Cramps in calves, abdominal colic, and muscular twitching'
        ],
        materiaMedicaNotes: 'Boericke: The great anti-spasmodic remedy. Cramping of muscles with radiating pains. Always better by warmth and bending double.',
        modalities: { worse: 'Cold drafts, touch, night, cold bath', better: 'Warmth, hot pressure, bending double' },
        aliases: ['mag phos', 'magnesia phos', 'mag phos 6x']
      },
      {
        name: 'Colocynthis 200C',
        commonName: 'Bitter Cucumber',
        potency: '200C',
        dosage: '4 pills every 2-4 hours in acute colic',
        keynotes: [
          'Agonizing cramping, griping, and cutting pains causing patient to double up',
          'Presses hard objects into abdomen for relief; colic following anger or mortification',
          'Sciatic cramps shooting down limb like lightning'
        ],
        materiaMedicaNotes: 'Kent: Violent cramping, cutting, griping pains. Patient bends double, presses abdomen with hands or across bed rail.',
        modalities: { worse: 'Anger, indignation, eating, motion', better: 'Hard pressure, bending double, warmth' },
        aliases: ['colocynthis', 'colocynth', 'colocynthis 200c']
      },
      {
        name: 'Cuprum Metallicum 30C',
        commonName: 'Metallic Copper',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Violent spasmodic cramps starting in fingers and toes, spreading to calves and abdomen',
          'Cramps so severe that muscles form hard knots and flexors contract tightly',
          'Spasmodic cough or suffocative spasms'
        ],
        materiaMedicaNotes: 'Boericke: Spasmodic affections, cramps, convulsions starting in flexors and twitching of isolated muscles.',
        modalities: { worse: 'Cold air, night, contact', better: 'Drinking cold water, perspiration' },
        aliases: ['cuprum met', 'cuprum metallicum']
      },
      {
        name: 'Dioscorea Villosa 30C',
        commonName: 'Wild Yam',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Violent twisting colicky cramps in abdomen, paradoxical relief by bending backwards',
          'Pains radiate from umbilicus to chest, back, and arms',
          'Cramps aggravated by doubling up (opposite of Colocynthis)'
        ],
        materiaMedicaNotes: 'Boericke: Flatulent colic; pains suddenly shift to distant parts; better stretching out or bending backwards.',
        modalities: { worse: 'Bending double, lying down', better: 'Standing erect, bending backwards, motion in open air' },
        aliases: ['dioscorea', 'dioscorea villosa']
      }
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R37 (Colic & Muscle Spasm Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Colic and muscle spasm formulation for visceral cramping, intestinal spasm, and muscular cramps.',
        dosage: '10-15 drops in hot water every 30 minutes in acute spasm, then 3 times daily.',
        mrp: 310,
        aliases: ['r37', 'r-37', 'reckeweg 37', 'dr reckeweg r37']
      },
      {
        name: 'Bakson Colic Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Fast-acting relief from abdominal colic, flatulent cramps, and spasmodic gut contractions.',
        dosage: '10-15 drops in lukewarm water 3 times a day.',
        mrp: 150,
        aliases: ['colic aid', 'bakson colic aid']
      },
      {
        name: 'SBL Mag Phos 6X Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Natural biochemic muscle relaxant for neuralgic cramps, calf spasms, and abdominal griping.',
        dosage: '4 tablets dissolved in a cup of hot water taken in sips.',
        mrp: 135,
        aliases: ['mag phos', 'sbl mag phos']
      }
    ],
    dietAndRegimen: 'Apply warm fomentation or hot water bottle. Sip warm fluids. Ensure adequate intake of magnesium and potassium rich foods (bananas, coconut water).',
    warningNotes: 'If abdominal cramps are accompanied by rigid board-like abdomen, absent bowel sounds or high fever, immediately investigate for acute surgical abdomen.'
  },

  // 5. CORN / CALLUS / কড়া
  {
    id: 'corn_callus',
    nameEn: 'Corn, Callus & Hyperkeratosis / Epithelial Induration',
    nameBn: 'পায়ের কড়া, শক্ত চর্মরোগ ও আঁচিল',
    keywords: ['কড়া', 'কড়া', 'পায়ের কড়া', 'পায়ের কড়া', 'corn', 'callus', 'callosity', 'clavus', 'পায়ে কড়া'],
    remedies: [
      {
        name: 'Antimonium Crudum 200C',
        commonName: 'Black Sulphide of Antimony',
        potency: '200C',
        dosage: '4 pills twice daily on empty stomach',
        keynotes: [
          'Supreme specific for horny, thick, indurated calluses and corns on soles and palms',
          'Soles of feet so sensitive and tender that patient cannot walk on hard pavements',
          'Thick milky white coating on tongue with gastric derangement'
        ],
        materiaMedicaNotes: 'Kent: King of remedies for corns and callosities. Hard, horny excrescences on feet and hands; feet so tender can hardly touch the floor.',
        modalities: { worse: 'Heat of sun, radiant heat, cold bathing, over-eating', better: 'Open air, rest' },
        aliases: ['antim crud', 'antimonium crudum', 'antim crud 200c']
      },
      {
        name: 'Thuja Occidentalis 200C',
        commonName: 'Arbor Vitae',
        potency: '200C',
        dosage: '4 pills in morning and evening',
        keynotes: [
          'Premier anti-sycotic remedy for abnormal epithelial hyperkeratosis, corns, and warty excrescences',
          'Corns with burning, stinging, or aching pains when feet hang down',
          'Perspiration of uncovered parts only, oily skin with sycotic diathesis'
        ],
        materiaMedicaNotes: 'Boericke: Acts specifically on skin and genito-urinary organs. Corns, warts, and polypi with indurated base.',
        modalities: { worse: 'Cold damp air, 3 AM and 3 PM, rest', better: 'Warmth, dry weather' },
        aliases: ['thuja', 'thuja occ', 'thuja 200c']
      },
      {
        name: 'Silicea 30C / 200C',
        commonName: 'Pure Flint',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Painful, burning corns that ache on weather changes or walking',
          'Promotes softening, resolution, and painless shedding of hardened core',
          'Profuse offensive foot sweat with tender soles'
        ],
        materiaMedicaNotes: 'Kent: Corns with burning, stinging, aching. Promotes expulsion and softening of the central indurated kernel.',
        modalities: { worse: 'Cold, washing feet, damp weather', better: 'Warmth, warm wraps' },
        aliases: ['silicea', 'silica', 'silicea 30c']
      },
      {
        name: 'Ranunculus Bulbosus 30C',
        commonName: 'Bulbous Buttercup',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Corns painfully sensitive to touch and atmospheric changes',
          'Stinging and burning pain in corns, worse before stormy weather',
          'Vesicular and indurated lesions with bluish hue'
        ],
        materiaMedicaNotes: 'Boericke: One of our best remedies for the bad effects of alcohol, and for corns which are exquisitely sensitive to touch.',
        modalities: { worse: 'Touch, motion, change of weather, evening', better: 'Warmth, quiet' },
        aliases: ['ranunculus', 'ranunc bulb']
      }
    ],
    patents: [
      {
        name: 'SBL Thuja Ointment / Corn Paint',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube / 15ml Liquid',
        indications: 'Topical application for keratolytic softening and resolution of corns, calluses, and warty excrescences.',
        dosage: 'Clean foot with warm water, dry thoroughly, and apply locally morning and evening.',
        mrp: 95,
        aliases: ['thuja ointment', 'sbl thuja ointment', 'corn paint']
      },
      {
        name: 'Bakson Wart Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Systemic homeopathic tablets for corns, epithelial indurations, warts, and plantar callosities.',
        dosage: '1 tablet 3 times a day dissolved in mouth.',
        mrp: 170,
        aliases: ['wart aid', 'bakson wart aid']
      },
      {
        name: 'Dr. Reckeweg R17 (Tumor & Induration Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Constitutional formulation for abnormal cellular proliferation, epithelial indurations, and deep-seated corns.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 310,
        aliases: ['r17', 'r-17', 'reckeweg 17', 'dr reckeweg r17']
      }
    ],
    dietAndRegimen: 'Wear soft cushioned orthopedic footwear. Soak feet in warm Calendula water for 15 minutes before applying ointment. Never use unsterilized blades or scissors to cut corns.',
    warningNotes: 'Diabetic patients with corns must avoid self-debridement to prevent foot ulceration and secondary diabetic gangrene.'
  },

  // 6. STYE / অঞ্জনি
  {
    id: 'stye_hordeolum',
    nameEn: 'Stye (Hordeolum) & Blepharitis / Eyelid Inflammation',
    nameBn: 'চোখের অঞ্জনি ও পাতার ফোলা',
    keywords: ['অঞ্জনি', 'চোখে অঞ্জনি', 'stye', 'hordeolum', 'chalazion', 'styes', 'অঞ্জনী', 'চোখের পাতা ফোলা'],
    remedies: [
      {
        name: 'Staphysagria 30C / 200C',
        commonName: 'Stavesacre',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Premier specific for recurrent crops of styes and chalazia that leave hard nodules',
          'Itching of eyelid margins with sensation of hard pebble in eyelid',
          'Nervous diathesis, suppressed resentment or emotional irritation'
        ],
        materiaMedicaNotes: 'Kent: Supreme remedy for recurrent styes; one comes after another, leaving hard nodules or chalazia in the lids.',
        modalities: { worse: 'Touch, morning, anger', better: 'Rest, warmth' },
        aliases: ['staphysagria', 'staph', 'staphysagria 30c']
      },
      {
        name: 'Pulsatilla Nigricans 30C',
        commonName: 'Wind Flower',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Acute inflammatory stye especially on upper eyelid with bland yellow discharge',
          'Eyelids glued together in morning, itching and burning worse in warm room',
          'Thirstless, gentle weeping disposition, relieved by cool open air'
        ],
        materiaMedicaNotes: 'Boericke: Thick, profuse, yellow, bland discharges. Styes, especially on upper lid. Great itching and burning in eyes.',
        modalities: { worse: 'Warm closed room, evening, fatty food', better: 'Cool open air, cold wash' },
        aliases: ['pulsatilla', 'pulsatilla nig', 'puls']
      },
      {
        name: 'Hepar Sulphuris Calcareum 30C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '30C',
        dosage: '4 pills 3 times daily in warm water',
        keynotes: [
          'Extremely painful, throbbing stye exquisitely sensitive to touch and cold air',
          'Promotes early pointing and painless natural suppuration without incision',
          'Chilly patient who wants eye wrapped warmly'
        ],
        materiaMedicaNotes: 'Kent: The eye and lids are exceedingly sensitive to touch and cold. Throbbing and sticking pain in stye.',
        modalities: { worse: 'Cold drafts, touch, morning', better: 'Warm applications, covering eye warmly' },
        aliases: ['hepar sulph', 'hepar sulphuris', 'hepar 30c']
      },
      {
        name: 'Euphrasia Officinalis 30C',
        commonName: 'Eyebright',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Catarrhal blepharitis and burning styes with acrid, scalding lacrimation',
          'Eyelids red, swollen, agglutinated with constant burning irritation',
          'Bland nasal discharge with acrid eye discharge (opposite of Allium Cepa)'
        ],
        materiaMedicaNotes: 'Boericke: Manifests itself abnormally in inflammation of the conjunctival membrane. Acrid tears, lids swollen and burning.',
        modalities: { worse: 'Sunlight, wind, evening', better: 'Dark room, wiping eyes' },
        aliases: ['euphrasia', 'euphrasia off']
      }
    ],
    patents: [
      {
        name: 'Dr. Reckeweg R78 (Eye & Eyelid Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Controls acute and chronic inflammation of eyelids, styes, blepharitis, and conjunctival catarrh.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r78', 'r-78', 'reckeweg 78', 'dr reckeweg r78']
      },
      {
        name: 'SBL Euphrasia Eye Drops (Isotonic)',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '10 ml Eye Drops',
        indications: 'Soothing antiseptic isotonic eye drops for ocular redness, stinging, eyelid tenderness, and stye irritation.',
        dosage: '1-2 drops into affected eye 3 times daily.',
        mrp: 85,
        aliases: ['euphrasia eye drops', 'sbl euphrasia']
      },
      {
        name: 'Bakson Cineraria Maritima / Euphrasia Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '10 ml Drops',
        indications: 'Relieves ocular congestion, inflammatory burning of eyelid margins, and catarrhal irritation.',
        dosage: '1-2 drops into affected eye twice daily.',
        mrp: 95,
        aliases: ['cineraria euphrasia', 'bakson eye drops']
      }
    ],
    dietAndRegimen: 'Apply warm moist compresses for 5-10 minutes 3 times daily to promote gland drainage. Maintain strict hand hygiene; do not squeeze or puncture the stye.',
    warningNotes: 'If preseptal orbital cellulitis, visual impairment, or fever occurs, urgently refer to an ophthalmologist.'
  }
];

/**
 * Organ-specific default prescriptions when an anatomical organ is identified
 * but no specific sensation pathology is triggered.
 */
function getOrganDefaultCondition(organ: OrganDefinition, rawQuery: string): ClinicalCondition {
  switch (organ.id) {
    case 'throat':
      return {
        id: `organ-throat-${Date.now()}`,
        nameEn: 'Throat & Pharyngeal Irritation / টনসিল ও গলবিল প্রদাহ',
        nameBn: 'গলা ব্যথা, টনসিলাইটিস ও ঢোক গিলতে কষ্ট',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Pharyngeal Congestion, Catarrhal Sore Throat & Tonsillar Irritation',
        miasm: 'Psoric-Sycotic Acute Inflammatory Phase',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Belladonna 30C',
            commonName: 'Deadly Nightshade',
            potency: '30C',
            dosage: '4 pills every 3 hours in water',
            keynotes: ['Sudden violent onset, bright red congested throat, tonsils swollen and fiery', 'Throbbing carotids, hot dry flushed face with high fever', 'Aggravated by turning neck or swallowing liquids'],
            materiaMedicaNotes: 'Boericke: Great remedy for acute fiery inflammation. Throat red, dry, choking feeling, worse right side.',
            modalities: { worse: 'Touch, jarring, cold drafts', better: 'Semi-erect posture, warmth' },
            aliases: ['belladonna', 'bell']
          },
          {
            name: 'Phytolacca Decandra 30C',
            commonName: 'Poke Root',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Dark purplish-red fauces, shooting pain from throat to ears on swallowing', 'Aching in back and neck like bruised, great prostration', 'Cannot swallow anything hot; throat feels rough and scorched'],
            materiaMedicaNotes: 'Kent: Shooting pain extending from throat to ears on swallowing. Dark red congested fauces.',
            modalities: { worse: 'Swallowing hot drinks, rain, cold damp weather', better: 'Warm dry weather, resting' },
            aliases: ['phytolacca', 'phyto']
          },
          {
            name: 'Mercurius Solubilis 30C',
            commonName: 'Quicksilver',
            potency: '30C',
            dosage: '4 pills twice daily',
            keynotes: ['Profuse offensive salivation, flabby swollen tongue showing indentations of teeth', 'Constant urge to swallow, ulcers with yellowish coating on tonsils', 'Night sweat with chilliness and no relief'],
            materiaMedicaNotes: 'Boericke: Throat raw, sore, ulcerated. Excessive salivation, foul odor, worse night and changes of weather.',
            modalities: { worse: 'Night, warmth of bed, damp cold weather', better: 'Moderate temperature' },
            aliases: ['merc sol', 'mercurius']
          }
        ],
        patentFormulations: [
          {
            name: 'Bakson Throat Aid Tablets',
            brand: "Bakson's",
            company: 'Bakson Drugs & Pharmaceuticals',
            country: 'India',
            bottleSize: '75 Tablets',
            indications: 'Relieves sore throat, tonsillitis, difficulty swallowing, and mucosal congestion.',
            dosage: '1 tablet dissolved in mouth every 2 hours.',
            mrp: 165,
            aliases: ['throat aid', 'bakson throat aid']
          },
          {
            name: 'Dr. Reckeweg R1 (Biological Inflammation Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Reduces local throat inflammation, catarrhal congestion, and glandular swelling.',
            dosage: '10-15 drops in warm water 3 times daily.',
            mrp: 310,
            aliases: ['r1', 'r-1', 'reckeweg 1', 'dr reckeweg r1']
          }
        ],
        dietAndRegimen: 'Gargle with warm saline or Calendula tincture in warm water. Avoid icy water, sour tamarind, and cold drafts.',
        warningNotes: 'If high fever with trismus, difficulty opening mouth, or uvular deviation is noted, rule out peritonsillar abscess.'
      };

    case 'head':
      return {
        id: `organ-head-${Date.now()}`,
        nameEn: 'Cephalea & Cranial Neuralgia / মাথাব্যথা ও স্নায়বিক যন্ত্রণা',
        nameBn: 'মাথা ও কপালে তীব্র যন্ত্রণা এবং মাইগ্রেন',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Vasomotor Dysregulation, Congestive Cephalea & Cranial Neuralgia',
        miasm: 'Psoric-Sycotic Neuro-Vascular Congestion',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Belladonna 30C',
            commonName: 'Deadly Nightshade',
            potency: '30C',
            dosage: '4 pills every 3 hours',
            keynotes: ['Violent throbbing congestive headache, flushed face, red eyes and dilated pupils', 'Pain worse from light, noise, jar, lying flat', 'Relieved by tight binding or sitting upright'],
            materiaMedicaNotes: 'Kent: Sudden violent throbbing headache; carotids throb violently; worse light, jar, noise.',
            modalities: { worse: 'Jar, noise, light, motion', better: 'Sitting erect, hard pressure' },
            aliases: ['belladonna', 'bell']
          },
          {
            name: 'Spigelia Anthelmia 30C',
            commonName: 'Pinkroot',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Left-sided neuralgic headache starting in occiput, settling over left eye', 'Pain follows the sun, peaking at noon and declining at sunset', 'Violent sharp stitching pain on least touch or movement'],
            materiaMedicaNotes: 'Boericke: Pain begins in morning at base of skull, spreads over left eye, peaks at noon, subsides at night.',
            modalities: { worse: 'Motion, noise, touch, turning eyes', better: 'Lying on right side with head high' },
            aliases: ['spigelia', 'spig']
          },
          {
            name: 'Glonoine 30C',
            commonName: 'Nitroglycerine',
            potency: '30C',
            dosage: '4 pills every 2-4 hours',
            keynotes: ['Head feels enormously enlarged, pulsating with every heartbeat', 'Sun headaches or headaches from exposure to radiant heat or gas fumes', 'Cannot bear the least jar, hat, or collar'],
            materiaMedicaNotes: 'Boericke: Surging of blood to head and heart. Pulsating head, feels heavy but cannot lay it down.',
            modalities: { worse: 'Sun, heat of stove, motion, wine', better: 'Cold applications, elevating head' },
            aliases: ['glonoine', 'glon']
          }
        ],
        patentFormulations: [
          {
            name: 'Dr. Reckeweg R16 (Migraine & Neuralgia Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Controls migraine, congestive headache, occipital throbbing, and cranial neuralgia.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 310,
            aliases: ['r16', 'r-16', 'reckeweg 16']
          },
          {
            name: 'Bakson Mig Aid Tablets',
            brand: "Bakson's",
            company: 'Bakson Drugs & Pharmaceuticals',
            country: 'India',
            bottleSize: '75 Tablets',
            indications: 'Relieves migraine, periodic headaches, tension cephalea, and visual aura.',
            dosage: '1 tablet 3 times a day.',
            mrp: 175,
            aliases: ['mig aid', 'bakson mig aid']
          }
        ],
        dietAndRegimen: 'Rest in a quiet, darkened room. Avoid skipping meals, dehydration, and bright digital screens.',
        warningNotes: 'If headache is sudden thunderclap in onset with neck rigidity and vomiting, rule out subarachnoid hemorrhage.'
      };

    case 'skin':
      return {
        id: `organ-skin-${Date.now()}`,
        nameEn: 'Cutaneous Dermatitis & Pruritus / চর্মরোগ ও চুলকানি',
        nameBn: 'চামড়ার চুলকানি, ফুসকুড়ি ও একজিমা',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Dermal Hypersensitivity, Pruritic Dermatitis & Cutaneous Eruptions',
        miasm: 'Psoric Constitutional Dysmetabolism',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Sulphur 200C',
            commonName: 'Sublimed Sulphur',
            potency: '200C',
            dosage: '4 pills in morning once or twice weekly',
            keynotes: ['Voluptuous itching, scratching gives great satisfaction followed by intense burning', 'Worse warmth of bed, water, washing', 'Dry rough scaly skin with aversion to bathing'],
            materiaMedicaNotes: 'Kent: Master anti-psoric. Skin dry, scaly, unhealthy; every little injury suppurates. Itching worse heat of bed.',
            modalities: { worse: 'Warmth of bed, washing, 11 AM', better: 'Dry warm weather' },
            aliases: ['sulphur', 'sulph']
          },
          {
            name: 'Graphites 30C',
            commonName: 'Black Lead',
            potency: '30C',
            dosage: '4 pills twice daily in water',
            keynotes: ['Eruptions in bends of limbs, behind ears, groins with thick sticky honey-like exudation', 'Dry hard cracked skin with tendency to fissures', 'Patient chilly, pale, and inclined to obesity'],
            materiaMedicaNotes: 'Boericke: Skin rough, hard, persistent dryness; exudation of a thin, sticky, honey-like fluid.',
            modalities: { worse: 'Warmth, at night, menses', better: 'Dark, wrapping up' },
            aliases: ['graphites', 'graph']
          },
          {
            name: 'Rhus Toxicodendron 30C',
            commonName: 'Poison Ivy',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Vesicular eruptions with intense itching, redness and burning', 'Restlessness, patient cannot keep still', 'Relieved by hot water applications on the affected skin'],
            materiaMedicaNotes: 'Boericke: Red swollen skin with vesicular eruptions. Relieved by application of hot water.',
            modalities: { worse: 'Cold, wet rainy weather, night', better: 'Warm dry weather, hot water' },
            aliases: ['rhus tox', 'rhus']
          }
        ],
        patentFormulations: [
          {
            name: 'Dr. Reckeweg R23 (Eczema & Dermatosis Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Effective formulation for acute and chronic eczema, vesicular dermatitis, and pruritus.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 310,
            aliases: ['r23', 'r-23', 'reckeweg 23']
          },
          {
            name: 'SBL Skookum Chuck 3X Tablets',
            brand: 'SBL',
            company: 'SBL Pvt Ltd',
            country: 'India',
            bottleSize: '25g Tablets',
            indications: 'Special biochemic remedy for severe itching skin, scaly eczema, and urticaria.',
            dosage: '2 tablets twice daily with water.',
            mrp: 140,
            aliases: ['skookum chuck', 'sbl skookum']
          }
        ],
        dietAndRegimen: 'Wear loose cotton garments. Avoid harsh synthetic soaps and allergic triggers like eggs, prawns, or sour pickles.',
        warningNotes: 'If lesions spread rapidly with bullae, high fever, or skin detachment, evaluate for toxic erythema.'
      };

    case 'nerve_spine':
      return {
        id: `organ-nerve-${Date.now()}`,
        nameEn: 'Neuro-Spinal Irritation & Radiculopathy / স্নায়ু ও মেরুদণ্ডের ব্যথা',
        nameBn: 'নার্ভের সমস্যা, মেরুদণ্ড ও সায়াটিকা যন্ত্রণা',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Radicular Neuralgia, Neuro-Spinal Compression & Peripheral Irritation',
        miasm: 'Psoric-Sycotic Neuro-Degenerative Diathesis',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Hypericum Perforatum 200C',
            commonName: "St. John's Wort",
            potency: '200C',
            dosage: '4 pills twice daily',
            keynotes: ['Darting, shooting pains along nerves following compression or trauma', 'Numbness and crawling sensations', 'Hypersensitive spine, painful to touch'],
            materiaMedicaNotes: 'Boericke: Master remedy for nerve trauma, lacerations, spinal concussion. Relieves shooting burning pains.',
            modalities: { worse: 'Cold, dampness, touch', better: 'Bending head backwards' },
            aliases: ['hypericum', 'hyper']
          },
          {
            name: 'Kali Phosphoricum 6X',
            commonName: 'Phosphate of Potassium',
            potency: '6X',
            dosage: '4 tablets 3 times daily with warm water',
            keynotes: ['Nourishes exhausted nerve fibers, restores conduction', 'Weakness of back and limbs with trembling', 'Mental and physical exhaustion'],
            materiaMedicaNotes: 'Boericke: Restores nervous vitality. Premier biochemic tissue salt for nerve debility.',
            modalities: { worse: 'Exertion, cold', better: 'Warmth, rest' },
            aliases: ['kali phos', 'kali phos 6x']
          },
          {
            name: 'Causticum 200C',
            commonName: "Hahnemann's Tinctura Acris",
            potency: '200C',
            dosage: '4 pills twice daily',
            keynotes: ['Weakness of motor nerves, paralytic sensations', 'Heaviness of limbs with unsteady gait', 'Tension and contractures of tendons'],
            materiaMedicaNotes: 'Kent: Weakness and trembling of limbs, paralytic numbness worse dry cold weather.',
            modalities: { worse: 'Dry cold air', better: 'Damp rainy weather' },
            aliases: ['causticum', 'caust']
          }
        ],
        patentFormulations: [
          {
            name: 'Dr. Reckeweg R36 (Biological Neuralgia Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Restores neuromuscular conduction, relieves sciatic pains and tingling sensations.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 310,
            aliases: ['r36', 'r-36', 'reckeweg 36']
          },
          {
            name: 'Wheezal WL-28 (Nerve Drops)',
            brand: 'Wheezal',
            company: 'Wheezal Homoeo Pharma',
            country: 'India',
            bottleSize: '30 ml Drops',
            indications: 'Targeted nerve tonic for paresthesia, tingling, and neuro-spinal weakness.',
            dosage: '10-15 drops 3 times a day.',
            mrp: 165,
            aliases: ['wl-28', 'wl 28']
          }
        ],
        dietAndRegimen: 'Keep spine warm. Avoid lifting heavy weights or sudden twisting motions. Incorporate B-complex rich nutrition.',
        warningNotes: 'If progressive bilateral leg weakness or bowel/bladder sphincter loss occurs, urgently evaluate for cauda equina syndrome.'
      };

    case 'stomach_abdomen':
      return {
        id: `organ-stomach-${Date.now()}`,
        nameEn: 'Gastrointestinal Dyspepsia & Colic / পেট খারাপ ও বদহজম',
        nameBn: 'পেট ফাঁপা, অম্লপিত্ত, বদহজম ও পেটে মোচড়',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Gastric Mucosal Irritation, Dyspepsia & Intestinal Motility Disorder',
        miasm: 'Psoric Digestive Dysbiosis',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Nux Vomica 30C',
            commonName: 'Poison Nut',
            potency: '30C',
            dosage: '4 pills at bedtime or twice daily',
            keynotes: ['Sour eructations, heaviness in stomach like a stone 1-2 hours after eating', 'Frequent ineffectual urge for stool, irritable and chilly', 'Sedentary habits, excess tea, coffee, or rich spicy foods'],
            materiaMedicaNotes: 'Kent: Supreme remedy for indigestion from sedentary lifestyle, alcohol, rich foods, stimulants.',
            modalities: { worse: 'Morning, mental exertion, cold air', better: 'Evening, rest, warm drinks' },
            aliases: ['nux vomica', 'nux vom']
          },
          {
            name: 'Lycopodium Clavatum 30C',
            commonName: 'Club Moss',
            potency: '30C',
            dosage: '4 pills twice daily before food',
            keynotes: ['Excessive flatulence and abdominal distension, especially lower abdomen', 'Full after a few mouthfuls, hunger with fullness', 'Worse 4 PM to 8 PM, craving for warm food and sweets'],
            materiaMedicaNotes: 'Boericke: Dyspepsia with marked fermentation, gas rolling in abdomen, worse 4 to 8 PM.',
            modalities: { worse: '4 to 8 PM, cold food, pressure of clothes', better: 'Warm food and drinks, motion' },
            aliases: ['lycopodium', 'lyc']
          },
          {
            name: 'Carbo Vegetabilis 30C',
            commonName: 'Vegetable Charcoal',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Distension of upper abdomen, stomach feels full to bursting', 'Frequent loud eructations give temporary relief', 'Desires to be fanned rapidly, cold breath with internal burning'],
            materiaMedicaNotes: 'Boericke: Great remedy for flatulent distension. Upper abdomen hugely bloated, temporary relief from belching.',
            modalities: { worse: 'Rich fatty food, lying down', better: 'Belching, being fanned' },
            aliases: ['carbo veg', 'carbo']
          }
        ],
        patentFormulations: [
          {
            name: 'Dr. Reckeweg R5 (Gastric Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Controls hyperacidity, gastric burning, fullness after eating, and dyspepsia.',
            dosage: '10-15 drops in water 3 times daily before meals.',
            mrp: 310,
            aliases: ['r5', 'r-5', 'reckeweg 5']
          },
          {
            name: 'Bakson Gastro Aid Tablets',
            brand: "Bakson's",
            company: 'Bakson Drugs & Pharmaceuticals',
            country: 'India',
            bottleSize: '75 Tablets',
            indications: 'Fast relief from sour eructations, heartburn, and bloating.',
            dosage: '1-2 tablets chewed after meals.',
            mrp: 175,
            aliases: ['gastro aid', 'bakson gastro aid']
          }
        ],
        dietAndRegimen: 'Eat small, frequent, light meals. Avoid lying down immediately after eating. Drink lukewarm water.',
        warningNotes: 'If persistent vomiting of dark coffee-ground material or severe localized rebound tenderness occurs, urgently evaluate.'
      };

    case 'chest_respiratory':
      return {
        id: `organ-chest-${Date.now()}`,
        nameEn: 'Broncho-Pulmonary Congestion & Cough / কাশি ও শ্বাসকষ্ট',
        nameBn: 'কাশি, কফ জমা ও শ্বাসকষ্ট বিশ্লেষণ',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Bronchial Hyper-responsiveness, Mucociliary Congestion & Cough Reflex',
        miasm: 'Psoric-Tubercular Respiratory Sensitization',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Antimonium Tartaricum 30C',
            commonName: 'Tartar Emetic',
            potency: '30C',
            dosage: '4 pills 3 times daily in water',
            keynotes: ['Great rattling of mucus in chest with little or no expectoration', 'Suffocative coughing spells, patient feels drowned in secretions', 'Drowsiness, debility, and cyanotic lips'],
            materiaMedicaNotes: 'Boericke: Coarse rattling in chest; chest seems full of phlegm, but cannot bring it up.',
            modalities: { worse: 'Lying down, evening, warm room', better: 'Sitting erect, belching' },
            aliases: ['antim tart', 'antimonium tart']
          },
          {
            name: 'Bryonia Alba 30C',
            commonName: 'Wild Hops',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Dry, hacking, painful cough; patient holds chest with both hands when coughing', 'Stitching chest pain, worse from least movement or deep breathing', 'Great thirst for large gulps of cold water at long intervals'],
            materiaMedicaNotes: 'Kent: Dry, hard, painful cough. Patient must support chest with hands. Worse motion, better absolute rest.',
            modalities: { worse: 'Least motion, entering warm room', better: 'Absolute rest, pressure on chest' },
            aliases: ['bryonia', 'bry']
          },
          {
            name: 'Drosera Rotundifolia 30C',
            commonName: 'Round-leaved Sundew',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Paroxysmal spasmodic barking cough, coming in rapid suffocative fits', 'Tickling in larynx like a feather, choking and retching with cough', 'Cough worse immediately upon head touching pillow at night'],
            materiaMedicaNotes: 'Boericke: Spasmodic dry cough, paroxysms follow each other rapidly; choking and retching.',
            modalities: { worse: 'After midnight, lying down, warmth of bed', better: 'Open air, sitting up' },
            aliases: ['drosera', 'dros']
          }
        ],
        patentFormulations: [
          {
            name: 'SBL Stobal Cough Syrup',
            brand: 'SBL',
            company: 'SBL Pvt Ltd',
            country: 'India',
            bottleSize: '115 ml Syrup',
            indications: 'Effective soothing homeopathic syrup for dry, productive, and spasmodic coughs.',
            dosage: '1-2 teaspoonfuls 3 times a day in warm water.',
            mrp: 135,
            aliases: ['stobal', 'sbl stobal']
          },
          {
            name: 'Dr. Reckeweg R9 (Cough Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Controls catarrhal bronchial cough, tickling irritation in larynx, and asthmatic wheezing.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 310,
            aliases: ['r9', 'r-9', 'reckeweg 9']
          }
        ],
        dietAndRegimen: 'Inhale warm steam. Sip warm ginger or tulsi water. Keep chest and neck warmly wrapped; avoid cold drafts.',
        warningNotes: 'If respiratory rate is >30/min, accompanied by chest retractions or hemoptysis, urgently assess lung consolidation.'
      };

    case 'joints_extremities':
      return {
        id: `organ-joints-${Date.now()}`,
        nameEn: 'Arthritis, Rheumatism & Joint Stiffness / বাতের ব্যথা ও গাঁটের ফোলা',
        nameBn: 'গাঁটে গাঁটে ব্যথা, ফোলা ও চলাফেরায় যন্ত্রণা',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Synovial Inflammation, Articular Stiffness & Musculoskeletal Strain',
        miasm: 'Sycotic-Psoric Chronic Articular Diathesis',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Rhus Toxicodendron 200C',
            commonName: 'Poison Ivy',
            potency: '200C',
            dosage: '4 pills twice daily in water',
            keynotes: ['Stiffness and aching, worst at first movement after rest, distinctly relieved by continued gentle motion', 'Great restlessness; must change position frequently', 'Aggravated by damp, rainy weather or cold wet changes'],
            materiaMedicaNotes: 'Boericke: Great key: worse on beginning to move, better on continued motion. Aggravated by cold dampness.',
            modalities: { worse: 'Initial motion, rest, cold damp weather', better: 'Continued motion, warmth, hot baths' },
            aliases: ['rhus tox', 'rhus']
          },
          {
            name: 'Bryonia Alba 200C',
            commonName: 'Wild Hops',
            potency: '200C',
            dosage: '4 pills twice daily',
            keynotes: ['Swollen, hot, red, and exquisitely tender joints', 'Pain severely aggravated by the slightest movement, relieved by absolute rest and hard pressure', 'Stitching, tearing joint pains'],
            materiaMedicaNotes: 'Kent: Joints swollen, red, hot. Least motion causes agony. Better lying on the painful side, keeping quiet.',
            modalities: { worse: 'Any motion, exertion, heat', better: 'Absolute quiet rest, firm pressure' },
            aliases: ['bryonia', 'bry']
          },
          {
            name: 'Ledum Palustre 30C',
            commonName: 'Marsh Cistus',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Ascending rheumatism (starts in feet and travels upwards to ankles, knees)', 'Affected joint feels cold to touch, yet pain is intensely aggravated by heat of bed', 'Relieved by ice-cold water compresses'],
            materiaMedicaNotes: 'Boericke: Pains travel upwards. Lack of animal heat in affected parts, yet warmth makes pains worse; relieved by cold water.',
            modalities: { worse: 'Warmth of bed, warm coverings', better: 'Cold applications, putting feet in ice water' },
            aliases: ['ledum', 'ledum pal']
          }
        ],
        patentFormulations: [
          {
            name: 'Dr. Reckeweg R11 (Rheumatism & Lumbago Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Comprehensive German formulation for acute joint pain, arthritis, lumbago, and muscle stiffness.',
            dosage: '10-15 drops in water 3 times daily before meals.',
            mrp: 310,
            aliases: ['r11', 'r-11', 'reckeweg 11']
          },
          {
            name: 'Bakson Rheum Aid Tablets',
            brand: "Bakson's",
            company: 'Bakson Drugs & Pharmaceuticals',
            country: 'India',
            bottleSize: '75 Tablets',
            indications: 'Alleviates joint stiffness, uric acid diathesis, and musculoskeletal inflammation.',
            dosage: '1 tablet 3 times a day.',
            mrp: 185,
            aliases: ['rheum aid', 'bakson rheum aid']
          }
        ],
        dietAndRegimen: 'Gentle warm fomentation. Avoid cold damp surroundings. Limit high-purine foods if uric acid is elevated.',
        warningNotes: 'If an isolated joint is red-hot, swollen with high spiking fever, evaluate for acute septic arthritis.'
      };

    case 'eye_ear':
    default:
      return {
        id: `organ-eye-ear-${Date.now()}`,
        nameEn: 'Ocular & Aural Inflammation / চোখ ও কানের সমস্যা',
        nameBn: 'চোখ বা কানের প্রদাহ, জ্বালা ও অস্বস্তি',
        chipLabel: 'Materia Medica Offline Engine Active',
        pathology: 'Mucocutaneous Sensory Organ Catarrh & Inflammatory Congestion',
        miasm: 'Psoric-Sycotic Local Inflammatory State',
        typicalPresentation: rawQuery,
        keywords: [rawQuery],
        classicalRemedies: [
          {
            name: 'Pulsatilla Nigricans 30C',
            commonName: 'Wind Flower',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Profuse, thick, yellow, bland discharges without excoriation', 'Itching and burning in eyes or fullness in ears with bland catarrh', 'Worse in warm room, distinctly relieved in open fresh air'],
            materiaMedicaNotes: 'Boericke: Thick, profuse, yellow, bland discharge. Better in open cool air.',
            modalities: { worse: 'Warm closed room, evening', better: 'Open cool air, cold compresses' },
            aliases: ['pulsatilla', 'puls']
          },
          {
            name: 'Euphrasia Officinalis 30C',
            commonName: 'Eyebright',
            potency: '30C',
            dosage: '4 pills 3 times daily',
            keynotes: ['Acrid, scalding tears that burn the cheeks; eyelids red and swollen', 'Photophobia, sensitive to light and wind', 'Catarrhal conjunctivitis with frequent blinking'],
            materiaMedicaNotes: 'Kent: Profuse acrid burning lachrymation; eyes water constantly, smart and burn.',
            modalities: { worse: 'Sunlight, wind, evening', better: 'Dark room, cool wash' },
            aliases: ['euphrasia', 'euph']
          },
          {
            name: 'Hepar Sulphuris 30C',
            commonName: "Hahnemann's Calcium Sulphide",
            potency: '30C',
            dosage: '4 pills twice daily in warm water',
            keynotes: ['Sharp stitching pains like splinters or needles', 'Extreme sensitivity to cold air and touch; ears or eyes ache from drafts', 'Suppurative tendency with yellowish crusts'],
            materiaMedicaNotes: 'Boericke: Extreme sensitiveness to touch and cold air. Sharp sticking pains.',
            modalities: { worse: 'Cold drafts, touch', better: 'Warmth, covering warmly' },
            aliases: ['hepar sulph', 'hepar']
          }
        ],
        patentFormulations: [
          {
            name: 'Dr. Reckeweg R78 (Eye Inflammation Drops)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            country: 'Germany',
            bottleSize: '22 ml Drops',
            indications: 'Relieves ocular catarrh, eyelid inflammation, burning, and conjunctival redness.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 310,
            aliases: ['r78', 'r-78', 'reckeweg 78']
          },
          {
            name: 'SBL Euphrasia Eye Drops',
            brand: 'SBL',
            company: 'SBL Pvt Ltd',
            country: 'India',
            bottleSize: '10 ml Eye Drops',
            indications: 'Isotonic soothing drops for tired, burning, and inflamed eyes.',
            dosage: '1-2 drops into affected eye 3 times a day.',
            mrp: 85,
            aliases: ['euphrasia eye drops', 'sbl euphrasia']
          }
        ],
        dietAndRegimen: 'Rest eyes in subdued lighting. Wash with clean boiled lukewarm water. Avoid rubbing the eyes.',
        warningNotes: 'If severe deep eye pain, cloudy cornea, or sudden visual blur is noted, urgently refer to an eye specialist.'
      };
  }
}

/**
 * Zero-Dependency Multi-Layer NLP Organ & Sensation Parser & Repertory Synthesis.
 * Works 100% offline without any API dependency.
 */
export function synthesizeMateriaMedicaOffline(rawQuery: string): ClinicalCondition | null {
  const query = (rawQuery || '').toLowerCase().trim();

  // 1. Scan for Specific Clinical Sensations & Pathologies (Highest clinical priority)
  for (const sensation of CLINICAL_SENSATIONS) {
    for (const kw of sensation.keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (
        query === kwLower ||
        query.includes(kwLower) ||
        (kwLower.includes(query) && query.length >= 3)
      ) {
        // Matched sensation! Build condition from this clinical protocol
        return {
          id: `materia-medica-${sensation.id}-${Date.now()}`,
          nameEn: `Clinical Repertory Matching (Boericke & Kent Materia Medica Protocol)`,
          nameBn: `${sensation.nameBn} - রেপার্টরি প্রোটোকল`,
          chipLabel: 'Materia Medica Offline Engine Active',
          pathology: sensation.nameEn,
          miasm: 'Miasmatic & Materia Medica Individualization',
          typicalPresentation: rawQuery,
          keywords: [rawQuery, ...sensation.keywords],
          classicalRemedies: sensation.remedies,
          patentFormulations: sensation.patents,
          dietAndRegimen: sensation.dietAndRegimen || 'Sip warm water. Avoid raw onion, garlic, menthol, camphor, and strong coffee during treatment.',
          warningNotes: sensation.warningNotes || 'Clinical decision-support aid for Dr. M. A. Haque, M.D. (Homoeo). Correlate with physical examination.'
        };
      }
    }
  }

  // 2. Scan for Anatomical Targets (Organs)
  for (const organ of ANATOMICAL_ORGANS) {
    for (const kw of organ.keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (
        query === kwLower ||
        query.includes(kwLower) ||
        (kwLower.includes(query) && query.length >= 3)
      ) {
        return getOrganDefaultCondition(organ, rawQuery);
      }
    }
  }

  // 3. If no specific organ or sensation isolated:
  // Strictly return null so that the UI can guide the clinician with organ-specific rubric assistance
  // rather than returning unindividualized random polychrest medicines.
  return null;
}
