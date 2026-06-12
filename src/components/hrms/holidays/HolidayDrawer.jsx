"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Info, Clock, Edit2, Trash2 } from "lucide-react";
import HolidayForm from "./HolidayForm";
import { format } from "date-fns";

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function HolidayDrawer({ isOpen, onClose, holiday, onSave, onDelete, canManage }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // If we open and no holiday is selected, we are creating a new one
      setIsEditing(!holiday);
    }
  }, [isOpen, holiday]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const renderViewMode = () => {
    if (!holiday) return null;

    return (
      <div className="p-6 space-y-8">
        {/* Overview */}
        <section>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg text-gray-700 font-semibold flex items-center gap-2">
              <Info size={18} className="text-blue-600" /> Overview
            </h3>
            {canManage && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit Holiday"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(holiday.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete Holiday"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Name</span>
              <p className="font-medium text-gray-900">{holiday.title}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Date</span>
              <p className="font-medium text-gray-900">{format(parseLocalDate(holiday.holidayDate), "dd MMM yyyy")}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Type</span>
              <p className="font-medium text-gray-900">{holiday.holidayType}</p>
            </div>
            {holiday.description && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Description</span>
                <p className="text-sm text-gray-700 mt-1">{holiday.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* Scope */}
        <section>
          <h3 className="text-lg text-gray-700 font-semibold flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-blue-600" /> Scope
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Applies To</span>
            {holiday.holidayCompanies && holiday.holidayCompanies.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {holiday.holidayCompanies.map((hc) => (
                  <span
                    key={hc.companyId}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {hc.company?.name || `Company ID: ${hc.companyId}`}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-medium text-gray-900">Entire Client (All Companies)</p>
            )}
          </div>
        </section>

        {/* Activity */}
        <section>
          <h3 className="text-lg text-gray-700 font-semibold flex items-center gap-2 mb-4">
            <Clock size={18} className="text-blue-600" /> Activity
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Created</span>
              <p className="text-sm text-gray-700">
                By {holiday.creator?.name || "System"} on {format(new Date(holiday.createdAt), "dd MMM yyyy")}
              </p>
            </div>
            {holiday.updatedAt && holiday.updatedAt !== holiday.createdAt && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</span>
                <p className="text-sm text-gray-700">
                  By {holiday.updater?.name || "System"} on {format(new Date(holiday.updatedAt), "dd MMM yyyy")}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? (holiday ? "Edit Holiday" : "Create Holiday") : "Holiday Details"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="h-[calc(100vh-73px)] overflow-y-auto">
          {isEditing ? (
            <div className="p-6">
              <HolidayForm
                holiday={holiday}
                onSave={onSave}
                onCancel={() => (holiday ? setIsEditing(false) : handleClose())}
              />
            </div>
          ) : (
            renderViewMode()
          )}
        </div>
      </div>
    </>
  );
}
