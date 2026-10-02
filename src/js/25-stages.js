/* Les stades */
/* ================= STADES ================= */
let STG=null,stAnim=[],stageKey=null,flare=0;
function flame(x,y,z,s){s=s||1;const f=new THREE.Mesh(new THREE.ConeGeometry(.16*s,.42*s,4),bas(0xe0913f));f.position.set(x,y+.12*s,z);const f2=new THREE.Mesh(new THREE.ConeGeometry(.08*s,.26*s,4),bas(0xffe0a0));f2.position.set(x,y+.08*s,z);STG.add(f);STG.add(f2);const ph=Math.random()*9;stAnim.push(T=>{const n=.85+Math.sin(T*13+ph)*.1+Math.sin(T*23+ph*2)*.07+flare*.8;f.scale.set(1,n,1);f2.scale.set(1,n*.9,1);});}
let crowdQ=[];
function crowdAt(x,y,z,mat,hood){let q=crowdQ.find(c=>c.mat===mat&&c.hood===!!hood);if(!q){q={mat,hood:!!hood,l:[]};crowdQ.push(q);}q.l.push([x,y,z,Math.random()*6,hood?.01:.03+Math.random()*.05,.9+Math.random()*.25]);}
function flushCrowd(){crowdQ.forEach(q=>{const n=q.l.length,body=new THREE.InstancedMesh(new THREE.BoxGeometry(.42,.7,.3),q.mat,n),head=new THREE.InstancedMesh(q.hood?new THREE.ConeGeometry(.2,.42,4):new THREE.BoxGeometry(.26,.26,.26),q.mat,n);STG.add(body);STG.add(head);const m4=new THREE.Matrix4();
  const upd=T=>{for(let i=0;i<n;i++){const c=q.l[i],yy=c[1]+Math.abs(Math.sin(T*(2+flare*8)+c[3]))*(c[4]+flare*.25);m4.makeScale(1,c[5],1);m4.setPosition(c[0],yy+.35*c[5],c[2]);body.setMatrixAt(i,m4);m4.makeScale(1,1,1);m4.setPosition(c[0],yy+.7*c[5]+(q.hood?.2:.13),c[2]);head.setMatrixAt(i,m4);}body.instanceMatrix.needsUpdate=true;head.instanceMatrix.needsUpdate=true;};upd(0);stAnim.push(upd);});crowdQ=[];}
function mergeStatic(){const by=new Map();STG.children.slice().forEach(m=>{if(m.isMesh&&m.userData.st){if(!by.has(m.material))by.set(m.material,[]);by.get(m.material).push(m);STG.remove(m);}});
  by.forEach((arr,mat)=>{let n=0;const gs=arr.map(m=>{m.updateMatrix();const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrix);n+=g.attributes.position.count;m.geometry.dispose();return g;});
    const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2);let o=0;gs.forEach(g=>{pos.set(g.attributes.position.array,o*3);nor.set(g.attributes.normal.array,o*3);if(g.attributes.uv)uv.set(g.attributes.uv.array,o*2);o+=g.attributes.position.count;g.dispose();});
    const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(pos,3));G.setAttribute('normal',new THREE.BufferAttribute(nor,3));G.setAttribute('uv',new THREE.BufferAttribute(uv,2));const M=new THREE.Mesh(G,mat);M.receiveShadow=true;STG.add(M);});}
