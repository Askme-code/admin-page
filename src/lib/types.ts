export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  featured_image?: string;
  status: 'draft' | 'published';
  author: string; // Could be a user ID or name
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  featured_image?: string;
  location?: string; // e.g., "Serengeti National Park" or GPS coordinates
  highlights?: string[];
  status: 'draft' | 'published';
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Event {
  id: string;
  title: string;
  slug: string; // Added for URL generation
  description: string;
  event_date: string; // ISO date string
  location: string;
  featured_image?: string;
  status: 'draft' | 'published';
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface TravelTip {
  id: string;
  title: string;
  slug: string; // Added for URL generation
  content: string;
  icon: string; // Suggests a specific icon name (e.g., from Lucide)
  category: string; // e.g., "Safety", "Packing", "Culture"
  status: 'draft' | 'published';
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  disabled?: boolean;
}
