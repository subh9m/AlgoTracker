import React from 'react';

const SectionTitle = ({ title, subtitle }) => (
  <>
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center text-white mb-5" style={{ textShadow: '0 0 20px rgba(255, 0, 0, 0.3)' }}>
      {title}
    </h2>
    <p className="text-base md:text-lg font-light tracking-wider text-center mb-20 opacity-70 max-w-3xl mx-auto">
      {subtitle}
    </p>
  </>
);

export default SectionTitle;