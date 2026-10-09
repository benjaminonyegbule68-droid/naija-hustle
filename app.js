/* ============================================================
   NAIJA HUSTLE — MODULAR APP.JS
   Version: 2.1.0
   ONLINE-ONLY BUILD
   Three.js + Supabase Auth + Supabase Cloud Saves
   ============================================================ */

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* ============================================================
   0. CONFIGURATION
   ============================================================ */

const SUPABASE_URL = "https://pbqtbwiymlwksdtfsfcb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-SK-LvMzEwv-oqn8A5hZOQ_rwyzGxUj";
const CONFIG = {
  version: "2.1.0",
  worldSize: 100,
  moveSpeed: 7,
  sprintMultiplier: 1.55,
  cameraZoom: 16,
  dayLength: 300,
  saveInterval: 15000
};

/* ============================================================
   1. UTILITIES
   ============================================================ */

const $ = (selector) => document.querySelector(selector);

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const random = (min, max) =>
  min + Math.random() * (max - min);

const choice = (items) =>
  items[Math.floor(Math.random() * items.length)];

const money = (amount) =>
  "₦" + Math.floor(amount).toLocaleString("en-NG");

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
  }, 2800);
}

function makeButton(label, action) {
  const button = document.createElement("button");
  button.type = "button";
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

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = String(value ?? "");
}

function validColor(value) {
  return typeof value === "string" &&
    /^#[0-9a-f]{6}$/i.test(value);
}

/* ============================================================
   2. GAME DATA
   ============================================================ */

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
  { name: "Jollof Rice", price: 1500, hunger: 35 },
  { name: "Bottle of Water", price: 300, energy: 5 },
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
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

let state = createInitialState();

/* ============================================================
   3. STATE VALIDATION
   ============================================================ */

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
  result.level = Math.max(1, Number(result.level) || 1);
  result.xp = Math.max(0, Number(result.xp) || 0);
  result.day = Math.max(1, Number(result.day) || 1);
  result.time = clamp(Number(result.time) || 0, 0, 24);

  if (!CAREERS.some((item) => item.name === result.career)) {
    result.career = "Unemployed";
  }

  result.homeIndex = clamp(
    Math.floor(Number(result.homeIndex) || 0),
    0,
    HOMES.length - 1
  );

  result.vehicleIndex = Number.isInteger(Number(result.vehicleIndex))
    ? clamp(Number(result.vehicleIndex), -1, VEHICLES.length - 1)
    : -1;

  for (const key of Object.keys(result.needs)) {
    result.needs[key] = clamp(Number(result.needs[key]) || 0, 0, 100);
  }

  for (const key of Object.keys(result.skills)) {
    result.skills[key] = Math.max(1, Number(result.skills[key]) || 1);
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
  if (!Array.isArray(result.completedQuests)) result.completedQuests = [];

  result.inventory = result.inventory.filter(
    (item) => typeof item === "string"
  );

  result.completedQuests = result.completedQuests.filter(
    (item) => typeof item === "string"
  );

  if (!result.avatar || typeof result.avatar !== "object") {
    result.avatar = { ...defaults.avatar };
  }

  for (const key of ["skinTone", "hairColor", "outfitColor"]) {
    if (!validColor(result.avatar[key])) {
      result.avatar[key] = defaults.avatar[key];
    }
  }

  if (!["short", "afro", "bald"].includes(result.avatar.hairstyle)) {
    result.avatar.hairstyle = "short";
  }

  return result;
}

