"use client";
import { useParams } from "next/navigation";
import ContractFormPage from "@/modules/sales-contracts/pages/ContractFormPage";

export default function ViewSalesContractPage() {
  const params = useParams();
  return <ContractFormPage viewId={params.id} />;
}
