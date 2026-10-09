import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================================================
   NAIJA HUSTLE — APP.JS
   Build your life. Build your hustle.
   ========================================================= */

const $ = id => document.getElementById(id);

const SUPABASE_URL = "https://pbqtbwiymlwksdtfsfcb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-SK-LvMzEwv-oqn8A5hZOQ_rwyzGxUj";

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SAVE_KEY = "nh_world_save_v3";
const AVATAR_KEY = "nh_avatar_v3";
const QUALITY_KEY = "nh_quality";

function readQuality() {
  try {
    return localStorage.getItem(QUALITY_KEY) === "low" ? "low" : "high";
  } catch {
    return "high";
  }
}

/* =========================================================
   AVATAR OPTIONS
   ========================================================= */

const OPTIONS = {
  skinTone: {
    label: "Skin Tone",
    kind: "swatch",
    values: {
      light: "#f3c7a5",
      honey: "#d99a6c",
      tan: "#b9784e",
      brown: "#855033",
      deep: "#60351f",
      dark: "#351d14"
    }
  },

  hairstyle: {
    label: "Hairstyle",
    values: {
      low_cut: "Low Cut",
      fade: "Fade",
      high_top: "High Top",
      afro: "Afro",
      twists: "Twists",
      braids: "Braids",
      locs: "Locs",
      headwrap: "Headwrap",
      bald: "Bald"
    }
  },

  hairColor: {
    label: "Hair Color",
    kind: "swatch",
    values: {
      black: "#151313",
      darkBrown: "#2c1b14",
      brown: "#4b2c1e",
      burgundy: "#541d2c",
      blonde: "#d6ad65",
      grey: "#8d8d8d"
    }
  },

  beard: {
    label: "Beard",
    values: {
      none: "None",
      stubble: "Stubble",
      goatee: "Goatee",
      full: "Full"
    }
  },

  outfit: {
    label: "Outfit",
    values: {
      hoodie: "Hoodie",
      tee: "T-Shirt",
      jersey: "Jersey",
      kaftan: "Kaftan",
      agbada: "Agbada",
      ankara: "Ankara",
      suit: "Suit"
    }
  },

  outfitColor: {
    label: "Outfit Color",
    kind: "swatch",
    values: {
      default: "#315d50",
      red: "#b72f2f",
      blue: "#285ca8",
      green: "#24734b",
      purple: "#6942a8",
      black: "#171717",
      white: "#e8e4da",
      gold: "#b88718",
      teal: "#0F6B6F"
    }
  },

  accessory: {
    label: "Accessory",
    values: {
      none: "None",
      cap: "Cap",
      glasses: "Glasses",
      sunglasses: "Sunglasses",
      chain: "Chain",
      headphones: "Headphones"
    }
  },

  bodyBuild: {
    label: "Body Build",
    values: {
      compact: "Compact",
      standard: "Standard",
      broad: "Broad"
    }
  },

  height: {
    label: "Height",
    values: {
      short: "Short",
      standard: "Standard",
      tall: "Tall"
    }
  }
};

const DEFAULT_CFG = {
  skinTone: "brown",
  hairstyle: "fade",
  hairColor: "black",
  beard: "none",
  outfit: "hoodie",
  outfitColor: "default",
  accessory: "none",
  bodyBuild: "standard",
  height: "standard"
};

/* =========================================================
   HOUSING
   ========================================================= */

const HOUSING = [
  {
    id: "room",
    name: "Basic Room",
    area: "Surulere Edge",
    rent: 8000,
    move: 0,
    comfort: 40,
    desc: "Cheap start. Small space, low rent."
  },
  {
    id: "self",
    name: "Self-contained",
    area: "Yaba",
    rent: 18000,
    move: 45000,
    comfort: 52,
    desc: "Your own toilet and kitchenette."
  },
  {
    id: "flat",
    name: "Mini Flat",
    area: "Ikeja",
    rent: 35000,
    move: 120000,
    comfort: 65,
    desc: "One bedroom and a sitting room."
  },
  {
    id: "two",
    name: "2-Bedroom Flat",
    area: "GRA",
    rent: 65000,
    move: 280000,
    comfort: 76,
    desc: "More room, more status, more bills."
  },
  {
    id: "premium",
    name: "Premium Apartment",
    area: "Victoria Island",
    rent: 110000,
    move: 550000,
    comfort: 88,
    desc: "Better security, comfort and location."
  },
  {
    id: "condo",
    name: "High-end Condo",
    area: "Lekki Phase 1",
    rent: 220000,
    move: 1200000,
    comfort: 97,
    desc: "Top-tier city living. Expensive but powerful."
  }
];

/* =========================================================
   CAREERS
   ========================================================= */

const CAREERS = [
  {
    id: "retail",
    name: "Retail Associate",
    skill: "charisma",
    pay: 7000,
    levelPay: 3400,
    home: "market",
    desc: "Sell products, learn customers and build your network."
  },
  {
    id: "designer",
    name: "Graphic Designer",
    skill: "coding",
    pay: 9000,
    levelPay: 4300,
    home: "office",
    desc: "Design flyers, brands and campaigns."
  },
  {
    id: "developer",
    name: "Web Developer",
    skill: "coding",
    pay: 10000,
    levelPay: 5600,
    home: "office",
    desc: "Build websites and digital products."
  },
  {
    id: "chef",
    name: "Chef",
    skill: "cooking",
    pay: 8000,
    levelPay: 4200,
    home: "restaurant",
    desc: "Cook shifts and build your food reputation."
  },
  {
    id: "fitness",
    name: "Fitness Coach",
    skill: "fitness",
    pay: 7500,
    levelPay: 4000,
    home: "gym",
    desc: "Coach clients and turn fitness into income."
  },
  {
    id: "creator",
    name: "Content Creator",
    skill: "charisma",
    pay: 6500,
    levelPay: 5200,
    home: "studio",
    desc: "Build an audience and attract sponsorships."
  },
  {
    id: "teacher",
    name: "Tutor",
    skill: "charisma",
    pay: 6500,
    levelPay: 3600,
    home: "school",
    desc: "Teach useful skills and grow a stable career."
  },
  {
    id: "sales",
    name: "Sales Executive",
    skill: "hustle",
    pay: 8000,
    levelPay: 4600,
    home: "office",
    desc: "Close deals and chase commissions."
  },
  {
    id: "photo",
    name: "Photographer",
    skill: "photography",
    pay: 6500,
    levelPay: 4300,
    home: "studio",
    desc: "Events, portraits and commercial shoots."
  },
  {
    id: "event",
    name: "Event Planner",
    skill: "organization",
    pay: 7000,
    levelPay: 4900,
    home: "market",
    desc: "Coordinate vendors and memorable events."
  },
  {
    id: "music",
    name: "Music Creative",
    skill: "music",
    pay: 5500,
    levelPay: 5600,
    home: "club",
    desc: "Perform, produce and build a fanbase."
  },
  {
    id: "property",
    name: "Property Agent",
    skill: "charisma",
    pay: 7000,
    levelPay: 6800,
    home: "office",
    desc: "Close property deals and learn real estate."
  },
  {
    id: "banking",
    name: "Banking Associate",
    skill: "charisma",
    pay: 9200,
    levelPay: 5200,
    home: "office",
    desc: "Structured work with strong promotion potential."
  },
  {
    id: "logistics",
    name: "Logistics Coordinator",
    skill: "organization",
    pay: 7800,
    levelPay: 5100,
    home: "market",
    desc: "Move packages, people and information."
  }
];

/* =========================================================
   GIGS
   ========================================================= */

const GIGS = [
  {
    id: "design",
    name: "Quick Design Job",
    cost: 500,
    reward: 5500,
    min: 60,
    skill: "coding"
  },
  {
    id: "delivery",
    name: "Local Delivery",
    cost: 800,
    reward: 4200,
    min: 50,
    skill: "fitness"
  },
  {
    id: "food",
    name: "Food Order",
    cost: 1200,
    reward: 6200,
    min: 75,
    skill: "cooking"
  },
  {
    id: "photo",
    name: "Street Photo Job",
    cost: 400,
    reward: 7000,
    min: 90,
    skill: "photography"
  },
  {
    id: "content",
    name: "Brand Social Content",
    cost: 600,
    reward: 8500,
    min: 100,
    skill: "charisma"
  },
  {
    id: "event",
    name: "Event Crew",
    cost: 1500,
    reward: 9000,
    min: 120,
    skill: "organization"
  },
  {
    id: "flip",
    name: "Accessory Flip",
    cost: 3000,
    reward: 5200,
    min: 45,
    skill: "hustle"
  }
];

/* =========================================================
   SHOPS
   ========================================================= */

const SHOPS = [
  {
    id: "food",
    name: "Mama Kemi's Kitchen",
    kind: "food",
    x: 0,
    z: -56,
    items: [
      {
        id: "jollof",
        name: "Jollof + Chicken",
        price: 1400,
        e: { hunger: 24, fun: 4 }
      },
      {
        id: "shawarma",
        name: "Shawarma",
        price: 1800,
        e: { hunger: 17, fun: 9 }
      },
      {
        id: "drink",
        name: "Cold Drink",
        price: 700,
        e: { hunger: 4, fun: 8 }
      }
    ]
  },

  {
    id: "market",
    name: "Ariaria Tech & Style",
    kind: "market",
    x: -28,
    z: -28,
    items: [
      {
        id: "tee",
        name: "Fresh Street Tee",
        price: 6500,
        e: { fun: 6, social: 2 }
      },
      {
        id: "sneakers",
        name: "Sneakers",
        price: 18000,
        e: { fun: 7, social: 4 }
      },
      {
        id: "phone",
        name: "Midrange Phone",
        price: 125000,
        e: { focus: 8, social: 7 }
      }
    ]
  },

  {
    id: "home",
    name: "Home & Living",
    kind: "home",
    x: -28,
    z: 28,
    items: [
      {
        id: "fan",
        name: "Standing Fan",
        price: 28000,
        e: { energy: 4 }
      },
      {
        id: "desk",
        name: "Work Desk",
        price: 42000,
        e: { focus: 10 }
      },
      {
        id: "bed",
        name: "Better Bed",
        price: 65000,
        e: { energy: 12 }
      }
    ]
  },

  {
    id: "style",
    name: "Glow Spa & Grooming",
    kind: "style",
    x: 0,
    z: 56,
    items: [
      {
        id: "barber",
        name: "Sharp Barber Cut",
        price: 2500,
        e: { hygiene: 12, social: 4 }
      },
      {
        id: "spa",
        name: "Spa Session",
        price: 7500,
        e: { hygiene: 28, fun: 12 }
      },
      {
        id: "gym",
        name: "Gym Session",
        price: 2500,
        e: { fitness: 4, energy: -5 }
      }
    ]
  }
];

/* =========================================================
   PLACES
   ========================================================= */