/* ============================================================
   4. SUPABASE AUTHENTICATION AND CLOUD SAVES
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
    throw new Error(
      "Supabase is not configured. Add your project URL and publishable/anon key to app.js."
    );
  }

  const module = await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
  );

  supabase = module.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

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
  if (!supabase) throw new Error("The online service is not initialized.");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  currentUser = data.user || data.session?.user || null;

  if (!currentUser) {
    throw new Error("Login did not return a user. Please try again.");
  }

  return true;
}

async function signUpWithEmail(email, password) {
  if (!supabase) throw new Error("The online service is not initialized.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  currentUser = data.user || data.session?.user || null;

  return {
    user: data.user || null,
    session: data.session || null
  };
}

async function signOut() {
  if (!supabase) return;

  loggingOut = true;
  stopGameplay();

  const { error } = await supabase.auth.signOut();

  loggingOut = false;

  if (error) {
    showLogin("Sign-out failed. Please try again.");
    console.error("Sign-out failed:", error);
    return;
  }

  currentUser = null;
  showLogin("You have signed out.");
}

async function saveCloudGame(options = {}) {
  if (!supabase || !currentUser) {
    return false;
  }

  if (cloudSaveInProgress) {
    cloudSaveQueued = true;
    return false;
  }

  cloudSaveInProgress = true;

  try {
    const userId = currentUser.id;
    const snapshot = JSON.parse(JSON.stringify(state));

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

    if (options.notify) notify("Progress saved to your account.");

    return true;
  } catch (error) {
    console.error("Cloud save failed:", error);

    if (options.notify) {
      notify("Cloud save failed. Check your connection and try again.");
    }

    return false;
  } finally {
    cloudSaveInProgress = false;

    if (cloudSaveQueued) {
      cloudSaveQueued = false;

      if (currentUser && gameStarted) {
        saveCloudGame();
      }
    }
  }
}

async function loadCloudGame() {
  if (!supabase || !currentUser) {
    throw new Error("Sign in before loading a game.");
  }

  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error("Cloud load failed:", error);
    throw new Error(
      "Your cloud save could not be loaded. Check your game_saves table and RLS policies."
    );
  }

  if (data?.save_data) {
    state = normalizeState(data.save_data);
    return true;
  }

  // A new account starts a new game, then immediately creates
  // its own cloud save. No local save is created.
  state = createInitialState();

  const saved = await saveCloudGame();

  if (!saved) {
    throw new Error(
      "Your new game could not be saved online. Please try again."
    );
  }

  return true;
}

/* ============================================================
   5. THREE.JS WORLD
   ============================================================ */

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
let animationFrame = null;

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
}

function initializeWorld() {
  const host =
    $("#gameCanvas") ||
    $("#game-world") ||
    $("#gameWorld");

  if (!host) {
    throw new Error(
      "No game canvas container found. Check for #gameCanvas in index.html."
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  host.replaceChildren(renderer.domElement);

  Object.assign(renderer.domElement.style, {
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "none"
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x4e5943, 2));

  const sunlight = new THREE.DirectionalLight(0xffe3b0, 2);
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

/* ============================================================
   6. PLAYER MOVEMENT AND CAMERA
   ============================================================ */

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

  const speed = CONFIG.moveSpeed *
    (sprinting ? CONFIG.sprintMultiplier : 1);

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

function updateWorld(dt) {
  for (const npc of npcMeshes) {
    npc.userData.phase += dt * npc.userData.speed;

    npc.position.x =
      npc.userData.originX + Math.sin(npc.userData.phase) * 1.5;

    npc.position.z =
      npc.userData.originZ + Math.cos(npc.userData.phase * 0.7) * 1.5;
  }

  if (player && keys.has(" ")) {
    player.position.y = 0.65;
  } else if (player) {
    player.position.y = 0;
  }
}

/* ============================================================
   7. NEEDS, TIME, XP AND QUESTS
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

  const career = CAREERS.find((item) => item.name === state.career);

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

/* ============================================================
   8. JOBS AND GIGS
   ============================================================ */

function getJob() {
  const options = CAREERS.filter(
    (career) => career.name !== "Unemployed"
  );

  const list = options.map((career, index) =>
    (index + 1) + ". " + career.name + " — " +
    money(career.salary) + " per game day"
  ).join("\n");

  const answer = prompt("Choose a career:\n" + list);

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
  saveCloudGame();
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

  saveCloudGame();
  refreshGameUI();
}

/* ============================================================
   9. INVENTORY, SHOPS AND NEEDS
   ============================================================ */

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
    notify("This item has no use configured.");
    return;
  }

  state.inventory.splice(index, 1);

  if (item.hunger) restoreNeed("hunger", item.hunger);
  if (item.energy) restoreNeed("energy", item.energy);
  if (item.hygiene) restoreNeed("hygiene", item.hygiene);

  notify("Used " + item.name);

  saveCloudGame();
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
  saveCloudGame();
}

function shower() {
  restoreNeed("hygiene", 55);
  state.money = Math.max(0, state.money - 300);

  notify("You freshened up. Cost: ₦300");
  saveCloudGame();
}

function eat() {
  const food = ITEMS.filter((item) => item.hunger);

  const options = food.map((item, index) =>
    (index + 1) + ". " + item.name + " — " + money(item.price)
  ).join("\n");

  const answer = prompt("Food options:\n" + options);

  if (answer === null) return;

  const index = Number(answer) - 1;
  const item = food[index];

  if (!item) {
    notify("Invalid choice.");
    return;
  }

  if (buyItem(item)) useItem(item.name);
}

/* ============================================================
   10. HOUSING AND VEHICLES
   ============================================================ */

function upgradeHome() {
  const options = HOMES.map((home, index) =>
    (index + 1) + ". " + home.name +
    " — " + money(home.price) +
    " (daily expense: " + money(home.rent) + ")"
  ).join("\n");

  const answer = prompt("Housing:\n" + options);

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= HOMES.length) {
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
  saveCloudGame();
  refreshGameUI();
}

function buyVehicle() {
  const options = VEHICLES.map((vehicle, index) =>
    (index + 1) + ". " + vehicle.name + " — " + money(vehicle.price)
  ).join("\n");

  const answer = prompt("Vehicle shop:\n" + options);

  if (answer === null) return;

  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= VEHICLES.length) {
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
    vehicle.name +
    " selected. Vehicle driving controls have not been implemented yet."
  );
}

