import React from "react";
import { Package, ArrowRight, Clock, CheckCheck } from "lucide-react";

export function formatTimelineDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    if (isToday) return `Today ${timeStr}`;
    const dateFormatted = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateFormatted} ${timeStr}`;
  } catch {
    return "";
  }
}

export function formatWhatsAppMessage(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*]+\*)/g);
    return (
      <div key={lineIdx} className={line === "" ? "h-1" : "min-h-[14px]"}>
        {parts.map((part, partIdx) => {
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return (
              <span key={partIdx} className="font-bold text-gray-900">
                {part.slice(1, -1)}
              </span>
            );
          }
          return <span key={partIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

export default function EnquiryActivityCard({ activity, onOpenQuotation }) {
  const {
    type,
    activityType,
    message,
    bidAmount,
    offerAmount,
    currency,
    changedBy,
    metadata = {},
    createdAt,
  } = activity;

  const currentType = activityType || type;
  const authorName = changedBy?.name || metadata?.creatorName || metadata?.updatedByName || metadata?.authorName || "User";
  const timeFormatted = formatTimelineDate(createdAt);

  // ─────────────────────────────────────────────────────────────
  // 1. ENQUIRY_CREATED
  // ─────────────────────────────────────────────────────────────
  if (currentType === "ENQUIRY_CREATED") {
    const productName = metadata?.productName || "Product";
    const partnerName = metadata?.partnerName || "Partner";
    const bid = bidAmount != null ? `${bidAmount} ${currency || "USD"}` : metadata?.bid ? `${metadata.bid} ${currency || "USD"}` : "—";
    const offer = offerAmount != null ? `${offerAmount} ${currency || "USD"}` : metadata?.offer ? `${metadata.offer} ${currency || "USD"}` : "—";
    const quantity = metadata?.quantity ? `${metadata.quantity} MT` : null;

    return (
      <div className="w-fit mx-auto my-2 bg-white rounded-lg border border-emerald-100 shadow-sm p-2 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-900 uppercase">
              Enquiry Created
            </span>
            {metadata?.enquiryNo && (
              <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                {metadata.enquiryNo}
              </span>
            )}
          </div>
          <div className="text-[9px] text-gray-400 flex items-center gap-1">
            <span>{authorName}</span>
            <span>•</span>
            <span>{timeFormatted}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
          <div><span className="text-gray-400">Prod:</span> <span className="font-bold text-gray-800">{productName}</span></div>
          <div><span className="text-gray-400">Partner:</span> <span className="font-bold text-gray-800">{partnerName}</span></div>
          <div><span className="text-gray-400">Bid:</span> <span className="font-bold text-emerald-700">{bid}</span></div>
          <div><span className="text-gray-400">Offer:</span> <span className="font-bold text-blue-700">{offer}</span></div>
          {quantity && <div><span className="text-gray-400">Qty:</span> <span className="font-bold text-gray-800">{quantity}</span></div>}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PRICE_UPDATED / BID_UPDATED / OFFER_UPDATED
  // ─────────────────────────────────────────────────────────────
  if (currentType === "PRICE_UPDATED" || currentType === "BID_UPDATED" || currentType === "OFFER_UPDATED") {
    const isBoth = currentType === "PRICE_UPDATED";
    const isBidOnly = currentType === "BID_UPDATED";
    const title = isBoth ? "Price Updated" : isBidOnly ? "Bid Updated" : "Offer Updated";

    const oldBid = metadata?.oldBid != null ? `${metadata.oldBid} ${metadata.currency || currency || "USD"}` : "—";
    const newBid = metadata?.newBid != null ? `${metadata.newBid} ${metadata.currency || currency || "USD"}` : bidAmount != null ? `${bidAmount} ${currency || "USD"}` : "—";
    const oldOffer = metadata?.oldOffer != null ? `${metadata.oldOffer} ${metadata.currency || currency || "USD"}` : "—";
    const newOffer = metadata?.newOffer != null ? `${metadata.newOffer} ${metadata.currency || currency || "USD"}` : offerAmount != null ? `${offerAmount} ${currency || "USD"}` : "—";

    return (
      <div className="w-fit mx-auto my-2 bg-amber-50/40 rounded-lg border border-amber-100 shadow-sm px-3 py-1.5 flex flex-wrap items-center gap-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">💰</span>
            <span className="text-[10px] font-bold text-amber-900 uppercase">{title}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] bg-white/60 px-2 py-0.5 rounded-md">
            {(isBoth || isBidOnly) && (
              <div className="flex items-center gap-1.5">
                {isBoth && <span className="text-[9px] text-gray-400 uppercase">Bid:</span>}
                <span className="text-gray-400 line-through">{oldBid}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-emerald-700">{newBid}</span>
              </div>
            )}

            {(isBoth || !isBidOnly) && (
              <div className="flex items-center gap-1.5">
                {isBoth && <span className="text-[9px] text-gray-400 uppercase">Offer:</span>}
                <span className="text-gray-400 line-through">{oldOffer}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-blue-700">{newOffer}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-[9px] text-gray-400 flex items-center gap-1 shrink-0">
          <span>{authorName}</span>
          <span>•</span>
          <span>{timeFormatted}</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. WHATSAPP_SENT
  // ─────────────────────────────────────────────────────────────
  if (currentType === "WHATSAPP_SENT") {
    return (
      <div className="w-fit my-2 bg-[#dcf8c6] rounded-lg rounded-tr-none border border-[#c4e8ab] shadow-sm p-2 max-w-[85%] self-end ml-auto relative">
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px]">📲</span>
            <span className="text-[9px] font-bold text-[#075e54] uppercase">Sent</span>
          </div>
          {metadata?.recipient && (
            <span className="text-[8px] font-mono text-gray-500">{metadata.recipient.split("@")[0]}</span>
          )}
        </div>
        <div className="text-[11px] text-gray-800 leading-tight whitespace-pre-wrap">
          {formatWhatsAppMessage(message)}
        </div>
        <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-gray-500">
          <span>{timeFormatted}</span>
          <CheckCheck className="w-3 h-3 text-blue-500" />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. WHATSAPP_RECEIVED
  // ─────────────────────────────────────────────────────────────
  if (currentType === "WHATSAPP_RECEIVED") {
    return (
      <div className="w-fit my-2 bg-white rounded-lg rounded-tl-none border border-gray-200 shadow-sm p-2 max-w-[85%] self-start mr-auto relative">
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px]">💬</span>
            <span className="text-[9px] font-bold text-emerald-800 uppercase">Customer</span>
          </div>
          {metadata?.senderJid && (
            <span className="text-[8px] font-mono text-gray-400">{metadata.senderJid.split("@")[0]}</span>
          )}
        </div>
        <div className="text-[11px] text-gray-900 leading-tight whitespace-pre-wrap">
          {message}
        </div>
        <div className="text-right mt-1 text-[8px] text-gray-400">
          {timeFormatted}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 5. FOLLOW_UP
  // ─────────────────────────────────────────────────────────────
  if (currentType === "FOLLOW_UP") {
    const buyerRemark = metadata?.buyerRemark;
    const ourResponse = metadata?.ourResponse;
    const status = metadata?.status;

    return (
      <div className="w-fit mx-auto my-2 min-w-[200px] max-w-[90%] bg-blue-50/20 rounded-lg border border-blue-100 shadow-sm p-2 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">📝</span>
            <span className="text-[10px] font-bold text-blue-900 uppercase">Follow-up</span>
            {status && (
              <span className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">
                {status}
              </span>
            )}
          </div>
          <div className="text-[9px] text-gray-400 flex items-center gap-1 ml-auto">
            <span>{authorName}</span>
            <span>•</span>
            <span>{timeFormatted}</span>
          </div>
        </div>

        <div className="text-[11px] space-y-1">
          {buyerRemark && (
            <div className="flex gap-1.5">
              <span className="text-gray-400 shrink-0">Buyer:</span>
              <span className="text-gray-800">{buyerRemark}</span>
            </div>
          )}
          {message && !buyerRemark && (
            <p className="text-gray-800">{message}</p>
          )}
          {ourResponse && (
            <div className="flex gap-1.5">
              <span className="text-blue-400 shrink-0">Us:</span>
              <span className="text-gray-800">{ourResponse}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 6. STATUS_CHANGED
  // ─────────────────────────────────────────────────────────────
  if (currentType === "STATUS_CHANGED") {
    return (
      <div className="w-fit mx-auto my-2 bg-white border border-gray-200 shadow-sm px-2 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-gray-500">
        <span>🔄</span>
        <span>Status:</span>
        <span className="line-through">{metadata?.oldStatus || "—"}</span>
        <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
        <span className="font-bold text-blue-600">{metadata?.newStatus || "—"}</span>
        <span className="text-gray-300 mx-1">|</span>
        <span className="text-[9px] text-gray-400">{timeFormatted}</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 7. DEFAULT / QUOTATION / ORDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-fit mx-auto my-2 max-w-[90%] bg-white rounded-lg border border-gray-200 shadow-sm p-2 flex flex-wrap items-center gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        <span className="text-[11px]">📌</span>
        <span className="text-[10px] font-bold text-gray-800 uppercase whitespace-nowrap">
          {currentType.replace(/_/g, " ")}
        </span>
        {message && <span className="text-[11px] text-gray-600 ml-1 truncate max-w-[200px]">{message}</span>}
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {metadata?.quotationId && (
          <button
            onClick={() => onOpenQuotation?.(metadata.quotationId)}
            className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded cursor-pointer whitespace-nowrap"
          >
            View →
          </button>
        )}
        <div className="text-[9px] text-gray-400 flex items-center gap-1 whitespace-nowrap">
          <span>{authorName}</span>
          <span>•</span>
          <span>{timeFormatted}</span>
        </div>
      </div>
    </div>
  );
}