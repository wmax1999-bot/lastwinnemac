
export default function ResidentsPage() {
  const tiles = [
    { title: 'Resident Portal', href: 'https://winne.twa.rentmanager.com/', desc: 'Pay rent, view ledger, manage auto-pay.' },
    { title: 'Apply Now', href: 'https://winne.twa.rentmanager.com/applynow', desc: 'Start your application.' },
    { title: 'Forms & Helpful Links', href: 'https://www.winnemacproperties.com/resident-resources/forms-helpful-links/', desc: 'Common forms, city resources, utilities.' },
    { title: 'FAQs', href: 'https://www.winnemacproperties.com/resident-resources/faqs/', desc: 'Answers to common questions.' },
    { title: 'Referral Program', href: 'https://www.winnemacproperties.com/resident-resources/referral-program/', desc: 'Refer friends and earn rewards.' },
    { title: 'Resources', href: 'https://www.winnemacproperties.com/resident-resources/resources/', desc: 'Neighborhood info & more.' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Resident Resources</h1>
      <p className="text-gray-600">Everything in one place — no hunting around.</p>
      <div className="grid gap-6 md:grid-cols-3 mt-8">
        {tiles.map(t => (
          <a key={t.title} href={t.href} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{t.desc}</p>
            <span className="text-blue-700 font-semibold inline-block mt-3">Open →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
