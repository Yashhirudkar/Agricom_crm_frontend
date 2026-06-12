"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import axiosClient from "@/lib/axios";
import { Shield, Sparkles, CheckCircle2, AlertTriangle, KeyRound, User } from "lucide-react";

function OnboardingForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteDetails, setInviteDetails] = useState(null);
  const [formData, setFormData] = useState({ name: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No invitation token found. Please check your link.");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/invitations/verify?token=${token}`)
      .then((res) => {
        setInviteDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Invalid or expired invitation token.");
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Name is required");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

    setError("");
    setSubmitting(true);

    try {
      await axiosClient.post("/invitations/accept", {
        token,
        name: formData.name,
        password: formData.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500">Verifying invitation...</p>
      </div>
    );
  }

  if (error && !inviteDetails) {
    return (
      <div className="text-center p-6 bg-red-50/50 border border-red-100 rounded-2xl">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-red-800">Invalid Link</h3>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-emerald-800">Welcome Onboard!</h3>
        <p className="text-xs text-emerald-600 mt-1.5">
          Your account has been set up successfully. You can now login.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 w-full py-2.5 bg-[#007aff] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
        >
          Proceed to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full text-[11px] font-bold text-[#007aff] mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          You've Been Invited
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">Complete Your Profile</h2>
        <p className="text-xs text-gray-400 mt-1">Join the organization workspace with your credentials.</p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Email Address</span>
          <span className="font-semibold text-gray-800">{inviteDetails?.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Client Tenant</span>
          <span className="font-semibold text-gray-800">{inviteDetails?.client?.name || "Client Workspace"}</span>
        </div>
        {inviteDetails?.role?.name && (
          <div className="flex justify-between">
            <span className="text-gray-400">Assigned Role</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Shield className="h-3 w-3 text-blue-500" />
              {inviteDetails?.role?.name}
            </span>
          </div>
        )}
        {inviteDetails?.companies && inviteDetails.companies.length > 0 && (
          <div className="flex flex-col gap-1 pt-1 border-t border-gray-200/50">
            <span className="text-gray-400">Assigned Workspaces</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {inviteDetails.companies.map((co, idx) => (
                <span key={co.id || idx} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded-md font-medium">
                  {co.name || co}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#007aff] transition-colors"
              placeholder="e.g. Rahul Sharma"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Create Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#007aff] transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#007aff] transition-colors"
              placeholder="Re-type password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-[#007aff] text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-500/20"
        >
          {submitting ? "Processing..." : "Complete Setup & Join"}
        </button>
      </form>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-6 md:p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/agri_logo.png"
            alt="Agricom CRM Logo"
            width={180}
            height={50}
            style={{ height: "auto" }}
            className="object-contain"
            priority
          />
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-500">Loading...</p>
          </div>
        }>
          <OnboardingForm />
        </Suspense>
      </div>
    </div>
  );
}
