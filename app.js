import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const $=id=>document.getElementById(id);
const SUPABASE_URL="https://pbqtbwiymlwksdtfsfcb.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_-SK-LvMzEwv-oqn8A5hZOQ_rwyzGxUj";
const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const SAVE_KEY="nh_world_save_v3";
const AVATAR_KEY="nh_avatar_v3";

const OPTIONS={
 skinTone:{label:"Skin Tone",kind:"swatch",values:{light:"#f3c7a5",honey:"#d99a6c",tan:"#b9784e",brown:"#855033",deep:"#60351f",dark:"#351d14"}},
 hairstyle:{label:"Hairstyle",values:{low_cut:"Low Cut",fade:"Fade",high_top:"High Top",afro:"Afro",twists:"Twists",braids:"Braids",locs:"Locs",headwrap:"Headwrap",bald:"Bald"}},
 hairColor:{label:"Hair Color",kind:"swatch",values:{black:"#151313",darkBrown:"#2c1b14",brown:"#4b2c1e",burgundy:"#541d2c",blonde:"#d6ad65",grey:"#8d8d8d"}},
 beard:{label:"Beard",values:{none:"None",stubble:"Stubble",goatee:"Goatee",full:"Full"}},
 outfit:{label:"Outfit",values:{hoodie:"Hoodie",tee:"T-Shirt",jersey:"Jersey",kaftan:"Kaftan",agbada:"Agbada",ankara:"Ankara",suit:"Suit"}},
 outfitColor:{label:"Outfit Color",kind:"swatch",values:{default:"#315d50",red:"#b72f2f",blue:"#285ca8",green:"#24734b",purple:"#6942a8",black:"#171717",white:"#e8e4da",gold:"#b88718",teal:"#0F6B6F"}},
 accessory:{label:"Accessory",values:{none:"None",cap:"Cap",glasses:"Glasses",sunglasses:"Sunglasses",chain:"Chain",headphones:"Headphones"}},
 bodyBuild:{label:"Body Build",values:{compact:"Compact",standard:"Standard",broad:"Broad"}},
 height:{label:"Height",values:{short:"Short",standard:"Standard",tall:"Tall"}}
};
const DEFAULT_CFG={skinTone:"brown",hairstyle:"fade",hairColor:"black",beard:"none",outfit:"hoodie",outfitColor:"default",accessory:"none",bodyBuild:"standard",height:"standard"};

const HOUSING=[
 {id:"room",name:"Basic Room",area:"Surulere Edge",rent:8000,move:0,comfort:40,desc:"Cheap start. Small space, low rent."},
 {id:"self",name:"Self-contained",area:"Yaba",rent:18000,move:45000,comfort:52,desc:"Your own toilet and kitchenette."},
 {id:"flat",name:"Mini Flat",area:"Ikeja",rent:35000,move:120000,comfort:65,desc:"One bedroom and a sitting room."},
 {id:"two",name:"2-Bedroom Flat",area:"GRA",rent:65000,move:280000,comfort:76,desc:"More room, more status, more bills."},
 {id:"premium",name:"Premium Apartment",area:"Victoria Island",rent:110000,move:550000,comfort:88,desc:"Better security, comfort and location."},
 {id:"condo",name:"High-end Condo",area:"Lekki Phase 1",rent:220000,move:1200000,comfort:97,desc:"Top-tier city living. Expensive but powerful."}
];

const CAREERS=[
 {id:"retail",name:"Retail Associate",skill:"charisma",pay:7000,levelPay:3400,home:"market",desc:"Sell products, learn customers and build your network."},
 {id:"designer",name:"Graphic Designer",skill:"coding",pay:9000,levelPay:4300,home:"office",desc:"Design flyers, brands and campaigns."},
 {id:"developer",name:"Web Developer",skill:"coding",pay:10000,levelPay:5600,home:"office",desc:"Build websites and digital products."},
 {id:"chef",name:"Chef",skill:"cooking",pay:8000,levelPay:4200,home:"restaurant",desc:"Cook shifts and build your food reputation."},
 {id:"fitness",name:"Fitness Coach",skill:"fitness",pay:7500,levelPay:4000,home:"gym",desc:"Coach clients and turn fitness into income."},
 {id:"creator",name:"Content Creator",skill:"charisma",pay:6500,levelPay:5200,home:"studio",desc:"Build an audience and attract sponsorships."},
 {id:"teacher",name:"Tutor",skill:"charisma",pay:6500,levelPay:3600,home:"school",desc:"Teach useful skills and grow a stable career."},
 {id:"sales",name:"Sales Executive",skill:"hustle",pay:8000,levelPay:4600,home:"office",desc:"Close deals and chase commissions."},
 {id:"photo",name:"Photographer",skill:"photography",pay:6500,levelPay:4300,home:"studio",desc:"Events, portraits and commercial shoots."},
 {id:"event",name:"Event Planner",skill:"organization",pay:7000,levelPay:4900,home:"market",desc:"Coordinate vendors and memorable events."},
 {id:"music",name:"Music Creative",skill:"music",pay:5500,levelPay:5600,home:"club",desc:"Perform, produce and build a fanbase."},
 {id:"property",name:"Property Agent",skill:"charisma",pay:7000,levelPay:6800,home:"office",desc:"Close property deals and learn real estate."},
 {id:"banking",name:"Banking Associate",skill:"charisma",pay:9200,levelPay:5200,home:"office",desc:"Structured work with strong promotion potential."},
 {id:"logistics",name:"Logistics Coordinator",skill:"organization",pay:7800,levelPay:5100,home:"market",desc:"Move packages, people and information."}
];
const GIGS=[
 {id:"design",name:"Quick Design Job",cost:500,reward:5500,min:60,skill:"coding"},
 {id:"delivery",name:"Local Delivery",cost:800,reward:4200,min:50,skill:"fitness"},
 {id:"food",name:"Food Order",cost:1200,reward:6200,min:75,skill:"cooking"},
 {id:"photo",name:"Street Photo Job",cost:400,reward:7000,min:90,skill:"photography"},
 {id:"content",name:"Brand Social Content",cost:600,reward:8500,min:100,skill:"charisma"},
 {id:"event",name:"Event Crew",cost:1500,reward:9000,min:120,skill:"organization"},
 {id:"flip",name:"Accessory Flip",cost:3000,reward:5200,min:45,skill:"hustle"}
];

