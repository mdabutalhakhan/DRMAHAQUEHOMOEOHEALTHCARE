/**
 * Groq Cloud AI Client (LPU Inference Engine)
 * High-speed OpenAI-compatible completions endpoint with automatic model fallback.
 *
 * Endpoint: https://api.groq.com/openai/v1/chat/completions
 * Primary Model: openai/gpt-oss-20b
 * Fallback Models: openai/gpt-oss-120b, llama-3.3-70b-versatile
 */

export interface ClinicalGroqRemedy {
  name?: string;
  remedy_name: string;
  commonName?: string;
  common_name?: string;
  potency: string;
  dosage: string;
  guidingKeynotes?: string | string[];
  key_indications: string[];
  materia_medica_notes?: string;
  aggravation?: string;
  amelioration?: string;
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
  miasm?: string;
  remedies: ClinicalGroqRemedy[];
  patent_formulations: ClinicalGroqPatent[];
  patents?: ClinicalGroqPatent[];
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
 * Tests Groq API connectivity and verifies the validity of an API key.
 * Queries Groq's model listing endpoint which returns immediately with zero token cost.
 */
export async function testGroqConnection(apiKey?: string): Promise<{ success: boolean; message: string }> {
  const key = (apiKey !== undefined ? apiKey : getGroqApiKey()).trim();
  if (!key) {
    return { 
      success: false, 
      message: 'Please enter a Groq API Key (starts with gsk_...) before testing.' 
    };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        if (data?.error?.message) {
          errorMsg = data.error.message;
        }
      } catch {
        // ignore JSON parse error
      }
      return { 
        success: false, 
        message: `Connection failed (${response.status}): ${errorMsg}` 
      };
    }

    return { 
      success: true, 
      message: 'Groq Cloud LPU connection verified! Ready for high-speed AI consultations.' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: `Network error reaching Groq API: ${err?.message || 'Check your network connection'}` 
    };
  }
}

export const GROQ_SYSTEM_PROMPT = `You are Dr. M. A. Haque's expert AI Homeopathic Consultant. Provide clinical repertorization, differential remedies, potency suggestions, and modalities in clear bilingual (Bengali and English). Always state that the final decision rests with the attending physician.

CRITICAL INSTRUCTION: You MUST return STRICT JSON ONLY in the following exact structure without markdown commentary, backticks, or wrapping text:
{
  "analysis_summary": "Clear clinical summary in Bengali & English",
  "miasm": "Psora / Sycosis / Syphilis / Tubercular",
  "remedies": [
    {
      "name": "Ipecacuanha",
      "potency": "30C",
      "commonName": "Ipecac Root",
      "guidingKeynotes": "Persistent nausea not relieved by vomiting, clean tongue...",
      "aggravation": "Warmth, moist winds",
      "amelioration": "Open air, rest",
      "dosage": "4 pills 3 times daily"
    }
  ],
  "patents": [
    {
      "brand": "Dr. Reckeweg",
      "name": "R52 (Vomiting Drops)",
      "indications": "Nausea, motion sickness, gastroduodenitis",
      "dosage": "10-15 drops in water 3 times daily"
    }
  ]
}

Provide 3-5 classical homeopathic remedies and 2-4 patent formulations. Output strictly valid JSON.`;

/**
 * Builds the structured prompt instructing the model to return
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

Please analyze this clinical case thoroughly. Format your response strictly as valid JSON adhering to this exact schema:
{
  "analysis_summary": "Clear clinical summary in Bengali & English",
  "miasm": "Psora / Sycosis / Syphilis / Tubercular",
  "remedies": [
    {
      "name": "Standard Latin Name (e.g. Lycopodium Clavatum)",
      "potency": "30C or 200C",
      "commonName": "Common English Name (e.g. Club Moss)",
      "guidingKeynotes": "Guiding keynote symptoms in English & Bengali",
      "aggravation": "Aggravating factors (worse)",
      "amelioration": "Ameliorating factors (better)",
      "dosage": "4 pills 3 times daily"
    }
  ],
  "patents": [
    {
      "brand": "Dr. Reckeweg / Adel / Bakson's / SBL / Wheezal / Schwabe / Medisynth",
      "name": "Product Name (e.g. R52 Vomiting Drops)",
      "indications": "Clinical indications in English & Bengali",
      "dosage": "10-15 drops in water 3 times daily"
    }
  ]
}

Return ONLY valid JSON without markdown commentary.`;
}

/**
 * Repairs truncated or mildly malformed JSON strings by balancing brackets,
 * fixing missing commas between elements/objects, and trimming trailing dangling keys.
 */
