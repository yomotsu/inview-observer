import { State } from './types';
export declare class WatchTarget {
    el: HTMLElement;
    offsetTop: number;
    offsetBottom: number;
    onEnterStart: Function;
    onEnterEnd: Function;
    onLeaveStart: Function;
    onLeaveEnd: Function;
    state: State;
    willRemove: boolean;
    constructor(el: HTMLElement, offsetTop?: number | undefined, offsetBottom?: number | undefined, onEnterStart?: Function | undefined, onEnterEnd?: Function | undefined, onLeaveStart?: Function | undefined, onLeaveEnd?: Function | undefined);
}
