import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { selectDom, waitForDom as _waitForDom } from 'test-drive';
import {assertDriverMatch, DriverBase} from "./driver-base";
import {isElement} from "test-drive/dist/src/helpers";

export type ReactCompInstance<P> = React.Component<P, React.ComponentState>;

export interface RenderingContext<P> {
    container: HTMLDivElement;
    result: ReactCompInstance<P> | Element | void;
    select<T extends Element>(...selectors: string[]): T | null;
    waitForDom(assertion: Function, timeout?: number): Promise<void>;
    withDriver<D extends DriverBase>(DriverClass: DriverConstructor<D>): RenderingContextWithDriver<D>;
}

export interface RenderingContextWithDriver<D extends DriverBase> {
    waitForDom(assertion: Function, timeout?: number): Promise<void>;
    driver: D;
}


export type DriverConstructor<D extends DriverBase> = {
    new (rootNode: Element): D;
    ComponentClass: Function;
}

function getRootElement(value: ReactCompInstance<any> | Element | void): Element | null {
    if(value) {
        if(isElement(value)) {
            return value;
        } else {
            return ReactDOM.findDOMNode(value);
        }
    } else {
        return null;
    }

}

export class ClientRenderer {
    private containers: Element[] = [];

    render<P>(element: React.ReactElement<P>, container?: HTMLDivElement): RenderingContext<P> {
        if (!container) {
            container = document.createElement('div');
            container.setAttribute('style', 'position: fixed; top: 0; left: 0; right: 0;');
            document.body.appendChild(container);

            this.containers.push(container);
        }
        const result = ReactDOM.render(element, container);
        const waitForDom = _waitForDom.bind(null, container);
        const rootNode = getRootElement(result);
        return {
            container,
            result,
            select: selectDom(container),
            waitForDom,
            withDriver<D extends DriverBase>(DriverClass: DriverConstructor<D>): RenderingContextWithDriver<D> {
                if(rootNode) {
                    assertDriverMatch(DriverClass, result as ReactCompInstance<any>);
                    return {
                        waitForDom,
                        driver: new DriverClass(rootNode)
                    }
                } else {
                    throw new Error('Cannot create driver: Render didn\'t create any DOM element.');
                }
            }
        };
    }

    cleanup() {
        this.containers.map(container => {
            ReactDOM.unmountComponentAtNode(container);
            document.body.removeChild(container);
        });
        this.containers = [];
    }
}
