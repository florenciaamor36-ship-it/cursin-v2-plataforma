import React, { useState, useEffect, useMemo } from 'react';

export const getProviderImage = (prov = "", cat = "", tit = "") => {
  const p = prov.toLowerCase();
  const c = cat.toLowerCase();
  const t = tit.toLowerCase();
  
  if (p.includes('google')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Cloud_Logo.svg/1024px-Google_Cloud_Logo.svg.png';
  if (p.includes('microsoft')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png';
  if (p.includes('santander')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Banco_Santander_Logo.svg/1024px-Banco_Santander_Logo.svg.png';
  if (p.includes('bbva')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/BBVA_2019.svg/1024px-BBVA_2019.svg.png';
  if (p.includes('coursera')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-logo_v2.svg/1024px-Coursera-logo_v2.svg.png';
  if (p.includes('unlp')) return 'https://unlp.edu.ar/wp-content/uploads/2022/10/UNLP-Logo-Vertical.png';
  if (p.includes('uba')) return 'https://economicas.uba.ar/wp-content/uploads/2015/07/escudo-uba.png';
  if (p.includes('ibm')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1024px-IBM_logo.svg.png';
  if (p.includes('edx')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/EdX.svg/1024px-EdX.svg.png';
  if (p.includes('unicef')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UNICEF_logo.svg/1024px-UNICEF_logo.svg.png';
  
  if (c.includes('programación') || c.includes('it') || c.includes('software') || t.includes('python')) 
    return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop';
  if (c.includes('marketing') || c.includes('negocios')) 
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
  if (c.includes('idiomas') || t.includes('ingles') || t.includes('english')) 
    return 'https://images.unsplash.com/photo-1543167664-40d699ef7383?q=80&w=800&auto=format&fit=crop';

  return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`;
};

const CourseCard = React.memo(({ course, isFavorite, toggleFavorite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const title = course.title || course.Title || 'Sin Título';
  const description = course.CourseOverview || course.Description || 'Sin descripción disponible.';
  const link = course.link || course.Link;
  const provider = (course.Provider || course.provider || 'Global').trim();
  const category = (course.category || course.Category || 'General').trim();

  const rating = useMemo(() => {
    // Calificación determinística basada en el link
    const score = (link || "").length % 2 === 0 ? 5 : 4;
    return score;
  }, [link]);

  const image = useMemo(() => {
    if (imgError) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';
    return course.imageLink || getProviderImage(provider, category, title);
  }, [imgError, course.imageLink, provider, category, title]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Evitar salto de scrollbar
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
  }, [isModalOpen]);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)} 
        className="group relative bg-zinc-900/40 border border-white/10 overflow-hidden transition-all hover:border-yellow-600/50 hover:shadow-[0_0_30px_rgba(202,138,4,0.1)] flex flex-col h-full cursor-pointer active:scale-95 md:active:scale-[0.98]"
      >
        <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
          <img 
            src={image} 
            alt={title} 
            onError={() => setImgError(true)} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(link); }} 
            className="absolute top-4 left-4 z-10 p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:scale-110 active:scale-90 transition-all group/fav"
          >
            {isFavorite ? (
              <span className="text-red-500 text-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">❤️</span>
            ) : (
              <span className="text-white/40 group-hover/fav:text-white text-xl transition-colors">🤍</span>
            )}
          </button>

          {(provider.toLowerCase().includes('google') || provider.toLowerCase().includes('microsoft') || provider.toLowerCase().includes('santander')) && (
            <div className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10 shadow-xl">
               <img src={getProviderImage(provider, '', '')} className="w-full h-full object-contain" alt="logo" />
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-grow text-white text-left">
          <div className="flex justify-between items-center mb-4">
             <span className="text-[9px] font-black bg-white/5 text-zinc-400 px-2 py-1 rounded uppercase tracking-widest border border-white/5 group-hover:bg-yellow-600 group-hover:text-black group-hover:border-yellow-600 transition-colors">
               {category}
             </span>
             <div className="flex text-yellow-500 text-[11px] drop-shadow-sm">
                {[...Array(5)].map((_, i) => (<span key={i} className={i < rating ? "opacity-100" : "opacity-20"}>★</span>))}
             </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-yellow-600 transition-colors leading-tight line-clamp-2 break-words uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-zinc-500 text-xs md:text-sm mb-6 font-light leading-relaxed line-clamp-3 flex-grow italic">
            {description}
          </p>
          <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            <span className="truncate mr-4">{provider}</span>
            <span className="text-yellow-600 font-black shrink-0 group-hover:translate-x-1 transition-transform">VER +</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-10 z-[99999]" 
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-zinc-950 w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/10 md:border rounded-none md:rounded-3xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 bg-white/5 text-white p-4 rounded-full hover:bg-yellow-600 hover:text-black transition-all z-[100] border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row min-h-full">
              <div className="md:w-[45%] bg-zinc-900 relative">
                <img src={image} alt={title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/20 to-transparent"></div>
                <button 
                  onClick={() => toggleFavorite(link)} 
                  className="absolute bottom-8 right-8 p-5 bg-black/80 backdrop-blur-xl rounded-full border border-white/20 hover:scale-110 active:scale-90 transition-all shadow-2xl"
                >
                  {isFavorite ? (
                    <span className="text-red-500 text-3xl drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">❤️</span>
                  ) : (
                    <span className="text-white text-3xl">🤍</span>
                  )}
                </button>
              </div>

              <div className="md:w-[55%] p-8 md:p-16 flex flex-col justify-center text-left">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="bg-yellow-600 text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                    {category}
                  </span>
                  <div className="flex text-yellow-500 text-sm">
                    {[...Array(5)].map((_, i) => (<span key={i}>{i < rating ? '★' : '☆'}</span>))}
                  </div>
                  <span className="text-zinc-600 font-mono text-[9px] border border-white/5 px-3 py-1 uppercase tracking-widest bg-white/5">
                    ID: {link ? link.slice(-8) : '000'}
                  </span>
                </div>

                <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase italic">
                  {title}
                </h2>

                <div className="space-y-10 mb-12">
                  <div>
                    <p className="text-zinc-700 text-[10px] font-mono uppercase tracking-[0.4em] mb-3">Emitido por</p>
                    <p className="text-white text-xl md:text-2xl font-black uppercase border-l-4 border-yellow-600 pl-4 bg-white/5 py-2 inline-block">
                      {provider}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-700 text-[10px] font-mono uppercase tracking-[0.4em] mb-4">Descripción del curso</p>
                    <p className="text-zinc-400 text-sm md:text-xl leading-relaxed font-light font-serif italic">
                      "{description}"
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-grow bg-white text-black text-center py-6 font-black uppercase tracking-[0.4em] hover:bg-yellow-600 transition-all text-xs shadow-xl active:scale-95"
                  >
                    INSCRIBIRSE AHORA
                  </a>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title, text: description, url: link });
                      }
                    }}
                    className="px-8 bg-zinc-900 text-white py-6 border border-white/10 hover:bg-zinc-800 transition-all text-xs font-black uppercase tracking-widest"
                  >
                    Compartir
                  </button>
                </div>
                <p className="text-[9px] text-zinc-800 font-mono text-center mt-8 tracking-[0.6em] uppercase">CURSIN.PRO × LA CLAVE ARGENTINA</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default CourseCard;
