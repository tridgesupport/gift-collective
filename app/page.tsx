import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-between py-12 px-6 lg:px-20 bg-cream text-warm-dark">

      <header className="w-full flex justify-center mb-12">
        <h1 className="text-sm md:text-base font-medium tracking-[0.4em] text-warm-dark/80 uppercase">
          The Gift Collective
        </h1>
      </header>

      <div className="flex flex-col items-center max-w-4xl w-full text-center">
        <div className="w-full max-w-lg aspect-square mb-12 relative group">
          <div className="absolute inset-0 bg-warm-dark/5 rounded-xl blur-3xl group-hover:bg-gold/5 transition-all duration-700"></div>
          <img
            src="/gift.png"
            alt="Luxury Gift Box"
            className="relative w-full h-full object-cover rounded-xl shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        <div className="mb-10 px-4">
          <h2 className="font-cormorant text-2xl md:text-3xl lg:text-4xl leading-tight text-warm-dark max-w-3xl mx-auto uppercase tracking-tight">
            The painstakingly curated luxury inside... <br className="hidden md:block" /> now open for discovery.
          </h2>
        </div>

        <div className="w-full max-w-md">
          <Link
            href="/curated-collections/"
            className="block w-full bg-warm-dark text-white hover:bg-gold hover:text-white px-12 py-5 rounded-lg font-bold text-xs tracking-[0.4em] uppercase transition-all duration-300 shadow-2xl text-center"
          >
            Enter the Collective
          </Link>
        </div>
      </div>

      <footer className="w-full flex flex-col items-center gap-4 mt-16">
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-warm-dark/40">
          <a href="#" className="hover:text-warm-dark transition-colors">Privacy</a>
          <a href="#" className="hover:text-warm-dark transition-colors">Terms</a>
          <a href="#" className="hover:text-warm-dark transition-colors">Membership</a>
        </div>
      </footer>
    </main>
  );
}
