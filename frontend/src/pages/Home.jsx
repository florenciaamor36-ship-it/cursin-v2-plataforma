import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 40;

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
        <div className="h-full bg-yellow-600"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black overflow-x-hidden">
      <div className="container mx-auto px-6 pt-12 pb-12 md:pt-24 md:pb-24 text-left border-b border-white/5">
        <div className="inline-flex items-center gap-4 mb-8">
          <div className="bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-widest uppercase">LCA Massive Protocol v7.0</div>
          <div className="text-zinc-600 font-mono text-[8px] uppercase tracking-[0.5em]">Base de datos: {allCourses.length} cursos</div>
        </div>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10 text-white uppercase break-all md:break-normal">CURSIN<span className="text-yellow-600">.</span>PRO</h1>
      </div>

      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-4">
          <input type="text" placeholder="BUSCAR..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full bg-transparent border-b-2 border-zinc-800 py-4 text-xl md:text-2xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 text-white" />
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
           <div>
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Resultados</p>
              <h2 className="text-3xl font-black text-white">{filteredCourses.length}</h2>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Página</p>
              <h2 className="text-3xl font-black text-yellow-600">{currentPage} de {totalPages || 1}</h2>
           </div>
        </div>

        <Courses coursesData={displayedCourses} />

        {totalPages > 1 && (
          <div className="mt-24 mb-12 p-8 border border-white/5 bg-zinc-900/20">
            <div className="flex flex-col items-center gap-8">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">Navegación de Resultados</p>
              <div className="flex flex-wrap justify-center items-center gap-3">
                <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-6 py-4 bg-zinc-900 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-20">Anterior</button>
                <div className="flex gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    if (pageNum < 1) pageNum = i + 1;
                    if (pageNum > totalPages) return null;
                    return (
                      <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-12 h-12 flex items-center justify-center font-black text-xs transition-all border ${currentPage === pageNum ? 'bg-yellow-600 border-yellow-600 text-black scale-110 shadow-lg' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/40'}`}>{pageNum}</button>
                    );
                  })}
                </div>
                <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-6 py-4 bg-zinc-900 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-20">Siguiente</button>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]"><span>Total de páginas: {totalPages}</span><span>•</span><span>Cursos por página: {coursesPerPage}</span></div>
            </div>
          </div>
        )}
      </div>
      <footer className="py-24 border-t border-white/5 text-center bg-black">
        <p className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">LCA // GLOBAL DATABASE // 2026</p>
      </footer>
    </div>
  );
};

export default Home;
