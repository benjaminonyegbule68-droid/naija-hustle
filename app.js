/* ============================================================
   LAGOS LIFE — ORIGINAL RECREATION (~80% systems parity)
   Single-player browser life sim inspired by the public
   description of Lagos Life (needs, Nepo/LAPO, jobs, rent,
   places, travel). Not affiliated with the official game.
   ============================================================ */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SAVE_KEY = "lagosLifeRecreate_v1";

const CAREERS = [
  { id: "unemployed", name: "Unemployed", pay: 0, levels: 1 },
  { id: "okada", name: "Okada Rider", pay: 4500, levels: 5 },
  { id: "danfo", name: "Danfo Conductor", pay: 5500, levels: 5 },
  { id: "shop", name: "Shop Attendant", pay: 7000, levels: 5 },
  { id: "bank", name: "Bank Teller", pay: 12000, levels: 5 },
  { id: "dev", name: "Junior Dev", pay: 18000, levels: 5 },
  { id: "content", name: "Content Creator", pay: 10000, levels: 5 },
  { id: "oil", name: "Oil Field Hand", pay: 25000, levels: 5 }
];

const GIGS = [
  { name: "Dispatch run", pay: 2500, energy: 12, time: 30 },
  { name: "Help at market", pay: 1800, energy: 10, time: 25 },
  { name: "Phone repair", pay: 3500, energy: 8, time: 40 },
  { name: "Event usher", pay: 4000, energy: 15, time: 50 }
];

const HOMES = [
  { id: "face", name: "Face-me-I-face-you", area: "Mushin", rent: 2400, hygieneBonus: 0 },
  { id: "self", name: "Self-contain", area: "Yaba", rent: 6000, hygieneBonus: 5 },
  { id: "mini", name: "Mini-flat", area: "Lekki Phase 1", rent: 17000, hygieneBonus: 10 },
  { id: "duplex", name: "Duplex", area: "Ikoyi", rent: 250000, hygieneBonus: 15 },
  { id: "mansion", name: "Mansion", area: "Banana Island", rent: 1500000, hygieneBonus: 20 }
];

const PLACES = [
  { id: "home", name: "Your Room", area: "Home", fare: 0, actions: ["rest", "shower", "eat_home"] },
  { id: "buka", name: "Amala Shitta", area: "Surulere", fare: 400, actions: ["eat_out", "social"] },
  { id: "market", name: "Balogun Market", area: "Lagos Island", fare: 500, actions: ["shop", "gig"] },
  { id: "beach", name: "Elegushi Beach", area: "Lekki", fare: 800, actions: ["fun", "social"] },
  { id: "club", name: "Quilox", area: "Victoria Island", fare: 1200, actions: ["fun", "social", "drink"] },
  { id: "office", name: "Job Centre", area: "Ikeja", fare: 600, actions: ["job", "work"] },
  { id: "church", name: "Church / Mosque", area: "Yaba", fare: 300, actions: ["social", "rest"] },
  { id: "gym", name: "Local Gym", area: "Surulere", fare: 350, actions: ["energy", "fun"] }
];

const TRAITS = [
  { id: "hustler", name: "Hustler", desc: "+20% work pay" },
  { id: "foodie", name: "Foodie", desc: "Hunger drains slower" },
  { id: "socialite", name: "Owambe Spirit", desc: "Social gains +25%" },
  { id: "clean", name: "Clean Pikin", desc: "Hygiene drains slower" },
  { id: "lazy", name: "Lazy Bone", desc: "Energy drains slower, work −15%" }
];

