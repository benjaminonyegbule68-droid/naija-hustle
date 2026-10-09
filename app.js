/* ============================================================
   NAIJA HUSTLE — REBUILT MODULAR APP
   Version: 3.0.0
   Three.js + Supabase Auth + Cloud Saves
   ONLINE ONLY — NO GUEST OR LOCAL SAVE MODE
   ============================================================ */

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* ========================= 1. CONFIG ======================== */

const SUPABASE_URL = "https://pbqtbwiymlwksdtfsfcb.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_-SK-LvMzEwv-oqn8A5hZOQ_rwyzGxUj";

const CONFIG = Object.freeze({
  version: "3.0.0",
  worldSize: 100,
  moveSpeed: 7,
  sprintMultiplier: 1.55,
  cameraZoom: 16,
  dayLength: 300,
  saveInterval: 15000,
  interactionDistance: 12,
  minimumPasswordLength: 6
});

const $ = (selector) => document.querySelector(selector);

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const random = (min, max) =>
  min + Math.random() * (max - min);

const choice = (items) =>
  items[Math.floor(Math.random() * items.length)];

const money = (amount) =>
  "₦" + Math.floor(Number(amount) || 0).toLocaleString("en-NG");

const deepCopy = (value) => JSON.parse(JSON.stringify(value));

const validColor = (value) =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = String(value ?? "");
}

function showElement(selector, visible) {
  const element = $(selector);
  if (element) element.classList.toggle("hidden", !visible);
}

function reportError(label, error) {
  console.error("[Naija Hustle] " + label, error);
}

/* ========================= 2. NOTIFICATIONS ================= */

let toastTimer = null;

function notify(message, duration = 2800) {
  let toast = $("#gameToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "gameToast";

    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      bottom: "24px",
      transform: "translateX(-50%)",
      background: "#171717",
      color: "#f4c95d",
      border: "1px solid #9e7a2d",
      padding: "12px 18px",
      borderRadius: "12px",
      zIndex: "20000",
      font: "14px system-ui,sans-serif",
      maxWidth: "88vw",
      textAlign: "center",
      boxShadow: "0 8px 28px #0008",
      pointerEvents: "none"
    });

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, duration);
}

function makeButton(label, action, options = {}) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;

  Object.assign(button.style, {
    background: options.primary ? "#d7aa43" : "#191919",
    color: options.primary ? "#171717" : "#f4c95d",
    border: "1px solid #705821",
    borderRadius: "9px",
    padding: "10px 13px",
    cursor: "pointer",
    font: "inherit",
    fontWeight: options.primary ? "700" : "500",
    minHeight: "40px"
  });

  button.addEventListener("click", action);
  return button;
}

/* ========================= 3. GAME DATA ===================== */

const CAREERS = [
  { name: "Unemployed", salary: 0 },
  { name: "Shop Assistant", salary: 18000 },
  { name: "Delivery Rider", salary: 25000 },
  { name: "Graphic Designer", salary: 40000 },
  { name: "Web Developer", salary: 65000 },
  { name: "Business Owner", salary: 85000 }
];

const GIGS = [
  { name: "Deliver a package", reward: 3500, energy: 8, skill: "social" },
  { name: "Design a flyer", reward: 5000, energy: 10, skill: "creativity" },
  { name: "Help at a shop", reward: 2500, energy: 6, skill: "business" },
  { name: "Build a landing page", reward: 9000, energy: 15, skill: "technology" }
];

const ITEMS = [
  { name: "Jollof Rice", price: 1500, hunger: 35 },
  { name: "Bottle of Water", price: 300, bladder: -5, energy: 5 },
  { name: "Shower Supplies", price: 800, hygiene: 35 },
  { name: "Energy Drink", price: 700, energy: 20 }
];

const HOMES = [
  { name: "Shared Room", price: 0, rent: 0 },
  { name: "Basic Apartment", price: 150000, rent: 5000 },
  { name: "Comfort Apartment", price: 450000, rent: 15000 },
  { name: "Luxury Apartment", price: 1500000, rent: 45000 }
];

const VEHICLES = [
  { name: "Bicycle", price: 12000, speed: 1.2 },
  { name: "Okada", price: 85000, speed: 1.6 },
  { name: "Compact Car", price: 450000, speed: 2.0 }
];

const BUILDINGS = [
  { name: "Market", kind: "shop", x: -18, z: -8, color: 0xb57b44 },
  { name: "Food Spot", kind: "food", x: 0, z: -16, color: 0xb84b35 },
  { name: "Clinic", kind: "clinic", x: 18, z: -8, color: 0xe7e0d4 },
  { name: "Office", kind: "job", x: -18, z: 12, color: 0x738ba5 },
  { name: "Apartment", kind: "home", x: 0, z: 16, color: 0x9d8a74 },
  { name: "Garage", kind: "garage", x: 18, z: 12, color: 0x7a7771 }
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
    hunger: 85,
    energy: 90,
    hygiene: 80,
    fun: 75,
    social: 60,
    bladder: 85
  },
  skills: {
    creativity: 1,
    business: 1,
    technology: 1,
    social: 1
  },
  avatar: {
    skinTone: "#8d5524",
    hairColor: "#201710",
    hairstyle: "short",
    outfitColor: "#315c80",
    accessory: "none"
  },
  player: { x: 0, z: 0 },
  stats: {
    jobsCompleted: 0,
    gigsCompleted: 0,
    itemsPurchased: 0
  }
};

function createInitialState() {
  return deepCopy(DEFAULT_STATE);
}

let state = createInitialState();

/* ========================= 4. STATE VALIDATION ============== */

