import type { ClinicalCondition } from '../clinicalRepertoryData';

export const RESPIRATORY_THROAT_CONDITIONS: ClinicalCondition[] = [
  // 17. Fish Bone / Splinter in Throat (গলায় কাঁটা ফোটা / সূঁচ বিঁধার অনুভূতি)
  {
    id: 'fish-bone-splinter-throat',
    nameEn: 'Fish Bone & Splinter Sensation in Throat',
    nameBn: 'গলায় মাছের কাঁটা ফোটা ও সূঁচ বিঁধার অনুভূতি (ক্ষত ও যন্ত্রণা)',
    chipLabel: 'Fish Bone / গলায় কাঁটা',
    pathology: 'Pharyngeal / Esophageal Foreign Body Impaction, Mucosal Puncture & Reflex Spasmodic Dysphagia',
    miasm: 'Acute Traumatic & Suppurative Psoric-Syphilitic State',
    typicalPresentation: 'Sharp needle-like sticking or splinter pain in pharynx on swallowing, feeling as if a sharp fish bone or pin is lodged in tonsillar pillar or throat',
    keywords: [
      'fish bone', 'কাঁটা', 'গলায় কাঁটা', 'মাছের কাঁটা', 'splinter in throat', 'needle throat',
      'গলায় কাঁটা ফোটা', 'কাটা বিঁধে থাকা', 'মাছের কাটা', 'fishbone', 'stitching throat',
      'sharp needle in throat', 'foreign body throat', 'গলায় সূঁচ ফোটা', 'গিলে খেতে কাঁটার মতো ব্যথা'
    ],
    classicalRemedies: [
      {
        name: 'Silicea 200C',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills twice daily, or dissolved in warm water for immediate relief',
        keynotes: [
          'Premier homoeopathic remedy to stimulate biological cellular reaction to expel fish bones and needles from tissues',
          'Sharp, needle-like stitching sensations aggravated on swallowing cold water',
          'Relieves foreign-body sensation and prevents abscess formation around embedded splinter'
        ],
        materiaMedicaNotes: 'Boericke: Promotes expulsion of foreign bodies, needles, fish bones embedded in throat tissues. Relieves pricking like a pin.',
        modalities: { worse: 'Cold drinks, swallowing, drafts', better: 'Warm drinks, wrapping neck warmly' },
        aliases: ['silicea', 'silica']
      },
      {
        name: 'Hepar Sulphuris Calcareum 200C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '200C',
        dosage: '4 pills dissolved in warm water twice daily',
        keynotes: [
          'Sensation as if a sharp splinter or fish bone were sticking in throat when swallowing',
          'Pain shoots into ears on swallowing saliva; throat feels extremely raw and sensitive to touch',
          'Extreme intolerance to cold air; patient wants neck wrapped in warm scarf'
        ],
        materiaMedicaNotes: 'Kent: Sensation of a fish bone or splinter sticking in throat; pain extends to ears on swallowing. Extreme chilliness.',
        modalities: { worse: 'Cold drafts, cold drinks, swallowing', better: 'Warm drinks, heat, wrapping head warmly' },
        aliases: ['hepar sulph', 'hepar']
      },
      {
        name: 'Argentum Nitricum 30C',
        commonName: 'Silver Nitrate',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Sensation of a sharp splinter embedded in throat when swallowing, talking, or turning neck',
          'Dark red, congested, relaxed throat mucosa with thick tenacious mucus',
          'Relieved by cool air and cold water; anxious, hurried disposition'
        ],
        materiaMedicaNotes: 'Boericke: Sensation of a splinter in throat on swallowing. Dark red uvula and pharynx with thick adherent mucus.',
        modalities: { worse: 'Warm room, swallowing solids', better: 'Cold drinks, fresh air' },
        aliases: ['argentum nit', 'arg nit']
      },
      {
        name: 'Nitricum Acidum 30C',
        commonName: 'Nitric Acid',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Splinter-like stitching pains appearing and disappearing suddenly',
          'Throat feels ulcerated and raw; sharp needle pains aggravated on swallowing even liquids',
          'Offensive breath with salivation'
        ],
        materiaMedicaNotes: 'Kent: Pains like sharp splinters, sticking and pricking on swallowing. Tendency to rapid ulceration.',
        modalities: { worse: 'Swallowing, cold air, night', better: 'Warmth' },
        aliases: ['nitric acid', 'nit acid']
      }
    ],
    patentFormulations: [
      {
        name: 'Bakson Throat Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Soothes inflamed mucosal puncture wounds, relieves sharp pharyngeal pricking, and calms dysphagia.',
        dosage: '1 tablet dissolved slowly in mouth 3 times a day.',
        mrp: 170,
        aliases: ['throat aid', 'bakson throat aid']
      },
      {
        name: 'Dr. Reckeweg R1 (Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for acute local tissue irritation, throat inflammation, and prickling sensations.',
        dosage: '10-15 drops in warm water 3 times daily.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'SBL Tonsilat Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Relieves painful swallowing, pharyngeal irritation, and foreign body scratchiness.',
        dosage: '2 tablets dissolved in mouth 3 times daily.',
        mrp: 140,
        aliases: ['tonsilat', 'sbl tonsilat']
      }
    ],
    dietAndRegimen: 'Sip warm water or swallow a small soft ball of boiled rice or mashed ripe banana. Avoid dry crusts, chips, or spicy curries that irritate the sensitive mucosal scratch. Gargle with warm Calendula water.',
    warningNotes: 'If there is stridor, respiratory distress, inability to swallow saliva (drooling), or active bleeding, perform urgent direct laryngoscopy or ENT examination to physically extract deeply impacted sharp foreign bodies.'
  },

  // 18. Bronchial Asthma (হাঁপানি / শ্বাসকষ্ট / রাতে শ্বাসকষ্ট বৃদ্ধি)
  {
    id: 'bronchial-asthma-wheezing',
    nameEn: 'Bronchial Asthma & Wheezing Dyspnea',
    nameBn: 'ব্রঙ্কিয়াল অ্যাজমা ও হাঁপানি (শ্বাসকষ্ট, বাঁশির মতো আওয়াজ ও দম বন্ধ ভাব)',
    chipLabel: 'Asthma / হাঁপানি ও শ্বাসকষ্ট',
    pathology: 'Chronic Airway Hyper-responsiveness, Bronchospasm & Viscid Mucous Plugging of bronchioles',
    miasm: 'Psoric-Sycotic Airway Spasm & Tubercular Diathesis',
    typicalPresentation: 'Agonizing paroxysmal suffocation compelling patient to sit upright leaning forward, loud whistling wheeze, cough with scanty viscid sputum, worse midnight to early dawn',
    keywords: [
      'asthma', 'breathlessness', 'হাঁপানি', 'শ্বাসকষ্ট', 'দম বন্ধ', 'wheezing', 'bronchial asthma',
      'বুকে বাঁশির শব্দ', 'রাতে শ্বাসকষ্ট', 'দম আটকে আসা', 'dyspnea', 'chest tightness', 'suffocation',
      'হাপানি', 'শীতকালে শ্বাসকষ্ট'
    ],
    classicalRemedies: [
      {
        name: 'Blatta Orientalis Mother Tincture (Q) / 30C',
        commonName: 'Indian Cockroach',
        potency: 'Q / 30C',
        dosage: '10-15 drops Q in warm water every 2 hours during acute spasm, then 3 times daily',
        keynotes: [
          'Premier clinical specific for acute asthma complicated by bronchitis and heavy wheezing',
          'Severe bronchial spasm triggered by exposure to dust, mold, and damp rainy weather',
          'Patient is stout, corpulent, suffocating with copious rattling mucus'
        ],
        materiaMedicaNotes: 'Boericke: A renowned remedy for asthma, especially when associated with bronchitis and aggravated by damp weather.',
        modalities: { worse: 'Rainy damp weather, dust, exertion', better: 'Warm drinks, sitting up' },
        aliases: ['blatta', 'blatta orientalis', 'blatta q']
      },
      {
        name: 'Arsenicum Album 30C',
        commonName: 'White Oxide of Arsenic',
        potency: '30C',
        dosage: '4 pills in warm water at night',
        keynotes: [
          'Suffocating paroxysms of asthma worse midnight to 2 AM; cannot lie down, must sit up bent forward',
          'Intense anxiety, fear of suffocation and death, great restlessness; burns in chest like hot coals',
          'Scanty frothy white sputum; thirst for frequent small sips of warm water'
        ],
        materiaMedicaNotes: 'Kent: Asthma worse from midnight to 2 AM. Compelled to spring out of bed and sit bent forward with agonizing anxiety.',
        modalities: { worse: 'Midnight to 2 AM, cold air, lying flat', better: 'Heat, warm drinks, sitting bent forward' },
        aliases: ['arsenic', 'arsenic alb']
      },
      {
        name: 'Ipecacuanha 30C',
        commonName: 'Ipecac-Root',
        potency: '30C',
        dosage: '4 pills every 2 hours during acute wheezing',
        keynotes: [
          'Loud rattling of mucus in chest on coughing, but no phlegm is expectorated; chest seems full of phlegm',
          'Persistent unrelenting nausea with clean, un-coated red tongue and profuse salivation',
          'Sudden constriction in larynx and chest; child turns blue and stiff with each cough paroxysm'
        ],
        materiaMedicaNotes: 'Boericke: Spasmodic asthma with constant nausea. Incessant violent cough with rattling in chest, without expectoration.',
        modalities: { worse: 'Warm moist air, lying down', better: 'Open fresh air, rest' },
        aliases: ['ipecac', 'ipecacuanha']
      },
      {
        name: 'Natrum Sulphuricum 200C',
        commonName: "Glauber's Salt / Sodium Sulphate",
        potency: '200C',
        dosage: '4 pills twice weekly in morning',
        keynotes: [
          'Humid asthma aggravated in damp rainy weather or living in damp basements near water',
          'Severe asthma attacks recurring characteristically at 4 AM to 5 AM with loose rattling cough',
          'Must hold the chest with both hands when coughing; greenish-yellow thick expectoration'
        ],
        materiaMedicaNotes: 'Kent: King of sycotic remedies for humid asthma. Aggravated by damp weather and around 4 to 5 AM.',
        modalities: { worse: 'Damp rainy weather, 4-5 AM, basements', better: 'Dry warm weather, sitting up' },
        aliases: ['natrum sulph', 'nat sulph']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R43 (Herbamine / Asthma Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for bronchial asthma, spastic bronchitis, night dyspnea, and wheezing.',
        dosage: '10-15 drops in warm water 3-4 times daily; during acute attacks, every 15-30 minutes.',
        mrp: 310,
        aliases: ['r43', 'reckeweg 43']
      },
      {
        name: 'SBL Astha Aid Syrup / Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Bronchodilator and expectorant syrup containing Blatta, Ipecac and Justicia that eases breathing and clears bronchial passages.',
        dosage: '1-2 teaspoonfuls in warm water 3 times daily.',
        mrp: 145,
        aliases: ['astha aid', 'sbl astha aid']
      },
      {
        name: 'Bakson Astha Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves airway resistance, stops spastic cough, and promotes deep comfortable breathing.',
        dosage: '1 tablet 3 times a day with lukewarm water.',
        mrp: 170,
        aliases: ['bakson astha aid']
      }
    ],
    dietAndRegimen: 'Avoid cold refrigerated drinks, ice creams, curd at night, and bananas. Keep bedroom dust-mite free; use allergen-proof mattress encasings. Sip warm ginger-tulsi tea during breathing tightness.',
    warningNotes: 'If patient shows cyanosis (blue lips/fingertips), peak expiratory flow rate (PEFR) below 50% predicted, inability to complete full sentences, or silent chest on auscultation, administer emergency oxygen bronchodilator therapy immediately.'
  },

  // 19. Tonsillitis & Quinsy (টনসিল বৃদ্ধি / গিলতে ব্যথা / লাল হয়ে ফোলা)
  {
    id: 'tonsillitis-quinsy-enlarged',
    nameEn: 'Acute & Chronic Tonsillitis & Quinsy',
    nameBn: 'টনসিলাইটিস ও টনসিল বৃদ্ধি (গলায় তীব্র ব্যথা ও গিলতে কষ্ট)',
    chipLabel: 'Tonsillitis / টনসিল',
    pathology: 'Streptococcal or Viral Pharyngeal Tonsillar Hypertrophy, Follicular Exudation & Peritonsillar Cellulitis',
    miasm: 'Psoric-Tubercular Hypertrophic Diathesis with Syphilitic Tendency',
    typicalPresentation: 'Bright red, swollen tonsils with white or yellow follicular crypts, high fever with flushed face, acute shooting pain to ears upon swallowing, difficult mouth opening',
    keywords: [
      'tonsil', 'tonsillitis', 'টনসিল', 'গিলতে কষ্ট', 'enlarged tonsils', 'quinsy', 'follicular tonsillitis',
      'টনসিল বৃদ্ধি', 'গলা ফোলা', 'গলা ব্যথা', 'swollen tonsils', 'peritonsillar abscess', 'সর্দি ও টনসিল',
      'টনসিলে ঘা', 'গলায় ঘা'
    ],
    classicalRemedies: [
      {
        name: 'Belladonna 30C',
        commonName: 'Deadly Nightshade',
        potency: '30C',
        dosage: '4 pills every 2 hours during acute red-hot swelling',
        keynotes: [
          'Sudden violent onset; tonsils bright red, swollen, dry, and glistening with high fever',
          'Flushed red face, throbbing carotids, dilated pupils; throat feels constricted like a vise',
          'Sharp shooting pains to ears on swallowing liquids; worse from light, jar, and touch'
        ],
        materiaMedicaNotes: 'Boericke: Tonsils bright red, swollen, throat feels constricted; difficult swallowing, worse for liquids. Sudden violent onset with high heat.',
        modalities: { worse: 'Touch, jar, turning head, swallowing liquids', better: 'Semi-erect rest, warmth' },
        aliases: ['belladonna', 'bell']
      },
      {
        name: 'Baryta Carbonica 30C / 200C',
        commonName: 'Carbonate of Barium',
        potency: '30C / 200C',
        dosage: '4 pills twice weekly in chronic enlargement',
        keynotes: [
          'Constitutional polychrest for scrofulous children with chronically enlarged, indurated tonsils',
          'Takes cold easily from slightest damp change; colds settle straight in tonsils causing quinsy',
          'Slow development, timid, shy, backward mentally and physically; enlarged cervical lymph glands'
        ],
        materiaMedicaNotes: 'Kent: Great remedy for chronic hypertrophy of tonsils in scrofulous children who take cold on every change of weather.',
        modalities: { worse: 'Cold damp air, washed hair', better: 'Warm wrapping' },
        aliases: ['baryta carb', 'baryta']
      },
      {
        name: 'Phytolacca Decandra 30C',
        commonName: 'Poke-Root',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Dark red, bluish or purple discoloration of tonsils and fauces with severe follicular spots',
          'Excruciating pain radiating like an electric shock straight to both ears upon swallowing',
          'Intense aching in neck, spine, and limbs; tongue red tip with blisters'
        ],
        materiaMedicaNotes: 'Boericke: Tonsils swollen, dark red; shooting pain into ears on swallowing. Great aching in whole body.',
        modalities: { worse: 'Hot drinks, swallowing', better: 'Cold drinks, quiet rest' },
        aliases: ['phytolacca', 'phyto']
      },
      {
        name: 'Mercurius Solubilis 30C',
        commonName: "Hahnemann's Soluble Mercury",
        potency: '30C',
        dosage: '4 pills twice daily in evening',
        keynotes: [
          'Suppurative tonsillitis with yellowish dirty ulcers; profuse offensive salivation wetting pillow',
          'Flabby indented tongue showing teeth marks; putrid fetid breath from mouth',
          'Profuse nighttime sweating that brings no relief; worse at night and from warmth of bed'
        ],
        materiaMedicaNotes: 'Kent: Deep follicular tonsillitis with ulcers, profuse offensive saliva, indented tongue, and nocturnal sweat without relief.',
        modalities: { worse: 'Night, warmth of bed, damp cold', better: 'Moderate temperature' },
        aliases: ['merc sol', 'mercurius']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Tonsilat Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Specific proven remedy for acute and chronic tonsillitis, follicular sore throat, and glandular enlargement.',
        dosage: '2 tablets dissolved in mouth 3 times daily.',
        mrp: 140,
        aliases: ['tonsilat', 'sbl tonsilat']
      },
      {
        name: 'Dr. Reckeweg R1 (Anginacid / Inflammation Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation for acute tonsillitis, pharyngitis, quinsy, and lymph node swelling.',
        dosage: '10-15 drops in water every 2 hours during acute phase.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'Bakson Throat Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves painful swallowing, reduces tonsil inflammation, and clears follicular crypts.',
        dosage: '1 tablet 3 times a day.',
        mrp: 170,
        aliases: ['throat aid', 'bakson throat aid']
      }
    ],
    dietAndRegimen: 'Gargle 3 times daily with warm salt water or diluted Calendula mother tincture. Sip warm honey-lemon water. Avoid cold drinks, ice creams, and deep-fried hard snacks.',
    warningNotes: 'If there is trismus (inability to open jaw), unilateral tonsillar bulge pushing uvula to opposite side (quinsy/peritonsillar abscess), or airway compromise, arrange immediate ENT needle aspiration or surgical drainage.'
  },

  // 20. Acute Bronchitis & Chest Congestion (বুকে সর্দি জমা / ব্রঙ্কাইটিস / ঘড়ঘড় আওয়াজ)
  {
    id: 'bronchitis-chest-congestion-cough',
    nameEn: 'Acute Bronchitis & Rattling Chest Congestion',
    nameBn: 'তীব্র ব্রঙ্কাইটিস ও বুকে কফ জমা (ঘড়ঘড় আওয়াজ ও কাসি)',
    chipLabel: 'Bronchitis / বুকে কফ ও ব্রঙ্কাইটিস',
    pathology: 'Acute Tracheobronchial Mucosal Inflammation with hypersecretion of catarrhal phlegm and bronchial spasm',
    miasm: 'Tubercular-Psoric Bronchial Congestion',
    typicalPresentation: 'Loud rattling noise of loose mucus in chest upon breathing and coughing, difficult expectoration, painful raw burning behind sternum, exhausting paroxysms of coughing',
    keywords: [
      'bronchitis', 'chest congestion', 'বুকে সর্দি', 'ঘড়ঘড়', 'rattling chest', 'cough with phlegm',
      'বুকে কফ জমা', 'কাশি', 'কফ তোলা কষ্টকর', 'বুকে ঘড়ঘড় আওয়াজ', 'tracheitis', 'loose cough',
      'deep chest cough', 'rattling phlegm'
    ],
    classicalRemedies: [
      {
        name: 'Antimonium Tartaricum 30C',
        commonName: 'Tartar Emetic',
        potency: '30C',
        dosage: '4 pills every 3 hours in warm water',
        keynotes: [
          'Immense accumulation of mucus in bronchial tree, rattling loudly with every respiration',
          'Chest seems full of phlegm, but patient lacks strength to cough it up (feeble expectoration)',
          'Drowsiness, debility, pallor of face, blue lips; infant or elderly patient gasping for breath'
        ],
        materiaMedicaNotes: 'Boericke: Great rattling of mucus, but little is expectorated. Drowsiness and sweat with suffocation. Indicated in capillary bronchitis.',
        modalities: { worse: 'Lying down, warmth of room, 4 AM', better: 'Sitting upright, expectorating' },
        aliases: ['antim tart', 'ant tart']
      },
      {
        name: 'Bryonia Alba 30C',
        commonName: 'Wild Hops',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Dry, hard, racking, painful cough; patient holds chest firmly with both hands to prevent motion agony',
          'Intense sharp stitching pain in chest walls, aggravated by the slightest breath or movement',
          'Intense thirst for large draughts of cold water; dry mouth, tongue coated white'
        ],
        materiaMedicaNotes: 'Kent: Dry hacking painful cough; holds chest with hands. Sharp stitches in chest aggravated by the least motion.',
        modalities: { worse: 'Any motion, breathing deeply, coming into warm room', better: 'Absolute quiet rest, pressure' },
        aliases: ['bryonia', 'bry']
      },
      {
        name: 'Drosera Rotundifolia 30C',
        commonName: 'Round-Leaved Sundew',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Paroxysmal whooping spasmodic cough; paroxysms follow each other so rapidly patient cannot catch breath',
          'Deep barking ringing cough; retching and vomiting of mucus with severe tickling in larynx',
          'Worse immediately upon lying down at night and after midnight'
        ],
        materiaMedicaNotes: 'Boericke: Spasmodic, dry, irritative cough resembling whooping cough. Attacks of barking cough worse after midnight.',
        modalities: { worse: 'Lying down, warmth of bed, after midnight', better: 'Sitting up' },
        aliases: ['drosera', 'dros']
      },
      {
        name: 'Justicia Adhatoda Mother Tincture (Q) / 30C',
        commonName: 'Malabar Nut / Basak',
        potency: 'Q / 30C',
        dosage: '10-15 drops Q in warm water 3 times daily',
        keynotes: [
          'Highly acclaimed Ayurvedic-Homeopathic expectorant; liquefies tenacious phlegm and clears lungs',
          'Violent dry or loose cough with tightness across chest and rattling phlegm',
          'Lachrymation with fluent coryza, loss of smell and taste'
        ],
        materiaMedicaNotes: 'Boericke: Highly efficacious medicine for respiratory catarrh. Paroxysmal cough with suffocative obstruction of respiration.',
        modalities: { worse: 'Closed warm room, night', better: 'Open cool air, warm tea' },
        aliases: ['justicia', 'justicia adhatoda', 'adhatoda']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R8 / R9 (Jutussin / Cough Syrup & Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '150 ml Syrup / 22 ml Drops',
        indications: 'Celebrated German formulation for catarrhal bronchitis, dry spasmodic cough, and loose chest rattling.',
        dosage: '1-2 teaspoonfuls syrup 3-4 times daily in warm water.',
        mrp: 330,
        aliases: ['r8', 'r9', 'reckeweg 8']
      },
      {
        name: 'SBL Stodal Cough Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup',
        indications: 'Universal cough syrup for productive and non-productive cough, bronchial irritation, and wheezing.',
        dosage: '1-2 teaspoonfuls 3 times a day.',
        mrp: 145,
        aliases: ['stodal', 'sbl stodal']
      },
      {
        name: 'Wheezal Bronchopect Syrup',
        brand: 'Wheezal',
        company: 'Wheezal Homoeo Pharma',
        country: 'India',
        bottleSize: '120 ml Syrup',
        indications: 'Liquefies thick chest congestion, relieves bronchial spasm, and restores effortless breathing.',
        dosage: '1-2 teaspoonfuls in warm water twice daily.',
        mrp: 140,
        aliases: ['bronchopect', 'wheezal bronchopect']
      }
    ],
    dietAndRegimen: 'Perform steam inhalation with 2 drops of Eucalyptus oil twice daily. Sip warm ginger, clove, and tulsi tea. Keep chest and throat warmly clad. Avoid cold refrigerated water and oily snacks.',
    warningNotes: 'If high continuous fever, rusty or frank blood-stained sputum (hemoptysis), tachypnea, or localized bronchial tubular breath sounds develop, evaluate for lobar pneumonia with a Chest X-Ray.'
  },

  // 21. Common Cold & Sneezing / Coryza (সর্দি / অনবরত হাঁচি / নাক দিয়ে জল পড়া)
  {
    id: 'common-cold-sneezing-coryza',
    nameEn: 'Common Cold, Fluent Coryza & Violent Sneezing',
    nameBn: 'সর্দি ও অনবরত হাঁচি (নাক দিয়ে কাঁচা জল পড়া ও নাক বন্ধ)',
    chipLabel: 'Cold & Sneezing / সর্দি ও হাঁচি',
    pathology: 'Acute Viral Rhinitis, Nasopharyngeal Catarrhal Inflammation with paroxysmal sneezing and rhinorrhea',
    miasm: 'Psoric Acute Catarrhal State',
    typicalPresentation: 'Violent bouts of sneezing upon waking or exposure to dust/drafts, profuse watery nasal discharge, burning eyes, nasal blockage at night, dull frontal headache',
    keywords: [
      'cold', 'sneezing', 'সর্দি', 'হাঁচি', 'নাক দিয়ে জল পড়া', 'running nose', 'coryza', 'common cold',
      'ঘন ঘন হাঁচি', 'নাক বন্ধ', 'সর্দি কাশি', 'watery nose', 'acute rhinitis', 'nasal catarrh'
    ],
    classicalRemedies: [
      {
        name: 'Allium Cepa 30C',
        commonName: 'Red Onion',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Profuse, watery, acrid nasal discharge that burns and excoriates the upper lip and nostrils',
          'Profuse, bland (non-acrid) lachrymation; eyes water without irritating eyelids',
          'Violent paroxysms of sneezing; symptoms distinctly aggravated in a warm room, relieved in cool open air'
        ],
        materiaMedicaNotes: 'Boericke: Acrid nasal discharge with bland lachrymation (reverse of Euphrasia). Sneezing especially on entering a warm room.',
        modalities: { worse: 'Warm room, evening', better: 'Open cool air, cold room' },
        aliases: ['allium cepa', 'cepa']
      },
      {
        name: 'Arsenicum Album 30C',
        commonName: 'White Oxide of Arsenic',
        potency: '30C',
        dosage: '4 pills twice daily in warm water',
        keynotes: [
          'Thin, watery, excoriating nasal discharge that burns like fire; nose feels stopped up despite fluid pouring out',
          'Violent sneezing that affords no relief; chilly, thirsty for frequent warm sips',
          'Aggravated after midnight and from cold air; relieved by warmth and hot drinks'
        ],
        materiaMedicaNotes: 'Kent: Thin, watery, burning excoriating discharge; nose stopped up. Chilly, anxious, relieved by warmth.',
        modalities: { worse: 'Cold drafts, open air, after midnight', better: 'Warmth, hot applications' },
        aliases: ['arsenic', 'arsenic alb']
      },
      {
        name: 'Gelsemium Sempervirens 30C',
        commonName: 'Yellow Jasmine',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Dull, drowsy, dizzy, drooping cold; patient wants to lie down quiet and be left alone',
          'Heavy eyelids (ptosis), dull occipital headache extending over vertex to forehead',
          'Complete absence of thirst with aching in limbs and muscular soreness'
        ],
        materiaMedicaNotes: 'Boericke: Dullness, dizziness, and drowsiness. Heavy drooping eyelids. Sneezing with fullness at root of nose.',
        modalities: { worse: 'Damp weather, anticipation, motion', better: 'Profuse urination, rest' },
        aliases: ['gelsemium', 'gels']
      },
      {
        name: 'Euphrasia Officinalis 30C',
        commonName: 'Eyebright',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Profuse, acrid, scalding lachrymation that burns the cheeks and inflames eyelids',
          'Profuse, bland, non-irritating watery nasal discharge (exact opposite of Allium Cepa)',
          'Violent cough and sneezing with photophobia and red eyes'
        ],
        materiaMedicaNotes: 'Boericke: Acrid tears and bland nasal discharge. Eyes water constantly and are intensely sensitive to light.',
        modalities: { worse: 'Sunlight, wind, evening', better: 'Dark room, open air' },
        aliases: ['euphrasia', 'euph']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R96 (Pulsatilla Nasal Spray / Cold Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '15 ml Spray / 22 ml Drops',
        indications: 'German specific for acute coryza, blocked nasal passages, allergic rhinitis, and sneezing.',
        dosage: '1-2 nasal sprays into each nostril 3 times daily, or 10-15 drops in water.',
        mrp: 320,
        aliases: ['r96', 'reckeweg 96']
      },
      {
        name: 'SBL AF-Tabs (Anti-Flu / Cold Tablets)',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Combats common cold, runny nose, sneezing, body ache, and low fever.',
        dosage: '2 tablets 3 times daily.',
        mrp: 135,
        aliases: ['af-tabs', 'sbl af tabs']
      },
      {
        name: 'Bakson Cold Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves nasal congestion, watery rhinorrhea, frontal heaviness, and sneezing fits.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 155,
        aliases: ['cold aid', 'bakson cold aid']
      }
    ],
    dietAndRegimen: 'Drink warm water and hot chicken or vegetable soup. Inhale gentle steam. Wash face with lukewarm water. Avoid cold drafts, air-conditioner blasts, and iced beverages.',
    warningNotes: 'If common cold persists beyond 10 days with thick foul purulent discharge and unilateral facial pain, rule out acute secondary maxillary sinusitis.'
  },

  // 22. Sinusitis & Sinus Headache (সাইনাস / কপালে ও নাকে ভারী ব্যথা)
  {
    id: 'sinusitis-sinus-headache',
    nameEn: 'Sinusitis & Frontal Sinus Headache',
    nameBn: 'সাইনাসাইটিস ও কপালে তীব্র মাথাব্যথা (নাক বন্ধ ও পুঁজযুক্ত সর্দি)',
    chipLabel: 'Sinusitis / সাইনাস ও কপালে ব্যথা',
    pathology: 'Acute/Chronic Paranasal Sinus Mucosal Inflammation (Maxillary, Frontal, Ethmoidal) with ostial blockage',
    miasm: 'Sycotic Catarrhal Induration & Psoric Inflammation',
    typicalPresentation: 'Heavy throbbing pressure over forehead, cheekbones and root of nose, thick sticky stringy yellowish-green mucus, post-nasal drip, headache worse bending forward',
    keywords: [
      'sinus', 'sinusitis', 'সাইনাস', 'নাক বন্ধ', 'sinus headache', 'frontal headache', 'post nasal drip',
      'কপালে ভারী ব্যথা', 'চোখের চারিপাশে ব্যথা', 'thick mucus nose', 'maxillary sinus', 'কপালে যন্ত্রণা',
      'নাক দিয়ে হলুদ সর্দি'
    ],
    classicalRemedies: [
      {
        name: 'Kali Bichromicum 30C / 200C',
        commonName: 'Potassium Bichromate',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Discharge of thick, ropy, tenacious, stringy yellowish-green mucus that can be drawn out in long threads',
          'Severe pressure and pain at the root of nose; pain localized in small spots that can be covered with the fingertip',
          'Tough elastic plugs or "clinkers" blown from nose leaving raw bleeding surface'
        ],
        materiaMedicaNotes: 'Boericke: Premier sinus remedy. Tenacious, stringy, tough green discharge. Pain in small spots. Severe frontal sinus headache.',
        modalities: { worse: 'Cold damp weather, morning, bending forward', better: 'Heat, warm applications' },
        aliases: ['kali bich', 'kali bichromicum']
      },
      {
        name: 'Silicea 30C / 200C',
        commonName: 'Pure Flint',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Chronic suppurative frontal and ethmoidal sinusitis with hard crusts in nostrils that bleed when picked',
          'Pain starts in nape of neck, ascends to vertex and settles over one eye (especially right eye)',
          'Extremely chilly; head feels relieved by wrapping warmly with a scarf or woolen cap'
        ],
        materiaMedicaNotes: 'Kent: Chronic catarrh of sinuses with offensive crusts. Headache relieved by wrapping head warmly.',
        modalities: { worse: 'Cold drafts, uncovering head, mental exertion', better: 'Warm wrapping, heat' },
        aliases: ['silicea', 'silica']
      },
      {
        name: 'Teucrium Marum Verum 30C',
        commonName: "Cat Thyme",
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Sinusitis complicated by nasal polyps and chronic obstruction of nostrils',
          'Large green crusts discharged from posterior nares with foul breath and loss of smell',
          'Crawling tingling in nostrils with violent paroxysms of sneezing'
        ],
        materiaMedicaNotes: 'Boericke: Catarrhal conditions with polypi. Large green crusts blown from nose. Sensation of crawlings in nostrils.',
        modalities: { worse: 'Damp warm weather, touch', better: 'Open air' },
        aliases: ['teucrium', 'teucrium marum']
      },
      {
        name: 'Pulsatilla Nigricans 30C',
        commonName: 'Wind Flower',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Chronic subacute sinusitis with thick, profuse, yellow, bland (non-irritating) discharge',
          'Loss of taste and smell; right side nostril stopped up in evening, running in open air',
          'Thirstless, emotional; distinct relief from cool outdoor air, aggravated in warm stuffy rooms'
        ],
        materiaMedicaNotes: 'Boericke: Thick, profuse, yellow, bland mucus. Loss of smell and taste. Better in open cool air.',
        modalities: { worse: 'Warm closed room, evening', better: 'Open cool air, cold compresses' },
        aliases: ['pulsatilla', 'puls']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R49 (Rhinopulsan / Sinus Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Highly renowned German formula for acute and chronic sinusitis, maxillary catarrh, and frontal sinus pressure.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 310,
        aliases: ['r49', 'reckeweg 49']
      },
      {
        name: 'SBL Sinusin Drops',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Clears blocked sinus ostia, drains thick purulent phlegm, and relieves facial and peri-orbital pain.',
        dosage: '10-15 drops in 1/4 cup water 3 times a day.',
        mrp: 145,
        aliases: ['sinusin', 'sbl sinusin']
      },
      {
        name: 'Bakson Sinus Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Relieves post-nasal dripping, fronto-temporal headaches, and chronic nasal stuffiness.',
        dosage: '1 tablet 3 times daily with warm water.',
        mrp: 165,
        aliases: ['sinus aid', 'bakson sinus aid']
      }
    ],
    dietAndRegimen: 'Practice warm saline nasal irrigation (Jala Neti) under hygienic guidance. Perform regular facial steam inhalation twice daily. Avoid chilled milk, ice creams, curd at night, and dusty surroundings.',
    warningNotes: 'If sinus inflammation is accompanied by peri-orbital swelling, proptosis (bulging eye), double vision (diplopia), or severe high spiking fever, evaluate urgently for orbital cellulitis or cavernous sinus thrombosis with CT PNS.'
  },

  // 23. Allergic Rhinitis & Pollen Allergy (অ্যালার্জিক রাইনাইটিস / ধুলোবালি লাগলে হাঁচি)
  {
    id: 'allergic-rhinitis-dust-pollen',
    nameEn: 'Allergic Rhinitis, Hay Fever & Pollen Allergy',
    nameBn: 'অ্যালার্জিক রাইনাইটিস ও ডাস্ট অ্যালার্জি (ধুলোবালি লাগলেই হাঁচি ও নাক চুলকানো)',
    chipLabel: 'Allergy / অ্যালার্জিক রাইনাইটিস',
    pathology: 'IgE-Mediated Nasal Mucosal Hypersensitivity to inhaled aeroallergens (dust mites, pollen, animal dander)',
    miasm: 'Psoric Hypersensitivity & Tubercular Allergic Diathesis',
    typicalPresentation: 'Incessant paroxysmal sneezing (10-30 sneezes at a stretch), intense itching of palate, eyes, and inner nose, clear watery rhinorrhea, dark under-eye allergic shiners',
    keywords: [
      'allergic rhinitis', 'dust allergy', 'অ্যালার্জি হাঁচি', 'নাক চুলকানো', 'hay fever', 'pollen allergy',
      'ধুলোবালিতে হাঁচি', 'অ্যালার্জি', 'নাক ও তালু চুলকানো', 'sneezing fits', 'itching palate',
      'morning allergy', 'ঠান্ডা লাগলেই হাঁচি'
    ],
    classicalRemedies: [
      {
        name: 'Sabadilla 30C',
        commonName: 'Cevadilla Seed',
        potency: '30C',
        dosage: '4 pills 3 times daily in water',
        keynotes: [
          'Violent paroxysms of sneezing accompanied by profuse lachrymation and severe frontal headache',
          'Intolerable itching and tickling in nose, soft palate, and pharynx; patient rubs tongue against roof of mouth',
          'Over-sensitiveness to odor of flowers, perfumes, and fresh garlic'
        ],
        materiaMedicaNotes: 'Boericke: Spasmodic sneezing, with running eyes and nose. Copious watery discharge. Itching of soft palate.',
        modalities: { worse: 'Cold air, odor of flowers, perfume', better: 'Warm food and drinks, wrapping up' },
        aliases: ['sabadilla', 'sabad']
      },
      {
        name: 'Arsenicum Iodatum 30C',
        commonName: 'Iodide of Arsenic',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Persistent, irritating, thin, watery, excoriating discharge from nose that reddens and burns upper lip',
          'Frequent sneezing with raw burning sensation in nostrils and post-nasal drip',
          'Patient feels hot and restless; symptoms persist day and night'
        ],
        materiaMedicaNotes: 'Kent: Relieves allergic rhinitis and hay fever with thin, watery, excoriating secretion and rawness of nostrils.',
        modalities: { worse: 'Wind, cold damp weather', better: 'Warm open air' },
        aliases: ['arsenic iod', 'ars iod']
      },
      {
        name: 'Histaminum Hydrochloricum 200C',
        commonName: 'Histamine Hydrochloride',
        potency: '200C',
        dosage: '4 pills once weekly or every 3 days',
        keynotes: [
          'Direct biological homeopathic anti-histaminic; desensitizes hyper-reactive mast cells',
          'Instant relief from sudden allergic cascades: profuse sneezing, itching eyes, urticarial rash, and mucosal edema',
          'Specific for dust, pollen, chemical fumes, and weather change sensitivities'
        ],
        materiaMedicaNotes: 'Julian: Modulates mast-cell degranulation and stops acute histamine release. Highly valuable in all allergic conditions.',
        modalities: { worse: 'Exposure to allergens, dust', better: 'Rest' },
        aliases: ['histaminum', 'histamine']
      },
      {
        name: 'Allium Cepa 30C',
        commonName: 'Red Onion',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Catarrhal sneezing from damp cold winds and flower pollens; nasal discharge burns lip like fire',
          'Bland tears from eyes with constant nose wiping',
          'Marked improvement in open fresh air, worse in warm rooms'
        ],
        materiaMedicaNotes: 'Boericke: Hay fever; violent sneezing on rising from bed, acrid rhinorrhea, bland tears.',
        modalities: { worse: 'Warm room, evening', better: 'Open cool air' },
        aliases: ['allium cepa', 'cepa']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R84 (Allergie Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German desensitizing formulation for allergic rhinitis, pollen asthma, dust allergy, and hay fever.',
        dosage: '10-15 drops in water 3 times daily.',
        mrp: 320,
        aliases: ['r84', 'reckeweg 84']
      },
      {
        name: 'SBL Allermid Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Rapid non-drowsy relief from sneezing fits, runny nose, itching palate, and red watery eyes.',
        dosage: '2 tablets 3 times daily.',
        mrp: 140,
        aliases: ['allermid', 'sbl allermid']
      },
      {
        name: 'Bakson Aller Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Controls seasonal allergies, stops nasal hypersecretion, and clears itchy throat.',
        dosage: '1 tablet 3 times a day.',
        mrp: 165,
        aliases: ['aller aid', 'bakson aller aid']
      }
    ],
    dietAndRegimen: 'Avoid sweeping rooms with dry brooms (use wet mopping). Wash pillow covers and bed sheets weekly in warm water. Avoid carpets and fluffy soft toys in the bedroom. Wear a mask when outdoors during high pollen season.',
    warningNotes: 'If allergic rhinitis is progressively complicated by nocturnal wheezing, dry cough, or breathlessness, evaluate for coexisting cough-variant bronchial asthma with Spirometry.'
  },

  // 24. Hoarseness & Loss of Voice / Laryngitis (গলা ভাঙা / স্বরভঙ্গ / কথা বলতে না পারা)
  {
    id: 'hoarseness-loss-voice-laryngitis',
    nameEn: 'Hoarseness, Loss of Voice & Acute Laryngitis',
    nameBn: 'স্বরভঙ্গ ও গলা ভাঙা (কথা বলতে না পারা ও স্বরযন্ত্রের প্রদাহ)',
    chipLabel: 'Hoarseness / স্বরভঙ্গ ও গলা ভাঙা',
    pathology: 'Acute/Chronic Laryngeal Mucosal Inflammation, Vocal Cord Edema & Vocal Strain Aphonia',
    miasm: 'Psoric-Syphilitic Vocal Cord Weakness & Catarrh',
    typicalPresentation: 'Voice completely lost or hoarse, rough, deep and rasping; painful scraping in larynx, voice cracks when singing or speaking loudly, vocal exhaustion in teachers/singers',
    keywords: [
      'hoarseness', 'loss of voice', 'স্বরভঙ্গ', 'গলা ভাঙা', 'laryngitis', 'aphonia', 'voice lost',
      'কথা বলতে না পারা', 'গলা বসে যাওয়া', 'singer vocal strain', 'teacher hoarseness', 'vocal cord swelling',
      'rough voice', 'husky voice'
    ],
    classicalRemedies: [
      {
        name: 'Causticum 30C / 200C',
        commonName: "Hahnemann's Tinctura Acris Sine Kali",
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Premier simillimum for painless loss of voice and vocal cord paresis; hoarseness aggravated in morning',
          'Voice gives out completely in public speakers, teachers, and singers from vocal fatigue',
          'Rawness, burning, and soreness down the trachea; patient cannot cough deep enough to dislodge phlegm'
        ],
        materiaMedicaNotes: 'Kent: Master remedy for morning hoarseness and loss of voice. Paresis of laryngeal muscles from vocal strain or exposure to dry cold wind.',
        modalities: { worse: 'Dry cold air, morning, vocal exertion', better: 'Damp wet weather, warm drinks' },
        aliases: ['causticum', 'caust']
      },
      {
        name: 'Argentum Metallicum 30C',
        commonName: 'Metallic Silver',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Total loss of voice in professional singers and orators as soon as they begin to speak or sing',
          'Raw, burning rawness in larynx; coughing produces gelatinous viscid mucus like boiled starch',
          'Throat feels sore and constricted; voice cracks on attempting high notes'
        ],
        materiaMedicaNotes: 'Boericke: Great remedy for affections of larynx and vocal cords in singers and public speakers. Voice fails as soon as used.',
        modalities: { worse: 'Using voice, noon', better: 'Open air' },
        aliases: ['argentum met', 'arg met']
      },
      {
        name: 'Phosphorus 30C',
        commonName: 'Phosphorus',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe hoarseness worse in the evening; larynx is so painful patient cannot talk above a whisper',
          'Extreme rawness, tickling, and burning in larynx; sensation as if larynx were lined with velvet',
          'Cough triggered by talking, laughing, reading aloud, or cold air'
        ],
        materiaMedicaNotes: 'Kent: Larynx so painful and raw he cannot speak above a whisper. Hoarseness aggravated in the evening.',
        modalities: { worse: 'Evening, twilight, talking, cold air', better: 'Sleep, cold water' },
        aliases: ['phosphorus', 'phos']
      },
      {
        name: 'Drosera Rotundifolia 30C',
        commonName: 'Round-Leaved Sundew',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Voice hoarse, deep, toneless, hollow and cracked; speaking requires great physical exertion',
          'Severe dry barking spasmodic cough with sensation of a feather tickling in larynx',
          'Worse at night upon lying down'
        ],
        materiaMedicaNotes: 'Boericke: Voice is hoarse, deep, toneless, cracked. Constriction and irritation in larynx.',
        modalities: { worse: 'Night, warmth of bed', better: 'Rest' },
        aliases: ['drosera', 'dros']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R45 (Laryngisan / Hoarseness Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation specifically designed for acute and chronic laryngitis, hoarseness, and loss of voice.',
        dosage: '10-15 drops in lukewarm water 3-4 times daily.',
        mrp: 310,
        aliases: ['r45', 'reckeweg 45']
      },
      {
        name: 'Bakson Voice Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Restores clear vocal tone, soothes strained vocal cords, and eases laryngeal inflammation.',
        dosage: '1 tablet dissolved slowly in mouth 3 times a day.',
        mrp: 175,
        aliases: ['voice aid', 'bakson voice aid']
      },
      {
        name: 'SBL Tonsilat Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Soothes pharyngo-laryngeal irritation, hoarseness, and painful throat rawness.',
        dosage: '2 tablets dissolved in mouth twice daily.',
        mrp: 140,
        aliases: ['tonsilat', 'sbl tonsilat']
      }
    ],
    dietAndRegimen: 'Absolute vocal rest (no whispering, as whispering strains cords more than soft speaking). Sip warm water with raw honey and a slice of fresh ginger. Steam inhalation twice daily. Strictly avoid cold refrigerated drinks, smoking, and throat clearing.',
    warningNotes: 'If hoarseness persists continuously for more than 3 weeks in a smoker or elderly patient without acute infection, arrange urgent indirect laryngoscopy or flexible nasopharyngoscopy to rule out vocal cord nodules, polyps, or laryngeal carcinoma.'
  }
];
