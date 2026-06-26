import React from "react";

export default function PublicationHistory({
  historyList,
  loadingHistory,
  historyPage,
  historyTotalPages,
  setHistoryPage,
  fetchHistory
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
        Publication History Logs
      </div>

      {loadingHistory ? (
        <div className="text-center py-6 text-xs text-gray-400 font-medium animate-pulse">
          Fetching publication logs...
        </div>
      ) : historyList.length === 0 ? (
        <div className="text-center py-10 text-xs text-gray-400 font-medium italic">
          No configuration updates have been recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {historyList.map((hist) => (
              <div key={hist.id} className="p-4 bg-slate-50/20 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">
                      Version v{hist.schemaJson?.fields ? hist.configId : "Unknown"}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-bold">
                      ID: {hist.id}
                    </span>
                  </div>
                  {hist.changeNote && (
                    <p className="text-xs font-semibold text-gray-650 leading-relaxed italic bg-white p-2.5 rounded-lg border border-gray-100 border-dashed">
                      &quot;{hist.changeNote}&quot;
                    </p>
                  )}
                  <div className="text-[10px] text-gray-400 flex items-center gap-3">
                    <span className="font-semibold text-gray-500">
                      Editor: {hist.creator?.name || "System Seed / Unknown"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(hist.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* History Pagination */}
          {historyTotalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <button
                onClick={() => {
                  const nextP = Math.max(historyPage - 1, 1);
                  setHistoryPage(nextP);
                  fetchHistory(nextP);
                }}
                disabled={historyPage === 1}
                className="px-3 py-1.5 border border-gray-200 text-xs font-semibold rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Prev Page
              </button>
              <span className="text-xs font-bold text-gray-400">
                Page {historyPage} of {historyTotalPages}
              </span>
              <button
                onClick={() => {
                  const nextP = Math.min(historyPage + 1, historyTotalPages);
                  setHistoryPage(nextP);
                  fetchHistory(nextP);
                }}
                disabled={historyPage === historyTotalPages}
                className="px-3 py-1.5 border border-gray-200 text-xs font-semibold rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
