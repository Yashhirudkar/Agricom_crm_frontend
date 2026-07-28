import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Briefcase,
  Search,
  Clock,
  Send,
  MoreVertical,
  User,
  Info,
  Edit2
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import axiosClient from "@/lib/axios";

export default function PartnerFollowUpDrawer({
  isOpen,
  onClose,
  partner,
  onSaveSuccess,
  enquiryId,
  partnerId,
  entityType,
}) {
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Ref for the chat scroll container
  const chatContainerRef = useRef(null);
  // Track whether the user is near the bottom (for background refresh behavior)
  const isNearBottomRef = useRef(true);
  // Set to true when the current user explicitly sends a message
  const isSendingRef = useRef(false);

  const scrollToBottom = (smooth = true) => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "instant" });
  };

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      followupDate: new Date().toISOString().split("T")[0],
      communicationType: "Call",
      buyerRemark: "",
      ourResponse: "",
      nextFollowupDate: "",
      status: "Pending",
      priority: "Medium",
    },
  });

  const selectedNextDate = watch("nextFollowupDate");

  useEffect(() => {
    if (isOpen && partner) {
      setEditingId(null);
      isNearBottomRef.current = true;
      reset({
        followupDate: new Date().toISOString().split("T")[0],
        communicationType: "Call",
        buyerRemark: "",
        ourResponse: "",
        nextFollowupDate: "",
        status: "Pending",
        priority: "Medium",
      });
      fetchFollowUps(true);
    }
  }, [isOpen, partner, reset]);

  useEffect(() => {
    // isSendingRef = user just sent → always scroll to bottom (fires after DOM paint)
    // isNearBottomRef = user was already near bottom → keep them there
    if (isSendingRef.current || isNearBottomRef.current) {
      scrollToBottom();
      isSendingRef.current = false;
    }
  }, [followUps]);

  const fetchFollowUps = async (showLoading = true) => {
    if (!partner) return;
    if (showLoading) setIsLoading(true);
    try {
      const eType = entityType || "partner";
      const eId = entityType === "enquiry" ? enquiryId : (partnerId || partner.id);

      const res = await axiosClient.get(`/masters/partners/${partner.id}/follow-ups`, {
        params: {
          entityType: eType,
          entityId: eId
        }
      });
      const sorted = [...res.data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setFollowUps(sorted);
    } catch (err) {
      console.error("Failed to fetch follow ups", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    reset({
      followupDate: item.followupDate ? new Date(item.followupDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      communicationType: item.communicationType || "Call",
      buyerRemark: item.buyerRemark || "",
      ourResponse: item.ourResponse || "",
      nextFollowupDate: item.nextFollowupDate ? new Date(item.nextFollowupDate).toISOString().split("T")[0] : "",
      status: item.status || "Pending",
      priority: item.priority || "Medium",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({
      followupDate: new Date().toISOString().split("T")[0],
      communicationType: "Call",
      buyerRemark: "",
      ourResponse: "",
      nextFollowupDate: "",
      status: "Pending",
      priority: "Medium",
    });
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        followupDate: new Date(data.followupDate).toISOString(),
        nextFollowupDate: data.nextFollowupDate ? new Date(data.nextFollowupDate).toISOString() : null,
      };
      const pId = partnerId || partner?.id;
      if (pId) payload.partnerId = Number(pId);
      if (enquiryId) payload.enquiryId = String(enquiryId);

      const eType = entityType || "partner";
      const eId = entityType === "enquiry" ? enquiryId : pId;
      
      payload.entityType = eType;
      payload.entityId = Number(eId);

      if (editingId) {
        await axiosClient.patch(`/masters/partners/${partner.id}/follow-ups/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axiosClient.post(`/masters/partners/${partner.id}/follow-ups`, payload);
      }

      // Reset only the text fields, keep the preferences (like comm type)
      reset({
        ...data,
        buyerRemark: "",
        ourResponse: "",
        nextFollowupDate: "",
      });

      // Mark as sending so the useEffect fires scroll AFTER the new message is in the DOM
      isSendingRef.current = true;
      await fetchFollowUps(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Failed to save follow up", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getCommunicationIcon = (type) => {
    switch (type) {
      case "Call": return <Phone className="h-3.5 w-3.5" />;
      case "Email": return <Mail className="h-3.5 w-3.5" />;
      case "WhatsApp": return <MessageCircle className="h-3.5 w-3.5" />;
      case "Meeting": return <Calendar className="h-3.5 w-3.5" />;
      case "Negotiation": return <Briefcase className="h-3.5 w-3.5" />;
      default: return <MessageCircle className="h-3.5 w-3.5" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending" || status === "Waiting Response") return "bg-yellow-100 text-yellow-700";
    if (status === "Confirmed" || status === "Deal Finalized" || status === "Closed") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const filteredTimeline = followUps.filter((item) => {
    if (timelineSearch) {
      const search = timelineSearch.toLowerCase();
      return (
        (item.buyerRemark && item.buyerRemark.toLowerCase().includes(search)) ||
        (item.ourResponse && item.ourResponse.toLowerCase().includes(search)) ||
        item.communicationType.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title=""
      hideHeader={true}
      widthClass="w-full md:w-[600px] lg:w-[650px]"
    >
      <div className="flex flex-col h-full bg-[#E5ECEF] relative overflow-hidden">

        {/* --- CHAT HEADER --- */}
        {partner && (
          <div className="bg-white px-5 py-3 flex items-center justify-between shadow-sm z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                {partner.entityName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800 leading-tight flex items-center gap-2">
                  {partner.entityName}
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active Partner"></span>
                </h2>
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="truncate max-w-[150px]">{partner.partnerRole?.name || "Business Partner"}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{partner.country || "Global"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chat..."
                  value={timelineSearch}
                  onChange={(e) => setTimelineSearch(e.target.value)}
                  className="w-36 transition-all focus:w-48 pl-8 pr-3 py-1.5 bg-gray-100 border-none rounded-full text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- CHAT BODY (MESSAGES) --- */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar" 
          style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 0)', backgroundSize: '20px 20px' }}
        >

          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-500 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
                Loading history...
              </div>
            </div>
          ) : filteredTimeline.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <div className="bg-white p-4 rounded-full mb-3 shadow-sm text-blue-500">
                <MessageCircle className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No conversation history</p>
              <p className="text-xs text-gray-500 mt-1">Start by logging a new follow-up below.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

                  {/* Date & System Meta Pill */}
                  <div className="flex justify-center my-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-500 px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {new Date(item.followupDate).toLocaleDateString()}
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1 text-blue-600">
                        {getCommunicationIcon(item.communicationType)}
                        {item.communicationType}
                      </span>
                    </span>
                  </div>

                  {/* Buyer Remark (Incoming Message - Left) */}
                  {item.buyerRemark && (
                    <div className="flex items-end gap-2 self-start max-w-[85%] sm:max-w-[75%]">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 shadow-sm border border-gray-300">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 relative group">
                        <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">{item.buyerRemark}</p>
                      </div>
                    </div>
                  )}

                  {/* Our Action (Outgoing Message - Right) */}
                  <div className="flex items-end gap-2 self-end max-w-[90%] sm:max-w-[80%] group">
                    <button
                      onClick={() => handleEdit(item)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-blue-600 transition-all mb-1 shrink-0 shadow-sm border border-gray-200"
                      title="Edit this interaction"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col items-end gap-1.5 min-w-[160px]">
                      {item.ourResponse && (
                        <div className="bg-white  p-2.5 rounded-2xl rounded-br-none shadow-[0_1px_2px_rgba(0,0,0,0.1)] relative">
                          <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed px-1">
                            {item.ourResponse}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {item.nextFollowupDate && (
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <Calendar className="w-3 h-3 text-indigo-500" />
                            Next: {new Date(item.nextFollowupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-sm ${getStatusColor(item.status)} border-opacity-30 uppercase tracking-wider`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700 shadow-sm border border-blue-200">
                      <span className="text-[9px] font-black tracking-tighter">ME</span>
                    </div>
                  </div>

                </div>
              ))}
              {/* No chatEndRef needed — we scroll the container directly */}
            </div>
          )}
        </div>

        {/* --- CHAT INPUT (FOOTER FORM) --- */}
        <div className="bg-white p-3 md:p-4 shrink-0 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-20 border-t border-gray-100 relative">
          {editingId && (
            <div className="absolute -top-8 left-0 right-0 bg-yellow-50 border-t border-b border-yellow-200 px-4 py-1.5 flex justify-between items-center z-10">
              <span className="text-xs font-semibold text-yellow-800 flex items-center gap-2">
                <Edit2 className="w-3.5 h-3.5" /> Editing Interaction
              </span>
              <button
                onClick={handleCancelEdit}
                className="text-[10px] font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider px-2 py-0.5 bg-white border border-gray-200 rounded shadow-sm"
              >
                Cancel
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

            {/* Quick Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                {getCommunicationIcon("Call")}
                <select {...register("communicationType")} className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer">
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Negotiation">Negotiation</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                <Info className="h-3.5 w-3.5 text-gray-400" />
                <select {...register("status")} className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer">
                  <option value="Pending">Status: Pending</option>
                  <option value="Waiting Response">Waiting Response</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Deal Finalized">Deal Finalized</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 ml-auto">
                <span className="font-semibold text-blue-700">Next Follow-Up:</span>
                {selectedNextDate ? (
                  <span className="text-blue-700 font-medium text-[11px] bg-white px-2 py-0.5 rounded shadow-sm">
                    {new Date(selectedNextDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                ) : null}
                <div className="relative flex items-center justify-center h-5 w-5 hover:bg-blue-100 rounded-full transition-colors">
                  <Calendar className="h-3.5 w-3.5 text-red-800 pointer-events-none" />
                  <input
                    type="date"
                    {...register("nextFollowupDate")}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Select Next Follow-Up Date"
                  />
                </div>
              </div>
            </div>

            {/* Smart Message Input Box */}
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-1 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">

                {/* Buyer Remark Area */}
                <div className="px-3 py-2 flex gap-2">
                  <User className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <textarea
                    {...register("buyerRemark")}
                    placeholder="What did the buyer say?"
                    className="w-full bg-transparent resize-none text-[13px] outline-none text-gray-800 placeholder:text-gray-400 min-h-[20px] max-h-[80px]"
                    rows={1}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>

                <div className="h-[1px] w-[95%] mx-auto bg-gray-200"></div>

                {/* Our Response Area */}
                <div className="px-3 py-2 flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">ME</div>
                  <textarea
                    {...register("ourResponse")}
                    placeholder="Type your response here..."
                    className="w-full bg-transparent resize-none text-[13px] outline-none text-gray-800 placeholder:text-gray-400 min-h-[20px] max-h-[80px]"
                    rows={1}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSaving}
                className={`mb-1 h-12 w-12 shrink-0 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'} text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md`}
              >
                {isSaving ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : editingId ? (
                  <Edit2 className="w-5 h-5 ml-0.5" />
                ) : (
                  <Send className="w-5 h-5 ml-0.5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
}