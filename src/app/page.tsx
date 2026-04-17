"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BravePopup } from "@/components/BravePopup";
import { NikshepOverlay } from "@/components/NikshepOverlay";

interface Provider { title: string; image: string; catLink: string; }
interface SonyMatch { id: string; matchName: string; eventName: string; channel: string; category: string; language: string; thumbnail: string; streamUrl: string | null; isLive: boolean; source?: string; }
interface SonyData { lastUpdated: string; liveCount: number; live: SonyMatch[]; upcoming: SonyMatch[]; }

const CHANNELS_PREVIEW = [
  { name: "Fox Sports", emoji: "🦊", streams: 1 },
  { name: "Star Sports 1", emoji: "⭐", streams: 5 },
  { name: "Willow", emoji: "🌿", streams: 5 },
  { name: "Fox Cricket", emoji: "🏏", streams: 3 },
  { name: "Sky Sports", emoji: "🌤️", streams: 2 },
  { name: "CricLife", emoji: "🏟️", streams: 2 },
];

export default function HomePage() {
  const [cricfyProviders, setCricfyProviders] = useState<Provider[]>([]);
  const [sportsProviders, setSportsProviders] = useState<Provider[]>([]);
  const [sonyData, setSonyData] = useState<SonyData | null>(null);
  const [loadingCricfy, setLoadingCricfy] = useState(true);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingSony, setLoadingSony] = useState(true);
  const [cricfySearch, setCricfySearch] = useState("");
  const [sportsSearch, setSportsSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"nikshepOS" | "fancode" | "sonyliv" | "sports" | "cricfy">("nikshepOS");

  useEffect(() => {
    fetch("/api/providers")
      .then(r => r.json())
      .then(d => { if (!d.error) setCricfyProviders(d.providers.filter((p: Provider) => p.catLink?.startsWith("http"))); })
      .finally(() => setLoadingCricfy(false));
    fetch("/api/daddylive")
      .then(r => r.json())
      .then(d => { if (!d.error) setSportsProviders(d.providers); })
      .finally(() => setLoadingSports(false));
    fetch("/api/sonyliv")
      .then(r => r.json())
      .then(d => { if (!d.error) setSonyData(d); })
      .finally(() => setLoadingSony(false));
  }, []);

  const filteredCricfy = cricfyProviders.filter(p => p.title.toLowerCase().includes(cricfySearch.toLowerCase()));
  const filteredSports = sportsProviders.filter(p => p.title.toLowerCase().includes(sportsSearch.toLowerCase()));
  const liveCount = sonyData?.liveCount || 0;

  return (
    <>
      <BravePopup />
      <NikshepOverlay />
      <Navbar />
      <main style={{ maxWidth: "1240px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Hero */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "var(--text3)", marginBottom: "12px" }}>NIKSHEP OS TV · LIVE SPORTS STREAMING</p>
          <h1 style={{ fontSize: "clamp(30px, 5.5vw, 58px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "16px" }}>
            WATCH LIVE<br /><span style={{ color: "var(--accent)" }}>SPORTS</span>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text2)", maxWidth: "480px", lineHeight: 1.7 }}>
            Premium live cricket and sports streams — Fox Sports, Star Sports, Willow, Sky Sports & more.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "32px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "4px", flexWrap: "wrap" }}>
          {[
            { key: "nikshepOS", label: "📺 NIKSHEPOS TV", sub: "Fox Sports · Star Sports · Willow & more" },
            { key: "fancode", label: "🟠 FANCODE LIVE", sub: "Cricket · Kabaddi · Football — live API" },
            { key: "sonyliv", label: `🔴 LIVE NOW${liveCount > 0 ? ` (${liveCount})` : ""}`, sub: "SonyLiv · FanCode · auto-updated" },
            { key: "sports", label: "⚡ SPORTS PROVIDERS", sub: "Pirates TV, CricHD & more" },
            { key: "cricfy", label: "📡 CRICFY", sub: "62 encrypted providers" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={{
                background: activeTab === tab.key ? "var(--accent)" : "transparent",
                color: activeTab === tab.key ? "#000" : "var(--text2)",
                border: "none", padding: "10px 18px", fontSize: "10px",
                fontFamily: "var(--font)", fontWeight: activeTab === tab.key ? 800 : 400,
                letterSpacing: "0.1em", borderRadius: "6px", cursor: "pointer",
                transition: "all 0.15s", textAlign: "left",
              }}>
              <div>{tab.label}</div>
              <div style={{ fontSize: "8px", opacity: 0.7, marginTop: "2px" }}>{tab.sub}</div>
            </button>
          ))}
        </div>

        {/* NIKSHEPOSTI TV TAB */}
        {activeTab === "nikshepOS" && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, rgba(232,255,71,0.07) 0%, rgba(232,255,71,0.01) 100%)",
              border: "1px solid rgba(232,255,71,0.2)", borderRadius: "12px",
              padding: "28px", marginBottom: "28px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "20px", flexWrap: "wrap",
            }}>
              <div>
                <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "var(--accent)", marginBottom: "8px" }}>FEATURED</p>
                <h2 style={{ fontSize: "24px", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                  NikshepOS TV Channels
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.6, maxWidth: "400px" }}>
                  6 premium sports channels with multiple stream backups. Fox Sports, Star Sports, Willow, Fox Cricket, Sky Sports, and CricLife — all in one place.
                </p>
              </div>
              <Link href="/live">
                <button style={{
                  background: "var(--accent)", border: "none", color: "#000",
                  padding: "14px 28px", borderRadius: "10px", fontSize: "13px",
                  fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em",
                  whiteSpace: "nowrap", transition: "all 0.15s",
                }}>
                  ▶ Watch Now
                </button>
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {CHANNELS_PREVIEW.map(ch => (
                <Link key={ch.name} href="/live">
                  <div style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: "10px", padding: "20px 16px", cursor: "pointer",
                    transition: "all 0.15s", textAlign: "center",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLDivElement).style.background = "var(--card-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.background = "var(--bg2)"; }}>
                    <div style={{ fontSize: "32px", marginBottom: "10px" }}>{ch.emoji}</div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>{ch.name}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                      <span style={{ fontSize: "9px", color: "var(--text3)", letterSpacing: "0.1em" }}>
                        {ch.streams} STREAM{ch.streams > 1 ? "S" : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FANCODE TAB */}
        {activeTab === "fancode" && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.02) 100%)",
              border: "1px solid rgba(255,107,53,0.3)", borderRadius: "12px",
              padding: "28px", marginBottom: "28px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "20px", flexWrap: "wrap",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "linear-gradient(135deg, #ff6b35 0%, #ff9500 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                  }}>📺</div>
                  <h2 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>
                    FanCode <span style={{ color: "#ff6b35" }}>Live</span>
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.6, maxWidth: "440px", marginBottom: "10px" }}>
                  Real-time cricket, kabaddi, football and more. Powered by live API — updates every <strong style={{ color: "#ff6b35" }}>8 minutes</strong> automatically.
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["🏏 Cricket", "🤼 Kabaddi", "⚽ Football", "🎾 Tennis"].map(s => (
                    <span key={s} style={{ fontSize: "9px", padding: "3px 10px", borderRadius: "4px", background: "rgba(255,107,53,0.12)", color: "#ff6b35", fontWeight: 700, letterSpacing: "0.1em" }}>{s}</span>
                  ))}
                </div>
              </div>
              <Link href="/fancode">
                <button style={{
                  background: "#ff6b35", border: "none", color: "#fff",
                  padding: "14px 28px", borderRadius: "10px", fontSize: "13px",
                  fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em",
                  whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(255,107,53,0.35)",
                }}>▶ Watch FanCode</button>
              </Link>
            </div>
            <FanCodePreview />
          </div>
        )}

        {/* SONYLIV TAB */}
        {activeTab === "sonyliv" && (
          <div>
            {loadingSony ? <Spinner label="FETCHING LIVE MATCHES" /> : (
              <>
                {sonyData && (
                  <p style={{ fontSize: "9px", color: "var(--text3)", marginBottom: "20px", letterSpacing: "0.1em" }}>
                    LAST UPDATED {sonyData.lastUpdated} · AUTO-REFRESHES EVERY 7 MIN
                  </p>
                )}
                {sonyData && sonyData.live.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block", boxShadow: "0 0 8px #ef4444", animation: "pulse 2s infinite" }} />
                      <p style={{ fontSize: "11px", color: "var(--text)", fontWeight: 700, letterSpacing: "0.1em" }}>LIVE NOW</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                      {sonyData.live.map(match => <SonyMatchCard key={match.id} match={match} />)}
                    </div>
                  </div>
                )}
                {sonyData && sonyData.upcoming.length > 0 && (
                  <div>
                    <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "0.2em", marginBottom: "12px" }}>UPCOMING / OFF AIR</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
                      {sonyData.upcoming.filter(m => m.matchName).map(match => (
                        <div key={match.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px 16px", opacity: 0.6 }}>
                          <p style={{ fontSize: "11px", color: "var(--text)", marginBottom: "4px" }}>{match.matchName}</p>
                          <p style={{ fontSize: "9px", color: "var(--text3)", letterSpacing: "0.1em" }}>{match.channel} · {match.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sonyData && sonyData.live.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: "32px", marginBottom: "12px" }}>📡</p>
                    <p style={{ fontSize: "12px", color: "var(--text)", marginBottom: "8px" }}>No live matches right now</p>
                    <p style={{ fontSize: "10px", color: "var(--text3)" }}>Check back when a match is scheduled</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* SPORTS TAB */}
        {activeTab === "sports" && (
          <div>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>Sports Stream Providers</p>
                <p style={{ fontSize: "10px", color: "var(--text3)" }}>Star Sports, Sony Ten, T Sports and more via Pirates TV & CricHD</p>
              </div>
              <input type="text" placeholder="search providers..." value={sportsSearch}
                onChange={e => setSportsSearch(e.target.value)}
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 12px", fontSize: "11px", fontFamily: "var(--font)", borderRadius: "6px", outline: "none", width: "220px" }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />
            </div>
            {loadingSports ? <Spinner label="LOADING PROVIDERS" /> : (
              <>
                <p style={{ fontSize: "10px", color: "var(--text3)", marginBottom: "16px", letterSpacing: "0.1em" }}>{filteredSports.length} PROVIDERS</p>
                <ProviderGrid providers={filteredSports} />
              </>
            )}
          </div>
        )}

        {/* CRICFY TAB */}
        {activeTab === "cricfy" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <input type="text" placeholder="filter providers..." value={cricfySearch}
                onChange={e => setCricfySearch(e.target.value)}
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", padding: "9px 12px", fontSize: "13px", fontFamily: "var(--font)", borderRadius: "6px", outline: "none", width: "100%", maxWidth: "420px" }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />
            </div>
            {loadingCricfy ? <Spinner label="FETCHING PROVIDERS" /> : (
              <>
                <p style={{ fontSize: "10px", color: "var(--text3)", marginBottom: "16px", letterSpacing: "0.1em" }}>{filteredCricfy.length} PROVIDERS</p>
                <ProviderGrid providers={filteredCricfy} />
              </>
            )}
          </div>
        )}

      </main>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </>
  );
}

function SonyMatchCard({ match }: { match: SonyMatch }) {
  const [hovered, setHovered] = useState(false);
  const params = encodeURIComponent(JSON.stringify({ url: match.streamUrl, name: match.matchName, referer: "https://www.sonyliv.com", userAgent: "Mozilla/5.0", logo: match.thumbnail, group: match.category }));
  return (
    <Link href={`/play?ch=${params}`}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: hovered ? "var(--card-hover)" : "var(--bg2)", border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`, borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "all 0.15s" }}>
        {match.thumbnail && (
          <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--bg3)", overflow: "hidden" }}>
            <img src={match.thumbnail} alt={match.matchName} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div style={{ position: "absolute", top: "8px", left: "8px", background: "#ef4444", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", letterSpacing: "0.1em" }}>
              {match.source || "LIVE"} ● LIVE
            </div>
          </div>
        )}
        <div style={{ padding: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "4px", lineHeight: 1.4 }}>{match.matchName}</p>
          <p style={{ fontSize: "10px", color: "var(--text2)", marginBottom: "6px" }}>{match.eventName}</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", background: "var(--bg3)", color: "var(--text3)", padding: "2px 8px", borderRadius: "3px", letterSpacing: "0.1em" }}>{match.channel}</span>
            <span style={{ fontSize: "9px", color: "var(--text3)" }}>{match.category} · {match.language}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ width: "24px", height: "24px", border: "2px solid var(--border2)", borderTop: "2px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
      <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "0.2em" }}>{label}</p>
    </div>
  );
}

function ProviderGrid({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) return <p style={{ fontSize: "11px", color: "var(--text3)", textAlign: "center", padding: "40px" }}>No providers found</p>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)" }}>
      {providers.map(p => <ProviderCard key={p.catLink} provider={p} />)}
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/watch?url=${encodeURIComponent(provider.catLink)}&name=${encodeURIComponent(provider.title)}`}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: hovered ? "var(--card-hover)" : "var(--bg)", padding: "18px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", transition: "background 0.1s", minHeight: "68px" }}>
        <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--bg3)", borderRadius: "4px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {provider.image ? <img src={provider.image} alt={provider.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <span style={{ fontSize: "14px", color: "var(--text3)" }}>▶</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{provider.title}</p>
          <p style={{ fontSize: "9px", color: "var(--text3)", letterSpacing: "0.1em", marginTop: "3px" }}>STREAM PROVIDER</p>
        </div>
        <span style={{ fontSize: "16px", color: hovered ? "var(--accent)" : "var(--text3)", transition: "all 0.1s", transform: hovered ? "translateX(3px)" : "none" }}>→</span>
      </div>
    </Link>
  );
}

