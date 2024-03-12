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
}, {
  // temp until cliffy publishes
  url: "https://github.com/JOTSR/deno-cliffy",
  rev: "587cfd103bec5a166c0e979066426f1e9c85fbb5",
  prePublish: (_, cwd) => {
    const denoJsonPath = cwd.join("examples/deno.json");
    const denoJson = denoJsonPath.readJsonSync<any>();
    denoJson.exports = "./flags.ts";
    denoJsonPath.writeJsonSync(denoJson);
  }
}, {
  url: "https://github.com/dsherret/dax",
  // temp until the main branch gets this merged in
  rev: "7bc14114cd83d975d70d768b03853ffe9059ee04",
}]);
