import { COUNTRIES } from "./data/countries.js";
import { STATES } from "./data/states.js";

export function isValidCountry(code) {
  return !!COUNTRIES[code];
}

export function countryHasStates(code) {
  return COUNTRIES[code]?.hasStates || false;
}

export function isValidState(country, state) {
  return STATES[country]?.includes(state) || false;
}

export function isBadLocality(locality) {
  return locality?.toUpperCase() === "PG";
}
