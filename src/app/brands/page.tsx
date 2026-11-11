import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";

export const metadata: Metadata = { title: "Brand activations" };

export default function Page() {
  return <OfferPage slug="brands" />;
}
