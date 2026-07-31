"use client";
import { useState, useEffect } from "react";
import { Shield, CheckCircle2, AlertCircle, X, ZoomIn } from "lucide-react";
import api from "@/lib/axios";

export default function ProfileHeader({ user, employee, completion }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getInitials = () => {
    if (employee?.firstName) {
      const f = employee.firstName.charAt(0);
      const l = employee.lastName ? employee.lastName.charAt(0) : "";
      return (f + l).toUpperCase() || "U";
    }
    if (!user?.name) return "U";
    return user.name.slice(0, 2).toUpperCase();
  };

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseURL = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${baseURL}${url}`;
  };

  const displayName = employee?.firstName
    ? `${employee.firstName}${employee.lastName ? ' ' + employee.lastName : ''}`.trim()
    : (user?.name || "Not Available");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">

        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div 
              className={`h-16 w-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden relative group transition-all duration-300 ${
                user?.avatarUrl ? 'cursor-pointer hover:border-[#007aff] hover:shadow-md' : ''
              }`}
              onClick={() => user?.avatarUrl && setIsOpen(true)}
            >
              {user?.avatarUrl ? (
                <>
                  <img 
                    src={getAvatarUrl(user.avatarUrl)} 
                    alt="Avatar" 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                </>
              ) : (
                <span className="text-lg font-bold text-[#007aff]">{getInitials()}</span>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-100">
              {user?.isActive ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-500" />
              )}
            </span>
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900">
              {displayName}
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-400" />
              {employee?.designation?.name || "No Designation"}
              <span className="text-slate-300">•</span>
              {employee?.department?.name || "No Department"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Profile Completion</span>
            <span className="text-sm font-black text-[#007aff]">{completion}%</span>
          </div>
          <div className="w-full sm:w-44 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#007aff] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Lightbox / Avatar Zoom Modal */}
      {isOpen && user?.avatarUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white hover:text-slate-200 p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Image Card Container */}
          <div 
            className="relative max-w-[90vw] max-h-[85vh] p-3 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getAvatarUrl(user.avatarUrl)} 
              alt="Avatar Large" 
              className="max-w-full max-h-[70vh] object-contain rounded-xl"
            />
            {displayName && (
              <div className="mt-4 text-center pb-2 px-4">
                <h3 className="font-extrabold text-slate-900 text-lg">{displayName}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">
                  {employee?.designation?.name || "Employee"}
                  {employee?.department?.name && ` • ${employee.department.name}`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}