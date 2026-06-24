"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Users, Check, AlertCircle } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import FloatingActionBar from "@/components/users/FloatingActionBar";
import InviteUserModal from "@/components/users/InviteUserModal";
import UserDetailsDrawer from "@/components/users/UserDetailsDrawer";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useUsersPage } from "@/hooks/useUsersPage";

function UsersContent() {
  const searchParams = useSearchParams();
  
  const {
    users,
    meta,
    companies,
    userType,
    toast,
    selectedUser,
    setSelectedUser,
    drawerOpen,
    setDrawerOpen,
    activeTab,
    setActiveTab,
    userLogs,
    loadingDetails,
    inviteOpen,
    setInviteOpen,
    inviteForm,
    setInviteForm,
    inviteSaving,
    inviteClients,
    inviteCompanies,
    inviteRoles,
    selectedUserIds,
    setSelectedUserIds,
    bulkAction,
    setBulkAction,
    bulkTargetId,
    setBulkTargetId,
    bulkRoleId,
    setBulkRoleId,
    bulkLoading,
    assignWorkspaceOpen,
    setAssignWorkspaceOpen,
    assignForm,
    setAssignForm,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    companyFilter,
    setCompanyFilter,
    sortField,
    sortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleInviteClientChange,
    handleOpenDrawer,
    handleInviteSubmit,
    closeInviteModal,
    handleBulkStatus,
    handleBulkAssignCompanySubmit,
    handleBulkAssignRoleSubmit,
    handleAssignWorkspaceSubmit,
    handleRemoveWorkspace,
    handleDeleteUser,
    toggleUserStatusDrawer,
    handleSelectRow,
    handleSort,
  } = useUsersPage();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && users.length > 0) {
      const userObj = users.find((u) => u.id.toString() === id);
      if (userObj) {
        handleOpenDrawer(userObj);
      }
    }
  }, [searchParams, users]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#007aff]" />
            User Access Management
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Invite users, map workspaces, and control contextual client roles.
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create User
        </button>
      </div>

      {/* Meta User Quota Limit Alert */}
      {meta && (
        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-blue-900">Tenant User Slot Meter</h3>
            <p className="text-[10px] text-blue-600 font-medium">
              Calculates all active, inactive, and invited user slots against your client limit.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-900">
              {meta.currentUsers} / {meta.maxUsers} Users
            </span>
            <div className="w-36 h-2 bg-blue-100/70 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  meta.currentUsers >= meta.maxUsers ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min((meta.currentUsers / meta.maxUsers) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <UserFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          setCurrentPage={setCurrentPage}
          companies={companies}
          filteredCount={users.length}
        />

        <UsersTable
          paginatedUsers={users}
          selectedUserIds={selectedUserIds}
          selectedUser={selectedUser}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleOpenDrawer={handleOpenDrawer}
          setDeleteTarget={setDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={meta?.totalPages || 1} onPageChange={setCurrentPage} />
      </div>

      <FloatingActionBar
        selectedUserIds={selectedUserIds}
        handleBulkStatus={handleBulkStatus}
        setBulkAction={setBulkAction}
        setBulkTargetId={setBulkTargetId}
        setBulkRoleId={setBulkRoleId}
        setSelectedUserIds={setSelectedUserIds}
        bulkLoading={bulkLoading}
      />

      <UserDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loadingDetails={loadingDetails}
        userLogs={userLogs}
        toggleUserStatusDrawer={toggleUserStatusDrawer}
        setAssignForm={setAssignForm}
        setAssignWorkspaceOpen={setAssignWorkspaceOpen}
        handleRemoveWorkspace={handleRemoveWorkspace}
      />

      <InviteUserModal
        inviteOpen={inviteOpen}
        closeInviteModal={closeInviteModal}
        inviteForm={inviteForm}
        setInviteForm={setInviteForm}
        handleInviteSubmit={handleInviteSubmit}
        userType={userType}
        inviteClients={inviteClients}
        handleInviteClientChange={handleInviteClientChange}
        inviteCompanies={inviteCompanies}
        inviteRoles={inviteRoles}
        inviteSaving={inviteSaving}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove User Access"
        message={`Are you sure you want to permanently remove ${deleteTarget?.name}? They will instantly lose access to all mapped workspaces.`}
        confirmText="Remove User"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-semibold">Loading App...</div>}>
      <UsersContent />
    </Suspense>
  );
}
