'use client';

import { useEffect, useMemo, useState } from 'react';
import buildings from '../data/buildings';

// --- Address normalization helpers ---
const SYN = [
  [/ street\b/gi, ' st'], [/ avenue\b/gi, ' ave'], [/ boulevard\b/gi, ' blvd'],
  [/ place\b/gi, ' pl'],  [/ drive\b/gi, ' dr'],  [/ road\b/gi, ' rd']
];
const normBasic = (s='') => s.toLowerCase().replace(/\./g,'').replace(/\s+/g,' ').trim();
const applySyn = (s='') => SYN.reduce((acc,[re,rep]) => acc.replace(re,rep), s);

// remove unit indicators: "#2F", "apt 3", "unit 4", etc.
const stripUnit = (s='') => normBasic(s)
  .replace(/[,]*\s*(#|apt|apartment|unit)\s*[a-z0-9\-]+$/i, '')
  .replace(/\s+#\s*[a-z0-9\-]+$/i, '');

// city might be "Chicago, IL 60626" → "chicago"
const stripCity = (s='') => normBasic(s).split(',')[0];

// final normalized key
const keyFor = (street='', city='') => applySyn(`${stripUnit(street)}, ${stripCity(city)}`);

export default function ApartmentsPage() {
  const [hood, setHood] = useState('');
  const [beds, setBeds] = useState('');
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [grouped, setGrouped] = useState({});  // { key: { building, units: [] } }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/showmojo', { cache: 'no-store' });
        if (!res.ok) throw new Error('ShowMojo proxy failed');
        const { units } = await res.json();

        // Seed map from our building list
        const map = {};
        buildings.forEach(b => {
          const k = keyFor(b.address.street, b.address.city);
          map[k] = { building: b, units: [] };
        });

        // Place available units under matching building
        (units || []).forEach(u => {
          const available = (u.status || 'available') === 'available';
          if (!available) return;

          const uStreet = u?.address?.street || u?.street || u?.address_line1 || u?.address || '';
          const uCity   = u?.address?.city   || u?.city   || '';

          const hardKey = keyFor(uStreet, uCity);
          if (map[hardKey]) { map[hardKey].units.push(u); return; }

          // Fallback: same city and unit street starts with building street (normalized)
          const uStreetBase = applySyn(stripUnit(uStreet));
          const uCityBase   = stripCity(uCity);

          Object.entries(map).forEach(([bk, bucket]) => {
            const bStreetBase = applySyn(stripUnit(bucket.building.address.street));
            const bCityBase   = stripCity(bucket.building.address.city);
            if (uCityBase === bCityBase && uStreetBase.startsWith(bStreetBase)) {
              bucket.units.push(u);
            }
          });
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

  // Filters
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
      if (hood && building.hood !== hood) return { building, units: [] };
      const u = units.filter(u => bedsOk(u.beds) && priceOk(u.rent));
      return { building, units: u };
    }).filter(section => section.units.length > 0 || !hood);
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

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border rounded-lg p-2" value={hood} onChange={(e) => setHood(e.target.value)}>
          <option value="">Neighborhood</option>
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

      {/* Data states */}
      {loading && <div className="mt-6 border rounded-lg p-4 bg-white">Loading listings…</div>}
      {err && <div className="mt-6 border rounded-lg p-4 bg-white text-red-700">Error: {err}</div>}

      {/* Output */}
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
                                <a href={u.scheduleUrl} target="_blank" rel="noreferrer"
                                   className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800">
                                  Schedule a Tour
                                </a>
                              )}
                              <a href="https://winne.twa.rentmanager.com/applynow" target="_blank" rel="noreferrer"
                                 className="border border-blue-700 text-blue-700 px-3 py-2 rounded-md text-sm font-semibold">
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
