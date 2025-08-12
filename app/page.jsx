export default function Page() {
  const featured = [
    { addr: "1154 W Lunt Ave", specs: "1 Bed • 1 Bath • $1,295/mo", img: "/stock-chicago-apt-1.jpg" },
    { addr: "1340 W Winnemac Ave", specs: "1 Bed • 1 Bath • $1,425/mo", img: "/stock-chicago-apt-2.jpg" },
    { addr: "1535 W Fargo Ave", specs: "Studio • 1 Bath • $1,095/mo", img: "/stock-chicago-apt-3.jpg" },
  ];
  return (
    <>
      <section className="relative bg-gray-100">
        <div className="absolute inset-0">
          <img src="/stock-chicago-hero.jpg" alt="Chicago Skyline" className="w-full h-full object-cover opacity-35"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <img src="/winnemac-logo.png" alt="Winnemac Properties Logo" className="h-16 md:h-20 mx-auto mb-6"/>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Chicago’s North Side Apartments & Property Management</h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">Rentals you’ll love. Management you can count on.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/apartments" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800">Find an Apartment</a>
            <a href="/owners" className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">Get Management Quote</a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Featured Apartments</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((c) => (
            <div key={c.addr} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">
              <img src={c.img} alt={c.addr} className="h-48 w-full object-cover"/>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{c.addr}</h3>
                <p className="text-sm text-gray-600">{c.specs}</p>
                <a href="/apartments" className="mt-4 inline-block text-blue-700 font-semibold">View Details →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Services for Property Owners</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Property Management', desc: 'Full-service management, transparent fees, 24/7 maintenance.', href: '/owners', img: '/stock-chicago-service-1.jpg' },
              { title: 'Leasing Services', desc: 'Pro marketing, tours, screening, lease-up with speed.', href: '/about', img: '/stock-chicago-service-2.jpg' },
              { title: 'Brokerage Services', desc: 'Buy, sell, and advise with North Side expertise.', href: '/about', img: '/stock-chicago-service-3.jpg' },
            ].map((s) => (
              <a key={s.title} href={s.href} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden block">
                <img src={s.img} alt={s.title} className="h-40 w-full object-cover"/>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                  <span className="mt-4 inline-block text-blue-700 font-semibold">Learn More →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white py-12 text-center">
        <h2 className="text-2xl font-bold">Looking for your next apartment?</h2>
        <p className="mt-2">Browse our current listings and apply online today.</p>
        <a href="/apartments" className="mt-4 inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">View Apartments</a>
      </section>
    </>
  );
}
