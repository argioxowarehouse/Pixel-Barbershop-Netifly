
import React from 'react';
import { 
  Scissors, Zap, Sparkles, Star, User, Droplets, Smile, 
  CloudRain, Circle, UserCheck, Coffee, Layers, ArrowDown, 
  ArrowUp, Wind, AlignJustify, Heart, Feather, Moon, Palette, 
  Sun, RefreshCw, Wifi, Thermometer 
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

const IconMap: Record<string, React.ReactNode> = {
  "Scissors": <Scissors size={32} />,
  "Zap": <Zap size={32} />,
  "Sparkles": <Sparkles size={32} />,
  "Star": <Star size={32} />,
  "Palette": <Palette size={32} />,
  "Wind": <Wind size={32} />,
  "Layers": <Layers size={32} />,
  "Thermometer": <Thermometer size={32} />,
  "Wifi": <Wifi size={32} />,
  "Coffee": <Coffee size={32} />,
  "Heart": <Heart size={32} />,
  "RefreshCw": <RefreshCw size={32} />,
  "User": <User size={16} />,
  "Projector": <User size={16} />,
  "Droplets": <Droplets size={16} />,
  "Smile": <Smile size={16} />,
  "CloudRain": <CloudRain size={16} />,
  "Circle": <Circle size={16} />,
  "UserCheck": <UserCheck size={16} />,
  "ArrowDown": <ArrowDown size={16} />,
  "ArrowUp": <ArrowUp size={16} />,
  "AlignJustify": <AlignJustify size={16} />,
  "Feather": <Feather size={16} />,
  "Moon": <Moon size={16} />,
  "Sun": <Sun size={16} />,
};

const Services: React.FC = () => {
  const { services, facilities, heroSettings } = useContent();

  const renderIcon = (iconName: string, isLarge = false) => {
    const trimmed = iconName ? iconName.trim() : '';
    const size = isLarge ? 32 : 16;
    if (trimmed.startsWith('<svg')) {
      return (
        <div className={`${isLarge ? 'w-8 h-8' : 'w-4 h-4'} [&>svg]:w-full [&>svg]:h-full flex items-center justify-center`} dangerouslySetInnerHTML={{ __html: trimmed }} />
      );
    }
    if (trimmed.startsWith('fi')) {
      return <i className={`${trimmed} ${isLarge ? 'text-2xl' : 'text-lg'} leading-none`}></i>;
    }
    const iconElement = IconMap[trimmed] || <Scissors size={size} />;
    if (React.isValidElement(iconElement)) {
      return React.cloneElement(iconElement as React.ReactElement<any>, { size });
    }
    return iconElement;
  };

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-fixed bg-center bg-cover" style={{ backgroundImage: `url(${heroSettings.serviceBackgroundImage})` }} />
      <div className="absolute inset-0 z-0 bg-gray-950/60 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center reveal-up">
          <h4 className="inline-block bg-[#0c7565] text-white px-5 py-1.5 rounded-full font-semibold uppercase tracking-widest text-xs mb-4 shadow-lg shadow-teal-900/20">
            Layanan Kami
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Perawatan Pria Seutuhnya</h2>
          <div className="w-16 h-1 bg-[#0c7565] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-[#0c7565]/20 transition-all duration-300 border border-white/10 h-full flex flex-col reveal-zoom"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                <div className="p-3 bg-[#0c7565]/10 rounded-xl text-[#0c7565] flex items-center justify-center w-14 h-14">
                  {renderIcon(service.icon, true)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
              </div>
              <ul className="space-y-6 flex-grow">
                {service.items.map((item, idx) => (
                  <li key={idx} className="group border-l-2 border-transparent hover:border-[#0c7565] pl-4 transition-all">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-[#0c7565] transition-colors mb-0.5">{item.name}</h4>
                    {item.description && <p className="text-sm text-gray-500 leading-relaxed font-normal">{item.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {facilities.length > 0 && (
          <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-2xl relative overflow-hidden group reveal-up">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Fasilitas Premium Kami</h3>
              <div className="w-16 h-1 bg-[#0c7565] mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20">
              {facilities.map((fac) => (
                <div key={fac.id} className="flex flex-col items-center gap-4 group/item">
                  <div className="p-5 bg-gray-50 rounded-[2rem] text-[#0c7565] group-hover/item:bg-[#0c7565] group-hover/item:text-white group-hover/item:scale-110 transition-all duration-500 shadow-sm flex items-center justify-center w-20 h-20 border border-gray-100">
                    {renderIcon(fac.icon, true)}
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover/item:text-[#0c7565] transition-colors">{fac.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
