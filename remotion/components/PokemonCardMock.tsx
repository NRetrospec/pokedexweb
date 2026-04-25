import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TYPE_COLORS } from "./TypeBadge";

type PokemonCardMockProps = {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
  delay?: number;
  width?: number;
};

export const PokemonCardMock: React.FC<PokemonCardMockProps> = ({
  id, name, type, imageUrl, delay = 0, width = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;
  const s = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 160 } });
  const scale = interpolate(s, [0, 1], [0.6, 1]);
  const opacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const [from, to] = TYPE_COLORS[type] ?? TYPE_COLORS.Normal;
  const height = width * 1.3;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      width,
      height,
      borderRadius: 24,
      background: `linear-gradient(145deg, ${from}cc, ${to})`,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: `0 12px 40px ${from}60, 0 4px 12px rgba(0,0,0,0.4)`,
      border: "1px solid rgba(255,255,255,0.2)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* bg circles */}
      <div style={{ position: "absolute", top: 8, right: 8, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", bottom: 8, left: 8, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

      <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", fontWeight: 700, alignSelf: "flex-start", fontFamily: "'Inter', sans-serif" }}>
        #{String(id).padStart(3, "0")}
      </div>
      <img
        src={imageUrl}
        style={{ width: width * 0.55, height: width * 0.55, objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }}
      />
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", textTransform: "capitalize", fontFamily: "'Inter', sans-serif", marginTop: 8 }}>
        {name}
      </div>
      <div style={{
        marginTop: 8,
        padding: "6px 16px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.2)",
        fontSize: 18,
        fontWeight: 600,
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        border: "1px solid rgba(255,255,255,0.3)",
      }}>
        {type}
      </div>
    </div>
  );
};