/* ============================================================
   11. BUILDING INTERACTIONS
   ============================================================ */

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
      saveCloudGame();
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

/* ============================================================
   12. AVATAR CUSTOMIZATION
   ============================================================ */

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

      if (value === null) return;

      if (!validColor(value)) {
        notify("Use a valid hex color.");
        return;
      }

      state.avatar.skinTone = value;
      break;
    }

    case "2": {
      const value = prompt(
        "Enter a hex hair color, e.g. #201710",
        state.avatar.hairColor
      );

      if (value === null) return;

      if (!validColor(value)) {
        notify("Use a valid hex color.");
        return;
      }

      state.avatar.hairColor = value;
      break;
    }

    case "3": {
      const value = prompt(
        "Enter a hex outfit color, e.g. #315c80",
        state.avatar.outfitColor
      );

      if (value === null) return;

      if (!validColor(value)) {
        notify("Use a valid hex color.");
        return;
      }

      state.avatar.outfitColor = value;
      break;
    }

    case "4": {
      const value = prompt(
        "Choose: short, afro, bald",
        state.avatar.hairstyle
      );

      if (value === null) return;

      if (!["short", "afro", "bald"].includes(value)) {
        notify("Choose short, afro, or bald.");
        return;
      }

      state.avatar.hairstyle = value;
      break;
    }

    default:
      notify("Invalid choice.");
      return;
  }

  applyAvatar();
  saveCloudGame();
  notify("Avatar updated.");
}

/* ============================================================
   13. MINIMAP
   ============================================================ */

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

/* ============================================================
   14. GAME UI
   ============================================================ */

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

        Object.assign(row.style, {
          display: "flex",
          justifyContent: "space-between",
          gap: "10px"
        });

        const label = document.createElement("span");
        label.textContent = item;

        row.append(label, makeButton("Use", () => useItem(item)));
        inventory.appendChild(row);
      }
    }
  }

  drawMinimap();
}

function formatClock() {
  const hours = Math.floor(state.time) % 24;
  const minutes = Math.floor((state.time % 1) * 60);

  return String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0");
}

/* Adds a compact action menu for the existing gameplay functions. */
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
    background: "rgba(18,18,18,0.92)",
    color: "#fff",
    border: "1px solid #8b6c29",
    borderRadius: "14px",
    padding: "10px",
    zIndex: "1000",
    font: "13px system-ui"
  });

  const heading = document.createElement("h3");
  heading.textContent = "NAIJA HUSTLE";
  heading.style.color = "#f4c95d";
  panel.appendChild(heading);

  const controls = document.createElement("div");

  Object.assign(controls.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px"
  });

  const actions = [
    ["Gig", doGig],
    ["Career", getJob],
    ["Shop", openShop],
    ["Eat", eat],
    ["Rest", rest],
    ["Shower", shower],
    ["Housing", upgradeHome],
    ["Vehicles", buyVehicle],
    ["Avatar", customizeAvatar],
    ["Inventory", showInventory],
    ["Save Online", () => saveCloudGame({ notify: true })],
    ["Sign Out", signOut]
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

/* ============================================================
   15. INPUTS AND MOBILE JOYSTICK
   ============================================================ */

function onKeyDown(event) {
  if (!gameStarted) return;

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
  // Supports both the old selectors and the current index.html IDs.
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
    const factor = distance > maxDistance
      ? maxDistance / distance
      : 1;

    joystick.x = dx * factor / maxDistance;
    joystick.y = dy * factor / maxDistance;
    joystick.active = true;

    if (knob) {
      knob.style.transform =
        "translate(" +
        joystick.x * maxDistance + "px, " +
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

    if (knob) knob.style.transform = "translate(0, 0)";
  }

  base.addEventListener("pointerup", stop);
  base.addEventListener("pointercancel", stop);
  base.addEventListener("lostpointercapture", () => stop());
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
    "#saveBtn": () => saveCloudGame({ notify: true }),
    "#zoomIn": () => zoomCamera(-1),
    "#zoomOut": () => zoomCamera(1),
    "#socialBtn": () => {
      state.needs.social = clamp(state.needs.social + 10, 0, 100);
      notify("You spent time socializing.");
      saveCloudGame();
      refreshGameUI();
    },
    "#emoteBtn": () => notify("Your character waves!"),
    "#runBtn": () => {
      sprinting = !sprinting;
      notify(sprinting ? "Running enabled." : "Running disabled.");
    },
    "#jumpBtn": () => {
      if (player) {
        player.position.y = 0.65;
        setTimeout(() => {
          if (player) player.position.y = 0;
        }, 250);
      }
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

/* ============================================================
   16. ONLINE-ONLY STARTUP AND LOGIN
   ============================================================ */

function showLogin(message = "") {
  const login = $("#loginScreen");
  const hud = $("#hud");
  const loading = $("#loadingScreen");

  if (login) login.classList.remove("hidden");
  if (hud) hud.classList.add("hidden");
  if (loading) loading.classList.add("hidden");

  const messageElement = $("#loginMessage");

  if (messageElement && message) {
    messageElement.textContent = message;
  }
}

function showGame() {
  const login = $("#loginScreen");
  const hud = $("#hud");
  const loading = $("#loadingScreen");

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

  const menu = $("#nhBasicMenu");
  if (menu) menu.remove();

  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }

  window.removeEventListener("resize", resizeRenderer);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);

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
}

async function startAuthenticatedGame() {
  if (!currentUser) {
    showLogin("Please sign in before playing.");
    return;
  }

  if (gameStarted || gameStarting) return;

  gameStarting = true;
  gamePaused = false;

  const loading = $("#loadingScreen");
  if (loading) loading.classList.remove("hidden");

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

    syncPlayerPosition();
    applyAvatar();
    refreshGameUI();

    setText("#name", currentUser.email || "Player");

    notify("Welcome to Naija Hustle!");
    console.info("Naija Hustle " + CONFIG.version + " online.");
  } catch (error) {
    console.error("Online game startup failed:", error);

    stopGameplay();

    showLogin(
      error.message ||
      "The game could not load. Check your connection and try again."
    );
  } finally {
    gameStarting = false;

    if (!gameStarted) {
      const screen = $("#loadingScreen");
      if (screen) screen.classList.add("hidden");
    }
  }
}

