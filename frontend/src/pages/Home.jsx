import React, { useState, useMemo } from 'react';
import Courses from '../components/Courses';
import coursesDataRaw from '../data/courses.json';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['All', 'Programación', 'IA', 'Marketing', 'Diseño', 'Negocios'];

  // Separamos los cursos: 6 son libres, el resto son VIP
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
    <div className="min-h-screen bg-black text-white">
      <div className="hero bg-zinc-900/10 py-24 border-b border-white/5">
        <div className="hero-content text-center max-w-5xl mx-auto px-4">
          <div className="max-w-4xl">
            <div className="badge badge-warning mb-6 font-bold py-3 px-6 rounded-full">ACCESO VIP DISPONIBLE</div>
            <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-800 bg-clip-text text-transparent tracking-tighter uppercase">
              CURSIN V2
            </h1>
            <p className="text-2xl mb-12 text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              La biblioteca de cursos certificados más grande del país. 
              <span className="text-white font-bold"> 6 cursos libres</span> para que pruebes la calidad. Desbloqueá el resto por una suscripción mínima.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
              <input 
                type="text" 
                placeholder="¿Qué habilidad vas a dominar hoy?" 
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
                  className={`btn btn-sm rounded-lg px-8 capitalize font-bold transition-all ${selectedCategory === cat ? 'btn-warning border-none text-black' : 'btn-ghost bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN CURSOS LIBRES */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
           <h2 className="text-4xl font-black tracking-tighter italic">ACCESO LIBRE</h2>
           <div className="h-1 flex-grow bg-zinc-800"></div>
           <div className="badge badge-outline border-zinc-700">MUESTRAS GRATUITAS</div>
        </div>
        <Courses coursesData={displayedCourses} />
      </div>

      {/* MURO DE PAGO (PAYWALL) */}
      <div className="relative py-32 bg-zinc-950/50">
        <div className="container mx-auto px-6 blur-md grayscale opacity-20 pointer-events-none select-none">
             <h2 className="text-4xl font-black mb-12 tracking-tighter">CURSOS PREMIUM DESBLOQUEADOS</h2>
             <Courses coursesData={filteredCourses.slice(freeCoursesCount, freeCoursesCount + 4)} />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="bg-zinc-900 border border-yellow-600/30 p-12 rounded-3xl max-w-2xl text-center shadow-[0_0_100px_rgba(202,138,4,0.15)]">
            <div className="w-20 h-20 bg-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">¿Querés los otros {lockedCoursesCount} cursos?</h3>
            <p className="text-zinc-400 text-lg mb-8">
              Desbloqueá el acceso <span className="text-white font-bold italic">FULL</span> para siempre (o por mes) enviando el comprobante por WhatsApp. Sin APIs complicadas, trato directo.
            </p>
            
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5 mb-8 text-left">
               <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Datos de Transferencia (Ualá)</p>
               <p className="text-xl font-mono text-yellow-500">Alias: <span className="text-white">laclavear.pagos</span></p>
               <p className="text-sm text-zinc-400 mt-1">Daniel Edgardo Fiego</p>
            </div>

            <a 
              href="https://wa.me/542235590910?text=Hola%20Daniel!%20Acabo%20de%20transferir%20para%20el%20acceso%20VIP%20de%20Cursin%20V2.%20Acá%20está%20mi%20comprobante." 
              target="_blank"
              className="btn btn-warning btn-lg w-full font-black text-xl shadow-xl shadow-yellow-600/20"
            >
              ENVIAR COMPROBANTE POR WHATSAPP
            </a>
            <p className="mt-4 text-zinc-500 text-xs uppercase">Activación manual en menos de 30 minutos</p>
          </div>
        </div>
      </div>

      <footer className="py-24 text-center opacity-40">
        <p className="text-zinc-700 text-sm font-mono tracking-widest uppercase mb-6">
          CURSIN V2 // PLATAFORMA DE AGREGACIÓN PROFESIONAL
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-zinc-600 font-black text-sm">
          <span>GOOGLE</span> <span>IBM</span> <span>SANTANDER</span> <span>CISCO</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
