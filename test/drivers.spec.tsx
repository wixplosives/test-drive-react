import React = require('react');
import {TestComponent, TestComponentDriver} from "./drivers.fixture";
import {ClientRenderer} from "../src/client-renderer";
import {expect} from "test-drive";

describe('Component test driver', function () {
    const clientRenderer = new ClientRenderer();

    afterEach(function () {
        clientRenderer.cleanup();
    });

    it('is created for component instance', function () {
        const { result: instance } = clientRenderer.render(<TestComponent />);
        const driver = new TestComponentDriver(instance as TestComponent);
        expect(driver.samplePart).to.be.present();
    });

    it('cannot be create for mismatched component (even with similar structure)', function () {
        class AnotherComponent extends TestComponent {};
        const { result: instance } = clientRenderer.render(<AnotherComponent />);
        expect(() => new TestComponentDriver(instance as AnotherComponent))
            .to.throw('The driver/component mismatch. Driver creation failed.');
    });
});
