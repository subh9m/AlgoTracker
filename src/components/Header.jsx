import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Sun, Moon } from "lucide-react";
import useTheme from "../hooks/useTheme";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full bg-white/70 dark:bg-black/60 backdrop-blur-md border-b border-gray-300 dark:border-border-color z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <div className="text-base font-bold tracking-[3px] text-gray-900 dark:text-white">
          ALGORITHM MASTERY
        </div>

        {/* Links */}
        <ul className="hidden sm:flex gap-6 md:gap-10 list-none">
          {["HOME", "APPROACH", "ALGORITHMS", "PLAN"].map((item) => (
            <li key={item}>
              <Link
                to={`/#${item.toLowerCase()}`}
                className="text-gray-800 dark:text-gray-300 text-sm font-normal tracking-wider transition-colors duration-300 hover:text-red-500"
                smooth
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-gray-800" />
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;