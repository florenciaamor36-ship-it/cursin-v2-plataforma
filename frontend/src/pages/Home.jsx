import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(100);
  const [chunkIndex, setChunkIndex] = useState(1);
  const [hasMoreChunks, setHasMoreChunks] = useState(true);

  // Fetch a chunk of courses
  const fetchChunk = async (index) => {
    try {
      const response = await fetch();
      if (!response.ok) {
        setHasMoreChunks(false);
        return;
      }
      const data = await response.json();
      setAllCourses(prev => [...prev, ...data]);
      setChunkIndex(index + 1);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setHasMoreChunks(false);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      await fetchChunk(1);
      setTimeout(() => setLoading(false), 1500);
    };
    init();
  }, []);

  const categories = ['All', 'Programación', 'IA', 'Marketing', 'Diseño', 'Negocios'];
  
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const title = (course.title || course.Title || '').toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || (course.category === selectedCategory || course.Category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allCourses]);

  const displayedCourses = filteredCourses.slice(0, visibleCount);

  const handleLoadMore = async () => {
    // If we have more courses in current loaded state, just show them
    if (visibleCount + 100 <= filteredCourses.length) {
      setVisibleCount(prev => prev + 100);
    } else if (hasMoreChunks) {
      // Otherwise fetch next chunk
      setLoading(true);
      await fetchChunk(chunkIndex);
      setVisibleCount(prev => prev + 100);
      setLoading(false);
    }
  };

  if (loading && allCourses.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-600 font-mono tracking-[0.5em] animate-pulse">CARGANDO SISTEMA...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black">
      {/* Header / Hero */}
      <div className="relative border-b border-white/5">
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-block bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-8 shadow-xl shadow-yellow-600/20">
                Protocolo de Acceso V2
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-10">
                CURSIN<span className="text-yellow-600">.</span>PRO
              </h1>
              <p className="text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                Repositorio masivo de conocimiento certificado. Acceso total a redes de aprendizaje global.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-80">
               <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Filtrar por categoría</p>
               <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="BUSCAR EN EL ARCHIVO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-2xl md:text-4xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-colors placeholder:text-zinc-900 group-hover:border-zinc-700"
            />
            <div className="absolute right-0 bottom-6 text-zinc-800 font-mono text-xs hidden md:block">
              SEARCH_INIT // {filteredCourses.length} RESULTADOS
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-20">
           <div className="flex items-center gap-6">
              <div className="h-[1px] w-20 bg-yellow-600"></div>
              <h2 className="text-6xl font-black tracking-tighter uppercase">ARCHIVOS ABIERTOS</h2>
           </div>
        </div>
        <Courses coursesData={displayedCourses} />
        
        {(visibleCount < filteredCourses.length || hasMoreChunks) && (
          <div className="flex justify-center mt-20">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="btn btn-warning btn-outline rounded-none px-16 font-black tracking-[0.3em] uppercase hover:bg-yellow-600 hover:text-black transition-all shadow-xl shadow-yellow-600/5 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Cargar más archivos'}
            </button>
          </div>
        )}
      </div>

      <footer className="py-32 bg-zinc-950 border-t border-white/5 text-center">
        <p className="text-zinc-800 text-[9px] font-mono tracking-[0.8em] uppercase">LCA // EDUCATIONAL PROTOCOL // 2026</p>
      </footer>
    </div>
  );
};

export default Home;