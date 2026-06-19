import React, { useState, useEffect } from 'react';

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const title = course.title || course.Title || 'Sin Título';
  const description = course.CourseOverview || course.Description || 'Sin descripción disponible.';
  const link = course.link || course.Link;
  const provider = (course.Provider || course.provider || 'Global').trim();
  const category = course.category || course.Category || 'General';

  const getProviderImage = (prov, cat, tit) => {
    const p = prov.toLowerCase();
    const c = cat.toLowerCase();
    const t = tit.toLowerCase();
    
    // 1. Logos específicos
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
    
    // 2. Imágenes por Categoría (Temáticas)
    if (c.includes('programación') || c.includes('it') || c.includes('software') || t.includes('python') || t.includes('java') || t.includes('react')) 
      return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop';
    if (c.includes('marketing') || c.includes('negocios') || c.includes('business')) 
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
    if (c.includes('finanzas') || c.includes('banco') || c.includes('money')) 
      return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop';
    if (c.includes('idioma') || c.includes('english') || c.includes('español')) 
      return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop';
    if (c.includes('ia') || c.includes('artificial') || t.includes('ai')) 
      return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop';
    
    // 3. Fallback General
    return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`;
  };

  const image = imgError ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop' : (course.imageLink || getProviderImage(provider, category, title));

  useEffect(() => {
    if (isModalOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
  }, [isModalOpen]);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-zinc-900/40 border border-white/10 overflow-hidden transition-all hover:border-yellow-600 flex flex-col h-full cursor-pointer shadow-lg active:scale-95 md:active:scale-100"
      >
        <div className="aspect-video w-full overflow-hidden bg-zinc-900 flex items-center justify-center p-0 relative">
          <img src={image} alt={title} onError={() => setImgError(true)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
          {/* Logo overlay if specific provider */}
          {(provider.toLowerCase().includes('google') || provider.toLowerCase().includes('microsoft') || provider.toLowerCase().includes('santander')) && (
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full p-1.5 border border-white/10">
               <img src={getProviderImage(provider, '', '')} className="w-full h-full object-contain" alt="logo" />
            </div>
          )}
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow text-white text-left">
          <div className="flex justify-between items-start mb-3">
             <span className="text-[9px] font-black bg-yellow-600 text-black px-2 py-0.5 uppercase tracking-widest">{category}</span>
             <span className="text-[9px] text-zinc-600 font-mono">LCA-GLOBAL</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors leading-tight break-words">{title}</h3>
          <p className="text-zinc-500 text-xs md:text-sm mb-6 font-light leading-relaxed line-clamp-3 flex-grow">{description}</p>
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]"><span>{provider}</span><span className="text-yellow-600 font-black shrink-0">+ INFO</span></div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-xl flex items-start md:items-center justify-center p-0 md:p-6 z-[9999999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setIsModalOpen(false)}>
          <div className="bg-zinc-950 w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-y-auto relative shadow-2xl border-white/5 md:border" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="fixed top-4 right-4 md:absolute md:top-8 md:right-8 bg-black/60 text-white p-3 rounded-full hover:bg-yellow-600 hover:text-black transition-all z-[10000000]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="flex flex-col md:flex-row min-h-full text-white text-left">
              <div className="md:w-1/2 bg-zinc-900 border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center p-0">
                <img src={image} alt={title} className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="bg-yellow-600 text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">{category}</span>
                  <span className="text-zinc-500 font-mono text-[9px] border border-white/10 px-2 py-1 uppercase tracking-tighter">PROTOCOLO LCA v6.7</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase break-words">{title}</h2>
                <div className="space-y-8 mb-12">
                  <div>
                    <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-2">Entidad / Universidad</p>
                    <p className="text-white text-lg md:text-xl font-bold uppercase">{provider}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Sobre este curso</p>
                    <p className="text-zinc-400 text-sm md:text-lg leading-relaxed font-light">{description}</p>
                  </div>
                </div>
                <div className="mt-auto pt-8 border-t border-white/5 space-y-4 text-center">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-black text-center py-5 font-black uppercase tracking-[0.3em] hover:bg-yellow-600 transition-all text-xs">Abrir Archivo del Curso</a>
                  <p className="text-[8px] text-zinc-700 font-mono text-center tracking-[0.4em] uppercase">CURSIN.PRO // 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
