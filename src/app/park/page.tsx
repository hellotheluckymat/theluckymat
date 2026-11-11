import type { Metadata } from "next";
import { PARK_CAPACITY, PARK_PRICE, upcomingParkDates } from "@/lib/park";
import s from "./park.module.css";

export const metadata: Metadata = {
  title: "Pilates in the Park",
  description: `Sunday mat Pilates in the park, 8am from 6 Dec. $${PARK_PRICE.one} a class or $${PARK_PRICE.two} for two.`,
};

// Rebuild hourly so past dates drop off the list.
export const revalidate = 3600;

export default function Park() {
  const dates = upcomingParkDates();
  return (
    <>
      <section className={s.poster}>
        <div className="wrap">
          <p className="label">Sundays · 8am · from 6 Dec</p>
          <h1>pilates in the park</h1>
          <p className={`italic ${s.sub}`}>bring a mat and a mate</p>
          <div className={s.sticker} aria-label={`$${PARK_PRICE.one} or 2 for $${PARK_PRICE.two}`}>
            <strong>${PARK_PRICE.one}</strong>
            <span className="label">or 2 for ${PARK_PRICE.two}</span>
          </div>
        </div>
      </section>
      <div className={s.pearStrip} />

      <section className={`wrap ${s.grid}`}>
        <div>
          <p className="label">Coming up</p>
          <ul className={s.dates}>
            {dates.map((d, i) => (
              <li
                key={d.iso}
                className={`${s.date} ${d.kind === "event" ? s.event : ""} ${i === 0 && d.kind === "class" ? s.first : ""}`}
              >
                <span>
                  <span className="mono">{d.label}</span>
                  {d.note && <span className={`italic ${s.note}`}>{d.note}</span>}
                </span>
                <span className="mono" style={{ color: "var(--red)" }}>
                  {d.kind === "event" ? "Tickets soon" : `$${PARK_PRICE.one}`}
                </span>
              </li>
            ))}
          </ul>
          <p className={s.break}>No classes from 20 Dec to 3 Jan. We&apos;re back Sunday 10 Jan.</p>
          <p style={{ marginTop: 28 }}>
            <a className="btn" aria-disabled="true" href="#">Booking opens Sun 15 Nov</a>
          </p>
        </div>

        <aside className={s.side}>
          <p className="label">Every class</p>
          <h2 className="display">Class at 8. Coffee at 9</h2>
          <div className={s.priceRow}>
            <span>${PARK_PRICE.one} one person</span>
            <span>${PARK_PRICE.two} for 2</span>
          </div>
          <ul>
            <li>45 minutes of mat Pilates with Maddi</li>
            <li>{PARK_CAPACITY} mats a class, so book ahead</li>
            <li>Bring your own mat or borrow one of ours</li>
            <li>Rained out? Your class comes back as credit for next Sunday</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
