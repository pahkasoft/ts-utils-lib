# TS Utils Lib

## About
A small collection of TypeScript functions, containers, modules, etc. used
in my personal projects.

## Links
[Homepage](https://pahkasoft.com/ts-utils-lib) |
[Repository](https://github.com/pahkasoft/ts-utils-lib) |
[Package](https://www.npmjs.com/package/@tspro/ts-utils-lib)

## Quick Start

### Install

`npm install @tspro/ts-utils-lib`

### Import

```ts
// Import required stuff.
import { UniMap, Utils } from "@tspro/ts-utils-lib";
```

### Require

```ts
// Require required stuff.
const { UniMap, Utils } = require("@tspro/ts-utils-lib");
```

### Browser Script

- Available in version `2.1.0`.
- These bundles are transpiled with `ES5` target.
- With non-polyfilled versions you can use option to your own polyfilling choise.

```html
<!-- Unpkg CDM: Load non-polyfilled or polyfilled bundles. -->
<script src="https://unpkg.com/@tspro/ts-utils-lib@3.5.0/dist/index.es5.iife.js"></script>
<script src="https://unpkg.com/@tspro/ts-utils-lib@3.5.0/dist/index.es5.polyfilled.iife.js"></script>

<!-- jsDelivr CDN: Load non-polyfilled or polyfilled bundles. -->
<script src="https://cdn.jsdelivr.net/npm/@tspro/ts-utils-lib@3.5.0/dist/index.es5.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tspro/ts-utils-lib@3.5.0/dist/index.es5.polyfilled.iife.js"></script>

<script>
    const { UniMap, Utils } = window.TsUtilsLib;
</script>
```

## Usage

```ts
const map = new UniMap<string, number>();

console.log(Utils.Str.stringify(map));
```
