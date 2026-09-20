import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabase } from './supabase';
import { getInventory, subscribeToStore } from './clinicStore';
import { InventoryItem } from '../types';

export interface ActiveInventoryRecord {
  id: string;
  medicine_name: string;
  potency: string;
  category?: string;
  bottle_size?: string;
  current_stock: number;
  rack_location: string;
  mrp?: number;
  manufacturer?: string;
  company?: string;
  symptom?: string;
}

export interface MedicineStockStatus {
  found: boolean;
  inStock: boolean;
  current_stock: number;
  rack_location: string;
  matchedName?: string;
  matchedPotency?: string;
  potencyMatched?: boolean;
  mrp?: number;
}

/**
 * Normalizes potency string for clinical matching
 * e.g. "30", "30C", "30 ch", "30C Dilution" -> "30C"
 * "Q", "MT", "Mother Tincture", "Ø" -> "Q"
 */
export function normalizePotency(potency?: string | null): string {
  if (!potency) return '';
  const clean = potency.trim().toUpperCase();
  
  if (clean === 'Q' || clean === 'MT' || clean === 'Ø' || clean.includes('MOTHER')) {
    return 'Q';
  }
  
  // Strip "CH", "C", "X", "DILUTION"
  const digitsMatch = clean.match(/^(\d+)\s*(C|CH|X|K|M|LM)?/i);
  if (digitsMatch) {
    const num = digitsMatch[1];
    const unit = (digitsMatch[2] || '').toUpperCase();
    if (unit === 'X') return `${num}X`;
    if (unit === 'M') return `${num}M`;
    if (unit === 'LM') return `LM${num}`;
    // Default homeopathy centesimal dilution
    return `${num}C`;
  }
  
  if (clean.startsWith('LM') || clean.startsWith('0/')) {
    return clean;
  }

  return clean;
}

/**
 * Standard Homeopathic Remedy Synonyms & Abbreviation Expansion Table
 */
