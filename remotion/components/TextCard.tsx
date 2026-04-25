import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type TextCardProps = {
  lines: string[];
  delay?: number;
  fontSize?: number;
  color?: string;
  accent?: boolean;
};

export const TextCard: React.FC<TextCardProps> = ({
  lines,
  delay = 0,
  fontSize = 80,
  color = "#ffffff",
  accent = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {lines.map((line, i) => {
        const localFrame = frame - delay - i * 8;
        const s = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 180 } });
        const opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const y = interpolate(s, [0, 1], [40, 0]);

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: accent && i === lines.length - 1 ? 900 : 800,
              fontSize,
              color: accent && i === lines.length - 1 ? "#FFD700" : color,
              textAlign: "center",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
