import { rmSync, copyFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const cmd = process.argv[2];

switch (cmd) {
  case "clean":
    rmSync("dist", { recursive: true, force: true });
    break;
  case "copy-assets":
    copyFileSync("package.json", "dist/package.json");
    copyFileSync("readme.md", "dist/readme.md");
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
