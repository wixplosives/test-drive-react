import triggerChange = require('react-trigger-change');

export interface GenericInputElement {
    focus(): void;
    value: string;
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


export function change(target: Element | null, newValue: string): void {
    if(target) {
        if(isInputElement(target)) {
            target.focus();
            target.value = newValue;
            triggerChange(target);
        } else {
            throw new Error(`Trying to trigger "change" event on non-input element <${target.tagName}>`);
        }
    } else {
        throw new Error('Trying to trigger "change" on "null" element.');
    }
}

export const trigger = {
    change
};
