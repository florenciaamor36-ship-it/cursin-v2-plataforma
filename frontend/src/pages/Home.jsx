import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lca_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const coursesPerPage = 20;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = ['Todo', 'Español', 'Universidad', 'Plataforma', 'País', 'Provincia', 'Idiomas', 'Carrera', 'Acelerados', 'Certificado', 'IA', 'Programación', 'Marketing'];

  useEffect(() => {
    localStorage.setItem('lca_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (courseId) => {
    setFavorites(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const fetchChunk = async (index) => {
    try {
      const response = await fetch(`data/data_v300_${index}.json`);
      if (!response.ok) return [];
      return await response.json();
    } catch (err) { return []; }
  };

  useEffect(() => {
    const init = async () => {
      console.log("LCA PROTOCOL V11.0 - SYNCING GLOBAL DATABASE");
      const totalChunks = 90;
      const batchSize = 5; // Lotes más pequeños para feedback visual suave
      for (let i = 0; i < totalChunks; i += batchSize) {
        const promises = [];
        for (let j = 1; j <= batchSize; j++) {
          const chunkIndex = i + j;
          if (chunkIndex <= totalChunks) {
            if (chunkIndex === 45) {
              promises.push(fetchChunk('45a'));
              promises.push(fetchChunk('45b'));
            } else if (chunkIndex === 46) {
              promises.push(fetchChunk('46_2'));
              promises.push(fetchChunk('46_3'));
              promises.push(fetchChunk('46b'));
            } else {
              promises.push(fetchChunk(chunkIndex));
            }
          }
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
        setProgress(Math.round(((i + batchSize) / totalChunks) * 100));
        if (i === 0) setLoading(false);
      }
    };
    init();
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('Todo');
    setShowFavorites(false);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCourses = useMemo(() => {
    let base = allCourses;
    
    // Si estamos en modo favoritos, primero filtramos por favoritos
    if (showFavorites) {
      base = allCourses.filter(c => favorites.includes(c.Link || c.link));
    }

    const search = searchQuery.trim().toLowerCase();
    const cat = selectedCategory.toLowerCase();
    
    return base.filter(course => {
      const title = (course.Title || course.title || '').toLowerCase();
      const desc = (course.Description || course.description || course.CourseOverview || '').toLowerCase();
      const provider = (course.Provider || course.provider || '').toLowerCase();
      const categoryField = (course.Category || course.category || '').toLowerCase();
      
      const matchesSearch = search === "" || title.includes(search) || desc.includes(search) || provider.includes(search);
      if (!matchesSearch) return false;
      
      if (cat === 'todo') return true;
      if (cat === 'español') return title.includes('español') || desc.includes('español') || categoryField.includes('español');
      if (cat === 'ia') return title.includes('ia') || title.includes('ai') || title.includes('artificial') || desc.includes('ia') || categoryField.includes('ia');
      
      return title.includes(cat) || desc.includes(cat) || provider.includes(cat) || categoryField.includes(cat);
    });
  }, [searchQuery, selectedCategory, allCourses, showFavorites, favorites]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const displayedCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PaginationComponent = () => (
    <div className="flex flex-col items-center gap-6 my-12 p-6 md:p-10 bg-zinc-900/30 border border-white/5 rounded-2xl backdrop-blur-sm">
      <div className="flex flex-wrap justify-center items-center gap-3">
        <button 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="w-12 h-12 flex items-center justify-center bg-zinc-900 text-white border border-white/10 hover:border-yellow-600 disabled:opacity-20 transition-all rounded-lg"
          title="Primera página"
        >
          «
        </button>
        <button 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-6 h-12 bg-zinc-900 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:border-yellow-600 disabled:opacity-20 transition-all rounded-lg"
        >
          ANTERIOR
        </button>

        <div className="flex gap-2">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button 
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-12 h-12 flex items-center justify-center font-black text-xs transition-all rounded-lg border-2 ${currentPage === pageNum ? 'bg-yellow-600 border-yellow-600 text-black scale-110 shadow-[0_0_20px_rgba(202,138,4,0.3)]' : 'bg-black border-white/5 text-zinc-500 hover:border-white/20'}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-6 h-12 bg-zinc-900 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:border-yellow-600 disabled:opacity-20 transition-all rounded-lg"
        >
          SIGUIENTE
        </button>
        <button 
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-12 h-12 flex items-center justify-center bg-zinc-900 text-white border border-white/10 hover:border-yellow-600 disabled:opacity-20 transition-all rounded-lg"
          title="Última página"
        >
          »
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">PÁGINA</span>
          <span className="text-white bg-white/5 px-2 py-0.5 rounded">{currentPage}</span>
          <span>DE {totalPages}</span>
        </div>
        <span className="hidden md:block text-zinc-800">/</span>
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">{filteredCourses.length}</span>
          <span>RESULTADOS TOTALES</span>
        </div>
      </div>
    </div>
  );

  if (loading && allCourses.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="text-yellow-600 font-black text-xl uppercase animate-pulse text-center tracking-[0.3em] mb-8">Sincronizando Archivos Globales...</div>
      <div className="w-full max-w-md h-2 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="mt-4 text-zinc-700 font-mono text-[10px] uppercase tracking-widest">{progress}% COMPLETADO</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black">
      {/* Scroll Progress Bar (Top) */}
      {!loading && progress < 100 && (
        <div className="fixed top-0 left-0 w-full h-1 z-[1000] bg-zinc-900">
          <div className="h-full bg-yellow-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Header - No se esconde */}
      <div className="container mx-auto px-6 pt-12 pb-6 border-b border-white/5">
        <div className="flex justify-between items-start mb-8">
           <div className="bg-yellow-600 text-black px-4 py-1 text-[11px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(202,138,4,0.4)]">LCA Massive Protocol v12.0</div>
           <div className="text-zinc-700 font-mono text-[9px] uppercase tracking-widest">Base: {allCourses.length}</div>
        </div>
        <h1 onClick={handleReset} className="text-6xl md:text-[12rem] font-black tracking-tighter leading-none mb-4 uppercase cursor-pointer hover:text-yellow-600 transition-colors">CURSIN<span className="text-yellow-600">.</span></h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] mb-4">Plataforma de cursos gratuitos</p>
      </div>

      {/* Sticky Search & Navigation */}
      <div className="bg-black/95 sticky top-0 z-50 border-b border-yellow-600/20 backdrop-blur-3xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="¿QUÉ CURSO BUSCAMOS?" 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                className="w-full bg-transparent border-b-2 border-zinc-900 py-3 text-lg md:text-3xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-all placeholder:text-zinc-800" 
              />
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 bg-zinc-900 rounded-lg text-yellow-600 border border-white/5"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>

          {/* Categories - Desktop: Row | Mobile: Collapsible Menu */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-wrap gap-2 mt-4 transition-all duration-500`}>
            <button 
              onClick={() => { setShowFavorites(!showFavorites); setCurrentPage(1); setIsMenuOpen(false); }} 
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 rounded ${showFavorites ? 'bg-red-600 border-red-600 text-white' : 'bg-black text-red-500 border-red-600/20 hover:border-red-600'}`}
            >
              {showFavorites ? '❤️ Ver Todo' : '🤍 Favoritos'} ({favorites.length})
            </button>
            <div className="w-full md:w-px h-px md:h-8 bg-zinc-800 mx-1 hidden md:block"></div>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); setIsMenuOpen(false); }} 
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all rounded ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-black text-zinc-600 border-zinc-900 hover:border-yellow-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Top Pagination */}
        {totalPages > 1 && <PaginationComponent />}

        {/* Grid */}
        <div className="py-12">
           {filteredCourses.length > 0 ? (
             <Courses 
               coursesData={displayedCourses} 
               favorites={favorites} 
               toggleFavorite={toggleFavorite} 
             />
           ) : (
             <div className="py-24 text-center">
                <div className="text-zinc-800 text-6xl mb-6">¯\_(ツ)_/¯</div>
                <h3 className="text-2xl font-black uppercase text-zinc-500">No encontramos cursos para esa búsqueda</h3>
                <p className="text-zinc-700 mt-4 font-mono text-[10px] uppercase tracking-widest">Probá con otras palabras clave o categorías</p>
             </div>
           )}
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && <PaginationComponent />}
      </div>
      
      <footer className="py-32 border-t border-white/5 text-center">
        <p className="text-zinc-800 font-mono text-[11px] tracking-[1em] uppercase">LCA // GLOBAL DATABASE // 2026</p>
      </footer>
    </div>
  );
};

export default Home;
