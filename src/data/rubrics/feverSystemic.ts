import type { ClinicalCondition } from '../clinicalRepertoryData';

export const FEVER_SYSTEMIC_CONDITIONS: ClinicalCondition[] = [
  // 50. High Fever, Hyperpyrexia & Influenza (তীব্র জ্বর / উচ্চ তাপমাত্রা / গা হাত-পা ব্যথা)
  {
    id: 'acute-fever-hyperpyrexia-influenza',
    nameEn: 'Acute High Fever, Hyperpyrexia & Influenza',
    nameBn: 'তীব্র জ্বর ও ইনফ্লুয়েঞ্জা (উচ্চ তাপমাত্রা, কাঁপুনি ও সারা শরীরে প্রচণ্ড ব্যথা)',
    chipLabel: 'Fever / তীব্র জ্বর ও ইনফ্লুয়েঞ্জা',
    pathology: 'Acute Pyrexia, Hypothalamic Thermoregulatory Set-Point Elevation, Cytokine Cascade (IL-1, TNF-alpha) & Viral/Bacterial Toxemia',
    miasm: 'Acute Psoric Inflammatory Storm with Syphilitic Hyperpyrexia',
    typicalPresentation: 'Sudden onset of high spiking body temperature (102°F–105°F), violent chills/shivering, flushed face, hot dry burning skin, severe bone-breaking aches, intense thirst or total thirstlessness',
    keywords: [
      'fever', 'high fever', 'জ্বর', 'গা গরম', 'flu', 'influenza', 'hyperpyrexia', 'chills and fever',
      'তীব্র জ্বর', 'তাপমাত্রা বৃদ্ধি', 'bodyache fever', 'সর্দি জ্বর', 'কাঁপুনি দিয়ে জ্বর', 'ভাইরাল ফিভার'
    ],
    classicalRemedies: [
      {
        name: 'Aconitum Napellus 30C / 200C',
        commonName: 'Monkshood',
        potency: '30C / 200C',
        dosage: '4 pills every 1-2 hours during the first 24 hours of sudden fever storm',
        keynotes: [
          'Sudden, violent, stormy onset of high fever after sudden exposure to cold, dry winds or chilling drafts',
          'Skin is burning hot, dry, and red; intense thirst for large quantities of cold water',
          'Extreme, agonizing mental anxiety, agitation, restlessness, and superstitious fear of death'
        ],
        materiaMedicaNotes: 'Boericke: Physical and mental restlessness, fright, is the most essential manifestation. Sudden violent high fever with hot dry skin after dry cold wind exposure.',
        modalities: { worse: 'Evening, night, warm room, dry cold wind', better: 'Open air, quiet rest' },
        aliases: ['aconite', 'aconitum']
      },
      {
        name: 'Belladonna 30C / 200C',
        commonName: 'Deadly Nightshade',
        potency: '30C / 200C',
        dosage: '4 pills every 2 hours in water',
        keynotes: [
          'High congestive fever with intense burning radiant heat (heat radiates from skin like an oven)',
          'Flushed, fiery crimson-red face, throbbing carotid arteries, and widely dilated pupils',
          'Delirium during fever, sees ghosts or frightful visions; hot head with cold extremities'
        ],
        materiaMedicaNotes: 'Kent: Great congestive fever. Heat radiates from body; red face, throbbing carotids, dilated pupils, delirium with high heat.',
        modalities: { worse: 'Touch, jar, noise, bright light, lying flat', better: 'Semi-erect rest, warmth' },
        aliases: ['belladonna', 'bell']
      },
      {
        name: 'Gelsemium Sempervirens 30C / 200C',
        commonName: 'Yellow Jasmine',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'The 3 "D"s of Gelsemium fever: Dullness, Drowsiness, and Dizziness',
          'Slow, insidious onset of viral fever; heavy, drooping eyelids (can hardly keep eyes open)',
          'Complete absence of thirst despite high fever; patient wants to lie quiet and still; chills run up and down spine'
        ],
        materiaMedicaNotes: 'Boericke: Complete absence of thirst. Deep muscular soreness, dullness, drowsiness, and trembling. Chills run up and down back.',
        modalities: { worse: 'Damp weather, motion, excitement', better: 'Profuse watery urination, rest' },
        aliases: ['gelsemium', 'gels']
      },
      {
        name: 'Eupatorium Perfoliatum 30C / 200C',
        commonName: 'Bone-Set',
        potency: '30C / 200C',
        dosage: '4 pills every 2-3 hours during acute flu body aches',
        keynotes: [
          'Excruciating, deep-seated aching in bones as if every single bone in the body were broken or fractured',
          'Intense aching in back, limbs, and wrists, accompanied by high fever and severe shivering chills',
          'Intense thirst for cold water before and during the chill; vomiting of bile as chill passes off'
        ],
        materiaMedicaNotes: 'Boericke: Relieves bone-breaking aches and pain in limbs and back accompanying influenza and malaria. Great thirst before chill.',
        modalities: { worse: 'Motion, 7 to 9 AM', better: 'Rest, sweating' },
        aliases: ['eupatorium', 'eup perf', 'boneset']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R1 (Anginacid & Fever Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for acute febrile states, high body temperature, septic inflammation, and influenza.',
        dosage: '10-15 drops in water every 1-2 hours during high fever; reduce to 3 times daily as temperature normalizes.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'SBL AF-Tabs (Anti-Flu / Fever Tablets)',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Rapidly reduces high body temperature, eases bone-breaking body aches, and controls influenza catarrh.',
        dosage: '2 tablets dissolved in warm water every 3 hours.',
        mrp: 135,
        aliases: ['af-tabs', 'sbl af-tabs']
      },
      {
        name: 'Bakson Fever Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Brings down high temperature safely, relieves muscular soreness, and prevents febrile exhaustion.',
        dosage: '1-2 teaspoonfuls with water 3 times a day.',
        mrp: 145,
        aliases: ['fever aid', 'bakson fever aid']
      }
    ],
    dietAndRegimen: 'Apply cool water sponging on forehead, arms, and legs if temperature rises above 102°F. Offer ample fluids (boiled cooled water, coconut water, fresh fruit juices, hot barley water) to prevent dehydration. Keep patient resting in a quiet, well-ventilated room with light breathable cotton clothing.',
    warningNotes: 'If high fever is accompanied by stiff neck (inability to touch chin to chest), petechial purple skin rash, altered sensorium/confusion, or febrile convulsions in children, transfer immediately to emergency hospital care to rule out acute bacterial meningitis or encephalitis.'
  }
];