function normalizeState(input) {
  const defaults = createInitialState();

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return defaults;
  }

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
  result.level = Math.max(1, Math.floor(Number(result.level) || 1));
  result.xp = Math.max(0, Number(result.xp) || 0);
  result.day = Math.max(1, Math.floor(Number(result.day) || 1));
  result.time = clamp(Number(result.time) || 0, 0, 23.999);

  if (!CAREERS.some((item) => item.name === result.career)) {
    result.career = "Unemployed";
  }

  result.homeIndex = clamp(
    Math.floor(Number(result.homeIndex) || 0), 0, HOMES.length - 1
  );

  const vehicleIndex = Number(result.vehicleIndex);
  result.vehicleIndex = Number.isInteger(vehicleIndex)
    ? clamp(vehicleIndex, -1, VEHICLES.length - 1)
    : -1;

  for (const key of Object.keys(defaults.needs)) {
    result.needs[key] = clamp(Number(result.needs[key]) || 0, 0, 100);
  }

  for (const key of Object.keys(defaults.skills)) {
    result.skills[key] = Math.max(1, Number(result.skills[key]) || 1);
  }

  result.player.x = clamp(Number(result.player.x) || 0, -CONFIG.worldSize, CONFIG.worldSize);
  result.player.z = clamp(Number(result.player.z) || 0, -CONFIG.worldSize, CONFIG.worldSize);

  result.inventory = Array.isArray(result.inventory)
    ? result.inventory.filter((item) => typeof item === "string").slice(0, 100)
    : [];

  result.completedQuests = Array.isArray(result.completedQuests)
    ? result.completedQuests.filter((item) => typeof item === "string")
    : [];

  for (const key of ["skinTone", "hairColor", "outfitColor"]) {
    if (!validColor(result.avatar[key])) {
      result.avatar[key] = defaults.avatar[key];
    }
  }

  if (!["short", "afro", "bald"].includes(result.avatar.hairstyle)) {
    result.avatar.hairstyle = "short";
  }

  if (typeof result.avatar.accessory !== "string") {
    result.avatar.accessory = "none";
  }

  result.stats.jobsCompleted = Math.max(0, Number(result.stats.jobsCompleted) || 0);
  result.stats.gigsCompleted = Math.max(0, Number(result.stats.gigsCompleted) || 0);
  result.stats.itemsPurchased = Math.max(0, Number(result.stats.itemsPurchased) || 0);

  return result;
}

/* ========================= 5. AUTH + CLOUD SAVE ============= */

let supabase = null;
let currentUser = null;
let authReady = false;
let gameStarted = false;
let gameStarting = false;
let authBusy = false;
let loggingOut = false;

let saveLoopPromise = null;
let saveRequested = false;
let lastSaveError = null;

async function initializeSupabase() {
  if (
    !SUPABASE_URL.startsWith("https://") ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY.includes("YOUR_")
  ) {
    throw new Error("Supabase configuration is missing from app.js.");
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

  supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;

    if (
      event === "SIGNED_OUT" &&
      gameStarted &&
      !loggingOut
    ) {
      stopGameplay();
      showLogin("Your session ended. Please sign in again.");
    }
  });

  return true;
}

async function signInWithEmail(email, password) {
  if (!supabase) throw new Error("The online service is not ready.");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  currentUser = data.user || data.session?.user || null;

  if (!currentUser) {
    throw new Error("Sign-in returned no user. Please try again.");
  }
}

async function signUpWithEmail(email, password) {
  if (!supabase) throw new Error("The online service is not ready.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  currentUser = data.session?.user || null;

  return {
    user: data.user || null,
    session: data.session || null
  };
}

/*
 * All writes pass through one queue.
 * If the game changes during a write, another write is scheduled after it.
 * This prevents concurrent upserts from finishing out of order.
 */
async function saveCloudGame(options = {}) {
  if (!supabase || !currentUser) {
    if (options.notify) notify("Sign in before saving online.");
    return false;
  }

  saveRequested = true;

  if (saveLoopPromise) {
    await saveLoopPromise;
    return !lastSaveError;
  }

  saveLoopPromise = (async () => {
    lastSaveError = null;

    try {
      while (saveRequested && currentUser) {
        saveRequested = false;

        const userId = currentUser.id;
        const snapshot = deepCopy(state);

        const { error } = await supabase
          .from("game_saves")
          .upsert({
            user_id: userId,
            save_data: snapshot,
            updated_at: new Date().toISOString()
          }, {
            onConflict: "user_id"
          });

        if (error) throw error;
      }
    } catch (error) {
      lastSaveError = error;
      reportError("Cloud save failed", error);
      saveRequested = false;
    } finally {
      saveLoopPromise = null;
    }
  })();

  await saveLoopPromise;

  if (lastSaveError) {
    if (options.notify) {
      notify("Save failed. Check your connection and game_saves permissions.");
    }
    return false;
  }

  if (options.notify) notify("Progress saved to your account.");
  return true;
}

async function loadCloudGame() {
  if (!supabase || !currentUser) {
    throw new Error("Please sign in before loading your game.");
  }

  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) {
    reportError("Cloud load failed", error);
    throw new Error(
      "Could not load your cloud save. Check the game_saves table and its row-level security policies."
    );
  }

  if (data && data.save_data && typeof data.save_data === "object") {
    state = normalizeState(data.save_data);
    return;
  }

  state = createInitialState();

  const saved = await saveCloudGame();

  if (!saved) {
    throw new Error(
      "Your new game could not be saved online. Check your game_saves table and permissions."
    );
  }
}

async function signOut() {
  if (!supabase) return;

  loggingOut = true;
  stopGameplay();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    currentUser = null;
    showLogin("You have signed out.");
  } catch (error) {
    reportError("Sign-out failed", error);
    showLogin("Sign-out failed. Please try again.");
  } finally {
    loggingOut = false;
  }
}

/* ========================= 6. THREE.JS WORLD =============== */

let scene = null;
let camera = null;
let renderer = null;
let clock = null;

let player = null;
let playerBody = null;
let playerHead = null;
let playerHair = null;

let worldReady = false;
let gamePaused = false;
let sprinting = false;
let jumpingUntil = 0;

let cameraZoom = CONFIG.cameraZoom;
let animationFrame = null;
let lastSave = 0;
let lastHudUpdate = 0;

const keys = new Set();
const buildingMeshes = [];
const npcMeshes = [];

const joystick = { x: 0, y: 0, active: false };

const cameraTarget = new THREE.Vector3();
const cameraOffset = new THREE.Vector3(14, 18, 14);

function makeMaterial(color, roughness = 0.9) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

function makeBox(width, height, depth, color) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    makeMaterial(color)
  );
}

function addGround() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 250),
    makeMaterial(0x59664b)
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  scene.add(ground);

  const roadMaterial = makeMaterial(0x444448);

  const horizontalRoad = new THREE.Mesh(
    new THREE.BoxGeometry(90, 0.08, 9),
    roadMaterial
  );

  scene.add(horizontalRoad);

  const verticalRoad = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.08, 90),
    roadMaterial
  );

  verticalRoad.position.y = 0.01;
  scene.add(verticalRoad);

  for (let i = -40; i <= 40; i += 8) {
    const marking = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.035, 0.18),
      makeMaterial(0xe6d7a2)
    );

    marking.position.set(i, 0.07, 0);
    scene.add(marking);
  }
}

