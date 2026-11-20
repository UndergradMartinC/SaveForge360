# Browser module interface

Every editor module uses the same browser contract in `web/module-interface.js`:

1. The server identifies a module from the files in an STFS package and returns only the module's declared inner-save payloads.
2. `SaveForgeModules.saveImport()` validates those payload names against the registered module definition and stores them in browser session storage.
3. A game editor loads only its own payload through `SaveForgeModules.loadImport()` and exports a new inner file.
4. `SaveForgeModules.clearImport()` removes only that temporary browser copy.

The common contract covers package-to-editor interaction, session isolation, and export flow. Individual editors own their game-specific binary or XML parsing and field validation.