const SHOPS=[
 {id:"food",name:"Mama Kemi's Kitchen",kind:"food",x:0,z:-56,items:[
  {id:"jollof",name:"Jollof + Chicken",price:1400,e:{hunger:24,fun:4}},
  {id:"shawarma",name:"Shawarma",price:1800,e:{hunger:17,fun:9}},
  {id:"drink",name:"Cold Drink",price:700,e:{hunger:4,fun:8}}
 ]},
 {id:"market",name:"Ariaria Tech & Style",kind:"market",x:-28,z:-28,items:[
  {id:"tee",name:"Fresh Street Tee",price:6500,e:{fun:6,social:2}},
  {id:"sneakers",name:"Sneakers",price:18000,e:{fun:7,social:4}},
  {id:"phone",name:"Midrange Phone",price:125000,e:{focus:8,social:7}}
 ]},
 {id:"home",name:"Home & Living",kind:"home",x:-28,z:28,items:[
  {id:"fan",name:"Standing Fan",price:28000,e:{energy:4}},
  {id:"desk",name:"Work Desk",price:42000,e:{focus:10}},
  {id:"bed",name:"Better Bed",price:65000,e:{energy:12}}
 ]},
 {id:"style",name:"Glow Spa & Grooming",kind:"style",x:0,z:56,items:[
  {id:"barber",name:"Sharp Barber Cut",price:2500,e:{hygiene:12,social:4}},
  {id:"spa",name:"Spa Session",price:7500,e:{hygiene:28,fun:12}},
  {id:"gym",name:"Gym Session",price:2500,e:{fitness:4,energy:-5}}
 ]}
];
const PLACES=[
 {id:"home",name:"Your Home",kind:"home",x:-28,z:28,color:"#55d88b"},
 {id:"job",name:"Job Centre",kind:"job",x:28,z:-28,color:"#56c7ff"},
 {id:"market",name:"Ariaria Tech & Style",kind:"market",x:-28,z:-28,color:"#ff9445"},
 {id:"restaurant",name:"Mama Kemi's Kitchen",kind:"food",x:0,z:-56,color:"#f39a52"},
 {id:"office",name:"Onyx Office Hub",kind:"office",x:56,z:-56,color:"#9098ff"},
 {id:"club",name:"Pulse Club",kind:"club",x:56,z:0,color:"#c268e7"},
 {id:"hotel",name:"City View Hotel",kind:"hotel",x:-56,z:0,color:"#58acff"},
 {id:"spa",name:"Glow Spa & Grooming",kind:"style",x:0,z:56,color:"#e86da8"},
 {id:"gym",name:"FitLife Gym",kind:"gym",x:-56,z:-56,color:"#57d5c7"},
 {id:"school",name:"Skill House",kind:"school",x:-56,z:56,color:"#9cd16f"},
 {id:"hall",name:"Hall of Fame",kind:"hall",x:56,z:56,color:"#d277ff"}
];
const NAMES=["Ada","Chinedu","Tolu","Mimi","Seyi","Emeka","Amaka","Zainab","Dami","Kelechi","Favour","Ife","Obi","Uche","Nneka","Kunle","Aisha","Yomi"];
const SKILLS=["hustle","charisma","coding","fitness","cooking","photography","organization","music"];
const INVESTMENTS=[
 {id:"kiosk",name:"Street Kiosk",cost:85000,income:9000,req:1},
 {id:"foodcart",name:"Food Cart",cost:120000,income:14000,req:2},
 {id:"studio",name:"Creative Studio",cost:250000,income:25000,req:3},
 {id:"delivery",name:"Delivery Hub",cost:400000,income:42000,req:4},
 {id:"property",name:"Rental Property",cost:800000,income:76000,req:5}
];
const VEHICLES=[
 {id:"feet",name:"Walk",fare:0,purchase:0,speed:1,owned:true},
 {id:"danfo",name:"Danfo",fare:600,purchase:0,speed:3,owned:false},
 {id:"ride",name:"Ride App",fare:2200,purchase:0,speed:6,owned:false},
 {id:"bike",name:"Bike",fare:0,purchase:85000,speed:8,owned:false},
 {id:"car",name:"Personal Car",fare:0,purchase:650000,speed:10,owned:false}
];
const QUESTS=[
 {id:"job",title:"First Hustle",desc:"Complete your first paid shift or gig.",reward:6000,xp:45,done:s=>s.totalEarnings>0},
 {id:"meal",title:"Feed Yourself",desc:"Buy food and keep the day moving.",reward:2500,xp:18,done:s=>s.stats.meals>0},
 {id:"skill",title:"Level Up",desc:"Reach skill level 2 in any skill.",reward:3000,xp:25,done:s=>Object.values(s.skills).some(v=>v>=2)},
 {id:"home",title:"Move Up",desc:"Upgrade your home.",reward:7000,xp:50,done:s=>s.housing>0},
 {id:"friend",title:"Build A Network",desc:"Raise a friendship to 25.",reward:3500,xp:28,done:s=>Object.values(s.relationships).some(v=>v>=25)},
 {id:"business",title:"Small Boss",desc:"Own an investment.",reward:12000,xp:65,done:s=>s.investments.length>0},
 {id:"vehicle",title:"Find Your Motion",desc:"Own personal transport.",reward:9000,xp:40,done:s=>s.vehicle!=="feet"},
 {id:"wealth",title:"Six Figures",desc:"Hold at least ₦100,000 cash.",reward:15000,xp:55,done:s=>s.money>=100000}
];

const state={
 user:null,guest:false,name:"Guest",district:"Lagos",day:1,time:8*60,money:25000,xp:0,level:1,
 housing:0,rentDue:14,needs:{hunger:82,energy:90,hygiene:86,fun:76,social:70,bladder:94},
 skills:Object.fromEntries(SKILLS.map(k=>[k,1])),career:null,careerLevel:0,inventory:[],relationships:{},investments:[],vehicle:"feet",achievements:[],quest:0,totalEarnings:0,weeklyEarnings:0,stats:{meals:0,days:0,shifts:0,gigs:0},cfg:{...DEFAULT_CFG},pos:{x:-28,z:28,y:0},emote:"none",status:"Idle",activity:"Get to the Job Centre and choose a hustle.",run:false,joy:{active:false,x:0,y:0},keys:{up:false,down:false,left:false,right:false,shift:false},jump:false
};

let scene,camera,renderer,sun,hemi,player,npcGroup,carGroup,last=performance.now(),saveClock=0,mapClock=0,geoCache=new Map(),matCache=new Map(),npcs=[],cars=[],route=null,cameraState="third",routePulse=0;
function clamp(v,a=0,b=100){return Math.max(a,Math.min(b,v))}
function fmt(v){return Math.round(v).toLocaleString("en-NG")}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function cap(s){return String(s||"").replaceAll("_"," ").replace(/^./,x=>x.toUpperCase())}

function spend(n){if(state.money<n)return false;state.money-=n;return true}
function earn(n){state.money+=n;state.totalEarnings+=n;state.weeklyEarnings+=n;gainXP(Math.max(6,Math.round(n/1000)))}
function gainXP(n){state.xp+=n;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;toast(`Level ${state.level} reached.`)}}
function addNeed(k,v){if(k in state.needs)state.needs[k]=clamp(state.needs[k]+v)}
function sanitize(raw){const o={...DEFAULT_CFG};if(!raw||typeof raw!=="object")return o;for(const k in DEFAULT_CFG)if(OPTIONS[k]?.values?.[raw[k]]!==undefined)o[k]=raw[k];return o}
function geo(key,make){if(!geoCache.has(key))geoCache.set(key,make());return geoCache.get(key)}
function mat(color,rough=.72,metal=0,opts={}){const key=`${color}|${rough}|${metal}|${JSON.stringify(opts)}`;if(!matCache.has(key))matCache.set(key,new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,...opts}));return matCache.get(key)}
function box(x,y,z){return geo(`b${x}|${y}|${z}`,()=>new THREE.BoxGeometry(x,y,z))}
function sph(r){return geo(`s${r}`,()=>new THREE.SphereGeometry(r,18,14))}
function cyl(r1,r2,h,s=14){return geo(`c${r1}|${r2}|${h}|${s}`,()=>new THREE.CylinderGeometry(r1,r2,h,s))}
function capGeo(r,l){return geo(`p${r}|${l}`,()=>new THREE.CapsuleGeometry(r,l,8,12))}
function torus(r,t,rs=10,ts=20,arc=Math.PI*2){return geo(`t${r}|${t}|${rs}|${ts}|${arc}`,()=>new THREE.TorusGeometry(r,t,rs,ts,arc))}

