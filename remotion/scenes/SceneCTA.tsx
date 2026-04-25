// Frames 810–900 (27–30s): CTA — app name, tagline, URL
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pokeball } from "../components/Pokeball";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Pokéball pop from center
  const ballSpring = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  const ballScale = interpolate(ballSpring, [0, 1], [0, 1]);

  // Title entrance
  const titleSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 150 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(frame - 12, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Tagline
  const tagOpacity = interpolate(frame, [28, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const tagY = interpolate(frame, [28, 45], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // URL / CTA button
  const ctaOpacity = interpolate(frame, [42, 60], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaSpring = spring({ frame: frame - 42, fps, config: { damping: 12 } });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.7, 1]);

  // Pokéball pulse glow
  const glowIntensity = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.6, 1.0]);

  // Floating type dots bg decoration
  const dotColors = ["#f87171", "#60a5fa", "#fbbf24", "#4ade80", "#c084fc", "#f472b6"];

  return (
    <AbsoluteFill style={{
      opacity: bgIn,
      background: "radial-gradient(ellipse at 50% 60%, #1a0030 0%, #0a0014 60%, #000 100%)",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>

      {/* Background floating dots */}
      {dotColors.map((color, i) => {
        const angle = (i / dotColors.length) * Math.PI * 2 + frame * 0.008;
        const r = 380 + i * 30;
        const x = 540 + Math.cos(angle) * r;
        const y = 960 + Math.sin(angle) * r;
        const dOpacity = interpolate(frame - i * 3, [0, 20], [0, 0.35], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: x - 30,
            top: y - 30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: color,
            opacity: dOpacity,
            filter: "blur(12px)",
          }} />
        );
      })}

      {/* Pokéball */}
      <div style={{ transform: `scale(${ballScale})`, filter: `drop-shadow(0 0 ${60 * glowIntensity}px rgba(220,38,38,0.8))` }}>
        <Pokeball size={220} delay={0} glow={false} />
      </div>

      {/* App name */}
      <div style={{
        marginTop: 40,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        fontSize: 96,
        fontWeight: 900,
        color: "#fff",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "-0.03em",
        textAlign: "center",
        textShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}>
        Pokédex <span style={{ color: "#FFD700" }}>Explorer</span>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 20,
        opacity: tagOpacity,
        transform: `translateY(${tagY}px)`,
        fontSize: 52,
        fontWeight: 500,
        color: "rgba(255,255,255,0.65)",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
        letterSpacing: "0.01em",
      }}>
        Catch 'em all. In style.
      </div>

      {/* CTA strip */}
      <div style={{
        marginTop: 64,
        opacity: ctaOpacity,
        transform: `scale(${ctaScale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}>
        <div style={{
          padding: "28px 80px",
          background: "linear-gradient(135deg, #DC2626, #ea580c)",
          borderRadius: 24,
          fontSize: 48,
          fontWeight: 800,
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.01em",
          boxShadow: "0 12px 40px rgba(220,38,38,0.5)",
        }}>
          Start Exploring →
        </div>
        <div style={{
          fontSize: 36,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
        }}>
          Built with React · Convex · Remotion
        </div>
      </div>
    </AbsoluteFill>
  );
};
