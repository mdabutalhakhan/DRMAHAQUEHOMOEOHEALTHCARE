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
When evaluating symptoms, provide exactly 4 Classical Simillimum remedies (Kent/Boericke) AND at least 5-6 renowned patent combinations from Bakson's, Dr. Reckeweg (Germany), SBL, Adel (Germany), Wheezal, Schwabe, Medisynth, and Allen with exact commercial brand names.

PATIENT PRESENTATION:
- Chief Symptoms: ${symptoms || 'None'}
- Modalities: ${modalities || 'Standard acute'}
- Affected System: ${system || 'General'}
- Patient Age/Group: ${patientAge || 'Adult'}
- Duration: ${duration || 'Acute/Sub-acute'}

Provide output in JSON format with:
1. "analysis_summary": string
2. "remedies": array of 4 items with remedy_name, common_name, potency, dosage, key_indications (string[]), materia_medica_notes, modalities { worse, better }
3. "patent_formulations": array of 5-6 items with name, brand, company, bottle_size, indications, dosage, mrp (number), aliases (string[])
4. "repertory_keynotes": string[]
5. "diet_and_regimen": string
6. "warning_notes": string`;

    // 2. Ensure modern stable model: gemini-3.6-flash
    let outputText = '';
    const modelsToTry = ['gemini-3.6-flash', 'gemini-3.8-flash'];
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
