"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUser, selectUserType } from "@/store/slices/authSlice";
import { fetchClients, selectClients } from "@/store/slices/clientsSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import { fetchUsers, selectUsers } from "@/store/slices/usersSlice";
import {
  Building2,
  Users,
  CheckCircle2,
  Briefcase,
  Shield,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Info,
  Clock,
  User as UserIcon,
  Globe
} from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const clients = useSelector(selectClients);
  const companies = useSelector(selectCompanies);
  const users = useSelector(selectUsers);

  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    setMounted(true);

    // Dynamic greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch data based on role
    if (userType === "super_admin") {
      dispatch(fetchClients());
      dispatch(fetchCompanies());
      dispatch(fetchUsers());
    } else if (userType === "client_admin") {
      dispatch(fetchCompanies());
      dispatch(fetchUsers());
    } else {
      // Standard users do not have companies:read permission.
      // They get their accessible workspaces directly from /auth/me payload.
    }
  }, [dispatch, userType]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Dashboard...</p>
      </div>
    );
  }

  // Active workspace calculations
  const workspaces = user?.workspaces || [];
  const activeCompanyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
  const activeWorkspace =
    workspaces.find((w) => w.id.toString() === activeCompanyId) ||
    workspaces[0];

  // 1. SUPER ADMIN DASHBOARD
  if (userType === "super_admin") {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              {greeting}, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-1.5 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[#007aff]" />
              Platform Administrator Controller Scope
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/clients")}
              className="px-3.5 py-2 bg-[#007aff] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs"
            >
              Manage Tenants
            </button>
          </div>
        </div>

        {/* Super Admin Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Clients</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{clients.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-[#007aff] rounded-2xl">
              <Building2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Workspaces</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{companies.length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Platform Accounts</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{users.length}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">System Status</p>
              <h3 className="text-md font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Fully Operational
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Detailed Tenant Scope Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tenants */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Active Tenant Organizations</h3>
              <p className="text-[11px] text-gray-400 font-medium">Platform-wide client workspaces and user allowances.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {clients.slice(0, 4).map((client) => {
                const clientUsers = users.filter(u => u.clientId === client.id).length;
                return (
                  <div key={client.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-500">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{client.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{client.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-gray-700">{clientUsers} / {client.allowedUsers} Users</p>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-[#007aff] rounded-full"
                            style={{ width: `${Math.min((clientUsers / client.allowedUsers) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${client.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {clients.length === 0 && (
                <p className="text-xs text-gray-400 font-semibold py-6 text-center">No active tenants registered.</p>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Platform Control Actions</h3>
                <p className="text-[11px] text-gray-400 font-medium">Quick links to core administrative tools.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/clients")}
                  className="w-full p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 text-left flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#007aff] transition-all"
                >
                  Create Client Tenant <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => router.push("/companies")}
                  className="w-full p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 text-left flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#007aff] transition-all"
                >
                  Manage Company Workspaces <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => router.push("/users")}
                  className="w-full p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 text-left flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#007aff] transition-all"
                >
                  Manage Scoped Accounts <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 flex items-start gap-2.5">
              <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-blue-800 leading-normal font-semibold">
                You are executing in a Global Platform Administrator scope. Changes made here will modify multi-tenant clients database states.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. CLIENT ADMIN DASHBOARD
  if (userType === "client_admin") {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              {greeting}, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-1.5 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[#007aff]" />
              Tenant Administrator Scope
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/users")}
              className="px-3.5 py-2 bg-[#007aff] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs"
            >
              Manage Users
            </button>
          </div>
        </div>

        {/* Client Admin Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company Workspaces</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{companies.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-[#007aff] rounded-2xl">
              <Building2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Scoped Members</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{users.length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tenant Access</p>
              <h3 className="text-md font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Workspace Security</p>
              <h3 className="text-md font-bold text-indigo-700 mt-2 flex items-center gap-1.5">
                Contextual RBAC
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Workspace Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Your Company Workspaces</h3>
              <p className="text-[11px] text-gray-400 font-medium">Independent business workspaces scoped under your tenant organization.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companies.map((co) => (
                <div key={co.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-gray-50/20 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{co.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{co.status}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/companies")}
                    className="p-1 rounded bg-white border border-gray-200 text-gray-400 hover:text-[#007aff] hover:border-[#007aff]/30 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {companies.length === 0 && (
                <p className="text-xs text-gray-400 font-semibold py-6 text-center col-span-full">No company workspaces added yet.</p>
              )}
            </div>
          </div>

          {/* Scoped Users */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Users</h3>
              <p className="text-[11px] text-gray-400 font-medium">Members mapped under your administration.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {users.slice(0, 3).map((usr) => (
                <div key={usr.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8.5 w-8.5 rounded-full bg-blue-50 text-[#007aff] flex items-center justify-center text-xs font-bold">
                      {usr.name ? usr.name.slice(0, 2).toUpperCase() : "??"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{usr.name || "Invite Pending"}</p>
                      <p className="text-[9px] text-gray-400 font-semibold leading-tight">{usr.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${usr.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                    {usr.status}
                  </span>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-xs text-gray-400 font-semibold py-6 text-center">No users added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. STANDARD USER DASHBOARD (Clean, Minimalist Operations View)
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            {greeting}, {user?.name || "Member"}! 👋
          </h1>
          <p className="text-xs text-gray-400 font-bold mt-1.5 flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-[#007aff]" />
            Active Workspace Context: {activeWorkspace?.name || "Global Scope"}
            {activeWorkspace?.role && (
              <span className="text-slate-300 border-l border-slate-200 pl-1.5 uppercase font-bold text-[10px]">
                Role: {activeWorkspace.role.name}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workspace Identity Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#007aff]" />
              <h3 className="text-sm font-bold text-gray-900">User Session Scope</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">User ID</span>
                <span className="font-bold text-gray-700">#{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Email Address</span>
                <span className="font-bold text-gray-700">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Tenant Account</span>
                <span className="font-bold text-gray-700">Client Tenant #{user?.clientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Account Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700">
                  {user?.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 flex items-start gap-2.5">
            <Info className="h-4.5 w-4.5 text-[#007aff] mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-blue-800 leading-normal">
              Operational metrics are being configured by your system administrator. Your active workspace role regulates permissions dynamically.
            </p>
          </div>
        </div>

        {/* Workspace Operations Intro Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#007aff]" />
              <h3 className="text-sm font-bold text-gray-900">Workspace Operations</h3>
            </div>

            <p className="text-[12px] text-gray-500  leading-relaxed">
              Welcome to the Agricom CRM Operations Hub. You are currently logged in as a workspace member. Use the left navigation sidebar to manage Leads, Customers, and Orders scoped specifically to your selected company workspace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/20">
                <p className="text-xs font-bold text-gray-800">Workspace Leads</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">Manage, filter, and track scoped business prospects.</p>
              </div>
              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/20">
                <p className="text-xs font-bold text-gray-800">Customers Database</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">Access scoped account profiles and contact metrics.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 border-t border-gray-50 pt-4">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
