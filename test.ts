import { registerTests } from "./register.ts";

registerTests([{
  url: "https://github.com/denoland/deno_std",
  rev: "377043ce8261be33a58265dcaad70eeb7f5b47ba",
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
}, {
  url: "https://github.com/oakserver/oak",
  rev: "c8e535fdec9bb8155cdbf92c2ad8172ac1b9e893"
}, {
  url: "https://github.com/denosaurs/plug",
  rev: "4cce4d3034bccfcb2b1ca515de8f4f7b4c8f9834"
}, {
  url: "https://github.com/tsirysndr/env-js",
  rev: "a95dca9f2c61b104509760d340335675e35c794b",
}, {
  url: "https://github.com/tsirysndr/exit-js",
  rev: "a8e323edca8da458d3e065fd60a910dfdf6a6500"
}, {
  url: "https://github.com/oxitools/result",
  rev: "74d4638c96d901c35adeaea98aa3a63597ab078b"
}]);
