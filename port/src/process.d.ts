// The `process` npm package (browser shim for Node's process) ships no types.
declare module "process" {
  const process: Record<string, unknown>;
  export default process;
}
