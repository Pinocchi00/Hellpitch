/* Écrans et boucle principale */

/* ================= ÉCRANS ================= */
const SCREENS=["title","story","pick","starter","train","hub","bag","loot","hud","result"];
let busy=false;
const TALL={pick:1,starter:1,train:1,bag:1};
function show(id){SCREENS.forEach(s=>$(s).classList.toggle("hide",s!==id));camShift=TALL[id]?-1.45:-.35;if(id!=="hud")$("banner").className="";closeSheet();}
function fade(cb){const f=$("fade");f.classList.add("on");setTimeout(()=>{cb();snapCam=true;setTimeout(()=>f.classList.remove("on"),80);},320);}
const LDQ={fosse:"Ici, pas d'arbitre. Pas de pardon.",cimetiere:"Les morts regardent. Ils n'applaudissent pas.",forge:"Il fait chaud. Les crampons fondent.",cathedrale:"Les dieux sont partis. Le public est resté.",fosserouge:"Tout finit là où tout a commencé."};
function ensureStage(ch,cb){const k=STADES[ch].key;if(stageKey===k){cb();return;}
  $("ldCh").textContent=G&&G.fight>=NFIGHTS?"Hors de la carte":"Chapitre "+ROM[ch];$("ldName").textContent=STADES[ch].nom;$("ldQuote").textContent=Math.random()<.6?LDQ[k]:pick(L.tips);
  const L0=$("loading");L0.classList.add("on");setTimeout(()=>{buildStage(k);placeScene();cb();snapCam=true;setTimeout(()=>L0.classList.remove("on"),RM?200:1300);},380);}
function toast(){const t=$("toast");t.classList.add("on");setTimeout(()=>t.classList.remove("on"),2200);}
const bar=v=>{let h='<span class="segs">';const on=Math.min(10,Math.round(v/10)),ov=Math.max(0,Math.round((v-100)/10));for(let i=0;i<10;i++)h+='<i class="seg'+(i<ov?" ov":i<on?" on":"")+'"></i>';return h+"</span>";};
const fill=t=>t.replace("{poste}",G&&G.poste?POSTES[G.poste].nom:"").replace("{nom}",G?G.name:"");

/* Icônes pixel */
const ICON={};
function shade(hex,f){const n=parseInt(hex.slice(1),16),c=v=>clamp(Math.round(v*f),0,255);return"rgb("+c((n>>16)&255)+","+c((n>>8)&255)+","+c(n&255)+")";}
function shapes(slot,x,c,h,d){const R=(a,b,w,hh,col)=>{x.fillStyle=col;x.fillRect(a,b,w,hh);};
  switch(slot){
    case"bandeau":R(2,6,12,4,c);R(2,6,12,1,h);R(12,9,2,4,c);R(10,10,2,4,d);break;
    case"maillot":R(4,4,8,10,c);R(1,4,3,4,c);R(12,4,3,4,c);R(7,4,2,2,d);R(4,4,8,1,h);R(5,8,6,1,d);break;
    case"brassard":R(3,5,10,6,c);R(3,5,10,1,h);R(3,7,10,1,d);R(3,9,10,1,d);break;
    case"jambieres":R(5,2,6,12,c);R(5,2,6,1,h);R(5,5,6,1,d);R(5,9,6,1,d);R(5,13,6,1,d);break;
    case"crampons":R(4,2,5,9,c);R(4,10,10,3,c);R(4,2,5,1,h);R(9,10,5,1,h);R(5,13,1,1,d);R(8,13,1,1,d);R(11,13,1,1,d);break;
    case"talisman":for(let i=0;i<5;i++){R(3+i,2+i,1,1,h);R(12-i,2+i,1,1,h);}R(6,7,4,6,c);R(5,8,6,4,c);R(6,7,4,1,h);R(7,9,2,2,d);break;}}
