
export default function OwnersPage() {
  const steps = [
    { title: '1. Discovery Call', desc: 'We learn your goals, property details, and challenges.' },
    { title: '2. Proposal & Pricing', desc: 'Transparent fee structure with service menu.' },
    { title: '3. Onboarding', desc: 'Transfer docs, set up accounting, resident messaging.' },
    { title: '4. Optimization', desc: 'Leasing velocity, maintenance, and reporting cadence.' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Property Management for Owners</h1>
      <p className="text-gray-600 max-w-2xl">North Side specialists managing apartments with care and efficiency. Renovation oversight, leasing, accounting, and 24/7 maintenance under one roof.</p>

      <div className="grid md:grid-cols-4 gap-6 mt-8">
        {steps.map(s => (
          <div key={s.title} className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
        <h4 className="font-semibold">What’s included</h4>
        <ul className="grid md:grid-cols-2 gap-x-6 list-disc list-inside text-sm text-gray-700 mt-2">
          <li>Leasing & renewals</li>
          <li>Maintenance coordination & capital planning</li>
          <li>Accounting, owner statements, 1099s</li>
          <li>Resident communications & compliance</li>
          <li>Unit turns and renovations</li>
          <li>Marketing & lead management</li>
        </ul>
      </div>

      <div className="mt-8 flex gap-4">
        <a href="/contact" className="bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold">Request a proposal</a>
        <a href="https://www.winnemacproperties.com/about/property-management/" target="_blank" rel="noreferrer" className="border border-blue-700 text-blue-700 px-5 py-3 rounded-lg font-semibold">Learn more</a>
      </div>
    </section>
  );
}
