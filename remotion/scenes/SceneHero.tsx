// Frames 600–810 (20–27s): Hero — Charizard detail modal, stat bars animating, compare reveal
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StatBar } from "../components/StatBar";
import { TypeBadge } from "../components/TypeBadge";
import { TextCard } from "../components/TextCard";

const CHARIZARD_IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png";

const STATS = [
  { label: "HP",       value: 78,  color: "#4ade80" },
  { label: "Attack",   value: 84,  color: "#f87171" },
  { label: "Defense",  value: 78,  color: "#60a5fa" },
  { label: "Sp. Atk",  value: 109, color: "#c084fc" },
  { label: "Sp. Def",  value: 85,  color: "#fbbf24" },
  { label: "Speed",    value: 100, color: "#34d399" },
];

export const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const outOpacity = interpolate(frame, [185, 210], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Header gradient entrance
  const headerSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const headerY = interpolate(headerSpring, [0, 1], [-60, 0]);

  // Charizard image entrance
  const imgSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const imgScale = interpolate(imgSpring, [0, 1], [0.5, 1]);
  const imgY = interpolate(imgSpring, [0, 1], [60, 0]);

  // Floating animation for image
  const floatY = interpolate(Math.sin(frame * 0.07), [-1, 1], [-12, 12]);
  const floatRot = interpolate(Math.sin(frame * 0.05), [-1, 1], [-3, 3]);

  // Abilities reveal
  const abilitiesOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // "Compare" button hint
  const compareOpacity = interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const compareSpring = spring({ frame: frame - 140, fps, config: { damping: 14 } });
  const compareScale = interpolate(compareSpring, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill style={{ opacity: bgIn * outOpacity, background: "#0f172a" }}>

      {/* Gradient header */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 560,
        background: "linear-gradient(145deg, #f87171 0%, #ea580c 60%, #dc2626 100%)",
        borderRadius: "0 0 48px 48px",
        transform: `translateY(${headerY}px)`,
        boxShadow: "0 16px 48px rgba(234,88,12,0.5)",
      }}>
        {/* Number */}
        <div style={{
          position: "absolute",
          top: 48,
          left: 60,
          fontSize: 44,
          fontWeight: 700,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Inter', sans-serif",
        }}>#006</div>

        {/* Name */}
        <div style={{
          position: "absolute",
          top: 100,
          left: 60,
          fontSize: 96,
          fontWeight: 900,
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          textTransform: "capitalize",
          letterSpacing: "-0.03em",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>Charizard</div>

        {/* Type badges */}
        <div style={{ position: "absolute", top: 210, left: 60, display: "flex", gap: 16 }}>
          <TypeBadge type="Fire" delay={15} size="lg" />
          <TypeBadge type="Flying" delay={22} size="lg" />
        </div>

        {/* Charizard sprite */}
        <div style={{
          position: "absolute",
          right: 40,
          top: -20,
          transform: `scale(${imgScale}) translateY(${imgY + floatY}px) rotate(${floatRot}deg)`,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
          transformOrigin: "center bottom",
        }}>
          <img src={CHARIZARD_IMG} style={{ width: 360, height: 360, objectFit: "contain" }} />
        </div>
      </div>

      {/* Stats panel */}
      <div style={{
        position: "absolute",
        top: 580,
        left: 60,
        right: 60,
      }}>
        <div style={{
          fontSize: 44,
          fontWeight: 800,
          color: "#f1f5f9",
          fontFamily: "'Inter', sans-serif",
          marginBottom: 28,
        }}>Base Stats</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {STATS.map((s, i) => (
            <StatBar key={s.label} label={s.label} value={s.value} color={s.color} delay={i * 8 + 20} />
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div style={{
        position: "absolute",
        bottom: 240,
        left: 60,
        opacity: abilitiesOpacity,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>Abilities</div>
        <div style={{ display: "flex", gap: 12 }}>
          {["Blaze", "Solar Power"].map((a) => (
            <div key={a} style={{
              padding: "12px 24px",
              background: "#1e3a5f",
              borderRadius: 12,
              fontSize: 30,
              fontWeight: 600,
              color: "#93c5fd",
              fontFamily: "'Inter', sans-serif",
            }}>{a}</div>
          ))}
        </div>
      </div>

      {/* Compare button */}
      <div style={{
        position: "absolute",
        bottom: 80,
        right: 60,
        opacity: compareOpacity,
        transform: `scale(${compareScale})`,
      }}>
        <div style={{
          padding: "20px 48px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          borderRadius: 20,
          fontSize: 36,
          fontWeight: 800,
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 8px 32px rgba(109,40,217,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          ⚖️ Compare Pokémon
        </div>
      </div>
    </AbsoluteFill>
  );
};
