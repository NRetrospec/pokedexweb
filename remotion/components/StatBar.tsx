import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type StatBarProps = {
  label: string;
  value: number;
  max?: number;
  color: string;
  delay?: number;
};

export const StatBar: React.FC<StatBarProps> = ({ label, value, max = 160, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;
  const s = spring({ frame: localFrame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const width = interpolate(s, [0, 1], [0, (value / max) * 100]);
  const opacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ opacity, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{
        width: 180,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: 28,
        color: "rgba(255,255,255,0.7)",
        fontWeight: 600,
        textAlign: "right",
        textTransform: "capitalize",
      }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", width: 56, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        {value}
      </div>
      <div style={{ flex: 1, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
        <div style={{
          width: `${width}%`,
          height: "100%",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          boxShadow: `0 0 12px ${color}80`,
        }} />
      </div>
    </div>
  );
};
