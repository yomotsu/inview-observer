import { WatchTargetParam } from './types';
import { WatchTarget } from './WatchTarget';
export declare class InViewObserver {
    watchTargets: WatchTarget[];
    constructor();
    add(watchTargetParam: WatchTargetParam): WatchTarget;
    remove(el: HTMLElement): void;
    reset(): void;
    static isInView(el: HTMLElement, offsetTop?: number, offsetBottom?: number): {
        partIn: boolean;
        wholeIn: boolean;
    };
}
