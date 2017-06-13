import {ClientRenderer, sinon, waitFor, expect, trigger} from "../src";
import React = require('react');
import * as testDrive from 'test-drive';

function createSpy(): sinon.SinonSpy {
    return sinon.spy((event: { persist: ( )=> void }) => event.persist());
}

describe('trigger', function () {
    const renderer = new ClientRenderer();

    afterEach(function () {
        renderer.cleanup();
    });

    describe('.event', function () {
        it('is inherited from test-drive', function() {
            expect(trigger.event).to.equal(testDrive.trigger.event);
        });
    });

    describe('.change()', function () {
        ['input', 'textarea'].forEach(tagName => {
            it(`triggers "change" event for <${tagName}>`, function () {
                const onChange = createSpy();
                const onInput = createSpy();
                const onFocus = createSpy();
                const {select} = renderer.render(
                    React.createElement(tagName,
                    {
                        onChange,
                        onFocus,
                        onInput,
                        "data-automation-id": "TEST_INPUT"
                    }));

                const testInput = select('TEST_INPUT');
                trigger.change(testInput, 'Mr Monkey');
                return waitFor(() => {
                    expect(onChange).to.have.been.calledWithMatch({
                        type: 'change',
                        target: testInput
                    });
                    expect(onInput).to.have.been.calledWithMatch({
                        type: 'input',
                        target: testInput
                    });
                    expect(onFocus).to.have.been.calledWithMatch({
                        type: 'focus',
                        target: testInput
                    });
                    expect(testInput).to.have.property('value', 'Mr Monkey');
                });
            });
        });

        it('triggers "change" event for <select>', function () {
            const onChange = createSpy();
            const onFocus = createSpy();
            const {select} = renderer.render(
                <select
                    onChange={onChange}
                    onFocus={onFocus}
                    data-automation-id="TEST_INPUT"
                >
                    <option value="funky"/>
                    <option value="monkey"/>
                </select>
            );

            const testInput = select('TEST_INPUT');
            trigger.change(testInput, 'monkey');
            return waitFor(() => {
                expect(onChange).to.have.been.calledWithMatch({
                    type: 'change',
                    target: testInput
                });
                expect(onFocus).to.have.been.calledWithMatch({
                    type: 'focus',
                    target: testInput
                });
                expect(testInput).to.have.property('value', 'monkey');
            });
        });

        it('fails to trigger "change" event for <div>, etc.', function () {
            const onChange = sinon.spy();
            const onInput = sinon.spy();
            const onFocus = sinon.spy();
            const {select} = renderer.render(
                React.createElement('div',
                    {
                        onChange,
                        onFocus,
                        onInput,
                        "data-automation-id": "TEST_INPUT"
                    }));

            const testNonInput = select('TEST_INPUT');
            expect(() => trigger.change(testNonInput, 'Mr Monkey')).to.throw('Trying to trigger "change" event on non-input element <DIV>');
            return new Promise(resolve => setTimeout(resolve, 10))
                .then(() => {
                    expect(onChange).to.not.been.called;
                    expect(onFocus).to.not.been.called;
                    expect(onInput).to.not.been.called;
                    expect(testNonInput).not.to.have.property('value');
                });
        });

        it('fails gracefully for null element (interoperability with select())', function () {
            expect(() => trigger.change(null, 'Mr Monkey')).to.throw('Trying to trigger "change" on "null" element.')
        });

    });
});
