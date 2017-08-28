import {ReactCompInstance} from "./client-renderer";
import {selectDom} from "test-drive";
import * as ReactDOM from 'react-dom';

export class DriverBase {
    constructor(private ComponentClass: React.ComponentClass, private componentInstance: ReactCompInstance<any>) {
        if(this.componentInstance.constructor !== this.ComponentClass) {
            throw new Error('The driver/component mismatch. Driver creation failed.');
        }
    }

    protected get rootNode(): Element {
        return ReactDOM.findDOMNode(this.componentInstance);
    }

    protected select<T extends Element>(...selectors: string[]): T {
        return selectDom(this.rootNode).apply(null, selectors);
    }
}
