import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { spotsLeft } from "@/lib/bookings";
import { bookableClass, longDate, PARK_PRICE } from "@/lib/park";
import BookForm from "./BookForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Book a mat" };

export default async function BookPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const cls = bookableClass(date);
  if (!cls) notFound();
  const left = await spotsLeft(date);

  return (
    <section className="wrap" style={{ paddingTop: 48, maxWidth: 720 }}>
      <p className="label">Pilates in the Park · 8am · 45 min</p>
      <h1 className="display" style={{ fontSize: "clamp(40px,7vw,72px)", marginTop: 12 }}>
        {longDate(date)}
      </h1>
      <p className="mono" style={{ color: "var(--red)", marginTop: 12 }}>
        {left === 0 ? "Full" : `${left} of 20 mats left`}
      </p>
      {left === 0 ? (
        <p style={{ marginTop: 24 }}>
          This one&apos;s full. <Link href="/park">Pick another Sunday</Link>
        </p>
      ) : (
        <BookForm date={date} oneMatLeft={left === 1} one={PARK_PRICE.one} two={PARK_PRICE.two} />
      )}
    </section>
  );
}
