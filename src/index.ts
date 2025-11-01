export * as Assert from "./assert"
export * as Cookies from "./web/cookies";
export * as Device from "./web/device";
export * as Guard from "./guard"
export * as Utils from "./utils";
export * from "./core";

declare const __LIB_INFO__: string;

export function getLibInfo(): string {
    return __LIB_INFO__ ?? "";
}
