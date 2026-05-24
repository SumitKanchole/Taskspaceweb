import { useAuth } from "@/context/AuthContext";
import { useListWorkspaces, useGetDashboardSummary, useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Layout, Shield, Users, Briefcase, BarChart3, ArrowRight, Loader2, CheckSquare, Hourglass, Folder, ChevronRight, Plus, Activity } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { CreateWorkspaceDialog } from "@/components/workspaces/CreateWorkspaceDialog";

function AdminDashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const isLoading = summaryLoading || statsLoading;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <Badge className="bg-violet-600 hover:bg-violet-600 text-white gap-1 shrink-0">
              <Shield className="h-3 w-3" /> Admin
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Here is what's happening across the platform today.</p>
        </div>
        <Button asChild variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-500/10">
          <Link href="/admin">
            <Shield className="mr-2 h-4 w-4" />
            Manage Users
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Platform stats */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platform Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-[2rem] hover:shadow-[0_8px_32px_0_rgba(120,119,198,0.2)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-violet-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers ?? "—"}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats?.activeUsers ?? 0} active</p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-[2rem] hover:shadow-[0_8px_32px_0_rgba(120,119,198,0.2)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Workspaces</CardTitle>
                  <Briefcase className="h-4 w-4 text-violet-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalWorkspaces ?? "—"}</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-[2rem] hover:shadow-[0_8px_32px_0_rgba(120,119,198,0.2)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                  <BarChart3 className="h-4 w-4 text-violet-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalTasks ?? "—"}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats?.completedTasks ?? 0} completed</p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-[2rem] hover:shadow-[0_8px_32px_0_rgba(120,119,198,0.2)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">My Workspaces</CardTitle>
                  <Layout className="h-4 w-4 text-violet-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.totalWorkspaces ?? "—"}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Role breakdown */}
          {stats && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">User Roles</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stats.usersByRole.map((r: { label: string; count: number }) => (
                  <Card key={r.label} className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-[2rem] hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground capitalize">{r.label}s</CardTitle>
                      {r.label === "admin" ? (
                        <Shield className="h-4 w-4 text-violet-400" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-400" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{r.count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent activity */}
          <ActivityFeed activities={summary?.recentActivity ?? []} />
        </>
      )}
    </div>
  );
}

function MemberDashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Good morning, {user?.name} <span>👋</span>
          </h1>
          <p className="text-white/50 mt-2">Here's what's happening with your workspaces today.</p>
        </div>
        <Button asChild variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 rounded-full px-6">
          <Link href="/workspaces">
            View All Workspaces <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading || !summary ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-white/50 font-medium animate-pulse">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: My Tasks */}
            <div className="bg-[#1e0e3b] border-0 border-b-[3px] border-b-[#5c42bd] rounded-2xl p-6 flex flex-row items-center gap-5 shadow-lg shadow-black/20">
              <div className="w-14 h-14 rounded-xl bg-[#5c42bd]/20 flex items-center justify-center shrink-0">
                <CheckSquare className="w-7 h-7 text-[#7359dc]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50">My Tasks</h3>
                <p className="text-3xl font-bold text-white my-0.5">{summary.myTasks}</p>
                <p className="text-xs text-white/40">Assigned to me</p>
              </div>
            </div>

            {/* Card 2: Pending */}
            <div className="bg-[#1e0e3b] border-0 border-b-[3px] border-b-[#d97c36] rounded-2xl p-6 flex flex-row items-center gap-5 shadow-lg shadow-black/20">
              <div className="w-14 h-14 rounded-xl bg-[#d97c36]/20 flex items-center justify-center shrink-0">
                <Hourglass className="w-7 h-7 text-[#eb9656]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50">Pending</h3>
                <p className="text-3xl font-bold text-white my-0.5">{summary.myPendingTasks}</p>
                <p className="text-xs text-white/40">To be done</p>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-[#1e0e3b] border-0 border-b-[3px] border-b-[#2e8f62] rounded-2xl p-6 flex flex-row items-center gap-5 shadow-lg shadow-black/20">
              <div className="w-14 h-14 rounded-xl bg-[#2e8f62]/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-[#40b580]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50">Completed</h3>
                <p className="text-3xl font-bold text-white my-0.5">{summary.myCompletedTasks}</p>
                <p className="text-xs text-white/40">Tasks done</p>
              </div>
            </div>

            {/* Card 4: Workspaces */}
            <div className="bg-[#1e0e3b] border-0 border-b-[3px] border-b-[#2d7ad8] rounded-2xl p-6 flex flex-row items-center gap-5 shadow-lg shadow-black/20">
              <div className="w-14 h-14 rounded-xl bg-[#2d7ad8]/20 flex items-center justify-center shrink-0">
                <Folder className="w-7 h-7 text-[#4b96f3]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50">Workspaces</h3>
                <p className="text-3xl font-bold text-white my-0.5">{summary.totalWorkspaces}</p>
                <p className="text-xs text-white/40">Joined</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ActivityFeed activities={summary.recentActivity} />
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden h-full flex flex-col min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#00e5ff]/10">
                      <Users className="w-5 h-5 text-[#00e5ff]" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Your Workspaces</h2>
                  </div>
                  <CreateWorkspaceDialog>
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-full text-xs h-8">
                      <Plus className="w-3 h-3 mr-1" /> New Workspace
                    </Button>
                  </CreateWorkspaceDialog>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 bg-[#00e5ff]/5 rounded-full blur-xl" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-white/20" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 12 12 17 22 12" />
                      <polyline points="2 17 12 22 22 17" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No workspaces yet</h3>
                  <p className="text-white/40 text-sm mb-6 max-w-[250px]">Create your first workspace to get started</p>
                  <CreateWorkspaceDialog>
                    <Button className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:opacity-90 text-white border-0 shadow-lg shadow-blue-900/50 rounded-xl px-6">
                      Create Workspace
                    </Button>
                  </CreateWorkspaceDialog>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden h-full flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          </div>
          <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/5 text-xs h-8">
            View All
          </Button>
        </div>
        <div className="flex-1 flex flex-col">
          {activities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-xl" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-white/20" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8v13H3V8" />
                  <path d="M1 3h22v5H1z" />
                  <path d="M10 12h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No recent activity</h3>
              <p className="text-white/40 text-sm max-w-[250px]">You're all caught up! New activities will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-sm font-bold text-blue-400">
                    {activity.user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80">
                      <span className="text-white font-bold">{activity.user?.name}</span>{" "}
                      {activity.action}{" "}
                      {activity.description && <span className="text-white">{activity.description}</span>}
                    </p>
                    <p className="text-xs text-white/40 mt-1.5">
                      {format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <MemberDashboard />;
}
