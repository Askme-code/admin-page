
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
  auth?: boolean; // Link shown only if authenticated
  noAuth?: boolean; // Link shown only if NOT authenticated
  isDropdownTrigger?: boolean; // Indicates this item is a trigger for a dropdown
  children?: NavItem[]; // Sub-items for a dropdown
  action?: () => void; // For items like Logout
  isSearch?: boolean; // Special type for rendering search bar
  isButton?: boolean; // Should it be styled as a button
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

// New types for User Auth and Booking
export interface PublicUser {
  id: string; // UUID from auth.users
  full_name: string;
  email: string;
  phone?: string;
  // password_hash is managed by Supabase Auth, not directly handled in client/frontend types typically
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending_verification';
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: string; // UUID
  name: string;
  description?: string | null;
  location?: string | null;
  price?: number | null;
  duration_hours?: number | null;
  image_url?: string | null;
  status: 'available' | 'unavailable' | 'archived';
  created_at: string;
}

export interface TourBooking {
  id: number; // Serial
  user_id: string; // UUID, references auth.users(id)
  full_name: string;
  email: string;
  phone?: string | null;
  tour_id: string; // UUID, references tours(id)
  booking_date: string; // Date
  tour_date: string; // Date
  number_of_people: number;
  notes?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price?: number | null;
  created_at: string;
  updated_at: string;
  tours?: Tour; // For joining data
  users?: PublicUser; // For joining data, if needed (though user_id links to auth.users)
}
