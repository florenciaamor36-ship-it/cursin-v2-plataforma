/* eslint-disable react/prop-types */
import React from "react";
import CourseCard from "./CourseCard";

const Courses = ({ coursesData = [], favorites = [], toggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {coursesData.map((course, index) => (
        <CourseCard 
          key={course.Link || course.link || index} 
          course={course} 
          isFavorite={favorites.includes(course.Link || course.link)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};

export default Courses;
