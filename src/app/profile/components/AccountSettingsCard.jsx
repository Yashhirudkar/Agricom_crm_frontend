"use client";
import { useState } from "react";
import { Settings, Shield, Bell, UploadCloud } from "lucide-react";
import api from "@/lib/axios";

export default function AccountSettingsCard({ preferences, onUpdate }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setPassLoading(true);
      await api.put('/auth/change-password', { oldPassword, newPassword });
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Password change failed");
    } finally {
      setPassLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setPhotoLoading(true);
      await api.patch('/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || "Photo upload failed");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePrefToggle = async (key) => {
    try {
      await api.put('/profile/update-preferences', {
        [key]: !preferences[key],
        updatedAt: preferences.updatedAt,
      });
      onUpdate();
    } catch (error) {
      alert("Failed to update preference");
    }
  };

  const Toggle = ({ label, desc, active, onClick }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div>
        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={onClick}
        className={`w-11 h-6 rounded-full transition-colors relative ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${active ? 'left-6' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 delay-200">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Settings className="h-5 w-5" />
          </div>
          Account & Security Settings
        </h3>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Security / Password */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><Shield className="h-4 w-4 text-slate-400" /> Change Password</h4>
            <p className="text-xs text-slate-500 font-medium">Must be 8+ characters, include uppercase, number, and special character.</p>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Current Password" 
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={passLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 rounded-lg transition-all"
            >
              {passLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Preferences & Photo */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><UploadCloud className="h-4 w-4 text-slate-400" /> Profile Photo</h4>
            <p className="text-xs text-slate-500 font-medium">Upload a new avatar (max 2MB, JPG/PNG/WEBP).</p>
          </div>
          
          <div className="relative">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handlePhotoUpload}
              disabled={photoLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all">
              <UploadCloud className="h-6 w-6 text-slate-400 mb-2" />
              <span className="text-sm font-bold text-purple-600">{photoLoading ? "Uploading..." : "Click to select file"}</span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-slate-400" /> Notifications</h4>
            <div className="space-y-3">
              <Toggle 
                label="Email Notifications" 
                desc="Receive updates via email"
                active={preferences?.emailNotifications}
                onClick={() => handlePrefToggle('emailNotifications')}
              />
              <Toggle 
                label="Push Notifications" 
                desc="Receive updates on your device"
                active={preferences?.pushNotifications}
                onClick={() => handlePrefToggle('pushNotifications')}
              />
              <Toggle 
                label="Two-Factor Authentication" 
                desc="Extra security layer"
                active={preferences?.twoFactorEnabled}
                onClick={() => handlePrefToggle('twoFactorEnabled')}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
