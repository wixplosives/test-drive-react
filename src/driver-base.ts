import {selectDom} from "test-drive";
import React = require('react');
import ReactDom = require('react-dom');
import {ReactCompInstance} from "./client-renderer";

export type DriverConstructor<D extends DriverBase> = {
    new(rootNodeEval: () => Element): D;
    new(instance: ReactCompInstance): D;
    new(initialValue: (() => Element) | ReactCompInstance): D;
    ComponentClass: React.ComponentClass | React.StatelessComponent;
}

export class DriverBase {
    public readonly instance: ReactCompInstance | null = null;
    private readonly rootNodeEval: () => Element;

    constructor(rootNodeEval: () => Element);
    constructor(instance: ReactCompInstance);
    constructor(initialValue: (() => Element) | ReactCompInstance ) {
        if(initialValue instanceof Function) {
            this.rootNodeEval = initialValue;
        } else {
            this.instance = initialValue;
        }
    }

    public get root(): Element {
        if(this.instance) {
            return ReactDom.findDOMNode(this.instance);
        } else {
            const rootElement = this.rootNodeEval();
            if(rootElement) {
                return rootElement;
            } else {
                throw new Error('Neither mounted component instance nor function return root element provided. ');
            }
        }
    }

    protected select<T extends Element>(...selectors: string[]): T {
        return selectDom(this.root).apply(null, selectors);
    }
}

