/* Données : postes, objets, raretés, marques, stades, combats */
/* ================= DONNÉES ================= */
const STATS=["frappe","dribble","vitesse","tacle","placement","souffle"];
const LAB={frappe:"Frappe",dribble:"Dribble",vitesse:"Vitesse",tacle:"Tacle",placement:"Placement",souffle:"Souffle"};
const POSTES={
  att:{nom:"Attaquant",desc:"Il marque beaucoup. Il défend mal.",trait:"sangfroid",tn:"Sang-froid",td:"Ses tirs restent précis même fatigué.",s:{frappe:72,dribble:64,vitesse:64,tacle:16,placement:24,souffle:32}},
  mil:{nom:"Milieu",desc:"Bon partout. Il gagne sur la durée.",trait:"second",tn:"Second souffle",td:"Plus fort en fin de match.",s:{frappe:40,dribble:48,vitesse:40,tacle:40,placement:48,souffle:72}},
  def:{nom:"Défenseur",desc:"Il marque peu. Il ne laisse rien passer.",trait:"contre",tn:"Contre",td:"Après un tacle réussi, il tire tout de suite.",s:{frappe:24,dribble:24,vitesse:40,tacle:72,placement:64,souffle:48}}
};
const SLOTS={
  bandeau:{nom:"Bandeau",st:["placement","souffle"],names:["Bandeau","Foulard","Tresse"]},
  maillot:{nom:"Maillot",st:["souffle","tacle"],names:["Maillot","Tunique","Cotte"]},
  brassard:{nom:"Brassard",st:["frappe","dribble"],names:["Brassard","Manchette","Bracelet"]},
  jambieres:{nom:"Jambières",st:["tacle","placement"],names:["Jambières","Protège-tibias","Grèves"]},
  crampons:{nom:"Crampons",st:["vitesse","dribble"],names:["Crampons","Bottes ferrées","Semelles cloutées"]},
  talisman:{nom:"Talisman",st:null,names:["Dent de chien","Clou de cercueil","Œil de verre","Médaille fondue","Mèche de cheveux"]}
};
const SLOTK=Object.keys(SLOTS);
const EPI=["du Pendu","de la Veuve","du Fossoyeur","de Cendre","du Roi Déchu","des Noyés","du Chien Noir","de l'Écorché","du Dernier Hiver","du Bourreau","des Sept Cordes","de la Fosse"];
const RAR=[
  {n:"Rouillé",c:"#8a7f73",m:1,l:"Rouillé. Ça sent la sueur des autres. Mais ça marche."},
  {n:"Forgé",c:"#d8ccb4",m:1.6,l:"Forgé. Du travail propre. C'est rare ici."},
  {n:"Trempé",c:"#7fa3c9",m:2.4,l:"Trempé. Solide. Quelqu'un est mort pour ça, sûrement."},
  {n:"Maudit",c:"#a27ad0",m:3.6,l:"Maudit. Très fort. Tu dormiras mal, mais tu gagneras."},
  {n:"Sanglant",c:"#e0452f",m:5.5,l:"Sanglant. Le meilleur. Ne demande pas d'où il vient."}
];
const PERKS={
  finisseur:{n:"Finisseur",d:"Tes tirs sont plus précis."},
  mur:{n:"Mur",d:"Tes tacles passent plus souvent."},
  poumons:{n:"Poumons de forge",d:"Tu te fatigues moins vite."},
  orgueil:{n:"Orgueil",d:"Plus fort quand tu es mené."},
  butin:{n:"Main chanceuse",d:"Tes coffres sont meilleurs."}
};
const MARKS={
  colere:{n:"Marque de la Colère",d:"Plus fort quand tu es mené.",perk:"orgueil"},
  ruse:{n:"Marque de la Ruse",d:"Tes coffres sont meilleurs.",perk:"butin"},
  loup:{n:"Marque du Loup",d:"+10 en Vitesse.",flat:{vitesse:10}},
  frere:{n:"Marque du Frère",d:"Vasko t'a entraîné. +4 points d'entraînement.",pts:4},
  soins:{n:"Marque de Mira",d:"Tu te fatigues moins vite.",perk:"poumons"},
  borgne:{n:"Marque du Borgne",d:"+10 en Frappe.",flat:{frappe:10}},
  pacte:{n:"Marque du Pacte",d:"Tu as accepté l'offre du Borgne. +6 partout.",flat:{frappe:6,dribble:6,vitesse:6,tacle:6,placement:6,souffle:6}}
};
const STADES=[{key:"fosse",nom:"La Fosse"},{key:"cimetiere",nom:"Le Cimetière"},{key:"forge",nom:"La Forge"},{key:"cathedrale",nom:"La Cathédrale"},{key:"fosserouge",nom:"La Fosse rouge"}];
const FIGHTS=[
  {n:"Le Tanneur",p:"def",col:0x6a6258,intro:"Le Tanneur. Il est lent, mais il frappe comme une porte."},
  {n:"Grisegueule",p:"att",col:0x5a4a3a,intro:"Grisegueule. Il a mordu un cheval. Le cheval a perdu."},
  {n:"Vasko",p:"mil",boss:true,col:0x2e3a4a,intro:"Vasko, champion de la Fosse. Il n'a jamais perdu ici."},
  {n:"La Veuve",p:"att",col:0x2a2a2a,intro:"La Veuve. Trois maris, trois enterrements. Elle ne perd jamais."},
  {n:"Le Fossoyeur",p:"def",col:0x3d4a44,intro:"Le Fossoyeur. Il a déjà creusé ta tombe. Par politesse."},
  {n:"Frère Ossian",p:"mil",boss:true,col:0x4a3a5a,intro:"Frère Ossian. Il bénit le ballon. Puis il te le prend."},
  {n:"Garrot",p:"def",col:0x3a2a22,intro:"Garrot. Ancien bourreau. Pour lui, c'est le même travail."},
  {n:"Brandt le Soufflet",p:"att",col:0x5a2a1a,intro:"Brandt. Il court vite et il crie fort."},
  {n:"Le Maître-Forgeron",p:"att",boss:true,col:0x1e1a18,intro:"Le Maître-Forgeron. Chaque tir pèse une enclume."},
  {n:"Sœur Cendre",p:"mil",col:0x6a6a72,intro:"Sœur Cendre. Elle prie pour toi. Ça ne t'aidera pas."},
  {n:"Le Chevalier Creux",p:"def",col:0x4a3f66,intro:"Le Chevalier Creux. Personne n'a jamais vu son visage."},
  null,
  {n:"Le Bourreau du Roi",p:"def",col:0x2a0e0e,intro:"Le Bourreau du Roi. Il ne parle pas. Il tacle."},
  {n:"La Main Gauche",p:"att",col:0x3a1a2a,intro:"La Main Gauche du Roi. Elle fait le sale travail."},
  {n:"Le Roi Sans Couronne",p:"mil",boss:true,col:0xb89a4a,intro:"Le Roi Sans Couronne. Le frère du Borgne. La finale."}
];
const FIGHT11={ally:{n:"Ser Aldric",p:"def",boss:true,col:0xb0a890,intro:"Ser Aldric, champion du Roi. Il n'a jamais perdu."},enemy:{n:"Vasko l'Enchaîné",p:"mil",boss:true,col:0x2e3a4a,intro:"Vasko est revenu. Il porte encore ses chaînes."}};
const NFIGHTS=15;
const ENDLESS=["L'Aveugle","Hache-Menue","Le Moine Gras","Vermine","La Corneille","Tord-Cou","Le Baron Pourri","Sept-Doigts"];
const BEATS={1:"f1",2:"boss1",3:"ch2",4:"mid2",5:"boss2",6:"ch3",7:"mid3",8:"boss3",9:"ch4",10:"mid4",11:"boss4",12:"ch5",13:"mid5",14:"boss5",15:"end"};
const CHAPTITLE={prologue_a:"Prologue",prologue_b:"Prologue",prologue_c:"Prologue",prologue_d:"Prologue",f1:"Chapitre I",boss1:"Chapitre I",ch2:"Chapitre II",mid2:"Chapitre II",boss2:"Chapitre II",ch3:"Chapitre III",mid3:"Chapitre III",boss3:"Chapitre III",ch4:"Chapitre IV",mid4:"Chapitre IV",boss4:"Chapitre IV",ch5:"Chapitre V",mid5:"Chapitre V",boss5:"Chapitre V",end:"Épilogue"};
