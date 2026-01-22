
import React, { useState } from 'react';
import { Calendar, User, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { BlogPost } from '../types';

interface BlogProps {
  isStandalonePage?: boolean;
}

const Blog: React.FC<BlogProps> = ({ isStandalonePage = false }) => {
  const { blogPosts } = useContent();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <article className="min-h-screen bg-white animate-in fade-in duration-500">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <img 
            src={selectedPost.cover_image} 
            alt={selectedPost.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-12 left-0 w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <button 
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit"
            >
              <ArrowLeft size={18} /> Kembali ke List
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{selectedPost.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-2"><User size={16} className="text-[#0c7565]" /> {selectedPost.author}</span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-[#0c7565]" /> {new Date(selectedPost.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-[#0c7565]" /> 5 Menit Baca</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div 
            className="prose prose-lg prose-slate max-w-none text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br/>') }}
          />
        </div>
      </article>
    );
  }

  return (
    <div className={`flex flex-col ${isStandalonePage ? 'min-h-screen' : ''}`}>
      {isStandalonePage && (
        <div className="bg-[#052e28] py-20 md:py-32 text-center px-4">
          <h4 className="text-[#0c7565] font-bold tracking-widest text-sm uppercase mb-4 animate-fade-in-up">Wawasan & Gaya</h4>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-fade-in-up delay-200">Pixel Blog</h1>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg animate-fade-in-up delay-300">
            Tips perawatan, tren gaya rambut, dan cerita di balik kursi barber kami.
          </p>
        </div>
      )}

      <section id="blog" className={`py-24 overflow-hidden ${isStandalonePage ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          {!isStandalonePage && (
            <div className="text-center mb-16">
              <h4 className="text-[#0c7565] font-semibold uppercase tracking-wider text-sm mb-2">Artikel Terbaru</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Blog & Inspirasi Gaya</h2>
              <div className="w-16 h-1 bg-[#0c7565] mx-auto mt-6 rounded-full"></div>
            </div>
          )}

          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-[#0c7565] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.author}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                      <Calendar size={14} className="text-[#0c7565]" />
                      {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0c7565] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[#0c7565] font-bold text-sm group-hover:gap-4 transition-all">
                      Baca Selengkapnya <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-white">
              <p className="text-gray-400 italic">Belum ada artikel yang diterbitkan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;