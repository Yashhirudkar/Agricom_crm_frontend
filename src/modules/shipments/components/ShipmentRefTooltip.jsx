"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FileText } from "lucide-react";

export default function ShipmentRefTooltip({ shipment, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: "bottom" });

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 290;
    const popoverHeight = 170;

    // Determine placement (flip up if close to viewport bottom)
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceBelow >= popoverHeight || spaceBelow >= 180 ? "bottom" : "top";

    const top =
      placement === "bottom"
        ? rect.bottom + 6
        : Math.max(10, rect.top - popoverHeight - 6);

    // Align left to trigger, clamped within screen margins
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - popoverWidth - 12);
    }
    left = Math.max(12, left);

    setCoords({ top, left, placement });
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    // Delay 150ms
    showTimeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    // Delay 150ms
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handlePopoverMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEvents = () => updatePosition();
    window.addEventListener("scroll", handleEvents, true);
    window.addEventListener("resize", handleEvents);
    return () => {
      window.removeEventListener("scroll", handleEvents, true);
      window.removeEventListener("resize", handleEvents);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const businessRefNo =
    shipment?.businessReference ||
    shipment?.businessTransaction?.businessReference ||
    "-";

  const salesContractNo =
    shipment?.salesContractNo && shipment.salesContractNo !== "-"
      ? shipment.salesContractNo
      : shipment?.salesContract?.contractNumber
      ? String(shipment.salesContract.contractNumber).trim().toUpperCase().startsWith("SC-")
        ? String(shipment.salesContract.contractNumber).trim()
        : `SC-${String(shipment.salesContract.contractNumber).trim()}`
      : "-";

  const purchaseContractNo =
    shipment?.purchaseContractNo && shipment.purchaseContractNo !== "-"
      ? shipment.purchaseContractNo
      : shipment?.purchaseContract?.contractNumber
      ? String(shipment.purchaseContract.contractNumber).trim().toUpperCase().startsWith("PC-")
        ? String(shipment.purchaseContract.contractNumber).trim()
        : `PC-${String(shipment.purchaseContract.contractNumber).trim()}`
      : "-";

  const shipmentRefNo =
    shipment?.shipmentRefNo && shipment.shipmentRefNo !== "-"
      ? shipment.shipmentRefNo
      : shipment?.shipmentReference ||
        (shipment?.shipmentNo ? `SH-${String(shipment.shipmentNo).padStart(6, "0")}` : "-");

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex items-center cursor-pointer"
      >
        {children}
      </div>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
              width: "290px",
            }}
            className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none text-left pointer-events-auto"
          >
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-gray-800 tracking-wide">
                Shipment Details
              </span>
            </div>

            {/* Content Table / Key-Value List */}
            <div className="p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 font-medium whitespace-nowrap">
                  Business Ref
                </span>
                <span className="font-mono font-semibold text-blue-600 text-right truncate">
                  {businessRefNo}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 font-medium whitespace-nowrap">
                  Sales Contract
                </span>
                <span className="font-mono font-semibold text-gray-900 text-right truncate">
                  {salesContractNo}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 font-medium whitespace-nowrap">
                  Purchase Contract
                </span>
                <span className="font-mono font-semibold text-gray-900 text-right truncate">
                  {purchaseContractNo}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 font-medium whitespace-nowrap">
                  Shipment Ref
                </span>
                <span className="font-mono font-semibold text-gray-900 text-right truncate">
                  {shipmentRefNo}
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
