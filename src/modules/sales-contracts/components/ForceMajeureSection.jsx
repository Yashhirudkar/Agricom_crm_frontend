"use client";
import React, { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

const DEFAULT_FORCE_MAJEURE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'AS PER CLAUSE 18 OF THE GAFTA CONTRACT NO. 120 WITH LOGICAL CHANGES NEITHER PARTY SHALL BEAR RESPONSIBILITY FOR THE COMPLETE OR PARTIAL NON-PERFORMANCE OF ANY OF ITS OBLIGATIONS, IF THE NON-PERFORMANCE RESULTS FROM SUCH CIRCUMSTANCES AS FLOOD, FIRE, EARTHQUAKE AND OTHER ACTS OF GOD AS WELL AS WAR, MILITARY OPERATIONS, BLOCKADE, ACTS OR ACTIONS OF STATE AUTHORITIES OR ANY OTHER CIRCUMSTANCES BEYOND PARTIES CONTROL THAT HAVE ARISEN AFTER THE CONCLUSION OF THE CONTRACT. IN THIS CASE THE TIME STIPULATED FOR THE PERFORMANCE OF AN OBLIGATION UNDER CONTRACT IS EXTENDED CORRESPONDINGLY THE PERIOD OF TIME OF ACTION OF THESE CIRCUMSTANCES AND THEIR CONSEQUENCES. THE PARTY FOR WHICH THE PERFORMANCE OF OBLIGATION BECAME IMPOSSIBLE SHALL IMMEDIATELY NOTIFY IN WRITTEN FORM THE OTHER PARTY OF THE BEGINNING, EXPECTED TIME OF DURATION AND CESSATION OF ABOVE CIRCUMSTANCES. CERTIFICATE OF A CHAMBER OF COMMERCE AN INDUSTRY OR OTHER COMPETENT AUTHORITY SHALL BE A SUFFICIENT PROOF OF COMMENCEMENT AND CESSATION OF THE ABOVE CIRCUMSTANCES.' },
      ]
    },
  ]
};

export default function ForceMajeureSection({ form, setForm, isView }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Fallback to default if empty
  const value = form.forceMajeure || DEFAULT_FORCE_MAJEURE;

  const handleChange = (newVal) => {
    setForm((f) => ({ ...f, forceMajeure: newVal }));
  };

  const handleReset = () => {
    setForm((f) => ({ ...f, forceMajeure: DEFAULT_FORCE_MAJEURE }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="h-3.5 w-3.5 text-orange-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-900">Force Majeure</h2>
          <p className="text-[10px] text-gray-400">
            {isView
              ? "Exemptions from liability for unforeseen events"
              : "Set Force Majeure conditions (Act of God, War, Pandemic)"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5">
          {!isView && (
            <div className="flex justify-end gap-2 mb-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Reset to Company Default Template"
              >
                <RotateCcw className="h-3 w-3" /> Default Template
              </button>
            </div>
          )}

          <RichTextEditor
            value={value}
            onChange={handleChange}
            editable={!isView}
            outputFormat="json"
            placeholder="Type your force majeure clause here..."
          />
        </div>
      )}
    </div>
  );
}
