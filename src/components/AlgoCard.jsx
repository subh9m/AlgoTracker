import React from 'react';
import { Link } from 'react-router-dom';

const AlgoCard = ({ title, when, keywords, examples, code, slug }) => (
  <div className="bg-black/60 backdrop-blur-md border border-border-color rounded-2xl p-8 transition-all duration-500 ease-in-out flex flex-col h-full hover:border-red-500/50 md:hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,0,0,0.25)]">
    <h3 className="text-2xl font-semibold mb-5 tracking-wide text-white">{title}</h3>
    <span className="text-xs font-semibold text-red-500 tracking-widest mt-4 mb-2 block uppercase">WHEN TO USE</span>
    <p className="text-sm font-light leading-relaxed opacity-80 flex-grow">{when}</p>
    <div className="mt-auto pt-5">
      <strong className="font-medium text-white/90 text-sm">EXAMPLES:</strong> 
      <span className="text-sm opacity-70"> {examples}</span>
    </div>
    
    <div className="mt-6">
      <Link
        to={`/algorithm/${slug}`}
        className="inline-block w-full text-center px-6 py-2 bg-transparent text-red-500 border border-red-500/50 rounded-lg text-xs font-semibold tracking-widest transition-all duration-300 hover:bg-red-500 hover:text-black hover:border-red-500"
      >
        LEARN MORE
      </Link>
    </div>
  </div>
);

export default AlgoCard;