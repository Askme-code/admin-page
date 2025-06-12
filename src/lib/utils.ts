
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidFeaturedImageUrl(url?: string | null): string | null {
  if (!url || url.trim() === '') {
    return null;
  }
  try {
    const parsedUrl = new URL(url);
    // Disallow Google Image search result pages
    if (parsedUrl.hostname === 'images.app.goo.gl') {
      return null;
    }
    // Disallow base URLs unless it's a known placeholder service
    if (parsedUrl.pathname === '/' && parsedUrl.hostname !== 'placehold.co') {
      return null;
    }
    // Ensure it's http or https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }
    return url; // If it passes all checks, return the original URL
  } catch (e) {
    // Invalid URL format
    return null;
  }
}
