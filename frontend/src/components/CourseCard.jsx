/* eslint-disable react/prop-types */
import React, { useState } from 'react';

function CourseCard({ course }) {
  const [imgError, setImgError] = useState(false);
  
  const title = course.title || course.Title || 'Sin Título';
  const description = course.CourseOverview || course.Description || 'Sin descripción disponible.';
  const image = imgError ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop' : (course.imageLink || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop');
  const link = course.link || course.Link;

  return (
    <div className="group relative bg-zinc-900/30 border border-white/5 overflow-hidden transition-all hover:border-yellow-600/50">
      <div className="aspect-video w-full overflow-hidden bg-zinc-800">
        <img 
          src={image} 
          alt={title} 
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
           <span className="text-[10px] font-black bg-yellow-600 text-black px-2 py-0.5 uppercase tracking-tighter">
             {course.category || 'General'}
           </span>
           <span className="text-[10px] text-zinc-600 font-mono">#LCA-ACC-01</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-500 transition-colors">{title}</h3>
        <p className="text-zinc-500 text-sm line-clamp-2 mb-6 font-light leading-relaxed">{description}</p>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white group-hover:text-yellow-600 transition-all"
        >
          Acceder al Archivo
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default CourseCard;
