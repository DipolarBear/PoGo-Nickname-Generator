import { glyphDay, glyphMonth, glyphYear } from "../glyphs.js";

/*
  Deterministic nickname engine
  Fully aligned with decision tree
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

  if (!friendDate) return "";

  const hasBest = isValidDate(bestDate);
  const hasForever = isValidMonth(foreverDate);

  const cleanStatus = hasForever ? "" : status; // forbid on forever

  return isPokeGenie
    ? buildPG({
        country,
        state,
        friendDate,
        bestDate,
        foreverDate,
        hasBest,
        hasForever,
        status: cleanStatus
      })
    : buildLocal({
        locality,
        friendDate,
        bestDate,
        foreverDate,
        hasBest,
        hasForever,
        status: cleanStatus
      });
}

/* =========================
   LOCAL
   ========================= */

function buildLocal(ctx) {
  const {
    locality,
    friendDate,
    bestDate,
    foreverDate,
    hasBest,
    hasForever,
    status
  } = ctx;

  const friendStr = fullDate(friendDate, true);

  // REGULAR
  if (!hasBest) {
    return finalize(`${locality}${friendStr}${status}`);
  }

  // BEST
  if (!hasForever) {
    const includeYear = bestDate.y !== friendDate.y;
    const bestStr = fullDate(bestDate, includeYear);

    let base = `${locality}${friendStr}-${bestStr}`;
    let result = `${base}${status}`;

    // 🔧 override: dash removal (STRICT CONDITIONS)
    if (
      result.length > 12 &&
      locality.length === 4 &&
      includeYear &&
      status.length === 2
    ) {
      result = `${locality}${friendStr}${bestStr}${status}`;
    }

    return finalize(result);
  }

  // FOREVER

  const bfYear = bestDate.y !== friendDate.y;
  const ffYear = foreverDate.y !== bestDate.y;

  const bfPart = monthDate(bestDate, bfYear);
  const ffPart = monthDate(foreverDate, ffYear);

  const allDifferent =
    friendDate.y !== bestDate.y &&
    bestDate.y !== foreverDate.y &&
    friendDate.y !== foreverDate.y;

  // COMPACT
  if (locality.length === 4 && allDifferent) {
    return finalize(
      `${locality}${friendStr}-${bfPart}${ffPart}`
    );
  }

  // DEFAULT
  return finalize(
    `${locality}${friendStr}-${bfPart}-${ffPart}`
  );
}

/* =========================
   POKÉGENIE
   ========================= */

function buildPG(ctx) {
  let {
    country,
    state,
    friendDate,
    bestDate,
    foreverDate,
    hasBest,
    hasForever,
    status
  } = ctx;

  // enforce state rule
  if (!["US", "CA", "MX", "AU"].includes(country)) {
    state = "";
  }

  const friendStr = fullDate(friendDate, true);

  // REGULAR
  if (!hasBest) {
    let result = `PG${friendStr}${country}${state}${status}`;

    if (result.length > 12 && state) {
      result = `PG${friendStr}${country}${status}`;
    }

    return finalize(result);
  }

  // BEST
  if (!hasForever) {
    const includeYear = bestDate.y !== friendDate.y;
    const bestStr = fullDate(bestDate, includeYear);

    let result = `PG${friendStr}${country}${state}${bestStr}${status}`;

    // 🔧 override: remove state ONLY
    if (result.length > 12 && state) {
      result = `PG${friendStr}${country}${bestStr}${status}`;
    }

    return finalize(result);
  }

  // FOREVER

  const bfYear = bestDate.y !== friendDate.y;
  const ffYear = foreverDate.y !== bestDate.y;

  const bfPart = monthDate(bestDate, bfYear);
  const ffPart = monthDate(foreverDate, ffYear);

  return finalize(
    `PG${friendStr}${country}${bfPart}-${ffPart}`
  );
}

/* =========================
   DATE HELPERS
   ========================= */

function fullDate(d, includeYear) {
  return (
    (includeYear ? glyphYear(d.y) : "") +
    glyphMonth(d.m) +
    glyphDay(d.d)
  );
}

function monthDate(d, includeYear) {
  return (
    (includeYear ? glyphYear(d.y) : "") +
    glyphMonth(d.m)
  );
}

/* =========================
   VALIDATION
   ========================= */

function finalize(str) {
  return str.length <= 12 ? str : "❌";
}

function isValidDate(d) {
  return d && d.y && d.m && d.d;
}

function isValidMonth(d) {
  return d && d.y && d.m;
}
