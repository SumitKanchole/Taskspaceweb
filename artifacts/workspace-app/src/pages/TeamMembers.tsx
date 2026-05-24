import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, AlertCircle, Building2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const fetchTeamMembers = async () => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/users/team`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch team members");
  return res.json();
};

export default function TeamMembers() {
  const { data: members, isLoading, isError } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          Team Members
        </h1>
        <p className="text-white/50 mt-2">All users from workspaces you have joined.</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-white/50 font-medium animate-pulse">Loading team members...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">Failed to load team members. Please try again later.</p>
        </div>
      ) : members?.length === 0 ? (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl" />
            <Users className="w-full h-full text-blue-500/40" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No team members found</h3>
          <p className="text-white/40 text-sm max-w-[300px]">
            You haven't joined any workspaces with other members yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: any, index: number) => (
            <div key={`${member.user.id}-${member.workspace.id}-${index}`} className="bg-[#1e0e3b] border border-white/5 rounded-2xl p-6 shadow-lg hover:bg-white/[0.02] transition-colors flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-900/50">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <Badge variant="outline" className={`border-0 capitalize ${
                  member.role === 'owner' ? 'bg-[#5c42bd]/20 text-[#7359dc]' :
                  member.role === 'admin' ? 'bg-[#eb9656]/20 text-[#eb9656]' :
                  'bg-white/5 text-white/60'
                }`}>
                  {member.role}
                </Badge>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {member.user.name}
                </h3>
                <p className="text-sm text-white/50">{member.user.email}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center text-xs text-white/60 bg-[#0b0f19] px-3 py-2 rounded-lg border border-white/5">
                  <Building2 className="w-3 h-3 mr-2 text-cyan-400" />
                  <span className="truncate">{member.workspace.name}</span>
                </div>
                <div className="text-[10px] text-white/30 text-right">
                  Joined {format(new Date(member.joinedAt || new Date()), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
