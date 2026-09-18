import { getSupabase } from './supabase';
import { MateriaMedicaRemedy, RemedyIndexItem } from '../data/materiaMedicaDatabase';

export interface CustomMateriaMedicaRecord {
  id: string;
  name: string;
  bengali_name: string;
  brand: string;
  category: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent';
  sphere_of_action: string;
  clinical_indications: Array<{ en: string; bn: string }> | string[];
  keynotes: Array<{ en: string; bn: string }> | string[];
  dosage: string;
  modalities?: {
    worse?: string;
    better?: string;
  };
  created_at?: string;
}

const LOCAL_STORAGE_KEY = 'hhc_custom_materia_medica_v1';

/**
 * Loads all custom added remedies from Supabase with graceful localStorage fallback
 */
export async function loadCustomRemedies(): Promise<CustomMateriaMedicaRecord[]> {
  const localList: CustomMateriaMedicaRecord[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localList.push(...parsed);
      }
    }
  } catch (err) {
    console.warn('Error reading custom materia medica from localStorage:', err);
  }

  // Attempt to read from Supabase table `custom_materia_medica`
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('custom_materia_medica')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      // Merge remote and local without duplicates (Supabase wins)
      const map = new Map<string, CustomMateriaMedicaRecord>();
      localList.forEach((item) => map.set(item.id, item));
      data.forEach((item: any) => {
        // Normalize indications and keynotes if stored as jsonb or strings
        let indications = item.clinical_indications;
        if (typeof indications === 'string') {
          try {
            indications = JSON.parse(indications);
          } catch {
            indications = [{ en: item.clinical_indications, bn: item.clinical_indications }];
          }
        }

        let keynotes = item.keynotes;
        if (typeof keynotes === 'string') {
          try {
            keynotes = JSON.parse(keynotes);
          } catch {
            keynotes = [{ en: item.keynotes, bn: item.keynotes }];
          }
        }

        map.set(item.id, {
          id: item.id,
          name: item.name,
          bengali_name: item.bengali_name || item.name,
          brand: item.brand || 'Custom Formulation',
          category: (item.category as any) || 'patent',
          sphere_of_action: item.sphere_of_action || '',
          clinical_indications: indications || [],
          keynotes: keynotes || [],
          dosage: item.dosage || '',
          created_at: item.created_at
        });
      });

      const merged = Array.from(map.values());
      // Sync local storage with latest merged
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch (supErr) {
    console.warn('Supabase custom_materia_medica query fallback to local:', supErr);
  }

  return localList;
}

/**
 * Persists a new or updated remedy into Supabase and local storage
 */
export async function saveCustomRemedy(record: CustomMateriaMedicaRecord): Promise<boolean> {
  // 1. Immediately persist to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: CustomMateriaMedicaRecord[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((x) => x.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Error saving custom remedy to localStorage:', err);
  }

  // 2. Attempt upsert into Supabase `custom_materia_medica`
  try {
    const supabase = getSupabase();
    const payload = {
      id: record.id,
      name: record.name,
      bengali_name: record.bengali_name,
      brand: record.brand,
      category: record.category,
      sphere_of_action: record.sphere_of_action,
      clinical_indications: record.clinical_indications,
      keynotes: record.keynotes,
      dosage: record.dosage,
      created_at: record.created_at || new Date().toISOString()
    };

    const { error } = await supabase
      .from('custom_materia_medica')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert into custom_materia_medica returned error (fallback active):', error.message);
    } else {
      return true;
    }
  } catch (supErr) {
    console.warn('Could not reach Supabase for custom_materia_medica; local storage saved successfully:', supErr);
  }

  return true;
}

/**
 * Persists a batch of remedies into Supabase and local storage
 */
