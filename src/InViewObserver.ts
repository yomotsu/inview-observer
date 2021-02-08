import {
	State,
	WatchTargetParam,
} from './types';
import { WatchTarget } from './WatchTarget';
import { throttle } from './throttle';
import { isElementInViewport } from './isElementInViewport';

const onScrollListeners: WatchTarget[][] = [];
const onViewChangeHandler = () => {

	for ( let i = 0, l = onScrollListeners.length; i < l; i ++ ) {

		const watchTargets = onScrollListeners[ i ];
		const willRemoveIndices = [];

		for ( let j = 0, m = watchTargets.length; j < m; j ++ ) {

			const watchTarget = watchTargets[ j ];
			const lastState = watchTarget.state;
			const inView = isElementInViewport( watchTarget.el, watchTarget.offsetTop, watchTarget.offsetBottom );
			const newState = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;
			const hasScrollPassed = inView.hasScrollPassed;
			const hasChanged = lastState !== newState;

			if ( watchTarget.willRemove ) {

				willRemoveIndices.push( j );

			}

			if ( watchTarget.hasScrollPassed !== hasScrollPassed ) {

				watchTarget.hasScrollPassed = hasScrollPassed;
				hasScrollPassed ? watchTarget.onScrollPassed() : watchTarget.onScrollUnPassed();

			}

			if ( hasChanged && newState === State.WHOLE_IN ) {

				watchTarget.state = newState;
				watchTarget.onEnterEnd();

				continue;

			}

			if (
				hasChanged &&
				lastState === State.OUT &&
				newState === State.PART_IN
			) {

				watchTarget.state = newState;
				watchTarget.onEnterStart();
				continue;

			}

			if (
				hasChanged &&
				lastState === State.PART_IN &&
				newState === State.OUT
			) {

				watchTarget.state = newState;
				watchTarget.onLeaveEnd();
				continue;

			}

			if ( hasChanged && ! inView.wholeIn ) {

				watchTarget.state = newState;
				watchTarget.onLeaveStart();
				continue;

			}

		}

		for ( let j = willRemoveIndices.length; j --; ) {

			watchTargets.splice( willRemoveIndices[ j ], 1 );

		}

	}

};

window.addEventListener( 'scroll', throttle( onViewChangeHandler, 100 ) );
window.addEventListener( 'resize', throttle( onViewChangeHandler, 250 ) );

export class InViewObserver {

	watchTargets: WatchTarget[] = [];

	constructor() {

		onScrollListeners.push( this.watchTargets );

	}

	add( watchTargetParam: WatchTargetParam ) {

		const watchTarget = new WatchTarget(
			watchTargetParam.el,
			watchTargetParam.offsetTop,
			watchTargetParam.offsetBottom,
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

	static isInView( el: HTMLElement, offsetTop = 0, offsetBottom = 0 ) {

		return isElementInViewport( el, offsetTop, offsetBottom );

	}

}
