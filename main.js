import { y, m, d } from "./glyphs.js";

const source = document.getElementById("source");
const localBlock = document.getElementById("localBlock");
const pgBlock = document.getElementById("pgBlock");

const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const stateLabel = document.getElementById("stateLabel");

// Toggle Local vs PG
source.addEventListener("change", () => {
  const isPG = source.value === "pg";
  localBlock.style.display = isPG ? "none" : "block";
  pgBlock.style.display = isPG ? "block" : "none";
});

// Load countries
async function loadCountries() {
  const res = await fetch("data/countries.json");
  const countries = await res.json();

  countries.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = `${c.code} — ${c.name}`;
    countrySelect.appendChild(opt);
  });
}

// Load states
async function loadStates(countryCode) {
  stateSelect.innerHTML = "";
  stateLabel.style.display = "none";

  const res = await fetch("data/states.json");
  const states = await res.json();

  if (!states[countryCode]) return;

  states[countryCode].forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.code;
    opt.textContent = `${s.code} — ${s.name}`;
    stateSelect.appendChild(opt);
  });

  stateLabel.style.display = "block";
}

countrySelect.addEventListener("change", e => {
  loadStates(e.target.value);
});

loadCountries();