function iconURL(slot,rar){const key=slot+rar;if(ICON[key])return ICON[key];const cv=document.createElement("canvas");cv.width=cv.height=16;const x=cv.getContext("2d"),col=RAR[rar].c;
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(o=>{x.save();x.translate(o[0],o[1]);shapes(slot,x,"#000","#000","#000");x.restore();});shapes(slot,x,col,shade(col,1.3),shade(col,.5));return ICON[key]=cv.toDataURL();}
const icon=(slot,rar,cls)=>'<span class="ic'+(cls?" "+cls:"")+'" style="background-image:url('+iconURL(slot,rar)+')"></span>';
function itemCard(it,o){o=o||{};const r=RAR[it.rar],b=itemBonus(it);
  let h='<div class="shtop" style="margin:0 0 .55rem">'+icon(it.slot,it.rar)+'<div><div class="nm">'+esc(it.name)+'</div><div class="meta">'+SLOTS[it.slot].nom+' <span class="r">· '+r.n+"</span>"+(it.up?" · +"+it.up:"")+'</div></div></div><div class="bon">'+Object.entries(b).map(([k,v])=>"<span>+"+v+" "+LAB[k]+"</span>").join("")+"</div>";
  if(it.perk)h+='<p class="perk" style="margin:.45rem 0 0"><b>'+PERKS[it.perk].n+"</b>"+PERKS[it.perk].d+"</p>";
  if(o.delta!==undefined)h+='<div class="pw'+(o.delta<0?" neg":"")+'">'+(o.delta>=0?"+":"−")+nf(Math.abs(o.delta))+" puissance</div>";return h;}

/* ================= HISTOIRE ================= */
let SQ=[],sqDone=null,typeTimer=null,typeFull="",choosing=false;
function marksLines(){return pendingMarks.splice(0).map(id=>({who:"Nouvelle marque",t:MARKS[id].n+". "+MARKS[id].d,sys:1}));}
function story(k,done){G.seen[k]=1;save();let ls=STORY[k];if(typeof ls==="function")ls=ls(G);SQ=ls.slice();sqDone=done;choosing=false;$("dCh").classList.add("hide");
  $("stChap").textContent=CHAPTITLE[k]||"";const fi=curFight();recolorOpp(fi);placeScene();hideNpcs();show("story");camMode="story";speaker=BG;nextLine();}
function finishType(){clearInterval(typeTimer);typeTimer=null;$("dTxt").textContent=typeFull;}
function setSpeaker(who){[BG,OP,MIRA,PIP,VASKO].forEach(a=>{if(a.mode==="talk")a.mode="idle";});
  if(who==="Le Borgne"){hideNpcs();ME.rig.g.visible=true;speaker=BG;BG.mode="talk";}
  else if(NPCS[who]){hideNpcs();ME.rig.g.visible=false;const n=NPCS[who];n.pos.set(-1.5,0,.2);n.face=.35;snapActor(n);n.rig.g.visible=true;n.mode="talk";speaker=n;}
  else if(who==="Nouvelle marque"||who==="Coffre"){}
  else{hideNpcs();ME.rig.g.visible=true;speaker=OP;OP.face=.35;OP.mode="talk";}}
function nextLine(){
  if(choosing)return;
  if(typeTimer){finishType();return;}
  if(!SQ.length){[BG,OP,MIRA,PIP,VASKO].forEach(a=>{if(a.mode==="talk")a.mode="idle";});const d=sqDone;sqDone=null;save();if(d)d();return;}
  const o=SQ.shift();
  if(o.fx&&!o.t&&!o.ch){o.fx(G);save();SQ=marksLines().concat(SQ);nextLine();return;}
  if(o.ch){choosing=true;$("dMore").classList.add("hide");$("dCh").innerHTML=o.ch.map((c,i)=>'<button class="btn'+(i===0?" primary":"")+'" data-i="'+i+'">'+esc(c.t)+"</button>").join("");$("dCh").classList.remove("hide");
    $("dCh").onclick=e=>{e.stopPropagation();const b=e.target.closest("[data-i]");if(!b)return;const c=o.ch[+b.dataset.i];if(c.fx)c.fx(G);save();SQ=(c.then||[]).concat(marksLines(),SQ);choosing=false;$("dCh").classList.add("hide");$("dMore").classList.remove("hide");nextLine();};return;}
  $("dWho").textContent=o.who;$("dWho").classList.toggle("sys",!!o.sys||o.who==="Coffre");setSpeaker(o.who);
  typeFull=fill(o.t);let i=0;$("dTxt").textContent="";
  if(RM){$("dTxt").textContent=typeFull;return;}
  typeTimer=setInterval(()=>{i+=2;$("dTxt").textContent=typeFull.slice(0,i);if(i>=typeFull.length)finishType();},22);
}
$("story").onclick=nextLine;

