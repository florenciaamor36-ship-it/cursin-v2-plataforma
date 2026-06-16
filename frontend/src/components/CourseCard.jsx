/* eslint-disable react/prop-types */
import React from 'react'

function CourseCard({course}) {
  function handleEnroll (e){
    e.stopPropagation();
    window.open(course.link || course.Link, "_blank");
  }

  function handleCardClick(e){
    e.stopPropagation();
    window.open(course.link || course.Link, "_blank");
  }

  return (
    <div onClick={handleCardClick} className="card bg-base-100 shadow-lg cursor-pointer">
      <figure>
        <img src={course.imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"} alt={course.title || course.Title} className="w-full h-40 object-cover" />
      </figure>
      <div className="card-body">
        <h3 className="text-xl font-bold text-neutral-content">{course.title || course.Title}</h3>
        <p className="text-neutral-content">{course.CourseOverview || course.Description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold text-primary">Free</span>
          <button onClick={handleEnroll} className="btn btn-primary">Go to Course</button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
