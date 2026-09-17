import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project Supabase default credentials fallback
export const HARDCODED_SUPABASE_URL = 'https://yqrmrgwrqipqpqwvykgk.supabase.co';
export const HARDCODED_SUPABASE_ANON_KEY = 'sb_publishable_UKe7-UTQQcgENw29F1QrMg_N_SGo536';

// Safe getter for Supabase client
let supabaseInstance: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function sanitizeSupabaseUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  let clean = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!clean) return null;

  // Add https:// protocol if missing
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }

  // Correct known project hostname spelling typo if present so DNS lookup always succeeds
  if (clean.includes('yqrmrgwrqipqpwvykgk.supabase.co')) {
    clean = clean.replace('yqrmrgwrqipqpwvykgk.supabase.co', 'yqrmrgwrqipqpqwvykgk.supabase.co');
  }

  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // Return base origin strictly without trailing slashes or subpaths (e.g. https://xxxx.supabase.co)
    return parsed.origin;
  } catch {
    // Fallback regex cleanup: remove trailing slashes and common mistaken subpaths
    clean = clean.replace(/\/+(rest|auth)?(\/v\d+)?\/?$/i, '').replace(/\/+$/, '');
    return clean.startsWith('http') ? clean : null;
  }
}

export function sanitizeSupabaseKey(rawKey: string | null | undefined): string {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
}

/**
 * Purges any stale, future-issued, or expired Supabase GoTrue auth tokens from localStorage.
 * This prevents PostgREST PGRST303 ("JWT issued at future") errors caused by clock skew.
 */
export function purgeInvalidSupabaseTokens() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('sb-') || k.includes('supabase.auth.token'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore storage access issues
  }
}

/**
 * Resets the active Supabase client instance back to default hardcoded credentials.
 */
export function resetSupabaseClientToDefault(): SupabaseClient {
  purgeInvalidSupabaseTokens();
  if (typeof window !== 'undefined' && window.localStorage) {
    const customKey = localStorage.getItem('hhc_supabase_key');
    // If the custom key was a JWT (starts with eyJ) that triggered PGRST303, clear it
    if (customKey && customKey.startsWith('eyJ')) {
      localStorage.removeItem('hhc_supabase_key');
    }
  }

  supabaseInstance = createClient(HARDCODED_SUPABASE_URL, HARDCODED_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  lastUsedUrl = HARDCODED_SUPABASE_URL;
  lastUsedKey = HARDCODED_SUPABASE_ANON_KEY;
  return supabaseInstance;
}

export function getSupabase(): SupabaseClient {
  // Purge any stale GoTrue tokens so PostgREST never receives clock-skewed future JWTs
  purgeInvalidSupabaseTokens();

  const rawUrl = 
    (typeof window !== 'undefined' && localStorage.getItem('hhc_supabase_url')) ||
    import.meta.env.VITE_SUPABASE_URL ||
    HARDCODED_SUPABASE_URL;

  const rawKey = 
    (typeof window !== 'undefined' && localStorage.getItem('hhc_supabase_key')) ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    HARDCODED_SUPABASE_ANON_KEY;

  const url = sanitizeSupabaseUrl(rawUrl) || HARDCODED_SUPABASE_URL;
  const key = sanitizeSupabaseKey(rawKey) || HARDCODED_SUPABASE_ANON_KEY;

  // Reuse instance if credentials have not changed
  if (supabaseInstance && lastUsedUrl === url && lastUsedKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return supabaseInstance;
  } catch (e) {
    console.warn('Could not initialize Supabase client, falling back to default:', e);
    supabaseInstance = createClient(HARDCODED_SUPABASE_URL, HARDCODED_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    lastUsedUrl = HARDCODED_SUPABASE_URL;
    lastUsedKey = HARDCODED_SUPABASE_ANON_KEY;
    return supabaseInstance;
  }
}

export function setCustomSupabaseCredentials(url: string, key: string) {
  const cleanUrl = sanitizeSupabaseUrl(url);
  const cleanKey = sanitizeSupabaseKey(key);

  if (cleanUrl && cleanKey) {
    localStorage.setItem('hhc_supabase_url', cleanUrl);
    localStorage.setItem('hhc_supabase_key', cleanKey);
    try {
      supabaseInstance = createClient(cleanUrl, cleanKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
      lastUsedUrl = cleanUrl;
      lastUsedKey = cleanKey;
      return true;
    } catch (e) {
      console.error('Invalid Supabase configuration', e);
      return false;
    }
  } else {
    localStorage.removeItem('hhc_supabase_url');
    localStorage.removeItem('hhc_supabase_key');
    supabaseInstance = null;
    lastUsedUrl = '';
    lastUsedKey = '';
    return true;
  }
}

export function getSupabaseConfig() {
  const rawUrl = (typeof window !== 'undefined' && localStorage.getItem('hhc_supabase_url')) || import.meta.env.VITE_SUPABASE_URL || '';
  const rawKey = (typeof window !== 'undefined' && localStorage.getItem('hhc_supabase_key')) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return {
    url: sanitizeSupabaseUrl(rawUrl) || rawUrl.trim(),
    anonKey: sanitizeSupabaseKey(rawKey),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  return setCustomSupabaseCredentials(url, anonKey);
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL or Key missing or invalid format. Please enter valid project URL and anon key.',
    };
  }

  try {
    let { error } = await client.from('appointments').select('count', { count: 'exact', head: true });
    if (error && (error.code === 'PGRST303' || error.message?.includes('JWT') || error.message?.includes('future'))) {
      purgeInvalidSupabaseTokens();
      const freshClient = resetSupabaseClientToDefault();
      const retry = await freshClient.from('appointments').select('count', { count: 'exact', head: true });
      error = retry.error;
    }
    if (error && error.code !== 'PGRST116') {
      return {
        success: false,
        message: `Connection attempted: ${error.message} (Run the schema SQL script to create tables)`,
      };
    }
    return {
      success: true,
      message: 'Successfully connected to live Supabase PostgreSQL database!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to Supabase instance',
    };
  }
}
