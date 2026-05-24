import { Calendar as CalendarIcon, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col relative">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-[#d97c36]/20 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-[#eb9656]" />
          </div>
          Calendar
        </h1>
        <p className="text-white/50 mt-2">Manage your schedule and task deadlines.</p>
      </div>

      {/* Placeholder Content with Overlay */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/5 bg-[#0b0f19]">
        
        {/* Mock Calendar UI (Background) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">October 2026</h2>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><ChevronLeft className="w-4 h-4 text-white" /></div>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><ChevronRight className="w-4 h-4 text-white" /></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 text-center text-sm font-medium text-white/40 mb-4">
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border border-white/10 bg-[#1e0e3b] flex p-2">
                <span className="text-white/30 text-xs">{i % 31 + 1}</span>
                {i === 12 && <div className="mt-4 w-full h-2 bg-blue-500 rounded-full" />}
                {i === 18 && <div className="mt-4 w-full h-2 bg-purple-500 rounded-full" />}
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 backdrop-blur-[8px] bg-[#13092a]/60 flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d97c36]/20 to-[#eb9656]/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#d97c36]/20 to-[#eb9656]/20 border border-[#eb9656]/30 flex items-center justify-center backdrop-blur-md shadow-2xl relative">
              <Sparkles className="w-10 h-10 text-[#eb9656]" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Calendar is Coming Soon</h3>
          <p className="text-white/60 max-w-md text-lg leading-relaxed mb-8">
            We're building a powerful new way to visualize your task deadlines, sprint schedules, and team availability all in one place.
          </p>
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium">
            Currently in Development
          </div>
        </div>

      </div>
    </div>
  );
}
