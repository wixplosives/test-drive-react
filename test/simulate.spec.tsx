import {expect, simulate, ClientRenderer, waitFor, sinon} from '../src';
import React = require('react');

describe('Simulates', function () {
    const renderer = new ClientRenderer();

    afterEach(function () {
        renderer.cleanup();
    });

    describe('change event', function () {
        it('dispatching change event and setting value', function () {
            const onChange = sinon.spy();
            const {result} = renderer.render(<input onChange={onChange}/>);
            const input = result as HTMLInputElement;
            simulate.change(input, 'new value');
            return waitFor(() => {
                expect(onChange).to.have.been.called;
                const event = onChange.lastCall.args[0];
                expect(input.value).to.equal('new value');
                expect(event.target).to.equal(input);
            });
        });

        it('rejecting event on non-input element', function () {
            const {result} = renderer.render(<div />);
            expect(() => simulate.change(result as Element)).to.throw('Cannot simulate "change" event on "DIV" element.');
        });

    });
});

