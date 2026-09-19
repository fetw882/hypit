import { isAbsolute, join, relative, resolve, sep } from "node:path";

/**
 * Profile `path` is Host-state-relative unless it is an explicit absolute directory.
 * Absolute paths remain valid for WSL Linux homes outside a Windows-mounted Host root.
 * Relative `..` must not write secrets beside that root.
 */
export function resolveCredentialDirectory(
  hostStateRoot: string,
  path: string | undefined,
  label: string,
): string {
  const root = resolve(hostStateRoot);
  if (path === undefined) return join(root, "credentials");
  if (isAbsolute(path)) return resolve(path);
  const directory = resolve(root, path);
  const relation = relative(root, directory);
  if (relation === ".." || relation.startsWith(`..${sep}`) || isAbsolute(relation)) {
    throw new Error(`${label} relative path must stay inside the Host state root`);
  }
  return directory;
}
