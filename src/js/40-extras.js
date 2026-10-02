/* Équipement visible, sang, interruptions absurdes, coffre 3D */

/* ================= TEXTURES SUPPLÉMENTAIRES ================= */
const texWood=mkTex(32,(x,w,h)=>{x.fillStyle="#5a3b22";x.fillRect(0,0,w,h);speckle(x,w,h,160,["#4a2f1a","#6a4a2c","#3a2412"]);
  x.fillStyle="#24160c";for(let i=0;i<w;i+=8)x.fillRect(i,0,1,h);x.strokeStyle="rgba(30,15,5,.5)";for(let i=0;i<10;i++){x.beginPath();const sx=Math.random()*w;x.moveTo(sx,0);x.bezierCurveTo(sx+3,h*.3,sx-3,h*.6,sx+1,h);x.stroke();}
  x.fillStyle="#2a1a0c";x.fillRect(5,12,2,3);x.fillRect(21,22,3,2);});
const texChain=mkTex(16,(x,w,h)=>{x.fillStyle="#3a3a3c";x.fillRect(0,0,w,h);x.strokeStyle="#9a9a9e";for(let yy=0;yy<h;yy+=4)for(let xx=(yy/4)%2?2:0;xx<w;xx+=4){x.beginPath();x.arc(xx+1.5,yy+1.5,1.5,0,Math.PI*2);x.stroke();}});
function splatTex(seed){return mkTex(32,(x,w,h)=>{x.clearRect(0,0,w,h);x.fillStyle="#7a0a06";x.beginPath();x.arc(16,16,7+seed%3,0,Math.PI*2);x.fill();
  for(let i=0;i<9;i++){const a=Math.random()*6.3,r=8+Math.random()*7;x.beginPath();x.arc(16+Math.cos(a)*r,16+Math.sin(a)*r,1+Math.random()*2.5,0,Math.PI*2);x.fill();}
  x.fillStyle="#a01810";x.beginPath();x.arc(14,14,3,0,Math.PI*2);x.fill();});}
const SPLATS=[0,1,2].map(splatTex);
const mats={};const MT=(k,f)=>mats[k]||(mats[k]=f());
const metal=()=>MT("metal",()=>lam(0x8a8a90,texSkin)),dark=()=>MT("dark",()=>lam(0x1c1612,texCloth)),bone=()=>MT("bone",()=>lam(0xd8ccb4,texSkin)),gold=()=>MT("gold",()=>lam(0xc49a3a,texSkin)),rust=()=>MT("rust",()=>lam(0x6a3a22,texSkin));
const rarMat=r=>MT("r"+r,()=>lam(new THREE.Color(RAR[r].c).multiplyScalar(.85).getHex(),texCloth));
const glowMat=r=>MT("g"+r,()=>bas(new THREE.Color(RAR[r].c).getHex()));

