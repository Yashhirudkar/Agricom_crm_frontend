"use client";
import { useParams } from "next/navigation";
import ContractFormPage from "@/modules/sales-contracts/pages/ContractFormPage";

export default function EditSalesContractPage() {
  const params = useParams();
  return <ContractFormPage editId={params.id} />;
}
