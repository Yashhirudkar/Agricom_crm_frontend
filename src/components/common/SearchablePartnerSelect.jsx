"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, X, Loader2 } from "lucide-react";
import axiosClient from "@/lib/axios";

function SearchablePartnerSelect({
  label,
  required = false,
  value,
  onChange,
  partnerRoleId,
  initialPartners = [],
  disabled = false,
  error,
  placeholder = "Select Partner",
  searchPlaceholder = "Search by name, phone...",
  optionalText,
  requireRoleId = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const dropdownRef = useRef(null);

  const inp =
    "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const errClass = "text-[10px] text-red-500 mt-1";

  const fetchedValueRef = useRef(null);

  // Fetch options from backend options endpoint
  const fetchOptions = useCallback(
    async (searchQuery = "") => {
      if (requireRoleId && !partnerRoleId) {
        setOptions(initialPartners.slice(0, 10));
        return;
      }
      setLoading(true);
      try {
        const params = {
          limit: 10,
          ...(partnerRoleId ? { partnerRoleId } : {}),
          ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
        };
        const res = await axiosClient.get("/masters/partners/options", { params });
        const data = res.data?.data || res.data || [];
        setOptions(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (e) {
        console.error("Failed to fetch partner options", e);
        setOptions(initialPartners.length > 0 ? initialPartners.slice(0, 10) : []);
      } finally {
        setLoading(false);
      }
    },
    [partnerRoleId, initialPartners, requireRoleId]
  );

  // Initialize options with initialPartners if available (limit to 10)
  useEffect(() => {
    if (initialPartners && initialPartners.length > 0) {
      setOptions(initialPartners.slice(0, 10));
    }
  }, [initialPartners]);

  // Sync selected partner name when `value` changes or options update
  useEffect(() => {
    if (!value) {
      setSelectedName("");
      fetchedValueRef.current = null;
      return;
    }

    const numValue = Number(value);
    const foundInOptions = options.find((p) => Number(p.id) === numValue);
    const foundInInitial = initialPartners.find((p) => Number(p.id) === numValue);
    const item = foundInOptions || foundInInitial;

    if (item) {
      setSelectedName(item.name || item.entityName || "");
      fetchedValueRef.current = numValue;
    } else if (fetchedValueRef.current !== numValue) {
      fetchedValueRef.current = numValue;
      axiosClient
        .get(`/masters/partners/${numValue}`)
        .then((res) => {
          if (res.data?.entityName || res.data?.name) {
            setSelectedName(res.data.entityName || res.data.name);
          }
        })
        .catch(() => {
          fetchedValueRef.current = null;
        });
    }
  }, [value, options, initialPartners]);

  // Debounced search when dropdown is open and user types
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      fetchOptions(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, isOpen, fetchOptions]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      fetchOptions(search);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className={lbl}>
          {label}{" "}
          {required ? (
            <span className="text-red-500">*</span>
          ) : optionalText ? (
            <span className="text-[10px] text-gray-400">({optionalText})</span>
          ) : null}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={`${inp} text-left flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
            error ? "border-red-300" : ""
          }`}
        >
          <span className={`truncate ${selectedName ? "text-gray-900 font-medium" : "text-gray-400"}`}>
            {selectedName || placeholder}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-gray-400">
            {loading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
            <ChevronDown className="h-3 w-3" />
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#007aff]"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {loading && options.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  Loading partners...
                </div>
              ) : options.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-400 font-medium">
                  No partners found
                </div>
              ) : (
                options.slice(0, 10).map((p) => {
                  const pName = p.name || p.entityName;
                  const isSelected = Number(value) === Number(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onChange(p.id);
                        setSelectedName(pName);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="truncate">{pName}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className={errClass}>{error}</p>}
    </div>
  );
}

export default React.memo(SearchablePartnerSelect);
