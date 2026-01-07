// glyphs.js
// Single source of truth for ALL numeric glyphs

// White circled numbers (1–31)
// Used for DAYS and YEARS
export const NUMBER_GLYPHS = {
   1:"①",  2:"②",  3:"③",  4:"④",  5:"⑤",
   6:"⑥",  7:"⑦",  8:"⑧",  9:"⑨", 10:"⑩",
  11:"⑪", 12:"⑫", 13:"⑬", 14:"⑭", 15:"⑮",
  16:"⑯", 17:"⑰", 18:"⑱", 19:"⑲", 20:"⑳",
  21:"㉑", 22:"㉒", 23:"㉓", 24:"㉔", 25:"㉕",
  26:"㉖", 27:"㉗", 28:"㉘", 29:"㉙", 30:"㉚",
  31:"㉛"
};

// Day glyph (1–31)
export function glyphDay(day) {
  return NUMBER_GLYPHS[day] ?? "";
}

// Month glyph — BLACK circles only
export function glyphMonth(month) {
  return `●${month}`;
}

// Year glyph rule:
// 2001 → ①
// 2011 → ⑪
// 2021 → ㉑
// 2031 → ㉛
export function glyphYear(year) {
  const lastTwo = year % 100;
  return NUMBER_GLYPHS[lastTwo] ?? "";
}
