/* Personnages : squelette, postures par poste, animation */
/* ================= PERSONNAGES ================= */
const JK=["hy","hx","hz","hry","tx","ty","tz","nx","sLx","sLz","eL","sRx","sRz","eR","lLx","lLz","kL","lRx","lRz","kR"];
const UPPER=new Set(["tx","ty","tz","nx","sLx","sLz","eL","sRx","sRz","eR"]);
const NEUTRAL={hy:0,hx:0,hz:0,hry:0,tx:0,ty:0,tz:0,nx:0,sLx:0,sLz:.07,eL:-.15,sRx:0,sRz:.07,eR:-.15,lLx:0,lLz:0,kL:.06,lRx:0,lRz:0,kR:.06};
function mkRig(shirt,opt){opt=opt||{};const g=new THREE.Group();if(opt.scale)g.scale.setScalar(opt.scale);
  const cm=lam(shirt,texCloth),sm=lam(opt.shorts||0x1c1714,texCloth),sk=lam(opt.skin||0xb89478,texSkin),dk=lam(0x1a1411,texCloth),bt=lam(0x15110e,texCloth);
  const hips=new THREE.Group();hips.position.y=.92;g.add(hips);box(.42,.2,.26,sm,0,0,0,hips,true);
  const torso=new THREE.Group();torso.position.y=.06;hips.add(torso);const tm=box(.56,.6,.32,cm,0,.33,0,torso,true);const pel=hips.children[0];
  const head=new THREE.Group();head.position.y=.66;torso.add(head);box(.3,.32,.3,sk,0,.16,0,head,true);const hair=box(.32,.1,.32,dk,0,.31,-.01,head,true);
  const arm=x=>{const sh=new THREE.Group();sh.position.set(x,.55,0);torso.add(sh);const m1=box(.15,.3,.15,cm,0,-.15,0,sh,true);const el=new THREE.Group();el.position.y=-.3;sh.add(el);const m2=box(.12,.27,.12,sk,0,-.13,0,el,true);return{sh,el,m:[m1,m2],x};};
  const leg=x=>{const hp=new THREE.Group();hp.position.set(x,-.05,0);hips.add(hp);const m1=box(.19,.44,.19,sm,0,-.22,0,hp,true);const kn=new THREE.Group();kn.position.y=-.43;hp.add(kn);const m2=box(.16,.4,.16,cm,0,-.2,0,kn,true);const ft=box(.17,.1,.3,bt,0,-.4,.05,kn,true);return{hp,kn,ft,m:[m1,m2],x};};
  const r={g,hips,torso,head,aL:arm(-.36),aR:arm(.36),lL:leg(-.12),lR:leg(.12),cm,bt,hair,gear:{},tm,pel};
  if(opt.borgne){box(.62,.5,.42,cm,0,-.2,0,hips,true);box(.78,.06,.78,dk,0,.34,0,head,true);box(.4,.26,.4,dk,0,.5,0,head,true);hair.visible=false;box(.12,.1,.04,lam(0x050404),-.07,.18,.16,head);box(.05,.95,.05,lam(0x4a3322),0,-.5,.1,r.aR.el,true);}
  if(opt.hood){box(.38,.38,.14,cm,0,.2,-.13,head,true);box(.38,.08,.36,cm,0,.36,0,head,true);box(.07,.3,.3,cm,-.17,.18,-.02,head,true);box(.07,.3,.3,cm,.17,.18,-.02,head,true);box(.6,.55,.38,cm,0,-.22,0,hips,true);hair.visible=false;}
  if(opt.chains){[r.aL.el,r.aR.el].forEach(e=>box(.15,.06,.15,lam(0x4a4440),0,-.22,0,e));}
  if(opt.gear){const gm=()=>lam(0xffffff,texCloth);r.gear.bandeau=box(.34,.07,.34,gm(),0,.24,0,head);r.gear.brassard=box(.18,.08,.18,gm(),0,-.08,0,r.aL.sh);
    r.gear.jL=box(.2,.24,.2,gm(),0,-.16,.01,r.lL.kn);r.gear.jR=box(.2,.24,.2,gm(),0,-.16,.01,r.lR.kn);r.gear.talisman=box(.08,.1,.04,gm(),0,.46,.17,torso);
    Object.values(r.gear).forEach(m=>m.visible=false);}
  scene.add(g);return r;}
