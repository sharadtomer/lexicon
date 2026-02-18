import { rmSync, copyFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { resolve, join } from "path";

const cmd = process.argv[2];
const isDev = process.argv.includes("--dev");
const outDir = isDev ? "npm-local/node_modules/@sharadt/lexicons" : "dist";

switch (cmd) {
  case "clean":
    rmSync("dist", { recursive: true, force: true });
    rmSync("npm-local", { recursive: true, force: true });
    break;
  case "copy-assets":
    mkdirSync(outDir, { recursive: true });
    copyFileSync("package.json", join(outDir, "package.json"));
    copyFileSync("readme.md", join(outDir, "readme.md"));
    break;
  case "publish":
    execSync("npm publish", {
      cwd: resolve("dist"),
      stdio: "inherit",
    });
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
}
