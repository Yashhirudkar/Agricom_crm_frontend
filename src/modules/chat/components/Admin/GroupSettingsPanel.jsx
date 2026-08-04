"use client";

import React, { useState, useMemo } from "react";
import { 
  X, Users, Shield, Link as LinkIcon, FileText, Pin, Trash2, 
  Archive, LogOut, Check, Save, UserPlus, MoreVertical, ShieldAlert,
  Image as ImageIcon, Bell, Globe
} from "lucide-react";
import { toast } from "sonner";
import usePermissions from "@/hooks/usePermissions";
import axiosClient from "@/lib/axios";
import Avatar from "../Timeline/Avatar";

export default function GroupSettingsPanel({ 
  conversation, 
  currentUser, 
  onClose,
  onUpdateConversation // Callback to trigger list refresh on rename or delete
}) {
  const { checkGroupPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "members", "shared", "pinned", "danger"
  
  // Local state for General Info edit
  const [groupName, setGroupName] = useState(conversation?.name || "");
  const [groupDesc, setGroupDesc] = useState(conversation?.description || "");
  const [groupPhoto, setGroupPhoto] = useState(conversation?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  // Members lists
  const members = useMemo(() => conversation?.members || [], [conversation]);
  
  // Custom user identity resolution
  const currentMember = useMemo(() => {
    const uid = currentUser?.id || currentUser?.userId;
    return members.find(m => Number(m.userId || m.user?.id) === Number(uid));
  }, [members, currentUser]);

  // Check group action permission helpers
  const canRename = checkGroupPermission("rename", conversation, currentUser);
  const canChangeDesc = checkGroupPermission("change_description", conversation, currentUser);
  const canChangePhoto = checkGroupPermission("change_photo", conversation, currentUser);
  const canAddMembers = checkGroupPermission("add_members", conversation, currentUser);
  const canRemoveMembers = checkGroupPermission("remove_members", conversation, currentUser);
  const canPromoteAdmin = checkGroupPermission("promote_admin", conversation, currentUser);
  const canDemoteAdmin = checkGroupPermission("demote_admin", conversation, currentUser);
  const canDelete = checkGroupPermission("delete", conversation, currentUser);
  const canArchive = checkGroupPermission("archive", conversation, currentUser);
  const canLeave = checkGroupPermission("leave", conversation, currentUser) && currentMember?.role !== "OWNER";
  const canManageInvite = checkGroupPermission("manage_invite_link", conversation, currentUser);

  // Invite link generation/copy state
  const [inviteUrl, setInviteUrl] = useState("");
  const [copying, setCopying] = useState(false);

  const handleCopyInvite = () => {
    const dummyUrl = `${window.location.origin}/chat/invite/${conversation?.id}`;
    navigator.clipboard.writeText(dummyUrl);
    setCopying(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopying(false), 2000);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await axiosClient.put(`/conversations/${conversation.id}`, {
        name: groupName,
        description: groupDesc
      });
      toast.success("Group settings updated successfully!");
      if (onUpdateConversation) onUpdateConversation();
    } catch (err) {
      toast.error(err.message || "Failed to update group information.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMemberRole = async (userId, targetRole) => {
    try {
      await axiosClient.put(`/conversations/${conversation.id}/members/${userId}/role`, {
        role: targetRole
      });
      toast.success(`Role updated to ${targetRole}.`);
      if (onUpdateConversation) onUpdateConversation();
    } catch (err) {
      toast.error("Failed to promote/demote group member.");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axiosClient.delete(`/conversations/${conversation.id}/members/${userId}`);
      toast.success("Member removed from group.");
      if (onUpdateConversation) onUpdateConversation();
    } catch (err) {
      toast.error("Failed to remove member.");
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    try {
      await axiosClient.post(`/chat/conversations/${conversation.id}/leave`);
      toast.success("You left the group.");
      onClose();
      if (onUpdateConversation) onUpdateConversation();
    } catch (err) {
      toast.error("Failed to leave group.");
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm("WARNING: Are you sure you want to permanently delete this group? All history will be deleted.")) return;
    try {
      await axiosClient.delete(`/conversations/${conversation.id}`);
      toast.success("Group permanently deleted.");
      onClose();
      if (onUpdateConversation) onUpdateConversation();
    } catch (err) {
      toast.error("Failed to delete group.");
    }
  };

  const handleArchiveGroup = async () => {
    try {
      await axiosClient.delete(`/conversations/${conversation.id}/archive`);
      toast.success("Group conversation archived.");
      onClose();
      if (onUpdateConversation) onUpdateConversation();
    } catch (err) {
      toast.error("Failed to archive group.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-slate-200 text-slate-700 select-none animate-in slide-in-from-right duration-200">
      {/* Header section */}
      <header className="h-[60px] px-4 border-b border-slate-200/60 flex items-center justify-between bg-[#F7F8FA] flex-shrink-0">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <span>Group Settings</span>
        </h3>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors text-slate-500 hover:text-slate-800"
          aria-label="Close settings drawer"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Tabs list */}
      <div className="flex border-b border-slate-100 bg-[#F7F8FA] text-[11px] font-bold text-slate-500 px-2 flex-shrink-0 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("overview")} 
          className={`px-3 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-slate-800"}`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab("members")} 
          className={`px-3 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "members" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-slate-800"}`}
        >
          Members ({members.length})
        </button>
        <button 
          onClick={() => setActiveTab("shared")} 
          className={`px-3 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "shared" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-slate-800"}`}
        >
          Files
        </button>
        {canRename || canDelete || canArchive || canLeave ? (
          <button 
            onClick={() => setActiveTab("danger")} 
            className={`px-3 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "danger" ? "border-red-600 text-red-650" : "border-transparent hover:text-slate-800"}`}
          >
            Danger Zone
          </button>
        ) : null}
      </div>

      {/* Scroll content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Tab 1: Overview & General Edit */}
        {activeTab === "overview" && (
          <div className="space-y-4 text-xs">
            {/* Group details form details */}
            <div className="space-y-3.5">
              <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner uppercase tracking-widest ${conversation?.avatarClass || "bg-blue-600 text-white"}`}>
                  {conversation?.name?.slice(0, 2) || "GP"}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-3">{conversation?.name}</h4>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                  {conversation?.type === "CHANNEL" ? "Public Channel" : "Private Group Workspace"}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Group Name</label>
                <input 
                  type="text" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={!canRename}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea 
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  disabled={!canChangeDesc}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 font-medium text-slate-800 h-16 resize-none"
                />
              </div>

              {(canRename || canChangeDesc) && (
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving || !groupName.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              )}
            </div>

            {/* Invite link section */}
            {canManageInvite && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Group Invitation</label>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Generate secure invite URL link to invite other teammate employees into this workspace.
                </p>
                <button
                  onClick={handleCopyInvite}
                  disabled={copying}
                  className="w-full py-1.5 bg-[#F7F8FA] border border-slate-200 hover:border-slate-350 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  <span>{copying ? "Copied!" : "Copy Invite Link"}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Member Management list */}
        {activeTab === "members" && (
          <div className="space-y-3">
            {/* Header members block */}
            <div className="flex items-center justify-between pb-1 flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Group Directory</span>
              {canAddMembers && (
                <button 
                  onClick={() => toast.info("To add members, click the main panel create icon.")}
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            {/* Members scroll rows */}
            <div className="divide-y divide-slate-100">
              {members.map(member => {
                const u = member.user || {};
                const name = u.employee 
                  ? `${u.employee.firstName || ""} ${u.employee.lastName || ""}`.trim()
                  : u.name || u.email || "Member";
                
                const isMe = Number(u.id || member.userId) === Number(currentUser?.id || currentUser?.userId);
                
                return (
                  <div key={member.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <Avatar sender={{ name, avatarUrl: u.avatarUrl }} size="sm" />
                      <div className="truncate">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <span className="truncate">{name}</span>
                          {isMe && (
                            <span className="px-1 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">Me</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {u.employee?.designation?.name || "Staff"} • {member.role}
                        </div>
                      </div>
                    </div>

                    {/* Member role promoting & kicking settings menu */}
                    {!isMe && member.role !== "OWNER" && (canRemoveMembers || canPromoteAdmin) && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {canPromoteAdmin && (
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(u.id || member.userId, e.target.value)}
                            className="bg-[#F7F8FA] border border-slate-200 text-[10px] font-bold text-slate-600 rounded px-1 py-0.5 outline-none cursor-pointer focus:border-blue-400"
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MODERATOR">Mod</option>
                            <option value="GUEST">Guest</option>
                          </select>
                        )}
                        
                        {canRemoveMembers && (
                          <button
                            onClick={() => handleRemoveMember(u.id || member.userId)}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Shared Files & media lists */}
        {activeTab === "shared" && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Documents & Attachments</span>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center flex flex-col items-center justify-center py-8">
                <FileText className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">No shared files found</span>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                  Files, documents, and spreadsheets shared in this channel stack here automatically.
                </p>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Links & References</span>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center flex flex-col items-center justify-center py-8">
                <LinkIcon className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">No shared links found</span>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                  Web references, URLs, and browser references shared in conversation gather here.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Danger actions zone */}
        {activeTab === "danger" && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50/60 border border-red-150 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="h-4.5 w-4.5 text-red-650 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-750">Administrative Guardrails</h4>
                <p className="text-[10.5px] text-red-700 mt-1 leading-relaxed">
                  Destructive configurations below are absolute. Group archives or deletions cannot be reversed once triggered.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {canLeave && (
                <button
                  onClick={handleLeaveGroup}
                  className="w-full py-2 bg-white border border-red-200 hover:bg-red-50 text-red-650 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Leave Group Workspace</span>
                </button>
              )}

              {canArchive && (
                <button
                  onClick={handleArchiveGroup}
                  className="w-full py-2 bg-white border border-amber-200 hover:bg-amber-50 text-amber-650 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>Archive Conversation</span>
                </button>
              )}

              {canDelete && (
                <button
                  onClick={handleDeleteGroup}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Group Permanently</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
