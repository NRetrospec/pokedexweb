// Frames 90–300 (3–10s): Context — landing screen + D-pad Pokéball CTA
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { TextCard } from "../components/TextCard";

export const SceneContext: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const outOpacity = interpolate(frame, [185, 210], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Phone frame slide-in from bottom
  const phoneSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const phoneY = interpolate(phoneSpring, [0, 1], [400, 0]);

  // Pokéball button pulse animation – mimics the real app hint
  const pulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.85, 1.05],
  );

  // Arrow bounce
  const arrowY = interpolate(Math.sin(frame * 0.2), [-1, 1], [0, 14]);

  const labelOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const PHONE_W = 540;
  const PHONE_H = 920;
  // pokecover.jpg is 1280×720 — we'll fill the phone width and let it be cropped
  const imgRatio = 720 / 1280;
  const imgW = PHONE_W;
  const imgH = imgW * imgRatio;

  // Button position matches App.tsx: left 41.25%, top 74%
  const btnX = PHONE_W * 0.4125 - 48;
  const btnY = imgH * 0.74 - 48;

  return (
    <AbsoluteFill style={{
      opacity: bgIn * outOpacity,
      background: "radial-gradient(ellipse at 50% 30%, #3b0000 0%, #0a0000 100%)",
      alignItems: "center",
      justifyContent: "center",
    }}>

      {/* Label above phone */}
      <div style={{
        position: "absolute",
        top: 120,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity: labelOpacity,
      }}>
        <TextCard lines={["Meet your new", "Pokédex."]} delay={20} fontSize={72} accent />
      </div>

      {/* Phone wrapper */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -44%) translateY(${phoneY}px)`,
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 48,
        background: "#1a1a1a",
        boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 3px #333",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{ height: 40, background: "#7B0000", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.3)" }} />
        </div>

        {/* Screen content: simulated pokecover.jpg with red bg */}
        <div style={{ flex: 1, background: "#7B0000", position: "relative", overflow: "hidden" }}>
          {/* Simulated Pokédex device mockup using colored blocks */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #8B0000 0%, #7B0000 40%, #5a0000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Pokédex device shape suggestion */}
            <div style={{
              width: "80%",
              height: "75%",
              borderRadius: 24,
              background: "linear-gradient(145deg, #cc2222, #991111)",
              boxShadow: "inset 0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.6)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 20,
            }}>
              {/* Top bar with light */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 16px #3b82f6" }} />
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#ef4444", marginTop: 12 }} />
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fbbf24", marginTop: 12 }} />
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#4ade80", marginTop: 12 }} />
              </div>
              {/* Screen area */}
              <div style={{
                width: "85%",
                height: 160,
                background: "#0d1117",
                borderRadius: 12,
                border: "3px solid #444",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 20 }}>POKÉDEX v2.0</div>
              </div>

              {/* D-pad area with Pokéball */}
              <div style={{
                position: "relative",
                width: 120,
                height: 120,
                marginTop: 8,
              }}>
                {/* D-pad cross */}
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 36, background: "#222", borderRadius: 4, transform: "translateY(-50%)" }} />
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 36, background: "#222", borderRadius: 4, transform: "translateX(-50%)" }} />
                {/* Pokéball button */}
                <div style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) scale(${pulse})`,
                  width: 56,
                  height: 56,
                }}>
                  <svg viewBox="0 0 100 100" width={56} height={56}>
                    <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#DC2626" />
                    <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="#f1f5f9" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="5" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="#1a1a1a" strokeWidth="5" />
                    <circle cx="50" cy="50" r="12" fill="#f1f5f9" stroke="#1a1a1a" strokeWidth="4" />
                    <circle cx="50" cy="50" r="6" fill="#e2e8f0" />
                  </svg>
                </div>
              </div>

              {/* Hint arrow */}
              <div style={{
                marginTop: 8,
                transform: `translateY(${arrowY}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}>
                <div style={{
                  color: "#FFD700",
                  fontSize: 18,
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.1em",
                  textShadow: "0 0 8px rgba(255,215,0,0.6)",
                }}>CLICK HERE</div>
                <div style={{ color: "#FFD700", fontSize: 24 }}>↓</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <div style={{
        position: "absolute",
        bottom: 80,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [50, 75], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 44,
          color: "rgba(255,255,255,0.6)",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}>
          Tap to explore the Pokédex
        </div>
      </div>
    </AbsoluteFill>
  );
};
