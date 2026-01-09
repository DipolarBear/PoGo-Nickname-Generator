// glyphs.js
// Single source of truth for all numeric glyphs used in nicknames

/* =========================
   WHITE CIRCLED NUMBERS
   Used for DAYS and YEARS
   ========================= */

export const WHITE_CIRCLED = {
   1:"①",  2:"②",  3:"③",  4:"④",  5:"⑤",
   6:"⑥",  7:"⑦",  8:"⑧",  9:"⑨", 10:"⑩",
  11:"⑪", 12:"⑫", 13:"⑬", 14:"⑭", 15:"⑮",
  16:"⑯", 17:"⑰", 18:"⑱", 19:"⑲", 20:"⑳",
  21:"㉑", 22:"㉒", 23:"㉓", 24:"㉔", 25:"㉕",
  26:"㉖", 27:"㉗", 28:"㉘", 29:"㉙", 30:"㉚",
  31:"㉛"
};

/* =========================
   BLACK (FILLED) CIRCLED NUMBERS
   Used for MONTHS ONLY
   =========================
   1–10  : U+2776 – U+277F
   11–12 : U+24EB – U+24EC
*/

export const BLACK_CIRCLED_MONTHS = {
   1:"❶",  2:"❷",  3:"❸",  4:"❹",  5:"❺",
   6:"❻",  7:"❼",  8:"❽",  9:"❾", 10:"❿",
  11:"⓫", 12:"⓬"
};

/* =========================
   PUBLIC API
   ========================= */

// Day: 1–31
export function glyphDay(day) {
  return WHITE_CIRCLED[day] ?? "";
}

// Month: 1–12 (black circled)
export function glyphMonth(month) {
  return BLACK_CIRCLED_MONTHS[month] ?? "";
}

// Year rule:
// 2001 → ①
// 2011 → ⑪
// 2021 → ㉑
// 2031 → ㉛
export function glyphYear(year) {
  const lastTwo = year % 100;
  return WHITE_CIRCLED[lastTwo] ?? "";
}