const PLACES = [
  {
    id: "home",
    name: "Your Home",
    kind: "home",
    x: -28,
    z: 28,
    color: "#55d88b"
  },
  {
    id: "job",
    name: "Job Centre",
    kind: "job",
    x: 28,
    z: -28,
    color: "#56c7ff"
  },
  {
    id: "market",
    name: "Ariaria Tech & Style",
    kind: "market",
    x: -28,
    z: -28,
    color: "#ff9445"
  },
  {
    id: "restaurant",
    name: "Mama Kemi's Kitchen",
    kind: "food",
    x: 0,
    z: -56,
    color: "#f39a52"
  },
  {
    id: "office",
    name: "Onyx Office Hub",
    kind: "office",
    x: 56,
    z: -56,
    color: "#9098ff"
  },
  {
    id: "club",
    name: "Pulse Club",
    kind: "club",
    x: 56,
    z: 0,
    color: "#c268e7"
  },
  {
    id: "hotel",
    name: "City View Hotel",
    kind: "hotel",
    x: -56,
    z: 0,
    color: "#58acff"
  },
  {
    id: "spa",
    name: "Glow Spa & Grooming",
    kind: "style",
    x: 0,
    z: 56,
    color: "#e86da8"
  },
  {
    id: "gym",
    name: "FitLife Gym",
    kind: "gym",
    x: -56,
    z: -56,
    color: "#57d5c7"
  },
  {
    id: "school",
    name: "Skill House",
    kind: "school",
    x: -56,
    z: 56,
    color: "#9cd16f"
  },
  {
    id: "hall",
    name: "Hall of Fame",
    kind: "hall",
    x: 56,
    z: 56,
    color: "#d277ff"
  }
];

/* =========================================================
   SKILLS, BUSINESSES AND VEHICLES
   ========================================================= */

const NAMES = [
  "Ada", "Chinedu", "Tolu", "Mimi", "Seyi",
  "Emeka", "Amaka", "Zainab", "Dami", "Kelechi",
  "Favour", "Ife", "Obi", "Uche", "Nneka",
  "Kunle", "Aisha", "Yomi"
];

const SKILLS = [
  "hustle",
  "charisma",
  "coding",
  "fitness",
  "cooking",
  "photography",
  "organization",
  "music"
];

const INVESTMENTS = [
  {
    id: "kiosk",
    name: "Street Kiosk",
    cost: 85000,
    income: 9000,
    req: 1
  },
  {
    id: "foodcart",
    name: "Food Cart",
    cost: 120000,
    income: 14000,
    req: 2
  },
  {
    id: "studio",
    name: "Creative Studio",
    cost: 250000,
    income: 25000,
    req: 3
  },
  {
    id: "delivery",
    name: "Delivery Hub",
    cost: 400000,
    income: 42000,
    req: 4
  },
  {
    id: "property",
    name: "Rental Property",
    cost: 800000,
    income: 76000,
    req: 5
  }
];

const VEHICLES = [
  {
    id: "feet",
    name: "Walk",
    fare: 0,
    purchase: 0,
    speed: 1,
    owned: true
  },
  {
    id: "danfo",
    name: "Danfo",
    fare: 600,
    purchase: 0,
    speed: 3,
    owned: false
  },
  {
    id: "ride",
    name: "Ride App",
    fare: 2200,
    purchase: 0,
    speed: 6,
    owned: false
  },
  {
    id: "bike",
    name: "Bike",
    fare: 0,
    purchase: 85000,
    speed: 1.55,
    owned: false
  },
  {
    id: "car",
    name: "Personal Car",
    fare: 0,
    purchase: 650000,
    speed: 1.9,
    owned: false
  }
];

/* =========================================================
   QUESTS
   ========================================================= */

const QUESTS = [
  {
    id: "job",
    title: "First Hustle",
    desc: "Complete your first paid shift or gig.",
    reward: 6000,
    xp: 45,
    done: s => s.totalEarnings > 0
  },
  {
    id: "meal",
    title: "Feed Yourself",
    desc: "Buy food and keep the day moving.",
    reward: 2500,
    xp: 18,
    done: s => s.stats.meals > 0
  },
  {
    id: "skill",
    title: "Level Up",
    desc: "Reach skill level 2 in any skill.",
    reward: 3000,
    xp: 25,
    done: s => Object.values(s.skills).some(v => v >= 2)
  },
  {
    id: "home",
    title: "Move Up",
    desc: "Upgrade your home.",
    reward: 7000,
    xp: 50,
    done: s => s.housing > 0
  },
  {
    id: "friend",
    title: "Build A Network",
    desc: "Raise a friendship to 25.",
    reward: 3500,
    xp: 28,
    done: s => Object.values(s.relationships).some(v => v >= 25)
  },
  {
    id: "business",
    title: "Small Boss",
    desc: "Own an investment.",
    reward: 12000,
    xp: 65,
    done: s => s.investments.length > 0
  },
  {
    id: "vehicle",
    title: "Find Your Motion",
    desc: "Own personal transport.",
    reward: 9000,
    xp: 40,
    done: s => s.ownedVehicles.some(id => id !== "feet")
  },
  {
    id: "wealth",
    title: "Six Figures",
    desc: "Hold at least ₦100,000 cash.",
    reward: 15000,
    xp: 55,
    done: s => s.money >= 100000
  }
];

/* =========================================================
   GAME STATE
   ========================================================= */

const state = {
  user: null,
  guest: false,
  accountEmail: "",

  name: "Guest",
  district: "Lagos",

  day: 1,
  time: 8 * 60,

  money: 25000,
  xp: 0,
  level: 1,

  housing: 0,
  rentDue: 14,

  needs: {
    hunger: 82,
    energy: 90,
    hygiene: 86,
    fun: 76,
    social: 70,
    bladder: 94,
    focus: 75
  },

  skills: Object.fromEntries(SKILLS.map(k => [k, 1])),

  career: null,
  careerLevel: 0,

  inventory: [],
  relationships: {},
  investments: [],

  vehicle: "feet",
  ownedVehicles: ["feet"],

  achievements: [],
  quest: 0,

  totalEarnings: 0,
  weeklyEarnings: 0,

  stats: {
    meals: 0,
    days: 0,
    shifts: 0,
    gigs: 0
  },

  cfg: { ...DEFAULT_CFG },

  pos: {
    x: -28,
    y: 0,
    z: 28
  },

  emote: "none",
  status: "Idle",
  activity: "Get to the Job Centre and choose a hustle.",

  run: false,

  joy: {
    active: false,
    x: 0,
    y: 0
  },

  keys: {
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  },

  jump: false,
  quality: readQuality()
};

/* =========================================================
   THREE.JS RUNTIME
   ========================================================= */

let scene;
let camera;
let renderer;
let sun;
let hemi;
let player;
let npcGroup;
let carGroup;

let last = performance.now();
let saveClock = 0;
let mapClock = 0;
let hudClock = 0;

let geoCache = new Map();
let matCache = new Map();

let npcs = [];
let cars = [];
let route = null;

let cameraState = "third";
let routePulse = 0;

let starting = false;
let gameStarted = false;
let setupComplete = false;
let inputInstalled = false;

/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function clamp(v, min = 0, max = 100) {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function fmt(v) {
  return Math.round(Number(v) || 0).toLocaleString("en-NG");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(s) {
  return String(s || "")
    .replaceAll("_", " ")
    .replace(/^./, x => x.toUpperCase());
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function on(id, eventName, handler) {
  const el = $(id);
  if (el) el.addEventListener(eventName, handler);
}

function spend(amount) {
  const value = Math.max(0, Number(amount) || 0);

  if (state.money < value) return false;

  state.money -= value;
  return true;
}

function earn(amount) {
  const value = Math.max(0, Number(amount) || 0);

  state.money += value;
  state.totalEarnings += value;
  state.weeklyEarnings += value;

  gainXP(Math.max(6, Math.round(value / 1000)));
}

function gainXP(amount) {
  state.xp += Math.max(0, Number(amount) || 0);

  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level++;

    toast(`Level ${state.level} reached.`);
  }
}

function addNeed(key, amount) {
  if (!(key in state.needs)) return;

  state.needs[key] = clamp(
    state.needs[key] + amount,
    0,
    100
  );
}

function sanitize(raw) {
  const result = { ...DEFAULT_CFG };

  if (!raw || typeof raw !== "object") {
    return result;
  }

  for (const key of Object.keys(DEFAULT_CFG)) {
    if (
      OPTIONS[key]?.values &&
      Object.prototype.hasOwnProperty.call(
        OPTIONS[key].values,
        raw[key]
      )
    ) {
      result[key] = raw[key];
    }
  }

  return result;
}

/* =========================================================
   THREE.JS GEOMETRY AND MATERIAL CACHES
   ========================================================= */

function geo(key, make) {
  if (!geoCache.has(key)) {
    geoCache.set(key, make());
  }

  return geoCache.get(key);
}

function mat(color, rough = 0.72, metal = 0, opts = {}) {
  const key = `${color}|${rough}|${metal}|${JSON.stringify(opts)}`;

  if (!matCache.has(key)) {
    matCache.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: rough,
        metalness: metal,
        ...opts
      })
    );
  }

  return matCache.get(key);
}

function box(x, y, z) {
  return geo(
    `b${x}|${y}|${z}`,
    () => new THREE.BoxGeometry(x, y, z)
  );
}

function sph(r) {
  return geo(
    `s${r}`,
    () => new THREE.SphereGeometry(r, 18, 14)
  );
}

function cyl(r1, r2, h, segments = 14) {
  return geo(
    `c${r1}|${r2}|${h}|${segments}`,
    () => new THREE.CylinderGeometry(r1, r2, h, segments)
  );
}

function capGeo(r, length) {
  return geo(
    `p${r}|${length}`,
    () => new THREE.CapsuleGeometry(r, length, 8, 12)
  );
}

function torus(r, tube, rs = 10, ts = 20, arc = Math.PI * 2) {
  return geo(
    `t${r}|${tube}|${rs}|${ts}|${arc}`,
    () => new THREE.TorusGeometry(r, tube, rs, ts, arc)
  );
}

/* =========================================================
   CHARACTER CREATION
   ========================================================= */