/* ================= PROLOGUE ================= */
let chosen="att";const PK=Object.keys(POSTES);
function renderPostes(){const p=POSTES[chosen];let h='<div class="poste plate"><h3>'+p.nom+'</h3><p class="d">'+p.desc+'</p><p class="trait"><b>'+p.tn+"</b>"+p.td+'</p><div class="stats">';STATS.forEach(s=>{h+="<span>"+LAB[s]+"</span>"+bar(p.s[s])+"<b>"+p.s[s]+"</b>";});$("postes").innerHTML=h+"</div></div>";
  $("pDots").innerHTML=PK.map(k=>'<i class="'+(k===chosen?"on":"")+'"></i>').join("");}
const stepPoste=n=>{chosen=PK[(PK.indexOf(chosen)+n+PK.length)%PK.length];renderPostes();};
$("pPrev").onclick=()=>stepPoste(-1);$("pNext").onclick=()=>stepPoste(1);
let tx0=null;$("postes").addEventListener("touchstart",e=>{tx0=e.touches[0].clientX;},{passive:true});$("postes").addEventListener("touchend",e=>{if(tx0===null)return;const dx=e.changedTouches[0].clientX-tx0;if(Math.abs(dx)>40)stepPoste(dx<0?1:-1);tx0=null;});
function showPick(){renderPostes();show("pick");camMode="hub";}
$("bPick").onclick=()=>{G.name=($("pname").value.trim()||"Sans-Nom").slice(0,16);G.poste=chosen;G.base=Object.assign({},POSTES[chosen].s);save();story("prologue_b",showStarter);};
let stChoices=[],stSel=0;
function showStarter(){const sl=shuffle(SLOTK).slice(0,3);stChoices=sl.map((s,i)=>mkItem(s,i===0?1:0,0));stSel=0;renderStarter();show("starter");camMode="hub";}
function renderStarter(){const cur=myPower();$("stItems").innerHTML=stChoices.map((it,i)=>'<button class="item plate" data-i="'+i+'" aria-pressed="'+(i===stSel)+'" style="--rc:'+RAR[it.rar].c+'">'+itemCard(it,{delta:powerIfEquip(it)-cur})+"</button>").join("");}
$("stItems").onclick=e=>{const b=e.target.closest(".item");if(!b)return;stSel=+b.dataset.i;renderStarter();};
$("bStart").onclick=()=>{const it=stChoices[stSel];it.isNew=false;G.equip[it.slot]=it;G.points+=3;save();updateGear();story("prologue_c",()=>showTrain(()=>story("prologue_d",goHub)));};

