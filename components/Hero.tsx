
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { heroSettings } = useContent();
  const [currentImage, setCurrentImage] = useState(0);

  const images = heroSettings.images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update hash without jumping
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-gray-950 [isolation:isolate]">
      {/* Background Slider - Removed fade animation for cleaner transitions */}
      {images.length > 0 ? images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform-gpu backface-visibility-hidden ${
            index === currentImage ? 'opacity-60' : 'opacity-0'
          }`}
          style={{ transform: 'translateZ(0)' }}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      )) : (
        /* Minimal Dark Placeholder when no images */
        <div className="absolute inset-0 bg-[#052e28] opacity-40"></div>
      )}
      
      {/* Dark Overlay Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#052e28] via-transparent to-black/70 opacity-90 pointer-events-none transform-gpu"
        style={{ transform: 'translateZ(1px)' }}
      ></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto z-10">
        {heroSettings.subtitle && (
          <h2 className="inline-block bg-[#0c7565] text-white px-5 py-2 rounded-full font-bold tracking-widest text-xs md:text-sm mb-6 uppercase shadow-lg shadow-teal-900/40 animate-fade-in-up">
            {heroSettings.subtitle}
          </h2>
        )}
        
        {(heroSettings.titlePart1 || heroSettings.titlePart2) && (
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight animate-fade-in-up delay-200">
            {heroSettings.titlePart1}{heroSettings.titlePart1 && <br />}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              {heroSettings.titlePart2}
            </span>
          </h1>
        )}
        
        {heroSettings.description && (
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light animate-fade-in-up delay-300">
            {heroSettings.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-500">
          <a 
            href="#locations"
            onClick={(e) => scrollToSection(e, 'locations')}
            className="group relative px-8 py-4 bg-[#0c7565] text-white font-semibold rounded-full overflow-hidden transition-all hover:bg-[#095c50] shadow-lg shadow-teal-900/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              {heroSettings.ctaText} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a 
            href="#services"
            onClick={(e) => scrollToSection(e, 'services')}
            className="px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Lihat Layanan
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;