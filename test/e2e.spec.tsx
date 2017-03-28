import {ClientRenderer, simulate} from "../src";
import React = require('react');
import {expect} from "test-drive";

class SampleComp extends React.Component<{}, { clicked: boolean }> {
    constructor(props: Object, context: any) {
        super(props, context);
        this.state = {
            clicked: false
        }
    }

    render() {
        return (
            <div>
                <div onClick={() => this.setState({ clicked: true })} data-automation-id="sample-btn">Click</div>
                <div data-automation-id="message">{this.state.clicked ? 'Clicked!' : 'Not yet clicked...'}</div>
            </div>
        )
    }
}

describe('Test Drive React', function () {
    const renderer = new ClientRenderer();

    it('tests simple web interface', function () {
        const {waitForDom, select} = renderer.render(<SampleComp />);
        return waitForDom(() => expect(select('message')).to.have.text('Not yet clicked...'))
            .then(() => {
                simulate.click(select('sample-btn'));
                return waitForDom(() => expect(select('message')).to.have.text('Clicked!'))
            });
    });

    afterEach(function () {
        renderer.cleanup();
    });
});
