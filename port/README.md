# MMUD Explorer — cross-platform port (work in progress)

A TypeScript rewrite of MMUD Explorer that runs in any modern browser and,
later, as a desktop app on Windows, macOS, and Linux via [Tauri](https://tauri.app).
The VB6 application in the parent directory is unchanged and remains the
reference implementation.

## Running

Requires Node.js 20+.

```sh
cd port
npm install
npm run dev      # opens a dev server, usually http://localhost:5173
npm run build    # type-checks and builds static files into dist/
```

Click **Open database (.mdb)** and choose a MajorMUD data file (for example
`../data-v1.11p.mdb`). The file is read entirely in the browser with
[mdb-reader](https://github.com/andipaetzold/mdb-reader). Nothing is uploaded,
and no Access/DAO install is needed.

To list a database's tables from the command line:

```sh
node scripts/inspect-mdb.mjs ../data-v1.11p.mdb --columns
```

## Status

- [x] Read `.mdb` game databases on any OS
- [x] Generic table browser with filtering
- [ ] Port game formulas (`modMMudFunc.bas`, `modExpPerHour.bas`, `clsMonsterAttackSim.cls`)
      with tests checked against the VB6 app's outputs
- [ ] Item / monster / spell explorers
- [ ] Character import and calculators
- [ ] Map view
- [ ] Tauri desktop packaging
