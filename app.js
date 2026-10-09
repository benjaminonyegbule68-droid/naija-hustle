// ============================================================
// NAIJA HUSTLE — MODULAR APP.JS REPLACEMENT
// Version: 2.0.0
// Requires a browser environment and Three.js.
// Optional cloud support: Supabase JS v2.
// ============================================================

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// ------------------------------------------------------------
// 1. UTILITIES
// ------------------------------------------------------------

const $ = (selector) => document.querySelector(selector);

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const random = (min, max) =>
  min + Math.random() * (max - min);

const choice = (items) =>
  items[Math.floor(Math.random() * items.length)];

const money = (amount) =>
  "₦" + Math.floor(amount).toLocaleString("en-NG");

const safeText = (value) =>
  String(value ?? "").replace(/[<>]/g, "");

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function notify(message) {
  let element = $("#gameToast");

  if (!element) {
    element = document.createElement("div");
    element.id = "gameToast";
    document.body.appendChild(element);

    Object.assign(element.style, {
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

  element.textContent = message;
  element.style.display = "block";

  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => {
    element.style.display = "none";
  }, 2600);
}

function makeButton(label, action) {
  const button = document.createElement("button");
  button.textContent = label;

  Object.assign(button.style, {
    background: "#191919",
    color: "#f4c95d",
    border: "1px solid #705821",
    padding: "10px 14px",
    borderRadius: "9px",
    cursor: "pointer",
    font: "inherit"
  });

  button.addEventListener("click", action);
  return button;
}

// ------------------------------------------------------------
// 2. GAME DATA
// ------------------------------------------------------------

const CONFIG = {
  version: "2.0.0",
  worldSize: 100,
  moveSpeed: 7,
  sprintMultiplier: 1.55,
  cameraZoom: 16,
  dayLength: 300,
  saveInterval: 15000
};

const CAREERS = [
  { name: "Unemployed", salary: 0 },
  { name: "Shop Assistant", salary: 18000 },
  { name: "Delivery Rider", salary: 25000 },
  { name: "Graphic Designer", salary: 40000 },
  { name: "Web Developer", salary: 65000 },
  { name: "Business Owner", salary: 85000 }
];

const GIGS = [
  { name: "Deliver a package", reward: 3500, energy: 8 },
  { name: "Design a flyer", reward: 5000, energy: 10 },
  { name: "Help at a shop", reward: 2500, energy: 6 },
  { name: "Build a landing page", reward: 9000, energy: 15 }
];

const ITEMS = [
  { name: "Jollof Rice", price: 1500, type: "food", hunger: 35 },
  { name: "Bottle of Water", price: 300, type: "drink", hunger: 5 },
  { name: "Shower Supplies", price: 800, type: "hygiene", hygiene: 35 },
  { name: "Energy Drink", price: 700, type: "drink", energy: 20 }
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
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

let state = createInitialState();

// ------------------------------------------------------------
// 3. STATE VALIDATION AND SAVING
// ------------------------------------------------------------

const SAVE_KEY = "naijaHustleSave_v2";

function normalizeState(input) {
  const defaults = createInitialState();

  if (!input || typeof input !== "object") return defaults;

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
  result.time = clamp(Number(result.time) || 8, 0, 24);

  for (const key of Object.keys(result.needs)) {
    result.needs[key] = clamp(
      Number(result.needs[key]) || 0, 0, 100
    );
  }

  result.player.x = clamp(
    Number(result.player.x) || 0,
    -CONFIG.worldSize,
    CONFIG.worldSize
  );

  result.player.z = clamp(
    Number(result.player.z) || 0,
    -CONFIG.worldSize,
    CONFIG.worldSize
  );

  if (!Array.isArray(result.inventory)) result.inventory = [];
  if (!Array.isArray(result.completedQuests)) {
    result.completedQuests = [];
  }

  return result;
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Local save failed:", error);
    notify("Could not save game on this device.");
    return false;
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);

    if (saved) {
      state = normalizeState(JSON.parse(saved));
      return true;
    }
  } catch (error) {
    console.error("Save data could not be loaded:", error);
  }

  state = createInitialState();
  return false;
}

function resetGame() {
  if (!confirm("Start a new game? This replaces your local save.")) {
    return;
  }

  state = createInitialState();
  saveGame();
  refreshGameUI();
  notify("New game started.");
}

// ------------------------------------------------------------
// 4. OPTIONAL SUPABASE CONNECTION
// ------------------------------------------------------------

let supabase = null;
let currentUser = null;

async function initializeSupabase() {
  if (
    SUPABASE_URL.includes("YOUR_PROJECT") ||
    SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
  ) {
    console.info("Cloud saving disabled: configure Supabase credentials.");
    return;
  }

  try {
    const module = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    supabase = module.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    currentUser = data.session?.user || null;

    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
    });
  } catch (error) {
    console.error("Supabase initialization failed:", error);
    notify("Cloud connection unavailable. Local play is still available.");
  }
}

