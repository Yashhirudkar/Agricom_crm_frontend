"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIn,
  checkOut,
  fetchMyAttendance,
  requestCorrection,
  selectMyAttendance,
  selectAttendanceLoading,
  selectAttendanceError,
  clearAttendanceError,
  clearAttendanceSuccessMessage,
  selectAttendanceSuccess,
} from "@/store/entities/attendanceSlice";
import { fetchShifts, selectAllShifts } from "@/store/entities/shiftsSlice";
import {
  fetchAttendancePolicy,
  selectCurrentHrPolicy,
} from "@/store/entities/companyHrPoliciesSlice";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getFriendlyError } from "@/lib/errorMessages";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";

import TodayAttendanceCard from "@/components/attendance/my-attendance/TodayAttendanceCard";
import ThisWeekOverview from "@/components/attendance/my-attendance/ThisWeekOverview";
import TodayTimeline from "@/components/attendance/my-attendance/TodayTimeline";
import CorrectionModal from "@/components/attendance/my-attendance/CorrectionModal";

const calculateLiveTimer = (logs) => {
  if (!logs || logs.length === 0) return { h: "00", m: "00", s: "00" };

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  let totalMs = 0;
  let lastIn = null;

  for (const log of sortedLogs) {
    if (log.actionType === "CHECK_IN") {
      lastIn = new Date(log.timestamp);
    } else if (log.actionType === "CHECK_OUT" && lastIn) {
      totalMs += new Date(log.timestamp) - lastIn;
      lastIn = null;
    }
  }

  if (lastIn) {
    totalMs += new Date() - lastIn;
  }

  if (totalMs < 0) return { h: "00", m: "00", s: "00" };

  const h = Math.floor(totalMs / (1000 * 60 * 60));
  const m = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((totalMs % (1000 * 60)) / 1000);

  return {
    h: h.toString().padStart(2, "0"),
    m: m.toString().padStart(2, "0"),
    s: s.toString().padStart(2, "0"),
  };
};

