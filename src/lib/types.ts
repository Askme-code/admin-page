
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  featured_image?: string;
  status: 'draft' | 'published';
  author: string; 
  created_at: string; 
  updated_at: string; 
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  featured_image?: string;
  location?: string; 
  highlights?: string[];
  status: 'draft' | 'published';
  created_at: string; 
  updated_at: string; 
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string; 
  location: string;
  featured_image?: string;
  status: 'draft' | 'published';
  created_at: string; 
  updated_at: string; 
}

export interface TravelTip {
  id: string;
  title: string;
  content: string;
  icon: string; 
  category: string; 
  featured_image?: string; 
  status: 'draft' | 'published';
  created_at: string; 
  updated_at: string; 
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  disabled?: boolean;
}

export interface UserFeedback {
  id: string;
  full_name: string;
  email: string;
  interest_area?: string | null;
  referral_source?: string | null;
  message: string;
  created_at: string;
}
