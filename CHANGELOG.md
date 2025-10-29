# Changelog

## [1.20.0] - 2025-10-29
### Added
- Guard.isNotThrowing(), Assert.isNotThrowing().
- UniMap, BiMap, TriMap, ValueSet.
- UniMap.createDeep() for deep equality single key map.
- ValueSet.createDeep() for deep equality set.
- Utils.Str.stringify() for stringifying any object or type.

### Deprecated
- Map1 (-> UniMap), Map2 (-> BiMap), Map3 (-> TriMap).
- Set1 (-> ValueSet), BaseSet, DeepSet.

## [1.19.1] - 2025-10-27
## Fixed
- Forgot to export `DefaultArray`, `SetBase`, `Set1` and `DeepSet`.

## [1.19.0] - 2025-10-27
### Added
- SignedIndexArray.toArray(), IndexArray.toArray(), IndexArray.length;
- Set1 and DeepSet.
- DefaultArray.
- Stack functions.

## [1.18.0] - 2025-10-24
### Changed
- Deprecated `DivRect` properties `centerX` and `centerY`, replaced with `anchorX` and `anchorY`.
  Added getters and setters for `centerX` and `centerY`.
- isIntegerXxx() compareTo argument from number to unknown.
- Reorganise folder structure.
- Deprecate Utils.Is, added Guard to use instead.

### Added
- Utils.Is.isIntegerBetweenExclusive().
- Assert.int_between_exclusive().
- More Vec operations.

## [1.17.0] - 2025-10-21
### Added
- Vec class.
- DivRect class.
- Map1, Map2 and Map3 into own files.

### Fixed
- Map1, Map2 and Map3.reduce without init value.
- Improved filter functions.


## [1.16.0] - 2025-10-20
### Added
- Add isEmpty() to interface and containers.
- Add more functions and iterators to MultiContainer.

## [1.15.0] - 2025-10-20
### Added
- SignedIndexArray.equals()
- class IndexArray<EL>, same as SignedIndexArray but for non-negative indices.
- Added KVComponent interface for Map1, Map2, Map3, IndexArray and SignedIndexArray.
- Added MultiContainer.

## Deprecate
- SmallIntCache, use SignedIndexArray has same functionality and more.

## [1.14.0] - 2025-10-19
### Added
- Map1, Map2 and Map3.getOrCreate() accepts value and creator.
- SignedIndexArray<ELEM>

## Fixed
- Map1, Map2 and Map3.getOrCreate()

## [1.13.0] - 2025-10-18
### Added
- Added even more functionality to Map1, Map2 and Map3.

## [1.12.0] - 2025-10-15
### Added
- Added more functionality to Map1, Map2 and Map3.

## [1.11.0] - 2025-10-15
### Added
- Forgot to build 1.10.0, now added Map1, Map2 and Map3.

## [1.10.0] - 2025-10-15
### Added
- Map1<KEY1, VALUE>
- Map2<KEY1, KEY2, VALUE>
- Map3<KEY1, KEY2, KEY3, VALUE>

## [1.9.0] - 2025-10-12
### Added
- Utils.Math.avg()
- Utils.Obj.deepEqual()

## [1.8.0] - 2025-10-07
### Added
- Utils.Math.cmp()

## [1.7.0] - 2025-10-03
### Added
- Utils.Obj.hasProperties()

## [1.6.0] - 2025-09-16
### Added
- Utils.Is.isEmptyArray()
- Utils.Is.isNonEmptyArray()
- Utils.Is.isEmptyArrayOrUndefined()
- Utils.Is.isNonEmptyArrayOrUndefined()
- Utils.Is.isEmptyStringOrUndefined()
- Utils.Is.isNonEmptyStringOrUndefined()
- Utils.Is.isFinite()

## [1.5.0] - 2025-09-16
### Added
- Utils.Is.isNullish()
- Utils.Is.isEmptyString()
- Utils.Is.isNonEmptyString()
- Utils.Is.isIntegerOrUndefined()
- Utils.Is.isIntegerBetween()
- Utils.Is.isNaNValue()
- Utils.Is.isInfinity()
- Utils.Is.isPosInfinity()
- Utils.Is.isNegInfinity()

## [1.4.0] - 2025-09-16
### Added
- Utils.Str.charCount(str, ch)

## [1.3.0] - 2025-07-18
### Added
- Utils.Is

## [1.2.0] - 2025-07-17
### Added
- Assert.assertEnum(...)

## [1.1.0] - 2025-07-12
### Added
- Utils.Obj.isObject
### Changed
- Switched bundler from webpack to tsup.
- Switched license from zlib to MIT.

## [1.0.1] - 2025-06-30
### Changed
- Configured babel for ES6.

## [1.0.0] - 2025-06-25
### Added
- First release.
