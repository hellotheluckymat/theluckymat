import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Lucky Mat · Pilates with Maddi", template: "%s · The Lucky Mat" },
  description:
    "Mobile mat Pilates in Melbourne. Hens, workplaces, parks and launches. We bring the mats. Pilates in the Park, Sundays 8am from 6 Dec.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <header className="site-head">
          <div className="wrap">
            <Link href="/" aria-label="The Lucky Mat home">
              <Image src="/brand/logo-red-transparent.png" alt="The Lucky Mat" width={140} height={58} priority />
            </Link>
            <nav aria-label="Main">
              <Link className="navlink" href="/hens">Hens</Link>
              <Link className="navlink" href="/park">Park</Link>
              <Link className="navlink" href="/corporate">Corporate</Link>
              <Link className="navlink" href="/brands">Brands</Link>
              <Link className="btn" href="/park">Book</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-foot">
          <div className="wrap">
            <div>
              <Image src="/brand/logo-cream-transparent.png" alt="" width={200} height={83} />
              <p className="italic" style={{ fontSize: 24, margin: "12px 0 0" }}>lucky to move</p>
            </div>
            <div>
              <p className="label">The Lucky Mat Club · est. 2026 · Melbourne</p>
              <p style={{ margin: "8px 0 0", fontSize: 15 }}>Move often. Call your mum. Bring a mate.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
