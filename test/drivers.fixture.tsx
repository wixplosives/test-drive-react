import {DriverBase} from "../src";
import React = require('react');

export const SAMPLE_INITIAL_LABEL = 'Sample Part';
export const SAMPLE_MUTATED_LABEL = 'Mutated sample part';

export class TestComponent extends React.Component<{ onAction?: () => void }, {}> {
    state = {
        label: SAMPLE_INITIAL_LABEL
    };

    render() {
        return (
            <div onClick={() => this.setState({ label: SAMPLE_MUTATED_LABEL })} {...this.props}>
                <div data-automation-id="SAMPLE_PART">{this.state.label}</div>
            </div>
        )
    }
}

export class TestComponentDriver extends DriverBase {

    static ComponentClass = TestComponent;

    get samplePart(): HTMLDivElement {
        return this.select('SAMPLE_PART') as HTMLDivElement;
    }

    doAction() {
        (this.root as HTMLElement).click();
    }
}

export const TestStatelessComponent: React.SFC = () => (
    <div>
        <div data-automation-id="SAMPLE_PART">{SAMPLE_INITIAL_LABEL}</div>
    </div>
);

export class TestStatelessComponentDriver extends DriverBase {

    static ComponentClass = TestStatelessComponent;

    get samplePart(): HTMLDivElement {
        return this.select('SAMPLE_PART') as HTMLDivElement;
    }
}

export class TestNullComponent extends React.Component< { on?: boolean} > {
    state = {
        on: false
    };

    toggle() {
        this.setState({ on: true });
    }

    render() {
        if(this.state.on) {
            return <div data-automation-id='SAMPLE_PART'>ON</div>;
        } else {
            return null;
        }
    }
}

export class TestNullComponentDriver extends DriverBase {
    static ComponentClass = TestNullComponent;
    public readonly instance: TestNullComponent;

    get samplePart(): HTMLDivElement {
        return this.select('SAMPLE_PART') as HTMLDivElement;
    }

    toggle():void {
        this.instance.toggle();
    }

}

export class TestCompositeComponent extends React.Component {
    render() {
        return (
            <div>
                <TestComponent data-automation-id="TEST_COMPONENT"/>
            </div>
        )
    }
}

export class TestCompositeComponentDriver extends DriverBase {

    static ComponentClass = TestCompositeComponent;

    get testComponent(): TestComponentDriver {
        return new TestComponentDriver(() => this.select('TEST_COMPONENT'));
    }
}
