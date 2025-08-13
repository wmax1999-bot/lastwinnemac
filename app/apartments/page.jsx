'use client';

import { useEffect, useMemo, useState } from 'react';
import buildings from '../data/buildings';

const SYN = [
  [/ street\b/gi, ' st'], [/ avenue\b/gi, ' ave'], [/ boulevard\b/gi, ' blvd'],
  [/ place\b/gi, ' pl'],  [/ drive\b/gi, ' dr'],  [/ road\b/gi, ' rd']
];
const norm = (s='') => { let o = s.toLowerCase().replace(/\./g,'').replace(/\s+/g,' ').trim(); SYN.forEach(([re,rep])=>o=o.replace(re,rep)); return o; };
const keyFor = (street, city) => norm(`${street}, ${city}`);

export default function ApartmentsPage() {
  // filters (kept from your current UI)
  const [hood, setHood] = useState('');
  const [beds, setBeds] = useState('');
  const [price, setPrice] = useState('');

  // data state
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [grouped, setGrouped] = useState({});  // { key: { building, units: [] } }

  // fetch ShowMojo → group by building
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/showmojo', { cache: 'no-store' });
        if (!res.ok) throw new Error('ShowMojo proxy failed');
        const { units } = await res.json();

        // seed map with all buildings
        const map = {};
        buildings.forEach(b => {
          const k = keyFor(b.address.street, b.address.city);
          map[k] = { building: b, units: [] };
        });

        // place available units under the correct building
        (units || []).forEach(u => {
          const available = (u.status || 'available') === 'available';
          if (!available) return;
          const k = u.address?.key || keyFor(u.address?.street || '', u.address?.city || '');
          if (k && map[k]) map[k].units.push(u);
        });

        setGrouped(map);
        setErr(null);
      } catch (e) {
        setErr(e.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // apply your filters (by hood/beds/price) to each building's units
  const filteredSections = useMemo(() => {
    const priceOk = (rent) => {
      if (!price) return true;
      if (price === '1500-') return (rent ?? 0) <= 1500;
      if (price === '1501-1800') return (rent ?? 0) > 1500 && (rent ?? 0) <= 1800;
      return (rent ?? 0) > 1800; // '1801+'
    };
    const bedsOk = (b) => {
      if (!beds) return true;
      if (beds === '0') return (b ?? 0) === 0;
      if (beds === '3') return (b ?? 0) >= 3;
      return String(b ?? '') === beds;
    };

    return Object.values(grouped).map(({ building, units }) => {
      // per-building hood filter (hide section if user picked a different hood)
      if (hood && building.hood !== hood) return { building, units: [] };

      // unit-level filters
      const u = units.filter(u =>
        bedsOk(u.beds) &&
        priceOk(u.rent)
      );

      return { building, units: u };
    }).filter(section => section.units.length > 0 || !hood); // if hood picked, hide empty sections
  }, [grouped, hood, beds, price]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Available Apartments</h1>
          <p className="text-gray-600">Units are grouped by building. Book a showing or apply online.</p>
        </div>
        <a
          href="https://winne.twa.rentmanager.com/applynow"
          target="_blank"
          rel="noreferrer"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800"
        >
          Apply Now
        </a>
      </div>

      {/* filters — same UI you already had */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border rounded-lg p-2" value={hood} onChange={(e) => setHood(e.target.value)}>
          <option value="">Neighborhood</option>
          {/* build options from buildings list to avoid typos */}
          {[...new Set(buildings.map(b => b.hood))].map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <select className="border rounded-lg p-2" value={beds} onChange={(e) => setBeds(e.target.value)}>
          <option value="">Beds</option>
          <option value="0">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>

        <select className="border rounded-lg p-2" value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="">Price</option>
          <option value="1500-">≤ $1,500</option>
          <option value="1501-1800">$1,501–$1,800</option>
          <option value="1801+">$1,801+</option>
        </select>

        <button onClick={() => { setHood(''); setBeds(''); setPrice(''); }} className="border rounded-lg px-3 py-2 hover:bg-gray-50">
          Reset
        </button>
      </div>

      {/* data states */}
      {loading && <div className="mt-6 border rounded-lg p-4 bg-white">Loading listings…</div>}
      {err && <div className="mt-6 border rounded-lg p-4 bg-white text-red-700">Error: {err}</div>}

      {/* grouped output: one section per building, units below */}
      {!loading && !err && (
        <div className="mt-8 space-y-8">
          {filteredSections.length === 0 && (
            <div className="border rounded-lg p-4 bg-white text-gray-600">No results match your filters.</div>
          )}

          {filteredSections.map(({ building, units }) => (
            <section key={building.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{building.name}</h2>
                <div className="text-gray-600">{building.hood} • {building.address.street}, {building.address.city}</div>
              </div>

              <div className="p-4">
                {units.length ? (
                  <div className="grid gap-6 md:grid-cols-3">
                    {units.map(u => {
                      const priceText = u.rent ? `$${Number(u.rent).toLocaleString()}/mo` : 'Call for pricing';
                      const avail = u.availableDate ? new Date(u.availableDate).toLocaleDateString() : 'TBD';
                      return (
                        <div key={u.id} className="bg-white border rounded-xl hover:shadow-lg overflow-hidden">
                          {u.photos?.[0] && <img src={u.photos[0]} alt={`Unit ${u.unitNumber ?? ''}`} className="h-48 w-full object-cover" />}
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">Unit {u.unitNumber || '—'}</h3>
                              <span className="font-semibold">{priceText}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {(u.beds ?? 0) === 0 ? 'Studio' : `${u.beds ?? '—'} Bed`} • {u.baths ?? '—'} Bath • Available {avail}
                            </p>
                            <div className="mt-4 flex gap-3">
                              {u.scheduleUrl && (
                                <a
                                  href={u.scheduleUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800"
                                >
                                  Schedule a Tour
                                </a>
                              )}
                              <a
                                href="https://winne.twa.rentmanager.com/applynow"
                                target="_blank"
                                rel="noreferrer"
                                className="border border-blue-700 text-blue-700 px-3 py-2 rounded-md text-sm font-semibold"
                              >
                                Apply
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-gray-600">No vacancies right now.</div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