function mkActor(shirt,opt){const r=mkRig(shirt,opt);return{rig:r,pos:new THREE.Vector3(),tgt:new THREE.Vector3(),vel:new THREE.Vector3(),sty:null,look:0,prev:new THREE.Vector3(),face:0,bodyFace:0,mode:"idle",phase:Math.random()*5,p:0,spin:0,side:1,
  spd:0,fwd:0,lat:0,acc:0,gait:0,w:0,aj:Object.assign({},NEUTRAL),actName:null,J:Object.assign({},NEUTRAL)};}
const ME=mkActor(0x8f1d15,{gear:true}),OP=mkActor(0x8d8374),BG=mkActor(0x3b2b20,{borgne:true});
const MIRA=mkActor(0x4a5e48,{hood:true,skin:0xc9a68a}),PIP=mkActor(0x6a5a40,{scale:.72}),VASKO=mkActor(0x2e3a4a,{chains:true});
const NPCS={Mira:MIRA,Pip:PIP,Vasko:VASKO};
/* Gabarit et posture propres à chaque poste */
const STY={
  att:{w:.93,limb:.9,lean:.09,stride:1.14,knee:1.25,arm:1.2,bob:1.0,crouch:.0,width:0,bounce:.03,scan:.25,idle:.07,press:.6},
  mil:{w:1.0,limb:1.0,lean:.05,stride:1.0,knee:1.0,arm:1.0,bob:.9,crouch:.02,width:.03,bounce:.01,scan:.55,idle:.03,press:1.0},
  def:{w:1.15,limb:1.13,lean:.01,stride:.88,knee:.82,arm:.72,bob:1.3,crouch:.06,width:.09,bounce:0,scan:.15,idle:-.02,press:1.25}};
function applyBuild(a,poste){a.sty=poste?STY[poste]:null;const S=a.sty||STY.mil,r=a.rig;
  r.tm.scale.set(S.w,1,S.w*.97+.03);r.pel.scale.set(S.w,1,1);
  [r.aL,r.aR].forEach(m=>{m.sh.position.x=m.x*S.w;m.m.forEach(x=>x.scale.set(S.limb,1,S.limb));});
  [r.lL,r.lR].forEach(m=>{m.hp.position.x=m.x*(.9+.1*S.w);m.m.forEach(x=>x.scale.set(S.limb,1,S.limb));});}
/* Ressort amorti : la position suit sa cible avec de l'inertie, sans à-coups */
function integrate(a,dt){if(dt<=0)return;if(!a.ptgt)a.ptgt=a.tgt.clone();const w=16,k=w*w,c=2*w;for(const ax of ["x","z"]){let tv=(a.tgt[ax]-a.ptgt[ax])/dt;if(Math.abs(tv)>14)tv=0;const f=k*(a.tgt[ax]-a.pos[ax])+c*(tv-a.vel[ax]);a.vel[ax]+=f*dt;}a.ptgt.copy(a.tgt);
  const sp=Math.hypot(a.vel.x,a.vel.z);if(sp>9){a.vel.x*=9/sp;a.vel.z*=9/sp;}a.pos.x+=a.vel.x*dt;a.pos.z+=a.vel.z*dt;}[MIRA,PIP,VASKO].forEach(a=>a.rig.g.visible=false);
function snapActor(a){a.tgt.copy(a.pos);if(a.ptgt)a.ptgt.copy(a.pos);a.vel.set(0,0,0);a.prev.copy(a.pos);a.bodyFace=a.face;a.spd=0;a.fwd=0;a.lat=0;a.w=0;a.actName=null;a.rig.g.rotation.y=a.face;}
const BY=.21;
const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.21,1),lam(0xffffff,texBall));ball.castShadow=true;scene.add(ball);
const bpos=new THREE.Vector3(0,BY,0),ballP=new THREE.Vector3(0,BY,0),lastB=new THREE.Vector3();
const trailMat=bas(0xe0913f);const trail=[];for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.16,.16,.16),trailMat);m.visible=false;scene.add(m);trail.push(m);}
let trailOn=0;const hist=[];for(let i=0;i<12;i++)hist.push(new THREE.Vector3());
function ballAt(a){const f=a.bodyFace+(a.spin||0),touch=a.spd>1?.1*(.5+.5*Math.sin(a.gait)):0;bpos.set(a.pos.x+Math.sin(f)*(.44+touch),BY,a.pos.z+Math.cos(f)*(.44+touch));}

