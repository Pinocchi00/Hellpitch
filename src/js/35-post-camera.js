/* Filtre PS2 et caméra */
/* ================= POST-TRAITEMENT PS2 ================= */
let rt=null;
const TINT={fosserouge:[1.16,.84,.78],fosse:[1.06,.95,.84],cimetiere:[.86,1.0,.94],forge:[1.12,.86,.74],cathedrale:[.9,.88,1.1]};
const post=new THREE.ShaderMaterial({uniforms:{tD:{value:null},res:{value:new THREE.Vector2(100,100)},time:{value:0},tint:{value:new THREE.Vector3(1,1,1)}},depthTest:false,depthWrite:false,
  vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  fragmentShader:`uniform sampler2D tD;uniform vec2 res;uniform float time;uniform vec3 tint;varying vec2 vUv;
  float b2(vec2 p){p=floor(mod(p,2.));return 2.*p.x+3.*p.y-4.*p.x*p.y;}
  void main(){vec2 px=1./res;vec3 c=texture2D(tD,vUv).rgb;vec3 g=vec3(0.);
    for(int i=0;i<8;i++){float a=float(i)*.785398;vec3 s=texture2D(tD,vUv+vec2(cos(a),sin(a))*px*2.5).rgb;g+=max(s-.6,0.);}
    c+=g*.24;float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,.7)*tint;
    c=pow(max(c,0.),vec3(1.15))*1.12-.012;
    vec2 q=vUv-.5;c*=1.-dot(q,q)*1.15;
    float n=fract(sin(dot(gl_FragCoord.xy+fract(time)*97.,vec2(12.9898,78.233)))*43758.5453);c+=(n-.5)*.05;
    c*=mod(gl_FragCoord.y,2.)<1.?1.:.9;
    vec2 p=gl_FragCoord.xy;float d=(4.*b2(p)+b2(floor(p/2.)))/16.;c=floor(c*31.+d)/31.;
    gl_FragColor=vec4(clamp(c,0.,1.),1.);}`});
const postScene=new THREE.Scene(),postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),post));
function renderFrame(T){renderer.setRenderTarget(rt);renderer.render(scene,cam);renderer.setRenderTarget(null);post.uniforms.tD.value=rt.texture;post.uniforms.time.value=T;renderer.render(postScene,postCam);}

/* ================= CAMÉRA ================= */
const camPos=new THREE.Vector3(0,6,14),camLook=new THREE.Vector3(0,1,0),wantPos=new THREE.Vector3(),wantLook=new THREE.Vector3();
const focus=new THREE.Vector3();let camD=8,T0=0,celebT=0,celebA=null,camShift=-.35,camMode="title",orbit=0,shake=0,camX=0,speaker=BG,snapCam=true;
let RW=100,RH=100,offY=0,offX=0;
function resize(){const a=innerWidth/innerHeight,h=a<1?400:260,w=Math.max(80,Math.round(h*a));RW=w;RH=h;renderer.setSize(w,h,false);cam.aspect=a;cam.fov=a<1?52:40;cam.updateProjectionMatrix();snapU.value.set(w/2,h/2);if(rt)rt.dispose();rt=new THREE.WebGLRenderTarget(w,h,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});post.uniforms.res.value.set(w,h);snapCam=true;}
addEventListener("resize",resize);resize();
/* Cadrage : on mesure la fenêtre de jeu visible et on place le sujet dedans */
function winRect(){const el=document.querySelector(".screen:not(.hide) .window")||document.querySelector("#hud:not(.hide) .window");if(!el)return{top:0,h:innerHeight,left:0,w:innerWidth};const r=el.getBoundingClientRect();return{top:r.top,h:Math.max(50,r.height),left:r.left,w:Math.max(50,r.width)};}
const tanH=()=>Math.tan(THREE.MathUtils.degToRad(cam.fov)/2);
function frame3(cx,cy,cz,height,frac,dx,dz,W,minD,maxD,tilt){
  const f=clamp(frac*W.h/innerHeight,.06,.95),d=clamp(height/f/(2*tanH()),minD,maxD),n=Math.hypot(dx,dz)||1;
  wantPos.set(cx+dx/n*d,cy+d*(tilt||.14),cz+dz/n*d);wantLook.set(cx,cy,cz);}
