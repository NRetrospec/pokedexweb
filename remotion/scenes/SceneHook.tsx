// Frames 0–90 (0–3s): Hook — Pokéball pop + punchy headline
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pokeball } from "../components/Pokeball";
import { TextCard } from "../components/TextCard";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Pokéball entrance
  const ballScale = spring({ frame, fps, config: { damping: 8, stiffness: 100 } });
  const ballScale2 = interpolate(ballScale, [0, 1], [0, 1]);

  // Shockwave ring that expands on pop
  const ringScale = interpolate(frame, [8, 35], [0.5, 3], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ringOpacity = interpolate(frame, [8, 35], [0.8, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Out fade
  const outOpacity = interpolate(frame, [72, 90], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: bgOpacity * outOpacity, background: "radial-gradient(ellipse at 50% 40%, #7B0000 0%, #1a0000 70%, #000 100%)" }}>

      {/* Particle dots scattered */}
      {[...Array(18)].map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const radius = 320 + (i % 3) * 80;
        const x = 540 + Math.cos(angle) * radius;
        const y = 820 + Math.sin(angle) * radius;
        const pOpacity = interpolate(frame - 5 - i * 2, [0, 15], [0, 0.4], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: x,
            top: y,
            width: 6 + (i % 3) * 3,
            height: 6 + (i % 3) * 3,
            borderRadius: "50%",
            background: i % 3 === 0 ? "#FFD700" : "#DC2626",
            opacity: pOpacity,
          }} />
        );
      })}

      {/* Shockwave ring */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "42%",
        transform: `translate(-50%, -50%) scale(${ringScale})`,
        width: 300,
        height: 300,
        borderRadius: "50%",
        border: "6px solid rgba(255,215,0,0.6)",
        opacity: ringOpacity,
      }} />

      {/* Pokéball */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "42%",
        transform: `translate(-50%, -50%) scale(${ballScale2})`,
      }}>
        <Pokeball size={260} delay={0} spin={false} glow />
      </div>

      {/* Text */}
      <div style={{ position: "absolute", bottom: "32%", width: "100%", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <TextCard lines={["Every Pokémon.", "In your pocket."]} delay={14} fontSize={88} accent />
      </div>
    </AbsoluteFill>
  );
};
