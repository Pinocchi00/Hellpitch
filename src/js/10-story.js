/* Histoire à embranchements et répliques du Borgne */
/* ================= HISTOIRE ================= */
const B=t=>({who:"Le Borgne",t}),MI=t=>({who:"Mira",t}),PI=t=>({who:"Pip",t}),VA=t=>({who:"Vasko",t});
const STORY={
  prologue_a:[B("Réveille-toi. Tu es vivant. Pour l'instant."),B("Je suis le Borgne. J'organise des matchs au fond des fosses."),
    B("Les gens paient pour voir deux joueurs se battre pour un ballon. Pas d'arbitre. Pas de règles."),B("Tu vas jouer pour moi. Dis-moi ce que tu sais faire.")],
  prologue_b:[B("{poste}. Bien. On va voir si tu tiens debout."),MI("Je suis Mira. Je soigne les joueurs du Borgne. Ceux qui reviennent."),
    PI("Et moi, c'est Pip ! Je porte les affaires. Je t'ai trouvé un coffre."),B("Il appartenait à mes trois derniers joueurs. Ils n'en ont plus besoin. Prends une chose.")],
  prologue_c:[B("Bon choix. Il te reste trois nuits avant ton premier match."),MI("Entraîne-toi. Chaque point te rend plus fort. Moi, je soigne les bleus.")],
  prologue_d:[B("Ton premier adversaire s'appelle le Tanneur. Il est lent, mais il frappe fort."),
    B("Gagne, tu repars avec un coffre. Perds, tu repars avec un petit coffre. Je suis généreux."),PI("Bonne chance ! Essaie de ne pas mourir.")],
  f1:[PI("Tu as vu ? Le public a crié ton nom ! Enfin, il a crié."),PI("Dis… Je peux te suivre ? Je veux devenir joueur, comme toi."),
    {ch:[{t:"Oui. Reste avec moi.",fx:g=>{g.flags.pip=1;},then:[PI("Merci ! Je porterai ton sac. Promis, je ne fais pas tomber les choses.")]},
         {t:"Non. Rentre chez toi.",fx:g=>{g.flags.pip=0;},then:[PI("Je n'ai pas de chez-moi. Mais d'accord."),B("Dur. J'aime ça.")]}]}],
  boss1:[B("Ton prochain adversaire, c'est Vasko. Le champion de la Fosse."),VA("Tu joues pour le Borgne ? Alors écoute-moi."),
    VA("Il ne te dit pas tout. Demande-lui ce qui est arrivé à ses trois derniers joueurs."),B("Vasko parle trop. Bats-le. Il parlera moins.")],
  ch2:g=>[B("Tu as battu Vasko. Maintenant, tout le monde connaît ton nom."),B("On part au Cimetière. Là-bas, on joue entre les tombes."),
    MI("Fais attention. Au Cimetière, les joueurs ne pardonnent rien.")].concat(g.flags.pip===1?[PI("J'ai porté ton sac jusqu'ici. Tu as mis des pierres dedans ?")]:[]),
  mid2:[MI("Je dois te dire quelque chose. Parle doucement."),MI("Le Borgne parie contre toi. Quand tu perds, il gagne de l'argent."),
    MI("Ses trois derniers joueurs ont perdu au mauvais moment. On ne les a jamais revus."),
    {ch:[{t:"Je vais lui parler.",fx:g=>{g.flags.confront=1;addMark("colere");},then:[B("Mira parle trop. Oui, je parie. Contre toi. Pour toi. Je parie sur tout."),B("Le monde est pourri. Moi, au moins, je ne le cache pas.")]},
         {t:"Je garde ça pour moi.",fx:g=>{g.flags.confront=0;addMark("ruse");},then:[MI("D'accord. Mais garde les yeux ouverts.")]}]}],
  boss2:[{who:"Frère Ossian",t:"Je prie pour toi, mon enfant. Tu en auras besoin."},B("Ossian était moine. Il a quitté l'Église pour le football. C'est mieux payé.")],
  ch3:[B("Bienvenue à la Forge. Il fait chaud, mais l'argent coule."),VA("Hé. Toi. Regarde-moi."),
    B("Oui, c'est Vasko. Après sa défaite, je l'ai vendu aux forgerons. Un perdant, ça se revend."),VA("Aide-moi à partir. Je te le revaudrai."),
    {ch:[{t:"Je t'aide à fuir.",fx:g=>{g.flags.vasko=1;g.eclats=Math.max(0,g.eclats-30);},then:[VA("Je n'oublierai pas. Quand il le faudra, je serai là."),B("Il s'est enfui ? Quel dommage. Tu me dois trente éclats.")]},
         {t:"Ce n'est pas mon problème.",fx:g=>{g.flags.vasko=0;},then:[VA("Très bien. Souviens-toi de mon visage. Moi, je me souviendrai du tien.")]}]}],
  mid3:g=>g.flags.pip===1?[PI("Le Borgne veut me laisser à la Forge. Pour payer une dette."),PI("Je ne veux pas rester ici. Il fait trop chaud. Et ils crient tout le temps."),
    {ch:[{t:"Prends ma prime. Pip reste avec moi.",fx:g=>{g.flags.pipSaved=1;g.points=Math.max(0,g.points-1);addMark("loup");},then:[B("Tu paies pour un gamin ? Tu es plus bête que je pensais. Ça me plaît presque."),PI("Merci… Je vais m'entraîner. Un jour, je jouerai avec toi.")]},
         {t:"Je ne peux rien faire.",fx:g=>{g.flags.pipSaved=0;},then:[PI("D'accord… Je comprends."),MI("Il comprendra moins quand il sera seul ici.")]}]}]
    :[MI("Tu te souviens de Pip, le gamin ? Il travaille ici, aux fourneaux."),MI("Il ne parle plus. Il regarde tes matchs. Il te regarde, toi.")],
  boss3:[{who:"Le Maître-Forgeron",t:"J'ai fait mes crampons avec le fer des perdants. Il m'en manque une paire."},B("Il frappe très fort. Ne prends pas le ballon dans la tête.")],
  ch4:[B("La Cathédrale. Les riches regardent d'en haut."),B("Là-haut, au balcon, il y a le Roi Sans Couronne."),B("C'est mon frère."),
    B("Quand on était jeunes, il m'a pris mon œil. Pour une couronne qu'il n'a jamais eue."),B("Je veux que tu le battes. Devant tout le monde.")],
  mid4:[MI("J'ai menti. Avant, je travaillais pour le Roi."),MI("Il m'a envoyée chez le Borgne pour surveiller ses joueurs."),
    MI("Pour les trois derniers, je savais ce qui allait arriver. Je n'ai rien dit."),
    {ch:[{t:"Je te pardonne. Reste.",fx:g=>{g.flags.mira=1;addMark("soins");},then:[MI("Merci. Cette fois, je te protégerai. Je connais ses faiblesses.")]},
         {t:"Va-t'en.",fx:g=>{g.flags.mira=0;giveItem(mkItem("talisman",3,g.fight+2));},then:[MI("Je comprends. Prends ça. C'était à moi. Ça te servira plus qu'à moi."),{who:"Coffre",t:"Tu reçois un talisman maudit. Il est dans ton sac."}]}]}],
  boss4:g=>g.flags.vasko===1?[VA("Je t'avais dit que je serais là. On s'entraîne cette nuit. Tous les deux."),{fx:()=>addMark("frere")},
      B("Le Roi a envoyé son champion, Ser Aldric. Il n'a jamais perdu.")]
    :[VA("Tu te souviens de moi ? Tu m'as laissé dans les chaînes."),VA("Le Roi m'a libéré. En échange, je dois te battre."),B("Vasko est plus fort qu'avant. La colère, ça muscle.")],
  ch5:g=>[B("On rentre à la Fosse. C'est là que tout a commencé."),B("Le Roi veut jouer la finale ici. Devant mon public."),
    B("Écoute. Le Roi m'a fait une offre. Si tu perds la finale, il me rend tout. Mon nom. Ma part."),B("Si tu acceptes de perdre, je te paie. Tout de suite."),
    {ch:[{t:"D'accord. Je perdrai.",fx:g=>{g.flags.deal=1;addMark("pacte");},then:[B("Tu es raisonnable. C'est rare.")].concat(g.flags.mira===1?[MI("Tu ne vas pas vraiment faire ça ?")]:[])},
         {t:"Jamais. Je joue pour gagner.",fx:g=>{g.flags.deal=0;addMark("borgne");},then:[B("…Bien. Alors gagne. Et ne me fais pas regretter.")]}]}],
  mid5:g=>[].concat(g.flags.pipSaved===1?[PI("J'ai mes premiers crampons ! Je joue mon premier match demain, dans la petite fosse."),PI("Tu viendras me voir ? Après ta finale ?")]:[],
    g.flags.mira===1?[MI("Le Roi a mal au genou gauche. Il le cache. Passe par sa droite.")]:[B("Mira est partie. Plus personne ne soigne tes bleus. Tu t'habitueras.")],
    [B("La Main Gauche garde la porte. Après elle, la finale.")]),
  boss5:g=>(g.flags.deal===1?[{who:"Le Roi Sans Couronne",t:"Mon frère dit que tu vas perdre. Mon frère ment toujours. Je vais t'écraser quand même."},B("Il m'a trahi. Comme toujours. Oublie l'accord. Gagne.")]
    :[{who:"Le Roi Sans Couronne",t:"Mon frère a enfin trouvé un joueur qui ne se vend pas. Dommage. Tu vas perdre honnêtement."}]).concat([B("C'est le dernier match. Joue pour toi. Pas pour moi.")]),
  end:g=>[B("Tu as battu le Roi. La Fosse est silencieuse. Puis elle explose."),
    g.flags.deal===1?B("J'ai perdu mon pari. Et je suis content. C'est la première fois."):B("Mon frère est à genoux. Je pensais que ce serait meilleur. C'est juste calme.")]
    .concat(g.flags.mira===1?[MI("Tu es libre maintenant. Moi aussi, je crois.")]:[],g.flags.pipSaved===1?[PI("Tu as gagné ! Demain, c'est mon tour. Tu viendras ?")]:[],
    [B("La route est finie. Mais la Fosse ne ferme jamais. Il y aura toujours quelqu'un pour te défier.")])
};

