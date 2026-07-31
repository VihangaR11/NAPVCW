import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("GitHub Pages bundle uses the repository base path for supplied logos", () => {
  const outputUrl = new URL("../dist-pages/", import.meta.url);
  const html = readFileSync(new URL("index.html", outputUrl), "utf8");
  const bundlePath = html.match(
    /<script[^>]+src="\/NAPVCW\/(assets\/index-[^"]+\.js)"/,
  )?.[1];

  assert.ok(bundlePath, "The generated JavaScript bundle should be discoverable");

  const bundle = readFileSync(new URL(bundlePath, outputUrl), "utf8");
  assert.match(bundle, /return[`"]\/NAPVCW\/\$\{/);
  assert.match(bundle, /sri-lanka-government-emblem\.png/);
  assert.match(bundle, /napvcw-emblem\.png/);
});
