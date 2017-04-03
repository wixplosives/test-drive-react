import {Simulate, SyntheticEventData} from "react-addons-test-utils";
export type EventSimulator = (element: Element | null, eventData?: SyntheticEventData) => void;

// We're changing only the typing of Simulate: allows null, doesn't expect React comp
export interface CustomSimulate {
    blur: EventSimulator;
    change: (element: HTMLInputElement | null, newValue?: string) => void;
    click: EventSimulator;
    copy: EventSimulator;
    cut: EventSimulator;
    doubleClick: EventSimulator;
    drag: EventSimulator;
    dragEnd: EventSimulator;
    dragEnter: EventSimulator;
    dragExit: EventSimulator;
    dragLeave: EventSimulator;
    dragOver: EventSimulator;
    dragStart: EventSimulator;
    drop: EventSimulator;
    focus: EventSimulator;
    input: EventSimulator;
    keyDown: EventSimulator;
    keyPress: EventSimulator;
    keyUp: EventSimulator;
    mouseDown: EventSimulator;
    mouseEnter: EventSimulator;
    mouseLeave: EventSimulator;
    mouseMove: EventSimulator;
    mouseOut: EventSimulator;
    mouseOver: EventSimulator;
    mouseUp: EventSimulator;
    paste: EventSimulator;
    scroll: EventSimulator;
    submit: EventSimulator;
    touchCancel: EventSimulator;
    touchEnd: EventSimulator;
    touchMove: EventSimulator;
    touchStart: EventSimulator;
    wheel: EventSimulator;
}

function change(element: HTMLInputElement | null, newValue?: string) {
    if(element) {
        if(typeof newValue !== 'undefined') {
            element.value = newValue;
        }
        Simulate.change(element);
    }
}

const ModifiedSimulate = {...Simulate, change} as CustomSimulate;

export { ModifiedSimulate as simulate };
