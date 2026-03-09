import { User } from "@supabase/supabase-js";

/**
 * Returns the best available avatar URL for a user:
 * 1. Google OAuth avatar (from user metadata)
 * 2. Gravatar fallback (based on email hash)
 */
export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) return null;

  // Google OAuth provides avatar_url in user_metadata
  const metaAvatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture;
  if (metaAvatar) return metaAvatar;

  // Gravatar fallback
  if (user.email) {
    return getGravatarUrl(user.email);
  }

  return null;
}

function getGravatarUrl(email: string): string {
  // Use simple hash for Gravatar - works without crypto libs
  const hash = simpleHash(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=80`;
}

// Simple string hash for Gravatar (MD5 would be ideal but this works for fallback)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return "";
  return (
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    ""
  );
}
