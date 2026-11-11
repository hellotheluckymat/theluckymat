import Image from "next/image";
import Link from "next/link";
import { offerBySlug } from "@/lib/offers";
import { PARK_PRICE } from "@/lib/park";
import s from "./home.module.css";

const tiles = [
  { href: "/hens", name: "Hens", price: offerBySlug("hens")!.from },
  { href: "/park", name: "Park", price: `$${PARK_PRICE.one} a class` },
  { href: "/private", name: "Private", price: offerBySlug("private")!.from },
  { href: "/corporate", name: "Corporate", price: offerBySlug("corporate")!.from },
  { href: "/brands", name: "Brands", price: offerBySlug("brands")!.from },
];

export default function Home() {
  return (
    <>
      <section className={s.hero}>
        <div className={`wrap ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className="label">Mobile mat Pilates · Melbourne</p>
            <h1 className="display" style={{ marginTop: 16 }}>Learn with Maddi</h1>
            <p className={`italic ${s.tag}`}>lucky to move</p>
            <p className={s.body}>
              Mat Pilates that turns up where your people are. Hens, workplaces, parks and launches. We bring the mats.
              You bring the crew.
            </p>
            <div className={s.actions}>
              <Link className="btn" href="/park">Book a class</Link>
              <Link className="btn ghost" href="/hens">Plan an event</Link>
            </div>
          </div>
          <Image className={s.cherub} src="/brand/cherub-transparent.png" alt="" width={700} height={483} priority />
        </div>
      </section>

      <section className={s.strip}>
        <div className="wrap">
          <p className="label">Pilates in the Park · Sundays 8am from 6 Dec · ${PARK_PRICE.one}</p>
          <Link className="btn" href="/park">Book</Link>
        </div>
      </section>

      <section className={`wrap ${s.pick}`}>
        <h2 className="display">Pick your mat</h2>
        <div className={s.tiles}>
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className={s.tile}>
              <span className={`sport ${s.name}`}>{t.name}</span>
              <p className={`mono ${s.price}`}>{t.price}</p>
            </Link>
          ))}
        </div>
        <div className={s.rules}>
          <div>
            <p className="label">Class at 8</p>
            <p>Coffee at 9. Every Sunday in the park from 6 Dec.</p>
          </div>
          <div>
            <p className="label">We bring the mats</p>
            <p>You bring the gossip. Mats, music and Maddi, wherever you are.</p>
          </div>
          <div>
            <p className="label">Members only</p>
            <p>Everyone&apos;s a member. Book once and you&apos;re in the club.</p>
          </div>
        </div>
      </section>
    </>
  );
}
