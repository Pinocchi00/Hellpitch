/* Utilitaires généraux */
const $=id=>document.getElementById(id);
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const eout=t=>1-Math.pow(1-t,3);
const nf=n=>Math.round(n).toLocaleString("fr-FR");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
/* tirage sans répétition immédiate */
function pick(arr){if(!arr._q||!arr._q.length){arr._q=shuffle(arr.map((_,i)=>i));if(arr.length>1&&arr._q[arr._q.length-1]===arr._last)arr._q.unshift(arr._q.pop());}const i=arr._q.pop();arr._last=i;return arr[i];}
const ROM=["I","II","III","IV","V"];
