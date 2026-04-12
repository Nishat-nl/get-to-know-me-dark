/**
 * DB.JS — Hybrid localStorage + IndexedDB
 * Cars, sports, studio metadata, travel, profile, highlights -> localStorage
 * Studio audio blobs -> IndexedDB
 */
const DB_KEYS = {
  cars:'ryansite_cars',
  sports:'ryansite_sports',
  studio:'ryansite_studio',
  travel:'ryansite_travel',
  profile:'ryansite_profile',
  highlights:'ryansite_highlights',
};

const IDB_NAME='ryansite_audio';
const IDB_VERSION=1;
const IDB_STORE='recordings';

const SEED = {
  cars: [
    { id:'car_seed1', name:'Porsche 911 GT3', brand:'Porsche', tag:'Ultimate Favorite', year:'2023', description:'The GT3 is pure driving perfection. Naturally aspirated flat-six, rear-wheel drive, and a soundtrack that gives goosebumps every single time.', coverImage:'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=900&q=85' },
    { id:'car_seed2', name:'BMW M4 Competition', brand:'BMW', tag:'Track Beast', year:'2024', description:'Aggressive, sharp, and uncompromisingly driver-focused. The M4 is the kind of car that makes every road feel like a racetrack.', coverImage:'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&q=85' },
    { id:'car_seed3', name:'Mercedes-AMG GT', brand:'Mercedes', tag:'Dream Daily', year:'2023', description:'The AMG GT is what happens when Mercedes stops being polite and starts being serious. Brutal power, elegant lines.', coverImage:'https://images.unsplash.com/photo-1622175836062-5e053779ef7d?w=900&q=85' }
  ],
  sports: [
    { id:'sport_seed1', name:'Football', subtitle:'Central Midfielder', rating:87, coverImage:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=85',
      stats:[{label:'Pace',value:85},{label:'Shooting',value:80},{label:'Passing',value:90},{label:'Dribbling',value:83},{label:'Defense',value:74},{label:'Physical',value:88}],
      memories:'Best feeling is scoring in a close game — that rush is unmatched.',
      favPlayer:{name:'Kylian Mbappé', info:'The fastest player in the world. His combination of pace, technique, and composure under pressure is on another level entirely.', photos:['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80','https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600&q=80','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80']},
      photos:['https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600&q=80','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80','https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600&q=80']
    },
    { id:'sport_seed2', name:'Basketball', subtitle:'Point Guard', rating:82, coverImage:'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=85',
      stats:[{label:'Speed',value:88},{label:'Shooting',value:79},{label:'Playmaking',value:91},{label:'Defense',value:76},{label:'Stamina',value:85},{label:'IQ',value:90}],
      memories:'Reading the court and making the right play at the right moment — that\'s everything.',
      favPlayer:{name:'LeBron James', info:'The greatest of all time. His basketball IQ, versatility, and longevity are simply unmatched in NBA history.', photos:['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80','https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80']},
      photos:['https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80']
    }
  ],
  studio: [
    { id:'studio_seed1', title:'Vocals', category:'Original & Covers', mood:'Soulful', coverImage:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=85', description:'Raw, expressive, and full of feeling. Every performance is a story.', recordings:[] },
    { id:'studio_seed2', title:'Guitar', category:'Acoustic Sessions', mood:'Chill', coverImage:'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900&q=85', description:'Late nights, a guitar, and a melody that says everything words can\'t.', recordings:[] }
  ],
  travel: [
    { id:'travel_seed1', place:'Tokyo', country:'Japan', year:'2023', tags:['City','Culture','Food'], coverImage:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=85', note:'Tokyo is like nowhere else on Earth. The energy, the food, the precision — completely unforgettable.', favoriteMoment:'Watching the city light up from the Tokyo Skytree at night.', bestFood:'Wagyu ramen at midnight in Shinjuku.', revisit:true, photos:['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80','https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=700&q=80','https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80'] },
    { id:'travel_seed2', place:'Dubai', country:'UAE', year:'2022', tags:['Luxury','City','Adventure'], coverImage:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=85', note:'Where ambition meets architecture. Dubai doesn\'t dream small.', favoriteMoment:'Desert safari at sunset — absolute silence in the middle of everything.', bestFood:'Grilled hammour fish on the waterfront.', revisit:true, photos:['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80','https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=700&q=80'] }
  ],
  profile: {
    name:"Injamam",
    nickname:"The One",
    tagline:"Car Enthusiast. Athlete. Artist. Explorer. And More",
    bio:"A man of many worlds — equally at home behind the wheel, on the pitch, on stage, or crossing borders. This is my universe.",
    profileImage:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    favoriteTeam:"Real Madrid",
    favoriteCar:"Porsche 911 GT3",
    favoriteGenre:"R&B / Soul",
    favoritePlace:"Bangladesh",
    favoriteQuote:"\"The road doesn't care about your excuses.\"",
    stats:[{label:"Speed",value:92},{label:"Stamina",value:88},{label:"Stage Presence",value:95},{label:"Discipline",value:84},{label:"Charisma",value:97},{label:"Confidence",value:91},{label:"Loyalty",value:99},{label:"Style",value:96}]
  },
  highlights: [
    { id:'ach_1', icon:'🏆', title:'Tournament Champion', subtitle:'Sports', description:'Led the team to victory in the regional football tournament.', rarity:'Legendary' },
    { id:'ach_2', icon:'🎤', title:'Stage Ready', subtitle:'Music', description:'First live performance in front of a crowd — owned every second.', rarity:'Epic' },
    { id:'ach_3', icon:'✈️', title:'World Traveler', subtitle:'Travel', description:'Visited 10+ countries across 4 continents.', rarity:'Epic' },
    { id:'ach_4', icon:'🚗', title:'Petrolhead', subtitle:'Cars', description:'Encyclopedic knowledge of anything with an engine.', rarity:'Rare' },
    { id:'ach_5', icon:'⚡', title:'Unbreakable', subtitle:'Character', description:'Shows up, every single time, no matter what.', rarity:'Legendary' }
  ]
};

let _idb=null;
function openIDB(){
  if(_idb) return Promise.resolve(_idb);
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded=e=>{ const db=e.target.result; if(!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE,{keyPath:'id'}); };
    req.onsuccess=e=>{ _idb=e.target.result; resolve(_idb); };
    req.onerror=e=>reject(e.target.error);
  });
}
function idbPut(record){ return openIDB().then(db=>new Promise((resolve,reject)=>{ const req=db.transaction(IDB_STORE,'readwrite').objectStore(IDB_STORE).put(record); req.onsuccess=()=>resolve(true); req.onerror=e=>reject(e.target.error); })); }
function idbGet(id){ return openIDB().then(db=>new Promise((resolve,reject)=>{ const req=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(id); req.onsuccess=e=>resolve(e.target.result||null); req.onerror=e=>reject(e.target.error); })); }
function idbDelete(id){ return openIDB().then(db=>new Promise((resolve,reject)=>{ const req=db.transaction(IDB_STORE,'readwrite').objectStore(IDB_STORE).delete(id); req.onsuccess=()=>resolve(true); req.onerror=e=>reject(e.target.error); })); }
window.idbPut=idbPut; window.idbGet=idbGet; window.idbDelete=idbDelete;

