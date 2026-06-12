"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUserType, selectUser } from "@/store/slices/authSlice";
import axiosClient from "@/lib/axios";
import { Search, Globe, Building2, User, CornerDownLeft } from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ clients: [], companies: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const userType = useSelector(selectUserType);
  const user = useSelector(selectUser);

  const inputRef = useRef(null);
  const resultsRef = useRef([]);

  // Bind Ctrl+K / Cmd+K hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults({ clients: [], companies: [], users: [] });
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced/realtime API search
  useEffect(() => {
    if (!query.trim() || !isOpen) {
      setResults({ clients: [], companies: [], users: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const searchQuery = query.toLowerCase();

        // 1. Fetch Users
        let usersPromise = Promise.resolve([]);
        if (userType === "super_admin" || userType === "client_admin") {
          usersPromise = axiosClient
            .get(`/GetUsers?search=${encodeURIComponent(query)}`)
            .then((res) => res.data?.users || [])
            .catch(() => []);
        }

        // 2. Fetch Companies
        let companiesPromise = Promise.resolve([]);
        if (userType === "super_admin" || userType === "client_admin") {
          companiesPromise = axiosClient
            .get("/GetCompanies")
            .then((res) => {
              const list = Array.isArray(res.data) ? res.data : [];
              return list.filter((c) => c.name.toLowerCase().includes(searchQuery));
            })
            .catch(() => []);
        }

        // 3. Fetch Clients (Super Admin only)
        let clientsPromise = Promise.resolve([]);
        if (userType === "super_admin") {
          clientsPromise = axiosClient
            .get("/clients/GetClients")
            .then((res) => {
              const list = Array.isArray(res.data) ? res.data : [];
              return list.filter((c) => c.name.toLowerCase().includes(searchQuery));
            })
            .catch(() => []);
        }

        const [users, companies, clients] = await Promise.all([
          usersPromise,
          companiesPromise,
          clientsPromise,
        ]);

        setResults({
          clients: clients.slice(0, 5),
          companies: companies.slice(0, 5),
          users: users.slice(0, 5),
        });
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen, userType]);

  // Flatten results list for keyboard navigation
  const getFlatList = () => {
    const list = [];
    results.clients.forEach((item) => list.push({ type: "client", item }));
    results.companies.forEach((item) => list.push({ type: "company", item }));
    results.users.forEach((item) => list.push({ type: "user", item }));
    return list;
  };

  const flatList = getFlatList();

  const handleSelect = (selected) => {
    setIsOpen(false);
    if (selected.type === "client") {
      router.push(`/clients?id=${selected.item.id}`);
    } else if (selected.type === "company") {
      router.push(`/companies?id=${selected.item.id}`);
    } else if (selected.type === "user") {
      router.push(`/users?id=${selected.item.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(flatList.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatList.length) % Math.max(flatList.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatList[selectedIndex]) {
        handleSelect(flatList[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div
        className="relative z-10 w-full max-w-xl bg-white/95 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[450px]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-gray-100 h-14 bg-white">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            placeholder="Type to search clients, companies, or users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-[10px] font-bold text-gray-400 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {loading && (
            <div className="flex items-center justify-center py-6 gap-2">
              <div className="h-4 w-4 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-400 font-medium">Searching...</span>
            </div>
          )}

          {!loading && flatList.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-200" />
              <p className="text-xs font-semibold">
                {query.trim() ? "No records match your search query." : "Search by typing above..."}
              </p>
              {!query.trim() && (
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                  Matches clients, companies, or users
                </p>
              )}
            </div>
          )}

          {!loading && flatList.length > 0 && (
            <div className="space-y-4 py-2">
              {/* Clients Section */}
              {results.clients.length > 0 && (
                <div>
                  <h4 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Clients
                  </h4>
                  {results.clients.map((item, idx) => {
                    const globalIdx = idx;
                    const isSelected = selectedIndex === globalIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect({ type: "client", item })}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 text-[#007aff]" : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold">{item.name}</span>
                        </div>
                        {isSelected && <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Companies Section */}
              {results.companies.length > 0 && (
                <div>
                  <h4 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Companies / Workspaces
                  </h4>
                  {results.companies.map((item, idx) => {
                    const globalIdx = results.clients.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect({ type: "company", item })}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 text-[#007aff]" : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.name}</span>
                            <span className="text-[10px] text-gray-400">
                              Client ID: {item.clientId}
                            </span>
                          </div>
                        </div>
                        {isSelected && <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Users Section */}
              {results.users.length > 0 && (
                <div>
                  <h4 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Users
                  </h4>
                  {results.users.map((item, idx) => {
                    const globalIdx = results.clients.length + results.companies.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect({ type: "user", item })}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 text-[#007aff]" : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.name || "Invite Pending"}</span>
                            <span className="text-[10px] text-gray-400">{item.email}</span>
                          </div>
                        </div>
                        {isSelected && <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Ctrl+K to toggle</span>
        </div>
      </div>
    </div>
  );
}
