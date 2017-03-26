import React = require('react');
import ReactDom = require('react-dom');
import { ClientRenderer, expect, sinon } from '../src';

describe('Client renderer', function () {
    let clientRenderer: ClientRenderer;

    beforeEach(function () {
        clientRenderer = new ClientRenderer();
    });

    afterEach(function () {
        clientRenderer.cleanup();
    });

    describe('when provided with a container', function () {
        it('should render the provided vdom into it', function () {
            const container = document.createElement('div');

            clientRenderer.render(<h1>It is working</h1>, container);

            expect(container).to.contain.text('It is working');

            ReactDom.unmountComponentAtNode(container);
        });

        it('should not append it to body automatically', function () {
            const container = document.createElement('div');
            clientRenderer.render(<h1>It is working</h1>, container);

            expect(container.parentElement).to.equal(null);

            ReactDom.unmountComponentAtNode(container);
        });

        it('should return the container', function () {
            const userDefinedContainer = document.createElement('div');
            const {container} = clientRenderer.render(<h1>It is working</h1>, userDefinedContainer);

            expect(container).to.equal(userDefinedContainer);
            ReactDom.unmountComponentAtNode(userDefinedContainer);
        });
    });

    describe('when not provided with a container', function () {

        it('should return one already add it to body', function () {
            const {container} = clientRenderer.render(<h2>Also this</h2>);

            expect(container.parentNode).to.equal(document.body);
            expect(container).to.contain.text('Also this');
        });

    });

    describe('cleanup', function () {
        class TestComp extends React.Component<any, any> {
            componentWillUnmount() {
                this.props.componentWillUnmount();
            }
            render() {
                return <div />;
            }
        }

        it('should unmount components rendered into auto-created containers', function () {
            const componentWillUnmount = sinon.spy();
            clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />);

            clientRenderer.cleanup();

            expect(componentWillUnmount).to.have.been.calledOnce;
        });

        it('should not try to unmount an already unmounted component', function () {
            const componentWillUnmount = sinon.spy();
            clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />);

            clientRenderer.cleanup();
            clientRenderer.cleanup();
        });

        it('should not unmount components rendered into provided containers', function () {
            const componentWillUnmount = sinon.spy();
            const container = document.createElement('div');
            clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />, container);

            clientRenderer.cleanup();

            expect(componentWillUnmount).to.not.have.been.called;
            ReactDom.unmountComponentAtNode(container);
        });
    });
});
