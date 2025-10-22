import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const AlgoCard = ({ title, when, keywords, examples, code, slug }) => {
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    const fetchSolvedCount = async () => {
      try {
        const docRef = doc(db, "solved_questions", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const questions = docSnap.data().questions || [];
          setSolvedCount(questions.length);
        }
      } catch (err) {
        console.error("Failed to fetch solved questions count:", err);
      }
    };

    fetchSolvedCount();
  }, [slug]);

  return (
    <div className="relative bg-white shadow-lg shadow-gray-200/50 dark:shadow-none dark:bg-black/60 backdrop-blur-md border border-gray-200 dark:border-border-color rounded-2xl p-8 transition-all duration-500 ease-in-out flex flex-col h-full hover:border-red-500/50 md:hover:-translate-y-1 dark:hover:shadow-[0_0_25px_rgba(255,0,0,0.25)]">
      
      {/* Solved questions count badge */}
      {solvedCount > 0 && (
        <div className="absolute top-4 right-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg shadow-red-600/50">
          {solvedCount}
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-5 tracking-wide text-gray-900 dark:text-white">{title}</h3>
      <span className="text-xs font-semibold text-red-500 tracking-widest mt-4 mb-2 block uppercase">WHEN TO USE</span>
      <p className="text-sm font-light leading-relaxed text-gray-600 dark:text-gray-300 dark:opacity-80 flex-grow">{when}</p>
      <div className="mt-auto pt-5">
        <strong className="font-medium text-gray-800 dark:text-white/90 text-sm">EXAMPLES:</strong> 
        <span className="text-sm text-gray-600 dark:text-gray-300 dark:opacity-70"> {examples}</span>
      </div>
      <div className="mt-6">
        <Link
          to={`/algorithm/${slug}`}
          className="inline-block w-full text-center px-6 py-2 bg-transparent text-red-500 border border-red-500/50 rounded-lg text-xs font-semibold tracking-widest transition-all duration-300 hover:bg-red-500 hover:text-white dark:hover:text-black hover:border-red-500"
        >
          LEARN MORE
        </Link>
      </div>
    </div>
  );
};

export default AlgoCard;