import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';
import coursesDataRaw from '../data/courses.json';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Forzamos el loading para que sea visible al menos 1.5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', 'Programación', 'IA', 'Marketing', 'Diseño', 'Negocios'];
  const freeCoursesCount = 99999;
  
  const filteredCourses = useMemo(() => {
    return coursesDataRaw.filter(course => {
      const title = (course.title || course.Title || '').toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || (course.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const displayedCourses = filteredCourses.slice(0, freeCoursesCount);
  const lockedCoursesCount = Math.max(0, filteredCourses.length - freeCoursesCount);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Renderizado del Loading (Pantalla completa negra con barra de progreso)
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
        <div className="w-48 h-[2px] bg-zinc-900 overflow-hidden relative mb-4">
           <div className="absolute inset-0 bg-yellow-600 animate-loading-bar shadow-[0_0_15px_rgba(202,138,4,0.5)]"></div>
        </div>
        <p className="text-yellow-600/50 text-[10px] font-mono tracking-[1em] uppercase animate-pulse">
          Iniciando Protocolo LCA
        </p>
        <style>{`
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-loading-bar {
            animation: loading-bar 1.5s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-600 selection:text-black font-sans">
      
      <div className="hero bg-zinc-950 py-32 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="hero-content text-center max-w-5xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-zinc-400 mb-10 font-bold py-2 px-8 rounded-full text-[10px] tracking-[0.3em] uppercase">
               INTELLECTUAL PROPERTY // LA CLAVE ARGENTINA
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase leading-[0.8] italic">
              CURSIN <span className="text-yellow-600">PRO</span>
            </h1>
            
            <p className="text-2xl mb-14 text-zinc-500 font-light max-w-3xl mx-auto leading-relaxed">
              Central de inteligencia educativa. Base de datos curada de <span className="text-white font-bold">La Clave Argentina</span> para perfiles de alto rendimiento.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-14 justify-center">
              <input 
                type="text" 
                placeholder="Filtrar base de datos..." 
                className="input input-bordered input-lg w-full max-w-lg bg-zinc-900 border-zinc-800 text-white focus:border-yellow-600 focus:ring-0 shadow-2xl rounded-none font-mono text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm rounded-none px-10 capitalize font-black tracking-widest transition-all ${selectedCategory === cat ? 'btn-warning border-none text-black' : 'btn-ghost bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-20 gap-8 border-b border-zinc-900 pb-10">
           <div>
              <p className="text-yellow-600 font-mono text-xs mb-2 tracking-[0.5em] uppercase">Nivel 01 // Public Access</p>
              <h2 className="text-6xl font-black tracking-tighter uppercase">ARCHIVOS ABIERTOS</h2>
           </div>
        </div>
        <Courses coursesData={displayedCourses} />
      </div>

      {false && <div className="relative py-48 bg-black">
        <div className="container mx-auto px-6 blur-3xl grayscale opacity-5 pointer-events-none select-none">
             <Courses coursesData={coursesDataRaw.slice(0, 4)} />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="bg-zinc-950 border border-white/5 p-12 md:p-24 rounded-none max-w-4xl text-center shadow-2xl relative">
            
            <div className="inline-block bg-yellow-600 text-black px-4 py-1 text-[10px] font-black tracking-[0.4em] uppercase mb-10">Security Alert</div>
            
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter uppercase">ACCESO RESTRINGIDO</h3>
            
            <p className="text-zinc-500 text-xl mb-14 leading-relaxed max-w-2xl mx-auto">
              Para visualizar los <span className="text-white">{lockedCoursesCount} módulos restantes</span> y el repositorio completo de Google/IBM, es necesaria una <span className="text-white font-bold">Licencia Corporativa</span>.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16 text-left">
               <div className="p-8 bg-zinc-900/30 border border-white/5">
                  <p className="text-yellow-600 font-bold text-xs uppercase tracking-widest mb-4">Credenciales</p>
                  <ul className="text-sm text-zinc-500 space-y-3">
                     <li>• Repositorio Full LCA</li>
                     <li>• Vinculación Certificada</li>
                     <li>• Soporte de Ingeniería</li>
                  </ul>
               </div>
               <div className="p-8 bg-zinc-900/30 border border-white/5">
                  <p className="text-yellow-600 font-bold text-xs uppercase tracking-widest mb-4">Protocolo</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">Licencias emitidas exclusivamente por La Clave Argentina bajo demanda.</p>
               </div>
            </div>

            <a 
              href="https://wa.me/542235590910?text=Solicito%20Protocolo%20de%20Acceso%20Premium%20LCA%20para%20Cursin%20PRO." 
              target="_blank"
              className="btn btn-warning btn-lg w-full font-black text-xl h-24 rounded-none tracking-[0.2em] shadow-2xl shadow-yellow-600/10"
            >
              SOLICITAR CREDENCIALES
            </a>
          </div>
        </div>
      </div>

}
      <footer className="py-32 bg-zinc-950 border-t border-white/5 text-center">
        <p className="text-zinc-800 text-[9px] font-mono tracking-[0.8em] uppercase">LCA // EDUCATIONAL PROTOCOL // 2026</p>
      </footer>
    </div>
  );
};

export default Home;

