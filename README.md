# Hellpitch

Duels de foot 1 contre 1 dans un monde en ruine, façon dark fantasy. Rendu PS2 assumé, interface pensée pour le mobile.

Le joueur crée son personnage (attaquant, milieu ou défenseur), s'équipe, s'entraîne, puis enchaîne des matchs simulés d'environ une minute. L'histoire suit le Borgne, un organisateur de matchs louche, sur 5 chapitres et 15 combats, avec des choix qui changent la suite.

## Jouer

- En ligne : la version publiée par GitHub Pages (voir l'onglet *Environments* du dépôt après le premier déploiement).
- En local : `node build.mjs`, puis ouvrir `dist/index.html` via un petit serveur (`npm run serve`).

## Structure

```
src/
  index.html        Squelette HTML de tous les écrans (CSS et JS injectés au build)
  styles.css        Toute l'interface (couleurs, typo, feuilles, boutons)
  js/               Le jeu, découpé par système, assemblé dans l'ordre des numéros
    00-utils.js         Petits utilitaires
    05-data.js          Postes, objets, raretés, marques, stades, adversaires
    10-story.js         Histoire à choix + toutes les répliques
    15-state.js         Sauvegarde, stats, puissance, génération d'objets
    20-render.js        Rendu Three.js, textures pixel, lumières
    25-stages.js        Les 5 stades
    30-characters.js    Squelette, postures par poste, animation
    35-post-camera.js   Filtre PS2 et caméra (cadrage auto, caméra télé)
    40-extras.js        Équipement visible, sang, interruptions absurdes, coffre 3D
    50-moves.js         Moteur d'étapes + 30 animations (attaque, défense, tirs)
    55-match.js         Simulation et déroulé d'un match
    60-ui.js            Écrans, sac, butin, boucle principale
build.mjs           Assemble tout en un seul fichier : dist/index.html
docs/               Game design, journal des versions
CLAUDE.md           Guide technique pour modifier le jeu avec Claude Code
```

## Build

Aucune dépendance. Node 18 ou plus suffit.

```
node build.mjs
```

Le build vérifie la syntaxe JavaScript et s'arrête en cas d'erreur.

## Mise en ligne

Chaque `push` sur `main` construit le jeu et le publie sur GitHub Pages via `.github/workflows/pages.yml`.

Première fois seulement : dans le dépôt, *Settings → Pages → Source : GitHub Actions*.

## Technique

- Un seul fichier HTML au final, sans serveur.
- Three.js r128 chargé depuis cdnjs.
- Sauvegarde dans le navigateur (`localStorage`, clé `hellpitch-save-v3`). Les anciennes sauvegardes « La Fosse » sont reprises automatiquement.

## Licence

Tous droits réservés. Voir `LICENSE`.
