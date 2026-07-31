import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the DCFMS EPF login prototype", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>DCFMS Prototype \| NAPVCW<\/title>/i);
  assert.match(html, /Digital Case Flow Management System/);
  assert.match(html, /Employee sign in/);
  assert.match(html, /Do not have an account\?/);
  assert.match(html, /Create account/);
  assert.match(html, /Username \/ EPF number/);
  assert.match(html, /Demonstration accounts/);
  assert.match(html, /sri-lanka-government-emblem\.png/);
  assert.match(html, /napvcw-emblem\.png/);
  assert.match(html, /Production credentials and role/);
  assert.doesNotMatch(html, /DCFMS-2026-0027/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
