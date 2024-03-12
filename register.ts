import $, { CommandBuilder, Path } from "@david/dax";

export interface Test {
  url: string;
  rev: string;
  publishDir?: string;
  prePublish?: (local$: typeof $, path: Path) => Promise<void> | void;
}

const tempDir = $.path(import.meta.dirname!).join("temp");

export function registerTests(tests: Test[]) {
  for (const [i, test] of tests.entries()) {
    Deno.test(`smoke test ${test.url}#${test.rev}`, () => {
      return runSmokeTest({
        ...test,
        cwd: tempDir.join(`test_${i}`),
      });
    });
  }
}

async function runSmokeTest(opts: Test & { cwd: Path }) {
  try {
    opts.cwd.removeSync({ recursive: true });
  } catch {
    // ignore
  }
  opts.cwd.ensureDirSync();

  // check out repo at the specified commit
  await $`git clone --depth 1 ${opts.url} .`.cwd(opts.cwd);
  await $`git fetch --depth 1 origin ${opts.rev}`.cwd(opts.cwd);
  await $`git checkout ${opts.rev}`.cwd(opts.cwd);

  // setup if necessary
  if (opts.prePublish) {
    await opts.prePublish(
      $.build$({
        commandBuilder: new CommandBuilder().cwd(opts.cwd),
      }),
      opts.cwd,
    );
  }

  // run deno publish
  const publishCwd = opts.publishDir
    ? opts.cwd.join(opts.publishDir)
    : opts.cwd;
  await $`deno publish --dry-run --allow-dirty`
    .env("PATH", getPathWithCurrentDenoVersion())
    .cwd(publishCwd);

  // only bother cleaning up when it succeeds
  opts.cwd.removeSync({ recursive: true });
}

function getPathWithCurrentDenoVersion() {
  const path = Deno.env.get("PATH")!;
  const denoPath = Deno.execPath();
  const separator = Deno.build.os === "windows" ? ";" : ":";
  if (path.split(":").includes(denoPath)) {
    return;
  }
  return `${denoPath}${separator}${path}`;
}