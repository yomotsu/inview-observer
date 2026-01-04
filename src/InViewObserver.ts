import {
	State,
	WatchTargetParam,
} from './types';
import { isBrowser } from './is-browser';
import { WatchTarget } from './WatchTarget';
import { throttle } from './throttle';
import { isElementInViewport } from './isElementInViewport';

const onScrollListeners: WatchTarget[][] = [];
export const handleViewChange = () => {

	for ( const watchTargets of onScrollListeners ) {

		const willRemoveIndices = [];

		for ( let i = 0, m = watchTargets.length; i < m; i ++ ) {

			const watchTarget = watchTargets[ i ];
			const lastState = watchTarget.state;
			const inView = isElementInViewport( watchTarget.el, watchTarget.rootMarginTop, watchTarget.rootMarginBottom );
			const newState = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;
			const hasScrollPassed = inView.hasScrollPassed;
			const hasChanged = lastState !== newState;

			if ( watchTarget.willRemove ) {

				willRemoveIndices.push( i );

			}

			if ( watchTarget.hasScrollPassed !== hasScrollPassed ) {

				watchTarget.hasScrollPassed = hasScrollPassed;

				if ( hasScrollPassed ) {

					watchTarget.onScrollPassed && watchTarget.onScrollPassed();

				} else {

					watchTarget.onScrollUnPassed && watchTarget.onScrollUnPassed();

				}

			}

			if ( hasChanged && newState === State.WHOLE_IN ) {

				watchTarget.state = newState;
				watchTarget.onEnterEnd && watchTarget.onEnterEnd();

				continue;

			}

			if (
				hasChanged &&
				lastState === State.OUT &&
				newState === State.PART_IN
			) {

				watchTarget.state = newState;
				watchTarget.onEnterStart && watchTarget.onEnterStart();
				continue;

			}

			if (
				hasChanged &&
				lastState === State.PART_IN &&
				newState === State.OUT
			) {

				watchTarget.state = newState;
				watchTarget.onLeaveEnd && watchTarget.onLeaveEnd();
				continue;

			}

			if ( hasChanged && ! inView.wholeIn ) {

				watchTarget.state = newState;
				watchTarget.onLeaveStart && watchTarget.onLeaveStart();
				continue;

			}

		}

		for ( let j = willRemoveIndices.length; j --; ) {

			watchTargets.splice( willRemoveIndices[ j ], 1 );

		}

	}

};

if ( isBrowser ) {

	window.addEventListener( 'scroll', throttle( handleViewChange, 100 ) );
	window.addEventListener( 'resize', throttle( handleViewChange, 250 ) );

}

export class InViewObserver {

	watchTargets: WatchTarget[] = [];

	constructor() {

		onScrollListeners.push( this.watchTargets );

	}

	add( watchTargetParam: WatchTargetParam ) {

		const watchTarget = new WatchTarget(
			watchTargetParam.el,
			watchTargetParam.rootMarginTop,
			watchTargetParam.rootMarginBottom,
			watchTargetParam.onEnterStart,
			watchTargetParam.onEnterEnd,
			watchTargetParam.onLeaveStart,
			watchTargetParam.onLeaveEnd,
			watchTargetParam.onScrollPassed,
			watchTargetParam.onScrollUnPassed,
		);

		this.watchTargets.push( watchTarget );
		return watchTarget;

	}

	remove( el: HTMLElement ) {

		this.watchTargets.some( ( obj ) => {

			if ( obj.el === el ) {

				obj.willRemove = true;
				return true;

			}

			return false;

		} );

	}

	reset() {

		this.watchTargets.length = 0;

	}

	static isInView( el: HTMLElement, rootMarginTop = 0, rootMarginBottom = 0 ) {

		return isElementInViewport( el, rootMarginTop, rootMarginBottom );

	}

}
