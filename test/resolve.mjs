// Lets Node's built-in test runner load the app's TypeScript as it is written: "@/" paths and imports without extensions.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXT = [".ts", ".tsx", "/index.ts"];

export async function resolve(spec, ctx, next) {
  let base = null;
  if (spec.startsWith("@/")) base = path.join(root, spec.slice(2));
  else if ((spec.startsWith("./") || spec.startsWith("../")) && ctx.parentURL?.startsWith("file:")) base = path.resolve(path.dirname(fileURLToPath(ctx.parentURL)), spec);
  if (base && !path.extname(base)) {
    const hit = EXT.map((e) => base + e).find((f) => existsSync(f));
    if (hit) return next(pathToFileURL(hit).href, ctx);
  }
  if (base) return next(pathToFileURL(base).href, ctx);
  return next(spec, ctx);
}
