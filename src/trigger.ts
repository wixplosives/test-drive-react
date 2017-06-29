import triggerChange = require('../lib/react-trigger-change');
import * as testDrive from 'test-drive';
import { isInputElement } from 'test-drive/helpers';

export function change(target: Element | null, newValue: string): void {
    if (target) {
        if (isInputElement(target)) {
            target.focus();
            target.value = newValue;
            triggerChange(target);
        } else {
            throw new Error(`Trying to trigger "change" event on non-input element <${target.tagName}>`);
        }
    } else {
        throw new Error('Trying to trigger "change" on "null" element.');
    }
}

export const trigger = {
    event: testDrive.trigger.event,
    change
};
