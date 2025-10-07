
export function isInteger(n: unknown): n is number {
    return typeof n === "number" && isFinite(n) && n === Math.trunc(n);
}

export function linearToDecibels(linearVolume: number): number {
    if (!isFinite(linearVolume)) {
        throw new Error("linearToDecibel: Invalid linearVolume = " + linearVolume);
    }
    else if (linearVolume <= 0) {
        return -Infinity;
    }
    else {
        return 20 * Math.log10(linearVolume);
    }
}

export function mod(m: number, n: number) {
    return ((m % n) + n) % n;
}

/**
 *  Convert number to roman number.
 *  https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
 */
export function romanize(n: number) {
    if (!isInteger(n) || n < 0) {
        throw new Error("romanize: Invalid n = " + n);
    }

    var digits = String(+n).split("");
    var key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    var roman = "", i = 3;
    while (i--) roman = (key[+digits.pop()! + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

export function toOrdinalNumber(n: number) {
    if (!isInteger(n)) {
        throw new Error("toOrdinalNumber: Invalid n = " + n);
    }

    const nStr = n.toString();
    const lastDigit = Number(nStr.charAt(nStr.length - 1));

    if (n === 1 || n >= 20 && lastDigit === 1) {
        return nStr + "st";
    }
    else if (n === 2 || n >= 20 && lastDigit === 2) {
        return nStr + "nd";
    }
    else if (n === 3 || n >= 20 && lastDigit === 3) {
        return nStr + "rd";
    }
    else {
        return nStr + "th";
    }
}

export function interpolateCoord(startX: number, startY: number, endX: number, endY: number, t: number) {
    return {
        x: startX + (endX - startX) * t,
        y: startY + (endY - startY) * t
    }
}

export function interpolateY(startX: number, startY: number, endX: number, endY: number, x: number) {
    let t = (x - startX) / (endX - startX);
    return startY + (endY - startY) * t;
}

export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

export function calcNormal(x1: number, y1: number, x2: number, y2: number) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    let nx = -dy;
    let ny = dx;

    let len = Math.sqrt(nx * nx + ny * ny);

    if (len > 0) {
        nx /= len;
        ny /= len;
    }
    else {
        nx = 0;
        ny = 1;
    }

    return { nx, ny }
}

export function sum(arr: number[]): number {
    return arr.reduce((prev, cur) => cur + prev, 0);
}

export function cmp(a: number, b: number): -1 | 0 | 1 {
    return a < b ? -1 : a > b ? 1 : 0;
}
