"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchShifts, createShift, updateShift, deleteShift, 
  selectAllShifts, selectShiftsLoading 
} from "@/store/entities/shiftsSlice";
import {
  fetchAttendancePolicy,
  selectCurrentHrPolicy,
} from "@/store/entities/companyHrPoliciesSlice";
import { Plus, Edit2, Trash2, Clock, Calendar } from "lucide-react";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";

export default function ShiftsPage() {
  const dispatch = useDispatch();
  const shifts = useSelector(selectAllShifts) || [];
  const hrPolicy = useSelector(selectCurrentHrPolicy);
  const isLoading = useSelector(selectShiftsLoading);
  const activeCompanyId = useSelector(selectActiveCompanyId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  
  const defaultStartTime = hrPolicy?.defaultShiftStartTime || "";
  const defaultEndTime = hrPolicy?.defaultShiftEndTime || "";
  const defaultBreakMins = hrPolicy?.defaultBreakMinutes ?? 30;
  const defaultGraceMins = hrPolicy?.lateComingGraceMinutes ?? 5;

  const [formData, setFormData] = useState({
    name: "",
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    breakMinutes: defaultBreakMins,
    gracePeriodMinutes: defaultGraceMins,
    isNightShift: false,
    weeklyOffDays: [0, 6] // Sun, Sat
  });

  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(fetchAttendancePolicy());
  }, [dispatch, activeCompanyId]);

  const openModal = (shift = null) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        breakMinutes: shift.breakMinutes || 0,
        gracePeriodMinutes: shift.gracePeriodMinutes || 0,
        isNightShift: shift.isNightShift || false,
        weeklyOffDays: shift.weeklyOffDays || []
      });
    } else {
      setEditingShift(null);
      setFormData({
        name: "",
        startTime: hrPolicy?.defaultShiftStartTime || "",
        endTime: hrPolicy?.defaultShiftEndTime || "",
        breakMinutes: hrPolicy?.defaultBreakMinutes ?? 30,
        gracePeriodMinutes: hrPolicy?.lateComingGraceMinutes ?? 5,
        isNightShift: false,
        weeklyOffDays: [0, 6]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingShift) {
      await dispatch(updateShift({ id: editingShift.id, data: formData }));
    } else {
      await dispatch(createShift(formData));
    }
    setIsModalOpen(false);
    dispatch(fetchShifts());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this shift?")) {
      await dispatch(deleteShift(id));
      dispatch(fetchShifts());
    }
  };

  const formatDays = (daysArray) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysArray.map(d => days[d]).join(', ');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-gray-500">Create and manage working shifts for employees.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm">
            <Plus className="w-4 h-4" /> Create Shift
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shifts.map(shift => (
          <div key={shift.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{shift.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openModal(shift)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(shift.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                {shift.startTime} - {shift.endTime}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Break Duration</span>
                <span className="font-medium text-gray-900">{shift.breakMinutes} mins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Grace Period</span>
                <span className="font-medium text-gray-900">{shift.gracePeriodMinutes} mins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Night Shift</span>
                <span className="font-medium text-gray-900">{shift.isNightShift ? 'Yes' : 'No'}</span>
              </div>
              <div className="pt-3 border-t border-gray-50 flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="block text-xs text-gray-500">Weekly Off Days</span>
                  <span className="text-sm font-medium text-gray-900">{formatDays(shift.weeklyOffDays || [])}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingShift ? 'Edit Shift' : 'Create New Shift'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Morning Shift" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Break (Minutes)</label>
                  <input type="number" value={formData.breakMinutes} onChange={e => setFormData({...formData, breakMinutes: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (Minutes)</label>
                  <input type="number" value={formData.gracePeriodMinutes} onChange={e => setFormData({...formData, gracePeriodMinutes: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekly Off Days</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                    const isChecked = formData.weeklyOffDays.includes(idx);
                    return (
                      <label key={day} className="flex items-center gap-1.5 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium cursor-pointer border border-gray-200 text-gray-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let updated;
                            if (e.target.checked) {
                              updated = [...formData.weeklyOffDays, idx].sort();
                            } else {
                              updated = formData.weeklyOffDays.filter(d => d !== idx);
                            }
                            setFormData({ ...formData, weeklyOffDays: updated });
                          }}
                          className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        {day}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="isNightShift" checked={formData.isNightShift} onChange={e => setFormData({...formData, isNightShift: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <label htmlFor="isNightShift" className="text-sm font-medium text-gray-700">This is a night shift (crosses midnight)</label>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