function createCharacter(raw,scale=.82){
 const cfg=sanitize(raw),root=new THREE.Group();root.scale.setScalar(scale);
 const skin=mat(OPTIONS.skinTone.values[cfg.skinTone]||"#855033"),hair=mat(({black:"#151313",darkBrown:"#2c1b14",brown:"#4b2c1e",burgundy:"#541d2c",blonde:"#d6ad65",grey:"#8d8d8d"}[cfg.hairColor]||"#151313"));
 const outfit=mat(OPTIONS.outfitColor.values[cfg.outfitColor]||"#315d50"),dark=mat("#171717"),white=mat("#f4f1ea");
 const W=cfg.bodyBuild==="compact"?.88:cfg.bodyBuild==="broad"?1.12:1;const S=cfg.bodyBuild==="compact"?.92:cfg.bodyBuild==="broad"?1.12:1;const H=cfg.height==="short"?.94:cfg.height==="tall"?1.07:1;
 const hips=new THREE.Group();hips.position.y=1.02*H;root.add(hips);const body=new THREE.Mesh(capGeo(.32*W,.75*H),outfit);body.scale.set(1.2*S,1,.83*W);body.position.y=.46*H;hips.add(body);
 const spine=new THREE.Group();spine.position.y=.35*H;hips.add(spine);const neck=new THREE.Mesh(cyl(.13,.14,.22,16),skin);neck.position.y=.84*H;spine.add(neck);const head=new THREE.Group();head.position.y=1.12*H;spine.add(head);
 const face=new THREE.Mesh(sph(.36),skin);face.scale.set(1,.99,.93);head.add(face);
 for(const x of[-.125,.125]){const eye=new THREE.Mesh(sph(.082),white);eye.scale.set(1,.86,.45);eye.position.set(x,.045,.325);head.add(eye);const p=new THREE.Mesh(sph(.042),dark);p.scale.set(.9,.95,.45);p.position.set(x,.045,.36);head.add(p)}
 const nose=new THREE.Mesh(sph(.07),skin);nose.scale.set(.7,1,1.2);nose.position.set(0,-.04,.36);head.add(nose);const mouth=new THREE.Mesh(capGeo(.035,.13),mat("#5b2825"));mouth.rotation.z=Math.PI/2;mouth.scale.set(1,.6,.55);mouth.position.set(0,-.17,.345);head.add(mouth);
 if(cfg.hairstyle!=="bald"){const styles=cfg.hairstyle;if(styles==="afro"){const h=new THREE.Mesh(sph(.43),hair);h.scale.set(1.08,.9,1.08);h.position.y=.18;head.add(h)}else if(["twists","locs","braids"].includes(styles)){const h=new THREE.Mesh(sph(.37),hair);h.scale.set(1,.63,1);h.position.y=.17;head.add(h);const count=styles==="braids"?12:styles==="locs"?14:10;for(let i=0;i<count;i++){const a=i/count*Math.PI*2,s=new THREE.Mesh(capGeo(.052,styles==="locs"?.33:.27),hair);s.position.set(Math.cos(a)*.28,.14,Math.sin(a)*.28);head.add(s)}}else{const h=new THREE.Mesh(sph(.38),hair);h.scale.set(1,styles==="fade"?.52:.63,1);h.position.y=.2;head.add(h)}}
 if(cfg.beard!=="none"){const b=new THREE.Mesh(sph(cfg.beard==="full"?.22:.17),hair);b.scale.set(1,.7,.55);b.position.set(0,-.18,.34);head.add(b)}
 if(cfg.accessory==="cap"){const c=new THREE.Mesh(sph(.39),dark);c.scale.set(1,.44,1);c.position.y=.29;head.add(c);const brim=new THREE.Mesh(box(.66,.04,.25),dark);brim.position.set(0,.22,.43);head.add(brim)}
 if(cfg.accessory==="glasses"||cfg.accessory==="sunglasses"){const f=mat(cfg.accessory==="sunglasses"?"#101010":"#303030");for(const x of[-.16,.16]){const l=new THREE.Mesh(box(.18,.1,.03),f);l.position.set(x,.04,.43);head.add(l)}const br=new THREE.Mesh(box(.11,.03,.03),f);br.position.set(0,.04,.43);head.add(br)}
 if(cfg.accessory==="chain"){const ch=new THREE.Mesh(torus(.25,.022,8,24),mat("#d7aa28",.3,.8));ch.rotation.x=Math.PI/2;ch.position.set(0,-.48,.4);root.add(ch)}
 const legs=[],arms=[];for(const x of[-.2*W,.2*W]){const l=new THREE.Group();l.position.x=x;hips.add(l);const th=new THREE.Mesh(capGeo(.14,.42*H),outfit);th.position.y=-.3*H;l.add(th);const sh=new THREE.Mesh(capGeo(.12,.42*H),outfit);sh.position.y=-.75*H;l.add(sh);const shoe=new THREE.Mesh(box(.3,.16,.5),dark);shoe.position.set(0,-1.06*H,.1);l.add(shoe);legs.push(l)}
 for(const x of[-.5*S,.5*S]){const a=new THREE.Group();a.position.set(x,.62*H,0);spine.add(a);const up=new THREE.Mesh(capGeo(.125,.36*H),outfit);up.position.y=-.2*H;a.add(up);const fore=new THREE.Mesh(capGeo(.105,.32*H),skin);fore.position.y=-.57*H;a.add(fore);const hand=new THREE.Mesh(sph(.13),skin);hand.position.y=-.79*H;a.add(hand);arms.push(a)}
 return {root,hips,spine,head,legs,arms,cfg,time:Math.random()*6};
}