async function signInWithEmail(email, password) {
  if (!supabase) {
    notify("Cloud login is not configured.");
    return false;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    notify(error.message);
    return false;
  }

  currentUser = data.user;
  notify("Signed in.");
  return true;
}

async function signUpWithEmail(email, password) {
  if (!supabase) {
    notify("Cloud login is not configured.");
    return false;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    notify(error.message);
    return false;
  }

  currentUser = data.user;
  notify("Account created. Check your email if verification is required.");
  return true;
}

async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut();

    if (error) {
      notify(error.message);
      return;
    }
  }

  currentUser = null;
  notify("Signed out.");
}

async function saveCloudGame() {
  if (!supabase || !currentUser) {
    notify("Sign in to enable cloud saving.");
    return false;
  }

  // This requires a table you own, with:
  // user_id UUID PRIMARY KEY REFERENCES auth.users(id)
  // save_data JSONB, updated_at TIMESTAMPTZ
  //
  // Configure the table's RLS policies before enabling cloud saves.
  const { error } = await supabase
    .from("game_saves")
    .upsert({
      user_id: currentUser.id,
      save_data: state,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

  if (error) {
    console.error("Cloud save failed:", error);
    notify("Cloud save failed. Your local save is unchanged.");
    return false;
  }

  notify("Cloud save complete.");
  return true;
}

async function loadCloudGame() {
  if (!supabase || !currentUser) {
    notify("Sign in first.");
    return false;
  }

  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) {
    notify("Cloud load failed.");
    console.error(error);
    return false;
  }

  if (!data?.save_data) {
    notify("No cloud save found.");
    return false;
  }

  state = normalizeState(data.save_data);
  saveGame();
  refreshGameUI();
  syncPlayerPosition();
  notify("Cloud save loaded.");
  return true;
}

// ------------------------------------------------------------
// 5. THREE.JS WORLD
// ------------------------------------------------------------

let scene;
let camera;
let renderer;
let clock;
let player;
let playerBody;
let playerHead;
let playerHair;
let worldReady = false;

const buildingMeshes = [];
const npcMeshes = [];
const keys = new Set();

const cameraTarget = new THREE.Vector3();
const cameraOffset = new THREE.Vector3(14, 18, 14);

let cameraZoom = CONFIG.cameraZoom;
let sprinting = false;
let joystick = { x: 0, y: 0, active: false };
let gamePaused = false;
let currentInteraction = null;
let lastSave = 0;
let lastHudUpdate = 0;

function makeMaterial(color, roughness = 0.9) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness
  });
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

  // Roads
  const roadMaterial = makeMaterial(0x444448);

  const road1 = new THREE.Mesh(
    new THREE.BoxGeometry(90, 0.08, 9),
    roadMaterial
  );

  road1.position.set(0, 0, 0);
  scene.add(road1);

  const road2 = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.08, 90),
    roadMaterial
  );

  road2.position.set(0, 0.01, 0);
  scene.add(road2);

  // Road markings
  for (let i = -40; i <= 40; i += 8) {
    const marking = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.03, 0.18),
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

  const body = makeBox(0.8, 1.5, 0.55, choice([
    0x315c80, 0x7e4b33, 0x7d3974, 0x476d45, 0xc09a39
  ]));

  body.position.y = 1.0;
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
    state.avatar.outfitColor || "#315c80"
  );

  playerBody.position.y = 1.0;
  player.add(playerBody);

  playerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 12),
    makeMaterial(state.avatar.skinTone || "#8d5524")
  );

  playerHead.position.y = 2.1;
  player.add(playerHead);

  playerHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 12, 8, 0, Math.PI * 2, 0, 0.9),
    makeMaterial(state.avatar.hairColor || "#201710")
  );

  playerHair.position.y = 2.35;
  player.add(playerHair);

  player.position.set(state.player.x, 0, state.player.z);
  scene.add(player);
}

