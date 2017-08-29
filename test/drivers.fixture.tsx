import {DriverBase} from "../src/driver-base";
import React = require('react');

export class TestComponent extends React.Component<{ onAction?: () => void }, {}> {
    render() {
        return (
            <div onClick={() => this.props.onAction!()}>
                <div data-automation-id="SAMPLE_PART">Sample Part</div>
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
        (this.rootNode as HTMLElement).click();
    }
}
