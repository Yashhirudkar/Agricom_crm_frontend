"use client";

import Image from "next/image";
import { Bell, Check, LogOut, ChevronDown, Building2, Search, Menu, CheckSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser, selectUser, fetchCurrentUser } from "@/store/slices/authSlice";
import axiosClient from "@/lib/axios";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import {
  selectActiveCompanyId,
  selectActiveCompany,
  switchCompanyContext
} from "@/store/slices/companyContextSlice";
import {
  selectNotifications,
  selectUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/store/slices/notificationsSlice";
import { createNotificationClickHandler } from "@/lib/notificationRouter";

export function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);

  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/login");
  };

  const activeCompanyId = useSelector(selectActiveCompanyId);
  const activeCompany = useSelector(selectActiveCompany);
  const companies = useSelector(selectCompanies) || [];

  // Switch Workspace
  const handleSwitchWorkspace = async (companyId) => {
    try {
      await dispatch(switchCompanyContext(companyId)).unwrap();
      setIsSwitcherOpen(false);
    } catch (err) {
      console.error("Failed to switch workspace:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = async () => {
    dispatch(markAllNotificationsRead());
  };

  // Centralized notification click: markAsRead → navigate (via notificationRouter)
  const handleNotificationClick = createNotificationClickHandler(
    dispatch,
    router,
    markNotificationRead,
    () => setIsNotificationsOpen(false),
  );

  // Determine active workspace
  const workspaces = user?.workspaces || [];
  const activeWorkspace =
    workspaces.find((w) => w.id.toString() === activeCompanyId) ||
    workspaces[0];

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const baseURL = axiosClient.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:5000";
    return `${baseURL}${url}`;
  };

  // Fetch companies list for Super Admin if not already fetched
  useEffect(() => {
    if (user?.type === "super_admin" && companies.length === 0) {
      dispatch(fetchCompanies());
    }
  }, [user, dispatch, companies.length]);

  const [holidayBanner, setHolidayBanner] = useState(null);

  useEffect(() => {
    if (!user || !activeCompanyId) return;

    const fetchHolidays = async () => {
      try {
        const res = await axiosClient.get("/holidays/upcoming");
        const upcoming = res.data || [];
        if (upcoming.length > 0) {
          const firstHoliday = upcoming[0];
          const holidayDateStr = firstHoliday.holidayDate;
          if (!holidayDateStr) return;

          const normalizedDateStr = holidayDateStr.split("T")[0];
          const todayStr = new Date().toLocaleDateString("en-CA");
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toLocaleDateString("en-CA");

          const isToday = normalizedDateStr === todayStr;
          const isTomorrow = normalizedDateStr === tomorrowStr;

          if (isToday || isTomorrow) {
            const dismissedId = localStorage.getItem(`dismissed_holiday_${firstHoliday.id}`);
            if (dismissedId !== firstHoliday.id.toString()) {
              setHolidayBanner({
                id: firstHoliday.id,
                title: firstHoliday.title,
                isToday,
                isTomorrow,
              });
            } else {
              setHolidayBanner(null);
            }
          } else {
            setHolidayBanner(null);
          }
        } else {
          setHolidayBanner(null);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming holidays:", err);
      }
    };

    fetchHolidays();
  }, [user, activeCompanyId]);

  const handleDismissHoliday = () => {
    if (holidayBanner) {
      localStorage.setItem(`dismissed_holiday_${holidayBanner.id}`, holidayBanner.id.toString());
      setHolidayBanner(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white backdrop-blur-xl transition-all duration-300">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        {/* Left Side: Logo & Workspace Switcher */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={() => {
              window.dispatchEvent(new Event("toggle-sidebar"));
            }}
            className="block md:hidden p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all cursor-pointer mr-[-4px]"
            title="Toggle Sidebar"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-102 flex items-center h-10">
              <Image
                src="/agri_logo.png"
                alt="Agricom CRM Logo"
                width={160}
                height={45}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
          </div>

          {/* Workspace / Company Switcher Context */}
          {user?.type === "super_admin" ? (
            <div
              className="relative"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsSwitcherOpen(false);
                }
              }}
            >
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-xl text-xs font-semibold text-amber-700 transition-all cursor-pointer shadow-xs"
              >
                <Building2 className="h-3.5 w-3.5 text-amber-500" />
                <span>{activeCompany?.name || companies.find(c => c.id.toString() === activeCompanyId)?.name || "Select Company"}</span>
                <ChevronDown className="h-3 w-3 text-amber-500" />
              </button>

              {isSwitcherOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Switch Company
                  </div>
                  <div className="max-h-[220px] overflow-y-auto scrollbar-thin divide-y divide-gray-50">
                    {companies.map((c) => {
                      const isActive = c.id.toString() === activeCompanyId;
                      return (
                        <button
                          key={c.id}
                          onClick={() => handleSwitchWorkspace(c.id)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-medium transition-colors cursor-pointer ${isActive
                            ? "bg-amber-50 text-amber-700 font-bold"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          <span className="font-semibold">{c.name}</span>
                          {isActive && <Check className="h-3.5 w-3.5 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : user?.type === "client_admin" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 shadow-xs">
              <Building2 className="h-3.5 w-3.5 text-blue-500" />
              <span>{activeCompany?.name || activeWorkspace?.name || user?.company?.name || "No Company Context"}</span>
            </div>
          ) : workspaces.length > 0 ? (
            <div
              className="relative"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsSwitcherOpen(false);
                }
              }}
            >
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all cursor-pointer shadow-xs"
              >
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span>{activeWorkspace?.name || "Select Workspace"}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {isSwitcherOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Switch Workspace
                  </div>
                  <div className="max-h-[220px] overflow-y-auto scrollbar-thin divide-y divide-gray-50">
                    {workspaces.map((w) => {
                      const isActive = w.id.toString() === activeCompanyId;
                      return (
                        <button
                          key={w.id}
                          onClick={() => handleSwitchWorkspace(w.id)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-medium transition-colors cursor-pointer ${isActive
                            ? "bg-blue-50 text-[#007aff]"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{w.name}</span>
                            {w.role && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                Role: {w.role.name}
                              </span>
                            )}
                          </div>
                          {isActive && <Check className="h-3.5 w-3.5 text-[#007aff]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-[11px] font-bold text-rose-600">
              No Workspace Assigned
            </div>
          )}
        </div>

        {/* Middle: Global Search Input Prompt */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div
            onClick={() => {
              // Trigger Ctrl+K programmatically by dispatching a KeyboardEvent
              const event = new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
              });
              window.dispatchEvent(event);
            }}
            className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs text-gray-400 font-medium cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-gray-400" />
              <span>Search clients, companies, users...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 text-[10px] font-bold rounded-md text-gray-400">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Right Side: Notifications Dropdown, Profile, Logout */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsNotificationsOpen(false);
              }
            }}
          >
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#007aff] ring-2 ring-white" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-50 text-[#007aff] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-[#007aff] hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[300px] overflow-y-auto scrollbar-thin divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs font-semibold">
                      All clean! No new notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        type="button"
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full text-left flex items-start px-4 py-3 transition-colors cursor-pointer ${!notif.isRead ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center ${!notif.isRead ? "bg-blue-100 text-[#007aff]" : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            {notif.payload?.icon === "task" ? (
                              <CheckSquare className="h-3.5 w-3.5" />
                            ) : (
                              <Bell className="h-3.5 w-3.5" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-bold text-gray-800 leading-tight">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                            {notif.payload?.taskName ? (
                              <span>
                                <strong>Task:</strong> {notif.payload.taskName} <br />
                                <strong>Status:</strong> {notif.payload.status}
                              </span>
                            ) : (
                              notif.payload?.message || ""
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 font-medium">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#007aff] self-center flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-gray-200" />

          {/* User Profile */}
          <div
            className="flex items-center gap-2.5 px-1.5 py-1 rounded-xl  hover:bg-gray-50 transition-all"
          >
            <div
              onClick={() => router.push("/profile")}
              className="bg-gradient-to-tr from-blue-500 to-indigo-400 h-8 w-8 rounded-full cursor-pointer flex items-center justify-center text-white text-xs font-bold shadow-xs overflow-hidden border border-gray-100/50"
            >
              {user?.avatarUrl ? (
                <img
                  src={getAvatarUrl(user.avatarUrl)}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name?.trim()?.slice(0, 2) ||
                  user?.email?.trim()?.slice(0, 2) ||
                  "??").toUpperCase()
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 leading-tight max-w-[130px] truncate">
                {user?.name
                  ? user.name
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")
                  : user?.email}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">
                {user?.type === "super_admin"
                  ? "Platform Admin"
                  : user?.type === "client_admin"
                    ? "Client Admin"
                    : activeWorkspace?.role?.name
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase()) || "User"}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
      {holidayBanner && (
        <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-inner transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎉</span>
            <span>
              {holidayBanner.isToday
                ? `Today is a holiday: ${holidayBanner.title}! Office is closed today.`
                : `Tomorrow is a holiday: ${holidayBanner.title}. Office will remain closed tomorrow.`}
            </span>
          </div>
          <button
            onClick={handleDismissHoliday}
            className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}
    </header>
  );
}