const REMEDY_SYNONYMS: Record<string, string> = {
  'arnica': 'arnica montana',
  'arnica mont': 'arnica montana',
  'aconite': 'aconitum napellus',
  'aconitum': 'aconitum napellus',
  'aconite nap': 'aconitum napellus',
  'aconitum nap': 'aconitum napellus',
  'bell': 'belladonna',
  'belladonna': 'belladonna',
  'bry': 'bryonia alba',
  'bryonia': 'bryonia alba',
  'bryonia alba': 'bryonia alba',
  'nux': 'nux vomica',
  'nux vom': 'nux vomica',
  'nux vomica': 'nux vomica',
  'rhus': 'rhus toxicodendron',
  'rhus tox': 'rhus toxicodendron',
  'rhus toxicodendron': 'rhus toxicodendron',
  'thuja': 'thuja occidentalis',
  'thuja occ': 'thuja occidentalis',
  'thuja occidentalis': 'thuja occidentalis',
  'arsenic': 'arsenicum album',
  'arsenic alb': 'arsenicum album',
  'arsenicum alb': 'arsenicum album',
  'arsenicum album': 'arsenicum album',
  'calc carb': 'calcarea carbonica',
  'calcarea carb': 'calcarea carbonica',
  'calcarea carbonica': 'calcarea carbonica',
  'lyco': 'lycopodium clavatum',
  'lycopodium': 'lycopodium clavatum',
  'lycopodium clav': 'lycopodium clavatum',
  'lycopodium clavatum': 'lycopodium clavatum',
  'puls': 'pulsatilla nigricans',
  'pulsatilla': 'pulsatilla nigricans',
  'pulsatilla nig': 'pulsatilla nigricans',
  'pulsatilla nigricans': 'pulsatilla nigricans',
  'silicea': 'silicea',
  'silica': 'silicea',
  'mag phos': 'magnesia phosphorica',
  'magnesia phos': 'magnesia phosphorica',
  'magnesia phosphorica': 'magnesia phosphorica',
  'calc phos': 'calcarea phosphorica',
  'calcarea phos': 'calcarea phosphorica',
  'calcarea phosphorica': 'calcarea phosphorica',
  'calc fluor': 'calcarea fluorica',
  'calcarea fluor': 'calcarea fluorica',
  'calcarea fluorica': 'calcarea fluorica',
  'ferrum phos': 'ferrum phosphoricum',
  'ferr phos': 'ferrum phosphoricum',
  'ferrum phosphoricum': 'ferrum phosphoricum',
  'kali mur': 'kali muriaticum',
  'kali muriaticum': 'kali muriaticum',
  'kali phos': 'kali phosphoricum',
  'kali phosphoricum': 'kali phosphoricum',
  'kali sulph': 'kali sulphuricum',
  'kali sulphuricum': 'kali sulphuricum',
  'nat mur': 'natrum muriaticum',
  'natrum mur': 'natrum muriaticum',
  'natrum muriaticum': 'natrum muriaticum',
  'nat phos': 'natrum phosphoricum',
  'natrum phos': 'natrum phosphoricum',
  'natrum phosphoricum': 'natrum phosphoricum',
  'nat sulph': 'natrum sulphuricum',
  'natrum sulph': 'natrum sulphuricum',
  'natrum sulphuricum': 'natrum sulphuricum',
  'kali bich': 'kali bichromicum',
  'kali bichrom': 'kali bichromicum',
  'kali bichromicum': 'kali bichromicum',
  'acid phos': 'acidum phosphoricum',
  'acidum phos': 'acidum phosphoricum',
  'acidum phosphoricum': 'acidum phosphoricum',
  'phosphoric acid': 'acidum phosphoricum',
  'acid nit': 'acidum nitricum',
  'nitric acid': 'acidum nitricum',
  'acidum nitricum': 'acidum nitricum',
  'hepar sulph': 'hepar sulphuris',
  'hepar sulphuris': 'hepar sulphuris',
  'hepar sulphuris calcareum': 'hepar sulphuris',
  'caust': 'causticum',
  'causticum': 'causticum',
  'cham': 'chamomilla',
  'chamomilla': 'chamomilla',
  'gels': 'gelsemium sempervirens',
  'gelsemium': 'gelsemium sempervirens',
  'gelsemium sempervirens': 'gelsemium sempervirens',
  'coloc': 'colocynthis',
  'colocynth': 'colocynthis',
  'colocynthis': 'colocynthis',
  'berb vulg': 'berberis vulgaris',
  'berberis vulg': 'berberis vulgaris',
  'berberis vulgaris': 'berberis vulgaris',
  'hypericum': 'hypericum perforatum',
  'hypericum perf': 'hypericum perforatum',
  'hypericum perforatum': 'hypericum perforatum',
  'ruta': 'ruta graveolens',
  'ruta grav': 'ruta graveolens',
  'ruta graveolens': 'ruta graveolens',
  'symph': 'symphytum officinale',
  'symphytum': 'symphytum officinale',
  'symphytum off': 'symphytum officinale',
  'symphytum officinale': 'symphytum officinale',
  'passiflora': 'passiflora incarnata',
  'passiflora inc': 'passiflora incarnata',
  'passiflora incarnata': 'passiflora incarnata',
  'crataegus': 'crataegus oxyacantha',
  'crataegus oxy': 'crataegus oxyacantha',
  'crataegus oxyacantha': 'crataegus oxyacantha',
  'echinacea': 'echinacea angustifolia',
  'echinacea ang': 'echinacea angustifolia',
  'echinacea angustifolia': 'echinacea angustifolia',
  'hamamelis': 'hamamelis virginiana',
  'hamamelis virg': 'hamamelis virginiana',
  'hamamelis virginiana': 'hamamelis virginiana',
  'hydrastis': 'hydrastis canadensis',
  'hydrastis can': 'hydrastis canadensis',
  'hydrastis canadensis': 'hydrastis canadensis',
  'ignatia': 'ignatia amara',
  'ignatia amara': 'ignatia amara',
  'carbo veg': 'carbo vegetabilis',
  'carbo vegetabilis': 'carbo vegetabilis',
  'staph': 'staphysagria',
  'staphysagria': 'staphysagria',
  'lachesis': 'lachesis muta',
  'lachesis muta': 'lachesis muta',
  'merc sol': 'mercurius solubilis',
  'mercurius sol': 'mercurius solubilis',
  'mercurius solubilis': 'mercurius solubilis',
  'china': 'cinchona officinalis',
  'china off': 'cinchona officinalis',
  'cinchona officinalis': 'cinchona officinalis',
  'sulphur': 'sulphur',
  'sulfur': 'sulphur',
};

/**
 * Normalizes a remedy name for robust cross-matching:
 * 1. Lowercase and trim
 * 2. Strip brand prefixes (Dr. Reckeweg, SBL, Adel, Schwabe, etc.)
 * 3. Strip potency or formulation suffixes (Q, 30C, 200C, Drops, Dilution)
 * 4. Map known homeopathic abbreviations to standardized latin names
 */
