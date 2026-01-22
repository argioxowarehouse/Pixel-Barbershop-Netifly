
import React from 'react';
import { Briefcase, CheckCircle2, Gift, Scissors, Zap, Sparkles, Star, User, Droplets, Smile, CloudRain, Circle, UserCheck, Coffee, Layers, ArrowDown, ArrowUp, Wind, AlignJustify, Heart, Feather, Moon, Palette, Sun, RefreshCw, Wifi, Thermometer, Shield, Home, Map as MapIcon, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const IconMap: Record<string, any> = {
  Scissors, Zap, Sparkles, Star, Palette, User, Droplets, 
  Smile, CloudRain, Circle, UserCheck, Coffee, Layers, 
  ArrowDown, ArrowUp, Wind, AlignJustify, Heart, Feather, 
  Moon, Sun, RefreshCw, Wifi, Thermometer, Shield, Home, MapIcon, Briefcase, BookOpen, Award, TrendingUp
};

const IconRenderer = ({ name, size = 28, className = "" }: { name?: string, size?: number, className?: string }) => {
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

  const IconComp = IconMap[trimmed] || Briefcase;
  return <IconComp size={size} className={className} />;
};

interface CareersProps {
  isStandalonePage?: boolean;
}

const Careers: React.FC<CareersProps> = ({ isStandalonePage = false }) => {
  const { jobs, contactSettings } = useContent();

  return (
    <div className={`flex flex-col ${isStandalonePage ? 'min-h-screen' : ''}`}>
      {/* Page Header (only for standalone) */}
      {isStandalonePage && (
        <div className="bg-[#052e28] py-20 md:py-32 text-center px-4">
          <h4 className="text-[#0c7565] font-bold tracking-widest text-sm uppercase mb-4 animate-fade-in-up">Join Our Team</h4>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-fade-in-up delay-200">Pixel Careers</h1>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg animate-fade-in-up delay-300">
            Bangun karir Anda bersama barbershop premium terkemuka. Kami mencari talenta terbaik untuk tumbuh bersama.
          </p>
        </div>
      )}

      <section id="careers" className={`py-20 overflow-hidden ${isStandalonePage ? 'bg-white text-gray-900' : 'bg-[#052e28] text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="reveal-left">
              <h4 className={`${isStandalonePage ? 'text-[#0c7565] bg-emerald-50' : 'text-[#0c7565] bg-white/10'} w-fit px-3 py-1 rounded-full text-sm font-semibold mb-4 uppercase`}>Careers</h4>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${isStandalonePage ? 'text-gray-900' : 'text-white'}`}>
                Bergabung Bersama Tim Terbaik
              </h2>
              <p className={`${isStandalonePage ? 'text-gray-600' : 'text-gray-300'} text-lg mb-8 leading-relaxed`}>
                Pixel Barbershop bukan sekadar tempat kerja, melainkan tempat untuk berkarya dan membangun karir profesional. 
                Kami menawarkan lingkungan kerja yang supportif, jenjang karir jelas, dan benefit kompetitif.
              </p>
              <div className={`${isStandalonePage ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/10'} p-6 rounded-2xl border`}>
                <h3 className={`text-xl font-bold mb-4 ${isStandalonePage ? 'text-gray-900' : 'text-white'}`}>Mengapa Pixel?</h3>
                <ul className="space-y-3">
                  {["Gaji & Komisi Kompetitif", "Training Berkala dari Expert", "Lingkungan Kerja Profesional", "Kesempatan Mengelola Cabang"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-[#0c7565]" />
                      <span className={isStandalonePage ? 'text-gray-700' : 'text-gray-300'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-8 justify-center reveal-right">
              {jobs.length > 0 ? jobs.map((job) => (
                <div key={job.id} className="bg-white text-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0c7565]">{job.title}</h3>
                      <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-full tracking-wider">
                        {job.type}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-300 group-hover:text-[#0c7565] transition-colors">
                      <IconRenderer name={job.icon} size={28} className="text-gray-300" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-bold text-xs uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#0c7565]" /> Persyaratan:
                      </h4>
                      <ul className="space-y-1.5 text-gray-600 text-sm">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#0c7565] font-bold">•</span> {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                          <Gift size={14} className="text-[#0c7565]" /> Benefit:
                        </h4>
                        <ul className="space-y-1.5 text-gray-600 text-sm">
                          {job.benefits.map((ben, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#0c7565] font-bold">•</span> {ben}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <a 
                    href={job.customLink || job.applyUrl || contactSettings.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#0c7565] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#095c50] transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-teal-900/20 active:scale-95"
                  >
                    Kirim Lamaran Sekarang
                  </a>
                </div>
              )) : (
                <div className={`p-10 text-center rounded-3xl border-2 border-dashed ${isStandalonePage ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                   <p className="text-gray-400 italic">Saat ini belum ada lowongan tersedia.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
