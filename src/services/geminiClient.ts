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

export const CANDIDATE_MODELS = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
export const STABLE_GEMINI_MODEL = CANDIDATE_MODELS[0];
export const FALLBACK_GEMINI_MODEL = CANDIDATE_MODELS[1];

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
 * Direct Frontend Gemini Client REST Call with Resilient Multi-Model Fallback Cascade.
 * FIXES GEMINI 404 "Requested entity was not found":
 * - Iterates through CANDIDATE_MODELS in sequence: ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest']
 * - If a model returns 404, automatically cascades to the next candidate model without throwing.
 * - Passes the API key strictly as a URL query parameter: ?key=${apiKey} (strictly NO Authorization header to prevent OAuth 401).
 */
export async function callGeminiAPI(
  symptoms: string,
  modalities?: string,
  system?: string
): Promise<ClinicalGeminiConsultResponse> {
  const apiKey = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    ''
  ).trim();

  if (!apiKey) {
    throw new Error('Gemini API Key missing in environment');
  }

  const promptText = buildClinicalConsultPrompt(symptoms, modalities, system);

  let lastError: any = null;
  let parsedResult: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });

      if (res.status === 404) {
        console.warn(`Model ${model} not found (404), trying next model...`);
        continue;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || `Error ${res.status}`);
      }

      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      parsedResult = JSON.parse(rawText);
      if (parsedResult) break; // Successfully parsed!
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini attempt with ${model} failed:`, err.message);
    }
  }

  if (!parsedResult) {
    throw lastError || new Error('Unable to connect to Gemini models');
  }

  return parsedResult as ClinicalGeminiConsultResponse;
}

export const callGeminiDirectlyFromClient = callGeminiAPI;
