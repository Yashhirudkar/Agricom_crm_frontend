"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import HolidayCalendar from "../../../components/hrms/holidays/HolidayCalendar";
import HolidayDrawer from "../../../components/hrms/holidays/HolidayDrawer";
import UpcomingHolidaysWidget from "../../../components/hrms/holidays/UpcomingHolidaysWidget";
import { getHolidays, deleteHoliday } from "../../../lib/api/holidays";

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const isSuperOrClientAdmin = 
    user?.type === "super_admin" ||
    user?.type === "client_admin" ||
    user?.roles?.some(r => r.name === "Super Admin" || r.name === "Client Admin");

  const canCreate = isSuperOrClientAdmin || user?.permissions?.includes("holidays:create");
  const canUpdate = isSuperOrClientAdmin || user?.permissions?.includes("holidays:update");
  const canDelete = isSuperOrClientAdmin || user?.permissions?.includes("holidays:delete");

  const fetchHolidays = async () => {
    try {
      const res = await getHolidays({ limit: 1000 });
      setHolidays(res.data || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleCreate = () => {
    setSelectedHoliday(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    setIsDrawerOpen(false);
    fetchHolidays();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this holiday?")) {
      try {
        await deleteHoliday(id);
        setIsDrawerOpen(false);
        fetchHolidays();
      } catch (error) {
        console.error("Error deleting holiday:", error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-slate-600 font-extrabold tracking-tight flex items-center gap-2.5">
            Holiday Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage public, regional, festival and company holidays across all offices.</p>
        </div>
        {canCreate && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus size={16} className="stroke-[3]" />
            Create Holiday
          </button>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col">
          <HolidayCalendar holidays={holidays} onHolidayClick={handleEdit} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingHolidaysWidget />
        </div>
      </div>

      <HolidayDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        holiday={selectedHoliday}
        onSave={handleSave}
        onDelete={handleDelete}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  );
}