function setup(){
 scene=new THREE.Scene();scene.background=new THREE.Color("#8cc2c7");scene.fog=new THREE.Fog("#8cc2c7",48,190);camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,260);
 renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});renderer.setPixelRatio(state.quality==="low"?1:Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;$('game').appendChild(renderer.domElement);
 hemi=new THREE.HemisphereLight("#e8ffff","#3c4638",1.4);scene.add(hemi);sun=new THREE.DirectionalLight("#fff1d4",2);sun.position.set(40,80,30);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
 const world=new THREE.Group();scene.add(world);buildWorld(world);npcGroup=new THREE.Group();scene.add(npcGroup);carGroup=new THREE.Group();scene.add(carGroup);buildPlayer();buildNPCs();buildCars();attachInput();buildCustomizer();updateHUD();window.addEventListener("resize",resize)
}
function buildWorld(g){
 const ground=new THREE.Mesh(box(210,.2,210),mat("#5c6b58",.95));ground.position.y=-.1;ground.receiveShadow=true;g.add(ground);
 const asphalt=mat("#2b3331",1),stripe=mat("#d8d0a3",.8),side=mat("#85847c",1);
 for(let i=-3;i<=3;i++){const a=new THREE.Mesh(box(13,.04,210),asphalt);a.position.x=i*28;g.add(a);const b=new THREE.Mesh(box(210,.04,13),asphalt);b.position.z=i*28;g.add(b);const sa=new THREE.Mesh(box(.18,.045,210),stripe);sa.position.x=i*28;g.add(sa);const sb=new THREE.Mesh(box(210,.045,.18),stripe);sb.position.z=i*28;g.add(sb)}
 PLACES.forEach((p,i)=>buildPlace(g,p,i));for(let i=0;i<55;i++){const x=(Math.random()*180-90),z=(Math.random()*180-90);if(PLACES.some(p=>Math.hypot(p.x-x,p.z-z)<10))continue;const type=pick(["tree","stall","house","lamp"]);if(type==="tree")tree(g,x,z);if(type==="stall")stall(g,x,z);if(type==="house")house(g,x,z);if(type==="lamp")lamp(g,x,z)}
}
function label(root,text,x,y,z){const c=document.createElement("canvas");c.width=512;c.height=88;const ctx=c.getContext("2d");ctx.fillStyle="#14201F";ctx.fillRect(0,0,512,88);ctx.fillStyle="#FFC20E";ctx.font="bold 38px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(text,256,44);const t=new THREE.CanvasTexture(c);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t}));sp.scale.set(7.3,1.25,1);sp.position.set(x,y,z);root.add(sp)}
function buildPlace(g,p,i){const b=new THREE.Group();b.position.set(p.x,0,p.z);const base=new THREE.Mesh(box(11,.5,9),mat(i%2?"#b78d68":"#b6a776"));base.position.y=.25;b.add(base);const walls=new THREE.Mesh(box(10,6.6,8),mat("#e0cfb0"));walls.position.y=3.55;b.add(walls);const roof=new THREE.Mesh(box(11,.55,9),mat(i%2?"#345d58":"#95453a"));roof.position.y=7;b.add(roof);const door=new THREE.Mesh(box(1.6,2.6,.22),mat("#503020"));door.position.set(0,1.4,-4.12);b.add(door);label(b,p.name,0,5.1,-4.35);g.add(b)}
function tree(g,x,z){const t=new THREE.Group();t.position.set(x,0,z);const tr=new THREE.Mesh(cyl(.25,.34,2.8),mat("#6b4a2e"));tr.position.y=1.4;t.add(tr);const c=new THREE.Mesh(sph(1.9),mat("#2f7145"));c.position.y=3.6;t.add(c);g.add(t)}
function stall(g,x,z){const s=new THREE.Group();s.position.set(x,0,z);const b=new THREE.Mesh(box(3,2,2.2),mat("#c48646"));b.position.y=1;s.add(b);const r=new THREE.Mesh(box(3.4,.2,2.6),mat("#0F6B6F"));r.position.y=2.15;s.add(r);g.add(s)}
function house(g,x,z){const h=new THREE.Group();h.position.set(x,0,z);const b=new THREE.Mesh(box(7,4.4,6),mat("#9e8e77"));b.position.y=2.2;h.add(b);const r=new THREE.Mesh(box(7.6,.5,6.6),mat("#4e5752"));r.position.y=4.6;h.add(r);g.add(h)}
function lamp(g,x,z){const l=new THREE.Group();l.position.set(x,0,z);const p=new THREE.Mesh(cyl(.06,.08,3.5),mat("#333"));p.position.y=1.75;l.add(p);const bulb=new THREE.Mesh(sph(.16),mat("#ffe28e",.2,0,{emissive:"#ffe28e",emissiveIntensity:2}));bulb.position.y=3.5;l.add(bulb);g.add(l)}
function buildPlayer(){player=createCharacter(state.cfg);player.root.position.set(state.pos.x,state.pos.y,state.pos.z);scene.add(player.root)}
function rebuildPlayer(){const old=player.root,pos=old.position.clone(),rot=old.rotation.clone();scene.remove(old);player=createCharacter(state.cfg);player.root.position.copy(pos);player.root.rotation.copy(rot);scene.add(player.root)}

function buildNPCs(){npcs=[];for(let i=0;i<20;i++){const cfg={...DEFAULT_CFG,skinTone:pick(Object.keys(OPTIONS.skinTone.values)),hairstyle:pick(Object.keys(OPTIONS.hairstyle.values)),outfit:pick(["tee","hoodie","kaftan","ankara"]),outfitColor:pick(["red","blue","green","gold","teal","default"]),accessory:pick(["none","cap","glasses"])};const c=createCharacter(cfg,.68);const p=pick(PLACES);c.root.position.set(p.x+(Math.random()*10-5),0,p.z+(Math.random()*10-5));npcGroup.add(c.root);npcs.push({c,name:NAMES[i%NAMES.length],speed:.35+Math.random()*.8,target:null})}}
function updateNPCs(dt){for(const n of npcs){n.c.time+=dt;if(!n.target||Math.random()<.008)n.target={x:clamp(n.c.root.position.x+(Math.random()*12-6),-90,90),z:clamp(n.c.root.position.z+(Math.random()*12-6),-90,90)};const dx=n.target.x-n.c.root.position.x,dz=n.target.z-n.c.root.position.z,d=Math.hypot(dx,dz);if(d>.5){n.c.root.position.x+=dx/d*n.speed*dt;n.c.root.position.z+=dz/d*n.speed*dt;n.c.legs.forEach((l,i)=>l.rotation.x=Math.sin(n.c.time*6+i*Math.PI)*.18)}}}
function buildCars(){cars=[];for(let i=0;i<12;i++){const g=new THREE.Group();const body=new THREE.Mesh(box(2.1,1,4.1),mat(pick(["#253635","#eee9dc","#a9473c","#d4a62e","#6774ad"])));body.position.y=.62;g.add(body);const roof=new THREE.Mesh(box(1.55,.6,2.1),mat("#1d2524"));roof.position.y=1.2;g.add(roof);const axis=i%2,dir=i%4<2?1:-1;g.position.set(axis?Math.round(Math.random()*6-3)*28:Math.random()*170-85,0,axis?Math.random()*170-85:Math.round(Math.random()*6-3)*28);g.userData={axis,dir,speed:4+Math.random()*5};carGroup.add(g);cars.push(g)}}
function updateCars(dt){cars.forEach(c=>{const u=c.userData;if(u.axis)c.position.z+=u.dir*u.speed*dt;else c.position.x+=u.dir*u.speed*dt;const v=u.axis?c.position.z:c.position.x;if(Math.abs(v)>96){if(u.axis)c.position.z=-u.dir*96;else c.position.x=-u.dir*96}})}

function attachInput(){
 addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(k==="w"||k==="arrowup")state.keys.up=true;if(k==="s"||k==="arrowdown")state.keys.down=true;if(k==="a"||k==="arrowleft")state.keys.left=true;if(k==="d"||k==="arrowright")state.keys.right=true;if(k==="shift")state.keys.shift=true;if(k===" ")state.jump=true;if(k==="e")interact()});
 addEventListener("keyup",e=>{const k=e.key.toLowerCase();if(k==="w"||k==="arrowup")state.keys.up=false;if(k==="s"||k==="arrowdown")state.keys.down=false;if(k==="a"||k==="arrowleft")state.keys.left=false;if(k==="d"||k==="arrowright")state.keys.right=false;if(k==="shift")state.keys.shift=false});
 $("runBtn").onpointerdown=()=>state.run=!state.run;$("jumpBtn").onpointerdown=()=>state.jump=true;
 const joy=$("joystick"),stick=$("stick");const setJoy=e=>{const r=joy.getBoundingClientRect();let x=(e.clientX-(r.left+r.width/2))/(r.width/2-20),y=(e.clientY-(r.top+r.height/2))/(r.height/2-20);const d=Math.hypot(x,y);if(d>1){x/=d;y/=d}state.joy.x=x;state.joy.y=y;stick.style.transform=`translate(${x*33}px,${y*33}px)`};joy.onpointerdown=e=>{state.joy.active=true;joy.setPointerCapture(e.pointerId);setJoy(e)};joy.onpointermove=e=>{if(state.joy.active)setJoy(e)};joy.onpointerup=()=>{state.joy.active=false;state.joy.x=state.joy.y=0;stick.style.transform="translate(0,0)"};
 $("cameraBtn").onclick=()=>{cameraState=cameraState==="third"?"close":cameraState==="close"?"front":"third";toast(`Camera: ${cameraState}`)};
 $("qualityBtn").onclick=()=>{state.quality=state.quality==="high"?"low":"high";localStorage.setItem("nh_quality",state.quality);renderer.setPixelRatio(state.quality==="high"?Math.min(devicePixelRatio,2):1);$("qualityBtn").textContent=state.quality.toUpperCase()};
 $("phoneBtn").onclick=()=>open("Phone","phone");$("bagBtn").onclick=()=>open("Inventory","inventory");$("mapBtn").onclick=()=>open("City Map","map");$("profileBtn").onclick=()=>open("My Life","profile");$("homeBtn").onclick=()=>open("Your Home","home");$("socialBtn").onclick=()=>open("People","social");$("avatarBtn").onclick=()=>{$("customizer").classList.add("open");renderCustomizer()};$("emoteBtn").onclick=()=>$("emoteMenu").classList.toggle("open");document.querySelectorAll("#emoteMenu button").forEach(b=>b.onclick=()=>{state.emote=b.dataset.emote;$("emoteMenu").classList.remove("open")});$("prompt").onclick=interact;
 $("sheetClose").onclick=()=>$("overlay").classList.remove("open");$("closeCustomizer").onclick=()=>$("customizer").classList.remove("open");$("randomBtn").onclick=()=>{for(const k of Object.keys(OPTIONS))state.cfg[k]=pick(Object.keys(OPTIONS[k].values));rebuildPlayer();renderCustomizer()};$("saveAvatar").onclick=saveAvatar;
}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}

