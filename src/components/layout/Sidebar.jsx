"use client";

import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  selectUser,
  selectUserType,
} from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

import { SidebarDynamicIcon } from "./sidebar-components/SidebarDynamicIcon";
import { usePermissions } from "@/hooks/usePermissions";

export function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedParents, setExpandedParents] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [menuConfig, setMenuConfig] = useState([]);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseURL = axiosInstance.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${baseURL}${url}`;
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/login");
  };

  const workspaces = user?.workspaces || [];

  const activeCompanyId =
    typeof window !== "undefined"
      ? localStorage.getItem("activeCompanyId")
      : null;

  const activeWorkspace =
    workspaces.find((w) => w.id.toString() === activeCompanyId) ||
    workspaces[0];

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const response = await axiosInstance.get(`/auth/my-menu?t=${Date.now()}`);
        setMenuConfig(response.data || []);
      } catch (error) {
        console.error("Failed to fetch sidebar config", error);
      }
    };
    fetchSidebar();

    window.addEventListener("sidebar-updated", fetchSidebar);
    return () => window.removeEventListener("sidebar-updated", fetchSidebar);
  }, []);

  // Auto-collapse sidebar on smaller screens (below lg/1024px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to mobile toggle event from Header
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleToggle = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const { hasPermission } = usePermissions();
  const hasFollowupPermission = hasPermission("follow_up:view");

  const formattedMenu = menuConfig;

  // Auto-expand active routes
  useEffect(() => {
    if (!pathname || formattedMenu.length === 0) return;

    let parentToExpand = null;
    let moduleToExpand = null;

    formattedMenu.forEach((section) => {
      if (section.type === "parent_collapsible_nested") {
        section.modules.forEach((mod) => {
          const hasActiveItem = mod.items.some(
            (item) => item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
          );
          if (hasActiveItem) {
            parentToExpand = section.id;
            moduleToExpand = mod.id;
          }
        });
      } else if (section.type === "parent_collapsible") {
        const hasActiveItem = section.items.some(
          (item) => item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
        );
        if (hasActiveItem) {
          parentToExpand = section.id;
        }
      } else if (section.type === "parent" && section.isCollapsible) {
        // Dynamic collapsible folders from backend
        const hasActiveItem = (section.items || []).some(
          (item) => item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
        );
        if (hasActiveItem) {
          parentToExpand = section.id;
        }
      }
    });

    if (parentToExpand) {
      setExpandedParents((prev) => ({ ...prev, [parentToExpand]: true }));
    }
    if (moduleToExpand) {
      setExpandedModules((prev) => ({ ...prev, [moduleToExpand]: true }));
    }
  }, [pathname, formattedMenu.length]);

  const toggleParent = (id) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "??";

  const getRoleLabel = () => {
    if (userType === "super_admin") return "Super Admin";
    if (userType === "client_admin") return "Client Admin";
    return user?.roles?.[0]?.name || "User";
  };


  return (
    <aside
      className={`fixed md:relative top-16 md:top-0 bottom-0 left-0 h-[calc(100vh-64px)] md:h-full flex flex-col bg-white text-gray-500 border-r border-gray-200 flex-shrink-0 font-sans transition-all duration-300 z-40 ${
        isSidebarCollapsed
          ? "w-0 md:w-[80px] border-r-0 md:border-r"
          : "w-[260px] shadow-2xl md:shadow-none"
      }`}
    >
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`absolute top-5 bg-white border border-gray-200 text-[#007aff] rounded-full p-1 shadow-md hover:bg-gray-50 z-50 transition-all duration-300 ${isSidebarCollapsed
            ? "left-full translate-x-2 md:translate-x-[-50%]"
            : "left-full translate-x-[-50%]"
          }`}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className={`h-[72px] flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "px-4 pr-7"} border-b border-gray-100`}>
        <div className="relative flex items-center justify-center flex-shrink-0">
          {user?.company?.logoUrl ? (
            <>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.company.logoUrl}`}
                alt="Logo"
                className="h-9 w-9 rounded-xl object-cover border border-gray-200 shadow-xs"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="hidden h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold items-center justify-center text-sm shadow-sm border border-blue-600">
                {user?.company?.name ? user.company.name.charAt(0).toUpperCase() : "A"}
              </div>
            </>
          ) : (
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-sm border border-blue-600">
              {user?.company?.name ? user.company.name.charAt(0).toUpperCase() : "A"}
            </div>
          )}
        </div>

        {!isSidebarCollapsed && (
          <div className="ml-3 overflow-hidden flex flex-col justify-center min-w-0 pr-2">
            <h1 className="text-gray-900 font-bold text-[14px] leading-tight truncate max-w-[130px]">
              {user?.company?.name || "Agricom"}
            </h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5 truncate">
              {user?.company?.name && user.company.name !== "Agricom" ? "Workspace" : "CRM SYSTEM"}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6">
        {formattedMenu.map((section, idx) => {
          if (section.type === "parent") {
            // ── COLLAPSIBLE FOLDER ──────────────────────────────────────
            if (section.isCollapsible) {
              const isExpanded = !!expandedParents[section.id];
              const hasActiveChild = (section.items || []).some(
                (item) => item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
              );
              return (
                <div key={section.id} className={idx !== 0 ? "pt-5 border-t border-gray-100" : ""}>
                  {/* Clickable folder header */}
                  <button
                    onClick={() => toggleParent(section.id)}
                    className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"
                      } px-3 py-2 rounded-xl transition-colors ${hasActiveChild
                        ? "text-[#007aff]"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    title={isSidebarCollapsed ? section.title : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {section.icon && !isSidebarCollapsed && (
                        <SidebarDynamicIcon
                          iconName={section.icon}
                          className="h-[16px] w-[16px] stroke-[1.5] flex-shrink-0"
                          style={section.iconColor ? { color: section.iconColor } : {}}
                        />
                      )}
                      {!isSidebarCollapsed && (
                        <span className="text-[12px] font-bold tracking-widest uppercase">
                          {section.title}
                        </span>
                      )}
                      {isSidebarCollapsed && section.icon && (
                        <SidebarDynamicIcon
                          iconName={section.icon}
                          className="h-[18px] w-[18px] stroke-[1.5]"
                          style={section.iconColor ? { color: section.iconColor } : {}}
                        />
                      )}
                    </div>
                    {!isSidebarCollapsed && (
                      isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200" />
                        : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Children — only visible when expanded */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <ul className="space-y-1 mt-1">
                      {(section.items || []).map((item) => {
                        const isActive = item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
                        return (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"
                                } px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-blue-50 text-[#007aff]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              title={isSidebarCollapsed ? item.name : undefined}
                            >
                              <div className="flex items-center gap-3">
                                <SidebarDynamicIcon
                                  iconName={item.icon}
                                  className={`h-[20px] w-[20px] stroke-[1.5] ${isActive ? "text-[#007aff]" : ""}`}
                                  style={!isActive && (item.final_color || item.iconColor || item.icon_color) ? { color: item.final_color || item.iconColor || item.icon_color } : {}}
                                />
                                {!isSidebarCollapsed && (
                                  <span className={`text-[14px] font-medium whitespace-nowrap ${isActive ? "text-[#007aff]" : ""}`}>
                                    {item.name}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            }

            // ── STANDARD FOLDER (always-visible children) ───────────────
            return (
              <div key={section.id} className={idx !== 0 ? "pt-5 border-t border-gray-100" : ""}>
                {!isSidebarCollapsed ? (
                  <div className="px-3 mb-2">
                    <span className="text-[12px] font-bold text-gray-500 tracking-widest uppercase">{section.title}</span>
                  </div>
                ) : (
                  <div className="flex justify-center mb-2 mt-4">
                    <span className="w-4 h-px bg-gray-200"></span>
                  </div>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-blue-50 text-[#007aff]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                          title={isSidebarCollapsed ? item.name : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <SidebarDynamicIcon
                              iconName={item.icon}
                              className={`h-[20px] w-[20px] stroke-[1.5] ${isActive ? "text-[#007aff]" : ""}`}
                              style={!isActive && (item.final_color || item.iconColor || item.icon_color) ? { color: item.final_color || item.iconColor || item.icon_color } : {}}
                            />
                            {!isSidebarCollapsed && (
                              <span className={`text-[14px] font-medium whitespace-nowrap ${isActive ? "text-[#007aff]" : ""}`}>{item.name}</span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          } else if (section.type === "item") {
            const isActive = section.href !== "#" && (section.href === "/" ? pathname === "/" : pathname.startsWith(section.href));
            return (
              <div key={section.id} className={idx !== 0 ? "pt-5 border-t border-gray-100" : ""}>
                <Link
                  href={section.href}
                  className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-blue-50 text-[#007aff]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                  title={isSidebarCollapsed ? section.title : undefined}
                >
                  <div className="flex items-center gap-3">
                    <SidebarDynamicIcon
                      iconName={section.icon}
                      className={`h-[20px] w-[20px] stroke-[1.5] ${isActive ? "text-[#007aff]" : ""}`}
                      style={!isActive && (section.final_color || section.iconColor || section.icon_color) ? { color: section.final_color || section.iconColor || section.icon_color } : {}}
                    />
                    {!isSidebarCollapsed && (
                      <span className={`text-[14px] font-medium whitespace-nowrap ${isActive ? "text-[#007aff]" : ""}`}>{section.title}</span>
                    )}
                  </div>
                </Link>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-2 py-2 rounded-xl`}>
          <div className="flex items-center gap-3">
            <div
              onClick={() => router.push("/profile")}
              className="h-9 w-9 rounded-full bg-[#007aff] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden border border-gray-200"
            >
              {user?.avatarUrl ? (
                <img
                  src={getAvatarUrl(user.avatarUrl)}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex flex-col ml-3 flex-1 min-w-0 overflow-hidden whitespace-nowrap">
                <p className="text-gray-900 text-[14px] font-semibold leading-tight truncate max-w-[120px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user?.email || "..."}
                </p>
                <p className="text-gray-500 text-[12px]">
                  {activeWorkspace?.role?.name ? activeWorkspace.role.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : getRoleLabel()}
                </p>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button onClick={handleLogout} title="Logout" className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
