'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-hidden">
      
      {/* 0. NAVIGATION BAR (Fixed & Glassmorphic) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo & Community Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🦅</span>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none tracking-tight text-gray-900">
                THE ACHIEVERS <span className="text-orange-500">CLUB</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">
                Nashik Branch
              </span>
            </div>
          </Link>

          {/* Main Professional Links (Hidden on small screens for clean mobile UI) */}
          <div className="hidden lg:flex items-center gap-8 font-semibold text-sm text-gray-600">
            <Link href="/" className="text-orange-500">Home</Link>
            <Link href="#services" className="hover:text-orange-500 transition-colors">Services</Link>
            <Link href="#about" className="hover:text-orange-500 transition-colors">About Us</Link>
            <Link href="/directory" className="hover:text-orange-500 transition-colors">Community</Link>
            <Link href="#contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          </div>

          {/* Auth Actions (Login & Register) */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Register
            </Link>
          </div>

        </div>
      </nav>

      {/* 1. HERO SECTION (Personality & Floating Badges) */}
      {/* Notice the pt-32 to push content down below the fixed navbar */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Side: Text & CTA */}
        <div className="lg:w-1/2 z-10 text-center lg:text-left">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-bounce">
            👋 Welcome to the Nashik Branch
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Digital Empire
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0">
            A premium community for digital entrepreneurs. Zero upfront investment. 100% remote workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/register" className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-500/30">
              Start Application ↗
            </Link>
          </div>
        </div>

        {/* Right Side: Circular Image & Floating Animations */}
        <div className="lg:w-1/2 relative mt-16 lg:mt-0 flex justify-center">
          {/* Big Orange Circle Background */}
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-orange-400 to-orange-200 rounded-full -z-10 animate-pulse"></div>
          
          {/* Placeholder for Person Image (e.g., Founder / CEO) */}
          <div className="w-[350px] h-[450px] bg-gray-200 rounded-t-full border-4 border-white shadow-2xl overflow-hidden relative flex items-end justify-center">
             <span className="text-gray-400 mb-20 font-bold"><img src="/heroo.png" alt="Achiever" className="object-cover w-full h-full" /></span>
             {/* To add a real image later, use: <img src="/founder.png" alt="Founder" className="object-cover w-full h-full" /> */}
          </div>

          {/* Floating Badge 1 (Income) */}
          <div className="absolute top-10 -left-10 bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xl animate-[bounce_3s_infinite]">
            <p className="text-orange-500 font-black text-xl">₹20k-30k</p>
            <p className="text-xs text-gray-500 font-bold">Avg. Monthly Target</p>
          </div>

          {/* Floating Badge 2 (Members) */}
          <div className="absolute bottom-10 -right-4 bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xl animate-[bounce_4s_infinite]">
            <div className="flex text-yellow-400 text-lg">★★★★★</div>
            <p className="text-gray-900 font-black">500+ Achievers</p>
            <p className="text-xs text-gray-500">In Nashik Branch</p>
          </div>
        </div>
      </section>

      {/* 2. GLASSMORPHISM SECTION (Workflow & Achievements) */}
      <section id="services" className="bg-[#0f0f11] py-24 rounded-t-[3rem] relative overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/20 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-4">Our Core Services & Workflow</h2>
              <p className="text-gray-400">The proven training system behind our digital network.</p>
            </div>
          </div>

          {/* Glassmorphic Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Skill Acquisition</h3>
              <p className="text-gray-400 text-sm">
                Master Social Media Optimization (SMO) and digital networking through our daily live training sessions.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1-on-1 Mentorship</h3>
              <p className="text-gray-400 text-sm">
                Get paired with senior managers. We focus on personal development and team building to grow your downline.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Revenue Generation</h3>
              <p className="text-gray-400 text-sm">
                We heavily recognize success. Consistent effort leads to sustainable passive income and brand recognition.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
//<img src="/hero.png" alt="Achiever" className="object-cover w-full h-full" />