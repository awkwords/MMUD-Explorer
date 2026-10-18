import "./polyfills.ts";
import "./style.css";
import { openDatabase, type GameDatabase, type Row } from "./db.ts";

const MAX_ROWS = 500;

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <header>
    <h1>MMUD Explorer</h1>
    <label class="file">
      Open database (.mdb)
      <input type="file" id="file" accept=".mdb" hidden />
    </label>
    <span id="status">No database loaded.</span>
  </header>
  <nav id="tables"></nav>
  <div id="toolbar" hidden>
    <input type="search" id="filter" placeholder="Filter rows…" />
    <span id="count"></span>
  </div>
  <div id="grid"></div>
`;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const statusEl = $("status");
const tablesEl = $("tables");
const toolbarEl = $("toolbar");
const filterEl = $<HTMLInputElement>("filter");
const countEl = $("count");
const gridEl = $("grid");

let db: GameDatabase | undefined;
let currentTable = "";

$<HTMLInputElement>("file").addEventListener("change", async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  statusEl.textContent = `Loading ${file.name}…`;
  try {
    db = await openDatabase(file);
    statusEl.textContent = file.name;
    renderTableList();
    showTable(db.tableNames.includes("Items") ? "Items" : db.tableNames[0]);
  } catch (err) {
    statusEl.textContent = `Could not open ${file.name}: ${(err as Error).message}`;
  }
});

filterEl.addEventListener("input", () => renderGrid());

function renderTableList() {
  tablesEl.replaceChildren(
    ...db!.tableNames.map((name) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.dataset.table = name;
      btn.addEventListener("click", () => showTable(name));
      return btn;
    }),
  );
}

function showTable(name: string) {
  currentTable = name;
  filterEl.value = "";
  toolbarEl.hidden = false;
  for (const btn of tablesEl.querySelectorAll<HTMLButtonElement>("button")) {
    btn.classList.toggle("active", btn.dataset.table === name);
  }
  renderGrid();
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function renderGrid() {
  if (!db) return;
  const columns = db.columns(currentTable);
  const needle = filterEl.value.trim().toLowerCase();
  const matches: Row[] = needle
    ? db.rows(currentTable).filter((row) =>
        columns.some((c) => formatCell(row[c]).toLowerCase().includes(needle)),
      )
    : db.rows(currentTable);

  const shown = matches.slice(0, MAX_ROWS);
  countEl.textContent =
    matches.length > MAX_ROWS
      ? `${matches.length} rows (showing first ${MAX_ROWS})`
      : `${matches.length} rows`;

  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  for (const c of columns) {
    const th = document.createElement("th");
    th.textContent = c;
    head.appendChild(th);
  }
  const body = table.createTBody();
  for (const row of shown) {
    const tr = body.insertRow();
    for (const c of columns) tr.insertCell().textContent = formatCell(row[c]);
  }
  gridEl.replaceChildren(table);
}
