import React from 'react';
import { selectDom } from 'test-drive';

export interface IDriverConstructor<D extends DriverBase, P = {}, E extends Element | Text | null = Element> {
    ComponentClass: React.ComponentType<P>;
    new (rootNodeEval: () => E): D;
}

export class DriverBase<E extends Element | Text | null = Element> {
    constructor(private readonly rootNodeEval: () => E) {}

    public get root() {
        return this.rootNodeEval();
    }

    public get ensuredRoot() {
        const root = this.rootNodeEval();
        if (root === null) {
            throw new Error(`Cannot find root`);
        }
        return root;
    }

    protected select(...selectors: string[]) {
        const { ensuredRoot } = this;
        if (!(ensuredRoot instanceof Element)) {
            throw new Error(`root is not an Element.`);
        }
        return selectDom(ensuredRoot)(...selectors);
    }

    protected ensuredSelect(...selectors: string[]) {
        const element = this.select(...selectors);
        if (element === null) {
            throw new Error(`Cannot find element for selectors: ${selectors.join(' ')}`);
        }
        return element;
    }
}
