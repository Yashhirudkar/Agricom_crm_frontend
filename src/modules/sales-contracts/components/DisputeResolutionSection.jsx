"use client";
import React, { useState } from "react";
import { Scale, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

const DEFAULT_DISPUTE_RESOLUTION = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text', text: 'ALL DISPUTES AND DISAGREEMENTS ARISING BETWEEN THE PARTIES IN CONNECTION WITH THIS CONTRACT SHALL BE RESOLVED THROUGH MUTUAL NEGOTIATIONS. IF A MUTUALLY ACCEPTABLE RESOLUTION CANNOT BE REACHED THEN SHALL BE REFERRED TO AND RESOLVED BY ARBITRATION IN ACCORDANCE WITH THE ARBITRATION RULES OF THE GRAIN AND FEED TRADE ASSOCIATION (GAFTA), IN FORCE AT THE DATE OF THIS CONTRACT. THE SEAT OF ARBITRATION SHALL BE LONDON, ENGLAND. THE LANGUAGE OF ARBITRATION SHALL BE ENGLISH. THE DECISION OF THE ARBITRATORS SHALL BE FINAL AND BINDING ON THE PARTIES OR PARTY RESERVES THE RIGHT TO SUBMIT THE MATTER FOR RESOLUTION TO THE APPROPRIATE JUDICIAL AUTHORITIES AT THE SELLERS LOCATION'
        }
      ]
    },
  ]
};

export default function DisputeResolutionSection({ form, setForm, isView }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Fallback to default if empty
  const value = form.disputeResolution || DEFAULT_DISPUTE_RESOLUTION;

  const handleChange = (newVal) => {
    setForm((f) => ({ ...f, disputeResolution: newVal }));
  };

  const handleReset = () => {
    setForm((f) => ({ ...f, disputeResolution: DEFAULT_DISPUTE_RESOLUTION }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
          <Scale className="h-3.5 w-3.5 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-900">Dispute Resolution</h2>
          <p className="text-[10px] text-gray-400">
            {isView
              ? "Arbitration and jurisdiction clauses"
              : "Set Arbitration, Jurisdiction, and Applicable Law"}
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
            placeholder="Type your dispute resolution and arbitration clauses here..."
          />
        </div>
      )}
    </div>
  );
}