function applyAvatar() {
  if (!playerBody || !playerHead || !playerHair) return;

  playerBody.material.color.set(state.avatar.outfitColor);
  playerHead.material.color.set(state.avatar.skinTone);
  playerHair.material.color.set(state.avatar.hairColor);

  playerHair.visible = state.avatar.hairstyle !== "bald";
}

function initializeWorld() {
  const host = $("#gameCanvas") || $("#game-world") || $("#gameWorld");

  if (!host) {
    console.error(
      "No game canvas container found. Expected #gameCanvas, #game-world, or #gameWorld."
    );
    notify("Game canvas container not found. Check your index.html.");
    return;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ec6d7);
  scene.fog = new THREE.Fog(0x9ec6d7, 65, 160);

  const width = host.clientWidth || window.innerWidth;
  const height = host.clientHeight || window.innerHeight;

  // Orthographic camera creates the isometric-style view.
  camera = new THREE.OrthographicCamera(
    -cameraZoom * width / height / 2,
    cameraZoom * width / height / 2,
    cameraZoom / 2,
    -cameraZoom / 2,
    0.1,
    500
  );

  camera.position.set(14, 18, 14);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  host.replaceChildren(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.touchAction = "none";

  const ambient = new THREE.HemisphereLight(0xffffff, 0x4e5943, 2.0);
  scene.add(ambient);

  const sunlight = new THREE.DirectionalLight(0xffe3b0, 2.0);
  sunlight.position.set(-25, 45, 25);
  sunlight.castShadow = true;
  scene.add(sunlight);

  addGround();

  for (const building of BUILDINGS) {
    createBuilding(building);
  }

  for (let i = 0; i < 28; i++) {
    const x = random(-42, 42);
    const z = random(-42, 42);

    if (Math.abs(x) < 25 && Math.abs(z) < 23) continue;
    createTree(x, z);
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

  notify("Welcome to Naija Hustle!");
}

function resizeRenderer() {
  if (!renderer || !camera) return;

  const host = renderer.domElement.parentElement;
  const width = host.clientWidth || window.innerWidth;
  const height = host.clientHeight || window.innerHeight;

  renderer.setSize(width, height);

  camera.left = -cameraZoom * width / height / 2;
  camera.right = cameraZoom * width / height / 2;
  camera.top = cameraZoom / 2;
  camera.bottom = -cameraZoom / 2;
  camera.updateProjectionMatrix();
}

function onWorldPointer(event) {
  if (!renderer || !camera) return;

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

  const data = object.userData;
  const distance = Math.hypot(
    player.position.x - data.x,
    player.position.z - data.z
  );

  if (distance > 12) {
    notify("Move closer to " + data.name + " first.");
    return;
  }

  interactWithBuilding(data);
}

// ------------------------------------------------------------
// 6. PLAYER MOVEMENT AND CAMERA
// ------------------------------------------------------------

function syncPlayerPosition() {
  if (!player) return;

  player.position.x = state.player.x;
  player.position.z = state.player.z;
}

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

  const multiplier = sprinting ? CONFIG.sprintMultiplier : 1;
  const speed = CONFIG.moveSpeed * multiplier;

  if (length > 0.05) {
    // Isometric movement: controls remain aligned with the screen.
    const worldX = x - z;
    const worldZ = x + z;
    const scale = 1 / Math.SQRT2;

    player.position.x += worldX * scale * speed * dt;
    player.position.z += worldZ * scale * speed * dt;

    player.rotation.y = Math.atan2(worldX, worldZ);

    state.needs.energy = clamp(
      state.needs.energy - dt * (sprinting ? 0.75 : 0.25),
      0, 100
    );
  }

  // Keep the player inside the world boundary.
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

  camera.position.lerp(
    desired,
    1 - Math.exp(-5 * dt)
  );

  camera.lookAt(cameraTarget);
}

function zoomCamera(amount) {
  cameraZoom = clamp(cameraZoom + amount, 8, 28);
  resizeRenderer();
}

function animate() {
  if (!worldReady) return;

  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);

  updateMovement(dt);
  updateWorld(dt);
  updateGameTime(dt);

  renderer.render(scene, camera);

  lastHudUpdate += dt;

  if (lastHudUpdate >= 0.25) {
    refreshGameUI();
    lastHudUpdate = 0;
  }

  lastSave += dt * 1000;

  if (lastSave >= CONFIG.saveInterval) {
    saveGame();
    lastSave = 0;
  }
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
    player.position.y = Math.abs(Math.sin(performance.now() * 0.006)) *
      (keys.has(" ") ? 0.65 : 0);
  }
}

