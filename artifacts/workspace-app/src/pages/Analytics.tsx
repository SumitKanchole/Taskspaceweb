import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Loader2, CheckCircle2, Clock, Hourglass, Users, BarChart3, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// ─── Colours ───────────────────────────────────────────────────────────────
const PRIORITY_COLORS: Record<string, string> = {
  high: "#f87171",
  medium: "#fb923c",
  low:  "#4ade80",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#1e0e3b",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "13px",
};

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent: string;
}) {
  return (
    <div className={`bg-[#1e0e3b] rounded-2xl p-6 flex items-center gap-5 border border-white/5 shadow-lg hover:shadow-[0_4px_24px_0_rgba(120,80,255,0.15)] hover:-translate-y-1 transition-all duration-300`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0`} style={{ background: `${accent}22` }}>
        <Icon className="w-7 h-7" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
        {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Circular Progress ─────────────────────────────────────────────────────
function CircleProgress({ rate }: { rate: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = circ * (rate / 100);
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke="url(#completionGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <defs>
          <linearGradient id="completionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white">{Math.round(rate)}%</span>
        <span className="text-xs text-white/40 font-medium">Done</span>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Analytics() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = parseInt(params.workspaceId || "0", 10);

  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ["workspaceAnalytics", workspaceId],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/workspaces/${workspaceId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: !!workspaceId,
  });

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          <p className="text-white/50 font-medium animate-pulse">Loading analytics…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError || !analytics) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BarChart3 className="w-16 h-16 text-white/20" />
        <h2 className="text-xl font-bold text-white">No analytics data</h2>
        <p className="text-white/40 text-sm">Could not load workspace analytics.</p>
        <Link href={`/workspaces/${workspaceId}`} className="text-purple-400 hover:text-purple-300 underline text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </Link>
      </div>
    );
  }

  // ── Data transformation ──
  const pieData = (analytics.tasksByPriority ?? []).map((p: { label: string; count: number }) => ({
    name: p.label.charAt(0).toUpperCase() + p.label.slice(1),
    value: p.count,
    color: PRIORITY_COLORS[p.label] ?? "#94a3b8",
  }));

  const barData = (analytics.tasksByMember ?? []).map((m: { name: string; totalTasks: number; completedTasks: number }) => ({
    name: m.name?.split(" ")[0] ?? "User",
    Assigned: m.totalTasks ?? 0,
    Completed: m.completedTasks ?? 0,
  }));

  const statusData = [
    { name: "Completed", value: analytics.completedTasks, color: "#4ade80" },
    { name: "In Progress", value: analytics.inProgressTasks, color: "#fb923c" },
    { name: "Pending", value: analytics.pendingTasks, color: "#94a3b8" },
  ].filter(d => d.value > 0);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href={`/workspaces/${workspaceId}`} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-3 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Workspace Analytics</h1>
          <p className="text-white/40 mt-1 text-sm">Productivity overview and task distribution</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1e0e3b] border border-white/5 rounded-2xl px-5 py-3 shadow-lg">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-semibold text-white/70">Live data</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BarChart3}    label="Total Tasks"   value={analytics.totalTasks}                              sub="across workspace"   accent="#a855f7" />
        <StatCard icon={CheckCircle2} label="Completed"     value={analytics.completedTasks}                          sub={`of ${analytics.totalTasks}`} accent="#4ade80" />
        <StatCard icon={Hourglass}    label="In Progress"   value={analytics.inProgressTasks}                         sub="active now"         accent="#fb923c" />
        <StatCard icon={Users}        label="Members"       value={analytics.memberCount}                             sub="in workspace"       accent="#38bdf8" />
      </div>

      {/* Completion Rate + Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Completion Rate */}
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 p-6 shadow-lg">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-6">Completion Rate</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <CircleProgress rate={analytics.completionRate} />
            <div className="flex flex-col gap-4 flex-1">
              {[
                { label: "Completed", count: analytics.completedTasks, color: "#4ade80" },
                { label: "In Progress", count: analytics.inProgressTasks, color: "#fb923c" },
                { label: "Pending", count: analytics.pendingTasks, color: "#94a3b8" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm text-white/60">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Status Pie */}
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 p-6 shadow-lg">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-6">Status Distribution</h2>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-white/30 text-sm">No tasks yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(v) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-6">Tasks by Priority</h2>
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-white/30 text-sm">No tasks yet</div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry: { color: string }, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-row md:flex-col gap-4 md:gap-5">
              {pieData.map((p: { name: string; color: string; value: number }) => (
                <div key={p.name} className="flex items-center gap-3 min-w-[120px]">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                  <div>
                    <p className="text-xs text-white/40 capitalize">{p.name}</p>
                    <p className="text-lg font-black text-white leading-tight">{p.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Member Performance Bar Chart */}
      <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-6">Member Performance</h2>
        {barData.length === 0 ? (
          <div className="flex items-center justify-center h-[240px] text-white/30 text-sm">No member data</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                axisLine={false} tickLine={false} allowDecimals={false}
              />
              <RechartsTooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "rgba(255,255,255,0.04)", radius: 8 }}
              />
              <Legend
                iconType="circle" iconSize={10}
                formatter={(v) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{v}</span>}
              />
              <Bar dataKey="Assigned"  fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Completed" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
