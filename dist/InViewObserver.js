/*!
 * InViewObserver
 * https://github.com/yomotsu/InViewObserver
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.InViewObserver = factory());
}(this, (function () { 'use strict';

	function throttle(fn, threshhold) {

		var last, deferTimer;

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

		return rect.top >= 0 && rect.left >= 0 && rect.right <= viewWidth && rect.bottom <= viewHeight;
	}

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var onScrollListeners = [];

	window.addEventListener('scroll', function () {

		for (var i = 0, l = onScrollListeners.length; i < l; i++) {

			var watchTargets = onScrollListeners[i];
			var willRemoveIndices = [];

			for (var j = 0, m = watchTargets.length; j < m; j++) {

				var watchTarget = watchTargets[j];
				var prevState = watchTarget.inView;
				var inView = isElementInViewport(watchTarget.el);
				var hasChanged = prevState !== inView;

				if (hasChanged && inView) {

					watchTarget.inView = inView;
					watchTarget.onEnter();

					if (watchTarget.once) {

						willRemoveIndices.push(j);
					}

					continue;
				}

				if (hasChanged && !inView) {

					watchTarget.inView = inView;
					watchTarget.onLeave();
					continue;
				}
			}

			for (var _i = willRemoveIndices.length; _i--;) {

				watchTargets.splice(_i, 1);
			}
		}
	});

	var InViewObserver = function () {
		function InViewObserver() {
			_classCallCheck(this, InViewObserver);

			this.watchTargets = [];
			onScrollListeners.push(this.watchTargets);
		}

		InViewObserver.prototype.add = function add() {
			var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


			var inView = isElementInViewport(option.el);

			if (inView) {

				option.onEnter();

				if (option.once) {
					return;
				}
			}

			this.watchTargets.push({
				el: option.el,
				onEnter: option.onEnter || function () {},
				onLeave: option.onLeave || function () {},
				once: option.once,
				inView: inView
			});
		};

		InViewObserver.prototype.reset = function reset() {

			this.watchTargets.length = 0;
		};

		return InViewObserver;
	}();

	return InViewObserver;

})));
