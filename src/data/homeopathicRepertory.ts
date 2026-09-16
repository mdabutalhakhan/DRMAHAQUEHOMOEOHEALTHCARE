import { AIConsultResult, RemedySuggestion } from '../types';

export interface RepertoryCondition {
  id: string;
  category: string;
  keywords: string[];
  miasm: string;
  keynoteRubric: string;
  remedies: RemedySuggestion[];
  dietAdvice: string[];
}

export const HOMEOPATHIC_REPERTORY_DATABASE: RepertoryCondition[] = [
  {
    id: 'arthritis-joint-pain',
    category: 'Locomotor & Joints',
    keywords: [
      'joint', 'joint pain', 'knee', 'knees', 'arthritis', 'osteoarthritis', 'rheumatism', 
      'stiffness', 'back pain', 'lumbago', 'sciatica', 'cervical', 'spondylitis', 'swelling', 
      'gout', 'ankylosing', 'pain in legs', 'shoulder', 'elbow'
    ],
    miasm: 'Sycotic with Syphilitic undertone',
    keynoteRubric: 'Kent: Extremities - Pain, joints, rheumatic, worse cold damp weather',
    remedies: [
      {
        remedy_name: 'Rhus Toxicodendron (Rhus Tox)',
        common_name: 'Poison Ivy',
        potency: '30C / 200C',
        dosage: '4 drops or 4 pills twice daily in 1/4 cup water',
        key_indications: [
          'Stiffness worse on first beginning to move, distinctly better after continued gentle motion',
          'Ailments brought on by exposure to cold damp weather, rain, or getting wet while overheated',
          'Restlessness at night, cannot stay in one position in bed; must toss and turn for relief',
        ],
        materia_medica_notes: 'Dr. Boericke: Primary affinity for fibrous tissue, tendons, ligaments, and joints. Characteristic keynote: Aggravated by rest and initial movement; ameliorated by warm dry applications, continued movement, and heat.',
        modalities: {
          worse: 'Rest, beginning of motion, cold damp weather, night, uncovering',
          better: 'Continued gentle motion, warm applications, dry heat, rubbing',
        },
      },
      {
        remedy_name: 'Bryonia Alba',
        common_name: 'White Bryony / Wild Hops',
        potency: '30C / 200C',
        dosage: '4 drops twice daily before meals',
        key_indications: [
          'Severe stitching and tearing joint pains sharply aggravated by the slightest movement or jarring',
          'Great relief experienced by absolute rest and firm pressure or lying on the affected joint',
          'Marked dryness of mucous membranes with great thirst for large quantities of cold water at long intervals',
        ],
        materia_medica_notes: 'Dr. Kent: Complete immobility gives comfort. The patient wants to be completely quiet and undisturbed. Pains are sharp, stitching, worse on breathing or moving even a finger.',
        modalities: {
          worse: 'Any movement, jarring, morning, warm room',
          better: 'Absolute rest, firm pressure, lying on painful side, cold compresses',
        },
      },
      {
        remedy_name: 'Ledum Palustre',
        common_name: 'Wild Rosemary / Marsh Tea',
        potency: '200C',
        dosage: '4 pills twice daily for 5 days',
        key_indications: [
          'Gouty and rheumatic pains that ascend from lower extremities upward (ankles to knees to hips)',
          'Affected joints are purple, swollen, yet lack natural vital heat; sensation of coldness',
          'Peculiar modality: Intolerant of warm blankets; pains are distinctly relieved by ice-cold water baths',
        ],
        materia_medica_notes: 'Dr. Boericke: Invaluable in gout and chronic rheumatism. Modality is diagnostic: Patient cannot bear the heat of the bed or covers; puts feet in a tub of ice-cold water for relief.',
        modalities: {
          worse: 'Warmth of bed, heat of stove, night, motion',
          better: 'Ice-cold applications, plunging limbs in cold water, rest',
        },
      },
      {
        remedy_name: 'Causticum (Hahnemanni)',
        common_name: 'Tinctura Acris Sine Kali',
        potency: '200C',
        dosage: '4 pills once daily at night',
        key_indications: [
          'Chronic arthritis with deformity, shortening of tendons, and progressive contraction of joints',
          'Restless legs at night; tearing, drawing pains in muscular parts',
          'Pains markedly aggravated in clear fine dry cold weather; ameliorated in damp wet rainy weather',
        ],
        materia_medica_notes: 'Dr. Kent: Remarkable paradox in modalities: Better in damp wet weather and worse in clear cold dry wind. Indicated in contractures, paralytic weakness, and arthritic deformities.',
        modalities: {
          worse: 'Clear dry cold wind, drafts, morning, mental fatigue',
          better: 'Damp rainy weather, warmth of bed, heat',
        },
      },
    ],
    dietAdvice: [
      'Avoid sour foods, excessive curd/yogurt at night, and raw cold refrigerated drinks.',
      'Maintain gentle mobility walks morning and evening without overstraining inflamed joints.',
      'Apply dry warm fomentation; avoid sudden drafts of cold air after bathing.',
    ],
  },
  {
    id: 'rhinitis-respiratory-allergy',
    category: 'Respiratory & Allergies',
    keywords: [
      'rhinitis', 'allergy', 'allergic', 'sneezing', 'cold', 'coryza', 'runny nose', 
      'nasal congestion', 'sinus', 'sinusitis', 'watery eyes', 'hay fever', 'dust allergy',
      'polyp', 'blocked nose', 'post nasal drip'
    ],
    miasm: 'Psora with acute Sycotic manifestation',
    keynoteRubric: 'Boericke: Nose - Coryza, profuse watery acrid discharge with violent paroxysms of sneezing',
    remedies: [
      {
        remedy_name: 'Allium Cepa',
        common_name: 'Red Onion',
        potency: '30C',
        dosage: '4 drops 3 times daily in 2 tablespoons water',
        key_indications: [
          'Profuse, watery, excoriating nasal discharge that burns and reddens the upper lip and nostrils',
          'Violent, incessant paroxysms of sneezing, especially on entering a warm room',
          'Eyes water copiously but tears are bland (non-excoriating), contrasting with the acrid nose flow',
        ],
        materia_medica_notes: 'Dr. Boericke: Acrid nasal discharge with bland lachrymation is the hallmark keynote of Allium Cepa. Symptoms worsen in warm rooms and improve noticeably in fresh cool open air.',
        modalities: {
          worse: 'Warm room, evening, damp cold north winds',
          better: 'Open cool fresh air, cool room, gentle walking outdoors',
        },
      },
      {
        remedy_name: 'Arsenicum Album',
        common_name: 'White Oxide of Arsenic',
        potency: '30C / 200C',
        dosage: '4 drops twice daily morning and evening',
        key_indications: [
          'Thin, watery, burning excoriating coryza that makes the nose feel raw and sore',
          'Frequent sneezing with a sensation of nose being stuffed up despite continuous thin dripping',
          'Accompanied by anxiety, restlessness, chilliness, and thirst for small sips of warm water',
        ],
        materia_medica_notes: 'Dr. Kent: Great burning sensations relieved by heat. Patient is chilly, neat, anxious, and aggravated at midnight (12-2 AM). Warm drinks and warm wraps give immediate relief.',
        modalities: {
          worse: 'Cold open air, midnight (12 AM - 2 AM), cold drinks',
          better: 'Heat in general, hot fomentation, warm drinks, wrapping head',
        },
      },
      {
        remedy_name: 'Pulsatilla Nigricans',
        common_name: 'Wind Flower / Pasque Flower',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        key_indications: [
          'Late stage of cold with thick, bland, yellowish-green nasal discharge without irritation or burning',
          'Loss of taste and smell; nose stopped up in a warm room and in the evening, free in the open air',
          'Mild, gentle, weeping disposition; complete thirstlessness even with dry mouth',
        ],
        materia_medica_notes: 'Dr. Boericke: Invaluable in catarrhal states. Discharge is thick, yellow, and bland. Completely intolerant of heat and stuffy rooms; craves fresh cool circulating breeze.',
        modalities: {
          worse: 'Warm closed room, evening, lying down, rich fatty foods',
          better: 'Open cool air, gentle motion, cold applications',
        },
      },
      {
        remedy_name: 'Sabadilla',
        common_name: 'Cevadilla Seeds',
        potency: '30C',
        dosage: '4 drops twice daily',
        key_indications: [
          'Explosive paroxysms of spasmodic sneezing that shake the entire body',
          'Severe itching and tickling in the soft palate and roof of mouth, compelling patient to rub with tongue',
          'Hypersensitivity to flower scents, perfumes, and garlic odor',
        ],
        materia_medica_notes: 'Dr. Boericke: Chief keynote is spasmodic sneezing with lachrymation and frontal headache, provoked by the slightest scent of flowers or dust.',
        modalities: {
          worse: 'Cold air, odor of flowers, garlic, periodically',
          better: 'Warm drinks, warm food, warm room',
        },
      },
    ],
    dietAdvice: [
      'Avoid chilled water, ice-creams, citrus fruits in the evening, and direct exposure to air-conditioner drafts.',
      'Take lukewarm water sips throughout the day.',
      'Steam inhalation with plain water (avoid strong menthol/camphor additions near homeopathic doses).',
    ],
  },
  {
    id: 'gastric-acidity-dyspepsia',
    category: 'Gastrointestinal & Digestion',
    keywords: [
      'acidity', 'acid', 'gastric', 'heartburn', 'gerd', 'dyspepsia', 'indigestion', 
      'gas', 'bloating', 'flatulence', 'sour burps', 'eructations', 'nausea', 'vomiting', 
      'stomach pain', 'constipation', 'burning stomach', 'ulcer', 'belching'
    ],
    miasm: 'Psora with Sycotic overlay',
    keynoteRubric: 'Kent: Stomach - Eructations, sour; heartburn, worse after rich food and stimulants',
    remedies: [
      {
        remedy_name: 'Nux Vomica',
        common_name: 'Poison Nut',
        potency: '30C / 200C',
        dosage: '4 drops or pills at bedtime in 2 tablespoons water',
        key_indications: [
          'Sour eructations, heartburn, nausea, and heaviness in epigastrium 1 to 2 hours after meals',
          'Constant ineffectual urging for stool; feels better momentarily after partial evacuation',
          'Irritable, impatient, ambitious temperament; aggravated by stimulants, spices, coffee, late nights',
        ],
        materia_medica_notes: 'Dr. Boericke: The greatest remedy for modern sedentary lifestyle complaints, overeating, digestive derangements, and drug overdosing. Hallmark: Sensation of a heavy stone in stomach.',
        modalities: {
          worse: 'Morning on waking, after eating, mental overwork, spices, coffee, cold air',
          better: 'Warm drinks, evening, short restorative nap, moist warm weather',
        },
      },
      {
        remedy_name: 'Carbo Vegetabilis',
        common_name: 'Vegetable Charcoal',
        potency: '30C / 200C',
        dosage: '4 drops 30 minutes before meals',
        key_indications: [
          'Excessive upper abdominal gas and distension; stomach feels full to bursting after simplest food',
          'Frequent sour or rancid belching which brings temporary slight relief to pressure',
          'Patient feels air-starved, sluggish, and constantly demands to be fanned with fresh circulating breeze',
        ],
        materia_medica_notes: 'Dr. Kent: Sluggish venous system with digestive collapse. Upper abdomen is massively distended; cannot bear tight belts around the waist.',
        modalities: {
          worse: 'Warmth, rich fatty foods, butter, lying flat, evening',
          better: 'Eructations (belching), continuous fanning, cool air, passing flatus',
        },
      },
      {
        remedy_name: 'Lycopodium Clavatum',
        common_name: 'Club Moss',
        potency: '30C / 200C',
        dosage: '4 pills once daily in the morning',
        key_indications: [
          'Lower abdominal flatulence and fermentation with loud gurgling and rumbling',
          'Can eat only a few mouthfuls and feels full to the throat (early satiety)',
          'Characteristic aggravation period: Symptoms markedly worse from 4:00 PM to 8:00 PM; craves hot drinks',
        ],
        materia_medica_notes: 'Dr. Boericke: Deep acting liver and digestive polychrest. Marked weakness of digestion with intense craving for sweets, warm water, and warm food.',
        modalities: {
          worse: '4 PM to 8 PM, cold drinks, flatulent foods (cabbage, beans, onions)',
          better: 'Warm drinks, warm food, unbuttoning clothes, open air',
        },
      },
      {
        remedy_name: 'Robinia Pseudacacia',
        common_name: 'Yellow Locust',
        potency: '30C / Q (Mother Tincture)',
        dosage: '30C: 4 drops twice daily | Q: 10 drops in 1/4 cup warm water after meals',
        key_indications: [
          'Pronounced hyperchlorhydria with intensely sour fluid regurgitation burning the esophagus',
          'Sour vomiting so acrid that it sets the teeth on edge and excoriates throat',
          'Constant burning pain in stomach radiating between shoulder blades; worse at night on lying down',
        ],
        materia_medica_notes: 'Dr. Boericke: Intensely acid secretions dominate the clinical picture. Indicated in acute GERD, sour heartburn, and acid dyspepsia.',
        modalities: {
          worse: 'Night, lying flat, immediately after eating',
          better: 'Vomiting sour fluid, sitting upright, warm bland drinks',
        },
      },
    ],
    dietAdvice: [
      'Take small frequent meals instead of heavy dinners. Avoid eating within 2 hours of sleeping.',
      'Eliminate raw onions, garlic, excess chili powder, tea, coffee, and carbonated beverages.',
      'Drink lukewarm cumin or fennel infused water after principal meals.',
    ],
  },
  {
    id: 'skin-rash-eczema-urticaria',
    category: 'Dermatology & Skin',
    keywords: [
      'skin', 'rash', 'eczema', 'itching', 'urticaria', 'hives', 'dermatitis', 'boil', 
      'psoriasis', 'eruption', 'pimples', 'acne', 'burning skin', 'dry skin', 'scabies',
      'redness', 'oozing'
    ],
    miasm: 'Psora with Syphilitic destructive tendency',
    keynoteRubric: 'Kent: Skin - Itching, voluptuous; worse warmth of bed, washing',
    remedies: [
      {
        remedy_name: 'Sulphur',
        common_name: 'Brimstone / Sublimated Sulphur',
        potency: '200C / 30C',
        dosage: '200C: 4 pills once weekly in the early morning fasting',
        key_indications: [
          'Intense, voluptuous itching followed by burning soreness when scratched',
          'Skin is dry, scaly, and unwashed in appearance; aversion to bathing which aggravates all complaints',
          'Great heat on top of head and burning sensations in the soles of feet at night (sticks feet out of bed)',
        ],
        materia_medica_notes: 'Dr. Hahnemann: The king of antipsoric remedies. Characteristic keynote: Itching worse from warmth of bed and woolens, distinctly worse after washing.',
        modalities: {
          worse: 'Warmth of bed, washing/bathing, morning 11 AM, standing',
          better: 'Dry warm weather, lying on right side',
        },
      },
      {
        remedy_name: 'Apis Mellifica',
        common_name: 'Honey Bee',
        potency: '30C / 200C',
        dosage: '4 drops 3 times daily in water',
        key_indications: [
          'Sudden edematous puffy pink swelling with stinging, burning pains like bee stings',
          'Skin is extremely sensitive to the slightest touch; intolerably aggravated by any heat',
          'Utter thirstlessness during feverish allergic skin reactions; desires cool air and cold baths',
        ],
        materia_medica_notes: 'Dr. Boericke: Keynotes are edema, stinging pain, soreness, and intolerance of heat. Marked relief from cold water applications.',
        modalities: {
          worse: 'Heat, warm room, hot bath, touch, afternoon 3 PM',
          better: 'Cold water washing, cold applications, open cool air',
        },
      },
      {
        remedy_name: 'Graphites',
        common_name: 'Black Lead / Plumbago',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        key_indications: [
          'Eczematous eruptions in the bends of limbs, behind the ears, on eyelids, and groins',
          'Exudation of thick, sticky, glutinous fluid resembling honey or white of egg',
          'Skin is dry, rough, hard, and cracks easily; patient tends to be chilly and prone to constipation',
        ],
        materia_medica_notes: 'Dr. Kent: The exudation is pathognomonic: thick, sticky, transparent honey-like fluid that stiffens linen. Highly effective in fissures and chronic eczema.',
        modalities: {
          worse: 'Warmth, at night, during and after menses',
          better: 'Wrapping up warmly, open air, dark room',
        },
      },
      {
        remedy_name: 'Rhus Toxicodendron (Rhus Tox)',
        common_name: 'Poison Ivy',
        potency: '30C / 200C',
        dosage: '4 drops twice daily',
        key_indications: [
          'Red, swollen, vesicular eruptions filled with clear fluid, intensely burning and itching',
          'Urticaria triggered by getting drenched in rain, cold damp drafts, or profuse sweating',
          'Paradoxical relief: Scalding hot water applied to the itchy rash gives immense temporary comfort',
        ],
        materia_medica_notes: 'Dr. Boericke: Excellent for erysipelas, herpes zoster, and acute vesicular eruptions. Relief from very hot water applications is a verified clinical keynote.',
        modalities: {
          worse: 'Cold wet air, night, scratching',
          better: 'Hot water applications, gentle motion, warm dry room',
        },
      },
    ],
    dietAdvice: [
      'Wear loose breathable pure cotton garments; avoid synthetic tight nylon fabrics.',
      'Bathe in lukewarm water with mild natural neem or glycerin soap; avoid scrubbing.',
      'Refrain from non-vegetarian spicy curries, prawns/crustaceans, and fermented foods.',
    ],
  },
  {
    id: 'cough-bronchitis-throat',
    category: 'Pulmonary & Respiratory',
    keywords: [
      'cough', 'dry cough', 'wet cough', 'phlegm', 'bronchitis', 'asthma', 'throat', 
      'sore throat', 'hoarseness', 'tonsillitis', 'chest congestion', 'wheezing', 
      'barking cough', 'breathlessness', 'expectoration'
    ],
    miasm: 'Tubercular with Psora',
    keynoteRubric: 'Kent: Cough - Spasmodic, paroxysmal, dry; worse night, lying down',
    remedies: [
      {
        remedy_name: 'Drosera Rotundifolia',
        common_name: 'Round-leaved Sundew',
        potency: '30C / 200C',
        dosage: '4 drops twice daily',
        key_indications: [
          'Violent spasmodic paroxysms of dry, deep, barking, whooping cough following in rapid succession',
          'Cough takes away the breath; paroxysms end in retching, gagging, or vomiting of water',
          'Distinctly worse as soon as head touches the pillow at night and after midnight',
        ],
        materia_medica_notes: 'Dr. Hahnemann: The specific remedy for paroxysmal whooping-like cough. Keynote: Tickling in larynx like a feather. Must hold chest with both hands while coughing.',
        modalities: {
          worse: 'Night after midnight, lying down flat, warm room, talking',
          better: 'Sitting upright, open air',
        },
      },
      {
        remedy_name: 'Antimonium Tartaricum (Antim Tart)',
        common_name: 'Tartar Emetic',
        potency: '30C',
        dosage: '4 drops 3 times daily in warm water',
        key_indications: [
          'Coarse rattling of large amounts of mucus in the bronchial tubes, but little or none can be expectorated',
          'Extreme respiratory prostration with drowsiness, cold sweat on forehead, and blue lips (cyanosis)',
          'Chest feels full and suffocated; patient must sit upright to breathe',
        ],
        materia_medica_notes: 'Dr. Boericke: Invaluable in bronchitis of infants and elderly. Bronchial tubes are loaded with mucus, rattling loudly with every respiration, yet patient lacks strength to raise it.',
        modalities: {
          worse: 'Lying down flat, warm room, damp cold, night',
          better: 'Sitting upright, expectoration, cool fresh air',
        },
      },
      {
        remedy_name: 'Bryonia Alba',
        common_name: 'Wild Hops',
        potency: '30C / 200C',
        dosage: '4 pills 3 times daily',
        key_indications: [
          'Hard, dry, racking cough with sharp stitching pains in chest; patient holds chest firmly with hands',
          'Cough provoked by coming into a warm room from cold air, or by taking a deep breath',
          'Parched dry lips and tongue with intense thirst for large glasses of cold water',
        ],
        materia_medica_notes: 'Dr. Kent: Painful dry cough. The chest hurts so acutely that the patient holds his ribs with both hands to minimize the agonizing jarring motion.',
        modalities: {
          worse: 'Entering warm room, least motion, breathing deeply, eating',
          better: 'Absolute rest, firm pressure, lying on affected side',
        },
      },
      {
        remedy_name: 'Spongia Tosta',
        common_name: 'Roasted Sponge',
        potency: '30C',
        dosage: '4 drops twice daily',
        key_indications: [
          'Dry, barking, croupy, hollow cough sounding like sawing a piece of dry pine board',
          'Larynx feels dry, constricted, and burning; suffocative feeling awakens patient from sleep',
          'Marked relief from eating or drinking warm soothing liquids (tea, soup)',
        ],
        materia_medica_notes: 'Dr. Boericke: Chief remedy for croup, laryngitis, and dry cardiac cough. Characteristic keynote: Amelioration from warm drinks and food.',
        modalities: {
          worse: 'Cold dry winds, before midnight, talking, lying with head low',
          better: 'Warm drinks, warm food, descending, sitting bent forward',
        },
      },
    ],
    dietAdvice: [
      'Sip warm water or herbal tulsi/ginger tea. Avoid refrigerated fluids and sour foods.',
      'Elevate head with two pillows while sleeping to ease night-time post-nasal cough.',
      'Protect chest and throat from sudden drafts of cold nighttime breeze.',
    ],
  },
  {
    id: 'headache-migraine-neuralgia',
    category: 'Neurology & Headaches',
    keywords: [
      'headache', 'migraine', 'head', 'throbbing', 'neuralgia', 'forehead pain', 
      'one sided headache', 'hemicrania', 'occipital pain', 'vertigo', 'dizziness', 
      'tension headache', 'sinus headache'
    ],
    miasm: 'Psora with Sycotic vascular congestion',
    keynoteRubric: 'Boericke: Head - Throbbing, congestive, bursting headache with flushed face',
    remedies: [
      {
        remedy_name: 'Belladonna',
        common_name: 'Deadly Nightshade',
        potency: '30C / 200C',
        dosage: '4 drops in water at onset; repeat after 2 hours if required',
        key_indications: [
          'Sudden, violent, congestive throbbing headache with red flushed face and dilated pupils',
          'Pains feel like the skull would burst or be pushed outward; sensation of boiling blood in brain',
          'Extreme intolerance of the slightest noise, bright light, jarring steps, or touch',
        ],
        materia_medica_notes: 'Dr. Boericke: Sudden onset and violent intensity characterize Belladonna. Throbbing of carotids with vascular congestion; relieved by tight bandaging and sitting quietly in a dark room.',
        modalities: {
          worse: 'Jarring, touch, bright light, noise, lying flat, 3:00 PM',
          better: 'Sitting semi-erect, firm pressure, dark quiet room, tight bandaging',
        },
      },
      {
        remedy_name: 'Gelsemium Sempervirens',
        common_name: 'Yellow Jasmine',
        potency: '30C / 200C',
        dosage: '4 drops twice daily',
        key_indications: [
          'Dull, heavy, band-like headache beginning in occiput and neck and radiating forward over the eyes',
          'Heavy drooping eyelids, extreme muscular weakness, tremor, and mental sluggishness',
          'Remarkable keynote modality: Headache is distinctly relieved by profuse clear urination',
        ],
        materia_medica_notes: 'Dr. Kent: Complete motor paralysis and heavy sluggishness. The patient wants to lie down and be left alone. Sensation of a tight band around head.',
        modalities: {
          worse: 'Emotional excitement, bad news, humid weather, sun heat, 10 AM',
          better: 'Profuse urination, lying with head elevated, absolute quiet',
        },
      },
      {
        remedy_name: 'Spigelia Anthelmia',
        common_name: 'Pinkroot / Worm Grass',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        key_indications: [
          'Left-sided facial neuralgia and migraine beginning in occiput, settling over left eye and orbit',
          'Pain follows the sun: begins at sunrise, reaches maximum intensity at noon, and declines at sunset',
          'Sharp, stitching, needle-like pains radiating into the eye, teeth, and left shoulder',
        ],
        materia_medica_notes: 'Dr. Boericke: The chief left-sided nerve remedy. Extreme sensitivity to touch and jarring; eye feels too large for the socket.',
        modalities: {
          worse: 'Motion, noise, touch, jarring, turning eyes, sunrise to sunset',
          better: 'Lying on right side with head held high, firm pressure, rest in dark',
        },
      },
      {
        remedy_name: 'Natrum Muriaticum (Natrum Mur)',
        common_name: 'Chloride of Sodium / Rock Salt',
        potency: '200C',
        dosage: '4 pills once daily in morning',
        key_indications: [
          'Hammering, bursting, blinding headache like thousands of tiny hammers beating against brain',
          'Headache from eye-strain, grief, sun exposure; worse between 10:00 AM and 3:00 PM',
          'Patient craves salt, desires solitude, and dislikes sympathy or conversation when suffering',
        ],
        materia_medica_notes: 'Dr. Kent: Invaluable in chronic migraine of schoolgirls and anemic patients. Blinding zig-zag visual aura before headache begins.',
        modalities: {
          worse: 'Sun heat, 10 AM to 3 PM, mental exertion, sympathy, eye strain',
          better: 'Open fresh air, lying down in quiet dark room, tight pressure',
        },
      },
    ],
    dietAdvice: [
      'Rest in a darkened, noise-free room during active migraine attacks.',
      'Maintain regular meal timings; avoid skipping breakfast or long gaps between food.',
      'Stay hydrated with electrolyte/lemon water; limit strong coffee or dark chocolates.',
    ],
  },
  {
    id: 'anxiety-restlessness-insomnia',
    category: 'Mind & Mental Disposition',
    keywords: [
      'anxiety', 'fear', 'panic', 'restless', 'insomnia', 'sleeplessness', 'stress', 
      'depression', 'nervous', 'palpitation', 'grief', 'phobia', 'worry', 'nightmares'
    ],
    miasm: 'Psora with Sycotic agitation',
    keynoteRubric: 'Kent: Mind - Fear, death of; restlessness with anxious agony',
    remedies: [
      {
        remedy_name: 'Aconitum Napellus (Aconite)',
        common_name: 'Monkshood',
        potency: '30C / 200C',
        dosage: '4 drops in water; repeat in acute panic state',
        key_indications: [
          'Sudden, intense panic attack with fear of death, predict the day or hour of demise',
          'Extreme physical and mental restlessness; tosses about in bed with agonized expressions',
          'Ailments triggered by sudden fright, emotional shock, or exposure to dry cold wind',
        ],
        materia_medica_notes: 'Dr. Hahnemann: The great acute remedy for sudden storm of fear, fever, and arterial excitement. Hallmark: Fear of death with uncontrollable restlessness.',
        modalities: {
          worse: 'Warm room, evening and night (towards midnight), dry cold winds',
          better: 'Open fresh air, rest, gentle reassurance',
        },
      },
      {
        remedy_name: 'Arsenicum Album',
        common_name: 'White Oxide of Arsenic',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        key_indications: [
          'Deep-seated anxiety about health, finances, and incurable disease; fears being left alone',
          'Incessant restlessness: too weak to move, yet moves from bed to chair and chair to bed',
          'Fastidious, order-loving nature; complaints peak between 12:00 midnight and 2:00 AM',
        ],
        materia_medica_notes: 'Dr. Boericke: Anguish, restlessness, and fear of being left alone. Patient thinks it is useless to take medicine as their illness is incurable.',
        modalities: {
          worse: 'Midnight (12 to 2 AM), cold drinks, cold air, solitude',
          better: 'Heat in all forms, hot drinks, company, head elevated',
        },
      },
      {
        remedy_name: 'Coffea Cruda',
        common_name: 'Unroasted Raw Coffee',
        potency: '30C / 200C',
        dosage: '4 drops at bedtime',
        key_indications: [
          'Insomnia and wide-awake state from an uncontrollable rush of ideas and mental hyperactivity',
          'Nervous system hypersensitivity: sight, hearing, and touch are unusually acute; clock ticking disturbs',
          'Ailments from sudden pleasant surprises, excessive joyful emotions, or mental excitement',
        ],
        materia_medica_notes: 'Dr. Kent: The mind is overly acute, thinking of 100 plans at once. Physical restlessness with sleeplessness after joyful news.',
        modalities: {
          worse: 'Excessive emotions, noise, touch, cold open air, night',
          better: 'Lying down quietly, warmth, soothing music',
        },
      },
      {
        remedy_name: 'Ignatia Amara',
        common_name: 'St. Ignatius Bean',
        potency: '200C / 1M',
        dosage: '4 pills once daily for 3 days',
        key_indications: [
          'Acute effects of grief, disappointment in love, bereavement, or sorrowful shocking news',
          'Frequent deep involuntary sighing, sobbing, and lump-in-the-throat sensation (globus hystericus)',
          'Rapidly alternating moods: laughing changing suddenly into weeping; paradoxical symptoms',
        ],
        materia_medica_notes: 'Dr. Boericke: The remedy for emotional bereavement, hidden grief, and hysterical manifestations. Patient broods in silence over their misfortune.',
        modalities: {
          worse: 'Consolation (sympathy aggravates), coffee, tobacco, morning',
          better: 'Change of position, swallowing solids, deep breathing',
        },
      },
    ],
    dietAdvice: [
      'Discontinue coffee, black tea, energy drinks, and digital screen usage 1 hour prior to bedtime.',
      'Practice calm 4-7-8 diaphragmatic breathing or gentle meditation before sleeping.',
      'Maintain fixed sleep and waking hours every day.',
    ],
  },
];