function createBuilding(data) {
  const group = new THREE.Group();

  const building = makeBox(10, 7, 9, data.color);
  building.position.y = 3.5;
  group.add(building);

  const roof = makeBox(10.8, 0.45, 9.8, 0x4c3930);
  roof.position.y = 7.2;
  group.add(roof);

  const door = makeBox(1.5, 2.7, 0.18, 0x4b3020);
  door.position.set(0, 1.35, 4.58);
  group.add(door);

  for (const x of [-3, 3]) {
    const windowMesh = makeBox(1.6, 1.4, 0.2, 0x9bd2df);
    windowMesh.position.set(x, 4.3, 4.58);
    group.add(windowMesh);
  }

  group.position.set(data.x, 0, data.z);
  group.userData = { ...data };

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
    choice([0x315c80, 0x7e4b33, 0x7d3974, 0x476d45, 0xc09a39])
  );

  body.position.y = 1;
  npc.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 12, 10),
    makeMaterial(choice([0x5c3525, 0x8d5524, 0xb98058]))
  );

  head.position.y = 2.1;
  npc.add(head);

  npc.position.set(x, 0, z);

  npc.userData = {
    originX: x,
    originZ: z,
    phase: random(0, Math.PI * 2),
    speed: random(0.2, 0.6)
  };

  scene.add(npc);
  npcMeshes.push(npc);
}

function createPlayer() {
  player = new THREE.Group();

  playerBody = makeBox(
    0.9, 1.4, 0.6,
    state.avatar.outfitColor
  );

  playerBody.position.y = 1;
  player.add(playerBody);

  playerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 12),
    makeMaterial(state.avatar.skinTone)
  );

  playerHead.position.y = 2.1;
  player.add(playerHead);

  playerHair = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.45, 12, 8, 0, Math.PI * 2, 0, 0.9
    ),
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
    playerHair.scale.set(1.3, 1.25, 1.3);
    playerHair.position.y = 2.4;
  } else {
    playerHair.scale.set(1, 1, 1);
    playerHair.position.y = 2.35;
  }
}

function initializeWorld() {
  const host =
    $("#gameCanvas") ||
    $("#game-world") ||
    $("#gameWorld");

  if (!host) {
    throw new Error(
      "The game canvas container was not found. Check index.html for #gameCanvas."
    );
  }

  if (worldReady) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ec6d7);
  scene.fog = new THREE.Fog(0x9ec6d7, 65, 160);

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

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  host.replaceChildren(renderer.domElement);

  Object.assign(renderer.domElement.style, {
    display: "block",
    width: "100%",
    height: "100%",
    touchAction: "none"
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x4e5943, 2));

  const sunlight = new THREE.DirectionalLight(0xffe3b0, 2);
  sunlight.position.set(-25, 45, 25);
  scene.add(sunlight);

  addGround();

  for (const building of BUILDINGS) {
    createBuilding(building);
  }

  let treesCreated = 0;
  let attempts = 0;

  while (treesCreated < 28 && attempts < 100) {
    attempts++;

    const x = random(-42, 42);
    const z = random(-42, 42);

    if (Math.abs(x) < 25 && Math.abs(z) < 23) continue;

    createTree(x, z);
    treesCreated++;
  }

  for (let i = 0; i < 12; i++) {
    createNPC(random(-30, 30), random(-30, 30));
  }

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

  while (object && !object.userData.kind) {
    object = object.parent;
  }

  if (!object?.userData?.kind) return;

  const building = object.userData;
  const distance = Math.hypot(
    player.position.x - building.x,
    player.position.z - building.z
  );

  if (distance > CONFIG.interactionDistance) {
    notify("Move closer to " + building.name + " first.");
    return;
  }

  interactWithBuilding(building);
}

/* ========================= 7. MOVEMENT ====================== */

function updateMovement(dt) {
  if (!player || gamePaused) return;

  let x = 0;
  let z = 0;

  if (keys.has("w") || keys.has("arrowup")) z -= 1;
  if (keys.has("s") || keys.has("arrowdown")) z += 1;
  if (keys.has("a") || keys.has("arrowleft")) x -= 1;
  if (keys.has("d") || keys.has("arrowright")) x += 1;

  x += joystick.x;
  z += joystick.y;

  const length = Math.hypot(x, z);

  if (length > 1) {
    x /= length;
    z /= length;
  }

  const vehicle = VEHICLES[state.vehicleIndex];
  const vehicleBonus = vehicle ? vehicle.speed : 1;
  const speed = CONFIG.moveSpeed *
    (sprinting ? CONFIG.sprintMultiplier : 1) *
    (vehicle ? Math.min(vehicleBonus, 1.5) : 1);

  if (length > 0.05) {
    const worldX = (x - z) / Math.SQRT2;
    const worldZ = (x + z) / Math.SQRT2;

    player.position.x += worldX * speed * dt;
    player.position.z += worldZ * speed * dt;

    player.rotation.y = Math.atan2(worldX, worldZ);

    state.needs.energy = clamp(
      state.needs.energy - dt * (sprinting ? 0.75 : 0.25),
      0, 100
    );
  }

  player.position.x = clamp(
    player.position.x, -CONFIG.worldSize, CONFIG.worldSize
  );

  player.position.z = clamp(
    player.position.z, -CONFIG.worldSize, CONFIG.worldSize
  );

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
  cameraZoom = clamp(cameraZoom + amount, 8, 28);
  resizeRenderer();
}

