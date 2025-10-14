import React from 'react';

const Header = () => (
  <header className="fixed top-0 w-full bg-black/60 backdrop-blur-md border-b border-border-color z-50">
    <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
      <div className="text-base font-bold tracking-[3px] text-white">ALGORITHM MASTERY</div>
      <ul className="hidden sm:flex gap-6 md:gap-10 list-none">
        {['HOME', 'APPROACH', 'ALGORITHMS', 'PLAN'].map(item => (
          <li key={item}>
            <a href={`/#${item.toLowerCase()}`} className="text-gray-300 text-sm font-normal tracking-wider transition-colors duration-300 hover:text-red-500">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
