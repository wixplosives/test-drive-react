import ReactDom = require('react-dom');
import React = require('react');
import {selectDom, waitForDom} from './index';

export interface RenderingContext<P> {
    container: HTMLDivElement,
    result: React.Component<P, React.ComponentState> | Element | void,
    select: (...selectors: string[]) => Element,
    waitForDom: (assertion: Function, timeout?: number) => Promise<void>
}

export class ClientRenderer {
    private containers: Element[] = [];

    render<P>(element: React.ReactElement<P>, container?: HTMLDivElement): RenderingContext<P> {
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            this.containers.push(container);
        }
        const result = ReactDom.render(element, container);

        return { container, result, select: selectDom(container), waitForDom: waitForDom.bind(null, container) };
    }

    cleanup() {
        this.containers.map(container => {
            ReactDom.unmountComponentAtNode(container);
            document.body.removeChild(container);
        });
        this.containers = [];
    }
}