function updatePlayer(dt){
 let ix=(state.keys.right?1:0)-(state.keys.left?1:0),iz=(state.keys.down?1:0)-(state.keys.up?1:0);if(state.joy.active){ix=state.joy.x;iz=state.joy.y}const moving=Math.hypot(ix,iz)>.12;const speed=state.run||state.keys.shift?7.1:3.6;
 if(moving){const len=Math.hypot(ix,iz);ix/=len;iz/=len;player.root.position.x=clamp(player.root.position.x+ix*speed*dt,-96,96);player.root.position.z=clamp(player.root.position.z+iz*speed*dt,-96,96);player.root.rotation.y=Math.atan2(ix,iz);player.legs.forEach((l,i)=>l.rotation.x=Math.sin(performance.now()/80+i*Math.PI)*.3);state.status=state.run||state.keys.shift?"Running":"Walking";addNeed("energy",-(state.run||state.keys.shift?2.2:1.0)*dt);addNeed("hunger",-.18*dt);addNeed("hygiene",-.08*dt);addNeed("bladder",- .06*dt)}else{state.status=state.emote!=="none"?state.emote:"Idle";player.legs.forEach(l=>l.rotation.x*=.8)}
 if(state.jump){state.jump=false;if(player.root.position.y<=.02)player.root.userData.vy=6}player.root.userData.vy=player.root.userData.vy||0;if(player.root.position.y>0||player.root.userData.vy>0){player.root.userData.vy-=17*dt;player.root.position.y+=player.root.userData.vy*dt;if(player.root.position.y<0){player.root.position.y=0;player.root.userData.vy=0}}
 state.time+=dt*1.1;if(state.time>=1440){state.time%=1440;state.day++;state.stats.days++;state.rentDue--;dailyTick()}if(state.time%10<dt)saveGame();
}
function dailyTick(){addNeed("hunger",-7);addNeed("hygiene",-4);addNeed("fun",-3);addNeed("social",-3);addNeed("bladder",+16);addNeed("energy",22);addNeed("focus",0);if(state.day%7===0)weeklyTick();if(state.rentDue<=0)payRent()}
function weeklyTick(){state.weeklyEarnings=0;let passive=0;for(const id of state.investments){const inv=INVESTMENTS.find(x=>x.id===id);if(inv)passive+=inv.income}if(passive){earn(passive);toast(`Business week: +₦${fmt(passive)} income.`)}}
function payRent(){const rent=HOUSING[state.housing].rent;if(spend(rent)){state.rentDue=14;addNeed("fun",4);toast(`Rent paid: ₦${fmt(rent)}.`)}else{state.rentDue=3;addNeed("fun",-15);addNeed("energy",-10);toast(`Rent problem: ₦${fmt(rent)} due. Earn fast.`)}}
function currentClock(){const h=Math.floor(state.time/60),m=Math.floor(state.time%60),ap=h>=12?"PM":"AM",hh=h%12||12;return `${hh}:${String(m).padStart(2,"0")} ${ap}`}
function mood(){const v=Object.values(state.needs).reduce((a,b)=>a+b,0)/6;if(v>=80)return"Thriving";if(v>=60)return"Doing Fine";if(v>=40)return"Stressed";if(v>=20)return"Struggling";return"Emergency"}
function updateWorldLight(){const h=state.time/60,sunY=Math.sin((h-6)/12*Math.PI),light=clamp((sunY+.1)*1.15,0,1);sun.position.set(40,20+sunY*65,30);sun.intensity=.55+1.8*light;hemi.intensity=.55+1.05*light;const sky=new THREE.Color(light>.45?"#8cc2c7":"#17282e");scene.background.lerp(sky,.05);scene.fog.color.copy(scene.background)}
function updateCamera(dt){const p=player.root.position,dist=cameraState==="close"?5.4:8.5,off=new THREE.Vector3(Math.sin(performance.now()/100000+0)*dist,4.0,Math.cos(performance.now()/100000+0)*dist);if(cameraState==="front")off.multiplyScalar(-1);camera.position.lerp(new THREE.Vector3(p.x+off.x,p.y+off.y,p.z+off.z),Math.min(1,dt*5));camera.lookAt(p.x,p.y+1.02,p.z)}
function nearestPlace(){let best=null,d=999;for(const p of PLACES){const n=Math.hypot(player.root.position.x-p.x,player.root.position.z-p.z);if(n<d){d=n;best=p}}return{p:best,d}}
function updatePrompt(){const {p,d}=nearestPlace();if(d<11){$("prompt").style.display="block";$("prompt").textContent=`Enter ${p.name}`}else $("prompt").style.display="none"}
function toast(msg){state.activity=msg}
function open(title,mode){$("sheetEyebrow").textContent="NAIJA HUSTLE";$("sheetTitle").textContent=title;$("overlay").classList.add("open");render(mode)}
function bindActions(){document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>handleAction(b.dataset.action,b.dataset.id))}
function render(mode){const b=$("sheetBody");if(mode==="phone")b.innerHTML=renderPhone();else if(mode==="inventory")b.innerHTML=renderInventory();else if(mode==="map")b.innerHTML=renderMap();else if(mode==="profile")b.innerHTML=renderProfile();else if(mode==="home")b.innerHTML=renderHome();else if(mode==="social")b.innerHTML=renderSocial();else if(mode==="jobs")b.innerHTML=renderJobs();else if(mode==="gigs")b.innerHTML=renderGigs();else if(mode==="business")b.innerHTML=renderBusiness();else if(mode==="transport")b.innerHTML=renderTransport();else if(mode.startsWith("shop"))b.innerHTML=renderShop(mode);else if(mode==="skills")b.innerHTML=renderSkills();else b.innerHTML=renderPhone();bindActions()}
function renderPhone(){return `<div class="stats"><div class="stat"><strong>₦${fmt(state.money)}</strong><span>WALLET</span></div><div class="stat"><strong>Day ${state.day}</strong><span>TIME</span></div><div class="stat"><strong>${mood()}</strong><span>MOOD</span></div><div class="stat"><strong>${state.rentDue}</strong><span>DAYS TO RENT</span></div></div><div class="grid"><article class="card"><h3>Work</h3><p>Pick a career, train skills and work shifts.</p><div class="actions"><button class="action primary" data-action="open" data-id="jobs">Careers</button><button class="action" data-action="open" data-id="gigs">Gigs</button></div></article><article class="card"><h3>Life</h3><p>Keep needs balanced and improve your home.</p><div class="actions"><button class="action primary" data-action="open" data-id="home">Home</button><button class="action" data-action="open" data-id="skills">Train</button></div></article><article class="card"><h3>Money</h3><p>Buy things, transport, and eventually a business.</p><div class="actions"><button class="action primary" data-action="open" data-id="business">Business</button><button class="action" data-action="open" data-id="transport">Transport</button></div></article><article class="card"><h3>People</h3><p>Meet locals and build useful relationships.</p><div class="actions"><button class="action primary" data-action="open" data-id="social">Social</button></div></article></div>`}
function renderJobs(){return `<div class="grid">${CAREERS.map(c=>{const cur=state.career===c.id,skill=state.skills[c.skill];const lv=cur?state.careerLevel:0;const pay=c.pay+Math.max(0,skill-1)*c.levelPay+lv*1300;return `<article class="card"><h3>${c.name}</h3><p>${c.desc}</p><div class="meta">Skill: ${cap(c.skill)} Lv ${skill} · Pay about ₦${fmt(pay)}</div><div class="actions"><button class="action primary" data-action="career" data-id="${c.id}">${cur?"Work Shift":"Choose"}</button><button class="action" data-action="train" data-id="${c.skill}">Train</button></div></article>`}).join("")}</div>`}
function renderGigs(){return `<div class="grid">${GIGS.map(g=>`<article class="card"><h3>${g.name}</h3><p>Cost ₦${fmt(g.cost)} · ${g.min} game min · ${cap(g.skill)} Lv ${state.skills[g.skill]||1}</p><div class="meta">Reward ₦${fmt(g.reward)}</div><div class="actions"><button class="action primary" data-action="gig" data-id="${g.id}">Take Gig</button></div></article>`).join("")}</div>`}
function renderHome(){return `<div class="stats"><div class="stat"><strong>${HOUSING[state.housing].name}</strong><span>HOME</span></div><div class="stat"><strong>₦${fmt(HOUSING[state.housing].rent)}</strong><span>RENT / 14 DAYS</span></div><div class="stat"><strong>${HOUSING[state.housing].comfort}</strong><span>COMFORT</span></div><div class="stat"><strong>${state.rentDue}</strong><span>DAYS LEFT</span></div></div><div class="grid"><article class="card"><h3>Rest</h3><p>Sleep and recover energy.</p><div class="actions"><button class="action primary" data-action="rest">Sleep</button></div></article><article class="card"><h3>Bathroom</h3><p>Restore hygiene and bladder.</p><div class="actions"><button class="action primary" data-action="bath">Use Bathroom</button></div></article><article class="card"><h3>Cook</h3><p>Make a simple meal at home.</p><div class="actions"><button class="action primary" data-action="cook">Cook Meal · ₦600</button></div></article><article class="card"><h3>Upgrade</h3><p>Move to the next home when you can afford the cost.</p><div class="actions"><button class="action primary" data-action="upgrade">View Homes</button></div></article></div>`}
function renderShop(mode){let shops=SHOPS;if(mode==="shop-food")shops=SHOPS.filter(s=>s.id==="food");if(mode==="shop-style")shops=SHOPS.filter(s=>s.id==="style");return shops.map(s=>`<div class="sectionBlock"><h3>${s.name}</h3><div class="grid">${s.items.map(i=>`<article class="card"><h3>${i.name}</h3><div class="meta">₦${fmt(i.price)}</div><p>${Object.entries(i.e).map(([k,v])=>`${v>0?"+":""}${v} ${cap(k)}`).join(" · ")}</p><div class="actions"><button class="action primary" data-action="item" data-id="${i.id}">Buy</button></div></article>`).join("")}</div></div>`).join("")}
function renderInventory(){const counts={};state.inventory.forEach(x => {
  counts[x] = (counts[x] || 0) + 1;
});return `<div class="list">${Object.entries(counts).map(([k,v])=>`<div class="listRow"><b>${cap(k)}</b><span>x${v}</span></div>`).join("")||`<div class="placeholder">Your bag is empty.</div>`}</div>`}
function renderTransport(){return `<div class="grid">${VEHICLES.map(v=>`<article class="card"><h3>${v.name}</h3><p>${v.fare?`Fare around ₦${fmt(v.fare)}`:""}${v.purchase?` · Buy ₦${fmt(v.purchase)}`:""}</p><div class="actions"><button class="action primary" data-action="vehicle" data-id="${v.id}">${state.vehicle===v.id?"Active":v.purchase?"Buy & Use":"Use"}</button></div></article>`).join("")}</div>`}
function renderBusiness(){return `<div class="grid">${INVESTMENTS.map(i=>`<article class="card"><h3>${i.name}</h3><p>Investment ₦${fmt(i.cost)} · Weekly income ₦${fmt(i.income)} · Requires level ${i.req}.</p><div class="actions"><button class="action primary" data-action="business" data-id="${i.id}">${state.investments.includes(i.id)?"Owned":"Invest"}</button></div></article>`).join("")}</div>`}
function renderSkills(){return `<div class="grid">${SKILLS.map(k=>`<article class="card"><h3>${cap(k)}</h3><p>Level ${state.skills[k]} / 5</p><div class="actions"><button class="action primary" data-action="train" data-id="${k}">Train · ₦${fmt(450+state.skills[k]*400)}</button></div></article>`).join("")}</div>`}
function renderSocial(){return `<div class="grid">${npcs.slice(0,12).map(n=>`<article class="card"><h3>${n.name}</h3><p>Friendship ${Math.round(state.relationships[n.name]||0)} / 100</p><div class="actions"><button class="action primary" data-action="talk" data-id="${n.name}">Talk</button></div></article>`).join("")}</div>`}
function renderMap(){return `<div class="grid">${PLACES.map(p=>`<article class="card"><h3>${p.name}</h3><p>${Math.round(Math.hypot(player.root.position.x-p.x,player.root.position.z-p.z))}m away.</p><div class="actions"><button class="action primary" data-action="route" data-id="${p.id}">Set Route</button></div></article>`).join("")}</div>`}
function renderProfile(){const q=QUESTS[state.quest];return `<div class="stats"><div class="stat"><strong>Lv ${state.level}</strong><span>PLAYER</span></div><div class="stat"><strong>₦${fmt(state.totalEarnings)}</strong><span>LIFETIME EARNINGS</span></div><div class="stat"><strong>${state.career?CAREERS.find(c=>c.id===state.career)?.name:"No career"}</strong><span>CAREER</span></div><div class="stat"><strong>${state.investments.length}</strong><span>BUSINESSES</span></div></div><div class="sectionBlock"><h3>Current Quest</h3><div class="card"><h3>${q?.title||"All starter quests complete"}</h3><p>${q?.desc||"Keep building your life."}</p></div></div><div class="sectionBlock"><h3>Skills</h3><div class="list">${SKILLS.map(k=>`<div class="listRow"><b>${cap(k)}</b><span>Lv ${state.skills[k]}</span></div>`).join("")}</div></div><div class="actions"><button class="action" data-action="logout">SIGN OUT</button></div>`}
function handleAction(a,id){if(a==="open"){const modes={jobs:"jobs",gigs:"gigs",home:"home",skills:"skills",business:"business",transport:"transport",social:"social"};render(modes[id]);$("sheetTitle").textContent=cap(id);return}if(a==="career")doCareer(id);if(a==="gig")doGig(id);if(a==="train")train(id);if(a==="upgrade")upgradeHomeMenu();if(a==="rest")rest();if(a==="bath")bath();if(a==="cook")cook();if(a==="item")buyItem(id);if(a==="vehicle")useVehicle(id);if(a==="business")buyBusiness(id);if(a==="talk")talk(id);if(a==="route")setRoute(id);if(a==="logout")signOut()}
function refreshOpen(mode){render(mode)}
function doCareer(id){const c=CAREERS.find(x=>x.id===id);if(!c)return;if(state.career!==id){state.career=id;state.careerLevel=1;toast(`Career selected: ${c.name}.`);saveGame();refreshOpen("jobs");return}const skill=state.skills[c.skill];if(state.needs.energy<28||state.needs.focus<20){toast("You need more energy and focus before a full shift.");return}const pay=c.pay+(skill-1)*c.levelPay+Math.floor(state.careerLevel)*1300+(mood()==="Thriving"?1200:0);earn(pay);state.stats.shifts++;state.time+=120;addNeed("energy",-19);addNeed("hunger",-12);addNeed("focus",-10);addNeed("fun",-6);state.careerLevel=Math.min(5,state.careerLevel+(skill>=state.careerLevel?.15:0));toast(`Shift complete: +₦${fmt(pay)}.`);checkQuest();saveGame();updateHUD();refreshOpen("jobs")}
function doGig(id){const g=GIGS.find(x=>x.id===id);if(!g)return;if(state.skills[g.skill]<1){toast("Skill requirement not met.");return}if(!spend(g.cost)){toast("Not enough money for the gig costs.");return}let reward=g.reward+(state.skills[g.skill]-1)*700;earn(reward);state.stats.gigs++;state.time+=g.min;addNeed("energy",-10);addNeed("hunger",-7);addNeed("focus",-8);toast(`Gig complete: +₦${fmt(reward)}.`);checkQuest();saveGame();updateHUD();refreshOpen("gigs")}
function train(k){if(!hasSkill(k)||state.skills[k]>=5)return;const cost=450+state.skills[k]*400;if(!spend(cost)){toast("Not enough money.");return}if(state.needs.energy<20||state.needs.focus<20){state.money+=cost;toast("Too tired to train.");return}state.skills[k]++;state.time+=60;addNeed("energy",-13);addNeed("focus",-8);gainXP(22);toast(`${cap(k)} is now level ${state.skills[k]}.`);checkQuest();saveGame();updateHUD();refreshOpen("skills")}
function hasSkill(k){return k in state.skills}
function upgradeHomeMenu(){refreshOpen("housing");$("sheetTitle").textContent="Housing";$("sheetBody").innerHTML=HOUSING.map((h,i)=>`<article class="card"><h3>${h.name} · ${h.area}</h3><p>${h.desc}</p><div class="meta">Move ₦${fmt(h.move)} · Rent ₦${fmt(h.rent)} / 14 days</div><div class="actions"><button class="action primary" data-action="move" data-id="${i}">${i===state.housing?"Current":"Move Here"}</button></div></article>`).join("");bindActionsWithMove()}
function bindActionsWithMove(){$("sheetBody").querySelectorAll('[data-action="move"]').forEach(b=>b.onclick=()=>{const i=+b.dataset.id;if(i!==state.housing+1){toast("You can move one step at a time.");return}const h=HOUSING[i];if(!spend(h.move)){toast(`You need ₦${fmt(h.move)}.`);return}state.housing=i;state.rentDue=14;addNeed("energy",8);addNeed("hygiene",8);gainXP(45);toast(`Moved into ${h.name}.`);checkQuest();saveGame();updateHUD();upgradeHomeMenu()})}
function rest(){const gain=HOUSING[state.housing].comfort*.32;state.time+=360;addNeed("energy",gain);addNeed("fun",8);addNeed("hunger",-5);state.status="Resting";toast("You slept and recovered.");saveGame();updateHUD();refreshOpen("home")}
function bath(){state.time+=35;addNeed("hygiene",38);addNeed("bladder",30);addNeed("energy",-2);toast("Freshened up.");saveGame();updateHUD();refreshOpen("home")}
function cook(){if(!spend(600)){toast("You need ₦600 for ingredients.");return}state.inventory.push("home_meal");state.stats.meals++;state.time+=35;addNeed("hunger",30);addNeed("fun",3);toast("Meal ready.");checkQuest();saveGame();updateHUD();refreshOpen("home")}
function buyItem(id){const item=SHOPS.flatMap(s=>s.items).find(i=>i.id===id);if(!item||!spend(item.price)){toast("Not enough money.");return}state.inventory.push(item.id);for(const [k,v] of Object.entries(item.e))if(k in state.needs)addNeed(k,v);if(item.id==="gym")state.skills.fitness=Math.min(5,state.skills.fitness+1);if(["jollof","shawarma","drink"].includes(item.id))state.stats.meals++;state.time+=20;gainXP(6);toast(`Bought ${item.name}.`);checkQuest();saveGame();updateHUD()}
function useVehicle(id){const v=VEHICLES.find(x=>x.id===id);if(!v)return;if(v.purchase&&state.vehicle!==id){if(!spend(v.purchase)){toast(`You need ₦${fmt(v.purchase)}.`);return}}else if(v.fare){if(!spend(v.fare)){toast(`You need ₦${fmt(v.fare)} for the ride.`);return}state.time+=20;addNeed("energy",4)}state.vehicle=id;toast(`${v.name} selected.`);checkQuest();saveGame();updateHUD();render("transport")}
function buyBusiness(id){const inv=INVESTMENTS.find(x=>x.id===id);if(!inv||state.investments.includes(id))return;if(state.level<inv.req){toast(`Reach player level ${inv.req}.`);return}if(!spend(inv.cost)){toast(`You need ₦${fmt(inv.cost)}.`);return}state.investments.push(id);gainXP(60);toast(`${inv.name} is now part of your hustle.`);checkQuest();saveGame();updateHUD();render("business")}
function talk(name){state.relationships[name]=clamp((state.relationships[name]||0)+8);state.time+=15;addNeed("social",10);addNeed("fun",4);gainXP(8);toast(`You and ${name} connected.`);checkQuest();saveGame();render("social")}
function setRoute(id){const p=PLACES.find(x=>x.id===id);if(!p)return;route=p;routePulse=0;toast(`Route set: ${p.name}.`);$("overlay").classList.remove("open")}
function interact(){const {p,d}=nearestPlace();if(!p||d>11)return;if(p.kind==="job")open(p.name,"jobs");else if(p.kind==="home")open(p.name,"home");else if(p.kind==="market")open(p.name,"shop-market");else if(p.kind==="food")open(p.name,"shop-food");else if(p.kind==="style")open(p.name,"shop-style");else if(p.kind==="gym")open(p.name,"skills");else if(p.kind==="office")open(p.name,"business");else if(p.kind==="hall")open(p.name,"profile");else if(p.kind==="club"||p.kind==="hotel"||p.kind==="school")open(p.name,"social")}
async function signOut(){try{if(state.user)await db.auth.signOut()}catch(e){console.warn(e)}localStorage.removeItem(SAVE_KEY);location.reload()}
function checkQuest(){const q=QUESTS[state.quest];if(!q||!q.done(state))return;if(state.achievements.includes(q.id))return;state.achievements.push(q.id);state.money+=q.reward;gainXP(q.xp);state.quest++;toast(`Quest complete: ${q.title} · +₦${fmt(q.reward)}.`)}

