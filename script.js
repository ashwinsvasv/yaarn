/* ==========================================================
   EDIT THESE TWO LINES (also find-and-replace Yaarn in index.html)
   ========================================================== */
const Yaarn = "Yaarn";
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // country code, no + or spaces

/* ---------- Trait data ---------- */
const TRAITS = [
  { id: "foodie",      stat: "SNACK RADAR",      value: "ALWAYS ON", cls: "BIRYANI HUNTER", tee: "#E8452C" },
  { id: "gym rat",     stat: "PROTEIN INTAKE",   value: "ABSURD",    cls: "IRON MONK",      tee: "#1B1B1B" },
  { id: "chai addict", stat: "CHAI TOLERANCE",   value: "MAX",       cls: "CHAI SORCERER",  tee: "#F2B705" },
  { id: "night owl",   stat: "3AM ENERGY",       value: "UNREAL",    cls: "MOON ROGUE",     tee: "#2D4BD8" },
  { id: "meme lord",   stat: "MEME RESERVE",     value: "INFINITE",  cls: "MEME OVERLORD",  tee: "#3FA77A" },
  { id: "traveller",   stat: "WANDERLUST",       value: "MAX",       cls: "MAP RANGER",     tee: "#3FA77A" },
  { id: "bookworm",    stat: "PAGES PER CHAI",   value: "HIGH",      cls: "LORE KEEPER",    tee: "#2D4BD8" },
  { id: "gamer",       stat: "CLUTCH FACTOR",    value: "MAX",       cls: "RESPAWN KING",   tee: "#1B1B1B" },
  { id: "drama queen", stat: "PLOT TWISTS",      value: "DAILY",     cls: "STAGE BARD",     tee: "#E8452C" },
  { id: "planner",     stat: "SPREADSHEET POWER",value: "LEGENDARY", cls: "GRAND STRATEGIST", tee: "#F2B705" },
  { id: "chaos agent", stat: "CHAOS OUTPUT",     value: "UNSTABLE",  cls: "WILDCARD",       tee: "#E8452C" },
  { id: "music nerd",  stat: "AUX CONTROL",      value: "TOTAL",     cls: "AUX PALADIN",    tee: "#2D4BD8" },
];
const MAX_TRAITS = 3;

const $ = (s) => document.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Small deterministic hash so the same name always gets the same level/stats */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* ---------- Character builder ---------- */
const state = { name: "", traits: [] };
const chipsEl = $("#chips");
const card = $("#charCard");

TRAITS.forEach((t) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = t.id;
  b.dataset.trait = t.id;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => toggleTrait(t.id, b));
  chipsEl.appendChild(b);
});

function toggleTrait(id, btn) {
  const i = state.traits.indexOf(id);
  const hint = $("#chipHint");
  if (i > -1) {
    state.traits.splice(i, 1);
    hint.textContent = "";
  } else if (state.traits.length >= MAX_TRAITS) {
    hint.textContent = "3 max. Tap a picked one to swap it out.";
    return;
  } else {
    state.traits.push(id);
    hint.textContent = "";
  }
  btn.setAttribute("aria-pressed", String(i === -1));
  render(true);
}

/* 12×12 pixel portrait. H hair, S skin, E eyes, M mouth, T tee */
const SPRITE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHSSSSHH..",
  "..HSESSESH..",
  "...SSSSSS...",
  "...SSMMSS...",
  "....SSSS....",
  "..TTTTTTTT..",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  ".S.TTTTTT.S.",
  "...TTTTTT...",
];
const HAIR = ["#1B1B1B", "#5A3418", "#1B1B1B", "#8A4B22"];
const SKIN = ["#F1C9A5", "#E0A97E", "#C68A5E", "#8D5A3B"];

function drawAvatar(seed, tee) {
  const colors = { H: HAIR[seed % 4], S: SKIN[(seed >>> 3) % 4], E: "#1B1B1B", M: "#1B1B1B", T: tee };
  let rects = "";
  SPRITE.forEach((row, y) => {
    [...row].forEach((c, x) => {
      if (c !== ".") rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${colors[c]}"/>`;
    });
  });
  $("#ccAvatar").innerHTML = rects;
}

