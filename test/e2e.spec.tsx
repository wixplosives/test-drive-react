import React from 'react';
import { ClientRenderer, expect, Simulate, waitFor } from '../src';

class SampleComp extends React.Component<{}, { clicked: boolean }> {
    public state = {
        clicked: false,
    };

    public render() {
        return (
            <div>
                <div onClick={() => this.setState({ clicked: true })} data-automation-id="sample-btn">
                    Click
                </div>
                <div data-automation-id="message">{this.state.clicked ? 'Clicked!' : 'Not yet clicked...'}</div>
            </div>
        );
    }
}

describe('Test Drive React', () => {
    const renderer = new ClientRenderer();
    afterEach(() => renderer.cleanup());

    it('tests simple web interface', async () => {
        const { ensuredSelect } = renderer.render(<SampleComp />);

        await waitFor(() => expect(ensuredSelect('message')).to.have.text('Not yet clicked...'));

        Simulate.click(ensuredSelect('sample-btn'));

        await waitFor(() => expect(ensuredSelect('message')).to.have.text('Clicked!'));
    });
});
