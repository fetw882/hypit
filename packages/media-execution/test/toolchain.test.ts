import assert from "node:assert/strict";
import test from "node:test";

import { REQUIRED_ENCODERS, REQUIRED_FILTERS } from "../src/toolchain.js";

test("the toolchain probe requires encoders and filters the execution body emits", () => {
  for (const name of ["aac", "libvpx", "libvpx-vp9", "libx264", "pcm_s16le"] as const) {
    assert.ok(REQUIRED_ENCODERS.includes(name), name);
  }
  for (const name of ["adelay", "afade", "aloop", "apad", "concat", "fps"] as const) {
    assert.ok(REQUIRED_FILTERS.includes(name), name);
  }
});
