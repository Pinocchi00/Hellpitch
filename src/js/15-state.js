/* Sauvegarde, stats, puissance, objets, combats */
/* ================= ÉTAT ================= */
const KEY="hellpitch-save-v3",OLD_KEYS=["la-fosse-save-v3"];let G=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(G));}catch(e){}}
function load(){try{let s=localStorage.getItem(KEY);if(!s)for(const k of OLD_KEYS){s=localStorage.getItem(k);if(s)break;}return s?JSON.parse(s):null;}catch(e){return null;}}
function fresh(){const tr={};STATS.forEach(k=>tr[k]=0);return{name:"Sans-Nom",poste:null,base:null,trained:tr,points:0,equip:{},bag:[],eclats:0,fight:0,wins:0,losses:0,seen:{},flags:{},marks:[],endless:null};}
function itemBonus(it){const f=1+.12*(it.up||0),b={};b[it.main.k]=Math.round(it.main.v*f);if(it.sub)b[it.sub.k]=(b[it.sub.k]||0)+Math.round(it.sub.v*f);return b;}
function statsOf(g,equip){const s={};STATS.forEach(k=>s[k]=(g.base?g.base[k]:0)+(g.trained[k]||0));
  Object.values(equip||g.equip).forEach(it=>{if(it){const b=itemBonus(it);for(const k in b)s[k]+=b[k];}});
  (g.marks||[]).forEach(m=>{const f=MARKS[m].flat;if(f)for(const k in f)s[k]+=f[k];});return s;}
function perksOf(g){const p=new Set();Object.values(g.equip).forEach(it=>{if(it&&it.perk)p.add(it.perk);});(g.marks||[]).forEach(m=>{if(MARKS[m].perk)p.add(MARKS[m].perk);});return p;}
const total=s=>STATS.reduce((a,k)=>a+s[k],0);
const power=s=>Math.round(1e6*Math.pow(clamp(total(s)/900,0,1),3));
const myPower=()=>power(statsOf(G));
function powerIfEquip(it){const e=Object.assign({},G.equip);e[it.slot]=it;return power(statsOf(G,e));}
function mkItem(slot,rar,lvl){const S=SLOTS[slot],m=RAR[rar].m,base=5+lvl*1.6;let main,sub;
  if(S.st){main={k:S.st[0],v:Math.max(1,Math.round(base*m))};sub={k:S.st[1],v:Math.max(1,Math.round(base*m*.5))};}
  else{const ks=shuffle(STATS);main={k:ks[0],v:Math.max(1,Math.round(base*m*1.1))};sub={k:ks[1],v:Math.max(1,Math.round(base*m*.4))};}
  const perk=(rar>=3||(rar===2&&Math.random()<.5))?rnd(Object.keys(PERKS)):null;
  return{id:uid(),slot,rar,lvl,up:0,name:rnd(S.names)+" "+rnd(EPI),main,sub,perk,isNew:true};}
const upCost=it=>Math.round(8*((it.up||0)+1)*(1+it.rar*.6));
const salvageVal=it=>Math.round((3+it.lvl*.5)*(1+it.rar)*(1+.5*(it.up||0)));
function rollRar(lvl,boss,win){const luck=perksOf(G).has("butin")?.08:0;const r=Math.random()+lvl*.022+(boss?.15:0)+luck-(win?0:.3);return r<.55?0:r<.82?1:r<.95?2:r<1.04?3:4;}
function giveItem(it){G.bag.push(it);}
let pendingMarks=[];
function addMark(id){if(!G.marks.includes(id)){G.marks.push(id);const m=MARKS[id];if(m.pts)G.points+=m.pts;pendingMarks.push(id);}}
function curFight(){
  const k=G.fight;
  if(k<NFIGHTS){const f=k===11?(G.flags.vasko===1?FIGHT11.ally:FIGHT11.enemy):FIGHTS[k];return Object.assign({k,ch:Math.floor(k/3)},f);}
  if(!G.endless){G.endless={n:rnd(ENDLESS),p:rnd(["att","mil","def"]),boss:k%3===2,col:0x3a3040,intro:pick(L.endless)};save();}
  return Object.assign({k,ch:4},G.endless);
}
function mkOpp(fi){const prof=POSTES[fi.p].s,sum=total(prof),T=250+fi.k*30+(fi.boss?30:0),s={};STATS.forEach(k=>s[k]=Math.round(prof[k]/sum*T));
  const perks=new Set();if(fi.boss)perks.add(fi.p==="def"?"mur":"finisseur");if(fi.k>=12)perks.add("orgueil");
  return{name:fi.n,poste:fi.p,trait:POSTES[fi.p].trait,s,boss:!!fi.boss,perks};}
