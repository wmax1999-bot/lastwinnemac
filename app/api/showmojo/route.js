// app/api/showmojo/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";              // ensure Node runtime (not Edge)
export const preferredRegion = "iad1";        // same as your build log region

const TIMEOUT_MS = 8000;
const RETRIES = 2;

function toNumberOrNull(x) {
  if (x == null) return null;
  if (typeof x === "number") return x;
  const n = Number(String(x).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normalizeUnit(raw = {}) {
  const addr = raw.address || {};
  const street = addr.street || raw.address_line1 || raw.street || raw.location?.street || "";
  const city   = addr.city   || raw.city         || raw.location?.city   || "";
  const rent   = toNumberOrNull(raw.rent ?? raw.price ?? raw.monthly_rent ?? raw.prices?.monthly);
  const photos = Array.isArray(raw.photos || raw.images) ? (raw.photos || raw.images) : [];

  return {
    id: String(raw.id ?? raw.listing_id ?? raw.slug ?? `${street}`),
    status: String(raw.status || "available").toLowerCase(),
    address: { street, city },
    beds: raw.beds ?? raw.bedrooms ?? raw.attributes?.beds ?? null,
    baths: raw.baths ?? raw.bathrooms ?? raw.attributes?.baths ?? null,
    rent,
    availableDate: raw.available_date ?? raw.availableDate ?? raw.availability ?? null,
    photos,
    unitNumber: raw.unit ?? raw.unit_number ?? raw.unitNumber ?? raw.apartment ?? null,
    scheduleUrl: raw.schedule_url ?? raw.scheduleUrl ?? raw.link ?? raw.url ?? null,
  };
}

function pickListingsShape(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.listings)) return data.listings;
  if (Array.isArray(data?.results))  return data.results;
  if (Array.isArray(data?.units))    return data.units;
  if (Array.isArray(data?.data?.listings)) return data.data.listings;
  return [];
}

// fetch with timeout + basic retry
async function fetchWithTimeout(url, opts, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function tryFetch(name, url, headers) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const resp = await fetchWithTimeout(url, {
        headers: { "Accept": "application/json", "User-Agent": "Winnemac/1.0", ...headers },
        cache: "no-store",
      }, TIMEOUT_MS);
      const text = await resp.text();
      let body = null;
      try { body = text ? JSON.parse(text) : {}; } catch { body = text; }
      return { ok: resp.ok, status: resp.status, body, name };
    } catch (e) {
      lastErr = e;
      // brief backoff
      await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  return { ok: false, status: "fetch-failed", body: String(lastErr), name };
}

export async function GET(req) {
  const q = new URL(req.url).searchParams;
  const debug = q.get("debug");
  const API_KEY = process.env.SHOWMOJO_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "Missing SHOWMOJO_API_KEY" }, { status: 500 });
  }

  // Try multiple auth styles/endpoints
  const attempts = [];
  const candidates = [
    {
      name: "v3-bearer",
      url:  "https://api.showmojo.com/v3/listings?status=active",
      headers: { Authorization: `Bearer ${API_KEY}` },
    },
    {
      name: "legacy-query",
      url:  `https://api.showmojo.com/listings?status=active&api_key=${encodeURIComponent(API_KEY)}`,
      headers: {},
    },
    {
      name: "v3-query",
      url:  `https://api.showmojo.com/v3/listings?status=active&api_key=${encodeURIComponent(API_KEY)}`,
      headers: {},
    },
  ];

  for (const c of candidates) {
    const res = await tryFetch(c.name, c.url, c.headers);
    attempts.push({ name: res.name, status: res.status, ok: res.ok });

    if (res.ok) {
      const rawList = pickListingsShape(res.body);
      const units = (Array.isArray(rawList) ? rawList : []).map(normalizeUnit);

      if (debug) {
        const first = (Array.isArray(rawList) && rawList[0]) || {};
        return NextResponse.json({
          endpoint_used: res.name,
          count: units.length,
          upstream_keys: typeof first === "object" ? Object.keys(first) : [],
          attempts
        });
      }
      return NextResponse.json({ units });
    }
  }

  return NextResponse.json(
    { error: "Proxy failed", attempts },
    { status: 502 }
  );
}