/* ---------- STATE ---------- */
function defaultState(startType, name) {
  const isNepo = startType === "nepo";
  return {
    name: name || "Player",
    startType,
    level: 1,
    xp: 0,
    money: isNepo ? 150000 : 12000,
    career: "unemployed",
    careerLevel: 1,
    homeId: isNepo ? "self" : "face",
    locationId: "home",
    day: 1,                // game day counter
    weekday: 1,            // 0=Sun … 6=Sat (start Monday)
    hour: 8,
    minute: 0,
    needs: { hunger: 85, energy: 90, hygiene: 80, fun: 70, social: 55, bladder: 85 },
    traits: isNepo ? ["socialite"] : ["hustler"],
    inventory: isNepo ? ["phone", "laptop"] : ["phone"],
    rentPaidThisWeek: true,
    lastRentDay: 0,
    stats: { shifts: 0, gigs: 0, friends: 0 },
    createdAt: Date.now()
  };
}

let state = null;
let tickTimer = null;

/* ---------- HELPERS ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const money = (n) => "₦" + Math.floor(n).toLocaleString("en-NG");
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

function notify(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(notify._t);
  notify._t = setTimeout(() => el.classList.add("hidden"), 2600);
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {}
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}

/* ---------- TIME ---------- */
function advanceMinutes(mins) {
  state.minute += mins;
  while (state.minute >= 60) {
    state.minute -= 60;
    state.hour += 1;
  }
  while (state.hour >= 24) {
    state.hour -= 24;
    state.day += 1;
    state.weekday = (state.weekday + 1) % 7;
    onNewDay();
  }
  drainNeeds(mins);
  checkRent();
  refreshUI();
  save();
}

function onNewDay() {
  // passive drain already handled; small random events
  if (Math.random() < 0.15) {
    notify(choice([
      "NEPA took light for 2 hours. Energy −8.",
      "Go-slow on the express. You lost some time.",
      "Your landlord sent a reminder about Saturday."
    ]));
    state.needs.energy = clamp(state.needs.energy - 8, 0, 100);
  }
}

function checkRent() {
  // Rent due every Saturday morning if not paid this week
  if (state.weekday === 6 && state.hour >= 9 && !state.rentPaidThisWeek) {
    const home = HOMES.find(h => h.id === state.homeId);
    if (state.money >= home.rent) {
      state.money -= home.rent;
      state.rentPaidThisWeek = true;
      notify("Rent paid: " + money(home.rent) + " to Baba Landlord.");
    } else {
      notify("RENT OVERDUE! You need " + money(home.rent) + ". Find money fast.");
      state.needs.social = clamp(state.needs.social - 15, 0, 100);
      state.needs.fun = clamp(state.needs.fun - 10, 0, 100);
    }
  }
  // Reset flag on Sunday
  if (state.weekday === 0) state.rentPaidThisWeek = false;
}

function drainNeeds(mins) {
  const factor = mins / 60; // per hour rates
  const rates = {
    hunger: 6,
    energy: 5,
    hygiene: 4,
    fun: 5,
    social: 4,
    bladder: 7
  };
  // trait modifiers
  if (state.traits.includes("foodie")) rates.hunger *= 0.7;
  if (state.traits.includes("clean")) rates.hygiene *= 0.65;
  if (state.traits.includes("lazy")) rates.energy *= 0.7;

  for (const k of Object.keys(rates)) {
    state.needs[k] = clamp(state.needs[k] - rates[k] * factor, 0, 100);
  }
}

/* ---------- ACTIONS ---------- */
function restoreNeed(key, amount) {
  state.needs[key] = clamp(state.needs[key] + amount, 0, 100);
}

function doEat(home = false) {
  const cost = home ? 800 : 2500;
  if (state.money < cost) { notify("Not enough money to chop."); return; }
  state.money -= cost;
  restoreNeed("hunger", home ? 35 : 55);
  restoreNeed("bladder", -8);
  advanceMinutes(home ? 20 : 35);
  notify(home ? "You cooked and ate." : "You chopped amala. Soft life.");
  state.stats.places += 1;
}

function doRest() {
  restoreNeed("energy", 40);
  restoreNeed("fun", 5);
  advanceMinutes(90);
  notify("You rested. Body thank you.");
}

function doShower() {
  restoreNeed("hygiene", 50);
  restoreNeed("bladder", 30);
  advanceMinutes(20);
  notify("Fresh like morning dew.");
}