function renderCustomizer(){const root=$("sections");root.innerHTML="";for(const [k,o] of Object.entries(OPTIONS)){const sec=document.createElement("section");sec.className="optionSection";const h=document.createElement("h3");h.textContent=o.label;sec.appendChild(h);const opts=document.createElement("div");opts.className="options";for(const [id,val] of Object.entries(o.values)){const b=document.createElement("button");b.className=`option ${state.cfg[k]===id?"active":""} ${o.kind==="swatch"?"swatch":""}`;if(o.kind==="swatch")b.style.background=val;else b.textContent=val;b.onclick=()=>{state.cfg[k]=id;rebuildPlayer();renderCustomizer()};opts.appendChild(b)}sec.appendChild(opts);root.appendChild(sec)}}
async function saveAvatar(){localStorage.setItem(AVATAR_KEY,JSON.stringify(state.cfg));toast("Avatar saved on this device.");try{if(state.user){const {error}=await db.rpc("save_avatar",{p_avatar:state.cfg});if(!error)toast("Avatar saved to your account.")}}catch(e){console.warn(e)}}
function saveGame(){const copy={...state,user:null,pos:{x:player?.root.position.x??state.pos.x,y:player?.root.position.y??0,z:player?.root.position.z??state.pos.z}};localStorage.setItem(SAVE_KEY,JSON.stringify(copy))}
async function loadGame(){try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const s=JSON.parse(raw);Object.assign(state,s);state.user=null;state.cfg=sanitize(s.cfg);state.needs={...state.needs,...(s.needs||{})};state.skills={...state.skills,...(s.skills||{})};state.relationships=s.relationships||{};state.inventory=s.inventory||[];state.investments=s.investments||[];state.achievements=s.achievements||[];state.pos=s.pos||state.pos}}catch(e){console.warn("local save",e)}try{const a=localStorage.getItem(AVATAR_KEY);if(a)state.cfg=sanitize(JSON.parse(a))}catch{}
 try{const {data:{session}}=await db.auth.getSession();if(session){state.user=session.user;state.guest=false;state.accountEmail=session.user.email||"";const {data}=await db.rpc("get_my_character");if(data?.id){state.name=data.name||state.name;state.district=data.district||state.district;if(data.avatar)state.cfg=sanitize(data.avatar)}}}catch(e){console.warn("cloud",e)}rebuildPlayer();updateHUD()}
