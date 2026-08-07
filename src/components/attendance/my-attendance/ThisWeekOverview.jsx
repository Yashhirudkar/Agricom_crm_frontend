import React from "react";

export default function ThisWeekOverview({ myAttendance }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">This Week Overview</h3>
      <div className="flex justify-between items-center overflow-x-auto gap-2 pb-2">
        {Array.from({ length: 7 })
          .map((_, i) => {
            const d = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const day = d.getDay() === 0 ? 7 : d.getDay();
            d.setDate(d.getDate() - day + i + 1); // Get Monday-Sunday of current week
            d.setHours(0, 0, 0, 0);

            const dateStr = d.toLocaleDateString("en-CA");
            const isToday = dateStr === new Date().toLocaleDateString("en-CA");
            const shiftWeeklyOffs = myAttendance[0]?.shift?.weeklyOffDays || [0, 6];
            const isWeekend = shiftWeeklyOffs.includes(d.getDay());

            const dayRecord = myAttendance.find((r) => r.date === dateStr);
            let status = "-";
            let color = "text-gray-400 bg-gray-50 border-gray-100";

            if (isWeekend && !dayRecord) {
              status = "WE";
              color = "text-slate-500 bg-slate-50 border-slate-100";
            } else if (dayRecord) {
              const recStatus = dayRecord.employeeStatus || (dayRecord.attendanceStatus === "LATE" ? "PRESENT" : dayRecord.attendanceStatus);
              switch (recStatus) {
                case "PRESENT":
                  status = "P";
                  color = "text-emerald-500 bg-emerald-50 border-emerald-100";
                  break;
                case "HALF_DAY":
                  status = "H";
                  color = "text-amber-500 bg-amber-50 border-amber-100";
                  break;
                case "ABSENT":
                  status = "A";
                  color = "text-rose-500 bg-rose-50 border-rose-100";
                  break;
                case "ON_LEAVE":
                  status = "L";
                  color = "text-purple-500 bg-purple-50 border-purple-100";
                  break;
                case "WEEK_OFF":
                  status = "WE";
                  color = "text-slate-500 bg-slate-50 border-slate-100";
                  break;
                case "HOLIDAY":
                  status = "HO";
                  color = "text-blue-500 bg-blue-50 border-blue-100";
                  break;
                default:
                  if (dayRecord.attendanceState === "WORKING") {
                    status = "W";
                    color = "text-[#007aff] bg-blue-50 border-blue-200";
                  }
              }
            } else if (d < today) {
              // Past weekday with no record = Absent
              status = "A";
              color = "text-rose-500 bg-rose-50 border-rose-100";
            } else {
              // Future dates
              status = "-";
              color = "text-gray-400 bg-gray-50 border-gray-100";
            }

            return {
              day: d
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase(),
              date: d.getDate().toString(),
              status,
              color,
              active: isToday,
            };
          })
          .map((item, idx) => (
            <div
              key={`day-${idx}`}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl min-w-[70px] transition-colors ${
                item.active
                  ? "border-2 border-[#007aff] bg-blue-50/50"
                  : "border border-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">
                {item.day}
              </span>
              <span
                className={`text-xl font-bold mb-3 ${
                  item.active ? "text-[#007aff]" : "text-gray-800"
                }`}
              >
                {item.date}
              </span>
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-extrabold border ${item.color}`}
              >
                {item.status}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
