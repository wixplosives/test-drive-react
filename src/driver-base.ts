import {selectDom} from "test-drive";
import React = require('react');

export type DriverConstructor<D extends DriverBase, P = {}> = {
    new(rootNodeEval: () => Element): D;
    ComponentClass: React.ComponentType<P>;
}

export class DriverBase {
    constructor(private readonly rootNodeEval: () => Element) {}

    public get root(): Element {
        return this.rootNodeEval();
    }

    protected select<T extends Element>(...selectors: string[]): T {
        const rootElement: Element = this.root;
        return rootElement ? selectDom(this.root).apply(null, selectors) : null;
    }
}

