import {selectDom} from "test-drive";

export type DriverConstructor<D extends DriverBase> = {
    new (rootNode: Element): D;
    ComponentClass: Function;
}

export class DriverBase {
    constructor(public readonly root: Element) {}

    protected select<T extends Element>(...selectors: string[]): T {
        return selectDom(this.root).apply(null, selectors);
    }
}

