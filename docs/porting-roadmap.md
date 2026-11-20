# Porting order

1. **Fable II:** currently untested. Keep its inner-file export disabled from package reinsertion until it has round-trip validation with contributor-owned saves.
2. **Midnight Club: Los Angeles:** active port. Align the current editor with the open-source reference implementation, then validate its existing supported fields against owned saves.

Each further game port must identify its internal save files, preserve unedited data, validate a real or synthetic fixture, and prove a round trip before package export is enabled.
