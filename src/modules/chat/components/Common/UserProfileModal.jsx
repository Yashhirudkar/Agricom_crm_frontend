"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getAvatarUrl } from "@/lib/axios";

export default function UserProfileModal({ user, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user || typeof document === "undefined") return null;

  const avatarSrc = user.avatarUrl || user.avatar;
  const displayName = user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "User");

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Floating Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md z-50 border border-white/10 shadow-lg hover:scale-105 active:scale-95"
        title="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Main Image Lightbox Container - ONLY IMAGE */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] p-2.5 sm:p-3 bg-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center animate-in zoom-in-95 duration-200 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {avatarSrc ? (
          <img
            src={getAvatarUrl(avatarSrc)}
            alt={displayName}
            className="max-h-[78vh] max-w-[85vw] sm:max-w-[480px] object-contain rounded-2xl shadow-sm"
          />
        ) : (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 min-w-[260px] sm:min-w-[320px]">
            <img
              src="/agri_logo.png"
              alt="Agricom Logo"
              className="max-h-[220px] max-w-[300px] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
