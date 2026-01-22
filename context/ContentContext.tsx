
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { Service, Branch, Job, Course, ContactSettings, SyncStatus, User, HeroSettings, AboutSettings, Facility, BlogPost, ContactMessage } from '../types';

const SUPABASE_URL = 'https://syavzgtwbwnvasnnjxsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5YXZ6Z3R3YndudmFzbm5qeHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MzMxNTksImV4cCI6MjA4NDEwOTE1OX0.Yblmz1eoOUgkl9n4nCYynC3aGrAczQX67KMszEepsFM';

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
}

const BUCKET_NAME = 'site-assets';

interface ContentContextType {
  session: Session | null;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  facilities: Facility[];
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  contactSettings: ContactSettings;
  setContactSettings: React.Dispatch<React.SetStateAction<ContactSettings>>;
  heroSettings: HeroSettings;
  setHeroSettings: React.Dispatch<React.SetStateAction<HeroSettings>>;
  aboutSettings: AboutSettings;
  setAboutSettings: React.Dispatch<React.SetStateAction<AboutSettings>>;
  syncStatus: SyncStatus;
  publishToCloud: () => Promise<void>;
  publishBlogPosts: () => Promise<void>;
  fetchFromCloud: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  sendMessage: (msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) => Promise<boolean>;
  updateMessageStatus: (id: string | number, isRead: boolean) => Promise<void>;
  deleteMessage: (id: string | number) => Promise<void>;
  uploadFile: (file: File) => Promise<string | null>;
  signIn: (email: string, pass: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);
  
