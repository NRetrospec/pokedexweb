import React from "react";
import styled from "styled-components";

const Pattern = () => {
  return (
    <BackgroundWrapper>
      <div className="blur-overlay" />
      <div className="jp-matrix">
        {Array.from({ length: 1500 }).map((_, i) => (
          <span key={i}>
            {[
              "ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ",
              "サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト",
              "ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
              "マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ",
              "ル","レ","ロ","ワ","ヲ","ン","ガ","ギ","グ","ゲ",
              "ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ",
              "ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ"
            ][Math.floor(Math.random() * 71)]}
          </span>
        ))}
      </div>
    </BackgroundWrapper>
  );
};

const BackgroundWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at center, #03050a 0%, #02030a 70%, #000000 100%);
  
  /* Add parallax subtle drift */
  animation: slow-drift 40s ease-in-out infinite alternate;

  @keyframes slow-drift {
    0% { transform: translateY(0px) translateX(0px); }
    100% { transform: translateY(-25px) translateX(25px); }
  }

  .jp-matrix {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    grid-auto-rows: 40px;
    font-size: 32px;
    color: rgba(0, 150, 255, 0.4);
    font-family: "Courier New", Courier, monospace;
    justify-content: center;
    align-content: center;
    filter: blur(2px) brightness(0.85);
  }

  .jp-matrix > span {
    text-align: center;
    text-shadow: 0 0 6px rgba(0, 200, 255, 0.6);
    user-select: none;
    transition: color 0.4s ease, text-shadow 0.4s ease;
    line-height: 1;
  }

  /* Random pulsing */
  .jp-matrix > span:nth-child(19n + 2) { animation: smooth-pulse 3.5s ease-in-out infinite 0.2s; }
  .jp-matrix > span:nth-child(29n + 1) { animation: smooth-pulse 4.1s ease-in-out infinite 0.7s; }
  .jp-matrix > span:nth-child(11n) { color: rgba(100, 200, 255, 0.7); animation: smooth-pulse 2.9s ease-in-out infinite 1.1s; }
  .jp-matrix > span:nth-child(37n + 10) { animation: smooth-pulse 5.3s ease-in-out infinite 1.5s; }
  .jp-matrix > span:nth-child(41n + 1) { animation: smooth-pulse 3.9s ease-in-out infinite 0.4s; }
  .jp-matrix > span:nth-child(17n + 9) { animation: smooth-pulse 2.8s ease-in-out infinite 0.9s; }
  .jp-matrix > span:nth-child(23n + 18) { animation: smooth-pulse 4.3s ease-in-out infinite 1.3s; }
  .jp-matrix > span:nth-child(31n + 4) { animation: smooth-pulse 5.6s ease-in-out infinite 0.1s; }
  .jp-matrix > span:nth-child(43n + 20) { animation: smooth-pulse 3.6s ease-in-out infinite 1.8s; }

  @keyframes smooth-pulse {
    0%, 100% {
      color: rgba(0, 150, 255, 0.3);
      text-shadow: 0 0 4px rgba(0, 150, 255, 0.4);
    }
    50% {
      color: rgba(0, 255, 255, 1);
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.9),
                   0 0 25px rgba(0, 255, 255, 0.7);
    }
  }

  /* Overlay adds depth and focus gradient */
  .blur-overlay {
    pointer-events: none;
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%);
    backdrop-filter: blur(6px);
    z-index: 2;
    mix-blend-mode: soft-light;
  }

  /* Optional motion blur feel with subtle shifting glow */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0,255,255,0.05), transparent 70%);
    filter: blur(12px);
    opacity: 0.6;
    animation: glow-move 10s ease-in-out infinite alternate;
  }

  @keyframes glow-move {
    0% { transform: translate(-10px, 10px); opacity: 0.3; }
    100% { transform: translate(10px, -10px); opacity: 0.7; }
  }
`;

export default Pattern;
