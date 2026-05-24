import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Bell, Check, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const fetchNotifications = async () => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

const markAsRead = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
};

const markAllAsRead = async () => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/notifications/read-all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
};

const acceptInvite = async (inviteToken: string) => {
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/invites/accept`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ token: inviteToken })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to accept invite");
  }
  return res.json();
};

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const markAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const acceptMutation = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      toast.success("Successfully joined workspace!");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate(id);
  };

  const handleAcceptInvite = (id: number, token: string) => {
    acceptMutation.mutate(token);
    markReadMutation.mutate(id);
  };

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Bell className="w-6 h-6 text-yellow-500" />
            </div>
            Notifications
          </h1>
          <p className="text-white/50 mt-2">Updates from your workspaces and tasks.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
          >
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-white/50 font-medium animate-pulse">Loading notifications...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">Failed to load notifications. Please try again later.</p>
        </div>
      ) : notifications?.length === 0 ? (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-xl" />
            <Bell className="w-full h-full text-yellow-500/40" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">All caught up</h3>
          <p className="text-white/40 text-sm max-w-[300px]">
            You have no new notifications right now.
          </p>
        </div>
      ) : (
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="divide-y divide-white/5">
            {notifications?.map((notification: any) => {
              let messageText = notification.message;
              let inviteData: any = null;
              const isInvite = notification.type === "workspace_invite";

              if (isInvite) {
                try {
                  const parsed = JSON.parse(notification.message);
                  messageText = parsed.text || messageText;
                  inviteData = parsed;
                } catch (e) {
                  // Ignore
                }
              }

              return (
                <div key={notification.id} className={`p-6 flex items-start gap-4 transition-colors ${!notification.isRead ? 'bg-[#00e5ff]/5' : 'hover:bg-white/[0.02]'}`}>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Bell className={`w-5 h-5 ${!notification.isRead ? 'text-[#00e5ff]' : 'text-white/50'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-medium ${!notification.isRead ? 'text-[#00e5ff]' : 'text-white'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-white/60 mt-1">{messageText}</p>
                    <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {format(new Date(notification.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="flex items-center gap-2">
                      {isInvite && inviteData?.token && (
                        <button
                          onClick={() => handleAcceptInvite(notification.id, inviteData.token)}
                          disabled={acceptMutation.isPending}
                          className="text-xs font-medium bg-[#00e5ff] text-black px-4 py-1.5 rounded-md hover:bg-[#00e5ff]/90 transition-colors shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                        >
                          {acceptMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Accept"}
                        </button>
                      )}
                      <button 
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={markReadMutation.isPending}
                        className="text-xs font-medium text-white/50 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                      >
                        Mark read
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