  // DEFAULT DATA INITIALIZATION
  const [services, setServices] = useState<Service[]>([
    { id: 1, title: "Signature Haircut", icon: "Scissors", items: [
      { name: "Executive Haircut", description: "Potongan rambut premium dengan cuci rambut, pijat kepala, dan styling.", icon: "Check" },
      { name: "Classic Cut", description: "Gaya klasik timeless dengan sentuhan modern.", icon: "Check" }
    ]},
    { id: 2, title: "Beard & Grooming", icon: "Zap", items: [
      { name: "Traditional Shave", description: "Cukur tradisional menggunakan handuk hangat.", icon: "Check" },
      { name: "Beard Trimming", description: "Perapihan jenggot sesuai bentuk wajah.", icon: "Check" }
    ]}
  ]);

  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 1, name: "Premium Lounge", icon: "Coffee" },
    { id: 2, name: "High-Speed WiFi", icon: "Wifi" },
    { id: 3, name: "Air Conditioned", icon: "Thermometer" },
    { id: 4, name: "Free Soft Drink", icon: "Droplets" }
  ]);

  const [branches, setBranches] = useState<Branch[]>([
    { id: "1", city: "Sukabumi", name: "Pixel Pusat", address: "Jl. Ahmad Yani No. 125", hours: "10:00 - 21:00", mapUrl: "", image: "", whatsapp: "08123456789" }
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: "Senior Barber", type: "Full-Time", requirements: ["Pengalaman min 2 tahun", "Mahir berbagai gaya rambut", "Komunikatif"] }
  ]);

  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: "Basic Barbering", duration: "12 Sesi", level: "Beginner", description: "Belajar teknik dasar memotong rambut dari nol.", price: "Rp 3.500.000" }
  ]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    address: "Jl. Jend. Ahmad Yani No. 125, Sukabumi, Jawa Barat",
    phone: "0812-3456-7890",
    email: "hello@pixelbarbershop.com",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.678486018318!2d106.9248731!3d-6.9290076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e684824578b668d%3A0x77c68837e403d15!2sSukabumi%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid",
    bookingUrl: "https://wa.me/6281234567890",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/pixelbarber", icon: "fi fi-brands-instagram" },
      { platform: "Facebook", url: "https://facebook.com/pixelbarber", icon: "fi fi-brands-facebook" }
    ]
  });

  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    subtitle: "",
    titlePart1: "",
    titlePart2: "",
    description: "",
    ctaText: "Booking Sekarang",
    websiteIcon: "https://syavzgtwbwnvasnnjxsn.supabase.co/storage/v1/object/public/site-assets/favicon.png",
    logo: "",
    footerLogo: "",
    serviceBackgroundImage: "",
    images: [],
    galleryImages: []
  });

  const [aboutSettings, setAboutSettings] = useState<AboutSettings>({
    subtitle: "Kisah Kami",
    title: "Presisi di Setiap Potongan",
    description1: "Berdiri sejak 2020, Pixel Barbershop berdedikasi untuk memberikan pengalaman grooming yang tak terlupakan bagi setiap pria.",
    description2: "Kami percaya bahwa rambut adalah mahkota pria, dan setiap detail kecil sangatlah berharga.",
    image: "",
    statsValue: "5,000+",
    statsLabel: "Pelanggan Puas"
  });

  const isConfigured = !!supabase;

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchFromCloud();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  const fetchFromCloud = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('site_content').select('content').eq('id', 1).single();
      if (!error && data?.content) {
        const c = data.content;
        if (c.services) setServices(c.services);
        if (c.facilities) setFacilities(c.facilities);
        if (c.branches) setBranches(c.branches);
        if (c.jobs) setJobs(c.jobs);
        if (c.courses) setCourses(c.courses);
        if (c.contactSettings) setContactSettings(c.contactSettings);
        if (c.heroSettings) setHeroSettings(c.heroSettings);
        if (c.aboutSettings) setAboutSettings(c.aboutSettings);
      }

      const { data: blogData } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
      if (blogData) setBlogPosts(blogData);
    } catch (e) {
      console.error("Cloud Fetch Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, pass: string) => {
    if (!supabase) return { error: 'Supabase not initialized' };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setMessages([]);
  };

  const fetchMessages = async () => {
    if (!supabase || !session) return;
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setMessages(data);
      }
    } catch (e) {
      console.error("Fetch Messages Error:", e);
    }
  };

  const sendMessage = async (msg: any) => {
    if (!supabase) return false;
    const { error } = await supabase.from('contact_messages').insert([{ ...msg, is_read: false }]);
    return !error;
  };

  const updateMessageStatus = async (id: any, isRead: boolean) => {
    if (!supabase || !session) return;
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead } : m));
    await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  };

  const deleteMessage = async (id: any) => {
    if (!supabase || !session) return;
    try {
      const numericId = !isNaN(Number(id)) ? Number(id) : id;
      const { error } = await supabase.from('contact_messages').delete().eq('id', numericId);
      if (error) throw error;
      await fetchMessages();
    } catch (err: any) {
      console.error("Delete Error:", err);
      throw err;
    }
  };

  const publishToCloud = async () => {
    if (!supabase || !session) return;
    setSyncStatus('syncing');
    
    try {
      // 1. Simpan Konten Situs Umum
      const content = { services, facilities, branches, jobs, courses, contactSettings, heroSettings, aboutSettings };
      const { error: siteError } = await supabase.from('site_content').upsert({ id: 1, content });
      
      if (siteError) throw siteError;

      // 2. Simpan Postingan Blog secara terpisah ke tabel blog_posts
      if (blogPosts.length > 0) {
        const postsToUpload = blogPosts.map(({ created_at, ...rest }) => ({
          ...rest,
          id: String(rest.id)
        }));
        const { error: blogError } = await supabase.from('blog_posts').upsert(postsToUpload);
        if (blogError) throw blogError;
      }

      setSyncStatus('success');
    } catch (err) {
      console.error("Publishing Error:", err);
      setSyncStatus('error');
    }

    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const publishBlogPosts = async () => {
    // Fungsi ini sekarang terintegrasi di publishToCloud untuk kenyamanan
    await publishToCloud();
  };

  const uploadFile = async (file: File) => {
    if (!supabase || !session) return null;
    const filePath = `uploads/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);
    if (error) return null;
    return supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath).data.publicUrl;
  };

  return (
    <ContentContext.Provider value={{ 
      session, services, setServices, facilities, setFacilities, branches, setBranches, jobs, setJobs, 
      courses, setCourses, blogPosts, setBlogPosts, messages, setMessages, contactSettings, setContactSettings,
      heroSettings, setHeroSettings, aboutSettings, setAboutSettings,
      syncStatus,
      publishToCloud, publishBlogPosts, fetchFromCloud,
      fetchMessages, sendMessage, updateMessageStatus, deleteMessage,
      uploadFile, signIn, signOut, isConfigured, isLoading
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
