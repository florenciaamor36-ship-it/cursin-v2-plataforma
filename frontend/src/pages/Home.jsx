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

  // Categorías predeterminadas solicitadas por Florencia
  const categories = [
    'Todo', 'Español', 'Universidad', 'Plataforma', 'País', 
    'Idiomas', 'Duración', 'Carrera', 'Acelerados', 'Certificado', 
    'IA', 'Programación', 'Marketing', 'Diseño'
  ];

  const fetchChunk = async (index) => {
    try {
      const response = await fetch(`data/courses_${index}.json`);
      if (!response.ok) {
        setHasMoreChunks(false);
        return;
      }
      const data = await response.json();
      // Evitar duplicados por Link
      setAllCourses(prev => {
        const newOnes = data.filter(newItem => !prev.some(oldItem => oldItem.Link === newItem.Link));
        return [...prev, ...newOnes];
      });
      setChunkIndex(index + 1);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setHasMoreChunks(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchChunk(1);
      setTimeout(() => setLoading(false), 800);
    };
    init();
  }, []);

  const filteredCourses = useMemo(() => {
    if (!allCourses) return [];
    
    return allCourses.filter(course => {
      const title = (course.Title || course.title || '').toLowerCase();
      const desc = (course.Description || course.description || '').toLowerCase();
      const provider = (course.Provider || course.provider || '').toLowerCase();
      const platform = (course.Platform || course.platform || '').toLowerCase();
      const lang = (course.Language || course.language || '').toLowerCase();
      const catField = (course.Category || course.category || '').toLowerCase();

      const search = searchQuery.toLowerCase();
      const matchesSearch = title.includes(search) || desc.includes(search) || provider.includes(search) || platform.includes(search);

      if (selectedCategory === 'Todo') return matchesSearch;

      if (selectedCategory === 'Español') return matchesSearch && (lang.startsWith('es') || title.includes('curso') || desc.includes('gratis'));
      
      if (selectedCategory === 'Universidad') {
        const uniKeywords = ['university', 'universidad', 'college', 'facultad', 'mit', 'harvard', 'stanford', 'oxford', 'unam', 'uba', 'tecnológico'];
        return matchesSearch && uniKeywords.some(k => provider.includes(k) || platform.includes(k));
      }

      if (selectedCategory === 'Plataforma') {
        const platKeywords = ['udemy', 'coursera', 'edx', 'skillshop', 'microsoft', 'google', 'ibm', 'linkedin', 'aws'];
        return matchesSearch && platKeywords.some(k => platform.includes(k) || provider.includes(k));
      }

      if (selectedCategory === 'Idiomas') return matchesSearch && lang !== '';

      if (selectedCategory === 'País') {
        const countryKeywords = ['argentina', 'españa', 'méxico', 'chile', 'colombia', 'perú', 'eeuu', 'usa', 'global'];
        return matchesSearch && countryKeywords.some(k => desc.includes(k) || title.includes(k));
      }

      if (selectedCategory === 'Carrera') {
        const careerKeywords = ['career', 'carrera', 'degree', 'grado', 'professional certificate', 'especialización', 'specialization'];
        return matchesSearch && careerKeywords.some(k => title.includes(k) || desc.includes(k));
      }

      if (selectedCategory === 'Acelerados') {
        const fastKeywords = ['crash course', 'acelerado', 'fast-track', 'intensivo', 'bootcamp', 'express'];
        return matchesSearch && fastKeywords.some(k => title.includes(k) || desc.includes(k));
      }

      if (selectedCategory === 'Certificado') return matchesSearch && (title.includes('certificate') || title.includes('certificado') || desc.includes('certific'));

      // Filtros por nombre de categoría exacto
      return matchesSearch && (catField.includes(selectedCategory.toLowerCase()) || title.includes(selectedCategory.toLowerCase()));
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
          Sincronizando Archivos Globales...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600 selection:text-black">
      {/* Header */}
      <div className="relative border-b border-white/5">
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-block bg-yellow-600 text-black px-3 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                LCA Protocol v3.0 // Universal Search
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-10">
                CURSIN<span className="text-yellow-600">.</span>PRO
              </h1>
              <p className="text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
                Repositorio mundial de conocimiento. Desde Silicon Valley hasta Argentina, capturando cada curso gratuito con certificado en el planeta.
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-6">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Protocolos de Filtrado</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(100);
                  }}
                  className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    selectedCategory === cat
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-950 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-8">
          <div className="relative">
            <input
              type="text"
              placeholder="BUSCAR POR UNIVERSIDAD, PAÍS O TEMA..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(100);
              }}
              className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-2xl md:text-4xl font-black uppercase tracking-tighter focus:outline-none focus:border-yellow-600 transition-colors placeholder:text-zinc-900"
            />
            <div className="absolute right-0 bottom-6 text-zinc-800 font-mono text-[10px] hidden md:block">
              LIVE_DATA // {filteredCourses.length} COINCIDENCIAS
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex items-center gap-6 mb-20">
          <div className="h-[1px] w-20 bg-yellow-600"></div>
          <h2 className="text-6xl font-black tracking-tighter uppercase">Repositorio Desbloqueado</h2>
        </div>

        <Courses coursesData={displayedCourses} />

        {(visibleCount < filteredCourses.length || hasMoreChunks) && (
          <div className="flex justify-center mt-20">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn btn-warning btn-outline rounded-none px-16 py-6 font-black tracking-[0.3em] uppercase hover:bg-yellow-600 hover:text-black transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Descargando Datos...' : 'Cargar más archivos'}
            </button>
          </div>
        )}
      </div>

      <footer className="py-32 bg-zinc-950 border-t border-white/5 text-center">
        <p className="text-zinc-500 text-[10px] font-mono tracking-[0.5em] uppercase mb-4">LCA // GLOBAL REPOSITORY // 2026</p>
        <p className="text-zinc-800 text-[8px] font-mono tracking-[0.2em] uppercase">Buscando cursos en todo el sistema solar...</p>
      </footer>
    </div>
  );
};

export default Home;
