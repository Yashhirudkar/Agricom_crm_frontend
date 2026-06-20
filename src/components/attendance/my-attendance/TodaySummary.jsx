import React from "react";
import { Clock, History, AlertCircle } from "lucide-react";

export default function TodaySummary({ timeObj, todayRecord }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <Clock className="w-5 h-5 text-[#007aff]" /> Working Hours
          </div>
          <div className="font-bold text-gray-900 text-sm">
            {timeObj.h}h {timeObj.m}m
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <History className="w-5 h-5 text-gray-400" /> Break Hours
          </div>
          <div className="font-bold text-gray-900 text-sm">00h 30m</div>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <AlertCircle className="w-5 h-5 text-red-400" /> Late By
          </div>
          <div className="font-bold text-red-500 text-sm">
            {todayRecord?.lateMinutes > 0
              ? `${todayRecord.lateMinutes}m`
              : "00h 00m"}
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <Clock className="w-5 h-5 text-gray-400" /> Overtime
          </div>
          <div className="font-bold text-gray-900 text-sm">00h 00m</div>
        </div>
      </div>
    </div>
  );
}
