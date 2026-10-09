"use client";
import { useState, useEffect, useCallback } from "react";
import { salesContractApi, mastersApi } from "../services/salesContractApi";
import { currencies } from "@/constants/currenciesData";
import { getAllCountryOptions } from "@/lib/countryUtils";

const defaultCountries = getAllCountryOptions().map((c) => ({
  id: c.value,
  code: c.alpha2,
  name: c.value,
}));

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

export function useSalesMasters({ includeBrokers = true, includePartners = true } = {}) {
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
        const [st, pt, td, rolesRes, prod, countries, bt, pkt, bsp, currRes, stchRes, mrkRes] = await Promise.all([
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
          mastersApi.getStitchingTypes(),
          mastersApi.getMarkingTypes(),
        ]);

        const fetchedCurrencies = currRes?.data?.data || [];
        const finalCurrencies = fetchedCurrencies.length > 0
          ? fetchedCurrencies.map(c => ({ code: c.code, name: c.name, symbol: c.symbol }))
          : Object.values(currencies);

        const roles = rolesRes.data?.data || [];
        const buyerRole = roles.find(r => r.name?.toLowerCase() === "buyer") ||
                          roles.find(r => r.name?.toLowerCase() === "importer");
        const sellerRole = roles.find(r => r.name?.toLowerCase() === "seller") ||
                           roles.find(r => r.name?.toLowerCase() === "exporter");
        const supplierRole = roles.find(r => r.name?.toLowerCase() === "supplier");
        const brokerRole = roles.find(r => r.name?.toLowerCase() === "broker" || r.name?.toLowerCase().includes("broker") || r.name?.toLowerCase() === "agent");

        const domesticBrokerRole = roles.find((r) => r.name?.toLowerCase() === "domestic broker");
        const internationalBrokerRole = roles.find((r) => r.name?.toLowerCase() === "international broker");

        const [buyersRes, sellersRes, suppliersRes, brokersRes, partnersRes, purchaseSuppliersRes] = await Promise.all([
          buyerRole ? mastersApi.getPartnersOptions({ partnerRoleId: buyerRole.id, limit: 1000, isActive: true }) : Promise.resolve({ data: [] }),
          sellerRole ? mastersApi.getPartnersOptions({ partnerRoleId: sellerRole.id, limit: 1000, isActive: true }) : Promise.resolve({ data: [] }),
          supplierRole ? mastersApi.getPartnersOptions({ partnerRoleId: supplierRole.id, limit: 1000, isActive: true }) : Promise.resolve({ data: [] }),
          includeBrokers && brokerRole ? mastersApi.getPartnersOptions({ partnerRoleId: brokerRole.id, limit: 1000, isActive: true }) : Promise.resolve({ data: [] }),
          includePartners
            ? mastersApi.getPartnersOptions({ limit: 1000, isActive: true })
            : Promise.resolve({ data: [] }),
          mastersApi.getPartnersOptions({ roleName: "domestic supplier/seller,international supplier/seller", limit: 1000, isActive: true }),
        ]);

        const fetchedCountries = countries?.data?.data || [];
        const finalCountries = fetchedCountries.length > 0 ? fetchedCountries : defaultCountries;

        const extractData = (res) => (Array.isArray(res.data) ? res.data : (res.data?.data || []));

        setMasters({
          currencies: finalCurrencies,
          shipmentTypes: st.data.data || [],
          paymentTerms: pt.data.data || [],
          tradeDocuments: td.data.data || [],
          buyerRoleId: buyerRole?.id,
          sellerRoleId: sellerRole?.id,
          brokerRoleId: brokerRole?.id,
          domesticBrokerRoleId: domesticBrokerRole?.id,
          internationalBrokerRoleId: internationalBrokerRole?.id,
          buyers: extractData(buyersRes),
          sellers: extractData(sellersRes),
          suppliers: extractData(suppliersRes),
          brokers: extractData(brokersRes),
          partners: extractData(partnersRes),
          purchaseSuppliers: extractData(purchaseSuppliersRes),
          products: prod.data.data || [],
          countries: finalCountries,
          bagTypes: Array.isArray(bt.data) ? bt.data : (bt.data.data || []),
          packingTypes: Array.isArray(pkt.data) ? pkt.data : (pkt.data.data || []),
          bagSpecifications: bsp.data.data || bsp.data || [],
          stitchingTypes: extractData(stchRes),
          markingTypes: extractData(mrkRes),
        });
      } catch (e) {
        console.error("Failed to load masters", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [includeBrokers, includePartners]);

  return { masters, loading };
}
