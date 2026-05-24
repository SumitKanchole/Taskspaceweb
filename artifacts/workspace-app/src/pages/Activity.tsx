import { useQuery } from "@tanstack/react-query";
import { Loader2, Activity as ActivityIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const fetchActivity = async () => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/dashboard/activity`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch activity");
  return res.json();
};

export default function Activity() {
  const { data: activities, isLoading, isError } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: fetchActivity,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <ActivityIcon className="w-6 h-6 text-purple-400" />
          </div>
          Recent Activity
        </h1>
        <p className="text-white/50 mt-2">A timeline of recent events across your workspaces.</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-white/50 font-medium animate-pulse">Loading activity...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">Failed to load activity. Please try again later.</p>
        </div>
      ) : activities?.length === 0 ? (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl" />
            <ActivityIcon className="w-full h-full text-purple-500/40" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No recent activity</h3>
          <p className="text-white/40 text-sm max-w-[300px]">
            You're all caught up! New activities will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden relative">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5" />
          <div className="divide-y divide-white/5 relative">
            {activities.map((activity: any) => (
              <div key={activity.id} className="p-6 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-sm font-bold text-blue-400 ring-4 ring-[#1e0e3b] relative z-10 shadow-lg shadow-black/50">
                  {activity.user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-base font-medium text-white/80 leading-relaxed">
                    <span className="text-white font-bold">{activity.user?.name}</span>{" "}
                    {activity.action}{" "}
                    {activity.description && <span className="text-white">{activity.description}</span>}
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    {format(new Date(activity.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
