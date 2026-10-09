/* ============================================================
   NAIJA HUSTLE — FULL APP.JS
   Version: 3.0.0
   Online-only · Three.js isometric · Supabase auth + cloud saves
   Expanded Lagos world · Sheet UI · Animations
   ============================================================ */

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* ============================================================
   0. CONFIG
   ============================================================ */

const SUPABASE_URL = "https://pbqtbwiymlwksdtfsfcb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-SK-LvMzEwv-oqn8A5hZOQ_rwyzGxUj";

const CONFIG = {
  version: "3.0.0",
  worldSize: 120,
  moveSpeed: 7,
  sprintMultiplier: 1.55,
  cameraZoom: 18,
  dayLength: 300,
  saveInterval: 18000,
  interactionDistance: 14
};

/* ============================================================
   1. UTILITIES
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const random = (min, max) => min + Math.random() * (max - min);
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const money = (n) => "₦" + Math.floor(n).toLocaleString("en-NG");
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
const validColor = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);

function notify(message) {
  let el = $("#gameToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "gameToast";
    document.body.appendChild(el);
    Object.assign(el.style, {
      position: "fixed",
      bottom: "100px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#171717",
      color: "#f4c95d",
      border: "1px solid #9e7a2d",
      padding: "12px 18px",
      borderRadius: "12px",
      zIndex: "10000",
      font: "14px system-ui",
      maxWidth: "85vw",
      textAlign: "center",
      pointerEvents: "none"
    });
  }
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { el.style.display = "none"; }, 2800);
}

function setText(sel, value) {
  const el = $(sel);
  if (el) el.textContent = String(value ?? "");
}

function makeButton(label, action, opts = {}) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  Object.assign(btn.style, {
    background: opts.primary ? "#c69a35" : "#191919",
    color: opts.primary ? "#17130a" : "#f4c95d",
    border: "1px solid " + (opts.primary ? "#d5ad4c" : "#705821"),
    padding: "10px 14px",
    borderRadius: "9px",
    cursor: "pointer",
    font: "inherit",
    fontWeight: "700",
    width: opts.full ? "100%" : "auto"
  });
  btn.addEventListener("click", action);
  return btn;
}

/* ============================================================
   2. GAME DATA
   ============================================================ */

const CAREERS = [
  { name: "Unemployed", salary: 0 },
  { name: "Okada Rider", salary: 22000 },
  { name: "Shop Assistant", salary: 18000 },
  { name: "Delivery Rider", salary: 25000 },
  { name: "Graphic Designer", salary: 40000 },
  { name: "Web Developer", salary: 65000 },
  { name: "Business Owner", salary: 85000 },
  { name: "Oil Executive", salary: 150000 }
];

const GIGS = [
  { name: "Deliver a package", reward: 3500, energy: 8 },
  { name: "Design a flyer", reward: 5000, energy: 10 },
  { name: "Help at a shop", reward: 2500, energy: 6 },
  { name: "Build a landing page", reward: 9000, energy: 15 },
  { name: "Run market errands", reward: 4000, energy: 9 },
  { name: "DJ warm-up set", reward: 12000, energy: 18 }
];

const ITEMS = [
  { name: "Jollof Rice", price: 1500, hunger: 35 },
  { name: "Amala & Ewedu", price: 1800, hunger: 40 },
  { name: "Bottle of Water", price: 300, energy: 5 },
  { name: "Energy Drink", price: 700, energy: 20 },
  { name: "Shower Supplies", price: 800, hygiene: 35 },
  { name: "Suya", price: 1200, hunger: 25, fun: 8 },
  { name: "Airtime Bundle", price: 500, social: 10 }
];

const HOMES = [
  { name: "Shared Room (Face-me)", price: 0, rent: 0 },
  { name: "Basic Apartment", price: 150000, rent: 5000 },
  { name: "Comfort Apartment", price: 450000, rent: 15000 },
  { name: "Lekki Flat", price: 1500000, rent: 45000 },
  { name: "Banana Island Villa", price: 5000000, rent: 120000 }
];

const VEHICLES = [
  { name: "Bicycle", price: 12000, speed: 1.15 },
  { name: "Okada", price: 85000, speed: 1.45 },
  { name: "Keke", price: 180000, speed: 1.25 },
  { name: "Compact Car", price: 450000, speed: 1.7 }
];

const BUILDINGS = [
  { name: "Balogun Market", kind: "shop", x: -22, z: -10, color: 0xb57b44, h: 8 },
  { name: "Amala Shitta", kind: "food", x: -6, z: -20, color: 0xb84b35, h: 6 },
  { name: "Mama Bisi Salon", kind: "salon", x: 10, z: -18, color: 0xc97b9b, h: 6 },
  { name: "General Hospital", kind: "clinic", x: 24, z: -10, color: 0xe7e0d4, h: 9 },
  { name: "Marina Office", kind: "job", x: -24, z: 12, color: 0x738ba5, h: 14 },
  { name: "Tech Hub", kind: "job", x: -8, z: 20, color: 0x3d6b8c, h: 10 },
  { name: "Okada Park", kind: "garage", x: 22, z: 14, color: 0x7a7771, h: 5 },
  { name: "Face-Me Block", kind: "home", x: 6, z: 22, color: 0x9d8a74, h: 11 },
  { name: "Church", kind: "social", x: -18, z: 28, color: 0xd9c9a3, h: 12 },
  { name: "Viewing Centre", kind: "fun", x: 18, z: 26, color: 0x2f5d50, h: 7 },
  { name: "Quilox", kind: "club", x: 0, z: -28, color: 0x5b2c6f, h: 8 },
  { name: "Elegushi Beach", kind: "beach", x: 30, z: -22, color: 0xe8c97a, h: 3 }
];

const DEFAULT_STATE = {
  money: 25000,
  level: 1,
  xp: 0,
  day: 1,
  time: 8,
  career: "Unemployed",
  homeIndex: 0,
  vehicleIndex: -1,
  inventory: [],
  completedQuests: [],
  activeQuest: "Earn your first ₦5,000",
  needs: {
    hunger: 85, energy: 90, hygiene: 80, fun: 75, social: 60, bladder: 85
  },
  skills: { creativity: 1, business: 1, technology: 1, social: 1 },
  avatar: {
    skinTone: "#8d5524",
    hairColor: "#201710",
    hairstyle: "short",
    outfitColor: "#315c80",
    accessory: "none"
  },
  player: { x: 0, z: 0 },
  stats: { jobsCompleted: 0, gigsCompleted: 0, itemsPurchased: 0 }
};

