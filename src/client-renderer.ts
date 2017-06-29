import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { selectDom, waitForDom } from 'test-drive';

export interface RenderingContext<P> {
    container: HTMLDivElement;
    result: React.Component<P, React.ComponentState> | Element | void;
    select<T extends Element>(...selectors: string[]): T | null;
    waitForDom(assertion: Function, timeout?: number): Promise<void>;
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

        return { container, result, select: selectDom(container), waitForDom: waitForDom.bind(null, container) };
    }

    cleanup() {
        this.containers.map(container => {
            ReactDOM.unmountComponentAtNode(container);
            document.body.removeChild(container);
        });
        this.containers = [];
    }
}