/* ================= ENTRAÎNEMENT ================= */
let tAlloc=null,tDone=null;
function showTrain(done){tDone=done||goHub;tAlloc={};STATS.forEach(k=>tAlloc[k]=0);$("tTip").innerHTML="<b>Le Borgne</b>"+esc(pick(L.train));renderTrain();show("train");camMode="hub";}
function renderTrain(){const used=STATS.reduce((a,k)=>a+tAlloc[k],0),left=G.points-used,s=statsOf(G),tmp={};$("tPts").textContent=left;
  $("tRows").innerHTML=STATS.map(k=>{const v=s[k]+tAlloc[k]*4;tmp[k]=v;return '<div class="trow"><span>'+LAB[k]+(tAlloc[k]?'<span class="add">+'+tAlloc[k]*4+"</span>":"")+"</span>"+bar(v)+"<b>"+v+'</b><button class="plus" data-k="'+k+'"'+(left<=0?" disabled":"")+' aria-label="Entraîner '+LAB[k]+'">+</button></div>';}).join("");
  $("tPow").innerHTML='<span class="k">Puissance après l\'entraînement</span><b>'+nf(power(tmp))+"</b>";
  $("tMarks").innerHTML=G.marks.length?'<div class="plate trows"><div class="k" style="padding:.4rem 0">Marques</div>'+G.marks.map(m=>'<div class="mark"><b>'+MARKS[m].n+"</b><span>"+MARKS[m].d+"</span></div>").join("")+"</div>":"";
  $("bTUndo").disabled=!used;}
$("tRows").onclick=e=>{const b=e.target.closest(".plus");if(!b||b.disabled)return;tAlloc[b.dataset.k]++;renderTrain();};
$("bTUndo").onclick=()=>{STATS.forEach(k=>tAlloc[k]=0);renderTrain();};
$("bTDone").onclick=()=>{let used=0;STATS.forEach(k=>{G.trained[k]+=tAlloc[k]*4;used+=tAlloc[k];});G.points-=used;save();const d=tDone;tDone=null;d();};

/* ================= CAMP ================= */
function goHub(){busy=false;const fi=curFight();ensureStage(fi.ch,()=>{placeScene();recolorOpp(fi);renderHub();camMode="hub";show("hub");});}
function slotTile(k,it){return '<button class="slot" data-s="'+k+'"'+(it?' style="--rc:'+RAR[it.rar].c+'"':"")+' aria-label="'+SLOTS[k].nom+(it?", "+esc(it.name):", vide")+'">'+icon(k,it?it.rar:0,it?"":"empty")+(it&&it.up?'<span class="up">+'+it.up+"</span>":"")+'<span class="l">'+SLOTS[k].nom+"</span></button>";}
function renderHub(){const fi=curFight(),O=mkOpp(fi);
  $("hCh").textContent=fi.k>=NFIGHTS?"Hors de la carte":"Chapitre "+ROM[fi.ch];$("hSt").textContent=STADES[fi.ch].nom;
  $("hPow").textContent=nf(myPower());$("hEcl").textContent=G.eclats+" éclats";
  $("hName").textContent=G.name;$("hPoste").textContent=POSTES[G.poste].nom+", "+POSTES[G.poste].tn;
  $("hRec").textContent=G.wins+" victoire"+(G.wins>1?"s":"")+", "+G.losses+" défaite"+(G.losses>1?"s":"");
  $("hSlots").innerHTML=SLOTK.map(k=>slotTile(k,G.equip[k])).join("");
  const n=fi.k<NFIGHTS?(fi.k%3)+1:0;
  $("hFight").innerHTML='<div><span class="k">'+(fi.boss?"Dernier combat du chapitre":n?"Combat "+n+" sur 3":"Combat sans fin")+'</span><span class="opp'+(fi.boss?" boss":"")+'">'+esc(fi.n)+'</span><span class="k">'+POSTES[fi.p].nom+'</span></div><div class="r"><span class="k">Puissance</span><b>'+nf(power(O.s))+"</b></div>";
  $("hPts").textContent=G.points?G.points+" point"+(G.points>1?"s":""):"";const nn=G.bag.filter(x=>x.isNew).length;$("hBagN").textContent=nn?nn+" nouveau"+(nn>1?"x":""):G.bag.length?G.bag.length+" objet"+(G.bag.length>1?"s":""):"";}
