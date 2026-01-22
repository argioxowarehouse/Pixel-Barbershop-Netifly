
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { 
  Plus, Trash2, X, Map as MapIcon, 
  Phone, CloudUpload, Loader2, Sparkles, Database,
  LayoutDashboard, Settings, Eye, Home as HomeIcon, Image as ImageIcon,
  Upload, Scissors as ScissorsIcon, AlignLeft, Briefcase, List, Camera,
  Info, Mail, Link, PlusCircle, Smile, BookOpen, Monitor, Smartphone, Square, AlignJustify,
  Zap, Star, Palette, User, Droplets, CloudRain, Circle, UserCheck, Coffee, Layers, 
  ArrowDown, ArrowUp, Wind, AlignJustify as AlignJustifyIcon, Heart, Feather, Moon, Sun, RefreshCw, Wifi, Thermometer, Shield,
  PenTool, FileText, Globe, ExternalLink, Navigation, Instagram, Facebook, Youtube, Copy, Download, Code, Box, MessageSquare, Check, EyeOff,
  Search, Filter, ChevronRight, Calendar, RefreshCcw, Type, AlertTriangle,
  Award, TrendingUp, MapPin, Building, GripVertical
} from 'lucide-react';
import { Service, Branch, Job, Course, SocialLink, User as UserType, HeroSettings, AboutSettings, ServiceItem, Facility, ContactSettings, BlogPost, ContactMessage } from '../types';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any, mimeType: string = 'image/webp'): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.85);
  });
}

const AVAILABLE_ICONS = [
  "Scissors", "Zap", "Sparkles", "Star", "Palette", "User", "Droplets", 
  "Smile", "CloudRain", "Circle", "UserCheck", "Coffee", "Layers", 
  "ArrowDown", "ArrowUp", "Wind", "AlignJustify", "Heart", "Feather", 
  "Moon", "Sun", "RefreshCw", "Wifi", "Thermometer", "Shield", "Home", "MapIcon", "Briefcase", "BookOpen", "Award", "TrendingUp"
];

const IconRenderer = ({ name, size = 18, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, any> = {
    Scissors: ScissorsIcon, Zap, Sparkles, Star, Palette, User, Droplets, 
    Smile, CloudRain, Circle, UserCheck, Coffee, Layers, 
    ArrowDown, ArrowUp, Wind, AlignJustify: AlignJustifyIcon, Heart, Feather, 
    Moon, Sun, RefreshCw, Wifi, Thermometer, Shield, Home: HomeIcon, MapIcon, Briefcase, BookOpen, Award, TrendingUp
  };
  
  const trimmed = name ? name.trim() : '';
  if (trimmed.startsWith('<svg')) {
    return (
      <div 
        className={`flex items-center justify-center [&>svg]:w-full [&>svg]:h-full ${className}`}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: trimmed }} 
      />
    );
  }

  const IconComp = icons[trimmed] || ScissorsIcon;
  return <IconComp size={size} className={className} />;
};