export function normalizeMedicineName(rawName: string): string {
  if (!rawName) return '';
  let str = rawName.toLowerCase();

  // Strip brand prefixes
  str = str.replace(/^(dr\.?\s*reckeweg|reckeweg|sbl|schwabe|wsi|dr\.?\s*willmar|adel|adel\s*\/\s*pekana|bakson'?s?|wheezal|haslab|boiron|medisynth|lord'?s?|allen)\s*(&\s*co\.?)?/gi, ' ');
  
  // Strip formulation words
  str = str.replace(/\b(dilution|mother\s*tincture|tincture|drops|tablets|tabs|syrup|ointment|pellets|globules|biochemic)\b/gi, ' ');
  
  // Strip potency suffixes e.g. 30c, 200c, 1m, 6x, q, mt, ø
  str = str.replace(/\b(\d+\s*(c|ch|x|k|m|lm)|q|mt|ø)\b/gi, ' ');

  // Remove punctuation
  str = str.replace(/[.,\-\/\\()_&:+]/g, ' ').replace(/\s+/g, ' ').trim();

  // Check synonym table
  if (REMEDY_SYNONYMS[str]) {
    return REMEDY_SYNONYMS[str];
  }

  // Check prefix in synonym table
  for (const [key, expanded] of Object.entries(REMEDY_SYNONYMS)) {
    if (str === key || str.startsWith(key + ' ') || key.startsWith(str + ' ')) {
      return expanded;
    }
  }

  return str;
}

/**
 * Checks if a specific remedy name matches an inventory item
 */
export function isMedicineNameMatch(remedyName: string, inventoryName: string, aliases?: string[]): boolean {
  const normRemedy = normalizeMedicineName(remedyName);
  const normInv = normalizeMedicineName(inventoryName);

  if (!normRemedy || !normInv) return false;

  // Direct normalized match
  if (normRemedy === normInv) return true;

  // Check aliases if provided
  if (aliases && aliases.length > 0) {
    for (const alias of aliases) {
      const normAlias = normalizeMedicineName(alias);
      if (normAlias === normInv || normInv.includes(normAlias) || normAlias.includes(normInv)) {
        return true;
      }
    }
  }

  // Inverted check (one contains the other)
  if (normRemedy.includes(normInv) || normInv.includes(normRemedy)) {
    return true;
  }

  // Handle patent medicines (e.g. "R41", "R-41", "Dr. Reckeweg R41")
  const patentMatchRemedy = remedyName.match(/\b(r\s*-?\s*\d+)\b/i);
  const patentMatchInv = inventoryName.match(/\b(r\s*-?\s*\d+)\b/i);
  if (patentMatchRemedy && patentMatchInv) {
    const codeA = patentMatchRemedy[1].replace(/\s+|-/g, '').toUpperCase();
    const codeB = patentMatchInv[1].replace(/\s+|-/g, '').toUpperCase();
    if (codeA === codeB) return true;
  }

  // Word token intersection (for multi-word remedy names like "Nux Vomica", "Arnica Montana")
  const wordsRemedy = normRemedy.split(/\s+/).filter(w => w.length >= 3);
  const wordsInv = normInv.split(/\s+/).filter(w => w.length >= 3);

  if (wordsRemedy.length > 0 && wordsInv.length > 0) {
    // If the first distinctive botanical word matches (e.g. "arnica", "bryonia", "lycopodium", "pulsatilla")
    if (wordsRemedy[0] === wordsInv[0] && wordsRemedy[0].length >= 4) {
      // If second word exists in both and matches or one lacks second word
      if (wordsRemedy.length === 1 || wordsInv.length === 1 || wordsRemedy[1] === wordsInv[1]) {
        return true;
      }
    }
    
    // Check if all words of remedy appear in inventory item
    const allRemedyWordsInInv = wordsRemedy.every(w => wordsInv.includes(w));
    if (allRemedyWordsInInv) return true;
  }

  return false;
}

/**
 * Real-time Normalized Inventory Matcher Function
 * Matches against an array of active inventory records.
 */
