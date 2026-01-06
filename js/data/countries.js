// ISO 3166-1 alpha-2
// Includes TW, HK, MO as "countries" per project rules

export const COUNTRIES = {
  US: { name: "United States", hasStates: true },
  CA: { name: "Canada", hasStates: true },
  MX: { name: "Mexico", hasStates: true },
  AU: { name: "Australia", hasStates: true },

  JP: { name: "Japan", hasStates: false },
  DE: { name: "Germany", hasStates: false },
  FR: { name: "France", hasStates: false },
  BR: { name: "Brazil", hasStates: false },
  AU: { name: "Australia", hasStates: true },

  TW: { name: "Taiwan", hasStates: false },
  HK: { name: "Hong Kong", hasStates: false },
  MO: { name: "Macao", hasStates: false }
};
