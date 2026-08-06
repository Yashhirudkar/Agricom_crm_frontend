"use client";
import React from "react";
import { Users } from "lucide-react";
import SearchablePartnerSelect from "@/components/common/SearchablePartnerSelect";

export default function PartySection({ form, setForm, errors, masters = {}, isView }) {
  const buyers = masters.buyers || [];
  const sellers = masters.sellers || [];
  const brokers = masters.brokers || [];

  const buyerRoleId = masters.buyerRoleId || buyers[0]?.partnerRoleId;
  const sellerRoleId = masters.sellerRoleId || sellers[0]?.partnerRoleId;
  const brokerRoleId = masters.brokerRoleId || brokers[0]?.partnerRoleId;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5 rounded-t-2xl">
        <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
          <Users className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Parties</h2>
          <p className="text-[10px] text-gray-400">Buyer, seller, and broker information</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Buyer */}
        <SearchablePartnerSelect
          label="Buyer"
          required
          value={form.buyerId}
          onChange={(val) => setForm((f) => ({ ...f, buyerId: val ? Number(val) : "" }))}
          partnerRoleId={buyerRoleId}
          initialPartners={buyers}
          disabled={isView}
          error={errors.buyerId}
          placeholder="Select Buyer"
          searchPlaceholder="Search partner by name..."
        />

        {/* Seller */}
        <SearchablePartnerSelect
          label="Seller"
          required
          value={form.sellerId}
          onChange={(val) => setForm((f) => ({ ...f, sellerId: val ? Number(val) : "" }))}
          partnerRoleId={sellerRoleId}
          initialPartners={sellers}
          disabled={isView}
          error={errors.sellerId}
          placeholder="Select Seller"
          searchPlaceholder="Search partner by name..."
        />

        {/* Broker */}
        <SearchablePartnerSelect
          label="Broker"
          optionalText="Optional"
          value={form.brokerId}
          onChange={(val) => setForm((f) => ({ ...f, brokerId: val ? Number(val) : null }))}
          partnerRoleId={brokerRoleId}
          initialPartners={brokers}
          disabled={isView}
          placeholder="Select Broker (Optional)"
          searchPlaceholder="Search partner by name..."
        />
      </div>
    </div>
  );
}