export function checkMedicineStock(
  remedyName: string,
  potency?: string,
  inventoryList?: ActiveInventoryRecord[],
  aliases?: string[]
): MedicineStockStatus {
  if (!remedyName) {
    return { found: false, inStock: false, current_stock: 0, rack_location: '' };
  }

  const list = inventoryList || getActiveCachedInventory();
  if (!list || list.length === 0) {
    return { found: false, inStock: false, current_stock: 0, rack_location: '' };
  }

  const normTargetPotency = normalizePotency(potency);

  // Find all inventory items that match the medicine name
  const candidateMatches = list.filter(item => isMedicineNameMatch(remedyName, item.medicine_name, aliases));

  if (candidateMatches.length === 0) {
    return {
      found: false,
      inStock: false,
      current_stock: 0,
      rack_location: ''
    };
  }

  // If a specific target potency was requested
  if (normTargetPotency) {
    // 1. First look for an exact potency match
    const exactPotencyMatch = candidateMatches.find(item => {
      const itemPot = normalizePotency(item.potency);
      return itemPot === normTargetPotency;
    });

    if (exactPotencyMatch) {
      const hasStock = exactPotencyMatch.current_stock > 0;
      return {
        found: true,
        inStock: hasStock,
        current_stock: hasStock ? exactPotencyMatch.current_stock : 0,
        rack_location: hasStock ? (exactPotencyMatch.rack_location || '').trim() : '',
        matchedName: exactPotencyMatch.medicine_name,
        matchedPotency: exactPotencyMatch.potency,
        potencyMatched: true,
        mrp: exactPotencyMatch.mrp
      };
    }
  }

  // 2. If no exact potency match found, or no potency requested:
  // Prioritize candidates with stock > 0
  const inStockCandidate = candidateMatches.find(item => item.current_stock > 0);
  if (inStockCandidate) {
    return {
      found: true,
      inStock: true,
      current_stock: inStockCandidate.current_stock,
      rack_location: (inStockCandidate.rack_location || '').trim(),
      matchedName: inStockCandidate.medicine_name,
      matchedPotency: inStockCandidate.potency,
      potencyMatched: Boolean(normTargetPotency && normalizePotency(inStockCandidate.potency) === normTargetPotency),
      mrp: inStockCandidate.mrp
    };
  }

  // 3. All matching records are currently out of stock (stock === 0)
  const firstMatch = candidateMatches[0];
  return {
    found: true,
    inStock: false,
    current_stock: 0,
    rack_location: '', // strictly no fake rack number when out of stock
    matchedName: firstMatch.medicine_name,
    matchedPotency: firstMatch.potency,
    potencyMatched: Boolean(normTargetPotency && normalizePotency(firstMatch.potency) === normTargetPotency),
    mrp: firstMatch.mrp
  };
}

// In-Memory global cached inventory list for immediate synchronous checks
let cachedInventoryList: ActiveInventoryRecord[] = [];

