import { CommandBuilder, Path, build$ } from "@david/dax";

const $ = build$({
  commandBuilder: new CommandBuilder()
    .env("PATH", getPathWithCurrentDenoVersion()),
});

// todo(https://github.com/dsherret/dax/pull/252): waiting on this PR
// if ((await $`which deno`.text()).toLowerCase() !== Deno.execPath().toLowerCase()) {
//   throw new Error("Deno was not set correctly in the path");
// }

export interface Test {
  url: string;
  rev: string;
  publishDir?: string;
  prePublish?: (local$: typeof $, path: Path) => Promise<void> | void;
  only?: boolean;
}

const tempDir = $.path(import.meta.dirname!).join("temp");

export function registerTests(tests: Test[]) {
  const onlyTests = tests.filter((t) => t.only);
  if (onlyTests.length > 0 && Deno.env.get("CI") != null) {
    throw new Error("Cannot run only tests in CI")
  }
  tests = onlyTests.length > 0 ? onlyTests : tests;
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
    .cwd(publishCwd);

  // only bother cleaning up when it succeeds
  opts.cwd.removeSync({ recursive: true });
}

function getPathWithCurrentDenoVersion() {
  const path = Deno.env.get("PATH")!;
  const denoPath = new Path(Deno.execPath()).parentOrThrow().toString();
  const separator = Deno.build.os === "windows" ? ";" : ":";
  return `${denoPath}${separator}${path}`;
}