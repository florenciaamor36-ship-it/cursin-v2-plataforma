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
    <div className="min-h-screen bg-black text-white selection:bg-yellow-600 selection:text-black">
      {/* HERO IDENTITY: LA CLAVE ARGENTINA */}
      <div className="hero bg-zinc-900/10 py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <h1 className="text-[15rem] font-black leading-none uppercase">LCA</h1>
        </div>
        
        <div className="hero-content text-center max-w-5xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-yellow-600/10 border border-yellow-600/20 text-yellow-500 mb-8 font-bold py-2 px-6 rounded-full text-xs tracking-widest uppercase">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
               </span>
               Una Plataforma de La Clave Argentina
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
              CURSIN <span className="text-yellow-600">V2</span>
            </h1>
            
            <p className="text-2xl mb-12 text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              Dominá las habilidades que el mercado exige. 
              Accedé a la base de datos exclusiva de <span className="text-white font-bold">La Clave Argentina</span> con los mejores cursos de Google e IBM.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
              <input 
                type="text" 
                placeholder="¿Qué curso vas a dominar hoy?" 
                className="input input-bordered input-lg w-full max-w-lg bg-zinc-950 border-zinc-800 text-white focus:border-yellow-600 focus:ring-0 shadow-2xl rounded-xl font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm rounded-lg px-8 capitalize font-bold transition-all ${selectedCategory === cat ? 'btn-warning border-none text-black scale-105 shadow-lg shadow-yellow-600/20' : 'btn-ghost bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CURSOS LIBRES */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16">
           <div>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">Muestras Gratis</h2>
              <p className="text-zinc-500 uppercase tracking-widest text-sm mt-1">Cursos abiertos para la comunidad</p>
           </div>
           <div className="hidden md:block h-px flex-grow mx-10 bg-zinc-900"></div>
           <div className="text-right">
              <p className="text-yellow-600 font-black text-2xl">6</p>
              <p className="text-zinc-600 text-[10px] uppercase font-bold">Cursos Libres</p>
           </div>
        </div>
        <Courses coursesData={displayedCourses} />
      </div>

      {/* PAYWALL LCA STYLE */}
      <div className="relative py-40 bg-zinc-950/80 border-y border-white/5">
        <div className="container mx-auto px-6 blur-2xl grayscale opacity-10 pointer-events-none select-none">
             <h2 className="text-4xl font-black mb-12 tracking-tighter">ZONA PREMIUM LA CLAVE ARGENTINA</h2>
             <Courses coursesData={filteredCourses.slice(freeCoursesCount, freeCoursesCount + 4)} />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="bg-zinc-900 border border-yellow-600/40 p-12 md:p-20 rounded-[3rem] max-w-3xl text-center shadow-[0_0_150px_rgba(202,138,4,0.1)] relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-yellow-600 p-4 rounded-2xl">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            
            <h3 className="text-5xl font-black mb-6 tracking-tighter uppercase italic">Zona Exclusiva LCA</h3>
            <p className="text-zinc-400 text-xl mb-12 leading-relaxed">
              Desbloqueá el acceso total a <span className="text-white font-bold">{lockedCoursesCount} cursos premium</span> y actualizaciones constantes de La Clave Argentina. 
              Trato directo, activación al instante.
            </p>
            
            <div className="bg-black p-8 rounded-3xl border border-zinc-800 mb-12 text-left group hover:border-yellow-600/50 transition-colors">
               <div className="flex justify-between items-center mb-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">Datos de Pago // LCA</p>
                  <div className="text-yellow-600 font-bold text-xs uppercase">Ualá</div>
               </div>
               <p className="text-3xl font-black text-white mb-1">laclavear.pagos</p>
               <p className="text-sm text-zinc-600 font-medium uppercase">Titular: Daniel Edgardo Fiego</p>
            </div>

            <a 
              href="https://wa.me/542235590910?text=Hola%20Daniel!%20Quiero%20el%20acceso%20VIP%20de%20Cursin%20V2%20de%20La%20Clave%20Argentina.%20Acá%20tengo%20el%20comprobante." 
              target="_blank"
              className="btn btn-warning btn-lg w-full font-black text-2xl h-20 rounded-2xl shadow-2xl shadow-yellow-600/30 hover:scale-[1.02] transition-transform"
            >
              DESBLOQUEAR AHORA
            </a>
            <p className="mt-8 text-zinc-600 text-xs uppercase tracking-[0.4em] font-bold">Activación Directa vía WhatsApp</p>
          </div>
        </div>
      </div>

      {/* NEWSLETTER LCA */}
      <div className="bg-black py-40">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-6xl font-black mb-8 tracking-tighter uppercase">No te quedes afuera</h2>
          <p className="text-zinc-500 mb-16 text-2xl font-light leading-relaxed">
            Sumate al radar de <span className="text-white">La Clave Argentina</span>. 
            Te avisamos por mail cada vez que un nuevo curso de élite sea detectado.
          </p>
          
          {subscribed ? (
            <div className="bg-yellow-600 text-black p-10 rounded-3xl font-black text-2xl animate-bounce">
              ✓ ESTÁS DENTRO DE LA CLAVE.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Tu correo principal" 
                className="input input-bordered input-lg flex-grow bg-zinc-950 border-zinc-800 text-white rounded-2xl h-20 text-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-warning btn-lg px-12 font-black italic h-20 rounded-2xl text-xl">
                ENTRAR AL RADAR
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="py-32 border-t border-white/5 text-center bg-zinc-950/30">
        <div className="mb-10 flex justify-center">
           <div className="bg-yellow-600 text-black font-black py-2 px-4 rounded text-xl tracking-tighter">LA CLAVE ARGENTINA</div>
        </div>
        <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase mb-10">
          Hecho por Daniel Fiego // Plataforma Oficial Cursin V2
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-zinc-800 font-black text-xs uppercase tracking-tighter">
          <span>Google Cloud</span>
          <span>IBM Skills</span>
          <span>Santander</span>
          <span>Cisco Systems</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
