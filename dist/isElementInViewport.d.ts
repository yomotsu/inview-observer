import { type RootMargin } from './types';
export declare function isElementInViewport(el: HTMLElement, rootMarginTop?: RootMargin, rootMarginBottom?: RootMargin): {
    hasScrollPassed: boolean;
    partIn: boolean;
    wholeIn: boolean;
};
