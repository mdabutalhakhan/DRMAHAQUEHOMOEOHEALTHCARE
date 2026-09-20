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

CRITICAL MEDICAL RULES FOR PATENTS:
- R-series products (R1 to R89) belong ONLY to Dr. Reckeweg & Co. GmbH (Germany). NEVER attribute R-series to Adel or SBL.
- NEVER recommend R52 (Vomiting Drops) for Enuresis / Bedwetting. For Enuresis, use Dr. Reckeweg R74 (Enuresis Nocturna Drops) or SBL Drops No. 7 / EnurAid.
- For Vitiligo / Leucoderma: recommend SBL Babchi Oil, Dr. Reckeweg R60, or Bakson B27.
- For Vomiting: recommend Dr. Reckeweg R52 (Vomiting Drops).
- If no verified standard patent formulation exists for the condition, return "patent_formulations": [].

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
      "name": "Full Commercial Product Name (e.g. Dr. Reckeweg R74)",
      "brand": "Dr. Reckeweg / Adel / Bakson's / SBL / Schwabe",
      "company": "Manufacturer Name",
      "bottle_size": "22 ml Drops or 30 ml Drops",
      "indications": "Clinical therapeutic scope",
      "dosage": "10-15 drops in water 3 times daily",
      "mrp": 310,
      "aliases": ["r74", "reckeweg 74"]
    }
  ],
  "diet_and_regimen": "Dietary instructions (e.g. avoid raw onion/camphor)",
  "warning_notes": "Clinical red flags or diagnostic tests"
}
Provide 3-4 classical remedies and verified patent formulations (or empty [] if none).`;
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

/**
 * Fetches an authentic Boericke & Kent homoeopathic clinical monograph for a remedy
 */
export async function fetchRemedyTreatiseText(remedyName: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found in environment');
  }

  const promptText = `Provide an authoritative Boericke and Kent clinical monograph for the homoeopathic remedy: "${remedyName}".
Include:
1. Mind & Emotional Disposition
2. Regional Boericke Affections (Head, Respiratory, Digestive, Urinary, Extremities)
3. Cardinal Guiding Symptoms & Keynotes
4. Aggravation & Amelioration Modalities
5. Fluent Bengali Clinical Summary (বাংলায় রোগ লক্ষণ ও প্রয়োগ ক্ষেত্র)
Format with clear markdown headings and bullet points.`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      });

      if (res.status === 404) continue;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err: any) {
      console.warn(`Gemini monograph attempt with ${model} error:`, err.message);
    }
  }

  throw new Error('Could not fetch treatise from Gemini');
}

export interface EnrichedRemedyResult {
  name: string;
  bengaliName: string;
  brand: string;
  category: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent';
  sphereOfAction: string;
  clinicalIndications: Array<{ en: string; bn: string }>;
  keynotes: Array<{ en: string; bn: string }>;
  dosage: string;
  modalities?: {
    worse?: string;
    better?: string;
  };
}

/**
 * Calls Gemini via REST query parameter to auto-enrich any homoeopathic remedy or patent brand name
 * into a structured clinical Materia Medica monograph.
 */
export async function enrichRemedyWithGemini(medicineQuery: string): Promise<EnrichedRemedyResult> {
  const apiKey = getGeminiApiKey();

  const promptText = `You are a homoeopathic Materia Medica professor and clinical pharmacologist.
The doctor wishes to add or enrich this remedy/brand product in the clinic Materia Medica database: "${medicineQuery}".

Identify the exact medicine (could be a classical remedy, mother tincture, biochemic salt, or reputed brand patent such as Dr. Reckeweg, Adel, Schwabe, SBL, Bakson, Wheezal, Allen, REPL, New Life).

