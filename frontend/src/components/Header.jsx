import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigator = useNavigate();
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() === "") return;
    navigator(`/search?q=${search}`);
  }

  // Static user data for "Guest"
  const userData = {
    username: "Guest",
    avatar: "https://placehold.co/200x200?text=G"
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 md:px-8">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-2xl shadow-lg">
            C
          </div>
          <span className="text-2xl font-black tracking-tighter hidden sm:block">
            COURSIFY<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      <div className="flex-none gap-4">
        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search courses..."
              className="input input-bordered w-64 focus:border-primary transition-all duration-300 rounded-full pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar online shadow-sm ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 transition-transform"
          >
            <div className="w-10 rounded-full">
              <img alt="User avatar" src={userData.avatar} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-2xl border border-base-200"
          >
            <li className="menu-title">
              <span className="text-xs uppercase font-bold text-base-content/50">Account</span>
            </li>
            <li>
              <a className="font-semibold">{userData.username}</a>
            </li>
            <div className="divider my-1"></div>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/purchased">My Learning</Link>
            </li>
            <li>
              <Link to="/admin">Instructor Dashboard</Link>
            </li>
            <div className="divider my-1"></div>
            <li>
              <a className="text-error font-medium">Sign Out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