function doFun(place) {
  const cost = place === "club" ? 5000 : 1500;
  if (state.money < cost) { notify("You need more cash for this vibe."); return; }
  state.money -= cost;
  restoreNeed("fun", 40);
  restoreNeed("social", 15);
  restoreNeed("energy", -12);
  advanceMinutes(60);
  notify(place === "club" ? "Quilox was lit. Wallet lighter." : "Beach air cleared your head.");
}

function doSocial() {
  restoreNeed("social", state.traits.includes("socialite") ? 35 : 25);
  restoreNeed("fun", 10);
  advanceMinutes(30);
  notify("You gist with people. Network strong.");
}

function doWork() {
  const career = CAREERS.find(c => c.id === state.career);
  if (!career || career.pay === 0) {
    notify("You have no job. Go to Job Centre.");
    openJobSheet();
    return;
  }
  if (state.needs.energy < 20) { notify("You dey too tired to work."); return; }
  let pay = career.pay * (0.8 + state.careerLevel * 0.1);
  if (state.traits.includes("hustler")) pay *= 1.2;
  if (state.traits.includes("lazy")) pay *= 0.85;
  pay = Math.floor(pay);
  state.money += pay;
  restoreNeed("energy", -25);
  restoreNeed("hunger", -10);
  restoreNeed("fun", -8);
  state.stats.shifts += 1;
  state.xp += 12;
  checkLevel();
  advanceMinutes(180); // 3h shift
  notify("Shift done. You earned " + money(pay) + ".");
}

function doGig() {
  const gig = choice(GIGS);
  if (state.needs.energy < gig.energy) { notify("Energy too low for that gig."); return; }
  state.money += gig.pay;
  restoreNeed("energy", -gig.energy);
  state.stats.gigs += 1;
  state.xp += 8;
  checkLevel();
  advanceMinutes(gig.time);
  notify(gig.name + " — +" + money(gig.pay));
}

function travelTo(placeId) {
  const place = PLACES.find(p => p.id === placeId);
  if (!place) return;
  if (place.id === state.locationId) { notify("You are already here."); return; }
  if (state.money < place.fare) { notify("Not enough for transport."); return; }
  state.money -= place.fare;
  state.locationId = place.id;
  restoreNeed("energy", -4);
  advanceMinutes(15 + Math.floor(place.fare / 50));
  notify("You arrived at " + place.name + (place.fare ? " · fare " + money(place.fare) : ""));
  state.stats.places += 1;
}

function setCareer(id) {
  const c = CAREERS.find(x => x.id === id);
  if (!c) return;
  state.career = id;
  state.careerLevel = 1;
  notify("New hustle: " + c.name);
  closeSheet();
  refreshUI();
  save();
}

function setHome(id) {
  const h = HOMES.find(x => x.id === id);
  if (!h) return;
  // moving cost = 1 week rent
  if (state.money < h.rent) { notify("You need at least one week rent to move."); return; }
  state.money -= h.rent;
  state.homeId = id;
  state.locationId = "home";
  notify("You moved to " + h.name + ", " + h.area);
  closeSheet();
  refreshUI();
  save();
}

function checkLevel() {
  const need = state.level * 40;
  if (state.xp >= need) {
    state.xp -= need;
    state.level += 1;
    notify("Level up! You are now Lv " + state.level);
  }
}

