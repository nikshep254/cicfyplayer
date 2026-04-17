"use client";
import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Stream { label: string; url: string; }
interface Channel {
  id: string;
  name: string;
  emoji: string;
  category: string;
  streams: Stream[];
}

const CHANNELS: Channel[] = [
  {
    id: "fox-sports",
    name: "Fox Sports",
    emoji: "🦊",
    category: "Sports",
    streams: [
      { label: "Stream 1", url: "https://www.foulembeds.live/embed/fox-sports-501" },
    ],
  },
  {
    id: "star-sports-1",
    name: "Star Sports 1",
    emoji: "⭐",
    category: "Cricket",
    streams: [
      { label: "Stream 1", url: "https://dlstreams.com/stream/stream-267.php" },
      { label: "Stream 2", url: "https://dlstreams.com/cast/stream-267.php" },
      { label: "Stream 3", url: "https://dlstreams.com/stream/stream-268.php" },
      { label: "Stream 4", url: "https://dlstreams.com/cast/stream-268.php" },
      { label: "Stream 6", url: "https://dlstreams.com/watch/stream-268.php" },
    ],
  },
  {
    id: "willow",
    name: "Willow",
    emoji: "🌿",
    category: "Cricket",
    streams: [
      { label: "Stream 1", url: "https://dlstreams.com/stream/stream-370.php" },
      { label: "Stream 2", url: "https://dlstreams.com/cast/stream-370.php" },
      { label: "Stream 3", url: "https://dlstreams.com/plus/stream-370.php" },
      { label: "Stream 4", url: "https://dlstreams.com/stream/stream-346.php" },
      { label: "Stream 5", url: "https://dlstreams.com/cast/stream-346.php" },
    ],
  },
  {
    id: "fox-cricket",
    name: "Fox Cricket",
    emoji: "🏏",
    category: "Cricket",
    streams: [
      { label: "Stream 1", url: "https://dlstreams.com/stream/stream-369.php" },
      { label: "Stream 2", url: "https://dlstreams.com/cast/stream-369.php" },
      { label: "Stream 3", url: "https://dlstreams.com/plus/stream-369.php" },
    ],
  },
  {
    id: "sky-sports",
    name: "Sky Sports",
    emoji: "🌤️",
    category: "Sports",
    streams: [
      { label: "Stream 1", url: "https://dlstreams.com/stream/stream-65.php" },
      { label: "Stream 2", url: "https://dlstreams.com/cast/stream-65.php" },
    ],
  },
  {
    id: "criclife",
    name: "CricLife",
    emoji: "🏟️",
    category: "Cricket",
    streams: [
      { label: "Stream 1", url: "https://dlstreams.com/stream/stream-284.php" },
      { label: "Stream 2", url: "https://dlstreams.com/cast/stream-284.php" },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Cricket: "#e8ff47",
  Sports: "#38bdf8",
};

export default function LivePage() {
  const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);
  const [activeStream, setActiveStream] = useState<Stream>(CHANNELS[0].streams[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const selectChannel = (ch: Channel) => {
    setActiveChannel(ch);
    setActiveStream(ch.streams[0]);
  };

  const openFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) (el as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
    setIsFullscreen(true);
    el.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    }, { once: true });
  };

  const openNewTab = () => {
    window.open(activeStream.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px 20px", minHeight: "calc(100vh - 56px)" }}>

        {/* Page header */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "var(--text3)", marginBottom: "8px" }}>NIKSHEP OS TV · LIVE CHANNELS</p>
          <h1 style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text)" }}>
            Live <span style={{ color: "var(--accent)" }}>Channels</span>
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "16px", alignItems: "start" }} className="live-grid">

          {/* Channel sidebar */}
          <div style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "12px", overflow: "hidden",
            position: "sticky", top: "72px",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", color: "var(--text3)", fontWeight: 700 }}>CHANNELS ({CHANNELS.length})</p>
            </div>
            <div>
              {CHANNELS.map(ch => {
                const isActive = ch.id === activeChannel.id;
                return (
                  <button key={ch.id} onClick={() => selectChannel(ch)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "13px 16px", background: isActive ? "rgba(232,255,71,0.06)" : "transparent",
                      border: "none", borderLeft: `3px solid ${isActive ? "var(--accent)" : "transparent"}`,
                      borderBottom: "1px solid var(--border)", cursor: "pointer",
                      transition: "all 0.15s", textAlign: "left",
                    }}>
                    <span style={{ fontSize: "20px" }}>{ch.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: isActive ? 700 : 500, color: isActive ? "var(--accent)" : "var(--text)", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ch.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          fontSize: "8px", padding: "1px 6px", borderRadius: "3px",
                          background: `${CATEGORY_COLORS[ch.category]}22`,
                          color: CATEGORY_COLORS[ch.category],
                          letterSpacing: "0.1em", fontWeight: 700,
                        }}>{ch.category.toUpperCase()}</span>
                        <span style={{ fontSize: "8px", color: "var(--text3)" }}>{ch.streams.length} stream{ch.streams.length > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    {isActive && <span style={{ color: "var(--accent)", fontSize: "12px" }}>▶</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player area */}
          <div>
            {/* Channel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{activeChannel.emoji}</span>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{activeChannel.name}</h2>
                  <p style={{ fontSize: "10px", color: "var(--text3)", marginTop: "2px" }}>
                    Watching: <span style={{ color: "var(--accent)" }}>{activeStream.label}</span>
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={openNewTab}
                  style={{
                    background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)",
                    padding: "8px 14px", borderRadius: "8px", fontSize: "11px", cursor: "pointer",
                    letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px",
                  }}>
                  ↗ New Tab
                </button>
                <button onClick={openFullscreen}
                  style={{
                    background: "var(--accent)", border: "none", color: "#000",
                    padding: "8px 14px", borderRadius: "8px", fontSize: "11px", cursor: "pointer",
                    fontWeight: 700, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px",
                  }}>
                  ⛶ Fullscreen
                </button>
              </div>
            </div>

            {/* Stream selector */}
            {activeChannel.streams.length > 1 && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
                {activeChannel.streams.map(s => {
                  const isActive = s.url === activeStream.url;
                  return (
                    <button key={s.url} onClick={() => setActiveStream(s)}
                      style={{
                        background: isActive ? "var(--accent)" : "var(--bg2)",
                        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                        color: isActive ? "#000" : "var(--text2)",
                        padding: "6px 14px", borderRadius: "6px", fontSize: "10px",
                        cursor: "pointer", fontWeight: isActive ? 700 : 400,
                        letterSpacing: "0.05em", transition: "all 0.15s",
                      }}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Player container */}
            <div ref={playerContainerRef} style={{
              position: "relative", borderRadius: "12px", overflow: "hidden",
              aspectRatio: "16/9", background: "#000",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}>
              <iframe
                ref={iframeRef}
                key={activeStream.url}
                src={activeStream.url}
                width="100%"
                height="100%"
                allowFullScreen
                scrolling="no"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                style={{ border: "none", display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }}
              />
              {/* Overlay watermark — always on top including in fullscreen */}
              <div style={{
                position: "absolute", bottom: "14px", right: "14px",
                zIndex: 2147483647, pointerEvents: "none", userSelect: "none",
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                border: "1px solid rgba(232,255,71,0.3)",
                borderRadius: "6px", padding: "5px 12px",
              }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#e8ff47", letterSpacing: "0.2em", fontFamily: "monospace" }}>
                  NikshepOS TV
                </span>
              </div>
            </div>

            {/* Info bar */}
            <div style={{
              marginTop: "12px", padding: "14px 16px",
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "10px", display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "12px", flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "11px", color: "var(--text)", fontWeight: 600 }}>{activeChannel.name}</span>
                <span style={{ fontSize: "10px", color: "var(--text3)" }}>·</span>
                <span style={{ fontSize: "10px", color: "var(--text3)" }}>{activeStream.label}</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{
                  fontSize: "9px", padding: "2px 8px", borderRadius: "4px",
                  background: `${CATEGORY_COLORS[activeChannel.category]}22`,
                  color: CATEGORY_COLORS[activeChannel.category], letterSpacing: "0.1em", fontWeight: 700,
                }}>{activeChannel.category}</span>
                <span style={{ fontSize: "9px", color: "var(--text3)" }}>IFRAME STREAM</span>
              </div>
            </div>

            {/* Other channels quick switch */}
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", color: "var(--text3)", marginBottom: "12px" }}>SWITCH CHANNEL</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px" }}>
                {CHANNELS.filter(c => c.id !== activeChannel.id).map(ch => (
                  <button key={ch.id} onClick={() => selectChannel(ch)}
                    style={{
                      background: "var(--bg2)", border: "1px solid var(--border)",
                      borderRadius: "8px", padding: "10px 12px", cursor: "pointer",
                      textAlign: "center", transition: "all 0.15s", color: "var(--text)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--card-hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg2)"; }}>
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>{ch.emoji}</div>
                    <p style={{ fontSize: "9px", color: "var(--text2)", letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        @media (max-width: 768px) {
          .live-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
