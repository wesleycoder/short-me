#!/usr/bin/env zx
import "colors";
import "dotenv/config";
import task from "tasuku";
import { $, nothrow } from "zx";

$.verbose = false;

// IDE will report top level await errors as our tsconfig.json target is not es2017 or higher.
// This target for husky is system but tsconfig doesn't support including files without extensions.
// We aren't able to supress the error but the hook will still run without problems.
task("Lint code", async () => {
  await $`npm run lint -- --fix`;
});

await task("Try to update DB types", async (t) => {
  const exitCode = await nothrow(
    $`npx openapi-typescript $NEXT_PUBLIC_SUPABASE_URL/rest/v1/?apikey=$NEXT_PUBLIC_SUPABASE_ANON_KEY --output types/database/index.ts`
  ).exitCode;

  t.setTitle(`Update DB types`.strikethrough);
  t.setWarning(exitCode === 0 ? "ok".green : "error".red);
});

await task("Unit tests", async () => {
  await $`npm test`;
});
