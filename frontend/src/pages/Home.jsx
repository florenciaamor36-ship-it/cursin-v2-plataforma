import React from 'react';
import Courses from '../components/Courses';
import coursesData from '../data/courses.json';

const Home = () => {
  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Hero Section */}
      <div className="hero bg-base-100 py-16 md:py-24 border-b border-base-200">
        <div className="hero-content text-center max-w-4xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Level up your skills
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
              Unlock Your Potential with <span className="text-primary italic">Coursify</span>
            </h1>
            <p className="text-lg md:text-xl text-base-content/70 mb-10 leading-relaxed">
              Explore thousands of high-quality courses taught by industry experts. 
              Start learning today and transform your career with our world-class platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-lg shadow-xl px-10">
                Browse Courses
              </button>
              <button className="btn btn-outline btn-lg px-10">
                View Learning Path
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold">
                <span className="text-2xl">4.9/5</span>
                <span className="text-xs uppercase leading-tight text-left">Average<br/>Rating</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <span className="text-2xl">10k+</span>
                <span className="text-xs uppercase leading-tight text-left">Active<br/>Students</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <span className="text-2xl">500+</span>
                <span className="text-xs uppercase leading-tight text-left">Expert<br/>Mentors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
            <p className="text-base-content/60">Hand-picked selections just for you</p>
          </div>
          <button className="btn btn-ghost btn-sm">View all →</button>
        </div>
        <Courses coursesData={coursesData}/>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-content py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Stay ahead of the curve</h2>
          <p className="mb-8 opacity-90">Get the latest course updates and career tips directly in your inbox.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="text" placeholder="your@email.com" className="input input-bordered w-full text-base-content" />
            <button className="btn btn-neutral">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
