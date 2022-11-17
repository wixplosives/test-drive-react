import React from 'react';
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

    it('creates a container, adds it to the body, and renders into it', async () => {
        const { container } = clientRenderer.render(<h2>Also this</h2>);

        expect(container.parentNode).to.equal(document.body);
        await waitFor(() => expect(container).to.contain.text('Also this'));
    });

    it('uses provided container does not automatically add it to the body', async () => {
        const userDefinedContainer = document.createElement('div');

        const { container, reactRoot } = clientRenderer.render(<h1>It is working</h1>, userDefinedContainer);

        expect(container).to.equal(userDefinedContainer);
        expect(container.parentElement).to.equal(null);
        await waitFor(() => expect(container).to.contain.text('It is working'));

        reactRoot.unmount();
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

        it('should unmount components rendered into auto-created containers', async () => {
            const componentWillUnmount = sinon.spy();
            const { container } = clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />);

            await waitFor(() => expect(container).to.contain.html('div'));

            clientRenderer.cleanup();

            expect(componentWillUnmount.getCalls()).to.have.lengthOf(1);
        });

        it('should not try to unmount an already unmounted component', async () => {
            const componentWillUnmount = sinon.spy();
            const { container } = clientRenderer.render(<TestComp componentWillUnmount={componentWillUnmount} />);
            await waitFor(() => expect(container).to.contain.html('div'));

            clientRenderer.cleanup();
            clientRenderer.cleanup();
            expect(componentWillUnmount.getCalls()).to.have.lengthOf(1);
        });

        it('should not unmount components rendered into provided containers', async () => {
            const componentWillUnmount = sinon.spy();
            const { container, reactRoot } = clientRenderer.render(
                <TestComp componentWillUnmount={componentWillUnmount} />,
                document.createElement('div')
            );
            await waitFor(() => expect(container).to.contain.html('div'));

            clientRenderer.cleanup();

            expect(componentWillUnmount.getCalls()).to.have.lengthOf(0);
            reactRoot.unmount();
        });
    });

    describe('withDriver', () => {
        it('for classic component', async () => {
            const { driver } = clientRenderer.render(<TestComponent />).withDriver(TestComponentDriver);
            await waitFor(() => expect(driver.samplePart).to.have.text(SAMPLE_INITIAL_LABEL));

            driver.clickRoot();
            await waitFor(() => expect(driver.samplePart).to.have.text(SAMPLE_MUTATED_LABEL));
        });

        it('for functional component', async () => {
            const { driver } = clientRenderer
                .render(<TestStatelessComponent />)
                .withDriver(TestStatelessComponentDriver);
            await waitFor(() => expect(driver.samplePart).to.have.text(SAMPLE_INITIAL_LABEL));
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

            await waitFor(() => expect(driver.testComponent.samplePart).to.have.text(SAMPLE_INITIAL_LABEL));

            driver.testComponent.clickRoot();

            await waitFor(() => expect(driver.testComponent.samplePart).to.have.text(SAMPLE_MUTATED_LABEL));
        });

        it('but fails when driver and component mismatch', () => {
            class AnotherComponent extends TestComponent {}

            expect(() => clientRenderer.render(<AnotherComponent />).withDriver(TestComponentDriver)).to.throw(
                'The driver/component mismatch. Driver creation failed.'
            );
        });

        it('returns provided container', async () => {
            const userDefinedContainer = document.createElement('div');

            const { container, reactRoot, driver } = clientRenderer
                .render(<TestCompositeComponent />, userDefinedContainer)
                .withDriver(TestCompositeComponentDriver);

            await waitFor(() => expect(driver.testComponent.samplePart).to.have.text(SAMPLE_INITIAL_LABEL));

            expect(container).to.equal(userDefinedContainer);
            reactRoot.unmount();
        });
    });
});