function createCharacter(raw, scale = 0.82) {
  const cfg = sanitize(raw);

  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const skin = mat(
    OPTIONS.skinTone.values[cfg.skinTone] || "#855033"
  );

  const hair = mat(
    OPTIONS.hairColor.values[cfg.hairColor] || "#151313"
  );

  const outfit = mat(
    OPTIONS.outfitColor.values[cfg.outfitColor] || "#315d50"
  );

  const dark = mat("#171717");
  const white = mat("#f4f1ea");

  const W =
    cfg.bodyBuild === "compact"
      ? 0.88
      : cfg.bodyBuild === "broad"
        ? 1.12
        : 1;

  const S =
    cfg.bodyBuild === "compact"
      ? 0.92
      : cfg.bodyBuild === "broad"
        ? 1.12
        : 1;

  const H =
    cfg.height === "short"
      ? 0.94
      : cfg.height === "tall"
        ? 1.07
        : 1;

  const hips = new THREE.Group();
  hips.position.y = 1.02 * H;
  root.add(hips);

  const body = new THREE.Mesh(
    capGeo(0.32 * W, 0.75 * H),
    outfit
  );

  body.scale.set(1.2 * S, 1, 0.83 * W);
  body.position.y = 0.46 * H;
  hips.add(body);

  const spine = new THREE.Group();
  spine.position.y = 0.35 * H;
  hips.add(spine);

  const neck = new THREE.Mesh(
    cyl(0.13, 0.14, 0.22, 16),
    skin
  );

  neck.position.y = 0.84 * H;
  spine.add(neck);

  const head = new THREE.Group();
  head.position.y = 1.12 * H;
  spine.add(head);

  const face = new THREE.Mesh(sph(0.36), skin);
  face.scale.set(1, 0.99, 0.93);
  head.add(face);

  for (const x of [-0.125, 0.125]) {
    const eye = new THREE.Mesh(sph(0.082), white);

    eye.scale.set(1, 0.86, 0.45);
    eye.position.set(x, 0.045, 0.325);

    head.add(eye);

    const pupil = new THREE.Mesh(sph(0.042), dark);

    pupil.scale.set(0.9, 0.95, 0.45);
    pupil.position.set(x, 0.045, 0.36);

    head.add(pupil);
  }

  const nose = new THREE.Mesh(sph(0.07), skin);

  nose.scale.set(0.7, 1, 1.2);
  nose.position.set(0, -0.04, 0.36);

  head.add(nose);

  const mouth = new THREE.Mesh(
    capGeo(0.035, 0.13),
    mat("#5b2825")
  );

  mouth.rotation.z = Math.PI / 2;
  mouth.scale.set(1, 0.6, 0.55);
  mouth.position.set(0, -0.17, 0.345);

  head.add(mouth);

  if (cfg.hairstyle !== "bald") {
    if (cfg.hairstyle === "afro") {
      const hairstyle = new THREE.Mesh(sph(0.43), hair);

      hairstyle.scale.set(1.08, 0.9, 1.08);
      hairstyle.position.y = 0.18;

      head.add(hairstyle);
    } else if (
      ["twists", "locs", "braids"].includes(cfg.hairstyle)
    ) {
      const hairstyle = new THREE.Mesh(sph(0.37), hair);

      hairstyle.scale.set(1, 0.63, 1);
      hairstyle.position.y = 0.17;

      head.add(hairstyle);

      const count =
        cfg.hairstyle === "braids"
          ? 12
          : cfg.hairstyle === "locs"
            ? 14
            : 10;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const strand = new THREE.Mesh(
          capGeo(
            0.052,
            cfg.hairstyle === "locs" ? 0.33 : 0.27
          ),
          hair
        );

        strand.position.set(
          Math.cos(angle) * 0.28,
          0.14,
          Math.sin(angle) * 0.28
        );

        head.add(strand);
      }
    } else {
      const hairstyle = new THREE.Mesh(sph(0.38), hair);

      hairstyle.scale.set(
        1,
        cfg.hairstyle === "fade" ? 0.52 : 0.63,
        1
      );

      hairstyle.position.y = 0.2;

      head.add(hairstyle);
    }
  }

  if (cfg.beard !== "none") {
    const beard = new THREE.Mesh(
      sph(cfg.beard === "full" ? 0.22 : 0.17),
      hair
    );

    beard.scale.set(1, 0.7, 0.55);
    beard.position.set(0, -0.18, 0.34);

    head.add(beard);
  }

  if (cfg.accessory === "cap") {
    const cap = new THREE.Mesh(sph(0.39), dark);

    cap.scale.set(1, 0.44, 1);
    cap.position.y = 0.29;

    head.add(cap);

    const brim = new THREE.Mesh(box(0.66, 0.04, 0.25), dark);

    brim.position.set(0, 0.22, 0.43);

    head.add(brim);
  }

  if (
    cfg.accessory === "glasses" ||
    cfg.accessory === "sunglasses"
  ) {
    const frame = mat(
      cfg.accessory === "sunglasses"
        ? "#101010"
        : "#303030"
    );

    for (const x of [-0.16, 0.16]) {
      const lens = new THREE.Mesh(box(0.18, 0.1, 0.03), frame);

      lens.position.set(x, 0.04, 0.43);

      head.add(lens);
    }

    const bridge = new THREE.Mesh(box(0.11, 0.03, 0.03), frame);

    bridge.position.set(0, 0.04, 0.43);

    head.add(bridge);
  }

  if (cfg.accessory === "chain") {
    const chain = new THREE.Mesh(
      torus(0.25, 0.022, 8, 24),
      mat("#d7aa28", 0.3, 0.8)
    );

    chain.rotation.x = Math.PI / 2;
    chain.position.set(0, -0.48, 0.4);

    root.add(chain);
  }

  if (cfg.accessory === "headphones") {
    const band = new THREE.Mesh(
      torus(0.27, 0.035, 8, 24, Math.PI),
      dark
    );

    band.position.y = 0.16;
    band.rotation.x = Math.PI / 2;

    head.add(band);
  }

  const legs = [];
  const arms = [];

  for (const x of [-0.2 * W, 0.2 * W]) {
    const leg = new THREE.Group();

    leg.position.x = x;

    hips.add(leg);

    const thigh = new THREE.Mesh(
      capGeo(0.14, 0.42 * H),
      outfit
    );

    thigh.position.y = -0.3 * H;

    leg.add(thigh);

    const shin = new THREE.Mesh(
      capGeo(0.12, 0.42 * H),
      outfit
    );

    shin.position.y = -0.75 * H;

    leg.add(shin);

    const shoe = new THREE.Mesh(
      box(0.3, 0.16, 0.5),
      dark
    );

    shoe.position.set(0, -1.06 * H, 0.1);

    leg.add(shoe);
    legs.push(leg);
  }

  for (const x of [-0.5 * S, 0.5 * S]) {
    const arm = new THREE.Group();

    arm.position.set(x, 0.62 * H, 0);

    spine.add(arm);

    const upper = new THREE.Mesh(
      capGeo(0.125, 0.36 * H),
      outfit
    );

    upper.position.y = -0.2 * H;

    arm.add(upper);

    const forearm = new THREE.Mesh(
      capGeo(0.105, 0.32 * H),
      skin
    );

    forearm.position.y = -0.57 * H;

    arm.add(forearm);

    const hand = new THREE.Mesh(sph(0.13), skin);

    hand.position.y = -0.79 * H;

    arm.add(hand);
    arms.push(arm);
  }

  return {
    root,
    hips,
    spine,
    head,
    legs,
    arms,
    cfg,
    time: Math.random() * 6
  };
}

function buildPlayer() {
  player = createCharacter(state.cfg);

  player.root.position.set(
    state.pos.x,
    state.pos.y || 0,
    state.pos.z
  );

  scene.add(player.root);
}

function rebuildPlayer() {
  if (!scene) return;

  if (!player) {
    buildPlayer();
    return;
  }

  const old = player.root;
  const position = old.position.clone();
  const rotation = old.rotation.clone();

  scene.remove(old);

  player = createCharacter(state.cfg);

  player.root.position.copy(position);
  player.root.rotation.copy(rotation);

  scene.add(player.root);

  state.pos = {
    x: position.x,
    y: position.y,
    z: position.z
  };
}

/* =========================================================
   WORLD CONSTRUCTION
   ========================================================= */

function setup() {
  if (setupComplete) return;

  const game = $("game");

  if (!game) {
    throw new Error("The #game element is missing from index.html.");
  }

  scene = new THREE.Scene();

  scene.background = new THREE.Color("#8cc2c7");
  scene.fog = new THREE.Fog("#8cc2c7", 48, 190);

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    260
  );

  renderer = new THREE.WebGLRenderer({
    antialias: state.quality !== "low",
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    state.quality === "low"
      ? 1
      : Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = state.quality !== "low";
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  game.appendChild(renderer.domElement);

  hemi = new THREE.HemisphereLight(
    "#e8ffff",
    "#3c4638",
    1.4
  );

  scene.add(hemi);

  sun = new THREE.DirectionalLight("#fff1d4", 2);

  sun.position.set(40, 80, 30);
  sun.castShadow = state.quality !== "low";
  sun.shadow.mapSize.set(1024, 1024);

  scene.add(sun);

  const world = new THREE.Group();

  scene.add(world);

  buildWorld(world);

  npcGroup = new THREE.Group();
  carGroup = new THREE.Group();

  scene.add(npcGroup);
  scene.add(carGroup);

  buildPlayer();
  buildNPCs();
  buildCars();

  buildCustomizer();
  attachInput();

  window.addEventListener("resize", resize);

  updateHUD();

  setupComplete = true;
}

function buildWorld(group) {
  const ground = new THREE.Mesh(
    box(210, 0.2, 210),
    mat("#5c6b58", 0.95)
  );

  ground.position.y = -0.1;
  ground.receiveShadow = true;

  group.add(ground);

  const asphalt = mat("#2b3331", 1);
  const stripe = mat("#d8d0a3", 0.8);

  for (let i = -3; i <= 3; i++) {
    const verticalRoad = new THREE.Mesh(
      box(13, 0.04, 210),
      asphalt
    );

    verticalRoad.position.x = i * 28;

    group.add(verticalRoad);

    const horizontalRoad = new THREE.Mesh(
      box(210, 0.04, 13),
      asphalt
    );

    horizontalRoad.position.z = i * 28;

    group.add(horizontalRoad);

    const verticalStripe = new THREE.Mesh(
      box(0.18, 0.045, 210),
      stripe
    );

    verticalStripe.position.x = i * 28;

    group.add(verticalStripe);

    const horizontalStripe = new THREE.Mesh(
      box(210, 0.045, 0.18),
      stripe
    );

    horizontalStripe.position.z = i * 28;

    group.add(horizontalStripe);
  }

  PLACES.forEach((place, index) => {
    buildPlace(group, place, index);
  });

  for (let i = 0; i < 55; i++) {
    const x = Math.random() * 180 - 90;
    const z = Math.random() * 180 - 90;

    const nearPlace = PLACES.some(
      place => Math.hypot(place.x - x, place.z - z) < 10
    );

    if (nearPlace) continue;

    const type = pick(["tree", "stall", "house", "lamp"]);

    if (type === "tree") tree(group, x, z);
    if (type === "stall") stall(group, x, z);
    if (type === "house") house(group, x, z);
    if (type === "lamp") lamp(group, x, z);
  }
}

function label(root, text, x, y, z) {
  const canvas = document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 88;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.fillStyle = "#14201F";
  ctx.fillRect(0, 0, 512, 88);

  ctx.fillStyle = "#FFC20E";
  ctx.font = "bold 38px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, 256, 44);

  const texture = new THREE.CanvasTexture(canvas);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture })
  );

  sprite.scale.set(7.3, 1.25, 1);
  sprite.position.set(x, y, z);

  root.add(sprite);
}

function buildPlace(group, place, index) {
  const building = new THREE.Group();

  building.position.set(place.x, 0, place.z);

  const base = new THREE.Mesh(
    box(11, 0.5, 9),
    mat(index % 2 ? "#b78d68" : "#b6a776")
  );

  base.position.y = 0.25;

  building.add(base);

  const walls = new THREE.Mesh(
    box(10, 6.6, 8),
    mat("#e0cfb0")
  );

  walls.position.y = 3.55;

  building.add(walls);

  const roof = new THREE.Mesh(
    box(11, 0.55, 9),
    mat(index % 2 ? "#345d58" : "#95453a")
  );

  roof.position.y = 7;

  building.add(roof);

  const door = new THREE.Mesh(
    box(1.6, 2.6, 0.22),
    mat("#503020")
  );

  door.position.set(0, 1.4, -4.12);

  building.add(door);

  label(building, place.name, 0, 5.1, -4.35);

  group.add(building);
}

function tree(group, x, z) {
  const object = new THREE.Group();

  object.position.set(x, 0, z);

  const trunk = new THREE.Mesh(
    cyl(0.25, 0.34, 2.8),
    mat("#6b4a2e")
  );

  trunk.position.y = 1.4;

  object.add(trunk);

  const leaves = new THREE.Mesh(
    sph(1.9),
    mat("#2f7145")
  );

  leaves.position.y = 3.6;

  object.add(leaves);
  group.add(object);
}

function stall(group, x, z) {
  const object = new THREE.Group();

  object.position.set(x, 0, z);

  const base = new THREE.Mesh(
    box(3, 2, 2.2),
    mat("#c48646")
  );

  base.position.y = 1;

  object.add(base);

  const roof = new THREE.Mesh(
    box(3.4, 0.2, 2.6),
    mat("#0F6B6F")
  );

  roof.position.y = 2.15;

  object.add(roof);
  group.add(object);
}

