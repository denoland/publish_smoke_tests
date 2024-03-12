# publish_smoke_tests

Ensures that `deno publish --dry-run` works with `deno upgrade --canary` for packages found in the JSR ecosystem.

## Running tests

```sh
deno test -A
```

Or with a local build of Deno:

```sh
../deno/target/debug/deno test -A
```

## Adding a test

Tests can be added by following the pattern in test.ts

PRs are welcome to help ensure that your package keeps working with `deno publish --dry-run`.

- Ideally have no pre-build steps, but if adding some, please ensure that any `deno run` command has limited permissions.

## Workflow

The `run_daily` workflow runs once a day. It can be manually triggered here:

https://github.com/denoland/publish_smoke_tests/actions/workflows/daily.yml
