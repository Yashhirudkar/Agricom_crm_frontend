"use client";
import { useState, useEffect, useCallback } from "react";
import { salesContractApi, mastersApi } from "../services/salesContractApi";
import { currencies } from "@/constants/currenciesData";

export function useSalesContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [financialYearFilter, setFinancialYearFilter] = useState("");
  const limit = 10;

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(financialYearFilter && { financialYear: financialYearFilter }),
      };
      const res = await salesContractApi.getAll(params);
      setContracts(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("Failed to fetch contracts", e);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, financialYearFilter, limit]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts, loading, total, totalPages, page, setPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    financialYearFilter, setFinancialYearFilter,
    fetchContracts,
  };
}

export function useSalesMasters() {
  const [masters, setMasters] = useState({
    currencies: [], shipmentTypes: [], paymentTerms: [],
    tradeDocuments: [], partners: [], products: [], countries: [],
    bagTypes: [], packingTypes: [], bagSpecifications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const pNew = { limit: 100, status: "Active" };
        const pOld = { limit: 100, isActive: true };
        const [st, pt, td, rolesRes, prod, countries, bt, pkt, bsp, currRes] = await Promise.all([
          mastersApi.getShipmentTypes(pNew),
          mastersApi.getPaymentTerms(pNew),
          mastersApi.getTradeDocuments(pNew),
          mastersApi.getPartnerRoles(pOld),
          mastersApi.getProducts(pOld),
          mastersApi.getCountries(pOld),
          mastersApi.getBagTypes(),
          mastersApi.getPackingTypes(),
          mastersApi.getBagSpecs(),
          mastersApi.getCurrencies(pNew).catch(() => null),
        ]);

        const fetchedCurrencies = currRes?.data?.data || [];
        const finalCurrencies = fetchedCurrencies.length > 0
          ? fetchedCurrencies.map(c => ({ code: c.code, name: c.name, symbol: c.symbol }))
          : Object.values(currencies);

        const roles = rolesRes.data?.data || [];
        const buyerRole = roles.find(r => r.name?.toLowerCase() === "buyer");
        const sellerRole = roles.find(r => r.name?.toLowerCase() === "seller");
        const brokerRole = roles.find(r => r.name?.toLowerCase() === "broker");

        const [buyersRes, sellersRes, brokersRes] = await Promise.all([
          buyerRole ? mastersApi.getPartners({ partnerRoleId: buyerRole.id, limit: 100, isActive: true }) : Promise.resolve({ data: { data: [] } }),
          sellerRole ? mastersApi.getPartners({ partnerRoleId: sellerRole.id, limit: 100, isActive: true }) : Promise.resolve({ data: { data: [] } }),
          brokerRole ? mastersApi.getPartners({ partnerRoleId: brokerRole.id, limit: 100, isActive: true }) : Promise.resolve({ data: { data: [] } }),
        ]);

        setMasters({
          currencies: finalCurrencies,
          shipmentTypes: st.data.data || [],
          paymentTerms: pt.data.data || [],
          tradeDocuments: td.data.data || [],
          buyers: buyersRes.data?.data || [],
          sellers: sellersRes.data?.data || [],
          brokers: brokersRes.data?.data || [],
          products: prod.data.data || [],
          countries: countries.data.data || [],
          bagTypes: Array.isArray(bt.data) ? bt.data : (bt.data.data || []),
          packingTypes: Array.isArray(pkt.data) ? pkt.data : (pkt.data.data || []),
          bagSpecifications: bsp.data.data || bsp.data || [],
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
