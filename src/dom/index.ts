import { Device } from "../modules/device";

export interface CSSProperties {
    // Declare necessary css properties
    //[key: string]: string | number;
    padding?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    paddingTop?: string | number;
    paddingBottom?: string | number;
    left?: string | number;
    right?: string | number;
    top?: string | number;
    bottom?: string | number;
    width?: string | number;
    height?: string | number;
}

function toPx(value: string | number | undefined): number | undefined {
    return value === undefined ? undefined : Device.toPx(value);
}

export function hasClass(el: HTMLElement, className: string) {
    if (className.length === 0) {
        return false;
    }
    else if (el.classList) {
        return el.classList.contains(className);
    }
    else {
        return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    }
}

export function addClass(el: HTMLElement, className: string) {
    if (className.length === 0) {
        return;
    }
    else if (el.classList) {
        el.classList.add(className)
    }
    else if (!hasClass(el, className)) {
        el.className += " " + className;
    }
}

export function removeClass(el: HTMLElement, className: string) {
    if (className.length === 0) {
        return;
    }
    else if (el.classList) {
        el.classList.remove(className)
    }
    else if (hasClass(el, className)) {
        var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        el.className = el.className.replace(reg, " ");
    }
}

export function setOffset(el: HTMLElement, left: number, top: number, unit: string = "px") {
    el.style.left = left + unit;
    el.style.top = top + unit;
}

export function getOffset(el: HTMLElement): { left: number, top: number } {
    let box = el.getBoundingClientRect();
    let docElem = document.documentElement;
    return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft
    }
}

export function getWidth(el: HTMLElement | Window) {
    if (el instanceof Window) {
        return el.innerWidth;
    }
    else {
        let w = parseFloat(getComputedStyle(el, null).width.replace("px", ""));
        return isNaN(w) ? 0 : w;
    }
}

export function setWidth(el: HTMLElement, val: number) {
    el.style.width = val + 'px';
}

export function getHeight(el: HTMLElement | Window) {
    if (el instanceof Window) {
        return el.innerHeight;
    }
    else {
        let h = parseFloat(getComputedStyle(el, null).height.replace("px", ""));
        return isNaN(h) ? 0 : h;
    }
}

export function setHeight(el: HTMLElement, val: number) {
    el.style.height = val + "px";
}

export function appendTo(el: HTMLElement | SVGElement, to: HTMLElement | SVGElement) {
    to.appendChild(el);
}

export function removeFromParent(el: HTMLElement | SVGElement) {
    el.remove();
}

export function setVisibility(el: HTMLElement | SVGElement, visible: boolean) {
    el.style.display = visible ? "block" : "none";
}

export function setRect(el: HTMLElement, left: number, top: number, width: number, height: number, unit: string = "px") {
    el.style.left = left + unit;
    el.style.top = top + unit;
    el.style.width = width + unit;
    el.style.height = height + unit;
}

export function getButton(btn: HTMLElement | string): HTMLButtonElement | undefined {
    let el = typeof btn === "string" ? document.getElementById(btn) : btn;
    return el instanceof HTMLButtonElement ? el : undefined;
}

export function getCanvas(canvas: HTMLElement | string): HTMLCanvasElement | undefined {
    let el = typeof canvas === "string" ? document.getElementById(canvas) : canvas;
    return el instanceof HTMLCanvasElement ? el : undefined;
}

export function getPadding(style?: CSSProperties): { top: number, right: number, bottom: number, left: number } {
    if (!style) {
        return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    let top = toPx(style.paddingTop);
    let right = toPx(style.paddingRight);
    let bottom = toPx(style.paddingBottom);
    let left = toPx(style.paddingLeft);

    let padding = (style.padding ?? "").toString().split(" ").filter(s => s.length > 0);

    switch (padding.length) {
        case 0:
            break;
        case 1:
            top ??= toPx(padding[0]);
            right ??= toPx(padding[0]);
            bottom ??= toPx(padding[0]);
            left ??= toPx(padding[0]);
            break;
        case 2:
            top ??= toPx(padding[0]);
            right ??= toPx(padding[1]);
            bottom ??= toPx(padding[0]);
            left ??= toPx(padding[1]);
            break;
        case 3:
            top ??= toPx(padding[0]);
            right ??= toPx(padding[1]);
            bottom ??= toPx(padding[2]);
            left ??= toPx(padding[1]);
            break;
        case 4:
        default:
            top ??= toPx(padding[0]);
            right ??= toPx(padding[1]);
            bottom ??= toPx(padding[2]);
            left ??= toPx(padding[3]);
            break;
    }

    top ??= 0;
    right ??= 0;
    bottom ??= 0;
    left ??= 0;

    return { top, right, bottom, left };
}

export function getDimension(style?: CSSProperties) {
    let left = toPx(style?.left);
    let right = toPx(style?.right);
    let top = toPx(style?.top);
    let bottom = toPx(style?.bottom);
    let width = toPx(style?.width);
    let height = toPx(style?.height);

    if (width === undefined && left !== undefined && right !== undefined) {
        width = right - left;
    }

    if (height === undefined && top !== undefined && bottom !== undefined) {
        height = bottom - top;
    }

    return { left, top, width, height }
}

export function styleLayoutChanged(style1?: CSSProperties, style2?: CSSProperties) {
    if (!style1 && !style2) {
        return false;
    }
    else if (!style1 || !style2) {
        return true;
    }
    else {
        return style1.left !== style2.left || style1.top !== style2.top ||
            style1.right !== style2.right || style1.bottom !== style2.bottom ||
            style1.width !== style2.width || style1.height !== style2.height;
    }
}

let canvas: HTMLCanvasElement | undefined;

export function getCanvasTextWidth(text: string, font: string) {
    canvas ??= document.createElement("canvas");

    let ctx = canvas.getContext("2d");
    if (!ctx) {
        return 0;
    }

    ctx.font = font;

    return ctx.measureText(text).width;
}
