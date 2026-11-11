import type { Metadata } from "next";
import Link from "next/link";
import { spotsLeftMany } from "@/lib/bookings";
import { PARK_CAPACITY, PARK_PRICE, upcomingParkDates } from "@/lib/park";
import s from "./park.module.css";

export const metadata: Metadata = {
  title: "Pilates in the Park",
  description: `Sunday mat Pilates in the park, 8am from 6 Dec. $${PARK_PRICE.one} a class or $${PARK_PRICE.two} for two.`,
};

// Fresh every minute so spots left stay close to live.
export const revalidate = 60;

const bookingsOn = () => Boolean(process.env.DATABASE_URL && process.env.STRIPE_SECRET_KEY);

export default async function Park() {
  const dates = upcomingParkDates();
  const open = bookingsOn();
  let left: Record<string, number> = {};
  if (open) {
    try {
      left = await spotsLeftMany(dates.filter((d) => d.kind === "class").map((d) => d.iso));
    } catch (e) {
      console.error("spots lookup failed", e);
    }
  }
  const firstClass = dates.find((d) => d.kind === "class");

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
            {dates.map((d, i) => {
              const isClass = d.kind === "class";
              const n = left[d.iso];
              const full = isClass && n === 0;
              const cls = `${s.date} ${!isClass ? s.event : ""} ${i === 0 && isClass ? s.first : ""}`;
              const body = (
                <>
                  <span>
                    <span className="mono">{d.label}</span>
                    {d.note && <span className={`italic ${s.note}`}>{d.note}</span>}
                  </span>
                  <span className={`mono ${s.right}`}>
                    {!isClass
                      ? "Tickets soon"
                      : full
                        ? "Full"
                        : n !== undefined && n <= 8
                          ? `${n} left · $${PARK_PRICE.one}`
                          : `$${PARK_PRICE.one}`}
                  </span>
                </>
              );
              return (
                <li key={d.iso}>
                  {open && isClass && !full ? (
                    <Link href={`/park/book/${d.iso}`} className={`${cls} ${s.link}`}>
                      {body}
                    </Link>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className={s.break}>No classes from 20 Dec to 3 Jan. We&apos;re back Sunday 10 Jan.</p>
          <p style={{ marginTop: 28 }}>
            {open && firstClass ? (
              <Link className="btn" href={`/park/book/${firstClass.iso}`}>
                Book {firstClass.label.split(" · ")[0]}
              </Link>
            ) : (
              <a className="btn" aria-disabled="true" href="#">Booking opens Sun 15 Nov</a>
            )}
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
