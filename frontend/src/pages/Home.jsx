import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(60);

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

  const displayedCourses = filteredCourses.slice(0, visibleCount);

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
          <div className="bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-widest uppercase">LCA Massive Protocol v6.8</div>
          <div className="text-zinc-600 font-mono text-[8px] uppercase tracking-[0.5em] animate-pulse">Base de datos: {allCourses.length} cursos</div>
        </div>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10 text-white uppercase break-all md:break-normal">CURSIN<span className="text-yellow-600">.</span>PRO</h1>
        <p className="text-zinc-500 text-xl max-w-2xl font-medium leading-relaxed">Localizador mundial de formación profesional certificada y gratuita.</p>
        
        <div className="mt-16 flex flex-wrap justify-start gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setVisibleCount(60); }} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-4 md:py-8">
          <input type="text" placeholder="BUSCAR POR UNIVERSIDAD, TEMA O PROVEEDOR..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(60); }} className="w-full bg-transparent border-b-2 border-zinc-800 py-4 md:py-6 text-xl md:text-4xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-colors text-white placeholder:text-zinc-900" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
           <div>
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Resultados localizados</p>
              <h2 className="text-3xl font-black text-white">{filteredCourses.length}</h2>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Mostrando</p>
              <h2 className="text-3xl font-black text-yellow-600">{displayedCourses.length}</h2>
           </div>
        </div>

        <Courses coursesData={displayedCourses} />

        {visibleCount < filteredCourses.length && (
          <div className="flex flex-col items-center justify-center mt-24 space-y-8">
            <button 
              onClick={() => setVisibleCount(prev => prev + 60)}
              className="w-full md:w-auto px-24 py-6 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-yellow-600 transition-all text-xs"
            >
              Cargar más resultados
            </button>
            <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.4em]">Quedan {filteredCourses.length - visibleCount} cursos por mostrar</p>
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
