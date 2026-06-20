"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  selectCountries,
  selectCountriesLoading,
  selectCountriesError,
  selectCountriesTotalCount,
  selectCountriesTotalPages,
  clearCountriesError,
} from "@/store/entities/countrySlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Globe, Check, AlertCircle } from "lucide-react";

import CountriesTable from "@/components/masters/countries/CountriesTable";
import CountriesFilters from "@/components/masters/countries/CountriesFilters";
import CountryModal from "@/components/masters/countries/CountryModal";

function CountriesContent() {
  const dispatch = useDispatch();

  const countries = useSelector(selectCountries);
  const isLoading = useSelector(selectCountriesLoading);
  const error = useSelector(selectCountriesError);
  const totalCount = useSelector(selectCountriesTotalCount);
  const totalPages = useSelector(selectCountriesTotalPages);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState = { id: null, name: "", iso2Code: "", iso3Code: "", phoneCode: "", currencyCode: "", region: "", isActive: true };
  const [form, setForm] = useState(initialFormState);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchCountries({ page: currentPage, limit: itemsPerPage, search }));
  }, [dispatch, currentPage, search]);

  const openCreateModal = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (country) => {
    setForm({
      id: country.id,
      name: country.name,
      iso2Code: country.iso2Code,
      iso3Code: country.iso3Code,
      phoneCode: country.phoneCode || "",
      currencyCode: country.currencyCode || "",
      region: country.region || "",
      isActive: country.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    dispatch(clearCountriesError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await dispatch(updateCountry(form)).unwrap();
        showToast("Country updated successfully");
      } else {
        await dispatch(createCountry({ 
          name: form.name, 
          iso2Code: form.iso2Code, 
          iso3Code: form.iso3Code, 
          phoneCode: form.phoneCode, 
          currencyCode: form.currencyCode, 
          region: form.region 
        })).unwrap();
        showToast("Country created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchCountries({ page: 1, limit: itemsPerPage, search }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save country", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteCountry(deleteTarget.id)).unwrap();
      showToast("Country deleted successfully");
      
      if (countries.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchCountries({ page: currentPage, limit: itemsPerPage, search }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to delete country", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && countries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading countries...</p>
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
            <Globe className="h-6 w-6 text-[#007aff]" />
            Countries
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage global countries and regions.
          </p>
        </div>
        
        <HasPermission permission="country:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Country
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <CountriesFilters
          search={search}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <CountriesTable
          countries={countries}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <CountryModal
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleModalSubmit}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        error={error}
        isEditMode={isEditMode}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Country"
        message={`Are you sure you want to delete the country "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default function CountriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <CountriesContent />
    </Suspense>
  );
}