$("hSlots").onclick=e=>{const b=e.target.closest(".slot");if(!b)return;const k=b.dataset.s;if(G.equip[k]){openBag("all");openSheet(G.equip[k],true);}else openBag(k);};
$("bTrain").onclick=()=>showTrain(goHub);
$("bBag").onclick=()=>openBag("all");
$("bFight").onclick=()=>{if(busy)return;busy=true;fade(startMatch);};
$("bToTitle").onclick=()=>fade(showTitle);

/* ================= SAC ================= */
let bagFilter="all",bagSort="rar";const SORTS={rar:"Rareté",pow:"Puissance",new:"Récent"};
const itemScore=it=>Object.values(itemBonus(it)).reduce((a,b)=>a+b,0);
function openBag(f){bagFilter=f||"all";renderBag();show("bag");camMode="hub";}
function renderBag(){$("bPow").textContent=nf(myPower());$("bEcl").textContent=G.eclats+" éclats";
  $("bEq").innerHTML=SLOTK.map(k=>slotTile(k,G.equip[k])).join("");
  $("bChips").innerHTML=["all"].concat(SLOTK).map(k=>'<button class="chip" data-f="'+k+'" aria-pressed="'+(k===bagFilter)+'">'+(k==="all"?"Tout":SLOTS[k].nom)+"</button>").join("");
  $("bSort").textContent="Trier : "+SORTS[bagSort];
  let list=G.bag.filter(it=>bagFilter==="all"||it.slot===bagFilter);
  if(bagSort==="rar")list.sort((a,b)=>b.rar-a.rar||itemScore(b)-itemScore(a));else if(bagSort==="pow")list.sort((a,b)=>itemScore(b)-itemScore(a));else list=list.slice().reverse();
  $("bGrid").innerHTML=list.length?list.map(it=>'<button class="tile" data-id="'+it.id+'" style="--rc:'+RAR[it.rar].c+'" aria-label="'+esc(it.name)+'">'+(it.isNew?'<i class="nw"></i>':"")+icon(it.slot,it.rar)+(it.up?'<span class="up">+'+it.up+"</span>":"")+"</button>").join("")
    :'<p class="quote empty-msg"><b>Pip</b>Le sac est vide. Gagne des matchs, je le remplirai.</p>';}
