# Guide technique — Hellpitch

À lire avant toute modification. Le jeu est volontairement simple à assembler : du JavaScript sans framework, découpé en fichiers dans `src/js/`, concaténés dans l'ordre alphabétique à l'intérieur d'une seule fonction (`"use strict"`). Toutes les variables de premier niveau sont donc partagées entre fichiers.

## Règles de travail

- Modifier uniquement `src/`. Ne jamais éditer `dist/index.html` (généré).
- Après chaque changement : `node build.mjs`. Il refuse de construire si la syntaxe est cassée.
- Ne pas déclarer deux fois le même nom de premier niveau dans deux fichiers (erreur « already declared »).
- Garder l'ordre des fichiers : un fichier peut utiliser ce qui est défini dans un fichier de numéro inférieur au chargement. À l'intérieur des fonctions, tout est accessible.
- Textes du jeu en français, phrases courtes et simples. Humour noir et absurde.
- Pas de `localStorage` hors de `15-state.js` (toujours dans un try/catch).

## Direction artistique (ne pas casser)

- Rendu PS2 : basse résolution interne (`resize()` dans `35-post-camera.js`), sommets calés sur la grille de pixels (`snap()`), filtre final (`post`) avec palette réduite, tramage, grain, lignes de balayage, halo.
- Interface : barre noire en haut, fenêtre de jeu au milieu (rien n'est écrit dessus), feuille opaque en bas. Une seule action principale rouge par écran, le reste en listes avec losange.
- Couleurs (`src/styles.css`, `:root`) : noir chaud pour les fonds, os pour le texte, rouge sang `--acc` pour ce qui se touche, or `--acc2` seulement pour les chiffres, couleurs de rareté seulement sur les icônes d'objets.
- Polices : Grenze Gotisch (titres, noms), Cinzel (étiquettes, menus), Spectral (texte courant).

## Carte des systèmes

### Données (`05-data.js`, `10-story.js`)
- `POSTES` : stats de base et trait de chaque poste.
- `SLOTS` : 6 emplacements d'équipement. L'ordre de `names` détermine le **design 3D** de l'objet (voir `GEAR`).
- `RAR` : 5 raretés, multiplicateur `m`, couleur, réplique.
- `PERKS` / `MARKS` : effets spéciaux (objets rares) et marques (débloquées par l'histoire).
- `FIGHTS` : les 15 adversaires. Le combat 12 (index 11) dépend du choix sur Vasko (`FIGHT11`).
- `STORY` : chaque scène est un tableau (ou une fonction `g => tableau` si elle dépend des choix). Types de lignes :
  - `B("texte")`, `MI(...)`, `PI(...)`, `VA(...)` : le Borgne, Mira, Pip, Vasko.
  - `{who:"Nom", t:"texte"}` : n'importe quel personnage (sinon l'adversaire en 3D parle).
  - `{ch:[{t:"choix", fx:g=>{...}, then:[lignes]}]}` : un choix. `fx` modifie la sauvegarde (`g.flags`, `addMark()`, `giveItem()`).
  - `{fx:g=>{...}}` : effet sans texte.
- `BEATS` : quelle scène se joue avant quel combat.

### État (`15-state.js`)
- `G` : la sauvegarde complète. `save()` / `load()`.
- `statsOf(G)` = base + entraînement + objets (renforcés) + marques.
- `power(stats)` : puissance, courbe cubique (`total/900`)³ × 1 000 000. Le maximum n'est jamais affiché.
- `mkItem(slot, rareté, niveau)`, `rollRar()` (une défaite donne un butin moins bon), `curFight()`, `mkOpp()`.

### Personnages (`30-characters.js`)
- Squelette : bassin → torse → tête, épaules → coudes, hanches → genoux → pieds.
- `pose(a, dt)` calcule deux couches puis les mélange :
  1. **Locomotion** pilotée par la vitesse réelle mesurée (les jambes suivent le sol, pas un minuteur).
  2. **Action** (`ACT[nom]`, ex. `kick`, `slide`, `fall`) fondue par-dessus avec un poids `a.w`.
- `a.mode` choisit l'action. Les modes `run`, `jog`, `sprint`, `idle` ne sont que de la locomotion, `press` = garde défensive.
- `STY` : posture et gabarit par poste (attaquant fin et sautillant, défenseur large et bas). `applyBuild(actor, poste)`.
- `integrate(a, dt)` : ressort amorti. Les animations écrivent une **cible** (`a.tgt`), le corps la suit avec inertie.
- Le regard (`a.look`) suit le ballon.

### Animations de match (`50-moves.js`)
- `tw(durée, setup)` : une étape. `setup()` est appelé au début et renvoie `t => {...}` appelé à chaque image (t de 0 à 1).
- `ctx(A, D, d, s)` : repère local du duel. `u` = axe vers le but attaqué, `v` = latéral. `c.path(acteur, U, V, arc)` crée un déplacement, `c.ball(U, Y, V, hauteur)` un trajet de ballon.
- `ATT`, `DEF` : 10 gestes chacun. `SHOT` : 10 tirs. Pour en ajouter un : une entrée avec `n` (nom affiché) et `f: c => [étapes]`, plus ses répliques dans `MOVE_L` (ou `SHOT_N`).
- `BLEED` (`40-extras.js`) : pour chaque geste défensif, à quelle étape le sang gicle et avec quelle force.

### Match (`55-match.js`)
- `simulate(P, O)` décide **tout le match à l'avance** (dribble réussi ou non, tir, résultat, interruption). Ensuite `possession(e)` traduit chaque événement en étapes animées.
- Formules : duel = (dribble + ½ vitesse) contre (tacle + ½ placement), probabilité `x^1.6/(x^1.6+y^1.6)`. Fatigue liée au souffle. Effets `orgueil`, `mur`, `finisseur`, `poumons`.
- Interruption absurde : un match sur deux (`G.mc`), sans répétition avant d'avoir tout vu.

### Extras (`40-extras.js`)
- `GEAR[slot](rig, item, design, rareté)` construit le modèle 3D de l'objet sur le bon membre. Rareté 3+ : pointes, gemme. Rareté 4 : cornes, cape, ailes.
- `bleed(acteur, force, direction)` : gouttes, flaques au sol, taches sur le joueur, dent qui vole.
- `INTER` : interruptions (poulet, navets, chèvre, corbeau, spectateur, saucisses). `camFx` fait suivre l'objet par la caméra.
- `CHEST` : coffre 3D. `showChest(rareté, petit)`, animation dans `updateChest()`.

### Caméra (`35-post-camera.js`)
- `winRect()` mesure la fenêtre de jeu visible de l'écran courant ; `setViewOffset` centre l'image dedans. Ne pas positionner la caméra « à la main » en pixels.
- Modes : `title`, `story`, `hub`, `loot`, `match` (caméra télé qui zoome selon l'écart entre les joueurs), gros plan buteur (`celebT`).

### Écrans (`60-ui.js`, `src/index.html`)
- Chaque écran = `<section class="screen">` avec `.bar`, `.window`, `.sheet`. `show(id)` en affiche un seul.
- Histoire : `story(clé, suite)`. Butin : `openLoot(victoire)` puis `afterLoot()` fait avancer l'histoire.

## Recettes rapides

- **Nouvelle réplique** : ajouter une phrase dans le bon tableau de `10-story.js` (`L`, `MOVE_L`, `MISS`…). Le tirage évite les répétitions (`pick`).
- **Nouvel adversaire** : une entrée dans `FIGHTS` (`n`, `p`, `col`, `intro`, `boss`). La force suit l'index.
- **Nouvelle scène d'histoire** : une clé dans `STORY`, un titre dans `CHAPTITLE`, un index dans `BEATS`.
- **Nouveau design d'objet** : ajouter un nom dans `SLOTS[slot].names`, puis la branche `d === n` dans `GEAR[slot]`.
- **Nouveau stade** : une fonction dans `STAGE` (`25-stages.js`), une entrée dans `STADES`, une teinte dans `TINT`, une phrase dans `LDQ`.
- **Nouvelle interruption** : une entrée dans `INTER` avec `l` (réplique) et `run()` qui pousse une fonction d'animation dans `FX` (retourner `false` pour finir) et règle `camFx`.

## Tester

Pas de tests automatiques. Après un changement : construire, ouvrir `dist/index.html` sur téléphone (portrait) et sur PC (paysage), faire une partie jusqu'au premier coffre.
