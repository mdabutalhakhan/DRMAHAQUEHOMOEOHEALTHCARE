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
export const STABLE_GEMINI_MODEL = 'gemini-1.5-flash';

/**
 * Builds a concise, token-optimized clinical homoeopathic consultation prompt.
 * Pruned to prevent token overflows while preserving rich clinical precision.
 */
export function buildClinicalConsultPrompt(
  symptoms: string,
  modalities?: string,
  system?: string
): string {
  return `You are a homeopathic clinical decision assistant for Dr. M. A. Haque, M.D. (Homoeo) at "Homoeo Health Care".
Analyze the patient presentation (English or Bengali).

Patient Symptoms: ${symptoms.trim()}
${modalities ? `Modalities: ${modalities.trim()}` : ''}
${system ? `Affected System: ${system.trim()}` : ''}

Respond ONLY with valid JSON conforming to:
{
  "analysis_summary": "Concise miasmatic and clinical summary in 1-2 sentences",
  "remedies": [
    {
      "remedy_name": "Remedy Name (e.g. Rhododendron)",
      "common_name": "Common English Name",
      "potency": "30C or 200C",
      "dosage": "4 pills twice daily",
      "key_indications": ["Keynote 1", "Keynote 2"],
      "materia_medica_notes": "Boericke/Kent keynote",
      "modalities": { "worse": "aggravating factors", "better": "ameliorating factors" }
    }
  ],
  "patent_formulations": [
    {
      "name": "Full Commercial Product Name (e.g. Dr. Reckeweg R16)",
      "brand": "Brand (Dr. Reckeweg, Bakson's, SBL, Adel, Wheezal, Schwabe, Medisynth)",
      "company": "Manufacturer Name",
      "bottle_size": "22 ml Drops or 115 ml Syrup",
      "indications": "Clinical therapeutic scope",
      "dosage": "10-15 drops in water 3 times daily",
      "mrp": 250,
      "aliases": ["r16", "reckeweg 16"]
    }
  ],
  "diet_and_regimen": "Dietary instructions (e.g. avoid raw onion/camphor)",
  "warning_notes": "Clinical red flags or diagnostic tests"
}
Provide 3-4 classical remedies and 4-6 patent formulations.`;
}

/**
 * Direct Frontend Gemini Client REST Call.
 * Uses candidate models cascade:
 * https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}
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
    throw new Error('Gemini API key not found in environment');
  }

  const promptText = buildClinicalConsultPrompt(symptoms, modalities, system);

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
        console.warn(`Model ${model} returned 404, attempting alternative model...`);
        continue;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || `HTTP ${res.status}`);
      }

      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(rawText);
      if (parsed && (parsed.remedies || parsed.patent_formulations)) {
        return parsed as ClinicalGeminiConsultResponse;
      }
    } catch (err: any) {
      console.warn(`Gemini attempt with ${model} error:`, err.message);
    }
  }

  throw new Error('Gemini API service unavailable or invalid response structure');
}

export const callGeminiDirectlyFromClient = callGeminiAPI;