$("bChips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;bagFilter=b.dataset.f;renderBag();};
$("bSort").onclick=()=>{const k=Object.keys(SORTS);bagSort=k[(k.indexOf(bagSort)+1)%k.length];renderBag();};
$("bGrid").onclick=e=>{const b=e.target.closest(".tile");if(!b)return;const it=G.bag.find(x=>x.id===b.dataset.id);if(it)openSheet(it,false);};
$("bEq").onclick=e=>{const b=e.target.closest(".slot");if(!b)return;const it=G.equip[b.dataset.s];if(it)openSheet(it,true);else{bagFilter=b.dataset.s;renderBag();}};
$("bBagClose").onclick=()=>{renderHub();show("hub");camMode="hub";};

let shIt=null,shEq=false;
function openSheet(it,eq){shIt=it;shEq=eq;if(it.isNew){it.isNew=false;save();}const r=RAR[it.rar];
  $("sheet").style.setProperty("--rc",r.c);$("shIc").style.backgroundImage="url("+iconURL(it.slot,it.rar)+")";
  $("shNm").textContent=it.name;$("shMeta").innerHTML=SLOTS[it.slot].nom+" · <span style='color:"+r.c+"'>"+r.n+"</span> · Niveau "+(it.lvl+1)+(it.up?" · Renforcé +"+it.up:"")+(eq?" · Porté":"");
  const b=itemBonus(it),cur=!eq&&G.equip[it.slot]?itemBonus(G.equip[it.slot]):null,keys=STATS.filter(k=>b[k]||(cur&&cur[k]));
  $("shStats").innerHTML=keys.map(k=>{const v=b[k]||0;let d="";if(cur){const dv=v-(cur[k]||0);d='<span class="d '+(dv>0?"up":dv<0?"dn":"eq0")+'">'+(dv>0?"+"+dv:dv<0?"−"+(-dv):"=")+"</span>";}else d='<span class="d"></span>';return "<span>"+LAB[k]+"</span><b>"+(v?"+"+v:"0")+"</b>"+d;}).join("")
    +(cur?'<span class="k" style="grid-column:1/-1;margin-top:.2rem">Comparé à ce que tu portes</span>':"");
  $("shPerk").innerHTML=it.perk?"<b>"+PERKS[it.perk].n+"</b>"+PERKS[it.perk].d:"";$("shPerk").classList.toggle("hide",!it.perk);
  const cost=upCost(it),canUp=(it.up||0)<5,afford=G.eclats>=cost;let h="";
  if(!eq)h+='<button class="btn primary" data-a="equip">Équiper</button>';
  h+='<button class="btn'+(eq?" primary":"")+'" data-a="up"'+(canUp&&afford?"":" disabled")+">"+(canUp?"Renforcer ("+cost+" éclats)":"Renforcé au maximum")+"</button>";
  h+=eq?'<button class="btn" data-a="off">Retirer</button>':'<button class="btn" data-a="salv">Démonter (+'+salvageVal(it)+" éclats)</button>";
  h+='<button class="btn" data-a="close">Fermer</button>';$("shAct").innerHTML=h;$("sheet").classList.remove("hide");}
function closeSheet(){$("sheet").classList.add("hide");shIt=null;}
$("shShade").onclick=closeSheet;
$("shAct").onclick=e=>{const b=e.target.closest("[data-a]");if(!b||b.disabled)return;const a=b.dataset.a,it=shIt;
  if(a==="close"){closeSheet();return;}
  if(a==="equip"){const i=G.bag.indexOf(it);if(i>=0)G.bag.splice(i,1);const old=G.equip[it.slot];if(old)G.bag.push(old);G.equip[it.slot]=it;save();updateGear();closeSheet();renderBag();return;}
  if(a==="off"){delete G.equip[it.slot];G.bag.push(it);save();updateGear();closeSheet();renderBag();return;}
  if(a==="salv"){const i=G.bag.indexOf(it);if(i>=0)G.bag.splice(i,1);G.eclats+=salvageVal(it);save();closeSheet();renderBag();return;}
  if(a==="up"){const c=upCost(it);if(G.eclats<c||(it.up||0)>=5)return;G.eclats-=c;it.up=(it.up||0)+1;save();updateGear();renderBag();openSheet(it,shEq);}};

/* ================= BUTIN ================= */
let pending=null,pendingWin=false;
function openLoot(win){const fi=M.fi,it=mkItem(rnd(SLOTK),rollRar(fi.k,fi.boss,win),fi.k);pending=it;pendingWin=win;
  const old=G.equip[it.slot];
  $("lootCard").innerHTML='<div class="item plate" style="--rc:'+RAR[it.rar].c+'">'+itemCard(it,{delta:powerIfEquip(it)-myPower()})+(old?'<div class="meta" style="margin-top:.5rem">Tu portes : '+esc(old.name)+" ("+RAR[old.rar].n+")</div>":"")+"</div>";
  $("lootTip").innerHTML="<b>"+(G.flags.pip===1&&G.flags.pipSaved!==0?"Pip":"Le Borgne")+"</b>"+esc(win?RAR[it.rar].l:"Un petit coffre pour le perdant. "+RAR[it.rar].l);
  $("bSalv").textContent="Démonter (+"+salvageVal(it)+" éclats)";
  ["lootCard","lootTip","lootBtns"].forEach(id=>$(id).style.visibility="hidden");
  show("loot");placeScene();ME.face=0;showChest(it.rar,!win);camMode="loot";snapCam=true;
  setTimeout(()=>{if(it.rar>=3){flare=1;shake=.3;}},800);
  setTimeout(()=>["lootCard","lootTip","lootBtns"].forEach(id=>$(id).style.visibility="visible"),1250);}
function afterLoot(){pending=null;hideChest();save();toast();if(!pendingWin){goHub();return;}
  G.fight++;G.endless=null;save();const k=BEATS[G.fight],fi=curFight();
  ensureStage(fi.ch,()=>{if(k&&!G.seen[k])story(k,goHub);else goHub();});}
$("bEquip").onclick=()=>{if(!pending)return;const it=pending,old=G.equip[it.slot];it.isNew=false;if(old)G.bag.push(old);G.equip[it.slot]=it;updateGear();afterLoot();};
$("bKeep").onclick=()=>{if(!pending)return;G.bag.push(pending);afterLoot();};
$("bSalv").onclick=()=>{if(!pending)return;G.eclats+=salvageVal(pending);afterLoot();};

/* ================= RÉSULTAT ================= */
$("bResA").onclick=()=>{if(!M)return;openLoot(M.win);};
$("bSpeed").onclick=()=>{speed=speed===1?2:1;$("bSpeed").textContent="×"+speed;$("bSpeed").setAttribute("aria-pressed",speed===2);};
$("bSkip").onclick=()=>{if(running)endMatch();};

/* ================= TITRE ================= */
let confirmNew=false;
function newGame(){G=fresh();save();ensureStage(0,()=>{placeScene();story("prologue_a",showPick);});}
function showTitle(){const s=load();G=s;$("bCont").classList.toggle("hide",!(s&&s.base));$("bCont").classList.add("primary");$("bNew").classList.toggle("primary",!(s&&s.base));confirmNew=false;$("bNew").textContent="Nouvelle histoire";
  show("title");camMode="title";if(stageKey!=="fosse")buildStage("fosse");placeScene();snapCam=true;}
$("bCont").onclick=()=>goHub();
$("bNew").onclick=()=>{if(G&&G.base&&!confirmNew){confirmNew=true;$("bNew").textContent="Sûr ? Tout sera effacé.";return;}newGame();};

/* ================= BOUCLE ================= */
let last=performance.now(),T=0,lastClock="";
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  if(running){tickSteps(dt);const cs=fmt(Math.min(90,elapsed/totalT*90));if(cs!==lastClock){lastClock=cs;$("clock").textContent=cs;}}
  const sdt=dt*(running?speed:1);
  [ME,OP].forEach(a=>integrate(a,sdt));if(running)separate();
  pose(ME,sdt,T);pose(OP,sdt,T);pose(BG,dt,T);[MIRA,PIP,VASKO].forEach(a=>{if(a.rig.g.visible)pose(a,dt,T);});
  ballP.lerp(bpos,1-Math.exp(-dt*(speed>1?40:28)));if(ballP.distanceTo(bpos)>3)ballP.copy(bpos);ball.position.copy(ballP);const mv=ballP.distanceTo(lastB);ball.rotation.x+=mv*2.6;ball.rotation.y+=mv*.7;lastB.copy(ballP);
  const tail=hist.pop();tail.copy(ballP);hist.unshift(tail);
  trail.forEach((m,i)=>{const h=hist[i+2];if(trailOn>0&&mv>.03){m.visible=true;m.position.copy(h);const sc=(1-i/9)*Math.min(1.6,trailOn);m.scale.set(sc,sc,sc);}else m.visible=false;});
  updateBlood(sdt);runFX(sdt);updateChest(dt);
  if(ME.rig.eye){const wp=new THREE.Vector3();if(running)wp.copy(ballP);else wp.copy(cam.position);ME.rig.eye.lookAt(wp);}
  flare=Math.max(0,flare-dt*.7);
  stAnim.forEach(f=>f(T,sdt));
  pts.forEach((l,i)=>{if(ptBase[i])l.intensity=ptBase[i]*(1+Math.sin(T*11+i*3)*.07+Math.sin(T*27+i)*.05)+flare*1.8;});
  updateCam(dt);renderFrame(T);requestAnimationFrame(frame);
}
buildStage("fosse");placeScene();showTitle();
requestAnimationFrame(frame);
