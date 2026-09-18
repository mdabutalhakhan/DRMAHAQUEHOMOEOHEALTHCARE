import type { ClinicalCondition } from '../clinicalRepertoryData';

export const DERMATOLOGY_HAIR_CONDITIONS: ClinicalCondition[] = [
  // 25. Corns & Callosities (পায়ের কড়া / শক্ত চামড়া / হাঁটার সময় ব্যথা)
  {
    id: 'corns-callosities-hard-skin',
    nameEn: 'Corns, Callosities & Clavus',
    nameBn: 'পায়ের কড়া ও শক্ত চামড়া (হাঁটার সময় তীব্র কাঁটা ফোটার মতো ব্যথা)',
    chipLabel: 'Corns / পায়ের কড়া',
    pathology: 'Hyperkeratosis, Friction-induced Circumscribed Horny Epidermal Thickening (Clavus) with central cone pressing on papillary nerve endings',
    miasm: 'Sycotic Induration with Psoric Cutaneous Hyperplasia',
    typicalPresentation: 'Hard, thickened, horny circumscribed painful pads on soles or between toes; agonizing aching and darting pain on walking or pressure',
    keywords: [
      'corn', 'callus', 'কড়া', 'পায়ের কড়া', 'foot corn', 'hard skin sole', 'কড়া', 'পায়ের কড়া',
      'clavus', 'callosity', 'পায়ে কড়া পড়া', 'শক্ত চামড়া', 'walking pain sole', 'painful corn'
    ],
    classicalRemedies: [
      {
        name: 'Antimonium Crudum 200C',
        commonName: 'Black Sulphide of Antimony',
        potency: '200C',
        dosage: '4 pills twice daily in empty stomach',
        keynotes: [
          'Premier simillimum for hard, thick, horny callosities and corns on the soles of feet and palms',
          'Soles of feet are so exquisitely sensitive and tender that patient can hardly walk on a hard floor',
          'Associated with thick milky-white coated tongue and gastric derangements from sour food'
        ],
        materiaMedicaNotes: 'Boericke: Master remedy for thick, horny, callosities on feet and hands. Soles so tender, walking is painful.',
        modalities: { worse: 'Heat of sun, cold baths, walking', better: 'Open air, resting feet' },
        aliases: ['antim crud', 'antimonium crudum']
      },
      {
        name: 'Thuja Occidentalis 200C',
        commonName: 'Arbor Vitae',
        potency: '200C',
        dosage: '4 pills twice weekly in morning',
        keynotes: [
          'Specific anti-sycotic remedy for horny, indurated, proliferative epidermal overgrowths and warts',
          'Stinging, burning, and stitching pain in corns and callosities, worse from cold damp weather',
          'Softens keratinized horny cones and prevents recurrent friction growths'
        ],
        materiaMedicaNotes: 'Kent: Sycotic overgrowths. Corns with burning and stinging. Relieves horny excrescences on hands and feet.',
        modalities: { worse: 'Cold damp air, 3 AM', better: 'Warm dry air, pressure' },
        aliases: ['thuja', 'thuja occ']
      },
      {
        name: 'Silicea 30C / 200C',
        commonName: 'Pure Flint',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Soft corns between the toes with burning, stinging, and suppurative inflammation',
          'Foul, offensive, acrid foot sweat that excoriates the skin and makes corns painful',
          'Extremely chilly patient with cold feet; promotes healthy reabsorption of indurated core'
        ],
        materiaMedicaNotes: 'Boericke: Corns with boring, shooting pain. Offensive foot sweat. Soft corns between toes with suppurative tendency.',
        modalities: { worse: 'Cold drafts, dampness', better: 'Warmth, covering feet warmly' },
        aliases: ['silicea', 'silica']
      },
      {
        name: 'Ranunculus Bulbosus 30C',
        commonName: 'Bulbous Buttercup',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Corns intensely sensitive to touch; smarting, burning, and stitching pain',
          'Exquisitely sensitive to changes in weather and cold wet air; corns throb on walking',
          'Dark bluish appearance around corn base'
        ],
        materiaMedicaNotes: 'Boericke: Corns sensitive to touch; smarting, burning pain. Aggravated by changes in atmospheric pressure.',
        modalities: { worse: 'Touch, wet stormy weather, motion', better: 'Rest' },
        aliases: ['ranunculus', 'ran bulb']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Thuja Ointment / Corn Paint',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube / 10 ml Paint',
        indications: 'Softens hard keratinized tissue, relieves walking pain, and painlessly dissolves corn cores.',
        dosage: 'Wash feet in warm water, dry thoroughly, and apply ointment or paint directly to corn twice daily.',
        mrp: 95,
        aliases: ['thuja ointment', 'sbl corn paint']
      },
      {
        name: 'Dr. Reckeweg R17 (Cobaustin / Induration Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation for anomalous tissue growths, indurated glandular masses, and hard cutaneous callosities.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 310,
        aliases: ['r17', 'reckeweg 17']
      },
      {
        name: 'Bakson Wart & Corn Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Internal therapeutic support to eradicate recurring corns, calluses, and plantar excrescences.',
        dosage: '1 tablet twice daily with water.',
        mrp: 160,
        aliases: ['wart aid', 'bakson wart aid']
      }
    ],
    dietAndRegimen: 'Soak feet in warm water with Epsom salt or Calendula for 15 minutes before bedtime. Wear properly fitted, wide-toed, cushioned footwear with silicone corn pads. Never cut corns with unsterilized blades or scissors.',
    warningNotes: 'In diabetic patients or individuals with peripheral vascular disease, do not apply strong keratolytic chemicals or attempt self-cutting due to high risk of non-healing diabetic foot ulcers.'
  },

  // 26. Warts & Condylomata (আঁচিল / মুখের বা হাতের আঁচিল)
  {
    id: 'warts-condylomata-verruca',
    nameEn: 'Warts, Condylomata & Verrucae',
    nameBn: 'আঁচিল ও কর্নিফাইড বৃদ্ধি (মুখের, গলার বা হাতের আঁচিল)',
    chipLabel: 'Warts / আঁচিল',
    pathology: 'Cutaneous Human Papillomavirus (HPV) Infection causing benign hyperkeratotic epidermal papillomas (Verruca vulgaris, plana, filiform, condyloma)',
    miasm: 'Pure Sycotic Proliferative Diathesis',
    typicalPresentation: 'Hard, horny, pedunculated, flat, or cauliflower-like excrescences on face, neck, hands, fingers, or anogenital region; may bleed or crack easily',
    keywords: [
      'wart', 'warts', 'আঁচিল', 'হাতে আঁচিল', 'condyloma', 'verruca', 'আচিল', 'মুখের আঁচিল',
      'filiform warts', 'cauliflower warts', 'skin tags', 'pedunculated warts', 'গলার আঁচিল', 'hpv warts'
    ],
    classicalRemedies: [
      {
        name: 'Thuja Occidentalis 200C / 1M',
        commonName: 'Arbor Vitae',
        potency: '200C / 1M',
        dosage: '4 pills 200C once every 3 days in the morning, or 1M once weekly',
        keynotes: [
          'King of sycotic remedies and specific sovereign simillimum for warts of all shapes and locations',
          'Large, seedy, pedunculated, jagged, or cauliflower-like warts; bleed easily upon touch or washing',
          'Specific for warts on hands, fingers, chin, neck, eyelids, and anogenital condylomata'
        ],
        materiaMedicaNotes: 'Kent: Sovereign remedy for sycotic overgrowths. Warts of all kinds, fig-warts, condylomata. Causes them to dry up and fall off.',
        modalities: { worse: 'Damp weather, 3 AM', better: 'Warm dry air' },
        aliases: ['thuja', 'thuja occ']
      },
      {
        name: 'Causticum 200C',
        commonName: "Hahnemann's Tinctura Acris",
        potency: '200C',
        dosage: '4 pills twice weekly',
        keynotes: [
          'Hard, horny, jagged, pedunculated warts that bleed easily; situated especially near fingernails, on fingertips, or on face and nose',
          'Large hard warts on hands and eyelids',
          'Chilly constitution with muscular stiffness and rawness'
        ],
        materiaMedicaNotes: 'Boericke: Warts, large, jagged, bleeding easily, on tips of fingers and on face, especially near nose and eyelids.',
        modalities: { worse: 'Dry cold air, clear fine weather', better: 'Damp wet weather' },
        aliases: ['causticum', 'caust']
      },
      {
        name: 'Nitricum Acidum 200C',
        commonName: 'Nitric Acid',
        potency: '200C',
        dosage: '4 pills twice weekly',
        keynotes: [
          'Moist, cauliflower-like condylomata and warts with sharp, splinter-like stitching pains on touch',
          'Warts bleed profusely on washing or slight touch; exude offensive moisture',
          'Situated on mucous outlets, lips, tongue, prepuce, or anus'
        ],
        materiaMedicaNotes: 'Kent: Warts with sticking pains like a splinter; bleed easily from washing. Cauliflower condylomata.',
        modalities: { worse: 'Touch, washing, cold air', better: 'Warmth' },
        aliases: ['nitric acid', 'nit acid']
      },
      {
        name: 'Dulcamara 30C / 200C',
        commonName: 'Bitter-Sweet',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Smooth, flat, fleshy warts (verruca plana) appearing on the back of hands, palms, and face',
          'Warts triggered or aggravated by exposure to cold damp weather or washing in cold water',
          'Catarrhal constitution prone to skin eruptions on weather change'
        ],
        materiaMedicaNotes: 'Boericke: Warts, flat, smooth, on hands and face of children. Aggravated by cold damp surroundings.',
        modalities: { worse: 'Cold damp weather, damp ground', better: 'Moving about, dry warmth' },
        aliases: ['dulcamara', 'dulc']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Thuja Roll-On / Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '10 ml Roll-On / 25g Tube',
        indications: 'Targeted topical application of pure Thuja mother tincture that withers warts without scarring.',
        dosage: 'Apply directly over warts morning and night after cleaning with warm water.',
        mrp: 110,
        aliases: ['thuja roll-on', 'sbl thuja']
      },
      {
        name: 'Dr. Reckeweg R17 (Cobaustin Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'Deep-acting constitutional drops to arrest proliferative epithelial warts and skin tags.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 310,
        aliases: ['r17', 'reckeweg 17']
      },
      {
        name: 'Bakson Wart Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Comprehensive internal formulation for multiple warts on face, neck, and hands.',
        dosage: '1 tablet 3 times a day.',
        mrp: 165,
        aliases: ['wart aid', 'bakson wart aid']
      }
    ],
    dietAndRegimen: 'Do not pick, scratch, or cut warts with nail clippers, as viral particles will spread to adjacent skin (autoinoculation). Boost immune health with foods rich in vitamins A, C, and zinc.',
    warningNotes: 'Examine rapidly growing, pigmented, ulcerated, or irregularly bordered lesions carefully with dermoscopy to distinguish them from seborrheic keratosis, basal cell carcinoma, or melanoma.'
  },

  // 27. Alopecia & Excessive Hair Fall (চুল পড়া / টাক পড়া / মাথায় খুশকি)
  {
    id: 'alopecia-hair-fall-baldness',
    nameEn: 'Alopecia, Excessive Hair Fall & Dandruff',
    nameBn: 'চুল পড়া ও টাক সমস্যা (মাথায় অতিরিক্ত চুল পড়া ও খুশকি)',
    chipLabel: 'Hair Fall / চুল পড়া ও টাক',
    pathology: 'Telogen Effluvium, Alopecia Areata, Androgenetic Alopecia & Seborrheic Dermatitis of scalp',
    miasm: 'Psoric-Syphilitic Hair Follicle Degeneration & Tubercular Debility',
    typicalPresentation: 'Copious loss of hair while combing or washing, hair falling out in bunches or circumscribed round patches (alopecia areata), itchy scalp with dry or greasy dandruff',
    keywords: [
      'hair fall', 'alopecia', 'baldness', 'চুল পড়া', 'টাক', 'dandruff hair loss', 'alopecia areata',
      'চুল ওঠা', 'মাথায় টাক', 'খুশকি', 'hair thinning', 'falling hair bunches', 'scalp itching', 'hair loss'
    ],
    classicalRemedies: [
      {
        name: 'Acidum Phosphoricum 30C / Q',
        commonName: 'Phosphoric Acid',
        potency: '30C / Q',
        dosage: '4 pills twice daily or 10 drops Q in water',
        keynotes: [
          'Profuse hair fall resulting from acute grief, emotional sorrow, prolonged anxiety, or exhaustive illness (typhoid/fever)',
          'Hair turns gray early in life and falls out from head, eyebrows, and beard',
          'Profound mental and physical weakness with apathy and dark eye circles'
        ],
        materiaMedicaNotes: 'Kent: Hair becomes gray early in life and falls out in large quantities after grief, emotional shock, or exhausting debilitating fevers.',
        modalities: { worse: 'Grief, mental exertion', better: 'Warmth, nourishing food' },
        aliases: ['acid phos', 'phosphoric acid']
      },
      {
        name: 'Wiesbaden 30C',
        commonName: 'Spring of Wiesbaden',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Remarkable specific clinical remedy that promotes rapid hair growth and darkens light or premature gray hair',
          'Strengthens hair roots; hair grows faster, thicker, and darker with natural luster',
          'Relieves brittle, soft, splitting nails'
        ],
        materiaMedicaNotes: 'Boericke: By the use of this remedy the hair grows much more rapidly, becomes darker, and new hair grows where it had fallen out.',
        modalities: { worse: 'Cold weather', better: 'Warm weather' },
        aliases: ['wiesbaden']
      },
      {
        name: 'Lycopodium Clavatum 200C',
        commonName: 'Club Moss',
        potency: '200C',
        dosage: '4 pills once weekly in evening',
        keynotes: [
          'Premature baldness and graying of hair; hair falls out in large quantities after abdominal illness or parturition',
          'Scalp is covered with dry, burning, itching scurf and foul smelling eruptions',
          'Associated with chronic flatulence, digestive weakness, and intellectual over-exertion'
        ],
        materiaMedicaNotes: 'Kent: Premature grayness and baldness. Hair falls out in bunches, especially after fevers and childbirth.',
        modalities: { worse: '4 PM to 8 PM, right side', better: 'Warm food and drinks' },
        aliases: ['lycopodium', 'lyco']
      },
      {
        name: 'Fluoricum Acidum 30C',
        commonName: 'Hydrofluoric Acid',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Alopecia areata (hair falling out in round, smooth, circumscribed bare bald patches)',
          'Hair is dry, tangled, breaks easily, and falls out in large amounts; new hair is dry and brittle',
          'Hot patient; complaints relieved by cold washing and cold air'
        ],
        materiaMedicaNotes: 'Boericke: Alopecia, hair falls out in spots. Brittle hair that tangles and breaks off easily.',
        modalities: { worse: 'Warmth, morning', better: 'Cold applications, fresh air' },
        aliases: ['fluoric acid', 'fluor acid']
      },
      {
        name: 'Arnica Montana Mother Tincture (Q - External Application)',
        commonName: "Leopard's Bane",
        potency: 'Q',
        dosage: 'Mix 1 part Arnica Q with 4 parts pure virgin coconut or almond oil; massage into scalp',
        keynotes: [
          'Stimulates local capillary circulation around hair follicles',
          'Relieves scalp soreness, clears dry dandruff flakes, and prevents follicular atrophy',
          'Revitalizes dormant hair roots and thickens fine hair strands'
        ],
        materiaMedicaNotes: 'Boericke: Promotes hair growth when used as local hair lotion; stimulates follicle circulation.',
        modalities: { worse: 'Local trauma', better: 'Gentle scalp massage' },
        aliases: ['arnica q', 'arnica hair']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R89 (Lipocol / Hair Care Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '30 ml Drops',
        indications: 'Internationally acclaimed German drops for alopecia areata, premature baldness, diffuse hair loss, and follicular weakness.',
        dosage: '20-30 drops in 1/4 cup water 3 times daily; massage 10 drops into bald patches at night.',
        mrp: 350,
        aliases: ['r89', 'reckeweg 89', 'lipocol']
      },
      {
        name: 'SBL Scalptone Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Strengthens hair roots, prevents premature graying, stops excessive shedding, and cures itchy scalp dandruff.',
        dosage: '2 tablets 3 times daily.',
        mrp: 145,
        aliases: ['scalptone', 'sbl scalptone']
      },
      {
        name: 'Bakson Hair Revival Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Supplies essential mineral nutrients to scalp, curbs patchy baldness, and revitalizes thin lifeless hair.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 175,
        aliases: ['hair revival', 'bakson hair revival']
      }
    ],
    dietAndRegimen: 'Eat adequate protein (eggs, lentils, chickpeas, nuts) and iron-rich leafy greens. Avoid harsh sulfate/chemical shampoos; use mild homoeopathic Arnica-Jaborandi hair wash. Do not comb wet hair aggressively. Get 7-8 hours of sound sleep.',
    warningNotes: 'In female patients with severe diffuse hair thinning, check Serum Ferritin (iron deficiency), Thyroid Profile (TSH), and screen for hyperandrogenism (PCOS).'
  },

  // 28. Ringworm & Fungal Infections (দাদ / চুলকানি / গোল গোল চাকা দাগ)
  {
    id: 'ringworm-tinea-fungal-infections',
    nameEn: 'Ringworm, Tinea & Fungal Dermatophytosis',
    nameBn: 'দাদ ও ছত্রাক সংক্রমণ (টিনিয়া, গোল চাকা দাগ ও তীব্র চুলকানি)',
    chipLabel: 'Ringworm / দাদ ও ছত্রাক',
    pathology: 'Superficial Cutaneous Dermatophytosis (Tinea corporis, cruris, pedis, versicolor) with erythematous raised annular scaly borders and central clearing',
    miasm: 'Psoric-Sycotic Cutaneous Mycotic Diathesis',
    typicalPresentation: 'Intensely pruritic circular annular red rings with vesicular or scaly elevated borders and clearing centers, situated on groin, armpits, thighs, or neck; aggravated by heat, sweat, and night warmth',
    keywords: [
      'ringworm', 'tinea', 'দাদ', 'খোস পাঁচড়া', 'fungal infection', 'itchy ring', 'tinea cruris',
      'দাদ চুলকানি', 'গোল চাকা চুলকানি', 'jock itch', 'tinea corporis', 'ছত্রাক সংক্রমণ', 'groin itching'
    ],
    classicalRemedies: [
      {
        name: 'Sepia Officinalis 200C',
        commonName: 'Inky Juice of Cuttlefish',
        potency: '200C',
        dosage: '4 pills twice weekly in morning',
        keynotes: [
          'Specific sovereign remedy for ringworm appearing in isolated spots or circular patches',
          'Ringworm on bends of elbows, thighs, groin, and neck; worse in spring or after damp cold bathing',
          'Brownish discoloration (chloasma) across saddle of nose and cheeks; chilly, irritable'
        ],
        materiaMedicaNotes: 'Boericke: Ringworm like isolated spots on upper part of body and bends of joints. Herpes circinatus in small rings.',
        modalities: { worse: 'Morning, evening, damp coldness', better: 'Warmth, vigorous exercise' },
        aliases: ['sepia', 'sep']
      },
      {
        name: 'Tellurium Metallicum 30C',
        commonName: 'The Element Tellurium',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Ringworm covering large areas of body or intersecting each other (herpes circinatus)',
          'Intense intolerable itching day and night; scratching causes raw redness and offensive garlicky fish-brine odor',
          'Thin, watery, excoriating moisture exuding from vesicular rings'
        ],
        materiaMedicaNotes: 'Kent: Ringworm in large intersecting rings over whole body. Offensive odor from skin like garlic or rotten fish brine.',
        modalities: { worse: 'Rest, at night in bed, cold air', better: 'Warmth' },
        aliases: ['tellurium', 'tellur']
      },
      {
        name: 'Chrysarobinum 3X / 6X / Ointment',
        commonName: 'Goa Powder / Araroba Depurata',
        potency: '3X / 6X',
        dosage: '2 tablets 3X twice daily, and apply Chrysarobinum ointment sparingly to ring lesions',
        keynotes: [
          'Direct specific antifungal and antimycotic agent in homeopathy',
          'Violent itching, scabby vesicular crusts, and dry ringworm on face and groin',
          'Clears stubborn chronic dermatophyte colonies rapidly'
        ],
        materiaMedicaNotes: 'Boericke: Powerful specific for ringworm and fungal affections. Relieves intense itching and clears circular scabs.',
        modalities: { worse: 'Night, warmth of bed', better: 'Cool washing' },
        aliases: ['chrysarobinum', 'goa powder']
      },
      {
        name: 'Sulphur 200C',
        commonName: 'Sublimed Sulphur',
        potency: '200C',
        dosage: '4 pills once weekly in the morning',
        keynotes: [
          'Voluptuous itching in rings; scratching feels intensely pleasurable, but is followed by burning like fire',
          'Distinct aggravation from washing, bathing, and from the warmth of bed at night',
          'Dry, rough, scaly skin; patient refuses washing'
        ],
        materiaMedicaNotes: 'Kent: Great anti-psoric foundation remedy. Itching aggravated by warmth of bed and water.',
        modalities: { worse: 'Warmth of bed, washing, standing, 11 AM', better: 'Dry warm weather' },
        aliases: ['sulphur', 'sulfur']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R23 (Nosoderm / Eczema & Ringworm Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for chronic ringworm, fungal herpes, pruritus, and stubborn dermatomycoses.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r23', 'reckeweg 23']
      },
      {
        name: 'Bakson Bakso-Derm / Derma Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Fights fungal infections of skin, reduces circular red flare-ups, and prevents recurrence.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 165,
        aliases: ['bakso-derm', 'bakson derma aid']
      },
      {
        name: 'SBL B-Trim / Graphites-Thuja Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Ointment Tube',
        indications: 'Topical soothing ointment that halts fungal spread, dries weeping rings, and heals damaged skin.',
        dosage: 'Apply a thin layer to affected ring area twice daily after washing and drying skin thoroughly.',
        mrp: 95,
        aliases: ['sbl ointment', 'sbl b-trim']
      }
    ],
    dietAndRegimen: 'Keep groin, armpits, and skin folds scrupulously clean and dry. Wear loose cotton undergarments; change clothing twice daily during hot humid weather. Never share bath towels, bedsheets, or soap with others. Iron clothes well to kill fungal spores.',
    warningNotes: 'Never apply topical steroid creams (betamethasone, clobetasol) on fungal lesions, as steroids cause "Tinea incognito" with extensive deep cutaneous invasion.'
  },

  // 29. Urticaria & Skin Hives (আমবাত / চাকা চাকা লাল দাগ / প্রচণ্ড চুলকানি)
  {
    id: 'urticaria-hives-angioedema',
    nameEn: 'Urticaria, Hives & Allergic Angioedema',
    nameBn: 'আমবাত ও ত্বকে চাকা চাকা লাল দাগ (প্রচণ্ড চুলকানি ও ত্বক ফোলা)',
    chipLabel: 'Urticaria / আমবাত ও চুলকানি',
    pathology: 'Transient Cutaneous Edematous Wheals, Mast-Cell Histamine Degranulation & Dermal Microvascular Hyperpermeability',
    miasm: 'Psoric Acute Allergic Reactivity',
    typicalPresentation: 'Sudden emergence of raised, red, hot, intensely itching and burning wheals or welts resembling nettle-stings, aggravated by heat or cold water, dermographism',
    keywords: [
      'urticaria', 'hives', 'আমবাত', 'চাকা চাকা দাগ', 'itching red rash', 'skin allergy', 'nettle rash',
      'ত্বকে চাকা চাকা ফোলা', 'চুলকিয়ে রক্ত বের করা', 'wheals', 'angioedema', 'cold urticaria', 'আম বাত'
    ],
    classicalRemedies: [
      {
        name: 'Apis Mellifica 30C',
        commonName: 'Honey Bee',
        potency: '30C',
        dosage: '4 pills every 2-3 hours during acute hives',
        keynotes: [
          'Sudden stinging, burning, prickling wheals like bee stings with puffy rosy-pink swelling',
          'Skin is hot, red, sensitive to touch; intolerable stinging itching',
          'Distinctly aggravated by heat of room, warm baths, and warm applications; relieved by cold water bathing'
        ],
        materiaMedicaNotes: 'Boericke: Sudden puffing up of whole body. Stinging, burning, prickling. Relieved by cold water.',
        modalities: { worse: 'Heat, warm room, touch', better: 'Cold water applications, cool open air' },
        aliases: ['apis', 'apis mel']
      },
      {
        name: 'Urtica Urens Mother Tincture (Q) / 30C',
        commonName: 'Stinging Nettle',
        potency: 'Q / 30C',
        dosage: '10-15 drops Q in water or 4 pills 30C 3 times daily',
        keynotes: [
          'Premier sovereign specific for urticaria with intense burning heat and stinging like nettle rash',
          'Raised red welts on skin, constantly rubbing and scratching without relief',
          'Urticaria alternating with rheumatism or provoked by eating shellfish (crabs, prawns)'
        ],
        materiaMedicaNotes: 'Kent: Urticaria nodosa; violent itching and burning heat. Aggravated by warm bathing and eating shellfish.',
        modalities: { worse: 'Warm bathing, touch, shellfish', better: 'Lying down quietly' },
        aliases: ['urtica urens', 'urtica', 'urtica q']
      },
      {
        name: 'Astacus Fluviatilis 30C',
        commonName: 'Crawfish',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Generalized chronic urticaria over whole body associated with liver complaints and jaundice',
          'Erysipelatous swelling, burning itching over face and eyelids with swelling of cervical lymph glands',
          'Chilly feeling with skin eruptions'
        ],
        materiaMedicaNotes: 'Boericke: Urticaria over whole body. Itching, with enlarged lymphatic glands. Indicated in chronic hives.',
        modalities: { worse: 'Uncovering, cold air', better: 'Warmth' },
        aliases: ['astacus', 'astacus fluv']
      },
      {
        name: 'Chloralum Hydratum 30C',
        commonName: 'Chloral Hydrate',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Violent urticaria coming on suddenly from drinking alcohol or emotional excitement',
          'Large red patches with intense stinging and itching; eyelids and face swollen',
          'Aggravated by warm drinks and hot bath'
        ],
        materiaMedicaNotes: 'Boericke: Urticaria aggravated by spirituous liquors and hot drinks. Swelling of eyelids with intense itching.',
        modalities: { worse: 'Alcohol, hot drinks, night', better: 'Cold air' },
        aliases: ['chloralum', 'chloral']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R23 (Nosoderm / Skin Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formula for acute and chronic urticaria, allergic hives, dermographism, and burning pruritus.',
        dosage: '10-15 drops in water 3-4 times daily.',
        mrp: 310,
        aliases: ['r23', 'reckeweg 23']
      },
      {
        name: 'SBL Allermid Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Stabilizes mast cells, prevents histamine release, and calms intense cutaneous burning wheals.',
        dosage: '2 tablets 3 times daily.',
        mrp: 140,
        aliases: ['allermid', 'sbl allermid']
      },
      {
        name: 'Bakson Urticaria Aid / Aller Aid',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Relieves acute red itchy welts, stops stinging sensations, and clears allergen sensitivity.',
        dosage: '10-15 drops in water 3 times a day.',
        mrp: 165,
        aliases: ['urticaria aid', 'bakson urticaria']
      }
    ],
    dietAndRegimen: 'Eliminate common dietary allergens during acute attacks (prawns, crabs, eggs, sour curd, artificial food colors, preservatives). Apply cool Calendula or aloe vera lotion to soothe burning. Avoid scalding hot water showers.',
    warningNotes: 'If urticaria is accompanied by swelling of lips, tongue, uvula, or difficulty in breathing (laryngeal angioedema/anaphylaxis), seek emergency medical resuscitation immediately.'
  },

  // 30. Eczema & Dermatitis (একজিমা / ত্বক দিয়ে রস ঝরা / শুকনো খসখসে চামড়া)
  {
    id: 'eczema-dermatitis-pruritus',
    nameEn: 'Eczema, Dermatitis & Weeping Skin Lesions',
    nameBn: 'একজিমা ও অ্যালার্জিক ডার্মাটাইটিস (ত্বক ফাটা, শুকনো খসখসে বা রস ঝরা)',
    chipLabel: 'Eczema / একজিমা',
    pathology: 'Atopic / Stasis / Contact Dermatitis with epidermal spongiosis, vesiculation, lichenification, and intense pruritus',
    miasm: 'Psoric-Sycotic Cutaneous Diathesis with Syphilitic Fissuring',
    typicalPresentation: 'Erythematous, intensely itchy plaques with microvesicles oozing transparent sticky fluid (weeping eczema) or dry, cracked, lichenified skin that bleeds on scratching, worse night and winter',
    keywords: [
      'eczema', 'dermatitis', 'একজিমা', 'ত্বকে ঘা', 'dry crusty eczema', 'weeping skin', 'atopic eczema',
      'চামড়া ফাটা', 'রস ঝরা একজিমা', 'শুষ্ক একজিমা', 'itching cracks', 'hand eczema', 'lichenification'
    ],
    classicalRemedies: [
      {
        name: 'Graphites 30C / 200C',
        commonName: 'Black Lead',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Premier simillimum for weeping eczema; characteristically exudes a thick, sticky, glutinous, honey-like transparent fluid',
          'Cracks and deep fissures behind ears, bends of elbows, knees, palms, and nipples',
          'Dry, rough, hard, thickened skin prone to persistent itching; chilly and constipated patient'
        ],
        materiaMedicaNotes: 'Boericke: Characteristically exudes a transparent, sticky, honey-like fluid. Eczema behind ears, bends of limbs, and groins.',
        modalities: { worse: 'Warmth, at night, during menses', better: 'Walking in open air, dark room' },
        aliases: ['graphites', 'graph']
      },
      {
        name: 'Petroleum 30C / 200C',
        commonName: 'Crude Rock-Oil',
        potency: '30C / 200C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe winter eczema; skin is dry, rough, deeply cracked and fissured, bleeding easily',
          'Deep painful cracks on fingertips and palms; burning and rawness in lesions',
          'Marked aggravation in cold winter weather, distinctly improved in summer'
        ],
        materiaMedicaNotes: 'Kent: Great remedy for winter eczema. Skin cracks and bleeds in cold weather; deep fissures on hands and fingers.',
        modalities: { worse: 'Winter, cold air, washing', better: 'Warm air, dry weather' },
        aliases: ['petroleum', 'petr']
      },
      {
        name: 'Mezereum 30C',
        commonName: 'Spurge Olive',
        potency: '30C',
        dosage: '4 pills 3 times daily',
        keynotes: [
          'Eczema with intolerable itching; scratching changes place of itching and leaves burning fire',
          'Thick, hard, leathery, chalky crusts beneath which thick yellow pus collects and oozes',
          'Eczema on head and face with matted hair and ulcerations'
        ],
        materiaMedicaNotes: 'Boericke: Eruptions ulcerate and form thick scabs, under which purulent matter exudes. Intolerable itching, worse at night in bed.',
        modalities: { worse: 'Warmth of bed, night, touch', better: 'Open cool air' },
        aliases: ['mezereum', 'mez']
      },
      {
        name: 'Sulphur 200C',
        commonName: 'Sublimed Sulphur',
        potency: '200C',
        dosage: '4 pills once weekly in morning',
        keynotes: [
          'Voluptuous itching in lesions; patient scratches until raw and bleeding, followed by severe burning',
          'Distinct aggravation from washing and from the warmth of the bed',
          'Dry, dirty-looking, unhealthy skin; prone to recurring pustular eruptions'
        ],
        materiaMedicaNotes: 'Kent: The king of anti-psoric polychrests for all forms of eczema with burning itching, worse from water and heat of bed.',
        modalities: { worse: 'Warmth of bed, washing, standing', better: 'Dry warm weather' },
        aliases: ['sulphur', 'sulfur']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R23 (Nosoderm / Eczema Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for acute and chronic eczema, scabs, fissures, and allergic dermatitis.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r23', 'reckeweg 23']
      },
      {
        name: 'SBL Graphites Ointment',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Ointment Tube',
        indications: 'Emollient soothing formula for dry cracked eczema, oozing fissures, and lichenified skin patches.',
        dosage: 'Apply gently over affected skin twice daily after cleaning.',
        mrp: 95,
        aliases: ['graphites ointment', 'sbl graphites']
      },
      {
        name: 'Bakson Derma Aid Soap & Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops / 75g Soap',
        indications: 'Soothes persistent pruritus, restores cutaneous barrier function, and promotes re-epithelialization.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 165,
        aliases: ['derma aid', 'bakson derma aid']
      }
    ],
    dietAndRegimen: 'Apply pure organic virgin coconut oil or Calendula cream immediately after bathing on damp skin to lock in moisture. Avoid chemical detergents, harsh soaps, and synthetic woolen clothing directly against skin. Avoid eggs, sour tamarind, and artificial preservatives.',
    warningNotes: 'If lesions suddenly become covered with punched-out painful ulcerations with fever, rule out secondary viral infection (Eczema herpeticum), which requires urgent antiviral treatment.'
  },

  // 31. Acne & Pimples (ব্রণ / মুখে ফুসকুড়ি ও দাগ)
  {
    id: 'acne-vulgaris-pimples',
    nameEn: 'Acne Vulgaris, Pimples & Facial Blemishes',
    nameBn: 'ব্রণ ও মুখের ফুসকুড়ি (অ্যাকনি ভালগারিস ও ব্রণের কালো দাগ)',
    chipLabel: 'Acne / ব্রণ ও দাগ',
    pathology: 'Pilosebaceous Unit Folliculitis, Cutibacterium acnes Proliferation, Hyperkeratinization & Sebaceous Hyperactivity',
    miasm: 'Psoric-Sycotic Sebaceous Diathesis with Tubercular Tendency',
    typicalPresentation: 'Papulopustular and comedonal eruptions on face, forehead, cheeks, and back; painful throbbing inflammatory pimples leaving purplish-brown scars and blemishes',
    keywords: [
      'acne', 'pimples', 'ব্রণ', 'মুখের দাগ', 'pustules on face', 'acne vulgaris', 'blackheads',
      'ব্রনের দাগ', 'পুঁজযুক্ত ব্রণ', 'মুখের ফুসকুড়ি', 'pimples on back', 'comedones', 'adolescent acne'
    ],
    classicalRemedies: [
      {
        name: 'Berberis Aquifolium Mother Tincture (Q)',
        commonName: 'Oregon Grape / Mountain Grape',
        potency: 'Q',
        dosage: '10-15 drops in 1/2 cup water twice daily after meals, and apply diluted Q locally',
        keynotes: [
          'Premier sovereign remedy to clear skin complexion, erase acne blemishes, and clear pustular pimples',
          'Cleanses liver and blood toxins; softens rough, blotchy, scaly facial skin',
          'Produces a clean, smooth, radiant complexion'
        ],
        materiaMedicaNotes: 'Boericke: A remedy for the skin, chronic catarrhal affections. Clears the complexion. Acne, blotches, pimples.',
        modalities: { worse: 'Fatty foods, heat', better: 'Cool water washing' },
        aliases: ['berberis aquifolium', 'berberis aqui', 'berberis aqui q']
      },
      {
        name: 'Asterias Rubens 30C',
        commonName: 'Red Starfish',
        potency: '30C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Specific remedy for pimples on face at the age of puberty in adolescent boys and girls',
          'Pimples situated around mouth, nose, and chin, becoming red and indurated',
          'Associated with oily skin and sluggish venous circulation'
        ],
        materiaMedicaNotes: 'Boericke: Acne; pimples on face at puberty. Flushed red face with comedones.',
        modalities: { worse: 'Night, cold damp weather', better: 'Fresh air' },
        aliases: ['asterias', 'asterias rubens']
      },
      {
        name: 'Kali Bromatum 30C',
        commonName: 'Bromide of Potassium',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Severe indurated, pustular acne leaving unsightly blue-red scars on face, neck, and shoulders',
          'Acne simplex, acne indurata, and rosacea in nervous, restless young adults',
          'Associated with mental depression, memory weakness, and night terrors'
        ],
        materiaMedicaNotes: 'Kent: Pustular acne indurata with bluish-red indurated bases on face and upper trunk.',
        modalities: { worse: 'Mental exertion, summer', better: 'Busy active work' },
        aliases: ['kali brom', 'kali bromatum']
      },
      {
        name: 'Hepar Sulphuris Calcareum 30C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Extremely painful, tender, suppurating pimples containing thick yellowish pus',
          'Pimples exquisitely sensitive to the slightest touch or cold air',
          'Surrounding skin is red, inflamed, and bleeds easily'
        ],
        materiaMedicaNotes: 'Boericke: Great sensitiveness to touch and cold air. Suppurating acne with sharp sticking pains.',
        modalities: { worse: 'Touch, cold air, drafts', better: 'Warmth, covering warmly' },
        aliases: ['hepar sulph', 'hepar']
      }
    ],
    patentFormulations: [
      {
        name: 'SBL Berberis Aquifolium Gel',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tube',
        indications: 'Natural herbal gel that penetrates pores, clears active acne, fades dark spots, and brightens complexion.',
        dosage: 'Wash face with mild soap, pat dry, and apply gel evenly over face twice daily.',
        mrp: 110,
        aliases: ['berberis gel', 'sbl berberis']
      },
      {
        name: 'Dr. Reckeweg R53 (Culron / Acne Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for acne vulgaris, adolescent pimples, acne conglobata, and purulent skin eruptions.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r53', 'reckeweg 53']
      },
      {
        name: 'Bakson Acne Aid Tablets & Cream',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets / 30g Cream',
        indications: 'Comprehensive internal-external therapy to regulate sebaceous glands and eliminate stubborn pimples.',
        dosage: '1 tablet twice daily and apply cream at bedtime.',
        mrp: 175,
        aliases: ['acne aid', 'bakson acne aid']
      }
    ],
    dietAndRegimen: 'Wash face twice daily with clean water and mild homoeopathic neem/Calendula face wash. Never squeeze, pop, or scratch pimples (prevents pitting scars). Drink 3 liters of water daily. Minimize high-glycemic sugar, junk food, and heavy dairy.',
    warningNotes: 'If patient presents with severe cystic nodular acne forming interconnecting sinus tracts and keloids (acne conglobata), evaluate comprehensively for systemic endocrine imbalances.'
  },

  // 32. Boils, Carbuncles & Abscess (ফোড়া / পুঁজ হওয়া / তীব্র দপদপানি ব্যথা)
  {
    id: 'boils-carbuncles-abscess',
    nameEn: 'Boils, Carbuncles & Acute Abscess',
    nameBn: 'ফোড়া ও পুঁজযুক্ত ক্ষত (কার্বাঙ্কল ও তীব্র দপদপানি ব্যথা)',
    chipLabel: 'Boils / ফোড়া ও পুঁজ',
    pathology: 'Staphylococcal Furunculosis, Carbuncle & Deep Dermal Suppurative Abscess with tissue necrosis and throbbing pain',
    miasm: 'Syphilitic Suppurative Destruction with Psoric Inflammation',
    typicalPresentation: 'Hard, dark red, hot, exquisitely tender swelling with violent throbbing pulsations, rapidly developing central yellow necrotic core and pointing with intense localized pain',
    keywords: [
      'boil', 'abscess', 'carbuncle', 'ফোড়া', 'পুঁজ', 'boil with pus', 'furuncle', 'ফোড়া',
      'দপদপ করা ব্যথা', 'গায়ে ফোড়া', 'blood boil', 'pus formation', 'painful boil', 'suppuration'
    ],
    classicalRemedies: [
      {
        name: 'Hepar Sulphuris Calcareum 30C / 200C',
        commonName: "Hahnemann's Calcium Sulphide",
        potency: '30C / 200C',
        dosage: '4 pills 30C every 4 hours to ripen and open boil, or 200C to abort early stage',
        keynotes: [
          'Exquisitely sensitive to slightest touch and cold air; patient cannot bear clothing to touch the boil',
          'Sharp, splinter-like stitching pains; throbbing heat in abscess',
          'Promotes rapid localization, maturation, and spontaneous painless drainage of pus'
        ],
        materiaMedicaNotes: 'Kent: The supreme remedy for suppuration. Exquisite sensitiveness to touch and cold air. Sharp sticking pains.',
        modalities: { worse: 'Touch, cold drafts, uncovering', better: 'Warmth, hot poultices' },
        aliases: ['hepar sulph', 'hepar']
      },
      {
        name: 'Belladonna 30C',
        commonName: 'Deadly Nightshade',
        potency: '30C',
        dosage: '4 pills every 2 hours during initial red-hot congestive stage',
        keynotes: [
          'Early first stage of boil: bright red, fiery hot, swollen, and shining skin',
          'Violent throbbing, pulsating, hammering pain in the affected area',
          'High fever with flushed face, dry skin, and dilated pupils'
        ],
        materiaMedicaNotes: 'Boericke: First stage of boils and carbuncles. Sudden onset, bright red, throbbing, intense heat.',
        modalities: { worse: 'Touch, jar, motion, cold air', better: 'Semi-erect rest, warmth' },
        aliases: ['belladonna', 'bell']
      },
      {
        name: 'Silicea 200C',
        commonName: 'Pure Flint',
        potency: '200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Promotes clearing and deep drainage when boil has opened but continues to discharge thin, watery pus',
          'Indicated in chronic recurrent crops of boils in chilly, scrofulous, malnourished individuals',
          'Stimulates granulation tissue and accelerates complete scar closure'
        ],
        materiaMedicaNotes: 'Kent: Promotes suppuration when it has begun, discharges the core, and then cleanses and heals the cavity.',
        modalities: { worse: 'Cold drafts, dampness', better: 'Warm wrapping, heat' },
        aliases: ['silicea', 'silica']
      },
      {
        name: 'Myristica Sebifera 30C',
        commonName: 'Brazilian Virola / "The Homeopathic Knife"',
        potency: '30C',
        dosage: '4 pills twice daily in warm water',
        keynotes: [
          'Known universally as the homeopathic scalpel; remarkably speeds up suppuration and causes boils to point and evacuate',
          'Indicated in deep phlegmonous inflammation, cellulitis, and carbuncles',
          'Relieves throbbing pain rapidly and cleanses necrotic slough'
        ],
        materiaMedicaNotes: 'Boericke: Powerful specific action on cellular tissues. Speeds up suppuration and causes pointing. Often avoids surgical knife.',
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
        indications: 'German specific for acute furuncles, carbuncles, abscesses, cellular inflammation, and throbbing pain.',
        dosage: '10-15 drops in water every 2 hours during acute phase.',
        mrp: 310,
        aliases: ['r1', 'reckeweg 1']
      },
      {
        name: 'SBL Biochemic Calcarea Sulphurica 6X',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Master tissue salt for the last stage of suppuration; cleanses pus and prevents recurrence of boils.',
        dosage: '4 tablets with warm water 3 times a day.',
        mrp: 135,
        aliases: ['calc sulph 6x', 'sbl calc sulph']
      },
      {
        name: 'Bakson Carbuncle & Boil Aid Drops',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '30 ml Drops',
        indications: 'Arrests recurrent crops of boils, purifies blood, and accelerates healing of dermal abscesses.',
        dosage: '10-15 drops in water twice daily.',
        mrp: 165,
        aliases: ['bakson boil aid']
      }
    ],
    dietAndRegimen: 'Apply warm fomentation with clean hot water to encourage natural pointing. Clean with diluted Calendula antiseptic wash. Never squeeze a boil, particularly in the "danger area of the face" (upper lip and nose). Avoid excess sugar.',
    warningNotes: 'If a boil occurs on the upper lip or nose (danger triangle of face) or in an uncontrolled diabetic patient with spreading cellulitis and high fever, monitor closely to avoid cavernous sinus thrombosis or systemic bacteremia.'
  }
];