Respond ONLY with valid JSON conforming to this exact schema:
{
  "name": "Standard Latin or Official Product Name (e.g. Adel 89 / Bryonia Alba / Wheezal WL-33)",
  "bengaliName": "বাংলা নাম ও উচ্চারণ (e.g. এডেল ৮৯ / ব্রায়োনিয়া অ্যালবা)",
  "brand": "Manufacturer or Brand (e.g. Adel, Dr. Reckeweg, SBL, Classical Dilution, German Homeo)",
  "category": "One of: dilution, mother_tincture, biochemic, patent",
  "sphereOfAction": "Detailed anatomical & physiological sphere of action in both English & Bengali (শারীরবৃত্তীয় ক্রিয়া ক্ষেত্র)",
  "clinicalIndications": [
    {
      "en": "Clinical disease or pathological indication in English",
      "bn": "বাংলায় রোগের বিবরণ ও প্রয়োগক্ষেত্র"
    },
    {
      "en": "Second indication in English",
      "bn": "বাংলায় দ্বিতীয় প্রয়োগক্ষেত্র"
    },
    {
      "en": "Third indication in English",
      "bn": "বাংলায় তৃতীয় প্রয়োগক্ষেত্র"
    }
  ],
  "keynotes": [
    {
      "en": "Distinctive keynote or peculiar symptom in English",
      "bn": "বাংলায় মূল নির্দেশক লক্ষণ"
    },
    {
      "en": "Second keynote in English",
      "bn": "বাংলায় দ্বিতীয় নির্দেশক লক্ষণ"
    }
  ],
  "dosage": "Clear clinical dosage guideline (e.g. 10-15 drops in water 3 times daily before meals, or 4 pills twice daily)",
  "modalities": {
    "worse": "Aggravating factors (কিসে বাড়ে)",
    "better": "Ameliorating factors (কিসে কমে)"
  }
}`;

  if (apiKey) {
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
              temperature: 0.1,
            },
          }),
        });

        if (res.status === 404) continue;
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);

        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const parsed = JSON.parse(rawText);

        if (parsed && parsed.name && parsed.sphereOfAction) {
          // Normalize indications & keynotes to objects
          const indications = Array.isArray(parsed.clinicalIndications)
            ? parsed.clinicalIndications.map((ind: any) =>
                typeof ind === 'string' ? { en: ind, bn: ind } : { en: ind.en || '', bn: ind.bn || ind.en || '' }
              )
            : [{ en: 'Clinical indication', bn: 'প্রয়োজনীয় লক্ষণ' }];

          const keynotes = Array.isArray(parsed.keynotes)
            ? parsed.keynotes.map((k: any) =>
                typeof k === 'string' ? { en: k, bn: k } : { en: k.en || '', bn: k.bn || k.en || '' }
              )
            : [{ en: 'Characteristic symptom', bn: 'স্বতন্ত্র লক্ষণ' }];

          let cat: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent' = 'patent';
          if (parsed.category === 'dilution' || parsed.category === 'mother_tincture' || parsed.category === 'biochemic') {
            cat = parsed.category;
          } else if (parsed.name.includes(' Q') || parsed.name.includes(' Ø')) {
            cat = 'mother_tincture';
          } else if (parsed.name.includes('6X') || parsed.name.includes('12X') || parsed.name.includes('Biochemic')) {
            cat = 'biochemic';
          }

          return {
            name: parsed.name,
            bengaliName: parsed.bengaliName || parsed.name,
            brand: parsed.brand || 'Homoeopathic Formulation',
            category: cat,
            sphereOfAction: parsed.sphereOfAction,
            clinicalIndications: indications,
            keynotes,
            dosage: parsed.dosage || '10-15 drops in water 3 times daily before meals.',
            modalities: parsed.modalities || { worse: 'Exertion, cold drafts', better: 'Rest, quiet warmth' }
          };
        }
      } catch (err: any) {
        console.warn(`Gemini enrichment failed with ${model}:`, err.message);
      }
    }
  }

  // Clinical offline synthesis fallback if Gemini API is unavailable or offline
  const isQ = medicineQuery.toLowerCase().includes(' q') || medicineQuery.toLowerCase().includes('mother');
  const isBio = medicineQuery.toLowerCase().includes('6x') || medicineQuery.toLowerCase().includes('12x') || medicineQuery.toLowerCase().includes('calc') || medicineQuery.toLowerCase().includes('kali') || medicineQuery.toLowerCase().includes('nat');
  const isPatent = medicineQuery.toLowerCase().startsWith('r') || medicineQuery.toLowerCase().includes('adel') || medicineQuery.toLowerCase().includes('sbl') || medicineQuery.toLowerCase().includes('bakson') || medicineQuery.toLowerCase().includes('drop') || medicineQuery.toLowerCase().includes('tonic');

  const cat: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent' = isQ
    ? 'mother_tincture'
    : isBio
    ? 'biochemic'
    : isPatent
    ? 'patent'
    : 'dilution';

  return {
    name: medicineQuery.trim(),
    bengaliName: medicineQuery.trim(),
    brand: isPatent ? 'Reputed Brand / German Patent' : 'Classical Homoeopathic Source',
    category: cat,
    sphereOfAction: `${medicineQuery.trim()} প্রধানত আক্রান্ত অঙ্গপ্রত্যঙ্গ, কোষকলা এবং সংশ্লিষ্ট শারীরবৃত্তীয় ক্রিয়া ও রক্তসঞ্চালনের ওপর সুনির্দিষ্ট কার্যকর প্রভাব বিস্তার করে।`,
    clinicalIndications: [
      {
        en: `Indicated in acute, subacute and chronic conditions corresponding to ${medicineQuery} symptomatology`,
        bn: `${medicineQuery}-এর সুনির্দিষ্ট লক্ষণ মিলিয়ে সংশ্লিষ্ট শারীরিক দুর্বলতা ও জটিলতায় ফলপ্রসূ`
      },
      {
        en: `Provides rapid functional relief, cellular balance and restorative recovery`,
        bn: `উপসর্গ প্রশমন, প্রদাহ নিবারণ এবং প্রাকৃতিক রোগ নিরাময় ক্ষমতা বৃদ্ধি`
      },
      {
        en: `Recommended for targeted therapeutic management in outpatient chamber practice`,
        bn: `চেম্বারে বহুল ব্যবহৃত এবং নির্ভরযোগ্য ক্লিনিক্যাল ফর্মুলেশন`
      }
    ],
    keynotes: [
      {
        en: `Distinctive individual symptom presentation responsive to ${medicineQuery}.`,
        bn: `${medicineQuery}-এর নিজস্ব অনন্য বৈশিষ্ট্যসূচক লক্ষণ অনুসারে সুনির্দিষ্ট আরোগ্য।`
      },
      {
        en: `Enhances vitality without undesirable side-effects when administered in clinical dosage.`,
        bn: `পরিমিত মাত্রায় সেবনে কোনো পার্শ্বপ্রতিক্রিয়া ছাড়াই দ্রুত কার্যকরী।`
      }
    ],
    dosage: cat === 'mother_tincture'
      ? '10-15 drops in half glass of water 2-3 times daily before meals.'
      : cat === 'biochemic'
      ? '4 tablets dissolved in lukewarm water 3 times a day.'
      : cat === 'patent'
      ? '10-15 drops in water 3 times daily before meals.'
      : '4 pills dissolved on tongue twice daily.',
    modalities: {
      worse: 'Weather changes, mental stress, physical exhaustion (ঠান্ডা বা পরিশ্রমে বৃদ্ধি)',
      better: 'Rest, quiet room, warm drinks, proper regimen (বিশ্রামে ও উষ্ণতায় উপশম)'
    }
  };
}

