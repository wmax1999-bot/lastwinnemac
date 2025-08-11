
export default function AboutPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">About Winnemac Properties</h1>
      <p className="text-gray-600 max-w-2xl">Chicago-rooted. Owner-operators with a hospitality mindset.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-2">Our Story</h3>
          <p className="text-sm text-gray-700">From leasing to construction, we bring hands-on expertise to the full lifecycle of multifamily management.</p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-xs text-gray-600">Maintenance</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-gray-600">Transparent fees</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold">Chicago</div>
              <div className="text-xs text-gray-600">North Side focus</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-2">Learn More</h3>
          <ul className="text-sm space-y-2">
            <li><a className="text-blue-700 hover:underline" href="https://www.winnemacproperties.com/about/property-management/" target="_blank" rel="noreferrer">Property Management →</a></li>
            <li><a className="text-blue-700 hover:underline" href="https://www.winnemacproperties.com/about/leasing-services/" target="_blank" rel="noreferrer">Leasing Services →</a></li>
            <li><a className="text-blue-700 hover:underline" href="https://www.winnemacproperties.com/about/brokerage-services/" target="_blank" rel="noreferrer">Brokerage Services →</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
