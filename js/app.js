import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

alert("SCRIPT STARTED");

const SUPABASE_URL = "https://pbqtbwiymlwksdtfsfcb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-SK-LvMzEwv-oqn8A5hZOQ_rwyzGxUj";

const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const lerp = (a,b,t) => a+(b-a)*t;
const damp = (a,b,k,dt) => lerp(a,b,1-Math.exp(-k*dt));
const has = (o,k) => Object.prototype.hasOwnProperty.call(o,k);

const CFG = {
  walk:3.2,
  run:6.4,
  accel:14,
  decel:18,
  turn:12,
  jump:5.4,
  gravity:15,
  world:190,
  limit:90,
  road:12,
  sidewalk:3.2,
  avatarScale:.82,
  radius:.42,
  dayMinutes:8
};