function render(bounce) {
  const name = state.name.trim();
  const seed = hash(name.toLowerCase() || "friend");
  const level = name ? 70 + (seed % 30) : "??";
  const picked = state.traits.map((id) => TRAITS.find((t) => t.id === id));

  $("#ccName").textContent = name ? name.toUpperCase() : "YOUR FRIEND";
  $("#ccName").style.fontSize = name.length > 10 ? "1.5rem" : "";
  $("#ccLevel").textContent = level;
  $("#ccClass").textContent = picked.length ? `CLASS: ${picked[0].cls}` : "CLASS: ???";
  $("#ccNo").textContent = String(seed % 1000).padStart(3, "0");
  $("#chipCount").textContent = `${picked.length}/${MAX_TRAITS}`;

  const rows = [];
  for (let i = 0; i < MAX_TRAITS; i++) {
    const t = picked[i];
    if (t) {
      const w = t.value === "MAX" ? 100 : 72 + (hash(name + t.id) % 26);
      rows.push(`<li class="stat-row"><div class="stat-top"><span>${t.stat}</span><span>${t.value}</span></div><div class="stat-bar"><div class="stat-fill" style="width:${w}%"></div></div></li>`);
    } else {
      rows.push(`<li class="stat-row stat-empty"><div class="stat-top"><span>??? STAT</span><span>PICK A TRAIT</span></div><div class="stat-bar"><div class="stat-fill"></div></div></li>`);
    }
  }
  $("#ccStats").innerHTML = rows.join("");
  const tee = picked[0] ? picked[0].tee : "#E8452C";
  drawAvatar(seed, tee);
  // Keep a mustard tee visible against the mustard portrait background
  document.querySelector(".cc-portrait").style.background = tee === "#F2B705" ? "#2D4BD8" : "";

  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("is-locked", picked.length >= MAX_TRAITS && c.getAttribute("aria-pressed") !== "true");
  });

  $("#ccSummary").textContent = name || picked.length
    ? `Card: ${name || "your friend"}, level ${level}. ${picked.map((t) => `${t.stat}: ${t.value}`).join(". ")}`
    : "";

  if (bounce && !reduceMotion) {
    card.classList.remove("bounce");
    void card.offsetWidth; // restart animation
    card.classList.add("bounce");
  }
}

let nameTimer;
$("#bName").addEventListener("input", (e) => {
  state.name = e.target.value;
  render(false);
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => render(true), 450);
});

render(false);

/* "Make this real" → pre-fill the order form */
$("#makeReal").addEventListener("click", () => {
  const name = state.name.trim();
  if (name) $("#oFriend").value = name;
  const note = $("#traitNote");
  if (state.traits.length) {
    $("#oTraits").value = state.traits.join(", ");
    note.textContent = `Traits locked in: ${state.traits.join(" · ")}`;
    note.hidden = false;
  }
  $("#order").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  setTimeout(() => $(name ? "#oName" : "#oFriend").focus({ preventScroll: true }), reduceMotion ? 0 : 600);
});

/* ---------- Order form → WhatsApp ---------- */
const dateInput = $("#oDate");
const today = new Date();
dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

$("#orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const err = $("#formError");
  let firstBad = null;

  form.querySelectorAll("input:not([type=hidden]), select, textarea").forEach((el) => {
    const ok = el.checkValidity() && (el.tagName !== "INPUT" || el.value.trim() !== "" || !el.required);
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    if (!ok && !firstBad) firstBad = el;
  });

  if (firstBad) {
    const label = form.querySelector(`label[for="${firstBad.id}"]`).textContent;
    err.textContent = firstBad.id === "oPhone"
      ? "That phone number looks off. Use 10+ digits."
      : `Missing: ${label.toLowerCase()}.`;
    firstBad.focus();
    return;
  }
  err.textContent = "";

  const d = new Date(dateInput.value + "T00:00:00");
  const dateNice = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const traits = $("#oTraits").value;

  const lines = [
    `Hi ${Yaarn}! I want to design a gift.`,
    "",
    `*My name:* ${$("#oName").value.trim()}`,
    `*My phone:* ${$("#oPhone").value.trim()}`,
    `*For:* ${$("#oFriend").value.trim()}`,
    `*Occasion:* ${$("#oOccasion").value}`,
    `*Needed by:* ${dateNice}`,
  ];
  if (traits) lines.push(`*Traits:* ${traits}`);
  lines.push("", "*3 things only I know about them:*", $("#oSecrets").value.trim());

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.location.href = url;
});

/* ---------- Missing sample images ----------
   Until sample-1.png / sample-2.png are added: the hero shows the Yaarn icon,
   and empty sample cards are hidden from the strip. */
document.querySelectorAll(".sticker img").forEach((img) => {
  const fig = img.closest("figure");
  const mark = () => {
    if (fig.classList.contains("hero-card")) {
      if (img.dataset.fellBack) return;
      img.dataset.fellBack = "1";
      img.src = "images/logo-icon.jpg";
      img.alt = "Yaarn logo";
      fig.classList.add("is-fallback");
    } else {
      fig.hidden = true;
      // No samples at all yet? Hide the whole strip section.
      if (!document.querySelector(".samples figure:not([hidden])")) document.querySelector(".samples").hidden = true;
    }
  };
  if (img.complete && img.naturalWidth === 0) mark();
  else img.addEventListener("error", mark);
});

/* ---------- Stickers drift in on scroll ---------- */
const drifters = document.querySelectorAll(".drift");
if (reduceMotion || !("IntersectionObserver" in window)) {
  drifters.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  drifters.forEach((el) => io.observe(el));
}
