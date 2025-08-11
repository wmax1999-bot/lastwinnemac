export default function ContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="text-gray-600">Have a question or want a management quote? Send a message and we’ll respond quickly.</p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <form className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input className="mt-1 w-full border rounded-lg p-2" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full border rounded-lg p-2" placeholder="you@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className="mt-1 w-full border rounded-lg p-2" placeholder="(312)" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea className="mt-1 w-full border rounded-lg p-2 h-28" placeholder="Tell us about your property or question"></textarea>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold">Send</button>
            <a href="https://global.appfolioim.com/session/new" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold">Owner Login →</a>
          </div>
        </form>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold">Office</h4>
          <p className="text-sm text-gray-700">1234 N Example St, Chicago, IL 60640</p>
          <p className="text-sm text-gray-700">(312) 555-1234</p>
          <p className="text-sm text-gray-700">info@winnemacproperties.com</p>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><a className="text-blue-700 hover:underline" href="https://winne.twa.rentmanager.com/applynow" target="_blank" rel="noreferrer">Apply Now</a></li>
              <li><a className="text-blue-700 hover:underline" href="https://winne.twa.rentmanager.com/" target="_blank" rel="noreferrer">Resident Portal</a></li>
              <li><a className="text-blue-700 hover:underline" href="https://www.winnemacproperties.com/contact/" target="_blank" rel="noreferrer">Current Contact Page</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
