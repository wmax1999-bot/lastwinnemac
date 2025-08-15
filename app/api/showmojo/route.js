// app/api/showmojo/route.js
import { NextResponse } from "next/server";

// Disable caching (important on Vercel)
export const dynamic = "force-dynamic";

function toNumberOrNull(x) {
  if (x == null) return null;
  if (typeof x === "number") return x;
  const n = Number(String(x).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normalizeUnit(raw = {}) {
  const addr = raw.address || {};
  const street =
    addr.street ||
    raw.address_line1 ||
    raw.street ||
    raw.location?.street ||
    "";
  const city =
    addr.city ||
    raw.city ||
    raw.location?.city ||
    "";

  const rent = toNumberOrNull(
    raw.rent ?? raw.price ?? raw.monthly_rent ?? raw.prices?.monthly
  );

  const photos = Array.isArray(raw.photos || raw.images)
    ? (raw.photos || raw.images)
    : [];

  return {
    id: String(raw.id ?? raw.listing_id ?? raw.slug ?? `${street}`),
    status: String(raw.status || "available").toLowerCase(),
    address: { street, city },
    beds: raw.beds ?? raw.bedrooms ?? raw.attributes?.beds ?? null,
    baths: raw.baths ?? raw.bathrooms ?? raw.attributes?.baths ?? null,
    rent,
    availableDate:
      raw.available_date ?? raw.availableDate ?? raw.availability ?? null,
    photos,
    unitNumber:
      raw.unit ?? raw.unit_number ?? raw.unitNumber ?? raw.apartment ?? null,
    scheduleUrl: raw.schedule_url ?? raw.scheduleUrl ?? raw.link ?? raw.url ?? null,
  };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug");

    const API_KEY = process.env.SHOWMOJO_API_KEY;
    const AUTH_STYLE = (process.env.SHOWMOJO_AUTH_STYLE || "bearer").toLowerCase();
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing SHOWMOJO_API_KEY" },
        { status: 500 }
      );
    }

    // Choose auth style: "bearer" (default) or "query"
    let endpoint = "https://api.showmojo.com/v3/listings?status=active";
    let fetchOpts = { cache: "no-store", headers: { Accept: "application/json" } };

    if (AUTH_STYLE === "bearer") {
      fetchOpts.headers.Authorization = `Bearer ${API_KEY}`;
    } else {
      endpoint = `https://api.showmojo.com/listings?status=active&api_key=${encodeURIComponent(API_KEY)}`;
    }

    const resp = await fetch(endpoint, fetchOpts);
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return NextResponse.json(
        { error: "ShowMojo upstream error", status: resp.status, body: text },
        { status: 502
