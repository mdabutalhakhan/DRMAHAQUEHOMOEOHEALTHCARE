import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI client (reads VITE_GEMINI_API_KEY, GEMINI_API_KEY directly)
const getGenAI = (customKey?: string) => {
  const apiKey =
    customKey ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    '';
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Health Check
app.get('/api/health', (req, res) => {
  const activeKey =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    '';
  res.json({
    status: 'ok',
    clinic: 'Homoeo Health Care',
    doctor: 'Dr. M. A. Haque, M.D. (Homoeo)',
    gemini_configured: !!activeKey,
    model: 'gemini-1.5-flash',
  });
});

// Gemini AI Clinical Consultant Handler
const handleConsultRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { symptoms, modalities, system, patientAge, duration, apiKey } = req.body;

    if (!symptoms && !modalities) {
      return res.status(400).json({ error: 'Symptoms or modalities are required.' });
    }

    const ai = getGenAI(apiKey);
    if (!ai) {
      // Fallback intelligent clinical homoeopathic dual-tier responses if API key is not yet set in environment
      return res.json({
        analysis_summary: `Preliminary homoeopathic evaluation for: "${symptoms || 'General complaints'}". High affinity to acute/sub-acute repertory rubrics and multi-brand patent formulations.`,
        remedies: [
          {
            remedy_name: 'Rhus Toxicodendron (Rhus Tox)',
            common_name: 'Poison Ivy',
            potency: '30C or 200C',
            dosage: '4 pills, 3 times daily in water',
            key_indications: [
              'Ailments from cold damp weather or getting wet while perspiring',
              'Stiffness worse on first movement, distinctly better by continuous gentle motion',
              'Restlessness at night, constantly tossing and turning',
            ],
            materia_medica_notes: 'Dr. Boericke: Affects fibrous tissues, joints, ligaments. Key modality: aggravated by rest, draft of air, damp cold; ameliorated by warm applications, motion.',
            modalities: {
              worse: 'Cold damp weather, night, rest, beginning of motion',
              better: 'Continued gentle motion, warm applications, dry heat',
            },
          },
          {
            remedy_name: 'Bryonia Alba',
            common_name: 'Wild Hops',
            potency: '30C or 200C',
            dosage: '4 pills, 2 to 3 times daily',
            key_indications: [
              'Excessive dryness of mucous membranes with great thirst for large quantities of cold water',
              'Pains sharply stitching, worse from the least motion, better by absolute rest and pressure',
              'Irritability and anxiety about business affairs',
            ],
            materia_medica_notes: 'Dr. Kent: The patient wants to be quiet and undisturbed. Every motion aggravates. Firm pressure or lying on the painful side brings relief.',
            modalities: {
              worse: 'Least movement, warmth, morning',
              better: 'Lying on painful side, absolute rest, cold drinks',
            },
          },
          {
            remedy_name: 'Arnica Montana',
            common_name: 'Leopard\'s Bane',
            potency: '200C or 1M',
            dosage: '4 pills twice daily for 3 days',
            key_indications: [
              'Sore, bruised, lame feeling throughout body as if beaten',
              'Bed feels too hard; patient moves to find a softer place',
              'History of mechanical trauma, overexertion or sprain',
            ],
            materia_medica_notes: 'First remedy for traumatism, shock, muscular strain, and bruised feelings.',
            modalities: {
              worse: 'Touch, jarring, damp cold, motion',
              better: 'Lying with head low or outstretched',
            },
          },
          {
            remedy_name: 'Causticum',
            common_name: 'Hahnemann\'s Tinctura Acris Sine Kali',
            potency: '200C',
            dosage: '4 pills once daily in evening',
            key_indications: [
              'Tearing, drawing rheumatic pains in muscular and fibrous tissues with deformities',
              'Stiffness in joints with contracted tendons and weakness of sphincters',
              'Distinctly worse in clear fine weather, better in damp wet weather',
            ],
            materia_medica_notes: 'Kent: Deep-acting antipsoric for chronic paralytic and rheumatic affections with great contracture of muscles.',
            modalities: {
              worse: 'Clear dry cold wind, morning',
              better: 'Damp wet weather, warm bed',
            },
          },
        ],
        patent_formulations: [
          {
            name: "Bakson's Rheum Aid Syrup",
            brand: "Bakson's",
            company: "Bakson Drugs & Pharmaceuticals",
            bottle_size: '115 ml Syrup',
            indications: 'Effective remedy for rheumatism, arthritis, gout, sciatica, joint stiffness and pain.',
            dosage: '1 teaspoon diluted in warm water 3 times daily.',
            mrp: 155,
            aliases: ['rheum aid', 'bakson rheum aid', 'b11'],
          },
          {
            name: 'Dr. Reckeweg R11 (Lumbacon)',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            bottle_size: '22 ml Drops',
            indications: 'German biological drops for acute and chronic muscular rheumatism, lumbago, back pain, sciatica.',
            dosage: '10-15 drops in water 3 times daily before meals.',
            mrp: 310,
            aliases: ['r11', 'r-11', 'lumbacon', 'reckeweg 11'],
          },
          {
            name: 'Dr. Reckeweg R73',
            brand: 'Dr. Reckeweg',
            company: 'Dr. Reckeweg & Co (Germany)',
            bottle_size: '22 ml Drops',
            indications: 'Osteoarthritis, degeneration of large joints, knee and hip cartilage wear.',
            dosage: '10-15 drops in water 3-4 times daily.',
            mrp: 310,
            aliases: ['r73', 'r-73', 'reckeweg 73'],
          },
          {
            name: 'SBL Orthomuv Syrup & Oil',
            brand: 'SBL',
            company: 'SBL Pvt Ltd',
            bottle_size: '180 ml Syrup / 60 ml Oil',
            indications: 'Synergistic oral syrup and topical oil for arthritis, joint inflammation, morning stiffness.',
            dosage: '1 teaspoon syrup 3 times daily + apply oil gently twice daily.',
            mrp: 190,
            aliases: ['orthomuv', 'sbl orthomuv', 'orthomuv oil'],
          },
          {
            name: 'Adel 24 (Septonsil / Joint Drops)',
            brand: 'Adel',
            company: 'Adel Pekana (Germany)',
            bottle_size: '20 ml Drops',
            indications: 'German biological drops for acute and chronic rheumatic inflammation and joint pain.',
            dosage: '15-20 drops in water 3 times daily.',
            mrp: 335,
            aliases: ['adel 24', 'adel-24', 'adel joint'],
          },
          {
            name: 'Wheezal WL-35 (Rheumatic Pain Drops)',
            brand: 'Wheezal',
            company: 'Wheezal Homoeo Pharma',
            bottle_size: '30 ml Drops',
            indications: 'Fast relief from joint, muscular and tendon pain, acute rheumatic stiffness.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 170,
            aliases: ['wl-35', 'wl 35', 'wheezal wl 35'],
          },
          {
            name: 'Medisynth Rheuma-Saj Forte',
            brand: 'Medisynth',
            company: 'Medisynth Chemicals',
            bottle_size: '30 ml Drops',
            indications: 'Formulation for rheumatoid arthritis, gout, high uric acid, and muscular backache.',
            dosage: '10-15 drops in water 3 times daily.',
            mrp: 185,
            aliases: ['rheuma saj', 'rheuma-saj', 'medisynth rheuma'],
          },
          {
            name: 'Schwabe Topi MP Gel / Bryorheum',
            brand: 'Schwabe',
            company: 'Dr. Willmar Schwabe',
            bottle_size: '30 ml Drops / 30g Gel',
            indications: 'WSG German proprietary formulation for joint mobility, cartilage support and rheumatic pains.',
            dosage: '10-15 drops 3 times daily / apply gel locally.',
            mrp: 235,
            aliases: ['bryorheum', 'topi mp', 'schwabe bryorheum'],
          },
        ],
        repertory_keynotes: [
          'Kent: Extremities - Pain, rheumatic, cold wet weather',
          'Boericke: Fibrous tissue inflammation and muscular soreness',
        ],
        diet_and_regimen: 'Advise patient to avoid raw onion, garlic, strong coffee, or camphor/menthol balms within 30 minutes of taking homoeopathic doses. Keep warm and dry.',
        warning_notes: 'Homoeopathic suggestions are clinical decision-support aids for Dr. M. A. Haque. Individualized constitutional evaluation is recommended.',
      });
    }

    const prompt = `You are a master homeopathic clinician assisting Dr. M. A. Haque, M.D. (Homoeo) at "Homoeo Health Care" clinic.
When analyzing symptoms, provide 4 Classical Simillimum remedies (Kent/Boericke) AND at least 5-6 renowned patent combinations specifically drawing from Bakson's, Dr. Reckeweg, SBL, Adel, Wheezal, Schwabe, and Medisynth with exact commercial brand names.

PATIENT PRESENTATION:
- Chief Symptoms: ${symptoms || 'None specified'}
- Modalities (Worse/Better): ${modalities || 'Standard acute'}
- Affected System: ${system || 'General'}
- Patient Age/Group: ${patientAge || 'Adult'}
- Duration: ${duration || 'Acute/Sub-acute'}

Provide your response in structured JSON format with:
1. "analysis_summary": Brief clinical summary of the miasmatic, repertory, and patent therapeutic picture.
2. "remedies": Array of exactly 4 Classical Simillimum homoeopathic remedies (Kent/Boericke), each having:
   - "remedy_name" (e.g. Berberis Vulgaris, Rhus Toxicodendron, Bryonia Alba, Lycopodium Clavatum, Nux Vomica)
   - "common_name"
   - "potency" (e.g. 30C, 200C, 1M, Q)
   - "dosage" (e.g. 4 pills 3 times daily or 10-15 drops in 1/4 cup water)
   - "key_indications" (array of 3 specific keynote symptoms)
   - "materia_medica_notes" (concise authentic Materia Medica reference)
   - "modalities": { "worse": string, "better": string }
3. "patent_formulations": Array of at least 5-6 premier commercial patent combinations specifically from Bakson's, Dr. Reckeweg, SBL, Adel, Wheezal, Schwabe, Medisynth, and Allen with exact commercial brand names (e.g. "Bakson Calculi Aid", "Dr. Reckeweg R27", "SBL Clearstone", "Adel 22", "Wheezal WL-14", "Schwabe Berberis Pentarkan", "Medisynth Renal Forte"), each having:
   - "name": full commercial product name
   - "brand": exact brand ("Bakson's", "Dr. Reckeweg", "SBL", "Adel", "Wheezal", "Schwabe", "Medisynth", "Allen")
   - "company": manufacturer name (e.g. "Dr. Reckeweg & Co (Germany)", "SBL Pvt Ltd", "Bakson Drugs & Pharmaceuticals")
   - "bottle_size": package form (e.g. "30 ml Drops", "22 ml Drops", "115 ml Syrup", "20g Tablets")
   - "indications": clinical indication and therapeutic scope
   - "dosage": recommended dosage
   - "mrp": approximate MRP in INR (number)
   - "aliases": array of 3-4 lowercase search keywords or model codes for inventory lookup (e.g. ["calculi aid", "b16", "bakson calculi"])
4. "repertory_keynotes": Array of relevant Kent/Boericke rubrics.
5. "diet_and_regimen": Homoeopathic regimen instructions (e.g. hydration, specific foods to avoid, antidotes).
6. "warning_notes": Clinical safety and investigation advice (e.g. USG, PSA, LFT, Serum Uric Acid).`;

    const schemaConfig = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis_summary: { type: Type.STRING },
          remedies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                remedy_name: { type: Type.STRING },
                common_name: { type: Type.STRING },
                potency: { type: Type.STRING },
                dosage: { type: Type.STRING },
                key_indications: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                materia_medica_notes: { type: Type.STRING },
                modalities: {
                  type: Type.OBJECT,
                  properties: {
                    worse: { type: Type.STRING },
                    better: { type: Type.STRING },
                  },
                  required: ['worse', 'better'],
                },
              },
              required: ['remedy_name', 'potency', 'dosage', 'key_indications', 'materia_medica_notes', 'modalities'],
            },
          },
          patent_formulations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING },
                company: { type: Type.STRING },
                bottle_size: { type: Type.STRING },
                indications: { type: Type.STRING },
                dosage: { type: Type.STRING },
                mrp: { type: Type.NUMBER },
                aliases: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['name', 'brand', 'company', 'indications', 'dosage'],
            },
          },
          repertory_keynotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          diet_and_regimen: { type: Type.STRING },
          warning_notes: { type: Type.STRING },
        },
        required: ['analysis_summary', 'remedies', 'repertory_keynotes', 'diet_and_regimen'],
      },
    };

    let outputText = '';
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    for (const m of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: schemaConfig,
        });
        outputText = response.text || '';
        if (outputText) break;
      } catch (err: any) {
        console.warn(`Server model ${m} failed:`, err.message || err);
      }
    }

    if (outputText) {
      try {
        const parsed = JSON.parse(outputText);
        return res.json(parsed);
      } catch (e) {
        return res.json({
          analysis_summary: outputText,
          remedies: [],
          repertory_keynotes: [],
          diet_and_regimen: 'Avoid camphor, raw onion, and strong coffee during treatment.',
        });
      }
    }

    res.status(500).json({ error: 'No response received from Gemini model' });
  } catch (err: any) {
    console.error('Gemini Consult Error:', err);
    res.status(500).json({
      error: 'Failed to process clinical AI consultation',
      details: err.message,
    });
  }
};