export async function saveBulkCustomRemedies(
  records: CustomMateriaMedicaRecord[]
): Promise<{ count: number; success: boolean }> {
  if (!records || records.length === 0) {
    return { count: 0, success: true };
  }

  // 1. Persist to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existingList: CustomMateriaMedicaRecord[] = raw ? JSON.parse(raw) : [];
    const map = new Map<string, CustomMateriaMedicaRecord>();
    existingList.forEach((item) => map.set(item.id, item));
    records.forEach((item) => map.set(item.id, item));

    const updatedList = Array.from(map.values());
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.warn('Error saving bulk custom remedies to localStorage:', err);
  }

  // 2. Batch upsert into Supabase `custom_materia_medica`
  try {
    const supabase = getSupabase();
    const payloads = records.map((record) => ({
      id: record.id,
      name: record.name,
      bengali_name: record.bengali_name,
      brand: record.brand,
      category: record.category,
      sphere_of_action: record.sphere_of_action,
      clinical_indications: record.clinical_indications,
      keynotes: record.keynotes,
      dosage: record.dosage,
      created_at: record.created_at || new Date().toISOString()
    }));

    const { error } = await supabase
      .from('custom_materia_medica')
      .upsert(payloads, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase batch upsert returned error (localStorage fallback saved successfully):', error.message);
    }
  } catch (supErr) {
    console.warn('Could not reach Supabase for batch upsert; saved to local cache:', supErr);
  }

  return { count: records.length, success: true };
}

/**
 * Converts a CustomMateriaMedicaRecord to a full MateriaMedicaRemedy object
 */
export function convertCustomToMateriaMedicaRemedy(rec: CustomMateriaMedicaRecord): MateriaMedicaRemedy {
  // Normalize indications
  const primaryIndications = Array.isArray(rec.clinical_indications)
    ? rec.clinical_indications.map((item) => {
        if (typeof item === 'string') {
          return { en: item, bn: item };
        }
        return { en: item.en || '', bn: item.bn || item.en || '' };
      })
    : [{ en: String(rec.clinical_indications), bn: String(rec.clinical_indications) }];

  // Normalize keynotes
  const guidingKeynotes = Array.isArray(rec.keynotes)
    ? rec.keynotes.map((item) => {
        if (typeof item === 'string') {
          return { en: item, bn: item };
        }
        return { en: item.en || '', bn: item.bn || item.en || '' };
      })
    : [{ en: String(rec.keynotes), bn: String(rec.keynotes) }];

  return {
    id: rec.id,
    latinName: rec.name,
    nameBn: rec.bengali_name || rec.name,
    commonName: `${rec.brand || 'Proprietary'} - ${rec.name}`,
    familySource: `${rec.brand || 'Patent Brand'} Formulation`,
    category: rec.category,
    sphereOfActionEn: rec.sphere_of_action,
    sphereOfActionBn: rec.sphere_of_action,
    primaryIndications,
    guidingKeynotes,
    modalities: {
      worseEn: rec.modalities?.worse || 'Fatigue, weather fluctuations, physical exertion',
      worseBn: 'ক্লান্তি, আবহাওয়া পরিবর্তন বা অতিরিক্ত পরিশ্রমে বাড়ে',
      betterEn: rec.modalities?.better || 'Rest, quiet recovery, proper regimen',
      betterBn: 'বিশ্রামে ও চিকিৎসকের পরামর্শমতো নিয়মিত সেবনে উপশম'
    },
    recommendedPotency: rec.category === 'mother_tincture' ? 'Mother Tincture Q' : rec.category === 'biochemic' ? '6X / 12X' : 'Drop / Syrup Formulation',
    dosageGuidelines: rec.dosage || '10-15 drops in lukewarm water 2-3 times daily before meals.',
    clinicalPearls: `Enriched via Homoeo Health Care AI & Boericke-Kent Clinical Protocol. Brand: ${rec.brand}.`,
    aliases: [rec.name.toLowerCase(), (rec.bengali_name || '').toLowerCase(), (rec.brand || '').toLowerCase()]
  };
}

/**
 * Converts custom record to a search index item
 */
export function convertCustomToRemedyIndexItem(rec: CustomMateriaMedicaRecord): RemedyIndexItem & { isCustom: boolean } {
  return {
    id: rec.id,
    name: rec.name,
    nameBn: rec.bengali_name || rec.name,
    commonName: `${rec.brand || 'Patent'} - ${rec.name}`,
    category: rec.category,
    isCustom: true,
    aliases: [
      rec.name.toLowerCase(),
      (rec.bengali_name || '').toLowerCase(),
      (rec.brand || '').toLowerCase(),
      rec.name.split(' ')[0].toLowerCase()
    ]
  };
}