function updateHUD(){$("name").textContent=state.name;$("levelBadge").textContent=`Lv ${state.level}`;$("sub").textContent=`${state.district} · ${state.career?CAREERS.find(c=>c.id===state.career)?.name:"Starting Out"}`;$("money").textContent=fmt(state.money);$("housingPill").textContent=HOUSING[state.housing].name;$("clock").textContent=currentClock();$("moodText").textContent=mood();$("objectiveText").textContent=state.activity;$("xpText").textContent=`${Math.round(state.xp)} / ${state.level*100} XP`;$('xpFill').style.width=`${state.xp/(state.level*100)*100}%`;for(const k of Object.keys(state.needs)){const id=k[0].toUpperCase()+k.slice(1),f=$(`need${id}`),v=$(`need${id}V`);if(f){f.style.width=`${state.needs[k]}%`;v.textContent=Math.round(state.needs[k])}}updatePrompt()}
function drawMinimap(){const c=$("minimap"),ctx=c.getContext("2d"),w=c.width,h=c.height,s=w/190;ctx.clearRect(0,0,w,h);ctx.fillStyle="#10201d";ctx.fillRect(0,0,w,h);ctx.fillStyle="#263a36";for(let i=-3;i<=3;i++){const q=(i*28+95)*s;ctx.fillRect(q,0,12*s,h);ctx.fillRect(0,q,w,12*s)}for(const p of PLACES){const x=(p.x+95)*s,y=(p.z+95)*s;ctx.fillStyle=p.color;ctx.fillRect(x-3,y-3,6,6)}const px=(player.root.position.x+95)*s,py=(player.root.position.z+95)*s;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill();if(route){const rx=(route.x+95)*s,ry=(route.z+95)*s;ctx.strokeStyle="#FFC20E";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(rx,ry);ctx.stroke();ctx.fillStyle="#FFC20E";ctx.beginPath();ctx.arc(rx,ry,5,0,Math.PI*2);ctx.fill()}}
function updatePrompt(){const {p,d}=nearestPlace();if(d<11){$("prompt").style.display="block";$("prompt").textContent=`Enter ${p.name}`}else $("prompt").style.display="none"}

