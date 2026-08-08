import { redirect } from "next/navigation";

export const metadata = {
  title: "New Enquiry | Agricom CRM",
};

export default function Page() {
  redirect("/enquiries?new=true");
}