/* ---------- UI ---------- */
function refreshUI() {
  if (!state) return;
  $("#uiName").textContent = state.name;
  $("#uiLevel").textContent = "Lv " + state.level;
  $("#uiMoney").textContent = Math.floor(state.money).toLocaleString("en-NG");
  const home = HOMES.find(h => h.id === state.homeId);
  const place = PLACES.find(p => p.id === state.locationId);
  $("#uiLocation").textContent = place ? place.name : home.area;
  const dayName = DAYS[state.weekday];
  const hh = String(state.hour).padStart(2, "0");
  const mm = String(state.minute).padStart(2, "0");
  $("#uiClock").textContent = dayName + " " + hh + ":" + mm;

  // needs
  for (const k of Object.keys(state.needs)) {
    const v = Math.round(state.needs[k]);
    const bar = $("#bar" + k.charAt(0).toUpperCase() + k.slice(1));
    const val = $("#val" + k.charAt(0).toUpperCase() + k.slice(1));
    if (bar) {
      bar.style.width = v + "%";
      bar.classList.toggle("low", v < 25);
      bar.classList.toggle("mid", v >= 25 && v < 50);
    }
    if (val) val.textContent = v;
  }

  // mood
  const avg = Object.values(state.needs).reduce((a, b) => a + b, 0) / 6;
  let mood = "Doing Fine";
  if (avg < 30) mood = "Suffering";
  else if (avg < 50) mood = "Stressed";
  else if (avg > 80) mood = "Living Soft";
  $("#uiMood").textContent = mood;

  // objective
  let obj = "Keep needs up and earn. Rent due every Saturday.";
  if (state.career === "unemployed") obj = "Go to Job Centre and pick a hustle.";
  else if (state.weekday === 5) obj = "Tomorrow is Saturday — make sure you can pay rent (" + money(home.rent) + ").";
  else if (state.weekday === 6 && !state.rentPaidThisWeek) obj = "RENT DAY! Pay " + money(home.rent) + " or suffer.";
  $("#objectiveText").textContent = obj;

  renderPlaces();
}

function renderPlaces() {
  const grid = $("#placeGrid");
  grid.innerHTML = "";
  for (const p of PLACES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "place-card" + (p.id === state.locationId ? " here" : "");
    btn.innerHTML = `
      <strong>${p.name}</strong>
      <span>${p.area}</span>
      <span class="fare">${p.fare ? "Fare " + money(p.fare) : "You are here"}</span>
    `;
    btn.addEventListener("click", () => {
      if (p.id === state.locationId) openPlaceActions(p);
      else travelTo(p.id);
    });
    grid.appendChild(btn);
  }
}

function openSheet(title, buildFn) {
  $("#sheetTitle").textContent = title;
  const body = $("#sheetBody");
  body.innerHTML = "";
  buildFn(body);
  $("#overlay").classList.add("open");
  $("#overlay").setAttribute("aria-hidden", "false");
}

function closeSheet() {
  $("#overlay").classList.remove("open");
  $("#overlay").setAttribute("aria-hidden", "true");
}