// ------------------------------------------------------------
// 7. NEEDS, TIME, XP AND QUESTS
// ------------------------------------------------------------

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
    notify("Daily housing expense: " + money(home.rent));
  }

  const career = CAREERS.find((item) => item.name === state.career);

  if (career?.salary > 0) {
    state.money += career.salary;
    notify("Work income received: " + money(career.salary));
    addXP(20);
  }

  saveGame();
}

function addXP(amount) {
  state.xp += Math.max(0, amount);

  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level += 1;
    state.money += 1500;
    notify("Level " + state.level + " reached! Bonus: ₦1,500");
  }

  checkQuest();
}

function setNeed(name, value) {
  if (!(name in state.needs)) return;

  state.needs[name] = clamp(value, 0, 100);
  refreshGameUI();
}

function restoreNeed(name, amount) {
  if (!(name in state.needs)) return;

  setNeed(name, state.needs[name] + amount);
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
}

// ------------------------------------------------------------
// 8. ECONOMY: JOBS AND GIGS
// ------------------------------------------------------------

function getJob() {
  const options = CAREERS.filter(
    (career) => career.name !== "Unemployed"
  );

  const list = options.map((career, index) =>
    (index + 1) + ". " + career.name + " — " +
    money(career.salary) + " per game day"
  ).join("\n");

  const answer = prompt(
    "Choose a career by number:\n" + list
  );

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= options.length) {
    notify("Invalid career choice.");
    return;
  }

  state.career = options[index].name;
  state.stats.jobsCompleted += 1;

  notify("Career selected: " + state.career);
  addXP(25);
  saveGame();
}

function doGig() {
  const gig = choice(GIGS);

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

  notify(
    "Gig completed: " + gig.name + ". Earned " + money(gig.reward)
  );

  saveGame();
  refreshGameUI();
}

// ------------------------------------------------------------
// 9. INVENTORY, SHOPS AND NEEDS
// ------------------------------------------------------------

function buyItem(item) {
  if (state.money < item.price) {
    notify("You don't have enough money.");
    return false;
  }

  state.money -= item.price;
  state.inventory.push(item.name);
  state.stats.itemsPurchased += 1;

  notify("Purchased " + item.name);
  saveGame();
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
    notify("This item has no use configured.");
    return;
  }

  state.inventory.splice(index, 1);

  if (item.hunger) restoreNeed("hunger", item.hunger);
  if (item.energy) restoreNeed("energy", item.energy);
  if (item.hygiene) restoreNeed("hygiene", item.hygiene);

  notify("Used " + item.name);
  saveGame();
  refreshGameUI();
}

function openShop() {
  const options = ITEMS.map((item, index) =>
    (index + 1) + ". " + item.name + " — " + money(item.price)
  ).join("\n");

  const answer = prompt("Shop\n" + options + "\n\nEnter item number:");

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= ITEMS.length) {
    notify("Invalid item choice.");
    return;
  }

  buyItem(ITEMS[index]);
}

function rest() {
  restoreNeed("energy", 40);
  restoreNeed("fun", 10);
  state.time = (state.time + 2) % 24;

  notify("You rested and recovered energy.");
  saveGame();
}

function shower() {
  restoreNeed("hygiene", 55);
  state.money = Math.max(0, state.money - 300);

  notify("You freshened up. Cost: ₦300");
  saveGame();
}

function eat() {
  const food = ITEMS.filter((item) => item.hunger);

  const options = food.map((item, index) =>
    (index + 1) + ". " + item.name + " — " + money(item.price)
  ).join("\n");

  const answer = prompt("Food options:\n" + options);

  if (answer === null) return;

  const item = food[Number(answer) - 1];

  if (!item) {
    notify("Invalid choice.");
    return;
  }

  if (buyItem(item)) {
    useItem(item.name);
  }
}

