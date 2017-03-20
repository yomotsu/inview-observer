/*!
 * InViewObserver
 * https://github.com/yomotsu/InViewObserver
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
function throttle(fn, threshhold) {

	var last = void 0,
	    deferTimer = void 0;

	return function () {

		var now = Date.now();

		if (last && now < last + threshhold) {

			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {

				last = now;
				fn();
			}, threshhold);
		} else {

			last = now;
			fn();
		}
	};
}

var viewWidth = 0;
var viewHeight = 0;

function onresize() {

	viewWidth = window.innerWidth || document.documentElement.clientWidth;
	viewHeight = window.innerHeight || document.documentElement.clientHeight;
}

onresize();
window.addEventListener('resize', throttle(onresize, 250));

function isElementInViewport(el) {

	var rect = el.getBoundingClientRect();

	var partIn = 0 < -rect.top && -rect.top < rect.height || rect.bottom - rect.height < viewHeight && viewHeight < rect.bottom;

	var wholeIn = rect.top >= 0 &&
	// rect.left >= 0 &&
	// rect.right <= viewWidth &&
	rect.bottom <= viewHeight;

	return {
		partIn: partIn,
		wholeIn: wholeIn
	};
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var onScrollListeners = [];
var onViewChangeHandler = function onViewChangeHandler() {

	for (var i = 0, l = onScrollListeners.length; i < l; i++) {

		var watchTargets = onScrollListeners[i];
		var willRemoveIndices = [];

		for (var j = 0, m = watchTargets.length; j < m; j++) {

			var watchTarget = watchTargets[j];
			var prevState = watchTarget.state;
			var inView = isElementInViewport(watchTarget.el);
			var newState = inView.wholeIn ? 'WHOLE_IN' : inView.partIn ? 'PART_IN' : 'OUT';
			var hasChanged = prevState !== newState;

			if (hasChanged && newState === 'WHOLE_IN') {

				watchTarget.state = newState;
				watchTarget.onEnterEnd();

				if (watchTarget.once) {

					willRemoveIndices.push(j);
				}

				continue;
			}

			if (hasChanged && prevState === 'OUT' && newState === 'PART_IN') {

				watchTarget.state = newState;
				watchTarget.onEnterStart();
				continue;
			}

			if (hasChanged && prevState === 'PART_IN' && newState === 'OUT') {

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

		for (var _i = willRemoveIndices.length; _i--;) {

			watchTargets.splice(willRemoveIndices[_i], 1);
		}
	}
};

window.addEventListener('scroll', throttle(onViewChangeHandler, 100));
window.addEventListener('resize', throttle(onViewChangeHandler, 250));

var InViewObserver = function () {
	function InViewObserver() {
		_classCallCheck(this, InViewObserver);

		this.watchTargets = [];
		onScrollListeners.push(this.watchTargets);
	}

	InViewObserver.prototype.add = function add() {
		var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


		var inView = isElementInViewport(option.el);

		if (inView.partIn) {

			option.onEnterStart();
		}

		if (inView.wholeIn) {

			option.onEnterEnd();

			if (option.once) {
				return;
			}
		}

		var state = inView.wholeIn ? 'WHOLE_IN' : inView.partIn ? 'PART_IN' : 'OUT';

		this.watchTargets.push({
			el: option.el,
			onEnterStart: option.onEnterStart || function () {},
			onEnterEnd: option.onEnterEnd || function () {},
			onLeaveStart: option.onLeaveStart || function () {},
			onLeaveEnd: option.onLeaveEnd || function () {},
			once: option.once,
			state: state
		});
	};

	InViewObserver.prototype.reset = function reset() {

		this.watchTargets.length = 0;
	};

	return InViewObserver;
}();

export default InViewObserver;