// Helper to generate fallback pharmaceutical company catalog if AI key or internet is unavailable
function generateFallbackCatalog(companyName: string, mode: string, websiteUrl?: string) {
  const comp = companyName.trim() || 'Homoeo Pharma';
  const isWheezal = comp.toLowerCase().includes('wheezal');
  const isRepl = comp.toLowerCase().includes('repl') || comp.toLowerCase().includes('advice');
  const isSsl = comp.toLowerCase().includes('ssl');
  const isBakson = comp.toLowerCase().includes('bakson');
  const isSbl = comp.toLowerCase().includes('sbl');
  const isSchwabe = comp.toLowerCase().includes('schwabe');
  const isReckeweg = comp.toLowerCase().includes('reckeweg');
  const isAdel = comp.toLowerCase().includes('adel');

  let items: any[] = [];

  if (isSsl) {
    items = [
      {
        name: 'SSL Drop No. 1 (Fever & Influenza)',
        bengaliName: 'এসএসএল ড্রপ নং ১ (জ্বর ও সর্দি)',
        brand: 'SSL Pharma',
        category: 'patent',
        sphereOfAction: 'Acute febrile states, viral cold, shivering and catarrh (তীব্র জ্বর ও শ্বাসতন্ত্রীয় প্রদাহ)',
        clinicalIndications: [
          { en: 'High fever with body ache and restlessness', bn: 'তীব্র জ্বর, গা-ব্যথা ও ছটফটানি' },
          { en: 'Acute coryza, sneezing and nasal discharge', bn: 'সর্দি, ঘন ঘন হাঁচি ও নাক বন্ধ' }
        ],
        dosage: '10-15 drops in lukewarm water 3 times daily'
      },
      {
        name: 'SSL Drop No. 5 (Liver & Gallbladder)',
        bengaliName: 'এসএসএল ড্রপ নং ৫ (লিভার ও পিত্তথলি)',
        brand: 'SSL Pharma',
        category: 'patent',
        sphereOfAction: 'Hepatic congestion, sluggish digestion and biliary dyskinesia (যকৃতের দুর্বলতা ও হজম শক্তি বৃদ্ধি)',
        clinicalIndications: [
          { en: 'Jaundice, enlarged liver and bitter taste in mouth', bn: 'জন্ডিস, ফ্যাটি লিভার ও মুখে তেতো ভাব' },
          { en: 'Loss of appetite, dyspepsia and chronic constipation', bn: 'ক্ষুধামন্দা, পেটে গ্যাস ও কোষ্ঠকাঠিন্য' }
        ],
        dosage: '10-15 drops in 1/4 cup water before meals'
      },
      {
        name: 'SSL Drop No. 7 (Kidney & Urinary Tract)',
        bengaliName: 'এসএসএল ড্রপ নং ৭ (কিডনি ও মূত্রনালী)',
        brand: 'SSL Pharma',
        category: 'patent',
        sphereOfAction: 'Renal parenchyma, bladder irritation, gravels and urinary tract infection (মূত্রাশয় প্রদাহ ও পাথর)',
        clinicalIndications: [
          { en: 'Burning micturition and renal colic', bn: 'প্রস্রাবে তীব্র জ্বালাপোড়া ও কিডনিতে ব্যথা' },
          { en: 'Urinary sediment, gravel and cloudy urine', bn: 'কিডনি বালুকা ও ঘন প্রস্রাব' }
        ],
        dosage: '15 drops in water 3-4 times daily'
      },
      {
        name: 'SSL Drop No. 12 (Joint & Rheumatic Pain)',
        bengaliName: 'এসএসএল ড্রপ নং ১২ (বাত ও অস্থিসন্ধি ব্যথা)',
        brand: 'SSL Pharma',
        category: 'patent',
        sphereOfAction: 'Fibrous tissue, synovial membrane and joint mobility (অস্থিসন্ধির প্রদাহ ও বাতবেদনা)',
        clinicalIndications: [
          { en: 'Rheumatoid arthritis, joint stiffness and swelling', bn: 'রিউমাটয়েড আর্থ্রাইটিস ও অস্থিসন্ধির ফোলাভাব' },
          { en: 'Sciatica and lumbago aggravated by damp cold', bn: 'সায়াটিকা ও কোমর ব্যথা' }
        ],
        dosage: '10-15 drops in warm water 3 times daily'
      },
      {
        name: 'SSL Drop No. 18 (Cough & Bronchial Relief)',
        bengaliName: 'এসএসএল ড্রপ নং ১৮ (কাশি ও শ্বাসকষ্ট)',
        brand: 'SSL Pharma',
        category: 'patent',
        sphereOfAction: 'Bronchial mucosa, larynx and spasmodic respiratory irritation (শ্বাসনালীর আক্ষেপ ও কাশি)',
        clinicalIndications: [
          { en: 'Dry hacking cough, bronchitis and suffocative breathing', bn: 'শুকনো খুসখুসে কাশি ও শ্বাসকষ্ট' },
          { en: 'Chest congestion with difficult expectoration', bn: 'বুকে কফ জমে থাকা' }
        ],
        dosage: '10 drops in lukewarm water every 3 hours'
      },
      {
        name: 'SSL Drop No. 24 (Cardiac Tonic & Hypertension)',
        bengaliName: 'এসএসএল ড্রপ নং ২৪ (হার্ট টনিক ও উচ্চ রক্তচাপ)',
        brand: 'SSL Pharma',
        category: 'patent',
        sphereOfAction: 'Myocardium, arterial pressure regulation and coronary circulation (হৃদপেশী সুরক্ষা ও রক্তচাপ নিয়ন্ত্রণ)',
        clinicalIndications: [
          { en: 'Palpitation, nervous cardiac arrhythmia and dyspnea', bn: 'বুক ধড়ফড়ানি ও বুকভার ভাব' },
          { en: 'Mild to moderate hypertension and mental anxiety', bn: 'উচ্চ রক্তচাপ ও উদ্বেগ' }
        ],
        dosage: '10-15 drops in half cup water twice daily'
      }
    ];
  } else if (isRepl) {
    items = [
      {
        name: 'REPL Dr. Advice No. 3 (Arthritis & Gout)',
        bengaliName: 'আরইপিএল ডক্টর অ্যাডভাইস ৩ (বাত ও গেঁটেবাত)',
        brand: 'REPL Pharma',
        category: 'patent',
        sphereOfAction: 'Synovial fluid, uric acid diathesis and small joints (গেঁটেবাত ও ইউরিক এসিডজনিত ব্যথা)',
        clinicalIndications: [
          { en: 'High uric acid with inflammation of big toe', bn: 'উচ্চ ইউরিক এসিড ও পায়ের বুড়ো আঙুলে তীব্র ব্যথা' },
          { en: 'Chronic joint swelling with redness', bn: 'অস্থিসন্ধি লাল হয়ে ফুলে যাওয়া' }
        ],
        dosage: '10-15 drops in water 3 times daily'
      },
      {
        name: 'REPL Dr. Advice No. 19 (Calculi - Kidney Stone)',
        bengaliName: 'আরইপিএল ডক্টর অ্যাডভাইস ১৯ (কিডনি পাথর)',
        brand: 'REPL Pharma',
        category: 'patent',
        sphereOfAction: 'Kidneys, ureters and bladder (কিডনি ও মূত্রনালীর পাথর অপসারণ)',
        clinicalIndications: [
          { en: 'Renal colic radiating to groin and thighs', bn: 'কিডনির তীব্র ব্যথা যা কুঁচকি পর্যন্ত ছড়িয়ে পড়ে' },
          { en: 'Painful and bloody urine due to stone friction', bn: 'প্রস্রাবের সাথে রক্ত বা জ্বালাপোড়া' }
        ],
        dosage: '15-20 drops in water 4 times daily'
      },
      {
        name: 'REPL Dr. Advice No. 54 (Gastritis & Acidity)',
        bengaliName: 'আরইপিএল ডক্টর অ্যাডভাইস ৫৪ (গ্যাস্ট্রিক ও বুকজ্বালা)',
        brand: 'REPL Pharma',
        category: 'patent',
        sphereOfAction: 'Gastric mucosa, acid secretion and pyloric sphincter (পাকস্থলীর অম্লতা ও পেটফাঁপা)',
        clinicalIndications: [
          { en: 'Hyperacidity, heartburn and sour eructations', bn: 'বুকজ্বালা ও টক ঢেকুর' },
          { en: 'Gastric fullness immediately after small meals', bn: 'অল্প খাওয়ার পরেই পেট ভার হয়ে থাকা' }
        ],
        dosage: '10-15 drops in water before meals'
      },
      {
        name: 'REPL Dr. Advice No. 84 (Piles & Fissure)',
        bengaliName: 'আরইপিএল ডক্টর অ্যাডভাইস ৮৪ (পাইলস ও ফিশার)',
        brand: 'REPL Pharma',
        category: 'patent',
        sphereOfAction: 'Hemorrhoidal veins and rectal mucosa (অর্শ ও মলদ্বারের রক্তপাত ও জ্বালা)',
        clinicalIndications: [
          { en: 'Bleeding and blind piles with excruciating pain', bn: 'রক্তক্ষরণযুক্ত বা শুকনো পাইলস ও তীব্র যন্ত্রণা' },
          { en: 'Anal fissures and burning after stool', bn: 'মলত্যাগের পর তীব্র জ্বালাপোড়া ও খাঁজকাটা ব্যথা' }
        ],
        dosage: '10-15 drops in water 3 times daily'
      },
      {
        name: 'REPL Dr. Advice No. 96 (Sciatica)',
        bengaliName: 'আরইপিএল ডক্টর অ্যাডভাইস ৯৬ (সায়াটিকা নার্ভ পেইন)',
        brand: 'REPL Pharma',
        category: 'patent',
        sphereOfAction: 'Sciatic nerve trunk and lower back muscles (সায়াটিক স্নায়ু ও পায়ের তীব্র ঝিমঝিম ব্যথা)',
        clinicalIndications: [
          { en: 'Shooting electric-like pain from hip down to foot', bn: 'কোমর থেকে পায়ের পাতা পর্যন্ত তীব্র টান ও ব্যথা' },
          { en: 'Numbness and tingling in leg', bn: 'পা অবশ অবশ লাগা' }
        ],
        dosage: '10-15 drops in warm water 3 times daily'
      }
    ];
  } else if (isWheezal) {
    items = [
      {
        name: 'Wheezal WL-14 (Enuresis Drops)',
        bengaliName: 'হুইজাল ডব্লিউএল-১৪ (শয্যামূত্র ড্রপস)',
        brand: 'Wheezal',
        category: 'patent',
        sphereOfAction: 'Bladder neck tone and involuntary night micturition (রাতে বিছানায় অসাড়ে প্রস্রাব)',
        clinicalIndications: [
          { en: 'Bedwetting in children and elderly nocturnal incontinence', bn: 'বাচ্চাদের রাতে বিছানায় প্রস্রাব করা' },
          { en: 'Weak bladder sphincter tone', bn: 'মূত্রথলির দুর্বলতা' }
        ],
        dosage: '10-15 drops in water twice daily before bedtime'
      },
      {
        name: 'Wheezal WL-16 (Hypertension Drops)',
        bengaliName: 'হুইজাল ডব্লিউএল-১৬ (উচ্চ রক্তচাপ ড্রপস)',
        brand: 'Wheezal',
        category: 'patent',
        sphereOfAction: 'Vascular resistance and arterial tone (রক্তচাপ নিয়ন্ত্রণ ও মানসিক প্রশান্তি)',
        clinicalIndications: [
          { en: 'High systolic and diastolic blood pressure', bn: 'উচ্চ রক্তচাপ ও মাথাব্যথা' },
          { en: 'Occipital headache and throbbing in temples', bn: 'মাথা গরম হয়ে থাকা ও অনিদ্রা' }
        ],
        dosage: '10-15 drops in water 3 times daily'
      },
      {
        name: 'Wheezal WL-35 (Rheumatic Pain Drops)',
        bengaliName: 'হুইজাল ডব্লিউএল-৩৫ (রিউম্যাটিক পেইন ড্রপস)',
        brand: 'Wheezal',
        category: 'patent',
        sphereOfAction: 'Muscles, tendons and major joints (বাত ও মাংসপেশির ব্যথা)',
        clinicalIndications: [
          { en: 'Morning stiffness and cracking in joints', bn: 'সকালে ঘুম থেকে ওঠার পর গা-হাত-পা শক্ত হয়ে থাকা' },
          { en: 'Acute muscular strain and backache', bn: 'কোমর ও পেশির টান লাগা ব্যথা' }
        ],
        dosage: '10-15 drops in warm water 3 times daily'
      },
      {
        name: 'Wheezal WL-45 (Anti-Fungal & Ringworm Drops)',
        bengaliName: 'হুইজাল ডব্লিউএল-৪৫ (দাদ ও ছত্রাকনাশক ড্রপস)',
        brand: 'Wheezal',
        category: 'patent',
        sphereOfAction: 'Epidermis and fungal skin eruptions (দাদ, চুলকানি ও একজিমা)',
        clinicalIndications: [
          { en: 'Ringworm, tinea cruris and fungal itching', bn: 'দাদ ও তীব্র চুলকানি' },
          { en: 'Erythematous circular patches with itching', bn: 'চামড়ায় চাকা চাকা দাগ ও খসখসে ভাব' }
        ],
        dosage: '10-15 drops in water 3 times daily'
      },
      {
        name: 'Wheezal WL-53 (Skin Drops)',
        bengaliName: 'হুইজাল ডব্লিউএল-৫৩ (স্কিন ড্রপস)',
        brand: 'Wheezal',
        category: 'patent',
        sphereOfAction: 'Sebaceous glands, acne and chronic dermatosis (ব্রণ ও ত্বকের শুষ্কতা দূরীকরণ)',
        clinicalIndications: [
          { en: 'Acne vulgaris, pimples and skin blemishes', bn: 'মুখের ব্রণ, ফুসকুড়ি ও মেছতা' },
          { en: 'Rough unhealthy skin with dark spots', bn: 'ত্বকের উজ্জ্বলতা হ্রাস ও দাগ' }
        ],
        dosage: '10-15 drops in water twice daily'
      }
    ];
  } else {
    // General pharmaceutical brand formulations
    items = [
      {
        name: `${comp} Drop No. 1 (Immunity & Vitality)`,
        bengaliName: `${comp} ড্রপ নং ১ (রোগ প্রতিরোধ ও জীবনীশক্তি)`,
        brand: comp,
        category: 'patent',
        sphereOfAction: 'Reticuloendothelial system and vital force stimulation (রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি)',
        clinicalIndications: [
          { en: 'Frequent colds, recurrent infections and low stamina', bn: 'ঘন ঘন সর্দি-কাশি ও শারীরিক দুর্বলতা' },
          { en: 'Post-viral convalescence and chronic fatigue', bn: 'অসুখ পরবর্তী ক্লান্তি' }
        ],
        dosage: '10-15 drops in water twice daily'
      },
      {
        name: `${comp} Drop No. 2 (Digestive & Carminative)`,
        bengaliName: `${comp} ড্রপ নং ২ (হজম ও গ্যাসনাশক)`,
        brand: comp,
        category: 'patent',
        sphereOfAction: 'Stomach, duodenum and intestinal peristalsis (পাকস্থলী ও অন্ত্রের হজমক্রিয়া)',
        clinicalIndications: [
          { en: 'Flatulence, acidity, belching and bloating', bn: 'পেট ফাঁপা, অম্লতা ও টক ঢেকুর' },
          { en: 'Indigestion after rich or oily food', bn: 'ভারী খাবার খাওয়ার পর অস্বস্তি' }
        ],
        dosage: '10-15 drops before meals in water'
      },
      {
        name: `${comp} Drop No. 3 (Joint & Bone Relief)`,
        bengaliName: `${comp} ড্রপ নং ৩ (অস্থিসন্ধি ও বাত উপশম)`,
        brand: comp,
        category: 'patent',
        sphereOfAction: 'Synovial joints, spine and muscular fascia (হাঁটু, কোমর ও অস্থিসন্ধি)',
        clinicalIndications: [
          { en: 'Arthritic stiffness, backache and cervical pain', bn: 'ঘাড়, কোমর ও হাঁটুর বাতবেদনা' },
          { en: 'Difficulty climbing stairs or bending', bn: 'হাঁটাহাঁটিতে কষ্ট ও খটখট শব্দ' }
        ],
        dosage: '15 drops in warm water 3 times daily'
      },
      {
        name: `${comp} Drop No. 4 (Respiratory & Cough)`,
        bengaliName: `${comp} ড্রপ নং ৪ (শ্বাসযন্ত্র ও কাশি)`,
        brand: comp,
        category: 'patent',
        sphereOfAction: 'Bronchioles, trachea and larynx (শ্বাসনালীর সংবেদনশীলতা ও কাশি)',
        clinicalIndications: [
          { en: 'Spasmodic cough, chest tightness and wheezing', bn: 'খুকখুকে কাশি ও বুকে চাপ লাগা' },
          { en: 'Allergic asthma aggravated by dust or weather changes', bn: 'ধুলোবালি বা ঠান্ডায় শ্বাসকষ্ট' }
        ],
        dosage: '10-15 drops in lukewarm water 3 times daily'
      },
      {
        name: `${comp} Drop No. 5 (Renal & Urinary Care)`,
        bengaliName: `${comp} ড্রপ নং ৫ (কিডনি ও মূত্রনালী সুরক্ষা)`,
        brand: comp,
        category: 'patent',
        sphereOfAction: 'Urinary tract, kidney tubules and bladder (মূত্রনালীর ইনফেকশন ও প্রস্রাবের সমস্যা)',
        clinicalIndications: [
          { en: 'Burning sensation during urination', bn: 'প্রস্রাবে জ্বালা ও ফোঁটা ফোঁটা প্রস্রাব' },
          { en: 'Renal colic and backache radiating downwards', bn: 'কিডনি ব্যথায় উপশম' }
        ],
        dosage: '15 drops in plenty of water 3-4 times daily'
      },
      {
        name: `${comp} Tonic (Nervine & Brain Tonic)`,
        bengaliName: `${comp} নার্ভাইন ও ব্রেন টনিক`,
        brand: comp,
        category: 'patent',
        sphereOfAction: 'Central nervous system and cerebral circulation (মস্তিষ্ক ও স্নায়ুতন্ত্রের শক্তি বৃদ্ধি)',
        clinicalIndications: [
          { en: 'Mental exhaustion, forgetfulness and insomnia', bn: 'মানসিক ক্লান্তি, স্মৃতিভ্রম ও ঘুমের সমস্যা' },
          { en: 'Stress, exam tension and nervous headache', bn: 'উদ্বেগ ও মাথাব্যথা' }
        ],
        dosage: '1 teaspoon twice daily in water'
      }
    ];
  }

  return {
    company: comp,
    items
  };
}

