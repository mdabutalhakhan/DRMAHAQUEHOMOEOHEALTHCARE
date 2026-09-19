/**
 * Groq Cloud AI Client (LPU Inference Engine)
 * High-speed OpenAI-compatible completions endpoint with automatic model fallback.
 *
 * Endpoint: https://api.groq.com/openai/v1/chat/completions
 * Primary Model: openai/gpt-oss-20b
 * Fallback Models: openai/gpt-oss-120b, llama-3.3-70b-versatile
 */

export interface ClinicalGroqRemedy {
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

export interface ClinicalGroqPatent {
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

export interface ClinicalGroqConsultResponse {
  analysis_summary: string;
  remedies: ClinicalGroqRemedy[];
  patent_formulations: ClinicalGroqPatent[];
  repertory_keynotes?: string[];
  diet_and_regimen?: string;
  warning_notes?: string;
  raw_text?: string;
  model_used?: string;
}

export const GROQ_MODELS = {
  PRIMARY: 'openai/gpt-oss-20b',
  FALLBACK_1: 'openai/gpt-oss-120b',
  FALLBACK_2: 'llama-3.3-70b-versatile',
};

export const DEFAULT_GROQ_MODEL = GROQ_MODELS.PRIMARY;

export const FALLBACK_GROQ_MODELS = [
  GROQ_MODELS.PRIMARY,
  GROQ_MODELS.FALLBACK_1,
  GROQ_MODELS.FALLBACK_2,
];

/**
 * Retrieves the Groq API Key with the following precedence:
 * 1. localStorage ('groq_api_key')
 * 2. import.meta.env.VITE_GROQ_API_KEY
 * 3. process.env.VITE_GROQ_API_KEY
 * 4. process.env.GROQ_API_KEY
 */
export function getGroqApiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('groq_api_key');
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
  }

  const envKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GROQ_API_KEY) ||
    '';

  return (envKey || '').trim();
}

/**
 * Checks whether a valid Groq API key is currently present.
 */
export function hasGroqApiKey(): boolean {
  return getGroqApiKey().length > 0;
}

/**
 * Persists the Groq API key to localStorage.
 */
export function setGroqApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('groq_api_key', key.trim());
    } else {
      localStorage.removeItem('groq_api_key');
    }
  }
}

/**
 * Builds the structured prompt instructing Llama 3.1 to return
 * clinical differential analysis and homeopathic remedy options.
 */
export function buildGroqConsultQuery(
  symptoms: string,
  modalities?: string,
  system?: string
): string {
  return `Patient Presentation:
- Symptoms: ${symptoms.trim()}
${modalities ? `- Modalities (Worse/Better): ${modalities.trim()}` : ''}
${system ? `- Affected Anatomical System: ${system.trim()}` : ''}

Please analyze this clinical case thoroughly. Format your response strictly as valid JSON adhering to the following structure:
{
  "analysis_summary": "Concise miasmatic, pathological, and totality synthesis in bilingual English & Bengali (১-২ বাক্য)",
  "remedies": [
    {
      "remedy_name": "Standard Latin Name (e.g. Lycopodium Clavatum)",
      "common_name": "Common English Name (e.g. Club Moss)",
      "potency": "30C or 200C",
      "dosage": "4 globules twice daily in water",
      "key_indications": [
        "Guiding keynote 1 in English / Bengali",
        "Guiding keynote 2"
      ],
      "materia_medica_notes": "Boericke & Kent clinical keynotes and guiding symptoms",
      "modalities": {
        "worse": "Aggravating factors (কিসে বাড়ে)",
        "better": "Ameliorating factors (কিসে কমে)"
      }
    }
  ],
  "patent_formulations": [
    {
      "name": "Full Commercial Product Name (e.g. Dr. Reckeweg R16 / Adel 89 / Bakson Rheum Aid)",
      "brand": "Dr. Reckeweg / Adel / Bakson's / SBL / Wheezal / Schwabe / Medisynth",
      "company": "Manufacturer Company Name",
      "bottle_size": "22 ml Drops or 115 ml Syrup",
      "indications": "Clinical scope & indication in English & Bengali",
      "dosage": "10-15 drops in water 3 times daily before meals",
      "mrp": 250,
      "aliases": ["r16", "reckeweg"]
    }
  ],
  "diet_and_regimen": "Dietary instructions (e.g. avoid raw onion/garlic/camphor during homeopathic treatment)",
  "warning_notes": "Clinical red flags and diagnostic tests. Note: Final clinical decision rests with the attending homeopathic physician."
}

Provide 3-4 classical remedies and 4-6 renowned patent formulations. Return ONLY valid JSON.`;
}

