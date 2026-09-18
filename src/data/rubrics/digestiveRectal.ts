import type { ClinicalCondition } from '../clinicalRepertoryData';

export const DIGESTIVE_RECTAL_CONDITIONS: ClinicalCondition[] = [
  // 7. Piles & Hemorrhoids (পাইলস / অর্শ / মলদ্বারে বলি ও রক্তপাত)
  {
    id: 'piles-hemorrhoids-bleeding',
    nameEn: 'Piles & Hemorrhoids (Bleeding & Blind)',
    nameBn: 'পাইলস ও অর্শ রোগ (মলদ্বারে বলি, জ্বালা ও রক্তপাত)',
    chipLabel: 'Piles / অর্শ ও পাইলস',
    pathology: 'Internal and External Hemorrhoidal Venous Plexus Engorgement, Prolapse and Bleeding',
    miasm: 'Sycotic Venous Stasis with Psoric Portal Congestion',
    typicalPresentation: 'Swollen painful piles protruding at stool, bright red spurting or dripping blood, sensation of sticks or splinters in rectum, severe backache',
    keywords: [
      'piles', 'hemorrhoids', 'অর্শ', 'পাইলস', 'মলদ্বারে রক্ত', 'bloody piles', 'bleeding piles',
      'অর্শবলি', 'মলদ্বারে বলি', 'রেকটাম ব্যথা', 'blind piles', 'protruding piles', 'haemorrhoids',
      'পায়খানায় রক্ত', 'মলদ্বারে ফোলা', 'মলত্যাগে রক্তপাত'
    ],
    classicalRemedies: [
      {
        name: 'Aesculus Hippocastanum 30C',
        commonName: 'Horse Chestnut',
        potency: '30C',
        dosage: '4 pills 3 times daily before meals',
        keynotes: [
          'Dry, aching, prickly sensation as if rectum were full of small sharp sticks or splinters',
          'Blind or bleeding piles with purple painful congested tumors and severe lumbosacral backache',
          'Rectum feels full, dry, and congested; pain shoots up the back'
        ],
        materiaMedicaNotes: 'Boericke: Rectum feels full of small sticks. Dryness and constriction of rectum. Hemorrhoids with severe backache across sacroiliac joints.',
        modalities: { worse: 'Walking, standing, after stool', better: 'Cool open air, rest' },
        aliases: ['aesculus', 'aesculus hip']
      },
      {
        name: 'Hamamelis Virginiana Mother Tincture (Q) / 30C',
        commonName: 'Witch Hazel',
        potency: 'Q / 30C',
        dosage: '10-15 drops Q in water or 4 pills 30C twice daily',
        keynotes: [
          'Profuse dark venous bleeding with piles, painless or with intense rectal soreness and throbbing',
          'Sensation of weight and raw burning in rectum; bleeding leaves patient weak and exhausted',
          'Veins in rectal mucosa dilated, bluish, and relaxed'
        ],
        materiaMedicaNotes: 'Kent: Master remedy for venous hemorrhages. Profuse dark blood flowing freely from piles. Extreme rectal soreness as if bruised.',
        modalities: { worse: 'Warm moist air, exertion', better: 'Rest, cool washing' },
        aliases: ['hamamelis', 'hamamelis virg']
      },
      {
        name: 'Collinsonia Canadensis 30C / Q',
        commonName: 'Stone-Root',
        potency: '30C / Q',
        dosage: '4 pills 3 times daily or 10 drops Q in water',
        keynotes: [
          'Severe chronic stubborn constipation with congestion of pelvic organs and heavy bleeding piles',
          'Sensation of sharp gravel, sand or sticks in rectum; alternating heart symptoms with hemorrhoids',
          'Indicated especially in pregnant women suffering from hemorrhoids'
        ],
        materiaMedicaNotes: 'Boericke: Congestive pelvic inertia with hemorrhoids and obstinate constipation. Stool hard and light-colored.',
        modalities: { worse: 'Pregnancy, cold weather', better: 'Morning, warm drinks' },
        aliases: ['collinsonia', 'collinsonia can']
      },
      {
        name: 'Nux Vomica 30C',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Itching blind or bleeding piles with constant, ineffectual urging to pass stool',
          'Frequent unsuccessful desire for stool; passing little at a time and feels relieved temporarily',
          'History of sedentary lifestyle, alcohol, purgatives, coffee, and rich spicy foods'
        ],
        materiaMedicaNotes: 'Kent: Itching, burning blind hemorrhoids with ineffectual urging for stool. Constriction of rectum in sedentary irritable patients.',
        modalities: { worse: 'Morning, spicy stimulants, anger', better: 'Warmth, short sleep' },
        aliases: ['nux vomica', 'nux']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R13 (Hemorrhoidal Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for hemorrhoids, rectal itching, painful fissure, and venous congestion of rectum.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r13', 'reckeweg 13']
      },
      {
        name: 'SBL FP-Tabs / FP-Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets / 25g Tube',
        indications: 'Highly effective combination that relieves pain, reduces hemorrhoidal tumors, and stops bleeding.',
        dosage: '2 tablets 3 times daily; apply FP ointment locally morning and night after stool.',
        mrp: 140,
        aliases: ['fp-tabs', 'fp-ointment', 'sbl fp']
      },
      {
        name: 'Bakson Pilgo Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves bleeding, blind piles, anal inflammation, and constipation.',
        dosage: '1 tablet 3 times a day.',
        mrp: 175,
        aliases: ['pilgo', 'bakson pilgo']
      }
    ],
    dietAndRegimen: 'Increase dietary fiber (isabgol husk, oats, green leafy vegetables, papayas). Drink 3-4 liters of water daily. Take warm sitz baths for 10 minutes twice daily. Strictly avoid chili, alcohol, and prolonged straining on toilet seat.',
    warningNotes: 'If bleeding is persistent with drop in hemoglobin, black tarry stools (melena), or palpable firm mass in rectum, perform colonoscopy or proctoscopy to rule out colorectal malignancy.'
  },

  // 8. Anal Fissure (অ্যানাল ফিসার / মলদ্বারে কাটার মতো তীব্র ব্যথা)
  {
    id: 'anal-fissure-burning-cutting',
    nameEn: 'Anal Fissure & Severe Rectal Spasm',
    nameBn: 'অ্যানাল ফিসার ও মলদ্বারে কাটার মতো তীব্র ব্যথা (মলদ্বার ছিঁড়ে যাওয়া)',
    chipLabel: 'Anal Fissure / এনাল ফিসার',
    pathology: 'Linear Longitudinal Tear in Anoderm distal to dentate line with internal sphincter hypertonia',
    miasm: 'Syphilitic Ulceration with Psoric Hypersensitivity',
    typicalPresentation: 'Excruciating razor-blade cutting pain during and lasting hours after stool, bright red blood streak on hard stool, dreads defecation, painful rectal spasm',
    keywords: [
      'fissure', 'এনাল ফিসার', 'ফিসার', 'মলদ্বারে কাটার ব্যথা', 'burning anus', 'anal tear',
      'মলদ্বার ফেটে যাওয়া', 'কাটা ব্যথা মলদ্বার', 'stool with tear', 'rectal fissure', 'pain hours after stool',
      'কাটার মতো ব্যথা', 'fissure in ano', 'anal spasm'
    ],
    classicalRemedies: [
      {
        name: 'Ratanhia Peruviana 30C',
        commonName: 'Mapato / Krameria',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Premier specific for anal fissure; severe burning, cutting pain like broken glass in rectum',
          'Agonizing burning lasts for several hours after stool, compelling patient to pace the floor',
          'Rectum feels tightly constricted and dry; temporary relief from cold water'
        ],
        materiaMedicaNotes: 'Boericke: Fissure of the anus, with great constriction and burning like fire, lasting for hours after stool. Stool passes with tremendous effort.',
        modalities: { worse: 'After stool, touch', better: 'Cold water applications' },
        aliases: ['ratanhia', 'ratan']
      },
      {
        name: 'Nitricum Acidum 30C / 200C',
        commonName: 'Nitric Acid',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Sharp, splinter-like stitching pain in anus during stool, persisting for many hours after',
          'Ulceration with irregular jagged edges; bleeds easily upon touch or passage of hard feces',
          'Strong, offensive, horse-urine odor of secretions and sweat'
        ],
        materiaMedicaNotes: 'Kent: Sensation as of a splinter or needle sticking in rectum. Agonizing cutting pain continuing for hours after stool.',
        modalities: { worse: 'After stool, touch, cold air', better: 'Riding in a carriage, warmth' },
        aliases: ['nitric acid', 'nit acid']
      },
      {
        name: 'Paeonia Officinalis 30C / Q',
        commonName: 'Peony',
        potency: '30C / Q',
        dosage: '4 pills 3 times daily, or apply Paeonia ointment locally',
        keynotes: [
          'Biting, burning itching and ulceration of anus; fissures with copious moisture and oozing',
          'Pain continues for hours after defecation; anus feels swollen, excoriated and inflamed',
          'Associated with ulcerated bedsores and perineal fissures'
        ],
        materiaMedicaNotes: 'Boericke: Biting, itching in anus; orifice swollen. Burning in anus after stool; then internal chilliness. Fistula and fissures of anus.',
        modalities: { worse: 'Touch, after stool, motion', better: 'Rolling on bed, cool air' },
        aliases: ['paeonia', 'peony']
      },
      {
        name: 'Graphites 30C / 200C',
        commonName: 'Black Lead',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Large, knotty, hard stools held together by threads of mucus; fissures crack open and bleed',
          'Skin around anus rough, cracked, and weeping thick sticky honey-like moisture',
          'Patient is chilly, constipated, prone to skin eruptions and delayed menses'
        ],
        materiaMedicaNotes: 'Kent: Hard knotty stools with mucus; fissures that crack and bleed with thick sticky exudation.',
        modalities: { worse: 'Warmth of bed, night', better: 'Open cool air, wrapping' },
        aliases: ['graphites', 'graph']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R13 (Fissure & Hemorrhoid Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Relieves agonizing burning, rectal spasm, and heals anal fissures rapidly.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 310,
        aliases: ['r13', 'reckeweg 13']
      },
      {
        name: 'SBL FP-Ointment (Local Application)',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Ointment Tube with Applicator',
        indications: 'Contains Ratanhia, Hamamelis, Paeonia and Calendula to heal fissures, stop bleeding, and relieve sphincter spasms.',
        dosage: 'Apply with applicator inside rectum twice daily after stool and at bedtime.',
        mrp: 95,
        aliases: ['fp-ointment', 'sbl ointment']
      },
      {
        name: 'Bakson Fissure Care / Pilgo Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Reduces anoderm inflammation, heals fissure cuts, and softens stool consistency.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 165,
        aliases: ['bakson fissure care']
      }
    ],
    dietAndRegimen: 'Keep stools soft and formed; take 1 tablespoon of Isabgol husk with warm milk at night. Apply Calendula or Ratanhia ointment before and after defecation. Take warm sitz baths with Calendula water after every bowel movement.',
    warningNotes: 'If multiple fissures located away from midline (lateral fissures) are found, suspect inflammatory bowel disease (Crohn’s disease), tuberculosis, or specific ulceration.'
  },

  // 9. Anal Fistula (ভগন্দর / মলদ্বার দিয়ে পুঁজ পড়া)
  {
    id: 'anal-fistula-in-ano',
    nameEn: 'Anal Fistula (Fistula-in-Ano)',
    nameBn: 'ভগন্দর ও ফিস্টুলা (মলদ্বার দিয়ে পুঁজ ও রক্ত পড়া)',
    chipLabel: 'Fistula / ভগন্দর',
    pathology: 'Chronic Granulomatous Epithelialized Tract connecting anorectal lumen to perianal skin with recurrent purulent discharge',
    miasm: 'Syphilitic-Tubercular Destructive Suppurative Diathesis',
    typicalPresentation: 'Perianal induration with discharging sinus leaking foul pus and blood, intermittent painful swelling that bursts and discharges, perianal excoriation',
    keywords: [
      'fistula', 'ভগন্দর', 'ফিস্টুলা', 'pus from anus', 'anal abscess', 'fistula in ano',
      'মলদ্বারে পুঁজ', 'মলদ্বারে নালী ঘা', 'perianal abscess', 'pus discharge anus',
      'মলদ্বারের পাশে ফোড়া', 'foul smelling anal discharge'
    ],
    classicalRemedies: [
      {
        name: 'Silicea 200C',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills twice weekly in evening',
        keynotes: [
          'Master remedy to promote cellular resolution and healing of deep chronic fistulous tracts',
          'Thin, watery, offensive or curdy pus discharge; induration around external orifice',
          'Chilly constitution, sensitive to cold drafts, offensive foot sweat'
        ],
        materiaMedicaNotes: 'Kent: Deep fistulous tracks with indurated borders. Promotes healthy granulation from the bottom of the fistula.',
        modalities: { worse: 'Cold drafts, dampness', better: 'Warmth, wrapping head warmly' },
        aliases: ['silicea', 'silica']
      },
      {
        name: 'Calcarea Sulphurica 200C',
        commonName: 'Plaster of Paris / Calcium Sulphate',
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Thick, lumpy, yellow, purulent discharge from fistula; continues to discharge without healing',
          'Painful inflammatory induration around perianal opening with intermittent bursting of abscess',
          'Hastens suppuration and cleanses sluggish discharging fistular tunnels'
        ],
        materiaMedicaNotes: 'Boericke: Indicated in the suppurative stage of fistula when discharge is thick, yellow, and persistent.',
        modalities: { worse: 'Heat, warm room', better: 'Open cool air' },
        aliases: ['calc sulph', 'calcarea sulph']
      },
      {
        name: 'Berberis Vulgaris 30C',
        commonName: 'Barberry',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Fistula-in-ano with sharp, stitching, radiating pains around anus and into hips',
          'Itching and burning in perianal region; pain radiates outwards from perianal sinus',
          'Associated with chronic liver or kidney gravel complaints'
        ],
        materiaMedicaNotes: 'Boericke: Fistula in ano with stitching burning pain; itching around anus. Pain extends to perineum and loins.',
        modalities: { worse: 'Motion, pressure', better: 'Rest' },
        aliases: ['berberis vulgaris', 'berberis']
      },
      {
        name: 'Myristica Sebifera 30C',
        commonName: 'Brazilian Virola / "Homeopathic Knife"',
        potency: '30C',
        dosage: '4 pills twice daily in warm water',
        keynotes: [
          'Known as the homeopathic scalpel; accelerates spontaneous opening of perianal abscesses and clears pus',
          'Severe throbbing pain in fistular swelling with marked inflammation',
          'Clears chronic suppurative inflammation in cellular tissues and peri-rectal spaces'
        ],
        materiaMedicaNotes: 'Boericke: Acts powerfully on cellular tissues, speeds suppuration and evacuation. Often acts as a true homeopathic knife.',
        modalities: { worse: 'Touch, evening', better: 'Heat' },
        aliases: ['myristica', 'myristica seb']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R1 (Inflammation & Suppuration Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for deep-seated cellular inflammation, perianal abscess, and suppurating fistulae.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'SBL Biochemic Silicea 12X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Tissue salt formulation promoting deep drainage of necrotic tissue and cellular healing of fistulous tracts.',
        dosage: '4 tablets with warm water 3 times a day.',
        mrp: 135,
        aliases: ['silicea 12x', 'sbl silicea']
      },
      {
        name: 'Bakson Fistula & Abscess Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Helps control pus discharge, reduces perianal swelling, and prevents recurrent fistulous flare-ups.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 170,
        aliases: ['bakson fistula aid']
      }
    ],
    dietAndRegimen: 'Cleanse perianal area with warm sterile water after stool. Avoid tight synthetic underwear. Ensure soft daily bowel movements to prevent recurrent cryptoglandular trauma.',
    warningNotes: 'Assess with MRI Fistulogram to map out high trans-sphincteric tracts, internal openings, or secondary extensions to avoid sphincter injury.'
  },

  // 10. Acidity, GERD & Heartburn (গ্যাস / এসিডিটি / বুক জ্বালা / টক ঢেকুর)
  {
    id: 'acidity-gerd-heartburn',
    nameEn: 'Hyperacidity, GERD & Heartburn',
    nameBn: 'এসিডিটি, বুক জ্বালা ও অম্লপিত্ত (টক ঢেকুর ও গ্যাস্ট্রিক রিফ্লাক্স)',
    chipLabel: 'Acidity / এসিডিটি ও বুক জ্বালা',
    pathology: 'Gastroesophageal Reflux Disease (GERD), Hyperchlorhydria & Esophageal Mucosal Acid Irritation',
    miasm: 'Psoric Gastric Hypersensitivity with Sycotic Metabolic Irritation',
    typicalPresentation: 'Burning pyrosis behind sternum, acid sour regurgitation into mouth, intense sour vomiting, tooth enamel sensitiveness, burning waterbrash',
    keywords: [
      'acidity', 'gerd', 'heartburn', 'বুক জ্বালা', 'টক ঢেকুর', 'গ্যাস', 'acid reflux', 'sour eructation',
      'অম্লপিত্ত', 'গ্যাস্ট্রিক রিফ্লাক্স', 'বুক পোড়া', 'sour vomiting', 'waterbrash', 'burning chest food'
    ],
    classicalRemedies: [
      {
        name: 'Robinia Pseudacacia 30C / Q',
        commonName: 'Yellow Locust',
        potency: '30C / Q',
        dosage: '4 pills 3 times daily before meals or 10 drops Q in water',
        keynotes: [
          'Premier simillimum for intense hyperacidity; everything turns intensely sour in stomach',
          'Sour eructations, sour vomiting so acid that it sets teeth on edge',
          'Severe burning in stomach and chest worse at night upon lying flat'
        ],
        materiaMedicaNotes: 'Boericke: Gastric symptoms accompanied by marked acidity. Heartburn and acidity at night on lying down. Sour vomiting setting teeth on edge.',
        modalities: { worse: 'Night, lying down, fats', better: 'Upright posture, warm drinks' },
        aliases: ['robinia', 'robinia q']
      },
      {
        name: 'Iris Versicolor 30C',
        commonName: 'Blue Flag',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Burning along whole alimentary canal from mouth to anus; tongue feels scalded',
          'Profuse sour, bitter vomiting with frontal sick headache and bilious nausea',
          'Hyperchlorhydria with pancreas and liver congestion'
        ],
        materiaMedicaNotes: 'Kent: Burning throughout the whole gastrointestinal tract. Intensely sour vomit and watery stool that excoriates anus.',
        modalities: { worse: 'Periodical (weekends), 2 AM, motion', better: 'Gentle motion, warm drinks' },
        aliases: ['iris versicolor', 'iris']
      },
      {
        name: 'Nux Vomica 30C',
        commonName: 'Poison Nut',
        potency: '30C',
        dosage: '4 pills at night',
        keynotes: [
          'Weight and pain in stomach 1-2 hours after meals like a stone; sour bitter eructations',
          'Heartburn after heavy meals, coffee, alcohol, smoking, or intellectual night-watching',
          'Constipation with frequent ineffectual urging; irritable disposition'
        ],
        materiaMedicaNotes: 'Kent: Weight and distress in epigastrium an hour or two after eating. Desires vomiting but cannot vomit.',
        modalities: { worse: 'Morning, spices, stimulants, cold', better: 'Warm food, resting quietly' },
        aliases: ['nux vomica', 'nux']
      },
      {
        name: 'Carbo Vegetabilis 30C',
        commonName: 'Vegetable Charcoal',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Extreme distension and upper abdominal bloating; must loosen clothing around waist',
          'Frequent sour, rancid eructations which afford only temporary relief; burning in chest',
          'Desires to be fanned continuously; worse from fatty foods, butter, and milk'
        ],
        materiaMedicaNotes: 'Boericke: Flatulent dyspepsia; upper abdomen distended like a drum. Simple plain food distresses.',
        modalities: { worse: 'Fats, rich foods, evening', better: 'Eructations, cold fanning' },
        aliases: ['carbo veg', 'carbo']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R5 (Gastreu / Stomach Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Famous German drops for acute and chronic gastritis, heartburn, hyperacidity, and sour burping.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r5', 'reckeweg 5']
      },
      {
        name: 'SBL Nixocid Syrup / Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup / 25g Tablets',
        indications: 'Rapidly neutralizes stomach acid, relieves retrosternal burning, and soothes acid regurgitation.',
        dosage: '1-2 teaspoonfuls twice daily after meals.',
        mrp: 130,
        aliases: ['nixocid', 'sbl nixocid']
      },
      {
        name: 'Bakson Gastro Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Comprehensive digestive syrup for heartburn, gastric irritation, nausea, and bloated epigastrium.',
        dosage: '1-2 teaspoonfuls with water 3 times a day.',
        mrp: 145,
        aliases: ['gastro aid', 'bakson gastro aid']
      }
    ],
    dietAndRegimen: 'Eat small, frequent meals rather than large heavy dinners. Avoid eating within 2 hours of sleeping. Elevate head of bed by 6 inches. Strictly avoid raw chilies, oily fries, carbonated drinks, and tobacco.',
    warningNotes: 'If burning sensation radiates down left arm or jaw with cold sweating and shortness of breath, urgently rule out acute coronary syndrome with an immediate ECG.'
  },

  // 11. Chronic Gastritis & Flatulence (পেট ফাঁপা / অজীর্ণ / পেট ভার)
  {
    id: 'gastritis-flatulence-indigestion',
    nameEn: 'Chronic Gastritis, Flatulence & Dyspepsia',
    nameBn: 'পেট ফাঁপা, অজীর্ণ ও বদহজম (পেট ভার ও গ্যাস জমা)',
    chipLabel: 'Indigestion / পেট ফাঁপা ও বদহজম',
    pathology: 'Chronic Atrophic/Erosive Gastric Mucosal Inflammation with Delayed Gastric Emptying and Meteorism',
    miasm: 'Psoric Digestive Sluggishness & Sycotic Fermentation',
    typicalPresentation: 'Tympanitic abdominal bloating, noisy rumbling, feeling full after a few mouthfuls, heavy distress in stomach, foul flatus',
    keywords: [
      'gastric', 'flatulence', 'indigestion', 'পেট ফাঁপা', 'অজীর্ণ', 'বদহজম', 'bloating',
      'পেটে গ্যাস', 'পেট ভার', 'ঢেকুর ওঠা', 'stomach distension', 'dyspepsia', 'tummy bloating',
      'tympanites', 'foul gas', 'meteorism'
    ],
    classicalRemedies: [
      {
        name: 'Carbo Vegetabilis 30C',
        commonName: 'Vegetable Charcoal',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Distension predominantly in upper stomach; entire abdomen feels bloated to bursting',
          'Heavy oppression on chest from gas; must loosen belt and clothing',
          'Craves fresh air and constant fanning; offensive flatus with incomplete relief from eructations'
        ],
        materiaMedicaNotes: 'Boericke: The great polychrest for gas in upper abdomen. Distress after least food. Craves cold air.',
        modalities: { worse: 'Rich fatty foods, evening', better: 'Eructations, cool fanning' },
        aliases: ['carbo veg', 'carbo']
      },
      {
        name: 'Lycopodium Clavatum 30C / 200C',
        commonName: 'Club Moss',
        potency: '30C / 200C',
        dosage: '4 pills in evening in empty stomach',
        keynotes: [
          'Bloating predominantly in lower abdomen; abdomen rumbles and gurgles loudly',
          'Feels hungry, but after taking a few mouthfuls feels completely full and bloated to the throat',
          'Severe aggravation between 4 PM and 8 PM; craves warm foods and sweet desserts'
        ],
        materiaMedicaNotes: 'Kent: Distension in lower abdomen with loud rumbling. Canine hunger, yet a few bites fill him up.',
        modalities: { worse: '4 PM to 8 PM, cold food, cabbage, beans', better: 'Warm drinks, passing flatus' },
        aliases: ['lycopodium', 'lyco']
      },
      {
        name: 'China Officinalis 30C',
        commonName: 'Peruvian Bark',
        potency: '30C',
        dosage: '4 pills twice daily after meals',
        keynotes: [
          'Entire abdomen feels universally distended like a drum; not relieved by belching or flatus',
          'Hypersensitive to light touch on abdomen, but relieved by hard pressure',
          'Sour eructations, bitter taste in mouth, exhaustion from diarrhea or illness'
        ],
        materiaMedicaNotes: 'Boericke: Tympanitic distension of abdomen. Fermentation with bitter taste; belching gives no relief.',
        modalities: { worse: 'Slight touch, milk, fruit', better: 'Hard pressure, warmth' },
        aliases: ['china', 'china off']
      },
      {
        name: 'Asafoetida 30C',
        commonName: 'Ferula Foetida / Hing',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Reverse peristalsis; sensation of a ball rising from stomach into throat (globus hystericus)',
          'Violent loud explosive belching and enormous production of foul gas',
          'Great heaviness and burning in stomach and abdomen'
        ],
        materiaMedicaNotes: 'Boericke: Flatulence and spasmodic contraction of stomach. Great distension with sensation of a ball rising into throat.',
        modalities: { worse: 'Sitting, rest, night', better: 'Motion in open air' },
        aliases: ['asafoetida', 'hing']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R5 (Gastreu / Stomach Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation for flatulent dyspepsia, chronic gastritis, abdominal fullness, and gas colic.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r5', 'reckeweg 5']
      },
      {
        name: 'SBL Dizester Digestive Tonic',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Herbal digestive syrup that improves enzyme secretion, eliminates abdominal gas, and aids assimilation.',
        dosage: '1-2 teaspoonfuls twice daily after meals.',
        mrp: 140,
        aliases: ['dizester', 'sbl dizester']
      },
      {
        name: 'Bakson Gas Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Provides rapid carminative relief from gas accumulation, bloating, and intestinal colic.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 155,
        aliases: ['gas aid', 'bakson gas aid']
      }
    ],
    dietAndRegimen: 'Eat slowly and chew food thoroughly. Sip warm cumin-ginger water after meals. Avoid gas-producing foods (raw cabbage, cauliflower, rajma beans, carbonated drinks). Walk 15 minutes after eating.',
    warningNotes: 'If abdominal distension is accompanied by persistent vomiting, severe crampy pain, and absolute cessation of bowel movements and flatus, urgently evaluate for intestinal obstruction.'
  },

  // 12. Constipation (কোষ্ঠকাঠিন্য / মল পরিষ্কার না হওয়া)
  {
    id: 'chronic-constipation-obstinate',
    nameEn: 'Chronic Obstinate Constipation',
    nameBn: 'দীর্ঘস্থায়ী কোষ্ঠকাঠিন্য (পায়খানা শক্ত ও মল পরিষ্কার না হওয়া)',
    chipLabel: 'Constipation / কোষ্ঠকাঠিন্য',
    pathology: 'Colonic Inertia, Rectal Hyposensitivity & Hard Dehydrated Fecal Impaction',
    miasm: 'Psoric Hypofunction & Sycotic Dryness',
    typicalPresentation: 'No desire for stool for days together, dry hard burnt-looking ball-like stools, straining until exhausted, sensation of remaining fecal matter',
    keywords: [
      'constipation', 'কোষ্ঠকাঠিন্য', 'পায়খানা কড়া', 'hard stool', 'straining', 'dry stool',
      'পায়খানা পরিষ্কার না হওয়া', 'শক্ত পায়খানা', 'obstinate constipation', 'sheep dung stool',
      'no desire stool', 'colonic inertia', 'মলত্যাগ কষ্টকর'
    ],
    classicalRemedies: [
      {
        name: 'Bryonia Alba 200C',
        commonName: 'Wild Hops',
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Stools excessively dry, large, hard, dark and burnt-looking as if scorched by fire',
          'Total absence of rectal moisture; unquenchable thirst for large quantities of cold water at long intervals',
          'Dry lips, dry tongue with white coating, irritable and worse from any movement'
        ],
        materiaMedicaNotes: 'Boericke: Stools hard, dry, large, as if burnt; passed with great effort. Complete dryness of mucous membranes.',
        modalities: { worse: 'Motion, warmth, morning', better: 'Rest, cold drinks' },
        aliases: ['bryonia', 'bry']
      },
      {
        name: 'Alumina 30C / 200C',
        commonName: 'Pure Clay / Aluminum Oxide',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Complete colonic inactivity and rectal paresis; even a soft stool requires tremendous straining',
          'No desire for stool until large accumulation; stools cling to anus like soft clay',
          'Extremely dry mucous membranes; indicated in bottle-fed babies and elderly individuals'
        ],
        materiaMedicaNotes: 'Kent: Complete absence of urging; cannot pass even a soft stool without straining clutching the seat.',
        modalities: { worse: 'Cold winter, potatoes, morning', better: 'Warm drinks, evening' },
        aliases: ['alumina', 'alum']
      },
      {
        name: 'Opium 30C / 200C',
        commonName: 'Poppy',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Absolute paralysis of intestinal peristalsis; no desire for stool for days or weeks',
          'Stool consists of hard, round, black balls like sheep dung',
          'Drowsiness, heavy stupor, dry mouth, painless abdominal distension'
        ],
        materiaMedicaNotes: 'Boericke: Complete inactivity of bowels; hard black balls like sheep dung. No urge whatever.',
        modalities: { worse: 'Heat, stimulants', better: 'Cold' },
        aliases: ['opium']
      },
      {
        name: 'Plumbum Metallicum 30C',
        commonName: 'Lead',
        potency: '30C',
        dosage: '4 pills at bedtime',
        keynotes: [
          'Severe spasmodic constipation; anus feels violently drawn up into rectum by a string',
          'Severe abdominal colic radiating from navel towards spine; navel feels pulled in towards backbone',
          'Hard, lumpy, black feces passed with severe rectal spasm'
        ],
        materiaMedicaNotes: 'Boericke: Constipation with severe colic; anus violently drawn up. Retraction of abdomen towards spine.',
        modalities: { worse: 'Night, motion', better: 'Hard pressure, rubbing' },
        aliases: ['plumbum', 'plumbum met']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Constinil Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Gentle bowel regulator for habitual and chronic constipation, hard dry stools, and incomplete evacuation.',
        dosage: '10-15 drops in 1/4 cup lukewarm water at bedtime.',
        mrp: 145,
        aliases: ['constinil', 'sbl constinil']
      },
      {
        name: 'Dr. Reckeweg R37 (Colinteston / Intestinal Colic & Constipation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for constipation, colonic spasticity, meteorism, and fecal impaction.',
        dosage: '10-15 drops in warm water twice daily.',
        mrp: 310,
        aliases: ['r37', 'reckeweg 37']
      },
      {
        name: 'Bakson Y-Lax Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Non-habit-forming botanical laxative that ensures natural morning bowel clearance.',
        dosage: '1-2 tablets at bedtime with warm water.',
        mrp: 160,
        aliases: ['y-lax', 'bakson y-lax']
      }
    ],
    dietAndRegimen: 'Drink 2 glasses of warm water immediately upon waking. Incorporate soaked prunes, figs, ripe papayas, and isabgol into diet. Maintain fixed daily toilet routine. Engage in regular physical walking.',
    warningNotes: 'If new-onset constipation in patients over 50 years is accompanied by unintended weight loss, alternating diarrhea, or pencil-thin stools, screen for colonic neoplasm.'
  },

  // 13. Acute Diarrhea & Dysentery (পাতলা পায়খানা / ডায়রিয়া / আমাশা)
  {
    id: 'acute-diarrhea-dysentery',
    nameEn: 'Acute Diarrhea & Dysentery (Amoebic / Bacillary)',
    nameBn: 'পাতলা পায়খানা, ডায়রিয়া ও আমাশয় (রক্ত ও আম মিশ্রিত মল)',
    chipLabel: 'Diarrhea / ডায়রিয়া ও আমাশা',
    pathology: 'Infectious Gastroenteritis, Enterocolitis & Rectal Tenesmus with watery or bloody mucous dejections',
    miasm: 'Psoric-Syphilitic Acute Intestinal Inflammation',
    typicalPresentation: 'Frequent profuse watery stools, severe cramping abdominal colic, painful straining (tenesmus), slimy mucus with blood, extreme prostration',
    keywords: [
      'diarrhea', 'dysentery', 'ডায়রিয়া', 'আমাশা', 'পাতলা পায়খানা', 'loose motion', 'আমআশা',
      'পেট খারাপ', 'রক্ত আমাশয়', 'tenesmus', 'watery stool', 'bloody stool', 'amoebic dysentery',
      'mucus stool', 'পেটে মোচড়'
    ],
    classicalRemedies: [
      {
        name: 'Podophyllum Peltatum 30C',
        commonName: 'May-Apple',
        potency: '30C',
        dosage: '4 pills every 3 hours during acute diarrhea',
        keynotes: [
          'Profuse, gushing, painless, watery stools poured out like water from a hydrant',
          'Early morning diarrhea from 4 AM to 10 AM, driving patient out of bed',
          'Extreme abdominal rumbling and weakness; feeling of emptiness and prolapse in rectum'
        ],
        materiaMedicaNotes: 'Boericke: Painless, profuse, gushing diarrhea, worse in the morning. Great exhaustion follows stool.',
        modalities: { worse: 'Early morning, hot weather', better: 'Bending forward, lying on stomach' },
        aliases: ['podophyllum', 'podo']
      },
      {
        name: 'Mercurius Corrosivus 30C',
        commonName: 'Corrosive Sublimate',
        potency: '30C',
        dosage: '4 pills every 2-3 hours during acute tenesmus',
        keynotes: [
          'Severe agonizing tenesmus of rectum and bladder; "never-get-done" feeling',
          'Stools scanty, composed entirely of dark blood, slimy shreds, and shreds of mucus',
          'Intense cutting colic before, during, and continuing after stool'
        ],
        materiaMedicaNotes: 'Kent: Tenesmus of rectum never ceases; agonizing burning cutting colic with bloody mucous discharge.',
        modalities: { worse: 'During and after stool, night', better: 'Warmth' },
        aliases: ['merc cor', 'mercurius corrosivus']
      },
      {
        name: 'Aloe Socotrina 30C',
        commonName: 'Socotrine Aloes',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Sudden urgency driving out of bed at 5 AM; insecurity of anal sphincter (fears passing flatus lest stool escape)',
          'Stool passes with loud sputtering gas and lumps of jelly-like mucus',
          'Burning in rectum after stool with protruding hemorrhoids'
        ],
        materiaMedicaNotes: 'Boericke: Insecurity of sphincter ani; uncertain whether gas or stool will pass. Jelly-like mucus lumps.',
        modalities: { worse: 'Early morning, hot dry weather', better: 'Cold applications, open air' },
        aliases: ['aloe', 'aloe soc']
      },
      {
        name: 'Arsenicum Album 30C',
        commonName: 'White Arsenic',
        potency: '30C',
        dosage: '4 pills 3 times daily in warm water',
        keynotes: [
          'Diarrhea from contaminated food, spoiled meat, or cold ice-creams (food poisoning)',
          'Small, offensive, dark watery stools with burning like fire in rectum and anus',
          'Intense thirst for small sips of warm water, severe restlessness, anxiety, and extreme prostration'
        ],
        materiaMedicaNotes: 'Kent: Rapid prostration and burning. Small dark watery stools with burning heat; thirst for sips of warm water.',
        modalities: { worse: 'Midnight to 2 AM, cold food/drinks', better: 'Heat, warm drinks' },
        aliases: ['arsenic', 'arsenic alb']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R4 (Entero-Gastreu / Diarrhea Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for acute gastroenteritis, summer diarrhea, food poisoning, and intestinal catarrh.',
        dosage: '10-15 drops in warm water every 2 hours; reduce to 3 times daily as symptoms abate.',
        mrp: 310,
        aliases: ['r4', 'reckeweg 4']
      },
      {
        name: 'SBL Dysentrin Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Effective remedy for amoebic and bacillary dysentery, mucous stools, and griping colic.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 145,
        aliases: ['dysentrin', 'sbl dysentrin']
      },
      {
        name: 'Bakson Diarrhea & Colic Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Controls watery stool frequency, stops griping spasms, and prevents dehydration.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 160,
        aliases: ['bakson diarrhea']
      }
    ],
    dietAndRegimen: 'Prepare and administer Oral Rehydration Solution (ORS), coconut water, green tea, and boiled rice water freely to prevent electrolyte loss. Avoid milk, solid heavy meals, and unboiled tap water.',
    warningNotes: 'If patient shows signs of severe dehydration (sunken eyes, dry tongue, low blood pressure, oliguria) or high septic fever with rice-water stools, hospitalize immediately for IV fluids.'
  },

  // 14. Gallbladder Stone & Colic (পিত্তথলির পাথর ও যন্ত্রণা)
  {
    id: 'gallstone-biliary-colic',
    nameEn: 'Gallbladder Stone & Biliary Colic',
    nameBn: 'পিত্তথলির পাথর ও পিত্তশূল (গলব্লাডার স্টোন ও ডান পাশে ব্যথা)',
    chipLabel: 'Gallstone / পিত্তথলির পাথর',
    pathology: 'Cholelithiasis, Biliary Sludge & Acute/Chronic Cholecystitis with biliary spasm',
    miasm: 'Sycotic Dyslipidemia & Psoric-Syphilitic Calculous Diathesis',
    typicalPresentation: 'Severe acute episodic stabbing pain in right hypochondrium radiating to inferior angle of right scapula, jaundice, nausea after fatty meals',
    keywords: [
      'gallstone', 'biliary colic', 'পিত্তথলি পাথর', 'গলব্লাডার স্টোন', 'gb stone', 'cholelithiasis',
      'পিত্তথলিতে পাথর', 'ডান পাশে পাঁজরের নিচে ব্যথা', 'right hypochondrium pain', 'cholecystitis',
      'scapula pain', 'jaundice and gallstone', 'fatty meal pain'
    ],
    classicalRemedies: [
      {
        name: 'Chelidonium Majus Mother Tincture (Q) / 30C',
        commonName: 'Greater Celandine',
        potency: 'Q / 30C',
        dosage: '10-15 drops Q in warm water 3 times daily before food',
        keynotes: [
          'Premier liver and biliary remedy; constant dull or sharp pain at inferior angle of right scapula',
          'Jaundice, yellow tongue with red edges showing imprint of teeth, clay-colored pale stools',
          'Craves very hot boiling drinks which uniquely relieve stomach and liver pains'
        ],
        materiaMedicaNotes: 'Boericke: A prominent liver remedy. Pain under right shoulder blade. Jaundice, gallstones, bilious vomiting.',
        modalities: { worse: 'Right side, touch, 4 AM and 4 PM', better: 'Very hot drinks, eating' },
        aliases: ['chelidonium', 'chelidonium majus', 'chel']
      },
      {
        name: 'Carduus Marianus Mother Tincture (Q)',
        commonName: "St. Mary's Thistle",
        potency: 'Q',
        dosage: '15 drops in water 3 times daily',
        keynotes: [
          'Specific liver and gall-bladder restorative; relieves left-lobe liver soreness and biliary engorgement',
          'Painful tenderness in right hypochondrium; stitch-like pain on deep inhalation',
          'Golden-yellow urine, alternating constipation with bilious diarrhea'
        ],
        materiaMedicaNotes: 'Boericke: Restores healthy bile flow, relieves engorgement of gallbladder and portal congestion.',
        modalities: { worse: 'Lying on left side, motion', better: 'Warmth, sitting bent forward' },
        aliases: ['carduus marianus', 'carduus', 'carduus q']
      },
      {
        name: 'Fel Tauri 3X',
        commonName: "Ox Gall",
        potency: '3X',
        dosage: '2 tablets dissolved in warm water 3 times daily',
        keynotes: [
          'Liquefies thick sluggish bile and prevents precipitation of cholesterol calculi',
          'Obstinate constipation with clay-colored stools and gurgling in gallbladder region',
          'Relieves liver enlargement and sluggish bile secretion'
        ],
        materiaMedicaNotes: 'Boericke: Increases the duodenal secretion and emulsifies fats. Liquefies thickened bile and aids elimination of gallstones.',
        modalities: { worse: 'Fatty foods', better: 'Warm fluids' },
        aliases: ['fel tauri', 'fel tauri 3x']
      },
      {
        name: 'Cholesterinum 3X / 30C',
        commonName: 'Cholesterine',
        potency: '3X / 30C',
        dosage: '2 tablets 3X twice daily or 4 pills 30C',
        keynotes: [
          'Specific organ remedy for cholesterol gallstones and chronic hepatomegaly',
          'Severe burning and agonizing pain in right upper quadrant of abdomen; sleepless from liver ache',
          'Chronic jaundice with intractable itching of skin'
        ],
        materiaMedicaNotes: 'Burnett: Premier remedy to halt cholesterol stone formation and relieve agonizing chronic gallbladder distress.',
        modalities: { worse: 'Touch, lying on right side', better: 'Quiet rest' },
        aliases: ['cholesterinum', 'cholesterine']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R7 (Hepagastreu / Liver & Gallbladder Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Celebrated German formula for gallbladder inflammation, biliary colic, hepatitis, and gallstones.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r7', 'reckeweg 7']
      },
      {
        name: 'SBL Liv-T Liver & Gall Tonic',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Protects hepatic cells, clears biliary stasis, and relieves right-sided hypochondriac heaviness.',
        dosage: '1-2 teaspoonfuls twice daily before meals.',
        mrp: 140,
        aliases: ['liv-t', 'sbl liv-t']
      },
      {
        name: 'Bakson Cholesterinum / Liver Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Regulates cholesterol metabolism and relieves tenderness and inflammation of the biliary tract.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 175,
        aliases: ['bakson liver aid']
      }
    ],
    dietAndRegimen: 'Strictly eliminate fried foods, ghee, butter, and heavy cream. Eat plenty of fiber, apples (rich in malic acid to soften bile), and fresh lemon water. Drink warm water throughout the day.',
    warningNotes: 'If acute biliary colic is accompanied by continuous high spiking fever, shaking chills, and deep jaundice (Charcot’s triad), suspect acute ascending cholangitis or gallstone pancreatitis. Immediate hospitalization is required.'
  },

  // 15. Fatty Liver & Jaundice (ফ্যাটি লিভার / জন্ডিস / লিভার দুর্বলতা)
  {
    id: 'fatty-liver-jaundice-hepatomegaly',
    nameEn: 'Fatty Liver, Jaundice & Liver Dysfunction',
    nameBn: 'ফ্যাটি লিভার ও জন্ডিস (লিভার বৃদ্ধি ও পরিপাক দুর্বলতা)',
    chipLabel: 'Fatty Liver / ফ্যাটি লিভার ও জন্ডিস',
    pathology: 'Hepatic Steatosis (NAFLD/AFLD), Hepatomegaly & Hyperbilirubinemia with portal congestion',
    miasm: 'Sycotic Metabolic Storage with Psoric Digestive Sluggishness',
    typicalPresentation: 'Dull dragging ache in right upper abdomen, yellow discoloration of sclera and skin, dark yellow urine, anorexia, bitter morning taste',
    keywords: [
      'fatty liver', 'jaundice', 'লিভার', 'জন্ডিস', 'ফ্যাটি লিভার', 'hepatitis', 'liver enlargement',
      'হেপাটাইটিস', 'লিভার বৃদ্ধি', 'চোখ হলুদ', 'হলুদ প্রস্রাব', 'nafld', 'liver pain', 'hepatomegaly'
    ],
    classicalRemedies: [
      {
        name: 'Chelidonium Majus Mother Tincture (Q)',
        commonName: 'Greater Celandine',
        potency: 'Q',
        dosage: '15 drops in 1/2 cup warm water twice daily before food',
        keynotes: [
          'Enlarged tender liver; characteristic pain fixed beneath inferior angle of right shoulder blade',
          'Sclera, face, and palms yellow; yellow tongue showing indentation of teeth',
          'Clay-colored pasty stools and dark golden-brown tea-colored urine'
        ],
        materiaMedicaNotes: 'Boericke: Jaundice, enlarged liver, pain under right scapula. Constipation with round clay-like balls.',
        modalities: { worse: 'Right side, touch, early morning', better: 'Hot drinks, gentle walking' },
        aliases: ['chelidonium', 'chelidonium q']
      },
      {
        name: 'Carduus Marianus Mother Tincture (Q)',
        commonName: "St. Mary's Thistle",
        potency: 'Q',
        dosage: '15 drops in water 3 times daily',
        keynotes: [
          'Premier hepatoprotective agent; reverses fatty infiltration and stabilizes liver cell membranes',
          'Swollen, congested, painful liver; patient cannot bear pressure of waistband',
          'Nausea, retching, bitter vomiting, and alternating bowel habits with hemorrhoids'
        ],
        materiaMedicaNotes: 'Kent: The action of Carduus on liver and portal circulation is profound. Cures fatty degeneration of the liver.',
        modalities: { worse: 'Motion, lying on left side', better: 'Rest, warm room' },
        aliases: ['carduus marianus', 'carduus q']
      },
      {
        name: 'Lycopodium Clavatum 30C',
        commonName: 'Club Moss',
        potency: '30C',
        dosage: '4 pills in evening',
        keynotes: [
          'Chronic liver dysfunction with intense lower abdominal gas distension and bloating',
          'Cannot tolerate anything tight around waist; full after eating a few morsels',
          'Craves warm drinks, sweets, and pastries; worse 4 PM to 8 PM'
        ],
        materiaMedicaNotes: 'Kent: Chronic hepatitis, cirrhosis, and fatty liver with tympanitic distension and ascites.',
        modalities: { worse: '4 PM to 8 PM, cold food', better: 'Warm food and drinks' },
        aliases: ['lycopodium', 'lyco']
      },
      {
        name: 'Phosphorus 30C',
        commonName: 'Phosphorus',
        potency: '30C',
        dosage: '4 pills twice weekly',
        keynotes: [
          'Fatty degeneration of liver parenchyma and blood vessels; acute hepatitis with hematogenous jaundice',
          'Craves ice-cold drinks and cold foods which are vomited as soon as they become warm in stomach',
          'Tall, slender, sensitive individuals with hemorrhagic tendency'
        ],
        materiaMedicaNotes: 'Boericke: Fatty degeneration of liver, kidneys, and heart. Jaundice with petechial hemorrhages.',
        modalities: { worse: 'Lying on left side, evening', better: 'Cold food, sleep' },
        aliases: ['phosphorus', 'phos']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Liv-T Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup',
        indications: 'Renowned liver tonic for fatty liver Grade I/II, sluggish liver, loss of appetite, and post-hepatitis debility.',
        dosage: '2 teaspoonfuls twice daily before meals.',
        mrp: 165,
        aliases: ['liv-t', 'sbl liv-t']
      },
      {
        name: 'Dr. Reckeweg R7 (Hepagastreu Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for functional liver disturbances, fatty liver, jaundice, and hepatitis.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 310,
        aliases: ['r7', 'reckeweg 7']
      },
      {
        name: 'Bakson Liv Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Improves liver metabolism, reduces elevated SGOT/SGPT enzymes, and stimulates digestion.',
        dosage: '1-2 teaspoonfuls with water twice a day.',
        mrp: 145,
        aliases: ['liv aid', 'bakson liv aid']
      }
    ],
    dietAndRegimen: 'Strictly avoid all alcohol, soft drinks, trans-fats, and fried snacks. Adopt a Mediterranean diet rich in fresh vegetables, whole grains, and lean proteins. Engage in daily 30-minute brisk aerobic exercise.',
    warningNotes: 'Monitor Serum Bilirubin, SGPT/ALT, SGOT/AST, and abdominal ultrasound. If altered consciousness, flapping tremors (asterixis), or abdominal swelling (ascites) develop, urgently evaluate for hepatic encephalopathy.'
  },

  // 16. Intestinal Worms (কৃমি / পেটে কৃমি / পায়খানার রাস্তায় চুলকানি)
  {
    id: 'intestinal-worms-helminthiasis',
    nameEn: 'Intestinal Worms & Parasitic Infestation',
    nameBn: 'পেটে কৃমি ও পরজীবী উপদ্রব (মলদ্বারে রাতে চুলকানি ও খিটখিটে মেজাজ)',
    chipLabel: 'Worms / কৃমি',
    pathology: 'Enterobiasis (Pinworm), Ascariasis (Roundworm) & Ancylostomiasis (Hookworm) Infestation',
    miasm: 'Psoric-Tubercular Parasitic Diathesis',
    typicalPresentation: 'Intense intolerable itching in rectum and anus aggravated at night in warm bed, rubbing and picking at nose, grinding teeth in sleep, canine hunger',
    keywords: [
      'worms', 'কৃমি', 'pinworm', 'roundworm', 'anal itching night', 'threadworm',
      'পেটে কৃমি', 'মলদ্বারে চুলকানি', 'দাঁত কড়মড় করা', 'নাক চুলকানো', 'grinding teeth sleep',
      'helminthiasis', 'tapeworm', 'কৃমির ওষুধ', 'রাতের বেলা চুলকানি মলদ্বারে'
    ],
    classicalRemedies: [
      {
        name: 'Cina Maritima 30C / 200C',
        commonName: 'Wormseed',
        potency: '30C / 200C',
        dosage: '4 pills morning and evening for 7 days',
        keynotes: [
          'Premier child polychrest for intestinal worms; constant digging, scratching, and picking at the nose',
          'Grinding of teeth during sleep; screams and tosses about at night; extremely irritable and touchy',
          'Canine ravenous hunger shortly after a full meal; urine turns milky on standing'
        ],
        materiaMedicaNotes: 'Kent: Child is cross, irritable; wants to be rocked, does not want to be touched. Constant digging in nose. Grinds teeth.',
        modalities: { worse: 'Touch, looking at child, night', better: 'Lying on abdomen' },
        aliases: ['cina', 'cina maritima']
      },
      {
        name: 'Teucrium Marum Verum 30C',
        commonName: "Cat Thyme",
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Specific remedy for pinworms and ascarides with intense creeping and crawling itching in anus',
          'Severe rectal itching in evening when warm in bed, driving patient almost frantic',
          'Associated with nasal polyps and chronic sniffing'
        ],
        materiaMedicaNotes: 'Boericke: Ascarides with intolerable itching of anus at night in bed. Crawling and creeping in rectum.',
        modalities: { worse: 'Warmth of bed, evening', better: 'Cold applications' },
        aliases: ['teucrium', 'teucrium marum']
      },
      {
        name: 'Santoninum 3X / 6X',
        commonName: 'Active Principle of Wormseed',
        potency: '3X / 6X',
        dosage: '2 tablets at bedtime with warm water for 5 days',
        keynotes: [
          'Direct anthelmintic agent that expels roundworms (Ascaris lumbricoides) and pinworms',
          'Xanthopsia (chromatopsia: seeing objects in yellow or violet light)',
          'Twitching of facial muscles and nocturnal enuresis associated with worms'
        ],
        materiaMedicaNotes: 'Boericke: Destroys and expels roundworms and threadworms. Useful when there is twitching and grinding of teeth.',
        modalities: { worse: 'Night', better: 'Morning' },
        aliases: ['santoninum', 'santonin']
      },
      {
        name: 'Spigelia Anthelmia 30C',
        commonName: 'Pinkroot',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe colic in umbilical region caused by roundworms; pain radiates from navel',
          'Crawling, tickling sensation in rectum with palpitation of heart and left-sided headache',
          'Strabismus and twitching of eyelids associated with helminthiasis'
        ],
        materiaMedicaNotes: 'Kent: Great worm remedy. Cutting colic around the navel; strabismus and palpitations from intestinal worms.',
        modalities: { worse: 'Touch, motion', better: 'Lying on right side' },
        aliases: ['spigelia', 'pinkroot']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Wormorid Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Broad-spectrum homeopathic deworming drops effective against pinworms, roundworms, and hookworms.',
        dosage: '10-15 drops in water twice daily for 7 consecutive days; repeat after 2 weeks.',
        mrp: 140,
        aliases: ['wormorid', 'sbl wormorid']
      },
      {
        name: 'Bakson Worm Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Eliminates intestinal parasites, stops nocturnal teeth grinding, and relieves perianal itching.',
        dosage: '10-15 drops in water twice a day for a week.',
        mrp: 155,
        aliases: ['worm aid', 'bakson worm aid']
      },
      {
        name: 'Dr. Reckeweg R56 (Helminthiasis Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for pinworms, roundworms, intestinal irritation, and associated anemia.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 310,
        aliases: ['r56', 'reckeweg 56']
      }
    ],
    dietAndRegimen: 'Wash hands thoroughly with soap before eating and after using the toilet. Trim fingernails short. Wash bed linens and nightclothes in hot water. Incorporate raw pumpkin seeds and grated carrots into diet. Avoid excess sugary candies.',
    warningNotes: 'If child suffers from intestinal obstruction, heavy vomiting of worms, or profound pallor with anemia, perform stool examination for Ova/Parasites and complete blood count.'
  }
];
