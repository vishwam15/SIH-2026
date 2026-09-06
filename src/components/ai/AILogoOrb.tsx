import React from 'react';

interface AILogoOrbProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showHoverEffect?: boolean;
}

export const AILogoOrb: React.FC<AILogoOrbProps> = ({
  size = 'md',
  className = '',
  showHoverEffect = true,
}) => {
  // Dimensions map
  const dimensions = {
    sm: { container: 'w-10 h-10', orb: 'w-6 h-6 text-[10px]', stroke: 2.2 },
    md: { container: 'w-16 h-16', orb: 'w-10 h-10 text-sm font-black', stroke: 2.8 },
    lg: { container: 'w-20 h-20', orb: 'w-12 h-12 text-lg font-black', stroke: 3.2 },
  };

  const dim = dimensions[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${dim.container} ${
        showHoverEffect ? 'animate-orb-float' : ''
      } ${className}`}
    >
      {/* Outer Circling Ring Layer (Clockwise Rotation) */}
      <svg
        className="absolute inset-0 w-full h-full animate-ring-cw pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Arc 1: Amber / Orange Arc (Top-Left quadrant, matching reference) */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#F59E0B"
          strokeWidth={dim.stroke}
          strokeLinecap="round"
          strokeDasharray="72 204"
          strokeDashoffset="75"
          className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        />

        {/* Arc 2: Rose / Pink Arc (Bottom-Right quadrant, matching reference) */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#F43F5E"
          strokeWidth={dim.stroke}
          strokeLinecap="round"
          strokeDasharray="64 212"
          strokeDashoffset="-60"
          className="drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
        />
      </svg>

      {/* Inner Circling Ring Layer (Counter-Clockwise Rotation) */}
      <svg
        className="absolute inset-0 w-full h-full animate-ring-ccw pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Arc 3: Cyan / Aqua Arc (Inner-Left quadrant, matching reference) */}
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="#00F0FF"
          strokeWidth={dim.stroke}
          strokeLinecap="round"
          strokeDasharray="56 164"
          strokeDashoffset="40"
          className="drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]"
        />

        {/* Arc 4: Purple / Violet Arc (Inner-Right quadrant, matching reference) */}
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="#A855F7"
          strokeWidth={dim.stroke}
          strokeLinecap="round"
          strokeDasharray="50 170"
          strokeDashoffset="-70"
          className="drop-shadow-[0_0_8px_rgba(168,85,247,0.85)]"
        />
      </svg>

      {/* Center AI Sphere Glowing Orb */}
      <div
        className={`relative z-10 flex items-center justify-center rounded-full text-white ai-orb-glow transition-all duration-300 ${dim.orb}`}
        style={{
          background:
            'radial-gradient(circle at 35% 35%, #818CF8 0%, #4F46E5 45%, #312E81 90%, #1E1B4B 100%)',
        }}
      >
        <span className="font-extrabold tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          AI
        </span>
      </div>
    </div>
  );
};
