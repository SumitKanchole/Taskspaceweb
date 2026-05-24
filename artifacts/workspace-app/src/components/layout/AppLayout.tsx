import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, Bell, Settings, User, Shield, LogOut, ChevronRight, CheckSquare, ListTodo, Calendar, BarChart2, Users, Activity, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLogout } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateWorkspaceDialog } from "@/components/workspaces/CreateWorkspaceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout: contextLogout } = useAuth();
  const [location, setLocation] = useLocation();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        contextLogout();
        toast.success("Logged out successfully");
      },
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#0b0416] text-foreground relative overflow-hidden">
        
        <Sidebar className="border-r-0 bg-[#0b0416] z-40 w-[260px]">
          <SidebarHeader className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow-lg shadow-white/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b0416" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 22h14" />
                  <path d="M5 2h14" />
                  <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                  <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-wide flex items-center gap-1 text-white">
                Task<span className="text-xs font-medium tracking-[0.2em] text-white/50 mt-1">space</span>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 gap-6">
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/dashboard"} className="h-11 rounded-xl data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500 data-[active=true]:to-pink-500 data-[active=true]:text-white text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium tracking-wide px-4">
                      <Link href="/dashboard">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-semibold">Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-white/40 font-bold tracking-wider uppercase text-[10px] mb-2 px-2">Work</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/tasks/me"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/tasks/me">
                        <CheckSquare className="w-4 h-4" />
                        <span>My Tasks</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/tasks"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/tasks">
                        <ListTodo className="w-4 h-4" />
                        <span>All Tasks</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/calendar"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/calendar">
                        <Calendar className="w-4 h-4" />
                        <span>Calendar</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/reports"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/reports">
                        <BarChart2 className="w-4 h-4" />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-white/40 font-bold tracking-wider uppercase text-[10px] mb-2 px-2">Collaboration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location.startsWith("/workspaces")} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/workspaces">
                        <Users className="w-4 h-4" />
                        <span>Workspaces</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/team"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/team">
                        <User className="w-4 h-4" />
                        <span>Team Members</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/activity"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/activity">
                        <Activity className="w-4 h-4" />
                        <span>Activity</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-white/40 font-bold tracking-wider uppercase text-[10px] mb-2 px-2">Other</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/notifications"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all flex justify-between items-center font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/notifications">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          <span>Notifications</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild isActive={location === "/settings"} className="h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium px-4 data-[active=true]:bg-white/10 data-[active=true]:text-white">
                      <Link href="/settings">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

          </SidebarContent>
          <SidebarFooter className="p-6 mt-auto">
            <div className="bg-[#1a0833] rounded-2xl p-4 flex items-center justify-between border border-white/5 shadow-lg shadow-purple-900/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-black shrink-0 shadow-inner">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{user?.name}</span>
                  <span className="text-xs text-white/50">{user?.role === "admin" ? "Admin" : "Member"}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/40 hover:text-white hover:bg-white/10 shrink-0 h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-[#13092a] border-l border-white/5 overflow-hidden">
          
          {/* Top Navbar */}
          <header className="h-20 shrink-0 flex items-center justify-between px-8 z-50">
            <div className="flex items-center flex-1">
              <SidebarTrigger className="text-white/50 hover:text-white md:hidden mr-4" />
            </div>
            
            <div className="flex items-center gap-4">
              <form 
                className="relative hidden md:block w-64"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const q = formData.get("search");
                  if (q) setLocation(`/search?q=${encodeURIComponent(q.toString())}`);
                }}
              >
                <Input 
                  name="search"
                  placeholder="Search anything... (Press Enter)" 
                  className="bg-[#1e0e3b] border-none text-white placeholder:text-white/40 pl-4 pr-10 h-11 rounded-full focus-visible:ring-1 focus-visible:ring-purple-500 shadow-inner"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </form>
              
              <CreateWorkspaceDialog>
                <button className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30">
                  <Plus className="w-5 h-5" />
                </button>
              </CreateWorkspaceDialog>
              
              <button 
                onClick={() => setLocation("/notifications")}
                className="w-11 h-11 rounded-full bg-[#1e0e3b] flex items-center justify-center text-white/60 hover:text-white relative transition-colors border border-white/5 shadow-inner"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full border border-[#1e0e3b]"></span>
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold cursor-pointer border-2 border-[#1e0e3b] hover:border-white transition-colors shadow-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1e0e3b] border-white/10 text-white shadow-xl mt-2 rounded-xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-white/50">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => setLocation("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => setLocation("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => setLocation("/admin")}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-red-500/20 text-red-400 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
            {children}
          </div>
        </main>
        
      </div>
    </SidebarProvider>
  );
}
