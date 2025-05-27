import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottieLogin = ({ onComplete }) => {
  return (
    <div className="flex justify-center items-center p-4 mb-6">
      <Player
        autoplay
        loop={false}
        src="/assets/animations/login-animation.json"
        className="w-48 h-48"
        onEvent={event => {
          if (event === 'complete' && onComplete) {
            onComplete();
          }
        }}
      />
    </div>
  );
};

export default LottieLogin;