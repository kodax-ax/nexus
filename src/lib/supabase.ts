import { createClient } from '@supabase/supabase-js';

const sanitizeUrl = (url: string) => {
  if (!url) return '';
  // Robustly extract the first string that looks like a URL starting with http
  // This handles markdown [link](url) or just raw messy strings
  const match = url.match(/https?:\/\/[^\s)\]]+/);
  return match ? match[0].trim() : url.trim();
};

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = rawKey.trim();

// A valid Supabase URL typically follows the pattern: https://[project-id].supabase.co
export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('.supabase.co') && 
  !supabaseUrl.includes('placeholder')
);

// Fallback to a syntactically valid but unreachable URL if none provided to prevent initialization crash
// We use a localhost-like or clearly invalid domain to avoid triggering actual network requests to potentially dead projects
const FINAL_URL = supabaseUrl || 'https://invalid-setup.supabase.co';
const FINAL_KEY = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid';

export const supabase = createClient(FINAL_URL, FINAL_KEY);
