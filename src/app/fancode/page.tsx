"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface FanCodeMatch {
  id: string;
  matchName: string;
  eventName: string;
  sport: string;
  thumbnail: string;
  streamUrl: string;
  isLive: boolean;
  language: string;
  source: string;
  startTime?: string;
}
interface FanCodeData {
  lastUpdated: string;
  refreshIntervalMinutes: number;
  liveCount: number;
  totalCount: number;
  live: FanCodeMatch[];
  upcoming: FanCodeMatch[];
  apiSource: string;
  error: string | null;
}

const SPORT_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  Cricket:    { bg: "rgba(34,197,94,0.15)",  text: "#22c55e",  emoji: "🏏" },
  Football:   { bg: "rgba(59,130,246,0.15)", text: "#3b82f6",  emoji: "⚽" },
  Basketball: { bg: "rgba(249,115,22,0.15)", text: "#f97316",  emoji: "🏀" },
  Tennis:     { bg: "rgba(234,179,8,0.15)",  text: "#eab308",  emoji: "🎾" },
  Kabaddi:    { bg: "rgba(168,85,247,0.15)", text: "#a855f7",  emoji: "🤼" },
  Hockey:     { bg: "rgba(20,184,166,0.15)", text: "#14b8a6",  emoji: "🏑" },
  default:    { bg: "rgba(232,255,71,0.10)", text: "#e8ff47",  emoji: "🏆" },
};

function getSport(sport: string) {
  return SPORT_COLORS[sport] || SPORT_COLORS.default;
}

const REFRESH_MS = 8 * 60 * 1000; // 8 minutes

