import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  // 1. Read existing VITE key directly
  const apiKey =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    '';

  // Support CORS for serverless invocation
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symptoms, modalities, system, patientAge, duration } = req.body || {};

  if (!symptoms && !modalities) {
    return res.status(400).json({ error: 'Symptoms or modalities are required' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'VITE_GEMINI_API_KEY or GEMINI_API_KEY not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a master homoeopathic clinician assisting Dr. M. A. Haque, M.D. (Homoeo) at "Homoeo Health Care" clinic.
When evaluating symptoms, provide exactly 4 Classical Simillimum remedies (Kent/Boericke) AND verified homoeopathic patent combinations from Bakson's, Dr. Reckeweg (Germany), SBL, Adel (Germany), or Schwabe.

CRITICAL MEDICAL RULES FOR PATENT FORMULATIONS:
- R-series products (R1 to R89) belong EXCLUSIVELY to Dr. Reckeweg & Co. GmbH (Germany). NEVER label Adel, SBL, or Bakson products with R-numbers.
- NEVER recommend Dr. Reckeweg R52 (which is specifically Vomiting drops) for Enuresis, Bedwetting, or Nocturnal incontinence. For Enuresis, the only valid R-series is Dr. Reckeweg R74 (Enuresis Nocturna Drops), or SBL Drops No. 7 / EnurAid.
- For Vitiligo / Leucoderma: recommend SBL Babchi Oil / Psoralea Corylifolia, Dr. Reckeweg R60, or Bakson B27.
- For Vomiting / Nausea / Motion Sickness: recommend Dr. Reckeweg R52 (Vomiting Drops), Bakson B33, or Dr. Reckeweg R29.
- If no genuine verified patent exists for the condition, return an empty array for patent_formulations.

PATIENT PRESENTATION:
- Chief Symptoms: ${symptoms || 'None'}
- Modalities: ${modalities || 'Standard acute'}
- Affected System: ${system || 'General'}
- Patient Age/Group: ${patientAge || 'Adult'}
- Duration: ${duration || 'Acute/Sub-acute'}

Provide output in JSON format with:
1. "analysis_summary": string
2. "remedies": array of 4 items with remedy_name, common_name, potency, dosage, key_indications (string[]), materia_medica_notes, modalities { worse, better }
3. "patent_formulations": array of verified items (or empty [] if none) with name, brand, company, bottle_size, indications, dosage, mrp (number), aliases (string[])
4. "repertory_keynotes": string[]
5. "diet_and_regimen": string
6. "warning_notes": string`;

    // 2. Ensure official model: gemini-1.5-flash
    let outputText = '';
    const modelsToTry = ['gemini-1.5-flash'];
    for (const m of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        outputText = response.text || '';
        if (outputText) break;
      } catch (e: any) {
        console.warn(`Model ${m} failed in serverless handler:`, e.message || e);
      }
    }

    if (outputText) {
      const parsed = JSON.parse(outputText);
      return res.status(200).json(parsed);
    }

    return res.status(500).json({ error: 'No output received from Gemini model' });
  } catch (err: any) {
    console.error('Serverless Gemini Consult Error:', err);
    return res.status(500).json({
      error: 'Failed to process clinical AI consultation in serverless function',
      details: err.message,
    });
  }
}