/* ================= ÉQUIPEMENT VISIBLE ================= */
function design(it){const n=SLOTS[it.slot].names;for(let i=0;i<n.length;i++)if(it.name.indexOf(n[i])===0)return i;return 0;}
function cone(r,h,seg,mat,x,y,z,parent,rx,rz){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||4),mat);m.position.set(x,y,z);m.rotation.set(rx||0,0,rz||0);m.castShadow=true;parent.add(m);return m;}
const GEAR={
  bandeau(r,it,d,R,G){const h=r.head,c=rarMat(R);
    if(d===0){box(.34,.07,.34,c,0,.23,0,h,true);box(.08,.08,.06,c,0,.23,-.19,h);[-.04,.04].forEach((o,i)=>{const t=box(.05,.2,.02,c,o,.12,-.21,h);t.rotation.z=i?-.25:.25;});}
    else if(d===1){box(.35,.1,.35,c,0,.31,0,h,true);cone(.09,.22,3,c,0,.2,-.2,h,Math.PI,0);}
    else{for(let i=0;i<8;i++){const a=i/8*Math.PI*2;box(.07,.07,.07,i%2?c:dark(),Math.sin(a)*.17,.24,Math.cos(a)*.17,h);}}
    if(R>=3)box(.08,.08,.03,bone(),0,.24,.17,h);
    if(R>=4){cone(.04,.2,4,bone(),-.13,.4,0,h,0,.5);cone(.04,.2,4,bone(),.13,.4,0,h,0,-.5);}},
  maillot(r,it,d,R,G){const t=r.torso,c=rarMat(R);
    if(d===0){box(.58,.08,.34,c,0,.42,0,t);box(.58,.08,.34,c,0,.24,0,t);}
    else if(d===1){box(.6,.4,.36,c,0,.12,0,t,true);box(.62,.06,.37,dark(),0,.02,0,t);}
    else{box(.59,.5,.35,MT("chain",()=>lam(0xffffff,texChain)),0,.36,0,t,true);[-.32,.32].forEach(x=>box(.16,.08,.3,metal(),x,.62,0,t,true));}
    if(R>=3)[-.32,.32].forEach(x=>cone(.05,.18,4,bone(),x,.72,0,t));
    if(R>=4){const cape=box(.5,.75,.03,MT("cape",()=>lam(0x6a0a08,texCloth)),0,.2,-.2,t,true);cape.rotation.x=.18;}},
  brassard(r,it,d,R,G){const arms=R>=3?[r.aL,r.aR]:[r.aL];arms.forEach(a=>{const c=rarMat(R);
    if(d===0)box(.18,.09,.18,c,0,-.08,0,a.sh);
    else if(d===1){box(.16,.2,.16,c,0,-.12,0,a.el,true);[-.06,-.17].forEach(y=>box(.17,.025,.17,dark(),0,y,0,a.el));}
    else{box(.15,.07,.15,c,0,-.2,0,a.el);[0,1,2,3].forEach(i=>{const an=i*Math.PI/2;cone(.025,.08,4,metal(),Math.sin(an)*.09,-.2,Math.cos(an)*.09,a.el,Math.cos(an)*1.57,-Math.sin(an)*1.57);});}});},
  jambieres(r,it,d,R,G){[r.lL,r.lR].forEach(l=>{const c=rarMat(R);
    if(d===0)box(.12,.26,.05,c,0,-.18,.09,l.kn,true);
    else if(d===1){box(.13,.28,.06,c,0,-.18,.09,l.kn,true);[-.1,-.26].forEach(y=>box(.18,.025,.18,dark(),0,y,0,l.kn));}
    else{box(.19,.3,.19,metal(),0,-.18,0,l.kn,true);box(.14,.1,.08,c,0,.0,.1,l.kn,true);}
    if(R>=3)cone(.035,.12,4,bone(),0,.02,.15,l.kn,1.57,0);});},
  crampons(r,it,d,R,G){[r.lL,r.lR].forEach(l=>{const c=rarMat(R),f=l.ft;
    if(d===0){[-.08,0,.08].forEach(z=>box(.03,.04,.03,metal(),0,-.06,z+.0,f));box(.175,.05,.31,c,0,.03,0,f);}
    else if(d===1){box(.18,.08,.09,metal(),0,0,.12,f,true);box(.18,.1,.18,c,0,.1,-.04,f,true);}
    else{box(.19,.05,.32,c,0,-.06,0,f,true);[-.1,.1].forEach(z=>[-.1,.1].forEach(x=>cone(.02,.07,4,metal(),x,-.04,z,f,0,x>0?-1.57:1.57)));}
    if(R>=4){[-1,1].forEach(sd=>{const w=box(.02,.08,.14,MT("wing",()=>lam(0xf0ece0,texSkin)),sd*.11,.06,-.12,f);w.rotation.z=sd*-.5;});}});},
  talisman(r,it,d,R,G){const t=r.torso,c=rarMat(R),g=new THREE.Group();g.position.set(0,.5,.17);t.add(g);
    [-1,1].forEach(sd=>{const cord=box(.015,.16,.015,dark(),sd*.05,.04,0,g);cord.rotation.z=sd*.6;});
    if(d===0)cone(.035,.1,4,bone(),0,-.06,0,g,Math.PI,0);
    else if(d===1){box(.025,.14,.025,rust(),0,-.08,0,g);box(.07,.02,.04,rust(),0,0,0,g);}
    else if(d===2){const eye=new THREE.Mesh(new THREE.IcosahedronGeometry(.055,1),bas(0xf2efe6));eye.position.y=-.05;g.add(eye);const ir=box(.04,.04,.02,MT("iris",()=>bas(0x2a8a6a)),0,0,.05,eye);box(.018,.018,.02,MT("pup",()=>bas(0x000000)),0,0,.01,ir);r.eye=eye;}
    else if(d===3){const m=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.02,7),gold());m.rotation.x=1.57;m.position.y=-.06;m.scale.y=.6;g.add(m);}
    else{[-.02,0,.02].forEach((x,i)=>{const s=box(.012,.13,.012,MT("hair",()=>lam(0x2a1a10)),x,-.07,0,g);s.rotation.z=(i-1)*.25;});}
    if(R>=3){const gem=box(.03,.03,.03,glowMat(R),0,-.13,0,g);gem.rotation.set(.7,.7,0);}}
};
function buildGear(rig,equip){
  if(!rig.gearRoots)rig.gearRoots=[];rig.gearRoots.forEach(m=>{m.parent&&m.parent.remove(m);});rig.gearRoots=[];rig.eye=null;
  /* on note les enfants ajoutés pour pouvoir les retirer */
  const watch=[rig.head,rig.torso,rig.aL.sh,rig.aL.el,rig.aR.sh,rig.aR.el,rig.lL.kn,rig.lR.kn,rig.lL.ft,rig.lR.ft],before=watch.map(p=>p.children.length);
  Object.values(equip||{}).forEach(it=>{if(it&&GEAR[it.slot])GEAR[it.slot](rig,it,design(it),it.rar);});
  watch.forEach((p,i)=>{for(let j=before[i];j<p.children.length;j++)rig.gearRoots.push(p.children[j]);});
  rig.bt.color.setHex(0x15110e);if(equip&&equip.crampons)rig.bt.color.set(RAR[equip.crampons.rar].c).multiplyScalar(.4);}
