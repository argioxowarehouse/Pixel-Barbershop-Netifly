
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Gallery: React.FC = () => {
  const { heroSettings } = useContent();
  const originalImages = heroSettings.galleryImages || [];
  
  // Duplikasi gambar untuk efek looping yang seamless
  const images = [...originalImages, ...originalImages];
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleOpen = (index: number) => {
    // Gunakan index modulo untuk mendapatkan index asli dari array originalImages
    const actualIndex = index % originalImages.length;
    
    // Otomatis scroll section gallery ke tengah layar saat foto diklik
    sectionRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    setSelectedIndex(actualIndex);
    document.body.style.overflow = 'hidden'; 
  };

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % originalImages.length);
    }
  }, [selectedIndex, originalImages.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + originalImages.length) % originalImages.length);
    }
  }, [selectedIndex, originalImages.length]);

  if (originalImages.length === 0) return null;

  return (
    <section ref={sectionRef} id="gallery" className="py-24 bg-gray-100 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0c7565] opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0c7565] opacity-[0.03] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center md:text-left">
            <h4 className="text-[#0c7565] font-semibold uppercase tracking-widest text-sm mb-4">Visual Experience</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Pixel Barbershop dalam Lensa</h2>
            <div className="w-16 h-1 bg-[#0c7565] rounded-full mx-auto md:mx-0"></div>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative flex overflow-hidden py-10">
          <div className="flex animate-marquee hover:pause whitespace-nowrap gap-5 px-5">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => handleOpen(idx)}
                className="inline-block w-[220px] md:w-[260px] lg:w-[320px] aspect-[3/4] relative overflow-hidden rounded-[2.5rem] group cursor-pointer border border-gray-200 shadow-xl shadow-gray-200/50 transition-all duration-700 bg-white"
              >
                <img 
                  src={img} 
                  alt={`Gallery Pixel ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Zoom Icon Overlay */}
                <div className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-2 group-hover:translate-y-0">
                  <span className="text-xl font-light">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-md animate-in fade-in duration-500"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button 
            className="absolute top-8 right-8 z-[110] p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
            onClick={handleClose}
            aria-label="Close Gallery"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button 
            className="absolute left-6 md:left-12 z-[110] p-5 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:block"
            onClick={handlePrev}
            aria-label="Previous Image"
          >
            <ChevronLeft size={56} />
          </button>
          
          <button 
            className="absolute right-6 md:right-12 z-[110] p-5 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:block"
            onClick={handleNext}
            aria-label="Next Image"
          >
            <ChevronRight size={56} />
          </button>

          {/* Image Container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 md:p-20 overflow-hidden">
            <div className="relative max-w-6xl max-h-[80vh] h-full group/image">
              <img 
                src={originalImages[selectedIndex]} 
                alt={`Selected Gallery ${selectedIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500 select-none border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Image Counter */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/40 text-xs font-black tracking-[0.4em] uppercase whitespace-nowrap">
                {selectedIndex + 1} <span className="text-[#0c7565]">/</span> {originalImages.length}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="absolute bottom-12 left-0 w-full md:hidden flex justify-center gap-16">
            <button 
              className="p-5 bg-white/5 text-white rounded-full active:scale-90 transition-transform"
              onClick={handlePrev}
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              className="p-5 bg-white/5 text-white rounded-full active:scale-90 transition-transform"
              onClick={handleNext}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for seamless marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Gallery;
