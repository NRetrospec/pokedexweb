import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { PokemonExplorer } from "./components/PokemonExplorer";
import { useEffect, useState, useRef } from "react";

type Phase = "landing" | "video" | "main";

export default function App() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [showHint, setShowHint] = useState(true);
  const initializePokemon = useMutation(api.pokemon.initializePokemon);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initializePokemon().catch(console.error);
  }, [initializePokemon]);

  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [phase]);

  // ── Landing ──────────────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "#7B0000" }}
      >
        {/*
          Aspect-ratio container that scales to fit any screen while preserving
          the 1280×720 image proportions — so the button % coords always match
          the actual pixel position of the D-pad on the Pokédex device.
        */}
        <div
          className="relative select-none"
          style={{
            width: "min(100vw, calc(100vh * 1280 / 720))",
            aspectRatio: "1280 / 720",
          }}
        >
          <img
            src="/images/pokecover.jpg"
            alt="Pokédex"
            className="w-full h-full"
            draggable={false}
          />

          {/* "Click here" hint — disappears on click */}
          {showHint && (
            <div
              className="absolute pointer-events-none flex flex-col items-center"
              style={{
                left: "41.25%",
                top: "58%",
                transform: "translateX(-50%)",
              }}
            >
              <span
                className="font-bold tracking-widest animate-pulse"
                style={{
                  fontSize: "clamp(7px, 1.4vw, 16px)",
                  color: "#FFD700",
                  textShadow: "0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(255,215,0,0.6)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.15em",
                }}
              >
                CLICK HERE
              </span>
              <span
                className="animate-bounce"
                style={{
                  fontSize: "clamp(10px, 1.8vw, 20px)",
                  color: "#FFD700",
                  textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                  lineHeight: 1,
                }}
              >
                ↓
              </span>
            </div>
          )}

          {/* Pokéball sits over the D-pad (lower-right of device body) */}
          <button
            onClick={() => { setShowHint(false); setPhase("video"); }}
            className="absolute z-10 border-none bg-transparent cursor-pointer p-0"
            style={{
              left: "41.25%",
              top: "74%",
              width: "15%",
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
            }}
            aria-label="Open Pokédex Explorer"
          >
            <img
              src="/images/poke-button.png"
              alt=""
              className="w-full h-full object-contain drop-shadow-xl transition-transform duration-150 hover:scale-110 active:scale-90"
              draggable={false}
            />
          </button>
        </div>

        <Toaster />
      </div>
    );
  }

  // ── Video transition ──────────────────────────────────────────────────────
  if (phase === "video") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src="/images/pokevideo.MP4"
          className="w-full h-full object-contain"
          onEnded={() => setPhase("main")}
          onCanPlay={() => videoRef.current?.play().catch(() => {})}
          autoPlay
          playsInline
        />
        <Toaster />
      </div>
    );
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  // pokecover2.jpg is 16:9, so its title (at ~36% image height) always lands
  // at exactly 36 vh regardless of screen ratio — 38vh gives a small buffer.
  return (
    <div className="relative min-h-screen">
      {/* Fixed background — avoids background-attachment:fixed iOS bug */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/pokecover2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      />

      {/*
        Spacer: title in pokecover2.jpg sits at y=260 of 720 in the source image.
        With background-size:cover the rendered y = 260 * max(vw/1280, vh/720).
        Expanded: max(260vw/1280, 260vh/720) = max(20.3125vw, 36.111vh).
        +2.5vh buffer puts the panel edge just below the title on every ratio.
      */}
      <div style={{ height: "calc(max(20.3125vw, 36.111vh) + 2.5vh)" }} />

      {/* Explorer panel */}
      <div className="relative z-10 bg-gray-900/85 rounded-t-2xl min-h-[62vh]">
        <PokemonExplorer />
      </div>

      <Toaster />
    </div>
  );
}
