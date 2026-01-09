import { glyphDay, glyphMonth, glyphYear } from "../glyphs.js";

/*
  Expected input shape (from UI):

  {
    isPokeGenie: boolean,

    locality: string,          // Local only
    country: string,           // PG only (ISO A-2)
    state: string | "",        // PG only

    friendDate: { y, m, d },   // always required

    bestDate: { y, m, d } | null,
    foreverDate: { y, m } | null,

    status: "" | "X" | "Y" | "Z" | "XY"
  }
*/

export function generateNickname(input) {
  const {
    isPokeGenie,
    locality = "",
    country = "",
    state = "",
    friendDate,
    bestDate,
    foreverDate,
    status = ""
  } = input;

  // ---------- helpers ----------
  const hasBest =
    bestDate &&
    Number.isInteger(bestDate.y) &&
    Number.isInteger(bestDate.m) &&
    Number.isInteger(bestDate.d);

  const hasForever =
    foreverDate &&
    Number.isInteger(foreverDate.y) &&
    Number.isInteger(foreverDate.m);

  const friendStr = fullDate(friendDate);
  const bestFull = hasBest ? fullDate(bestDate) : "";
  const bestMonth = hasBest ? monthDate(bestDate) : "";
  const foreverMonth = hasForever ? monthDate(foreverDate) : "";

  /* =========================
     LOCAL FRIENDS
     ========================= */

  if (!isPokeGenie) {
    // REGULAR
    if (!hasBest) {
      return truncate(`${locality}${friendStr}${status}`, 12);
    }

    // BEST
    if (!hasForever) {
      let base = `${locality}${friendStr}-${bestFull}`;
      let withStatus = `${base}${status}`;

      // Priority rule: remove dash if needed to fit 2 status letters
      if (withStatus.length > 12 && status.length === 2) {
        withStatus = `${locality}${friendStr}${bestFull}${status}`;
      }

      return truncate(withStatus, 12);
    }

    // FOREVER (no status allowed)
    return truncate(
      `${locality}${friendStr}-${bestMonth}-${foreverMonth}`,
      12
    );
  }

  /* =========================
     POKEGENIE FRIENDS
     ========================= */

  const pgPrefix = "PG";
  const locWithState = state ? `${country}${state}` : country;

  // REGULAR
  if (!hasBest) {
    return truncate(`${pgPrefix}${friendStr}${locWithState}`, 12);
  }

  // BEST
  if (!hasForever) {
    let base = `${pgPrefix}${friendStr}${locWithState}-${bestFull}${status}`;

    // Overflow rule: drop state if needed
    if (base.length > 12 && state) {
      base = `${pgPrefix}${friendStr}${country}-${bestFull}${status}`;
    }

    return truncate(base, 12);
  }

  // FOREVER (no status, drop state always)
  return truncate(
    `${pgPrefix}${friendStr}${country}-${bestMonth}-${foreverMonth}`,
    12
  );
}

/* =========================
   DATE BUILDERS
   ========================= */

function fullDate(d) {
  return (
    glyphYear(d.y) +
    glyphMonth(d.m) +
    glyphDay(d.d)
  );
}

function monthDate(d) {
  return glyphYear(d.y) + glyphMonth(d.m);
}

/* =========================
   UTIL
   ========================= */

function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max);
}
