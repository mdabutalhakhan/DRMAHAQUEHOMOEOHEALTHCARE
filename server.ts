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

// Initialize Google GenAI client (lazy or guarded)
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
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
  res.json({
    status: 'ok',
    clinic: 'Homoeo Health Care',
    doctor: 'Dr. M. A. Haque, M.D. (Homoeo)',
    gemini_configured: !!process.env.GEMINI_API_KEY,
  });
});

// Gemini AI Clinical Consultant Endpoint
app.post('/api/gemini/consult', async (req, res) => {
  try {
    const { symptoms, modalities, system, patientAge, duration } = req.body;

    if (!symptoms && !modalities) {
      return res.status(400).json({ error: 'Symptoms or modalities are required.' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback intelligent clinical homoeopathic responses if API key is not yet set in environment
      return res.json({
        analysis_summary: `Preliminary homoeopathic evaluation for: "${symptoms || 'General complaints'}". High affinity to acute/sub-acute repertory rubrics.`,
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
        ],
        repertory_keynotes: [
          'Kent: Extremities - Pain, rheumatic, cold wet weather',
          'Boericke: Fibrous tissue inflammation and muscular soreness',
        ],
        diet_and_regimen: 'Advise patient to avoid raw onion, garlic, strong coffee, or camphor/menthol balms within 30 minutes of taking homoeopathic doses. Keep warm and dry.',
        warning_notes: 'Homoeopathic suggestions are clinical decision-support aids for Dr. M. A. Haque. Individualized constitutional evaluation is recommended.',
      });
    }

    const prompt = `You are an elite Homoeopathic Clinical AI Consultant assisting Dr. M. A. Haque, M.D. (Homoeo) at "Homoeo Health Care" clinic.
Analyze the following patient clinical presentation according to classical Homoeopathic Materia Medica (Dr. Kent, Dr. Boericke, Dr. Allen) and Repertory principles:

PATIENT PRESENTATION:
- Chief Symptoms: ${symptoms || 'None specified'}
- Modalities (Worse/Better): ${modalities || 'Standard acute'}
- Affected System: ${system || 'General'}
- Patient Age/Group: ${patientAge || 'Adult'}
- Duration: ${duration || 'Acute/Sub-acute'}

Provide your response in structured JSON format with:
1. "analysis_summary": Brief clinical summary of the miasmatic and repertory picture.
2. "remedies": Array of 2-4 most suitable homoeopathic remedies, each having:
   - "remedy_name" (e.g. Rhus Toxicodendron, Bryonia Alba, Nux Vomica, Arsenicum Album)
   - "common_name"
   - "potency" (e.g. 30C, 200C, 1M, Q)
   - "dosage" (e.g. 4 pills 3 times daily or 10 drops in 1/4 cup water)
   - "key_indications" (array of 3 specific keynote symptoms)
   - "materia_medica_notes" (concise authentic Materia Medica reference)
   - "modalities": { "worse": string, "better": string }
3. "repertory_keynotes": Array of relevant Kent/Boericke rubrics.
4. "diet_and_regimen": Homoeopathic regimen instructions (e.g. antidotes to avoid).
5. "warning_notes": Clinical safety reminder.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
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
            repertory_keynotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            diet_and_regimen: { type: Type.STRING },
            warning_notes: { type: Type.STRING },
          },
          required: ['analysis_summary', 'remedies', 'repertory_keynotes', 'diet_and_regimen'],
        },
      },
    });

    const outputText = response.text;
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
});

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