function updateGear(){if(!G)return;Object.values(ME.rig.gear).forEach(m=>m.visible=false);buildGear(ME.rig,G.equip);ME.rig.cm.color.setHex(0x8f1d15);}
function oppGear(fi){const n=Math.min(6,Math.floor(fi.k/2)+(fi.boss?2:0)),eq={};shuffle(SLOTK).slice(0,n).forEach(s=>{eq[s]=mkItem(s,clamp(Math.floor(fi.k/4)+(fi.boss?1:0),0,4),fi.k);});buildGear(OP.rig,eq);}

/* ================= SANG ================= */
const DROPS=140,dropIM=new THREE.InstancedMesh(new THREE.BoxGeometry(.085,.085,.085),bas(0x8a0c08),DROPS);dropIM.frustumCulled=false;scene.add(dropIM);
const drops=[];for(let i=0;i<DROPS;i++)drops.push({life:0,p:new THREE.Vector3(),v:new THREE.Vector3(),s:1});
const decals=[];let decalI=0;
const decalMats=SPLATS.map(t=>lam(0xffffff,t,{transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));
for(let i=0;i<36;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),decalMats[i%3]);m.rotation.x=-Math.PI/2;m.visible=false;m.receiveShadow=true;scene.add(m);decals.push(m);}
const teeth=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(.04,.1,4),bone());m.visible=false;scene.add(m);teeth.push({m,life:0,p:new THREE.Vector3(),v:new THREE.Vector3()});}
function decal(x,z,sz){const m=decals[decalI++%decals.length];m.visible=true;m.position.set(x,.02+decalI*.0004,z);m.rotation.z=Math.random()*6.3;const s=sz*(.6+Math.random()*.7);m.scale.set(s,s,1);}
function clearBlood(){decals.forEach(m=>m.visible=false);drops.forEach(d=>d.life=0);teeth.forEach(t=>{t.life=0;t.m.visible=false;});[ME,OP].forEach(a=>{a.blood=0;(a.stains||[]).forEach(s=>s.visible=false);});}
const STAIN_SPOTS=[["torso",.12,.45,.165],["head",.08,.1,.155],["torso",-.15,.25,.165],["lL",0,-.25,.09],["torso",.0,.15,-.165],["head",-.1,.2,.155],["lR",0,-.3,.09]];
function addStain(a){if(!a.stains){a.stains=STAIN_SPOTS.map(sp=>{const par=sp[0]==="lL"?a.rig.lL.kn:sp[0]==="lR"?a.rig.lR.kn:a.rig[sp[0]];const m=box(.11,.09,.01,MT("stain",()=>lam(0x6a0806)),sp[1],sp[2],sp[3],par);m.visible=false;return m;});}
  const n=Math.min(a.stains.length,Math.round(a.blood));for(let i=0;i<n;i++)a.stains[i].visible=true;}
