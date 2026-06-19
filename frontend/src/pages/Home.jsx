import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 60;

  const categories = ['Todo', 'Español', 'Universidad', 'Plataforma', 'País', 'Provincia', 'Idiomas', 'Carrera', 'Acelerados', 'Certificado', 'IA', 'Programación', 'Marketing'];

  const fetchChunk = async (index) => {
    try {
      const response = await fetch(`data/data_v300_${index}.json`);
      if (!response.ok) return [];
      return await response.json();
    } catch (err) { return []; }
  };

  useEffect(() => {
    const init = async () => {
      // Cargamos chunks de a 10 para mejor UX
      const totalChunks = 90;
      const batchSize = 10;
      for (let i = 0; i < totalChunks; i += batchSize) {
        const promises = [];
        for (let j = 1; j <= batchSize; j++) {
          if (i + j <= totalChunks) promises.push(fetchChunk(i + j));
        }
        const results = await Promise.all(promises);
        const flattened = results.flat();
        if (flattened.length > 0) {
          setAllCourses(prev => {
            const existingLinks = new Set(prev.map(c => (c.Link || c.link)));
            const newOnes = flattened.filter(c => !existingLinks.has(c.Link || c.link));
            return [...prev, ...newOnes];
          });
        }
        if (i === 0) setLoading(false);
      }
    };
    init();
  }, []);

  const filteredCourses = useMemo(() => {
    const search = searchQuery.toLowerCase();
    const cat = selectedCategory.toLowerCase();
    
    return allCourses.filter(course => {
      const title = (course.Title || course.title || '').toLowerCase();
      const desc = (course.Description || course.description || course.CourseOverview || '').toLowerCase();
      const provider = (course.Provider || course.provider || '').toLowerCase();
      
      const matchesSearch = title.includes(search) || desc.includes(search) || provider.includes(search);
      if (!matchesSearch) return false;
      
      if (cat === 'todo') return true;
      return title.includes(cat) || desc.includes(cat) || provider.includes(cat) || (course.Category || '').toLowerCase().includes(cat);
    });
  }, [searchQuery, selectedCategory, allCourses]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const displayedCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && allCourses.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-yellow-600 font-mono text-xs uppercase animate-pulse text-center tracking-[0.5em] mb-4">Sincronizando 27,000 Archivos Globales...</div>
      <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-600 animate-[loading_2s_infinite]"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black overflow-x-hidden">
      <div className="container mx-auto px-6 pt-12 pb-12 md:pt-24 md:pb-24 text-left border-b border-white/5">
        <div className="inline-flex items-center gap-4 mb-8">
          <div className="bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-widest uppercase">LCA Massive Protocol v6.7</div>
          <div className="text-zinc-600 font-mono text-[8px] uppercase tracking-[0.5em] animate-pulse">Base de datos: {allCourses.length} cursos</div>
        </div>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10 text-white uppercase break-all md:break-normal">CURSIN<span className="text-yellow-600">.</span>PRO</h1>
        <p className="text-zinc-500 text-xl max-w-2xl font-medium leading-relaxed">Localizador mundial de formación profesional certificada y gratuita.</p>
        
        <div className="mt-16 flex flex-wrap justify-start gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-4 md:py-8">
          <input type="text" placeholder="BUSCAR POR UNIVERSIDAD, TEMA O PROVEEDOR..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full bg-transparent border-b-2 border-zinc-800 py-4 md:py-6 text-xl md:text-4xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-colors text-white placeholder:text-zinc-900" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
           <div>
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Resultados localizados</p>
              <h2 className="text-3xl font-black text-white">{filteredCourses.length}</h2>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Página</p>
              <h2 className="text-3xl font-black text-yellow-600">{currentPage} / {totalPages || 1}</h2>
           </div>
        </div>

        <Courses coursesData={displayedCourses} />

        {/* NUMERIC PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-24">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-6 py-4 border border-white/10 text-white font-bold uppercase text-[10px] hover:bg-white hover:text-black transition-all disabled:opacity-20"
            >
              Anterior
            </button>
            
            <div className="flex gap-2 mx-4 overflow-x-auto max-w-[200px] md:max-w-none">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                if (pageNum < 1) pageNum = i + 1;
                
                return (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 flex items-center justify-center font-black text-[10px] transition-all border ${currentPage === pageNum ? 'bg-yellow-600 border-yellow-600 text-black' : 'border-white/5 text-zinc-500 hover:border-white/20'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-4 border border-white/10 text-white font-bold uppercase text-[10px] hover:bg-white hover:text-black transition-all disabled:opacity-20"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      
      <footer className="py-24 border-t border-white/5 text-center">
        <p className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">LCA // GLOBAL DATABASE // 2026</p>
      </footer>
    </div>
  );
};

export default Home;
