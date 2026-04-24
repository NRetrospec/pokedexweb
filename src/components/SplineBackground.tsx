import React from 'react';

const SplineBackground = () => {
  return (
    <div 
      className="fixed inset-0 z-0 bg-[url('/images/Pokedex Exzplorer Cover.png')] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />
    </div>
  );
};

export default SplineBackground;
