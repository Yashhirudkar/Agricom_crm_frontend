/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  X, Users, Shield, Link as LinkIcon, FileText, Pin, Trash2,
  Archive, LogOut, Check, Save, UserPlus, MoreVertical, ShieldAlert,
  Image as ImageIcon, Bell, Globe, Search, Loader2, Camera, Megaphone
} from "lucide-react";
import { toast } from "sonner";
import usePermissions from "@/hooks/usePermissions";
import axiosClient, { getAvatarUrl } from "@/lib/axios";
import Avatar from "../Timeline/Avatar";
import { POSTING_POLICY } from "@/modules/chat/utils/channelPosting";

export default function GroupSettingsPanel({
  conversation,
  currentUser,
  onClose,
  onUpdateConversation // Callback to trigger list refresh on rename, delete, member add
}) {
  const { checkGroupPermission, hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "members", "shared", "pinned", "danger"
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  // Local state for General Info edit
  const [groupName, setGroupName] = useState(conversation?.name || "");
  const [groupDesc, setGroupDesc] = useState(conversation?.description || "");
  const [groupPhoto, setGroupPhoto] = useState(conversation?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state if conversation changes
  useEffect(() => {
    setGroupName(conversation?.name || "");
    setGroupDesc(conversation?.description || "");
    setGroupPhoto(conversation?.avatarUrl || "");
  }, [conversation]);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingPhoto(true);
      const res = await axiosClient.post("/conversations/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrl = res.data.fileUrl;
      setGroupPhoto(uploadedUrl);

      // Save updated photo immediately
      await axiosClient.put(`/conversations/${conversation.id}`, {
        name: groupName,
        description: groupDesc,
        avatarUrl: uploadedUrl,
      });

      toast.success("Group icon updated successfully!");
      if (onUpdateConversation) onUpdateConversation('update');
    } catch (err) {
      console.error("Failed to upload group photo", err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload group icon.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await axiosClient.put(`/conversations/${conversation.id}`, {
        name: groupName,
        description: groupDesc,
        avatarUrl: groupPhoto,
      });
      toast.success("Group settings updated successfully!");
      if (onUpdateConversation) onUpdateConversation('update');
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
      if (onUpdateConversation) onUpdateConversation('role_update');
    } catch (err) {
      toast.error("Failed to promote/demote group member.");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axiosClient.delete(`/conversations/${conversation.id}/members/${userId}`);
      toast.success("Member removed from group.");
      if (onUpdateConversation) onUpdateConversation('remove_member');
    } catch (err) {
      toast.error("Failed to remove member.");
    }
  };

  const handleLeaveGroup = () => {
    setModalConfig({
      title: "Leave Group",
      message: `Are you sure you want to leave the group "${conversation?.name || 'this group'}"? You will no longer receive or be able to send any messages in this group.`,
      confirmLabel: "Leave Group",
      cancelLabel: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await axiosClient.post(`/chat/conversations/${conversation.id}/leave`);
          toast.success("You left the group.");
          onClose();
          if (onUpdateConversation) onUpdateConversation('leave');
        } catch (err) {
          toast.error("Failed to leave group.");
        }
      }
    });
  };

  const handleDeleteGroup = () => {
    const desc = conversation?.type === "CHANNEL" ? "channel" : "group";
    setModalConfig({
      title: `Delete ${desc.charAt(0).toUpperCase() + desc.slice(1)}`,
      message: `WARNING: Are you sure you want to permanently delete the ${desc} "${conversation?.name || 'this workspace'}"? All chat history and shared assets will be deleted forever. This action cannot be undone.`,
      confirmLabel: `Delete ${desc.charAt(0).toUpperCase() + desc.slice(1)}`,
      cancelLabel: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await axiosClient.delete(`/conversations/${conversation.id}`);
          toast.success(`${desc.charAt(0).toUpperCase() + desc.slice(1)} permanently deleted.`);
          onClose();
          if (onUpdateConversation) onUpdateConversation('delete');
        } catch (err) {
          toast.error(`Failed to delete ${desc}.`);
        }
      }
    });
  };

  const handleArchiveGroup = async () => {
    try {
      await axiosClient.post(`/conversations/${conversation.id}/archive`);
      toast.success("Group conversation archived.");
      onClose();
      if (onUpdateConversation) onUpdateConversation('archive');
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
        {(conversation?.type === "CHANNEL" || conversation?.type === "ANNOUNCEMENT") && (
          <button
            onClick={() => setActiveTab("posting")}
            className={`px-3 py-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1 ${activeTab === "posting" ? "border-violet-600 text-violet-600" : "border-transparent hover:text-slate-800"}`}
          >
            <Megaphone className="h-3 w-3" />
            Posting
          </button>
        )}
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
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div
                  className={`relative group ${canChangePhoto ? "cursor-pointer" : ""}`}
                  onClick={() => canChangePhoto && fileInputRef.current?.click()}
                  title={canChangePhoto ? "Click to change group photo" : ""}
                >
                  {groupPhoto ? (
                    <img
                      src={getAvatarUrl(groupPhoto)}
                      alt={conversation?.name || "Group"}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-inner"
                    />
                  ) : (
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner uppercase tracking-widest ${conversation?.avatarClass || "bg-blue-600 text-white"}`}>
                      {groupName?.slice(0, 2) || conversation?.name?.slice(0, 2) || "GP"}
                    </div>
                  )}

                  {canChangePhoto && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Camera className="h-5 w-5" />
                      )}
                    </div>
                  )}

                  {canChangePhoto && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full shadow-md border-2 border-white">
                      <Camera className="h-3 w-3" />
                    </div>
                  )}
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
                  onClick={() => setShowAddMemberModal(true)}
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
                  <div key={member.userId || member.user?.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
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

        {/* Tab 4: Posting Permissions (CHANNEL/ANNOUNCEMENT only) */}
        {activeTab === "posting" && (
          <PostingPolicyTab
            conversation={conversation}
            currentUser={currentUser}
            members={members}
            onUpdateConversation={onUpdateConversation}
          />
        )}

        {/* Tab 5: Danger actions zone */}
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

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        conversation={conversation}
        currentUser={currentUser}
        onMemberAdded={() => {
          if (onUpdateConversation) onUpdateConversation('add_member');
        }}
      />

      {modalConfig && (
        <ConfirmModal
          isOpen={!!modalConfig}
          onClose={() => setModalConfig(null)}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmLabel={modalConfig.confirmLabel}
          cancelLabel={modalConfig.cancelLabel}
          onConfirm={modalConfig.onConfirm}
          isDestructive={modalConfig.isDestructive}
        />
      )}
    </div>
  );
}

// ── Custom Confirmation Modal ──
function ConfirmModal({ isOpen, onClose, title, message, confirmLabel, cancelLabel, onConfirm, isDestructive }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/80 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        <div className="p-5">
          <h3 className="text-slate-900 font-bold text-[13px] mb-1.5">{title}</h3>
          <p className="text-slate-500 text-[11px] leading-relaxed">{message}</p>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors"
          >
            {cancelLabel || "Cancel"}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors text-white
              ${isDestructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Posting Policy Tab Component
// ─────────────────────────────────────────────
function PostingPolicyTab({ conversation, currentUser, members, onUpdateConversation }) {
  const isAdminOnly = (conversation?.postingPolicy || POSTING_POLICY.EVERYONE) === POSTING_POLICY.ADMINS;
  const [adminOnly, setAdminOnly] = useState(isAdminOnly);
  const [isSaving, setIsSaving] = useState(false);

  // Sync when conversation changes
  useEffect(() => {
    setAdminOnly((conversation?.postingPolicy || POSTING_POLICY.EVERYONE) === POSTING_POLICY.ADMINS);
  }, [conversation?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosClient.patch(`/conversations/${conversation.id}/posting-policy`, {
        postingPolicy: adminOnly ? POSTING_POLICY.ADMINS : POSTING_POLICY.EVERYONE,
        allowedPosters: [],
        allowedRoles: [],
      });
      toast.success(adminOnly ? "Admin-only posting enabled!" : "All members can now post.");
      if (onUpdateConversation) onUpdateConversation('posting_policy');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update posting policy.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Toggle row */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${adminOnly ? "bg-violet-100" : "bg-slate-100"}`}>
            <Megaphone className={`h-3.5 w-3.5 ${adminOnly ? "text-violet-600" : "text-slate-400"}`} />
          </div>
          <div>
            <p className="font-bold text-slate-800">Admin only posting</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {adminOnly ? "Only admins & owner can send messages" : "All members can send messages"}
            </p>
          </div>
        </div>
        {/* Toggle switch */}
        <button
          onClick={() => setAdminOnly(v => !v)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            adminOnly ? "bg-violet-600" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
              adminOnly ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 text-xs"
      >
        {isSaving ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
        ) : (
          <><Save className="h-3.5 w-3.5" /> Save Posting Policy</>
        )}
      </button>
    </div>
  );
}

function AddMemberModal({ isOpen, onClose, conversation, currentUser, onMemberAdded }) {
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = usePermissions();
  const canReadEmployees = hasPermission("employees:read");
  const canReadDepartments = hasPermission("departments:read");
  const canReadDesignations = hasPermission("designations:read");

  // Get current member userIds to exclude
  const existingUserIds = useMemo(() => {
    const set = new Set();
    (conversation?.members || []).forEach(m => {
      const uid = Number(m.userId || m.user?.id);
      if (uid) set.add(uid);
    });
    return set;
  }, [conversation]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedMemberIds([]);
      setIsSubmitting(false);
      return;
    }

    const loadEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        let list = [];
        if (canReadEmployees) {
          try {
            const res = await axiosClient.get("/employees", { params: { limit: 500 } });
            list = res.data?.data || res.data || [];
          } catch (e) {
            // fallback
          }
        }
        if (list.length === 0) {
          const assignableRes = await axiosClient.get("/v1/tasks/employees/assignable");
          const assignableList = assignableRes.data?.data || [];
          let depts = [];
          let desigs = [];
          if (canReadDepartments) {
            try {
              const dRes = await axiosClient.get("/departments/options", { params: { limit: 250 } });
              depts = dRes.data?.data || dRes.data || [];
            } catch (e) { }
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) { }
          }
          const deptMap = Object.fromEntries(depts.map(d => [d.value, d.label]));
          const desigMap = Object.fromEntries(desigs.map(d => [d.value, d.label]));
          list = assignableList
            .map(emp => {
              const u = emp.user || {};
              return {
                id: emp.id,
                userId: emp.userId,
                name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || u.name || emp.email,
                email: emp.email || u.email,
                department: deptMap[emp.departmentId] || "",
                designation: desigMap[emp.designationId] || "",
                avatarUrl: u.avatarUrl || null
              };
            });
        } else {
          list = list
            .map(emp => ({
              id: emp.id,
              userId: emp.userId,
              name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email,
              email: emp.email,
              department: emp.department?.name || "",
              designation: emp.designation?.name || "",
              avatarUrl: emp.avatarUrl || null
            }));
        }

        // Filter out already existing members in this conversation & null userIds
        const available = list.filter(emp => emp.userId && !existingUserIds.has(Number(emp.userId)));
        setEmployees(available);
      } catch (err) {
        console.error("Failed to load employees for group add", err);
        toast.error("Failed to load employee list.");
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [isOpen, canReadEmployees, canReadDepartments, canReadDesignations, existingUserIds]);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  const toggleMember = (userId) => {
    setSelectedMemberIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedMemberIds.length === 0) return;
    setIsSubmitting(true);
    try {
      // Try bulk-add endpoint first
      try {
        await axiosClient.post(`/chat/conversations/${conversation.id}/members/bulk-add`, {
          userIds: selectedMemberIds,
          role: "MEMBER"
        });
      } catch (bulkErr) {
        // Fallback to single add calls
        await Promise.all(selectedMemberIds.map(userId =>
          axiosClient.post(`/conversations/${conversation.id}/members`, { userId })
        ));
      }
      toast.success(`${selectedMemberIds.length} member(s) added successfully!`);
      if (onMemberAdded) onMemberAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to add member(s).");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-xl w-full max-w-md h-[75vh] max-h-[520px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-blue-600" />
            <span>Add Members to {conversation?.name || "Group"}</span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selected Members Pills container */}
        {selectedMemberIds.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-100 bg-white flex-shrink-0 flex items-center gap-1.5 overflow-x-auto min-h-[46px]">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">Selected ({selectedMemberIds.length}):</span>
            <div className="flex items-center gap-1.5 pb-0.5">
              {selectedMemberIds.map(uId => {
                const emp = employees.find(e => e.userId === uId);
                const name = emp ? emp.name.split(" ")[0] : `User #${uId}`;
                return (
                  <div
                    key={`pill-add-${uId}`}
                    onClick={() => toggleMember(uId)}
                    className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 hover:bg-red-50 hover:border-red-100 text-blue-700 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                  >
                    {name}
                    <X className="h-2.5 w-2.5" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-4 py-2 border-b border-slate-100 flex-shrink-0 flex items-center bg-white">
          <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search employee by name, designation, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="h-3 w-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-white">
          {isLoadingEmployees ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-xs font-medium">Loading employees...</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No available employees found to add.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedMemberIds.includes(emp.userId);
                return (
                  <div
                    key={`add-member-${emp.userId}`}
                    onClick={() => toggleMember(emp.userId)}
                    className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/40" : "hover:bg-slate-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => { }}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <Avatar sender={{ name: emp.name, avatarUrl: emp.avatarUrl }} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-xs truncate">{emp.name}</p>
                      {(emp.designation || emp.department) ? (
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {emp.designation}{emp.designation && emp.department ? " • " : ""}{emp.department}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {emp.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50 flex-shrink-0">
          <button
            onClick={handleAddMembers}
            disabled={selectedMemberIds.length === 0 || isSubmitting}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Adding Members...
              </>
            ) : (
              `Add ${selectedMemberIds.length > 0 ? selectedMemberIds.length : ""} Member${selectedMemberIds.length === 1 ? "" : "s"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

