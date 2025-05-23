export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DawnGuardGlobal Logo"
            className="h-12 w-12"
          />
          <span className="text-2xl font-bold">DawnGuardGlobal</span>
        </div>
        <div className="flex gap-6 text-lg">
          <a href="#home" className="hover:text-green-300">
            Home
          </a>
          <a href="#whitepaper" className="hover:text-green-300">
            Whitepaper
          </a>
          <a href="#about" className="hover:text-green-300">
            About
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Where Trust Meets Stability
        </h1>
      </div>
    </div>
  );
}
