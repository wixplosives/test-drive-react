import {selectDom} from "test-drive";
import {DriverConstructor, ReactCompInstance} from "./client-renderer";

export class DriverBase {
    constructor(public readonly root: Element) {}

    protected select<T extends Element>(...selectors: string[]): T {
        return selectDom(this.root).apply(null, selectors);
    }
}

export function assertDriverMatch(DriverClass: DriverConstructor<DriverBase>, componentInstance: ReactCompInstance<any>): void {
    if(DriverClass.ComponentClass !== componentInstance.constructor) {
        throw new Error('The driver/component mismatch. Driver creation failed.');
    }
}

