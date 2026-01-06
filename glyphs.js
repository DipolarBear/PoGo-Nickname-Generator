// === YEAR GLYPHS (00–99) ===
// Circled numbers: ①–⑳, ㉑–㉟
const YEAR_GLYPHS = {
  24: "㉔", 25: "㉕", 26: "㉖", 27: "㉗", 28: "㉘",
  29: "㉙", 30: "㉚", 31: "㉛", 32: "㉜", 33: "㉝",
  34: "㉞", 35: "㉟"
};

// Extend as needed safely up to 99
for (let i = 1; i <= 20; i++) {
  YEAR_GLYPHS[i] = String.fromCharCode(0x2460 + i - 1);
}

// === MONTH GLYPHS (1–12) ===
// Black circled numbers
const MONTH_GLYPHS = {
  1: "❶", 2: "❷", 3: "❸", 4: "❹",
  5: "❺", 6: "❻", 7: "❼", 8: "❽",
  9: "❾", 10: "❿", 11: "⓫", 12: "⓬"
};

// === DAY GLYPHS (1–31) ===
// White circled numbers
const DAY_GLYPHS = {};
for (let i = 1; i <= 31; i++) {
  DAY_GLYPHS[i] = i <= 20
    ? String.fromCharCode(0x2460 + i - 1)
    : String.fromCharCode(0x3251 + i - 21);
}
