/* Simulation et déroulé d'un match */
/* ================= SIMULATION ================= */
function eff(p,k,prog){let fat=prog*(100-p.s.souffle)/100*.5;if(p.perks&&p.perks.has("poumons"))fat*=.6;if(p.trait==="second")fat=Math.min(fat,0)-prog*.12;if(p.trait==="sangfroid"&&k==="frappe")fat=Math.min(fat,0);return Math.max(5,p.s[k]*(1-fat));}
const pw=(a,b)=>{const x=Math.pow(a,1.6),y=Math.pow(b,1.6);return x/(x+y);};
function shotRes(sh,gk,prog,bonus){const f=eff(sh,"frappe",prog)+(bonus||0)+(sh.perks&&sh.perks.has("finisseur")?12:0),k=.55*eff(gk,"placement",prog)+28;if(Math.random()<pw(f,k))return"goal";const r=Math.random();return r<.22?"post":r<.38?"bar":r<.85?"wide":"crowd";}
function simulate(P,O){
  const ev=[];let sP=0,sO=0;const N=10,rec={dr:0,tk:0,sh:0};
  const bags={att:[],def:[],shot:[]},src={att:ATT,def:DEF,shot:SHOT};
  const pick=k=>{if(!bags[k].length)bags[k]=shuffle(Object.keys(src[k]));return bags[k].pop();};
  for(let i=0;i<N+8;i++){
    if(i>=N&&sP!==sO)break;
    const prog=Math.min(1,i/N),meAtt=i%2===0,att=meAtt?P:O,def=meAtt?O:P,d=meAtt?1:-1;
    let a=eff(att,"dribble",prog)+.5*eff(att,"vitesse",prog),b=eff(def,"tacle",prog)+.5*eff(def,"placement",prog);
    const sa=meAtt?sP:sO,sd=meAtt?sO:sP;if(att.perks.has("orgueil")&&sa<sd)a*=1.12;if(def.perks.has("orgueil")&&sd<sa)b*=1.12;if(def.perks.has("mur"))b+=12;
    const e={att,def,d,prog,s:Math.random()<.5?1:-1,zT:Math.random()*1.5-.75,sd:i===N};
    if(Math.random()<pw(a,b)){e.kind="dribble";e.move=pick("att");e.shotKind=pick("shot");e.shot=shotRes(att,def,prog);if(meAtt){rec.dr++;rec.sh++;}if(e.shot==="goal"){if(meAtt)sP++;else sO++;}}
    else{e.kind="tackle";e.move=pick("def");if(!meAtt)rec.tk++;
      if(def.trait==="contre"){e.counterKind=rnd(["rasdeterre","lucarne","boulet","enroulee","plat"]);e.counter=shotRes(def,att,prog,30);if(!meAtt)rec.sh++;if(e.counter==="goal"){if(meAtt)sO++;else sP++;}}}
    ev.push(e);
  }
  G.mc=(G.mc||0)+1;if(G.mc%2===0&&ev.length>4){const ks=Object.keys(INTER);if(!G.lastInter||G.lastInter.length>=ks.length)G.lastInter=[];const pool=ks.filter(k=>!G.lastInter.includes(k)),k=rnd(pool);G.lastInter.push(k);ev[2+Math.floor(Math.random()*(ev.length-4))].inter=k;}
  return{ev,sP,sO,rec};
}

