export declare const State: {
    readonly WHOLE_IN: 0;
    readonly PART_IN: 1;
    readonly OUT: 2;
};
export type State = typeof State[keyof typeof State];
export type RootMargin = number | `${string}px` | `${string}%`;
export interface WatchTargetParam {
    el: HTMLElement;
    rootMarginTop?: RootMargin;
    rootMarginBottom?: RootMargin;
    onEnterStart?: () => void;
    onEnterEnd?: () => void;
    onLeaveStart?: () => void;
    onLeaveEnd?: () => void;
    onScrollPassed?: () => void;
    onScrollUnPassed?: () => void;
}
