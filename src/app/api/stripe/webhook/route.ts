import type Stripe from "stripe";
import { markCancelled, markPaid } from "@/lib/bookings";
import { stripe } from "@/lib/stripe";

// Stripe sends checkout events here. Set STRIPE_WEBHOOK_SECRET from the endpoint's signing secret.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return new Response("Webhook not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return new Response("Bad signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const id = session.metadata?.booking_id;
  if (!id) return Response.json({ ignored: true });

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      if (session.payment_status === "paid") await markPaid(id, session.id);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await markCancelled(id);
      break;
  }
  return Response.json({ received: true });
}
