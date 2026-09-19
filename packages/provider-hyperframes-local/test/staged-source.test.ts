import assert from "node:assert/strict";
import { join, resolve } from "node:path";
import test from "node:test";

import { resolveStagedSource } from "../src/capture.js";

test("staged HyperFrames sources stay inside the work directory under the Host locator rule", () => {
  const work = resolve("/tmp/hf-render-work");
  assert.equal(resolveStagedSource(work, "artifacts/clip.mp4"), join(work, "artifacts", "clip.mp4"));
  assert.equal(resolveStagedSource(`${work}/`, "clip.mp4"), join(work, "clip.mp4"));
  assert.equal(resolveStagedSource(work, join("..hidden", "clip.mp4")), join(work, "..hidden", "clip.mp4"));
  assert.throws(() => resolveStagedSource(work, "../outside.mp4"), /outside the staged project/u);
  assert.throws(() => resolveStagedSource(work, "/etc/passwd.mp4"), /outside the staged project/u);
});
