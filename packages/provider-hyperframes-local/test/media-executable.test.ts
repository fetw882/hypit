import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { mediaExecutablePath, mediaExecutableSuffixes } from "../src/process.js";

test("Windows media lookup uses PATHEXT, including cmd and bat shims", async () => {
  assert.deepEqual(mediaExecutableSuffixes("ffmpeg", "darwin"), [""]);
  assert.deepEqual(mediaExecutableSuffixes("ffmpeg.exe", "win32", ".COM;.EXE;.BAT;.CMD"), [""]);
  assert.deepEqual(mediaExecutableSuffixes("ffmpeg", "win32", ".COM;.EXE;.BAT;.CMD"), [".COM", ".EXE", ".BAT", ".CMD"]);

  const directory = await mkdtemp(join(tmpdir(), "hypit-hf-pathext-"));
  try {
    const shim = join(directory, "ffmpeg.CMD");
    await writeFile(shim, "rem scoop shim");
    assert.equal(
      await mediaExecutablePath("ffmpeg", { platform: "win32", path: directory, pathext: ".COM;.EXE;.BAT;.CMD" }),
      shim,
    );
    await assert.rejects(
      mediaExecutablePath("ffmpeg", { platform: "win32", path: directory, pathext: ".COM;.EXE" }),
      /ffmpegPath or ffprobePath/u,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
