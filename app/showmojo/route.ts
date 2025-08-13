export const dynamic = 'force-dynamic'; // no caching; always live

const BASE = 'https://api.showmojo.com';

export async function GET() {
  const KEY = process.env.SHOWMOJO_API_KEY;
  if (!KEY) {
    return new Response(JSON.stringify({ error: 'Missing SHOWMOJO_API_KEY' }), { status: 500 });
  }
  const res = await fetch(`${BASE}/v3/listings`, {
    headers: { Authorization: `Bearer ${KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: 'ShowMojo fetch failed', details: text }), { status: 502 });
  }
  // Normalize to a consistent shape
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : raw.listings ?? [];
  const norm = (s: string) => (s || '').toLowerCase().replace(/\./g,'').replace(/\s+/g,' ').trim();

  const units = list.map((l: any) => {
    const street = l.street || l.address_line1 || l.address || '';
    const city   = l.city || '';
    return {
      id: String(l.id ?? `${street}-${l.unit ?? ''}`),
      address: { street, city, key: norm(`${street}, ${city}`) },
      unitNumber: l.unit ?? l.unitNumber ?? '',
      beds: l.beds ?? null,
      baths: l.baths ?? null,
      sqft: l.sqft ?? null,
      rent: l.rent ?? l.price ?? null,
      availableDate: l.available_on ?? l.availableDate ?? null,
      status: String(l.status ?? 'available').toLowerCase(),
      photos: (l.photos ?? []).map((p: any) => (typeof p === 'string' ? p : p.url)).filter(Boolean),
      scheduleUrl: l.url ?? l.schedule_url ?? '',
      tags: l.tags ?? [],
    };
  });

  return new Response(JSON.stringify({ units }), {
    headers: { 'content-type': 'application/json' },
  });
}