function createInitialState() {
  return deepCopy(DEFAULT_STATE);
}

let state = createInitialState();

/* ============================================================
   3. STATE VALIDATION
   ============================================================ */

function normalizeState(input) {
  const defaults = createInitialState();
  if (!input || typeof input !== "object" || Array.isArray(input)) return defaults;

  const result = {
    ...defaults,
    ...input,
    needs: { ...defaults.needs, ...(input.needs || {}) },
    skills: { ...defaults.skills, ...(input.skills || {}) },
    avatar: { ...defaults.avatar, ...(input.avatar || {}) },
    player: { ...defaults.player, ...(input.player || {}) },
    stats: { ...defaults.stats, ...(input.stats || {}) }
  };

  result.money = Math.max(0, Number(result.money) || 0);
  result.level = Math.max(1, Number(result.level) || 1);
  result.xp = Math.max(0, Number(result.xp) || 0);
  result.day = Math.max(1, Number(result.day) || 1);
  result.time = clamp(Number(result.time) || 0, 0, 24);

  if (!CAREERS.some((c) => c.name === result.career)) result.career = "Unemployed";
  result.homeIndex = clamp(Math.floor(Number(result.homeIndex) || 0), 0, HOMES.length - 1);
  result.vehicleIndex = Number.isInteger(Number(result.vehicleIndex))
    ? clamp(Number(result.vehicleIndex), -1, VEHICLES.length - 1)
    : -1;

  for (const k of Object.keys(result.needs)) {
    result.needs[k] = clamp(Number(result.needs[k]) || 0, 0, 100);
  }
  for (const k of Object.keys(result.skills)) {
    result.skills[k] = Math.max(1, Number(result.skills[k]) || 1);
  }

  result.player.x = clamp(Number(result.player.x) || 0, -CONFIG.worldSize, CONFIG.worldSize);
  result.player.z = clamp(Number(result.player.z) || 0, -CONFIG.worldSize, CONFIG.worldSize);

  if (!Array.isArray(result.inventory)) result.inventory = [];
  if (!Array.isArray(result.completedQuests)) result.completedQuests = [];
  result.inventory = result.inventory.filter((i) => typeof i === "string");
  result.completedQuests = result.completedQuests.filter((i) => typeof i === "string");

  for (const key of ["skinTone", "hairColor", "outfitColor"]) {
    if (!validColor(result.avatar[key])) result.avatar[key] = defaults.avatar[key];
  }
  if (!["short", "afro", "bald"].includes(result.avatar.hairstyle)) {
    result.avatar.hairstyle = "short";
  }

  return result;
}

/* ============================================================
   4. SUPABASE AUTH + CLOUD SAVES
   ============================================================ */

let supabase = null;
let currentUser = null;
let authReady = false;
let gameStarted = false;
let gameStarting = false;
let cloudSaveInProgress = false;
let cloudSaveQueued = false;
let loggingOut = false;

async function initializeSupabase() {
  if (
    !SUPABASE_URL.startsWith("https://") ||
    SUPABASE_URL.includes("YOUR_PROJECT") ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
  ) {
    throw new Error("Supabase is not configured. Add your project URL and key.");
  }

  const module = await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
  );

  supabase = module.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  currentUser = data.session?.user || null;
  authReady = true;

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    if (!currentUser && gameStarted && !loggingOut) {
      stopGameplay();
      showLogin("Your session has ended. Please sign in again.");
    }
  });

  return true;
}

async function signInWithEmail(email, password) {
  if (!supabase) throw new Error("Online service not initialized.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user || data.session?.user || null;
  if (!currentUser) throw new Error("Login did not return a user.");
  return true;
}

async function signUpWithEmail(email, password) {
  if (!supabase) throw new Error("Online service not initialized.");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  currentUser = data.user || data.session?.user || null;
  return { user: data.user || null, session: data.session || null };
}

async function signOut() {
  if (!supabase) return;
  loggingOut = true;
  stopGameplay();
  const { error } = await supabase.auth.signOut();
  loggingOut = false;
  if (error) {
    showLogin("Sign-out failed. Please try again.");
    return;
  }
  currentUser = null;
  showLogin("You have signed out.");
}

async function saveCloudGame(options = {}) {
  if (!supabase || !currentUser) return false;
  if (cloudSaveInProgress) {
    cloudSaveQueued = true;
    return false;
  }

  cloudSaveInProgress = true;
  try {
    const snapshot = deepCopy(state);
    const { error } = await supabase.from("game_saves").upsert({
      user_id: currentUser.id,
      save_data: snapshot,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

    if (error) throw error;
    if (options.notify) notify("Progress saved online.");
    return true;
  } catch (err) {
    console.error("Cloud save failed:", err);
    if (options.notify) notify("Cloud save failed. Check connection.");
    return false;
  } finally {
    cloudSaveInProgress = false;
    if (cloudSaveQueued) {
      cloudSaveQueued = false;
      if (currentUser && gameStarted) saveCloudGame();
    }
  }
}

async function loadCloudGame() {
  if (!supabase || !currentUser) throw new Error("Sign in before loading.");

  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Could not load cloud save. Check game_saves table + RLS.");
  }

  if (data?.save_data) {
    state = normalizeState(data.save_data);
    return true;
  }

  state = createInitialState();
  const saved = await saveCloudGame();
  if (!saved) throw new Error("Could not create initial cloud save.");
  return true;
}

/* ============================================================
   5. SHEET UI (replaces prompt/alert)
   ============================================================ */

function closeGameSheet() {
  const overlay = $("#overlay");
  if (overlay) {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }
  const body = $("#sheetBody");
  if (body) body.replaceChildren();
}

function createGameSheet(title, subtitle = "") {
  const overlay = $("#overlay");
  const sheetTitle = $("#sheetTitle");
  const sheetEyebrow = $("#sheetEyebrow");
  const body = $("#sheetBody");

  if (!overlay || !body) {
    notify(title + (subtitle ? " — " + subtitle : ""));
    return document.createElement("div");
  }

  if (sheetTitle) sheetTitle.textContent = title;
  if (sheetEyebrow) sheetEyebrow.textContent = "NAIJA HUSTLE";
  body.replaceChildren();

  if (subtitle) {
    const p = document.createElement("p");
    p.textContent = subtitle;
    p.style.cssText = "margin:0 0 8px;color:#c9b67e;font-size:13px;line-height:1.5";
    body.appendChild(p);
  }

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  return body;
}

function addSheetNotice(content, text) {
  const p = document.createElement("p");
  p.textContent = text;
  p.style.cssText =
    "margin:0;padding:10px 12px;border-radius:10px;background:#1c2421;" +
    "border:1px solid #3a4540;color:#e6d7a2;font-size:13px;line-height:1.45";
  content.appendChild(p);
}

function addSheetRow(content, title, description, actionLabel, action) {
  const row = document.createElement("div");
  Object.assign(row.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "#1a211e",
    border: "1px solid #3a4540"
  });

  const left = document.createElement("div");
  left.style.cssText = "display:grid;gap:4px;min-width:0";

  const t = document.createElement("strong");
  t.textContent = title;
  t.style.cssText = "color:#f4c95d;font-size:14px";

  const d = document.createElement("span");
  d.textContent = description;
  d.style.cssText = "color:#b8c2bd;font-size:12px;line-height:1.4";

  left.append(t, d);
  row.append(left, makeButton(actionLabel, action));
  content.appendChild(row);
}

function addSheetColorInput(content, label, value, onChange) {
  const wrap = document.createElement("label");
  wrap.style.cssText = "display:grid;gap:8px;font-size:13px";
  wrap.textContent = label;

  const input = document.createElement("input");
  input.type = "color";
  input.value = value;
  input.style.cssText = "width:100%;height:42px;border:none;background:transparent;cursor:pointer";
  input.addEventListener("input", () => onChange(input.value));
  wrap.appendChild(input);
  content.appendChild(wrap);
}

print("PART1_OK")

/* ============================================================
   6. THREE.JS WORLD
   ============================================================ */

let scene, camera, renderer, clock, player;
let playerBody, playerHead, playerHair;
let worldReady = false;
let animationFrame = null;

const buildingMeshes = [];
const npcMeshes = [];
const keys = new Set();

const cameraTarget = new THREE.Vector3();
const cameraOffset = new THREE.Vector3(16, 20, 16);

let cameraZoom = CONFIG.cameraZoom;
let sprinting = false;
let joystick = { x: 0, y: 0, active: false };
let gamePaused = false;
let lastSave = 0;
let lastHudUpdate = 0;
let bobPhase = 0;

function makeMaterial(color, roughness = 0.88) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

function makeBox(w, h, d, color) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), makeMaterial(color));
}

