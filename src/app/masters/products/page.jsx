"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/lib/axios";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  permanentDeleteProduct,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsTotalCount,
  selectProductsTotalPages,
  clearProductsError,
} from "@/store/entities/productSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Package, Check, AlertCircle } from "lucide-react";

import ProductsTable from "@/components/masters/products/ProductsTable";
import ProductsFilters from "@/components/masters/products/ProductsFilters";
import ProductModal from "@/components/masters/products/ProductModal";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

function ProductsContent() {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const totalCount = useSelector(selectProductsTotalCount);
  const totalPages = useSelector(selectProductsTotalPages);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // External dependencies for dropdowns
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [hscodes, setHSCodes] = useState([]);

  const initialFormState = { 
    id: null, 
    name: "", 
    categoryId: "", 
    countryId: "", 
    hsCodeId: "", 
    qualitySubType: "", 
    specification: "", 
    qty20ftContainer: null, 
    qty40ftContainer: null, 
    qty40hcContainer: null, 
    truckCapacity: null, 
    wagonCapacity: null, 
    isActive: true 
  };
  const [form, setForm] = useState(initialFormState);

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load products list
  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
  }, [dispatch, currentPage, search, isActiveFilter]);

  // Load dropdown dependencies once
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [catRes, conRes, hsRes] = await Promise.all([
          axiosClient.get("/masters/categories", { params: { limit: 100, isActive: true } }),
          axiosClient.get("/masters/countries", { params: { limit: 100, isActive: true } }),
          axiosClient.get("/masters/hs-codes", { params: { limit: 100, isActive: true } }),
        ]);
        setCategories(catRes.data.data || []);
        setCountries(conRes.data.data || []);
        setHSCodes(hsRes.data.data || []);
      } catch (err) {
        showToast("Failed to load master lookup data", "error");
      }
    };
    fetchDependencies();
  }, []);

  const openCreateModal = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId || "",
      countryId: item.countryId || "",
      hsCodeId: item.hsCodeId || "",
      qualitySubType: item.qualitySubType || "",
      specification: item.specification || "",
      qty20ftContainer: item.qty20ftContainer ?? null,
      qty40ftContainer: item.qty40ftContainer ?? null,
      qty40hcContainer: item.qty40hcContainer ?? null,
      truckCapacity: item.truckCapacity ?? null,
      wagonCapacity: item.wagonCapacity ?? null,
      isActive: item.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    dispatch(clearProductsError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Clean up empty strings before submitting to match DTO
    const payload = { ...form };
    if (payload.qualitySubType === "") delete payload.qualitySubType;
    if (payload.specification === "") delete payload.specification;
    if (payload.qty20ftContainer === null) delete payload.qty20ftContainer;
    if (payload.qty40ftContainer === null) delete payload.qty40ftContainer;
    if (payload.qty40hcContainer === null) delete payload.qty40hcContainer;
    if (payload.truckCapacity === null) delete payload.truckCapacity;
    if (payload.wagonCapacity === null) delete payload.wagonCapacity;

    try {
      if (isEditMode) {
        await dispatch(updateProduct(payload)).unwrap();
        showToast("Product updated successfully");
      } else {
        const createPayload = { ...payload };
        delete createPayload.id;
        await dispatch(createProduct(createPayload)).unwrap();
        showToast("Product created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchProducts({ page: 1, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save product", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct({ id: deleteTarget.id })).unwrap();
      showToast("Product deactivated successfully");
      
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restoreProduct(restoreTarget.id)).unwrap();
      showToast("Product restored successfully");
      dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeleteProduct({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("Product permanently deleted");
      
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading products...</p>
      </div>
    );
  }

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-[#007aff]" />
            Products
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage global product portfolio, specifications, and logistics.
          </p>
        </div>
        
        <HasPermission permission="product:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Product
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <ProductsFilters
          search={search}
          setSearch={setSearch}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <ProductsTable
          products={products}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
          setRestoreTarget={setRestoreTarget}
          setPermanentDeleteTarget={setPermanentDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleModalSubmit}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        error={error}
        isEditMode={isEditMode}
        categories={categories}
        countries={countries}
        hscodes={hscodes}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Deactivate Product"
        message={`Are you sure you want to deactivate the product "${deleteTarget?.name}"? It will be hidden from normal operations.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore Product"
        message={`Are you sure you want to restore the product "${restoreTarget?.name}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Product"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.name}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