export function getActiveCachedInventory(): ActiveInventoryRecord[] {
  if (cachedInventoryList.length > 0) {
    return cachedInventoryList;
  }
  // Initialize from clinicStore local inventory
  try {
    const local = getInventory();
    if (local && local.length > 0) {
      cachedInventoryList = local.map(mapLocalToActiveRecord);
      return cachedInventoryList;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

function mapLocalToActiveRecord(item: InventoryItem): ActiveInventoryRecord {
  const stock = Number(item.stock_quantity ?? (item as any).current_stock ?? 0);
  const cleanStock = isNaN(stock) || stock < 0 ? 0 : stock;

  return {
    id: item.id,
    medicine_name: item.medicine_name,
    potency: item.potency || '',
    category: item.category,
    bottle_size: item.bottle_size,
    current_stock: cleanStock,
    rack_location: (item.rack_location || '').trim(),
    mrp: item.mrp,
    manufacturer: (item as any).manufacturer || (item as any).company_name || item.company || '',
    company: item.company || (item as any).manufacturer || '',
    symptom: item.symptom || (item as any).indication || ''
  };
}

function mapSupabaseRowToActiveRecord(row: any): ActiveInventoryRecord {
  const stock = Number(
    row.stock_quantity !== undefined && row.stock_quantity !== null
      ? row.stock_quantity
      : (row.current_stock !== undefined && row.current_stock !== null
        ? row.current_stock
        : (row.stock_qty !== undefined && row.stock_qty !== null
          ? row.stock_qty
          : 0))
  );

  const cleanStock = isNaN(stock) || stock < 0 ? 0 : stock;

  return {
    id: row.id || `inv-${Math.random()}`,
    medicine_name: row.medicine_name || row.name || 'Unknown Remedy',
    potency: row.potency || '',
    category: row.category,
    bottle_size: row.bottle_size,
    current_stock: cleanStock,
    rack_location: (row.rack_location || '').trim(),
    mrp: Number(row.mrp) || 0,
    manufacturer: row.manufacturer || row.company || '',
    company: row.company || row.manufacturer || '',
    symptom: row.symptom || row.indication || ''
  };
}

/**
 * Custom React Hook: useRealtimeInventory
 * Provides live, auto-refreshing inventory with normalized matching
 */
export function useRealtimeInventory() {
  const [inventoryList, setInventoryList] = useState<ActiveInventoryRecord[]>(() => getActiveCachedInventory());
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const fetchLiveInventory = useCallback(async () => {
    setIsLoading(true);
    let items: ActiveInventoryRecord[] = [];

    try {
      const supabase = getSupabase();
      if (supabase) {
        // Strategy 1: Real Supabase 'inventory' table as specified in database schema
        const invRes = await supabase
          .from('inventory')
          .select('*');

        if (!invRes.error && invRes.data && invRes.data.length > 0) {
          items = invRes.data.map(mapSupabaseRowToActiveRecord);
        } else {
          // Strategy 2: Fallback to 'medicines' table if 'inventory' is not yet populated
          const medRes = await supabase
            .from('medicines')
            .select('*')
            .order('name', { ascending: true });

          if (!medRes.error && medRes.data && medRes.data.length > 0) {
            items = medRes.data.map(mapSupabaseRowToActiveRecord);
          }
        }
      }
    } catch (err) {
      console.warn('[useRealtimeInventory] Supabase fetch notice:', err);
    }

    // Strategy C: Always merge / fallback to local storage clinic store
    try {
      const local = getInventory();
      if (local && local.length > 0) {
        const localMapped = local.map(mapLocalToActiveRecord);
        if (items.length === 0) {
          items = localMapped;
        } else {
          // Append any local items not present in remote items
          const existingNames = new Set(items.map(i => `${i.medicine_name.toLowerCase()}_${i.potency.toLowerCase()}`));
          localMapped.forEach(l => {
            const key = `${l.medicine_name.toLowerCase()}_${l.potency.toLowerCase()}`;
            if (!existingNames.has(key)) {
              items.push(l);
            }
          });
        }
      }
    } catch (err) {
      console.warn('[useRealtimeInventory] Local clinicStore read notice:', err);
    }

    if (isMountedRef.current) {
      cachedInventoryList = items;
      setInventoryList(items);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchLiveInventory();

    // Subscribe to internal clinic store event updates
    const unsubscribeStore = subscribeToStore((event) => {
      if (event.type === 'inventory' || event.type === 'stock_logs') {
        fetchLiveInventory();
      }
    });

    // Supabase Realtime Channel Subscription
    const supabase = getSupabase();
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel('realtime_inventory_sync_all')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
          fetchLiveInventory();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'medicines' }, () => {
          fetchLiveInventory();
        })
        .subscribe();
    }

    const handleFocus = () => {
      fetchLiveInventory();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMountedRef.current = false;
      unsubscribeStore();
      window.removeEventListener('focus', handleFocus);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchLiveInventory]);

  const checkStock = useCallback(
    (remedyName: string, potency?: string, aliases?: string[]): MedicineStockStatus => {
      return checkMedicineStock(remedyName, potency, inventoryList, aliases);
    },
    [inventoryList]
  );

  return {
    inventoryList,
    isLoading,
    loading: isLoading,
    refreshInventory: fetchLiveInventory,
    checkStock
  };
}

/**
 * Match local inventory medicines by symptom, clinical indication, or remedy name against a search query
 */
export function findMatchingInventoryBySymptom(
  query: string,
  inventory: ActiveInventoryRecord[]
): ActiveInventoryRecord[] {
  if (!query || !inventory || inventory.length === 0) return [];
  const cleanQ = query.trim().toLowerCase();

  // Extract query keywords / tokens (length >= 2)
  const tokens = cleanQ
    .split(/[\s,+/।-]+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length >= 2);

  if (tokens.length === 0) return [];

  return inventory.filter((item) => {
    const medSymptom = (item.symptom || '').toLowerCase();
    const medName = (item.medicine_name || '').toLowerCase();
    const medCategory = (item.category || '').toLowerCase();

    // 1. Exact or substring match of full query in symptom or name
    if (medSymptom && (medSymptom.includes(cleanQ) || cleanQ.includes(medSymptom))) {
      return true;
    }
    if (medName && (medName.includes(cleanQ) || cleanQ.includes(medName))) {
      return true;
    }

    // 2. Token match in symptom or name
    const symptomMatch = tokens.some((token) => medSymptom.includes(token));
    const nameMatch = tokens.some((token) => medName.includes(token));

    return symptomMatch || nameMatch;
  });
}