function animate(){requestAnimationFrame(animate);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;updatePlayer(dt);updateNPCs(dt);updateCars(dt);updateCamera(dt);updateWorldLight();updateHUD();if((mapClock++&3)===0)drawMinimap();saveClock+=dt;if(saveClock>8){saveClock=0;saveGame()}renderer.render(scene,camera)}
async function start(){try{$("loading").style.display="flex";setup();await loadGame();$("loginScreen").classList.add("hidden");$("hud").classList.remove("hidden");$("loading").style.display="none";toast("Welcome to Naija Hustle. Start with one useful move.");animate()}catch(e){console.error("BOOT ERROR",e);$("loading").style.display="none";$("loginScreen").classList.remove("hidden");$("loginMessage").textContent="Game failed to start. Check the browser console."}}

$("loginBtn").onclick=async()=>{const email=$("loginEmail").value.trim(),password=$("loginPassword").value;$("loginMessage").textContent="";if(!email||!password){$("loginMessage").textContent="Enter email and password.";return}$("loginBtn").disabled=true;try{const {data,error}=await db.auth.signInWithPassword({email,password});if(error)throw error;if(!data.session)throw new Error("No session created.");await start()}catch(e){console.error(e);$("loginMessage").textContent=e.message||"Login failed."}finally{$("loginBtn").disabled=false}};
$("signupBtn").onclick=async()=>{const email=$("loginEmail").value.trim(),password=$("loginPassword").value;$("loginMessage").textContent="";if(!email||!password){$("loginMessage").textContent="Enter email and password.";return}$("signupBtn").disabled=true;try{const {data,error}=await db.auth.signUp({email,password});if(error)throw error;$("loginMessage").textContent=data.session?"Account created. Starting...":"Account created. Check your email, then log in.";if(data.session)await start()}catch(e){console.error(e);$("loginMessage").textContent=e.message||"Sign up failed."}finally{$("signupBtn").disabled=false}};
$("guestBtn").onclick=async()=>{state.guest=true;state.user=null;await start()};

start();