function updateWorld(dt) {
  for (const npc of npcMeshes) {
    npc.userData.phase += dt * npc.userData.speed;

    npc.position.x =
      npc.userData.originX + Math.sin(npc.userData.phase) * 1.5;

    npc.position.z =
      npc.userData.originZ + Math.cos(npc.userData.phase * 0.7) * 1.5;
  }

  if (player) {
    player.position.y = performance.now() < jumpingUntil
      ? 0.65
      : 0;
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

/* ========================= 8. NEEDS AND GAME TIME =========== */

function updateGameTime(dt) {
  state.time += dt * 24 / CONFIG.dayLength;

  while (state.time >= 24) {
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
  const career = CAREERS.find((item) => item.name === state.career);

  if (home.rent > 0) {
    state.money = Math.max(0, state.money - home.rent);
    notify("Daily housing expense: " + money(home.rent));
  }

  if (career?.salary > 0) {
    state.money += career.salary;
    notify("Daily work income: " + money(career.salary));
    addXP(20);
  }

  saveCloudGame();
}

function addXP(amount) {
  state.xp += Math.max(0, Number(amount) || 0);

  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level += 1;
    state.money += 1500;

    notify("Level " + state.level + " reached! Bonus: ₦1,500");
  }

  checkQuest();
}

function restoreNeed(name, amount) {
  if (!(name in state.needs)) return;
  state.needs[name] = clamp(state.needs[name] + amount, 0, 100);
}

function checkQuest() {
  if (
    state.activeQuest === "Earn your first ₦5,000" &&
    state.money >= 30000
  ) {
    state.completedQuests.push(state.activeQuest);
    state.activeQuest = "Complete your first gig";
    state.money += 2000;
    notify("Quest complete! Bonus: ₦2,000");
  }

  if (
    state.activeQuest === "Complete your first gig" &&
    state.stats.gigsCompleted > 0
  ) {
    state.completedQuests.push(state.activeQuest);
    state.activeQuest = "Explore the city";
    state.money += 3000;
    notify("Quest complete! Bonus: ₦3,000");
  }

  if (
    state.activeQuest === "Explore the city" &&
    Math.hypot(state.player.x, state.player.z) >= 25
  ) {
    state.completedQuests.push(state.activeQuest);
    state.activeQuest = "Build your future";
    state.money += 2500;
    notify("Exploration quest completed! Bonus: ₦2,500");
  }
}

/* ========================= 9. JOBS AND GIGS ================== */

function selectCareer(career) {
  state.career = career.name;
  state.stats.jobsCompleted += 1;

  notify(
    career.salary > 0
      ? career.name + " selected. Daily pay: " + money(career.salary)
      : "You are now unemployed."
  );

  addXP(25);
  saveCloudGame();
  refreshGameUI();
}

function doGig(gig = choice(GIGS)) {
  if (state.needs.energy < gig.energy) {
    notify("Not enough energy. Rest before taking another gig.");
    return;
  }

  state.needs.energy = clamp(state.needs.energy - gig.energy, 0, 100);
  state.money += gig.reward;
  state.stats.gigsCompleted += 1;

  const skill = gig.skill || choice(Object.keys(state.skills));
  state.skills[skill] = (state.skills[skill] || 1) + 1;

  addXP(30);

  notify(
    "Gig completed: " + gig.name + ". Earned " + money(gig.reward)
  );

  checkQuest();
  saveCloudGame();
  refreshGameUI();
}

/* ========================= 10. ITEMS AND ACTIVITIES ========== */

function buyItem(item) {
  if (state.money < item.price) {
    notify("You don't have enough money.");
    return false;
  }

  state.money -= item.price;
  state.inventory.push(item.name);
  state.stats.itemsPurchased += 1;

  notify("Purchased " + item.name);

  saveCloudGame();
  refreshGameUI();

  return true;
}

function useItem(itemName) {
  const index = state.inventory.indexOf(itemName);

  if (index === -1) {
    notify("That item isn't in your inventory.");
    return;
  }

  const item = ITEMS.find((entry) => entry.name === itemName);

  if (!item) {
    notify("This item has no configured effect.");
    return;
  }

  state.inventory.splice(index, 1);

  for (const need of ["hunger", "energy", "hygiene", "fun", "social", "bladder"]) {
    const effect = Number(item[need]) || 0;
    if (effect > 0) restoreNeed(need, effect);
  }

  notify("Used " + item.name);
  saveCloudGame();
  refreshGameUI();
}

function rest() {
  restoreNeed("energy", 40);
  restoreNeed("fun", 10);

  advanceTime(2);

  notify("You rested and recovered energy.");
  saveCloudGame();
  refreshGameUI();
}

function shower() {
  if (state.money < 300) {
    notify("You need ₦300 for shower supplies.");
    return;
  }

  state.money -= 300;
  restoreNeed("hygiene", 55);

  notify("You freshened up. Cost: ₦300");
  saveCloudGame();
  refreshGameUI();
}

function useToilet() {
  restoreNeed("bladder", 80);
  notify("You used the restroom.");
  saveCloudGame();
  refreshGameUI();
}

function socialize() {
  restoreNeed("social", 15);
  restoreNeed("fun", 5);
  notify("You spent time socializing.");
  saveCloudGame();
  refreshGameUI();
}

function advanceTime(hours) {
  state.time += hours;

  while (state.time >= 24) {
    state.time -= 24;
    state.day += 1;
    payDailyExpenses();
  }
}

/* ========================= 11. HOUSING AND VEHICLES ========== */

function purchaseHome(index) {
  const home = HOMES[index];

  if (!home) return;

  if (index <= state.homeIndex) {
    notify("You already have this home or a better one.");
    return;
  }

  if (state.money < home.price) {
    notify("You don't have enough money for this home.");
    return;
  }

  state.money -= home.price;
  state.homeIndex = index;

  notify("You moved into " + home.name + ".");
  addXP(50);
  saveCloudGame();
  refreshGameUI();
}

function purchaseVehicle(index) {
  const vehicle = VEHICLES[index];

  if (!vehicle) return;

  if (state.vehicleIndex === index) {
    notify("You already own this vehicle.");
    return;
  }

  if (state.money < vehicle.price) {
    notify("You don't have enough money.");
    return;
  }

  state.money -= vehicle.price;
  state.vehicleIndex = index;

  notify("Purchased: " + vehicle.name);
  saveCloudGame();
  refreshGameUI();
}

function useVehicle() {
  if (state.vehicleIndex < 0) {
    notify("You don't own a vehicle yet.");
    return;
  }

  const vehicle = VEHICLES[state.vehicleIndex];

  notify(
    vehicle.name + " selected. Movement speed is increased; full vehicle driving is not yet implemented."
  );
}

/* ========================= 12. BUILDING INTERACTIONS ========= */

function interactWithBuilding(building) {
  if (!building) return;

  switch (building.kind) {
    case "shop":
      openShop();
      break;

    case "food":
      openFoodMenu();
      break;

    case "clinic":
      restoreNeed("energy", 10);
      restoreNeed("hygiene", 5);
      notify("You took a short break at the clinic.");
      saveCloudGame();
      refreshGameUI();
      break;

    case "job":
      openCareerMenu();
      break;

    case "home":
      openHousingMenu();
      break;

    case "garage":
      openVehicleMenu();
      break;

    default:
      notify("Nothing to do here yet.");
  }
}

/* ========================= 13. IN-GAME SHEETS =============== */

let activeSheet = null;

function closeGameSheet() {
  if (activeSheet) {
    activeSheet.remove();
    activeSheet = null;
  }

  if (gameStarted) gamePaused = false;
}

function createGameSheet(title, subtitle = "") {
  closeGameSheet();
  gamePaused = true;

  const overlay = document.createElement("div");
  overlay.id = "nhGameSheet";

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
    background: "rgba(0,0,0,0.72)",
    zIndex: "15000",
    font: "14px system-ui,sans-serif"
  });

  const panel = document.createElement("section");

  Object.assign(panel.style, {
    width: "min(440px, 100%)",
    maxHeight: "min(82vh, 720px)",
    overflowY: "auto",
    background: "#171717",
    color: "#f5f0e5",
    border: "1px solid #9e7a2d",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 20px 70px #0009"
  });

  const header = document.createElement("div");

  Object.assign(header.style, {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "16px"
  });

  const headingGroup = document.createElement("div");

  const heading = document.createElement("h2");
  heading.textContent = title;

  Object.assign(heading.style, {
    margin: "0",
    color: "#f4c95d",
    fontSize: "21px"
  });

  headingGroup.appendChild(heading);

  if (subtitle) {
    const description = document.createElement("p");
    description.textContent = subtitle;

    Object.assign(description.style, {
      margin: "6px 0 0",
      color: "#bdb8ad",
      lineHeight: "1.5"
    });

    headingGroup.appendChild(description);
  }

  const closeButton = makeButton("✕", closeGameSheet);
  closeButton.setAttribute("aria-label", "Close menu");

  header.append(headingGroup, closeButton);

  const content = document.createElement("div");

  Object.assign(content.style, {
    display: "grid",
    gap: "10px"
  });

  panel.append(header, content);
  overlay.appendChild(panel);

  overlay.addEventListener("pointerdown", (event) => {
    if (event.target === overlay) closeGameSheet();
  });

  document.body.appendChild(overlay);
  activeSheet = overlay;

  return content;
}

