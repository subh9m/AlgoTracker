import React from 'react';
// 1. Import HashLink to handle scrolling to page sections
import { HashLink as Link } from 'react-router-hash-link';

// Import Data
import {
  approachSteps,
  foundationalAlgos,
  advancedAlgos,
  timelineData,
  quotesData
} from '../data';

// Import Components
import SectionTitle from '../components/SectionTitle';
import AlgoCard from '../components/AlgoCard';
import QuoteRotator from '../components/QuoteRotator';
import FocusTimer from '../components/FocusTimer';

const HomePage = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section id="home" className="pt-32 pb-24 px-6 md:px-10 text-center border-b border-gray-200 dark:border-border-color">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight text-gray-900 dark:text-white">
          MASTER ALGORITHMS.<br />CRACK INTERVIEWS.
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wider max-w-3xl mx-auto mb-12 text-gray-600 dark:text-gray-300 dark:opacity-80">
          Transform from struggling coder to confident problem solver. Battle-tested strategies from FAANG interviews.
        </p>
        {/* 2. Replace the <a> tag with the Link component */}
        <Link
          to="/#approach"
          smooth
          className="inline-block px-8 py-3 bg-transparent text-red-500 border-2 border-red-500 rounded-xl text-sm font-semibold tracking-widest transition-all duration-300 ease-in-out hover:bg-red-500 hover:text-white dark:hover:text-black hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] md:hover:-translate-y-1 active:scale-95"
        >
          START LEARNING
        </Link>
      </section>

      <QuoteRotator quotes={quotesData.set1.quotes} duration={quotesData.set1.duration} />

      {/* APPROACH SECTION */}
      <div id="approach" className="max-w-7xl mx-auto px-6 md:px-10 py-20 space-y-16">
        <SectionTitle title="THE 5-STEP APPROACH" subtitle="A systematic method to solve any coding interview problem" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {approachSteps.map(step => (
            <div key={step.num} className="bg-white shadow-lg shadow-gray-200/50 dark:shadow-none dark:bg-black/60 backdrop-blur-md border border-gray-200 dark:border-border-color rounded-2xl p-8 transition-all duration-500 ease-in-out flex flex-col hover:border-red-500/50 md:hover:-translate-y-1 dark:hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] active:scale-[0.98] md:active:scale-100">
              <div className="text-6xl font-bold text-red-500 leading-none mb-5" style={{fontFamily: '"IBM Plex Mono", monospace'}}>{step.num}</div>
              <h3 className="text-xl font-semibold tracking-wider mb-4 text-gray-900 dark:text-white uppercase">{step.title}</h3>
              <p className="text-sm font-light leading-relaxed text-gray-600 dark:text-white dark:opacity-80 flex-grow">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <QuoteRotator quotes={quotesData.set2.quotes} duration={quotesData.set2.duration} />

      {/* ALGORITHMS SECTION */}
      <div id="algorithms" className="max-w-7xl mx-auto px-6 md:px-10 py-20 space-y-16">
        <SectionTitle title="FOUNDATIONAL ALGORITHMS" subtitle="Master these patterns to solve 90% of interview problems" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foundationalAlgos.map(algo => <AlgoCard key={algo.title} {...algo} />)}
        </div>
        <div className="h-px bg-gray-200 dark:bg-border-color my-20"></div>
        <SectionTitle title="ADVANCED ALGORITHMS" subtitle="Level up with these sophisticated techniques" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advancedAlgos.map(algo => <AlgoCard key={algo.title} {...algo} />)}
        </div>
      </div>

      <QuoteRotator quotes={quotesData.set3.quotes} duration={quotesData.set3.duration} />

      {/* ACTION PLAN SECTION */}
      <div id="plan" className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <SectionTitle title="YOUR 8-WEEK ACTION PLAN" subtitle="From foundation to expert level mastery" />
        <div className="mt-16 max-w-3xl mx-auto">
          {timelineData.map((item, index) => (
            <div key={index} className="pl-8 sm:pl-10 pb-16 border-l-2 border-gray-200 dark:border-border-color relative transition-colors duration-300 ease-in-out hover:border-red-500 group">
              <div className="absolute left-[-8px] top-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-black transition-all duration-300 ease-in-out group-hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
              <div className="text-sm font-semibold tracking-widest text-red-500 mb-2.5 uppercase">{item.week}</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm font-light text-gray-600 dark:text-white dark:opacity-80 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <QuoteRotator quotes={quotesData.set4.quotes} duration={quotesData.set4.duration} />

      <FocusTimer />
    </>
  );
};

export default HomePage;