function house(group, x, z) {
  const object = new THREE.Group();

  object.position.set(x, 0, z);

  const base = new THREE.Mesh(
    box(7, 4.4, 6),
    mat("#9e8e77")
  );

  base.position.y = 2.2;

  object.add(base);

  const roof = new THREE.Mesh(
    box(7.6, 0.5, 6.6),
    mat("#4e5752")
  );

  roof.position.y = 4.6;

  object.add(roof);
  group.add(object);
}

function lamp(group, x, z) {
  const object = new THREE.Group();

  object.position.set(x, 0, z);

  const pole = new THREE.Mesh(
    cyl(0.06, 0.08, 3.5),
    mat("#333333")
  );

  pole.position.y = 1.75;

  object.add(pole);

  const bulb = new THREE.Mesh(
    sph(0.16),
    mat("#ffe28e", 0.2, 0, {
      emissive: "#ffe28e",
      emissiveIntensity: 2
    })
  );

  bulb.position.y = 3.5;

  object.add(bulb);
  group.add(object);
}

/* =========================================================
   NON-PLAYER CHARACTERS AND CARS
   ========================================================= */

function buildNPCs() {
  npcs = [];

  for (let i = 0; i < 20; i++) {
    const cfg = {
      ...DEFAULT_CFG,

      skinTone: pick(
        Object.keys(OPTIONS.skinTone.values)
      ),

      hairstyle: pick(
        Object.keys(OPTIONS.hairstyle.values)
      ),

      outfit: pick([
        "tee",
        "hoodie",
        "kaftan",
        "ankara"
      ]),

      outfitColor: pick([
        "red",
        "blue",
        "green",
        "gold",
        "teal",
        "default"
      ]),

      accessory: pick([
        "none",
        "cap",
        "glasses"
      ])
    };

    const character = createCharacter(cfg, 0.68);
    const place = pick(PLACES);

    character.root.position.set(
      place.x + Math.random() * 10 - 5,
      0,
      place.z + Math.random() * 10 - 5
    );

    npcGroup.add(character.root);

    npcs.push({
      c: character,
      name: NAMES[i % NAMES.length],
      speed: 0.35 + Math.random() * 0.8,
      target: null
    });
  }
}

function updateNPCs(dt) {
  for (const npc of npcs) {
    npc.c.time += dt;

    if (!npc.target || Math.random() < 0.008) {
      npc.target = {
        x: clamp(
          npc.c.root.position.x + Math.random() * 12 - 6,
          -90,
          90
        ),

        z: clamp(
          npc.c.root.position.z + Math.random() * 12 - 6,
          -90,
          90
        )
      };
    }

    const dx = npc.target.x - npc.c.root.position.x;
    const dz = npc.target.z - npc.c.root.position.z;
    const distance = Math.hypot(dx, dz);

    if (distance > 0.5) {
      npc.c.root.position.x +=
        (dx / distance) * npc.speed * dt;

      npc.c.root.position.z +=
        (dz / distance) * npc.speed * dt;

      npc.c.legs.forEach((leg, index) => {
        leg.rotation.x =
          Math.sin(npc.c.time * 6 + index * Math.PI) * 0.18;
      });
    }
  }
}

function buildCars() {
  cars = [];

  for (let i = 0; i < 12; i++) {
    const car = new THREE.Group();

    const body = new THREE.Mesh(
      box(2.1, 1, 4.1),
      mat(
        pick([
          "#253635",
          "#eee9dc",
          "#a9473c",
          "#d4a62e",
          "#6774ad"
        ])
      )
    );

    body.position.y = 0.62;

    car.add(body);

    const roof = new THREE.Mesh(
      box(1.55, 0.6, 2.1),
      mat("#1d2524")
    );

    roof.position.y = 1.2;

    car.add(roof);

    const axis = i % 2;
    const direction = i % 4 < 2 ? 1 : -1;

    car.position.set(
      axis
        ? Math.round(Math.random() * 6 - 3) * 28
        : Math.random() * 170 - 85,

      0,

      axis
        ? Math.random() * 170 - 85
        : Math.round(Math.random() * 6 - 3) * 28
    );

    car.userData = {
      axis,
      dir: direction,
      speed: 4 + Math.random() * 5
    };

    carGroup.add(car);
    cars.push(car);
  }
}

function updateCars(dt) {
  for (const car of cars) {
    const config = car.userData;

    if (config.axis) {
      car.position.z += config.dir * config.speed * dt;
    } else {
      car.position.x += config.dir * config.speed * dt;
    }

    const value = config.axis
      ? car.position.z
      : car.position.x;

    if (Math.abs(value) > 96) {
      if (config.axis) {
        car.position.z = -config.dir * 96;
      } else {
        car.position.x = -config.dir * 96;
      }
    }
  }
}

/* =========================================================
   INPUT AND BUTTON SETUP
   ========================================================= */

function attachInput() {
  if (inputInstalled) return;

  inputInstalled = true;

  window.addEventListener("keydown", event => {
    if (!gameStarted) return;

    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const key = event.key.toLowerCase();

    if (
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " "
      ].includes(key)
    ) {
      event.preventDefault();
    }

    if (key === "w" || key === "arrowup") {
      state.keys.up = true;
    }

    if (key === "s" || key === "arrowdown") {
      state.keys.down = true;
    }

    if (key === "a" || key === "arrowleft") {
      state.keys.left = true;
    }

    if (key === "d" || key === "arrowright") {
      state.keys.right = true;
    }

    if (key === "shift") {
      state.keys.shift = true;
    }

    if (key === " ") {
      state.jump = true;
    }

    if (key === "e") {
      interact();
    }
  });

  window.addEventListener("keyup", event => {
    const key = event.key.toLowerCase();

    if (key === "w" || key === "arrowup") {
      state.keys.up = false;
    }

    if (key === "s" || key === "arrowdown") {
      state.keys.down = false;
    }

    if (key === "a" || key === "arrowleft") {
      state.keys.left = false;
    }

    if (key === "d" || key === "arrowright") {
      state.keys.right = false;
    }

    if (key === "shift") {
      state.keys.shift = false;
    }
  });

  window.addEventListener("blur", clearMovement);

  const runButton = $("runBtn");

  if (runButton) {
    runButton.onpointerdown = () => {
      state.run = !state.run;
    };
  }

  const jumpButton = $("jumpBtn");

  if (jumpButton) {
    jumpButton.onpointerdown = () => {
      state.jump = true;
    };
  }

  const joystick = $("joystick");
  const stick = $("stick");

  if (joystick && stick) {
    const setJoystick = event => {
      const rect = joystick.getBoundingClientRect();

      let x =
        (event.clientX - (rect.left + rect.width / 2)) /
        (rect.width / 2 - 20);

      let y =
        (event.clientY - (rect.top + rect.height / 2)) /
        (rect.height / 2 - 20);

      const distance = Math.hypot(x, y);

      if (distance > 1) {
        x /= distance;
        y /= distance;
      }

      state.joy.x = x;
      state.joy.y = y;

      stick.style.transform =
        `translate(${x * 33}px, ${y * 33}px)`;
    };

    const stopJoystick = () => {
      state.joy.active = false;
      state.joy.x = 0;
      state.joy.y = 0;

      stick.style.transform = "translate(0, 0)";
    };

    joystick.addEventListener("pointerdown", event => {
      state.joy.active = true;

      try {
        joystick.setPointerCapture(event.pointerId);
      } catch {}

      setJoystick(event);
    });

    joystick.addEventListener("pointermove", event => {
      if (state.joy.active) {
        setJoystick(event);
      }
    });

    joystick.addEventListener("pointerup", stopJoystick);
    joystick.addEventListener("pointercancel", stopJoystick);
    joystick.addEventListener("lostpointercapture", stopJoystick);
  }

  on("cameraBtn", "click", () => {
    cameraState =
      cameraState === "third"
        ? "close"
        : cameraState === "close"
          ? "front"
          : "third";

    toast(`Camera: ${cameraState}`);
  });

  on("qualityBtn", "click", () => {
    state.quality =
      state.quality === "high" ? "low" : "high";

    try {
      localStorage.setItem(QUALITY_KEY, state.quality);
    } catch {}

    if (renderer) {
      renderer.setPixelRatio(
        state.quality === "high"
          ? Math.min(window.devicePixelRatio || 1, 2)
          : 1
      );

      renderer.shadowMap.enabled = state.quality === "high";
    }

    setText("qualityBtn", state.quality.toUpperCase());
  });

  on("phoneBtn", "click", () => open("Phone", "phone"));
  on("bagBtn", "click", () => open("Inventory", "inventory"));
  on("mapBtn", "click", () => open("City Map", "map"));
  on("profileBtn", "click", () => open("My Life", "profile"));
  on("homeBtn", "click", () => open("Your Home", "home"));
  on("socialBtn", "click", () => open("People", "social"));

  on("avatarBtn", "click", () => {
    if (!$("customizer")) return;

    $("customizer").classList.add("open");
    renderCustomizer();
  });

  on("emoteBtn", "click", () => {
    $("emoteMenu")?.classList.toggle("open");
  });

  document.querySelectorAll("#emoteMenu button").forEach(button => {
    button.onclick = () => {
      state.emote = button.dataset.emote || "none";
      $("emoteMenu")?.classList.remove("open");
    };
  });

  on("prompt", "click", interact);

  on("sheetClose", "click", () => {
    $("overlay")?.classList.remove("open");
  });

  on("closeCustomizer", "click", () => {
    $("customizer")?.classList.remove("open");
  });

  on("randomBtn", "click", () => {
    for (const key of Object.keys(OPTIONS)) {
      state.cfg[key] = pick(Object.keys(OPTIONS[key].values));
    }

    rebuildPlayer();
    renderCustomizer();
    saveGame();
  });

  on("saveAvatar", "click", saveAvatar);

  setText(
    "qualityBtn",
    state.quality.toUpperCase()
  );
}

function clearMovement() {
  state.keys.up = false;
  state.keys.down = false;
  state.keys.left = false;
  state.keys.right = false;
  state.keys.shift = false;

  state.joy.active = false;
  state.joy.x = 0;
  state.joy.y = 0;

  state.run = false;
}

/* =========================================================
   AVATAR CUSTOMIZER
   ========================================================= */

function buildCustomizer() {
  renderCustomizer();
}

function renderCustomizer() {
  const root = $("sections");

  if (!root) return;

  root.innerHTML = "";

  for (const [key, option] of Object.entries(OPTIONS)) {
    const section = document.createElement("section");

    section.className = "optionSection";

    const heading = document.createElement("h3");

    heading.textContent = option.label;

    section.appendChild(heading);

    const choices = document.createElement("div");

    choices.className = "options";

    for (const [id, value] of Object.entries(option.values)) {
      const button = document.createElement("button");

      button.type = "button";

      button.className = [
        "option",
        state.cfg[key] === id ? "active" : "",
        option.kind === "swatch" ? "swatch" : ""
      ].filter(Boolean).join(" ");

      if (option.kind === "swatch") {
        button.style.background = value;
        button.setAttribute("aria-label", `${option.label}: ${id}`);
        button.title = id;
      } else {
        button.textContent = value;
      }

      button.onclick = () => {
        state.cfg[key] = id;

        rebuildPlayer();
        renderCustomizer();
        saveGame();
      };

      choices.appendChild(button);
    }

    section.appendChild(choices);
    root.appendChild(section);
  }
}

