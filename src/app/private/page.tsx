import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";

export const metadata: Metadata = { title: "Private parties" };

export default function Page() {
  return <OfferPage slug="private" />;
}
