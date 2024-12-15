import React from 'react';
import ReactDOM from 'react-dom';
import { selectDom } from 'test-drive';
import { DriverBase, type IDriverConstructor } from './driver-base.js';

export interface IRenderingContext<P = {}> {
    container: HTMLDivElement;
    select(...selectors: string[]): Element | null;
    ensuredSelect(...selectors: string[]): Element;
    withDriver<D extends DriverBase, E extends Element | Text | null>(
        DriverClass: IDriverConstructor<D, P, E>,
    ): IRenderingContextWithDriver<D>;
}

export interface IRenderingContextWithDriver<D extends DriverBase> {
    driver: D;
    container: HTMLDivElement;
}

export class ClientRenderer {
    private containers: Element[] = [];

    public render<P = {}>(element: React.ReactElement<P>, container?: HTMLDivElement): IRenderingContext<P> {
        if (!container) {
            container = document.createElement('div');
            container.setAttribute('style', 'position: fixed; top: 0; left: 0; right: 0;');
            document.body.appendChild(container);

            this.containers.push(container);
        }
        ReactDOM.render(element, container);
        const select = selectDom(container);
        return {
            container,
            select,
            ensuredSelect(...selectors) {
                const foundElement = select(...selectors);
                if (!foundElement) {
                    throw new Error(`Cannot find element for selectors: ${selectors.join(' ')}`);
                }
                return foundElement;
            },
            withDriver<D extends DriverBase, E extends Element | Text | null>(
                DriverClass: IDriverConstructor<D, P, E>,
            ): IRenderingContextWithDriver<D> {
                if (DriverClass.ComponentClass !== element.type) {
                    throw new Error('The driver/component mismatch. Driver creation failed.');
                }
                const driver = new DriverClass(() => container.firstElementChild as E);
                return {
                    driver,
                    container: container,
                };
            },
        };
    }

    public cleanup(): void {
        for (const container of this.containers) {
            ReactDOM.unmountComponentAtNode(container);
            document.body.removeChild(container);
        }
        this.containers = [];
    }
}
