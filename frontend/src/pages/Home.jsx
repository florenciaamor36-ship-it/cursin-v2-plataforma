import React, { useState, useMemo } from 'react';
import Courses from '../components/Courses';
import coursesDataRaw from '../data/courses.json';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['All', 'Programación', 'IA', 'Marketing', 'Diseño', 'Negocios'];

  const filteredCourses = useMemo(() => {
    return coursesDataRaw.filter(course => {
      const title = (course.title || course.Title || '').toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || (course.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Lead capturado:', email);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="hero bg-zinc-900/10 py-24 border-b border-white/5">
        <div className="hero-content text-center max-w-5xl mx-auto px-4">
          <div className="max-w-4xl">
            <div className="badge badge-warning mb-6 font-bold py-3 px-6 rounded-full">ACCESO GRATUITO POR TIEMPO LIMITADO</div>
            <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-800 bg-clip-text text-transparent tracking-tighter uppercase">
              CURSIN V2
            </h1>
            <p className="text-2xl mb-12 text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              Dejá de pagar por educación que otros regalan. 
              Recopilamos la <span className="text-white font-bold">ÉLITE de cursos certificados</span> de Google, IBM y Santander en un solo radar.
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
                  className={`btn btn-sm rounded-lg px-8 capitalize font-bold transition-all ${selectedCategory === cat ? 'btn-warning border-none text-black scale-105 shadow-lg shadow-yellow-600/20' : 'btn-ghost bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-l-4 border-yellow-600 pl-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter">
              {selectedCategory === 'All' ? 'CURSOS DISPONIBLES' : selectedCategory.toUpperCase()}
            </h2>
            <p className="text-zinc-500 mt-2 text-lg uppercase tracking-widest">Oportunidades de carrera detectadas: {filteredCourses.length}</p>
          </div>
          <div className="badge badge-outline border-zinc-700 p-4 text-zinc-400 font-mono">ESTADO: RADAR ACTIVO</div>
        </div>
        <Courses coursesData={filteredCourses} />
      </div>

      {/* SECCIÓN NEWSLETTER AGRESIVA */}
      <div className="bg-gradient-to-b from-zinc-950 to-black py-32 border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black mb-6 tracking-tighter">¿VAS A LLEGAR TARDE OTRA VEZ?</h2>
          <p className="text-zinc-400 mb-12 text-xl font-light">
            Los mejores cursos de <span className="text-white">IBM y Microsoft</span> se agotan o pasan a ser pagos. 
            Sumate al círculo exclusivo y recibí el aviso antes que el resto.
          </p>
          
          {subscribed ? (
            <div className="alert alert-success bg-yellow-600 text-black border-none font-black text-xl py-6 shadow-2xl">
              <span>✓ BIENVENIDO AL ÉLITE. REVISÁ TU MAIL.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-0 group">
              <input 
                type="email" 
                placeholder="Ingresá tu correo profesional" 
                className="input input-bordered input-lg flex-grow bg-black border-zinc-800 text-white rounded-r-none focus:border-yellow-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-warning btn-lg rounded-l-none px-12 font-black italic tracking-tighter">
                OBTENER VENTAJA
              </button>
            </form>
          )}
          <p className="mt-6 text-zinc-600 text-xs uppercase tracking-widest">No enviamos spam. Solo minas de oro educativas.</p>
        </div>
      </div>

      <footer className="py-24 text-center opacity-40">
        <p className="text-zinc-700 text-sm font-mono tracking-widest uppercase mb-6">
          CURSIN V2 // PLATAFORMA DE AGREGACIÓN PROFESIONAL
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-zinc-600 font-black text-sm">
          <span>GOOGLE CLOUD</span>
          <span>IBM SKILLSBUILD</span>
          <span>SANTANDER OPEN ACADEMY</span>
          <span>CISCO NETACAD</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
