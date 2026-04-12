import { generateNickname } from "./nicknameEngine.js";
import { COUNTRIES } from "./data/countries.js";
import { STATES } from "./data/states.js";
import { isBadLocality, countryHasStates } from "./validate.js";

const el = id => document.getElementById(id);

/* =========================
   STATE
   ========================= */

let selectedType = "local";
let selectedStatus = "";

/* =========================
   INIT
   ========================= */

// Populate countries
Object.keys(COUNTRIES).forEach(code => {
  const opt = document.createElement("option");
  opt.value = code;
  opt.textContent = `${code} — ${COUNTRIES[code].name}`;
  el("country").appendChild(opt);
});

/* =========================
   BUTTON LOGIC
   ========================= */

// Friend Type
document.querySelectorAll("#friendTypeButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedType = btn.dataset.type;

    document.querySelectorAll("#friendTypeButtons button")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    const isPG = selectedType === "pg";
    el("localityBlock").style.display = isPG ? "none" : "block";
    el("pgBlock").style.display = isPG ? "block" : "none";

    if (isPG) {
      el("country").dispatchEvent(new Event("change"));
    }

    update();
  });
});

// Status
document.querySelectorAll("#statusButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedStatus = btn.dataset.status;

    document.querySelectorAll("#statusButtons button")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    update();
  });
});

/* =========================
   COUNTRY → STATE
   ========================= */

el("country").addEventListener("change", () => {
  const c = el("country").value;

  if (countryHasStates(c)) {
    el("stateLabel").style.display = "block";
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

/* =========================
   INPUT LISTENERS
   ========================= */

document.querySelectorAll("input, select").forEach(x =>
  x.addEventListener("change", update)
);

/* =========================
   PARSERS
   ========================= */

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

/* =========================
   COPY
   ========================= */

function copyNickname(text) {
  if (!text || text === "❌") return;
  navigator.clipboard.writeText(text);
}

el("copyBtn").addEventListener("click", () => {
  copyNickname(el("output").textContent);
});

/* =========================
   MAIN UPDATE
   ========================= */

function update() {
  const locality = el("locality").value;

  if (isBadLocality(locality)) {
    el("output").textContent = "⚠ locality cannot be PG";
    el("count").textContent = "";
    return;
  }

  const input = {
    isPokeGenie: selectedType === "pg",
    locality: locality || null,
    country: el("country").value || null,
    state:
      el("stateLabel").style.display !== "none"
        ? el("state").value
        : null,

    friendDate: parseDate(el("friendDate").value),
    bestDate: parseDate(el("bestDate").value),
    foreverDate: parseMonth(el("foreverDate").value),

    status: selectedStatus
  };

  if (!input.friendDate) {
    el("output").textContent = "";
    el("count").textContent = "";
    return;
  }

  const nick = generateNickname(input);

  el("output").textContent = nick;
  el("count").textContent = ` (${nick.length}/12)`;

  // Auto copy
  copyNickname(nick);
}
