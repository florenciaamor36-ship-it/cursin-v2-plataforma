import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigator = useNavigate();
  const [search, setSearch] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() === '') return;
    navigator(`/search?q=${search}`);
  }

  return (
    <div className="navbar bg-black border-b border-white/5 sticky top-0 z-50 px-4 md:px-8">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-yellow-600 text-black font-black p-1 rounded text-xs tracking-tighter">LCA</div>
          <span className="text-xl font-black tracking-tighter text-white group-hover:text-yellow-500 transition-colors">LA CLAVE ARGENTINA</span>
        </Link>
      </div>
      <div className="flex-none gap-4">
        <div className="hidden md:flex gap-4 mr-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
           <Link to="/" className="hover:text-white">Inicio</Link>
           <span className="opacity-20 text-white">//</span>
           <span className="text-yellow-600/50">Cursos Premium</span>
        </div>
        <form onSubmit={handleSearch} className="form-control hidden sm:block">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Buscar..."
            className="input input-bordered input-sm bg-zinc-900 border-zinc-800 w-32 focus:w-48 transition-all"
          />
        </form>
      </div>
    </div>
  );
}

export default Header;
