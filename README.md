# TS Utils Lib

## About
A small collection of TypeScript functions, containers, modules, etc. used
in my personal projects.

I do not use much AI in my work but this is exception. Lot of stuff in this
lib is written by AI.

## Links
[Repository](https://github.com/pahkasoft/ts-utils-lib) |
[Package](https://www.npmjs.com/package/@tspro/ts-utils-lib) |
[Homepage](https://pahkasoft.github.io/ts-utils-lib)

Homepage contains TS Docs/API Reference.

## Version 3.x Info
Version `3.0.0` changed `Device`.

Version `3.1.0` added invalid `CallTracker`.
Use version `3.1.1` with correct `CallTracker` instead.

## Install
`npm install @tspro/ts-utils-lib`

## Usage
```js
// Import
import { UniMap } from "@tspro/ts-utils-lib";

// TS example:
const map = new UniMap<string, number>();

// JS example:
const map = new UniMap();
```

## Browser Usage
- Available in version `2.1.0`.
- These bundles are transpiled with `ES5` target.
- With non-polyfilled versions you can use option to your own polyfilling choise.

```html
<!-- Load non-polyfilled or polyfilled bundles on unpkg cdn -->
<script src="https://unpkg.com/@tspro/ts-utils-lib@2.3.0/dist/index.es5.iife.js"></script>
<script src="https://unpkg.com/@tspro/ts-utils-lib@2.3.0/dist/index.es5.polyfilled.iife.js"></script>

<!-- Load non-polyfilled or polyfilled bundles on jsdelivr cdn -->
<script src="https://cdn.jsdelivr.net/npm/@tspro/ts-utils-lib@2.3.0/dist/index.es5.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tspro/ts-utils-lib@2.3.0/dist/index.es5.polyfilled.iife.js"></script>

<!-- JS example: -->
<script>
    const { UniMap, Utils } = window.TsUtilsLib;
    const map = new UniMap();
    console.log(Utils.Str.stringify(map));
</script>
```