function addGround() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(280, 280),
    makeMaterial(0x59664b)
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  scene.add(ground);

  const roadMat = makeMaterial(0x444448);
  const road1 = new THREE.Mesh(new THREE.BoxGeometry(110, 0.08, 10), roadMat);
  road1.position.set(0, 0, 0);
  scene.add(road1);

  const road2 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.08, 110), roadMat);
  road2.position.set(0, 0.01, 0);
  scene.add(road2);

  for (let i = -48; i <= 48; i += 8) {
    const mark = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.03, 0.2),
      makeMaterial(0xe6d7a2)
    );
    mark.position.set(i, 0.07, 0);
    scene.add(mark);
  }

  const water = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.05, 18),
    makeMaterial(0x3a7ca5, 0.3)
  );
  water.position.set(38, -0.02, -30);
  scene.add(water);
}

function createBuilding(data) {
  const group = new THREE.Group();
  const h = data.h || 7;

  const body = makeBox(10, h, 9, data.color);
  body.position.y = h / 2;
  group.add(body);

  const roof = makeBox(11, 0.45, 10, 0x4c3930);
  roof.position.y = h + 0.22;
  group.add(roof);

  const door = makeBox(1.6, 2.6, 0.2, 0x4b3020);
  door.position.set(0, 1.3, 4.6);
  group.add(door);

  if (h >= 6) {
    for (const x of [-3, 3]) {
      for (let row = 0; row < Math.min(3, Math.floor(h / 3)); row++) {
        const win = makeBox(1.5, 1.2, 0.15, 0x9bd2df);
        win.position.set(x, 3.2 + row * 2.6, 4.6);
        group.add(win);
      }
    }
  }

  const sign = makeBox(4.8, 0.95, 0.18, 0x1a1a1a);
  sign.position.set(0, h + 0.95, 4.55);
  group.add(sign);

  if (data.kind === "club" || data.kind === "food") {
    const neon = makeBox(8, 0.18, 0.12, data.kind === "club" ? 0xc44dff : 0xff6b35);
    neon.position.set(0, h + 0.55, 4.7);
    group.add(neon);
  }

  group.position.set(data.x, 0, data.z);
  group.userData = {
    kind: data.kind,
    name: data.name,
    x: data.x,
    z: data.z
  };

  scene.add(group);
  buildingMeshes.push(group);
  return group;
}

function createTree(x, z) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.4, 2.2, 7),
    makeMaterial(0x6a4329)
  );
  trunk.position.y = 1.1;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 8, 7),
    makeMaterial(0x326b3c)
  );
  leaves.position.y = 3;
  tree.add(leaves);

  tree.position.set(x, 0, z);
  scene.add(tree);
}

function createNPC(x, z) {
  const npc = new THREE.Group();

  const body = makeBox(
    0.8, 1.5, 0.55,
    choice([0x315c80, 0x7e4b33, 0x7d3974, 0x476d45, 0xc09a39, 0x2a6f6a])
  );
  body.position.y = 1;
  npc.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 12, 10),
    makeMaterial(choice([0x5c3525, 0x8d5524, 0xb98058, 0x3b2215]))
  );
  head.position.y = 2.1;
  npc.add(head);

  npc.position.set(x, 0, z);
  npc.userData = {
    originX: x,
    originZ: z,
    phase: random(0, Math.PI * 2),
    speed: random(0.25, 0.7),
    bob: random(0, Math.PI * 2)
  };

  scene.add(npc);
  npcMeshes.push(npc);
}

