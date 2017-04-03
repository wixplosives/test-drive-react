import {expect, simulate, ClientRenderer, waitFor, sinon} from '../src';
import React = require('react');

describe('Simulates', function () {
    const renderer = new ClientRenderer();

    afterEach(function () {
        renderer.cleanup();
    });

    it('input change', function () {
        const onChange = sinon.spy();
        const {result} = renderer.render(<input onChange={onChange}/>);
        const input = result as HTMLInputElement;
        simulate.change(input, 'new value');
        return waitFor(() => {
            expect(onChange).to.have.been.called;
            expect(input.value).to.equal('new value');
        });
    });
});
