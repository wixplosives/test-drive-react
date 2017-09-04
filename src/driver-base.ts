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

export class DriverBase<T extends ReactCompInstance = ReactCompInstance> {
    public readonly instance: T | null = null;
    private readonly rootNodeEval: (() => Element) | null = null;

    constructor(rootNodeEval: () => Element);
    constructor(instance: ReactCompInstance);
    constructor(initialValue: (() => Element) | T ) {
        if(initialValue instanceof Function) {
            this.rootNodeEval = initialValue;
        } else {
            this.instance = initialValue;
        }
    }

    public get root(): Element {
        if(this.instance) {
            return ReactDom.findDOMNode(this.instance);
        } else if(this.rootNodeEval) {
            return this.rootNodeEval();
        } else {
            throw new Error('Neither mounted component instance nor function return root element provided. ');
        }
    }

    protected select<T extends Element>(...selectors: string[]): T {
        return selectDom(this.root).apply(null, selectors);
    }
}

