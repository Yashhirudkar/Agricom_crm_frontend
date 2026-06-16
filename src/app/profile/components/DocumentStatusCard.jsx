"use client";
import { FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function DocumentStatusCard({ documents }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VERIFIED':
        return "Verified by HR";
      case 'REJECTED':
        return "Action Required";
      default:
        return "Pending Verification";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 delay-300">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            Official Documents
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 ml-12">Read-only view. Managed by HR.</p>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div key={idx} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4 transition-all hover:border-slate-200 hover:shadow-sm">
                <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-100">
                  {getStatusIcon(doc.verificationStatus)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{doc.documentType?.replace(/_/g, ' ')}</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{getStatusText(doc.verificationStatus)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No official documents found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
