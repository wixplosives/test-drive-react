import React from 'react';
import ReactDOM from 'react-dom';
import { ClientRenderer, expect, sinon, waitFor } from '../src';
import {
    SAMPLE_INITIAL_LABEL,
    SAMPLE_MUTATED_LABEL,
    TestComponent,
    TestComponentDriver,
    TestNullComponentDriver,
    TestStatelessComponent,
    TestStatelessComponentDriver,
    TestNullComponent,
    TestCompositeComponent,
    TestCompositeComponentDriver,
} from './drivers.fixture';

describe('Client Renderer', () => {
    const clientRenderer = new ClientRenderer();
    afterEach(() => clientRenderer.cleanup());

    it('creates a container, adds it to the body, and renders into it', () => {
        const { container } = clientRenderer.render(<h2>Also this</h2>);

        expect(container.parentNode).to.equal(document.body);
        expect(container).to.contain.text('Also this');
    });

    it('uses provided container does not automatically add it to the body', () => {
        const userDefinedContainer = document.createElement('div');

        const { container } = clientRenderer.render(<h1>It is working</h1>, userDefinedContainer);

        expect(container).to.equal(userDefinedContainer);
        expect(container).to.contain.text('It is working');
        expect(container.parentElement).to.equal(null);

        ReactDOM.unmountComponentAtNode(container);
    });

    describe('cleanup', () => {
        class TestComp extends React.Component<{ componentWillUnmount(): void }> {
            public componentWillUnmount() {
                this.props.componentWillUnmount();
            }
            public render() {
                return <div />;
            }
        }

        it('should unmount components rendered into auto-created containers', () => {
            const componentWillUnmount = sinon.spy();
            clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />);

            clientRenderer.cleanup();

            expect(componentWillUnmount.getCalls()).to.have.lengthOf(1);
        });

        it('should not try to unmount an already unmounted component', () => {
            const componentWillUnmount = sinon.spy();
            clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />);

            clientRenderer.cleanup();
            clientRenderer.cleanup();
        });

        it('should not unmount components rendered into provided containers', () => {
            const componentWillUnmount = sinon.spy();
            const container = document.createElement('div');
            clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />, container);

            clientRenderer.cleanup();

            expect(componentWillUnmount.getCalls()).to.have.lengthOf(0);
            ReactDOM.unmountComponentAtNode(container);
        });
    });

    describe('withDriver', () => {
        it('for classic component', async () => {
            const { driver } = clientRenderer.render(<TestComponent />).withDriver(TestComponentDriver);
            expect(driver.samplePart).to.have.text(SAMPLE_INITIAL_LABEL);
            driver.clickRoot();
            await waitFor(() => expect(driver.samplePart).to.have.text(SAMPLE_MUTATED_LABEL));
        });

        it('for functional component', () => {
            const { driver } = clientRenderer
                .render(<TestStatelessComponent />)
                .withDriver(TestStatelessComponentDriver);
            expect(driver.samplePart).to.have.text(SAMPLE_INITIAL_LABEL);
        });

        it('for component returning null', async () => {
            let componentInstance: TestNullComponent | null = null;

            clientRenderer.render(<TestNullComponent ref={(instance) => (componentInstance = instance)} />);

            await waitFor(() => expect(componentInstance).to.be.an('object'));

            const driver = new TestNullComponentDriver(componentInstance!);
            expect(driver.root).to.equal(null);

            driver.toggle();

            await waitFor(() => expect(driver.samplePart).to.be.present());
        });

        it('for composite components', async () => {
            const { driver } = clientRenderer
                .render(<TestCompositeComponent />)
                .withDriver(TestCompositeComponentDriver);

            expect(driver.testComponent.samplePart).to.have.text(SAMPLE_INITIAL_LABEL);

            driver.testComponent.clickRoot();

            await waitFor(() => expect(driver.testComponent.samplePart).to.have.text(SAMPLE_MUTATED_LABEL));
        });

        it('but fails when driver and component mismatch', () => {
            class AnotherComponent extends TestComponent {}

            expect(() => clientRenderer.render(<AnotherComponent />).withDriver(TestComponentDriver)).to.throw(
                'The driver/component mismatch. Driver creation failed.'
            );
        });

        it('returns provided container', () => {
            const userDefinedContainer = document.createElement('div');

            const { container } = clientRenderer
                .render(<TestCompositeComponent />, userDefinedContainer)
                .withDriver(TestCompositeComponentDriver);

            expect(container).to.equal(userDefinedContainer);
            ReactDOM.unmountComponentAtNode(userDefinedContainer);
        });
    });
});
