import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TYPE_COLORS: Record<string, [string, string]> = {
  Fire: ["#f87171", "#ea580c"],
  Water: ["#60a5fa", "#2563eb"],
  Electric: ["#fde047", "#ca8a04"],
  Grass: ["#4ade80", "#16a34a"],
  Psychic: ["#f472b6", "#db2777"],
  Dragon: ["#818cf8", "#4338ca"],
  Ghost: ["#c084fc", "#7e22ce"],
  Ice: ["#93c5fd", "#3b82f6"],
  Fighting: ["#ef4444", "#991b1b"],
  Poison: ["#a855f7", "#7e22ce"],
  Normal: ["#9ca3af", "#6b7280"],
  Flying: ["#818cf8", "#4f46e5"],
  Bug: ["#86efac", "#15803d"],
  Rock: ["#d97706", "#92400e"],
  Dark: ["#374151", "#111827"],
  Steel: ["#9ca3af", "#4b5563"],
  Fairy: ["#f9a8d4", "#db2777"],
  Ground: ["#fbbf24", "#b45309"],
};

type TypeBadgeProps = {
  type: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, delay = 0, size = "md" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;
  const s = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 200 } });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const [from, to] = TYPE_COLORS[type] ?? TYPE_COLORS.Normal;
  const fontSize = size === "lg" ? 36 : size === "md" ? 28 : 22;
  const px = size === "lg" ? 32 : size === "md" ? 24 : 18;
  const py = size === "lg" ? 16 : size === "md" ? 12 : 8;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        borderRadius: 999,
        padding: `${py}px ${px}px`,
        fontSize,
        fontWeight: 700,
        color: "#fff",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "0.05em",
        border: "2px solid rgba(255,255,255,0.3)",
      }}
    >
      {type}
    </div>
  );
};

export { TYPE_COLORS };
