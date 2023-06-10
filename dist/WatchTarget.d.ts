import { State, type RootMargin } from './types';
export declare class WatchTarget {
    el: HTMLElement;
    rootMarginTop: RootMargin;
    rootMarginBottom: RootMargin;
    onEnterStart: (() => void) | undefined;
    onEnterEnd: (() => void) | undefined;
    onLeaveStart: (() => void) | undefined;
    onLeaveEnd: (() => void) | undefined;
    onScrollPassed: (() => void) | undefined;
    onScrollUnPassed: (() => void) | undefined;
    state: State;
    hasScrollPassed: boolean;
    willRemove: boolean;
    constructor(el: HTMLElement, rootMarginTop?: RootMargin | undefined, rootMarginBottom?: RootMargin | undefined, onEnterStart?: () => void, onEnterEnd?: () => void, onLeaveStart?: () => void, onLeaveEnd?: () => void, onScrollPassed?: () => void, onScrollUnPassed?: () => void);
}