function repairMalformedJson(str: string): string {
  let cleaned = str.trim();

  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) return cleaned;
  cleaned = cleaned.substring(firstBrace);

  // Fix missing commas between closing brace and opening brace
  cleaned = cleaned.replace(/\}\s*\{/g, '},{');

  // Fix missing commas between closing bracket and opening bracket
  cleaned = cleaned.replace(/\]\s*\[/g, '],[');

  // Fix missing commas between array string elements
  cleaned = cleaned.replace(/"\s*\n+\s*"/g, '",\n"');

  // Fix trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  // Check bracket balance and unclosed strings
  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') stack.push('}');
      else if (char === '[') stack.push(']');
      else if (char === '}' || char === ']') {
        if (stack.length && stack[stack.length - 1] === char) {
          stack.pop();
        }
      }
    }
  }

  // If cut off mid-string, close the string
  if (inString) {
    cleaned += '"';
  }

  // Remove trailing dangling keys or trailing commas (e.g. `,\n  "someKey":` or `,`)
  cleaned = cleaned.replace(/,\s*"[^"]*":?\s*$/, '');
  cleaned = cleaned.replace(/,\s*$/, '');

  // Close remaining open brackets in reverse order
  while (stack.length > 0) {
    cleaned += stack.pop();
  }

  // Final cleanup of any trailing commas before closed brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  return cleaned;
}

/**
 * Fallback regex extractor for individual remedy and patent objects if JSON.parse fails entirely
 */
function extractJsonFallback(raw: string): any {
  const result: any = {
    analysis_summary: 'Clinical repertorization and differential analysis completed.',
    miasm: 'Psora / Sycosis / Syphilis / Tubercular',
    remedies: [],
    patents: [],
    diet_and_regimen: 'Sip warm water. Avoid raw onion, garlic, menthol, camphor and strong coffee during homoeopathic treatment.',
    warning_notes: 'Clinical decision-support aid for Dr. M. A. Haque, M.D. (Homoeo). Final clinical decisions rest with the attending homeopathic physician.',
  };

  try {
    // Extract summary
    const summaryMatch = raw.match(/"analysis_summary"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
    if (summaryMatch && summaryMatch[1]) {
      result.analysis_summary = summaryMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim();
    }

    // Extract miasm
    const miasmMatch = raw.match(/"miasm"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
    if (miasmMatch && miasmMatch[1]) {
      result.miasm = miasmMatch[1].replace(/\\"/g, '"').trim();
    }

    // Extract remedy blocks
    const remedyRegex = /\{[^{}]*?(?:"name"|"remedy_name")\s*:\s*"([^"]+)"[^{}]*?\}/gi;
    let match;
    while ((match = remedyRegex.exec(raw)) !== null) {
      const block = match[0];
      const name = match[1];
      const potencyMatch = block.match(/"potency"\s*:\s*"([^"]+)"/i);
      const commonMatch = block.match(/"(?:commonName|common_name)"\s*:\s*"([^"]+)"/i);
      const keynotesMatch = block.match(/"(?:guidingKeynotes|key_indications|keynotes)"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
      const aggMatch = block.match(/"(?:aggravation|worse)"\s*:\s*"([^"]+)"/i);
      const amelMatch = block.match(/"(?:amelioration|better)"\s*:\s*"([^"]+)"/i);
      const dosageMatch = block.match(/"dosage"\s*:\s*"([^"]+)"/i);

      if (name) {
        result.remedies.push({
          name,
          remedy_name: name,
          potency: potencyMatch ? potencyMatch[1] : '30C',
          commonName: commonMatch ? commonMatch[1] : '',
          common_name: commonMatch ? commonMatch[1] : '',
          guidingKeynotes: keynotesMatch ? keynotesMatch[1].replace(/\\"/g, '"') : '',
          aggravation: aggMatch ? aggMatch[1] : 'Weather changes, motion, or cold',
          amelioration: amelMatch ? amelMatch[1] : 'Warmth, rest, or fresh air',
          dosage: dosageMatch ? dosageMatch[1] : '4 pills 3 times daily',
        });
      }
    }

    // Extract patent blocks
    const patentRegex = /\{[^{}]*?(?:"brand"|"indications")[^{}]*?\}/gi;
    while ((match = patentRegex.exec(raw)) !== null) {
      const block = match[0];
      const brandMatch = block.match(/"brand"\s*:\s*"([^"]+)"/i);
      const nameMatch = block.match(/"name"\s*:\s*"([^"]+)"/i);
      const indMatch = block.match(/"indications"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
      const dosageMatch = block.match(/"dosage"\s*:\s*"([^"]+)"/i);

      if (nameMatch || brandMatch) {
        result.patents.push({
          brand: brandMatch ? brandMatch[1] : 'Dr. Reckeweg',
          name: nameMatch ? nameMatch[1] : 'Patent Formulation',
          indications: indMatch ? indMatch[1].replace(/\\"/g, '"') : '',
          dosage: dosageMatch ? dosageMatch[1] : '10-15 drops in water 3 times daily',
        });
      }
    }
  } catch (err) {
    console.warn("Fallback regex extraction encountered minor error:", err);
  }

  return result;
}

/**
 * Robust multi-tier JSON parser that safely parses Groq AI responses,
 * repairs syntax anomalies, handles truncated stream cutoffs, and recovers
 * remedies even if standard JSON.parse fails.
 */