/* ================= RÉPLIQUES ================= */
const L={
  goalMe:["But ! La Fosse gronde.","Dedans ! Retiens ce moment.","But ! Même les morts lèvent la tête.","But ! Le public hurle ton nom. Enfin, presque.","Dedans ! Je vais augmenter le prix des places."],
  goalOp:["But pour lui. Réveille-toi.","Dedans. Le public adore quand tu saignes.","But. Au moins, tu as bien regardé.","Il marque. Tu l'as laissé faire.","But. Ça fait mal, hein ?"],
  win:["Tu gagnes. Demain, quelqu'un de plus fort voudra ta peau.","Victoire. Profite. Ça ne dure jamais longtemps.","Gagné. J'avais parié contre toi. Je te pardonne."],
  lose:["Tu perds. Rentre, soigne-toi, reviens.","Défaite. Pas de honte. Enfin, un peu.","Perdu. Prends ton petit coffre et réfléchis."],
  draw:["Égalité. Personne ne gagne. On rejoue."],
  tips:["Mange. Tu as l'air d'un balai mouillé.","Plus tu es fort, plus on veut te tuer. C'est flatteur.","Si tu meurs, je garde ton équipement. C'est l'usage.","Un talisman ne protège de rien. Mais il brille.","Démonte ce qui ne sert pas. Les éclats renforcent le reste.","Si un poulet entre sur le terrain, ne le regarde pas dans les yeux.","J'ai vendu ta dent d'hier. Bon prix.","Le public lance des navets quand il est content. Et des pierres quand il ne l'est pas.","Un œil de verre en talisman, c'est pratique. Il regarde le ballon à ta place."],
  train:["Chaque point, c'est une nuit sans dormir.","Entraîne ce qui te fait gagner.","Quatre points par nuit. Au-delà, le corps casse."],
  endless:["Encore un. La Fosse en fabrique tous les soirs.","Un nouveau. Il a entendu ton nom. Il veut le tien."]
};
const MOVE_L={
  crochet:["Crochet. Le défenseur part du mauvais côté.","Crochet sec. Il l'a laissé sur place."],
  petitpont:["Petit pont ! Entre les jambes.","Petit pont. Il aurait dû fermer les jambes."],
  sombrero:["Sombrero ! Le ballon passe au-dessus de sa tête.","Le chapeau ! Il ne l'a même pas vu."],
  roulette:["Roulette. Il tourne et il passe.","Une roulette. Le public adore."],
  acceleration:["Il pousse le ballon et il court.","Accélération. Personne ne le rattrape."],
  feinte:["Feinte de tir. L'autre a sauté pour rien.","Il arme, il ne tire pas. Le défenseur tombe dans le piège."],
  passement:["Passements de jambes. Le défenseur ne sait plus où regarder.","Il danse. L'autre est perdu."],
  coupderein:["Coup de rein. Il part à gauche, puis à droite.","Coup de rein. Le défenseur est battu."],
  talonnade:["Talonnade. Il n'a même pas regardé.","Du talon ! Quelle insolence."],
  grandpont:["Grand pont. Le ballon d'un côté, lui de l'autre.","Il fait le tour du défenseur. Simple."],
  tacle:["Tacle glissé. Propre.","Tacle ! Le ballon est perdu."],
  epaule:["Coup d'épaule. Il l'envoie au sol.","Épaule contre épaule. Il gagne le duel."],
  interception:["Interception. Il avait tout vu.","Il coupe la route du ballon."],
  pied:["Un pied tendu. Le ballon s'échappe.","Pied tendu. Pas joli, mais efficace."],
  mur:["Le mur. Il ne bouge pas.","Il bloque tout. Le ballon rebondit."],
  pressing:["Pressing. Il le colle jusqu'à la faute.","Il le harcèle. L'autre craque."],
  ciseaux:["Tacle ciseaux ! Brutal.","Les deux pieds décollés. Ici, c'est permis."],
  lecture:["Il avait deviné le dribble.","Bonne lecture. Il vole le ballon."],
  maillot:["Il tire le maillot. Personne ne sifflera.","Tirage de maillot. Il n'y a pas d'arbitre ici."],
  tete:["Coup de tête. Le ballon repart.","De la tête. Le danger est écarté."]
};
const SHOT_N={rasdeterre:["Ras de terre","À ras de terre. Il ne l'a pas vu."],lucarne:["Lucarne","Dans la lucarne ! Imparable."],pique:["Piqué","Un piqué tout doux. Magnifique."],volee:["Volée","De volée ! Quel geste."],retourne:["Retourné","Un retourné ! Je n'avais jamais vu ça ici."],talon:["Talonnade","Du talon, dos au but !"],enroulee:["Frappe enroulée","Frappe enroulée. Le ballon tourne et rentre."],boulet:["Boulet de canon","Un boulet de canon ! Le filet a souffert."],plat:["Plat du pied","Plat du pied. Calme et précis."],tete:["Tête","De la tête ! Bien joué."]};
const MISS={
  post:{n:"Poteau",l:["Poteau ! Si près.","Le poteau a dit non."]},
  bar:{n:"La barre",l:["La barre ! Trop haut de peu.","Transversale. Pas cette fois."]},
  wide:{n:"À côté",l:["À côté. Le ballon file dans le mur.","Raté. Un corbeau rigole quelque part.","Trop large. Il faut viser."]},
  crowd:{n:"Dans la foule",l:["Dans la foule ! Quelqu'un a pris le ballon en pleine tête.","Tir dans les tribunes. Le public n'est pas content."]}
};
