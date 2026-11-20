# SaveForge360

An open-source, local-first editor for Xbox 360 save packages.

SaveForge360 provides a local workflow for Xbox 360 save packages:

1. Import a local `CON `, `LIVE`, or `PIRS` package.
2. Identify the title and the files inside its STFS container.
3. Use a game-specific editor to change supported save data.
4. Validate the edited data.
5. Rebuild the package, rehash it, resign it, and export a new file.

It deliberately does **not** connect to consoles, manage FTP transfers, download saves, or ship game content.

## Status

The local preview can inspect an STFS package and detect Midnight Club: Los Angeles or Fable II. It can extract supported inner saves in memory and export an edited inner file. Package replacement, rehashing, and resigning are the next core milestones.

## Run locally

Prerequisite: Node.js 20 or later.

```sh
npm install
npm start
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173). On macOS, after `npm install`, double-click `Open SaveForge360.command` to start the server and open the app.

## Design

```text
Xbox 360 package
  -> STFS reader
  -> title and save-file detection
  -> game module
  -> validation
  -> STFS replacement + rehash/resign
  -> exported package
```

Modules are keyed by Xbox 360 Title ID and only receive extracted inner save files. They never implement package signing or write to a console.

## Safety model

- Imports are read-only until the user exports a replacement package.
- Every export writes to a new path; the original package is never overwritten.
- Modules validate title ID, expected files, file size, and format version before permitting edits.
- Tests use synthetic fixtures or contributor-owned saves only. Do not commit personal saves, profiles, keys, or game files.

## Roadmap

- [x] Parse and inspect STFS package metadata and file tables.
- [ ] Extract and replace a selected internal save file.
- [ ] Rebuild hash tables and rehash/resign `CON ` packages.
- [x] Add the MCLA `mc4.sav` editor module (wallet, progression, garage, upgrades, and statistics).
- [x] Begin the Fable II port (hero-save XML parser and editor preview).
- [ ] Add module manifests, fixtures, and a contributor test harness.
- [x] Build the initial local UI for import and inner-save export.

## Contributing game modules

See [the module format](docs/module-format.md). A module must document the game version it supports, validate every input it accepts, and include before/after fixtures or a synthetic generator.

## License

MIT. Game files, proprietary assets, personal saves, account data, and console keys are not accepted in this repository.
