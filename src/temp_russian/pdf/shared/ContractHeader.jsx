import React from "react";

/**
 * ContractHeader — Agricom logo + address block
 * Shared by all templates. Renders the top letterhead on every contract.
 */
export default function ContractHeader() {
  return (
    <div className="flex justify-between items-center print-avoid-break">
      <div>
        <img src="/agri_logo.png" alt="Agricom Impex" className="h-32 object-contain" />
      </div>
      <div className="text-right text-[10px] text-gray-900 leading-tight">
        <h1 className="text-base font-bold text-gray-900 uppercase mb-0.5">Agricom Impex</h1>
        <p>202, Amaltas apartment, Rajnagar</p>
        <p>Nagpur (MH), India 440013</p>
        <p>+91 712 2591130 / 34</p>
        <p>info@agricomimpex.com</p>
      </div>
    </div>
  );
}
