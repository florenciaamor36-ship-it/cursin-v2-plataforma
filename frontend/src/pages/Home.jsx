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
      // Logic for capturing email (Fase 1: Local notification, Fase 2: Supabase)
      console.log('Interés en newsletter:', email);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="hero bg-zinc-900/20 py-20 border-b border-white/5">
        <div className="hero-content text-center max-w-4xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-black mb-6 bg-gradient-to-b from-yellow-400 to-yellow-700 bg-clip-text text-transparent tracking-tighter">
              CURSIN V2
            </h1>
            <p className="text-xl mb-12 opacity-60 font-light max-w-2xl mx-auto leading-relaxed">
              Buscador inteligente de cursos gratuitos de élite. 
              Recopilamos lo mejor de <span className="text-white font-medium">Google, IBM y Santander</span>.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
              <input 
                type="text" 
                placeholder="¿Qué curso buscás hoy?" 
                className="input input-bordered input-lg w-full max-w-md bg-zinc-950 border-zinc-800 text-white focus:border-yellow-600 focus:ring-0 shadow-2xl rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm rounded-lg px-6 capitalize ${selectedCategory === cat ? 'btn-warning border-none text-black' : 'btn-ghost bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-md">
            <h2 className="text-4xl font-black tracking-tighter mb-2 italic">
              {selectedCategory === 'All' ? 'TODOS LOS CURSOS' : selectedCategory.toUpperCase()}
            </h2>
            <div className="h-1 w-20 bg-yellow-600"></div>
          </div>
          <div className="text-zinc-500 text-sm font-mono">
            [ {filteredCourses.length} CURSOS CARGADOS ]
          </div>
        </div>
        <Courses coursesData={filteredCourses} />
      </div>

      {/* SECCIÓN NEWSLETTER */}
      <div className="bg-zinc-900/40 py-24 border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-4xl font-black mb-4">¿Querés el VIP de cursos?</h2>
          <p className="text-zinc-400 mb-8 text-lg">Dejanos tu mail y te avisamos apenas detectemos nuevos cursos gratuitos de Google, IBM o Microsoft.</p>
          
          {subscribed ? (
            <div className="alert alert-success bg-yellow-600 text-black border-none font-bold">
              <span>✓ ¡Agendado! Revisá tu mail pronto.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="input input-bordered input-lg flex-grow bg-zinc-950 border-zinc-800 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-warning btn-lg px-10 font-bold">AVISAME</button>
            </form>
          )}
        </div>
      </div>

      <footer className="py-24 text-center">
        <p className="text-zinc-700 text-sm font-mono tracking-widest uppercase mb-4">
          Plataforma Recopiladora de Cursos Gratuitos
        </p>
        <div className="flex justify-center gap-8 text-zinc-800 font-bold uppercase tracking-tighter">
          <span>Google</span>
          <span>IBM</span>
          <span>Santander</span>
          <span>CISCO</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