function createPlayer() {
  player = new THREE.Group();

  playerBody = makeBox(0.9, 1.4, 0.6, state.avatar.outfitColor);
  playerBody.position.y = 1;
  player.add(playerBody);

  playerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 12),
    makeMaterial(state.avatar.skinTone)
  );
  playerHead.position.y = 2.1;
  player.add(playerHead);

  playerHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 12, 8, 0, Math.PI * 2, 0, 0.9),
    makeMaterial(state.avatar.hairColor)
  );
  playerHair.position.y = 2.35;
  player.add(playerHair);

  player.position.set(state.player.x, 0, state.player.z);
  scene.add(player);
  applyAvatar();
}

function applyAvatar() {
  if (!playerBody || !playerHead || !playerHair) return;

  playerBody.material.color.set(state.avatar.outfitColor);
  playerHead.material.color.set(state.avatar.skinTone);
  playerHair.material.color.set(state.avatar.hairColor);
  playerHair.visible = state.avatar.hairstyle !== "bald";

  if (state.avatar.hairstyle === "afro") {
    playerHair.scale.set(1.35, 1.3, 1.35);
    playerHair.position.y = 2.42;
  } else {
    playerHair.scale.set(1, 1, 1);
    playerHair.position.y = 2.35;
  }
}

function initializeWorld() {
  const host = $("#gameCanvas") || $("#game-world") || $("#gameWorld");
  if (!host) throw new Error("No #gameCanvas found in index.html.");
  if (worldReady) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ec6d7);
  scene.fog = new THREE.Fog(0x9ec6d7, 70, 170);

  const width = host.clientWidth || window.innerWidth;
  const height = host.clientHeight || window.innerHeight;

  camera = new THREE.OrthographicCamera(
    -cameraZoom * width / height / 2,
    cameraZoom * width / height / 2,
    cameraZoom / 2,
    -cameraZoom / 2,
    0.1,
    500
  );
  camera.position.copy(cameraOffset);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  host.replaceChildren(renderer.domElement);
  Object.assign(renderer.domElement.style, {
    display: "block", width: "100%", height: "100%", touchAction: "none"
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x4e5943, 2));
  const sun = new THREE.DirectionalLight(0xffe3b0, 2);
  sun.position.set(-25, 45, 25);
  scene.add(sun);

  addGround();
  for (const b of BUILDINGS) createBuilding(b);

  let trees = 0, attempts = 0;
  while (trees < 32 && attempts < 120) {
    attempts++;
    const x = random(-48, 48);
    const z = random(-48, 48);
    if (Math.abs(x) < 28 && Math.abs(z) < 26) continue;
    createTree(x, z);
    trees++;
  }

  for (let i = 0; i < 14; i++) createNPC(random(-34, 34), random(-34, 34));

  createPlayer();
  clock = new THREE.Clock();
  worldReady = true;

  window.addEventListener("resize", resizeRenderer);
  renderer.domElement.addEventListener("pointerdown", onWorldPointer);
  animate();
}

function resizeRenderer() {
  if (!renderer || !camera) return;
  const host = renderer.domElement.parentElement;
  const width = host?.clientWidth || window.innerWidth;
  const height = host?.clientHeight || window.innerHeight;
  renderer.setSize(width, height);
  camera.left = -cameraZoom * width / height / 2;
  camera.right = cameraZoom * width / height / 2;
  camera.top = cameraZoom / 2;
  camera.bottom = -cameraZoom / 2;
  camera.updateProjectionMatrix();
}

function onWorldPointer(event) {
  if (!renderer || !camera || !player || gamePaused) return;
  const rect = renderer.domElement.getBoundingClientRect();
  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(buildingMeshes, true);
  if (!hits.length) return;

  let object = hits[0].object;
  while (object && !object.userData.kind) object = object.parent;
  if (!object?.userData?.kind) return;

  const building = object.userData;
  const dist = Math.hypot(player.position.x - building.x, player.position.z - building.z);
  if (dist > CONFIG.interactionDistance) {
    notify("Move closer to " + building.name + " first.");
    return;
  }
  interactWithBuilding(building);
}

/* ============================================================
   7. MOVEMENT + CAMERA + ANIMATION
   ============================================================ */

function syncPlayerPosition() {
  if (!player) return;
  player.position.x = state.player.x;
  player.position.z = state.player.z;
}

function updateMovement(dt) {
  if (!player || gamePaused) return;

  let x = 0, z = 0;
  if (keys.has("w") || keys.has("arrowup")) z -= 1;
  if (keys.has("s") || keys.has("arrowdown")) z += 1;
  if (keys.has("a") || keys.has("arrowleft")) x -= 1;
  if (keys.has("d") || keys.has("arrowright")) x += 1;
  x += joystick.x;
  z += joystick.y;

  const length = Math.hypot(x, z);
  if (length > 1) { x /= length; z /= length; }

  const vehicle = VEHICLES[state.vehicleIndex];
  const vehicleBonus = vehicle ? Math.min(vehicle.speed, 1.5) : 1;
  const speed = CONFIG.moveSpeed * (sprinting ? CONFIG.sprintMultiplier : 1) * vehicleBonus;
  const moving = length > 0.05;

  if (moving) {
    const worldX = (x - z) / Math.SQRT2;
    const worldZ = (x + z) / Math.SQRT2;
    player.position.x += worldX * speed * dt;
    player.position.z += worldZ * speed * dt;
    player.rotation.y = Math.atan2(worldX, worldZ);
    state.needs.energy = clamp(state.needs.energy - dt * (sprinting ? 0.8 : 0.28), 0, 100);
    bobPhase += dt * (sprinting ? 14 : 9);
    player.position.y = Math.abs(Math.sin(bobPhase)) * 0.12;
  } else {
    player.position.y = THREE.MathUtils.lerp(player.position.y, 0, 1 - Math.exp(-10 * dt));
  }

  if (keys.has(" ")) player.position.y = 0.7;

  player.position.x = clamp(player.position.x, -CONFIG.worldSize, CONFIG.worldSize);
  player.position.z = clamp(player.position.z, -CONFIG.worldSize, CONFIG.worldSize);
  state.player.x = player.position.x;
  state.player.z = player.position.z;
  updateCamera(dt);
}

function updateCamera(dt) {
  if (!camera || !player) return;
  cameraTarget.copy(player.position);
  const desired = cameraTarget.clone().add(cameraOffset);
  camera.position.lerp(desired, 1 - Math.exp(-5 * dt));
  camera.lookAt(cameraTarget);
}

