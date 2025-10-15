import React from 'react';
// 1. Import HashLink instead of Link
import { HashLink as Link } from 'react-router-hash-link';

const Header = () => (
  <header className="fixed top-0 w-full bg-black/60 backdrop-blur-md border-b border-border-color z-50">
    <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
      <div className="text-base font-bold tracking-[3px] text-white">ALGORITHM MASTERY</div>
      <ul className="hidden sm:flex gap-6 md:gap-10 list-none">
        {['HOME', 'APPROACH', 'ALGORITHMS', 'PLAN'].map(item => (
          <li key={item}>
            {/* 2. Use the new Link. It will now scroll smoothly. */}
            <Link 
              to={`/#${item.toLowerCase()}`} 
              className="text-gray-300 text-sm font-normal tracking-wider transition-colors duration-300 hover:text-red-500"
              smooth
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;