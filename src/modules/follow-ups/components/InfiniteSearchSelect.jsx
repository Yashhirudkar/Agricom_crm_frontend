import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { ChevronDown, Search, X, Loader2 } from 'lucide-react';
import axiosClient from '@/lib/axios';

/**
 * InfiniteSearchSelect
 *
 * A generic, server-side paginated searchable dropdown with:
 * - 300ms debounced search → resets to page 1 on new query
 * - IntersectionObserver on a sentinel element → loads next page on scroll-to-bottom
 * - Simple windowed rendering (max 60 items visible, older ones sliced off)
 * - Click-outside to close
 *
 * Props:
 *   endpoint       — API path, e.g. "/masters/partners/options"
 *   queryParams    — Additional static query params (e.g. { roleName: "Importer" })
 *   getOptionLabel — (item) => string display label
 *   getOptionValue — (item) => string|number unique key
 *   label          — Field label text
 *   required       — Shows red asterisk
 *   value          — Controlled selected value (the return of getOptionValue)
 *   onChange       — (item|null) => void
 *   placeholder    — Trigger button placeholder
 *   error          — Validation error string
 *   disabled       — Disables the control
 */
function InfiniteSearchSelect({
  endpoint,
  queryParams = {},
  getOptionLabel = (item) => item?.name || item?.entityName || String(item?.id || ''),
  getOptionValue = (item) => item?.id,
  label,
  required = false,
  value,
  onChange,
  placeholder = 'Select...',
  error,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const lastFetchedRef = useRef({ search: null, page: null });

  // ─── Fetch helpers ────────────────────────────────────────────────────────

  const fetchPage = useCallback(
    async (searchQuery, pageNum, isAppend = false) => {
      if (isAppend) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = {
          ...queryParams,
          search: searchQuery.trim() || undefined,
          page: pageNum,
          limit: 15,
        };
        const res = await axiosClient.get(endpoint, { params });
        const payload = res.data?.data || res.data || {};

        // Support both paginated envelope and flat array
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.data)
          ? payload.data
          : [];
        const pages = payload.totalPages || 1;

        setTotalPages(pages);
        setOptions((prev) => {
          const next = isAppend ? [...prev, ...items] : items;
          // Simple windowing: keep last 60 items
          return next.slice(-60);
        });
      } catch (e) {
        console.error('[InfiniteSearchSelect] fetch error:', e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, JSON.stringify(queryParams)],
  );

  // ─── Debounced search — resets to page 1 ─────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchPage(search, 1, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, isOpen, fetchPage]);

  // ─── Load more when page increments ──────────────────────────────────────

  useEffect(() => {
    if (!isOpen || page === 1) return;
    fetchPage(search, page, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ─── IntersectionObserver on sentinel to load next page ──────────────────

  useEffect(() => {
    if (!isOpen) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [isOpen, loadingMore, page, totalPages]);

  // ─── Fetch initial value's label (when value set externally) ─────────────

  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      return;
    }
    // If already in options, pick from there
    const found = options.find((o) => String(getOptionValue(o)) === String(value));
    if (found) {
      setSelectedItem(found);
    }
    // If selectedItem already has this value, skip fetch
    if (selectedItem && String(getOptionValue(selectedItem)) === String(value)) return;

    // Fetch single record to resolve label for an externally-set value
    if (!found) {
      axiosClient
        .get(endpoint, { params: { ...queryParams, search: '', limit: 1, page: 1 } })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // ─── Click outside ────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Trigger open ─────────────────────────────────────────────────────────

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    setPage(1);
    setOptions([]);
    fetchPage(search, 1, false);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearch('');
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange(item);
    handleClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedItem(null);
    onChange(null);
  };

  // ─── Style helpers ────────────────────────────────────────────────────────

  const triggerClass = `
    w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20
    focus:border-[#007aff] bg-white transition-all text-left flex items-center justify-between gap-2
    cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
    ${error ? 'border-red-300' : 'border-gray-200'}
  `;

  const displayLabel = selectedItem ? getOptionLabel(selectedItem) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
          {label}{' '}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger button */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={isOpen ? handleClose : handleOpen}
          className={triggerClass}
        >
          <span className={`truncate ${displayLabel ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            {displayLabel || placeholder}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-gray-400">
            {loading && !isOpen && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
            {displayLabel && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClear(e); }}
                className="hover:text-gray-600 p-0.5 rounded cursor-pointer"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown panel */}
        {isOpen && !disabled && (
          <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2 space-y-2">
            {/* Search input */}
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#007aff]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Options list */}
            <div className="max-h-52 overflow-y-auto space-y-0.5">
              {loading && options.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  Loading...
                </div>
              ) : options.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-400 font-medium">
                  No results found
                </div>
              ) : (
                <>
                  {options.map((item) => {
                    const itemValue = String(getOptionValue(item));
                    const isSelected = String(value) === itemValue;
                    return (
                      <button
                        key={itemValue}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {getOptionLabel(item)}
                      </button>
                    );
                  })}
                  {/* Sentinel for infinite scroll */}
                  <div ref={sentinelRef} className="h-1" />
                  {loadingMore && (
                    <div className="py-2 flex items-center justify-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default React.memo(InfiniteSearchSelect);