function goals(mat){const net=lam(0x8a7f6a);[1,-1].forEach(sx=>{const x=sx*8.2,bx=sx*8.85;[[x,-1.2],[x,1.2],[bx,-1.2],[bx,1.2]].forEach(p=>box(.12,1.4,.12,mat,p[0],.7,p[1],STG));box(.12,.12,2.52,mat,x,1.4,0,STG);box(.12,.12,2.52,mat,bx,1.4,0,STG);box(.65,.08,.08,mat,(x+bx)/2,1.4,-1.2,STG);box(.65,.08,.08,mat,(x+bx)/2,1.4,1.2,STG);for(let i=-1;i<=1.01;i+=.4)box(.02,1.4,.02,net,bx,.7,i,STG);for(let j=.3;j<1.4;j+=.35)box(.02,.02,2.4,net,bx,j,0,STG);});}
function pit(draw,chalkCol){const g=new THREE.Mesh(new THREE.PlaneGeometry(22,12,44,24),lam(0xffffff,pitchTex(draw,chalkCol)));g.rotation.x=-Math.PI/2;g.receiveShadow=true;STG.add(g);}
const STAGE={
fosse(){
  setEnv(0x070504,.024,[0x6a5a4e,.85],[0xa8b4d0,.55,-7,13,6],[[0xf0a050,-5,2.7,-3.6,2.6],[0xf0a050,5,2.7,-3.6,2.6],[0xf0a050,-8.6,2.7,-2.2,1.3],[0xf0a050,8.6,2.7,-2.2,1.3]]);
  pit(groundDraw("#6e5a47",["#4a3a2c","#826c55","#5c4a3c","#947c62"]),"rgba(230,218,195,.65)");
  const st=lam(0xffffff,stoneTex("#6e665e",["#4a443e","#7a726a","#565049"],[6,1])),stS=lam(0xffffff,stoneTex("#6e665e",["#4a443e","#7a726a"],[3.5,1]));
  box(19.6,3.2,.6,st,0,1.6,-5.1,STG);box(.6,3.2,10.8,stS,9.5,1.6,0,STG);box(.6,3.2,10.8,stS,-9.5,1.6,0,STG);box(19.6,.8,.6,st,0,.4,5.1,STG);
  [[-9.4,-4.9],[9.4,-4.9]].forEach(p=>box(1.2,4.4,1.2,st,p[0],2.2,p[1],STG));
  const wood=lam(0x3a2a1c,texCloth);
  [[-5,-4.7],[5,-4.7],[-9.1,-2.2],[9.1,-2.2]].forEach(p=>{box(.14,.5,.14,wood,p[0],2.0,p[1],STG);flame(p[0],2.3,p[1]);});
  const cm=lam(0x1e1814);for(let i=0;i<30;i++)crowdAt(-8.7+i*.6+(Math.random()-.5)*.2,3.2,-5.2-Math.random()*.4,cm);
  for(let i=0;i<12;i++){crowdAt(9.7+Math.random()*.3,3.2,-4.2+i*.75,cm);crowdAt(-9.7-Math.random()*.3,3.2,-4.2+i*.75,cm);}
  const ir=lam(0x2a2420);box(.14,3.2,.14,wood,-7.6,4.8,-5.2,STG);box(1.4,.12,.12,wood,-7.0,6.35,-5.2,STG);
  const cage=new THREE.Group();cage.position.set(-6.4,5.4,-5.2);STG.add(cage);for(let i=0;i<4;i++){const a=i*Math.PI/2;box(.04,1,.04,ir,Math.cos(a)*.28,0,Math.sin(a)*.28,cage);}box(.6,.04,.6,ir,0,-.5,0,cage);box(.6,.04,.6,ir,0,.5,0,cage);box(.2,.2,.2,lam(0xcfc3a8,texSkin),0,-.3,0,cage);
  stAnim.push(T=>{cage.rotation.z=Math.sin(T*.8)*.06;cage.rotation.y=Math.sin(T*.5)*.3;});
  goals(lam(0xcfc3a8,texSkin));
},
cimetiere(){
  setEnv(0x080d0b,.026,[0x55645c,.9],[0xc8e6d8,.9,6,14,-3],[[0xffb060,-4,1.8,-4.1,1],[0xffb060,4,1.8,-4.1,1],[0xa0d8c0,0,5,2.5,.8],[0xffb060,0,1.6,4.6,.5]]);
  pit(groundDraw("#56644c",["#3a4632","#687a5a","#465440","#7a6e52"]),"rgba(222,226,206,.55)");
  const st=lam(0xffffff,stoneTex("#6a6e68",["#4a4e48","#7a7e76","#56594f"],[6,.4]));
  box(19.6,1.1,.6,st,0,.55,-5.1,STG);box(.6,1.1,10.8,st,9.5,.55,0,STG);box(.6,1.1,10.8,st,-9.5,.55,0,STG);box(19.6,.6,.6,st,0,.3,5.1,STG);
  const iron=lam(0x1c1a1a);for(let x=-9.4;x<=9.4;x+=.5)box(.05,1.4,.05,iron,x,1.8,-5.1,STG);box(19,.06,.06,iron,0,2.4,-5.1,STG);
  for(let z=-4.8;z<=4.8;z+=.6){box(.05,1.2,.05,iron,9.5,1.7,z,STG);box(.05,1.2,.05,iron,-9.5,1.7,z,STG);}
  const tomb=lam(0xffffff,stoneTex("#7a7c76",["#5a5c56","#8a8c84"],[1,1]));
  for(let i=0;i<26;i++){const t=box(.6,.9+Math.random()*.4,.16,tomb,-11+Math.random()*22,.45,-6.2-Math.random()*4,STG);t.rotation.z=(Math.random()-.5)*.3;t.rotation.x=(Math.random()-.5)*.2;}
  for(let i=0;i<7;i++){const x=-10+Math.random()*20,z=-6.5-Math.random()*3.5;box(.12,1.4,.12,tomb,x,.7,z,STG);box(.6,.12,.12,tomb,x,1.05,z,STG);}
  const bark=lam(0x2a221c,texCloth);box(.35,3.8,.35,bark,-7,1.9,-7.2,STG);[[-7.4,3.2,-.7],[-6.5,3.6,.6],[-7.2,2.6,-.9],[-6.7,4,.4]].forEach(b=>{box(.14,1.4,.14,bark,b[0],b[1],-7.2,STG).rotation.z=b[2];});
  const wax=lam(0xd8ccb4,texSkin);for(let i=0;i<10;i++){const x=-8.5+i*1.9;box(.07,.22,.07,wax,x,1.21,-4.95,STG);flame(x,1.34,-4.95,.45);}
  const cm=lam(0x191c1a);for(let i=0;i<16;i++)crowdAt(-10+Math.random()*20,0,-6.4-Math.random()*3,cm,true);
  const cr=lam(0x080808);for(let i=0;i<6;i++){const g=new THREE.Group();g.position.set(-8+Math.random()*16,2.45,-5.1);box(.14,.12,.24,cr,0,.06,0,g);box(.08,.08,.08,cr,0,.14,.12,g);STG.add(g);const ph=Math.random()*9;stAnim.push(T=>{g.rotation.y=Math.sin(T*.7+ph)*.8;g.position.y=2.45+Math.max(0,Math.sin(T*3+ph))*.03+flare*.4;});}
  const moon=new THREE.Mesh(new THREE.CircleGeometry(2.6,10),bas(0xdfe8d8,{fog:false}));moon.position.set(9,15,-34);moon.lookAt(0,4,10);STG.add(moon);
  const mistM=bas(0xa8c8b8,{transparent:true,opacity:.07,depthWrite:false});for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(14,2.2),mistM);m.position.set(-6+i*4,.5+i*.15,-3+i*1.8);STG.add(m);const ph=i*1.7;stAnim.push(T=>{m.position.x=Math.sin(T*.12+ph)*5;});}
  goals(lam(0xb8b4a8,texSkin));
},
forge(){
  setEnv(0x0e0403,.024,[0x7a3e2c,.85],[0xff9a60,.35,4,12,8],[[0xff5a1a,-6,.9,-4.2,2.3],[0xff5a1a,6,.9,-4.2,2.3],[0xff7a2a,0,2.4,-3.9,2.1],[0xff4a10,0,1.2,4.4,1.1]]);
  pit(groundDraw("#56423a",["#36281f","#6a5244","#44322a","#8a4420"]),"rgba(226,196,166,.55)");
  const ir=lam(0xffffff,ironTex([6,1.2])),irS=lam(0xffffff,ironTex([3.5,1.2]));
  box(19.6,3.6,.6,ir,0,1.8,-5.1,STG);box(.6,3.6,10.8,irS,9.5,1.8,0,STG);box(.6,3.6,10.8,irS,-9.5,1.8,0,STG);box(19.6,.9,.6,ir,0,.45,5.1,STG);
  const lava=bas(0xff6a1a);[[-4.55,17.5,.55],[4.55,17.5,.4]].forEach(q=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(q[1],q[2]),lava);m.rotation.x=-Math.PI/2;m.position.set(0,.03,q[0]);STG.add(m);});
  stAnim.push(T=>{lava.color.setRGB(1,.35+Math.sin(T*2)*.08+flare*.3,.08);});
  const dark=lam(0x141010);box(3.4,2.6,.4,dark,0,1.3,-4.75,STG);const mouth=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.3),bas(0xff7a2a));mouth.position.set(0,1.2,-4.54);STG.add(mouth);for(let i=-2;i<=2;i++)box(.08,1.3,.08,dark,i*.45,1.2,-4.5,STG);
  stAnim.push(T=>{mouth.material.color.setRGB(1,.45+Math.sin(T*5)*.06+flare*.3,.15);});
  const chain=lam(0x3a3230);[-6,-3,3,6].forEach((x,j)=>{const g=new THREE.Group();g.position.set(x,4.6,-4.2);STG.add(g);for(let i=0;i<9;i++)box(.07,.18,.07,chain,0,-i*.22,0,g);box(.3,.3,.3,chain,0,-2.1,0,g);const ph=j*1.3;stAnim.push(T=>{g.rotation.z=Math.sin(T*1.1+ph)*.08;g.rotation.x=Math.sin(T*.9+ph)*.05;});});
  [[-8,-3.8],[8,3.6],[-8,3.6]].forEach(p=>{box(.5,.4,.3,dark,p[0],.2,p[1],STG);box(.8,.2,.34,chain,p[0],.5,p[1],STG);});
  {const N=40,im=new THREE.InstancedMesh(new THREE.BoxGeometry(.06,.06,.06),bas(0xffc070),N),P=[],m4=new THREE.Matrix4();STG.add(im);const reset=q=>{q.x=-8.5+Math.random()*17;q.y=.1;q.z=Math.random()<.7?-4.5:4.5;q.v=.6+Math.random()*1.4;q.w=(Math.random()-.5)*.6;};for(let i=0;i<N;i++){const q={};reset(q);q.y=Math.random()*4;P.push(q);}
  stAnim.push((T,dt)=>{for(let i=0;i<N;i++){const q=P[i];q.y+=q.v*dt*(1+flare*2);q.x+=q.w*dt;if(q.y>4.5)reset(q);m4.makeTranslation(q.x,q.y,q.z);im.setMatrixAt(i,m4);}im.instanceMatrix.needsUpdate=true;});}
  const cm=lam(0x241612);for(let i=0;i<30;i++)crowdAt(-8.7+i*.6,3.6,-5.25-Math.random()*.3,cm);
  goals(lam(0x6a5a54));
},
cathedrale(){
  setEnv(0x050509,.02,[0x50506a,.9],[0xc8d0ff,.6,-5,14,5],[[0x8a6aff,0,4.2,-3.2,2],[0xffb070,-7.6,2.1,-3.4,1.1],[0xffb070,7.6,2.1,-3.4,1.1],[0x7a8aff,0,5,3,.7]]);
  pit(tileDraw(),"rgba(220,215,235,.5)");
  const st=lam(0xffffff,stoneTex("#76727c",["#56525c","#86828c","#625e68"],[6,2])),stS=lam(0xffffff,stoneTex("#76727c",["#56525c","#86828c"],[3.5,1.4]));
  box(19.6,6.4,.6,st,0,3.2,-5.1,STG);box(.6,4.4,10.8,stS,9.5,2.2,0,STG);box(.6,4.4,10.8,stS,-9.5,2.2,0,STG);box(19.6,.9,.6,st,0,.45,5.1,STG);
  [-7.6,-3.9,3.9,7.6].forEach(x=>{box(1.0,7.4,1.0,st,x,3.7,-4.75,STG);box(1.3,.4,1.3,st,x,.2,-4.75,STG);});
  [-4,0,4].forEach(z=>{box(.9,5.2,.9,stS,9.1,2.6,z,STG);box(.9,5.2,.9,stS,-9.1,2.6,z,STG);});
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(4.6,4.4),bas(0xffffff,{map:glassTex(),fog:false}));glass.position.set(0,3.6,-4.78);STG.add(glass);
  const rose=new THREE.Mesh(new THREE.CircleGeometry(1.1,8),bas(0xffffff,{map:glassTex(),fog:false}));rose.position.set(0,6.4,-4.78);STG.add(rose);
  stAnim.push(T=>{const v=.85+Math.sin(T*.6)*.08+flare*.3;glass.material.color.setRGB(v,v,v);rose.material.color.setRGB(v,v,v);});
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(4.2,11),bas(0x9a8aff,{transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));sh.position.set(0,2.2,-1.2);sh.rotation.x=-1.05;STG.add(sh);
  const gold=lam(0x8a7040),wax=lam(0xd8ccb4,texSkin);
  [[-8.3,-3.9],[8.3,-3.9],[-8.3,3.9],[8.3,3.9]].forEach(p=>{box(.08,1.4,.08,gold,p[0],.7,p[1],STG);box(.6,.06,.06,gold,p[0],1.4,p[1],STG);[-.28,0,.28].forEach(o=>{box(.06,.2,.06,wax,p[0]+o,1.52,p[1],STG);flame(p[0]+o,1.63,p[1],.4);});});
  const bone=lam(0xa8a4a0,texSkin);[-5.75,-2.9,2.9,5.75].forEach(x=>{box(.8,.25,.5,st,x,1.4,-4.6,STG);const g=new THREE.Group();g.position.set(x,1.52,-4.6);STG.add(g);box(.42,.9,.3,bone,0,.45,0,g);box(.26,.26,.26,bone,0,1.05,0,g);box(.1,.5,.1,bone,.28,.65,.1,g).rotation.z=.4;});
  const cm=lam(0x2a2436);for(let i=0;i<10;i++){crowdAt(9.7,4.4,-4+i*.85,cm,true);crowdAt(-9.7,4.4,-4+i*.85,cm,true);}
  [[-8.6,4.3],[8.4,-4.1],[-6.5,4.6]].forEach(p=>{for(let i=0;i<4;i++){box(.3+Math.random()*.4,.25+Math.random()*.3,.3+Math.random()*.3,st,p[0]+(Math.random()-.5)*.8,.15,p[1]+(Math.random()-.5)*.4,STG).rotation.y=Math.random()*3;}});
  goals(lam(0xcfc3a8,texSkin));
},
fosserouge(){
  STAGE.fosse();
  setEnv(0x0c0302,.026,[0x6a3a32,.85],[0xd08a7a,.4,-7,13,6],[[0xff4a20,-5,2.7,-3.6,2.8],[0xff4a20,5,2.7,-3.6,2.8],[0xff3010,-8.6,2.7,-2.2,1.5],[0xff3010,8.6,2.7,-2.2,1.5]]);
  const red=lam(0x7a1410,texCloth),gold=lam(0x8a7040);
  [-7,-2.5,2.5,7].forEach(x=>{box(1.1,2.1,.04,red,x,2.0,-4.77,STG);box(1.2,.08,.08,gold,x,3.08,-4.75,STG);});
  [[-2.5,4.6],[2.5,4.6]].forEach(p=>{box(.14,.9,.14,gold,p[0],1.25,p[1],STG);flame(p[0],1.75,p[1],1.2);});
}};
function buildStage(k){if(STG){scene.remove(STG);STG.traverse(o=>{if(o.geometry)o.geometry.dispose();});}STG=new THREE.Group();scene.add(STG);stAnim=[];crowdQ=[];STAGE[k]();flushCrowd();mergeStatic();post.uniforms.tint.value.set(...TINT[k]);stageKey=k;}