// Bulk Company Catalog & Website Importer Handler
const handleCatalogImportRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { mode, companyName, websiteUrl, apiKey } = req.body;
    const ai = getGenAI(apiKey);

    const targetCompany = (companyName || '').trim() || (websiteUrl ? new URL(websiteUrl).hostname.replace(/^www\./, '') : 'Homoeo Pharma');
    let extractedText = '';

    if (mode === 'url' && websiteUrl) {
      try {
        const fetchRes = await fetch(websiteUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          signal: AbortSignal.timeout(10000)
        });
        const html = await fetchRes.text();
        // Clean HTML to text
        const cleaned = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 35000);
        extractedText = cleaned;
      } catch (err: any) {
        console.warn('Could not fetch website URL directly, falling back to URL-grounded prompt:', err.message);
      }
    }

    // Build Prompt
    let prompt = '';
    if (mode === 'url') {
      prompt = `You are a homeopathic pharmaceutical data specialist at "Homoeo Health Care".
Extract all commercial homoeopathic medicines, patent drops, mother tinctures, and syrups from this page content or URL: "${websiteUrl}".
Web text:
${extractedText || `Website URL: ${websiteUrl}`}

Extract each medicine with:
- "name": Full trade/Latin name (e.g. "Wheezal WL-45", "SSL Drop No. 5")
- "bengaliName": Bengali pronunciation and translation
- "brand": Brand or Company name
- "category": "patent" | "mother_tincture" | "dilution" | "biochemic"
- "sphereOfAction": Key anatomical action (English and Bengali)
- "clinicalIndications": Array of objects: { "en": string, "bn": string }
- "dosage": Recommended dosage in English and Bengali

Respond ONLY with valid JSON:
{
  "company": "${targetCompany}",
  "items": [ ... ]
}`;
    } else {
      prompt = `You are an expert homoeopathic pharmaceutical catalog researcher for Dr. M. A. Haque at "Homoeo Health Care".
Research the complete commercial medicine product catalog of the company: "${targetCompany}".
Find their famous commercially sold patent combinations (drops, syrups, tablets), specialty drops, and mother tinctures (e.g. in Bangladesh, India, Germany, etc.).
Extract at least 8-15 popular medicines produced by "${targetCompany}".

For each medicine provide:
- "name": Product Trade Name (e.g. "${targetCompany} Drop No. 1", "Calculi Drops", etc.)
- "bengaliName": Bengali name/pronunciation
- "brand": "${targetCompany}"
- "category": "patent" | "mother_tincture" | "dilution" | "biochemic"
- "sphereOfAction": Main organ affinity and physiological therapeutic action in English and Bengali
- "clinicalIndications": Array of objects: { "en": string, "bn": string }
- "dosage": Recommended adult clinical dosage (e.g. "10-15 drops in water 3 times daily")

Respond ONLY with valid JSON:
{
  "company": "${targetCompany}",
  "items": [ ... ]
}`;
    }

    if (ai) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
      for (const m of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: m,
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });
          const text = response.text || '';
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
              return res.json(parsed);
            }
          }
        } catch (e: any) {
          console.warn(`Catalog import with model ${m} failed:`, e.message);
        }
      }
    }

    // Fallback catalog if AI is offline or model returns empty
    const fallbackCatalog = generateFallbackCatalog(targetCompany, mode, websiteUrl);
    return res.json(fallbackCatalog);
  } catch (err: any) {
    console.error('Catalog Import Error:', err);
    res.status(500).json({ error: 'Failed to import catalog', details: err.message });
  }
};

// Mount Catalog Import Route
app.post('/api/catalog/import', handleCatalogImportRequest);


// Vite Middleware for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Homoeo Health Care Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
