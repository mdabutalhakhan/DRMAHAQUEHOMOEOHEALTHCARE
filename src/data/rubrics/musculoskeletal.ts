import type { ClinicalCondition } from '../clinicalRepertoryData';

export const MUSCULOSKELETAL_CONDITIONS: ClinicalCondition[] = [
  // 33. Cervical Spondylitis & Neck Pain (ঘাড় ব্যথা / স্পন্ডিলাইটিস / হাতে অবশ ভাব)
  {
    id: 'cervical-spondylitis-neck-pain',
    nameEn: 'Cervical Spondylitis & Cervical Radiculopathy',
    nameBn: 'সারভাইকাল স্পন্ডিলাইটিস ও ঘাড় ব্যথা (ঘাড়ে আড়ষ্টতা ও হাতে অবশ ভাব)',
    chipLabel: 'Cervical / ঘাড় ব্যথা ও স্পন্ডিলাইটিস',
    pathology: 'Cervical Intervertebral Disc Degeneration, Osteophytosis & Nerve Root Compression (Radiculopathy)',
    miasm: 'Sycotic Hypertrophic Bone Changes & Syphilitic Disc Degeneration',
    typicalPresentation: 'Stiff, painful neck with pain shooting down shoulders and arms into fingers, tingling numbness in fingertips, dizziness/vertigo on turning head, worse computer/desk work',
    keywords: [
      'cervical', 'spondylitis', 'neck pain', 'ঘাড় ব্যথা', 'cervical spondylosis', 'সারভাইকাল স্পন্ডিলাইটিস',
      'ঘাড়ের রগ টান', 'হাত ঝিমঝিম', 'tingling arm', 'stiff neck', 'neck stiffness', 'সারভাইকাল',
      'ঘাড়ে ব্যথা', 'cervical pain', 'numbness in fingers'
    ],
    classicalRemedies: [
      {
        name: 'Kalmia Latifolia 30C / 200C',
        commonName: 'Mountain Laurel',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Severe cervical radiculopathy; pains shoot downwards from neck and nape along the course of nerves into fingers',
          'Sharp, neuralgic, tearing pains accompanied by marked numbness and tingling in the affected arm',
          'Pains shift suddenly from joint to joint, frequently associated with slow pulse or palpitations'
        ],
        materiaMedicaNotes: 'Boericke: Neuralgic paroxysms shot downwards. Pain in neck, radiates down arms to fingers with numbness. Pains attend with or succeed to heart disease.',
        modalities: { worse: 'Turning neck, motion, lying on affected side', better: 'Quiet rest, warmth' },
        aliases: ['kalmia', 'kalmia lat']
      },
      {
        name: 'Gelsemium Sempervirens 30C / 200C',
        commonName: 'Yellow Jasmine',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe stiffness and dull drawing aching in cervical spine and nape of neck, radiating up into occiput and temples',
          'Accompanied by dizziness, heaviness of eyelids, and blurred vision on turning head suddenly',
          'Relieved by reclining with head elevated on a high pillow'
        ],
        materiaMedicaNotes: 'Kent: Great heaviness and aching in muscles of neck and occiput. Dizziness and visual disturbances from cervical muscle tension.',
        modalities: { worse: 'Motion, mental work, bending head forward', better: 'Reclining with head high, profuse urination' },
        aliases: ['gelsemium', 'gels']
      },
      {
        name: 'Actaea Racemosa (Cimicifuga) 30C',
        commonName: 'Black Cohosh',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Intense aching, muscular stiffness, and soreness in cervical and upper dorsal muscles',
          'Nape of neck is so stiff and tender that touching it sends a shudder down the spine',
          'Cervico-brachial neuralgia with mental gloom and nervous irritability'
        ],
        materiaMedicaNotes: 'Boericke: Stiffness and contraction in neck and back. Sensation as if heavy weight were resting on nape of neck.',
        modalities: { worse: 'Cold drafts, menses, motion', better: 'Warmth, gentle pressure' },
        aliases: ['cimicifuga', 'actaea rac']
      },
      {
        name: 'Rhus Toxicodendron 30C / 200C',
        commonName: 'Poison Ivy',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Stiffness and aching in neck from sitting in cold air or air-conditioned drafts with wet sweat',
          'Worse on first beginning to move neck (initial stiffness), but gradually limbers up and feels easier after continuous movement',
          'Relieved by hot water shower or heat applications'
        ],
        materiaMedicaNotes: 'Kent: Lameness, stiffness and pain on first moving neck, improving from continued motion. Worse from cold dampness.',
        modalities: { worse: 'Initial motion, rest, cold damp drafts', better: 'Continued motion, hot applications, dry warmth' },
        aliases: ['rhus tox', 'rhus']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R11 (Lumbagin / Spondylitis Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for cervical spondylitis, back muscle myalgia, osteochondrosis, and intercostal neuralgia.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 310,
        aliases: ['r11', 'reckeweg 11']
      },
      {
        name: 'SBL Spondy Aid Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Highly effective formula for cervical spondylitis, shooting arm pain, numbness in fingers, and neck crepitus.',
        dosage: '10-15 drops in 1/4 cup lukewarm water 3 times a day.',
        mrp: 155,
        aliases: ['spondy aid', 'sbl spondy aid']
      },
      {
        name: 'Bakson Spondyl Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves cervical nerve root compression, reduces muscular spasm, and eliminates morning neck stiffness.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 170,
        aliases: ['bakson spondyl aid']
      }
    ],
    dietAndRegimen: 'Maintain ergonomic desk posture; keep computer screen at eye level. Avoid thick or high pillows; use a thin contour orthopedic cervical pillow. Perform gentle isometric neck muscle exercises twice daily. Apply warm compresses to tense trapezius muscles.',
    warningNotes: 'If there is sudden loss of grip strength, dropping objects from hands, progressive limb weakness, or gait instability, evaluate immediately for cervical compressive myelopathy with an urgent cervical spine MRI.'
  },

  // 34. Lumbar Spondylosis & Low Back Pain (কোমর ব্যথা / লাম্বার স্পন্ডিলোসিস / পিঠ ব্যথা)
  {
    id: 'lumbar-spondylosis-low-back-pain',
    nameEn: 'Lumbar Spondylosis & Chronic Low Back Pain',
    nameBn: 'কোমর ব্যথা ও লাম্বার স্পন্ডিলোসিস (পিঠ ও কোমরে তীব্র টান ও আড়ষ্টতা)',
    chipLabel: 'Back Pain / কোমর ব্যথা',
    pathology: 'Lumbar Intervertebral Disc Degeneration, Facet Joint Arthrosis, Lumbar Muscle Spasm & Spondylolisthesis',
    miasm: 'Sycotic Joint Hypertrophy & Syphilitic Bone Wear',
    typicalPresentation: 'Dull or sharp aching across lumbar and sacral spine, worse bending forward or lifting weights, morning stiffness, difficulty rising from sitting posture, fatigue on standing',
    keywords: [
      'lumbar', 'back pain', 'কোমর ব্যথা', 'lumbago', 'lumbar spondylosis', 'লাম্বার স্পন্ডিলোসিস',
      'পিঠ ব্যথা', 'কোমরের রগ টান', 'lower backache', 'back stiffness', 'sacroiliac pain', 'কোমর ধরা'
    ],
    classicalRemedies: [
      {
        name: 'Rhus Toxicodendron 200C',
        commonName: 'Poison Ivy',
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Back feels broken; severe stiffness and pain on first attempting to stand up or walk after sitting quietly',
          'Greatly relieved by continued walking, gentle motion, and by lying flat on something hard',
          'Caused by over-lifting, muscular sprain, or getting drenched in rain'
        ],
        materiaMedicaNotes: 'Kent: Pain in lumbar region as if broken; worse on beginning to move, better from continued gentle motion and hard pressure.',
        modalities: { worse: 'Initial motion, rest, cold damp weather', better: 'Continued motion, hot water fomentation, hard pressure' },
        aliases: ['rhus tox', 'rhus']
      },
      {
        name: 'Bryonia Alba 200C',
        commonName: 'Wild Hops',
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe, sharp, stitching, catching pain in lumbar spine; patient cannot bear the least movement or stooping',
          'Must lie absolutely motionless flat on back on a firm bed',
          'Great thirst for large gulps of cold water; dry stools and irritability'
        ],
        materiaMedicaNotes: 'Boericke: Stitching, tearing pain in lumbar region; worse from the least motion, better from absolute rest.',
        modalities: { worse: 'Any motion, coughing, stooping', better: 'Absolute rest, lying on painful side' },
        aliases: ['bryonia', 'bry']
      },
      {
        name: 'Aesculus Hippocastanum 30C',
        commonName: 'Horse Chestnut',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Severe, constant dull aching across sacroiliac joints and sacrum, making walking almost impossible',
          'Back gives out when walking; patient can hardly stoop or rise from a chair without holding onto furniture',
          'Associated with dry, painful hemorrhoids and portal congestion'
        ],
        materiaMedicaNotes: 'Kent: Sacroiliac pain; back gives out, cannot rise from a seat. Great lameness in lumbar region.',
        modalities: { worse: 'Walking, stooping, rising from seat', better: 'Cool air, resting quietly' },
        aliases: ['aesculus', 'aesculus hip']
      },
      {
        name: 'Kali Carbonicum 200C',
        commonName: 'Potassium Carbonate',
        potency: '200C',
        dosage: '4 pills twice weekly in morning',
        keynotes: [
          'Severe lumbago with weakness; back feels so weak it feels as if it will break in two',
          'Pains shoot down buttocks and thighs; patient must sit down immediately when walking',
          'Characteristic aggravation at 3 AM; puffy swelling of upper eyelids'
        ],
        materiaMedicaNotes: 'Boericke: Great backache; back feels broken. Pains shoot down thighs. Better by sitting upright with firm support.',
        modalities: { worse: '3 AM, cold weather, lying on back', better: 'Warmth, sitting upright' },
        aliases: ['kali carb', 'kali carbonicum']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R11 (Lumbagin / Back Pain Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for acute lumbago, sacroiliac arthritis, muscular rheumatism, and lumbar spondylosis.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 310,
        aliases: ['r11', 'reckeweg 11']
      },
      {
        name: 'SBL Orthomuv Massage Oil / Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '60 ml Oil / 180 ml Syrup',
        indications: 'Herbal-homeopathic formulation that penetrates deep into muscular tissue, relieves back spasms, and restores flexibility.',
        dosage: 'Apply oil gently on lower back twice daily, take 1-2 teaspoonfuls syrup twice daily.',
        mrp: 145,
        aliases: ['orthomuv', 'sbl orthomuv']
      },
      {
        name: 'Bakson Rheum Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Controls chronic lumbar aches, reduces intervertebral stiffness, and improves spinal mobility.',
        dosage: '1 tablet 3 times a day.',
        mrp: 165,
        aliases: ['rheum aid', 'bakson rheum aid']
      }
    ],
    dietAndRegimen: 'Sleep on a medium-firm orthopedic mattress (avoid soft sagging beds). Use proper bending technique (bend knees and hips, not lumbar spine). Practice core-strengthening pelvic tilts and gentle lumbar extensor stretches.',
    warningNotes: 'If low back pain is accompanied by loss of bladder or bowel sphincter control, saddle anesthesia (loss of sensation between legs/groin), or progressive bilateral foot drop (Cauda Equina Syndrome), emergency decompressive neurosurgery is required within 24 hours.'
  },

  // 35. Sciatica & Radiating Leg Pain (সায়াটিকা / কোমর থেকে পা পর্যন্ত তীব্র টান ও ব্যথা)
  {
    id: 'sciatica-radiating-leg-pain',
    nameEn: 'Sciatica & Neuralgic Leg Radiation',
    nameBn: 'সায়াটিকা ও পায়ে তীব্র টান (কোমর থেকে পায়ের পাতা পর্যন্ত তীব্র যন্ত্রণা)',
    chipLabel: 'Sciatica / সায়াটিকা ও পায়ের টান',
    pathology: 'Sciatic Nerve Compression (L4-S1 radiculopathy) secondary to Lumbar Herniated Nucleus Pulposus (disc prolapse) or Piriformis Syndrome',
    miasm: 'Syphilitic Neuralgia with Psoric Hypersensitivity',
    typicalPresentation: 'Excruciating shooting, tearing, electric-shock pain originating in lumbar spine or buttock and radiating down back of thigh, calf to ankle and toes; leg feels weak and heavy',
    keywords: [
      'sciatica', 'সায়াটিকা', 'পায়ে টান', 'leg pain radiating', 'sciatic nerve', 'সায়াটিকা',
      'কোমর থেকে পায়ে টান', 'পা ঝিনঝিন', 'electric shock leg', 'nerve pain leg', 'lumbar radiculopathy'
    ],
    classicalRemedies: [
      {
        name: 'Colocynthis 30C / 200C',
        commonName: 'Bitter Apple',
        potency: '30C / 200C',
        dosage: '4 pills every 2-3 hours during acute paroxysms',
        keynotes: [
          'Predominantly left-sided sciatica; agonizing shooting, crampy, tearing pains down sciatic nerve path',
          'Patient screams with pain; compelled to bend double or draw knee firmly up to chest',
          'Remarkably relieved by hard, firm pressure, lying on the affected painful side, and hot applications'
        ],
        materiaMedicaNotes: 'Boericke: Sciatic pain on left side; shooting, cramp-like. Relieved by bending double, hard pressure, and heat.',
        modalities: { worse: 'Standing, walking, touch, anger', better: 'Bending double, hard pressure, heat' },
        aliases: ['colocynthis', 'colocynth', 'coloc']
      },
      {
        name: 'Gnaphalium Polycephalum 30C / 200C',
        commonName: 'Sweet-Scented Everlasting',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Sovereign specific for sciatica when intense neuralgic pain alternates with or is accompanied by numbness along the leg',
          'Pain extends along sciatic nerve to foot; feels as if nerve were pinched in a vise',
          'Pain is distinctly aggravated by walking or lying flat; relieved by sitting quietly in a chair'
        ],
        materiaMedicaNotes: 'Boericke: Intense pain along sciatic nerve; numbness alternates with pain. Better sitting in a chair.',
        modalities: { worse: 'Walking, motion, lying down flat', better: 'Sitting bent forward in a chair' },
        aliases: ['gnaphalium', 'gnaph']
      },
      {
        name: 'Magnesia Phosphorica 6X / 30C',
        commonName: 'Magnesium Phosphate',
        potency: '6X / 30C',
        dosage: '4 tablets 6X dissolved in hot water every 2 hours, or 4 pills 30C',
        keynotes: [
          'Right-sided sciatica; darting, cutting, piercing, lightning-like electric shocks along nerve path',
          'Pains compel patient to scream and writhe; accompanied by severe muscle spasms in calf and hamstring',
          'Prompt and dramatic relief from hot applications, hot bath, and firm rubbing'
        ],
        materiaMedicaNotes: 'Kent: The great antispasmodic remedy. Lightning-like pains relieved by warmth and pressure. Right-sided sciatica.',
        modalities: { worse: 'Cold drafts, cold water, touch', better: 'Hot applications, heat, firm pressure' },
        aliases: ['mag phos', 'magnesia phos']
      },
      {
        name: 'Hypericum Perforatum 200C',
        commonName: "St. John's Wort",
        potency: '200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Specific remedy for nerve contusion, nerve compression, and traumatic injury to coccyx and spinal nerves',
          'Darting, shooting pains traveling upward along the sciatic nerve trunk with intense hypersensitiveness to touch',
          'Numbness, crawling, and burning in toes'
        ],
        materiaMedicaNotes: 'Boericke: The great remedy for nerve injuries. Sciatica resulting from disc compression or spinal trauma.',
        modalities: { worse: 'Cold, dampness, touch, jar', better: 'Bending head back, quiet rest' },
        aliases: ['hypericum', 'hyper']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R71 (Sciatica Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation specifically compounded for sciatic neuralgia, radiculopathy, and shooting leg cramps.',
        dosage: '10-15 drops in water 3-4 times daily; during acute attacks, every 1-2 hours.',
        mrp: 310,
        aliases: ['r71', 'reckeweg 71']
      },
      {
        name: 'SBL Orthomuv Drops / Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops / 25g Tablets',
        indications: 'Relieves sciatic nerve inflammation, terminates leg twitching, and restores normal walking ability.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 145,
        aliases: ['orthomuv drops', 'sbl sciatica']
      },
      {
        name: 'Bakson Rheum Aid Oil & Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops / 60 ml Oil',
        indications: 'Alleviates deep radiating neuralgic spasms, eases hamstring tension, and calms nerve hypersensitivity.',
        dosage: '10-15 drops in water twice daily; massage oil gently along sciatic course.',
        mrp: 175,
        aliases: ['rheum aid oil', 'bakson sciatica']
      }
    ],
    dietAndRegimen: 'Avoid sitting on a thick wallet in back pocket (prevents piriformis compression). Sleep on back with a supportive pillow placed under knees to relieve tension on sciatic nerve roots. Apply warm fomentation to gluteal and hamstring muscles.',
    warningNotes: 'If patient develops foot drop (inability to dorsiflex foot and walk on heels) or progressive motor weakness in lower extremity, arrange immediate lumbar spine MRI to assess degree of disc herniation.'
  },

  // 36. Osteoarthritis & Knee Joint Pain (হাঁটু ব্যথা / অস্টিওআর্থ্রাইটিস / অস্থিসন্ধির ক্ষয় ও কটকট শব্দ)
  {
    id: 'osteoarthritis-knee-joint-pain',
    nameEn: 'Osteoarthritis, Knee Joint Pain & Crepitus',
    nameBn: 'হাঁটু ব্যথা ও অস্টিওআর্থ্রাইটিস (অস্থিসন্ধির ক্ষয়, কটকট শব্দ ও হাঁটার সময় ব্যথা)',
    chipLabel: 'Knee Pain / হাঁটু ব্যথা ও ক্ষয়',
    pathology: 'Progressive Articular Cartilage Degeneration, Subchondral Sclerosis, Osteophyte Formation & Synovial Crepitus',
    miasm: 'Sycotic Hyperostosis & Syphilitic Articular Cartilage Destruction',
    typicalPresentation: 'Deep aching pain in knees aggravated on walking, climbing stairs, or standing; audible cracking/crepitus on movement; knee stiffness after sitting, joint swelling and deformity',
    keywords: [
      'osteoarthritis', 'knee pain', 'হাঁটু ব্যথা', 'joint pain', 'crepitus knee', 'অস্টিওআর্থ্রাইটিস',
      'হাঁটু কটকট করা', 'হাঁটু ক্ষয়', 'knee cartilage loss', 'stiff knee joints', 'difficulty climbing stairs',
      'বাত ব্যথা', 'গেঁটেবাত', 'degenerative arthritis'
    ],
    classicalRemedies: [
      {
        name: 'Bryonia Alba 200C',
        commonName: 'Wild Hops',
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Knees red, swollen, hot, and stiff with sharp stitching pains on the least movement',
          'Patient cannot bear to walk or move the knees; distinct relief from absolute immobility and resting',
          'Knees feel dry; cracking crepitus audible on passive or active flexion'
        ],
        materiaMedicaNotes: 'Kent: Great knee remedy. Knees stiff, painful, swollen. Every motion causes sharp stitching pain. Better from absolute rest.',
        modalities: { worse: 'Any motion, walking, bending knee', better: 'Absolute rest, firm bandaging' },
        aliases: ['bryonia', 'bry']
      },
      {
        name: 'Calcarea Fluorica 6X / 12X',
        commonName: 'Fluoride of Lime',
        potency: '6X / 12X',
        dosage: '4 tablets 3 times daily dissolved in warm water',
        keynotes: [
          'Premier tissue salt for osseous osteophytes, bone spurs, and hard bony enlargement of knee joints',
          'Audible cracking and crunching crepitus in knees on walking or standing up',
          'Restores elasticity to relaxed joint ligaments and helps regenerate cartilage matrix'
        ],
        materiaMedicaNotes: 'Boericke: Exostoses, bony growths, and crepitus of joints. Knee joints crack on movement with chronic hard swelling.',
        modalities: { worse: 'Initial motion, cold damp changes', better: 'Continued motion, heat applications' },
        aliases: ['calc fluor', 'calcarea fluorica', 'calc fluor 6x']
      },
      {
        name: 'Rhus Toxicodendron 30C / 200C',
        commonName: 'Poison Ivy',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe stiffness and aching on first rising from chair or starting to walk; "rustiness" of joints',
          'With continuous gentle walking, stiffness gradually dissolves and knees move more freely',
          'Aggravated before storms, cold damp weather, and rest; relieved by warm fomentation'
        ],
        materiaMedicaNotes: 'Boericke: Rheumatism of joints. Stiffness on beginning to move, better from continued gentle movement.',
        modalities: { worse: 'First motion, cold dampness, rest', better: 'Continuous motion, warm dry weather, hot bath' },
        aliases: ['rhus tox', 'rhus']
      },
      {
        name: 'Ruta Graveolens 30C',
        commonName: 'Rue / Bitter Herb',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Deep-seated bruised, aching, sore pain in periosteum, patella, and knee ligaments',
          'Knees feel bruised, weak, and give out on descending stairs or rising from sitting',
          'Contraction of flexor tendons and chronic synovial effusion'
        ],
        materiaMedicaNotes: 'Kent: Acts on periosteum and cartilages. Knees give way while ascending or descending stairs. Soreness as if bruised.',
        modalities: { worse: 'Descending stairs, cold wet weather', better: 'Motion, lying on back' },
        aliases: ['ruta', 'ruta grav']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R73 (Spondarthrin / Joint Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for osteoarthritis of large joints (knees, hips), cartilage wear, and articular crepitus.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r73', 'reckeweg 73']
      },
      {
        name: 'SBL Orthomuv Syrup & Oil',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup / 60 ml Oil',
        indications: 'Relieves knee inflammation, reduces synovial stiffness, and facilitates effortless stair climbing.',
        dosage: '1-2 teaspoonfuls syrup twice daily; massage oil over knees gently.',
        mrp: 145,
        aliases: ['orthomuv', 'sbl orthomuv']
      },
      {
        name: 'Bakson Rheum Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Controls chronic degenerative joint pains, eases morning stiffness, and promotes joint resilience.',
        dosage: '1 tablet 3 times a day.',
        mrp: 165,
        aliases: ['rheum aid', 'bakson rheum aid']
      }
    ],
    dietAndRegimen: 'Maintain healthy body weight (every 1 kg weight reduction removes 4 kg of pressure from knees). Avoid sitting crossed-legged on the floor or squatting. Perform non-weight-bearing quadriceps isometric exercises and stationary cycling.',
    warningNotes: 'If knee joint is intensely hot, tense, ballottable, with acute systemic fever and chills, rule out acute septic bacterial arthritis with joint aspiration.'
  },

  // 37. Gout & Uric Acid Arthritis (গাউট / ইউরিক অ্যাসিড বৃদ্ধি / বুড়ো আঙুলে তীব্র ব্যথা ও ফোলা)
  {
    id: 'gout-high-uric-acid-arthritis',
    nameEn: 'Gout, Hyperuricemia & Acute Podagra',
    nameBn: 'গাউট ও ইউরিক অ্যাসিড বৃদ্ধি (পায়ের বুড়ো আঙুলে তীব্র প্রদাহ, ফোলা ও ব্যথা)',
    chipLabel: 'Gout / গাউট ও ইউরিক অ্যাসিড',
    pathology: 'Monosodium Urate Crystal Deposition in synovial joints (first metatarsophalangeal joint / podagra), Tophaceous Induration & Hyperuricemia',
    miasm: 'Sycotic Uric Acid Diathesis with Psoric Inflammation',
    typicalPresentation: 'Sudden, excruciating, waking-at-night tearing, throbbing pain in great toe ball, joint swollen, dusky red/purple, shiny and so sensitive that even the weight of a bedsheet is agonizing',
    keywords: [
      'gout', 'uric acid', 'গাউট', 'ইউরিক অ্যাসিড', 'podagra', 'great toe pain', 'হাইপারইউরিসেমিয়া',
      'পায়ের বুড়ো আঙুল ফোলা', 'টফি', 'tophus', 'burning great toe', 'high uric acid', 'গাউটি আর্থ্রাইটিস'
    ],
    classicalRemedies: [
      {
        name: 'Urtica Urens Mother Tincture (Q)',
        commonName: 'Stinging Nettle',
        potency: 'Q',
        dosage: '10-15 drops in a glass of warm water 3 times daily before meals',
        keynotes: [
          'Premier physiological uric acid eliminator in homeopathy; clears urate crystals through kidneys',
          'Relieves acute gouty pain and swelling in great toe, ankles, and small joints of hands',
          'Alternation of gouty joint symptoms with urticarial hives or gravel in urine'
        ],
        materiaMedicaNotes: 'Boericke: Powerful agent for eliminating uric acid. Gout with intense burning heat and edema. Clears urate deposits.',
        modalities: { worse: 'Cold damp weather, touch', better: 'Warm drinks, rest' },
        aliases: ['urtica urens', 'urtica q', 'urtica']
      },
      {
        name: 'Colchicum Autumnale 30C / 200C',
        commonName: 'Meadow Saffron',
        potency: '30C / 200C',
        dosage: '4 pills every 3 hours during acute podagra flare',
        keynotes: [
          'Classic specific for acute gouty paroxysms affecting the big toe (podagra)',
          'Great toe is dark red, swollen, hot; cannot bear the least touch, jar, or movement',
          'Characteristic nausea from the mere smell or sight of cooking food; chilly, irritable'
        ],
        materiaMedicaNotes: 'Kent: The great remedy for acute gout. Parts are red, hot, swollen, exquisitely sensitive to touch or jar. Smell of food causes nausea.',
        modalities: { worse: 'Least touch, jar, motion, night', better: 'Warmth, doubling up, resting' },
        aliases: ['colchicum', 'colch']
      },
      {
        name: 'Ledum Palustre 30C / 200C',
        commonName: 'Marsh Cistus / Wild Rosemary',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Gouty pains travel characteristically upwards from feet to knees and limbs (ascending rheumatism)',
          'Affected joint lacks heat and may be pale and swollen, yet patient cannot tolerate any warm applications',
          'Sole relief is obtained from plunging the affected foot into ice-cold water or applying ice packs'
        ],
        materiaMedicaNotes: 'Boericke: Gouty pains shoot upwards. Intense pain in big toe and heels. Remarkably relieved by ice-cold water.',
        modalities: { worse: 'Heat of bed, covering, warmth', better: 'Plunging feet in ice-cold water' },
        aliases: ['ledum', 'ledum pal']
      },
      {
        name: 'Benzoicum Acidum 30C',
        commonName: 'Benzoic Acid',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Tophaceous gout of knees, ankles, and great toe with deposition of hard urate concretions',
          'Urine is excessively pungent, strong-smelling, and intensely offensive like horse urine',
          'Joint crackling and tearing pain alternating with urinary excretion'
        ],
        materiaMedicaNotes: 'Boericke: Gouty concretions in joints with characteristic highly offensive, horse-urine odor.',
        modalities: { worse: 'Open air, uncovering', better: 'Heat' },
        aliases: ['benzoic acid', 'benz acid']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R11 (Gout & Lumbago Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for hyperuricemia, acute podagra, tophaceous deposits, and joint stiffness.',
        dosage: '10-15 drops in warm water 3-4 times daily.',
        mrp: 310,
        aliases: ['r11', 'reckeweg 11']
      },
      {
        name: 'SBL Uricum Acidum / Orthomuv Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Assists kidney excretion of uric acid crystals, relieves big toe inflammation, and lowers serum uric acid.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 145,
        aliases: ['sbl gout drops', 'uricum acidum']
      },
      {
        name: 'Bakson Rheum Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Soothes acute podagra flares, relieves burning toe throbbing, and clears metabolic toxins.',
        dosage: '1 tablet 3 times a day.',
        mrp: 165,
        aliases: ['rheum aid', 'bakson rheum aid']
      }
    ],
    dietAndRegimen: 'Drink 3-4 liters of water daily to flush urates through kidneys. Strictly eliminate purine-dense foods (red meat, organ meats, sardines, shellfish, beer/alcohol, high-fructose corn syrup). Consume tart cherries and fresh lemon water.',
    warningNotes: 'Check Serum Uric Acid and renal function tests (BUN, Creatinine). Persistent untreated hyperuricemia can lead to renal urate nephrolithiasis or chronic urate nephropathy.'
  },

  // 38. Calcaneal Spur & Heel Pain (গোড়ালি ব্যথা / পায়ের গোড়ালিতে হাড় বৃদ্ধি)
  {
    id: 'calcaneal-spur-heel-pain',
    nameEn: 'Calcaneal Spur & Plantar Fasciitis',
    nameBn: 'গোড়ালি ব্যথা ও পায়ের হাড় বৃদ্ধি (প্ল্যান্টার ফ্যাসাইটিস ও গোড়ালিতে তীব্র খোঁচা মারা ব্যথা)',
    chipLabel: 'Heel Pain / গোড়ালি ব্যথা ও স্পার',
    pathology: 'Plantar Fascial Enthesopathy, Calcaneal Traction Exostosis (Bone Spur) & Subcalcaneal Bursitis',
    miasm: 'Sycotic Exostosis & Psoric Enthesial Inflammation',
    typicalPresentation: 'Severe, knife-like or nail-poking pain under heel upon taking the very first steps in the morning out of bed; improves after walking a little, but returns after resting',
    keywords: [
      'heel pain', 'calcaneal spur', 'গোড়ালি ব্যথা', 'plantar fasciitis', 'গোড়ালি হাড় বৃদ্ধি',
      'পা ফেলতে ব্যথা', 'morning heel pain', 'first step heel pain', 'nail in heel', 'গোড়ালি ব্যথা',
      'গোড়ালিতে কাঁটা ফোটা', 'heel spur'
    ],
    classicalRemedies: [
      {
        name: 'Calcarea Fluorica 6X / 12X',
        commonName: 'Fluoride of Lime',
        potency: '6X / 12X',
        dosage: '4 tablets 3 times daily dissolved in warm water',
        keynotes: [
          'Premier tissue remedy for dissolving bony exostoses, calcaneal spurs, and hard bony growths',
          'Sharp, agonizing pain under the heel as if stepping on a sharp nail or stone',
          'Softens hard calcified collagen enthesophytes and restores elasticity to plantar fascia'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy for bone spurs and hard bony excrescences. Calcaneal spurs with severe pain on stepping.',
        modalities: { worse: 'Initial movement, cold dampness', better: 'Continued walking, warm applications' },
        aliases: ['calc fluor', 'calcarea fluorica', 'calc fluor 6x']
      },
      {
        name: 'Rhus Toxicodendron 30C / 200C',
        commonName: 'Poison Ivy',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Classic plantar fasciitis presentation: agonizing pain on taking the very first step out of bed in the morning',
          'Pain gradually eases and limbers up after taking a few steps and walking around',
          'Heels feel bruised and stiff after resting or sitting for a prolonged period'
        ],
        materiaMedicaNotes: 'Kent: Pain on first stepping on heel in morning; limbers up after moving about. Lameness and stiffness.',
        modalities: { worse: 'First steps in morning, rising from seat', better: 'Continued walking, hot foot soak' },
        aliases: ['rhus tox', 'rhus']
      },
      {
        name: 'Aranea Diadema 30C',
        commonName: 'Cross Spider',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Sensation of deep boring, digging, or coldness in the calcaneus bone of both heels',
          'Bones feel as if made of ice; violent digging pain in heels as if a nail were driven into bone',
          'Aggravated in damp, rainy, chilly weather'
        ],
        materiaMedicaNotes: 'Boericke: Severe boring pain in the os calcis (heel bone). Sensation of swelling and bone pain, worse from dampness.',
        modalities: { worse: 'Damp cold weather, night', better: 'Dry warmth' },
        aliases: ['aranea', 'aranea diadema']
      },
      {
        name: 'Ammonium Muriaticum 30C',
        commonName: 'Sal Ammoniac / Ammonium Chloride',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Stitching, tearing, or ulcerated pain in heels as if internal ulcer was forming',
          'Cannot bear weight on heel; compelled to walk on toes and ball of foot',
          'Hamstring tendons feel painfully short and contracted'
        ],
        materiaMedicaNotes: 'Boericke: Pain in heels as if ulcerated. Contraction of hamstring tendons. Better from gentle walking.',
        modalities: { worse: 'Morning, resting', better: 'Gentle walking' },
        aliases: ['ammon mur', 'ammonium muriaticum']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Calcaneal Spur Aid / Rheum Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Specially indicated for heel pain, plantar fasciitis, and calcaneal spur tenderness.',
        dosage: '1 tablet 3 times a day with warm water.',
        mrp: 165,
        aliases: ['bakson spur aid', 'spur aid']
      },
      {
        name: 'Dr. Reckeweg R11 (Lumbagin & Arthritic Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation for exostosis pain, chronic heel enthesopathy, and periosteal soreness.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r11', 'reckeweg 11']
      },
      {
        name: 'SBL Biochemic Calcarea Fluorica 12X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Promotes cellular resorption of fibrous and bony spurs under the heel bone.',
        dosage: '4 tablets dissolved in warm water 3 times daily.',
        mrp: 135,
        aliases: ['calc fluor 12x', 'sbl calc fluor']
      }
    ],
    dietAndRegimen: 'Wear soft silicone heel cups or cushioned orthopedic shoes; never walk barefoot on hard tiles or concrete floors. Perform gentle calf muscle and plantar fascia towel stretches before stepping out of bed in the morning. Roll sole of foot over a frozen water bottle for 10 minutes at night.',
    warningNotes: 'Perform lateral weight-bearing foot X-ray to confirm presence and size of calcaneal spur and rule out calcaneal stress fracture.'
  },

  // 39. Muscle Cramps & Spasms (পেশির টান / বাঘি ধরা / পায়ে খিঁচুনি)
  {
    id: 'muscle-cramps-spasms-calf',
    nameEn: 'Muscle Cramps, Spasms & Nocturnal Calf Cramps',
    nameBn: 'পেশির টান ও বাঘি ধরা (রাতে পায়ের ডিমে তীব্র খিঁচুনি ও পেশি শক্ত হওয়া)',
    chipLabel: 'Cramps / পেশির টান ও খিঁচুনি',
    pathology: 'Involuntary Painful Muscle Spasms, Electrolyte Imbalance (Magnesium/Potassium) & Muscle Motor Unit Hyperactivity',
    miasm: 'Psoric Spasmodic Hyper-excitability',
    typicalPresentation: 'Sudden, excruciating, knotting contraction of calf muscles (gastrocnemius/soleus) or toes waking patient abruptly at night, muscle feels hard like a wooden knot',
    keywords: [
      'muscle cramp', 'cramp', 'পেশির টান', 'বাঘি ধরা', 'খিঁচুনি', 'calf cramp night', 'muscle spasm',
      'পায়ের পেশি শক্ত হওয়া', 'charley horse', 'toes cramping', 'পায়ে খিল ধরা', 'nocturnal cramps'
    ],
    classicalRemedies: [
      {
        name: 'Cuprum Metallicum 30C / 200C',
        commonName: 'Metallic Copper',
        potency: '30C / 200C',
        dosage: '4 pills twice daily or dissolved in warm water during spasm',
        keynotes: [
          'Premier simillimum for violent, agonizing cramps in calves, soles of feet, and toes',
          'Muscles ball up into hard, painful, rigid knots; toes drawn tightly under',
          'Sudden violent onset; patient screams with pain and cannot straighten leg'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy for cramps and spasms. Violent cramps in calves, soles of feet, and abdomen. Spasms begin in fingers and toes.',
        modalities: { worse: 'Night, cold air, touch', better: 'Drinking cold water, rubbing firmly' },
        aliases: ['cuprum met', 'cuprum']
      },
      {
        name: 'Magnesia Phosphorica 6X / 30C',
        commonName: 'Magnesium Phosphate',
        potency: '6X / 30C',
        dosage: '4 tablets 6X dissolved in hot water every 15-30 minutes during acute cramp, or 4 pills 30C',
        keynotes: [
          'The great homeopathic anti-spasmodic and natural muscle relaxant',
          'Sharp, neuralgic, shooting, darting pains accompanied by agonizing muscular spasms',
          'Prompt and dramatic relief from hot applications, hot bath, and vigorous warm massage'
        ],
        materiaMedicaNotes: 'Kent: The great pain and cramp reliever. Instant relief from heat and hot applications. Calves drawn into hard knots.',
        modalities: { worse: 'Cold drafts, uncovering', better: 'Heat, warm water, firm pressure' },
        aliases: ['mag phos', 'magnesia phos', 'mag phos 6x']
      },
      {
        name: 'Sulphur 200C',
        commonName: 'Sublimed Sulphur',
        potency: '200C',
        dosage: '4 pills once weekly in morning',
        keynotes: [
          'Severe nocturnal cramps in calves, soles of feet, and toes, waking patient around 3-5 AM',
          'Burning heat in soles of feet at night; patient constantly searches for a cool spot in bed',
          'Restlessness of limbs in bed with cramps upon stretching'
        ],
        materiaMedicaNotes: 'Kent: Cramps in calves and soles of feet at night in bed. Burning soles, must put them out of bed.',
        modalities: { worse: 'Warmth of bed, night', better: 'Cool open air' },
        aliases: ['sulphur', 'sulfur']
      },
      {
        name: 'Nux Vomica 30C',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Nocturnal calf and thigh cramps in sedentary individuals or after over-indulgence in alcohol and coffee',
          'Cramps on stretching legs in bed or turning over',
          'Chilly, irritable, constipated disposition'
        ],
        materiaMedicaNotes: 'Boericke: Spasmodic affections; cramps in calves and feet on turning in bed. Relieved by warmth.',
        modalities: { worse: 'Morning, cold air, turning in bed', better: 'Warmth, rest' },
        aliases: ['nux vomica', 'nux']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Biochemic Magnesia Phosphorica 6X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Universal nerve and muscle relaxant tissue salt for calf cramps, muscular twitches, and spasms.',
        dosage: '4 tablets dissolved in 1/2 cup warm water 3 times a day.',
        mrp: 135,
        aliases: ['mag phos 6x', 'sbl mag phos']
      },
      {
        name: 'Dr. Reckeweg R11 (Lumbagin & Spasm Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for muscular spasms, cramp colic, and nocturnal myalgia.',
        dosage: '10-15 drops in warm water twice daily.',
        mrp: 310,
        aliases: ['r11', 'reckeweg 11']
      },
      {
        name: 'Bakson Rheum Aid Massage Oil',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '60 ml Oil',
        indications: 'Provides rapid muscular soothing, relieves tight calf knots, and promotes restful sleep.',
        dosage: 'Massage gently onto cramping calf muscles at bedtime.',
        mrp: 130,
        aliases: ['rheum aid oil', 'bakson oil']
      }
    ],
    dietAndRegimen: 'Stay well-hydrated throughout the day; drink coconut water or lemon-salt water to replenish electrolytes. Gently stretch calf muscles against a wall before going to bed. Keep legs and feet warmly covered at night.',
    warningNotes: 'If muscle cramps are accompanied by unilateral calf swelling, redness, warmth, and localized tenderness, urgently perform lower extremity venous Doppler ultrasound to rule out Deep Vein Thrombosis (DVT).'
  }
];