function bleed(a,power,dx){a.blood=(a.blood||0)+power;addStain(a);const n=Math.round(14+power*22);let k=0;
  for(const d of drops){if(k>=n)break;if(d.life>0)continue;k++;d.life=1.4;d.p.set(a.pos.x,.9+Math.random()*.5,a.pos.z);const sp=1.2+power;d.v.set((Math.random()-.5)*3*sp+dx*1.5,1.5+Math.random()*2.5*sp,(Math.random()-.5)*3*sp);d.s=.6+Math.random()*.9;}
  decal(a.pos.x,a.pos.z,.8+power*.6);decal(a.pos.x+(Math.random()-.5)*.6,a.pos.z+(Math.random()-.5)*.6,.4+power*.3);if(power>=1.2&&Math.random()<.7){const t=teeth.find(t=>t.life<=0);if(t){t.life=2.2;t.p.set(a.pos.x,1.5,a.pos.z);t.v.set(dx*2+(Math.random()-.5)*2,4,(Math.random()-.5)*2);t.m.visible=true;return"tooth";}}return null;}
const m4b=new THREE.Matrix4(),qb=new THREE.Quaternion(),sb=new THREE.Vector3();
function updateBlood(dt){let i=0;for(const d of drops){if(d.life>0){d.life-=dt;d.v.y-=14*dt;d.p.addScaledVector(d.v,dt);if(d.p.y<.03){d.p.y=.03;if(d.v.y<-1&&Math.random()<.3)decal(d.p.x,d.p.z,.26);d.v.set(0,0,0);d.life=Math.min(d.life,.25);}
    sb.set(d.s,d.s,d.s);m4b.compose(d.p,qb,sb);}else{sb.set(0,0,0);m4b.compose(d.p,qb,sb);}dropIM.setMatrixAt(i++,m4b);}dropIM.instanceMatrix.needsUpdate=true;
  teeth.forEach(t=>{if(t.life<=0)return;t.life-=dt;t.v.y-=12*dt;t.p.addScaledVector(t.v,dt);if(t.p.y<.05){t.p.y=.05;t.v.y*=-.4;t.v.x*=.6;t.v.z*=.6;}t.m.position.copy(t.p);t.m.rotation.x+=dt*12;t.m.rotation.z+=dt*9;if(t.life<=0)t.m.visible=false;});}
const BLEED={tacle:[1,1],epaule:[1,1.2],interception:[1,.35],pied:[1,.7],mur:[2,1],pressing:[1,.5],ciseaux:[1,2.2],lecture:[1,.45],maillot:[1,.6],tete:[3,.9,"D"]};
const GORE_L=["Ça saigne. Le public applaudit le sang, pas le joueur.","Du sang sur la craie. Ça fera de jolies lignes.","Il saigne du nez. Ou de l'âme. Difficile à dire.","Un peu de sang. Le terrain avait soif.","Il saigne mais il sourit. Il a perdu la tête, ou juste une dent."];
const TOOTH_L=["Une dent vole ! Un spectateur l'attrape. Il la gardera toute sa vie.","Une dent part en tribune. Elle a plus de supporters que lui.","Une dent sur le terrain. On la vendra aux enchères à la mi-temps."];

/* ================= ABSURDE ================= */
const FX=[];let camFx=null;
function chickenMesh(){const g=new THREE.Group(),w=MT("chk",()=>lam(0xf2eee2,texSkin));box(.32,.26,.42,w,0,.38,0,g,true);const hd=box(.16,.2,.16,w,0,.58,.2,g,true);box(.05,.08,.1,MT("comb",()=>lam(0xc8201a)),0,.12,0,hd);box(.06,.05,.08,MT("beak",()=>lam(0xe8a020)),0,.0,.1,hd);
  const legs=[-.07,.07].map(x=>box(.03,.24,.03,MT("beak",()=>lam(0xe8a020)),x,.13,0,g));scene.add(g);g.userData.legs=legs;return g;}
