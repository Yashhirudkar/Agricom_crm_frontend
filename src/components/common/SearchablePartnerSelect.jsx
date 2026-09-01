"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, X, Loader2, User, Plus, Building2, Phone } from "lucide-react";
import axiosClient from "@/lib/axios";
import { resolvePhone } from "@/lib/contactUtils";

function SearchablePartnerSelect({
  label,
  required = false,
  value,
  onChange,
  onSelect,
  partnerRoleId,
  roleName,
  roleNames = [],
  mode = "entity", // "entity" | "contact"
  allowCreate = false,
  allowAddContact = false,
  onOpenCreatePartner,
  onOpenAddContact,
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
  const [partnerContacts, setPartnerContacts] = useState({}); // { [partnerId]: contactsArray }
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // In-memory cache for partner contacts across dropdown opens
  const partnerContactsCacheRef = useRef({});

  const inp =
    "w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white transition-all";
  const lbl = "block text-[11px] font-bold text-slate-700 mb-1.5";
  const errClass = "text-[10px] text-rose-500 font-semibold mt-1";

  const fetchedValueRef = useRef(null);
  const initialPartnersRef = useRef(initialPartners);
  useEffect(() => {
    initialPartnersRef.current = initialPartners;
  }, [initialPartners]);

  // Derive target role parameter string for backend API
  const roleNamesKey = Array.isArray(roleNames) ? roleNames.join(",") : roleNames || "";

  const getRoleParam = useCallback(() => {
    if (roleNamesKey) {
      return roleNamesKey;
    }
    if (roleName) return roleName;
    return undefined;
  }, [roleName, roleNamesKey]);

  const lastFetchKeyRef = useRef("");

  // Fetch partners options from backend
  const fetchOptions = useCallback(
    async (searchQuery = "") => {
      const activeRoleParam = getRoleParam();
      if (requireRoleId && !partnerRoleId && !activeRoleParam) {
        setOptions((initialPartnersRef.current || []).slice(0, 50));
        return;
      }

      const fetchKey = `${partnerRoleId || ""}_${activeRoleParam || ""}_${searchQuery.trim()}_${mode}`;
      if (lastFetchKeyRef.current === fetchKey && options.length > 0) {
        return;
      }
      lastFetchKeyRef.current = fetchKey;

      setLoading(true);
      try {
        const params = {
          limit: 50,
          ...(partnerRoleId ? { partnerRoleId } : {}),
          ...(activeRoleParam ? { roleName: activeRoleParam } : {}),
          ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
          ...(mode === "contact" ? { includeContacts: "true" } : {}),
        };
        const res = await axiosClient.get("/masters/partners/options", { params });
        const data = res.data?.data || res.data || [];
        const partnerList = Array.isArray(data) ? data.slice(0, 50) : [];
        setOptions(partnerList);

        // Populate contact details directly from batched response
        if (mode === "contact" && partnerList.length > 0) {
          const contactsMap = {};
          partnerList.forEach((p) => {
            if (p.contacts) {
              contactsMap[p.id] = p.contacts;
              partnerContactsCacheRef.current[p.id] = p.contacts;
            }
          });
          setPartnerContacts((prev) => ({ ...prev, ...contactsMap }));
        }
      } catch (e) {
        console.error("Failed to fetch partner options", e);
        const initList = initialPartnersRef.current || [];
        setOptions(initList.length > 0 ? initList.slice(0, 50) : []);
      } finally {
        setLoading(false);
      }
    },
    [partnerRoleId, getRoleParam, requireRoleId, mode, options.length]
  );

  // Fetch contacts for a specific partner (using in-memory cache)
  const fetchPartnerContacts = useCallback(async (pId) => {
    if (partnerContactsCacheRef.current[pId]) {
      setPartnerContacts((prev) => ({
        ...prev,
        [pId]: partnerContactsCacheRef.current[pId],
      }));
      return partnerContactsCacheRef.current[pId];
    }

    setLoadingContacts((prev) => ({ ...prev, [pId]: true }));
    try {
      const res = await axiosClient.get(`/masters/partners/${pId}`);
      const partnerData = res.data?.data || res.data || {};
      const contacts = partnerData.contacts || [];
      partnerContactsCacheRef.current[pId] = contacts;
      setPartnerContacts((prev) => ({ ...prev, [pId]: contacts }));
      return contacts;
    } catch (err) {
      console.error(`Failed to fetch contacts for partner ${pId}`, err);
      partnerContactsCacheRef.current[pId] = [];
      setPartnerContacts((prev) => ({ ...prev, [pId]: [] }));
      return [];
    } finally {
      setLoadingContacts((prev) => ({ ...prev, [pId]: false }));
    }
  }, []);

  // Initialize options with initialPartners if available
  useEffect(() => {
    if (initialPartners && initialPartners.length > 0) {
      setOptions(initialPartners.slice(0, 50));
    }
  }, [initialPartners]);

  // Sync selected partner name when `value` changes
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
            if (res.data?.contacts) {
              partnerContactsCacheRef.current[numValue] = res.data.contacts;
              setPartnerContacts((prev) => ({ ...prev, [numValue]: res.data.contacts }));
            }
          }
        })
        .catch(() => {
          fetchedValueRef.current = null;
        });
    }
  }, [value, options, initialPartners]);

  // Debounced search with character length rule (>= 2 or empty)
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = search.trim();
    if (trimmed.length > 0 && trimmed.length < 2) return;

    const delay = search === "" ? 0 : 300;
    const timer = setTimeout(() => {
      fetchOptions(search);
    }, delay);

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
      partnerContactsCacheRef.current = {};
      lastFetchKeyRef.current = "";
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelectPartnerEntity = (partner) => {
    const pName = partner.entityName || partner.name;
    setSelectedName(pName);
    onChange(partner.id);
    if (onSelect) {
      onSelect({
        partnerId: partner.id,
        partnerName: pName,
        contactId: null,
        contactName: "",
        phoneNumber: "",
      });
    }
    setIsOpen(false);
  };

  const handleSelectContactItem = (partner, contact) => {
    const pName = partner.entityName || partner.name;
    const phone = resolvePhone(contact);
    setSelectedName(pName);
    onChange(partner.id);
    if (onSelect) {
      onSelect({
        partnerId: partner.id,
        partnerName: pName,
        contactId: contact.id,
        contactName: contact.name || "",
        phoneNumber: phone,
      });
    }
    setIsOpen(false);
  };

  const getPartnerInitials = (name) => {
    if (!name) return "TP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className={lbl}>
            {label}{" "}
            {required ? (
              <span className="text-rose-500">*</span>
            ) : optionalText ? (
              <span className="text-[10px] text-slate-400">({optionalText})</span>
            ) : null}
          </label>
          {allowCreate && onOpenCreatePartner && (
            <button
              type="button"
              onClick={onOpenCreatePartner}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-3 w-3" /> New Partner
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={`${inp} text-left flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
            error ? "border-rose-300" : ""
          }`}
        >
          <span className={`truncate ${selectedName ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}`}>
            {selectedName || placeholder}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />}
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-[100] mt-1 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 space-y-2 max-h-[380px] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Search Bar */}
            <div className="relative flex items-center shrink-0">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-7 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Scrollable Results */}
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 rounded-xl">
              {loading && options.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Searching transport partners...
                </div>
              ) : options.length === 0 ? (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-slate-400 font-medium">No transport partner found</p>
                  {allowCreate && onOpenCreatePartner && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenCreatePartner();
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Create New Partner
                    </button>
                  )}
                </div>
              ) : mode === "contact" ? (
                /* MULTI-CONTACT GROUPED MODE (SAP/Flexport Standard) */
                options.map((partner) => {
                  const contacts = partnerContacts[partner.id] || [];
                  const isContactLoading = loadingContacts[partner.id];

                  return (
                    <div key={partner.id} className="py-1">
                      {/* Company Header */}
                      <div className="px-3 py-1.5 bg-slate-50/80 border-y border-slate-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleSelectPartnerEntity(partner)}
                          className="flex items-center gap-2 text-left font-extrabold text-slate-900 hover:text-blue-600 transition-colors group cursor-pointer"
                          title="Select Partner Entity directly"
                        >
                          <div className="h-5 w-5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                            {getPartnerInitials(partner.entityName)}
                          </div>
                          <span>{partner.entityName}</span>
                        </button>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Partner
                        </span>
                      </div>

                      {/* Contact Items List */}
                      <div className="divide-y divide-slate-50">
                        {isContactLoading && (!contacts || contacts.length === 0) ? (
                          <div className="px-4 py-2 text-[11px] text-slate-400 flex items-center gap-2 italic">
                            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                            Loading contacts...
                          </div>
                        ) : contacts.length > 0 ? (
                          contacts.map((c) => {
                            const phone = resolvePhone(c);
                            return (
                              <button
                                key={c.id || c.name}
                                type="button"
                                onClick={() => handleSelectContactItem(partner, c)}
                                className="w-full text-left px-4 py-2 hover:bg-blue-50/70 transition-colors flex items-center justify-between text-xs group cursor-pointer"
                              >
                                <div>
                                  <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-blue-700">
                                    <User className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                    <span>{c.name}</span>
                                    {c.isPrimary && (
                                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                                        ⭐ Primary
                                      </span>
                                    )}
                                  </div>
                                  {c.designation && (
                                    <span className="text-[10px] text-slate-500 font-medium block ml-5.5">
                                      {c.designation}
                                    </span>
                                  )}
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-[11px] font-mono font-bold text-slate-700 group-hover:text-blue-700">
                                    {phone ? `📞 ${phone}` : "No phone"}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between bg-slate-50/40">
                            <span className="italic">No contacts available</span>
                            {allowAddContact && onOpenAddContact && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsOpen(false);
                                  onOpenAddContact(partner);
                                }}
                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="h-3 w-3" /> Add Contact
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* STANDARD ENTITY MODE */
                options.map((p) => {
                  const pName = p.name || p.entityName;
                  const isSelected = Number(value) === Number(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPartnerEntity(p)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "hover:bg-slate-50 text-slate-700 font-medium"
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
