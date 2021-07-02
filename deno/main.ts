// https://stackoverflow.com/questions/61821038/how-to-use-npm-module-in-deno
// deno compile --unstable --target="x86_64-pc-windows-msvc" --lite main.ts
// deno run --allow-read --unstable --config ./tsconfig.json main.ts
// import x from "https://dev.jspm.io/node-xlsx";

// @ts-ignore
import { createRequire } from "https://deno.land/std/node/module.ts";

// const require = createRequire(import.meta.url);

// const x = require("node-xlsx");

// console.log({ x });

console.log(111);
