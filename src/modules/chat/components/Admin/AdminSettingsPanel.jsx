"use client";

import React, { useState } from "react";
import { Sliders, Shield, FileText, Check, Save } from "lucide-react";
import { toast } from "sonner";
import { useChatPolicyQuery } from "@/modules/chat/queries/chat.queries";
import { useSaveDraftMutation } from "@/modules/chat/mutations/chat.mutations";
import axiosClient from "@/lib/axios";

export default function AdminSettingsPanel({ companyId, onClose }) {
  const { data: policyData, refetch } = useChatPolicyQuery();
  const policy = policyData?.data || {
    allowVoice: true,
    allowVideo: true,
    allowGif: true,
    allowPoll: true,
    allowExport: true,
    maxUploadSize: 104857600,
    retentionDays: 365,
    legalHoldActive: false,
  };

  const [allowVoice, setAllowVoice] = useState(policy.allowVoice);
  const [allowPoll, setAllowPoll] = useState(policy.allowPoll);
  const [legalHoldActive, setLegalHoldActive] = useState(policy.legalHoldActive);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePolicy = async () => {
    setIsSaving(true);
    try {
      await axiosClient.put("/chat/policies", {
        allowVoice,
        allowPoll,
        legalHoldActive,
      });
      toast.success("Policy configurations updated.");
      refetch();
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-[360px] h-full flex flex-col bg-white border-l border-slate-200 text-slate-700">
      <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-500" />
          <span>Governance & Policies</span>
        </h3>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Toggle options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Allow Voice Notes</span>
            <input 
              type="checkbox" 
              checked={allowVoice} 
              onChange={(e) => setAllowVoice(e.target.checked)}
              className="h-4 w-4 bg-white border-slate-300 rounded focus:ring-blue-500 text-blue-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Allow Channel Polls</span>
            <input 
              type="checkbox" 
              checked={allowPoll} 
              onChange={(e) => setAllowPoll(e.target.checked)}
              className="h-4 w-4 bg-white border-slate-300 rounded focus:ring-blue-500 text-blue-600"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-amber-500" />
                <span>Active Legal Hold</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Suspends automated message cleanup</p>
            </div>
            <input 
              type="checkbox" 
              checked={legalHoldActive} 
              onChange={(e) => setLegalHoldActive(e.target.checked)}
              className="h-4 w-4 bg-white border-slate-300 rounded focus:ring-blue-500 text-blue-600"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSavePolicy}
          disabled={isSaving}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isSaving ? "Saving..." : "Save Policy"}</span>
        </button>
      </div>
    </div>
  );
}
