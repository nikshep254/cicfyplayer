"use client";
import { useEffect, useState } from "react";

export function BravePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("brave-popup-dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("brave-popup-dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.85)", display: "flex",
      alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)", padding: "20px",
    }}>
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: "16px", maxWidth: "460px", width: "100%",
        padding: "36px", position: "relative",
        boxShadow: "0 0 60px rgba(232,255,71,0.15), 0 24px 80px rgba(0,0,0,0.8)",
      }}>
        {/* Icon */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "linear-gradient(135deg, #fb542b 0%, #ff8c00 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(251,84,43,0.4)",
        }}>🦁</div>

        <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: 800, color: "var(--text)", marginBottom: "10px", letterSpacing: "-0.02em" }}>
          Use Brave Browser
        </h2>
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text2)", lineHeight: 1.6, marginBottom: "24px" }}>
          For the best streaming experience and maximum privacy, we recommend using <strong style={{ color: "#fb542b" }}>Brave Browser</strong>.
          It blocks ads, trackers, and keeps your binge sessions smooth and safe. 🔥
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a href="https://brave.com/download/" target="_blank" rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", background: "#fb542b",
              color: "#fff", padding: "13px", borderRadius: "10px",
              fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em",
              textDecoration: "none", transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#e04020")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fb542b")}>
            Download Brave — It&apos;s Free
          </a>
          <button onClick={dismiss}
            style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text3)", padding: "12px", borderRadius: "10px",
              fontSize: "12px", letterSpacing: "0.05em", cursor: "pointer",
            }}>
            Continue with current browser
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "10px", color: "var(--text3)", marginTop: "16px" }}>
          Already on Brave? Close this and start watching!
        </p>

        <button onClick={dismiss}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "var(--bg3)", border: "1px solid var(--border)",
            color: "var(--text2)", width: "28px", height: "28px",
            borderRadius: "50%", cursor: "pointer", fontSize: "14px",
          }}>×</button>
      </div>
    </div>
  );
}
