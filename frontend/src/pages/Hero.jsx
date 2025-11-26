import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <section className="relative h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden text-gray-800">
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="container relative flex flex-col justify-center items-center h-full px-6 mx-auto text-center lg:text-left lg:flex-row lg:justify-between">
        
        <div className="flex flex-col justify-center p-6 text-center lg:text-left lg:max-w-2xl z-10">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 text-gray-900">
            Lost something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Let's find it.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
            The official Lost & Found portal for NITK. Connect with peers to recover lost valuables or report items you've found.
          </p>
          
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start mt-10">
            <Link 
              to="/register" 
              className="flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-indigo-700 bg-white border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>

        
        <div className="hidden lg:flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
           <div className="relative w-full h-full bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center animate-float">
              <Search size={80} className="text-indigo-500 mb-4" />
              <div className="text-2xl font-bold text-indigo-900">Search. Find. Return.</div>
           </div>
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center text-gray-400 text-sm">
        Made by Kshitij
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Hero;