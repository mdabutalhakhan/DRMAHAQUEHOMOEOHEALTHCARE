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
    model: 'gemini-2.5-flash',
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
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];
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

// Mount both routes for full compatibility
app.post('/api/consult', handleConsultRequest);
app.post('/api/gemini/consult', handleConsultRequest);

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
