import React from 'react';
import ReactDOM from 'react-dom';
import { DriverBase } from '../src';

export const SAMPLE_INITIAL_LABEL = 'Sample Part';
export const SAMPLE_MUTATED_LABEL = 'Mutated sample part';

export class TestComponent extends React.Component<{ onAction?: () => void }> {
    public state = {
        label: SAMPLE_INITIAL_LABEL,
    };

    public render(): JSX.Element {
        return (
            <div onClick={() => this.setState({ label: SAMPLE_MUTATED_LABEL })} {...this.props}>
                <div data-automation-id="SAMPLE_PART">{this.state.label}</div>
            </div>
        );
    }
}

export class TestComponentDriver extends DriverBase<HTMLElement> {
    public static ComponentClass = TestComponent;

    get samplePart(): HTMLDivElement {
        return this.ensuredSelect('SAMPLE_PART') as HTMLDivElement;
    }

    public clickRoot(): void {
        this.ensuredRoot.click();
    }
}

export const TestStatelessComponent: React.FunctionComponent = () => (
    <div>
        <div data-automation-id="SAMPLE_PART">{SAMPLE_INITIAL_LABEL}</div>
    </div>
);

export class TestStatelessComponentDriver extends DriverBase {
    public static ComponentClass = TestStatelessComponent;

    get samplePart(): HTMLDivElement {
        return this.ensuredSelect('SAMPLE_PART') as HTMLDivElement;
    }
}

export class TestNullComponent extends React.Component<{}, { on?: boolean }> {
    public state = {
        on: false,
    };

    public toggle(): void {
        this.setState({ on: true });
    }

    public render(): JSX.Element | null {
        if (this.state.on) {
            return <div data-automation-id="SAMPLE_PART">ON</div>;
        } else {
            return null;
        }
    }
}

export class TestNullComponentDriver extends DriverBase<HTMLDivElement | null> {
    public static ComponentClass = TestNullComponent;

    constructor(public readonly instance: TestNullComponent) {
        // eslint-disable-next-line react/no-find-dom-node
        super(() => ReactDOM.findDOMNode(instance) as HTMLDivElement | null);
    }

    get samplePart(): HTMLDivElement {
        return this.ensuredSelect('SAMPLE_PART') as HTMLDivElement;
    }

    public toggle(): void {
        this.instance.toggle();
    }
}

export class TestCompositeComponent extends React.Component {
    public render(): JSX.Element {
        return (
            <div>
                <TestComponent data-automation-id="TEST_COMPONENT" />
            </div>
        );
    }
}

export class TestCompositeComponentDriver extends DriverBase<HTMLDivElement> {
    public static ComponentClass = TestCompositeComponent;

    public readonly testComponent = new TestComponentDriver(
        () => this.ensuredSelect('TEST_COMPONENT') as HTMLDivElement
    );
}
