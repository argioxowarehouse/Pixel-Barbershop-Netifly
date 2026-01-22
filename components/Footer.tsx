
import React from 'react';
import { MapPin, Phone, Mail, Calendar, Instagram, Facebook, Youtube } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface FooterProps {
  onAdminClick?: () => void;
  onNavigateHome?: () => void;
  onNavigateCareers?: () => void;
  onNavigateAcademy?: () => void;
  onNavigateContact?: () => void;
  onNavigateBlog?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onAdminClick, 
  onNavigateHome, 
  onNavigateCareers, 
  onNavigateAcademy, 
  onNavigateContact, 
  onNavigateBlog 
}) => {
  const { heroSettings, contactSettings, blogPosts } = useContent();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    
    if (href === '#careers-page') {
      if (onNavigateCareers) onNavigateCareers();
      return;
    }
    if (href === '#academy-page') {
      if (onNavigateAcademy) onNavigateAcademy();
      return;
    }
    if (href === '#contact-page') {
      if (onNavigateContact) onNavigateContact();
      return;
    }
    if (href === '#blog-page') {
      if (onNavigateBlog) onNavigateBlog();
      return;
    }

    if (onNavigateHome) onNavigateHome();
    
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const renderSocialIcon = (platform: string, iconValue?: string) => {
    const trimmed = iconValue ? iconValue.trim() : '';
    if (trimmed.startsWith('<svg')) {
      return (
        <div 
          className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
          dangerouslySetInnerHTML={{ __html: trimmed }} 
        />
      );
    }
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram size={16} />;
    if (p.includes('facebook')) return <Facebook size={16} fill="currentColor" />;
    if (p.includes('youtube')) return <Youtube size={16} fill="currentColor" />;
    return <Instagram size={16} />;
  };

  return (
    <footer 
      className="bg-[#052e28] text-white pt-24 pb-12 [isolation:isolate] transform-gpu"
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Section 1: Logo Landscape & Tagline */}
          <div className="space-y-6">
            <div className="flex items-center cursor-pointer" onClick={(e) => handleLinkClick(e, '#home')}>
              {heroSettings.footerLogo ? (
                <img 
                  src={heroSettings.footerLogo} 
                  alt="Pixel Barbershop Logo" 
                  className="h-20 md:h-24 w-auto object-contain transition-transform hover:scale-105 duration-300" 
                />
              ) : (
                <img 
                  src={heroSettings.logo} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain opacity-90" 
                />
              )}
            </div>
            <p className="text-gray-400 text-sm italic font-medium leading-relaxed max-w-[240px]">
              "#Life isn't perfect but your hair can be"
            </p>
          </div>

          {/* Section 2: Address & Social Media */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0c7565]">Lokasi Cabang</h4>
            <div className="flex items-start gap-4 text-gray-400 group">
              <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-[#0c7565] border border-white/5 transition-colors group-hover:bg-[#0c7565] group-hover:text-white">
                <MapPin size={18} />
              </div>
              <p className="text-sm leading-relaxed font-medium">
                {contactSettings.address || "Jl. Jend. Ahmad Yani No. 125, Sukabumi, Jawa Barat"}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              {contactSettings.socials.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#0c7565] text-white rounded-xl border border-white/5 transition-all duration-300"
                >
                  {renderSocialIcon(social.platform, social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Section 3: Contact Us */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0c7565]">Hubungi Kami</h4>
            <div className="space-y-5">
              <a 
                href={`https://wa.me/${contactSettings.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group cursor-pointer decoration-transparent"
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#0c7565] border border-white/5 group-hover:bg-[#0c7565] group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-500 tracking-tighter">WhatsApp</p>
                  <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{contactSettings.phone}</p>
                </div>
              </a>
              <a 
                href={`mailto:${contactSettings.email}`}
                className="flex items-center gap-4 group cursor-pointer decoration-transparent"
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#0c7565] border border-white/5 group-hover:bg-[#0c7565] group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-500 tracking-tighter">Email Official</p>
                  <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{contactSettings.email}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Section 4: Latest News with Thumbnails */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0c7565]">Berita Terbaru</h4>
            <div className="space-y-6">
              {blogPosts.length > 0 ? blogPosts.slice(0, 2).map((post) => (
                <div 
                  key={post.id} 
                  className="group cursor-pointer flex gap-4 items-center"
                  onClick={(e) => handleLinkClick(e, '#blog-page')}
                >
                  <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#0c7565] transition-all bg-white/5 shadow-2xl relative">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-sm font-bold text-gray-200 group-hover:text-[#0c7565] transition-colors line-clamp-2 leading-tight mb-1 tracking-tight">
                      {post.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase">
                      <Calendar size={12} className="text-[#0c7565]" />
                      {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-xs italic">Belum ada artikel terbaru.</p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <p className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase text-center">
              &copy; {new Date().getFullYear()} Pixel Barbershop Indonesia. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
