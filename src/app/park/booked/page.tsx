import type { Metadata } from "next";
import Link from "next/link";
import { getBooking, markPaid } from "@/lib/bookings";
import { ready, sql } from "@/lib/db";
import { longDate } from "@/lib/park";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "You're booked", robots: { index: false } };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function Booked({ searchParams }: { searchParams: Promise<{ b?: string }> }) {
  const { b } = await searchParams;
  let booking = b && UUID.test(b) ? await getBooking(b) : null;

  // The webhook can land a few seconds after the redirect, so check Stripe directly too.
  if (booking && booking.status === "pending") {
    await ready();
    const rows = (await sql()`SELECT stripe_session_id FROM park_bookings WHERE id = ${booking.id}`) as {
      stripe_session_id: string | null;
    }[];
    const sid = rows[0]?.stripe_session_id;
    if (sid) {
      const session = await stripe().checkout.sessions.retrieve(sid);
      if (session.payment_status === "paid") {
        await markPaid(booking.id, sid);
        booking = await getBooking(booking.id);
      }
    }
  }

  if (!booking || booking.status !== "paid") {
    return (
      <section className="wrap" style={{ paddingTop: 56 }}>
        <h1 className="display" style={{ fontSize: "clamp(40px,7vw,72px)" }}>Nearly there</h1>
        <p style={{ marginTop: 16 }}>
          We haven&apos;t seen your payment land yet. Refresh in a moment, or <Link href="/park">head back to the park</Link>.
        </p>
      </section>
    );
  }

  return (
    <section className="wrap" style={{ paddingTop: 56 }}>
      <p className="label">Pilates in the Park · 8am</p>
      <h1 className="display" style={{ fontSize: "clamp(48px,8vw,96px)", marginTop: 12 }}>You&apos;re in</h1>
      <p className="italic" style={{ fontSize: 30, color: "var(--red)", margin: "12px 0 0" }}>
        {longDate(booking.class_date)}
      </p>
      <p style={{ marginTop: 20, maxWidth: "34em" }}>
        {booking.spots === 2 && booking.mate_name
          ? `Two mats saved for you and ${booking.mate_name}.`
          : "One mat saved with your name on it."}{" "}
        We&apos;ll send the park details the week before. Bring water and a layer. If it rains, your class comes back as credit.
      </p>
      <p className="mono" style={{ marginTop: 20 }}>Paid ${(booking.amount_cents / 100).toFixed(0)}</p>
      <p style={{ marginTop: 32 }}>
        <Link className="btn ghost" href="/park">Back to the park</Link>
      </p>
    </section>
  );
}
