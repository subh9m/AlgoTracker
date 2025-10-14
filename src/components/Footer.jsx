import React from 'react';

const Footer = () => (
  <footer className="border-t border-border-color py-16 px-6 md:px-10 text-center">
    <div className="max-w-7xl mx-auto">
      <ul className="flex justify-center gap-6 md:gap-10 list-none mb-8">
        {['Home', 'Approach', 'Algorithms', 'Plan'].map(link => (
          <li key={link}>
            <a href={`/#${link.toLowerCase()}`} className="text-gray-300 text-sm tracking-wider transition-colors duration-300 hover:text-red-500">
              {link}
            </a>
          </li>
        ))}
      </ul>
      <div className="text-xs font-light opacity-50 tracking-wider">
        © {new Date().getFullYear()} Algorithm Mastery — All rights reserved
      </div>
    </div>
  </footer>
);

export default Footer;
