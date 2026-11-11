"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { attachSession, holdBooking, markCancelled } from "@/lib/bookings";
import { bookableClass, longDate, priceCents } from "@/lib/park";
import { stripe } from "@/lib/stripe";

export type BookState = { error?: string };

const clean = (v: FormDataEntryValue | null, max = 120) => String(v ?? "").trim().slice(0, max);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function startParkCheckout(_prev: BookState, form: FormData): Promise<BookState> {
  const date = clean(form.get("date"), 10);
  const cls = bookableClass(date);
  if (!cls) return { error: "That class has already run or isn't on the list." };

  const spots = form.get("spots") === "2" ? 2 : 1;
  const name = clean(form.get("name"));
  const email = clean(form.get("email")).toLowerCase();
  const phone = clean(form.get("phone"), 30);
  const mateName = spots === 2 ? clean(form.get("mate_name")) : "";
  const mateEmail = spots === 2 ? clean(form.get("mate_email")).toLowerCase() : "";

  if (!name || !isEmail(email) || !phone) return { error: "We need your name, email and mobile." };
  if (spots === 2 && !mateName) return { error: "Add your mate's name so we can save them a mat." };
  if (mateEmail && !isEmail(mateEmail)) return { error: "Your mate's email doesn't look right." };
  if (form.get("health") !== "yes") return { error: "Tick the health check to book." };

  const amountCents = priceCents(spots);
  const id = await holdBooking({
    classDate: date,
    spots,
    amountCents,
    name,
    email,
    phone,
    mateName: mateName || null,
    mateEmail: mateEmail || null,
  });
  if (!id) return { error: spots === 2 ? "Only one mat left for that class." : "That class is full." };

  const base = await origin();
  let url: string | null = null;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      currency: "aud",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aud",
            unit_amount: amountCents,
            product_data: {
              name: spots === 2 ? "Pilates in the Park · me and a mate" : "Pilates in the Park",
              description: `${longDate(date)} · 8am · 45 min`,
            },
          },
        },
      ],
      customer_email: email,
      client_reference_id: id,
      metadata: { booking_id: id, class_date: date, spots: String(spots) },
      payment_intent_data: { metadata: { booking_id: id, class_date: date } },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${base}/park/booked?b=${id}`,
      cancel_url: `${base}/park/cancelled?b=${id}&d=${date}`,
    });
    await attachSession(id, session.id);
    url = session.url;
  } catch (e) {
    console.error("checkout create failed", e);
    await markCancelled(id);
    return { error: "Payments are having a moment. Try again in a minute." };
  }
  if (!url) return { error: "Payments are having a moment. Try again in a minute." };
  redirect(url);
}
