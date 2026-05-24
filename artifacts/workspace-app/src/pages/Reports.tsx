import { BarChart2, TrendingUp, Sparkles } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col relative">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-[#2e8f62]/20 rounded-lg">
            <BarChart2 className="w-6 h-6 text-[#40b580]" />
          </div>
          Reports
        </h1>
        <p className="text-white/50 mt-2">Analytics and insights for your team's performance.</p>
      </div>

      {/* Placeholder Content with Overlay */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/5 bg-[#0b0f19]">
        
        {/* Mock Charts UI (Background) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none p-8 flex flex-col gap-6">
          <div className="flex gap-6 h-1/3">
            <div className="flex-1 bg-[#1e0e3b] rounded-xl border border-white/10 p-6 flex flex-col justify-end gap-2">
              <div className="w-full h-[60%] bg-[#40b580] rounded-sm opacity-50" />
            </div>
            <div className="flex-1 bg-[#1e0e3b] rounded-xl border border-white/10 p-6 flex flex-col justify-end gap-2">
              <div className="w-full h-[80%] bg-[#4b96f3] rounded-sm opacity-50" />
            </div>
            <div className="flex-1 bg-[#1e0e3b] rounded-xl border border-white/10 p-6 flex flex-col justify-end gap-2">
              <div className="w-full h-[40%] bg-[#eb9656] rounded-sm opacity-50" />
            </div>
          </div>
          <div className="flex-1 bg-[#1e0e3b] rounded-xl border border-white/10 p-6 flex items-end gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 bg-[#7359dc] rounded-t-sm opacity-40" style={{ height: `${(i % 5 + 2) * 15}%` }} />
            ))}
          </div>
        </div>

        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 backdrop-blur-[8px] bg-[#13092a]/60 flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2e8f62]/20 to-[#40b580]/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#2e8f62]/20 to-[#40b580]/20 border border-[#40b580]/30 flex items-center justify-center backdrop-blur-md shadow-2xl relative">
              <TrendingUp className="w-10 h-10 text-[#40b580]" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Advanced Reports Coming Soon</h3>
          <p className="text-white/60 max-w-md text-lg leading-relaxed mb-8">
            Gain deep insights into your team's velocity, task completion rates, and bottlenecks with our upcoming analytics engine.
          </p>
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium">
            Currently in Development
          </div>
        </div>

      </div>
    </div>
  );
}
