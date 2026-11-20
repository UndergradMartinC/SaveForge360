# Game module format

A SaveForge360 module edits the data *inside* an Xbox 360 save package. The core handles STFS parsing, file replacement, rehashing, resigning, and export.

## Manifest

Each module contains a `module.json` manifest:

```json
{
  "id": "mcla",
  "name": "Midnight Club: Los Angeles",
  "titleIds": ["545407F8"],
  "saveFiles": ["mc4.sav"],
  "supportedVersions": ["Complete Edition"],
  "entrypoint": "src/index.ts"
}
```

## Required behavior

A module must:

1. Reject unsupported files before reading editable values.
2. Parse without changing the original byte array.
3. Expose only documented, validated edits.
4. Preserve unknown data and file length unless the format explicitly allows a size change.
5. Re-parse its output and confirm it is valid before returning it to the core.

## Module interface

```ts
export interface SaveModule<TModel> {
  inspect(input: Uint8Array): Inspection;
  read(input: Uint8Array): TModel;
  write(input: Uint8Array, update: TModel): Uint8Array;
}
```

The core separately verifies that the returned file is suitable for insertion into the original STFS package.
