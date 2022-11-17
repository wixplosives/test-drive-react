import React from 'react';
import ReactDOM from 'react-dom/client';
import { selectDom } from 'test-drive';
import { DriverBase, IDriverConstructor } from './driver-base';

export interface IRenderingContext<P = {}> {
    container: HTMLDivElement;
    reactRoot: ReactDOM.Root;
    select(...selectors: string[]): Element | null;
    ensuredSelect(...selectors: string[]): Element;
    withDriver<D extends DriverBase, E extends Element | Text | null>(
        DriverClass: IDriverConstructor<D, P, E>
    ): IRenderingContextWithDriver<D>;
}

export interface IRenderingContextWithDriver<D extends DriverBase> {
    driver: D;
    container: HTMLDivElement;
    reactRoot: ReactDOM.Root;
}

export class ClientRenderer {
    private renderRoots: Array<{
        container: HTMLDivElement;
        reactRoot: ReactDOM.Root;
    }> = [];

    public render<P = {}>(element: React.ReactElement<P>, container?: HTMLDivElement): IRenderingContext<P> {
        let reactRoot: ReactDOM.Root | undefined;
        if (!container) {
            container = document.createElement('div');
            container.setAttribute('style', 'position: fixed; top: 0; left: 0; right: 0;');
            document.body.appendChild(container);

            reactRoot = ReactDOM.createRoot(container);
            this.renderRoots.push({ container, reactRoot });
        }
        reactRoot = reactRoot || ReactDOM.createRoot(container);
        reactRoot.render(element);
        const select = selectDom(container);
        return {
            container,
            reactRoot,
            select,
            ensuredSelect(...selectors) {
                const foundElement = select(...selectors);
                if (!foundElement) {
                    throw new Error(`Cannot find element for selectors: ${selectors.join(' ')}`);
                }
                return foundElement;
            },
            withDriver<D extends DriverBase, E extends Element | Text | null>(
                DriverClass: IDriverConstructor<D, P, E>
            ): IRenderingContextWithDriver<D> {
                if (DriverClass.ComponentClass !== element.type) {
                    throw new Error('The driver/component mismatch. Driver creation failed.');
                }
                const driver = new DriverClass(() => container!.firstElementChild as E);
                return {
                    driver,
                    container: container!,
                    reactRoot: reactRoot!,
                };
            },
        };
    }

    public cleanup(): void {
        for (const { container, reactRoot } of this.renderRoots) {
            reactRoot.unmount();
            document.body.removeChild(container);
        }
        this.renderRoots = [];
    }
}
