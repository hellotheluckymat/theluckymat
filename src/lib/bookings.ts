import "server-only";
import { ready, sql } from "./db";
import { PARK_CAPACITY } from "./park";

// A pending booking holds its mats while Stripe Checkout is open (sessions expire after 30 min).
const HOLD_MINUTES = 35;

export async function spotsTaken(classDate: string): Promise<number> {
  await ready();
  const rows = (await sql()`
    SELECT COALESCE(SUM(spots), 0)::int AS taken
    FROM park_bookings
    WHERE class_date = ${classDate}
      AND (status = 'paid'
        OR (status = 'pending' AND created_at > now() - make_interval(mins => ${HOLD_MINUTES})))
  `) as { taken: number }[];
  return rows[0]?.taken ?? 0;
}

export async function spotsLeft(classDate: string) {
  return Math.max(0, PARK_CAPACITY - (await spotsTaken(classDate)));
}

export async function spotsLeftMany(dates: string[]) {
  const out: Record<string, number> = {};
  await Promise.all(dates.map(async (d) => (out[d] = await spotsLeft(d))));
  return out;
}

type NewBooking = {
  classDate: string;
  spots: 1 | 2;
  amountCents: number;
  name: string;
  email: string;
  phone: string;
  mateName: string | null;
  mateEmail: string | null;
};

// Inserts a pending booking only if the class still has room. Returns the id, or null when full.
// A transaction-level advisory lock on the class date stops two buyers grabbing the last mat at once.
export async function holdBooking(b: NewBooking): Promise<string | null> {
  await ready();
  const q = sql();
  const lockKey = Number(b.classDate.replace(/-/g, ""));
  const [, rows] = (await q.transaction([
    q`SELECT pg_advisory_xact_lock(${lockKey})`,
    q`
      INSERT INTO park_bookings (class_date, spots, amount_cents, name, email, phone, mate_name, mate_email, health_ok)
      SELECT ${b.classDate}, ${b.spots}, ${b.amountCents}, ${b.name}, ${b.email}, ${b.phone}, ${b.mateName}, ${b.mateEmail}, true
      WHERE (
        SELECT COALESCE(SUM(spots), 0) FROM park_bookings
        WHERE class_date = ${b.classDate}
          AND (status = 'paid'
            OR (status = 'pending' AND created_at > now() - make_interval(mins => ${HOLD_MINUTES})))
      ) + ${b.spots} <= ${PARK_CAPACITY}
      RETURNING id`,
  ])) as [unknown, { id: string }[]];
  return rows[0]?.id ?? null;
}

export async function attachSession(id: string, sessionId: string) {
  await ready();
  await sql()`UPDATE park_bookings SET stripe_session_id = ${sessionId} WHERE id = ${id}`;
}

export async function markPaid(id: string, sessionId: string) {
  await ready();
  await sql()`
    UPDATE park_bookings SET status = 'paid', paid_at = now(), stripe_session_id = ${sessionId}
    WHERE id = ${id} AND status IN ('pending', 'cancelled')`;
}

export async function markCancelled(id: string) {
  await ready();
  await sql()`UPDATE park_bookings SET status = 'cancelled' WHERE id = ${id} AND status = 'pending'`;
}

export async function getBooking(id: string) {
  await ready();
  const rows = (await sql()`
    SELECT id, class_date::text AS class_date, spots, amount_cents, status, name, mate_name
    FROM park_bookings WHERE id = ${id}`) as {
    id: string;
    class_date: string;
    spots: number;
    amount_cents: number;
    status: string;
    name: string;
    mate_name: string | null;
  }[];
  return rows[0] ?? null;
}

export type RosterRow = {
  id: string;
  class_date: string;
  spots: number;
  amount_cents: number;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  mate_name: string | null;
  mate_email: string | null;
  paid_at: string | null;
};

// Paid (and credited) bookings from today on, oldest class first.
export async function roster(): Promise<RosterRow[]> {
  await ready();
  return (await sql()`
    SELECT id, class_date::text AS class_date, spots, amount_cents, status, name, email, phone,
           mate_name, mate_email, to_char(paid_at AT TIME ZONE 'Australia/Melbourne', 'DD Mon HH24:MI') AS paid_at
    FROM park_bookings
    WHERE status IN ('paid', 'credited')
      AND class_date >= (now() AT TIME ZONE 'Australia/Melbourne')::date
    ORDER BY class_date, paid_at`) as RosterRow[];
}
