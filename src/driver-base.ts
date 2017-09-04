import {selectDom} from "test-drive";
import React = require('react');
import ReactDom = require('react-dom');
import {ReactCompInstance} from "./client-renderer";

export type DriverConstructor<D extends DriverBase> = {
    new(container: Element): D;
    new(instance: ReactCompInstance): D;
    new(initialValue: Element | ReactCompInstance): D;
    ComponentClass: React.ComponentClass | React.StatelessComponent;
}

export class DriverBase {
    public readonly container: Element | null = null;
    public readonly instance: ReactCompInstance | null = null;

    constructor(container: Element);
    constructor(instance: ReactCompInstance);
    constructor(initialValue: Element | ReactCompInstance) {
        if(initialValue instanceof Element) {
            this.container = initialValue;
        } else {
            this.instance = initialValue;
        }
    }

    public get root(): Element {
        if(this.instance) {
            return ReactDom.findDOMNode(this.instance);
        } else {
            const rootElement = this.container && this.container.firstElementChild;
            if(rootElement) {
                return rootElement;
            } else {
                throw new Error('Neither mounted component instance nor container with children has been provided. ');
            }
        }
    }

    protected select<T extends Element>(...selectors: string[]): T {
        return selectDom(this.root).apply(null, selectors);
    }
}

