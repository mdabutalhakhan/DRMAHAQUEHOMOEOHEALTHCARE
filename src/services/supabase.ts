import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

export function getSupabase(): SupabaseClient | null {
  const rawUrl = (typeof window !== 'undefined' && localStorage.getItem('hhc_supabase_url')) || import.meta.env.VITE_SUPABASE_URL;
  const rawKey = (typeof window !== 'undefined' && localStorage.getItem('hhc_supabase_key')) || import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = sanitizeSupabaseUrl(rawUrl);
  const key = sanitizeSupabaseKey(rawKey);

  if (!url || !key) {
    supabaseInstance = null;
    lastUsedUrl = '';
    lastUsedKey = '';
    return null;
  }

  // Reuse instance if credentials have not changed
  if (supabaseInstance && lastUsedUrl === url && lastUsedKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return supabaseInstance;
  } catch (e) {
    console.warn('Could not initialize Supabase client:', e);
    supabaseInstance = null;
    lastUsedUrl = '';
    lastUsedKey = '';
    return null;
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
          persistSession: true,
          autoRefreshToken: true,
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
    const { error } = await client.from('appointments').select('count', { count: 'exact', head: true });
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