/* ================= MATCH ================= */
let M=null,score=[0,0];
function say(t){$("ctext").textContent=t;}
function banner(t,cls){const b=$("banner");b.className="";void b.offsetWidth;b.textContent=t;b.className=cls+" show";}
function updScore(){$("ptA").textContent=score[0];$("ptB").textContent=score[1];}
function goalFX(){flare=1;shake=Math.max(shake,.35);if(!RM){const f=$("flash");f.classList.add("on");requestAnimationFrame(()=>requestAnimationFrame(()=>f.classList.remove("on")));}}
function souffle(p,prog){let f=1-prog*(100-p.s.souffle)/100*.5;if(p.trait==="second")f=1;return clamp(f,.12,1);}
function setSouffle(prog){if(!M)return;$("sbA").style.width=(souffle(M.P,prog)*100)+"%";$("sbB").style.width=(souffle(M.O,prog)*100)+"%";}
function shoot(c,kind,res,zT){const{A,D,d,s}=c,K=SHOT[kind],st=[];
  st.push(tw(.18,()=>{A.mode="idle";c.look(A,8.2-c.u(A),(res==="goal"?zT:s*1.2)-c.v(A));ballAt(A);}));
  K.pre(c).forEach(x=>st.push(x));
  let tgt,second=null;
  if(res==="goal")tgt=[8.75,K.y,K.zs?s*K.zs:zT];
  else if(res==="post"){tgt=[8.2,.8,s*1.2];second=[6.2,BY,s*2.8,.4,.5];}
  else if(res==="bar"){tgt=[8.2,1.42,zT*.6];second=[6.6,BY,zT,.9,.55];}
  else if(res==="wide"){tgt=[9.15,.9,s*2.5];second=[8.9,BY,s*2.5,.1,.3];}
  else tgt=[7.2,4.3,-5.6];
  st.push(tw(K.dur*(res==="crowd"?1.8:1),()=>{trailOn=K.trail||.6;if(K.shake)shake=K.shake;const b0=bpos.clone(),T=[tgt[0]*d,tgt[1],tgt[2]],h=res==="crowd"?2.4:K.h,cv=K.curve||0;
    return t=>{bpos.set(lerp(b0.x,T[0],t),lerp(b0.y,T[1],t)+Math.sin(t*Math.PI)*h,lerp(b0.z,T[2],t)-Math.sin(t*Math.PI)*cv*s);};},
    ()=>{if(res==="post"||res==="bar")shake=.25;}));
  if(second)st.push(tw(second[4],()=>{trailOn=0;const f=c.ball(second[0],second[1],second[2],second[3]);return t=>f(eout(t));}));
  st.push(tw(1.7,()=>{trailOn=0;const mine=A===ME;
    if(res==="goal"){score[mine?0:1]++;updScore();goalFX();banner(SHOT_N[kind][0],"goal");say(Math.random()<.5?SHOT_N[kind][1]:pick(mine?L.goalMe:L.goalOp));
      const cel=rnd(CELEB);A.mode=cel;celebA=A;celebT=1.6/speed;D.mode=rnd(["slump","kneel","slump"]);BG.mode="talk";
      if(cel==="shush")A.face=0;
      if(cel==="kneeSlide"){c.look(A,1,0);const a=c.path(A,c.u(A)+1.3,c.v(A)+(c.v(A)>0?1:-1)*1.2,0,true);return t=>a(eout(Math.min(1,t*1.5)));}
    }else{banner(MISS[res].n,"miss");say(pick(MISS[res].l));A.mode=rnd(["slump","idle"]);D.mode="idle";if(res==="crowd")flare=.6;}
  },()=>{BG.mode="idle";}));
  return st;}
function possession(e){
  const A=e.att.actor,D=e.def.actor,d=e.d,s=e.s,c=ctx(A,D,d,s),st=[];
  if(e.inter){const I=INTER[e.inter];st.push(tw(2.8,()=>{A.mode=D.mode="idle";I.run();say(I.l);banner("Interruption","miss");}));}
  st.push(tw(1.0,()=>{A.mode=D.mode="jog";A.spin=D.spin=0;trailOn=0;const a=c.path(A,-3.2,0),b=c.path(D,2.7,0),bb=c.ball(-2.7,BY,0,0);return t=>{const k=ease(t);a(k);b(k);bb(k);};}));
  st.push(tw(.22,()=>{A.mode="idle";D.mode="idle";c.look(A,1,0);c.look(D,-1,0);ballAt(A);setSouffle(e.prog);if(e.sd){banner("Mort subite","def");say("Égalité. Le prochain but tue le match. Façon de parler. Quoique.");}}));
  st.push(tw(1.3,()=>{A.mode="jog";D.mode="press";const a=c.path(A,-.3,0,0,true),b=c.path(D,1.25,0,0,true);return t=>{const k=ease(t);a(k);b(k);c.go(A,c.u(A),Math.sin(t*Math.PI*2)*.5);c.go(D,c.u(D),Math.sin(t*Math.PI*2-.5)*.4);c.look(A,1,Math.cos(t*Math.PI*2)*.4);c.look(D,-1,0);ballAt(A);};}));
  if(e.kind==="dribble"){
    const m=ATT[e.move];st.push(tw(.01,()=>{banner(m.n,"att");say(pick(MOVE_L[e.move]));}));
    m.f(c).forEach(x=>st.push(x));
    st.push(tw(.5,()=>{A.mode="run";D.mode="run";const a=c.path(A,5.1,s*.5),b=c.path(D,Math.max(c.u(D),3.2),s*.2);return t=>{a(ease(t));b(ease(t));ballAt(A);};}));
    shoot(c,e.shotKind,e.shot,e.zT).forEach(x=>st.push(x));
  }else{
    const m=DEF[e.move];st.push(tw(.01,()=>{banner(m.n,"def");say(pick(MOVE_L[e.move]));}));
    const ds=m.f(c),bl=BLEED[e.move];if(bl)ds.splice(Math.min(bl[0],ds.length),0,tw(.01,()=>{const v=bl[2]==="D"?D:A,r=bleed(v,bl[1],bl[2]==="D"?d:-d);if(r==="tooth")say(pick(TOOTH_L));else if(bl[1]>=.9&&Math.random()<.55)say(pick(GORE_L));}));
    ds.forEach(x=>st.push(x));
    if(e.counter){const c2=ctx(D,A,-d,s);
      st.push(tw(.5,()=>{D.mode="run";const a=c2.path(D,bpos.x*(-d)-.5,bpos.z);return t=>a(ease(t));}));
      st.push(tw(.12,()=>{c2.look(D,1,0);ballAt(D);banner("Contre","def");}));
      shoot(c2,e.counterKind,e.counter,e.zT).forEach(x=>st.push(x));
    }else st.push(tw(1.3,()=>{}));
  }
  return st;}
