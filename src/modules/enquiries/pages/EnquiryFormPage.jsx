"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, AlertCircle } from "lucide-react";
import { enquiriesApi } from "../services/enquiriesApi";
import { useEnquiriesMasters } from "../hooks/useEnquiries";
import EnquiryHeaderSection from "../components/EnquiryHeaderSection";
import EnquiryDetailsSection from "../components/EnquiryDetailsSection";

export default function EnquiryFormPage({ id }) {
  const router = useRouter();
  const isView = false;
  const isEdit = false;

  const { masters, loading: mastersLoading } = useEnquiriesMasters();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    enquiryNo: "",
    enquiryDate: new Date().toISOString().split("T")[0],
    partnerRoleId: "",
    partnerId: "",
    productId: "",
    originCountryId: "",
    purity: "",
    packingTypeId: "",
    podPort: "",
    shipmentType: "",
    quantity: "",
    shipmentDate: "",
    buyingInterest: "",
    potentialEnquiry: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.enquiryDate) newErrors.enquiryDate = "Enquiry Date is required";
    if (!form.partnerRoleId) newErrors.partnerRoleId = "Role is required";
    if (!form.partnerId) newErrors.partnerId = "Partner is required";
    if (!form.productId) newErrors.productId = "Product is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        enquiryDate: form.enquiryDate ? new Date(form.enquiryDate).toISOString() : undefined,
        shipmentDate: form.shipmentDate ? new Date(form.shipmentDate).toISOString() : undefined,
        partnerRoleId: Number(form.partnerRoleId),
        partnerId: Number(form.partnerId),
        productId: Number(form.productId),
        originCountryId: form.originCountryId ? Number(form.originCountryId) : undefined,
        packingTypeId: form.packingTypeId ? Number(form.packingTypeId) : undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        buyingInterest: form.buyingInterest ? Number(form.buyingInterest) : undefined,
      };

      // clean up empty strings and UI-only fields
      if (!payload.podPort) delete payload.podPort;
      if (!payload.purity) delete payload.purity;
      if (!payload.shipmentType) delete payload.shipmentType;
      if (!payload.shipmentDate) delete payload.shipmentDate;
      delete payload.enquiryNo;
      // originCountry is a UI-only field (country name string for port dropdown)
      // backend only accepts originCountryId — remove the string version
      delete payload.originCountry;

      await enquiriesApi.create(payload);
      router.push("/enquiries");
    } catch (err) {
      console.error(err);
      let errMsg = "Failed to save enquiry";
      if (err.response?.data?.message) {
        errMsg = Array.isArray(err.response.data.message) 
          ? err.response.data.message.join(", ") 
          : err.response.data.message;
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (mastersLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading masters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/enquiries")}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              New Enquiry
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Create a new customer enquiry for follow-ups
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/enquiries")}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Enquiry
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Error saving enquiry</h3>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-6">
        <EnquiryHeaderSection
          form={form}
          setForm={setForm}
          errors={errors}
          isView={isView}
        />
        
        <EnquiryDetailsSection
          form={form}
          setForm={setForm}
          errors={errors}
          masters={masters}
          isView={isView}
        />
      </div>
      
    </div>
  );
}
