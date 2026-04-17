// src/app/api/fancode/route.ts
// Fetches live FanCode matches from amitbala1993 worker API + drmlive fallback
// Updates every 8 minutes per API spec

import { NextResponse } from "next/server";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const FANCODE_WORKER_API = "https://fcapi.amitbala1993.workers.dev";
const FANCODE_DRMLIVE_JSON = "https://raw.githubusercontent.com/drmlive/fancode-live-events/refs/heads/main/fancode.json";
const FANCODE_STREAM_WORKER = "https://fancode-india-sonu.pages.dev/api";

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

function parseAmitbalaResponse(data: Record<string, unknown>): FanCodeMatch[] {
  // Handle various possible shapes from the worker API
  const items = (
    (data.matches as unknown[]) ||
    (data.events as unknown[]) ||
    (data.data as unknown[]) ||
    (data.live as unknown[]) ||
    (Array.isArray(data) ? data : [])
  ) as Record<string, unknown>[];

  return items.map((m) => {
    const matchId = String(m.match_id || m.contentId || m.id || "");
    const language = String(m.language || m.audioLanguageName || "ENGLISH").toUpperCase();
    const isLive = Boolean(m.isLive || m.is_live || String(m.status || "").toUpperCase() === "LIVE");
    
    let streamUrl = String(m.video_url || m.adfree_url || m.pub_url || m.dai_url || m.stream_url || m.url || "");
    if (matchId && isLive && !streamUrl) {
      streamUrl = `${FANCODE_STREAM_WORKER}/${matchId}_${language}_sayan.m3u8`;
    }

    return {
      id: matchId || String(Math.random()),
      matchName: String(m.match_name || m.title || m.name || "Live Match"),
      eventName: String(m.event_name || m.tournament || m.series || ""),
      sport: String(m.event_category || m.sport || m.category || "Cricket"),
      thumbnail: String(m.src || m.thumbnail || m.image || m.logo || m.banner || ""),
      streamUrl,
      isLive,
      language,
      source: "FanCode",
      startTime: String(m.start_time || m.startTime || m.scheduled_time || ""),
    };
  }).filter(m => m.streamUrl && m.streamUrl !== "null" && m.streamUrl !== "undefined");
}

function parseDrmliveResponse(data: Record<string, unknown>): FanCodeMatch[] {
  const items = (data.matches || data.channels || []) as Record<string, unknown>[];
  return items.map((m) => {
    const matchId = String(m.match_id || m.contentId || m.id || "");
    const language = String(m.language || m.audioLanguageName || "ENGLISH").toUpperCase();
    const isLive = Boolean(m.isLive || m.is_live);
    const streamUrl = isLive && matchId
      ? `${FANCODE_STREAM_WORKER}/${matchId}_${language}_sayan.m3u8`
      : String(m.video_url || m.adfree_url || "");

    return {
      id: matchId || String(Math.random()),
      matchName: String(m.match_name || m.title || "Live Match"),
      eventName: String(m.event_name || m.tournament || ""),
      sport: String(m.event_category || m.sport || "Cricket"),
      thumbnail: String(m.src || m.thumbnail || m.image || ""),
      streamUrl,
      isLive,
      language,
      source: "FanCode",
      startTime: "",
    };
  }).filter(m => m.streamUrl && m.streamUrl !== "null");
}

export async function GET() {
  const headers = { "User-Agent": UA, Accept: "application/json" };
  
  let matches: FanCodeMatch[] = [];
  let apiSource = "";
  let error = "";

  // Try amitbala1993 worker API first
  try {
    const res = await fetch(FANCODE_WORKER_API, { headers, next: { revalidate: 480 } });
    if (res.ok) {
      const raw = await res.text();
      // Could be JSON or HTML/text — handle gracefully
      const data = JSON.parse(raw);
      matches = parseAmitbalaResponse(data as Record<string, unknown>);
      apiSource = "amitbala1993-worker";
    }
  } catch (e) {
    error = String(e);
  }

  // Fallback to drmlive GitHub JSON
  if (matches.length === 0) {
    try {
      const res = await fetch(FANCODE_DRMLIVE_JSON, { headers, next: { revalidate: 480 } });
      if (res.ok) {
        const data = await res.json() as Record<string, unknown>;
        matches = parseDrmliveResponse(data);
        apiSource = "drmlive-github";
      }
    } catch (e2) {
      error += " | " + String(e2);
    }
  }

  const live = matches.filter(m => m.isLive);
  const upcoming = matches.filter(m => !m.isLive && m.matchName !== "Live Match");

  return NextResponse.json({
    lastUpdated: new Date().toISOString(),
    refreshIntervalMinutes: 8,
    liveCount: live.length,
    totalCount: matches.length,
    live,
    upcoming,
    apiSource,
    error: error || null,
  });
}
