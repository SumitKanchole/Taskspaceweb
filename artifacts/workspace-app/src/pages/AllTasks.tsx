import { useQuery } from "@tanstack/react-query";
import { Loader2, ListTodo, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const fetchAllTasks = async () => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/tasks/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export default function AllTasks() {
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ["allTasks"],
    queryFn: fetchAllTasks,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-[#2d7ad8]/20 rounded-lg">
            <ListTodo className="w-6 h-6 text-[#4b96f3]" />
          </div>
          All Tasks
        </h1>
        <p className="text-white/50 mt-2">All tasks across workspaces you are a member of.</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-white/50 font-medium animate-pulse">Loading all tasks...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">Failed to load tasks. Please try again later.</p>
        </div>
      ) : tasks?.length === 0 ? (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-[#2d7ad8]/10 rounded-full blur-xl" />
            <ListTodo className="w-full h-full text-[#2d7ad8]/40" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
          <p className="text-white/40 text-sm max-w-[300px]">
            There are no tasks available in any of your workspaces.
          </p>
        </div>
      ) : (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="divide-y divide-white/5">
            {tasks.map((task: any) => (
              <Link key={task.id} href={`/tasks/${task.workspaceId}/${task.id}`}>
                <div className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    task.status === 'completed' ? 'bg-[#2e8f62]' :
                    task.status === 'in_progress' ? 'bg-[#d97c36]' : 'bg-[#5c42bd]'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-white/40 text-sm truncate mt-0.5">{task.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <Badge variant="outline" className="bg-[#0b0f19] border-white/10 text-white/60 capitalize hidden md:inline-flex">
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className={`border-0 capitalize hidden sm:inline-flex ${
                      task.status === 'completed' ? 'bg-[#2e8f62]/20 text-[#40b580]' :
                      task.status === 'in_progress' ? 'bg-[#d97c36]/20 text-[#eb9656]' : 'bg-[#5c42bd]/20 text-[#7359dc]'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    
                    {task.assignee && (
                      <div className="hidden lg:flex items-center gap-2 bg-[#0b0f19] border border-white/5 px-2 py-1 rounded-md">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                          {task.assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-white/60 truncate max-w-[100px]">{task.assignee.name}</span>
                      </div>
                    )}
                    
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-white/40 bg-[#0b0f19] px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