async function saveAvatar() {
  try {
    localStorage.setItem(
      AVATAR_KEY,
      JSON.stringify(state.cfg)
    );

    toast("Avatar saved on this device.");
  } catch (error) {
    console.error("Could not save avatar locally:", error);
    toast("Avatar could not be saved on this device.");
    return;
  }

  if (state.user && !state.guest) {
    try {
      const { error } = await db.rpc("save_avatar", {
        p_avatar: state.cfg
      });

      if (error) throw error;

      toast("Avatar saved to your account.");
    } catch (error) {
      console.warn("Cloud avatar save failed:", error);
      toast("Avatar saved locally; cloud save was unsuccessful.");
    }
  }
}

/* =========================================================
   GAME TIME, NEEDS AND RENT
   ========================================================= */

function advanceTime(minutes) {
  let remaining = Number(minutes);

  if (!Number.isFinite(remaining) || remaining <= 0) {
    return;
  }

  while (remaining > 0) {
    const untilMidnight = 1440 - state.time;

    if (remaining < untilMidnight) {
      state.time += remaining;
      remaining = 0;
    } else {
      remaining -= untilMidnight;

      state.time = 0;
      state.day++;

      state.stats.days++;
      state.rentDue--;

      dailyTick();
    }
  }
}

function dailyTick() {
  addNeed("hunger", -7);
  addNeed("hygiene", -4);
  addNeed("fun", -3);
  addNeed("social", -3);
  addNeed("bladder", 16);
  addNeed("energy", 22);
  addNeed("focus", 18);

  if (state.day % 7 === 0) {
    weeklyTick();
  }

  if (state.rentDue <= 0) {
    payRent();
  }
}

function weeklyTick() {
  state.weeklyEarnings = 0;

  let passive = 0;

  for (const id of state.investments) {
    const investment = INVESTMENTS.find(item => item.id === id);

    if (investment) {
      passive += investment.income;
    }
  }

  if (passive > 0) {
    earn(passive);
    toast(`Business week: +₦${fmt(passive)} income.`);
  }
}

function payRent() {
  const home = HOUSING[state.housing];

  if (!home) return;

  if (spend(home.rent)) {
    state.rentDue = 14;

    addNeed("fun", 4);

    toast(`Rent paid: ₦${fmt(home.rent)}.`);
  } else {
    state.rentDue = 3;

    addNeed("fun", -15);
    addNeed("energy", -10);

    toast(`Rent problem: ₦${fmt(home.rent)} due. Earn fast.`);
  }
}

