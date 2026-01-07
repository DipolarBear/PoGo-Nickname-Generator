import { glyphDay, glyphMonth, glyphYear } from "./glyphs.js";

/*
 Core nickname generator
 All rules enforced here
*/

export function generateNickname(input) {
  const {
    isPokeGenie,
    locality,          // string (local) OR ignored if PG
    country,           // ISO A-2
    state,             // optional (PG only)
    friendDate,        // { y, m, d }
    bestDate,          // { y, m, d } | null
    foreverDate,       // { y, m } | null
    status              // "" | "X" | "Y" | "Z" | "XY" etc
  } = input;

  // ---------- helpers ----------
  const fd = buildFullDate(friendDate);
  const bd = bestDate ? buildFullDate(bestDate) : "";
  const bm = bestDate ? buildMonthDate(bestDate) : "";
  const fm = foreverDate ? buildMonthDate(foreverDate) : "";

  // ---------- LOCAL FRIENDS ----------
  if (!isPokeGenie) {
    let name = locality;

    // REGULAR
    if (!bestDate) {
      return truncate(`${name}${fd}${status}`, 12);
    }

    // BEST
    if (!foreverDate) {
      let core = `${name}${fd}-${bd}`;

      // If two status letters overflow, remove dash
      if ((core + status).length > 12 && status.length === 2) {
        core = `${name}${fd}${bd}`;
      }

      return truncate(`${core}${status}`, 12);
    }

    // FOREVER (no status allowed)
    return truncate(
      `${name}${fd}-${bm}-${fm}`,
      12
    );
  }

  // ---------- POKEGENIE FRIENDS ----------
  const pg = "PG";
  const loc = state ? `${country}${state}` : country;

  // REGULAR
  if (!bestDate) {
    return truncate(`${pg}${fd}${loc}`, 12);
  }

  // BEST FRIEND
  if (!foreverDate) {
    let core = `${pg}${fd}${loc}-${bd}${status}`;

    // If overflow → drop state
    if (core.length > 12 && state) {
      core = `${pg}${fd}${country}-${bd}${status}`;
    }

    return truncate(core, 12);
  }

  // FOREVER FRIEND (no status)
  // State must be removed
  return truncate(
    `${pg}${fd}${country}-${bm}-${fm}`,
    12
  );
}

// ---------- date builders ----------

function buildFullDate(d) {
  return (
    glyphYear(d.y) +
    glyphMonth(d.m) +
    glyphDay(d.d)
  );
}

function buildMonthDate(d) {
  let out = "";

  // year only if needed (handled upstream)
  out += glyphYear(d.y);
  out += glyphMonth(d.m);

  return out;
}

// ---------- util ----------

function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max);
}