function camFit(){const hf=2*Math.atan(tanH()*cam.aspect),half=cam.aspect<1?3.0:8.2;return clamp(half/Math.tan(hf/2),8,24);}
function updateCam(dt){
  const pt=cam.aspect<1,W=winRect(),small=W.h<230;
  if(camMode==="title"){if(!RM)orbit+=dt*.07;frame3(0,.7,0,pt?8:7,.95,Math.sin(orbit)*.6,1,W,9,26,.32);}
  else if(camMode==="story"){const s=speaker,sc=s.rig.g.scale.x;
    if(small)frame3(s.pos.x,1.4*sc,s.pos.z,1.05*sc,.8,Math.sin(s.face)+.18,Math.cos(s.face),W,1.2,9,.05);
    else frame3(s.pos.x,1.0*sc,s.pos.z,2.2*sc,.72,Math.sin(s.face)+.18,Math.cos(s.face),W,1.8,12,.1);}
  else if(camMode==="hub"){const p=ME.pos;
    if(small)frame3(p.x,1.38,p.z,1.15,.95,.22,1,W,1.4,9,.06);
    else frame3(p.x,.98,p.z,2.4,.78,.22,1,W,2.2,14,.12);}
  else if(camMode==="loot"){frame3(CHEST.position.x,.5,CHEST.position.z,1.25,.8,.3,1,W,1.4,8,.5);}
  else if(celebT>0&&celebA){celebT-=dt;const p=celebA.pos,o=Math.sin(T0*.6)*.6;wantPos.set(p.x+o,1.55,p.z+(pt?4.6:3.8));wantLook.set(p.x,1.0,p.z);}
  else{/* caméra télé : suit l'action et zoome quand les joueurs se rapprochent */
    const mx=(ME.pos.x+OP.pos.x)/2,mz=(ME.pos.z+OP.pos.z)/2;let fx=lerp(mx,bpos.x,pt?.78:.55),fz=lerp(mz,bpos.z,.45);if(typeof camFx!=='undefined'&&camFx){fx=camFx.position.x;fz=camFx.position.z;}
    const spread=Math.max(Math.abs(ME.pos.x-OP.pos.x),Math.abs(bpos.x-mx)*1.6,Math.abs(ME.pos.z-OP.pos.z)*1.4),flying=bpos.y>.5;
    const d=pt?clamp(4.6+spread*.7+(flying?1.2:0),5.2,10.5):clamp(5.2+spread*.7+(flying?1:0),6,12.5);
    focus.x+=(fx-focus.x)*Math.min(1,dt*3.6);focus.z+=(fz-focus.z)*Math.min(1,dt*2.6);camD+=(d-camD)*Math.min(1,dt*1.8);
    wantPos.set(focus.x+Math.sin(T0*.23)*.15,camD*.42+.6,focus.z+camD*.92);wantLook.set(focus.x,.75,focus.z-.2);}
  T0+=dt;const k=snapCam?1:1-Math.exp(-dt*(camMode==="match"?4.5:3));
  /* décalage optique : le centre de l'image tombe au centre de la fenêtre */
  const tOff=(innerHeight/2-(W.top+W.h/2))/innerHeight*RH,tOx=(innerWidth/2-(W.left+W.w/2))/innerWidth*RW;offY=snapCam?tOff:lerp(offY,tOff,Math.min(1,dt*8));offX=snapCam?tOx:lerp(offX,tOx,Math.min(1,dt*8));snapCam=false;
  cam.setViewOffset(RW,RH,offX,offY,RW,RH);
  camPos.lerp(wantPos,k);camLook.lerp(wantLook,k);
  cam.position.copy(camPos);if(shake>0){cam.position.x+=(Math.random()-.5)*shake*.4;cam.position.y+=(Math.random()-.5)*shake*.4;shake=Math.max(0,shake-dt*1.5);}
  cam.lookAt(camLook);
}
