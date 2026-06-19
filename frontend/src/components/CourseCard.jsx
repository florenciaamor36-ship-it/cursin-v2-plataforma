/* eslint-disable react/prop-types */
import React, { useState } from 'react';

function CourseCard({ course }) {
  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const title = course.title || course.Title || 'Sin Título';
  const description = course.CourseOverview || course.Description || 'Sin descripción disponible.';
  const image = imgError ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop' : (course.imageLink || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop');
  const link = course.link || course.Link;
  const provider = course.Provider || course.provider || 'Global';
  const country = course.Country || course.country || '';
  const category = course.category || course.Category || 'General';

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <div 
        onClick={toggleModal}
        className="group relative bg-zinc-900/30 border border-white/5 overflow-hidden transition-all hover:border-yellow-600/50 flex flex-col h-full cursor-pointer"
      >
        <div className="aspect-video w-full overflow-hidden bg-zinc-800">
          <img 
            src={image} 
            alt={title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] font-black bg-yellow-600 text-black px-2 py-0.5 uppercase tracking-tighter">
               {category}
             </span>
             <span className="text-[10px] text-zinc-600 font-mono">LCA_GLOBAL</span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors leading-tight overflow-hidden text-ellipsis">
            {title}
          </h3>
          
          <p className="text-zinc-500 text-sm mb-6 font-light leading-relaxed line-clamp-3 flex-grow">
            {description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{provider}</span>
            <div className="text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Tarjeta Flotante */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-zinc-950 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={toggleModal}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-video md:aspect-auto bg-zinc-900">
                <img src={image} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-yellow-600 text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">{category}</span>
                  {country && <span className="border border-white/20 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{country}</span>}
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase">
                  {title}
                </h2>
                
                <div className="mb-8">
                  <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-2">Entidad Proveedora</p>
                  <p className="text-white text-lg font-bold">{provider}</p>
                </div>

                <div className="mb-10">
                  <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Información del Archivo</p>
                  <p className="text-zinc-400 text-lg leading-relaxed font-light">
                    {description}
                  </p>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full bg-white text-black text-center py-6 font-black uppercase tracking-[0.3em] hover:bg-yellow-600 transition-all text-xs"
                  >
                    Sincronizar y Acceder al Curso
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CourseCard;