function currentClock() {
  const h = Math.floor(state.time / 60) % 24;
  const m = Math.floor(state.time % 60);

  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;

  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

function mood() {
  const values = Object.values(state.needs);

  const average =
    values.reduce((sum, value) => sum + value, 0) /
    Math.max(values.length, 1);

  if (average >= 80) return "Thriving";
  if (average >= 60) return "Doing Fine";
  if (average >= 40) return "Stressed";
  if (average >= 20) return "Struggling";

  return "Emergency";
}

/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(dt) {
  if (!player) return;

  let ix =
    (state.keys.right ? 1 : 0) -
    (state.keys.left ? 1 : 0);

  let iz =
    (state.keys.down ? 1 : 0) -
    (state.keys.up ? 1 : 0);

  if (state.joy.active) {
    ix = state.joy.x;
    iz = state.joy.y;
  }

  const moving = Math.hypot(ix, iz) > 0.12;

  let speed =
    state.run || state.keys.shift
      ? 7.1
      : 3.6;

  if (state.vehicle === "bike") speed *= 1.55;
  if (state.vehicle === "car") speed *= 1.9;

  if (moving) {
    const length = Math.hypot(ix, iz);

    ix /= length;
    iz /= length;

    player.root.position.x = clamp(
      player.root.position.x + ix * speed * dt,
      -96,
      96
    );

    player.root.position.z = clamp(
      player.root.position.z + iz * speed * dt,
      -96,
      96
    );

    player.root.rotation.y = Math.atan2(ix, iz);

    player.legs.forEach((leg, index) => {
      leg.rotation.x =
        Math.sin(performance.now() / 80 + index * Math.PI) * 0.3;
    });

    state.status =
      state.run || state.keys.shift
        ? "Running"
        : "Walking";

    addNeed(
      "energy",
      -(state.run || state.keys.shift ? 2.2 : 1) * dt
    );

    addNeed("hunger", -0.18 * dt);
    addNeed("hygiene", -0.08 * dt);
    addNeed("bladder", -0.06 * dt);
  } else {
    state.status =
      state.emote !== "none"
        ? state.emote
        : "Idle";

    player.legs.forEach(leg => {
      leg.rotation.x *= 0.8;
    });
  }

  if (state.jump) {
    state.jump = false;

    if (player.root.position.y <= 0.02) {
      player.root.userData.vy = 6;
    }
  }

  player.root.userData.vy =
    player.root.userData.vy || 0;

  if (
    player.root.position.y > 0 ||
    player.root.userData.vy > 0
  ) {
    player.root.userData.vy -= 17 * dt;

    player.root.position.y +=
      player.root.userData.vy * dt;

    if (player.root.position.y < 0) {
      player.root.position.y = 0;
      player.root.userData.vy = 0;
    }
  }

  advanceTime(dt * 1.1);
}

/* =========================================================
   LIGHTING, CAMERA AND LOCATION PROMPT
   ========================================================= */

function updateWorldLight() {
  if (!scene || !sun || !hemi) return;

  const hour = state.time / 60;

  const sunY = Math.sin(
    ((hour - 6) / 12) * Math.PI
  );

  const light = clamp(
    (sunY + 0.1) * 1.15,
    0,
    1
  );

  sun.position.set(40, 20 + sunY * 65, 30);

  sun.intensity = 0.55 + 1.8 * light;
  hemi.intensity = 0.55 + 1.05 * light;

  const sky = new THREE.Color(
    light > 0.45 ? "#8cc2c7" : "#17282e"
  );

  scene.background.lerp(sky, 0.05);
  scene.fog.color.copy(scene.background);
}

function updateCamera(dt) {
  if (!player || !camera) return;

  const position = player.root.position;

  const distance =
    cameraState === "close" ? 5.4 : 8.5;

  const offset = new THREE.Vector3(
    Math.sin(performance.now() / 100000) * distance,
    4,
    Math.cos(performance.now() / 100000) * distance
  );

  if (cameraState === "front") {
    offset.multiplyScalar(-1);
  }

  camera.position.lerp(
    new THREE.Vector3(
      position.x + offset.x,
      position.y + offset.y,
      position.z + offset.z
    ),
    Math.min(1, dt * 5)
  );

  camera.lookAt(
    position.x,
    position.y + 1.02,
    position.z
  );
}

function nearestPlace() {
  if (!player) {
    return { p: null, d: Infinity };
  }

  let best = null;
  let distance = Infinity;

  for (const place of PLACES) {
    const currentDistance = Math.hypot(
      player.root.position.x - place.x,
      player.root.position.z - place.z
    );

    if (currentDistance < distance) {
      distance = currentDistance;
      best = place;
    }
  }

  return {
    p: best,
    d: distance
  };
}

function updatePrompt() {
  const prompt = $("prompt");

  if (!prompt || !player) return;

  const { p, d } = nearestPlace();

  if (p && d < 11) {
    prompt.style.display = "block";
    prompt.textContent = `Enter ${p.name}`;
  } else {
    prompt.style.display = "none";
  }
}

function toast(message) {
  state.activity = String(message || "");
}

/* =========================================================
   GAME PANELS
   ========================================================= */

function open(title, mode) {
  setText("sheetEyebrow", "NAIJA HUSTLE");
  setText("sheetTitle", title);

  $("overlay")?.classList.add("open");

  render(mode);
}

function bindActions() {
  const body = $("sheetBody");

  if (!body) return;

  body.querySelectorAll("[data-action]").forEach(button => {
    button.onclick = () => {
      handleAction(
        button.dataset.action,
        button.dataset.id
      );
    };
  });
}

function render(mode) {
  const body = $("sheetBody");

  if (!body) return;

  if (mode === "phone") {
    body.innerHTML = renderPhone();
  } else if (mode === "inventory") {
    body.innerHTML = renderInventory();
  } else if (mode === "map") {
    body.innerHTML = renderMap();
  } else if (mode === "profile") {
    body.innerHTML = renderProfile();
  } else if (mode === "home") {
    body.innerHTML = renderHome();
  } else if (mode === "social") {
    body.innerHTML = renderSocial();
  } else if (mode === "jobs") {
    body.innerHTML = renderJobs();
  } else if (mode === "gigs") {
    body.innerHTML = renderGigs();
  } else if (mode === "business") {
    body.innerHTML = renderBusiness();
  } else if (mode === "transport") {
    body.innerHTML = renderTransport();
  } else if (mode === "housing") {
    body.innerHTML = renderHousing();
  } else if (mode && mode.startsWith("shop")) {
    body.innerHTML = renderShop(mode);
  } else if (mode === "skills") {
    body.innerHTML = renderSkills();
  } else {
    body.innerHTML = renderPhone();
  }

  bindActions();
}

function refreshOpen(mode) {
  render(mode);
}

function renderPhone() {
  return `
    <div class="stats">
      <div class="stat">
        <strong>₦${fmt(state.money)}</strong>
        <span>WALLET</span>
      </div>

      <div class="stat">
        <strong>Day ${state.day}</strong>
        <span>TIME</span>
      </div>

      <div class="stat">
        <strong>${mood()}</strong>
        <span>MOOD</span>
      </div>

      <div class="stat">
        <strong>${state.rentDue}</strong>
        <span>DAYS TO RENT</span>
      </div>
    </div>

    <div class="grid">
      <article class="card">
        <h3>Work</h3>
        <p>Pick a career, train skills and work shifts.</p>

        <div class="actions">
          <button class="action primary"
            data-action="open" data-id="jobs">
            Careers
          </button>

          <button class="action"
            data-action="open" data-id="gigs">
            Gigs
          </button>
        </div>
      </article>

      <article class="card">
        <h3>Life</h3>
        <p>Keep needs balanced and improve your home.</p>

        <div class="actions">
          <button class="action primary"
            data-action="open" data-id="home">
            Home
          </button>

          <button class="action"
            data-action="open" data-id="skills">
            Train
          </button>
        </div>
      </article>

      <article class="card">
        <h3>Money</h3>
        <p>Buy things, transport, and eventually a business.</p>

        <div class="actions">
          <button class="action primary"
            data-action="open" data-id="business">
            Business
          </button>

          <button class="action"
            data-action="open" data-id="transport">
            Transport
          </button>
        </div>
      </article>

      <article class="card">
        <h3>People</h3>
        <p>Meet locals and build useful relationships.</p>

        <div class="actions">
          <button class="action primary"
            data-action="open" data-id="social">
            Social
          </button>
        </div>
      </article>
    </div>
  `;
}

function renderJobs() {
  return `
    <div class="grid">
      ${CAREERS.map(career => {
        const current = state.career === career.id;
        const skill = state.skills[career.skill] || 1;

        const careerLevel = current
          ? state.careerLevel
          : 0;

        const pay =
          career.pay +
          Math.max(0, skill - 1) * career.levelPay +
          careerLevel * 1300;

        return `
          <article class="card">
            <h3>${career.name}</h3>
            <p>${career.desc}</p>

            <div class="meta">
              Skill: ${cap(career.skill)} Lv ${skill}
              · Pay about ₦${fmt(pay)}
            </div>

            <div class="actions">
              <button class="action primary"
                data-action="career"
                data-id="${career.id}">
                ${current ? "Work Shift" : "Choose"}
              </button>

              <button class="action"
                data-action="train"
                data-id="${career.skill}">
                Train
              </button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderGigs() {
  return `
    <div class="grid">
      ${GIGS.map(gig => `
        <article class="card">
          <h3>${gig.name}</h3>

          <p>
            Cost ₦${fmt(gig.cost)}
            · ${gig.min} game minutes
            · ${cap(gig.skill)} Lv ${state.skills[gig.skill] || 1}
          </p>

          <div class="meta">
            Reward ₦${fmt(gig.reward)}
          </div>

          <div class="actions">
            <button class="action primary"
              data-action="gig"
              data-id="${gig.id}">
              Take Gig
            </button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderHome() {
  const home = HOUSING[state.housing];

  return `
    <div class="stats">
      <div class="stat">
        <strong>${home.name}</strong>
        <span>HOME</span>
      </div>

      <div class="stat">
        <strong>₦${fmt(home.rent)}</strong>
        <span>RENT / 14 DAYS</span>
      </div>

      <div class="stat">
        <strong>${home.comfort}</strong>
        <span>COMFORT</span>
      </div>

      <div class="stat">
        <strong>${state.rentDue}</strong>
        <span>DAYS LEFT</span>
      </div>
    </div>

    <div class="grid">
      <article class="card">
        <h3>Rest</h3>
        <p>Sleep and recover energy.</p>

        <div class="actions">
          <button class="action primary" data-action="rest">
            Sleep
          </button>
        </div>
      </article>

      <article class="card">
        <h3>Bathroom</h3>
        <p>Restore hygiene and bladder.</p>

        <div class="actions">
          <button class="action primary" data-action="bath">
            Use Bathroom
          </button>
        </div>
      </article>

      <article class="card">
        <h3>Cook</h3>
        <p>Make a simple meal at home.</p>

        <div class="actions">
          <button class="action primary" data-action="cook">
            Cook Meal · ₦600
          </button>
        </div>
      </article>

      <article class="card">
        <h3>Upgrade</h3>
        <p>Move to the next home when you can afford it.</p>

        <div class="actions">
          <button class="action primary" data-action="upgrade">
            View Homes
          </button>
        </div>
      </article>
    </div>
  `;
}

function renderHousing() {
  return `
    <div class="grid">
      ${HOUSING.map((home, index) => {
        const isCurrent = index === state.housing;
        const isNext = index === state.housing + 1;
        const disabled = !isNext;

        return `
          <article class="card">
            <h3>${home.name} · ${home.area}</h3>
            <p>${home.desc}</p>

            <div class="meta">
              Move ₦${fmt(home.move)}
              · Rent ₦${fmt(home.rent)} / 14 days
            </div>

            <div class="actions">
              <button
                class="action primary"
                data-action="move"
                data-id="${index}"
                ${disabled ? "disabled" : ""}>
                ${isCurrent ? "Current Home" : isNext ? "Move Here" : "Upgrade Previous Home First"}
              </button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderShop(mode) {
  let shops = SHOPS;

  if (mode === "shop-food") {
    shops = SHOPS.filter(shop => shop.id === "food");
  } else if (mode === "shop-market") {
    shops = SHOPS.filter(shop => shop.id === "market");
  } else if (mode === "shop-style") {
    shops = SHOPS.filter(shop => shop.id === "style");
  } else if (mode === "shop-home") {
    shops = SHOPS.filter(shop => shop.id === "home");
  }

  return shops.map(shop => `
    <div class="sectionBlock">
      <h3>${shop.name}</h3>

      <div class="grid">
        ${shop.items.map(item => `
          <article class="card">
            <h3>${item.name}</h3>

            <div class="meta">
              ₦${fmt(item.price)}
            </div>

            <p>
              ${Object.entries(item.e)
                .map(([key, value]) =>
                  `${value > 0 ? "+" : ""}${value} ${cap(key)}`
                )
                .join(" · ")}
            </p>

            <div class="actions">
              <button
                class="action primary"
                data-action="item"
                data-id="${item.id}">
                Buy
              </button>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function renderInventory() {
  const counts = {};

  state.inventory.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  const names = Object.fromEntries(
    SHOPS.flatMap(shop =>
      shop.items.map(item => [item.id, item.name])
    )
  );

  names.home_meal = "Home-cooked Meal";

  const entries = Object.entries(counts);

  return `
    <div class="list">
      ${entries.map(([id, count]) => `
        <div class="listRow">
          <b>${names[id] || cap(id)}</b>
          <span>x${count}</span>
        </div>
      `).join("") ||
        `<div class="placeholder">Your bag is empty.</div>`
      }
    </div>
  `;
}

function renderTransport() {
  return `
    <div class="grid">
      ${VEHICLES.map(vehicle => {
        const isOwned = state.ownedVehicles.includes(vehicle.id);
        const isActive = state.vehicle === vehicle.id;

        let label;

        if (isActive) {
          label = "Active";
        } else if (vehicle.purchase && isOwned) {
          label = "Use";
        } else if (vehicle.purchase) {
          label = "Buy & Use";
        } else if (vehicle.fare) {
          label = "Pay Fare";
        } else {
          label = "Use";
        }

        return `
          <article class="card">
            <h3>${vehicle.name}</h3>

            <p>
              ${vehicle.fare ? `Fare around ₦${fmt(vehicle.fare)}` : ""}
              ${vehicle.purchase
                ? `${vehicle.fare ? " · " : ""}Buy ₦${fmt(vehicle.purchase)}`
                : ""}
            </p>

            <div class="meta">
              ${vehicle.purchase && isOwned
                ? "Owned"
                : vehicle.fare
                  ? "One-time ride"
                  : vehicle.id === "feet"
                    ? "Always available"
                    : "Personal transport"}
            </div>

            <div class="actions">
              <button
                class="action primary"
                data-action="vehicle"
                data-id="${vehicle.id}"
                ${isActive ? "disabled" : ""}>
                ${label}
              </button>
            </div>
          </article>
        `;
      }).join("")}
    </div>

    <p class="muted">
      To use Danfo or a ride app, set a destination on the City Map first.
    </p>
  `;
}

function renderBusiness() {
  return `
    <div class="grid">
      ${INVESTMENTS.map(investment => `
        <article class="card">
          <h3>${investment.name}</h3>

          <p>
            Investment ₦${fmt(investment.cost)}
            · Weekly income ₦${fmt(investment.income)}
            · Requires level ${investment.req}.
          </p>

          <div class="actions">
            <button class="action primary"
              data-action="business"
              data-id="${investment.id}"
              ${state.investments.includes(investment.id) ? "disabled" : ""}>
              ${state.investments.includes(investment.id)
                ? "Owned"
                : "Invest"}
            </button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSkills() {
  return `
    <div class="grid">
      ${SKILLS.map(skill => `
        <article class="card">
          <h3>${cap(skill)}</h3>

          <p>Level ${state.skills[skill]} / 5</p>

          <div class="actions">
            <button class="action primary"
              data-action="train"
              data-id="${skill}"
              ${state.skills[skill] >= 5 ? "disabled" : ""}>
              Train · ₦${fmt(450 + state.skills[skill] * 400)}
            </button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSocial() {
  return `
    <div class="grid">
      ${npcs.slice(0, 12).map(npc => `
        <article class="card">
          <h3>${npc.name}</h3>

          <p>
            Friendship
            ${Math.round(state.relationships[npc.name] || 0)}
            / 100
          </p>

          <div class="actions">
            <button class="action primary"
              data-action="talk"
              data-id="${npc.name}">
              Talk
            </button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderMap() {
  return `
    <div class="grid">
      ${PLACES.map(place => {
        const distance = player
          ? Math.round(
              Math.hypot(
                player.root.position.x - place.x,
                player.root.position.z - place.z
              )
            )
          : 0;

        return `
          <article class="card">
            <h3>${place.name}</h3>
            <p>${distance}m away.</p>

            <div class="actions">
              <button class="action primary"
                data-action="route"
                data-id="${place.id}">
                Set Route
              </button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderProfile() {
  const quest = QUESTS[state.quest];

  const careerName = state.career
    ? CAREERS.find(c => c.id === state.career)?.name || state.career
    : "No career";

  return `
    <div class="stats">
      <div class="stat">
        <strong>Lv ${state.level}</strong>
        <span>PLAYER</span>
      </div>

      <div class="stat">
        <strong>₦${fmt(state.totalEarnings)}</strong>
        <span>LIFETIME EARNINGS</span>
      </div>

      <div class="stat">
        <strong>${careerName}</strong>
        <span>CAREER</span>
      </div>

      <div class="stat">
        <strong>${state.investments.length}</strong>
        <span>BUSINESSES</span>
      </div>
    </div>

    <div class="sectionBlock">
      <h3>Current Quest</h3>

      <div class="card">
        <h3>${quest?.title || "All starter quests complete"}</h3>
        <p>${quest?.desc || "Keep building your life."}</p>
      </div>
    </div>

    <div class="sectionBlock">
      <h3>Skills</h3>

      <div class="list">
        ${SKILLS.map(skill => `
          <div class="listRow">
            <b>${cap(skill)}</b>
            <span>Lv ${state.skills[skill]}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="sectionBlock">
      <h3>Transport</h3>

      <div class="list">
        ${state.ownedVehicles.map(id => {
          const vehicle = VEHICLES.find(v => v.id === id);

          return `
            <div class="listRow">
              <b>${vehicle?.name || cap(id)}</b>
              <span>${state.vehicle === id ? "Active" : "Owned"}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <div class="actions">
      <button class="action" data-action="logout">
        SIGN OUT
      </button>
    </div>
  `;
}

/* =========================================================
   ACTION ROUTER
   ========================================================= */

function handleAction(action, id) {
  if (action === "open") {
    const modes = {
      jobs: "jobs",
      gigs: "gigs",
      home: "home",
      skills: "skills",
      business: "business",
      transport: "transport",
      social: "social"
    };

    const mode = modes[id] || "phone";

    setText("sheetTitle", cap(id));
    render(mode);

    return;
  }

  if (action === "career") doCareer(id);
  else if (action === "gig") doGig(id);
  else if (action === "train") train(id);
  else if (action === "upgrade") upgradeHomeMenu();
  else if (action === "move") moveHome(Number(id));
  else if (action === "rest") rest();
  else if (action === "bath") bath();
  else if (action === "cook") cook();
  else if (action === "item") buyItem(id);
  else if (action === "vehicle") useVehicle(id);
  else if (action === "business") buyBusiness(id);
  else if (action === "talk") talk(id);
  else if (action === "route") setRoute(id);
  else if (action === "logout") signOut();
}

function upgradeHomeMenu() {
  setText("sheetTitle", "Housing");
  render("housing");
}

/* =========================================================
   CAREERS, GIGS AND TRAINING
   ========================================================= */

function doCareer(id) {
  const career = CAREERS.find(item => item.id === id);

  if (!career) return;

  if (state.career !== id) {
    state.career = id;
    state.careerLevel = 1;

    toast(`Career selected: ${career.name}.`);

    saveGame();
    updateHUD();
    refreshOpen("jobs");

    return;
  }

  const skill = state.skills[career.skill] || 1;

  if (
    state.needs.energy < 28 ||
    state.needs.focus < 20
  ) {
    toast("You need more energy and focus before a full shift.");
    return;
  }

  const pay =
    career.pay +
    (skill - 1) * career.levelPay +
    Math.floor(state.careerLevel) * 1300 +
    (mood() === "Thriving" ? 1200 : 0);

  earn(pay);

  state.stats.shifts++;

  advanceTime(120);

  addNeed("energy", -19);
  addNeed("hunger", -12);
  addNeed("focus", -10);
  addNeed("fun", -6);

  state.careerLevel = Math.min(
    5,
    state.careerLevel + (skill >= state.careerLevel ? 0.15 : 0)
  );

  toast(`Shift complete: +₦${fmt(pay)}.`);

  checkQuest();
  saveGame();
  updateHUD();
  refreshOpen("jobs");
}

function doGig(id) {
  const gig = GIGS.find(item => item.id === id);

  if (!gig) return;

  if (
    state.needs.energy < 15 ||
    state.needs.focus < 15
  ) {
    toast("You need more energy and focus to take this gig.");
    return;
  }

  if (!spend(gig.cost)) {
    toast("Not enough money for the gig costs.");
    return;
  }

  const reward =
    gig.reward +
    (state.skills[gig.skill] - 1) * 700;

  earn(reward);

  state.stats.gigs++;

  advanceTime(gig.min);

  addNeed("energy", -10);
  addNeed("hunger", -7);
  addNeed("focus", -8);

  toast(`Gig complete: +₦${fmt(reward)}.`);

  checkQuest();
  saveGame();
  updateHUD();
  refreshOpen("gigs");
}

function hasSkill(key) {
  return Object.prototype.hasOwnProperty.call(
    state.skills,
    key
  );
}

function train(key) {
  if (!hasSkill(key)) return;

  if (state.skills[key] >= 5) {
    toast(`${cap(key)} is already at the maximum level.`);
    return;
  }

  if (
    state.needs.energy < 20 ||
    state.needs.focus < 20
  ) {
    toast("Too tired to train. Rest first.");
    return;
  }

  const cost = 450 + state.skills[key] * 400;

  if (!spend(cost)) {
    toast("Not enough money.");
    return;
  }

  state.skills[key]++;

  advanceTime(60);

  addNeed("energy", -13);
  addNeed("focus", -8);

  gainXP(22);

  toast(`${cap(key)} is now level ${state.skills[key]}.`);

  checkQuest();
  saveGame();
  updateHUD();
  refreshOpen("skills");
}

/* =========================================================
   HOME AND NEEDS ACTIONS
   ========================================================= */

function moveHome(index) {
  if (
    !Number.isInteger(index) ||
    index !== state.housing + 1 ||
    !HOUSING[index]
  ) {
    toast("You can move one step at a time.");
    return;
  }

  const home = HOUSING[index];

  if (!spend(home.move)) {
    toast(`You need ₦${fmt(home.move)}.`);
    return;
  }

  state.housing = index;
  state.rentDue = 14;

  addNeed("energy", 8);
  addNeed("hygiene", 8);

  gainXP(45);

  toast(`Moved into ${home.name}.`);

  checkQuest();
  saveGame();
  updateHUD();
  upgradeHomeMenu();
}

function rest() {
  const home = HOUSING[state.housing];

  const energyGain = home.comfort * 0.32;

  advanceTime(360);

  addNeed("energy", energyGain);
  addNeed("focus", 22);
  addNeed("fun", 8);
  addNeed("hunger", -5);

  state.status = "Resting";

  toast("You slept and recovered.");

  saveGame();
  updateHUD();
  refreshOpen("home");
}

function bath() {
  advanceTime(35);

  addNeed("hygiene", 38);
  addNeed("bladder", 30);
  addNeed("energy", -2);

  toast("Freshened up.");

  saveGame();
  updateHUD();
  refreshOpen("home");
}

function cook() {
  if (!spend(600)) {
    toast("You need ₦600 for ingredients.");
    return;
  }

  state.inventory.push("home_meal");
  state.stats.meals++;

  advanceTime(35);

  addNeed("hunger", 30);
  addNeed("fun", 3);

  toast("Meal ready.");

  checkQuest();
  saveGame();
  updateHUD();
  refreshOpen("home");
}

function buyItem(id) {
  const item = SHOPS
    .flatMap(shop => shop.items)
    .find(item => item.id === id);

  if (!item) return;

  if (!spend(item.price)) {
    toast("Not enough money.");
    return;
  }

  state.inventory.push(item.id);

  for (const [key, value] of Object.entries(item.e)) {
    if (key in state.needs) {
      addNeed(key, value);
    }
  }

  if (item.id === "gym") {
    state.skills.fitness = Math.min(
      5,
      state.skills.fitness + 1
    );
  }

  if (["jollof", "shawarma", "drink"].includes(item.id)) {
    state.stats.meals++;
  }

  advanceTime(20);

  gainXP(6);

  toast(`Bought ${item.name}.`);

  checkQuest();
  saveGame();
  updateHUD();
  refreshCurrentShop(id);
}

function refreshCurrentShop(id) {
  const item = SHOPS
    .flatMap(shop => shop.items)
    .find(entry => entry.id === id);

  if (!item) return;

  const shop = SHOPS.find(entry =>
    entry.items.some(product => product.id === id)
  );

  if (shop) {
    refreshOpen(`shop-${shop.id}`);
  }
}

/* =========================================================
   PERSONAL TRANSPORT AND FARES
   ========================================================= */

function useVehicle(id) {
  const vehicle = VEHICLES.find(item => item.id === id);

  if (!vehicle) return;

  if (vehicle.id === "feet") {
    state.vehicle = "feet";

    toast("You are travelling on foot.");

    saveGame();
    updateHUD();
    render("transport");

    return;
  }

  if (vehicle.fare > 0) {
    if (!route) {
      toast("Set a destination on the City Map first.");
      return;
    }

    if (!spend(vehicle.fare)) {
      toast(`You need ₦${fmt(vehicle.fare)} for the ride.`);
      return;
    }

    const destination = route;

    if (player) {
      player.root.position.set(
        destination.x,
        0,
        destination.z
      );

      state.pos = {
        x: destination.x,
        y: 0,
        z: destination.z
      };
    }

    route = null;

    advanceTime(20);

    addNeed("energy", 4);

    toast(`Arrived at ${destination.name} by ${vehicle.name}.`);

    saveGame();
    updateHUD();
    render("transport");

    return;
  }

  const alreadyOwned = state.ownedVehicles.includes(id);

  if (!alreadyOwned) {
    if (!spend(vehicle.purchase)) {
      toast(`You need ₦${fmt(vehicle.purchase)}.`);
      return;
    }

    state.ownedVehicles.push(id);

    toast(`${vehicle.name} purchased.`);
  }

  state.vehicle = id;

  checkQuest();

  saveGame();
  updateHUD();
  render("transport");
}

/* =========================================================
   BUSINESSES, SOCIAL AND MAP ROUTES
   ========================================================= */

function buyBusiness(id) {
  const investment = INVESTMENTS.find(item => item.id === id);

  if (!investment) return;

  if (state.investments.includes(id)) {
    toast("You already own this business.");
    return;
  }

  if (state.level < investment.req) {
    toast(`Reach player level ${investment.req}.`);
    return;
  }

  if (!spend(investment.cost)) {
    toast(`You need ₦${fmt(investment.cost)}.`);
    return;
  }

  state.investments.push(id);

  gainXP(60);

  toast(`${investment.name} is now part of your hustle.`);

  checkQuest();
  saveGame();
  updateHUD();
  render("business");
}

function talk(name) {
  state.relationships[name] = clamp(
    (state.relationships[name] || 0) + 8
  );

  advanceTime(15);

  addNeed("social", 10);
  addNeed("fun", 4);

  gainXP(8);

  toast(`You and ${name} connected.`);

  checkQuest();
  saveGame();
  updateHUD();
  render("social");
}

function setRoute(id) {
  const place = PLACES.find(item => item.id === id);

  if (!place) return;

  route = place;
  routePulse = 0;

  toast(`Route set: ${place.name}.`);

  $("overlay")?.classList.remove("open");
}

function interact() {
  const { p, d } = nearestPlace();

  if (!p || d > 11) return;

  if (p.kind === "job") {
    open(p.name, "jobs");
  } else if (p.kind === "home") {
    open(p.name, "home");
  } else if (p.kind === "market") {
    open(p.name, "shop-market");
  } else if (p.kind === "food") {
    open(p.name, "shop-food");
  } else if (p.kind === "style") {
    open(p.name, "shop-style");
  } else if (p.kind === "gym") {
    open(p.name, "skills");
  } else if (p.kind === "office") {
    open(p.name, "business");
  } else if (p.kind === "hall") {
    open(p.name, "profile");
  } else if (
    p.kind === "club" ||
    p.kind === "hotel" ||
    p.kind === "school"
  ) {
    open(p.name, "social");
  }
}

/* =========================================================
   QUEST PROGRESSION
   ========================================================= */

function checkQuest() {
  while (state.quest < QUESTS.length) {
    const quest = QUESTS[state.quest];

    if (!quest || !quest.done(state)) {
      break;
    }

    if (state.achievements.includes(quest.id)) {
      state.quest++;
      continue;
    }

    state.achievements.push(quest.id);

    state.money += quest.reward;

    gainXP(quest.xp);

    state.quest++;

    toast(
      `Quest complete: ${quest.title} · +₦${fmt(quest.reward)}.`
    );
  }
}

/* =========================================================
   SAVE AND LOAD
   ========================================================= */

function saveGame() {
  const copy = { ...state };

  copy.user = null;
  copy.accountEmail = "";
  copy.guest = false;

  copy.needs = { ...state.needs };
  copy.skills = { ...state.skills };
  copy.relationships = { ...state.relationships };
  copy.stats = { ...state.stats };
  copy.cfg = { ...state.cfg };
  copy.inventory = [...state.inventory];
  copy.investments = [...state.investments];
  copy.achievements = [...state.achievements];
  copy.ownedVehicles = [...state.ownedVehicles];

  if (player) {
    copy.pos = {
      x: player.root.position.x,
      y: player.root.position.y,
      z: player.root.position.z
    };
  } else {
    copy.pos = { ...state.pos };
  }

  copy.keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  };

  copy.joy = {
    active: false,
    x: 0,
    y: 0
  };

  copy.run = false;
  copy.jump = false;

  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(copy)
    );
  } catch (error) {
    console.warn("Could not save game locally:", error);
  }
}

function loadLocalGame() {
  let saved = null;

  try {
    const raw = localStorage.getItem(SAVE_KEY);

    if (raw) {
      saved = JSON.parse(raw);
    }
  } catch (error) {
    console.warn("Local save could not be loaded:", error);
  }

  const authenticatedUser = state.user;
  const guestMode = state.guest;
  const quality = readQuality();

  if (saved && typeof saved === "object") {
    Object.assign(state, saved);
  }

  // Restore runtime-only values so a saved object cannot
  // accidentally replace authentication or input state.
  state.user = authenticatedUser;
  state.guest = guestMode;
  state.quality = quality;

  state.accountEmail = authenticatedUser?.email || "";

  state.name =
    typeof state.name === "string" && state.name.trim()
      ? state.name
      : "Guest";

  state.district =
    typeof state.district === "string" && state.district.trim()
      ? state.district
      : "Lagos";

  state.day = Math.max(1, Math.floor(Number(state.day) || 1));

  state.time = clamp(
    Number(state.time) || 480,
    0,
    1439.999
  );

  state.money = Math.max(0, Number(state.money) || 0);

  state.xp = Math.max(0, Number(state.xp) || 0);

  state.level = Math.max(1, Math.floor(Number(state.level) || 1));

  state.housing = clamp(
    Math.floor(Number(state.housing) || 0),
    0,
    HOUSING.length - 1
  );

  state.rentDue = Math.max(
    1,
    Math.floor(Number(state.rentDue) || 14)
  );

  state.needs = {
    hunger: 82,
    energy: 90,
    hygiene: 86,
    fun: 76,
    social: 70,
    bladder: 94,
    focus: 75,
    ...(state.needs || {})
  };

  for (const key of Object.keys(state.needs)) {
    state.needs[key] = clamp(state.needs[key]);
  }

  state.skills = {
    ...Object.fromEntries(SKILLS.map(key => [key, 1])),
    ...(state.skills || {})
  };

  for (const key of SKILLS) {
    state.skills[key] = clamp(
      Math.floor(Number(state.skills[key]) || 1),
      1,
      5
    );
  }

  state.cfg = sanitize(state.cfg);

  state.relationships =
    state.relationships &&
    typeof state.relationships === "object"
      ? state.relationships
      : {};

  state.inventory = Array.isArray(state.inventory)
    ? state.inventory
    : [];

  state.investments = Array.isArray(state.investments)
    ? state.investments.filter(id =>
        INVESTMENTS.some(item => item.id === id)
      )
    : [];

  state.achievements = Array.isArray(state.achievements)
    ? state.achievements
    : [];

  state.ownedVehicles = Array.isArray(state.ownedVehicles)
    ? state.ownedVehicles.filter(id =>
        VEHICLES.some(vehicle => vehicle.id === id)
      )
    : ["feet"];

  if (!state.ownedVehicles.includes("feet")) {
    state.ownedVehicles.unshift("feet");
  }

  if (
    state.vehicle === "bike" ||
    state.vehicle === "car"
  ) {
    if (!state.ownedVehicles.includes(state.vehicle)) {
      state.vehicle = "feet";
    }
  }

  if (!VEHICLES.some(vehicle => vehicle.id === state.vehicle)) {
    state.vehicle = "feet";
  }

  state.quest = clamp(
    Math.floor(Number(state.quest) || 0),
    0,
    QUESTS.length
  );

  state.stats = {
    meals: 0,
    days: 0,
    shifts: 0,
    gigs: 0,
    ...(state.stats || {})
  };

  state.pos = {
    x: clamp(Number(state.pos?.x ?? -28), -96, 96),
    y: 0,
    z: clamp(Number(state.pos?.z ?? 28), -96, 96)
  };

  state.keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  };

  state.joy = {
    active: false,
    x: 0,
    y: 0
  };

  state.run = false;
  state.jump = false;
  state.emote = "none";

  // Preserve a separately saved avatar if one exists.
  try {
    const avatar = localStorage.getItem(AVATAR_KEY);

    if (avatar) {
      state.cfg = sanitize(JSON.parse(avatar));
    }
  } catch (error) {
    console.warn("Local avatar could not be loaded:", error);
  }
}

async function loadCloudCharacter() {
  if (!state.user || state.guest) return;

  try {
    const { data, error } = await db.rpc("get_my_character");

    if (error) throw error;

    if (data?.id) {
      state.name = data.name || state.name;
      state.district = data.district || state.district;

      if (data.avatar) {
        state.cfg = sanitize(data.avatar);
      }
    }
  } catch (error) {
    console.warn(
      "Cloud character could not be loaded. Local progress will still be used:",
      error
    );
  }
}

async function loadGame() {
  loadLocalGame();

  await loadCloudCharacter();

  updateHUD();
}

/* =========================================================
   HUD AND MINIMAP
   ========================================================= */

function updateHUD() {
  setText("name", state.name);
  setText("levelBadge", `Lv ${state.level}`);

  const career = state.career
    ? CAREERS.find(item => item.id === state.career)?.name
    : null;

  setText(
    "sub",
    `${state.district} · ${career || "Starting Out"}`
  );

  setText("money", fmt(state.money));

  setText(
    "housingPill",
    HOUSING[state.housing]?.name || HOUSING[0].name
  );

  setText("clock", currentClock());
  setText("moodText", mood());
  setText("objectiveText", state.activity);

  setText(
    "xpText",
    `${Math.round(state.xp)} / ${state.level * 100} XP`
  );

  const xpFill = $("xpFill");

  if (xpFill) {
    xpFill.style.width =
      `${clamp(state.xp / (state.level * 100) * 100)}%`;
  }

  for (const key of Object.keys(state.needs)) {
    const id = key[0].toUpperCase() + key.slice(1);

    const fill = $(`need${id}`);
    const value = $(`need${id}V`);

    if (fill) {
      fill.style.width = `${state.needs[key]}%`;
    }

    if (value) {
      value.textContent = Math.round(state.needs[key]);
    }
  }

  updatePrompt();
}

function drawMinimap() {
  const canvas = $("minimap");

  if (!canvas || !player) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const scale = width / 190;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#10201d";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#263a36";

  for (let i = -3; i <= 3; i++) {
    const value = (i * 28 + 95) * scale;

    ctx.fillRect(value, 0, 12 * scale, height);
    ctx.fillRect(0, value, width, 12 * scale);
  }

  for (const place of PLACES) {
    const x = (place.x + 95) * scale;
    const y = (place.z + 95) * scale;

    ctx.fillStyle = place.color;

    ctx.fillRect(x - 3, y - 3, 6, 6);
  }

  const px = (player.root.position.x + 95) * scale;
  const py = (player.root.position.z + 95) * scale;

  ctx.fillStyle = "#ffffff";

  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (route) {
    const rx = (route.x + 95) * scale;
    const ry = (route.z + 95) * scale;

    ctx.strokeStyle = "#FFC20E";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(rx, ry);
    ctx.stroke();

    ctx.fillStyle = "#FFC20E";

    ctx.beginPath();
    ctx.arc(rx, ry, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* =========================================================
   RENDER LOOP
   ========================================================= */

function resize() {
  if (!camera || !renderer) return;

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}

function animate() {
  if (!gameStarted || !renderer || !scene || !camera) {
    return;
  }

  requestAnimationFrame(animate);

  const now = performance.now();

  const dt = Math.min(
    0.05,
    Math.max(0, (now - last) / 1000)
  );

  last = now;

  updatePlayer(dt);
  updateNPCs(dt);
  updateCars(dt);

  updateCamera(dt);
  updateWorldLight();

  // Reduce repeated DOM updates instead of rewriting
  // all HUD elements on every single animation frame.
  hudClock += dt;

  if (hudClock >= 0.16) {
    hudClock = 0;
    updateHUD();
  }

  mapClock++;

  if ((mapClock & 3) === 0) {
    drawMinimap();
  }

  saveClock += dt;

  if (saveClock >= 8) {
    saveClock = 0;
    saveGame();
  }

  renderer.render(scene, camera);
}

/* =========================================================
   AUTHENTICATION AND STARTUP
   ========================================================= */

function showLogin(message = "") {
  $("loginScreen")?.classList.remove("hidden");
  $("hud")?.classList.add("hidden");

  const loading = $("loading");

  if (loading) {
    loading.style.display = "none";
  }

  if (message) {
    setText("loginMessage", message);
  }
}

function showGame() {
  $("loginScreen")?.classList.add("hidden");
  $("hud")?.classList.remove("hidden");

  const loading = $("loading");

  if (loading) {
    loading.style.display = "none";
  }
}

async function startGame() {
  if (gameStarted) {
    showGame();
    return;
  }

  if (starting) return;

  starting = true;

  const loading = $("loading");

  if (loading) {
    loading.style.display = "flex";
  }

  setText("loginMessage", "");

  try {
    // Restore saved state before creating the character.
    // This means the player spawns at the saved position.
    await loadGame();

    setup();

    // Make sure the player position is the saved position.
    if (player) {
      player.root.position.set(
        state.pos.x,
        state.pos.y || 0,
        state.pos.z
      );
    }

    gameStarted = true;

    showGame();

    updateHUD();
    drawMinimap();

    toast("Welcome to Naija Hustle. Start with one useful move.");

    last = performance.now();

    animate();
  } catch (error) {
    console.error("GAME START ERROR:", error);

    gameStarted = false;

    showLogin(
      `Game failed to start: ${error?.message || "Unknown error"}. Check the browser console.`
    );
  } finally {
    starting = false;
  }
}

function bindAuthButtons() {
  on("loginBtn", "click", async event => {
    event.preventDefault();

    const email = $("loginEmail")?.value.trim() || "";
    const password = $("loginPassword")?.value || "";

    setText("loginMessage", "");

    if (!email || !password) {
      setText("loginMessage", "Enter email and password.");
      return;
    }

    const button = $("loginBtn");

    if (button) button.disabled = true;

    try {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.session || !data.user) {
        throw new Error("No authenticated session was returned.");
      }

      state.user = data.user;
      state.guest = false;
      state.accountEmail = data.user.email || "";

      await startGame();
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setText(
        "loginMessage",
        error?.message || "Login failed."
      );
    } finally {
      if (button) button.disabled = false;
    }
  });

  on("signupBtn", "click", async event => {
    event.preventDefault();

    const email = $("loginEmail")?.value.trim() || "";
    const password = $("loginPassword")?.value || "";

    setText("loginMessage", "");

    if (!email || !password) {
      setText("loginMessage", "Enter email and password.");
      return;
    }

    if (password.length < 6) {
      setText(
        "loginMessage",
        "Use a password containing at least 6 characters."
      );

      return;
    }

    const button = $("signupBtn");

    if (button) button.disabled = true;

    try {
      const { data, error } = await db.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      if (data.session && data.user) {
        state.user = data.user;
        state.guest = false;
        state.accountEmail = data.user.email || "";

        setText("loginMessage", "Account created. Starting game...");

        await startGame();
      } else {
        setText(
          "loginMessage",
          "Account created. Check your email for the confirmation link, then log in."
        );
      }
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      setText(
        "loginMessage",
        error?.message || "Sign up failed."
      );
    } finally {
      if (button) button.disabled = false;
    }
  });

  on("guestBtn", "click", async event => {
    event.preventDefault();

    const button = $("guestBtn");

    if (button) button.disabled = true;

    try {
      // Guest mode must not accidentally reuse an earlier
      // authenticated session.
      try {
        await db.auth.signOut();
      } catch (error) {
        console.warn("Could not clear an old session:", error);
      }

      state.user = null;
      state.guest = true;
      state.accountEmail = "";

      await startGame();
    } finally {
      if (button) button.disabled = false;
    }
  });
}

async function signOut() {
  // Save first. Signing out should not erase local progress.
  saveGame();

  try {
    if (state.user && !state.guest) {
      const { error } = await db.auth.signOut();

      if (error) {
        console.warn("Supabase sign-out warning:", error);
      }
    }
  } catch (error) {
    console.warn("Sign-out error:", error);
  }

  // The page will return to the login screen after reload.
  // Local progress is preserved in SAVE_KEY.
  window.location.reload();
}

async function initializeApp() {
  bindAuthButtons();

  showLogin();

  setText(
    "qualityBtn",
    state.quality.toUpperCase()
  );

  try {
    const {
      data: { session },
      error
    } = await db.auth.getSession();

    if (error) throw error;

    if (session?.user) {
      // Automatically restore a valid login session,
      // without creating another scene or render loop.
      state.user = session.user;
      state.guest = false;
      state.accountEmail = session.user.email || "";

      await startGame();
    }
  } catch (error) {
    console.warn("Could not restore login session:", error);

    setText(
      "loginMessage",
      "Could not restore your session. Log in again or use guest mode."
    );
  }
}

/* =========================================================
   START APP
   ========================================================= */

// Do not call startGame() unconditionally here.
// The user must have an authenticated session or choose Guest.
initializeApp();
