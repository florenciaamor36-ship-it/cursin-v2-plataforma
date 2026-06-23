import React, { useState, useMemo, useEffect } from 'react';
import Courses from '../components/Courses';

// Configuración de Supabase
const SUPABASE_URL = 'https://ypzudkxowpxvdggvongz.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_publishable_KmyqfJTmmW4R5FKUeB5b4A_GVFYnn4b';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [allCourses, setAllCourses] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(60);

  const categories = ['Todo', 'Español', 'Universidad', 'Plataforma', 'País', 'Provincia', 'Idiomas', 'Carrera', 'Acelerados', 'Certificado', 'IA', 'Programación', 'Marketing'];

  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        const response = await fetch(, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map(c => ({
            Title: c.titulo,
            Description: c.descripcion,
            Link: c.url,
            imageLink: c.imagen_url,
            Category: c.categorias ? c.categorias.nombre : 'General',
            Provider: c.plataforma,
            isFeatured: (c.plataforma || '').toLowerCase().includes('santander') || (c.plataforma || '').toLowerCase().includes('youtube')
          }));
          setAllCourses(formatted);
        }
      } catch (err) {
        console.error('Error cargando de Supabase:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFromSupabase();
  }, []);

  const filteredCourses = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return allCourses.filter(course => 
      (course.Title || '').toLowerCase().includes(search) || 
      (course.Description || '').toLowerCase().includes(search)
    );
  }, [searchQuery, allCourses]);

  const displayedCourses = filteredCourses.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-10">
        <h1 className="text-5xl font-black mb-10">CURSIN V2 - MODO SUPABASE</h1>
        <p className="mb-10 text-zinc-400">Cursos cargados: {allCourses.length}</p>
        <input 
          type="text" 
          placeholder="BUSCAR..." 
          className="w-full p-4 bg-zinc-900 border border-zinc-800 mb-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedCourses.map((c, i) => (
            <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
               <h3 className="font-bold text-yellow-600 mb-2">{c.Title}</h3>
               <p className="text-xs text-zinc-500 mb-4">{c.Description?.substring(0, 100)}...</p>
               <a href={c.Link} target="_blank" className="text-[10px] uppercase font-bold text-white bg-zinc-800 px-4 py-2">Ver Curso</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