const fmt=s=>{s=Math.floor(s);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};
function recolorOpp(fi){OP.rig.cm.color.setHex(fi.col||0x3a3040);}
function placeBorgne(){BG.pos.set(-7.3,0,-3.3);BG.face=.85;BG.mode="idle";snapActor(BG);}
function placeScene(){ME.rig.g.visible=true;if(typeof clearBlood==='function'&&!running){clearBlood();clearFX();}if(G&&G.poste)applyBuild(ME,G.poste);applyBuild(OP,null);ME.pos.set(0,0,1.2);ME.face=0;ME.mode="idle";ME.spin=0;OP.pos.set(2.6,0,-1.6);OP.face=-.75;OP.mode="idle";OP.spin=0;placeBorgne();
  [ME,OP,BG].forEach(snapActor);hideNpcs();const pipHere=G&&G.flags&&G.flags.pip===1&&G.flags.pipSaved!==0;if(pipHere){PIP.pos.set(-1.3,0,1.9);PIP.face=.5;PIP.mode="idle";snapActor(PIP);PIP.rig.g.visible=true;}
  ballAt(ME);if(G)updateGear();}
function hideNpcs(){[MIRA,PIP,VASKO].forEach(a=>{a.rig.g.visible=false;});}
function startMatch(){
  const fi0=curFight();applyBuild(ME,G.poste);applyBuild(OP,fi0.p);const fi=fi0,P={name:G.name,poste:G.poste,trait:POSTES[G.poste].trait,s:statsOf(G),perks:perksOf(G),actor:ME},O=Object.assign(mkOpp(fi),{actor:OP});hideNpcs();ME.rig.g.visible=true;updateGear();clearBlood();clearFX();oppGear(fi0);hideChest();
  M=simulate(P,O);M.P=P;M.O=O;M.fi=fi;score=[0,0];recolorOpp(fi);
  $("nmA").textContent=P.name;$("psA").textContent=POSTES[P.poste].nom;$("nmB").textContent=O.name;$("psB").textContent=POSTES[O.poste].nom;$("stName").textContent=STADES[fi.ch].nom;updScore();setSouffle(0);
  ME.pos.set(-3,0,0);OP.pos.set(3,0,0);ME.face=Math.PI/2;OP.face=-Math.PI/2;ME.mode=OP.mode="idle";ME.spin=OP.spin=0;snapActor(ME);snapActor(OP);ballAt(ME);ballP.copy(bpos);celebT=0;camD=8;focus.set(0,0,0);placeBorgne();
  const steps=[tw(2.4,()=>{say(fi.intro);banner(O.name,"def");})];busy=false;
  M.ev.forEach(e=>possession(e).forEach(x=>steps.push(x)));
  steps.push(tw(.8,()=>{}));
  queue=steps;cur=null;elapsed=0;totalT=steps.reduce((a,x)=>a+x.dur,0);running=true;onDone=endMatch;
  camMode="match";snapCam=true;show("hud");
}
function endMatch(){
  running=false;queue=[];cur=null;trailOn=0;
  const a=M.sP,b=M.sO,win=a>b,draw=a===b;score=[a,b];updScore();
  ME.mode=win?"cheer":draw?"idle":"kneel";OP.mode=win?"slump":draw?"idle":"roar";
  if(win){G.wins++;G.points++;G.eclats+=5;}else{if(!draw)G.losses++;G.eclats+=2;}save();
  $("rTitle").textContent=win?"Victoire":draw?"Égalité":"Défaite";
  $("rTitle").style.color=win?"var(--acc2)":draw?"var(--tx)":"var(--acc)";
  $("rScore").textContent=M.P.name+"  "+a+" – "+b+"  "+M.O.name;
  const r=M.rec;$("rRecap").innerHTML="<div><span>Dribbles réussis</span><b>"+r.dr+"</b></div><div><span>Tacles réussis</span><b>"+r.tk+"</b></div><div><span>Tirs</span><b>"+r.sh+"</b></div><div><span>Buts</span><b>"+a+"</b></div>"+(win?"<div><span>Entraînement</span><b>+1</b></div><div><span>Éclats</span><b>+5</b></div>":"<div><span>Éclats</span><b>+2</b></div><div><span>Coffre</span><b>Petit</b></div>");
  $("rLine").innerHTML="<b>Le Borgne</b>"+esc(pick(win?L.win:draw?L.draw:L.lose));
  $("bResA").textContent=win?"Ouvrir le coffre":"Ouvrir le petit coffre";
  M.win=win;show("result");
}
