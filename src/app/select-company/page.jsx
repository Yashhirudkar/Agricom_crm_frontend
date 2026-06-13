"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUser, fetchCurrentUser, logoutUser } from "@/store/slices/authSlice";
import axiosClient from "@/lib/axios";
import Image from "next/image";
import { Building2, ArrowRight, LogOut, Check } from "lucide-react";

export default function SelectCompanyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const workspaces = user?.workspaces || [];

  // Redirect if they shouldn't be here
  useEffect(() => {
    if (user) {
      if (user.type === "super_admin") {
        router.replace("/");
        return;
      }
      if (workspaces.length <= 1) {
        // Guard will auto-select if 1, or let pass if 0
        router.replace("/");
      }
    }
  }, [user, workspaces, router]);

  const handleConfirm = async () => {
    if (!selectedCompanyId) {
      setError("Please select a workspace to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosClient.post("/auth/switch-workspace", {
        companyId: Number(selectedCompanyId),
      });
      localStorage.setItem("activeCompanyId", selectedCompanyId.toString());

      // Fetch fresh profile state to sync contextual roles/permissions
      await dispatch(fetchCurrentUser()).unwrap();

      router.replace("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to switch workspace context");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/login");
  };

  const isGridLayout = workspaces.length > 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-4 py-12">
      <div className={`w-full ${isGridLayout ? "max-w-2xl" : "max-w-md"} animate-in fade-in duration-300`}>
        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl px-8 py-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/agri_logo.png"
              alt="Agricom CRM"
              width={160}
              height={45}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center mb-1.5">
            Select Workspace
          </h1>
          <p className="text-xs text-gray-400 font-medium text-center max-w-sm mb-8 leading-relaxed">
            Choose the company workspace you want to access for this <br />active session context.
          </p>

          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold mb-5 text-center">
              {error}
            </div>
          )}

          {/* Workspaces List/Grid */}
          <div className={isGridLayout
            ? "w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin"
            : "w-full space-y-3 max-h-[340px] overflow-y-auto pr-1.5 scrollbar-thin"
          }>
            {workspaces.map((ws) => {
              const isSelected = selectedCompanyId === ws.id;
              return (
                <div
                  key={ws.id}
                  onClick={() => setSelectedCompanyId(ws.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex items-center justify-between ${isSelected
                    ? "border-[#007aff] bg-blue-50/40 shadow-xs"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/30"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center transition-colors ${isSelected
                        ? "bg-[#007aff] text-white"
                        : "bg-gray-50 text-gray-400"
                        }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[170px]">
                        {ws.name
                          ?.split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </p>
                      {ws.role && (
                        <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-wide">
                          Scope: {ws.role.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center flex-shrink-0 ml-2">
                    {isSelected ? (
                      <div className="h-4.5 w-4.5 rounded-full bg-[#007aff] text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border border-gray-200" />
                    )}
                  </div>
                </div>
              );
            })}

            {workspaces.length === 0 && (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl col-span-full">
                <p className="text-xs text-gray-400 font-semibold">
                  No company workspaces are currently assigned to your account.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>

            <button
              onClick={handleConfirm}
              disabled={loading || !selectedCompanyId}
              className="flex-1 py-2.5 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-500/15 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Enter Dashboard <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} Agricom CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
