import { ReactNode } from "react";
import { Link } from "wouter";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0416] text-white overflow-hidden font-sans">
      {/* Left side: Graphic/Branding */}
      <div className="hidden md:flex flex-1 relative flex-col justify-between p-12 overflow-hidden bg-[#13092a]">
        {/* Deep Space Background Image (Placeholder) */}
        <div
          className="absolute inset-0 z-0 opacity-60 mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1000&q=80')" }}
        />

        {/* Gradient overlays for the space feel */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0b0416]/90 via-[#2e1065]/40 to-transparent" />
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-cyan-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
            {/* Hourglass/logo shape from image */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b0416" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 22h14" />
              <path d="M5 2h14" />
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-wide flex items-center gap-1">Task<span className="text-xs font-medium tracking-[0.2em] text-white/50 mt-1">space</span></span>
        </div>

        <div className="z-10 max-w-lg mb-12">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
            SIGN IN TO YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">ADVENTURE!</span>
          </h1>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-20 bg-[#0b0416]">
        {/* Subtle glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-lg max-h-lg bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[400px] space-y-8 relative z-10">
          <div className="space-y-1 text-left">
            <h2 className="text-5xl font-black tracking-tight text-white mb-6">{title}</h2>
            <p className="text-sm font-bold text-white mb-4">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
