import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";

export const metadata: Metadata = { title: "Hens" };

export default function Page() {
  return <OfferPage slug="hens" />;
}