function addSheetRow(content, title, description, actionLabel, action) {
  const row = document.createElement("div");

  Object.assign(row.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px",
    background: "#222",
    border: "1px solid #39342a",
    borderRadius: "12px"
  });

  const text = document.createElement("div");
  text.style.flex = "1";

  const name = document.createElement("strong");
  name.textContent = title;
  name.style.display = "block";

  const detail = document.createElement("div");
  detail.textContent = description;
  detail.style.cssText = "color:#bdb8ad;font-size:12px;margin-top:5px;line-height:1.5";

  text.append(name, detail);

  const button = makeButton(actionLabel, action, { primary: true });
  button.style.flexShrink = "0";

  row.append(text, button);
  content.appendChild(row);

  return row;
}

function addSheetNotice(content, text) {
  const notice = document.createElement("p");
  notice.textContent = text;

  Object.assign(notice.style, {
    color: "#bdb8ad",
    lineHeight: "1.6",
    margin: "4px 0"
  });

  content.appendChild(notice);
}

function addSheetColorInput(content, labelText, value, onChange) {
  const row = document.createElement("label");

  Object.assign(row.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px",
    background: "#222",
    borderRadius: "10px"
  });

  const label = document.createElement("span");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = "color";
  input.value = validColor(value) ? value : "#ffffff";
  input.setAttribute("aria-label", labelText);

  input.addEventListener("input", () => onChange(input.value));

  row.append(label, input);
  content.appendChild(row);
}

/* ========================= 14. CAREER + GIG MENUS =========== */

function openCareerMenu() {
  const content = createGameSheet(
    "Career Centre",
    "Choose work that matches your ambitions. Salaries are paid per in-game day."
  );

  for (const career of CAREERS) {
    const current = career.name === state.career;

    addSheetRow(
      content,
      career.name,
      career.salary
        ? money(career.salary) + " per game day"
        : "No salary",
      current ? "Selected" : "Choose",
      () => {
        if (current) {
          notify("This is already your career.");
          return;
        }

        selectCareer(career);
        closeGameSheet();
      }
    );
  }
}

function openGigMenu() {
  const content = createGameSheet(
    "Available Gigs",
    "Complete jobs to earn cash, experience, and skills."
  );

  for (const gig of GIGS) {
    addSheetRow(
      content,
      gig.name,
      "Reward: " + money(gig.reward) +
        " • Energy needed: " + gig.energy,
      "Work",
      () => {
        doGig(gig);
        closeGameSheet();
      }
    );
  }
}

/* ========================= 15. SHOP + FOOD ================== */

function openShop() {
  const content = createGameSheet(
    "Naija Market",
    "Buy supplies and keep your needs under control."
  );

  addSheetNotice(content, "Your cash: " + money(state.money));

  for (const item of ITEMS) {
    const effects = [];

    for (const need of ["hunger", "energy", "hygiene", "fun", "social"]) {
      if (Number(item[need]) > 0) {
        effects.push("+" + item[need] + " " + need);
      }
    }

    addSheetRow(
      content,
      item.name,
      money(item.price) + (effects.length ? " • " + effects.join(", ") : ""),
      "Buy",
      () => {
        if (buyItem(item)) openShop();
      }
    );
  }
}

function openFoodMenu() {
  const content = createGameSheet(
    "Food Spot",
    "Buy a meal and eat it immediately."
  );

  const food = ITEMS.filter((item) => Number(item.hunger) > 0);

  for (const item of food) {
    addSheetRow(
      content,
      item.name,
      money(item.price) + " • Restores " + item.hunger + " hunger",
      "Eat",
      () => {
        if (buyItem(item)) {
          useItem(item.name);
          closeGameSheet();
        }
      }
    );
  }
}

/* ========================= 16. HOUSING + VEHICLES =========== */

function openHousingMenu() {
  const content = createGameSheet(
    "Housing",
    "A better home costs more upfront and may have daily rent."
  );

  for (let i = 0; i < HOMES.length; i++) {
    const home = HOMES[i];
    const owned = i === state.homeIndex;
    const unavailable = i < state.homeIndex;

    addSheetRow(
      content,
      home.name,
      "Price: " + money(home.price) +
        " • Daily rent: " + money(home.rent),
      owned ? "Current" : unavailable ? "Owned before" : "Move in",
      () => {
        if (owned || unavailable) {
          notify(owned ? "This is your current home." : "You already have a better home.");
          return;
        }

        purchaseHome(i);
        openHousingMenu();
      }
    );
  }
}