function FanCodePreview() {
  const [data, setData] = useState<{ liveCount: number; live: { id: string; matchName: string; sport: string; eventName: string; isLive: boolean }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fancode")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <div style={{ width: "20px", height: "20px", border: "2px solid var(--border2)", borderTop: "2px solid #ff6b35", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
      <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "0.15em" }}>LOADING FANCODE STREAMS</p>
    </div>
  );

  if (!data || data.liveCount === 0) return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <p style={{ fontSize: "28px", marginBottom: "10px" }}>📡</p>
      <p style={{ fontSize: "12px", color: "var(--text3)" }}>No live matches right now — check back soon</p>
    </div>
  );

  const sportColors: Record<string, string> = { Cricket: "#22c55e", Football: "#3b82f6", Kabaddi: "#a855f7", Tennis: "#eab308", default: "#ff6b35" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block", boxShadow: "0 0 8px #ef4444", animation: "pulse 2s infinite" }} />
        <p style={{ fontSize: "10px", color: "var(--text)", fontWeight: 700, letterSpacing: "0.1em" }}>LIVE NOW ON FANCODE ({data.liveCount})</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
        {data.live.slice(0, 6).map(m => (
          <Link key={m.id} href="/fancode">
            <div style={{
              background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "8px",
              padding: "14px 16px", cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#ff6b35"; (e.currentTarget as HTMLDivElement).style.background = "var(--card-hover)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.background = "var(--bg2)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                <span style={{ fontSize: "8px", color: sportColors[m.sport] || sportColors.default, fontWeight: 700, letterSpacing: "0.1em" }}>{m.sport.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "4px", lineHeight: 1.4 }}>{m.matchName}</p>
              {m.eventName && <p style={{ fontSize: "9px", color: "var(--text3)" }}>{m.eventName}</p>}
            </div>
          </Link>
        ))}
      </div>
      {data.liveCount > 6 && (
        <Link href="/fancode">
          <p style={{ fontSize: "10px", color: "#ff6b35", marginTop: "12px", textAlign: "center", cursor: "pointer", letterSpacing: "0.1em" }}>
            + {data.liveCount - 6} more matches → View all on FanCode
          </p>
        </Link>
      )}
    </div>
  );
}
