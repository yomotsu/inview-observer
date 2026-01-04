/*!
 * in-view-observer
 * https://github.com/yomotsu/in-view-observer
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.InViewObserver = {}));
})(this, (function (exports) { 'use strict';

	const State = {
	    WHOLE_IN: 0,
	    PART_IN: 1,
	    OUT: 2,
	};

	const isBrowser = typeof window !== 'undefined';

	function throttle(fn, threshold) {
	    let last, deferTimer;
	    return function () {
	        const now = Date.now();
	        if (last && now < last + threshold) {
	            clearTimeout(deferTimer);
	            deferTimer = window.setTimeout(function () {
	                last = now;
	                fn();
	            }, threshold);
	        }
	        else {
	            last = now;
	            fn();
	        }
	    };
	}

	// let viewWidth = 0;
	let viewHeight = 0;
	function onresize() {
	    // viewWidth = ( window.innerWidth || document.documentElement.clientWidth );
	    viewHeight = (window.innerHeight || document.documentElement.clientHeight);
	}
	if (isBrowser) {
	    onresize();
	    window.addEventListener('resize', throttle(onresize, 250));
	}
	function isElementInViewport(el, rootMarginTop = 0, rootMarginBottom = 0) {
	    const _rootMarginTop = isNumber(rootMarginTop) ? rootMarginTop :
	        /^-?[0-9]+px$/.test(rootMarginTop.trim()) ? parseInt(rootMarginTop, 10) :
	            /^-?[0-9]+%$/.test(rootMarginTop.trim()) ? viewHeight * (parseInt(rootMarginTop, 10) / 100) :
	                0;
	    const _rootMarginBottom = isNumber(rootMarginBottom) ? rootMarginBottom :
	        /^-?[0-9]+px$/.test(rootMarginBottom.trim()) ? parseInt(rootMarginBottom, 10) :
	            /^-?[0-9]+%$/.test(rootMarginBottom.trim()) ? viewHeight * (parseInt(rootMarginBottom, 10) / 100) :
	                0;
	    const rootTop = _rootMarginTop;
	    const rootBottom = viewHeight + _rootMarginBottom;
	    const rect = el.getBoundingClientRect();
	    const rectTop = rect.top;
	    const rectBottom = rect.bottom;
	    const rectHeight = rect.height;
	    const hasScrollPassed = rectTop <= rootBottom;
	    const partIn = ((rootTop < -rectTop && rootTop - rectTop < rectHeight) ||
	        (rectBottom - rectHeight < rootBottom && rootBottom < rectBottom));
	    const wholeIn = (rectTop >= rootTop &&
	        // rect.left >= rootLeft &&
	        // rect.right <= rootWidth &&
	        rectBottom <= rootBottom);
	    return {
	        hasScrollPassed,
	        partIn,
	        wholeIn,
	    };
	}
	function isNumber(value) {
	    return ((typeof value === 'number') && (isFinite(value)));
	}

	class WatchTarget {
	    constructor(el, rootMarginTop = 0, rootMarginBottom = 0, onEnterStart, onEnterEnd, onLeaveStart, onLeaveEnd, onScrollPassed, onScrollUnPassed) {
	        this.hasScrollPassed = false;
	        this.willRemove = false;
	        const inView = isElementInViewport(el, rootMarginTop, rootMarginBottom);
	        this.hasScrollPassed = inView.hasScrollPassed;
	        if (inView.partIn && !!onEnterStart)
	            onEnterStart();
	        if (inView.wholeIn && !!onEnterEnd)
	            onEnterEnd();
	        if (this.hasScrollPassed) {
	            onScrollPassed && onScrollPassed();
	        }
	        else {
	            onScrollUnPassed && onScrollUnPassed();
	        }
	        this.el = el;
	        this.rootMarginTop = rootMarginTop;
	        this.rootMarginBottom = rootMarginBottom;
	        this.onEnterStart = onEnterStart;
	        this.onEnterEnd = onEnterEnd;
	        this.onLeaveStart = onLeaveStart;
	        this.onLeaveEnd = onLeaveEnd;
	        this.onScrollPassed = onScrollPassed;
	        this.onScrollUnPassed = onScrollUnPassed;
	        this.state = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;
	    }
	}

	const onScrollListeners = [];
	const handleViewChange = () => {
	    for (const watchTargets of onScrollListeners) {
	        const willRemoveIndices = [];
	        for (let i = 0, m = watchTargets.length; i < m; i++) {
	            const watchTarget = watchTargets[i];
	            const lastState = watchTarget.state;
	            const inView = isElementInViewport(watchTarget.el, watchTarget.rootMarginTop, watchTarget.rootMarginBottom);
	            const newState = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;
	            const hasScrollPassed = inView.hasScrollPassed;
	            const hasChanged = lastState !== newState;
	            if (watchTarget.willRemove) {
	                willRemoveIndices.push(i);
	            }
	            if (watchTarget.hasScrollPassed !== hasScrollPassed) {
	                watchTarget.hasScrollPassed = hasScrollPassed;
	                if (hasScrollPassed) {
	                    watchTarget.onScrollPassed && watchTarget.onScrollPassed();
	                }
	                else {
	                    watchTarget.onScrollUnPassed && watchTarget.onScrollUnPassed();
	                }
	            }
	            if (hasChanged && newState === State.WHOLE_IN) {
	                watchTarget.state = newState;
	                watchTarget.onEnterEnd && watchTarget.onEnterEnd();
	                continue;
	            }
	            if (hasChanged &&
	                lastState === State.OUT &&
	                newState === State.PART_IN) {
	                watchTarget.state = newState;
	                watchTarget.onEnterStart && watchTarget.onEnterStart();
	                continue;
	            }
	            if (hasChanged &&
	                lastState === State.PART_IN &&
	                newState === State.OUT) {
	                watchTarget.state = newState;
	                watchTarget.onLeaveEnd && watchTarget.onLeaveEnd();
	                continue;
	            }
	            if (hasChanged && !inView.wholeIn) {
	                watchTarget.state = newState;
	                watchTarget.onLeaveStart && watchTarget.onLeaveStart();
	                continue;
	            }
	        }
	        for (let j = willRemoveIndices.length; j--;) {
	            watchTargets.splice(willRemoveIndices[j], 1);
	        }
	    }
	};
	if (isBrowser) {
	    window.addEventListener('scroll', throttle(handleViewChange, 100));
	    window.addEventListener('resize', throttle(handleViewChange, 250));
	}
	class InViewObserver {
	    constructor() {
	        this.watchTargets = [];
	        onScrollListeners.push(this.watchTargets);
	    }
	    add(watchTargetParam) {
	        const watchTarget = new WatchTarget(watchTargetParam.el, watchTargetParam.rootMarginTop, watchTargetParam.rootMarginBottom, watchTargetParam.onEnterStart, watchTargetParam.onEnterEnd, watchTargetParam.onLeaveStart, watchTargetParam.onLeaveEnd, watchTargetParam.onScrollPassed, watchTargetParam.onScrollUnPassed);
	        this.watchTargets.push(watchTarget);
	        return watchTarget;
	    }
	    remove(el) {
	        this.watchTargets.some((obj) => {
	            if (obj.el === el) {
	                obj.willRemove = true;
	                return true;
	            }
	            return false;
	        });
	    }
	    reset() {
	        this.watchTargets.length = 0;
	    }
	    static isInView(el, rootMarginTop = 0, rootMarginBottom = 0) {
	        return isElementInViewport(el, rootMarginTop, rootMarginBottom);
	    }
	}

	exports.default = InViewObserver;
	exports.handleViewChange = handleViewChange;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