export default function FanCodePage() {
  const [data, setData] = useState<FanCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(REFRESH_MS / 1000);
  const [selectedMatch, setSelectedMatch] = useState<FanCodeMatch | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fancode");
      const json = await res.json() as FanCodeData;
      setData(json);
      setLastFetch(new Date());
      setNextRefreshIn(REFRESH_MS / 1000);
      if (!selectedMatch && json.live.length > 0) setSelectedMatch(json.live[0]);
    } finally {
      setLoading(false);
    }
  }, [selectedMatch]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, REFRESH_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []); // eslint-disable-line

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setNextRefreshIn(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [lastFetch]);

  const allLive = data?.live || [];
  const allUpcoming = data?.upcoming || [];

  const sports = ["ALL", ...Array.from(new Set(allLive.map(m => m.sport).filter(Boolean)))];

  const filtered = allLive.filter(m => {
    const matchSport = filter === "ALL" || m.sport === filter;
    const matchSearch = !search || m.matchName.toLowerCase().includes(search.toLowerCase()) || m.eventName.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchSearch;
  });

  const selectMatch = (m: FanCodeMatch) => {
    setSelectedMatch(m);
    if (window.innerWidth < 900) playerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openNewTab = () => {
    if (selectedMatch) window.open(selectedMatch.streamUrl, "_blank", "noopener,noreferrer");
  };

  const mins = Math.floor(nextRefreshIn / 60);
  const secs = nextRefreshIn % 60;
  const refreshLabel = `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "28px 20px", minHeight: "calc(100vh - 56px)" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "linear-gradient(135deg, #ff6b35 0%, #ff9500 100%)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              boxShadow: "0 0 20px rgba(255,107,53,0.4)",
            }}>📺</div>
            <div>
              <h1 style={{ fontSize: "clamp(20px,3.5vw,32px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text)" }}>
                FanCode <span style={{ color: "#ff6b35" }}>LIVE</span>
              </h1>
              <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "0.15em" }}>
                REAL-TIME SPORTS STREAMING · AUTO-UPDATE EVERY 8 MIN
              </p>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
            padding: "10px 16px", background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "10px", fontSize: "10px",
          }}>
            {loading ? (
              <span style={{ color: "var(--text3)" }}>⟳ Fetching...</span>
            ) : (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e", animation: "pulse 2s infinite" }} />
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>{data?.liveCount || 0} LIVE</span>
                </span>
                <span style={{ color: "var(--border)" }}>|</span>
                <span style={{ color: "var(--text3)" }}>
                  Next update in <span style={{ color: "var(--accent)", fontWeight: 700 }}>{refreshLabel}</span>
                </span>
                {data?.apiSource && (
                  <>
                    <span style={{ color: "var(--border)" }}>|</span>
                    <span style={{ color: "var(--text3)" }}>Source: <span style={{ color: "var(--text2)" }}>{data.apiSource}</span></span>
                  </>
                )}
                {lastFetch && (
                  <>
                    <span style={{ color: "var(--border)" }}>|</span>
                    <span style={{ color: "var(--text3)" }}>Updated {lastFetch.toLocaleTimeString()}</span>
                  </>
                )}
                <button onClick={fetchData} style={{
                  marginLeft: "auto", background: "var(--bg3)", border: "1px solid var(--border)",
                  color: "var(--text2)", padding: "4px 12px", borderRadius: "6px", fontSize: "9px",
                  cursor: "pointer", letterSpacing: "0.1em",
                }}>⟳ REFRESH</button>
              </>
            )}
          </div>
        </div>

        {loading && !data ? (
          <LoadingState />
        ) : data?.liveCount === 0 && allUpcoming.length === 0 ? (
          <EmptyState error={data?.error} onRefresh={fetchData} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", alignItems: "start" }} className="fancode-grid">

            {/* Left — player + upcoming */}
            <div>
              {/* Player */}
              <div ref={playerRef}>
                {selectedMatch ? (
                  <>
                    <div style={{
                      position: "relative", borderRadius: "14px", overflow: "hidden",
                      aspectRatio: "16/9", background: "#000",
                      border: "1px solid var(--border)",
                      boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                    }}>
                      <iframe
                        key={selectedMatch.streamUrl}
                        src={selectedMatch.streamUrl}
                        width="100%" height="100%"
                        allowFullScreen scrolling="no"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        style={{ border: "none", position: "absolute", inset: 0, width: "100%", height: "100%" }}
                      />
                      {/* LIVE badge */}
                      <div style={{
                        position: "absolute", top: "14px", left: "14px",
                        background: "#ef4444", color: "#fff",
                        fontSize: "9px", fontWeight: 800, padding: "4px 10px",
                        borderRadius: "4px", letterSpacing: "0.15em",
                        display: "flex", alignItems: "center", gap: "5px",
                        pointerEvents: "none",
                      }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                        LIVE
                      </div>
                      {/* Watermark */}
                      <div style={{
                        position: "absolute", bottom: "14px", right: "14px",
                        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                        border: "1px solid rgba(232,255,71,0.3)", borderRadius: "6px",
                        padding: "5px 12px", pointerEvents: "none",
                      }}>
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "#e8ff47", letterSpacing: "0.2em", fontFamily: "monospace" }}>NikshepOS TV</span>
                      </div>
                    </div>

                    {/* Match info + actions */}
                    <div style={{
                      marginTop: "12px", padding: "16px 18px",
                      background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: "12px", flexWrap: "wrap",
                    }}>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--text)", marginBottom: "5px", letterSpacing: "-0.02em" }}>
                          {selectedMatch.matchName}
                        </p>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          {selectedMatch.eventName && <span style={{ fontSize: "10px", color: "var(--text2)" }}>{selectedMatch.eventName}</span>}
                          <span style={{ ...getSport(selectedMatch.sport), fontSize: "9px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.1em", background: getSport(selectedMatch.sport).bg }}>
                            {getSport(selectedMatch.sport).emoji} {selectedMatch.sport.toUpperCase()}
                          </span>
                          <span style={{ fontSize: "9px", color: "var(--text3)", letterSpacing: "0.1em" }}>{selectedMatch.language}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={openNewTab} style={{
                          background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)",
                          padding: "8px 14px", borderRadius: "8px", fontSize: "11px", cursor: "pointer", letterSpacing: "0.05em",
                        }}>↗ New Tab</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{
                    aspectRatio: "16/9", background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: "14px", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "12px",
                  }}>
                    <span style={{ fontSize: "40px" }}>📺</span>
                    <p style={{ fontSize: "12px", color: "var(--text3)", letterSpacing: "0.15em" }}>SELECT A MATCH TO WATCH</p>
                  </div>
                )}
              </div>

              {/* Upcoming */}
              {allUpcoming.length > 0 && (
                <div style={{ marginTop: "28px" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.25em", color: "var(--text3)", marginBottom: "14px", fontWeight: 700 }}>
                    UPCOMING ON FANCODE
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px" }}>
                    {allUpcoming.slice(0, 8).map(m => (
                      <div key={m.id} style={{
                        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "8px",
                        padding: "12px 14px", opacity: 0.6,
                      }}>
                        <p style={{ fontSize: "11px", color: "var(--text)", marginBottom: "5px", fontWeight: 600 }}>{m.matchName}</p>
                        <p style={{ fontSize: "9px", color: "var(--text3)" }}>{m.eventName} · {m.sport}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — match list */}
            <div style={{
              background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px",
              overflow: "hidden", maxHeight: "calc(100vh - 100px)", display: "flex", flexDirection: "column",
              position: "sticky", top: "68px",
            }}>
              {/* List header */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "0.15em", fontWeight: 700 }}>LIVE MATCHES ({filtered.length})</p>
                  <span style={{ fontSize: "9px", color: "#ff6b35", fontWeight: 700, letterSpacing: "0.1em" }}>FANCODE</span>
                </div>

                {/* Search */}
                <input type="text" placeholder="search match or event..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                    color: "var(--text)", padding: "8px 10px", fontSize: "11px", borderRadius: "6px",
                    outline: "none", marginBottom: "10px",
                  }}
                  onFocus={e => e.target.style.borderColor = "#ff6b35"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"} />

                {/* Sport filter */}
                {sports.length > 1 && (
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {sports.map(s => (
                      <button key={s} onClick={() => setFilter(s)}
                        style={{
                          padding: "3px 10px", fontSize: "9px", borderRadius: "4px", cursor: "pointer",
                          border: "1px solid", letterSpacing: "0.08em", fontWeight: filter === s ? 700 : 400,
                          background: filter === s ? "#ff6b35" : "var(--bg)",
                          borderColor: filter === s ? "#ff6b35" : "var(--border)",
                          color: filter === s ? "#fff" : "var(--text3)",
                        }}>
                        {s === "ALL" ? "All" : `${getSport(s).emoji} ${s}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Scrollable matches */}
              <div style={{ overflowY: "auto", flex: 1 }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <p style={{ fontSize: "24px", marginBottom: "10px" }}>📡</p>
                    <p style={{ fontSize: "11px", color: "var(--text3)" }}>No live matches right now</p>
                  </div>
                ) : (
                  filtered.map(m => {
                    const isSelected = selectedMatch?.id === m.id;
                    const sport = getSport(m.sport);
                    return (
                      <MatchRow key={m.id} match={m} isSelected={isSelected} sport={sport} onSelect={() => selectMatch(m)} />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 900px) {
          .fancode-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function MatchRow({ match, isSelected, sport, onSelect }: {
  match: FanCodeMatch;
  isSelected: boolean;
  sport: { bg: string; text: string; emoji: string };
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onSelect}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px",
        cursor: "pointer", borderBottom: "1px solid var(--border)",
        background: isSelected ? "rgba(255,107,53,0.07)" : hovered ? "var(--card-hover)" : "transparent",
        borderLeft: `3px solid ${isSelected ? "#ff6b35" : "transparent"}`,
        transition: "all 0.12s",
      }}>
      {/* Thumbnail */}
      <div style={{
        width: "52px", height: "36px", flexShrink: 0, borderRadius: "4px",
        background: "var(--bg3)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {match.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={match.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <span style={{ fontSize: "18px" }}>{sport.emoji}</span>
        )}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "11px", fontWeight: isSelected ? 700 : 500,
          color: isSelected ? "#ff6b35" : "var(--text)",
          lineHeight: 1.4, marginBottom: "5px",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{match.matchName}</p>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "8px", padding: "1px 6px", borderRadius: "3px", background: sport.bg, color: sport.text, fontWeight: 700, letterSpacing: "0.08em" }}>
            {sport.emoji} {match.sport}
          </span>
          {match.isLive && (
            <span style={{ fontSize: "8px", background: "#ef444420", color: "#ef4444", padding: "1px 6px", borderRadius: "3px", fontWeight: 700, letterSpacing: "0.08em" }}>
              ● LIVE
            </span>
          )}
          <span style={{ fontSize: "8px", color: "var(--text3)" }}>{match.language}</span>
        </div>
      </div>
      {isSelected && <span style={{ color: "#ff6b35", fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>▶</span>}
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid var(--border2)", borderTop: "3px solid #ff6b35", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <p style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "0.2em" }}>FETCHING FANCODE STREAMS</p>
      <p style={{ fontSize: "9px", color: "var(--text3)", marginTop: "8px" }}>Updates every 8 minutes</p>
    </div>
  );
}

function EmptyState({ error, onRefresh }: { error?: string | null; onRefresh: () => void }) {
  return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <p style={{ fontSize: "48px", marginBottom: "16px" }}>📡</p>
      <p style={{ fontSize: "14px", color: "var(--text)", fontWeight: 700, marginBottom: "8px" }}>No live matches on FanCode right now</p>
      <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "20px", maxWidth: "360px", margin: "0 auto 20px" }}>
        FanCode streams Indian cricket, kabaddi, football and more. Check back during a live event.
      </p>
      {error && <p style={{ fontSize: "9px", color: "var(--red)", marginBottom: "16px", letterSpacing: "0.1em" }}>{error}</p>}
      <button onClick={onRefresh} style={{
        background: "#ff6b35", border: "none", color: "#fff", padding: "10px 24px",
        borderRadius: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em",
      }}>⟳ REFRESH</button>
    </div>
  );
}
