import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(100);
  const [chunkIndex, setChunkIndex] = useState(1);
  const [hasMoreChunks, setHasMoreChunks] = useState(true);

  const categories = ['Todo', 'Español', 'Universidad', 'Plataforma', 'País', 'Provincia', 'Idiomas', 'Carrera', 'Acelerados', 'Certificado', 'IA', 'Programación', 'Marketing'];

  const fetchChunk = async (index) => {
    try {
      const response = await fetch(`data/data_chunk_${index}.json`);
      if (!response.ok) { return; }
      const data = await response.json();
      setAllCourses(prev => {
        const newOnes = data.filter(newItem => !prev.some(oldItem => (oldItem.Link || oldItem.link) === (newItem.Link || newItem.link)));
        return [...prev, ...newOnes];
      });
    } catch (err) { }
  };

  useEffect(() => {
    const init = async () => {
      // Cargamos los primeros 15 chunks secuencialmente para asegurar volumen de datos inicial
      const chunks = Array.from({ length: 15 }, (_, i) => i + 1);
      for (const i of chunks) {
        await fetchChunk(i);
      }
      setLoading(false);
    };
    init();
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const title = (course.Title || course.title || '').toLowerCase();
      const desc = (course.Description || course.description || course.CourseOverview || '').toLowerCase();
      const provider = (course.Provider || course.provider || '').toLowerCase();
      const search = searchQuery.toLowerCase();
      const matchesSearch = title.includes(search) || desc.includes(search) || provider.includes(search);
      
      if (selectedCategory === 'Todo') return matchesSearch;
      return matchesSearch && (title.includes(selectedCategory.toLowerCase()) || desc.includes(selectedCategory.toLowerCase()));
    });
  }, [searchQuery, selectedCategory, allCourses]);

  const displayedCourses = filteredCourses.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 100);
  };

  if (loading && allCourses.length === 0) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-yellow-600 font-mono text-xs uppercase animate-pulse text-center tracking-[0.5em]">Sincronizando 27,000 Archivos Globales...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black overflow-x-hidden">
      <div className="container mx-auto px-6 pt-12 pb-12 md:pt-24 md:pb-24 text-left border-b border-white/5">
        <div className="inline-flex items-center gap-4 mb-8">
          <div className="bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-widest uppercase tracking-tighter">LCA Massive Protocol v6.0</div>
          <div className="text-zinc-600 font-mono text-[8px] uppercase tracking-[0.5em] animate-pulse">Database: 27,000+ Courses</div>
        </div>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10 text-white uppercase break-all md:break-normal">CURSIN<span className="text-yellow-600">.</span>PRO</h1>
        <p className="text-zinc-500 text-xl max-w-2xl font-medium leading-relaxed">Acceso a la base de datos mundial de educación gratuita. Datos sincronizados en tiempo real.</p>
        
        <div className="mt-16 flex flex-wrap justify-start gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setVisibleCount(100); }} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-4 md:py-8">
          <input type="text" placeholder="BUSCAR POR UNIVERSIDAD, TEMA O PROVEEDOR..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(100); }} className="w-full bg-transparent border-b-2 border-zinc-800 py-4 md:py-6 text-xl md:text-4xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-colors text-white placeholder:text-zinc-900" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="mb-12 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Resultados localizados: {filteredCourses.length}</div>
        <Courses coursesData={displayedCourses} />
        {visibleCount < filteredCourses.length && (
          <div className="flex justify-center mt-24">
            <button onClick={handleLoadMore} className="px-12 py-5 border border-yellow-600 text-yellow-600 font-black uppercase tracking-widest hover:bg-yellow-600 hover:text-black transition-all text-xs"> 
              Cargar más resultados
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
