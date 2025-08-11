'use client';
import { useState } from 'react';

const UNITS = [
  { id: 1, addr: '4818 N Damen Ave #2F', beds: 2, baths: 1, rent: 1750, hood: 'Lincoln Square', img: '/stock-chicago-apt-1.jpg' },
  { id: 2, addr: '1340 W Winnemac Ave #1R', beds: 1, baths: 1, rent: 1425, hood: 'Uptown/Andersonville', img: '/stock-chicago-apt-2.jpg' },
  { id: 3, addr: '1535 W Fargo Ave #3E', beds: 0, baths: 1, rent: 1095, hood: 'Rogers Park', img: '/stock-chicago-apt-3.jpg' },
];

export default function ApartmentsPage() {
  const [hood, setHood] = useState('');
  const [beds, setBeds] = useState('');
  const [price, setPrice] = useState('');

  const filtered = UNITS.filter(u => (
    (!beds || String(u.beds) === beds || (beds === '0' && u.beds === 0)) &&
    (!price || (price === '1500-' ? u.rent <= 1500 : price === '1501-1800' ? (u.rent > 1500 && u.rent <= 1800) : u.rent > 1800)) &&
    (!hood || u.hood === hood)
  ));

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Available Apartments</h1>
          <p className="text-gray-600">Search by neighborhood, beds, and price, then apply online.</p>
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border rounded-lg p-2" value={hood} onChange={(e) => setHood(e.target.value)}>
          <option value="">Neighborhood</option>
          <option>Lincoln Square</option>
          <option>Uptown/Andersonville</option>
          <option>Rogers Park</option>
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

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {filtered.map(u => (
          <div key={u.id} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">
            <img src={u.img} alt={u.addr} className="h-48 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{u.addr}</h3>
                <span className="font-semibold">${u.rent.toLocaleString()}/mo</span>
              </div>
              <p className="text-sm text-gray-600">
                {u.beds === 0 ? 'Studio' : `${u.beds} Bed`} • {u.baths} Bath • {u.hood}
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://winne.twa.rentmanager.com/applynow"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-semibold"
                >
                  Apply
                </a>
                <a
                  href="/contact"
                  className="border border-blue-700 text-blue-700 px-3 py-2 rounded-md text-sm font-semibold"
                >
                  Schedule a Tour
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