function openVehicleMenu() {
  const content = createGameSheet(
    "Garage",
    "Vehicles increase your movement speed. Full driving mechanics are not implemented yet."
  );

  for (let i = 0; i < VEHICLES.length; i++) {
    const vehicle = VEHICLES[i];
    const owned = state.vehicleIndex === i;

    addSheetRow(
      content,
      vehicle.name,
      "Price: " + money(vehicle.price) +
        " • Speed multiplier: " + vehicle.speed + "×",
      owned ? "Owned" : "Buy",
      () => {
        if (owned) {
          useVehicle();
          return;
        }

        purchaseVehicle(i);
        openVehicleMenu();
      }
    );
  }
}

/* ========================= 17. AVATAR CUSTOMIZATION ========= */

function customizeAvatar() {
  const content = createGameSheet(
    "Character Studio",
    "Customize your character. Changes are saved to your cloud account."
  );

  addSheetColorInput(
    content,
    "Skin tone",
    state.avatar.skinTone,
    (value) => {
      state.avatar.skinTone = value;
      applyAvatar();
      refreshGameUI();
      saveCloudGame();
    }
  );

  addSheetColorInput(
    content,
    "Hair colour",
    state.avatar.hairColor,
    (value) => {
      state.avatar.hairColor = value;
      applyAvatar();
      saveCloudGame();
    }
  );

  addSheetColorInput(
    content,
    "Outfit colour",
    state.avatar.outfitColor,
    (value) => {
      state.avatar.outfitColor = value;
      applyAvatar();
      saveCloudGame();
    }
  );

  const styleLabel = document.createElement("label");
  styleLabel.textContent = "Hairstyle";
  styleLabel.style.cssText = "display:grid;gap:8px";

  const styleSelect = document.createElement("select");

  for (const style of ["short", "afro", "bald"]) {
    const option = document.createElement("option");
    option.value = style;
    option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
    styleSelect.appendChild(option);
  }

  styleSelect.value = state.avatar.hairstyle;

  Object.assign(styleSelect.style, {
    padding: "11px",
    borderRadius: "9px",
    background: "#222",
    color: "#fff",
    border: "1px solid #705821"
  });

  styleSelect.addEventListener("change", () => {
    state.avatar.hairstyle = styleSelect.value;
    applyAvatar();
    saveCloudGame();
  });

  styleLabel.appendChild(styleSelect);
  content.appendChild(styleLabel);

  addSheetNotice(
    content,
    "Note: additional hairstyles and accessories can be added in a later graphics update."
  );

  content.appendChild(makeButton("Done", closeGameSheet, { primary: true }));
}

/* ========================= 18. INVENTORY ==================== */

function showInventory() {
  const content = createGameSheet(
    "Inventory",
    "Items you own. Select an item to use it."
  );

  if (!state.inventory.length) {
    addSheetNotice(content, "Your inventory is empty. Visit the market to buy supplies.");
    return;
  }

  for (const itemName of [...state.inventory]) {
    const item = ITEMS.find((entry) => entry.name === itemName);

    addSheetRow(
      content,
      itemName,
      item
        ? "Use this item to restore needs."
        : "No effect is configured for this item.",
      "Use",
      () => {
        useItem(itemName);
        closeGameSheet();
      }
    );
  }
}

/* ========================= 19. MINIMAP + HUD ================= */

function drawMinimap() {
  const canvas = $("#minimap");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#18221b";
  context.fillRect(0, 0, width, height);

  const scale = Math.min(width, height) / 100;

  context.strokeStyle = "#545454";
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(width / 2, 0);
  context.lineTo(width / 2, height);
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  context.stroke();

  for (const building of BUILDINGS) {
    context.fillStyle = "#d0a94f";
    context.fillRect(
      width / 2 + building.x * scale - 3,
      height / 2 + building.z * scale - 3,
      6,
      6
    );
  }

  context.fillStyle = "#66d9ef";
  context.beginPath();
  context.arc(
    width / 2 + state.player.x * scale,
    height / 2 + state.player.z * scale,
    4,
    0,
    Math.PI * 2
  );
  context.fill();
}

function updateNeedBar(name, value) {
  const selectors = [
    "#" + name + "Bar",
    `[data-need="${name}"]`,
    `[data-stat="${name}"]`
  ];

  for (const selector of selectors) {
    const element = $(selector);
    if (!element) continue;

    if ("value" in element && element.tagName === "PROGRESS") {
      element.value = value;
    } else {
      element.style.width = value + "%";
      element.setAttribute("aria-valuenow", String(value));
    }
  }

  const aliases = {
    hunger: ["#hungerValue", "#needHungerV"],
    energy: ["#energyValue", "#needEnergyV"],
    hygiene: ["#hygieneValue", "#needHygieneV"],
    fun: ["#funValue", "#needFunV"],
    social: ["#socialValue", "#needSocialV"],
    bladder: ["#bladderValue", "#needBladderV"]
  };

  for (const selector of aliases[name] || []) {
    setText(selector, Math.round(value) + "%");
  }
}

function formatClock() {
  const hours = Math.floor(state.time) % 24;
  const minutes = Math.floor((state.time % 1) * 60);

  return String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0");
}

function refreshGameUI() {
  setText("#money", money(state.money));
  setText("#moneyDisplay", money(state.money));
  setText("#cashDisplay", money(state.money));
  setText("#level", String(state.level));
  setText("#levelBadge", "Lv " + state.level);
  setText("#xp", String(state.xp));
  setText("#xpText", state.xp + " XP");
  setText("#day", String(state.day));
  setText("#career", state.career);
  setText("#activeQuest", state.activeQuest);
  setText("#questText", state.activeQuest);
  setText("#objectiveText", state.activeQuest);
  setText("#homeName", HOMES[state.homeIndex]?.name || "Unknown");
  setText(
    "#vehicleName",
    state.vehicleIndex >= 0
      ? VEHICLES[state.vehicleIndex]?.name || "None"
      : "None"
  );

  setText("#name", currentUser?.email || "Player");
  setText("#sub", state.career);
  setText("#clock", formatClock());
  setText("#gameClock", formatClock());

  for (const [name, value] of Object.entries(state.needs)) {
    updateNeedBar(name, value);
  }

  const xpFill = $("#xpFill");

  if (xpFill) {
    xpFill.style.width =
      clamp(state.xp / (state.level * 100) * 100, 0, 100) + "%";
  }

  const inventory = $("#inventoryList");

  if (inventory) {
    inventory.replaceChildren();

    if (!state.inventory.length) {
      inventory.textContent = "Your inventory is empty.";
    } else {
      for (const item of state.inventory) {
        const row = document.createElement("div");
        const label = document.createElement("span");
        label.textContent = item;

        row.style.cssText =
          "display:flex;justify-content:space-between;gap:10px;margin:6px 0";

        row.append(label, makeButton("Use", () => useItem(item)));
        inventory.appendChild(row);
      }
    }
  }

  drawMinimap();
}

