import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Key, Camera } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <User className="w-6 h-6 text-blue-400" />
          </div>
          My Profile
        </h1>
        <p className="text-white/50 mt-2">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg p-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-blue-900/50 mb-6 relative group cursor-pointer">
              {user?.name?.charAt(0).toUpperCase()}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-white/50 mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium capitalize">
              <Shield className="w-4 h-4" />
              {user?.role}
            </div>
          </div>
        </div>

        {/* Right Column - Forms & Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Personal Information</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    defaultValue={user?.name} 
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-lg h-11 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="email" 
                    disabled 
                    defaultValue={user?.email} 
                    className="w-full bg-[#0b0f19]/50 border border-white/5 rounded-lg h-11 pl-10 pr-4 text-white/50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-white/40 mt-1">Email cannot be changed directly.</p>
              </div>
              <div className="pt-4">
                <button type="button" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Change Password</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Current Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-lg h-11 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">New Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-lg h-11 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button type="button" className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
