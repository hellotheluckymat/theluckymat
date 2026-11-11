// Prices locked by Liam on 4 Nov 2026 (pricing/The-Lucky-Mat-Packages-and-Pricing-2026.pdf).
// Not GST registered, so no "+ GST" anywhere.

export type Offer = {
  slug: string;
  name: string;
  from: string;
  blurb: string;
  lines: { name: string; price: string; note: string }[];
};

export const offers: Offer[] = [
  {
    slug: "hens",
    name: "Hens",
    from: "from $450",
    blurb: "Stretch first. Champagne after. We bring the mats to your house, your Airbnb or your favourite park.",
    lines: [
      { name: "Lucky Hen", price: "$450", note: "45 min, up to 10. Extra guests $45 each, up to 20" },
      { name: "Luxury Hen", price: "$850", note: "45 min, up to 10, with cold towels, grip socks and water. Extra guests $85 each, up to 20" },
    ],
  },
  {
    slug: "private",
    name: "Private",
    from: "from $450",
    blurb: "Birthdays, long lunches, a Saturday with the girls. Same mats, same Maddi, your guest list.",
    lines: [
      { name: "Lucky Mat", price: "$450", note: "45 min, up to 10. Extra guests $45 each, up to 20" },
      { name: "Luxury Mat", price: "$850", note: "45 min, up to 10, with cold towels, grip socks and water. Extra guests $85 each, up to 20" },
    ],
  },
  {
    slug: "corporate",
    name: "Corporate",
    from: "$350",
    blurb: "Corporate Sweat. Forty five minutes on the mat, back at your desk with better posture.",
    lines: [
      { name: "Corporate Sweat", price: "$350", note: "45 min, up to 20. $25 a head over 20, and you supply mats over 20" },
      { name: "Block of 4", price: "$1,190", note: "Four sessions prepaid, 15% off" },
    ],
  },
  {
    slug: "brands",
    name: "Brands",
    from: "$950",
    blurb: "Launches, pop-ups and store events. A class your guests will post about.",
    lines: [{ name: "Brand activation", price: "$950", note: "Up to 50 guests" }],
  },
];

export const offerBySlug = (slug: string) => offers.find((o) => o.slug === slug);
