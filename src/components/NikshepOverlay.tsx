"use client";
export function NikshepOverlay() {
  return (
    <div
      id="nikshep-overlay"
      style={{
        position: "fixed",
        bottom: "18px",
        right: "20px",
        zIndex: 2147483647,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(232,255,71,0.25)",
        borderRadius: "8px",
        padding: "7px 14px",
      }}
    >
      <span style={{ fontSize: "11px", fontWeight: 800, color: "#e8ff47", letterSpacing: "0.2em", fontFamily: "monospace" }}>
        NikshepOS TV
      </span>
    </div>
  );
}
