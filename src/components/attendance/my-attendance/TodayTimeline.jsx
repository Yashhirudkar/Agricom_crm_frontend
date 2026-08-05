import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentHrPolicy } from "@/store/entities/companyHrPoliciesSlice";
import { MapPin } from "lucide-react";
import VisualAttendanceTimeline from "@/components/attendance/VisualAttendanceTimeline";

export default function TodayTimeline({ activityLogs, getTimelineStyles, todayRecord }) {
  const checkIn = todayRecord?.checkInTime || (activityLogs?.find(l => l.actionType === "CHECK_IN")?.timestamp);
  const checkOut = todayRecord?.checkOutTime;
  const isWorking = todayRecord?.attendanceState === "WORKING";

  const hrPolicy = useSelector(selectCurrentHrPolicy);
  const defaultShiftStart = hrPolicy?.defaultShiftStartTime;
  const defaultShiftEnd = hrPolicy?.defaultShiftEndTime;
  const defaultBreakStart = hrPolicy?.defaultBreakStartTime;
  const defaultBreakEnd = hrPolicy?.defaultBreakEndTime;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Today's Timeline</h3>
      </div>

      {/* Visual Timeline Bar with Segmented Work & Break Time */}
      {checkIn && (
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100/80">
          <VisualAttendanceTimeline
            checkIn={checkIn}
            checkOut={checkOut}
            logs={activityLogs}
            isWorking={isWorking}
            shiftStart={todayRecord?.shift?.startTime || defaultShiftStart}
            shiftEnd={todayRecord?.shift?.endTime || defaultShiftEnd}
            breakStart={todayRecord?.shift?.breakStartTime || defaultBreakStart}
            breakEnd={todayRecord?.shift?.breakEndTime || defaultBreakEnd}
            showLabels={true}
          />
        </div>
      )}

      {/* Activity Logs */}
      <div className="relative pl-4 border-l-2 border-gray-100 ml-4 space-y-6">
        {activityLogs && activityLogs.length > 0 ? (
          (() => {
            const sortedLogs = [...activityLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            const firstCheckIn = sortedLogs.find(l => l.actionType === "CHECK_IN");
            const remainingLogs = sortedLogs.filter(l => l !== firstCheckIn);
            const latestLogs = remainingLogs.slice(-4);
            const displayLogs = [];
            if (firstCheckIn) displayLogs.push(firstCheckIn);
            displayLogs.push(...latestLogs);
            return displayLogs;
          })()
            .map((log, idx) => {
              const styles = getTimelineStyles(log.actionType);
              return (
                <div key={`log-${idx}`} className="relative">
                  <div
                    className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${styles.dot}`}
                  ></div>

                  <div className="flex flex-col gap-2 pl-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-800">
                        {new Date(log.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${styles.badgeBg} ${styles.badgeText}`}
                      >
                        {styles.label}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {styles.actionLabel}
                      </div>
                      {(log.actionType === "CHECK_IN" ||
                        log.actionType === "CHECK_OUT") && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> Location: Office
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-gray-500 text-sm ml-4 py-4 font-medium italic">
            No activity recorded for today.
          </div>
        )}
      </div>
    </div>
  );
}
