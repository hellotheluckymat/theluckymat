import type { Metadata } from "next";
import { roster, type RosterRow } from "@/lib/bookings";
import { longDate, PARK_CAPACITY } from "@/lib/park";
import s from "./admin.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bookings", robots: { index: false, follow: false } };

export default async function Admin() {
  const rows = await roster();
  const byDate = new Map<string, RosterRow[]>();
  for (const r of rows) byDate.set(r.class_date, [...(byDate.get(r.class_date) ?? []), r]);
  const totalCents = rows.reduce((n, r) => n + r.amount_cents, 0);

  return (
    <section className="wrap" style={{ paddingTop: 40 }}>
      <p className="label">Admin · Pilates in the Park</p>
      <h1 className="display" style={{ fontSize: "clamp(40px,6vw,64px)", marginTop: 12 }}>Who&apos;s coming</h1>
      <p className="mono" style={{ marginTop: 12 }}>
        {rows.length} bookings · ${(totalCents / 100).toFixed(0)} taken
      </p>

      {byDate.size === 0 && <p style={{ marginTop: 32 }}>No bookings yet.</p>}

      {[...byDate.entries()].map(([date, list]) => {
        const mats = list.reduce((n, r) => n + r.spots, 0);
        return (
          <div key={date} className={s.day}>
            <div className={s.dayHead}>
              <h2 className="display">{longDate(date)}</h2>
              <span className="mono">
                {mats} / {PARK_CAPACITY} mats
              </span>
            </div>
            <div className={s.scroll}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mate</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Paid</th>
                    <th>Booked</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.mate_name ?? ""}</td>
                      <td className="mono">{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : ""}</td>
                      <td>
                        <a href={`mailto:${r.email}`}>{r.email}</a>
                      </td>
                      <td className="mono">
                        ${(r.amount_cents / 100).toFixed(0)}
                        {r.status === "credited" ? " credit" : ""}
                      </td>
                      <td className="mono">{r.paid_at ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