/* poses d'action : uniquement les articulations qui changent */
const ACT={
  windup:()=>({lRx:.95,kR:1.5,lLx:-.1,kL:.25,sLx:-.5,sLz:.7,sRx:.4,hry:-.35,tx:-.05,hy:-.04}),
  kick:p=>({lRx:lerp(.9,-1.3,p),kR:p<.5?lerp(1.4,1.0,p*2):lerp(1.0,.05,(p-.5)*2),lLx:-.1,kL:.25,tx:lerp(.05,-.25,p),sLx:-.6,sLz:.6,sRx:.5,sRz:.3,hry:lerp(-.3,.3,p),hy:-.04}),
  chip:p=>({lRx:lerp(.6,-.8,p),kR:lerp(1.2,.2,p),kL:.2,tx:lerp(0,-.22,p),sLz:.5,sRz:.3,hy:-.03}),
  volley:p=>({hz:-.5,lRx:lerp(.5,-1.2,p),lRz:lerp(.2,1.0,p),kR:lerp(1.2,.1,p),kL:.2,sLz:1.0,sRz:.4,hy:.05}),
  bicycle:p=>({hx:-lerp(.3,1.9,p),hy:.1+Math.sin(Math.min(1,p)*Math.PI)*.95,lRx:lerp(1.0,-2.6,p),kR:lerp(1.2,0,p),lLx:lerp(-.4,.9,p),kL:.8,sLz:1.3,sRz:1.3,eL:-.2,eR:-.2}),
  header:p=>({hy:Math.sin(p*Math.PI)*.55-.04,nx:lerp(-.6,.6,p),tx:lerp(-.35,.35,p),kL:.9,kR:.6,lLx:.2,lRx:-.1,sLx:-.5,eL:-.8,sRx:-.5,eR:-.8,sLz:.4,sRz:.4}),
  heel:p=>({lRx:lerp(-.2,.9,p),kR:lerp(.3,1.8,p),kL:.2,tx:.2,sLz:.3,sRz:.3}),
  slide:()=>({hy:-.62,hx:-.85,lLx:-1.3,kL:.05,lRx:-.2,kR:1.6,sLx:-1.1,eL:-.3,sRx:.5,sRz:.6,nx:.3}),
  fall:()=>({hx:1.45,hy:-.72,lLx:.1,kL:.3,lRx:-.1,kR:.6,sLx:-2.5,sRx:-2.3,eL:-.3,eR:-.3,nx:-.4}),
  fallBack:()=>({hx:-1.45,hy:-.72,lLx:-.2,kL:.5,lRx:-.4,kR:.3,sLz:.7,sRz:.7,sLx:.3,sRx:.3,nx:.3}),
  fallSide:(p,ph,a)=>({hz:1.35*a.side,hy:-.68,kL:.7,kR:.3,lLx:-.3,sLz:1.2,sRz:.4}),
  stumble:()=>({hx:.55,hy:-.18,lLx:-.6,kL:.4,lRx:.6,kR:.9,sLx:-1.1,sRx:-.9,eL:-.4,eR:-.4}),
  poke:()=>({hy:-.25,lLx:-1.1,kL:.1,lRx:.4,kR:1.2,hx:.3,sLx:-.5,sLz:.4,sRx:.6}),
  block:()=>({hy:-.16,lLz:.42,lRz:.42,kL:.45,kR:.45,lLx:-.15,lRx:-.15,sLz:1.1,sRz:1.1,eL:-.2,eR:-.2,tx:-.05}),
  shoulder:(p,ph,a)=>({tz:.45*a.side,tx:.15,sLx:-.2,sRx:-.2}),
  scissor:(p,ph,a)=>({hy:.15,hz:1.3*a.side,lLx:-1.4,kL:.1,lRx:1.0,kR:.2,sLx:-1.6,sRx:-.4}),
  stepover:(p,ph)=>{const s=Math.sin(ph*10),a1=Math.max(0,s),a2=Math.max(0,-s);return{lLx:-.4*a1,lLz:-.55*a1,kL:.1+.5*a1,lRx:-.4*a2,lRz:-.55*a2,kR:.1+.5*a2,hz:s*.1,tx:.15,sLz:.5,sRz:.5,hy:-.06};},
  pull:()=>({sRx:-1.5,eR:-.1,tx:-.25,sRz:.15}),
  talk:(p,ph)=>{const s=Math.sin(ph*3.2);return{sRx:-.9+s*.3,eR:-.9,sRz:.2,nx:s*.06};},
  cheer:(p,ph)=>{const s=Math.sin(ph*6);return{sLx:-2.9+s*.15,sRx:-2.9-s*.15,eL:-.2,eR:-.2,hy:Math.max(0,s)*.15,kL:.3+Math.max(0,-s)*.4,kR:.3+Math.max(0,-s)*.4,tx:-.15};},
  kneeSlide:()=>({hy:-.44,kL:1.55,kR:1.55,tx:-.4,sLx:-2.7,sRx:-2.7,sLz:.5,sRz:.5,nx:-.5}),
  kneel:()=>({hy:-.42,lLx:-1.5,kL:1.5,lRx:.1,kR:1.5,tx:.3,nx:.5,sLx:.1,sRx:.1}),
  fist:(p,ph)=>{const s=Math.sin(ph*9);return{sRx:-1.3-Math.max(0,s)*.3,eR:-1.8,sLx:-2.9,tx:-.2,nx:-.3};},
  shush:()=>({sRx:-.6,eR:-2.2,tx:-.05}),
  roar:()=>({tx:-.45,sLz:1.3,sRz:1.3,sLx:.4,sRx:.4,eL:-.8,eR:-.8,nx:-.6,lLz:.2,lRz:.2,kL:.2,kR:.2,hy:-.05}),
  slump:()=>({tx:.4,nx:.55,sLx:.05,sRx:.05,hy:-.03,kL:.12,kR:.12})
};
const OVER=new Set(["shoulder","pull","talk"]),SLOWOUT=new Set(["fall","fallBack","fallSide","slide","kneel","kneeSlide","stumble","scissor"]);
const CONTACT=new Set(["slide","shoulder","scissor","poke","pull","fallSide","fall","fallBack"]);
function pose(a,dt,T){
  if(dt<=0)return;const r=a.rig;
  /* mesure du mouvement réel : les jambes suivent la vitesse, pas un minuteur */
  let dx=a.pos.x-a.prev.x,dz=a.pos.z-a.prev.z,dist=Math.hypot(dx,dz);if(dist>1.2){dx=dz=dist=0;}a.prev.copy(a.pos);
  const v=dist/dt,ps=a.spd;a.spd=lerp(a.spd,v,Math.min(1,dt*12));a.acc=lerp(a.acc,(a.spd-ps)/dt,Math.min(1,dt*6));
  let df=a.face-a.bodyFace;df=Math.atan2(Math.sin(df),Math.cos(df));const mx=11*dt;a.bodyFace+=clamp(df,-mx,mx);
  const fx=Math.sin(a.bodyFace),fz=Math.cos(a.bodyFace);a.fwd=lerp(a.fwd,(dx*fx+dz*fz)/dt,Math.min(1,dt*12));a.lat=lerp(a.lat,(dx*fz-dz*fx)/dt,Math.min(1,dt*12));
  const S=a.sty||STY.mil,A=clamp(a.spd/5.5,0,1),mv=Math.min(1,a.spd/1.2),lat=clamp(Math.abs(a.lat)/(a.spd+.01),0,1),dir=a.fwd<-.2?-1:1;
  a.gait+=dir*dist/(lerp(1.15,2.3,A)*S.stride)*Math.PI*2;a.phase+=dt;
  const s=Math.sin(a.gait),c=Math.cos(a.gait),J=Object.assign({},NEUTRAL);
  const amp=(.32+.75*A)*(1-lat*.65)*mv*(.9+.1*S.stride);
  J.lLx=s*amp;J.lRx=-s*amp;
  J.kL=.06+(.3+1.3*A)*S.knee*Math.max(0,-c*dir)*mv;J.kR=.06+(.3+1.3*A)*S.knee*Math.max(0,c*dir)*mv;
  J.lLz=lat*Math.max(0,s)*.32*mv;J.lRz=lat*Math.max(0,-s)*.32*mv;
  J.hy=-(.02+.06*A)*S.bob*Math.abs(s)*mv-.035*A;
  J.hx=(.07+S.lean)*A+(dir>0?clamp(a.acc*.03,-.1,.16):-.06*mv);
  J.hry=s*.16*A;J.ty=-s*.26*A;
  J.sLx=-s*(.25+.8*A)*S.arm*mv;J.sRx=s*(.25+.8*A)*S.arm*mv;J.eL=J.eR=-(.2+1.0*A*mv);J.sLz=J.sRz=.07+.1*A;
  const id=1-mv,br=Math.sin(a.phase*2.1);J.tx+=br*.015*id;J.hz=Math.sin(a.phase*1.1)*.025*id;J.sLx+=br*.03*id;J.sRx-=br*.03*id;
  if(a.sty){J.hy+=(-S.crouch+Math.abs(Math.sin(a.phase*6.5))*S.bounce)*id;J.kL+=S.crouch*4*id;J.kR+=S.crouch*4*id;J.lLz+=S.width*id;J.lRz+=S.width*id;J.hx+=S.idle*id;
    if(a.sty===STY.def){J.sLz+=.15*id;J.sRz+=.15*id;J.tx-=.05*id;}if(a.sty===STY.att){J.eL-=.25*id;J.eR-=.25*id;}}
  if(a.mode==="press"){const P=S.press;J.hy-=.12*P;J.kL+=.5*P;J.kR+=.5*P;J.lLx-=.24*P;J.lRx-=.24*P;J.hx+=.18*P;J.sLz+=.45*P;J.sRz+=.45*P;J.eL=J.eR=-.7;J.lLz+=.1*P;J.lRz+=.1*P;}
  /* couche d'action, fondue avec la locomotion */
  const act=ACT[a.mode]?a.mode:null;
  if(act){const tg=ACT[act](a.p||0,a.phase,a),k=Math.min(1,dt*(tg&&("p" in a)&&a.p>0?22:15));JK.forEach(key=>{const t=key in tg?tg[key]:NEUTRAL[key];a.aj[key]+=(t-a.aj[key])*k;});a.actName=act;}
  const rate=act?14:(SLOWOUT.has(a.actName)?3.4:7);a.w+=((act?1:0)-a.w)*Math.min(1,dt*rate);
  const over=OVER.has(a.actName);
  JK.forEach(key=>{const t=(over&&!UPPER.has(key))?J[key]:lerp(J[key],a.aj[key],a.w);a.J[key]+=(t-a.J[key])*Math.min(1,dt*20);});
  /* le regard suit le ballon */
  let lk=0;if(a.sty&&a.rig.g.visible){const bx=bpos.x-a.pos.x,bz=bpos.z-a.pos.z;if(bx*bx+bz*bz>.04){lk=Math.atan2(bx,bz)-a.bodyFace-(a.spin||0);lk=Math.atan2(Math.sin(lk),Math.cos(lk));lk=clamp(lk,-1.1,1.1);}if(id>.6&&Math.abs(lk)<.2)lk+=Math.sin(a.phase*.8)*S.scan;}
  a.look+=(lk-a.look)*Math.min(1,dt*7);
  const Q=a.J;r.hips.position.y=.92+Q.hy;r.hips.rotation.set(Q.hx,Q.hry,Q.hz);r.torso.rotation.set(Q.tx,Q.ty+a.look*.25*(1-a.w),Q.tz);r.head.rotation.set(Q.nx,a.look*.6*(1-a.w*.7),0);
  r.aL.sh.rotation.set(Q.sLx,0,-Q.sLz);r.aL.el.rotation.x=Q.eL;r.aR.sh.rotation.set(Q.sRx,0,Q.sRz);r.aR.el.rotation.x=Q.eR;
  r.lL.hp.rotation.set(Q.lLx,0,-Q.lLz);r.lL.kn.rotation.x=Q.kL;r.lR.hp.rotation.set(Q.lRx,0,Q.lRz);r.lR.kn.rotation.x=Q.kR;
  r.g.position.copy(a.pos);r.g.rotation.y=a.bodyFace+(a.spin||0);
}
function separate(){const dx=OP.pos.x-ME.pos.x,dz=OP.pos.z-ME.pos.z,d=Math.hypot(dx,dz),min=(CONTACT.has(ME.mode)||CONTACT.has(OP.mode))?.38:.64;
  if(d<min&&d>1e-4){const p=(min-d)/2;ME.pos.x-=dx/d*p;ME.pos.z-=dz/d*p;OP.pos.x+=dx/d*p;OP.pos.z+=dz/d*p;}}
