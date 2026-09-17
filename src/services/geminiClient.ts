import { GoogleGenAI, Type } from '@google/genai';

export interface ClinicalGeminiRemedy {
  remedy_name: string;
  common_name?: string;
  potency: string;
  dosage: string;
  key_indications: string[];
  materia_medica_notes?: string;
  modalities: {
    worse: string;
    better: string;
  };
}

export interface ClinicalGeminiPatent {
  name: string;
  brand: string;
  company: string;
  bottle_size?: string;
  bottleSize?: string;
  indications: string;
  dosage: string;
  mrp: number;
  aliases?: string[];
}

export interface ClinicalGeminiConsultResponse {
  analysis_summary: string;
  remedies: ClinicalGeminiRemedy[];
  patent_formulations: ClinicalGeminiPatent[];
  repertory_keynotes?: string[];
  diet_and_regimen: string;
  warning_notes?: string;
}

/**
 * Resolves API key according to strict environment priority:
 * 1. import.meta.env.VITE_GEMINI_API_KEY
 * 2. process.env.VITE_GEMINI_API_KEY
 * 3. process.env.GEMINI_API_KEY
 */
export function getGeminiApiKey(): string {
  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ||
    '';
  return apiKey;
}

export const STABLE_GEMINI_MODEL = 'gemini-3.6-flash';
export const FALLBACK_GEMINI_MODEL = 'gemini-3.8-flash';

/**
 * Builds the authoritative clinical prompt for Dr. M. A. Haque, M.D. (Homoeo)
 */
export function buildClinicalConsultPrompt(symptoms: string, modalities?: string, system?: string): string {
  return `You are an expert homoeopathic consultant assisting Dr. M. A. Haque, M.D. (Homoeo) at "Homoeo Health Care" clinic.
When evaluating the patient's symptoms, provide 4 Classical Simillimum remedies (Kent/Boericke) AND at least 5-6 premier commercial patent combinations specifically from Bakson's, Dr. Reckeweg (Germany), SBL, Adel Pekana (Germany), Wheezal, Schwabe, Medisynth, Allen, and Lord's with exact commercial names and bottle sizes.

PATIENT PRESENTATION:
- Chief Symptoms: ${symptoms}
- Modalities: ${modalities || 'Standard acute/chronic homoeopathic modalities'}
- Affected System: ${system || 'General / Multi-system'}

Provide your response in structured JSON format with:
1. "analysis_summary": Brief clinical summary of the miasmatic, pathological, and therapeutic picture.
2. "remedies": Array of exactly 4 Classical Simillimum homoeopathic remedies (Kent/Boericke), each having:
   - "remedy_name" (e.g. Berberis Vulgaris, Rhus Toxicodendron, Bryonia Alba, Lycopodium Clavatum, Nux Vomica)
   - "common_name"
   - "potency" (e.g. 30C, 200C, 1M, Q)
   - "dosage" (e.g. 4 pills 3 times daily or 10-15 drops in water)
   - "key_indications" (array of 3 specific keynote symptoms)
   - "materia_medica_notes" (concise authentic Materia Medica reference)
   - "modalities": { "worse": string, "better": string }
3. "patent_formulations": Array of at least 5-6 renowned commercial patent combinations from Bakson's, Dr. Reckeweg, SBL, Adel Pekana, Wheezal, Schwabe, Medisynth, Allen, and Lord's, each having:
   - "name": full commercial product name
   - "brand": exact brand ("Bakson's", "Dr. Reckeweg", "SBL", "Adel", "Wheezal", "Schwabe", "Medisynth", "Allen", "Lord's")
   - "company": manufacturer name
   - "bottle_size": package form (e.g. "30 ml Drops", "22 ml Drops", "115 ml Syrup", "20g Tablets")
   - "indications": clinical indication and therapeutic scope
   - "dosage": recommended dosage
   - "mrp": approximate MRP in INR (number)
   - "aliases": array of 3-4 lowercase search keywords or brand codes (e.g. ["calculi aid", "b16", "bakson calculi"])
4. "repertory_keynotes": Array of relevant Kent/Boericke rubrics.
5. "diet_and_regimen": Homoeopathic regimen instructions (e.g. hydration, specific foods to avoid, antidotes).
6. "warning_notes": Clinical safety and investigation advice.`;
}

/**
 * Direct Frontend Gemini Client Call Fallback.
 * Executes when /api/consult serverless route returns 500 or is unavailable.
 */
export async function callGeminiDirectlyFromClient(
  symptoms: string,
  modalities?: string,
  system?: string
): Promise<ClinicalGeminiConsultResponse> {
  // 1. Read existing key directly
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY not found in client environment.');
  }

  const prompt = buildClinicalConsultPrompt(symptoms, modalities, system);

  // Attempt using @google/genai SDK with stable gemini-2.5-flash / gemini-1.5-flash
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Primary: gemini-3.6-flash, Secondary: gemini-3.8-flash
    let responseText = '';
    const modelsToTry = [STABLE_GEMINI_MODEL, FALLBACK_GEMINI_MODEL];
    for (const m of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = response.text || '';
        if (responseText) break;
      } catch (err: any) {
        console.warn(`Model ${m} call failed:`, err.message || err);
      }
    }

    if (responseText) {
      const parsed = JSON.parse(responseText);
      if (parsed && parsed.remedies && parsed.patent_formulations) {
        return parsed as ClinicalGeminiConsultResponse;
      }
    }
  } catch (sdkErr: any) {
    console.warn('SDK direct call had an issue, attempting direct Google GenAI REST call:', sdkErr);
  }

  // Resilient Direct REST API Fallback (using fetch directly from browser)
  const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${STABLE_GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const restPayload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  };

  const restRes = await fetch(restUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(restPayload),
  });

  if (!restRes.ok) {
    // Try fallback model on REST as well
    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${FALLBACK_GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const fallbackRes = await fetch(fallbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restPayload),
    });

    if (!fallbackRes.ok) {
      const errBody = await fallbackRes.text();
      throw new Error(`Gemini direct REST error (${fallbackRes.status}): ${errBody.slice(0, 150)}`);
    }

    const fallbackData = await fallbackRes.json();
    const text = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return JSON.parse(text) as ClinicalGeminiConsultResponse;
    }
  }

  const data = await restRes.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Empty response received from Gemini direct REST call');
  }

  return JSON.parse(rawText) as ClinicalGeminiConsultResponse;
}
