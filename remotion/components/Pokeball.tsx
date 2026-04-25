import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type PokeballProps = {
  size?: number;
  delay?: number;
  spin?: boolean;
  glow?: boolean;
};

export const Pokeball: React.FC<PokeballProps> = ({ size = 200, delay = 0, spin = false, glow = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;
  const s = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const rotation = spin ? interpolate(localFrame, [0, 180], [0, 360], { extrapolateRight: "clamp" }) : 0;

  const r = size / 2;
  const strokeW = size * 0.04;
  const centerR = size * 0.1;
  const centerStroke = size * 0.03;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      width: size,
      height: size,
      filter: glow ? `drop-shadow(0 0 ${size * 0.15}px rgba(220,38,38,0.8)) drop-shadow(0 0 ${size * 0.05}px rgba(255,255,255,0.6))` : undefined,
    }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Top half – red */}
        <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#DC2626" />
        {/* Bottom half – white */}
        <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="#f1f5f9" />
        {/* Outer ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth={strokeW} />
        {/* Middle band */}
        <line x1="5" y1="50" x2="95" y2="50" stroke="#1a1a1a" strokeWidth={strokeW} />
        {/* Center button ring */}
        <circle cx="50" cy="50" r="12" fill="#f1f5f9" stroke="#1a1a1a" strokeWidth={centerStroke} />
        {/* Center button inner */}
        <circle cx="50" cy="50" r="6" fill="#e2e8f0" />
      </svg>
    </div>
  );
};
