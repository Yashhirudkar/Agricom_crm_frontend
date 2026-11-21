"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  Save,
  Eye,
  Plus,
  Trash2,
  Upload,
  Building2,
  Truck,
  DollarSign,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { exportInvoicesApi } from "../services/exportInvoicesApi";
import banksApi from "@/api/banksApi";
import { formatAmountInWords } from "../utils/amountInWords";
import { createBankDetailsSnapshot } from "../utils/bankDetailsFormatter";
import ExportInvoicePreviewModal from "./ExportInvoicePreviewModal";

const resolveBackendUrl = (url) => {
  if (!url) return null;
  const str = String(url).trim();
  if (!str) return null;
  if (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("data:") ||
    str.startsWith("blob:")
  ) {
    return str;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const backendBase = apiUrl.replace(/\/api\/?$/, "");
  const cleanPath = str.startsWith("/") ? str : `/${str}`;
  return `${backendBase}${cleanPath}`;
};

export default function ExportInvoiceForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    companyId: initialData?.companyId || null,
    salesContractId: initialData?.salesContractId || null,
    shipmentId: initialData?.shipmentId || null,
    purchaseContractId: initialData?.purchaseContractId || null,
    invoiceNumber: initialData?.invoiceNumber || "",
    sequenceNumber: initialData?.sequenceNumber || 30,
    isManualFirstSequence: initialData?.isManualFirstSequence || false,
    invoiceDate: initialData?.invoiceDate || new Date().toISOString().split("T")[0],
    status: initialData?.status || "Draft",
    exporterRef: initialData?.exporterRef || "I.E.C. NO.0307027422",
    sellerOrderNo: initialData?.sellerOrderNo || "",
    sellerOrderDate: initialData?.sellerOrderDate || "",
    businessReference:
      initialData?.businessReference ||
      initialData?.metadata?.businessReference ||
      "",
    otherRef: initialData?.otherRef || "",
    buyerOrderNo: initialData?.buyerOrderNo || "",
    buyerOrderDate: initialData?.buyerOrderDate || "",
    sellerDetails: initialData?.sellerDetails || {
      name: "AGRICOM IMPEX",
      address:
        "202, 2ND FLOOR,\nAMALTAS APPT, RAJNAGAR,\nNAGPUR, MAHARASHTRA 440013\nMAHARASHTRA , INDIA",
      country: "INDIA",
      taxId: "I.E.C. NO.0307027422",
      phone: "",
      contactEmail: "",
    },
    consigneeDetails: initialData?.consigneeDetails || {
      name: "",
      address: "",
      country: "",
      taxId: "",
      phone: "",
    },
    notifyPartyDetails: initialData?.notifyPartyDetails || {
      name: "",
      address: "",
      country: "",
      taxId: "",
    },
    buyerOtherThanConsignee: initialData?.buyerOtherThanConsignee || {
      name: "",
      address: "",
    },
    countryOfOrigin: initialData?.countryOfOrigin || "KAZAKHSTAN",
    countryOfFinalDestination: initialData?.countryOfFinalDestination || "",
    termsOfDeliveryPayment: initialData?.termsOfDeliveryPayment || "",
    carriageBy: initialData?.carriageBy || "ROAD",
    placeOfReceiptByPreCarrier:
      initialData?.placeOfReceiptByPreCarrier ||
      initialData?.metadata?.placeOfReceiptByPreCarrier ||
      initialData?.metadata?.placeOfReceipt ||
      "",
    placeOfLoading: initialData?.placeOfLoading || "",
    placeOfUnloading: initialData?.placeOfUnloading || "",
    finalDestination: initialData?.finalDestination || "",
    truckNumbers: initialData?.truckNumbers || [],
    containerNumbers: initialData?.containerNumbers || [],
    goodsItems: initialData?.goodsItems || [
      {
        id: 1,
        marksAndNos: "AS PER CONTRACT",
        containerNo: "",
        noAndKindOfPackages: "IN BULK",
        descriptionOfGoods: "AGRICULTURAL COMMODITY",
        quantity: 0,
        quantityUnit: "MT",
        rate: 0,
        amount: 0,
      },
    ],
    currency: initialData?.currency || "USD",
    totalQuantity: initialData?.totalQuantity || 0,
    totalAmount: initialData?.totalAmount || 0,
    amountChargeable: initialData?.amountChargeable || 0,
    amountInWords: initialData?.amountInWords || "",
    bankKey: initialData?.bankKey || "USD",
    bankDetails: initialData?.bankDetails || null,
    declaration:
      initialData?.declaration ||
      "WE HEREBY CERTIFY THAT THE GOODS SUPPLIED ARE OF 100% KAZAKHSTAN ORIGIN.",
    signatureUrl: initialData?.signatureUrl || null,
    stampUrl: initialData?.stampUrl || null,
    signatoryName: initialData?.signatoryName || "Authorized Signatory",
    signatoryDesignation: initialData?.signatoryDesignation || "Director",
    remarks: initialData?.remarks || "",
  });

  // Preview Modal & State
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTruckInput, setNewTruckInput] = useState("");

  // Bank Management State (Domestic -> Currency -> Auto Nostro)
  const [domesticBanks, setDomesticBanks] = useState([]);
  const [selectedDomesticBankId, setSelectedDomesticBankId] = useState(
    initialData?.bankDetails?.selectedDomesticBankId ||
    initialData?.bankDetails?.domesticBank?.id ||
    ""
  );
  const [selectedBankCurrency, setSelectedBankCurrency] = useState(
    initialData?.bankDetails?.selectedCurrency ||
    initialData?.currency ||
    "USD"
  );
  const [loadingBanks, setLoadingBanks] = useState(true);

  // Load Active Domestic Banks once on mount
  useEffect(() => {
    let isMounted = true;
    banksApi
      .getDomesticBanks({ status: "Active" })
      .then((res) => {
        if (!isMounted) return;
        const list = res.data?.rows || res.data || [];
        setDomesticBanks(list);

        if (list.length === 0) {
          setLoadingBanks(false);
          return;
        }

        // If editing an existing invoice and bank snapshot already exists
        if (isEdit && (initialData?.bankDetails || initialData?.bankKey)) {
          const existingBankId =
            initialData?.bankDetails?.selectedDomesticBankId ||
            initialData?.bankDetails?.domesticBank?.id;

          let matchedBank = null;
          if (existingBankId) {
            matchedBank = list.find((b) => b.id === Number(existingBankId));
          }
          if (!matchedBank && initialData?.bankDetails?.bankName) {
            matchedBank = list.find(
              (b) =>
                b.bankName.toLowerCase().trim() ===
                initialData.bankDetails.bankName.toLowerCase().trim()
            );
          }
          if (!matchedBank) {
            matchedBank = list[0];
          }

          const currentBankId = matchedBank.id;
          const curr = (
            initialData?.bankDetails?.selectedCurrency ||
            initialData?.currency ||
            matchedBank.currency ||
            "INR"
          ).toUpperCase();

          setSelectedDomesticBankId(currentBankId);
          setSelectedBankCurrency(curr);

          // Preserve existing immutable formatted text on edit
          if (initialData?.bankDetails) {
            const preservedFormattedText =
              initialData.bankDetails.formattedText ||
              initialData.bankDetails.bankDetailsText ||
              initialData.bankDetails.additionalDetails;

            const nostroList =
              matchedBank.linkedNostroAccounts ||
              matchedBank.nostroAccounts ||
              [];
            const matchedNostro = nostroList.find(
              (n) =>
                n.currency?.toUpperCase() === curr && n.status === "Active"
            );

            const snapshot = createBankDetailsSnapshot({
              domesticBank: matchedBank,
              nostroBank: matchedNostro,
              currency: curr,
              beneficiaryName:
                initialData.bankDetails.accountName ||
                initialData.sellerDetails?.name ||
                formData.sellerDetails?.name ||
                matchedBank.company?.legalName ||
                matchedBank.company?.name,
              customFormattedText: preservedFormattedText,
            });

            setFormData((prev) => ({
              ...prev,
              bankKey: snapshot.key,
              bankDetails: snapshot,
            }));
          }
        } else {
          // Create Mode: pick default domestic bank and resolve
          const defaultBank = list[0];
          const defaultBankId = defaultBank.id;
          setSelectedDomesticBankId(defaultBankId);

          const nostroList = (
            defaultBank.linkedNostroAccounts ||
            defaultBank.nostroAccounts ||
            []
          ).filter((n) => n.status === "Active");

          const bankCurrencies = Array.from(
            new Set([
              (defaultBank.currency || "INR").toUpperCase(),
              ...nostroList.map((n) => n.currency.toUpperCase()),
            ])
          );

          const targetCurrency = (formData.currency || "USD").toUpperCase();
          const chosenCurrency = bankCurrencies.includes(targetCurrency)
            ? targetCurrency
            : bankCurrencies[0] || "INR";

          setSelectedBankCurrency(chosenCurrency);

          const matchedNostro = nostroList.find(
            (n) => n.currency.toUpperCase() === chosenCurrency
          );
          const snapshot = createBankDetailsSnapshot({
            domesticBank: defaultBank,
            nostroBank: matchedNostro,
            currency: chosenCurrency,
            beneficiaryName:
              formData.sellerDetails?.name ||
              defaultBank.company?.legalName ||
              defaultBank.company?.name,
          });

          setFormData((prev) => ({
            ...prev,
            currency: chosenCurrency,
            bankKey: snapshot.key,
            bankDetails: snapshot,
            amountInWords: formatAmountInWords(prev.amountChargeable, chosenCurrency),
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to load domestic banks", err);
      })
      .finally(() => {
        if (isMounted) setLoadingBanks(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Currently selected Domestic Bank object
  const currentDomesticBank = React.useMemo(() => {
    return domesticBanks.find((b) => b.id === Number(selectedDomesticBankId)) || null;
  }, [domesticBanks, selectedDomesticBankId]);

  // Derived available currencies for current domestic bank
  const availableCurrencies = React.useMemo(() => {
    if (!currentDomesticBank) return [];
    const nostros = (
      currentDomesticBank.linkedNostroAccounts ||
      currentDomesticBank.nostroAccounts ||
      []
    ).filter((n) => n.status === "Active");

    return Array.from(
      new Set([
        (currentDomesticBank.currency || "INR").toUpperCase(),
        ...nostros.map((n) => n.currency.toUpperCase()),
      ])
    );
  }, [currentDomesticBank]);

  // Derived linked Nostro for currentDomesticBank + selectedBankCurrency
  const currentResolvedNostro = React.useMemo(() => {
    if (!currentDomesticBank) return null;
    const nostros = (
      currentDomesticBank.linkedNostroAccounts ||
      currentDomesticBank.nostroAccounts ||
      []
    ).filter((n) => n.status === "Active");

    return (
      nostros.find(
        (n) =>
          n.currency?.toUpperCase() ===
          (selectedBankCurrency || "").toUpperCase()
      ) || null
    );
  }, [currentDomesticBank, selectedBankCurrency]);

  // Handler: When Domestic Bank changes
  const handleDomesticBankChange = (newBankId) => {
    const bank = domesticBanks.find((b) => b.id === Number(newBankId));
    if (!bank) return;

    setSelectedDomesticBankId(bank.id);

    // Derive available currencies for newly selected domestic bank
    const nostros = (
      bank.linkedNostroAccounts ||
      bank.nostroAccounts ||
      []
    ).filter((n) => n.status === "Active");

    const bankCurrencies = Array.from(
      new Set([
        (bank.currency || "INR").toUpperCase(),
        ...nostros.map((n) => n.currency.toUpperCase()),
      ])
    );

    // If previous currency is valid for this new bank, retain it; otherwise default to first available
    const newCurrency = bankCurrencies.includes(selectedBankCurrency)
      ? selectedBankCurrency
      : bankCurrencies[0] || "INR";

    setSelectedBankCurrency(newCurrency);

    // Auto-resolve linked Nostro for (bank + newCurrency)
    const linkedNostro = nostros.find(
      (n) => n.currency.toUpperCase() === newCurrency
    );

    const snapshot = createBankDetailsSnapshot({
      domesticBank: bank,
      nostroBank: linkedNostro,
      currency: newCurrency,
      beneficiaryName:
        formData.sellerDetails?.name ||
        bank.company?.legalName ||
        bank.company?.name,
    });

    setFormData((prev) => ({
      ...prev,
      currency: newCurrency,
      bankKey: snapshot.key,
      bankDetails: snapshot,
      amountInWords: formatAmountInWords(prev.amountChargeable, newCurrency),
    }));
  };

  // Handler: When Currency changes
  const handleBankCurrencyChange = (newCurrency) => {
    const curr = (newCurrency || "").toUpperCase().trim();
    if (!curr) return;

    setSelectedBankCurrency(curr);

    const bank = currentDomesticBank;
    if (!bank) return;

    const nostros = (
      bank.linkedNostroAccounts ||
      bank.nostroAccounts ||
      []
    ).filter((n) => n.status === "Active");

    const linkedNostro = nostros.find((n) => n.currency.toUpperCase() === curr);

    const snapshot = createBankDetailsSnapshot({
      domesticBank: bank,
      nostroBank: linkedNostro,
      currency: curr,
      beneficiaryName:
        formData.sellerDetails?.name ||
        bank.company?.legalName ||
        bank.company?.name,
    });

    setFormData((prev) => ({
      ...prev,
      currency: curr,
      bankKey: snapshot.key,
      bankDetails: snapshot,
      amountInWords: formatAmountInWords(prev.amountChargeable, curr),
    }));
  };

  // Handler: User modifies multiline bank text in textarea
  const handleCustomBankTextChange = (text) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...(prev.bankDetails || {}),
        bankDetailsText: text,
        formattedText: text,
        additionalDetails: text,
      },
    }));
  };

  // Handler: Reset custom bank text back to standard template
  const handleResetBankText = () => {
    if (!currentDomesticBank) return;
    const snapshot = createBankDetailsSnapshot({
      domesticBank: currentDomesticBank,
      nostroBank: currentResolvedNostro,
      currency: selectedBankCurrency,
      beneficiaryName:
        formData.sellerDetails?.name ||
        currentDomesticBank.company?.legalName ||
        currentDomesticBank.company?.name,
    });

    setFormData((prev) => ({
      ...prev,
      bankDetails: snapshot,
    }));
    toast.success("Bank details text reset to standard format");
  };

  // Recalculate totals and amount in words whenever goodsItems change
  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const nextItems = [...prev.goodsItems];
      const item = { ...nextItems[index], [field]: value };

      if (field === "quantity" || field === "rate") {
        const q = parseFloat(item.quantity) || 0;
        const r = parseFloat(item.rate) || 0;
        item.amount = parseFloat((q * r).toFixed(2));
      }

      nextItems[index] = item;

      const totalQty = nextItems.reduce(
        (sum, it) => sum + (parseFloat(it.quantity) || 0),
        0
      );
      const totalAmt = nextItems.reduce(
        (sum, it) => sum + (parseFloat(it.amount) || 0),
        0
      );
      const words = formatAmountInWords(totalAmt, prev.currency);

      return {
        ...prev,
        goodsItems: nextItems,
        totalQuantity: parseFloat(totalQty.toFixed(3)),
        totalAmount: parseFloat(totalAmt.toFixed(2)),
        amountChargeable: parseFloat(totalAmt.toFixed(2)),
        amountInWords: words,
      };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => {
      const nextItems = [
        ...prev.goodsItems,
        {
          id: Date.now(),
          marksAndNos: "AS PER CONTRACT",
          containerNo: prev.containerNumbers?.join(", ") || "",
          noAndKindOfPackages: "IN BULK",
          descriptionOfGoods: "",
          quantity: 0,
          quantityUnit: "MT",
          rate: 0,
          amount: 0,
        },
      ];
      return { ...prev, goodsItems: nextItems };
    });
  };

  const handleRemoveItem = (index) => {
    if (formData.goodsItems.length <= 1) {
      toast.error("At least one goods item is required");
      return;
    }
    setFormData((prev) => {
      const nextItems = prev.goodsItems.filter((_, i) => i !== index);
      const totalQty = nextItems.reduce(
        (sum, it) => sum + (parseFloat(it.quantity) || 0),
        0
      );
      const totalAmt = nextItems.reduce(
        (sum, it) => sum + (parseFloat(it.amount) || 0),
        0
      );
      const words = formatAmountInWords(totalAmt, prev.currency);
      return {
        ...prev,
        goodsItems: nextItems,
        totalQuantity: parseFloat(totalQty.toFixed(3)),
        totalAmount: parseFloat(totalAmt.toFixed(2)),
        amountChargeable: parseFloat(totalAmt.toFixed(2)),
        amountInWords: words,
      };
    });
  };

  // Dynamic Truck Numbers management
  const handleAddTruck = () => {
    const val = newTruckInput.trim();
    if (!val) return;
    if (formData.truckNumbers.includes(val)) {
      toast.error("Truck number already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      truckNumbers: [...prev.truckNumbers, val],
    }));
    setNewTruckInput("");
  };

  const handleRemoveTruck = (index) => {
    setFormData((prev) => ({
      ...prev,
      truckNumbers: prev.truckNumbers.filter((_, i) => i !== index),
    }));
  };



  // Sequence Number updates -> dynamically format preview
  const handleSequenceChange = async (seqVal) => {
    const seq = parseInt(seqVal, 10);
    if (isNaN(seq) || seq <= 0) return;

    try {
      const res = await exportInvoicesApi.getNextNumber(
        formData.sellerOrderNo,
        seq
      );
      if (res?.data?.invoiceNumber) {
        setFormData((prev) => ({
          ...prev,
          sequenceNumber: seq,
          invoiceNumber: res.data.invoiceNumber,
        }));
      }
    } catch {
      // Fallback local string construction
      const pad = String(seq).padStart(3, "0");
      const cleanContract = (formData.sellerOrderNo || "SC000000").replace(
        /\s+/g,
        ""
      );
      setFormData((prev) => ({
        ...prev,
        sequenceNumber: seq,
        invoiceNumber: `EXP-${pad}-${cleanContract}`,
      }));
    }
  };

  // Temporary Signature Upload
  const handleUploadSignature = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await exportInvoicesApi.uploadSignature(file);
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, signatureUrl: res.data.url }));
        toast.success("Signature uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload signature");
    }
  };

  // Temporary Stamp Upload
  const handleUploadStamp = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await exportInvoicesApi.uploadStamp(file);
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, stampUrl: res.data.url }));
        toast.success("Stamp uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload stamp");
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.invoiceNumber) {
      toast.error("Invoice number is required");
      return;
    }

    if (formData.goodsItems.length === 0) {
      toast.error("Please add at least one goods item");
      return;
    }

    if (!selectedDomesticBankId && !formData.bankDetails?.bankName && !formData.bankDetails?.domesticBank?.bankName) {
      toast.error("Domestic Bank is mandatory. Please select a bank.");
      return;
    }

    if (!formData.currency) {
      toast.error("Currency is mandatory. Please select a currency.");
      return;
    }

    // Build clean payload — strip non-DTO fields, coerce types, sanitize dates
    const toDateOrNull = (v) => {
      if (!v || v === "") return null;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : v;
    };

    const payload = {
      companyId: formData.companyId || null,
      salesContractId: formData.salesContractId || null,
      shipmentId: formData.shipmentId || null,
      purchaseContractId: formData.purchaseContractId || null,
      invoiceNumber: formData.invoiceNumber || null,
      sequenceNumber: Number(formData.sequenceNumber) || 0,
      invoiceDate: formData.invoiceDate || new Date().toISOString().split("T")[0],
      status: formData.status || "Draft",
      exporterRef: formData.exporterRef || "I.E.C. NO.0307027422",
      sellerOrderNo: formData.sellerOrderNo || null,
      sellerOrderDate: toDateOrNull(formData.sellerOrderDate),
      otherRef: formData.otherRef || null,
      buyerOrderNo: formData.buyerOrderNo || null,
      buyerOrderDate: toDateOrNull(formData.buyerOrderDate),
      sellerDetails: formData.sellerDetails || null,
      consigneeDetails: formData.consigneeDetails || null,
      notifyPartyDetails: formData.notifyPartyDetails || null,
      buyerOtherThanConsignee: formData.buyerOtherThanConsignee || null,
      countryOfOrigin: formData.countryOfOrigin || null,
      countryOfFinalDestination: formData.countryOfFinalDestination || null,
      termsOfDeliveryPayment: formData.termsOfDeliveryPayment || null,
      carriageBy: formData.carriageBy || "ROAD",
      placeOfLoading: formData.placeOfLoading || null,
      placeOfUnloading: formData.placeOfUnloading || null,
      finalDestination: formData.finalDestination || null,
      truckNumbers: Array.isArray(formData.truckNumbers) ? formData.truckNumbers : [],
      containerNumbers: Array.isArray(formData.containerNumbers) ? formData.containerNumbers : [],
      goodsItems: (formData.goodsItems || []).map((item) => ({
        id: item.id,
        marksAndNos: item.marksAndNos || "",
        containerNo: item.containerNo || "",
        noAndKindOfPackages: item.noAndKindOfPackages || "",
        descriptionOfGoods: item.descriptionOfGoods || "COMMODITY",
        quantity: Number(item.quantity) || 0,
        quantityUnit: item.quantityUnit || "MT",
        rate: Number(item.rate) || 0,
        amount: Number(item.amount) || 0,
      })),
      currency: formData.currency || "USD",
      totalQuantity: Number(formData.totalQuantity) || 0,
      totalAmount: Number(formData.totalAmount) || 0,
      amountChargeable: Number(formData.amountChargeable) || 0,
      amountInWords: formData.amountInWords || "",
      bankKey: formData.bankKey || null,
      bankDetails: formData.bankDetails || null,
      declaration:
        formData.declaration ||
        "WE HEREBY CERTIFY THAT THE GOODS SUPPLIED ARE OF 100% KAZAKHSTAN ORIGIN.",
      signatureUrl: formData.signatureUrl || null,
      stampUrl: formData.stampUrl || null,
      signatoryName: formData.signatoryName || null,
      signatoryDesignation: formData.signatoryDesignation || null,
      remarks: formData.remarks || null,
      metadata: {
        ...(initialData?.metadata || {}),
        placeOfReceiptByPreCarrier: formData.placeOfReceiptByPreCarrier || "",
        ...(formData.businessReference || initialData?.businessReference
          ? {
              businessReference:
                formData.businessReference || initialData?.businessReference,
            }
          : {}),
      },
    };

    setSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await exportInvoicesApi.updateInvoice(initialData.id, payload);
        toast.success(`Invoice ${formData.invoiceNumber} updated successfully`);
      } else {
        await exportInvoicesApi.createInvoice(payload);
        toast.success(`Invoice ${formData.invoiceNumber} created successfully`);
      }
      router.push("/documents/export-invoices");
    } catch (error) {
      console.error(error);
      const errData = error.response?.data;
      const msg =
        Array.isArray(errData?.message)
          ? errData.message.join(", ")
          : errData?.message || "Failed to save invoice";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1500px] mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Export Invoice" : "Generate Export Invoice"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {formData.invoiceNumber || "EXP-..."}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Auto-mapped from Sales Contract, Purchase Contract &amp; Shipment Stuffing Execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Preview A4</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? "Saving..." : isEdit ? "Update Invoice" : "Issue Invoice"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 print:hidden">
        {/* Section 1: Invoice Header & Running Number Sequence */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Invoice Header &amp; Sequence Numbering
            </h2>
            <div className="text-[11px] text-gray-400">
              Format: <span className="font-mono font-bold text-gray-700">EXP-{String(formData.sequenceNumber).padStart(3, "0")}-{formData.sellerOrderNo || "SC..."}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Running Number Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sequence Running Number *
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  value={formData.sequenceNumber}
                  onChange={(e) => handleSequenceChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-blue-900 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 30"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Prefix: EXP | Auto-increments automatically
              </p>
            </div>

            {/* Invoice Number (System Generated - Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Generated Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber || ""}
                readOnly
                title="System-generated invoice number (auto-derived from running sequence)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-100/90 text-xs font-mono font-bold text-gray-700 cursor-not-allowed uppercase select-all"
              />
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Invoice Date *
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, invoiceDate: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[10px] text-gray-400 mt-1">Current system date by default</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Invoice Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Issued">Issued</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
            {/* Exporter Ref */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Exporter Ref (Always)
              </label>
              <input
                type="text"
                value={formData.exporterRef}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, exporterRef: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>

            {/* Seller Order No */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Seller Order No (Sales Contract)
              </label>
              <input
                type="text"
                value={formData.sellerOrderNo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sellerOrderNo: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800 font-mono"
              />
            </div>

            {/* Seller Order Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Seller Order Date
              </label>
              <input
                type="date"
                value={formData.sellerOrderDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sellerOrderDate: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>

            {/* Other Ref */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Other Reference(s) (Editable)
              </label>
              <input
                type="text"
                placeholder="Optional customer reference"
                value={formData.otherRef || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, otherRef: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Parties Information */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Party Details (Auto Data Mapping)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Seller */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-gray-200/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Seller (Sales Contract Seller)
              </span>
              <input
                type="text"
                placeholder="Seller Company Name"
                value={formData.sellerDetails?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sellerDetails: { ...prev.sellerDetails, name: e.target.value },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 bg-white"
              />
              <textarea
                rows={2}
                placeholder="Seller Address"
                value={formData.sellerDetails?.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sellerDetails: { ...prev.sellerDetails, address: e.target.value },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.sellerDetails?.country || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sellerDetails: { ...prev.sellerDetails, country: e.target.value },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
            </div>

            {/* Consignee */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-gray-200/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Consignee (Sales Contract Buyer)
              </span>
              <input
                type="text"
                placeholder="Buyer / Consignee Name"
                value={formData.consigneeDetails?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consigneeDetails: {
                      ...prev.consigneeDetails,
                      name: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 bg-white"
              />
              <textarea
                rows={2}
                placeholder="Consignee Address"
                value={formData.consigneeDetails?.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consigneeDetails: {
                      ...prev.consigneeDetails,
                      address: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.consigneeDetails?.country || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consigneeDetails: {
                      ...prev.consigneeDetails,
                      country: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
            </div>

            {/* Notify Party */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-gray-200/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Notify Party (Same as Buyer by default)
              </span>
              <input
                type="text"
                placeholder="Notify Party Name"
                value={formData.notifyPartyDetails?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifyPartyDetails: {
                      ...prev.notifyPartyDetails,
                      name: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 bg-white"
              />
              <textarea
                rows={2}
                placeholder="Notify Party Address"
                value={formData.notifyPartyDetails?.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifyPartyDetails: {
                      ...prev.notifyPartyDetails,
                      address: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.notifyPartyDetails?.country || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifyPartyDetails: {
                      ...prev.notifyPartyDetails,
                      country: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
            </div>

            {/* Buyer if other than consignee */}
            <div className="p-3 bg-slate-50/60 rounded-xl border border-gray-200/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Buyer if Other Than Consignee (Editable)
              </span>
              <input
                type="text"
                placeholder="Optional Buyer Name"
                value={formData.buyerOtherThanConsignee?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buyerOtherThanConsignee: {
                      ...prev.buyerOtherThanConsignee,
                      name: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 bg-white"
              />
              <textarea
                rows={2}
                placeholder="Optional Buyer Address"
                value={formData.buyerOtherThanConsignee?.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buyerOtherThanConsignee: {
                      ...prev.buyerOtherThanConsignee,
                      address: e.target.value,
                    },
                  }))
                }
                className="w-full px-2.5 py-1 text-xs rounded border border-gray-300 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Origin, Destination & Transport Details */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              Transport Details &amp; Routing
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Country of Origin (Sales Contract)
              </label>
              <input
                type="text"
                value={formData.countryOfOrigin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, countryOfOrigin: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Country of Final Destination (Sales Contract)
              </label>
              <input
                type="text"
                value={formData.countryOfFinalDestination}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryOfFinalDestination: e.target.value,
                  }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Terms of Delivery &amp; Payment (Sales Contract)
              </label>
              <input
                type="text"
                value={formData.termsOfDeliveryPayment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsOfDeliveryPayment: e.target.value,
                  }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Carriage By
              </label>
              <input
                type="text"
                value={formData.carriageBy}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, carriageBy: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-800 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Place of Rec. by Pre-carrier
              </label>
              <input
                type="text"
                value={formData.placeOfReceiptByPreCarrier}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    placeOfReceiptByPreCarrier: e.target.value,
                  }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Place of Loading (Purchase Contract)
              </label>
              <input
                type="text"
                value={formData.placeOfLoading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, placeOfLoading: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Place of Unloading (Sales Contract)
              </label>
              <input
                type="text"
                value={formData.placeOfUnloading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, placeOfUnloading: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Final Destination (Sales Contract)
              </label>
              <input
                type="text"
                value={formData.finalDestination}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, finalDestination: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Goods Table */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                Goods Table (Editable Columns)
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Quantity &amp; Rate auto-map from Sales Contract. Marks &amp; Nos, Container No, Packages &amp; Description remain editable.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600">Currency:</span>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => {
                  const curr = e.target.value.toUpperCase();
                  setFormData((prev) => ({
                    ...prev,
                    currency: curr,
                    amountInWords: formatAmountInWords(prev.amountChargeable, curr),
                  }));
                }}
                className="w-20 px-2 py-1 text-xs font-bold uppercase rounded border border-gray-300 bg-white"
                placeholder="USD / EUR"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Row</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="p-2 w-[14%]">Marks &amp; Nos.</th>
                  <th className="p-2 w-[14%]">Container No.</th>
                  <th className="p-2 w-[16%]">No. &amp; Kind of Pkgs</th>
                  <th className="p-2 w-[22%]">Description of Goods</th>
                  <th className="p-2 w-[10%] text-right">Quantity</th>
                  <th className="p-2 w-[10%] text-right">Rate ({formData.currency})</th>
                  <th className="p-2 w-[10%] text-right">Amount ({formData.currency})</th>
                  <th className="p-2 w-[4%] text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formData.goodsItems.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/50">
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={item.marksAndNos || ""}
                        onChange={(e) =>
                          handleItemChange(index, "marksAndNos", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 focus:border-blue-500 font-mono resize-y"
                        placeholder="Marks & Nos / Truck No."
                      />
                    </td>
                    <td className="p-2 align-top">
                      <input
                        type="text"
                        value={item.containerNo || ""}
                        onChange={(e) =>
                          handleItemChange(index, "containerNo", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 focus:border-blue-500 font-mono"
                        placeholder="Container No."
                      />
                    </td>
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={item.noAndKindOfPackages || ""}
                        onChange={(e) =>
                          handleItemChange(index, "noAndKindOfPackages", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 focus:border-blue-500 resize-y"
                        placeholder="e.g. 22 BAGS\nPACKING: BIG BAGS"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={item.descriptionOfGoods || ""}
                        onChange={(e) =>
                          handleItemChange(index, "descriptionOfGoods", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 focus:border-blue-500"
                        placeholder="Description of goods"
                      />
                    </td>
                    <td className="p-2 align-top text-right">
                      <input
                        type="number"
                        step="any"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs font-semibold text-right rounded border border-gray-200 focus:border-blue-500"
                      />
                    </td>
                    <td className="p-2 align-top text-right">
                      <input
                        type="number"
                        step="any"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs font-semibold text-right rounded border border-gray-200 focus:border-blue-500"
                      />
                    </td>
                    <td className="p-2 align-top text-right font-bold text-gray-900 pt-3">
                      {Number(item.amount || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-2 align-top text-center pt-2.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remove row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 5: Dynamic Truck Details */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-dashed border-gray-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-blue-600" />
                Truck Details (From Stuffing Execution)
              </span>
              <span className="text-[10px] text-gray-400">
                Displays below Goods Table on Export Invoice
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {formData.truckNumbers?.map((truck, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white border border-gray-300 text-gray-800 shadow-2xs"
                >
                  {truck}
                  <button
                    type="button"
                    onClick={() => handleRemoveTruck(idx)}
                    className="text-gray-400 hover:text-red-500 ml-1 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add truck number..."
                  value={newTruckInput}
                  onChange={(e) => setNewTruckInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTruck();
                    }
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddTruck}
                  className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Bank Details */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Bank Details (International Banking)
                </h2>
                {currentResolvedNostro ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                    Auto-resolved Nostro ({selectedBankCurrency})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Beneficiary Only ({selectedBankCurrency})
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Domestic Bank &amp; Currency selection with automatic Nostro routing and immutable snapshot.
              </p>
            </div>
          </div>

          {/* Cascading Selectors: Domestic Bank * and Currency * */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-200/60">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Domestic Bank <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDomesticBankId || ""}
                onChange={(e) => handleDomesticBankChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  {loadingBanks ? "Loading domestic banks..." : "Select Domestic Bank..."}
                </option>
                {domesticBanks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} ({b.currency || "INR"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBankCurrency || ""}
                onChange={(e) => handleBankCurrencyChange(e.target.value)}
                disabled={!selectedDomesticBankId || availableCurrencies.length === 0}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Select Currency...</option>
                {availableCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Bank Details Display Card */}
          {formData.bankDetails ? (
            <div className="space-y-3">
              {/* Nostro details summary if resolved */}
              {currentResolvedNostro && (
                <div className="p-3 bg-blue-50/50 rounded-xl text-xs border border-blue-200/60">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                    Auto-Linked Nostro Bank ({selectedBankCurrency})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-gray-500 block text-[10px] uppercase">Bank:</span>
                      <span className="font-bold text-gray-900">{currentResolvedNostro.bankName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block text-[10px] uppercase">Account Name:</span>
                      <span className="font-medium text-gray-900">{currentResolvedNostro.accountName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block text-[10px] uppercase">Account No / IBAN:</span>
                      <span className="font-mono font-bold text-blue-900">{currentResolvedNostro.accountNumber}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block text-[10px] uppercase">SWIFT Code:</span>
                      <span className="font-mono font-bold text-gray-900">{currentResolvedNostro.swiftCode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Beneficiary Domestic Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-gray-50/70 rounded-xl text-xs border border-gray-200/70">
                <div>
                  <span className="font-semibold text-gray-500 block text-[10px] uppercase">
                    Beneficiary Bank:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formData.bankDetails.bankName || formData.bankDetails.domesticBank?.bankName || "—"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block text-[10px] uppercase">
                    Beneficiary Name:
                  </span>
                  <span className="font-medium text-gray-900">
                    {formData.bankDetails.accountName || formData.bankDetails.beneficiaryName || "—"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block text-[10px] uppercase">
                    Account Number:
                  </span>
                  <span className="font-mono font-bold text-blue-900">
                    {formData.bankDetails.accountNumber || formData.bankDetails.domesticBank?.accountNumber || "—"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block text-[10px] uppercase">
                    SWIFT / BIC:
                  </span>
                  <span className="font-mono font-bold text-gray-900">
                    {formData.bankDetails.swiftCode || formData.bankDetails.domesticBank?.swiftCode || "—"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-500 block text-[10px] uppercase">
                    Address / Branch:
                  </span>
                  <span className="text-gray-900">
                    {formData.bankDetails.branch || formData.bankDetails.bankAddress || formData.bankDetails.domesticBank?.bankAddress || "—"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>No active domestic bank selected</span>
              </div>
              <p className="text-[11px] text-amber-700 pl-6">
                Please select an active domestic bank from the dropdown above.
              </p>
            </div>
          )}

          {/* Editable Formatted Bank Text (Prints in goods table on invoice) */}
          {formData.bankDetails && (
            <div className="pt-2 space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Bank Details Multi-Line Text (Prints directly in Goods Table area on invoice)
                </label>
                <button
                  type="button"
                  onClick={handleResetBankText}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Reset to Standard Format
                </button>
              </div>
              <textarea
                rows={8}
                value={
                  formData.bankDetails.formattedText ||
                  formData.bankDetails.bankDetailsText ||
                  formData.bankDetails.additionalDetails ||
                  ""
                }
                onChange={(e) => handleCustomBankTextChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono font-medium text-gray-900 bg-white"
                placeholder="Enter or customize bank details..."
              />
            </div>
          )}
        </div>

        {/* Section 7: Totals & Amount in Words */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Total Calculation &amp; Amount in Words
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Total Quantity (MT)
              </span>
              <div className="text-lg font-bold text-gray-900 mt-1">
                {Number(formData.totalQuantity).toLocaleString("en-US", {
                  minimumFractionDigits: 3,
                })}{" "}
                MT
              </div>
            </div>

            <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">
                Total Amount ({formData.currency})
              </span>
              <div className="text-lg font-bold text-blue-900 mt-1">
                {formData.currency}{" "}
                {Number(formData.totalAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">
                Amount Chargeable
              </span>
              <div className="text-lg font-bold text-blue-900 mt-1">
                {formData.currency}{" "}
                {Number(formData.amountChargeable).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Amount Chargeable In Words (Auto-calculated for every currency)
            </label>
            <textarea
              rows={2}
              value={formData.amountInWords}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amountInWords: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-900 uppercase bg-gray-50/40 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section 8: Declaration & Temporary Signatures */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Declaration &amp; Signatures
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Declaration (Editable - Default 100% Kazakhstan Origin)
            </label>
            <textarea
              rows={2}
              value={formData.declaration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, declaration: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-900"
            />
          </div>

          {/* Temporary Upload Signature & Stamp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {/* Signature Upload */}
            <div className="p-3 border border-gray-200 rounded-xl space-y-2 bg-gray-50/40">
              <span className="text-xs font-bold text-gray-700 block">
                Upload Signature (Temporary - Later from Company Signature Master)
              </span>
              <div className="flex items-center gap-3">
                {formData.signatureUrl ? (
                  <div className="relative group">
                    <img
                      src={resolveBackendUrl(formData.signatureUrl)}
                      alt="Signature"
                      className="h-16 w-32 object-contain border border-gray-300 rounded bg-white p-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, signatureUrl: null }))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-32 border border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-400">
                    No Signature
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-2xs cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Signature</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadSignature}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG with transparent bg</p>
                </div>
              </div>
            </div>

            {/* Stamp Upload */}
            <div className="p-3 border border-gray-200 rounded-xl space-y-2 bg-gray-50/40">
              <span className="text-xs font-bold text-gray-700 block">
                Upload Stamp (Temporary - Later from Company Signature Master)
              </span>
              <div className="flex items-center gap-3">
                {formData.stampUrl ? (
                  <div className="relative group">
                    <img
                      src={resolveBackendUrl(formData.stampUrl)}
                      alt="Company Stamp"
                      className="h-16 w-32 object-contain border border-gray-300 rounded bg-white p-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, stampUrl: null }))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-32 border border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-400">
                    No Stamp
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-2xs cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Stamp</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadStamp}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG with stamp seal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Authorized Signatory Name
              </label>
              <input
                type="text"
                value={formData.signatoryName || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, signatoryName: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Signatory Designation
              </label>
              <input
                type="text"
                value={formData.signatoryDesignation || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    signatoryDesignation: e.target.value,
                  }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/documents/export-invoices")}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span>Preview A4 Document</span>
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? "Saving..." : isEdit ? "Update Invoice" : "Issue Invoice"}</span>
          </button>
        </div>
      </form>

      {/* A4 Document Preview Modal */}
      {showPreview && (
        <ExportInvoicePreviewModal
          isOpen={showPreview}
          invoice={formData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
