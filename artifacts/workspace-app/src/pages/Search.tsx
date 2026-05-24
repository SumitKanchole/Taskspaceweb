import { useQuery } from "@tanstack/react-query";
import { Loader2, Search as SearchIcon, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
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

export default function Search() {
  const [location] = useLocation();
  
  // Extract query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "";

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ["allTasks"],
    queryFn: fetchAllTasks,
  });

  const filteredTasks = tasks?.filter((task: any) => 
    task.title.toLowerCase().includes(query.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(query.toLowerCase())) ||
    (task.status && task.status.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <SearchIcon className="w-6 h-6 text-cyan-400" />
          </div>
          Search Results
        </h1>
        <p className="text-white/50 mt-2">
          {query ? (
            <>Showing results for <span className="text-white font-bold">"{query}"</span></>
          ) : (
            "Enter a search term in the search bar above."
          )}
        </p>
      </div>

      {!query ? (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl" />
            <SearchIcon className="w-full h-full text-cyan-500/40" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Search your workspace</h3>
          <p className="text-white/40 text-sm max-w-[300px]">
            Type a task name, description, or status in the search bar above to find it instantly.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-white/50 font-medium animate-pulse">Searching...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">Failed to load search results. Please try again later.</p>
        </div>
      ) : filteredTasks?.length === 0 ? (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
            <SearchIcon className="w-full h-full text-white/20" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-white/40 text-sm max-w-[300px]">
            We couldn't find any tasks matching "{query}". Try a different keyword.
          </p>
        </div>
      ) : (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="divide-y divide-white/5">
            {filteredTasks.map((task: any) => (
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
