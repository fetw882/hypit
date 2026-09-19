import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import { resolveCredentialDirectory } from "../src/paths.js";

test("relative credential directories stay inside the Host state root", async () => {
  const root = await mkdtemp(join(tmpdir(), "hypit-credential-root-"));
  try {
    assert.equal(resolveCredentialDirectory(root, undefined, "file CredentialStore"), join(root, "credentials"));
    assert.equal(resolveCredentialDirectory(root, "nested/keys", "file CredentialStore"), resolve(root, "nested/keys"));
    const absolute = await mkdtemp(join(tmpdir(), "hypit-credential-absolute-"));
    try {
      assert.equal(resolveCredentialDirectory(root, absolute, "file CredentialStore"), resolve(absolute));
    } finally {
      await rm(absolute, { recursive: true, force: true });
    }
    assert.throws(
      () => resolveCredentialDirectory(root, "..", "file CredentialStore"),
      /file CredentialStore relative path must stay inside the Host state root/u,
    );
    assert.throws(
      () => resolveCredentialDirectory(root, join("foo", "..", "..", "outside"), "file CredentialStore"),
      /file CredentialStore relative path must stay inside the Host state root/u,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
