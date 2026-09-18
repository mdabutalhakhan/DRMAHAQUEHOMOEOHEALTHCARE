import type { ClinicalCondition } from '../clinicalRepertoryData';

export const FEMALE_HORMONAL_CONDITIONS: ClinicalCondition[] = [
  // 47. Dysmenorrhea & Painful Menses (মাসিকের তীব্র ব্যথা / তলপেটে খিল ধরা / ডিসমেনোরিয়া)
  {
    id: 'dysmenorrhea-painful-menses',
    nameEn: 'Dysmenorrhea & Spasmodic Menstrual Colic',
    nameBn: 'ডিসমেনোরিয়া ও মাসিকের তীব্র পেট ব্যথা (তলপেটে খিল ধরা ও যন্ত্রণা)',
    chipLabel: 'Dysmenorrhea / মাসিকের ব্যথা',
    pathology: 'Spasmodic Primary Dysmenorrhea / Secondary Dysmenorrhea (Endometriosis/Adenomyosis) with excessive uterine prostaglandin (PGF2alpha) hypertonicity',
    miasm: 'Sycotic Uterine Spasm with Psoric Hypersensitivity',
    typicalPresentation: 'Violent labor-like or crampy pelvic pain before and during menstrual flow, radiating to thighs and back, nausea, fainting, dark clotted menstrual blood',
    keywords: [
      'dysmenorrhea', 'menstrual pain', 'মাসিকের ব্যথা', 'পিরিয়ডের ব্যথা', 'period pain',
      'painful menses', 'তলপেটে ব্যথা মাসিক', 'uterine cramps', 'ডিসমেনোরিয়া', 'মেনস্ট্রুয়াল ক্র্যাম্প',
      'পিরিয়ড ক্র্যাম্প', 'মাসিকের তলপেট খিল ধরা'
    ],
    classicalRemedies: [
      {
        name: 'Magnesia Phosphorica 6X / 30C',
        commonName: 'Magnesium Phosphate',
        potency: '6X / 30C',
        dosage: '4 tablets 6X dissolved in a cup of hot water taken every 15-30 minutes during acute cramps, or 4 pills 30C',
        keynotes: [
          'The sovereign homeopathic anti-spasmodic for menstrual colic and agonizing pelvic spasms',
          'Sharp, cutting, lightning-like shooting pains forcing patient to bend double or press firmly on abdomen',
          'Instant, dramatic relief from hot water bottles, warm fomentation, and hard pressure'
        ],
        materiaMedicaNotes: 'Kent: The great anti-spasmodic pain reliever. Menstrual colic relieved by heat, bending double, and hard pressure. Flow dark and stringy.',
        modalities: { worse: 'Cold air, uncovering, right side', better: 'Heat, warm applications, bending double, firm pressure' },
        aliases: ['mag phos', 'magnesia phos', 'mag phos 6x']
      },
      {
        name: 'Colocynthis 30C / 200C',
        commonName: 'Bitter Apple',
        potency: '30C / 200C',
        dosage: '4 pills every 2 hours in water',
        keynotes: [
          'Excruciating, agonizing cramping pelvic pain driving patient to double up and press abdomen hard against bedpost or with both hands',
          'Accompanied by intense restlessness, nausea, vomiting, or diarrhea during menses',
          'Severe emotional irritability and aggravation from indignation or suppressed anger'
        ],
        materiaMedicaNotes: 'Boericke: Agonizing menstrual colic, compelling patient to bend double and press hard upon abdomen. Flow dark and scanty.',
        modalities: { worse: 'Motion, anger, standing', better: 'Bending double, hard pressure, heat' },
        aliases: ['colocynthis', 'colocynth', 'coloc']
      },
      {
        name: 'Caulophyllum Thalictroides 30C / Q',
        commonName: 'Blue Cohosh',
        potency: '30C / Q',
        dosage: '4 pills 3 times daily or 10 drops Q in warm water',
        keynotes: [
          'Severe spasmodic, intermittent, labor-like bearing-down pains in uterus, radiating into groin, bladder, and thighs',
          'Menses scanty, delayed, or flow suspended by sharp spasmodic contractions of cervical os',
          'Small joint pains (fingers, toes) alternating with or accompanying menstrual distress'
        ],
        materiaMedicaNotes: 'Boericke: Specific uterine motor excitant. Spasmodic and severe pains, which fly in all directions; lack of uterine tone.',
        modalities: { worse: 'Cold air, motion', better: 'Warmth' },
        aliases: ['caulophyllum', 'caulo']
      },
      {
        name: 'Chamomilla 30C / 200C',
        commonName: 'German Chamomile',
        potency: '30C / 200C',
        dosage: '4 pills every 2 hours during acute agony',
        keynotes: [
          'Unendurable, intolerable menstrual labor-like pain with extreme snappish anger, uncivil irritability, and weeping',
          'Flow is profuse, dark, clotted, and offensive; patient cannot bear the pain',
          'One cheek hot and red, the other pale; fainting spells during menses'
        ],
        materiaMedicaNotes: 'Kent: Pains are intolerable; drives her to distraction. Menses profuse, dark, with large clots. Snappish and irritable.',
        modalities: { worse: 'Anger, night, warmth of bed', better: 'Warm applications' },
        aliases: ['chamomilla', 'cham']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R75 (Dolomensan / Dysmenorrhea Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for spasmodic dysmenorrhea, labor-like pelvic pain, uterine cramps, and menstrual backache.',
        dosage: '10-15 drops in warm water every 1-2 hours during pain; 10 drops twice daily during intermenstrual period.',
        mrp: 310,
        aliases: ['r75', 'reckeweg 75']
      },
      {
        name: 'SBL Mensovit Syrup / Dysmin Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '115 ml Syrup / 25g Tablets',
        indications: 'Relieves uterine muscular hypertonicity, eases pelvic spasms, and ensures regular comfortable menses.',
        dosage: '1-2 teaspoonfuls twice daily, or 2 tablets 3 times a day.',
        mrp: 145,
        aliases: ['mensovit', 'dysmin', 'sbl dysmin']
      },
      {
        name: 'Bakson Menso Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Tones uterine musculature, minimizes painful menstrual contractions, and balances cycles.',
        dosage: '1-2 teaspoonfuls with water twice daily.',
        mrp: 155,
        aliases: ['menso aid', 'bakson menso aid']
      }
    ],
    dietAndRegimen: 'Apply a hot water bottle or heating pad over lower abdomen and lumbosacral back. Sip hot ginger-chamomile tea during pain. Avoid iced drinks and cold water bathing before menses. Engage in gentle pelvic cat-cow yoga stretches.',
    warningNotes: 'If dysmenorrhea is progressively worsening, accompanied by severe dyspareunia (pain during intercourse) or chronic non-menstrual pelvic pain, evaluate for pelvic endometriosis or adenomyosis with Transvaginal Ultrasonography (TVS).'
  },

  // 48. Leucorrhea & Vaginal Discharge (শ্বেতপ্রদর / সাদাস্রাব / যোনিতে চুলকানি ও জ্বালা)
  {
    id: 'leucorrhea-vaginal-discharge-vaginitis',
    nameEn: 'Leucorrhea, Vaginitis & Abnormal Vaginal Discharge',
    nameBn: 'শ্বেতপ্রদর ও সাদাস্রাব (যোনিপথে সাদা বা হলুদ স্রাব, চুলকানি ও জ্বালা)',
    chipLabel: 'Leucorrhea / শ্বেতপ্রদর ও সাদাস্রাব',
    pathology: 'Infectious / Non-infectious Vulvovaginitis (Candidiasis, Bacterial Vaginosis, Trichomoniasis) & Cervical Catarrh',
    miasm: 'Sycotic Catarrhal Secretion with Psoric Pruritus',
    typicalPresentation: 'Profuse thick, milky-white, curdy (like cottage cheese), or yellow-green offensive vaginal discharge, intense burning itching of vulva, excoriation of thighs, weakness in lumbar spine',
    keywords: [
      'leucorrhea', 'leucorrhoea', 'সাদাস্রাব', 'শ্বেতপ্রদর', 'white discharge', 'vaginal itching',
      'curdy discharge', 'vulval burning', 'সাদা স্রাব', 'vaginitis', 'leucorrhoea itching',
      'যোনিতে চুলকানি', 'cervical discharge'
    ],
    classicalRemedies: [
      {
        name: 'Kreosotum 30C / 200C',
        commonName: 'Beechwood Kreosote',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Acrid, corrosive, burning, foul-smelling, yellowish-white discharge that excoriates the pudenda and thighs',
          'Causes intense, intolerable itching and burning inside the vagina and around labia',
          'Flow stops during menses, but appears immediately before or after menses; stains linen yellow'
        ],
        materiaMedicaNotes: 'Boericke: Corrosive, itching, offensive leucorrhea; stains linen yellow; stiffens like starch. Great burning after scratching.',
        modalities: { worse: 'Standing, walking, after menses', better: 'Warm food, lying down' },
        aliases: ['kreosotum', 'kreos']
      },
      {
        name: 'Sepia Officinalis 200C',
        commonName: 'Inky Juice of Cuttlefish',
        potency: '200C',
        dosage: '4 pills twice weekly in the morning',
        keynotes: [
          'Profuse yellowish-green or milky leucorrhea with sensation of bearing-down in pelvic organs (must cross legs to prevent prolapse)',
          'Discharge most marked in young girls at puberty, during pregnancy, or at menopause',
          'Chilly, indifferent to loved ones, tired, with characteristic brownish-yellow chloasma saddle across nose'
        ],
        materiaMedicaNotes: 'Kent: Leucorrhea yellow, greenish, milky, with intense bearing-down sensation in pelvis as if everything would escape through vulva.',
        modalities: { worse: 'Morning, standing, damp coldness', better: 'Crossing legs, vigorous exercise' },
        aliases: ['sepia', 'sep']
      },
      {
        name: 'Alumina 30C',
        commonName: 'Pure Clay / Aluminum Oxide',
        potency: '30C',
        dosage: '4 pills twice daily',
        keynotes: [
          'Profuse, transparent, ropy, acrid, albuminous leucorrhea running down to the heels in large quantities',
          'Intense burning and corroding in vagina; so profuse that patient must wear pads day and night',
          'Relieved only by washing with large quantities of cold water'
        ],
        materiaMedicaNotes: 'Boericke: Leucorrhea acrid, profuse, transparent, ropy, running down to the heels. Relieved by washing with cold water.',
        modalities: { worse: 'During daytime, walking, standing', better: 'Cold water wash' },
        aliases: ['alumina', 'alum']
      },
      {
        name: 'Hydrastis Canadensis Mother Tincture (Q) / 30C',
        commonName: 'Golden Seal',
        potency: 'Q / 30C',
        dosage: '10 drops Q in water twice daily, and use diluted Q for vaginal wash',
        keynotes: [
          'Thick, tenacious, viscid, ropy, yellowish leucorrhea that can be drawn out in long strings',
          'Associated with cervical erosion, endocervicitis, and profound gastric sinking weakness in epigastrium',
          'Pruritus vulvae with intense obstinate constipation'
        ],
        materiaMedicaNotes: 'Boericke: Tenacious, thick, ropy, yellow leucorrhea. Erosion of cervix. Sinking feeling in stomach.',
        modalities: { worse: 'Cold, motion', better: 'Warmth, rest' },
        aliases: ['hydrastis', 'hydrastis can', 'hydrastis q']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R10 (Klimakterin / Female Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German formulation for chronic leucorrhea, ovarian and pelvic catarrh, and vaginal pruritus.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r10', 'reckeweg 10']
      },
      {
        name: 'SBL Pelvi-Tabs / Leucorid Tablets',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '25g Tablets',
        indications: 'Comprehensive specific for acrid, curd-like, white/yellow leucorrhea, vulval itching, and backache.',
        dosage: '2 tablets 3 times daily.',
        mrp: 140,
        aliases: ['pelvi-tabs', 'leucorid', 'sbl leucorid']
      },
      {
        name: 'Bakson Fem Aid Syrup',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '115 ml Syrup',
        indications: 'Eliminates chronic vaginal discharge, clears pelvic congestion, and relieves lumbosacral fatigue.',
        dosage: '1-2 teaspoonfuls with water twice daily.',
        mrp: 150,
        aliases: ['fem aid', 'bakson fem aid']
      }
    ],
    dietAndRegimen: 'Maintain strict genital hygiene; wash with clean warm water and pat dry with clean towel. Wear loose, breathable cotton panties; avoid synthetic underwear and tight jeans. Avoid commercial perfumed vaginal washes or chemical douches. Eat unsweetened probiotic yogurt.',
    warningNotes: 'If vaginal discharge is foul-smelling, blood-stained, occurs post-menopausally, or is accompanied by intermenstrual bleeding, arrange urgent Pap smear and pelvic examination to rule out cervical dysplasia or endometrial malignancy.'
  },

  // 49. Polycystic Ovarian Syndrome (PCOS) & Irregular Menses (পিসিওএস / অনিয়মিত মাসিক / ডিম্বাশয়ে সিস্ট)
  {
    id: 'pcos-irregular-menses-ovarian-cyst',
    nameEn: 'PCOS, Polycystic Ovarian Syndrome & Irregular Menses',
    nameBn: 'পিসিওএস ও অনিয়মিত মাসিক (ডিম্বাশয়ে সিস্ট, ওজন বৃদ্ধি ও মাসিকের সমস্যা)',
    chipLabel: 'PCOS / পিসিওএস ও ডিম্বাশয়ে সিস্ট',
    pathology: 'Hyperandrogenism, Insulin Resistance, Anovulatory Oligomenorrhea / Amenorrhea & Multiple Peripheral Ovarian Cysts (String-of-pearls appearance)',
    miasm: 'Sycotic Metabolic Storage & Cystic Proliferation with Tubercular Hormonal Imbalance',
    typicalPresentation: 'Menses delayed for 2-4 months or completely absent (amenorrhea), progressive unexplained weight gain/obesity, facial hirsutism, acne on jawline, hair thinning, pelvic ultrasound showing polycystic ovaries',
    keywords: [
      'pcos', 'ovarian cyst', 'পিসিওএস', 'অনিয়মিত মাসিক', 'irregular periods', 'polycystic ovary',
      'delayed periods', 'মাসিক বন্ধ', 'amenorrhea', 'facial hair women', 'hirsutism', 'ডিম্বাশয়ে সিস্ট',
      'pcod', 'সিস্ট ডিম্বাশয়'
    ],
    classicalRemedies: [
      {
        name: 'Thuja Occidentalis 200C / 1M',
        commonName: 'Arbor Vitae',
        potency: '200C / 1M',
        dosage: '4 pills 200C once every 3 days in the morning, or 1M once weekly',
        keynotes: [
          'Master anti-sycotic constitutional polychrest to dissolve ovarian cysts and arrest pathological cystic proliferation',
          'Left ovary especially affected; sharp cutting pains in left iliac fossa during walking or before menses',
          'Abnormal facial hair growth (hirsutism), fleshy warts on neck, and oily greasy skin'
        ],
        materiaMedicaNotes: 'Kent: Master remedy for sycotic overgrowths, ovarian cysts, and tumors. Relieves left ovarian pain and restores menstrual rhythm.',
        modalities: { worse: 'Damp cold weather, 3 AM', better: 'Warm dry air' },
        aliases: ['thuja', 'thuja occ']
      },
      {
        name: 'Pulsatilla Nigricans 30C / 200C',
        commonName: 'Wind Flower',
        potency: '30C / 200C',
        dosage: '4 pills twice daily in water',
        keynotes: [
          'Suppressed, delayed, scanty, or totally absent menses (amenorrhea) in gentle, mild, weepy, emotional girls',
          'Flow is constantly changing (never two periods alike); delayed for weeks or months',
          'Complete absence of thirst; feels suffocated in a warm closed room, immensely relieved in open fresh air'
        ],
        materiaMedicaNotes: 'Boericke: Great remedy for delayed, scanty, suppressed menses. Symptoms ever changing. Mild, yielding disposition, thirstless, better in open air.',
        modalities: { worse: 'Warm closed room, evening, rich fatty foods', better: 'Open cool air, cold food/drinks' },
        aliases: ['pulsatilla', 'puls']
      },
      {
        name: 'Calcarea Carbonica 200C',
        commonName: 'Carbonate of Lime (Oyster Shell)',
        potency: '200C',
        dosage: '4 pills twice weekly in morning',
        keynotes: [
          'PCOS in fair, fat, flabby individuals who gain weight rapidly and struggle with metabolic sluggishness',
          'Menses too late, scanty, or irregular, with cold damp feet and sour head sweat during sleep',
          'Craves boiled eggs and indigestible things; chilly, easily exhausted on climbing stairs'
        ],
        materiaMedicaNotes: 'Kent: Tendency to obesity and delayed or disordered menses in fair, fat, flabby subjects with cold damp feet and head perspiration.',
        modalities: { worse: 'Cold damp air, exertion, ascending stairs', better: 'Dry warm weather' },
        aliases: ['calc carb', 'calcarea carb']
      },
      {
        name: 'Oophorinum 3X / 30C',
        commonName: 'Ovarian Extract (Sarcodes)',
        potency: '3X / 30C',
        dosage: '2 tablets 3X twice daily or 4 pills 30C',
        keynotes: [
          'Powerful sarcode that acts directly on ovarian endocrine function to stimulate ovulation',
          'Assists resorption of ovarian follicular cysts and rebalances estrogen-progesterone ratio',
          'Relieves cutaneous eruptions, acne, and hot flushes associated with ovarian dysfunction'
        ],
        materiaMedicaNotes: 'Boericke: Climacteric disturbances and disorders of ovaries. Cutaneous eruptions and nervous symptoms resulting from ovarian insufficiency.',
        modalities: { worse: 'Hormonal fluctuations', better: 'Normal cyclic rhythm' },
        aliases: ['oophorinum', 'oophor']
      }
    ],
    patentFormulations: [
      {
        name: 'Dr. Reckeweg R10 (Klimakterin / Ovarian Drops)',
        brand: 'Dr. Reckeweg',
        company: 'Dr. Reckeweg & Co (Germany)',
        country: 'Germany',
        bottleSize: '22 ml Drops',
        indications: 'German specific for ovarian dysfunction, polycystic ovaries, irregular menstrual intervals, and hormonal hot flushes.',
        dosage: '10-15 drops in water 3 times daily before meals.',
        mrp: 310,
        aliases: ['r10', 'reckeweg 10']
      },
      {
        name: 'SBL Mensovit Plus Syrup',
        brand: 'SBL',
        company: 'SBL Pvt Ltd',
        country: 'India',
        bottleSize: '180 ml Syrup',
        indications: 'Regulates anovulatory menstrual cycles, restores hormonal balance, and tones ovarian parenchyma.',
        dosage: '2 teaspoonfuls twice daily before meals.',
        mrp: 165,
        aliases: ['mensovit plus', 'sbl mensovit']
      },
      {
        name: 'Bakson Ovi Aid Tablets',
        brand: "Bakson's",
        company: 'Bakson Drugs & Pharmaceuticals',
        country: 'India',
        bottleSize: '75 Tablets',
        indications: 'Promotes follicular maturation, aids in dissolving ovarian cysts, and reduces hyperandrogenic symptoms.',
        dosage: '1 tablet 3 times a day with water.',
        mrp: 175,
        aliases: ['ovi aid', 'bakson ovi aid']
      }
    ],
    dietAndRegimen: 'Follow a low-glycemic index (low-GI) whole-food diet to reduce insulin resistance. Completely eliminate refined sugar, white bakery breads, sugary sodas, and fast food. Engage in 45 minutes of daily brisk walking or resistance training to improve peripheral insulin sensitivity.',
    warningNotes: 'Confirm diagnosis with Pelvic Ultrasonography (USG) and hormonal panel (FSH, LH ratio > 2:1, Total Testosterone, DHEA-S, fasting insulin). Rule out thyroid disorders (TSH) and hyperprolactinemia.'
  }
];
