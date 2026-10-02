/* Moteur d'étapes et animations d'attaque, de défense et de tir */
/* ================= MOTEUR D'ÉTAPES ================= */
let queue=[],cur=null,curT=0,speed=1,running=false,elapsed=0,totalT=1,onDone=null;
const S=(dur,start,update,end)=>({dur,start,update,end});
const tw=(dur,setup,end)=>{let u=null;return S(dur,()=>{u=setup()||null;},t=>{if(u)u(t);},end);};
function tickSteps(dt){let rem=dt*speed;
  while(rem>0&&running){
    if(!cur){if(!queue.length){running=false;if(onDone)onDone();return;}cur=queue.shift();curT=0;if(cur.start)cur.start();}
    const used=Math.min(cur.dur-curT,rem);curT+=used;rem-=used;elapsed+=used;
    if(cur.update)cur.update(Math.min(1,curT/cur.dur));
    if(curT>=cur.dur-1e-6){if(cur.end)cur.end();cur=null;}
  }}
function ctx(A,D,d,s){const c={A,D,d,s};
  c.u=a=>a.tgt.x*d;c.v=a=>a.tgt.z;
  c.go=(a,u,v)=>{a.tgt.x=u*d;a.tgt.z=v;};
  c.look=(a,du,dv)=>{a.face=Math.atan2(du*d,dv);};
  c.path=(a,U,V,arc,keep)=>{const u0=c.u(a),v0=c.v(a);return k=>{const u=lerp(u0,U,k),v=lerp(v0,V,k)+(arc?Math.sin(k*Math.PI)*arc:0);if(!keep){const du=u-c.u(a),dv=v-c.v(a);if(du*du+dv*dv>1e-8)c.look(a,du,dv);}c.go(a,u,v);};};
  c.ball=(U,Y,V,h)=>{const b=bpos.clone();return k=>{bpos.set(lerp(b.x,U*d,k),lerp(b.y,Y,k)+Math.sin(k*Math.PI)*(h||0),lerp(b.z,V,k));};};
  return c;}
const approach=(c,U,mA,mD)=>tw(.32,()=>{c.A.mode=mA||"jog";c.D.mode=mD||"press";const a=c.path(c.A,U,c.v(c.A)*.5);return t=>{a(ease(t));ballAt(c.A);};});

