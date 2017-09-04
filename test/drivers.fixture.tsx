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
            <div onClick={() => this.setState({ label: SAMPLE_MUTATED_LABEL })}>
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