function goatMesh(){const g=new THREE.Group(),c=MT("goat",()=>lam(0x8a8478,texCloth));box(.45,.4,.9,c,0,.75,0,g,true);const hd=box(.22,.26,.3,c,0,1.0,.55,g,true);cone(.04,.22,4,bone(),-.07,.2,-.05,hd,-.4,0);cone(.04,.22,4,bone(),.07,.2,-.05,hd,-.4,0);box(.06,.12,.04,MT("beard",()=>lam(0xd8d0c0)),0,-.16,.1,hd);
  const legs=[[-.15,.3],[.15,.3],[-.15,-.3],[.15,-.3]].map(p=>box(.08,.55,.08,c,p[0],.28,p[1],g,true));scene.add(g);g.userData.legs=legs;return g;}
function crowMesh(){const g=new THREE.Group(),k=MT("crow",()=>lam(0x0a0a0c));box(.16,.14,.3,k,0,0,0,g,true);box(.1,.1,.1,k,0,.08,.17,g);box(.04,.03,.08,MT("beak",()=>lam(0xe8a020)),0,.07,.25,g);
  const wl=box(.3,.02,.18,k,-.2,.03,0,g),wr=box(.3,.02,.18,k,.2,.03,0,g);scene.add(g);g.userData.w=[wl,wr];return g;}
const FAN=mkActor(0x4a4440);FAN.rig.g.visible=false;
const INTER={
  poulet:{l:"Un poulet traverse la fosse. Personne ne sait d'où il vient. Personne ne pose de questions.",run(){const g=chickenMesh(),z=1.2+Math.random()*1.5;let t=0;g.position.set(-9.5,0,z);g.rotation.y=Math.PI/2;camFx=g;
    FX.push(dt=>{t+=dt;g.position.x=-9.5+t*7.5;g.position.y=Math.abs(Math.sin(t*22))*.06;g.userData.legs.forEach((l,i)=>l.rotation.x=Math.sin(t*28+i*3)*.9);if(t>2.6){scene.remove(g);camFx=null;return false;}return true;});}},
  navets:{l:"Le public lance des navets. Ici, c'est une marque d'affection.",run(){const ctr=new THREE.Object3D();ctr.position.set(0,0,0);camFx=ctr;FX.push(dt=>{ctr.t=(ctr.t||0)+dt;if(ctr.t>2.6){camFx=null;return false;}return true;});for(let i=0;i<16;i++){const p0x=-3+Math.random()*6;const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.09,0),i%3?MT("nav",()=>lam(0x8a3a7a)):MT("nav2",()=>lam(0xe8e0d0)));m.castShadow=true;scene.add(m);
    const p=new THREE.Vector3(p0x,3.4,-4.6),v=new THREE.Vector3((Math.random()-.5)*2,1+Math.random()*2,2+Math.random()*4);let t=-Math.random()*.6;
    FX.push(dt=>{t+=dt;if(t<0)return true;v.y-=12*dt;p.addScaledVector(v,dt);if(p.y<.09){p.y=.09;v.y*=-.45;v.x*=.7;v.z*=.7;}m.position.copy(p);m.rotation.x+=dt*6;if(t>2.6){scene.remove(m);return false;}return true;});}}},
  chevre:{l:"Une chèvre est entrée. Elle mange la craie. Elle a l'air plus motivée que toi.",run(){const g=goatMesh();let t=0;g.position.set(7.5,0,1.2);g.rotation.y=-Math.PI/2;camFx=g;
    FX.push(dt=>{t+=dt;const walk=t<1.1||t>2.0;if(t<1.1)g.position.x=7.5-t*4.5;else if(t>2.0){g.rotation.y=Math.PI/2;g.position.x=2.55+(t-2)*5;}g.children[1].rotation.x=walk?0:.6+Math.sin(t*12)*.1;g.userData.legs.forEach((l,i)=>l.rotation.x=walk?Math.sin(t*14+i*1.6)*.5:0);if(t>3.2){scene.remove(g);camFx=null;return false;}return true;});}},
  corbeau:{l:"Un corbeau se pose sur le ballon. Il réclame un pourcentage.",run(){const g=crowMesh();let t=0;camFx=g;const s=new THREE.Vector3(4,5,-3);
    FX.push(dt=>{t+=dt;const tgt=new THREE.Vector3(bpos.x,.4,bpos.z);if(t<1)g.position.lerpVectors(s,tgt,eout(t));else if(t<2)g.position.copy(tgt);else g.position.lerpVectors(tgt,new THREE.Vector3(-6,6,-4),Math.min(1,(t-2)/.9));
      const fl=t<1||t>2;g.userData.w.forEach((w,i)=>w.rotation.z=(i?-1:1)*(fl?Math.sin(t*30)*.8:.1));g.rotation.y=t<2?.6:-2.2;if(t>2.9){scene.remove(g);camFx=null;return false;}return true;});}},
  spectateur:{l:"Un spectateur est tombé dans la fosse. Il demande s'il peut jouer. On lui dit non.",run(){const a=FAN;a.rig.g.visible=true;camFx=a.rig.g;a.pos.set(-1.5,0,-4.3);a.face=0;snapActor(a);a.mode="fall";let t=0,y=3.2;
    FX.push(dt=>{t+=dt;if(t<.45){y=Math.max(0,3.2-t*t*16);a.rig.g.position.y=y;}else a.rig.g.position.y=0;
      if(t>1.2&&t<1.4)a.mode="stumble";if(t>1.4){a.mode="jog";a.face=-1.57;a.pos.x=-1.5-(t-1.4)*3.2;}pose(a,dt,0);a.rig.g.position.y=t<.45?y:0;if(t>3.6){a.rig.g.visible=false;camFx=null;return false;}return true;});}},
  saucisses:{l:"Le Borgne vend des saucisses au bord du terrain. Personne ne demande ce qu'il y a dedans.",run(){BG.mode="talk";camFx=BG.rig.g;let t=0;FX.push(dt=>{t+=dt;if(t>2.4){BG.mode="idle";camFx=null;return false;}return true;});}}
};
const ABS_L={chicken:0};
function runFX(dt){for(let i=FX.length-1;i>=0;i--){if(!FX[i](dt))FX.splice(i,1);}}
function clearFX(){FX.length=0;camFx=null;}

