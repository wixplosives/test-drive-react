import {Simulate, SyntheticEventData} from "react-addons-test-utils";
export * from 'test-drive';
export * from './client-renderer';

export type EventSimulator = (element: Element | null, eventData?: SyntheticEventData) => void;

export interface CustomSimulate {
    blur: EventSimulator;
    change: EventSimulator;
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

// We're changing only the typing of Simulate: allows null, doesn't expect React comp
const ReactSimulate = Simulate as CustomSimulate;

export { ReactSimulate as simulate };
