
import React, { useState } from 'react';
import { Phone, Mail, Instagram, Facebook, Youtube, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ContactProps {
  isStandalonePage?: boolean;
}

const Contact: React.FC<ContactProps> = ({ isStandalonePage = false }) => {
  const { contactSettings, sendMessage } = useContent();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const renderSocialIcon = (platform: string, iconValue?: string) => {
    const trimmed = iconValue ? iconValue.trim() : '';
    
    // 1. Check for Raw SVG Code (Direct SVG)
    if (trimmed.startsWith('<svg')) {
      return (
        <div 
          className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
          dangerouslySetInnerHTML={{ __html: trimmed }} 
        />
      );
    }

    // 2. Check if it's an uploaded image URL
    if (trimmed && (trimmed.startsWith('http') || trimmed.startsWith('data:image'))) {
      return (
        <img 
          src={trimmed} 
          alt={platform} 
          className="w-6 h-6 object-contain filter brightness-0 invert" 
        />
      );
    }

    // 3. Check if it's a specific icon class (Flaticon)
    if (trimmed && trimmed.startsWith('fi')) {
      return <i className={`${trimmed} text-2xl`}></i>;
    }

    // 4. Fallback to predefined official brand icons (Lucide)
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return < Instagram size={24} strokeWidth={2} />;
    if (p.includes('facebook')) return <Facebook size={24} strokeWidth={2} fill="currentColor" />;
    if (p.includes('youtube')) return <Youtube size={24} strokeWidth={2} fill="currentColor" />;
    
    return <Instagram size={24} />; 
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    const success = await sendMessage(formData);
    setIsSending(false);

    if (success) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  return (
    <div className={`flex flex-col ${isStandalonePage ? 'min-h-screen' : ''}`}>
      {/* Page Header (only for standalone) */}
      {isStandalonePage && (
        <div className="bg-[#052e28] py-20 md:py-32 text-center px-4">
          <h4 className="text-[#0c7565] font-bold tracking-widest text-sm uppercase mb-4 animate-fade-in-up">Hubungi Kami</h4>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-fade-in-up delay-200">Ada yang Ingin Ditanyakan?</h1>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg animate-fade-in-up delay-300">
            Kami siap melayani Anda di berbagai cabang dengan standar pelayanan premium.
          </p>
        </div>
      )}

      <section id="contact" className={`py-20 overflow-hidden ${isStandalonePage ? 'bg-white' : 'bg-white border-t border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info & Socials */}
            <div>
              {!isStandalonePage && (
                <>
                  <h4 className="text-[#0c7565] font-semibold uppercase tracking-wider text-sm mb-2">Hubungi Kami</h4>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Ada yang Ingin Ditanyakan?</h2>
                </>
              )}
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-[#0c7565]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Kantor Pusat</h5>
                    <p className="text-gray-600 whitespace-pre-line">{contactSettings.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-[#0c7565]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Telepon / WhatsApp</h5>
                    <p className="text-gray-600">{contactSettings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-[#0c7565]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Email</h5>
                    <p className="text-gray-600">{contactSettings.email}</p>
                  </div>
                </div>
              </div>

              {/* Icon Socials */}
              <div className="flex flex-wrap gap-4">
                {contactSettings.socials.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center bg-[#0c7565] text-white rounded-full transition-all duration-300 group shadow-lg shadow-teal-900/20 hover:bg-[#095c50] hover:-translate-y-1 active:scale-95"
                    title={social.platform}
                  >
                    <span className="group-hover:scale-110 transition-transform flex items-center justify-center">
                      {renderSocialIcon(social.platform, social.icon)}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">
              <h3 className="text-xl font-bold mb-6">Kirim Pesan</h3>
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-emerald-100 text-[#0c7565] rounded-full flex items-center justify-center">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Pesan Terkirim!</h4>
                  <p className="text-gray-500">Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2 bg-[#0c7565] text-white rounded-xl text-sm font-bold"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c7565] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      placeholder="Masukkan nama anda"
                      disabled={isSending}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c7565] focus:border-transparent outline-none transition-all disabled:opacity-50"
                        placeholder="email@anda.com"
                        disabled={isSending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c7565] focus:border-transparent outline-none transition-all disabled:opacity-50"
                        placeholder="0812..."
                        disabled={isSending}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                    <textarea 
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c7565] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      placeholder="Tulis pesan atau pertanyaan anda..."
                      disabled={isSending}
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full py-4 bg-[#0c7565] text-white font-bold rounded-xl shadow-lg hover:bg-[#095c50] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSending && <Loader2 className="animate-spin" size={20} />}
                    {isSending ? "Mengirim..." : "Kirim Pesan"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map Embed */}
          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl h-[450px] w-full border-8 border-white">
              <iframe 
                  src={contactSettings.mapEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;