# Midnight Club: Los Angeles port source

The MCLA port uses the public-domain [unknownv2/save-editor-tools MCLA source directory](https://github.com/unknownv2/save-editor-tools/tree/dev/Midnight%20Club%20LA) as a format reference. That code confirms the `mc4.sav` container starts with a game version and a big-endian entry count, then uses named entries including `Career`.

The reference implementation only loads `mc4.sav`, locates `Career`, checks career format version `0x0B`, and reads the money field; it does not expose a completed editor UI or a write implementation. SaveForge360 retains its existing verified fields and will validate them against owned MCLA saves before package reinsertion is added.
