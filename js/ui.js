console.log("UI loaded");

import { generateNickname } from "./nicknameEngine.js";
import { COUNTRIES } from "./data/countries.js";
import { STATES } from "./data/states.js";
import { isBadLocality, countryHasStates } from "./validate.js";

const el = id => document.getElementById(id);

// Populate country dropdown
Object.keys(COUNTRIES).forEach(code => {
  const opt = document.createElement("option");
  opt.value = code;
  opt.textContent = `${code} — ${COUNTRIES[code].name}`;
  el("country").appendChild(opt);
});

// Toggle blocks
el("friendType").addEventListener("change", () => {
  const isPG = el("friendType").value === "pg";
  el("localityBlock").style.display = isPG ? "none" : "block";
  el("pgBlock").style.display = isPG ? "block" : "none";

  if (isPG) {
    el("country").dispatchEvent(new Event("change"));
  }

  update();
});


// Country → state logic
el("country").addEventListener("change", () => {
  const c = el("country").value;
  if (countryHasStates(c)) {
    el("stateLabel").style.display = "inline";
    el("state").innerHTML = "";
    STATES[c].forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      el("state").appendChild(opt);
    });
  } else {
    el("stateLabel").style.display = "none";
  }
  update();
});

// Main update
document.querySelectorAll("input, select").forEach(x =>
  x.addEventListener("change", update)
);

function parseDate(d) {
  if (!d) return null;
  const [y, m, day] = d.split("-");
  return { y: +y, m: +m, d: +day };
}

function parseMonth(m) {
  if (!m) return null;
  const [y, mo] = m.split("-");
  return { y: +y, m: +mo };
}

function update() {
  const locality = el("locality").value;

  if (isBadLocality(locality)) {
    el("output").textContent = "⚠ locality cannot be PG";
    return;
  }

 const input = {
  isPokeGenie: el("friendType").value === "pg",
  locality: locality || null,
  country: el("country").value || null,
  state: el("stateLabel").style.display === "inline" ? el("state").value : null,

  friendDate: parseDate(el("friendDate").value),
  bestDate: parseDate(el("bestDate").value),
  foreverDate: parseMonth(el("foreverDate").value),

  status: el("status").value.trim().toUpperCase()
};


  if (!input.friendDate) {
    el("output").textContent = "";
    el("count").textContent = "";
    return;
  }
  //Temporary
console.log("INPUT TO ENGINE:", input);

  const nick = generateNickname(input);
  el("output").textContent = nick;
  el("count").textContent = ` (${nick.length}/12)`;
}