function zoomCamera(amount) {
  cameraZoom = clamp(cameraZoom + amount, 10, 30);
  resizeRenderer();
}

function updateWorld(dt) {
  for (const npc of npcMeshes) {
    npc.userData.phase += dt * npc.userData.speed;
    npc.userData.bob += dt * 6;
    npc.position.x = npc.userData.originX + Math.sin(npc.userData.phase) * 1.8;
    npc.position.z = npc.userData.originZ + Math.cos(npc.userData.phase * 0.75) * 1.8;
    npc.position.y = Math.abs(Math.sin(npc.userData.bob)) * 0.08;
    npc.rotation.y = Math.atan2(
      Math.cos(npc.userData.phase),
      -Math.sin(npc.userData.phase * 0.75)
    );
  }
  const t = performance.now() * 0.003;
  for (const group of buildingMeshes) {
    if (group.userData.kind === "club" || group.userData.kind === "food") {
      group.position.y = Math.sin(t + group.userData.x) * 0.03;
    }
  }
}

function animate() {
  if (!worldReady || !renderer || !scene || !camera) return;
  animationFrame = requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  updateMovement(dt);
  updateWorld(dt);
  if (!gamePaused) updateGameTime(dt);
  renderer.render(scene, camera);

  lastHudUpdate += dt;
  if (lastHudUpdate >= 0.25) {
    refreshGameUI();
    lastHudUpdate = 0;
  }

  lastSave += dt * 1000;
  if (lastSave >= CONFIG.saveInterval) {
    if (currentUser && gameStarted) saveCloudGame();
    lastSave = 0;
  }
}

/* ============================================================
   8. NEEDS, TIME, XP, QUESTS
   ============================================================ */

function updateGameTime(dt) {
  state.time += dt * 24 / CONFIG.dayLength;
  if (state.time >= 24) {
    state.time -= 24;
    state.day += 1;
    payDailyExpenses();
  }
  state.needs.hunger = clamp(state.needs.hunger - dt * 0.12, 0, 100);
  state.needs.hygiene = clamp(state.needs.hygiene - dt * 0.045, 0, 100);
  state.needs.fun = clamp(state.needs.fun - dt * 0.025, 0, 100);
  state.needs.social = clamp(state.needs.social - dt * 0.018, 0, 100);
  state.needs.bladder = clamp(state.needs.bladder - dt * 0.07, 0, 100);
}

function payDailyExpenses() {
  const home = HOMES[state.homeIndex] || HOMES[0];
  if (home.rent > 0) {
    state.money = Math.max(0, state.money - home.rent);
    notify("Housing expense: " + money(home.rent));
  }
  const career = CAREERS.find((c) => c.name === state.career);
  if (career?.salary > 0) {
    state.money += career.salary;
    notify("Work income: " + money(career.salary));
    addXP(20);
  }
  saveCloudGame();
}

function addXP(amount) {
  state.xp += Math.max(0, amount);
  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level += 1;
    state.money += 1500;
    notify("Level " + state.level + "! Bonus ₦1,500");
  }
  checkQuest();
}

function setNeed(name, value) {
  if (!(name in state.needs)) return;
  state.needs[name] = clamp(value, 0, 100);
}

function restoreNeed(name, amount) {
  if (!(name in state.needs)) return;
  setNeed(name, state.needs[name] + amount);
}

function checkQuest() {
  if (state.activeQuest === "Earn your first ₦5,000" && state.money >= 30000) {
    state.completedQuests.push(state.activeQuest);
    state.activeQuest = "Complete your first gig";
    state.money += 2000;
    notify("Quest complete! +₦2,000");
  }
  if (state.activeQuest === "Complete your first gig" && state.stats.gigsCompleted > 0) {
    state.completedQuests.push(state.activeQuest);
    state.activeQuest = "Explore the city — visit 3 places";
    state.money += 3000;
    notify("Quest complete! +₦3,000");
  }
}

/* ============================================================
   9-13. SHEETS: CAREER, GIGS, SHOP, HOUSING, VEHICLES, AVATAR
   ============================================================ */

function openCareerSheet() {
  const content = createGameSheet("Choose Your Hustle", "Salary pays every game day.");
  addSheetNotice(content, "Current: " + state.career + " · Cash: " + money(state.money));
  for (const career of CAREERS.filter((c) => c.name !== "Unemployed")) {
    addSheetRow(content, career.name, money(career.salary) + " per game day", "Select", () => {
      state.career = career.name;
      state.stats.jobsCompleted += 1;
      notify("Career: " + career.name);
      addXP(25);
      saveCloudGame();
      closeGameSheet();
      refreshGameUI();
    });
  }
}

function openGigSheet() {
  const content = createGameSheet("Side Gigs", "Quick money. Costs energy.");
  addSheetNotice(content, "Energy: " + Math.round(state.needs.energy) + "% · Cash: " + money(state.money));
  for (const gig of GIGS) {
    addSheetRow(content, gig.name, "Reward " + money(gig.reward) + " · Energy " + gig.energy, "Work", () => {
      doGig(gig);
      closeGameSheet();
    });
  }
}

function doGig(gig = choice(GIGS)) {
  if (state.needs.energy < gig.energy) {
    notify("Not enough energy. Rest first.");
    return;
  }
  state.needs.energy -= gig.energy;
  state.money += gig.reward;
  state.stats.gigsCompleted += 1;
  const skill = choice(Object.keys(state.skills));
  state.skills[skill] += 1;
  addXP(30);
  notify("Gig done: " + gig.name + " · +" + money(gig.reward));
  saveCloudGame();
  refreshGameUI();
}

function openShop() {
  const content = createGameSheet("Balogun Market", "Buy supplies. Keep needs alive.");
  addSheetNotice(content, "Your cash: " + money(state.money));
  for (const item of ITEMS) {
    const effects = [];
    for (const need of ["hunger", "energy", "hygiene", "fun", "social"]) {
      if (Number(item[need]) > 0) effects.push("+" + item[need] + " " + need);
    }
    addSheetRow(content, item.name, money(item.price) + (effects.length ? " · " + effects.join(", ") : ""), "Buy", () => {
      buyItem(item);
      closeGameSheet();
    });
  }
}

function buyItem(item) {
  if (state.money < item.price) {
    notify("Not enough money.");
    return false;
  }
  state.money -= item.price;
  state.inventory.push(item.name);
  state.stats.itemsPurchased += 1;
  notify("Bought " + item.name);
  saveCloudGame();
  refreshGameUI();
  return true;
}

