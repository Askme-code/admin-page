
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
  auth?: boolean;
  noAuth?: boolean;
  isDropdownTrigger?: boolean;
  children?: NavItem[];
  action?: () => void;
  isSearch?: boolean;
  isButton?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'; // Added variant
  key?: string; // Added for explicit keying in maps
  isInteractive?: boolean; // for mobile nav, to differentiate non-clickable dropdown triggers
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

export interface UserReview {
  id: string;
  full_name: string;
  email: string;
  rating: number;
  review: string;
  location?: string;
  image_url?: string;
  status: 'pending' | 'published' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface YoutubeUpdate {
  id: string;
  caption: string;
  post_date: string;
  url: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

export interface PublicUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending_verification';
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: string; // UUID, matches
  title: string; // VARCHAR(150) NOT NULL, was 'name'
  description?: string | null; // TEXT, matches
  location?: string | null; // VARCHAR(100), matches
  price?: number | null; // DECIMAL(10, 2), matches
  image_url?: string | null; // TEXT, matches
  available_dates?: string[] | null; // DATE[]
  created_at: string; // TIMESTAMP, matches
  updated_at: string; // TIMESTAMP, new field
}

export interface TourBooking {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  tour_id: string;
  booking_date: string;
  tour_date: string;
  number_of_people: number;
  notes?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price?: number | null;
  created_at: string;
  updated_at: string;
  tours?: Tour; // Changed from 'name' to 'title' implicitly by Tour update
  users?: PublicUser;
}
