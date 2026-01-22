
import React, { useState, useMemo } from 'react';
import { MapPin, Clock, Navigation, Phone, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Locations: React.FC = () => {
  const { branches, heroSettings } = useContent();
  const [activeCity, setActiveCity] = useState<string>('');

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(branches.map(b => b.city)));
    return uniqueCities.sort();
  }, [branches]);

  // Hanya reset jika kota yang sedang aktif tiba-tiba hilang dari daftar data (misal dihapus di admin)
  React.useEffect(() => {
    if (activeCity && !cities.includes(activeCity)) {
      setActiveCity('');
    }
  }, [cities, activeCity]);

  const filteredBranches = branches.filter(b => b.city === activeCity);

  return (
    <section id="locations" className="py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center reveal-up">
          <h4 className="text-[#0c7565] font-semibold uppercase tracking-widest text-sm mb-4">
            Lokasi Kami
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Temukan Cabang di Kotamu
          </h2>
          <div className="w-16 h-1 bg-[#0c7565] mt-2 rounded-full"></div>
        </div>

        {cities.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-16 reveal-up">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-8 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeCity === city
                    ? 'bg-[#0c7565] text-white shadow-xl shadow-teal-900/20'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {activeCity ? (
          filteredBranches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container animate-in fade-in slide-in-from-bottom-4 duration-700">
              {filteredBranches.map((branch) => (
                <div key={branch.id} className="group bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/40 hover:-translate-y-2 flex flex-col justify-between h-full reveal-up">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-10 h-10 bg-[#0c7565] rounded-2xl flex items-center justify-center p-2.5 transition-all duration-500 group-hover:scale-110">
                        {heroSettings.logo ? (
                          <img src={heroSettings.logo} alt="Pixel Logo" className="w-full h-full object-contain filter brightness-0 invert" />
                        ) : (
                          <span className="font-bold text-[7px] text-white tracking-tighter uppercase">Pixel</span>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#0c7565] bg-[#0c7565]/10 px-4 py-1.5 rounded-full">
                        {branch.city}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight group-hover:text-[#0c7565] transition-colors leading-tight">
                      {branch.name}
                    </h3>
                    <div className="space-y-3.5 mb-10">
                      <div className="flex items-start gap-3.5">
                        <MapPin size={16} className="mt-1 shrink-0 text-[#0c7565]" />
                        <span className="text-sm text-gray-500 leading-relaxed font-normal">{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-3.5">
                        <Clock size={16} className="shrink-0 text-[#0c7565]" />
                        <span className="text-sm text-gray-500 leading-relaxed font-normal">{branch.hours}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-800 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
                      onClick={() => {
                        if (branch.mapUrl) window.open(branch.mapUrl, '_blank');
                        else window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank');
                      }}
                    >
                      <Navigation size={12} /> Location
                    </button>
                    {branch.whatsapp && (
                      <a href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0c7565] rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#095c50] transition-all duration-300 shadow-xl shadow-teal-900/20">
                        <Phone size={12} /> Booking
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-32 italic bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 reveal-up">
              <p className="font-bold tracking-widest uppercase text-[10px]">Belum ada cabang aktif di kota ini.</p>
            </div>
          )
        ) : (
          /* Tampilan Default Sebelum Pilih Kota (Compact & Hitam Putih Background) */
          <div className="relative py-24 md:py-32 text-center bg-gray-100 rounded-[3.5rem] border border-gray-200 reveal-up shadow-2xl shadow-gray-200/30 overflow-hidden group max-w-5xl mx-auto">
            {/* Layer 1: Google Maps Embed (Hitam Putih / Grayscale) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
              <iframe 
                src="https://www.google.com/maps/d/u/0/embed?mid=1r5B_wK2_WZn1SC0kN0OTm7iV8ubBdUc&ehbc=2E312F&noprof=1" 
                className="w-full h-[150%] -translate-y-[15%] scale-105 filter grayscale"
                style={{ border: 0 }}
              ></iframe>
            </div>

            {/* Layer 2: Overlay Lebih Transparan Agar Peta Jelas */}
            <div className="absolute inset-0 z-[1] bg-white/40 backdrop-blur-[1px] transition-all duration-1000 group-hover:bg-white/30"></div>

            {/* Layer 3: Konten Teks & Ikon */}
            <div className="relative z-10 space-y-6 animate-in fade-in zoom-in duration-1000">
              <div className="w-20 h-20 bg-white shadow-2xl shadow-gray-900/20 rounded-3xl flex items-center justify-center mx-auto text-[#0c7565] group-hover:scale-110 transition-all duration-500 border border-emerald-50">
                <Globe size={40} strokeWidth={1.5} className="animate-spin-slow" />
              </div>
              <div className="px-4">
                <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-tight drop-shadow-sm">
                  Tersedia <span className="text-[#0c7565] inline-block">{branches.length}</span> Cabang
                </p>
                <p className="text-gray-800 font-black uppercase tracking-[0.3em] text-[10px] mt-4 bg-white/90 w-fit mx-auto px-5 py-2 rounded-full border border-gray-200 shadow-sm backdrop-blur-sm">
                  Di Seluruh Indonesia
                </p>
              </div>
              <p className="text-xs md:text-sm text-gray-900 max-w-sm mx-auto leading-relaxed font-bold bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/60 shadow-lg">
                Pilih kategori kota di atas untuk melihat detail lokasi.
              </p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Locations;