async function handleLogin() {
  if (!authReady) {
    showLogin("Connecting to the online service. Please wait.");
    return;
  }

  const email = $("#loginEmail")?.value.trim();
  const password = $("#loginPassword")?.value;

  if (!email || !password) {
    showLogin("Enter your email and password.");
    return;
  }

  try {
    showLogin("Signing in...");

    await signInWithEmail(email, password);
    await startAuthenticatedGame();
  } catch (error) {
    console.error("Login failed:", error);
    showLogin(error.message || "Login failed. Check your details.");
  }
}

async function handleSignup() {
  if (!authReady) {
    showLogin("Connecting to the online service. Please wait.");
    return;
  }

  const email = $("#loginEmail")?.value.trim();
  const password = $("#loginPassword")?.value;

  if (!email || !password) {
    showLogin("Enter your email and password.");
    return;
  }

  if (password.length < 6) {
    showLogin("Your password must contain at least 6 characters.");
    return;
  }

  try {
    showLogin("Creating your account...");

    const result = await signUpWithEmail(email, password);

    if (!result.session) {
      showLogin(
        "Account created. Check your email to verify the account, then sign in."
      );
      return;
    }

    await startAuthenticatedGame();
  } catch (error) {
    console.error("Signup failed:", error);
    showLogin(error.message || "Account creation failed.");
  }
}

function bindAuthenticationEvents() {
  // index.html dispatches these events on window.
  window.addEventListener("naijahustle:login", (event) => {
    event.preventDefault();
    handleLogin();
  });

  window.addEventListener("naijahustle:signup", (event) => {
    event.preventDefault();
    handleSignup();
  });

  // Prevent form submission from reloading the page.
  const form = document.querySelector("#loginForm");

  if (form && form.dataset.nhBound !== "true") {
    form.dataset.nhBound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleLogin();
    });
  }

  // Disable any leftover guest-play button.
  const guestButton = document.querySelector("#guestBtn");

  if (guestButton) {
    guestButton.disabled = true;
    guestButton.hidden = true;
  }
}

async function start() {
  showLogin("Connecting to Naija Hustle...");

  bindAuthenticationEvents();

  try {
    await initializeSupabase();

    if (currentUser) {
      await startAuthenticatedGame();
    } else {
      showLogin();
    }
  } catch (error) {
    console.error("Online startup failed:", error);

    showLogin(
      "Online connection is not configured or unavailable. Check your Supabase settings."
    );
  }
}

window.addEventListener("beforeunload", () => {
  // Best-effort cloud save. Browsers may terminate asynchronous work
  // during navigation, so this is not the only save mechanism.
  if (currentUser && gameStarted && !cloudSaveInProgress) {
    saveCloudGame();
  }
});

start().catch((error) => {
  console.error("Naija Hustle startup failed:", error);
  showLogin("The game could not start. Please refresh and try again.");
});
