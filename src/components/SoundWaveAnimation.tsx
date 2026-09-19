import React from 'react';

interface SoundWaveProps {
  intensity?: 'gentle' | 'moderate' | 'immersive' | 'idle';
  className?: string;
}

export const SoundWaveAnimation: React.FC<SoundWaveProps> = ({
  intensity = 'gentle',
  className = ''
}) => {
  const barCount = 18;
  const heightMultiplier =
    intensity === 'immersive' ? 1.4 : intensity === 'moderate' ? 1.0 : intensity === 'gentle' ? 0.7 : 0.4;

  return (
    <div className={`flex items-center justify-center gap-[3px] h-10 ${className}`} aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => {
        // Bell curve wave distribution
        const distance = Math.abs(i - barCount / 2);
        const baseHeight = Math.max(12, Math.round(36 - distance * 2.8)) * heightMultiplier;
        const animDelay = (i * 0.12).toFixed(2);
        const animDuration = (1.6 + (i % 3) * 0.4).toFixed(2);

        return (
          <span
            key={i}
            className="w-[3px] bg-gradient-to-t from-[#B38E5D] to-[#D4B98B] rounded-full inline-block transition-all duration-500"
            style={{
              height: `${baseHeight}px`,
              animation: `pulse-gentle ${animDuration}s ease-in-out ${animDelay}s infinite alternate`
            }}
          />
        );
      })}
    </div>
  );
};
