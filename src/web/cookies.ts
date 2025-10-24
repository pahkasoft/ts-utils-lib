export namespace Cookies {

    const ConsentCookieName = "ConsentCookie";

    enum ConsentState {
        Accept = "accept",
        Decline = "decline"
    }

    let _consent: ConsentState | undefined;
    let _expires: Date | undefined;

    let str = _read(ConsentCookieName);
    _consent = (str === ConsentState.Accept || str === ConsentState.Decline) ? str : undefined;

    export function setExpireDays(days: number) {
        _expires = new Date();
        _expires.setDate(_expires.getDate() + days);
    }

    export function isConsentPending() {
        return _consent === undefined;
    }

    export function accept() {
        _consent = ConsentState.Accept;
        _save(ConsentCookieName, _consent);
    }

    export function decline() {
        _consent = ConsentState.Decline;
        _save(ConsentCookieName, _consent);
    }

    function _getList(): string[] {
        let s = document.cookie;
        return s.split(";").map(c => c.trim());
    }

    function _save<T extends string | number | boolean>(name: string, value: T): T {
        let cookie = name + "=" + value.toString() + ";sameSite=Lax;";

        if (_expires) {
            cookie += "expires=" + _expires.toUTCString() + ";";
        }

        document.cookie = cookie;

        return value;
    }

    function _read(name: string, defaultValue?: string): string | undefined {
        let str = _getList().find(c => c.startsWith(name + "="));
        return str === undefined ? defaultValue : str.substring(name.length + 1);
    }

    function _erase(name: string) {
        document.cookie = name + "=;" + "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    export function save<T extends string | number | boolean>(name: string, value: T): T {
        if (_consent === ConsentState.Accept) {
            _save(name, value);
        }

        return value;
    }

    export function read(name: string, defaultValue: string): string {
        if (_consent === ConsentState.Accept) {
            return _read(name, defaultValue) || defaultValue;
        }
        else {
            return defaultValue;
        }
    }

    export function readInt(name: string, defaultValue: number): number {
        if (_consent === ConsentState.Accept) {
            let str = _read(name);
            return str === undefined ? defaultValue : parseInt(str);
        }
        else {
            return defaultValue;
        }
    }

    export function readBool(name: string, defaultValue: boolean): boolean {
        if (_consent === ConsentState.Accept) {
            let str = _read(name);
            return str === undefined ? defaultValue : (/true|1/i).test(str);
        }
        else {
            return defaultValue;
        }
    }

    export function erase(name: string) {
        if (_consent === ConsentState.Accept || name === ConsentCookieName) {
            _erase(name);
        }
    }

    export function eraseAll() {
        document.cookie.split(';').forEach(c => erase(c.trim().split('=')[0]));
    }
}
