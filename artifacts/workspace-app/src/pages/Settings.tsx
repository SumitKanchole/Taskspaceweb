import { Settings as SettingsIcon, Bell, Moon, Monitor, Smartphone, Shield, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 bg-gray-500/20 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-gray-400" />
          </div>
          Settings
        </h1>
        <p className="text-white/50 mt-2">Manage your app preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-cyan-400" />
              Appearance
            </h3>
            <p className="text-sm text-white/50 mt-1">Customize how Taskspace looks on your device.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white flex items-center gap-2">
                  <Moon className="w-4 h-4 text-white/40" /> Dark Mode
                </p>
                <p className="text-sm text-white/40">Taskspace is currently hard-locked to Dark Mode for maximum aesthetics.</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Compact Mode</p>
                <p className="text-sm text-white/40">Reduce padding to fit more content on screen.</p>
              </div>
              <Switch checked={false} />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notifications
            </h3>
            <p className="text-sm text-white/50 mt-1">Control when and how you are notified.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-white/40">Receive daily summaries and critical alerts via email.</p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-white/40">Get instant alerts in your browser when assigned a task.</p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Marketing Emails</p>
                <p className="text-sm text-white/40">Receive news, updates, and feature announcements.</p>
              </div>
              <Switch checked={false} />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-[#1e0e3b] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Privacy & Security
            </h3>
            <p className="text-sm text-white/50 mt-1">Manage your data and security preferences.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Two-Factor Authentication</p>
                <p className="text-sm text-white/40">Add an extra layer of security to your account.</p>
              </div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Enable 2FA
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-400">Danger Zone</p>
                <p className="text-sm text-white/40">Permanently delete your account and all data.</p>
              </div>
              <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
