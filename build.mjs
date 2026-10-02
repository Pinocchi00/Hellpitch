// Assemble le jeu en un seul fichier : dist/index.html
// Usage : node build.mjs   (aucune dépendance à installer)
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const tpl = readFileSync("src/index.html", "utf8");
const css = readFileSync("src/styles.css", "utf8");
const files = readdirSync("src/js").filter((f) => f.endsWith(".js")).sort();
const js = files.map((f) => `/* ==== ${f} ==== */\n` + readFileSync("src/js/" + f, "utf8")).join("\n");

// Vérifie la syntaxe avant d'écrire : une erreur ici bloque le build.
try {
  new vm.Script(`(function(){"use strict";\n${js}\n})`, { filename: "hellpitch.js" });
} catch (e) {
  console.error("Erreur de syntaxe dans src/js :\n", e.message);
  process.exit(1);
}

const out = tpl.replace("/*__CSS__*/", () => css).replace("/*__JS__*/", () => js);
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", out);
console.log(`OK : dist/index.html (${files.length} fichiers JS, ${(out.length / 1024).toFixed(0)} Ko)`);