// ------------------------------------------------------------
// 10. HOUSING AND VEHICLES
// ------------------------------------------------------------

function upgradeHome() {
  const options = HOMES.map((home, index) =>
    (index + 1) + ". " + home.name +
    " — " + money(home.price) +
    " (daily expense: " + money(home.rent) + ")"
  ).join("\n");

  const answer = prompt("Housing:\n" + options);

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= HOMES.length
  ) {
    notify("Invalid housing choice.");
    return;
  }

  if (index <= state.homeIndex) {
    notify("You already own this home or a better one.");
    return;
  }

  const home = HOMES[index];

  if (state.money < home.price) {
    notify("Not enough money for this home.");
    return;
  }

  state.money -= home.price;
  state.homeIndex = index;

  notify("You moved into " + home.name);
  addXP(50);
  saveGame();
}

function buyVehicle() {
  const options = VEHICLES.map((vehicle, index) =>
    (index + 1) + ". " + vehicle.name + " — " + money(vehicle.price)
  ).join("\n");

  const answer = prompt("Vehicle shop:\n" + options);

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= VEHICLES.length
  ) {
    notify("Invalid vehicle choice.");
    return;
  }

  if (state.vehicleIndex === index) {
    notify("You already have this vehicle.");
    return;
  }

  const vehicle = VEHICLES[index];

  if (state.money < vehicle.price) {
    notify("Not enough money.");
    return;
  }

  state.money -= vehicle.price;
  state.vehicleIndex = index;

  notify("Purchased: " + vehicle.name);
  saveGame();
}

function useVehicle() {
  if (state.vehicleIndex < 0) {
    notify("You don't own a vehicle yet.");
    return;
  }

  const vehicle = VEHICLES[state.vehicleIndex];

  notify(vehicle.name + " selected. Vehicle driving physics are not yet implemented.");
}

// ------------------------------------------------------------
// 11. BUILDING INTERACTIONS
// ------------------------------------------------------------

function interactWithBuilding(building) {
  currentInteraction = building;

  switch (building.kind) {
    case "shop":
      openShop();
      break;

    case "food":
      eat();
      break;

    case "clinic":
      restoreNeed("energy", 10);
      restoreNeed("hygiene", 5);
      notify("You took a short break at the clinic.");
      break;

    case "job":
      getJob();
      break;

    case "home":
      rest();
      break;

    case "garage":
      buyVehicle();
      break;

    default:
      notify("Nothing to do here yet.");
  }

  refreshGameUI();
}

// ------------------------------------------------------------
// 12. AVATAR CUSTOMIZATION
// ------------------------------------------------------------

function customizeAvatar() {
  const options = [
    "1. Skin tone",
    "2. Hair color",
    "3. Outfit color",
    "4. Hairstyle"
  ].join("\n");

  const answer = prompt("Avatar customization:\n" + options);

  if (answer === null) return;

  switch (answer) {
    case "1": {
      const value = prompt(
        "Enter a hex skin color, e.g. #8d5524",
        state.avatar.skinTone
      );

      if (value && /^#[0-9a-f]{6}$/i.test(value)) {
        state.avatar.skinTone = value;
      } else if (value !== null) {
        notify("Use a valid hex color.");
        return;
      }

      break;
    }

    case "2": {
      const value = prompt(
        "Enter a hex hair color, e.g. #201710",
        state.avatar.hairColor
      );

      if (value && /^#[0-9a-f]{6}$/i.test(value)) {
        state.avatar.hairColor = value;
      } else if (value !== null) {
        notify("Use a valid hex color.");
        return;
      }

      break;
    }

    case "3": {
      const value = prompt(
        "Enter a hex outfit color, e.g. #315c80",
        state.avatar.outfitColor
      );

      if (value && /^#[0-9a-f]{6}$/i.test(value)) {
        state.avatar.outfitColor = value;
      } else if (value !== null) {
        notify("Use a valid hex color.");
        return;
      }

      break;
    }

    case "4": {
      const value = prompt(
        "Choose: short, afro, bald",
        state.avatar.hairstyle
      );

      if (["short", "afro", "bald"].includes(value)) {
        state.avatar.hairstyle = value;
      }

      break;
    }

    default:
      notify("Invalid choice.");
      return;
  }

  applyAvatar();
  saveGame();
  notify("Avatar updated.");
}

