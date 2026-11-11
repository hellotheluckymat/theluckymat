import { notFound } from "next/navigation";
import { offerBySlug } from "@/lib/offers";

// Shared page for hens, private, corporate and brands until the full
// event pages and enquiry form ship (slice 2, Fri 20 Nov).
export default function OfferPage({ slug }: { slug: string }) {
  const offer = offerBySlug(slug);
  if (!offer) notFound();
  return (
    <section className="wrap" style={{ paddingTop: 56 }}>
      <p className="label">The Lucky Mat · {offer.name}</p>
      <h1 className="display" style={{ fontSize: "clamp(48px,8vw,96px)", marginTop: 16 }}>
        {offer.name}
      </h1>
      <p style={{ maxWidth: "34em", marginTop: 16 }}>{offer.blurb}</p>
      <div style={{ display: "grid", gap: 12, marginTop: 32, maxWidth: 720 }}>
        {offer.lines.map((l) => (
          <div key={l.name} style={{ border: "2px solid var(--red)", padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
              <span className="sport" style={{ fontSize: 34 }}>{l.name}</span>
              <span className="mono" style={{ color: "var(--red)", fontSize: 20 }}>{l.price}</span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 15 }}>{l.note}</p>
          </div>
        ))}
      </div>
      <p className="italic" style={{ fontSize: 26, color: "var(--red)", marginTop: 32 }}>
        Enquiries open Friday 20 November
      </p>
    </section>
  );
}