export function parseGroqResponse(rawResponse: string): any {
  if (!rawResponse || typeof rawResponse !== 'string') return null;

  // 1. Direct standard parse attempt
  try {
    const cleanJson = rawResponse.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleanJson.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // Proceed to repair stage
  }

  // 2. Syntactic repair attempt (handles missing commas, truncated arrays, unclosed quotes/brackets)
  try {
    const repaired = repairMalformedJson(rawResponse);
    const parsed = JSON.parse(repaired);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // Proceed to fallback extractor
  }

  // 3. Resilient field & object extraction fallback (guaranteed not to throw)
  return extractJsonFallback(rawResponse);
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
  // Use 3072 max_tokens so full clinical repertorization with Bengali and English is never truncated mid-JSON
  const max_tokens = typeof options?.max_tokens === 'number' ? options.max_tokens : 3072;

  let rawContent = '';
  let modelUsed = initialModel;
  let lastError: Error | null = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const currentModel = candidateModels[i];
    const isLastModel = i === candidateModels.length - 1;

    const payload: any = {
      model: currentModel,
      messages: [
        {
          role: 'system',
          content: GROQ_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
      temperature,
      max_tokens,
      response_format: { type: 'json_object' },
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

  // Clean and parse JSON response safely
  const parsed = parseGroqResponse(rawContent);

  if (!parsed || (typeof parsed !== 'object')) {
    throw new Error('Failed to parse Groq AI response as valid JSON.');
  }

  const rawRemedies = Array.isArray(parsed.remedies) ? parsed.remedies : [];
  const remedies: ClinicalGroqRemedy[] = rawRemedies.map((r: any) => {
    const rawKeynotes = r.guidingKeynotes || r.key_indications || r.keynotes || '';
    const keynotesArray: string[] = Array.isArray(rawKeynotes)
      ? rawKeynotes.map((s: any) => String(s).trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
      : typeof rawKeynotes === 'string' && rawKeynotes.trim()
      ? rawKeynotes.split('\n').map((s: string) => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
      : [String(rawKeynotes || 'Key clinical indication')];

    const worse = r.aggravation || r.modalities?.worse || 'Weather changes, motion, or cold';
    const better = r.amelioration || r.modalities?.better || 'Warmth, rest, or open air';
    const remedyName = r.name || r.remedy_name || 'Homeopathic Remedy';
    const commonName = r.commonName || r.common_name || '';

    return {
      name: remedyName,
      remedy_name: remedyName,
      commonName,
      common_name: commonName,
      potency: r.potency || '30C',
      dosage: r.dosage || '4 pills 3 times daily',
      guidingKeynotes: typeof r.guidingKeynotes === 'string' ? r.guidingKeynotes : keynotesArray.join('. '),
      key_indications: keynotesArray.length > 0 ? keynotesArray : ['Key clinical keynote symptom'],
      materia_medica_notes: typeof r.guidingKeynotes === 'string' ? r.guidingKeynotes : keynotesArray.join('. '),
      aggravation: worse,
      amelioration: better,
      modalities: {
        worse,
        better,
      },
    };
  });

  const rawPatents = Array.isArray(parsed.patents)
    ? parsed.patents
    : Array.isArray(parsed.patent_formulations)
    ? parsed.patent_formulations
    : [];

  const patent_formulations: ClinicalGroqPatent[] = rawPatents.map((p: any) => ({
    name: p.name || 'Patent Formulation',
    brand: p.brand || 'Dr. Reckeweg',
    company: p.company || (p.brand ? `${p.brand} Homoeopathic Laboratories` : 'Homoeopathic Laboratories'),
    bottle_size: p.bottle_size || p.bottleSize || '22-30 ml Drops',
    bottleSize: p.bottle_size || p.bottleSize || '22-30 ml Drops',
    indications: p.indications || '',
    dosage: p.dosage || '10-15 drops in water 3 times daily',
    mrp: Number(p.mrp) || 220,
    aliases: Array.isArray(p.aliases) ? p.aliases : [p.name, p.brand].filter(Boolean),
  }));

  // Clean and sanitize analysis_summary so it never contains raw JSON
  let summary = typeof parsed.analysis_summary === 'string'
    ? parsed.analysis_summary.trim()
    : typeof parsed.summary === 'string'
    ? parsed.summary.trim()
    : 'Clinical repertorization and differential analysis completed.';

  if (summary.startsWith('{') || summary.includes('"analysis_summary"')) {
    try {
      const innerMatch = summary.match(/\{[\s\S]*\}/);
      if (innerMatch) {
        const nested = JSON.parse(innerMatch[0]);
        summary = nested.analysis_summary || 'Clinical repertorization completed.';
      }
    } catch {
      summary = 'Clinical homeopathic differential repertorization completed.';
    }
  }

  const miasm = typeof parsed.miasm === 'string' && parsed.miasm.trim()
    ? parsed.miasm.trim()
    : 'Psora / Sycosis / Syphilis / Tubercular';

  return {
    analysis_summary: summary,
    miasm,
    remedies,
    patent_formulations,
    patents: patent_formulations,
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
}
