export * as Arr from "./arr";
export * as Dom from "./dom";
export * as Enum from "./enum";
export * as Map from "./map";
export * as Math from "./math";
export * as Obj from "./obj";
export * as Str from "./str";

import * as Guard from "../guard";

/**
 * @deprecated Use {@link Guard} instead. Will be removed in v2.0.0.
 * @private
 */
export const Is = Guard;
