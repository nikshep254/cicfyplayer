"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 200,
      background: "var(--nav-bg)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      height: "56px",
      backdropFilter: "blur(20px)",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "6px",
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: 900, color: "#000",
        }}>N</div>
        <div>
          <span style={{ fontSize: "13px", letterSpacing: "0.2em", color: "var(--text)", fontWeight: 700 }}>NikshepOS</span>
          <span style={{ fontSize: "13px", letterSpacing: "0.2em", color: "var(--accent)", fontWeight: 700 }}> TV</span>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span style={{ fontSize: "10px", color: "#22c55e", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e", animation: "pulse 2s infinite" }} />
          LIVE
        </span>
        {mounted && (
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 14px", borderRadius: "6px", fontSize: "10px", letterSpacing: "0.1em", transition: "all 0.15s" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }`}</style>
    </nav>
  );
}
