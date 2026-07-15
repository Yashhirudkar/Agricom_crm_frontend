"use client";
import { useState, useEffect, useCallback } from "react";
import { enquiriesApi, mastersApi } from "../services/enquiriesApi";

export function useEnquiries(companyId, status = "", externalSearch = null) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearchInternal] = useState("");
  const limit = 10;

  const currentSearch = externalSearch !== null ? externalSearch : search;

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(currentSearch && { search: currentSearch }),
        ...(status && { status }),
      };
      const res = await enquiriesApi.getAll(params);
      setEnquiries(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("Failed to fetch enquiries", e);
    } finally {
      setLoading(false);
    }
  }, [page, currentSearch, limit, companyId, status]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  useEffect(() => {
    setPage(1);
  }, [currentSearch, status]);

  return {
    enquiries, loading, total, totalPages, page, setPage,
    search: currentSearch, setSearch: externalSearch !== null ? () => {} : setSearchInternal,
    status, fetchEnquiries,
  };
}

export function useEnquiriesMasters() {
  const [masters, setMasters] = useState({
    partnerRoles: [], partners: [], products: [], packingTypes: [], countries: [], shipmentTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const pNew = { limit: 100, status: "Active" };
        const pOld = { limit: 100, isActive: true };
        const [rolesRes, partnersRes, prod, countries, pkt, st] = await Promise.all([
          mastersApi.getPartnerRoles(pOld),
          mastersApi.getPartners(pOld),
          mastersApi.getProducts(pOld),
          mastersApi.getCountries(pOld),
          mastersApi.getPackingTypes(),
          mastersApi.getShipmentTypes(pNew),
        ]);

        setMasters({
          partnerRoles: rolesRes.data?.data || [],
          partners: partnersRes.data?.data || [],
          products: prod.data?.data || [],
          countries: countries.data?.data || [],
          packingTypes: Array.isArray(pkt.data) ? pkt.data : (pkt.data?.data || []),
          shipmentTypes: st.data?.data || [],
        });
      } catch (e) {
        console.error("Failed to load masters", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { masters, loading };
}
