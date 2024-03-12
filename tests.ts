import { registerTests } from "./register.ts";

registerTests([{
  url: "https://github.com/denoland/deno_std",
  rev: "4da7440c62d79380aa1743d51ecc574a00b2c580",
  prePublish: async ($) => {
    await $`deno run -A ./_tools/convert_to_workspace.ts`;
  },
}, {
  url: "https://github.com/MTKruto/MTKruto",
  rev: "8a9f99722c420978cdcb289ec32f61af353dad2c",
  prePublish: async ($) => {
    await $`deno vendor ./mod.ts`;
    await $`deno run --allow-read=. --allow-write=. https://esm.sh/gh/mtkruto/tools@4ca0c02076/pre_jsr.ts 0.0.0`
  },
}]);
