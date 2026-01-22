
import React from 'react';
import { Star, ShieldCheck, Users } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const About: React.FC = () => {
  const { aboutSettings } = useContent();

  return (
    <section id="about" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side - Slides from Left */}
          <div className="relative reveal-left">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#0c7565]/10 rounded-full z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#0c7565]/10 rounded-full z-0"></div>
            
            {aboutSettings.image ? (
              <img 
                src={aboutSettings.image} 
                alt="Tentang Kami" 
                className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="relative z-10 w-full h-[500px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                <Users size={64} />
              </div>
            )}
            
            <div className="absolute -bottom-8 left-8 z-20 bg-white p-6 rounded-xl shadow-xl border-l-4 border-[#0c7565]">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-[#0c7565]">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{aboutSettings.statsValue}</p>
                  <p className="text-sm text-gray-500">{aboutSettings.statsLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side - Slides from Right */}
          <div className="reveal-right">
            <h4 className="text-[#0c7565] font-semibold uppercase tracking-widest text-sm mb-4">
              {aboutSettings.subtitle}
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {aboutSettings.title}
            </h2>
            <div className="w-16 h-1 bg-[#0c7565] rounded-full mb-8"></div>
            
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {aboutSettings.description1}
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {aboutSettings.description2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-[#0c7565]">
                  <Star size={24} fill="#0c7565" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Premium Service</h4>
                  <p className="text-sm text-gray-500">Standar pelayanan bintang lima di setiap sesi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-[#0c7565]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Expert Barbers</h4>
                  <p className="text-sm text-gray-500">Tim profesional bersertifikasi akademi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