/* ================= ANIMATIONS : ATTAQUE ================= */
const ATT={
crochet:{n:"Crochet",l:["Crochet. Le défenseur est parti chercher le ballon dans une autre vie.","Crochet sec. Ses chevilles sont restées à l'ancienne adresse."],f:c=>{const{A,D,s}=c;return[
  tw(.35,()=>{A.mode="run";D.mode="press";const a=c.path(A,.35,s*.8),b=c.path(D,1.2,s*.5,0,true);return t=>{a(ease(t));b(ease(t));ballAt(A);};}),
  tw(.6,()=>{D.mode="slide";const a=c.path(A,2.6,-s*.45),b=c.path(D,.9,s*1.0,0,true);return t=>{a(ease(t));b(eout(t));ballAt(A);};})];}},
petitpont:{n:"Petit pont",l:["Petit pont. Il lui a pris le ballon et un peu de dignité au passage.","Entre les jambes. Là où il aurait dû fermer la porte. Et la bouche."],f:c=>{const{A,D,s}=c;return[
  tw(.35,()=>{A.mode="jog";D.mode="block";const a=c.path(A,.55,0);return t=>{a(ease(t));ballAt(A);};}),
  tw(.7,()=>{A.mode="run";const b=c.ball(2.2,BY,c.v(D),0),a=c.path(A,2.3,s*.2,s*1.3);return t=>{b(Math.min(1,t*1.4));a(ease(t));};},()=>{D.mode="slump";}),
  tw(.15,()=>t=>ballAt(A))];}},
sombrero:{n:"Sombrero",l:["Sombrero. Le ballon passe au-dessus de sa tête. Comme la plupart des idées.","Le chapeau. Il devrait le garder, il fait froid dans la Fosse."],f:c=>{const{A,D,s}=c;return[
  approach(c,.5),
  tw(.25,()=>{A.mode="chip";A.p=0;return t=>{A.p=t;ballAt(A);};}),
  tw(.75,()=>{A.mode="run";D.mode="header";D.p=0;const b=c.ball(2.3,BY,s*.3,1.7),a=c.path(A,2.2,s*.3,s*.9);return t=>{b(t);a(ease(t));D.p=Math.min(1,t*1.6);};},()=>{D.mode="slump";})];}},
roulette:{n:"Roulette",l:["Roulette. Il tourne sur lui-même comme un pendu par grand vent.","Une roulette. Le public adore. Le défenseur beaucoup moins."],f:c=>{const{A,D,s}=c;return[
  approach(c,.55),
  tw(.75,()=>{A.mode="jog";D.mode="poke";c.look(A,1,0);const a=c.path(A,2.0,s*.6,s*.7,true);return t=>{a(ease(t));A.spin=-s*ease(t)*Math.PI*2;ballAt(A);};},()=>{A.spin=0;D.mode="idle";})];}},
acceleration:{n:"Accélération",l:["Il pousse et il court. Pas d'art, juste des jambes. Parfois ça suffit.","Parti. On dirait qu'il a vu un créancier."],f:c=>{const{A,D,s}=c;return[
  tw(.3,()=>{A.mode="run";const a=c.path(A,.2,s*.3);return t=>{a(ease(t));ballAt(A);};}),
  tw(.8,()=>{A.mode="sprint";D.mode="run";const b=c.ball(2.8,BY,s*1.3,.1),a=c.path(A,2.7,s*1.3),dd=c.path(D,1.6,s*.9);return t=>{b(eout(Math.min(1,t*1.5)));a(ease(t));dd(ease(t));};},()=>{D.mode="jog";})];}},
feinte:{n:"Feinte de frappe",l:["Feinte de frappe. L'autre a plongé devant un tir qui n'existe pas. Comme on prie.","Il arme, il ne frappe pas. Le défenseur a sauté pour rien. Toute sa vie, résumée."],f:c=>{const{A,D,s}=c;return[
  approach(c,.4),
  tw(.45,()=>{A.mode="kick";A.p=0;c.look(A,1,0);D.mode="block";return t=>{A.p=t<.6?t*.7:.42*(1-(t-.6)/.4);ballAt(A);};}),
  tw(.55,()=>{A.mode="run";D.mode="fallSide";D.side=s;const a=c.path(A,2.5,-s*.6,-s*.3),b=c.path(D,1.3,s*.7,0,true);return t=>{a(ease(t));b(eout(t));ballAt(A);};})];}},
passement:{n:"Passement de jambes",l:["Passements de jambes. Il danse. L'autre regarde, hypnotisé, comme une poule devant un couteau.","Trois passements. Le défenseur en a compté quatre."],f:c=>{const{A,D,s}=c;return[
  approach(c,.3),
  tw(.85,()=>{A.mode="stepover";D.mode="press";const u0=c.u(A);return t=>{c.go(A,u0,Math.sin(t*Math.PI*3)*.25);c.look(A,1,0);c.go(D,c.u(D),Math.sin(t*Math.PI*3-.9)*.3);c.look(D,-1,0);ballAt(A);};}),
  tw(.5,()=>{A.mode="sprint";D.mode="stumble";const a=c.path(A,2.5,s*.9);return t=>{a(ease(t));ballAt(A);};})];}},
coupderein:{n:"Coup de rein",l:["Coup de rein. Le corps à gauche, le ballon à droite, et l'autre au milieu avec ses regrets.","Coup de rein. Le défenseur a mal au dos pour lui."],f:c=>{const{A,D,s}=c;return[
  approach(c,.4),
  tw(.35,()=>{A.mode="shoulder";A.side=-s;D.mode="press";const a=c.path(A,.55,-s*.25),b=c.path(D,1.25,-s*.6,0,true);return t=>{a(ease(t));b(ease(t));ballAt(A);};}),
  tw(.5,()=>{A.mode="sprint";D.mode="fallSide";D.side=-s;const a=c.path(A,2.6,s*.8);return t=>{a(ease(t));ballAt(A);};})];}},
talonnade:{n:"Talonnade",l:["Talonnade. Il n'a même pas regardé. Le mépris, c'est aussi une technique.","Du talon. Il l'humilie avec la partie du pied qui sent le plus mauvais."],f:c=>{const{A,D,s,d}=c;return[
  approach(c,.5),
  tw(.4,()=>{A.mode="jog";const f0=A.face,f1=Math.atan2(-d,0.001);const bx=bpos.x,bz=bpos.z;return t=>{A.face=lerp(f0,f1,ease(t));bpos.x=bx;bpos.z=bz;};}),
  tw(.35,()=>{A.mode="heel";A.p=0;const b=c.ball(2.3,BY,s*.9,.3);return t=>{A.p=t;b(eout(t));};}),
  tw(.55,()=>{A.mode="run";D.mode="slump";const a=c.path(A,2.2,s*.8,-s*.4);return t=>a(ease(t));}),
  tw(.1,()=>t=>ballAt(A))];}},
grandpont:{n:"Grand pont",l:["Grand pont. Le ballon d'un côté, lui de l'autre, le défenseur au milieu, seul avec lui-même.","Il fait le tour. Le défenseur a le temps de réfléchir à ses choix de vie."],f:c=>{const{A,D,s}=c;return[
  approach(c,.3,"run"),
  tw(.9,()=>{A.mode="sprint";D.mode="poke";const b=c.ball(2.6,BY,-s*.2,.15),a=c.path(A,2.6,-s*.1,s*1.6);return t=>{b(eout(Math.min(1,t*1.3)));a(ease(t));};},()=>{D.mode="slump";}),
  tw(.1,()=>t=>ballAt(A))];}}
};

