"use client";
import { User, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/axios";

export default function ProfileHeader({ user, employee, completion }) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseURL = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${baseURL}${url}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-700 w-full relative"></div>
      
      <div className="px-8 pb-8 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
          
          <div className="relative group">
            <div className="h-28 w-28 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img src={getAvatarUrl(user.avatarUrl)} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#007aff]/10 text-[#007aff] flex items-center justify-center text-4xl font-black">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-slate-100">
              {user?.isActive ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 bg-white rounded-full" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-500 bg-white rounded-full" />
              )}
            </div>
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-between w-full">
              <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  {user?.name || "Not Available"}
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> 
                  {employee?.designation?.name || "No Designation"} 
                  <span className="text-slate-300">•</span> 
                  {employee?.department?.name || "No Department"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Profile Completion</span>
                  <span className="text-sm font-black text-[#007aff]">{completion}%</span>
                </div>
                <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#007aff] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
