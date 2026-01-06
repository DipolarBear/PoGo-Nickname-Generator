/* =========================
   Glyph Maps
========================= */

// Year: last two digits → CJK circled
export function glyphYear(y) {
  return String.fromCharCode(0x3250 + (y % 100));
}

// Month: black circled
const MONTH = {
  1:"❶",2:"❷",3:"❸",4:"❹",5:"❺",6:"❻",
  7:"❼",8:"❽",9:"❾",10:"❿",11:"⓫",12:"⓬"
};
export function glyphMonth(m) {
  return MONTH[m];
}

// Day: white circled
export function glyphDay(d) {
  if (d <= 20) return String.fromCharCode(0x2460 + d - 1);
  return String.fromCharCode(0x3250 + d);
}

/* =========================
   Helpers
========================= */

function sameYear(a, b) {
  return a && b && a.y === b.y;
}

function friendDateGlyph(fd) {
  return glyphYear(fd.y) + glyphMonth(fd.m) + glyphDay(fd.d);
}

function monthOnlyGlyph(date, includeYear) {
  return (includeYear ? glyphYear(date.y) : "") + glyphMonth(date.m);
}

/* =========================
   Core Generator
========================= */

export function generateNickname(input) {
  const {
    isPokeGenie,
    locality,
    country,
    state,
    friendDate,
    bestFriendDate,
    foreverFriendDate,
    status = ""
  } = input;

  let out = "";

  /* =========================
     PREFIX
  ========================= */

  if (isPokeGenie) {
    out += "PG";
    out += friendDateGlyph(friendDate);
    if (country) out += country;
    if (state) out += state;
  } else {
    out += locality;
    out += friendDateGlyph(friendDate);
  }

  /* =========================
     BEST FRIEND
  ========================= */

  if (bestFriendDate && !foreverFriendDate) {
    const includeYear = !sameYear(friendDate, bestFriendDate);
    out += "-";
    out +=
      (includeYear ? glyphYear(bestFriendDate.y) : "") +
      glyphMonth(bestFriendDate.m) +
      glyphDay(bestFriendDate.d);

    out += status;
    return trimTo12(out, isPokeGenie);
  }

  /* =========================
     FOREVER FRIEND
  ========================= */

  if (foreverFriendDate) {
    const f = friendDate;
    const b = bestFriendDate;
    const ff = foreverFriendDate;

    const sameFB = sameYear(f, b);
    const sameBF = sameYear(b, ff);

    // Local compact form: ONLY 4-letter locality + all years different
    const useCompact =
      !isPokeGenie &&
      locality.length === 4 &&
      f.y !== b.y &&
      b.y !== ff.y;

    if (!useCompact) out += "-";

    // Best Friend (month only)
    out += monthOnlyGlyph(
      b,
      !sameFB
    );

    // Forever Friend (month only)
    out +=
      (useCompact ? "" : "-") +
      monthOnlyGlyph(
        ff,
        !sameBF
      );

    return trimTo12(out, isPokeGenie);
  }

  /* =========================
     REGULAR FRIEND
  ========================= */

  out += status;
  return trimTo12(out, isPokeGenie);
}

/* =========================
   12-Character Enforcement
========================= */

function trimTo12(str, isPokeGenie) {
  if (str.length <= 12) return str;

  // PG Best Friends: drop state first
  if (isPokeGenie) {
    const noState = str.replace(/[A-Z]{2}$/, "");
    if (noState.length <= 12) return noState;
  }

  return str.slice(0, 12);
}
