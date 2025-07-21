import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "../dist");

function renameFilesToMjs(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      renameFilesToMjs(fullPath);
    } else if (file.endsWith(".js")) {
      const newPath = fullPath.replace(/\.js$/, ".mjs");
      fs.renameSync(fullPath, newPath);
    }
  }
}

function fixImportExtensions(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixImportExtensions(fullPath);
    } else if (file.endsWith(".mjs")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Match: import x from './somefile';
      content = content.replace(
        /((?:import|export)[^'"]+['"])(\.{1,2}\/[^'"]+?)(?<!\.mjs)(['"])/g,
        (_, p1, p2, p3) => `${p1}${p2}.mjs${p3}`
      );

      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

renameFilesToMjs(distDir);
fixImportExtensions(distDir);
