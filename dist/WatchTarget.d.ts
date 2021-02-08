import { State } from './types';
export declare class WatchTarget {
    el: HTMLElement;
    offsetTop: number;
    offsetBottom: number;
    onEnterStart: Function;
    onEnterEnd: Function;
    onLeaveStart: Function;
    onLeaveEnd: Function;
    onScrollPassed: Function;
    onScrollUnPassed: Function;
    state: State;
    hasScrollPassed: boolean;
    willRemove: boolean;
    constructor(el: HTMLElement, offsetTop?: number | undefined, offsetBottom?: number | undefined, onEnterStart?: Function, onEnterEnd?: Function, onLeaveStart?: Function, onLeaveEnd?: Function, onScrollPassed?: Function, onScrollUnPassed?: Function);
}
