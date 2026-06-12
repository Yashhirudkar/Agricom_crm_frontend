"use client";

import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Handshake,
  ShoppingCart,
  Users,
  Shield,
  Building2,
  Globe,
  Clock,
  Calendar,
  DollarSign,
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

// Map string icon names from DB to Lucide components
const iconMap = {
  LayoutDashboard,
  Handshake,
  ShoppingCart,
  Users,
  Shield,
  Building2,
  Globe,
  Clock,
  Calendar,
  DollarSign,
};

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
        const response = await axiosInstance.get('/system/sidebar');
        setMenuConfig(response.data || []);
      } catch (error) {
        console.error("Failed to fetch sidebar config", error);
      }
    };
    // Always add static Overview module at the top
    const baseConfig = [
      {
        id: "overview",
        name: "OVERVIEW",
        icon: "LayoutDashboard",
        type: "parent",
        subModules: [
          { id: "dashboard", name: "Dashboard", route: "/", icon: "LayoutDashboard", permissionKey: null }
        ],
      }
    ];
    setMenuConfig(baseConfig);
    fetchSidebar();
  }, []);

  const hasPermission = (perm) => {
    if (!perm) return true;
    if (userType === "super_admin" || userType === "client_admin") return true;
    if (user?.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(perm);
    }
    return false;
  };

  // Filter config based on role and permissions
  const filteredMenu = menuConfig.filter((section) => {
    if (section.isSuperAdminOnly && userType !== "super_admin") return false;
    if (section.isClientAdminOnly && userType !== "client_admin") return false;
    return true;
  }).map((section) => {
    // Map backend `subModules` to `items` array used by the UI
    const items = (section.subModules || []).filter((item) => hasPermission(item.permissionKey)).map(item => ({
      ...item,
      href: item.route,
      icon: iconMap[item.icon] || LayoutDashboard
    }));
    return { ...section, type: section.id === "overview" ? "parent" : "parent_collapsible", title: section.name, items };
  }).filter((section) => {
    return section.items.length > 0;
  });

  // Group HR modules under a single collapsible parent, but keep the data structure flat for others to match backend
  // The new DB structure has HR as multiple modules (hr_employee_management, hr_attendance, hr_payroll)
  // Let's dynamically group them if their key starts with "hr_"

  const formattedMenu = [];
  const hrModules = [];

  filteredMenu.forEach(section => {
    if (section.key?.startsWith('hr_')) {
      hrModules.push({ ...section, title: section.name, id: section.key });
    } else {
      formattedMenu.push(section);
    }
  });

  if (hrModules.length > 0) {
    formattedMenu.push({
      id: "hr_department",
      title: "HR DEPARTMENT",
      type: "parent_collapsible_nested",
      modules: hrModules
    });
  }

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

  // ICON COLORS
  const iconColors = {
    Dashboard: "text-blue-500",
    Clients: "text-violet-500",
    "All Companies": "text-orange-500",
    "My Companies": "text-orange-500",
    "All Users": "text-green-500",
    "My Users": "text-green-500",
    Roles: "text-rose-500",
    "Custom Roles": "text-rose-500",
    Leads: "text-sky-500",
    Customers: "text-emerald-500",
    Orders: "text-amber-500",
    Departments: "text-indigo-500",
    Designations: "text-teal-500",
    Employees: "text-cyan-500",
    "Daily Log": "text-purple-500",
    "Leave Requests": "text-pink-500",
    "Salary Details": "text-green-600",
  };

  return (
    <aside
      className={`relative ${isSidebarCollapsed ? "w-[80px]" : "w-[260px]"} flex flex-col bg-white text-gray-500 h-full border-r border-gray-200 flex-shrink-0 font-sans transition-all duration-300 z-40`}
    >
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3.5 top-5 bg-white border border-gray-200 text-[#007aff] rounded-full p-1 shadow-md hover:bg-gray-50 z-50 transition-transform"
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className={`h-16 flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "px-6"} border-b border-gray-100`}>
        <div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0">
          <Image src="/maple-leaf.png" alt="Logo" width={20} height={20} className="h-5 w-5 object-contain" />
        </div>

        {!isSidebarCollapsed && (
          <div className="ml-3 overflow-hidden whitespace-nowrap pb-2">
            <h1 className="text-gray-900 font-bold text-[16px] leading-tight">Agricom</h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-wider">CRM SYSTEM</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6">
        {formattedMenu.map((section, idx) => {
          if (section.type === "parent") {
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
                    const Icon = item.icon;
                    const isActive = item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-blue-50 text-[#007aff]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                          title={isSidebarCollapsed ? item.name : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-[20px] w-[20px] stroke-[1.5] ${isActive ? "text-[#007aff]" : iconColors[item.name] || "text-gray-500"}`} />
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
          }

          if (section.type === "parent_collapsible") {
            const isParentExpanded = !!expandedParents[section.id];
            return (
              <div key={section.id} className={`space-y-2 ${idx !== 0 ? "pt-5 border-t border-gray-100" : ""}`}>
                {!isSidebarCollapsed ? (
                  <button
                    onClick={() => toggleParent(section.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors group"
                  >
                    <span className="text-[12px] font-bold text-gray-500 tracking-widest uppercase group-hover:text-gray-700 transition-colors">
                      {section.title}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${isParentExpanded ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <div className="flex justify-center mb-2 mt-4">
                    <span className="w-4 h-px bg-gray-200"></span>
                  </div>
                )}

                <div className={`space-y-3 overflow-hidden transition-all duration-300 ${!isParentExpanded && !isSidebarCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"}`}>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-blue-50 text-[#007aff]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                            title={isSidebarCollapsed ? item.name : undefined}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`h-[18px] w-[18px] stroke-[1.5] ${isActive ? "text-[#007aff]" : iconColors[item.name] || "text-gray-500"}`} />
                              {!isSidebarCollapsed && (
                                <span className={`text-[13px] font-medium whitespace-nowrap ${isActive ? "text-[#007aff]" : ""}`}>{item.name}</span>
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

          if (section.type === "parent_collapsible_nested") {
            const isParentExpanded = !!expandedParents[section.id];
            return (
              <div key={section.id} className={`space-y-2 ${idx !== 0 ? "pt-5 border-t border-gray-100" : ""}`}>
                {!isSidebarCollapsed ? (
                  <button
                    onClick={() => toggleParent(section.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors group"
                  >
                    <span className="text-[12px] font-bold text-gray-500 tracking-widest uppercase group-hover:text-gray-700 transition-colors">
                      {section.title}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${isParentExpanded ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <div className="flex justify-center mb-2 mt-4">
                    <span className="w-4 h-px bg-gray-200"></span>
                  </div>
                )}

                <div className={`space-y-2 mt-2 overflow-hidden transition-all duration-300 ${!isParentExpanded && !isSidebarCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"}`}>
                  {section.modules.map((mod) => {
                    const isModuleExpanded = !!expandedModules[mod.id];
                    return (
                      <div key={mod.id} className="pl-4 border-l border-gray-100 ml-3">
                        {!isSidebarCollapsed && (
                          <button
                            onClick={() => toggleModule(mod.id)}
                            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors group"
                          >
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase group-hover:text-gray-600 transition-colors">
                              {mod.title}
                            </span>
                            <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isModuleExpanded ? "rotate-180" : ""}`} />
                          </button>
                        )}

                        <div className={`overflow-hidden transition-all duration-300 ${!isModuleExpanded && !isSidebarCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}`}>
                          <ul className="space-y-1 mt-1">
                            {mod.items.map((item) => {
                              const Icon = item.icon;
                              const isActive = item.href !== "#" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
                              return (
                                <li key={item.id}>
                                  <Link
                                    href={item.href}
                                    className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-blue-50 text-[#007aff]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                                    title={isSidebarCollapsed ? item.name : undefined}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Icon className={`h-[18px] w-[18px] stroke-[1.5] ${isActive ? "text-[#007aff]" : iconColors[item.name] || "text-gray-500"}`} />
                                      {!isSidebarCollapsed && (
                                        <span className={`text-[13px] font-medium whitespace-nowrap ${isActive ? "text-[#007aff]" : ""}`}>{item.name}</span>
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
                  })}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} px-2 py-2 rounded-xl`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#007aff] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">
              {initials}
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