function lsGet(key){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):null; }catch{return null;} }
function lsSet(key,val){ try{ localStorage.setItem(key, JSON.stringify(val)); return true; } catch(e){ console.error(e); return false; } }
function clone(v){ return JSON.parse(JSON.stringify(v)); }

const DB = {
  getCars(){ return lsGet(DB_KEYS.cars) || clone(SEED.cars); },
  saveCars(arr){ return lsSet(DB_KEYS.cars, arr); },
  addCar(car){ const a=this.getCars(); a.unshift(car); return this.saveCars(a); },
  updateCar(car){ return this.saveCars(this.getCars().map(c=>c.id===car.id?car:c)); },
  deleteCar(id){ return this.saveCars(this.getCars().filter(c=>c.id!==id)); },

  getSports(){ return lsGet(DB_KEYS.sports) || clone(SEED.sports); },
  saveSports(arr){ return lsSet(DB_KEYS.sports, arr); },
  addSport(item){ const a=this.getSports(); a.unshift(item); return this.saveSports(a); },
  updateSport(item){ return this.saveSports(this.getSports().map(s=>s.id===item.id?item:s)); },
  deleteSport(id){ return this.saveSports(this.getSports().filter(s=>s.id!==id)); },

  getStudio(){ return lsGet(DB_KEYS.studio) || clone(SEED.studio); },
  saveStudio(arr){ return lsSet(DB_KEYS.studio, arr); },
  addStudioItem(item){ const a=this.getStudio(); a.unshift({ ...item, recordings:(item.recordings||[]).map(r=>({id:r.id,name:r.name})) }); return this.saveStudio(a); },
  updateStudioItem(item){ return this.saveStudio(this.getStudio().map(s=>s.id===item.id?{...item, recordings:(item.recordings||[]).map(r=>({id:r.id,name:r.name}))}:s)); },
  deleteStudioItem(id){ const item=this.getStudio().find(s=>s.id===id); if(item) (item.recordings||[]).forEach(r=>idbDelete(r.id).catch(()=>{})); return this.saveStudio(this.getStudio().filter(s=>s.id!==id)); },
  addRecordingMeta(studioId, rec){ const items=this.getStudio(); const item=items.find(s=>s.id===studioId); if(!item) return false; item.recordings=item.recordings||[]; item.recordings.push({id:rec.id,name:rec.name}); return this.saveStudio(items); },
  async deleteRecording(studioId, recId){ await idbDelete(recId).catch(()=>{}); const items=this.getStudio(); const item=items.find(s=>s.id===studioId); if(!item) return false; item.recordings=(item.recordings||[]).filter(r=>r.id!==recId); return this.saveStudio(items); },
  async getRecordingURL(recId){ const record=await idbGet(recId); if(!record||!record.blob) return null; return URL.createObjectURL(record.blob); },

  getTravel(){ return lsGet(DB_KEYS.travel) || clone(SEED.travel); },
  saveTravel(arr){ return lsSet(DB_KEYS.travel, arr); },
  addTravel(item){ const a=this.getTravel(); a.unshift(item); return this.saveTravel(a); },
  updateTravel(item){ return this.saveTravel(this.getTravel().map(t=>t.id===item.id?item:t)); },
  deleteTravel(id){ return this.saveTravel(this.getTravel().filter(t=>t.id!==id)); },

  getProfile(){ return lsGet(DB_KEYS.profile) || clone(SEED.profile); },
  saveProfile(profile){ return lsSet(DB_KEYS.profile, profile); },

  getHighlights(){ return lsGet(DB_KEYS.highlights) || clone(SEED.highlights); },
  saveHighlights(arr){ return lsSet(DB_KEYS.highlights, arr); },
  addHighlight(item){ const a=this.getHighlights(); a.unshift(item); return this.saveHighlights(a); },
  updateHighlight(item){ return this.saveHighlights(this.getHighlights().map(h=>h.id===item.id?item:h)); },
  deleteHighlight(id){ return this.saveHighlights(this.getHighlights().filter(h=>h.id!==id)); },

  fileToBase64(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=()=>rej(new Error('File read failed')); r.readAsDataURL(file); }); },
  uid(prefix){ return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2,5)}`; }
};