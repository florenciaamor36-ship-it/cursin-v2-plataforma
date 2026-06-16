/* eslint-disable react/prop-types */
import React from 'react'

function CourseCard({ course }) {
  const title = course.title || course.Title;
  const description = course.CourseOverview || course.Description;
  const image = course.imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";
  const link = course.link || course.Link;

  function handleAction(e) {
    e.stopPropagation();
    window.open(link, "_blank");
  }

  return (
    <div 
      onClick={handleAction} 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-base-200 overflow-hidden"
    >
      <figure className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2">
          <div className="badge badge-primary font-bold shadow-lg">FREE</div>
        </div>
      </figure>
      <div className="card-body p-5">
        <div className="flex flex-wrap gap-1 mb-2">
          <div className="badge badge-ghost badge-sm">Course</div>
          <div className="badge badge-ghost badge-sm">Trending</div>
        </div>
        <h3 className="card-title text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-base-content/70 line-clamp-2 mt-2 leading-relaxed">
          {description}
        </p>
        <div className="card-actions justify-between items-center mt-6">
          <div className="flex flex-col">
            <span className="text-xs text-base-content/50 line-through">
              $89.99
            </span>
            <span className="text-xl font-black text-primary">
              FREE
            </span>
          </div>
          <button 
            onClick={handleAction} 
            className="btn btn-primary btn-md shadow-lg group-hover:translate-x-1 transition-transform"
          >
            Start Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