/* ================= ANIMATIONS : DÉFENSE ================= */
const DEF={
tacle:{n:"Tacle glissé",l:["Tacle glissé. Il retrouvera sa cheville plus tard.","Propre. Enfin, ici, propre veut dire qu'aucun os ne dépasse."],f:c=>{const{A,D,s}=c;return[
  tw(.65,()=>{D.mode="slide";const b=c.path(D,c.u(A)+.3,c.v(A),0,true);return t=>{b(Math.min(1,t*1.6));if(t<.55)ballAt(A);};},()=>{A.mode="fall";}),
  tw(.5,()=>{const b=c.ball(-2.0,BY,s*1.5,.3);return t=>b(eout(t));}),
  tw(.2,()=>{D.mode="idle";})];}},
epaule:{n:"Coup d'épaule",l:["Coup d'épaule. Dans la Fosse, on appelle ça une discussion.","Épaule contre épaule. L'une a gagné, l'autre est partie en vacances."],f:c=>{const{A,D,s}=c;return[
  tw(.35,()=>{A.mode="jog";D.mode="run";const a=c.path(A,.4,s*.3),b=c.path(D,.75,s*.55);return t=>{a(ease(t));b(ease(t));ballAt(A);};}),
  tw(.45,()=>{D.mode="shoulder";D.side=-s;A.mode="fallSide";A.side=s;const a=c.path(A,.2,s*1.5,0,true),b=c.path(D,.45,s*.4,0,true);return t=>{a(eout(t));b(ease(t));};}),
  tw(.3,()=>{D.mode="jog";c.look(D,-1,0);return t=>ballAt(D);})];}},
interception:{n:"Interception",l:["Interception. Il a lu la passe avant qu'elle soit écrite.","Il s'interpose. Le ballon s'arrête, par respect."],f:c=>{const{A,D,s}=c;return[
  tw(.4,()=>{A.mode="run";const a=c.path(A,.5,s*.3),b=c.ball(1.6,BY,s*.6,0);return t=>{a(ease(t));b(ease(t));};}),
  tw(.4,()=>{D.mode="poke";const b=c.path(D,1.9,s*.6,0,true);return t=>b(ease(t));},()=>{A.mode="slump";}),
  tw(.4,()=>{D.mode="jog";c.look(D,-1,0);return t=>ballAt(D);})];}},
pied:{n:"Pied tendu",l:["Un pied qui traîne. Juste assez long pour ruiner une carrière.","Pied tendu. Pas beau, mais efficace, comme un bourreau bien payé."],f:c=>{const{A,D,s}=c;return[
  approach(c,.7),
  tw(.35,()=>{D.mode="poke";return t=>ballAt(A);},()=>{A.mode="stumble";}),
  tw(.55,()=>{const b=c.ball(-1.6,BY,s*1.3,.2);return t=>b(eout(t));},()=>{D.mode="idle";})];}},
mur:{n:"Le mur",l:["Le mur. Il ne bouge pas. Le ballon rebondit, l'attaquant aussi.","Il s'est planté comme un pieu. Le ballon ne passera pas. L'attaquant non plus."],f:c=>{const{A,D,s}=c;return[
  approach(c,.6,"run","block"),
  tw(.3,()=>{A.mode="kick";A.p=0;return t=>{A.p=t;ballAt(A);};}),
  tw(.5,()=>{A.mode="fallBack";const b=c.ball(-1.4,BY,s*.9,.8),a=c.path(A,.1,c.v(A),0,true);return t=>{b(eout(t));a(eout(t));};},()=>{D.mode="idle";})];}},
pressing:{n:"Harcèlement",l:["Il le harcèle comme un créancier. L'autre finit par tout lâcher.","Pressing. Il lui souffle dans la nuque jusqu'à ce qu'il rende le ballon et son âme."],f:c=>{const{A,D,s}=c;return[
  tw(.9,()=>{D.mode="press";A.mode="jog";const a=c.path(A,-.6,s*.4,0,true),b=c.path(D,.2,s*.4,0,true);return t=>{a(ease(t));b(ease(t));c.look(A,-1,.3*s);c.look(D,-1,0);ballAt(A);};}),
  tw(.35,()=>{D.mode="poke";const b=c.path(D,-.2,s*.4,0,true);return t=>b(ease(t));},()=>{A.mode="stumble";}),
  tw(.3,()=>{D.mode="jog";return t=>ballAt(D);})];}},
ciseaux:{n:"Tacle ciseaux",l:["Tacle ciseaux. Dans un monde avec des lois, ce serait un crime. Heureusement, il n'y a plus de lois.","Les deux pieds décollés. Le public se lève. Le médecin aussi, par réflexe. Il est mort l'hiver dernier."],f:c=>{const{A,D,s}=c;return[
  approach(c,.6,"run"),
  tw(.5,()=>{D.mode="scissor";D.side=s;const b=c.path(D,c.u(A)+.2,c.v(A),0,true);return t=>{b(ease(t));ballAt(A);};},()=>{A.mode="fall";shake=.5;}),
  tw(.6,()=>{D.mode="fallSide";D.side=s;const a=c.path(A,-.6,-s*.6,0,true),b=c.ball(-2.1,BY,s*1.6,.5);return t=>{a(eout(t));b(eout(t));};}),
  tw(.3,()=>{D.mode="idle";})];}},
lecture:{n:"Lecture",l:["Il savait. Il a toujours su. Ça doit être épuisant d'être lui.","Lecture parfaite. Il a vu le dribble avant que l'autre y pense."],f:c=>{const{A,D,s}=c;return[
  tw(.35,()=>{A.mode="run";D.mode="press";const a=c.path(A,.3,s*.7),b=c.path(D,1.1,s*.7,0,true);return t=>{a(ease(t));b(ease(t));ballAt(A);};}),
  tw(.35,()=>{D.mode="poke";const b=c.path(D,.8,s*.7,0,true);return t=>b(ease(t));},()=>{A.mode="stumble";}),
  tw(.35,()=>{D.mode="jog";return t=>ballAt(D);})];}},
maillot:{n:"Tirage de maillot",l:["Il lui tire le maillot. L'arbitre est mort il y a trois ans, personne ne sifflera.","Tirage de maillot. Le fil a tenu. Le joueur, moins."],f:c=>{const{A,D,s}=c;return[
  tw(.45,()=>{A.mode="run";D.mode="run";const a=c.path(A,1.5,s*.8),b=c.path(D,1.2,s*.4);return t=>{a(ease(t));b(ease(t));ballAt(A);};}),
  tw(.55,()=>{D.mode="pull";c.look(D,1,.4*s);const a=c.path(A,1.4,s*.9,0,true);return t=>{a(t);ballAt(A);};},()=>{A.mode="fallBack";}),
  tw(.4,()=>{D.mode="jog";c.look(D,-1,0);return t=>ballAt(D);})];}},
tete:{n:"Tête défensive",l:["Coup de tête. Il n'y avait rien dedans, ça ne risquait pas de faire mal.","De la tête. Le ballon repart plus vite qu'il n'est venu. Le crâne tient. Pour l'instant."],f:c=>{const{A,D,s}=c;return[
  approach(c,.4),
  tw(.25,()=>{A.mode="chip";A.p=0;return t=>{A.p=t;ballAt(A);};}),
  tw(.45,()=>{D.mode="header";D.p=0;const b=c.ball(1.1,1.75,0,.2);return t=>{b(t);D.p=t*.6;};}),
  tw(.5,()=>{const b=c.ball(-2.0,BY,s*1.5,.9);return t=>{b(eout(t));D.p=.6+t*.4;};},()=>{D.mode="idle";A.mode="slump";})];}}
};