interface AdminDashboardProps {
  onLogout: () => void;
  onTogglePreview?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onTogglePreview }) => {
  const { 
    services, setServices, 
    facilities, setFacilities,
    branches, setBranches,
    jobs, setJobs,
    courses, setCourses,
    blogPosts, setBlogPosts,
    messages, updateMessageStatus, deleteMessage, fetchMessages,
    heroSettings, setHeroSettings,
    aboutSettings, setAboutSettings,
    contactSettings, setContactSettings,
    syncStatus,
    publishToCloud,
    publishBlogPosts,
    uploadFile
  } = useContent();

  const [activeTab, setActiveTab] = useState<'overview' | 'home' | 'blog' | 'services' | 'facilities' | 'about' | 'branches' | 'academy' | 'careers' | 'contact' | 'messages'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<{ 
    isOpen: boolean, 
    title: string, 
    message: string, 
    onConfirm: () => void,
    isLoading?: boolean
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [iconPicker, setIconPicker] = useState<{ 
    isOpen: boolean, 
    customSvg: string,
    target: { type: 'category' | 'item' | 'facility' | 'job' | 'course', catId?: number, itemIdx?: number, facId?: number, jobId?: number, courseId?: number } | null 
  }>({ isOpen: false, customSvg: '', target: null });

  // Drag and Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragType, setDragType] = useState<'hero' | 'gallery' | null>(null);

  const [branchModal, setBranchModal] = useState<{ isOpen: boolean; selectedCity: string; newCity: string; isNewCityMode: boolean }>({
    isOpen: false,
    selectedCity: '',
    newCity: '',
    isNewCityMode: false
  });

  const [editorModal, setEditorModal] = useState<{ isOpen: boolean; image: string; aspect: number; type: 'hero' | 'icon' | 'logo' | 'footerLogo' | 'about' | 'serviceBg' | 'gallery' | 'blog_cover' | 'social_icon'; blogId?: string; socialIdx?: number }>({
    isOpen: false, image: '', aspect: 16 / 9, type: 'hero'
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const serviceBgInputRef = useRef<HTMLInputElement>(null);
  const blogCoverInputRef = useRef<HTMLInputElement>(null);
  const socialIconInputRef = useRef<HTMLInputElement>(null);

  const [currentBlogToEdit, setCurrentBlogToEdit] = useState<string | null>(null);
  const [currentSocialIdx, setCurrentSocialIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const handleRefreshMessages = async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: any, id?: string | number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      let aspect = 16 / 9;
      if (type === 'about') aspect = 4 / 5;
      else if (type === 'icon' || type === 'logo' || type === 'social_icon') aspect = 1;
      else if (type === 'footerLogo') aspect = 3 / 1; 
      else if (type === 'gallery') aspect = 3 / 4;
      else if (type === 'blog_cover') aspect = 16 / 10;
      else if (type === 'serviceBg') aspect = 16 / 9;

      setEditorModal({
        isOpen: true,
        image: reader.result as string,
        aspect,
        type,
        blogId: type === 'blog_cover' ? String(id) : undefined,
        socialIdx: type === 'social_icon' ? Number(id) : undefined
      });
    });
    reader.readAsDataURL(file);
    // Reset value to allow same file re-selection
    e.target.value = '';
  };

  const processAndUpload = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(editorModal.image, croppedAreaPixels, 'image/webp');
      if (!croppedBlob) return;
      
      const compressedFile = await imageCompression(new File([croppedBlob], 'upload.webp', { type: 'image/webp' }), { 
        maxSizeMB: 0.2, useWebWorker: true, fileType: 'image/webp'
      });

      const publicUrl = await uploadFile(compressedFile);
      if (publicUrl) {
        if (editorModal.type === 'hero') setHeroSettings(p => ({ ...p, images: [...p.images, publicUrl] }));
        else if (editorModal.type === 'gallery') setHeroSettings(p => ({ ...p, galleryImages: [...p.galleryImages, publicUrl] }));
        else if (editorModal.type === 'logo') setHeroSettings(p => ({ ...p, logo: publicUrl }));
        else if (editorModal.type === 'footerLogo') setHeroSettings(p => ({ ...p, footerLogo: publicUrl }));
        else if (editorModal.type === 'icon') setHeroSettings(p => ({ ...p, websiteIcon: publicUrl }));
        else if (editorModal.type === 'about') setAboutSettings(p => ({ ...p, image: publicUrl }));
        else if (editorModal.type === 'serviceBg') setHeroSettings(p => ({ ...p, serviceBackgroundImage: publicUrl }));
        else if (editorModal.type === 'blog_cover' && editorModal.blogId) setBlogPosts(b => b.map(x => x.id === editorModal.blogId ? { ...x, cover_image: publicUrl } : x));
        else if (editorModal.type === 'social_icon' && typeof editorModal.socialIdx === 'number') {
          setContactSettings(prev => ({
            ...prev, socials: prev.socials.map((s, i) => i === editorModal.socialIdx ? { ...s, icon: publicUrl } : s)
          }));
        }
      }
      setEditorModal({ ...editorModal, isOpen: false });
    } catch (e) {
      console.error("Image processing error:", e);
    } finally { setIsUploading(false); }
  };

  const handleDeleteMessage = async (id: any) => {
    setConfirmModal({
      isOpen: true, title: "Hapus Pesan", message: "Hapus pesan ini secara permanen?", isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmModal(p => ({ ...p, isLoading: true }));
          await deleteMessage(id);
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
          setSelectedMessage(null);
        } catch (e) { setConfirmModal(p => ({ ...p, isLoading: false })); }
      }
    });
  };

  const updateHero = (field: keyof HeroSettings, value: any) => setHeroSettings(prev => ({ ...prev, [field]: value }));
  const updateAbout = (field: keyof AboutSettings, value: any) => setAboutSettings(prev => ({ ...prev, [field]: value }));
  const updateContact = (field: keyof ContactSettings, value: any) => setContactSettings(prev => ({ ...prev, [field]: value }));

  const applyIconSelection = (iconValue: string) => {
    const t = iconPicker.target;
    if (!t) return;
    
    if (t.type === 'category') setServices(s => s.map(x => x.id === t.catId ? { ...x, icon: iconValue } : x));
    else if (t.type === 'facility') setFacilities(f => f.map(x => x.id === t.facId ? { ...x, icon: iconValue } : x));
    else if (t.type === 'job') setJobs(j => j.map(x => x.id === t.jobId ? { ...x, icon: iconValue } : x));
    else if (t.type === 'course') setCourses(c => c.map(x => x.id === t.courseId ? { ...x, icon: iconValue } : x));
    
    setIconPicker({ isOpen: false, customSvg: '', target: null });
  };

  const filteredMessages = messages.filter(m => {
    if (messageFilter === 'unread') return !m.is_read;
    if (messageFilter === 'read') return m.is_read;
    return true;
  });

  // Unique list of cities for selection
  const existingCities = Array.from(new Set(branches.map(b => b.city))).sort();

  const handleAddNewBranch = () => {
    const city = branchModal.isNewCityMode ? branchModal.newCity.trim() : branchModal.selectedCity;
    if (!city) {
      alert("Harap pilih atau tentukan kota terlebih dahulu.");
      return;
    }
    
    const newBranch: Branch = {
      id: String(Date.now()),
      name: "Pixel Cabang Baru",
      city: city,
      address: "Alamat belum ditentukan",
      hours: "10:00 - 21:00",
      mapUrl: "",
      image: "",
      whatsapp: ""
    };
    
    setBranches([newBranch, ...branches]);
    setBranchModal({ isOpen: false, selectedCity: '', newCity: '', isNewCityMode: false });
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number, type: 'hero' | 'gallery') => {
    setDraggedItemIndex(index);
    setDragType(type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, type: 'hero' | 'gallery') => {
    e.preventDefault();
    if (draggedItemIndex === null || dragType !== type || draggedItemIndex === targetIndex) return;

    if (type === 'hero') {
      const items = [...heroSettings.images];
      const [draggedItem] = items.splice(draggedItemIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateHero('images', items);
    } else {
      const items = [...heroSettings.galleryImages];
      const [draggedItem] = items.splice(draggedItemIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateHero('galleryImages', items);
    }

    setDraggedItemIndex(null);
    setDragType(null);
  };

  // Grouping logic for rendering the branches list
  const groupedBranches = branches.reduce((acc: Record<string, Branch[]>, branch) => {
    const city = branch.city || 'Lainnya';
    if (!acc[city]) acc[city] = [];
    acc[city].push(branch);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-gray-700">
      
      {/* Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-sm:px-6 max-w-sm rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{confirmModal.title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">{confirmModal.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmModal.onConfirm} disabled={confirmModal.isLoading} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-red-900/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                {confirmModal.isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                {confirmModal.isLoading ? "Menghapus..." : "Hapus Sekarang"}
              </button>
              <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} disabled={confirmModal.isLoading} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-200 transition-all">Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Changed bg-slate-900 to bg-[#052e28] */}
      <aside className="w-full md:w-64 bg-[#052e28] text-white p-6 flex flex-col shrink-0">
        <div className="flex items-center justify-center mb-12 p-4 bg-black/10 rounded-2xl shadow-inner border border-white/5">
          {heroSettings.footerLogo ? (
            <img 
              src={heroSettings.footerLogo} 
              alt="Pixel Logo" 
              className="h-14 w-auto object-contain transition-all" 
            />
          ) : heroSettings.logo ? (
             <img 
              src={heroSettings.logo} 
              alt="Pixel Logo" 
              className="h-10 w-auto object-contain filter brightness-0 invert" 
            />
          ) : (
            <>
              <div className="p-2.5 bg-[#0c7565] rounded-xl"><LayoutDashboard size={20} /></div>
              <span className="text-xl font-bold tracking-tight ml-2">PIXEL <span className="text-[#0c7565] font-light">CMS</span></span>
            </>
          )}
        </div>
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard', icon: <Database size={17} /> },
            { id: 'messages', label: 'Kotak Masuk', icon: <MessageSquare size={17} />, badge: messages.filter(m => !m.is_read).length },
            { id: 'home', label: 'Tampilan Website', icon: <HomeIcon size={17} /> },
            { id: 'blog', label: 'Blog & Berita', icon: <PenTool size={17} /> },
            { id: 'services', label: 'Layanan', icon: <ScissorsIcon size={17} /> },
            { id: 'facilities', label: 'Fasilitas', icon: <Box size={17} /> },
            { id: 'about', label: 'Tentang Kami', icon: <AlignLeft size={17} /> },
            { id: 'branches', label: 'Cabang', icon: <MapIcon size={17} /> },
            { id: 'academy', label: 'Academy', icon: <BookOpen size={17} /> },
            { id: 'careers', label: 'Karir', icon: <Briefcase size={17} /> },
            { id: 'contact', label: 'Info & Sosmed', icon: <Settings size={17} /> },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-semibold transition-all ${activeTab === item.id ? 'bg-[#0c7565] text-white shadow-lg shadow-teal-900/40' : 'text-emerald-100/60 hover:text-white hover:bg-white/5'}`}>
              <div className="flex items-center gap-3.5">
                {item.icon} {item.label}
              </div>
              {item.badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">{item.badge}</span> : null}
            </button>
          ))}
          <button onClick={onTogglePreview} className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[13px] font-bold text-emerald-400 hover:bg-white/5 transition-all mt-4 border border-emerald-900/30">
            <Eye size={17} /> Lihat Website
          </button>
        </nav>
        <div className="mt-8 pt-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-4 text-[13px] font-bold text-red-400 hover:bg-red-400/5 rounded-2xl transition-all"><X size={18} /> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen bg-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{activeTab.toUpperCase()}</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Sistem Kontrol Konten Pixel.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={publishToCloud} disabled={syncStatus === 'syncing'} className="flex items-center gap-3 px-7 py-4 bg-slate-800 text-white rounded-2xl text-[13px] font-bold shadow-xl hover:bg-slate-700 disabled:opacity-50">
              {syncStatus === 'syncing' ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />} Update Website
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 min-h-[600px]">
          
          {/* TAB OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="py-20 text-center space-y-8">
               <div className="inline-flex p-8 bg-emerald-50 rounded-[2.5rem] text-[#0c7565] shadow-xl shadow-emerald-900/5"><Sparkles size={64} /></div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pixel Control Panel</h2>
               <p className="text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">Panel Kontrol Barbershop Premium Anda.</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-10">
                  <div className="bg-white p-10 rounded-[3rem] text-center border-2 border-slate-100 hover:border-[#0c7565] transition-all hover:shadow-2xl shadow-sm">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pesan Masuk</p>
                     <p className="text-5xl font-black text-red-500">{messages.filter(m => !m.is_read).length}</p>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] text-center border-2 border-slate-100 hover:border-[#0c7565] transition-all hover:shadow-2xl shadow-sm">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Layanan</p>
                     <p className="text-5xl font-black text-slate-900">{services.reduce((acc, s) => acc + s.items.length, 0)}</p>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] text-center border-2 border-slate-100 hover:border-[#0c7565] transition-all hover:shadow-2xl shadow-sm">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Postingan Blog</p>
                     <p className="text-5xl font-black text-slate-900">{blogPosts.length}</p>
                  </div>
               </div>
            </div>
          )}

          {/* TAB MESSAGES (KOTAK MASUK) */}
          {activeTab === 'messages' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black">Kotak Masuk</h3>
                  <button onClick={handleRefreshMessages} className={`p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-[#0c7565] transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
                    <RefreshCcw size={18} />
                  </button>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  {(['all', 'unread', 'read'] as const).map(f => (
                    <button key={f} onClick={() => setMessageFilter(f)} className={`px-4 py-2 text-[10px] font-bold uppercase rounded-xl transition-all ${messageFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                {filteredMessages.length > 0 ? filteredMessages.map(msg => (
                  <div key={msg.id} className={`group p-6 rounded-[2rem] border transition-all flex items-center justify-between gap-6 ${msg.is_read ? 'bg-white border-slate-100' : 'bg-emerald-50/40 border-emerald-100 shadow-sm'}`}>
                     <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${msg.is_read ? 'bg-slate-100 text-slate-400' : 'bg-[#0c7565] text-white shadow-lg'}`}>
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-slate-900 truncate max-w-[150px]">{msg.name}</h4>
                             {!msg.is_read && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">NEW</span>}
                           </div>
                           <p className="text-xs text-slate-400 truncate max-w-[200px]">{msg.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteMessage(msg.id); }} className="p-4 text-slate-300 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-sm bg-white" title="Hapus Pesan"><Trash2 size={18} /></button>
                        <button onClick={() => setSelectedMessage(msg)} className="p-4 text-slate-300 hover:text-[#0c7565] hover:bg-emerald-50 rounded-2xl transition-all shadow-sm bg-white"><ChevronRight size={18} /></button>
                     </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-400 italic font-medium">Belum ada pesan masuk.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB HOME (Hero, Slider, Logos, Gallery) */}
          {activeTab === 'home' && (
            <div className="space-y-16">
               <div className="space-y-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Identitas Visual</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3 text-center">
                        <label className="text-[11px] font-black uppercase text-slate-400">Logo Navbar (Utama)</label>
                        <div className="w-full aspect-square bg-slate-50 rounded-[2.5rem] flex items-center justify-center p-6 relative group border-2 border-dashed border-slate-200 shadow-sm">
                           {heroSettings.logo ? <img src={heroSettings.logo} className="max-h-full" /> : <ImageIcon className="text-slate-200" size={40} />}
                           <button onClick={() => logoInputRef.current?.click()} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-[2.5rem] text-[10px] font-black transition-all">GANTI LOGO</button>
                        </div>
                      </div>
                      <div className="space-y-3 text-center">
                        <label className="text-[11px] font-black uppercase text-slate-400">Logo Footer (Landscape)</label>
                        <div className="w-full aspect-square bg-slate-50 rounded-[2.5rem] flex items-center justify-center p-6 relative group border-2 border-dashed border-slate-200 shadow-sm">
                           {heroSettings.footerLogo ? <img src={heroSettings.footerLogo} className="max-h-full" /> : <ImageIcon className="text-slate-200" size={40} />}
                           <button onClick={() => footerLogoInputRef.current?.click()} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-[2.5rem] text-[10px] font-black transition-all">GANTI LOGO</button>
                        </div>
                      </div>
                      <div className="space-y-3 text-center">
                        <label className="text-[11px] font-black uppercase text-[#0c7565]">Favicon (Ikon Tab Browser)</label>
                        <div className="w-full aspect-square bg-emerald-50 rounded-[2.5rem] flex items-center justify-center p-6 relative group border-2 border-emerald-200/50 shadow-md">
                           {heroSettings.websiteIcon ? <img src={heroSettings.websiteIcon} className="w-16 h-16" /> : <Monitor className="text-emerald-100" size={40} />}
                           <button onClick={() => iconInputRef.current?.click()} className="absolute inset-0 bg-emerald-600/70 text-white opacity-0 group-hover:opacity-100 rounded-[2.5rem] text-[10px] font-black transition-all">GANTI FAVICON</button>
                        </div>
                      </div>
                  </div>
               </div>

               <div className="space-y-8 pt-8 border-t border-slate-100">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Konten Hero Beranda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Subtitle Hero</label>
                           <input value={heroSettings.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none border border-slate-200" placeholder="Premium Experience" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Judul Baris 1</label>
                              <input value={heroSettings.titlePart1} onChange={(e) => updateHero('titlePart1', e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black uppercase outline-none border border-slate-200" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Judul Baris 2</label>
                              <input value={heroSettings.titlePart2} onChange={(e) => updateHero('titlePart2', e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black uppercase outline-none border border-slate-200" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black uppercase text-[#0c7565] ml-1">Latar Belakang Bagian Layanan</label>
                           <div className="w-full aspect-video bg-slate-100 rounded-[2rem] relative overflow-hidden group border-2 border-slate-200">
                              {heroSettings.serviceBackgroundImage ? <img src={heroSettings.serviceBackgroundImage} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300">Kosong</div>}
                              <button onClick={() => serviceBgInputRef.current?.click()} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center font-black gap-2 transition-all"><Camera size={24} /><span className="text-xs">GANTI BACKGROUND</span></button>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Deskripsi Utama Hero</label>
                           <textarea rows={6} value={heroSettings.description} onChange={(e) => updateHero('description', e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl text-sm font-medium outline-none border border-slate-200 leading-relaxed" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Teks Tombol (CTA)</label>
                           <input value={heroSettings.ctaText} onChange={(e) => updateHero('ctaText', e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none border border-slate-200" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-8 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Slider Foto Beranda</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarik dan lepas foto untuk mengatur urutan tampilan.</p>
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3.5 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20"><Plus size={18} /> Tambah Foto</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {heroSettings.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx, 'hero')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx, 'hero')}
                        className={`aspect-video rounded-[2rem] overflow-hidden relative group border-2 transition-all hover:border-[#0c7565] cursor-move ${draggedItemIndex === idx && dragType === 'hero' ? 'opacity-30 border-[#0c7565] scale-95' : 'border-slate-100 shadow-sm'}`}
                      >
                        <img src={img} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                        <div className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm text-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                          <GripVertical size={14} />
                        </div>
                        <button onClick={() => updateHero('images', heroSettings.images.filter((_, i) => i !== idx))} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
               </div>

               {/* NEW GALLERY MANAGEMENT SECTION */}
               <div className="space-y-8 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Galeri Website</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foto-foto yang tampil di bagian "Pixel Lens" di beranda.</p>
                    </div>
                    <button onClick={() => galleryInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"><Plus size={18} /> Tambah ke Galeri</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {heroSettings.galleryImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx, 'gallery')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx, 'gallery')}
                        className={`aspect-[3/4] rounded-[2rem] overflow-hidden relative group border-2 transition-all hover:border-[#0c7565] cursor-move ${draggedItemIndex === idx && dragType === 'gallery' ? 'opacity-30 border-[#0c7565] scale-95' : 'border-slate-100 shadow-sm'}`}
                      >
                        <img src={img} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                        <div className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm text-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                          <GripVertical size={14} />
                        </div>
                        <button onClick={() => updateHero('galleryImages', heroSettings.galleryImages.filter((_, i) => i !== idx))} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"><Trash2 size={14} /></button>
                        <div className="absolute bottom-3 right-3 text-[8px] font-black text-white/50 bg-black/20 px-2 py-0.5 rounded-full pointer-events-none">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                    {heroSettings.galleryImages.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                        <p className="text-slate-400 italic font-medium">Belum ada foto galeri.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {/* TAB ABOUT (TENTANG KAMI) */}
          {activeTab === 'about' && (
            <div className="space-y-12">
               <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Profil Perusahaan</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-[#0c7565] tracking-[0.2em] ml-1">Foto Utama "Tentang"</label>
                        <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden relative group border-2 border-slate-200 shadow-md">
                           {aboutSettings.image ? <img src={aboutSettings.image} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300">Kosong</div>}
                           <button onClick={() => aboutImageInputRef.current?.click()} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center font-black gap-2 transition-all"><Camera size={32} /><span>GANTI FOTO</span></button>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subtitle Profil</label>
                        <input value={aboutSettings.subtitle} onChange={(e) => updateAbout('subtitle', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-[#0c7565]" placeholder="Kisah Kami" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Judul Utama Profil</label>
                        <input value={aboutSettings.title} onChange={(e) => updateAbout('title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-black text-2xl outline-none focus:ring-2 focus:ring-[#0c7565]" placeholder="Presisi di Setiap Potongan" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[#0c7565] ml-1">Deskripsi Paragraf 1</label>
                        <textarea rows={4} value={aboutSettings.description1} onChange={(e) => updateAbout('description1', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0c7565] leading-relaxed" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[#0c7565] ml-1">Deskripsi Paragraf 2</label>
                        <textarea rows={4} value={aboutSettings.description2} onChange={(e) => updateAbout('description2', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0c7565] leading-relaxed" />
                     </div>
                     <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 shadow-sm">
                           <label className="text-[9px] font-black uppercase text-[#0c7565] tracking-widest block mb-2">Nilai Statistik</label>
                           <input value={aboutSettings.statsValue} onChange={(e) => updateAbout('statsValue', e.target.value)} className="w-full bg-transparent text-3xl font-black text-emerald-900 outline-none" placeholder="10K+" />
                        </div>
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Label Statistik</label>
                           <input value={aboutSettings.statsLabel} onChange={(e) => updateAbout('statsLabel', e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none" placeholder="Pelanggan Puas" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB BRANCHES (CABANG) - DENGAN PENGELOMPOKAN KOTA */}
          {activeTab === 'branches' && (
            <div className="space-y-12">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#0c7565] uppercase tracking-tighter">Manajemen Lokasi Cabang</h3>
                  <button 
                    onClick={() => setBranchModal({ ...branchModal, isOpen: true, selectedCity: existingCities[0] || '', isNewCityMode: existingCities.length === 0 })} 
                    className="flex items-center gap-2 px-6 py-3.5 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus size={18} /> Tambah Cabang
                  </button>
               </div>

               <div className="space-y-16">
                  {Object.entries(groupedBranches).sort().map(([city, cityBranches]) => (
                    <div key={city} className="space-y-8">
                       {/* Header Kota */}
                       <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                             <MapPin size={24} />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{city}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cityBranches.length} Cabang Aktif</p>
                          </div>
                       </div>

                       {/* Grid Cabang dalam Kota Tersebut */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {cityBranches.map(branch => (
                            <div key={branch.id} className="p-8 border-2 border-slate-100 rounded-[3rem] bg-white relative space-y-6 hover:border-[#0c7565] transition-all group shadow-sm hover:shadow-xl">
                               <button onClick={() => setConfirmModal({ 
                                 isOpen: true, 
                                 title: "Hapus Cabang", 
                                 message: `Yakin ingin menghapus ${branch.name}?`, 
                                 onConfirm: () => { setBranches(branches.filter(b => b.id !== branch.id)); setConfirmModal({ ...confirmModal, isOpen: false }); } 
                               })} className="absolute top-6 right-6 p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={24} /></button>
                               <div className="space-y-5">
                                  <div className="flex gap-4">
                                     <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nama Cabang</label>
                                        <input value={branch.name} onChange={(e) => setBranches(branches.map(b => b.id === branch.id ? { ...b, name: e.target.value } : b))} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all" placeholder="Contoh: Pixel Pusat" />
                                     </div>
                                     <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Kota / Wilayah</label>
                                        <input value={branch.city} onChange={(e) => setBranches(branches.map(b => b.id === branch.id ? { ...b, city: e.target.value } : b))} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all" placeholder="Sukabumi" />
                                     </div>
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Alamat Lengkap Cabang</label>
                                     <textarea value={branch.address} onChange={(e) => setBranches(branches.map(b => b.id === branch.id ? { ...b, address: e.target.value } : b))} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white leading-relaxed transition-all" rows={3} placeholder="Jl. Ahmad Yani No. 125..." />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Jam Kerja</label>
                                        <input value={branch.hours} onChange={(e) => setBranches(branches.map(b => b.id === branch.id ? { ...b, hours: e.target.value } : b))} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all" placeholder="10:00 - 21:00" />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">WhatsApp Cabang</label>
                                        <input value={branch.whatsapp || ""} onChange={(e) => setBranches(branches.map(b => b.id === branch.id ? { ...b, whatsapp: e.target.value } : b))} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all" placeholder="08123456789" />
                                     </div>
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black uppercase text-[#0c7565] ml-1">Google Maps Link</label>
                                     <input value={branch.mapUrl} onChange={(e) => setBranches(branches.map(b => b.id === branch.id ? { ...b, mapUrl: e.target.value } : b))} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all" placeholder="https://goo.gl/maps/..." />
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}

                  {branches.length === 0 && (
                    <div className="py-20 text-center text-slate-400 italic font-medium bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                       Belum ada data cabang. Silakan klik tombol "Tambah Cabang".
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* TAB SERVICES (LAYANAN) */}
          {activeTab === 'services' && (
            <div className="space-y-12">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#0c7565] uppercase tracking-tighter">Katalog Layanan</h3>
                  <button onClick={() => setServices([{ id: Date.now(), title: "Kategori Baru", icon: "Scissors", items: [] }, ...services])} className="flex items-center gap-2 px-6 py-4 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all hover:scale-105"><Plus size={18} /> Tambah Kategori</button>
               </div>
               <div className="grid gap-10">
                  {services.map(cat => (
                    <div key={cat.id} className="p-8 border-2 border-slate-100 rounded-[2.5rem] bg-slate-50/30 relative space-y-8 hover:bg-white hover:shadow-lg transition-all">
                       <button onClick={() => setServices(services.filter(s => s.id !== cat.id))} className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                       <div className="flex items-center gap-6">
                          <button onClick={() => setIconPicker({ isOpen: true, customSvg: '', target: { type: 'category', catId: cat.id } })} className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#0c7565] border-2 border-slate-100 shadow-sm hover:border-[#0c7565] transition-all shadow-md active:scale-95"><IconRenderer name={cat.icon} size={32} /></button>
                          <div className="flex-1 space-y-1">
                             <label className="text-[10px] font-black uppercase text-[#0c7565] tracking-widest ml-1">Nama Kategori Layanan</label>
                             <input value={cat.title} onChange={(e) => setServices(services.map(s => s.id === cat.id ? { ...s, title: e.target.value } : s))} className="w-full bg-transparent border-b-2 border-slate-200 font-bold text-xl py-2 focus:border-[#0c7565] outline-none" placeholder="Contoh: Signature Haircut" />
                          </div>
                       </div>
                       <div className="space-y-4 pt-4">
                          <div className="flex justify-between items-center mb-4">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daftar Item Layanan & Detail</h4>
                             <button onClick={() => setServices(services.map(s => s.id === cat.id ? { ...s, items: [...s.items, { name: "Layanan Baru", icon: "Check", description: "" }] } : s))} className="text-xs font-bold text-[#0c7565] hover:underline flex items-center gap-1 transition-all"><Plus size={14} /> Tambah Item Baru</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {cat.items.map((item, idx) => (
                               <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-all">
                                  <button onClick={() => setServices(services.map(s => s.id === cat.id ? { ...s, items: s.items.filter((_, i) => i !== idx) } : s))} className="absolute top-4 right-4 text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><X size={16} /></button>
                                  <div className="space-y-3">
                                     <input value={item.name} onChange={(e) => setServices(services.map(s => s.id === cat.id ? { ...s, items: s.items.map((it, i) => i === idx ? { ...it, name: e.target.value } : it) } : s))} className="w-full font-bold text-slate-800 focus:text-[#0c7565] outline-none border-b border-transparent focus:border-emerald-100 transition-all" placeholder="Nama Layanan (Contoh: Gentleman Cut)" />
                                     <textarea value={item.description} onChange={(e) => setServices(services.map(s => s.id === cat.id ? { ...s, items: s.items.map((it, i) => i === idx ? { ...it, description: e.target.value } : it) } : s))} className="w-full text-xs text-slate-500 bg-transparent resize-none focus:outline-none leading-relaxed" placeholder="Deskripsi singkat item layanan ini..." rows={3} />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB ACADEMY (PROGRAM BELAJAR) */}
          {activeTab === 'academy' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-[#0c7565] uppercase tracking-tighter">Manajemen Pixel Academy</h3>
                <button onClick={() => setCourses([{ id: Date.now(), title: "Kelas Baru", duration: "12 Sesi", level: "Beginner", description: "Deskripsi...", price: "Rp 3.500.000", customLink: "", icon: "BookOpen" }, ...courses])} className="flex items-center gap-2 px-6 py-4 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all hover:scale-105"><Plus size={18} /> Buka Kelas Baru</button>
              </div>
              <div className="grid gap-10">
                {courses.map(course => (
                  <div key={course.id} className="p-10 border-2 border-slate-100 rounded-[3rem] bg-slate-50/30 relative grid grid-cols-1 md:grid-cols-2 gap-10 hover:bg-white hover:shadow-xl transition-all">
                    <button onClick={() => setCourses(courses.filter(c => c.id !== course.id))} className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={24} /></button>
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <button onClick={() => setIconPicker({ isOpen: true, customSvg: '', target: { type: 'course', courseId: course.id } })} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#0c7565] border-2 border-slate-100 shadow-sm hover:border-[#0c7565] transition-all shadow-md active:scale-95 shrink-0">
                            <IconRenderer name={course.icon || "BookOpen"} size={28} />
                          </button>
                          <div className="flex-1 space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Label: Nama Program Pelatihan</label>
                             <input value={course.title} onChange={(e) => setCourses(courses.map(c => c.id === course.id ? {...c, title: e.target.value} : c))} className="w-full font-bold px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-[#0c7565] outline-none shadow-sm transition-all" placeholder="Contoh: Basic Barbering Masterclass" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Level Sertifikasi</label>
                          <input value={course.level} onChange={(e) => setCourses(courses.map(c => c.id === course.id ? {...c, level: e.target.value} : c))} className="w-full text-xs font-black uppercase text-emerald-700 px-6 py-4 rounded-2xl border-2 border-slate-200 bg-emerald-50 focus:border-[#0c7565] outline-none transition-all" placeholder="BEGINNER / INTERMEDIATE / EXPERT" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-[#0c7565] ml-1">Biaya / Investasi Program</label>
                          <input value={course.price} onChange={(e) => setCourses(courses.map(c => c.id === course.id ? {...c, price: e.target.value} : c))} className="w-full font-black px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white text-[#0c7565] outline-none shadow-sm transition-all" placeholder="Rp 3.500.000" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Custom Link Pendaftaran (Link Button)</label>
                          <input value={course.customLink || ""} onChange={(e) => setCourses(courses.map(c => c.id === course.id ? {...c, customLink: e.target.value} : c))} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-[#0c7565] outline-none shadow-sm transition-all text-xs" placeholder="https://forms.gle/..." />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Durasi Pelatihan</label>
                          <input value={course.duration} onChange={(e) => setCourses(courses.map(c => c.id === course.id ? {...c, duration: e.target.value} : c))} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white outline-none shadow-sm focus:border-[#0c7565] transition-all" placeholder="Contoh: 12 Sesi (Setiap Sabtu)" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Deskripsi & Silabus Singkat</label>
                          <textarea rows={6} value={course.description} onChange={(e) => setCourses(courses.map(c => c.id === course.id ? {...c, description: e.target.value} : c))} className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 text-sm bg-white outline-none shadow-sm focus:border-[#0c7565] transition-all leading-relaxed" placeholder="Tulis rincian apa saja yang dipelajari siswa di sini..." />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CAREERS (LOWONGAN KERJA) */}
          {activeTab === 'careers' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-[#0c7565] uppercase tracking-tighter">Rekrutmen & Karir</h3>
                <button onClick={() => setJobs([{ id: Date.now(), title: "Posisi Baru", type: "Full-Time", requirements: ["Syarat 1"], benefits: [], customLink: "", icon: "Briefcase" }, ...jobs])} className="flex items-center gap-2 px-6 py-4 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all hover:scale-105"><Plus size={18} /> Tambah Loker</button>
              </div>
              <div className="grid gap-10">
                {jobs.map(job => (
                  <div key={job.id} className="p-10 border-2 border-slate-100 rounded-[3rem] bg-slate-50/30 relative space-y-8 hover:bg-white hover:shadow-xl transition-all">
                    <button onClick={() => setJobs(jobs.filter(j => j.id !== job.id))} className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={24} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="flex items-center gap-4">
                             <button onClick={() => setIconPicker({ isOpen: true, customSvg: '', target: { type: 'job', jobId: job.id } })} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#0c7565] border-2 border-slate-100 shadow-sm hover:border-[#0c7565] transition-all shadow-md active:scale-95 shrink-0">
                               <IconRenderer name={job.icon || "Briefcase"} size={28} />
                             </button>
                             <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nama Posisi Pekerjaan</label>
                                <input value={job.title} onChange={(e) => setJobs(jobs.map(j => j.id === job.id ? {...j, title: e.target.value} : j))} className="w-full font-bold px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 outline-none shadow-sm focus:border-[#0c7565] transition-all" placeholder="Contoh: Senior Barber" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipe Kontrak</label>
                             <input value={job.type} onChange={(e) => setJobs(jobs.map(j => j.id === job.id ? {...j, type: e.target.value} : j))} className="w-full px-6 py-4 rounded-2xl font-black text-emerald-700 bg-emerald-50 border-2 border-slate-200 outline-none shadow-sm focus:border-[#0c7565] transition-all" placeholder="FULL-TIME / PART-TIME" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Custom Link Lamar (Link Button)</label>
                             <input value={job.customLink || ""} onChange={(e) => setJobs(jobs.map(j => j.id === job.id ? {...j, customLink: e.target.value} : j))} className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 outline-none shadow-sm focus:border-[#0c7565] transition-all text-xs" placeholder="https://forms.gle/..." />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-[#0c7565] ml-1">Kualifikasi & Persyaratan (Baris Baru)</label>
                             <textarea rows={5} value={job.requirements.join('\n')} onChange={(e) => setJobs(jobs.map(j => j.id === job.id ? {...j, requirements: e.target.value.split('\n').filter(r => r.trim() !== "")} : j))} className="w-full px-6 py-5 rounded-2xl text-sm bg-white border-2 border-slate-200 outline-none shadow-sm focus:border-[#0c7565] transition-all leading-relaxed" placeholder="1. Pria maksimal 30 tahun..." />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-[#0c7565] ml-1">Benefit Pekerjaan (Baris Baru)</label>
                             <textarea rows={5} value={(job.benefits || []).join('\n')} onChange={(e) => setJobs(jobs.map(j => j.id === job.id ? {...j, benefits: e.target.value.split('\n').filter(b => b.trim() !== "")} : j))} className="w-full px-6 py-5 rounded-2xl text-sm bg-white border-2 border-slate-200 outline-none shadow-sm focus:border-[#0c7565] transition-all leading-relaxed" placeholder="Gaji Pokok&#10;Bonus Target&#10;Makan Siang..." />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTACT (INFO KONTAK & SOSMED) */}
          {activeTab === 'contact' && (
            <div className="space-y-16">
               <div className="space-y-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Informasi Kontak Pusat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp Official</label>
                           <input value={contactSettings.phone} onChange={(e) => updateContact('phone', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all shadow-sm" placeholder="0812-3456-7890" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Official</label>
                           <input value={contactSettings.email} onChange={(e) => updateContact('email', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all shadow-sm" placeholder="hello@pixelbarbershop.com" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Alamat Pusat / Store Sukabumi</label>
                           <textarea rows={3} value={contactSettings.address} onChange={(e) => updateContact('address', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium text-sm outline-none focus:ring-2 focus:ring-[#0c7565] focus:bg-white transition-all shadow-sm leading-relaxed" />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Iframe Map Embed (URL Sematan Saja)</label>
                           <input value={contactSettings.mapEmbedUrl} onChange={(e) => updateContact('mapEmbedUrl', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-mono text-[10px] outline-none shadow-sm focus:border-[#0c7565] transition-all" placeholder="https://www.google.com/maps/embed?..." />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">URL Booking / Reservasi Online</label>
                           <input value={contactSettings.bookingUrl} onChange={(e) => updateContact('bookingUrl', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none shadow-sm focus:border-[#0c7565] transition-all" placeholder="https://wa.me/..." />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-8 pt-12 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0c7565]">Media Sosial (Paste SVG Ikon atau Unggah)</h3>
                     <button onClick={() => setContactSettings(prev => ({ ...prev, socials: [...prev.socials, { platform: "Platform", url: "", icon: "" }] }))} className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all"><Plus size={16} /> Tambah Sosmed</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {contactSettings.socials.map((social, idx) => (
                       <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 relative group hover:shadow-lg transition-all">
                          <button onClick={() => setContactSettings(prev => ({ ...prev, socials: prev.socials.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 overflow-hidden relative group/icon">
                             {social.icon ? (
                               /* Fixed: social.icon is already checked for presence, using it directly as content source */
                               social.icon.trim().startsWith('<svg') ? <div className="w-8 h-8 flex items-center justify-center [&>svg]:fill-white" dangerouslySetInnerHTML={{ __html: social.icon }} /> : <img src={social.icon} className="w-full h-full object-cover" />
                             ) : <Instagram size={24} />}
                             <button onClick={() => { setCurrentSocialIdx(idx); socialIconInputRef.current?.click(); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover/icon:opacity-100 flex items-center justify-center text-[8px] font-black transition-all">UNGGAH</button>
                          </div>
                          <div className="flex-1 space-y-3">
                             <input value={social.platform} onChange={(e) => setContactSettings(prev => ({ ...prev, socials: prev.socials.map((s, i) => i === idx ? { ...s, platform: e.target.value } : s) }))} className="w-full font-black text-slate-800 outline-none focus:text-[#0c7565] transition-colors" placeholder="Instagram / Facebook / TikTok" />
                             <input value={social.url} onChange={(e) => setContactSettings(prev => ({ ...prev, socials: prev.socials.map((s, i) => i === idx ? { ...s, url: e.target.value } : s) }))} className="w-full text-xs text-slate-400 outline-none hover:text-slate-600 transition-colors" placeholder="URL Profil Sosial Media" />
                             <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-400">Kode SVG Ikon (Opsional)</label>
                                <textarea value={social.icon} onChange={(e) => setContactSettings(prev => ({ ...prev, socials: prev.socials.map((s, i) => i === idx ? { ...s, icon: e.target.value } : s) }))} className="w-full text-[8px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-100 outline-none focus:border-[#0c7565] transition-all" placeholder="<svg ...> ... </svg>" rows={2} />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* TAB BLOG */}
          {activeTab === 'blog' && (
            <div className="space-y-12">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#0c7565] uppercase tracking-tighter">Manajemen Blog</h3>
                  <button onClick={() => setBlogPosts([{ id: String(Date.now()), title: "Judul Baru", slug: "artikel-" + Date.now(), content: "", excerpt: "", author: "Pixel Team", date: new Date().toISOString().split('T')[0], cover_image: "" }, ...blogPosts])} className="flex items-center gap-2 px-6 py-4 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all hover:scale-105"><Plus size={18} /> Buat Artikel Baru</button>
               </div>
               <div className="grid grid-cols-1 gap-8">
                  {blogPosts.map(post => (
                    <div key={post.id} className="p-8 border-2 border-slate-100 rounded-[2.5rem] bg-white hover:border-[#0c7565] transition-all group flex flex-col md:flex-row gap-8 relative shadow-sm">
                       <button onClick={() => setBlogPosts(blogPosts.filter(p => p.id !== post.id))} className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                       <div className="w-full md:w-64 aspect-[16/10] bg-slate-100 rounded-[2rem] overflow-hidden relative group/img cursor-pointer" onClick={() => { setCurrentBlogToEdit(post.id); blogCoverInputRef.current?.click(); }}>
                          {post.cover_image ? <img src={post.cover_image} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2"><ImageIcon size={40} /><span className="text-[10px] font-black uppercase">Unggah Cover</span></div>}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-[10px] font-black transition-all">EDIT FOTO</div>
                       </div>
                       <div className="flex-1 space-y-6">
                          <input value={post.title} onChange={(e) => setBlogPosts(blogPosts.map(p => p.id === post.id ? { ...p, title: e.target.value } : p))} className="w-full bg-slate-50 px-5 py-3 rounded-xl font-bold outline-none border border-slate-200 focus:border-[#0c7565] transition-all" placeholder="Judul Artikel" />
                          <textarea value={post.excerpt} onChange={(e) => setBlogPosts(blogPosts.map(p => p.id === post.id ? { ...p, excerpt: e.target.value } : p))} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-sm outline-none border border-slate-200 focus:border-[#0c7565] transition-all leading-relaxed" rows={2} placeholder="Ringkasan Singkat (Excerpt)" />
                          <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase text-[#0c7565] ml-1">Isi Artikel (Gunakan <br/> untuk baris baru)</label>
                             <textarea value={post.content} onChange={(e) => setBlogPosts(blogPosts.map(p => p.id === post.id ? { ...p, content: e.target.value } : p))} className="w-full bg-white border border-slate-200 px-5 py-5 rounded-2xl text-sm leading-relaxed outline-none shadow-inner focus:border-[#0c7565] transition-all" rows={8} placeholder="Tulis konten artikel di sini..." />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB FACILITIES (FASILITAS) */}
          {activeTab === 'facilities' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-[#0c7565] uppercase tracking-tighter">Manajemen Fasilitas</h3>
                <button onClick={() => setFacilities([{ id: Date.now(), name: "Fasilitas Baru", icon: "Coffee" }, ...facilities])} className="flex items-center gap-2 px-6 py-4 bg-[#0c7565] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all hover:scale-105"><Plus size={18} /> Tambah Fasilitas</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {facilities.map(fac => (
                  <div key={fac.id} className="p-8 border-2 border-slate-100 rounded-[2.5rem] bg-white relative flex flex-col items-center text-center space-y-4 hover:border-[#0c7565] transition-all group shadow-sm hover:shadow-lg">
                    <button onClick={() => setFacilities(facilities.filter(f => f.id !== fac.id))} className="absolute top-6 right-6 p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                    <button onClick={() => setIconPicker({ isOpen: true, customSvg: '', target: { type: 'facility', facId: fac.id } })} className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0c7565] border border-slate-100 hover:bg-[#0c7565] hover:text-white transition-all shadow-sm active:scale-95"><IconRenderer name={fac.icon} size={28} /></button>
                    <div className="space-y-1 w-full">
                       <label className="text-[9px] font-black uppercase text-slate-400">Nama Fasilitas</label>
                       <input value={fac.name} onChange={(e) => setFacilities(facilities.map(f => f.id === fac.id ? {...f, name: e.target.value} : f))} className="w-full text-center font-bold text-slate-800 outline-none focus:text-[#0c7565] bg-transparent border-b border-transparent focus:border-emerald-100" placeholder="Contoh: Free Coffee" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* NEW BRANCH CITY SELECTION MODAL */}
      {branchModal.isOpen && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-emerald-50 text-[#0c7565] rounded-2xl"><Building size={24} /></div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Tambah Cabang</h3>
                </div>
                <button onClick={() => setBranchModal({ ...branchModal, isOpen: false })} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
             </div>

             <div className="space-y-6">
                {!branchModal.isNewCityMode ? (
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pilih Kota Yang Sudah Ada</label>
                     <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {existingCities.map(city => (
                          <button 
                            key={city} 
                            onClick={() => setBranchModal({...branchModal, selectedCity: city})}
                            className={`w-full text-left px-5 py-4 rounded-2xl font-bold border-2 transition-all flex justify-between items-center ${branchModal.selectedCity === city ? 'bg-emerald-50 border-[#0c7565] text-[#0c7565]' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'}`}
                          >
                            {city}
                            {branchModal.selectedCity === city && <Check size={18} />}
                          </button>
                        ))}
                     </div>
                     <button 
                       onClick={() => setBranchModal({...branchModal, isNewCityMode: true})}
                       className="w-full py-4 text-[#0c7565] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 rounded-2xl transition-all flex items-center justify-center gap-2"
                     >
                       <Plus size={16} /> Atau Tambah Kota Baru
                     </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-[#0c7565] tracking-widest ml-1">Nama Kota Baru</label>
                     <input 
                        value={branchModal.newCity}
                        onChange={(e) => setBranchModal({...branchModal, newCity: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-emerald-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-[#0c7565] transition-all"
                        placeholder="Contoh: Bandung"
                        autoFocus
                     />
                     {existingCities.length > 0 && (
                       <button 
                         onClick={() => setBranchModal({...branchModal, isNewCityMode: false})}
                         className="w-full py-4 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-600 transition-all"
                       >
                         Kembali ke daftar kota
                       </button>
                     )}
                  </div>
                )}

                <button 
                  onClick={handleAddNewBranch}
                  className="w-full py-5 bg-[#0c7565] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-900/20 hover:bg-[#095c50] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Lanjutkan Pembuatan Cabang <ChevronRight size={18} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorModal.isOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col h-[80vh] shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Sesuaikan Gambar</h3>
              <button onClick={() => setEditorModal({ ...editorModal, isOpen: false })} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 relative bg-gray-100">
              <Cropper image={editorModal.image} crop={crop} zoom={zoom} aspect={editorModal.aspect} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="p-6 bg-white space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <span>Zoom</span>
                     <span>{zoom.toFixed(1)}x</span>
                  </div>
                  <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#0c7565]" />
               </div>
               <button onClick={processAndUpload} className="w-full py-4 bg-[#0c7565] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 active:scale-95 transition-all">
                 {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                 {isUploading ? "Mengunggah..." : "Terapkan & Simpan"}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Icon Picker Modal */}
      {iconPicker.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">Pilih Ikon Visual</h3>
              <button onClick={() => setIconPicker({ isOpen: false, customSvg: '', target: null })} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="space-y-8">
              {/* Library Icons */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Library Ikon</h4>
                <div className="grid grid-cols-5 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {AVAILABLE_ICONS.map(i => (
                    <button key={i} onClick={() => applyIconSelection(i)} className="aspect-square flex flex-col items-center justify-center rounded-2xl border border-slate-100 hover:border-[#0c7565] hover:bg-emerald-50 transition-all text-slate-400 hover:text-[#0c7565] group">
                      <IconRenderer name={i} size={28} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] mt-1 font-medium">{i}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom SVG Input */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paste Kode SVG Kustom</h4>
                <textarea 
                  value={iconPicker.customSvg}
                  onChange={(e) => setIconPicker({...iconPicker, customSvg: e.target.value})}
                  className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-[10px] font-mono outline-none focus:border-[#0c7565] h-32"
                  placeholder="<svg ...> ... </svg>"
                />
                <button 
                  onClick={() => applyIconSelection(iconPicker.customSvg)}
                  disabled={!iconPicker.customSvg.trim().startsWith('<svg')}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#0c7565] transition-all disabled:opacity-30"
                >
                  Terapkan SVG Kustom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-10 animate-in zoom-in duration-300">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-2xl font-bold text-slate-900">{selectedMessage.name}</h3>
                   <div className="flex items-center gap-2 text-slate-400 text-xs mt-1 font-medium"><Calendar size={12} />{new Date(selectedMessage.created_at).toLocaleString('id-ID')}</div>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 bg-slate-50 rounded-full"><X size={20} /></button>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{selectedMessage.email}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Phone</p>
                      <p className="text-sm font-bold text-slate-700">{selectedMessage.phone}</p>
                   </div>
                </div>
                <div className="bg-[#0c7565]/5 p-6 rounded-3xl border border-[#0c7565]/10">
                   <p className="text-[10px] font-black uppercase text-[#0c7565] mb-2">Message Content</p>
                   <p className="text-slate-800 leading-relaxed whitespace-pre-line">"{selectedMessage.message}"</p>
                </div>
                <div className="flex gap-4 pt-4">
                   <button onClick={() => { updateMessageStatus(selectedMessage.id, !selectedMessage.is_read); setSelectedMessage(null); }} className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${selectedMessage.is_read ? 'bg-slate-200 text-slate-600' : 'bg-[#0c7565] text-white'}`}>
                     {selectedMessage.is_read ? <EyeOff size={18} /> : <Check size={18} />} {selectedMessage.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                   </button>
                   <button onClick={() => handleDeleteMessage(selectedMessage.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"><Trash2 size={20} /></button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'logo')} />
      <input type="file" ref={footerLogoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'footerLogo')} />
      <input type="file" ref={iconInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'icon')} />
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'hero')} />
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'gallery')} />
      <input type="file" ref={aboutImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'about')} />
      <input type="file" ref={serviceBgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'serviceBg')} />
      <input type="file" ref={blogCoverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'blog_cover', currentBlogToEdit!)} />
      <input type="file" ref={socialIconInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'social_icon', currentSocialIdx!)} />

    </div>
  );
};

export default AdminDashboard;