// ------------------------------------------------------------
// 13. MINIMAP
// ------------------------------------------------------------

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
    const x = width / 2 + building.x * scale;
    const y = height / 2 + building.z * scale;

    context.fillStyle = "#d0a94f";
    context.fillRect(x - 3, y - 3, 6, 6);
  }

  const playerX = width / 2 + state.player.x * scale;
  const playerY = height / 2 + state.player.z * scale;

  context.fillStyle = "#66d9ef";
  context.beginPath();
  context.arc(playerX, playerY, 4, 0, Math.PI * 2);
  context.fill();
}

// ------------------------------------------------------------
// 14. GAME UI
// ------------------------------------------------------------

function setText(selector, value) {
  const element = $(selector);

  if (element) element.textContent = value;
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

    if ("value" in element) {
      element.value = value;
    } else {
      element.style.width = value + "%";
      element.setAttribute("aria-valuenow", String(value));
    }
  }

  setText("#" + name + "Value", Math.round(value) + "%");
}

function refreshGameUI() {
  setText("#money", money(state.money));
  setText("#moneyDisplay", money(state.money));
  setText("#cashDisplay", money(state.money));
  setText("#level", String(state.level));
  setText("#levelBadge", "Lv " + state.level);
  setText("#xp", String(state.xp));
  setText("#day", String(state.day));
  setText("#career", state.career);
  setText("#activeQuest", state.activeQuest);
  setText("#questText", state.activeQuest);
  setText("#homeName", HOMES[state.homeIndex]?.name || "Unknown");
  setText(
    "#vehicleName",
    state.vehicleIndex >= 0
      ? VEHICLES[state.vehicleIndex]?.name || "None"
      : "None"
  );

  for (const [name, value] of Object.entries(state.needs)) {
    updateNeedBar(name, value);
  }

  const inventory = $("#inventoryList");

  if (inventory) {
    inventory.replaceChildren();

    if (!state.inventory.length) {
      inventory.textContent = "Your inventory is empty.";
    } else {
      for (const item of state.inventory) {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.gap = "10px";

        const label = document.createElement("span");
        label.textContent = item;

        row.append(
          label,
          makeButton("Use", () => useItem(item))
        );

        inventory.appendChild(row);
      }
    }
  }

  const clockElement = $("#gameClock");

  if (clockElement) {
    const hours = Math.floor(state.time) % 24;
    const minutes = Math.floor((state.time % 1) * 60);

    clockElement.textContent =
      String(hours).padStart(2, "0") + ":" +
      String(minutes).padStart(2, "0");
  }

  drawMinimap();
}

function createBasicUI() {
  if ($("#nhBasicMenu")) return;

  const panel = document.createElement("div");
  panel.id = "nhBasicMenu";

  Object.assign(panel.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    width: "min(260px, 68vw)",
    maxHeight: "75vh",
    overflowY: "auto",
    background: "rgba(18,18,18,0.92)",
    color: "#fff",
    border: "1px solid #8b6c29",
    borderRadius: "14px",
    padding: "12px",
    zIndex: "1000",
    font: "13px system-ui"
  });

  const heading = document.createElement("h3");
  heading.textContent = "NAIJA HUSTLE";
  heading.style.color = "#f4c95d";
  panel.appendChild(heading);

  const status = document.createElement("div");
  status.id = "nhBasicStatus";
  panel.appendChild(status);

  const controls = document.createElement("div");

  Object.assign(controls.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
    marginTop: "10px"
  });

  const actions = [
    ["Do a Gig", doGig],
    ["Find a Job", getJob],
    ["Shop", openShop],
    ["Rest", rest],
    ["Shower", shower],
    ["Housing", upgradeHome],
    ["Vehicles", buyVehicle],
    ["Avatar", customizeAvatar],
    ["Inventory", () => showInventory()],
    ["Save", () => {
      saveGame();
      notify("Game saved on this device.");
    }],
    ["Cloud Save", saveCloudGame],
    ["New Game", resetGame]
  ];

  for (const [label, action] of actions) {
    controls.appendChild(makeButton(label, action));
  }

  panel.appendChild(controls);

  const help = document.createElement("p");
  help.textContent =
    "Move: WASD / arrows • Sprint: Shift • Interact: E • Zoom: +/-";
  help.style.lineHeight = "1.5";
  panel.appendChild(help);

  document.body.appendChild(panel);
}

