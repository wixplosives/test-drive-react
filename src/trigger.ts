import triggerChange = require('react-trigger-change');

export interface GenericInputElement {
    value: string;
}

export interface Focusable {
    focus(): void;
}

function getGlobalsOf(element: Element): any {
    if(element.ownerDocument && element.ownerDocument.defaultView) {
        return element.ownerDocument.defaultView;
    } else {
        return window;
    }
}

function isInputElement(element: Element): element is Element & GenericInputElement  {
    const globalScope = getGlobalsOf(element);
    const HTMLInputElement = globalScope['HTMLInputElement'];
    const HTMLTextAreaElement = globalScope['HTMLTextAreaElement'];
    const HTMLSelectElement = globalScope['HTMLSelectElement'];
    return element instanceof  HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement;
}

function isFocusable(element: Element): element is Element & Focusable {
    const globalScope = getGlobalsOf(element);
    const HTMLElement = globalScope['HTMLElement'];
    return element instanceof HTMLElement;
}


export function change(target: Element | null, newValue: string): void {
    if(target) {
        if(isFocusable(target)) {
            target.focus();
        }
        if(isInputElement(target)) {
            target.value = newValue;
        } else {
            throw new Error(`Trying to trigger "change" event on non-input element <${target.tagName}>`);
        }
        triggerChange(target);
    } else {
        throw new Error('Trying to trigger "change" on "null" element.');
    }
}

export const trigger = {
    change
};