/* ========================= 20. ACTION MENU =================== */

function createBasicUI() {
  if ($("#nhBasicMenu")) return;

  const panel = document.createElement("div");
  panel.id = "nhBasicMenu";

  Object.assign(panel.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    width: "min(250px, 65vw)",
    maxHeight: "55vh",
    overflowY: "auto",
    background: "rgba(18,18,18,0.94)",
    color: "#fff",
    border: "1px solid #8b6c29",
    borderRadius: "14px",
    padding: "10px",
    zIndex: "1000",
    font: "13px system-ui,sans-serif"
  });

  const heading = document.createElement("h3");
  heading.textContent = "NAIJA HUSTLE";

  Object.assign(heading.style, {
    color: "#f4c95d",
    margin: "4px 0 10px"
  });

  const controls = document.createElement("div");

  Object.assign(controls.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px"
  });

  const actions = [
    ["Gig", openGigMenu],
    ["Career", openCareerMenu],
    ["Shop", openShop],
    ["Eat", openFoodMenu],
    ["Rest", rest],
    ["Shower", shower],
    ["Toilet", useToilet],
    ["Socialize", socialize],
    ["Housing", openHousingMenu],
    ["Vehicles", openVehicleMenu],
    ["Avatar", customizeAvatar],
    ["Inventory", showInventory],
    ["Save Online", () => saveCloudGame({ notify: true })],
    ["Sign Out", signOut]
  ];

  for (const [label, action] of actions) {
    controls.appendChild(makeButton(label, action));
  }

  const help = document.createElement("p");
  help.textContent =
    "Move: WASD / arrows • Sprint: Shift • Interact: E • Zoom: + / − • Inventory: I";

  help.style.cssText = "line-height:1.5;color:#c9c5bb;margin-bottom:0";

  panel.append(heading, controls, help);
  document.body.appendChild(panel);
}

/* ========================= 21. INPUTS + JOYSTICK ============= */

function getNearestBuilding() {
  if (!player) return null;

  let nearest = null;

  for (const building of BUILDINGS) {
    const distance = Math.hypot(
      player.position.x - building.x,
      player.position.z - building.z
    );

    if (!nearest || distance < nearest.distance) {
      nearest = { building, distance };
    }
  }

  return nearest;
}

function onKeyDown(event) {
  if (!gameStarted) return;

  const key = event.key.toLowerCase();

  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
      .includes(key)
  ) {
    event.preventDefault();
  }

  if (activeSheet && key !== "escape") return;

  keys.add(key);

  if (key === "shift") sprinting = true;
  if (key === "+" || key === "=") zoomCamera(-1);
  if (key === "-") zoomCamera(1);

  if (key === "e") {
    const nearest = getNearestBuilding();

    if (nearest && nearest.distance <= CONFIG.interactionDistance) {
      interactWithBuilding(nearest.building);
    } else {
      notify("Move closer to a building to interact.");
    }
  }

  if (key === "i") showInventory();
  if (key === "c") customizeAvatar();

  if (key === " ") {
    jumpingUntil = performance.now() + 250;
  }

  if (key === "escape") {
    if (activeSheet) {
      closeGameSheet();
    } else {
      gamePaused = !gamePaused;
      notify(gamePaused ? "Game paused." : "Game resumed.");
    }
  }
}

function onKeyUp(event) {
  const key = event.key.toLowerCase();
  keys.delete(key);

  if (key === "shift") sprinting = false;
}

function bindJoystick() {
  const base =
    $("#joystickBase") ||
    $("#joystick-base") ||
    $("#joystick");

  const knob =
    $("#joystickKnob") ||
    $("#joystick-knob") ||
    $("#stick");

  if (!base || base.dataset.nhBound === "true") return;

  base.dataset.nhBound = "true";

  let pointerId = null;

  function update(event) {
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDistance = Math.max(1, rect.width * 0.32);

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const factor = distance > maxDistance ? maxDistance / distance : 1;

    joystick.x = dx * factor / maxDistance;
    joystick.y = dy * factor / maxDistance;
    joystick.active = true;

    if (knob) {
      knob.style.transform =
        "translate(" + joystick.x * maxDistance + "px," +
        joystick.y * maxDistance + "px)";
    }
  }

  base.addEventListener("pointerdown", (event) => {
    pointerId = event.pointerId;

    try {
      base.setPointerCapture(pointerId);
    } catch {}

    update(event);
  });

  base.addEventListener("pointermove", (event) => {
    if (event.pointerId === pointerId) update(event);
  });

  function stop(event) {
    if (event && event.pointerId !== pointerId) return;

    pointerId = null;
    joystick.x = 0;
    joystick.y = 0;
    joystick.active = false;

    if (knob) knob.style.transform = "translate(0,0)";
  }

  base.addEventListener("pointerup", stop);
  base.addEventListener("pointercancel", stop);
  base.addEventListener("lostpointercapture", () => stop());
}

function bindExistingButtons() {
  const bindings = {
    "#gigBtn": openGigMenu,
    "#jobBtn": openCareerMenu,
    "#shopBtn": openShop,
    "#restBtn": rest,
    "#showerBtn": shower,
    "#homeBtn": openHousingMenu,
    "#vehicleBtn": openVehicleMenu,
    "#avatarBtn": customizeAvatar,
    "#inventoryBtn": showInventory,
    "#saveBtn": () => saveCloudGame({ notify: true }),
    "#zoomIn": () => zoomCamera(-1),
    "#zoomOut": () => zoomCamera(1),
    "#socialBtn": socialize,
    "#emoteBtn": () => notify("Your character waves!"),
    "#runBtn": () => {
      sprinting = !sprinting;
      notify(sprinting ? "Running enabled." : "Running disabled.");
    },
    "#jumpBtn": () => {
      jumpingUntil = performance.now() + 250;
    }
  };

  for (const [selector, action] of Object.entries(bindings)) {
    const element = $(selector);

    if (element && element.dataset.nhBound !== "true") {
      element.addEventListener("click", action);
      element.dataset.nhBound = "true";
    }
  }
}

