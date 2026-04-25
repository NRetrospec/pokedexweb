// Frames 300–600 (10–20s): Feature reel — grid, search, filter, modal tap
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { PokemonCardMock } from "../components/PokemonCardMock";
import { TextCard } from "../components/TextCard";

const POKEMON = [
  { id: 6,   name: "charizard", type: "Fire",     img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" },
  { id: 25,  name: "pikachu",   type: "Electric", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
  { id: 150, name: "mewtwo",    type: "Psychic",  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" },
  { id: 1,   name: "bulbasaur", type: "Grass",    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" },
  { id: 131, name: "lapras",    type: "Water",    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png" },
  { id: 149, name: "dragonite", type: "Dragon",   img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png" },
];

const TYPES = ["All", "Fire", "Water", "Electric", "Grass", "Psychic", "Dragon", "Ghost"];
const TYPE_HEX: Record<string, string> = {
  Fire: "#ef4444", Water: "#3b82f6", Electric: "#eab308",
  Grass: "#22c55e", Psychic: "#ec4899", Dragon: "#6366f1", Ghost: "#9333ea",
};

// Sub-scene A: Grid showcase (local frames 0–90)
const GridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outOpacity = interpolate(frame, [70, 90], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const COL = 3;
  const CARD_W = 280;
  const GAP = 24;
  const totalW = COL * CARD_W + (COL - 1) * GAP;

  return (
    <AbsoluteFill style={{ opacity: outOpacity, background: "#111827", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 80, width: "100%", display: "flex", justifyContent: "center" }}>
        <TextCard lines={["Browse all 150+"]} delay={0} fontSize={64} />
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COL}, ${CARD_W}px)`,
        gap: GAP,
        marginTop: 100,
      }}>
        {POKEMON.map((p, i) => (
          <PokemonCardMock
            key={p.id}
            id={p.id}
            name={p.name}
            type={p.type}
            imageUrl={p.img}
            delay={i * 7}
            width={CARD_W}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Sub-scene B: Search bar typing (local frames 90–180)
const SearchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const outOpacity = interpolate(frame, [70, 90], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const typed = "char";
  const charsShown = Math.floor(interpolate(frame, [20, 55], [0, typed.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const displayText = typed.slice(0, charsShown);

  const cursorBlink = frame % 20 < 10 ? 1 : 0;

  const matchScale = spring({ frame: frame - 50, fps, config: { damping: 14 } });
  const matchOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity, background: "#111827", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 80, width: "100%", display: "flex", justifyContent: "center" }}>
        <TextCard lines={["Search instantly"]} delay={0} fontSize={64} />
      </div>

      {/* Search bar mockup */}
      <div style={{
        width: 800,
        height: 96,
        borderRadius: 20,
        background: "#1f2937",
        border: "2px solid #374151",
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        gap: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        marginTop: -200,
      }}>
        <div style={{ fontSize: 40, color: "#6b7280" }}>🔍</div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 40,
          color: displayText ? "#f9fafb" : "#6b7280",
          flex: 1,
        }}>
          {displayText || "Search Pokémon..."}
          {displayText && <span style={{ opacity: cursorBlink, borderRight: "3px solid #f9fafb", marginLeft: 2 }}> </span>}
        </div>
      </div>

      {/* Match result */}
      <div style={{ marginTop: 60, opacity: matchOpacity, transform: `scale(${interpolate(matchScale, [0, 1], [0.7, 1])})` }}>
        <PokemonCardMock id={6} name="charizard" type="Fire" imageUrl={POKEMON[0].img} delay={0} width={280} />
      </div>
    </AbsoluteFill>
  );
};

// Sub-scene C: Type filter (local frames 180–270)
const FilterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const outOpacity = interpolate(frame, [70, 90], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Cycle through selected type index
  const selectedIdx = Math.floor(interpolate(frame, [20, 80], [0, TYPES.length - 1], { extrapolateRight: "clamp" }));
  const selectedType = TYPES[selectedIdx];

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity, background: "#111827", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 80, width: "100%", display: "flex", justifyContent: "center" }}>
        <TextCard lines={["Filter by type"]} delay={0} fontSize={64} />
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 900, marginTop: -200 }}>
        {TYPES.map((t, i) => {
          const isActive = t === selectedType;
          const chipSpring = spring({ frame: frame - i * 4, fps, config: { damping: 16 } });
          const chipScale = interpolate(chipSpring, [0, 1], [0.7, 1]);
          const chipOpacity = interpolate(frame - i * 4, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div key={t} style={{
              opacity: chipOpacity,
              transform: `scale(${chipScale})`,
              padding: "16px 32px",
              borderRadius: 999,
              background: isActive ? (TYPE_HEX[t] ?? "#374151") : "#1f2937",
              border: `2px solid ${isActive ? (TYPE_HEX[t] ?? "#6b7280") : "#374151"}`,
              fontSize: 32,
              fontWeight: 700,
              color: isActive ? "#fff" : "#9ca3af",
              fontFamily: "'Inter', sans-serif",
              boxShadow: isActive ? `0 4px 20px ${TYPE_HEX[t] ?? "#6b7280"}60` : "none",
            }}>
              {t}
            </div>
          );
        })}
      </div>

      {/* Filtered result hint */}
      <div style={{
        position: "absolute",
        bottom: 120,
        opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
        fontFamily: "'Inter', sans-serif",
        fontSize: 40,
        color: "rgba(255,255,255,0.5)",
      }}>
        Showing {selectedType === "All" ? "all" : selectedType + " type"} Pokémon
      </div>
    </AbsoluteFill>
  );
};

// Sub-scene D: Modal open (local frames 270–300)
const ModalTapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Tap ripple at center
  const rippleScale = interpolate(frame, [5, 25], [0, 2.5], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const rippleOpacity = interpolate(frame, [5, 25], [0.7, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Modal sliding in
  const modalSpring = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 140 } });
  const modalY = interpolate(modalSpring, [0, 1], [600, 0]);
  const modalOpacity = interpolate(frame - 8, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inOpacity, background: "#111827" }}>
      {/* Backdrop */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }} />

      {/* Tap ripple */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "35%",
        transform: `translate(-50%, -50%) scale(${rippleScale})`,
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: "4px solid rgba(255,255,255,0.6)",
        opacity: rippleOpacity,
      }} />

      {/* Modal preview */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: `translateX(-50%) translateY(${modalY}px)`,
        opacity: modalOpacity,
        width: 900,
        height: 700,
        borderRadius: "32px 32px 0 0",
        background: "linear-gradient(145deg, #f87171, #ea580c)",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 -20px 60px rgba(234,88,12,0.4)",
      }}>
        <div style={{ fontSize: 36, color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>#006</div>
        <img
          src={POKEMON[0].img}
          style={{ width: 220, height: 220, objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.5))" }}
        />
        <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", textTransform: "capitalize" }}>Charizard</div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div style={{ padding: "10px 28px", borderRadius: 999, background: "rgba(255,255,255,0.2)", fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif", border: "1px solid rgba(255,255,255,0.3)" }}>Fire</div>
          <div style={{ padding: "10px 28px", borderRadius: 999, background: "rgba(255,255,255,0.2)", fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif", border: "1px solid rgba(255,255,255,0.3)" }}>Flying</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SceneFeatureReel: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={100} premountFor={10}>
      <GridScene />
    </Sequence>
    <Sequence from={90} durationInFrames={100} premountFor={10}>
      <SearchScene />
    </Sequence>
    <Sequence from={180} durationInFrames={100} premountFor={10}>
      <FilterScene />
    </Sequence>
    <Sequence from={270} durationInFrames={30} premountFor={5}>
      <ModalTapScene />
    </Sequence>
  </AbsoluteFill>
);