function useItem(itemName) {
  const index = state.inventory.indexOf(itemName);
  if (index === -1) { notify("Item not in inventory."); return; }
  const item = ITEMS.find((e) => e.name === itemName);
  if (!item) { notify("No effect configured."); return; }
  state.inventory.splice(index, 1);
  if (item.hunger) restoreNeed("hunger", item.hunger);
  if (item.energy) restoreNeed("energy", item.energy);
  if (item.hygiene) restoreNeed("hygiene", item.hygiene);
  if (item.fun) restoreNeed("fun", item.fun);
  if (item.social) restoreNeed("social", item.social);
  notify("Used " + item.name);
  saveCloudGame();
  refreshGameUI();
}

function eat() {
  const content = createGameSheet("Chop Life", "Food options nearby.");
  addSheetNotice(content, "Cash: " + money(state.money));
  for (const item of ITEMS.filter((i) => i.hunger)) {
    addSheetRow(content, item.name, money(item.price) + " · +" + item.hunger + " hunger", "Buy & Eat", () => {
      if (buyItem(item)) useItem(item.name);
      closeGameSheet();
    });
  }
}

function rest() {
  restoreNeed("energy", 40);
  restoreNeed("fun", 10);
  state.time = (state.time + 2) % 24;
  notify("You rested. Energy up.");
  saveCloudGame();
  refreshGameUI();
}

function shower() {
  restoreNeed("hygiene", 55);
  state.money = Math.max(0, state.money - 300);
  notify("Freshened up. -₦300");
  saveCloudGame();
  refreshGameUI();
}

function openHousingSheet() {
  const content = createGameSheet("Housing", "Upgrade your base. Rent hits every game day.");
  addSheetNotice(content, "Current: " + (HOMES[state.homeIndex]?.name || "?") + " · Cash: " + money(state.money));
  for (let i = 0; i < HOMES.length; i++) {
    const home = HOMES[i];
    const owned = i === state.homeIndex;
    const locked = i < state.homeIndex;
    addSheetRow(content, home.name + (owned ? " (Current)" : ""), money(home.price) + " · Daily " + money(home.rent), owned || locked ? "—" : "Move in", () => {
      if (owned || locked) return;
      if (state.money < home.price) { notify("Not enough money."); return; }
      state.money -= home.price;
      state.homeIndex = i;
      notify("Moved into " + home.name);
      addXP(50);
      saveCloudGame();
      closeGameSheet();
      refreshGameUI();
    });
  }
}

function openVehicleSheet() {
  const content = createGameSheet("Vehicles", "Move faster across Lagos.");
  addSheetNotice(content, "Cash: " + money(state.money));
  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    const owned = state.vehicleIndex === i;
    addSheetRow(content, v.name + (owned ? " (Owned)" : ""), money(v.price) + " · Speed x" + v.speed, owned ? "Equipped" : "Buy", () => {
      if (owned) return;
      if (state.money < v.price) { notify("Not enough money."); return; }
      state.money -= v.price;
      state.vehicleIndex = i;
      notify("Purchased " + v.name);
      saveCloudGame();
      closeGameSheet();
      refreshGameUI();
    });
  }
}

function interactWithBuilding(building) {
  switch (building.kind) {
    case "shop": openShop(); break;
    case "food": eat(); break;
    case "clinic":
      restoreNeed("energy", 12); restoreNeed("hygiene", 8);
      notify("Short rest at " + building.name + "."); saveCloudGame(); break;
    case "job": openCareerSheet(); break;
    case "home": rest(); break;
    case "garage": openVehicleSheet(); break;
    case "salon":
      restoreNeed("hygiene", 22); restoreNeed("fun", 12);
      state.money = Math.max(0, state.money - 2500);
      notify("Fresh cut at Mama Bisi. -₦2,500"); saveCloudGame(); break;
    case "social":
    case "fun":
    case "club":
      restoreNeed("social", 25); restoreNeed("fun", 30);
      state.money = Math.max(0, state.money - 3000);
      notify("Vibes at " + building.name + ". -₦3,000"); saveCloudGame(); break;
    case "beach":
      restoreNeed("fun", 35); restoreNeed("social", 15);
      notify("Elegushi soft life activated."); saveCloudGame(); break;
    default: notify("Nothing to do here yet.");
  }
  refreshGameUI();
}

function customizeAvatar() {
  const content = createGameSheet("Avatar", "Look like a proper Lagosian.");
  addSheetColorInput(content, "Skin tone", state.avatar.skinTone, (v) => { state.avatar.skinTone = v; applyAvatar(); saveCloudGame(); });
  addSheetColorInput(content, "Hair colour", state.avatar.hairColor, (v) => { state.avatar.hairColor = v; applyAvatar(); saveCloudGame(); });
  addSheetColorInput(content, "Outfit colour", state.avatar.outfitColor, (v) => { state.avatar.outfitColor = v; applyAvatar(); saveCloudGame(); });

  const styleLabel = document.createElement("label");
  styleLabel.textContent = "Hairstyle";
  styleLabel.style.cssText = "display:grid;gap:8px;font-size:13px";
  const select = document.createElement("select");
  for (const style of ["short", "afro", "bald"]) {
    const opt = document.createElement("option");
    opt.value = style;
    opt.textContent = style.charAt(0).toUpperCase() + style.slice(1);
    select.appendChild(opt);
  }
  select.value = state.avatar.hairstyle;
  Object.assign(select.style, { padding: "11px", borderRadius: "9px", background: "#222", color: "#fff", border: "1px solid #705821" });
  select.addEventListener("change", () => { state.avatar.hairstyle = select.value; applyAvatar(); saveCloudGame(); });
  styleLabel.appendChild(select);
  content.appendChild(styleLabel);
  content.appendChild(makeButton("Done", closeGameSheet, { primary: true, full: true }));
}

function showInventory() {
  const content = createGameSheet("Inventory", "Use items to restore needs.");
  if (!state.inventory.length) {
    addSheetNotice(content, "Empty. Visit Balogun Market.");
    return;
  }
  for (const itemName of [...state.inventory]) {
    addSheetRow(content, itemName, "Tap Use to consume", "Use", () => { useItem(itemName); closeGameSheet(); });
  }
}