/**
 * Invokes Groq's OpenAI-compatible Chat Completions API with automatic fallback.
 * Primary model: openai/gpt-oss-20b
 * Fallback models: openai/gpt-oss-120b, llama-3.3-70b-versatile
 */
export async function callGroqAPI(
  userQuery: string,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    apiKey?: string;
  }
): Promise<ClinicalGroqConsultResponse> {
  const apiKey = (options?.apiKey || getGroqApiKey()).trim();

  if (!apiKey) {
    throw new Error('Please enter your free Groq API Key to enable instant AI Clinical Consultations.');
  }

  const initialModel = options?.model || DEFAULT_GROQ_MODEL;
  const candidateModels = [
    initialModel,
    ...FALLBACK_GROQ_MODELS.filter((m) => m !== initialModel),
  ];

  const temperature = typeof options?.temperature === 'number' ? options.temperature : 0.3;
  const max_tokens = typeof options?.max_tokens === 'number' ? options.max_tokens : 1024;

  let rawContent = '';
  let modelUsed = initialModel;
  let lastError: Error | null = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const currentModel = candidateModels[i];
    const isLastModel = i === candidateModels.length - 1;

    const payload = {
      model: currentModel,
      messages: [
        {
          role: 'system',
          content:
            "You are Dr. M. A. Haque's expert AI Homeopathic Consultant. Provide clinical repertorization, differential remedies, potency suggestions, and modalities in clear bilingual (Bengali and English). Always state that the final decision rests with the attending physician.",
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
      temperature,
      max_tokens,
    };

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        let errorObj: any = null;
        try {
          errorObj = await response.json();
          if (errorObj?.error?.message) {
            errorDetail = errorObj.error.message;
          }
        } catch {
          // ignore
        }

        if (response.status === 401) {
          throw new Error(`Invalid Groq API Key. Please verify your gsk_... key. (${errorDetail})`);
        }
        if (response.status === 429) {
          throw new Error(`Groq rate limit reached. Please wait a moment before retrying. (${errorDetail})`);
        }

        // Check for 404, model_not_found, deprecated, or decommissioned
        const isModelNotFound =
          response.status === 404 ||
          errorObj?.error?.code === 'model_not_found' ||
          errorDetail.toLowerCase().includes('model_not_found') ||
          errorDetail.toLowerCase().includes('does not exist') ||
          errorDetail.toLowerCase().includes('not found') ||
          errorDetail.toLowerCase().includes('deprecated') ||
          errorDetail.toLowerCase().includes('decommissioned');

        if (isModelNotFound && !isLastModel) {
          console.warn(
            `Groq model '${currentModel}' not available (${errorDetail}). Automatically retrying with fallback model '${candidateModels[i + 1]}'...'`
          );
          lastError = new Error(`Groq model '${currentModel}' error: ${errorDetail}`);
          continue;
        }

        throw new Error(`Groq API error (${currentModel}): ${errorDetail}`);
      }

      const data = await response.json();
      rawContent = data.choices?.[0]?.message?.content || '';
      modelUsed = currentModel;

      if (rawContent.trim()) {
        break; // Successfully obtained completion
      } else {
        lastError = new Error(`Groq model '${currentModel}' returned empty content.`);
        if (!isLastModel) continue;
      }
    } catch (err: any) {
      lastError = err;
      if (
        err.message?.includes('Invalid Groq API Key') ||
        err.message?.includes('rate limit')
      ) {
        throw err;
      }
      if (!isLastModel) {
        console.warn(`Groq request with '${currentModel}' encountered an error:`, err);
        continue;
      }
    }
  }

  if (!rawContent.trim()) {
    throw lastError || new Error('Groq API request failed across all candidate models.');
  }

  // Parse JSON response or extract from markdown codeblock
  try {
    let cleaned = rawContent.trim();
    const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (jsonMatch && jsonMatch[1]) {
      cleaned = jsonMatch[1].trim();
    } else {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1).trim();
      }
    }

    const parsed = JSON.parse(cleaned);

    const remedies: ClinicalGroqRemedy[] = Array.isArray(parsed.remedies)
      ? parsed.remedies.map((r: any) => ({
          remedy_name: r.remedy_name || r.name || 'Simillimum Remedy',
          common_name: r.common_name || r.commonName || '',
          potency: r.potency || '30C / 200C',
          dosage: r.dosage || '4 pills twice daily in water',
          key_indications: Array.isArray(r.key_indications)
            ? r.key_indications
            : Array.isArray(r.keynotes)
            ? r.keynotes
            : [r.key_indications || r.materia_medica_notes || 'Key clinical indication'],
          materia_medica_notes: r.materia_medica_notes || r.notes || '',
          modalities: {
            worse: r.modalities?.worse || 'Aggravation from weather changes or motion',
            better: r.modalities?.better || 'Amelioration from quiet rest and warmth',
          },
        }))
      : [];

    const patent_formulations: ClinicalGroqPatent[] = Array.isArray(parsed.patent_formulations)
      ? parsed.patent_formulations.map((p: any) => ({
          name: p.name || 'Patent Formulation',
          brand: p.brand || 'Patent',
          company: p.company || 'Homoeopathic Laboratories',
          bottle_size: p.bottle_size || p.bottleSize || '30 ml Drops',
          indications: p.indications || '',
          dosage: p.dosage || '10-15 drops in water 3 times daily.',
          mrp: Number(p.mrp) || 200,
          aliases: Array.isArray(p.aliases) ? p.aliases : [p.name, p.brand].filter(Boolean),
        }))
      : [];

    return {
      analysis_summary:
        parsed.analysis_summary ||
        parsed.summary ||
        'Groq LPU clinical homeopathic differential repertorization completed.',
      remedies,
      patent_formulations,
      repertory_keynotes: Array.isArray(parsed.repertory_keynotes) ? parsed.repertory_keynotes : [],
      diet_and_regimen:
        parsed.diet_and_regimen ||
        'Sip warm water. Avoid raw onion, garlic, menthol, camphor and strong coffee during homeopathic treatment.',
      warning_notes:
        parsed.warning_notes ||
        'Clinical decision-support aid for Dr. M. A. Haque, M.D. (Homoeo). Final clinical decisions rest with the attending homeopathic physician.',
      raw_text: rawContent,
      model_used: modelUsed,
    };
  } catch (parseError) {
    // If strict JSON parsing fails, construct a graceful structured response from text
    return {
      analysis_summary: rawContent.slice(0, 300) + (rawContent.length > 300 ? '...' : ''),
      remedies: [
        {
          remedy_name: 'Consultation Overview',
          common_name: 'Differential Analysis',
          potency: 'Clinical Evaluation',
          dosage: 'As prescribed by physician',
          key_indications: [
            rawContent.slice(0, 180),
            'Detailed evaluation available in consultation summary',
          ],
          materia_medica_notes: rawContent,
          modalities: {
            worse: 'See detailed clinical text',
            better: 'See detailed clinical text',
          },
        },
      ],
      patent_formulations: [],
      diet_and_regimen:
        'Sip warm water. Avoid raw onion, garlic, menthol, camphor and strong coffee during homeopathic treatment.',
      warning_notes:
        'Note: Final clinical decisions rest with the attending homeopathic physician.',
      raw_text: rawContent,
      model_used: modelUsed,
    };
  }
}
