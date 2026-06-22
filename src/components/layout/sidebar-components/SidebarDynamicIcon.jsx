import React from "react";
import * as LucideIcons from "lucide-react";

export function SidebarDynamicIcon({ iconName, className = "", style = {} }) {
  if (!iconName) {
    const Fallback = LucideIcons.Circle;
    return <Fallback className={className} style={style} />;
  }

  const IconComponent = LucideIcons[iconName];
  
  if (!IconComponent) {
    const Fallback = LucideIcons.Circle;
    return <Fallback className={className} style={style} />;
  }

  return <IconComponent className={className} style={style} />;
}
