// mdb-reader's browser build pulls in old Node-style packages (readable-stream,
// create-hash) that read `process`, `global` and `Buffer` when they load.
// Browsers have none of these, so define them before anything imports mdb-reader.
// Must be the first import in main.ts.
import { Buffer } from "buffer";
import process from "process";

const g = globalThis as Record<string, unknown>;
g.global ??= globalThis;
g.process ??= process;
g.Buffer ??= Buffer;