/* ========================= 22. SCREEN MANAGEMENT ============ */

function showLogin(message = "") {
  showElement("#loginScreen", true);
  showElement("#hud", false);
  showElement("#loadingScreen", false);

  const messageElement = $("#loginMessage");

  if (messageElement && message) {
    messageElement.textContent = message;
  }
}

function showGame() {
  showElement("#loginScreen", false);
  showElement("#hud", true);
  showElement("#loadingScreen", false);
}

/* ========================= 23. CLEANUP ====================== */

function disposeObjectResources(root) {
  if (!root) return;

  root.traverse((object) => {
    if (object.geometry) object.geometry.dispose();

    if (object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      for (const material of materials) {
        material.dispose();
      }
    }
  });
}

function stopGameplay() {
  gameStarted = false;
  gameStarting = false;
  gamePaused = true;

  keys.clear();
  sprinting = false;
  jumpingUntil = 0;

  joystick.x = 0;
  joystick.y = 0;
  joystick.active = false;

  closeGameSheet();

  $("#nhBasicMenu")?.remove();

  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  window.removeEventListener("resize", resizeRenderer);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);

  if (scene) disposeObjectResources(scene);

  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }

  scene = null;
  camera = null;
  renderer = null;
  clock = null;

  player = null;
  playerBody = null;
  playerHead = null;
  playerHair = null;

  buildingMeshes.length = 0;
  npcMeshes.length = 0;

  worldReady = false;
  lastSave = 0;
  lastHudUpdate = 0;
}

/* ========================= 24. AUTHENTICATED STARTUP ========== */

async function startAuthenticatedGame() {
  if (!currentUser) {
    showLogin("Please sign in before playing.");
    return;
  }

  if (gameStarted || gameStarting) return;

  gameStarting = true;
  gamePaused = false;
  showElement("#loadingScreen", true);

  try {
    await loadCloudGame();

    showGame();
    initializeWorld();

    if (!worldReady) {
      throw new Error("The 3D city could not be initialized.");
    }

    bindJoystick();
    bindExistingButtons();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    createBasicUI();

    gameStarted = true;
    gamePaused = false;
    gameStarting = false;

    if (player) {
      player.position.set(state.player.x, 0, state.player.z);
    }

    applyAvatar();
    refreshGameUI();

    notify("Welcome to Naija Hustle!");
    console.info("Naija Hustle " + CONFIG.version + " started.");
  } catch (error) {
    reportError("Game startup failed", error);

    stopGameplay();

    showLogin(
      error instanceof Error
        ? error.message
        : "The game could not load. Check your connection and try again."
    );
  } finally {
    gameStarting = false;

    if (!gameStarted) {
      showElement("#loadingScreen", false);
    }
  }
}

/* ========================= 25. LOGIN + SIGNUP ================ */

async function handleLogin() {
  if (authBusy) return;

  if (!authReady) {
    showLogin("The online service is still connecting. Please wait.");
    return;
  }

  const email = $("#loginEmail")?.value.trim();
  const password = $("#loginPassword")?.value;

  if (!email || !password) {
    showLogin("Enter your email and password.");
    return;
  }

  authBusy = true;

  try {
    showLogin("Signing in...");
    await signInWithEmail(email, password);
    await startAuthenticatedGame();
  } catch (error) {
    reportError("Login failed", error);

    showLogin(
      error instanceof Error
        ? error.message
        : "Login failed. Check your details and try again."
    );
  } finally {
    authBusy = false;
  }
}

async function handleSignup() {
  if (authBusy) return;

  if (!authReady) {
    showLogin("The online service is still connecting. Please wait.");
    return;
  }

  const email = $("#loginEmail")?.value.trim();
  const password = $("#loginPassword")?.value;

  if (!email || !password) {
    showLogin("Enter your email and password.");
    return;
  }

  if (password.length < CONFIG.minimumPasswordLength) {
    showLogin("Your password must contain at least 6 characters.");
    return;
  }

  authBusy = true;

  try {
    showLogin("Creating your account...");

    const result = await signUpWithEmail(email, password);

    if (!result.session) {
      showLogin(
        "Account created. Check your email to verify it, then sign in."
      );
      return;
    }

    await startAuthenticatedGame();
  } catch (error) {
    reportError("Signup failed", error);

    showLogin(
      error instanceof Error
        ? error.message
        : "Account creation failed. Please try again."
    );
  } finally {
    authBusy = false;
  }
}

function bindAuthenticationEvents() {
  if (window.datasetNaijaAuthBound === true) return;
  window.datasetNaijaAuthBound = true;

  window.addEventListener("naijahustle:login", (event) => {
    event.preventDefault();
    handleLogin();
  });

  window.addEventListener("naijahustle:signup", (event) => {
    event.preventDefault();
    handleSignup();
  });

  const form = $("#loginForm");

  if (form && form.dataset.nhBound !== "true") {
    form.dataset.nhBound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleLogin();
    });
  }

  const guestButton = $("#guestBtn");

  if (guestButton) {
    guestButton.disabled = true;
    guestButton.hidden = true;
  }
}

/* ========================= 26. APP START ===================== */

async function start() {
  showLogin("Connecting to Naija Hustle...");
  bindAuthenticationEvents();

  try {
    await initializeSupabase();

    if (currentUser) {
      await startAuthenticatedGame();
    } else {
      showLogin("Sign in or create an account to play online.");
    }
  } catch (error) {
    reportError("Online startup failed", error);

    showLogin(
      "Could not connect to the online service. Check your internet connection and Supabase configuration, then refresh."
    );
  }
}

window.addEventListener("beforeunload", () => {
  if (currentUser && gameStarted && !saveLoopPromise) {
    // Best effort only; browsers may stop asynchronous requests on exit.
    void saveCloudGame();
  }
});

start().catch((error) => {
  reportError("Fatal startup error", error);
  showLogin("Naija Hustle could not start. Please refresh the page.");
});
