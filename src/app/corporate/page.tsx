import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";

export const metadata: Metadata = { title: "Corporate Sweat" };

export default function Page() {
  return <OfferPage slug="corporate" />;
}
