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

## Install
`npm i @tspro/ts-utils-lib`

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
