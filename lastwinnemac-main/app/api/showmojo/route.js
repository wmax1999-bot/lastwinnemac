export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // ensure Node runtime

const norm = (s='') => s.toLowerCase().replace(/\./g,'').replace(/\s+/g,' ').trim();

export async function GET() {
  const KEY = process.env.SHOWMOJO_API_KEY;
  if (!KEY) {
    return new Response(JSON.stringify({ error: 'Missing SHOWMOJO_API_KEY' }), { status: 500 });
  }

  // Try the documented ShowMojo auth style and hosts
  const attempts = [];
  const endpoints = [
    { url: 'https://showmojo.com/api/v3/listings', auth: `Token token="${KEY}"` },
    { url: 'https://api.showmojo.com/v3/listings',  auth: `Token token="${KEY}"` },
  ];

  for (const ep of endpoints) {
    try {
      const r = await fetch(ep.url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': ep.auth,
        },
        cache: 'no-store',
      });
      const text = await r.text();
      if (!r.ok) {
        attempts.push({ url: ep.url, status: r.status, body: text.slice(0, 300) });
        continue;
      }
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      const list = Array.isArray(data) ? data : (data.listings || []);

      const units = list.map((l) => {
        const street = l.street || l.address_line1 || l.address || '';
        const city   = l.city || '';
        return {
          id: String(l.id ?? `${street}-${l.unit ?? ''}`),
          address: { street, city, key: norm(`${street}, ${city}`) },
          unitNumber: l.unit ?? l.unitNumber ?? '',
          beds: l.beds ?? l.bedrooms ?? null,
          baths: l.baths ?? l.full_bathrooms ?? null,
          sqft: l.sqft ?? l.square_feet ?? null,
          rent: l.rent ?? l.price ?? null,
          availableDate: l.available_on ?? l.available_date ?? null,
          status: String(l.status ?? 'available').toLowerCase(),
          photos: (l.photos ?? l.images ?? []).map((p) => (typeof p === 'string' ? p : p.url)).filter(Boolean),
          scheduleUrl: l.url ?? l.public_url ?? l.schedule_url ?? '',
          tags: l.tags ?? [],
        };
      });

      return new Response(JSON.stringify({ units }), {
        headers: { 'content-type': 'application/json' },
      });
    } catch (e) {
      attempts.push({ url: ep.url, error: String(e).slice(0, 200) });
    }
  }

  return new Response(JSON.stringify({ error: 'ShowMojo proxy failed', attempts }), { status: 502 });
}
