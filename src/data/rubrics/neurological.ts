import type { ClinicalCondition } from '../clinicalRepertoryData';

export const NEUROLOGICAL_CONDITIONS: ClinicalCondition[] = [
  // 40. Numbness & Tingling Paresthesia (হাত-পা অবশ / ঝিমঝিম করা / রক্ত চলাচল কম)
  {
    id: 'numbness-tingling-paresthesia',
    nameEn: 'Peripheral Neuropathy, Numbness & Tingling',
    nameBn: 'হাত-পা অবশ ও ঝিমঝিম করা (পেরিফেরাল নিউরোপ্যাথি ও অবশ ভাব)',
    chipLabel: 'Numbness / হাত-পা অবশ ও ঝিমঝিম',
    pathology: 'Peripheral Sensory Neuropathy, Diabetic Microvascular Nerve Ischemia & Paresthesia (pins-and-needles sensation)',
    miasm: 'Syphilitic Nerve Degeneration with Psoric Hypoesthesia',
    typicalPresentation: 'Persistent pins-and-needles crawling sensations in hands, fingers, soles, and toes; dead numbness, feeling of walking on velvet or sponge, burning soles',
    keywords: [
      'numbness', 'tingling', 'হাত অবশ', 'পা অবশ', 'ঝিমঝিম', 'paresthesia', 'pins and needles',
      'peripheral neuropathy', 'হাত পা ঝিমঝিম', 'dead feeling fingers', 'burning feet',
      'diabetic neuropathy', 'হাত পায়ে রক্ত চলাচল কম'
    ],
    classicalRemedies: [
      {
        name: 'Hypericum Perforatum 200C',
        commonName: "St. John's Wort",
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Master remedy for peripheral nerve damage, nerve injury, and agonizing neuralgic numbness',
          'Tingling, crawling, and burning sensations in fingers, palms, and soles; parts feel numb and dead',
          'Pains shoot upwards along the course of the affected nerves'
        ],
        materiaMedicaNotes: 'Boericke: Sovereign remedy for injured nerves. Numbness, crawling, and tingling in limbs. Preserves vitality of nerve fibers.',
        modalities: { worse: 'Cold damp air, touch, jar', better: 'Quiet rest, warmth' },
        aliases: ['hypericum', 'hyper']
      },
      {
        name: 'Secale Cornutum 30C',
        commonName: 'Ergot of Rye',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe peripheral circulatory insufficiency with coldness and dead numbness of fingers and toes',
          'Intense internal burning heat in limbs, yet the skin feels icy cold to touch',
          'Cannot bear any covering or warmth; patient insists on keeping limbs uncovered in cold air'
        ],
        materiaMedicaNotes: 'Kent: Fingers and toes feel numb, dead, and icy cold to touch, yet patient refuses all warmth and covering.',
        modalities: { worse: 'Warmth, heat of bed', better: 'Cold air, uncovering' },
        aliases: ['secale', 'secale cor']
      },
      {
        name: 'Heloderma 30C',
        commonName: 'Gila Monster Venom',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Profound arctic icy coldness in extremities, with numbness of feet as if walking on sponges',
          'Trembling, weakness, and loss of sensation in hands and feet',
          'Patient feels as if frozen from within; gait unsteady'
        ],
        materiaMedicaNotes: 'Boericke: Arctic coldness. Sensation of walking on sponge. Trembling and numbness of limbs.',
        modalities: { worse: 'Cold weather', better: 'Warmth' },
        aliases: ['heloderma']
      },
      {
        name: 'Plumbum Metallicum 30C / 200C',
        commonName: 'Metallic Lead',
        potency: '30C / 200C',
        dosage: '4 pills twice weekly in evening',
        keynotes: [
          'Peripheral neuritis with progressive motor weakness and numbness; wrist-drop and foot-drop',
          'Muscles of hands and calves atrophy and feel numb; loss of tendon reflexes',
          'Associated with obstinate constipation and colicky abdominal pains'
        ],
        materiaMedicaNotes: 'Kent: Chronic peripheral neuritis with muscular atrophy and numbness. Sensation of deadness in extremities.',
        modalities: { worse: 'Night, motion', better: 'Hard pressure, rubbing' },
        aliases: ['plumbum', 'plumbum met']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R70 (Neuralgin / Neuropathy Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for peripheral neuropathy, paresthesia, tingling in extremities, and neuralgic numbness.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r70', 'reckeweg 70']
      },
      {
        name: 'SBL Biochemic Kali Phosphoricum 6X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Essential nerve tissue salt that revitalizes damaged neurons, nourishes nerve sheaths, and restores sensation.',
        dosage: '4 tablets dissolved in warm water 3 times a day.',
        mrp: 135,
        aliases: ['kali phos 6x', 'sbl kali phos']
      },
      {
        name: 'Bakson Neuro Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Improves peripheral microcirculation, eliminates numbness in hands and feet, and relieves nerve burning.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 175,
        aliases: ['neuro aid', 'bakson neuro aid']
      }
    ],
    dietAndRegimen: 'Monitor blood sugar levels strictly (HbA1c below 6.5%). Check Vitamin B12 and folate levels. Avoid smoking and alcohol. Inspect feet daily for unperceived cuts or abrasions. Wear seamless, padded diabetic socks.',
    warningNotes: 'If numbness ascends rapidly up both legs accompanied by progressive symmetrical weakness and loss of reflexes (Guillain-Barré syndrome), hospitalize immediately for neurological ICU monitoring.'
  },

  // 41. Migraine & Throbbing Headache (মাইগ্রেন / আধকপালি মাথাব্যথা / আলো-শব্দে বৃদ্ধি)
  {
    id: 'migraine-throbbing-headache',
    nameEn: 'Migraine, Hemicrania & Throbbing Headache',
    nameBn: 'মাইগ্রেন ও আধকপালি মাথাব্যথা (মাথার একপাশে তীব্র দপদপানি ও বমি ভাব)',
    chipLabel: 'Migraine / মাইগ্রেন ও মাথাব্যথা',
    pathology: 'Neurovascular Cephalea, Trigeminal-Vascular System Activation, Cortical Spreading Depression & Intracranial Vasodilatation',
    miasm: 'Psoric-Sycotic Neurovascular Paroxysmal Diathesis',
    typicalPresentation: 'Unilateral pulsating, pounding, hammering headache accompanied by nausea/vomiting, visual aura (scintillating scotoma), extreme intolerance to light (photophobia) and sound (phonophobia)',
    keywords: [
      'migraine', 'headache', 'মাইগ্রেন', 'মাথাব্যথা', 'আধকপালি', 'hemicrania', 'throbbing head',
      'একপাশে মাথাব্যথা', 'আলোতে মাথাব্যথা বৃদ্ধি', 'বমি বমি ভাব ও মাথা ব্যথা', 'sick headache',
      'মাথার একপাশে দপদপানি', 'aura headache'
    ],
    classicalRemedies: [
      {
        name: 'Sanguinaria Canadensis 30C / 200C',
        commonName: 'Blood Root',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily in water during attack',
        keynotes: [
          'Classic right-sided migraine; pain begins in occiput, ascends to vertex and settles firmly over the right eye',
          'Pain increases in intensity from morning sun rise to midday and declines towards sunset (sun headache)',
          'Cannot tolerate light or noise; terminating with copious urination or vomiting of bile'
        ],
        materiaMedicaNotes: 'Boericke: Right-sided headache; begins in occiput, settles over right eye. Worse from motion, light, and noise. Better by quiet darkness and sleep.',
        modalities: { worse: 'Motion, noise, light, turning head', better: 'Lying quiet in dark room, sleep, profuse urination' },
        aliases: ['sanguinaria', 'sang']
      },
      {
        name: 'Spigelia Anthelmia 30C / 200C',
        commonName: 'Pinkroot',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Classic left-sided migraine; starts in occiput, radiates forward and fixes over left eye and orbit',
          'Pain is sharp, piercing, stabbing, needle-like; eye feels too large for socket',
          'Follows the course of the sun: rises in morning, peaks at noon, subsides at sunset'
        ],
        materiaMedicaNotes: 'Kent: Left-sided neuralgic headache. Settles over left eye; eyeball feels too large for orbit. Follows the course of the sun.',
        modalities: { worse: 'Touch, motion, noise, jar, turning eyes', better: 'Lying on right side with head elevated' },
        aliases: ['spigelia', 'spig']
      },
      {
        name: 'Iris Versicolor 30C',
        commonName: 'Blue Flag',
        potency: '30C',
        dosage: '4 pills every 2-3 hours during attack',
        keynotes: [
          'Sick headache preceded by visual aura, blurriness, or floating spots in field of vision',
          'Violent vomiting of intensely sour, acidic, or bitter bilious fluid that burns the throat',
          'Headache recurs periodically every week (Sunday or weekend migraine)'
        ],
        materiaMedicaNotes: 'Boericke: Sick headache with profuse sour vomiting. Begins with a blur before eyes. Periodic migraine.',
        modalities: { worse: 'Rest, periodically (weekends)', better: 'Continued gentle motion' },
        aliases: ['iris versicolor', 'iris']
      },
      {
        name: 'Belladonna 30C / 200C',
        commonName: 'Deadly Nightshade',
        potency: '30C / 200C',
        dosage: '4 pills every 1-2 hours during intense throbbing',
        keynotes: [
          'Violent throbbing, pulsating, hammering headache in forehead and temples; carotids throb visibly',
          'Flushed, hot, crimson-red face, dilated pupils, and red conjunctiva',
          'Exquisitely sensitive to light, noise, and slightest jar of the bed'
        ],
        materiaMedicaNotes: 'Kent: Sudden onset of throbbing hammering headache. Flushed face, dilated pupils, cannot bear the slightest jar.',
        modalities: { worse: 'Light, noise, jar, touch, lying flat', better: 'Semi-erect posture, dark quiet room, tight bandaging' },
        aliases: ['belladonna', 'bell']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R16 (Migränin / Migraine Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for migraine, neuralgic headaches, hemicrania, and nervous cephalea.',
        dosage: '10-15 drops in water every 1-2 hours during attack; 10 drops twice daily as preventive.',
        mrp: 310,
        aliases: ['r16', 'reckeweg 16']
      },
      {
        name: 'SBL Migron Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Alleviates throbbing hemicrania, stops sick bilious vomiting, and relieves visual aura.',
        dosage: '2 tablets 3 times daily during attack.',
        mrp: 140,
        aliases: ['migron', 'sbl migron']
      },
      {
        name: 'Bakson Migraid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Controls recurring vascular migraines, reduces frequency of headache attacks, and relieves photophobia.',
        dosage: '1 tablet 3 times a day.',
        mrp: 165,
        aliases: ['migraid', 'bakson migraid']
      }
    ],
    dietAndRegimen: 'Rest quietly in a dark, silent, well-ventilated room with a cool compress on forehead. Identify and avoid dietary triggers (aged cheese, chocolate, red wine, MSG, artificial sweeteners). Maintain consistent sleep schedule and do not skip meals.',
    warningNotes: 'If patient presents with sudden-onset explosive "thunderclap" headache (worst headache of life), neck stiffness (meningismus), or focal neurological deficits, arrange immediate emergency brain CT/MRI to rule out subarachnoid hemorrhage.'
  },

  // 42. Vertigo & Dizziness / Meniere's Disease (মাথা ঘোরা / মাথা চক্কর দেওয়া / টলমল করা)
  {
    id: 'vertigo-dizziness-menieres',
    nameEn: "Vertigo, Dizziness & Meniere's Disease",
    nameBn: 'মাথা ঘোরা ও মাথা চক্কর দেওয়া (ভার্টিগো, মেনিয়ার্স ডিজিজ ও কানের ভেতর ভোঁ ভোঁ শব্দ)',
    chipLabel: 'Vertigo / মাথা ঘোরা ও ভার্টিগো',
    pathology: 'Vestibular System Dysfunction, Benign Paroxysmal Positional Vertigo (BPPV), Endolymphatic Hydrops (Meniere’s) & Vertebrobasilar Insufficiency',
    miasm: 'Psoric Neurological Reactivity with Sycotic Labyrinthine Congestion',
    typicalPresentation: 'Rotatory sensation (room spinning or patient spinning), unsteadiness on walking with tendency to fall, tinnitus (ringing/buzzing in ears), nausea and cold sweats on turning head',
    keywords: [
      'vertigo', 'dizziness', 'মাথা ঘোরা', 'মাথা চক্কর', 'menieres', 'bppv', 'spinning head',
      'ভার্টিগো', 'মাথা ঘোরা ও বমি', 'tinnitus vertigo', 'কানে ভোঁ ভোঁ শব্দ', 'মাথা ঘুরলে টলে যাওয়া',
      'room spinning', 'পোস্টুরাল ভার্টিগো'
    ],
    classicalRemedies: [
      {
        name: 'Conium Maculatum 30C / 200C',
        commonName: 'Poison Hemlock',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Premier sovereign specific for positional vertigo; violent vertigo on turning the head sideways or rolling over in bed',
          'Sensation as if bed were spinning in a circle; patient must keep head perfectly still',
          'Especially suited to elderly people and individuals with sedentary habits or glandular indurations'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy for vertigo. Vertigo when lying down and when turning over in bed, or moving head sideways. Room seems to spin around.',
        modalities: { worse: 'Turning head, rolling over in bed, moving eyes', better: 'Keeping head perfectly still, dark room' },
        aliases: ['conium', 'conium mac']
      },
      {
        name: 'Gelsemium Sempervirens 30C',
        commonName: 'Yellow Jasmine',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Vertigo spreading upwards from the occiput; feels intoxicated and cannot walk straight',
          'Drowsiness, heavy drooping eyelids, and blurred or double vision (diplopia)',
          'Loss of muscular coordination with absence of thirst'
        ],
        materiaMedicaNotes: 'Kent: Vertigo spreading from the occiput with dullness and drowsiness. Gait is staggering like an intoxicated person.',
        modalities: { worse: 'Sudden movement, walking', better: 'Lying with head elevated, profuse urination' },
        aliases: ['gelsemium', 'gels']
      },
      {
        name: 'Chininum Sulphuricum 3X / 30C',
        commonName: 'Sulphate of Quinine',
        potency: '3X / 30C',
        dosage: '2 tablets 3X twice daily or 4 pills 30C',
        keynotes: [
          "Classic specific for Meniere's disease; violent rotatory vertigo accompanied by loud ringing, buzzing, and roaring tinnitus in ears",
          'Auditory nerve hypersensitivity with progressive hardness of hearing',
          'Periodic attacks associated with cold shivers'
        ],
        materiaMedicaNotes: "Boericke: Specific for Meniere's disease. Violent vertigo with roaring and buzzing in ears and impaired hearing.",
        modalities: { worse: 'Turning head, touch', better: 'Rest' },
        aliases: ['chininum sulph', 'chinin sulph']
      },
      {
        name: 'Cocculus Indicus 30C',
        commonName: "Indian Cockle",
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Vertigo accompanied by intense nausea and vomiting, aggravated by riding in a car, train, or boat',
          'Sensation as if the head were empty, hollow, or floating in air',
          'Triggered by loss of sleep, night-watching, or mental exhaustion'
        ],
        materiaMedicaNotes: 'Kent: Vertigo with nausea and vomiting, worse from motion of a carriage or boat. Sensation of emptiness in head.',
        modalities: { worse: 'Motion of vehicles, loss of sleep, eating', better: 'Lying quietly on side' },
        aliases: ['cocculus', 'cocc']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R29 (Theridon / Vertigo Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: "German specific for positional vertigo, Meniere's disease, labyrinthitis, and cerebral vascular dizziness.",
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r29', 'reckeweg 29']
      },
      {
        name: 'Bakson Vertigo Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Stabilizes inner ear balance, stops spinning sensations, and relieves vestibular nausea.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 165,
        aliases: ['vertigo aid', 'bakson vertigo']
      },
      {
        name: 'SBL Biochemic Kali Phosphoricum 6X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Nourishes cerebral circulation and inner ear acoustic nerves in elderly dizziness.',
        dosage: '4 tablets 3 times a day with warm water.',
        mrp: 135,
        aliases: ['kali phos 6x', 'sbl kali phos']
      }
    ],
    dietAndRegimen: 'Perform the Epley maneuver under professional guidance if BPPV (otolith displacement) is diagnosed. Avoid sudden jerky head turns. Restrict dietary sodium to under 2g/day in Meniere’s syndrome to reduce endolymphatic fluid pressure. Avoid caffeine and nicotine.',
    warningNotes: 'If vertigo is accompanied by acute focal neurological deficits (dysarthria/slurred speech, facial asymmetry, limb ataxia, diplopia), rule out posterior circulation cerebellar stroke (vertebrobasilar stroke) immediately with a Brain MRI.'
  },

  // 43. Motion Sickness & Travel Nausea (গাড়িতে বমি ভাব / বাস বা নৌকায় মাথা ঘোরা)
  {
    id: 'motion-sickness-travel-nausea',
    nameEn: 'Motion Sickness, Travel Sickness & Car Sickness',
    nameBn: 'মোশন সিকনেস ও গাড়িতে বমি ভাব (বাস, গাড়ি বা নৌকায় চড়লে মাথা ঘোরা ও বমি)',
    chipLabel: 'Motion Sickness / গাড়িতে বমি ভাব',
    pathology: 'Sensory Conflict (Mismatch between vestibular labyrinthine inputs and visual ocular signals) provoking autonomic emetic reflex',
    miasm: 'Psoric Sensory Hyper-reactivity',
    typicalPresentation: 'Nausea, cold sweating, pallor, dizziness, and persistent vomiting triggered by riding in a car, bus, train, plane, or ship; inability to read or look at moving objects',
    keywords: [
      'motion sickness', 'car sickness', 'গাড়িতে বমি', 'travel nausea', 'sea sickness', 'বাসে বমি ভাব',
      'vomiting in car', 'মোশন সিকনেস', 'গাড়িতে মাথা ঘোরা', 'travel sickness', 'বমি বমি ভাব গাড়িতে'
    ],
    classicalRemedies: [
      {
        name: 'Cocculus Indicus 30C',
        commonName: "Indian Cockle",
        potency: '30C',
        dosage: '4 pills 1 hour before travel, and repeat every 2 hours during long journeys',
        keynotes: [
          'The world’s leading premier homeopathic specific for motion sickness, sea sickness, and car sickness',
          'Nausea and violent vomiting caused by riding in a car, carriage, boat, or looking at moving water',
          'Severe dizziness and faintness on raising head, with profound aversion to food and its smell'
        ],
        materiaMedicaNotes: 'Boericke: Supreme remedy for motion sickness. Car and train sickness, sea sickness. Nausea with faintness on rising or riding.',
        modalities: { worse: 'Motion of vehicles, sitting up, smell of food', better: 'Lying flat on side, quiet rest' },
        aliases: ['cocculus', 'cocc']
      },
      {
        name: 'Tabacum 30C',
        commonName: 'Tobacco',
        potency: '30C',
        dosage: '4 pills dissolved in water during travel',
        keynotes: [
          'Insupportable, deathly, agonizing nausea and continuous vomiting with cold clammy sweat over face',
          'Extreme pallor, coldness of hands and feet; patient uncovers the abdomen to get relief',
          'Instantly relieved by breathing fresh cool open air or by closing eyes'
        ],
        materiaMedicaNotes: 'Kent: Deathly nausea with cold sweat, pale face. Sea sickness and car sickness; greatly relieved by cool open air.',
        modalities: { worse: 'Motion, opening eyes, heat', better: 'Fresh cool open air, closing eyes' },
        aliases: ['tabacum', 'tabac']
      },
      {
        name: 'Petroleum 30C',
        commonName: 'Crude Rock-Oil',
        potency: '30C',
        dosage: '4 pills twice daily on travel day',
        keynotes: [
          'Nausea and dizziness triggered by the motion of carriage, car, boat, or train',
          'Persistent vomiting with feeling of emptiness and coldness in stomach',
          'Nausea is temporarily relieved by constantly eating small snacks'
        ],
        materiaMedicaNotes: 'Boericke: Affections from riding in cars, carriages, or boats. Nausea with accumulation of saliva, better by eating.',
        modalities: { worse: 'Riding in cars, motion', better: 'Eating food, warm air' },
        aliases: ['petroleum', 'petr']
      },
      {
        name: 'Ipecacuanha 30C',
        commonName: 'Ipecac-Root',
        potency: '30C',
        dosage: '4 pills every 2 hours during continuous retching',
        keynotes: [
          'Persistent, unrelenting, violent nausea not relieved even after copious vomiting',
          'Clean, pink, completely un-coated tongue despite extreme gastric distress',
          'Profuse watery salivation with spasmodic retching'
        ],
        materiaMedicaNotes: 'Boericke: Constant nausea with clean tongue; vomiting does not relieve. Spasmodic retching.',
        modalities: { worse: 'Motion, warmth', better: 'Open air' },
        aliases: ['ipecac', 'ipecacuanha']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Travel Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Specifically formulated to prevent car sickness, bus nausea, dizziness, and vomiting during travel.',
        dosage: '1 tablet 1 hour before travel; repeat every 3-4 hours during long journeys.',
        mrp: 155,
        aliases: ['travel aid', 'bakson travel aid']
      },
      {
        name: 'Dr. Reckeweg R52 (Nauseasan / Vomiting Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for travel sickness, sea sickness, pregnancy vomiting, and autonomic nausea.',
        dosage: '10-15 drops in water before starting journey.',
        mrp: 310,
        aliases: ['r52', 'reckeweg 52']
      },
      {
        name: 'SBL Dyspep Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Settles gastric reflex hyper-excitability, soothes nausea, and prevents travel dizziness.',
        dosage: '10 drops in water 30 minutes before journey.',
        mrp: 140,
        aliases: ['dyspep', 'sbl dyspep']
      }
    ],
    dietAndRegimen: 'Sit in the front passenger seat of a car or over the wings in an airplane. Keep gaze fixed steadily on the distant horizon (do not read books or look down at smartphones). Keep vehicle window cracked for fresh air. Eat light dry crackers before departure; avoid heavy greasy foods.',
    warningNotes: 'If acute vomiting persists accompanied by severe abdominal tenderness, high fever, or hematemesis (blood in vomit), rule out acute surgical abdomen or gastrointestinal bleeding.'
  },

  // 44. Insomnia & Sleeplessness (অনিদ্রা / রাতে ঘুম না হওয়া / মানসিক অস্থিরতা)
  {
    id: 'insomnia-sleeplessness-anxiety',
    nameEn: 'Insomnia, Sleeplessness & Nervous Restlessness',
    nameBn: 'অনিদ্রা ও রাতে ঘুম না হওয়া (মানসিক অস্থিরতা ও মাথায় চিন্তার ভিড়)',
    chipLabel: 'Insomnia / অনিদ্রা ও ঘুমহীনতা',
    pathology: 'Disrupted Sleep Architecture, Hyperarousal State, Delayed Sleep Phase & Neurotransmitter Imbalance (GABA/Melatonin deficiency)',
    miasm: 'Psoric Mental Hyper-excitability & Sycotic Restlessness',
    typicalPresentation: 'Inability to fall asleep despite fatigue, mind racing with unstoppable crowds of thoughts, restless tossing and turning, light unrefreshing sleep waking at 2-3 AM',
    keywords: [
      'insomnia', 'sleeplessness', 'অনিদ্রা', 'ঘুম না হওয়া', 'cannot sleep', 'restless night',
      'ঘুমের সমস্যা', 'রাতে ঘুম না আসা', 'tossing in bed', 'racing thoughts sleep', 'mental anxiety sleep',
      'রাতের অনিদ্রা', 'ঘুমহীনতা'
    ],
    classicalRemedies: [
      {
        name: 'Coffea Cruda 30C / 200C',
        commonName: 'Unroasted Coffee Bean',
        potency: '30C / 200C',
        dosage: '4 pills dissolved in water 30 minutes before bedtime',
        keynotes: [
          'Wide awake state with impossible sleep; mind is overwhelmingly full of ideas and thoughts racing one after another',
          'Nerve senses acutely sharp; hears the slightest distant sound (clock ticking, footsteps outside)',
          'Sleeplessness from joyful excitement, sudden good news, or intense mental overwork'
        ],
        materiaMedicaNotes: 'Boericke: Great flow of ideas, quick to act. Sleeplessness on account of mental activity; all senses rendered more acute.',
        modalities: { worse: 'Excessive joy, mental excitement, night', better: 'Lying quiet, warmth' },
        aliases: ['coffea', 'coffea cruda']
      },
      {
        name: 'Passiflora Incarnata Mother Tincture (Q)',
        commonName: 'Passion Flower',
        potency: 'Q',
        dosage: '20-30 drops in 1/2 cup warm water 30 minutes before bedtime',
        keynotes: [
          'The premier non-habit-forming, natural homeopathic sedative and hypnotic',
          'Induces quiet, natural, peaceful, refreshing sleep without morning grogginess or hangover',
          'Calms overworked nervous individuals, worried businessmen, and children during teething'
        ],
        materiaMedicaNotes: 'Boericke: An efficient sedative. Restful sleep in insomnia of the worried and overworked. Quiets the nervous system.',
        modalities: { worse: 'Mental worry, night', better: 'Warm drinks, quietness' },
        aliases: ['passiflora', 'passiflora incarnata', 'passiflora q']
      },
      {
        name: 'Nux Vomica 30C / 200C',
        commonName: 'Poison Nut',
        potency: '30C / 200C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Falls asleep early in evening, but wakes abruptly at 3 AM or 4 AM; mind immediately starts working on business troubles',
          'Falls into a heavy, dull sleep around sunrise, waking tired, irritable, and with headache',
          'Sleeplessness from sedentary life, coffee, alcohol, smoking, and high-pressure work'
        ],
        materiaMedicaNotes: 'Kent: Cannot sleep after 3 AM. Mind is busy with business. Wakes unrefreshed, tired, irritable.',
        modalities: { worse: 'After 3 AM, stimulants, mental exertion', better: 'Short naps' },
        aliases: ['nux vomica', 'nux']
      },
      {
        name: 'Arsenicum Album 30C',
        commonName: 'White Oxide of Arsenic',
        potency: '30C',
        dosage: '4 pills in warm water at night',
        keynotes: [
          'Agonizing sleeplessness from mental anxiety, fear of illness, and physical restlessness',
          'Tosses and turns incessantly, moves from bed to chair and back again',
          'Wakes with panic and suffocation between midnight and 2 AM; chilly'
        ],
        materiaMedicaNotes: 'Kent: Great restlessness and anxiety preventing sleep. Driven out of bed from midnight to 2 AM.',
        modalities: { worse: 'Midnight to 2 AM, cold', better: 'Warmth, hot drinks' },
        aliases: ['arsenic', 'arsenic alb']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R14 (Quieta / Sleep & Nerve Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for nervous insomnia, nocturnal restlessness, mental agitation, and unrefreshing sleep.',
        dosage: '15-20 drops in warm water 30 minutes before bedtime.',
        mrp: 310,
        aliases: ['r14', 'reckeweg 14']
      },
      {
        name: 'SBL Tranquin Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Non-addictive natural formulation that calms mental anxiety, promotes deep restorative sleep, and relieves stress.',
        dosage: '2 tablets dissolved in mouth at bedtime.',
        mrp: 145,
        aliases: ['tranquin', 'sbl tranquin']
      },
      {
        name: 'Bakson Sleep Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relaxes over-stimulated brain waves, restores healthy circadian rhythm, and ensures sound sleep.',
        dosage: '15-20 drops in water at night.',
        mrp: 165,
        aliases: ['sleep aid', 'bakson sleep aid']
      }
    ],
    dietAndRegimen: 'Practice strict sleep hygiene: turn off all smartphones, tablets, and TV screens 1 hour before sleeping. Keep bedroom dark, quiet, and cool (around 20°C). Avoid caffeine or heavy meals after 6 PM. Take a warm foot bath before bed.',
    warningNotes: 'If insomnia is accompanied by loud snoring, witnessed breathing pauses, and sudden gasping for air during sleep, evaluate for Obstructive Sleep Apnea (OSA) with Polysomnography.'
  },

  // 45. Stye & Eye Infection / Blepharitis (অঞ্জনি / চোখের পাতায় পুঁজযুক্ত ফোড়া / চোখে খচখচ করা)
  {
    id: 'stye-hordeolum-blepharitis',
    nameEn: 'Stye, Hordeolum & Ciliary Blepharitis',
    nameBn: 'অঞ্জনি ও চোখের পাতার সংক্রমণ (চোখের পাতায় ফোড়া, পুঁজ ও খচখচ করা)',
    chipLabel: 'Stye / অঞ্জনি ও চোখের ঘা',
    pathology: 'Acute Focal Staphylococcal Infection of Zeis/Moll Glands (External Hordeolum) or Meibomian Gland (Internal Hordeolum/Chalazion)',
    miasm: 'Psoric-Syphilitic Suppurative Tendency',
    typicalPresentation: 'Painful, red, localized tender swelling on upper or lower eyelid margin, feeling of grit or gravel in eye, pointing with a yellow pus head, crusting of lashes on waking',
    keywords: [
      'stye', 'hordeolum', 'অঞ্জনি', 'চোখের পাতায় ফোড়া', 'eye boil', 'blepharitis', 'chalazion',
      'চোখে অঞ্জনি', 'চোখের পাতায় ঘা', 'eyelid swelling', 'eye stye', 'চোখ খচখচ করা'
    ],
    classicalRemedies: [
      {
        name: 'Staphysagria 30C / 200C',
        commonName: 'Stavesacre',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Premier polychrest for recurrent crops of styes and hard indurated chalazia on eyelids',
          'Styes one after another; leaves behind hard painless nodules or lumps that refuse to soften',
          'Eyelid margins itch, smart, and burn; especially after suppressed anger or emotional stress'
        ],
        materiaMedicaNotes: 'Boericke: Recurrent styes; chalazae on eyelids, one after another, leaving hard nodules in their wake. Great remedy for blepharitis.',
        modalities: { worse: 'Touch, suppressed anger', better: 'Warmth, rest' },
        aliases: ['staphysagria', 'staph']
      },
      {
        name: 'Pulsatilla Nigricans 30C',
        commonName: 'Wind Flower',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Specific for acute stye situated especially on the upper eyelid, with profuse yellow bland discharge',
          'Lids inflamed, glued together in morning with thick yellow bland pus; no excoriation',
          'Relieved by cool open air and cold compresses; thirstless patient'
        ],
        materiaMedicaNotes: 'Kent: Styes, especially on upper eyelid, with thick bland yellow pus. Great tendency to recurrence. Better in cool air.',
        modalities: { worse: 'Warm room, evening', better: 'Open cool air, cold compresses' },
        aliases: ['pulsatilla', 'puls']
      },
      {
        name: 'Hepar Sulphuris Calcareum 30C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Exquisitely painful, throbbing, suppurating stye; eyeball and lid tender to the least touch and cold air',
          'Sharp splinter-like stitching pains in lid; profuse purulent secretion',
          'Great relief from warm moist applications'
        ],
        materiaMedicaNotes: 'Boericke: Eyelids inflamed, throbbing, with purulent discharge. Exquisite sensitiveness to touch and cold.',
        modalities: { worse: 'Cold drafts, touch', better: 'Warmth, warm compresses' },
        aliases: ['hepar sulph', 'hepar']
      },
      {
        name: 'Euphrasia Officinalis 30C',
        commonName: 'Eyebright',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Blepharitis with red, swollen, burning eyelids and constant sensation of sand or grit in eyes',
          'Profuse, acrid, scalding lachrymation that inflames and reddens the cheeks',
          'Accompanied by mild, bland, non-irritating nasal discharge'
        ],
        materiaMedicaNotes: 'Boericke: The eyes water constantly; acrid tears. Lids swollen, burning, red. Sensation of dust or sand in eye.',
        modalities: { worse: 'Sunlight, wind, evening', better: 'Dark room' },
        aliases: ['euphrasia', 'euph']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Euphrasia Eye Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '10 ml Sterile Eye Drops',
        indications: 'Sterile soothing eye drops for styes, blepharitis, conjunctival redness, burning, and grittiness.',
        dosage: 'Instill 1-2 drops into affected eye 3 times daily.',
        mrp: 85,
        aliases: ['euphrasia eye drops', 'sbl eye drops']
      },
      {
        name: 'Dr. Reckeweg R1 (Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for acute local tissue suppuration, lid abscess, and styes.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'Bakson Stye & Eye Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '10 ml Drops',
        indications: 'Accelerates resorption of stye nodules, clears ocular crusting, and relieves lid soreness.',
        dosage: '1-2 drops into affected eye twice daily.',
        mrp: 95,
        aliases: ['stye aid', 'bakson eye aid']
      }
    ],
    dietAndRegimen: 'Apply clean warm moist compresses (using sterile cotton soaked in boiled cooled water) for 10 minutes 3-4 times daily to open blocked meibomian glands. Never squeeze or puncture a stye. Wash hands before touching eyes. Discard old eye makeup/mascara.',
    warningNotes: 'If eyelid swelling spreads rapidly to cheek and orbit with proptosis, limitation of eye movements, or severe fever, suspect orbital cellulitis and seek immediate emergency ophthalmological hospitalization.'
  },

  // 46. Toothache & Dental Abscess (দাঁত ব্যথা / মাড়ি ফোলা / ঠান্ডা বা গরম লাগলে যন্ত্রণা)
  {
    id: 'toothache-dental-abscess-caries',
    nameEn: 'Toothache, Dental Caries & Alveolar Abscess',
    nameBn: 'দাঁত ব্যথা ও মাড়ি ফোলা (দাঁতের ক্যাভিটি, দপদপানি যন্ত্রণা ও ঠান্ডা-গরম লাগলে ব্যথা)',
    chipLabel: 'Toothache / দাঁত ব্যথা ও মাড়ি ফোলা',
    pathology: 'Acute Pulpitis, Dental Caries Cavitation, Periapical Abscess & Alveolar Gingival Inflammation',
    miasm: 'Syphilitic Dental Destruction & Psoric Pain',
    typicalPresentation: 'Violent throbbing, shooting, darting toothache extending to ear and temple, hypersensitivity to cold water or hot drinks, swollen red tender gums, hollow decayed teeth',
    keywords: [
      'toothache', 'dental abscess', 'দাঁত ব্যথা', 'মাড়ি ফোলা', 'cavity pain', 'swollen gum',
      'দাঁতে পোকা', 'দাঁতে ঠান্ডা লাগা', 'dental caries', 'dant betha', 'throbbing tooth',
      'sensitive teeth', 'alveolar abscess'
    ],
    classicalRemedies: [
      {
        name: 'Plantago Major Mother Tincture (Q) / 30C',
        commonName: 'Broad-Leaved Plantain',
        potency: 'Q / 30C',
        dosage: 'Saturate a small sterile cotton pellet with Plantago Q and press gently into the decayed tooth cavity; take 4 pills 30C internally',
        keynotes: [
          'Sovereign specific for toothache and dental sensitivity in homeopathy; acts as a natural dental local anesthetic',
          'Teeth feel elongated, sore, sensitive; pain radiates to ears and face',
          'Bleeding, swollen, spongy gums and rapid relief of pain upon local application'
        ],
        materiaMedicaNotes: 'Boericke: A most reliable remedy for toothache and earache. Apply locally to cavity. Relieves dental nerve hyperesthesia.',
        modalities: { worse: 'Cold air, touch, contact of food', better: 'Eating (temporarily), warmth' },
        aliases: ['plantago', 'plantago major', 'plantago q']
      },
      {
        name: 'Chamomilla 30C / 200C',
        commonName: 'German Chamomile',
        potency: '30C / 200C',
        dosage: '4 pills every 2 hours during intolerable toothache agony',
        keynotes: [
          'Unbearable, agonizing toothache driving patient completely frantic, angry, and uncivil',
          'Worse from warm drinks or entering a warm room; patient demands immediate relief',
          'One cheek is red and hot, the other cheek is pale and cold; toothache in teething children'
        ],
        materiaMedicaNotes: 'Kent: Toothache is unbearable; drives patient to distraction. Worse from warm food and warm drinks. One cheek red, other pale.',
        modalities: { worse: 'Warm drinks, warmth of bed, anger', better: 'Cold water holding in mouth (temporarily)' },
        aliases: ['chamomilla', 'cham']
      },
      {
        name: 'Mercurius Solubilis 30C',
        commonName: "Hahnemann's Soluble Mercury",
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Alveolar abscess with spongy, bleeding, swollen gums and loose decayed teeth',
          'Intolerable throbbing toothache aggravated at night in the warmth of the bed',
          'Profuse offensive salivation wetting the pillow, with bad breath and indented tongue'
        ],
        materiaMedicaNotes: 'Boericke: Crown of teeth decay; gums spongy, bleed easily. Toothache worse at night and from warmth of bed.',
        modalities: { worse: 'Night, warmth of bed, damp weather', better: 'Moderate temperature' },
        aliases: ['merc sol', 'mercurius']
      },
      {
        name: 'Kreosotum 30C',
        commonName: 'Beechwood Kreosote',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Rapid decay of teeth; teeth turn dark, crumble, and decay as soon as they erupt',
          'Violent toothache in decayed hollow teeth, radiating to temples',
          'Putrid odor from mouth with dark, spongy, ulcerated bleeding gums'
        ],
        materiaMedicaNotes: 'Kent: Premature decay of teeth; teeth turn black and crumble. Gums dark red, ulcerated, bleed easily.',
        modalities: { worse: 'Cold drinks, rest', better: 'Warm food, gentle motion' },
        aliases: ['kreosotum', 'kreos']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Dental Pain Drops (P-Aid Drops)',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '15 ml Drops',
        indications: 'Provides rapid analgesic relief from acute pulpitis, dental caries pain, sensitive teeth, and swollen gums.',
        dosage: 'Apply 2-3 drops on a cotton ball directly over painful tooth cavity; also take 10 drops in warm water.',
        mrp: 95,
        aliases: ['p-aid', 'sbl dental drops']
      },
      {
        name: 'Dr. Reckeweg R1 (Inflammation & Dental Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation for periapical tooth abscess, gum swelling, and throbbing dental pain.',
        dosage: '10-15 drops in water every 2 hours during acute agony.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'Bakson Denta Aid Toothpaste & Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '100g Paste / 30 ml Drops',
        indications: 'Protects dental enamel, prevents caries spread, reduces gum bleeding, and eases toothache.',
        dosage: 'Brush with paste twice daily; take 10-15 drops in water.',
        mrp: 140,
        aliases: ['denta aid', 'bakson denta aid']
      }
    ],
    dietAndRegimen: 'Gargle gently with warm salt water or diluted Plantago mother tincture after meals. Never place an aspirin tablet directly on gums (causes chemical mucosal burns). Avoid sugary sticky candies and very cold or scalding hot liquids.',
    warningNotes: 'If tooth infection is accompanied by rapidly spreading submandibular cellulitis, elevation of floor of mouth, difficulty swallowing, or breathing compromise (Ludwig’s Angina), immediate emergency maxillofacial surgical drainage and airway protection are vital.'
  }
];