/* ============================================================
   14. MINIMAP + HUD
   ============================================================ */

function drawMinimap() {
  const canvas = $("#minimap");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#18221b";
  ctx.fillRect(0, 0, w, h);
  const scale = Math.min(w, h) / 110;
  ctx.strokeStyle = "#545454";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.stroke();
  for (const b of BUILDINGS) {
    ctx.fillStyle = "#d0a94f";
    ctx.fillRect(w / 2 + b.x * scale - 3, h / 2 + b.z * scale - 3, 6, 6);
  }
  ctx.fillStyle = "#66d9ef";
  ctx.beginPath();
  ctx.arc(w / 2 + state.player.x * scale, h / 2 + state.player.z * scale, 4, 0, Math.PI * 2);
  ctx.fill();
}

function updateNeedBar(name, value) {
  const bar = document.querySelector(`[data-need="${name}"]`);
  if (bar) bar.style.width = value + "%";
  const map = {
    hunger: "#needHungerV", energy: "#needEnergyV", hygiene: "#needHygieneV",
    fun: "#needFunV", social: "#needSocialV", bladder: "#needBladderV"
  };
  if (map[name]) setText(map[name], Math.round(value));
}

function formatClock() {
  const hours = Math.floor(state.time) % 24;
  const minutes = Math.floor((state.time % 1) * 60);
  const ampm = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 || 12;
  return display + ":" + String(minutes).padStart(2, "0") + " " + ampm;
}

function refreshGameUI() {
  setText("#money", Math.floor(state.money).toLocaleString("en-NG"));
  setText("#levelBadge", "Lv " + state.level);
  setText("#objectiveText", state.activeQuest);
  setText("#housingPill", HOMES[state.homeIndex]?.name || "Room");
  setText("#clock", formatClock());
  setText("#name", currentUser?.email?.split("@")[0] || "Player");
  setText("#sub", state.career + " · Day " + state.day);
  setText("#xpText", state.xp + " / " + state.level * 100 + " XP");

  const xpFill = $("#xpFill");
  if (xpFill) xpFill.style.width = clamp(state.xp / (state.level * 100) * 100, 0, 100) + "%";

  for (const [name, value] of Object.entries(state.needs)) updateNeedBar(name, value);

  const avg = (state.needs.hunger + state.needs.energy + state.needs.hygiene + state.needs.fun + state.needs.social) / 5;
  let mood = "Doing Fine";
  if (avg < 30) mood = "Suffering";
  else if (avg < 50) mood = "Managing";
  else if (avg > 80) mood = "Soft Life";
  setText("#moodText", mood);
  drawMinimap();
}

