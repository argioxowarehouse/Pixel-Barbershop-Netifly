
import React from 'react';
import { BookOpen, Award, TrendingUp, ArrowRight, Scissors, Zap, Sparkles, Star, User, Droplets, Smile, CloudRain, Circle, UserCheck, Coffee, Layers, ArrowDown, ArrowUp, Wind, AlignJustify, Heart, Feather, Moon, Palette, Sun, RefreshCw, Wifi, Thermometer, Shield, Home, Map as MapIcon, Briefcase } from 'lucide-react';
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

  const IconComp = IconMap[trimmed] || BookOpen;
  return <IconComp size={size} className={className} />;
};

interface AcademyProps {
  isStandalonePage?: boolean;
}

const Academy: React.FC<AcademyProps> = ({ isStandalonePage = false }) => {
  const { courses } = useContent();

  return (
    <div className={`flex flex-col ${isStandalonePage ? 'min-h-screen' : ''}`}>
      {/* Page Header (only for standalone) */}
      {isStandalonePage && (
        <div className="bg-[#052e28] py-20 md:py-32 text-center px-4">
          <h4 className="text-[#0c7565] font-bold tracking-widest text-sm uppercase mb-4 animate-fade-in-up">Pixel Academy</h4>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-fade-in-up delay-200">Belajar dari Para Ahli</h1>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg animate-fade-in-up delay-300">
            Kurikulum terstruktur yang dirancang untuk mencetak barber profesional siap kerja dengan standar industri.
          </p>
        </div>
      )}

      <section id="academy" className={`py-20 overflow-hidden ${isStandalonePage ? 'bg-white text-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          {!isStandalonePage && (
            <div className="text-center mb-16 reveal-up">
              <h4 className="text-[#0c7565] font-semibold uppercase tracking-wider text-sm mb-2">Pixel Academy</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Belajar dari Para Ahli</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Kurikulum terstruktur yang dirancang untuk mencetak barber profesional siap kerja dengan standar industri.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 stagger-container">
            {courses.length > 0 ? courses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-2xl hover:border-[#0c7565]/30 transition-all duration-500 flex flex-col reveal-zoom">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl text-[#0c7565] shadow-sm">
                    <IconRenderer name={course.icon} size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#0c7565]/10 text-[#0c7565] text-[10px] font-black rounded-full uppercase tracking-widest">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{course.title}</h3>
                <p className="text-[#0c7565] text-xs font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0c7565] rounded-full"></span>
                  {course.duration}
                </p>
                <p className="text-gray-500 mb-8 min-h-[60px] flex-grow leading-relaxed text-sm">{course.description}</p>
                <div className="pt-8 border-t border-gray-100 mt-auto">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Biaya Kursus</span>
                    <p className="text-xl font-black text-gray-900 tracking-tighter">{course.price}</p>
                  </div>
                  <a 
                    href={course.customLink || "#contact-page"} 
                    target={course.customLink ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-white border-2 border-[#0c7565] text-[#0c7565] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#0c7565] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-teal-900/5"
                  >
                    Daftar Sekarang <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-white reveal-up">
                <p className="text-gray-400 italic">Saat ini belum ada kelas academy yang dibuka.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academy;
