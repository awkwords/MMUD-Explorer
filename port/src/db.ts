// Loads a MajorMUD .mdb game database entirely in memory, replacing the
// DAO/Access layer of modMMudDatabase.bas. Works in the browser and in Tauri.
import { Buffer } from "buffer";
import MDBReader from "mdb-reader";

export type Row = Record<string, unknown>;

export interface GameDatabase {
  tableNames: string[];
  columns(table: string): string[];
  rows(table: string): Row[];
}

export async function openDatabase(file: Blob): Promise<GameDatabase> {
  const reader = new MDBReader(Buffer.from(await file.arrayBuffer()));
  const cache = new Map<string, Row[]>();

  return {
    tableNames: reader.getTableNames(),
    columns: (table) => reader.getTable(table).getColumnNames(),
    rows(table) {
      let data = cache.get(table);
      if (!data) {
        data = reader.getTable(table).getData() as Row[];
        cache.set(table, data);
      }
      return data;
    },
  };
}
