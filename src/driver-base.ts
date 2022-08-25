import React from 'react';
import { selectDom } from 'test-drive';

export interface IDriverConstructor<D extends DriverBase, P = {}, E extends Element | Text | null = Element> {
    ComponentClass: React.ComponentType<P>;
    new (rootNodeEval: () => E): D;
}

export class DriverBase<E extends Element | Text | null = Element> {
    constructor(private readonly rootNodeEval: () => E) {}

    public get root(): E {
        return this.rootNodeEval();
    }

    public get ensuredRoot(): NonNullable<E> {
        const root = this.rootNodeEval();
        if (root === null) {
            throw new Error(`Cannot find root`);
        }
        return root;
    }

    protected select(...selectors: string[]): Element | null {
        const { root } = this;
        if (!(root instanceof Element)) {
            return null;
        }
        return selectDom(root)(...selectors);
    }

    protected ensuredSelect(...selectors: string[]): Element {
        const element = this.select(...selectors);
        if (element === null) {
            throw new Error(`Cannot find element for selectors: ${selectors.join(' ')}`);
        }
        return element;
    }
}
