"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBagTypes,
  fetchPackingTypes,
  fetchBagSpecs,
  createBagType,
  deleteBagType,
  createPackingType,
  deletePackingType,
  createBagSpec,
  updateBagSpec,
  deleteBagSpec,
  selectBagTypes,
  selectPackingTypes,
  selectBagSpecs,
  selectBagSpecsTotalCount,
  selectBagSpecsTotalPages,
  selectBagSpecsLoading,
  selectBagSpecsError,
  clearBagSpecsError,
} from "@/store/entities/bagSpecsSlice";
import Pagination from "@/components/common/Pagination";
import BagSpecsTable from "@/components/masters/bag-specs/BagSpecsTable";
import BagSpecsFilters from "@/components/masters/bag-specs/BagSpecsFilters";
import BagTypeManager from "@/components/masters/bag-specs/BagTypeManager";
import PackingTypeManager from "@/components/masters/bag-specs/PackingTypeManager";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Modal from "@/components/modals/Modal";
import {
  Package2,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Loader2,
  Settings2,
  X,
} from "lucide-react";

const emptyForm = {
  id: null,
  bagTypeId: "",
  packingTypeId: "",
  width: "",
  length: "",
  emptyBagWeight: "",
  cost: "",
};

function BagSpecsContent() {
  const dispatch = useDispatch();

  const bagTypes = useSelector(selectBagTypes);
  const packingTypes = useSelector(selectPackingTypes);
  const specs = useSelector(selectBagSpecs);
  const totalCount = useSelector(selectBagSpecsTotalCount);
  const totalPages = useSelector(selectBagSpecsTotalPages);
  const isLoading = useSelector(selectBagSpecsLoading);
  const error = useSelector(selectBagSpecsError);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Form state
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Spec Form Modal
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  // Masters Modal visibility
  const [showMasters, setShowMasters] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [bagTypeFilter, setBagTypeFilter] = useState("");
  const [packingTypeFilter, setPackingTypeFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(fetchBagTypes({ isActive: true }));
    dispatch(fetchPackingTypes({ isActive: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchBagSpecs({
        page: currentPage,
        limit: itemsPerPage,
        search: search || undefined,
        bagTypeId: bagTypeFilter || undefined,
        packingTypeId: packingTypeFilter || undefined,
        isActive: isActiveFilter || undefined,
      })
    );
  }, [dispatch, currentPage, search, bagTypeFilter, packingTypeFilter, isActiveFilter]);

  const handleEdit = (spec) => {
    setForm({
      id: spec.id,
      bagTypeId: spec.bagTypeId || "",
      packingTypeId: spec.packingTypeId || "",
      width: spec.width ?? "",
      length: spec.length ?? "",
      emptyBagWeight: spec.emptyBagWeight ?? "",
      cost: spec.cost ?? "",
    });
    setIsSpecModalOpen(true);
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setFormError("");
    dispatch(clearBagSpecsError());
    setIsSpecModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bagTypeId) {
      setFormError("Bag Type is required.");
      return;
    }
    setIsSaving(true);
    setFormError("");

    const payload = {
      bagTypeId: parseInt(form.bagTypeId),
      packingTypeId: form.packingTypeId ? parseInt(form.packingTypeId) : undefined,
      width: form.width !== "" ? parseFloat(form.width) : undefined,
      length: form.length !== "" ? parseFloat(form.length) : undefined,
      emptyBagWeight: form.emptyBagWeight !== "" ? parseFloat(form.emptyBagWeight) : undefined,
      cost: form.cost !== "" ? parseFloat(form.cost) : undefined,
    };

    try {
      if (form.id) {
        await dispatch(updateBagSpec({ id: form.id, ...payload })).unwrap();
        showToast("Bag specification updated successfully");
      } else {
        await dispatch(createBagSpec(payload)).unwrap();
        showToast("Bag specification created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchBagSpecs({ page: 1, limit: itemsPerPage, isActive: isActiveFilter }));
      }
      setForm(emptyForm);
      setIsSpecModalOpen(false);
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save specification");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBagSpec(deleteTarget.id)).unwrap();
      showToast("Specification deactivated successfully");
      setDeleteTarget(null);
      dispatch(fetchBagSpecs({ page: currentPage, limit: itemsPerPage, isActive: isActiveFilter }));
    } catch (err) {
      showToast(typeof err === "string" ? err : "Failed to deactivate", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // BagType handlers
  const handleAddBagType = async (data) => {
    await dispatch(createBagType(data)).unwrap();
    dispatch(fetchBagTypes({ isActive: true }));
  };

  const handleDeleteBagType = async (id) => {
    await dispatch(deleteBagType(id)).unwrap();
    dispatch(fetchBagTypes({ isActive: true }));
  };

  // PackingType handlers
  const handleAddPackingType = async (data) => {
    await dispatch(createPackingType(data)).unwrap();
    dispatch(fetchPackingTypes({ isActive: true }));
  };

  const handleDeletePackingType = async (id) => {
    await dispatch(deletePackingType(id)).unwrap();
    dispatch(fetchPackingTypes({ isActive: true }));
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Package2 className="h-6 w-6 text-[#007aff]" />
            Bag Specifications
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Dynamic packaging master — manage bag types, packing sizes, and specification combinations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              setForm(emptyForm);
              setFormError("");
              setIsSpecModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#007aff] text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Specification
          </button>
          <button
            id="toggle-masters-btn"
            onClick={() => setShowMasters(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Settings2 className="h-4 w-4 text-gray-500" />
            Manage Masters
          </button>
        </div>
      </div>

      {/* Masters Modal — Bag Types + Packing Types */}
      <Modal
        isOpen={showMasters}
        onClose={() => setShowMasters(false)}
        title="Manage Masters"
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          <div className="bg-white rounded-2xl border border-dashed border-blue-300 shadow-xs p-5 h-[400px] overflow-y-auto">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#007aff]" />
              Bag Types
            </h3>
            <BagTypeManager
              bagTypes={bagTypes}
              onAdd={handleAddBagType}
              onDelete={handleDeleteBagType}
            />
          </div>
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 shadow-xs p-5 h-[400px] overflow-y-auto">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Packing Types
            </h3>
            <PackingTypeManager
              packingTypes={packingTypes}
              onAdd={handleAddPackingType}
              onDelete={handleDeletePackingType}
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={() => setShowMasters(false)}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </Modal>

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={isSpecModalOpen}
        onClose={handleCancelEdit}
        title={form.id ? "Edit Specification" : "Create New Specification"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} id="bag-spec-form" className="py-2">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Bag Type */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Bag Type <span className="text-red-500">*</span>
              </label>
              <select
                id="bag-type-select"
                value={form.bagTypeId}
                onChange={(e) => setForm({ ...form, bagTypeId: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 bg-white shadow-sm"
              >
                <option value="">Select Bag Type...</option>
                {bagTypes.map((bt) => (
                  <option key={bt.id} value={bt.id}>{bt.name}</option>
                ))}
              </select>
            </div>

            {/* Packing Type */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Packing Type
              </label>
              <select
                id="packing-type-select"
                value={form.packingTypeId}
                onChange={(e) => setForm({ ...form, packingTypeId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 bg-white shadow-sm"
              >
                <option value="">Bulk / None</option>
                {packingTypes.map((pt) => (
                  <option key={pt.id} value={pt.id}>{pt.name}</option>
                ))}
              </select>
            </div>

            {/* Width */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Width (inch)
              </label>
              <input
                id="spec-width"
                type="number"
                step="0.01"
                min="0"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 font-mono bg-white shadow-sm"
                placeholder="22"
              />
            </div>

            {/* Length */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Length (inch)
              </label>
              <input
                id="spec-length"
                type="number"
                step="0.01"
                min="0"
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 font-mono bg-white shadow-sm"
                placeholder="32"
              />
            </div>

            {/* Empty Bag Weight */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Empty Bag Weight (GM)
              </label>
              <input
                id="spec-empty-weight"
                type="number"
                step="0.01"
                min="0"
                value={form.emptyBagWeight}
                onChange={(e) => setForm({ ...form, emptyBagWeight: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 font-mono bg-white shadow-sm"
                placeholder="80"
              />
            </div>

            {/* Cost Per Bag */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Cost Per Bag (₹)
              </label>
              <input
                id="spec-cost"
                type="number"
                step="0.01"
                min="0"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 font-mono bg-white shadow-sm"
                placeholder="9.25"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
              {formError && (
                <p className="text-red-500 text-[11px] font-semibold mr-auto">{formError}</p>
              )}
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-spec-btn"
                disabled={isSaving}
                className="px-5 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-70"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {form.id ? "Save Changes" : "Create Specification"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <BagSpecsFilters
          search={search}
          setSearch={setSearch}
          bagTypeFilter={bagTypeFilter}
          setBagTypeFilter={setBagTypeFilter}
          packingTypeFilter={packingTypeFilter}
          setPackingTypeFilter={setPackingTypeFilter}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          bagTypes={bagTypes}
          packingTypes={packingTypes}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        {isLoading && specs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-6 w-6 text-[#007aff] animate-spin mb-2" />
            <p className="text-xs text-gray-400 font-semibold">Loading specifications...</p>
          </div>
        ) : (
          <BagSpecsTable
            specs={specs}
            onEdit={handleEdit}
            onDelete={(spec) => setDeleteTarget(spec)}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Deactivate Specification"
        message={`Deactivate the specification "${deleteTarget?.bagType?.name} — ${deleteTarget?.packingType?.name || "Bulk"}"? It will no longer appear in new assignments.`}
      />
    </div>
  );
}

export default function BagSpecificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <BagSpecsContent />
    </Suspense>
  );
}
