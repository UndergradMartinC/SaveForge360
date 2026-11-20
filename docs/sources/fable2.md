# Fable II port source

The Fable II module is based on format behavior documented in the public-domain [unknownv2/save-editor-tools Fable 2 source directory](https://github.com/unknownv2/save-editor-tools/tree/dev/Fable%202). That repository is released under the Unlicense.

The current preview reads the little-endian XML length at the start of `herosave.bin`, preserves its XML nodes, and updates supported hero values. It requires real-save round-trip testing before package replacement and re-signing are enabled.
