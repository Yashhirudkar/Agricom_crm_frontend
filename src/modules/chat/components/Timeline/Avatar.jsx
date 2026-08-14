import React, { useState } from "react";
import { getAvatarUrl } from "@/lib/axios";
import UserProfileModal from "../Common/UserProfileModal";

const AVATAR_COLORS = [
  "from-rose-400 to-rose-500 text-white",
  "from-sky-400 to-sky-500 text-white",
  "from-emerald-400 to-emerald-500 text-white",
  "from-amber-400 to-amber-500 text-white",
  "from-purple-400 to-purple-500 text-white",
  "from-pink-400 to-pink-500 text-white",
  "from-indigo-400 to-indigo-500 text-white",
  "from-teal-400 to-teal-500 text-white",
  "from-orange-400 to-orange-500 text-white",
  "from-cyan-400 to-cyan-500 text-white",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const Avatar = React.memo(({ sender, size = "md", presence, onClick, disableModal = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else if (!disableModal && sender) {
      setModalOpen(true);
    }
  };

  // Sizing definitions
  const dimensions = {
    sm: { box: "h-7 w-7 text-[9px]", dot: "h-2 w-2 -bottom-[1px] -right-[1px]" },
    md: { box: "h-10 w-10 text-[11px]", dot: "h-2.5 w-2.5 -bottom-[1.5px] -right-[1.5px]" },
    lg: { box: "h-12 w-12 text-[13px]", dot: "h-3 w-3 -bottom-[1.5px] -right-[1.5px]" },
  }[size] || { box: "h-10 w-10 text-[11px]", dot: "h-2.5 w-2.5 -bottom-[1.5px] -right-[1.5px]" };

  const getPresenceColor = (status) => {
    switch (status) {
      case "ONLINE":
        return "bg-emerald-500";
      case "AWAY":
        return "bg-amber-500";
      case "BUSY":
        return "bg-red-500";
      case "OFFLINE":
      default:
        return "bg-slate-455 bg-slate-400";
    }
  };

  const renderContent = () => {
    if (sender?.avatarUrl) {
      return (
        <div className="relative w-full h-full">
          {!imageLoaded && (
            <div className="absolute inset-0 rounded-full animate-shimmer bg-slate-200" />
          )}
          <img
            src={getAvatarUrl(sender.avatarUrl)}
            alt={sender.name || "User Avatar"}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full rounded-full object-cover transition-opacity duration-200 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      );
    }

    const gradientClass = getAvatarColor(sender?.name || "");
    return (
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center font-bold tracking-wider select-none shadow-inner`}>
        {getInitials(sender?.name)}
      </div>
    );
  };

  return (
    <>
      <div className="relative inline-block flex-shrink-0 select-none" onClick={handleClick}>
        <div
          className={`${dimensions.box} rounded-full border-2 border-white shadow-xs hover:shadow-md transition-all duration-150 hover:scale-[1.04] cursor-pointer bg-white overflow-hidden`}
        >
          {renderContent()}
        </div>

        {/* Presence Dot Overlay */}
        {presence && (
          <span
            className={`absolute rounded-full border-2 border-white transition-colors duration-200 shadow-sm ${
              dimensions.dot
            } ${getPresenceColor(presence)}`}
          />
        )}
      </div>

      {!disableModal && !onClick && modalOpen && (
        <UserProfileModal
          user={sender ? { ...sender, presence } : null}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;

