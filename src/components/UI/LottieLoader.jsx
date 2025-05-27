import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottieLoader = ({ size = "medium", text = "Carregando..." }) => {
  const getSizeClass = () => {
    switch (size) {
      case "small": return "h-16 w-16";
      case "large": return "h-32 w-32";
      default: return "h-24 w-24";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Player
        autoplay
        loop
        src="/assets/animations/loading-animation.json"
        className={getSizeClass()}
      />
      {text && (
        <p className="mt-4 text-blue-700 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LottieLoader;