/* ================= COFFRE 3D ================= */
const CHEST=new THREE.Group();scene.add(CHEST);CHEST.visible=false;
(function(){const wd=lam(0xffffff,texWood),ir=lam(0x2a2624,texSkin),rv=lam(0x8a8478,texSkin);
  const body=new THREE.Group();CHEST.add(body);
  box(1.0,.5,.62,wd,0,.27,0,body,true);
  [-.42,0,.42].forEach(x=>{box(.07,.52,.64,ir,x,.27,0,body,true);});
  [[-.5,-.31],[.5,-.31],[-.5,.31],[.5,.31]].forEach(p=>box(.08,.54,.08,ir,p[0],.27,p[1],body,true));
  box(1.04,.06,.66,ir,0,.03,0,body,true);
  for(let i=-2;i<=2;i++)[.12,.42].forEach(y=>box(.03,.03,.02,rv,i*.21,y,.325,body));
  const lockP=box(.18,.2,.04,ir,0,.36,.33,body);box(.04,.08,.02,MT("kh",()=>bas(0x000000)),0,0,.025,lockP);
  /* intérieur lumineux */
  const inner=new THREE.Mesh(new THREE.PlaneGeometry(.9,.52),bas(0xffffff));inner.rotation.x=-Math.PI/2;inner.position.y=.49;body.add(inner);CHEST.userData.inner=inner;
  /* couvercle bombé, charnière à l'arrière */
  const lid=new THREE.Group();lid.position.set(0,.52,-.31);CHEST.add(lid);
  const R0=.31,arc=(rad,w,mat,x)=>{for(let i=0;i<4;i++){const am=(i+.5)/4*Math.PI,ch=2*rad*Math.sin(Math.PI/8)+.012;const pl=box(w,.05,ch,mat,x,Math.sin(am)*rad,R0-Math.cos(am)*rad,lid,true);pl.rotation.x=am-Math.PI/2;}};
  arc(R0,1.0,wd,0);[-.42,0,.42].forEach(x=>arc(R0+.02,.07,ir,x));
  const capG=new THREE.CircleGeometry(R0,4,0,Math.PI),capMat=lam(0xffffff,texWood,{side:THREE.DoubleSide});
  [-.5,.5].forEach(x=>{const cp=new THREE.Mesh(capG,capMat);cp.position.set(x,0,R0);cp.rotation.y=x>0?Math.PI/2:-Math.PI/2;lid.add(cp);});
  box(.16,.14,.05,ir,0,.02,.64,lid);
  CHEST.userData.lid=lid;CHEST.userData.body=body;
  const L=new THREE.PointLight(0xffffff,0,6,2);L.position.set(0,.9,0);CHEST.add(L);CHEST.userData.light=L;
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.42,.2,2.6,6,1,true),bas(0xffffff,{transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));shaft.position.y=1.8;CHEST.add(shaft);CHEST.userData.shaft=shaft;
  const sparks=new THREE.InstancedMesh(new THREE.BoxGeometry(.04,.04,.04),bas(0xffffff),30);sparks.frustumCulled=false;CHEST.add(sparks);CHEST.userData.sparks=sparks;CHEST.userData.sp=[...Array(30)].map(()=>({y:Math.random(),x:(Math.random()-.5)*.8,z:(Math.random()-.5)*.5,v:.5+Math.random()}));
  const rat=new THREE.Group();const rc=MT("rat",()=>lam(0x4a4038,texCloth));box(.14,.1,.24,rc,0,.05,0,rat,true);box(.08,.08,.1,rc,0,.07,.15,rat);box(.02,.02,.2,MT("tail",()=>lam(0xc8a090)),0,.04,-.2,rat);rat.visible=false;CHEST.add(rat);CHEST.userData.rat=rat;
})();
const chestS={t:-1,rar:0,small:false,rat:false};
function showChest(rar,small){CHEST.visible=true;CHEST.position.set(0,0,2.5);CHEST.rotation.y=.12;const sc=small?.72:1;CHEST.scale.set(sc,sc,sc);chestS.t=0;chestS.rar=rar;chestS.small=small;chestS.rat=rar===0&&Math.random()<.55;
  const col=new THREE.Color(RAR[rar].c);CHEST.userData.light.color.copy(col);CHEST.userData.inner.material.color.copy(col);CHEST.userData.shaft.material.color.copy(col);CHEST.userData.sparks.material.color.copy(col);CHEST.userData.rat.visible=false;CHEST.userData.lid.rotation.x=0;}
