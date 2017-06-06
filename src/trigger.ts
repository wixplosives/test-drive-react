import triggerChange = require('react-trigger-change');

export interface GenericInputElement {
    value: string;
}

function getGlobalsOf(element: Element): any {
    if(element.ownerDocument && element.ownerDocument.defaultView) {
        return element.ownerDocument.defaultView;
    } else {
        return window;
    }
}

function isInputElement(element: any): element is GenericInputElement {
    const globalScope = getGlobalsOf(element);
    const HTMLInputElement = globalScope['HTMLInputElement'];
    const HTMLTextAreaElement = globalScope['HTMLTextAreaElement'];
    const HTMLSelectElement = globalScope['HTMLSelectElement'];
    return element instanceof  HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement;
}

export function change(target: Element | null, newValue: string): void {
    target.focus();
    if(isInputElement(target)) {
        target.value = newValue;
    }
    triggerChange(target);
}

export const trigger = {
    change
};
