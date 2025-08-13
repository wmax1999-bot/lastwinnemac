'use client';

import { useEffect, useState } from 'react';
import buildings from '../data/buildings';

const SYN = [
  [/ street\b/gi, ' st'], [/ avenue\b/gi, ' ave'], [/ boulevard\b/gi, ' blvd'],
  [/ place\b/gi, ' pl'],  [/ drive\b/gi, ' dr'],  [/ road\b/gi, ' rd']
];
const norm = (s='') => { let o = s.toLowerCase().replace(/\./g,'').replace(/\s+/g,' ').trim(); SYN.forEach(([re,rep])=>o=o.replace(re,rep)); return o; };
const keyFor = (street, city) => norm(`${street}, ${city}`);

export default function GroupedApartments() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/showmojo', { cache: 'no-store' });
        if (!res.ok) throw new Error('ShowMojo proxy failed');
        const { units } = await res.json();

        // Seed map with buildings
        const map = {};
        buildings.forEach(b => {
          map[keyFor(b.address.street, b.address.city)] = {
            name: b.name,
            hood: b.hood,
            street: `${b.address.street}, ${b.address.city}`,
            units: []
          };
        });

        // Drop available units into the right building bucket
        (units || []).forEach(u => {
          if ((u.status || 'available') !== 'available') return;
          const k = u.address?.key || keyFor(u.address?.street || '', u.address?.city || '');
          if (k && map[k]) map[k].units.push(u);
        });

        setData(map);
      } catch (e) {
        setErr(e.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="border border-slate-300 rounded p-4 bg-white">Loading listings…</div>;
  if (err) return <div className="border border-slate-300 rounded p-4 bg-white text-red-700">Error: {err}</div>;

  const sections = Object.entries(data);

  return (
    <div className="space-y-8">
      {sections.map(([k, { name, hood, street, units }]) => (
        <section key={k} className="border border-slate-300 rounded-xl overflow-hidden bg-white">
          <div className="p-4">
            <h2 className="text-xl font-bold">{name}</h2>
            <div className="text-slate-600">{hood} • {street}</div>
          </div>
          <div className="border-t border-slate-200" />
          <div className="p-4">
            {units.length ? (
              <div className="grid md:grid-cols-3 gap-4">
                {units.map((u) => {
                  const price = u.rent ? `$${Number(u.rent).toLocaleString()}/mo` : 'Call for pricing';
                  const avail = u.availableDate ? new Date(u.availableDate).toLocaleDateString() : 'TBD';
                  return (
                    <article key={u.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                      {u.photos?.[0] && <img src={u.photos[0]} alt={`Unit ${u.unitNumber ?? ''}`} className="w-full h-40 object-cover" />}
                      <div className="p-4">
                        <div className="font-semibold">Unit {u.unitNumber || '—'} • {u.beds ?? '—'} bd / {u.baths ?? '—'} ba</div>
                        <div className="text-slate-600 mt-1">{u.sqft ? `${u.sqft} sf • ` : ''}Available {avail}</div>
                        <div className="text-blue-700 font-bold mt-1">{price}</div>
                        <div className="flex gap-2 mt-3">
                          {u.scheduleUrl && (
                            <a className="bg-blue-700 text-white px-3 py-2 rounded font-semibold hover:bg-blue-800"
                               href={u.scheduleUrl} target="_blank" rel="noreferrer">
                              Schedule Showing
                            </a>
                          )}
                          <a className="border border-blue-700 text-blue-700 px-3 py-2 rounded font-semibold hover:bg-blue-50" href="/apply">
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-slate-600">No vacancies right now.</div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
