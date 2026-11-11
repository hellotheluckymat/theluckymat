"use client";

import { useActionState, useState } from "react";
import { startParkCheckout, type BookState } from "../../actions";
import s from "./book.module.css";

export default function BookForm({
  date,
  oneMatLeft,
  one,
  two,
}: {
  date: string;
  oneMatLeft: boolean;
  one: number;
  two: number;
}) {
  const [spots, setSpots] = useState<1 | 2>(1);
  const [state, action, pending] = useActionState<BookState, FormData>(startParkCheckout, {});

  return (
    <form action={action} className={s.form}>
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="spots" value={spots} />

      <fieldset className={s.options}>
        <legend className="label">Who&apos;s coming</legend>
        <button type="button" className={spots === 1 ? s.on : s.opt} onClick={() => setSpots(1)} aria-pressed={spots === 1}>
          <span>Just me</span>
          <span className="mono">${one}</span>
        </button>
        <button
          type="button"
          className={spots === 2 ? s.on : s.opt}
          onClick={() => setSpots(2)}
          aria-pressed={spots === 2}
          disabled={oneMatLeft}
        >
          <span>Me and a mate</span>
          <span className="mono">{oneMatLeft ? "1 mat left" : `$${two}`}</span>
        </button>
      </fieldset>

      <p className="label">You</p>
      <label className={s.field}>
        Name
        <input name="name" required autoComplete="name" maxLength={120} />
      </label>
      <label className={s.field}>
        Email
        <input name="email" type="email" required autoComplete="email" maxLength={120} />
      </label>
      <label className={s.field}>
        Mobile
        <input name="phone" type="tel" required autoComplete="tel" maxLength={30} />
      </label>

      {spots === 2 && (
        <>
          <p className="label">Your mate</p>
          <label className={s.field}>
            Their name
            <input name="mate_name" required maxLength={120} />
          </label>
          <label className={s.field}>
            Their email (so they get a reminder too)
            <input name="mate_email" type="email" maxLength={120} />
          </label>
        </>
      )}

      <label className={s.check}>
        <input type="checkbox" name="health" value="yes" required />
        <span>
          I&apos;m well enough to exercise today, and I&apos;ll tell Maddi about any injury, pregnancy or condition before
          class.
        </span>
      </label>

      {state.error && (
        <p className={s.error} role="alert">
          {state.error}
        </p>
      )}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "One sec" : `Pay $${spots === 2 ? two : one}`}
      </button>
      <p className={s.small}>Rained out? Your class comes back as credit for next Sunday.</p>
    </form>
  );
}
