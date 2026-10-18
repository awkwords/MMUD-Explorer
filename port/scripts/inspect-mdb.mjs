// Lists every table in a MajorMUD .mdb with row and column counts.
// Usage: node scripts/inspect-mdb.mjs ../data-v1.11p.mdb [--columns]
import MDBReader from "mdb-reader";
import { readFileSync } from "node:fs";

const [file, flag] = process.argv.slice(2);
const reader = new MDBReader(readFileSync(file));
for (const name of reader.getTableNames()) {
  const table = reader.getTable(name);
  const cols = table.getColumnNames();
  console.log(`${name}\t${table.rowCount} rows\t${cols.length} cols`);
  if (flag === "--columns") console.log("  " + cols.join(", "));
}
