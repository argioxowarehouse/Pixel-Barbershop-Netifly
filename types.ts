
export interface Branch {
  id: string;
  city: string;
  name: string;
  address: string;
  hours: string;
  mapUrl: string;
  image: string;
  whatsapp?: string;
  phone?: string;
}

export interface ServiceItem {
  name: string;
  icon: string;
  description?: string;
}

export interface Service {
  id: number;
  title: string;
  items: ServiceItem[];
  icon: string;
}

export interface Facility {
  id: number;
  name: string;
  icon: string;
}

export interface Job {
  id: number;
  title: string;
  type: string;
  requirements: string[];
  benefits?: string[];
  applyUrl?: string;
  customLink?: string;
  icon?: string;
}

export interface Course {
  id: number;
  title: string;
  duration: string;
  level: string;
  description: string;
  price: string;
  customLink?: string;
  icon?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  cover_image: string;
  created_at?: string;
}

export interface ContactMessage {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactSettings {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  bookingUrl: string;
  socials: SocialLink[];
}

export interface HeroSettings {
  subtitle: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  images: string[];
  galleryImages: string[];
  ctaText: string;
  websiteIcon: string;
  logo?: string;
  footerLogo?: string;
  serviceBackgroundImage: string;
}

export interface AboutSettings {
  subtitle: string;
  title: string;
  description1: string;
  description2: string;
  image: string;
  statsValue: string;
  statsLabel: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';
