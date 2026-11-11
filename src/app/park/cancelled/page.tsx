import type { Metadata } from "next";
import Link from "next/link";
import { getBooking, markCancelled } from "@/lib/bookings";
import { ready, sql } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "No worries", robots: { index: false } };

const UUID = /^[0-9a-f-]{36}$/i;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

// Back from Stripe without paying: free the held mats straight away.
export default async function Cancelled({ searchParams }: { searchParams: Promise<{ b?: string; d?: string }> }) {
  const { b, d } = await searchParams;
  if (b && UUID.test(b)) {
    const booking = await getBooking(b);
    if (booking?.status === "pending") {
      await ready();
      const rows = (await sql()`SELECT stripe_session_id FROM park_bookings WHERE id = ${b}`) as {
        stripe_session_id: string | null;
      }[];
      const sid = rows[0]?.stripe_session_id;
      try {
        if (sid) await stripe().checkout.sessions.expire(sid);
      } catch {
        // already expired or completed; the webhook has the final say
      }
      await markCancelled(b);
    }
  }
  const back = d && ISO.test(d) ? `/park/book/${d}` : "/park";
  return (
    <section className="wrap" style={{ paddingTop: 56 }}>
      <h1 className="display" style={{ fontSize: "clamp(40px,7vw,72px)" }}>No worries</h1>
      <p style={{ marginTop: 16 }}>Nothing was charged. Book again whenever you&apos;re ready.</p>
      <p style={{ marginTop: 24 }}>
        <Link className="btn" href={back}>Try again</Link>
      </p>
    </section>
  );
}