function hideChest(){CHEST.visible=false;chestS.t=-1;}
function updateChest(dt){if(chestS.t<0)return;chestS.t+=dt;const t=chestS.t,u=CHEST.userData,b=u.body;
  const shakeOn=t>.2&&t<.75;b.rotation.z=shakeOn?Math.sin(t*60)*.04:0;u.lid.rotation.z=b.rotation.z;b.position.y=shakeOn?Math.abs(Math.sin(t*40))*.03:0;
  if(t>.75){const k=Math.min(1,(t-.75)/.45),ov=Math.sin(k*Math.PI)*.25;u.lid.rotation.x=-(1.95*eout(k)+ov*(1-k));}
  const open=clamp((t-.75)/.5,0,1),pul=.85+Math.sin(t*6)*.15;u.light.intensity=open*(2.5+chestS.rar*1.2)*pul;u.shaft.material.opacity=open*(.16+chestS.rar*.07)*pul;u.inner.material.color.copy(u.light.color).multiplyScalar(.4+open*.9);
  const sp=u.sparks,m=new THREE.Matrix4();u.sp.forEach((p,i)=>{p.y+=dt*p.v*open;if(p.y>2.2)p.y=0;m.makeTranslation(p.x,.5+p.y,p.z);const s=open*(1-p.y/2.2);m.scale(new THREE.Vector3(s,s,s));sp.setMatrixAt(i,m);});sp.instanceMatrix.needsUpdate=true;
  if(chestS.rat&&t>1.0){const r=u.rat,k=t-1.0;r.visible=k<2.2;r.position.set(k*.9,.55+Math.max(0,Math.sin(Math.min(k,.6)/.6*Math.PI))*.5-(k>.6?Math.min(.55,(k-.6)*2):0),.1+k*.6);r.rotation.y=.9;}}
