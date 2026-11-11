// Pilates in the Park: Sundays 8am from Sun 6 Dec 2026.
// No classes Sun 20 Dec to Sun 3 Jan. Back Sun 10 Jan 2027.
// Rain cancellations come back as credit.

export const PARK_PRICE = { one: 25, two: 35 } as const;
export const PARK_CAPACITY = 20;

export type ParkDate = {
  iso: string;
  label: string;
  note?: string;
  kind: "class" | "event";
};

export const parkDates: ParkDate[] = [
  { iso: "2026-12-06", label: "Sun 6 Dec · 8:00", note: "First class", kind: "class" },
  { iso: "2026-12-13", label: "Sun 13 Dec · 8:00", kind: "class" },
  { iso: "2026-12-31", label: "Thu 31 Dec", note: "Sweat out the year", kind: "event" },
  { iso: "2027-01-10", label: "Sun 10 Jan · 8:00", note: "Back after the break", kind: "class" },
  { iso: "2027-01-17", label: "Sun 17 Jan · 8:00", kind: "class" },
];

export const upcomingParkDates = (now = new Date()) =>
  parkDates.filter((d) => new Date(`${d.iso}T23:59:59+11:00`) >= now);
