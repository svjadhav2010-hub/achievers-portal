'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-hidden">
      
      {/* --- ALL CUSTOM ANIMATIONS --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes workflowPath {
          0% { left: 16%; top: 5px; opacity: 0; }
          10% { opacity: 1; }
          40% { left: 45%; top: 5px; opacity: 1; }
          60% { left: 55%; top: 5px; opacity: 1; }
          90% { left: 84%; top: 5px; opacity: 1; }
          100% { left: 84%; top: 5px; opacity: 0; }
        }
        @keyframes freshBounce {
          0%, 100% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          50% { transform: translateY(-16px); box-shadow: 0 35px 60px -15px rgba(249, 115, 22, 0.15); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* 0. NAVIGATION BAR (Fixed & Glassmorphic) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img 
              src="/icon.png" 
              alt="Achievers Club" 
              className="h-12 w-auto object-contain scale-[1.7] origin-left group-hover:scale-[1.8] transition-transform duration-300" 
            />
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-semibold text-sm text-gray-600">
            <Link href="/" className="text-orange-500">Home</Link>
            <Link href="#services" className="hover:text-orange-500 transition-colors">Services</Link>
            <Link href="#benefits" className="hover:text-orange-500 transition-colors">Why Join</Link>
            <Link href="#community" className="hover:text-orange-500 transition-colors">Community</Link>
            <Link href="#contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors">Login</Link>
            <Link href="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all">Register</Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 z-10 text-center lg:text-left">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-bounce">
            👋 Welcome to the Nashik Branch
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Digital Empire</span>
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
        <div className="lg:w-1/2 relative mt-16 lg:mt-0 flex justify-center">
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-orange-400 to-orange-200 rounded-full -z-10 animate-pulse"></div>
          <div className="w-[350px] h-[450px] bg-gray-200 rounded-t-full border-4 border-white shadow-2xl overflow-hidden relative flex items-end justify-center">
             <span className="text-gray-400 mb-20 font-bold"><img src="/heroo.png" alt="Achiever" className="object-cover w-full h-full" /></span>
          </div>
          <div className="absolute top-10 -left-10 bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xl animate-[bounce_3s_infinite]">
            <p className="text-orange-500 font-black text-xl">₹20k-30k</p>
            <p className="text-xs text-gray-500 font-bold">Avg. Monthly Target</p>
          </div>
          <div className="absolute bottom-10 -right-4 bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xl animate-[bounce_4s_infinite]">
            <div className="flex text-yellow-400 text-lg">★★★★★</div>
            <p className="text-gray-900 font-black">500+ Achievers</p>
            <p className="text-xs text-gray-500">In Nashik Branch</p>
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICES & WORKFLOW (Interactive Timeline) */}
      <section id="services" className="bg-[#050505] py-28 relative overflow-hidden rounded-t-[3rem] border-t border-slate-800">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3">The Nashik Blueprint</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              A Structured Path <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">To Passive Revenue.</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-slate-700 -translate-y-1/2 z-0 hidden md:block"></div>
            <div className="absolute w-2 h-2 bg-orange-500 rounded-full blur-sm -translate-y-1/2 animate-[workflowPath_8s_ease-in-out_infinite] z-0 hidden md:block" style={{ top: '50%' }}></div>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              <div className="group relative">
                <div className="w-6 h-6 bg-black border-4 border-orange-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:bg-orange-500 hidden md:block" style={{ top: '-11%' }}></div>
                <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl p-8 rounded-3xl hover:bg-black/80 hover:border-orange-500 transition-all duration-500 shadow-xl shadow-black group-hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] mt-12 md:mt-0">
                  <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-orange-500 group-hover:text-black transition-all">📈</div>
                  <h4 className="text-xl font-bold text-white mb-3">01. Skill Acquisition</h4>
                  <p className="text-slate-400 text-sm">Master Social Media Optimization (SMO) and networking through step-by-step daily live training modules.</p>
                </div>
              </div>
              <div className="group relative">
                <div className="w-6 h-6 bg-black border-4 border-red-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:bg-red-500 hidden md:block" style={{ top: '-11%' }}></div>
                <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl p-8 rounded-3xl hover:bg-black/80 hover:border-red-500 transition-all duration-500 shadow-xl shadow-black group-hover:shadow-[0_0_50px_rgba(239,68,68,0.15)] mt-12 md:mt-0">
                  <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-red-500 group-hover:text-black transition-all">🤝</div>
                  <h4 className="text-xl font-bold text-white mb-3">02. Elite Mentorship</h4>
                  <p className="text-slate-400 text-sm">Get paired directly with senior managers focusing on personal development and downline team building.</p>
                </div>
              </div>
              <div className="group relative">
                <div className="w-6 h-6 bg-black border-4 border-orange-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:bg-orange-500 hidden md:block" style={{ top: '-11%' }}></div>
                <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl p-8 rounded-3xl hover:bg-black/80 hover:border-orange-500 transition-all duration-500 shadow-xl shadow-black group-hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] mt-12 md:mt-0">
                  <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-orange-500 group-hover:text-black transition-all">🏆</div>
                  <h4 className="text-xl font-bold text-white mb-3">03. Revenue Generation</h4>
                  <p className="text-slate-400 text-sm">Structured effort leads to sustainable passive income and elite brand recognition in the digital network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE BENEFITS (Creative Bento Box) */}
      <section id="benefits" className="bg-[#fafafa] py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 px-4 py-2 rounded-full text-xs font-bold text-orange-600 uppercase tracking-widest mb-6 shadow-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> Why Join The Club
            </h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Hustle.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col justify-center">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-orange-50 to-red-50 rounded-full group-hover:scale-110 transition-transform duration-700 ease-in-out -z-10"></div>
              <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🏆</div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Start Young, <br/> Retire Young.</h3>
              <p className="text-gray-500 text-lg max-w-md">Stop trading time for money. Build digital assets and automated networks that generate passive income, giving you financial freedom decades early.</p>
            </div>
            <div className="md:col-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-10 shadow-xl text-white relative overflow-hidden group flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold mb-4 leading-tight">Zero <br/> Upfront <br/> Costs.</h3>
                <p className="text-white/80 text-md">We believe in building skillsets, not selling starter kits. Your capital stays in your pocket.</p>
              </div>
              <div className="relative z-10 flex justify-end">
                <div className="text-7xl drop-shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">💸</div>
              </div>
            </div>
            <div className="md:col-span-3 bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:shadow-orange-500/20 transition-all duration-500 flex flex-col md:flex-row items-center justify-between">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-orange-600/20 blur-[100px] rounded-full group-hover:bg-orange-500/30 transition-colors duration-700"></div>
              <div className="relative z-10 max-w-xl text-center md:text-left mb-8 md:mb-0">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto md:mx-0 shadow-lg border border-white/5 group-hover:-translate-y-2 transition-transform duration-300">🌍</div>
                <h3 className="text-3xl font-extrabold text-white mb-4">100% Remote Workflow.</h3>
                <p className="text-gray-400 text-lg">Your office is wherever your laptop is. Our community operates through a streamlined digital ecosystem, allowing you to scale globally.</p>
              </div>
              <div className="relative z-10">
                <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 font-extrabold text-lg px-8 py-5 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105">
                  Begin Your Journey <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. SOCIAL PROOF / TESTIMONIALS (Video + Google Reviews) --- */}
      <section id="community" className="bg-[#050505] py-32 relative overflow-hidden rounded-t-[3rem] border-t border-slate-800 mt-12">
        
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-xs font-bold text-orange-500 uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> The Wall of Love
            </h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Verified by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Google.</span> Loved by Members.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* 🔴 CARD 1: Standard Text Review */}
            <div className="space-y-8">
              <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-8 rounded-[2rem] animate-[freshBounce_4s_ease-in-out_infinite]">
                <div className="flex gap-1 text-orange-500 text-sm mb-6">★★★★★</div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">"I was skeptical about the 'zero upfront investment' claim, but they actually mean it. The mentorship I received gave me more practical business knowledge than my entire college degree."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">R</div>
                  <div>
                    <h4 className="text-white font-bold">Rahul D.</h4>
                    <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mt-1">Consistently Hitting Targets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔴 CARD 2: VIDEO TESTIMONIAL (Vertical Layout) */}
            <div className="space-y-8 md:mt-16">
              <div className="relative bg-black border border-white/10 rounded-[2rem] overflow-hidden group animate-[freshBounce_5s_ease-in-out_infinite] aspect-[9/16] shadow-2xl">
                
                {/* Placeholder Image for the Video Thumbnail */}
                <img src="/placeholder-2.png" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Glowing Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center pl-2 cursor-pointer group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>

                {/* Video Info overlay at bottom */}
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full animate-pulse">Live Story</span>
                  </div>
                  <h4 className="text-white font-bold text-lg">Sneha's Journey</h4>
                  <p className="text-slate-300 text-sm">"How I scaled to ₹30k/month remotely."</p>
                </div>
              </div>
            </div>

            {/* 🔴 CARD 3: LIVE GOOGLE REVIEW WIDGET PLACEHOLDER */}
            <div className="space-y-8 md:mt-8">
              <div className="bg-white p-8 rounded-[2rem] animate-[freshBounce_4.5s_ease-in-out_infinite] shadow-2xl shadow-white/5 border border-gray-100">
                
                {/* Google Branding Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    {/* Official Google G Logo SVG */}
                    <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span className="font-bold text-gray-900">Google Reviews</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900">4.9 / 5.0</div>
                  </div>
                </div>

                <div className="flex gap-1 text-orange-500 text-sm mb-4">★★★★★</div>
                <p className="text-gray-600 text-md leading-relaxed mb-6 italic">
                  "Absolutely brilliant platform. The community in Nashik is incredibly supportive. Highly recommend to anyone looking to build a digital career."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">A</div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-sm">Aditya K.</h4>
                    <p className="text-xs text-gray-400">Local Guide · 12 Reviews</p>
                  </div>
                </div>

                {/* Developer Note: When you get an Elfsight or Trustmary widget, you will delete the code inside this Card 3 and paste their <script> tag here instead! */}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FINAL CTA & FOOTER */}
      <section id="contact" className="bg-[#050505] pt-20 pb-10 relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-orange-500/20 relative overflow-hidden mb-20 group">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight relative z-10">
              Ready to build your <br className="hidden md:block" /> digital empire?
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
              Stop waiting for the perfect moment. The Nashik Branch is actively onboarding new digital entrepreneurs today. Zero upfront costs, 100% remote.
            </p>
            <div className="relative z-10">
              <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 font-extrabold text-xl px-10 py-5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105">
                Start Your Application <span>🚀</span>
              </Link>
            </div>
          </div>

          <footer className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-2xl">🦅</span>
                <span className="font-black text-xl tracking-tight text-white">
                  THE ACHIEVERS <span className="text-orange-500">CLUB</span>
                </span>
              </div>
              <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">Start Young Retire Young</p>
            </div>
            <div className="flex gap-6 text-sm font-medium text-gray-400">
              <Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">Contact Support</Link>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              © {new Date().getFullYear()} The Achievers Club. Nashik Branch.
            </div>
          </footer>
        </div>
      </section>

    </div>
  );
}