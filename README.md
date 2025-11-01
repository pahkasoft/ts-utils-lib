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

## Install
`npm i @tspro/ts-utils-lib`

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
Available in version `2.1.0`.

```html
<!--
    Load this lighter TsUtilsLib version.
    You must load polyfills of your choise first (optional).
-->
<script src="https://unpkg.com/@tspro/ts-utils-lib@2.1.0/dist/index.es5.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tspro/ts-utils-lib@2.1.0/dist/index.es5.iife.js"></script>

<!--
    Alternatively you can load this TsUtilsLib version that is bundled with polyfills.
-->
<script src="https://unpkg.com/@tspro/ts-utils-lib@2.1.0/dist/index.es5.polyfilled.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tspro/ts-utils-lib@2.1.0/dist/index.es5.polyfilled.iife.js"></script>

<!-- Another JS example: -->
<script>
    const { UniMap, Utils } = window.TsUtilsLib;
    const map = new UniMap();
    console.log(Utils.Str.stringify(map));
</script>
```

## Version 2 Update

Made major update because
- Wanted to remove deprecated renamed or obsoloted stuff.
- Wanted to upgrade Assert and Guard namespaces.
- Version 1 had already grown a bit.

Deprecations and replacements
- `Vec2` -> `Vec`
- `Map1` -> `UniMap`
- `Map2` -> `BiMap`
- `Map3` -> `TriMap`
- `Set1` -> `ValueSet`
- `DeepSet` -> `ValueSet.createDeep()`
- `DivRect` -> `AnchoredRect`
- `Utils.Is.isX...` -> `Guard.isX...`

Additions
- `Rect`
- `Guard.is*`  - intriduced more guards.
- `Assert.is*` - introduced more assertions.
- `Utils.Str.stringify(val)` - generic format-anything.

There are some other changes (e.g. `Guard.isOddNumber()` -> `Guard.isOdd()`
and so on), but most the stuff is compatible with 1.x.