export default function MyAttendancePage() {
  const dispatch = useDispatch();
  const myAttendance = useSelector(selectMyAttendance) || [];
  const shifts = useSelector(selectAllShifts) || [];
  const hrPolicy = useSelector(selectCurrentHrPolicy);
  const isLoading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);
  const success = useSelector(selectAttendanceSuccess);
  const activeCompanyId = useSelector(selectActiveCompanyId);

  // currentTime drives calculateLiveTimer via re-render; no direct JSX reference needed
  const [, setCurrentTime] = useState(0);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    date: "",
    expectedCheckIn: "",
    expectedCheckOut: "",
    reason: "",
  });
  const [correctionError, setCorrectionError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(fetchAttendancePolicy());
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    dispatch(
      fetchMyAttendance({
        startDate: startDate.toLocaleDateString("en-CA"),
        endDate: new Date().toLocaleDateString("en-CA"),
      })
    );
  }, [dispatch, activeCompanyId]);

  // Separate 1s tick to update the live work timer.
  // Using a counter (not Date) avoids allocating a new Date object on every tick.
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(n => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearAttendanceError());
        dispatch(clearAttendanceSuccessMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const format12h = (time24) => {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${mStr || "00"} ${period}`;
  };

  const defaultStartTime = hrPolicy?.defaultShiftStartTime ? format12h(hrPolicy.defaultShiftStartTime) : "";
  const defaultEndTime = hrPolicy?.defaultShiftEndTime ? format12h(hrPolicy.defaultShiftEndTime) : "";

  const todayStr = new Date().toLocaleDateString("en-CA");
  const todayRecord = myAttendance.find((r) => r.date === todayStr);
  const currentShift = todayRecord?.shift
    ? todayRecord.shift
    : todayRecord?.shiftId
    ? shifts.find((s) => s.id === todayRecord.shiftId)
    : {
      name: "General Shift",
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    };

  const handleAction = async (actionStr, type) => {
    if (actionLoading) return;
    setActionLoading(type);
    const action = actionStr === "checkIn" ? checkIn : checkOut;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const doAction = (coords = {}) =>
      dispatch(action(coords))
        .then((result) => {
          if (!result.error) {
            dispatch(
              fetchMyAttendance({
                startDate: startDate.toLocaleDateString("en-CA"),
                endDate: new Date().toLocaleDateString("en-CA"),
              })
            );
          }
          setActionLoading(null);
        })
        .catch(() => setActionLoading(null));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          doAction({
            locationLat: position.coords.latitude,
            locationLng: position.coords.longitude,
          }),
        () => doAction({}),
        { timeout: 5000 }
      );
    } else {
      doAction({});
    }
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    setCorrectionError("");
    if (!correctionForm.date || !correctionForm.reason) {
      setCorrectionError("Date and Reason are required.");
      return;
    }

    const checkInTime = (correctionForm.date && correctionForm.expectedCheckIn)
      ? `${correctionForm.date}T${correctionForm.expectedCheckIn}`
      : undefined;
    const checkOutTime = (correctionForm.date && correctionForm.expectedCheckOut)
      ? `${correctionForm.date}T${correctionForm.expectedCheckOut}`
      : undefined;

    dispatch(
      requestCorrection({
        requestType: "MISSED_PUNCH",
        date: correctionForm.date,
        checkInTime,
        checkOutTime,
        reason: correctionForm.reason,
      })
    ).then((result) => {
      if (!result.error) {
        setShowCorrectionModal(false);
        setCorrectionForm({
          date: "",
          expectedCheckIn: "",
          expectedCheckOut: "",
          reason: "",
        });
        setCorrectionError("");
      } else {
        setCorrectionError(getFriendlyError(result.payload));
      }
    });
  };

  const activityLogs = todayRecord?.logs || [];

  let isWorking = false;
  let firstIn = "--:-- --";

  if (activityLogs.length > 0) {
    const sortedLogs = [...activityLogs].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const checkIns = sortedLogs.filter((l) => l.actionType === "CHECK_IN");

    if (checkIns.length > 0) {
      firstIn = new Date(checkIns[0].timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    const lastAction = sortedLogs[sortedLogs.length - 1].actionType;
    if (lastAction === "CHECK_IN") {
      isWorking = true;
    }
  }

  const canCheckIn = !isWorking;
  const canCheckOut = isWorking;
  const timeObj = calculateLiveTimer(activityLogs);

  const totalSeconds =
    Number(timeObj.h) * 3600 + Number(timeObj.m) * 60 + Number(timeObj.s);
  const maxWorkSeconds = (() => {
    if (hrPolicy?.defaultShiftStartTime && hrPolicy?.defaultShiftEndTime) {
      const [sH, sM] = hrPolicy.defaultShiftStartTime.split(":").map(Number);
      const [eH, eM] = hrPolicy.defaultShiftEndTime.split(":").map(Number);
      const diffMins = eH * 60 + eM - (sH * 60 + sM);
      return Math.max(diffMins, 60) * 60; // at least 1h to avoid division by zero
    }
    return 9 * 60 * 60; // safe fallback only when policy not yet loaded
  })();
  const progress = Math.min(totalSeconds / maxWorkSeconds, 1);

  const dashOffset = 289 - progress * 289;

  const getTimelineStyles = (type) => {
    switch (type) {
      case "CHECK_IN":
        return {
          dot: "bg-[#007aff]",
          badgeBg: "bg-blue-50",
          badgeText: "text-[#007aff]",
          label: "IN",
          actionLabel: "Checked In",
        };
      case "CHECK_OUT":
        return {
          dot: "bg-rose-500",
          badgeBg: "bg-rose-100",
          badgeText: "text-rose-700",
          label: "OUT",
          actionLabel: "Checked Out",
        };
      case "BREAK_START":
        return {
          dot: "bg-yellow-400",
          badgeBg: "bg-yellow-100",
          badgeText: "text-yellow-700",
          label: "BREAK START",
          actionLabel: "Break Started",
        };
      case "BREAK_END":
        return {
          dot: "bg-emerald-500",
          badgeBg: "bg-emerald-100",
          badgeText: "text-emerald-700",
          label: "BREAK END",
          actionLabel: "Break Ended",
        };
      default:
        return {
          dot: "bg-gray-400",
          badgeBg: "bg-gray-100",
          badgeText: "text-gray-700",
          label: type,
          actionLabel: type,
        };
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {(error || success) && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${error
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-green-50 text-green-700 border border-green-100"
                }`}
            >
              {error ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{error || success}</span>
            </div>
          )}

          <TodayAttendanceCard
            isWorking={isWorking}
            timeObj={timeObj}
            firstIn={firstIn}
            currentShift={currentShift}
            handleAction={handleAction}
            actionLoading={actionLoading}
            canCheckIn={canCheckIn}
            canCheckOut={canCheckOut}
            dashOffset={dashOffset}
          />

          <ThisWeekOverview myAttendance={myAttendance} />

        </div>

        <div className="w-full lg:w-[400px] space-y-6">
          <TodayTimeline
            activityLogs={activityLogs}
            getTimelineStyles={getTimelineStyles}
            todayRecord={todayRecord}
          />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <h4 className="text-gray-900 font-bold mb-1">
                Forgot to punch?
              </h4>
              <p className="text-xs text-gray-500 mb-4 font-medium">
                Request for regularization if you forgot to check-in or check-out.
              </p>
            </div>
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="self-start px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Request Regularization
            </button>
          </div>


        </div>
      </div>

      <CorrectionModal
        showCorrectionModal={showCorrectionModal}
        setShowCorrectionModal={setShowCorrectionModal}
        handleCorrectionSubmit={handleCorrectionSubmit}
        correctionError={correctionError}
        correctionForm={correctionForm}
        setCorrectionForm={setCorrectionForm}
        isLoading={isLoading}
      />
    </div>
  );
}