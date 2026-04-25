import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SceneHook } from "./scenes/SceneHook";
import { SceneContext } from "./scenes/SceneContext";
import { SceneFeatureReel } from "./scenes/SceneFeatureReel";
import { SceneHero } from "./scenes/SceneHero";
import { SceneCTA } from "./scenes/SceneCTA";

// Total: 900 frames with transitions overlapping
// Scene durations (before overlap subtraction):
//   Hook:        100  (-15 fade) → net 85
//   Context:     225  (-15 fade) → net 210
//   FeatureReel: 315  (-15 slide) → net 300
//   Hero:        225  (-15 slide) → net 210
//   CTA:         100  (last scene, no overlap)
// 85 + 210 + 300 + 210 + 100 = 905 ≈ 900 ✓ (adjusted below)

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {/* Hook: 0–3s */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <SceneHook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      {/* Context: 3–10s */}
      <TransitionSeries.Sequence durationInFrames={225}>
        <SceneContext />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
      />

      {/* Feature Reel: 10–20s */}
      <TransitionSeries.Sequence durationInFrames={315}>
        <SceneFeatureReel />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
      />

      {/* Hero: 20–27s */}
      <TransitionSeries.Sequence durationInFrames={225}>
        <SceneHero />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* CTA: 27–30s */}
      <TransitionSeries.Sequence durationInFrames={95}>
        <SceneCTA />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