function createBasicUI() {
  if ($("#nhBasicMenu")) return;
  const panel = document.createElement("div");
  panel.id = "nhBasicMenu";
  Object.assign(panel.style, {
    position: "fixed", top: "12px", right: "12px", width: "min(250px, 65vw)",
    maxHeight: "55vh", overflowY: "auto", background: "rgba(18,18,18,0.92)",
    color: "#fff", border: "1px solid #8b6c29", borderRadius: "14px",
    padding: "10px", zIndex: "1000", font: "13px system-ui"
  });
  const heading = document.createElement("h3");
  heading.textContent = "QUICK ACTIONS";
  heading.style.color = "#f4c95d";
  panel.appendChild(heading);

  const controls = document.createElement("div");
  Object.assign(controls.style, { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" });
  const actions = [
    ["Gigs", openGigSheet], ["Career", openCareerSheet], ["Market", openShop], ["Eat", eat],
    ["Rest", rest], ["Shower", shower], ["Housing", openHousingSheet], ["Vehicles", openVehicleSheet],
    ["Avatar", customizeAvatar], ["Bag", showInventory],
    ["Save", () => saveCloudGame({ notify: true })], ["Sign Out", signOut]
  ];
  for (const [label, fn] of actions) controls.appendChild(makeButton(label, fn));
  panel.appendChild(controls);

  const help = document.createElement("p");
  help.textContent = "WASD move · Shift run · E interact · Space jump · +/- zoom";
  help.style.cssText = "line-height:1.45;margin-top:8px;color:#aaa;font-size:11px";
  panel.appendChild(help);
  document.body.appendChild(panel);
}

/* ============================================================
   15. INPUTS
   ============================================================ */

function onKeyDown(event) {
  if (!gameStarted) return;
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
  keys.add(key);
  if (key === "shift") sprinting = true;
  if (key === "+" || key === "=") zoomCamera(-1);
  if (key === "-") zoomCamera(1);
  if (key === "e") {
    const nearest = getNearestBuilding();
    if (nearest && nearest.distance <= CONFIG.interactionDistance) interactWithBuilding(nearest.building);
    else notify("Move closer to a building.");
  }
  if (key === "i") showInventory();
  if (key === "c") customizeAvatar();
  if (key === "escape") {
    if ($("#overlay")?.classList.contains("open")) closeGameSheet();
    else gamePaused = !gamePaused;
  }
}

function onKeyUp(event) {
  const key = event.key.toLowerCase();
  keys.delete(key);
  if (key === "shift") sprinting = false;
}

function getNearestBuilding() {
  if (!player) return null;
  let nearest = null;
  for (const b of BUILDINGS) {
    const distance = Math.hypot(player.position.x - b.x, player.position.z - b.z);
    if (!nearest || distance < nearest.distance) nearest = { building: b, distance };
  }
  return nearest;
}

function bindJoystick() {
  const base = $("#joystick") || $("#joystickBase");
  const knob = $("#stick") || $("#joystickKnob");
  if (!base || base.dataset.nhBound === "true") return;
  base.dataset.nhBound = "true";
  let pointerId = null;

  function update(e) {
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = Math.max(1, rect.width * 0.32);
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const factor = dist > max ? max / dist : 1;
    joystick.x = (dx * factor) / max;
    joystick.y = (dy * factor) / max;
    joystick.active = true;
    if (knob) knob.style.transform = "translate(" + joystick.x * max + "px," + joystick.y * max + "px)";
  }

  base.addEventListener("pointerdown", (e) => {
    pointerId = e.pointerId;
    try { base.setPointerCapture(pointerId); } catch {}
    update(e);
  });
  base.addEventListener("pointermove", (e) => { if (e.pointerId === pointerId) update(e); });
  function stop(e) {
    if (e && e.pointerId !== pointerId) return;
    pointerId = null;
    joystick = { x: 0, y: 0, active: false };
    if (knob) knob.style.transform = "translate(0,0)";
  }
  base.addEventListener("pointerup", stop);
  base.addEventListener("pointercancel", stop);
}

function bindExistingButtons() {
  const map = {
    "#avatarBtn": customizeAvatar,
    "#homeBtn": openHousingSheet,
    "#bagBtn": showInventory,
    "#socialBtn": () => { restoreNeed("social", 12); notify("You gist with people nearby."); saveCloudGame(); refreshGameUI(); },
    "#emoteBtn": () => notify("You wave at Lagos!"),
    "#runBtn": () => { sprinting = !sprinting; notify(sprinting ? "Running on." : "Running off."); },
    "#jumpBtn": () => { if (player) { player.position.y = 0.7; setTimeout(() => { if (player) player.position.y = 0; }, 280); } },
    "#sheetClose": closeGameSheet
  };
  for (const [sel, fn] of Object.entries(map)) {
    const el = $(sel);
    if (el && el.dataset.nhBound !== "true") {
      el.addEventListener("click", fn);
      el.dataset.nhBound = "true";
    }
  }
}

/* ============================================================
   16. STARTUP / LOGIN FLOW
   ============================================================ */

function showLogin(message = "") {
  const login = $("#loginScreen");
  const hud = $("#hud");
  const loading = $("#loading") || $("#loadingScreen");
  if (login) login.classList.remove("hidden");
  if (hud) hud.classList.add("hidden");
  if (loading) loading.classList.add("hidden");
  const msg = $("#loginMessage");
  if (msg && message) msg.textContent = message;
}

function showGame() {
  const login = $("#loginScreen");
  const hud = $("#hud");
  const loading = $("#loading") || $("#loadingScreen");
  if (login) login.classList.add("hidden");
  if (hud) hud.classList.remove("hidden");
  if (loading) loading.classList.add("hidden");
}

function stopGameplay() {
  gameStarted = false;
  gameStarting = false;
  gamePaused = true;
  keys.clear();
  sprinting = false;
  joystick = { x: 0, y: 0, active: false };
  $("#nhBasicMenu")?.remove();
  if (animationFrame !== null) { cancelAnimationFrame(animationFrame); animationFrame = null; }
  if (renderer) { renderer.dispose(); renderer.domElement.remove(); }
  window.removeEventListener("resize", resizeRenderer);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  scene = camera = renderer = clock = player = null;
  playerBody = playerHead = playerHair = null;
  buildingMeshes.length = 0;
  npcMeshes.length = 0;
  worldReady = false;
}

async function startAuthenticatedGame() {
  if (!currentUser) { showLogin("Please sign in before playing."); return; }
  if (gameStarted || gameStarting) return;

  gameStarting = true;
  gamePaused = false;
  const loading = $("#loading") || $("#loadingScreen");
  if (loading) loading.classList.remove("hidden");

  try {
    await loadCloudGame();
    showGame();
    initializeWorld();
    if (!worldReady) throw new Error("3D world failed to start.");

    bindJoystick();
    bindExistingButtons();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    createBasicUI();

    gameStarted = true;
    gamePaused = false;
    gameStarting = false;

    syncPlayerPosition();
    applyAvatar();
    refreshGameUI();
    setText("#name", currentUser.email?.split("@")[0] || "Player");
    notify("Welcome to Naija Hustle!");
    console.info("Naija Hustle " + CONFIG.version + " online.");
  } catch (err) {
    console.error(err);
    stopGameplay();
    showLogin(err.message || "Could not start the game.");
  } finally {
    gameStarting = false;
    if (!gameStarted) {
      const screen = $("#loading") || $("#loadingScreen");
      if (screen) screen.classList.add("hidden");
    }
  }
}

async function handleLogin() {
  if (!authReady) { showLogin("Still connecting. Please wait…"); return; }
  const email = $("#loginEmail")?.value.trim();
  const password = $("#loginPassword")?.value;
  if (!email || !password) { showLogin("Enter email and password."); return; }
  try {
    showLogin("Signing in…");
    await signInWithEmail(email, password);
    await startAuthenticatedGame();
  } catch (err) {
    console.error(err);
    showLogin(err.message || "Login failed.");
  }
}

async function handleSignup() {
  if (!authReady) { showLogin("Still connecting. Please wait…"); return; }
  const email = $("#loginEmail")?.value.trim();
  const password = $("#loginPassword")?.value;
  if (!email || !password) { showLogin("Enter email and password."); return; }
  if (password.length < 6) { showLogin("Password must be at least 6 characters."); return; }
  try {
    showLogin("Creating account…");
    const result = await signUpWithEmail(email, password);
    if (!result.session) {
      showLogin("Account created. Verify email if required, then sign in.");
      return;
    }
    await startAuthenticatedGame();
  } catch (err) {
    console.error(err);
    showLogin(err.message || "Signup failed.");
  }
}

function bindAuthenticationEvents() {
  window.addEventListener("naijahustle:login", (e) => { e.preventDefault?.(); handleLogin(); });
  window.addEventListener("naijahustle:signup", (e) => { e.preventDefault?.(); handleSignup(); });

  const form = $("#loginForm");
  if (form && form.dataset.nhBound !== "true") {
    form.dataset.nhBound = "true";
    form.addEventListener("submit", (e) => { e.preventDefault(); handleLogin(); });
  }

  const guest = $("#guestBtn");
  if (guest) { guest.disabled = true; guest.hidden = true; }

  $("#sheetClose")?.addEventListener("click", closeGameSheet);
  $("#overlay")?.addEventListener("click", (e) => { if (e.target.id === "overlay") closeGameSheet(); });
}

async function start() {
  showLogin("Connecting to Naija Hustle…");
  bindAuthenticationEvents();
  try {
    await initializeSupabase();
    if (currentUser) await startAuthenticatedGame();
    else showLogin("Sign in or create an account to play online.");
  } catch (err) {
    console.error(err);
    showLogin("Online connection failed. Check Supabase settings.");
  }
}

window.addEventListener("beforeunload", () => {
  if (currentUser && gameStarted && !cloudSaveInProgress) saveCloudGame();
});

start().catch((err) => {
  console.error(err);
  showLogin("The game could not start. Refresh and try again.");
});