function addRow(parent, title, meta, btnLabel, onClick) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <div>
      <div class="title">${title}</div>
      <div class="meta">${meta}</div>
    </div>
  `;
  if (btnLabel) {
    const b = document.createElement("button");
    b.className = "btn secondary";
    b.textContent = btnLabel;
    b.addEventListener("click", onClick);
    row.appendChild(b);
  }
  parent.appendChild(row);
}

function openJobSheet() {
  openSheet("Choose Your Hustle", (body) => {
    body.innerHTML = `<p class="muted small">Current: ${CAREERS.find(c => c.id === state.career).name}</p>`;
    for (const c of CAREERS.filter(x => x.id !== "unemployed")) {
      addRow(body, c.name, money(c.pay) + " per shift · 5 levels", "Select", () => setCareer(c.id));
    }
  });
}

function openHomeSheet() {
  openSheet("Housing", (body) => {
    const current = HOMES.find(h => h.id === state.homeId);
    body.innerHTML = `<p class="muted small">Current: ${current.name} · Rent ${money(current.rent)}/week</p>`;
    for (const h of HOMES) {
      addRow(body, h.name, h.area + " · " + money(h.rent) + "/week", h.id === state.homeId ? "Current" : "Move", () => {
        if (h.id !== state.homeId) setHome(h.id);
      });
    }
  });
}

function openPhoneSheet() {
  openSheet("Phone", (body) => {
    const career = CAREERS.find(c => c.id === state.career);
    body.innerHTML = `
      <div class="stat-grid">
        <div class="stat"><strong>${money(state.money)}</strong><span>Cash</span></div>
        <div class="stat"><strong>Lv ${state.level}</strong><span>Level · XP ${state.xp}</span></div>
        <div class="stat"><strong>${career.name}</strong><span>Career</span></div>
        <div class="stat"><strong>${state.stats.shifts}</strong><span>Shifts worked</span></div>
      </div>
    `;
    addRow(body, "Jobs", "Find or change career", "Open", () => openJobSheet());
    addRow(body, "Housing", "Upgrade your base", "Open", () => openHomeSheet());
    addRow(body, "Side Gigs", "Quick money", "Do one", () => { closeSheet(); doGig(); });
    addRow(body, "Traits", state.traits.map(t => TRAITS.find(x => x.id === t)?.name || t).join(", "), null);
  });
}

function openPlaceActions(place) {
  openSheet(place.name, (body) => {
    body.innerHTML = `<p class="muted small">${place.area}</p>`;
    const map = {
      rest: ["Rest", doRest],
      shower: ["Shower", doShower],
      eat_home: ["Cook & Eat", () => doEat(true)],
      eat_out: ["Chop", () => doEat(false)],
      social: ["Gist / Socialise", doSocial],
      fun: ["Have Fun", () => doFun(place.id)],
      drink: ["Buy Drinks", () => doFun("club")],
      shop: ["Browse Market", () => { advanceMinutes(20); notify("You window-shopped. Maybe next time."); }],
      gig: ["Do a Gig", doGig],
      job: ["View Jobs", openJobSheet],
      work: ["Go to Work", doWork],
      energy: ["Work Out", () => { restoreNeed("energy", 15); restoreNeed("fun", 10); advanceMinutes(40); notify("Sweat. Gains."); }]
    };
    for (const a of place.actions) {
      const entry = map[a];
      if (!entry) continue;
      addRow(body, entry[0], "Available here", "Do it", () => { closeSheet(); entry[1](); });
    }
  });
}

function openMenuSheet() {
  openSheet("Menu", (body) => {
    addRow(body, "Save Game", "Progress is also auto-saved", "Save", () => { save(); notify("Saved."); });
    addRow(body, "New Life", "Wipe current progress", "Reset", () => {
      if (confirm("Start a completely new life?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
      }
    });
    addRow(body, "About", "Original recreation · not the official Lagos Life", null);
  });
}

function openBagSheet() {
  openSheet("Bag", (body) => {
    if (!state.inventory.length) {
      body.innerHTML = `<p class="muted">Empty. Go hustle.</p>`;
      return;
    }
    for (const item of state.inventory) {
      addRow(body, item, "Owned", null);
    }
  });
}

/* ---------- BOOT ---------- */
function startGame(startType) {
  const name = ($("#bootName").value || "").trim() || "Player";
  const existing = load();
  if (existing && existing.name) {
    // continue if same browser
    state = existing;
  } else {
    state = defaultState(startType, name);
  }
  $("#boot").classList.add("hidden");
  $("#game").classList.remove("hidden");
  refreshUI();
  save();

  // soft real-time drip (1 game minute every 4 real seconds when tab visible)
  clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    if (document.hidden) return;
    advanceMinutes(1);
  }, 4000);

  notify(startType === "nepo" ? "NEPO start. Soft life begins." : "LAPO start. Time to hustle.");
}

function bind() {
  $("#btnNepo").addEventListener("click", () => startGame("nepo"));
  $("#btnLapo").addEventListener("click", () => startGame("lapo"));
  $("#sheetClose").addEventListener("click", closeSheet);
  $("#overlay").addEventListener("click", (e) => { if (e.target.id === "overlay") closeSheet(); });

  $$(".bbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.act;
      if (act === "phone") openPhoneSheet();
      else if (act === "work") doWork();
      else if (act === "home") travelTo("home");
      else if (act === "bag") openBagSheet();
      else if (act === "menu") openMenuSheet();
    });
  });

  // auto-continue if save exists
  const saved = load();
  if (saved && saved.name) {
    $("#bootName").value = saved.name;
  }
}

bind();