/* ================= ANIMATIONS : TIRS ================= */
const kickS=(c,dur,amt)=>tw(dur,()=>{c.A.mode="kick";c.A.p=0;return t=>{c.A.p=t*(amt||1);ballAt(c.A);};});
const windS=(c,dur)=>tw(dur,()=>{c.A.mode="windup";return t=>ballAt(c.A);});
const chipS=(c,dur)=>tw(dur,()=>{c.A.mode="chip";c.A.p=0;return t=>{c.A.p=t;ballAt(c.A);};});
const flickS=(c,dur,h,off)=>tw(dur,()=>{const A=c.A;A.mode="chip";A.p=0;const f=A.face,b0=bpos.clone(),tx=A.pos.x+Math.sin(f)*off,tz=A.pos.z+Math.cos(f)*off;return t=>{A.p=Math.min(1,t*2)*.5;bpos.set(lerp(b0.x,tx,t),lerp(b0.y,h,eout(t)),lerp(b0.z,tz,t));};});
const modeS=(c,m,dur)=>tw(dur,()=>{c.A.mode=m;c.A.p=0;return t=>{c.A.p=t;};});
const turnS=(c,dur)=>tw(dur,()=>{const A=c.A;A.mode="jog";const f0=A.face,f1=A.face+Math.PI;return t=>{A.face=lerp(f0,f1,ease(t));};});
const SHOT={
  rasdeterre:{n:"Ras de terre",y:BY,h:0,dur:.42,pre:c=>[kickS(c,.35)],gl:["À ras de terre, comme une rumeur. Personne ne l'a vue venir."]},
  lucarne:{n:"Lucarne",y:1.18,zs:1.02,h:.45,dur:.5,trail:1,pre:c=>[kickS(c,.4)],gl:["Lucarne. Là où même les araignées n'osent pas tisser."]},
  pique:{n:"Piqué",y:.7,h:2.2,dur:.85,pre:c=>[chipS(c,.35)],gl:["Piqué. Doux comme une lame qui entre."]},
  volee:{n:"Volée",y:.8,h:.25,dur:.38,trail:1,pre:c=>[flickS(c,.4,.95,.7),modeS(c,"volley",.3)],gl:["De volée. Le ballon n'a pas eu le temps de toucher terre. Ni de prier."]},
  retourne:{n:"Retourné",y:.9,h:.35,dur:.45,trail:1.2,shake:.3,pre:c=>[flickS(c,.45,1.9,.2),modeS(c,"bicycle",.55)],gl:["Un retourné ! Dans ce trou ! Je double le prix des places, c'est obligé."]},
  talon:{n:"Talonnade",y:.3,h:.1,dur:.6,pre:c=>[turnS(c,.35),modeS(c,"heel",.35)],gl:["Du talon, dos au but. Le gardien, s'il existait, serait vexé."]},
  enroulee:{n:"Frappe enroulée",y:.8,h:.4,curve:1.8,dur:.7,trail:.8,pre:c=>[kickS(c,.4)],gl:["Enroulée. Le ballon a fait un détour, comme un créancier qui connaît ton adresse."]},
  boulet:{n:"Boulet de canon",y:.6,h:.12,dur:.26,trail:2,shake:.7,pre:c=>[windS(c,.45),kickS(c,.22)],gl:["Boulet de canon. Le filet a pris plus de coups que moi en quarante ans de métier."]},
  plat:{n:"Plat du pied",y:BY,zs:.95,h:0,dur:.8,pre:c=>[kickS(c,.3,.6)],gl:["Plat du pied. Poli. Presque aimable. Ça fait encore plus mal."]},
  tete:{n:"Tête",y:.95,h:.2,dur:.5,pre:c=>[flickS(c,.45,1.8,.35),modeS(c,"header",.4)],gl:["De la tête ! Enfin un usage pour ce qu'il a au-dessus des épaules."]}
};
const CELEB=["cheer","kneeSlide","fist","shush","roar","kneel"];
