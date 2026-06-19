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

  const fetchChunk = async (index) => {
    try {
      // Usamos ruta relativa para que funcione en GitHub Pages
      const response = await fetch(`data/courses_${index}.json`);
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

  useEffect(() => {
    const init = async () => {
      await fetchChunk(1);
      // Pequeño delay para el efecto de carga
      setTimeout(() => setLoading(false), 800);
    };
    init();
  }, []);

  const categories = ['All', 'Programación', 'IA', 'Marketing', 'Diseño', 'Negocios'];

  const filteredCourses = useMemo(() => {
    if (!allCourses) return [];
    return allCourses.filter(course => {
      const title = (course.title || course.Title || '').toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
                             (course.category === selectedCategory || course.Category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allCourses]);

  const displayedCourses = useMemo(() => {
    return filteredCourses.slice(0, visibleCount);
  }, [filteredCourses, visibleCount]);

  const handleLoadMore = async () => {
    if (visibleCount + 100 <= filteredCourses.length) {
      setVisibleCount(prev => prev + 100);
    } else if (hasMoreChunks) {
      setLoading(true);
      await fetchChunk(chunkIndex);
      setVisibleCount(prev => prev + 100);
      setLoading(false);
    }
  };

  if (loading && allCourses.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-600 font-mono tracking-[0.5em] animate-pulse uppercase text-xs">
          Accediendo al Repositorio...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black">
      <div className="relative border-b border-white/5">
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-block bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                LCA Protocol v2.0
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-10">
                CURSIN<span className="text-yellow-600">.</span>PRO
              </h1>
              <p className="text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                Repositorio masivo de conocimiento certificado. Acceso total a redes de aprendizaje global.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-80">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Filtrar Archivos</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(100);
                    }}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-black'
                        : 'bg-zinc-900 text-zinc-500 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-8">
          <input
            type="text"
            placeholder="BUSCAR EN EL REPOSITORIO..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(100);
            }}
            className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-2xl md:text-4xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-colors placeholder:text-zinc-900"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="flex items-center gap-6 mb-20">
          <div className="h-[1px] w-20 bg-yellow-600"></div>
          <h2 className="text-6xl font-black tracking-tighter uppercase">Archivos Desbloqueados</h2>
        </div>

        <Courses coursesData={displayedCourses} />

        {(visibleCount < filteredCourses.length || hasMoreChunks) && (
          <div className="flex justify-center mt-20">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn btn-warning btn-outline rounded-none px-16 font-black tracking-[0.3em] uppercase hover:bg-yellow-600 hover:text-black transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Sincronizando...' : 'Cargar más archivos'}
            </button>
          </div>
        )}
      </div>

      <footer className="py-32 bg-zinc-950 border-t border-white/5 text-center">
        <p className="text-zinc-800 text-[9px] font-mono tracking-[0.8em] uppercase">LCA // GLOBAL REPOSITORY // 2026</p>
      </footer>
    </div>
  );
};

export default Home;
