import React, { useState, useMemo } from 'react';
import Courses from '../components/Courses';
import coursesDataRaw from '../data/courses.json';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['All', 'Programación', 'IA', 'Marketing', 'Diseño', 'Negocios'];
  const freeCoursesCount = 6;
  
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-600 selection:text-black font-sans">
      
      {/* SECCIÓN HERO CORPORATIVA */}
      <div className="hero bg-zinc-950 py-32 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="hero-content text-center max-w-5xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-zinc-400 mb-10 font-bold py-2 px-8 rounded-full text-[10px] tracking-[0.3em] uppercase">
               SISTEMA DE ENTRENAMIENTO // LA CLAVE ARGENTINA
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase leading-[0.8] italic">
              CURSIN <span className="text-yellow-600">PRO</span>
            </h1>
            
            <p className="text-2xl mb-14 text-zinc-500 font-light max-w-3xl mx-auto leading-relaxed">
              Acceso restringido a la base de inteligencia educativa más avanzada de la región. 
              Recursos de nivel corporativo para profesionales de alto impacto.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-14 justify-center">
              <input 
                type="text" 
                placeholder="Buscar en los archivos..." 
                className="input input-bordered input-lg w-full max-w-lg bg-zinc-900 border-zinc-800 text-white focus:border-yellow-600 focus:ring-0 shadow-2xl rounded-none font-mono text-sm"
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

      {/* SECCIÓN MUESTRA DE DATOS */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-20 gap-8 border-b border-zinc-900 pb-10">
           <div>
              <p className="text-yellow-600 font-mono text-xs mb-2 tracking-[0.5em] uppercase">Nivel 01 // Acceso Público</p>
              <h2 className="text-6xl font-black tracking-tighter uppercase">MÓDULOS ABIERTOS</h2>
           </div>
           <div className="text-right hidden md:block">
              <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.3em]">Status: Unlocked</p>
           </div>
        </div>
        <Courses coursesData={displayedCourses} />
      </div>

      {/* MURO DE PAGO ESTRATÉGICO */}
      <div className="relative py-48 bg-black">
        <div className="container mx-auto px-6 blur-3xl grayscale opacity-5 pointer-events-none select-none">
             <Courses coursesData={filteredCourses.slice(freeCoursesCount, freeCoursesCount + 4)} />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="bg-zinc-950 border border-white/5 p-12 md:p-24 rounded-none max-w-4xl text-center shadow-2xl relative">
            
            <div className="inline-block bg-yellow-600 text-black px-4 py-1 text-[10px] font-black tracking-[0.4em] uppercase mb-10">
               Acceso Denegado
            </div>
            
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter uppercase">LIMITADO A MIEMBROS</h3>
            
            <p className="text-zinc-500 text-xl mb-14 leading-relaxed max-w-2xl mx-auto">
              Has alcanzado el límite de la base pública. Para desbloquear los <span className="text-white">{lockedCoursesCount} archivos de alto valor</span> y las credenciales de certificación, se requiere una <span className="text-white font-bold">Licencia de Acceso Vitalicio</span>.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16 text-left">
               <div className="p-8 bg-zinc-900/50 border border-white/5">
                  <p className="text-yellow-600 font-bold text-xs uppercase tracking-widest mb-4">Beneficios VIP</p>
                  <ul className="text-sm text-zinc-400 space-y-3 font-medium">
                     <li>• Base de datos completa desbloqueada</li>
                     <li>• Alertas de cursos en tiempo real</li>
                     <li>• Soporte de vinculación directa</li>
                     <li>• Certificaciones de élite (Google/IBM)</li>
                  </ul>
               </div>
               <div className="p-8 bg-zinc-900/50 border border-white/5">
                  <p className="text-yellow-600 font-bold text-xs uppercase tracking-widest mb-4">Método de Activación</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                     La Clave Argentina gestiona las licencias mediante validación directa para garantizar la exclusividad del contenido.
                  </p>
               </div>
            </div>

            <a 
              href="https://wa.me/542235590910?text=Solicito%20información%20sobre%20la%20Licencia%20Premium%20de%20La%20Clave%20Argentina%20para%20Cursin%20PRO." 
              target="_blank"
              className="btn btn-warning btn-lg w-full font-black text-xl h-24 rounded-none tracking-[0.2em] shadow-2xl shadow-yellow-600/10 hover:bg-yellow-500 transition-all"
            >
              SOLICITAR LICENCIA DE ACCESO
            </a>
            
            <p className="mt-10 text-zinc-700 text-[10px] uppercase tracking-[0.5em]">Validación de identidad requerida para el alta</p>
          </div>
        </div>
      </div>

      {/* RADAR DE NOVEDADES */}
      <div className="bg-zinc-950 py-40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase italic">Entrar al Radar</h2>
          <p className="text-zinc-600 mb-16 text-xl font-light leading-relaxed">
            No busques más. Dejá que el algoritmo de <span className="text-zinc-400">La Clave Argentina</span> encuentre las oportunidades por vos. Recibí alertas críticas en tu bandeja de entrada.
          </p>
          
          {subscribed ? (
            <div className="bg-zinc-900 text-yellow-600 p-10 font-black text-xl tracking-[0.3em] border border-yellow-600/20">
              SISTEMA ACTIVADO // REVISAR CORREO
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-0 group">
              <input 
                type="email" 
                placeholder="CORREO ELECTRÓNICO" 
                className="input input-bordered input-lg flex-grow bg-black border-zinc-800 text-white rounded-none h-20 text-sm tracking-widest focus:border-yellow-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-warning btn-lg px-16 font-black h-20 rounded-none text-sm tracking-widest">
                SUSCRIBIRSE
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="py-32 bg-black border-t border-white/5 text-center">
        <div className="mb-12 opacity-20">
           <span className="text-4xl font-black tracking-[1em] text-white uppercase italic">LA CLAVE ARGENTINA</span>
        </div>
        <p className="text-zinc-800 text-[9px] font-mono tracking-[0.8em] uppercase mb-12">
          Security and Educational Protocol // Built for Success
        </p>
        <div className="flex flex-wrap justify-center gap-16 text-zinc-900 font-black text-[10px] uppercase tracking-[0.4em]">
          <span>Google</span> <span>IBM</span> <span>Santander</span> <span>Cisco</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
