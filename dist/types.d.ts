export declare enum State {
    WHOLE_IN = 0,
    PART_IN = 1,
    OUT = 2
}
export interface WatchTargetParam {
    el: HTMLElement;
    offsetTop?: number;
    offsetBottom?: number;
    onEnterStart?: Function;
    onEnterEnd?: Function;
    onLeaveStart?: Function;
    onLeaveEnd?: Function;
    onScrollPassed?: Function;
    onScrollUnPassed?: Function;
}
