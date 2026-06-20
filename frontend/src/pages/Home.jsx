import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lca_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const coursesPerPage = 20;

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
      console.log("LCA PROTOCOL V9.0 - SYNCING GLOBAL DATABASE");
      const totalChunks = 90;
      const batchSize = 10;
      for (let i = 0; i < totalChunks; i += batchSize) {
        const promises = [];
        for (let j = 1; j <= batchSize; j++) {
          const chunkIndex = i + j;
          if (chunkIndex <= totalChunks) {
            // Manejo especial para bloques fragmentados (45a, 45b, etc)
            if (chunkIndex === 45) {
              promises.push(fetchChunk('45a'));
              promises.push(fetchChunk('45b'));
            } else if (chunkIndex === 46) {
              promises.push(fetchChunk('46a'));
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
        if (i === 0) setLoading(false);
      }
    };
    init();
  }, []);

  const filteredCourses = useMemo(() => {
    let base = allCourses;
    if (showFavorites) {
      base = allCourses.filter(c => favorites.includes(c.Link || c.link));
    }

    const search = searchQuery.toLowerCase();
    const cat = selectedCategory.toLowerCase();
    
    return base.filter(course => {
      const title = (course.Title || course.title || '').toLowerCase();
      const desc = (course.Description || course.description || course.CourseOverview || '').toLowerCase();
      const provider = (course.Provider || course.provider || '').toLowerCase();
      const categoryField = (course.Category || course.category || '').toLowerCase();
      
      const matchesSearch = title.includes(search) || desc.includes(search) || provider.includes(search);
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
    <div className="flex flex-col items-center gap-6 my-12 p-8 bg-zinc-900/50 border border-yellow-600/30 rounded-xl">
      <div className="flex flex-wrap justify-center items-center gap-4">
        <button 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-8 py-4 bg-yellow-600 text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-20 disabled:bg-zinc-800 disabled:text-zinc-600"
        >
          ANTERIOR
        </button>

        <div className="flex gap-2">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
            if (pageNum < 1) pageNum = i + 1;
            if (pageNum > totalPages) return null;

            return (
              <button 
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-14 h-14 flex items-center justify-center font-black text-sm transition-all border-2 ${currentPage === pageNum ? 'bg-white border-white text-black scale-110' : 'bg-black border-zinc-800 text-zinc-500 hover:border-yellow-600'}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-8 py-4 bg-yellow-600 text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-20 disabled:bg-zinc-800 disabled:text-zinc-600"
        >
          SIGUIENTE
        </button>
      </div>
      
      <div className="flex items-center gap-6 text-[10px] font-mono text-yellow-600 uppercase tracking-[0.4em]">
        <span>PÁGINA {currentPage} DE {totalPages}</span>
        <span className="text-zinc-800">|</span>
        <span>{filteredCourses.length} CURSOS ENCONTRADOS</span>
      </div>
    </div>
  );

  if (loading && allCourses.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="text-yellow-600 font-black text-xl uppercase animate-pulse text-center tracking-[0.3em] mb-8">Sincronizando Archivos Globales...</div>
      <div className="w-full max-w-md h-2 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-600 w-1/2 animate-[loading_2s_infinite]"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black">
      {/* Header */}
      <div className="container mx-auto px-6 pt-12 pb-12 border-b border-white/5">
        <div className="flex justify-between items-start mb-8">
           <div className="bg-yellow-600 text-black px-4 py-1 text-[11px] font-black uppercase tracking-widest">LCA Massive Protocol v10.0</div>
           <div className="text-zinc-700 font-mono text-[9px] uppercase tracking-widest">Base: {allCourses.length}</div>
        </div>
        <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter leading-none mb-8 uppercase">CURSIN<span className="text-yellow-600">.</span></h1>
      </div>

      {/* Sticky Search */}
      <div className="bg-black/90 sticky top-0 z-50 border-b border-yellow-600/20 backdrop-blur-2xl">
        <div className="container mx-auto px-6 py-6">
          <input 
            type="text" 
            placeholder="BUSCAR CURSO, UNIVERSIDAD O TEMA..." 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            className="w-full bg-transparent border-b-4 border-zinc-900 py-6 text-2xl md:text-5xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-all placeholder:text-zinc-900" 
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <button 
              onClick={() => { setShowFavorites(!showFavorites); setCurrentPage(1); }} 
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${showFavorites ? 'bg-red-600 border-red-600 text-white' : 'bg-black text-red-500 border-red-600/20 hover:border-red-600'}`}
            >
              {showFavorites ? '❤️ Ver Todo' : '🤍 Mis Favoritos'} ({favorites.length})
            </button>
            <div className="w-px h-8 bg-zinc-800 mx-2 hidden md:block"></div>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-black text-zinc-600 border-zinc-900 hover:border-yellow-600'}`}>
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
