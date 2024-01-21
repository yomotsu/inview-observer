import { WatchTargetParam } from './types';
import { WatchTarget } from './WatchTarget';
export declare const handleViewChange: () => void;
export declare class InViewObserver {
    watchTargets: WatchTarget[];
    constructor();
    add(watchTargetParam: WatchTargetParam): WatchTarget;
    remove(el: HTMLElement): void;
    reset(): void;
    static isInView(el: HTMLElement, rootMarginTop?: number, rootMarginBottom?: number): {
        hasScrollPassed: boolean;
        partIn: boolean;
        wholeIn: boolean;
    };
}
