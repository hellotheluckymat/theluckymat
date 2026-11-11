import "server-only";
import { neon } from "@neondatabase/serverless";

// Neon via the Vercel Storage integration sets DATABASE_URL.
let _sql: ReturnType<typeof neon> | null = null;
let _ready: Promise<void> | null = null;

export function sql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set. Add Neon in Vercel Storage.");
    _sql = neon(url);
  }
  return _sql;
}

// Idempotent schema setup, run once per server instance before the first query.
export function ready() {
  if (!_ready) {
    const q = sql();
    _ready = (async () => {
      await q`
        CREATE TABLE IF NOT EXISTS park_bookings (
          id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          class_date    date NOT NULL,
          spots         smallint NOT NULL CHECK (spots IN (1, 2)),
          amount_cents  integer NOT NULL,
          status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'credited')),
          name          text NOT NULL,
          email         text NOT NULL,
          phone         text,
          mate_name     text,
          mate_email    text,
          health_ok     boolean NOT NULL DEFAULT false,
          stripe_session_id text UNIQUE,
          created_at    timestamptz NOT NULL DEFAULT now(),
          paid_at       timestamptz
        )`;
      await q`CREATE INDEX IF NOT EXISTS park_bookings_class_idx ON park_bookings (class_date, status)`;
    })().catch((e) => {
      _ready = null;
      throw e;
    });
  }
  return _ready;
}