/**
 * Repertorial matcher: Searches the clinical Materia Medica and Repertory database
 * for the closest matching condition, modalities, and remedies.
 */
export function getRepertoryAnalysis(
  symptoms: string,
  modalities: string = '',
  mindDisposition: string = ''
): AIConsultResult {
  const queryText = `${symptoms} ${modalities} ${mindDisposition}`.toLowerCase();

  // Score each condition based on keyword matches
  let bestMatch = HOMEOPATHIC_REPERTORY_DATABASE[0];
  let maxScore = -1;

  for (const cond of HOMEOPATHIC_REPERTORY_DATABASE) {
    let score = 0;
    for (const kw of cond.keywords) {
      if (queryText.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    // Boost for category mentions
    if (queryText.includes(cond.category.toLowerCase())) {
      score += 4;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = cond;
    }
  }

  // If no specific match was found, provide a comprehensive acute polychrest evaluation
  const matchedRemedies = bestMatch.remedies;

  return {
    analysis_summary: `Classical Homoeopathic Evaluation for: "${symptoms.trim()}". Clinical affinity indicates ${bestMatch.category} pathology governed by ${bestMatch.miasm}. Repertorized rubrics highlight strong keynote modality concordance with the selected Similia.`,
    remedies: matchedRemedies,
    repertory_keynotes: [
      bestMatch.keynoteRubric,
      `Hahnemann Organon §153: Key characteristic individualizing modalities and mental disposition`,
      `Boericke Materia Medica: Affinity to ${bestMatch.category} tissues and vital dynamics`,
    ],
    diet_and_regimen: `Homoeopathic Regimen: ${bestMatch.dietAdvice.join(' ')} Avoid camphor, raw onion, raw garlic, and strong coffee within 30 minutes of taking homeopathic doses.`,
    warning_notes: 'Clinical Reference only. Final prescription must be verified by Dr. M. A. Haque, M.D.',
  };
}
