import './globals.css';

export const metadata = {
  title: 'Winnemac Properties',
  description: 'Chicago’s North Side Apartments & Property Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
            <a href="/" className="flex items-center gap-3">
              <img src="/winnemac-logo.png" alt="Winnemac Properties Logo" className="h-12"/>
            </a>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="/apartments" className="hover:text-blue-600">Apartments</a>
              <a href="/residents" className="hover:text-blue-600">Residents</a>
              <a href="/owners" className="hover:text-blue-600">Owners</a>
              <a href="/about" className="hover:text-blue-600">About</a>
              <a href="/contact" className="hover:text-blue-600">Contact</a>
            </nav>
            <div className="flex gap-3">
              <a href="https://winne.twa.rentmanager.com/applynow" target="_blank" rel="noreferrer" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800">Apply Now</a>
              <a href="https://winne.twa.rentmanager.com/" target="_blank" rel="noreferrer" className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50">Resident Portal</a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div>
              <img src="/winnemac-logo.png" alt="Winnemac Properties Logo" className="h-12 mb-4"/>
              <p className="text-sm">Your trusted property management company on Chicago’s North Side.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/apartments" className="hover:underline">Apartments</a></li>
                <li><a href="/residents" className="hover:underline">Residents</a></li>
                <li><a href="/owners" className="hover:underline">Owners</a></li>
                <li><a href="/about" className="hover:underline">About Us</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Residents</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://winne.twa.rentmanager.com/" target="_blank" rel="noreferrer" className="hover:underline">Resident Portal</a></li>
                <li><a href="https://www.winnemacproperties.com/resident-resources/forms-helpful-links/" target="_blank" rel="noreferrer" className="hover:underline">Forms & Links</a></li>
                <li><a href="https://www.winnemacproperties.com/resident-resources/referral-program/" target="_blank" rel="noreferrer" className="hover:underline">Referral Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm">1234 N Example St, Chicago, IL</p>
              <p className="text-sm">(312) 555-1234</p>
              <p className="text-sm">info@winnemacproperties.com</p>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} Winnemac Properties. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
