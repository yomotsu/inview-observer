/*!
 * in-view-observer
 * https://github.com/yomotsu/in-view-observer
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.InViewObserver = factory());
}(this, (function () { 'use strict';

	var State;
	(function (State) {
	    State[State["WHOLE_IN"] = 0] = "WHOLE_IN";
	    State[State["PART_IN"] = 1] = "PART_IN";
	    State[State["OUT"] = 2] = "OUT";
	})(State || (State = {}));

	function throttle(fn, threshold) {
	    var last, deferTimer;
	    return function () {
	        var now = Date.now();
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

	var viewHeight = 0;
	function onresize() {
	    viewHeight = (window.innerHeight || document.documentElement.clientHeight);
	}
	onresize();
	window.addEventListener('resize', throttle(onresize, 250));
	function isElementInViewport(el, offsetTop, offsetBottom) {
	    if (offsetTop === void 0) { offsetTop = 0; }
	    if (offsetBottom === void 0) { offsetBottom = 0; }
	    var rect = el.getBoundingClientRect();
	    var rectTop = rect.top + offsetTop;
	    var rectBottom = rect.bottom + offsetBottom;
	    var rectHeight = rect.height - offsetTop + offsetBottom;
	    var partIn = ((0 < -rectTop && -rectTop < rectHeight) ||
	        (rectBottom - rectHeight < viewHeight && viewHeight < rectBottom));
	    var wholeIn = (rectTop >= 0 &&
	        rectBottom <= viewHeight);
	    return {
	        partIn: partIn,
	        wholeIn: wholeIn
	    };
	}

	var WatchTarget = (function () {
	    function WatchTarget(el, offsetTop, offsetBottom, onEnterStart, onEnterEnd, onLeaveStart, onLeaveEnd) {
	        if (offsetTop === void 0) { offsetTop = 0; }
	        if (offsetBottom === void 0) { offsetBottom = 0; }
	        if (onEnterStart === void 0) { onEnterStart = function () { }; }
	        if (onEnterEnd === void 0) { onEnterEnd = function () { }; }
	        if (onLeaveStart === void 0) { onLeaveStart = function () { }; }
	        if (onLeaveEnd === void 0) { onLeaveEnd = function () { }; }
	        this.willRemove = false;
	        var inView = isElementInViewport(el, offsetTop, offsetBottom);
	        if (inView.partIn && !!onEnterStart)
	            onEnterStart();
	        if (inView.wholeIn && !!onEnterEnd)
	            onEnterEnd();
	        this.el = el;
	        this.offsetTop = offsetTop;
	        this.offsetBottom = offsetBottom;
	        this.onEnterStart = onEnterStart;
	        this.onEnterEnd = onEnterEnd;
	        this.onLeaveStart = onLeaveStart;
	        this.onLeaveEnd = onLeaveEnd;
	        this.state = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;
	    }
	    return WatchTarget;
	}());

	var onScrollListeners = [];
	var onViewChangeHandler = function () {
	    for (var i = 0, l = onScrollListeners.length; i < l; i++) {
	        var watchTargets = onScrollListeners[i];
	        var willRemoveIndices = [];
	        for (var j = 0, m = watchTargets.length; j < m; j++) {
	            var watchTarget = watchTargets[j];
	            var lastState = watchTarget.state;
	            var inView = isElementInViewport(watchTarget.el, watchTarget.offsetTop, watchTarget.offsetBottom);
	            var newState = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;
	            var hasChanged = lastState !== newState;
	            if (watchTarget.willRemove) {
	                willRemoveIndices.push(j);
	            }
	            if (hasChanged && newState === State.WHOLE_IN) {
	                watchTarget.state = newState;
	                watchTarget.onEnterEnd();
	                continue;
	            }
	            if (hasChanged &&
	                lastState === State.OUT &&
	                newState === State.PART_IN) {
	                watchTarget.state = newState;
	                watchTarget.onEnterStart();
	                continue;
	            }
	            if (hasChanged &&
	                lastState === State.PART_IN &&
	                newState === State.OUT) {
	                watchTarget.state = newState;
	                watchTarget.onLeaveEnd();
	                continue;
	            }
	            if (hasChanged && !inView.wholeIn) {
	                watchTarget.state = newState;
	                watchTarget.onLeaveStart();
	                continue;
	            }
	        }
	        for (var j = willRemoveIndices.length; j--;) {
	            watchTargets.splice(willRemoveIndices[j], 1);
	        }
	    }
	};
	window.addEventListener('scroll', throttle(onViewChangeHandler, 100));
	window.addEventListener('resize', throttle(onViewChangeHandler, 250));
	var InViewObserver = (function () {
	    function InViewObserver() {
	        this.watchTargets = [];
	        onScrollListeners.push(this.watchTargets);
	    }
	    InViewObserver.prototype.add = function (watchTargetParam) {
	        var watchTarget = new WatchTarget(watchTargetParam.el, watchTargetParam.offsetTop, watchTargetParam.offsetBottom, watchTargetParam.onEnterStart, watchTargetParam.onEnterEnd, watchTargetParam.onLeaveStart, watchTargetParam.onLeaveEnd);
	        this.watchTargets.push(watchTarget);
	        return watchTarget;
	    };
	    InViewObserver.prototype.remove = function (el) {
	        this.watchTargets.some(function (obj) {
	            if (obj.el === el) {
	                obj.willRemove = true;
	                return true;
	            }
	            return false;
	        });
	    };
	    InViewObserver.prototype.reset = function () {
	        this.watchTargets.length = 0;
	    };
	    InViewObserver.isInView = function (el, offsetTop, offsetBottom) {
	        if (offsetTop === void 0) { offsetTop = 0; }
	        if (offsetBottom === void 0) { offsetBottom = 0; }
	        return isElementInViewport(el, offsetTop, offsetBottom);
	    };
	    return InViewObserver;
	}());

	return InViewObserver;

})));