function showInventory() {
  const list = state.inventory.length
    ? state.inventory.join("\n")
    : "Your inventory is empty.";

  alert("Inventory\n\n" + list);
}

// ------------------------------------------------------------
// 15. INPUTS AND MOBILE JOYSTICK
// ------------------------------------------------------------

function onKeyDown(event) {
  const key = event.key.toLowerCase();

  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
      .includes(key)
  ) {
    event.preventDefault();
  }

  keys.add(key);

  if (key === "shift") sprinting = true;
  if (key === "+" || key === "=") zoomCamera(-1);
  if (key === "-") zoomCamera(1);

  if (key === "e") {
    const nearest = getNearestBuilding();

    if (nearest && nearest.distance <= 12) {
      interactWithBuilding(nearest.building);
    } else {
      notify("Move closer to a building to interact.");
    }
  }

  if (key === "i") showInventory();
  if (key === "c") customizeAvatar();
  if (key === "escape") gamePaused = !gamePaused;
}

function onKeyUp(event) {
  const key = event.key.toLowerCase();
  keys.delete(key);

  if (key === "shift") sprinting = false;
}

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

function bindJoystick() {
  const base = $("#joystickBase") || $("#joystick-base");
  const knob = $("#joystickKnob") || $("#joystick-knob");

  if (!base) return;

  let pointerId = null;

  function update(event) {
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxDistance = Math.max(1, rect.width * 0.32);
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const factor = distance > maxDistance
      ? maxDistance / distance
      : 1;

    joystick.x = (dx * factor) / maxDistance;
    joystick.y = (dy * factor) / maxDistance;
    joystick.active = true;

    if (knob) {
      knob.style.transform =
        "translate(" +
        (joystick.x * maxDistance) + "px, " +
        (joystick.y * maxDistance) + "px)";
    }
  }

  base.addEventListener("pointerdown", (event) => {
    pointerId = event.pointerId;
    base.setPointerCapture(pointerId);
    update(event);
  });

  base.addEventListener("pointermove", (event) => {
    if (event.pointerId === pointerId) update(event);
  });

  function stop(event) {
    if (event.pointerId !== pointerId) return;

    pointerId = null;
    joystick.x = 0;
    joystick.y = 0;
    joystick.active = false;

    if (knob) knob.style.transform = "translate(0, 0)";
  }

  base.addEventListener("pointerup", stop);
  base.addEventListener("pointercancel", stop);
  base.addEventListener("lostpointercapture", () => {
    pointerId = null;
    joystick.x = 0;
    joystick.y = 0;
    joystick.active = false;

    if (knob) knob.style.transform = "translate(0, 0)";
  });
}

function bindExistingButtons() {
  const bindings = {
    "#gigBtn": doGig,
    "#jobBtn": getJob,
    "#shopBtn": openShop,
    "#restBtn": rest,
    "#showerBtn": shower,
    "#homeBtn": upgradeHome,
    "#vehicleBtn": buyVehicle,
    "#avatarBtn": customizeAvatar,
    "#inventoryBtn": showInventory,
    "#saveBtn": saveGame,
    "#zoomIn": () => zoomCamera(-1),
    "#zoomOut": () => zoomCamera(1)
  };

  for (const [selector, action] of Object.entries(bindings)) {
    const element = $(selector);

    if (element && !element.dataset.nhBound) {
      element.addEventListener("click", action);
      element.dataset.nhBound = "true";
    }
  }
}

// ------------------------------------------------------------
// 16. STARTUP AND CLEANUP
// ------------------------------------------------------------

async function start() {
  loadGame();

  createBasicUI();
  initializeWorld();

  if (!worldReady) return;

  bindJoystick();
  bindExistingButtons();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  window.addEventListener("beforeunload", saveGame);

  await initializeSupabase();

  refreshGameUI();

  console.info("Naija Hustle " + CONFIG.version + " initialized.");
}

start().catch((error) => {
  console.error("Naija Hustle startup failed:", error);
  notify("The game could not start. Check the browser console.");
});
