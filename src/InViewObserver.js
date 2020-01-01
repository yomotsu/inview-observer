import throttle from './throttle.js';
import isElementInViewport from './isElementInViewport.js';

const onScrollListeners = [];
const onViewChangeHandler = () => {

	for ( let i = 0, l = onScrollListeners.length; i < l; i ++ ) {

		const watchTargets = onScrollListeners[ i ];
		const willRemoveIndices = [];

		for ( let j = 0, m = watchTargets.length; j < m; j ++ ) {

			const watchTarget = watchTargets[ j ];
			const prevState = watchTarget.state;
			const inView = isElementInViewport( watchTarget.el, watchTarget.offsetTop, watchTarget.offsetBottom );
			const newState = inView.wholeIn ? 'WHOLE_IN' : inView.partIn ? 'PART_IN' : 'OUT';
			const hasChanged = prevState !== newState;

			if ( watchTarget.willRemove ) {

				willRemoveIndices.push( j );

			}

			if ( hasChanged && newState === 'WHOLE_IN' ) {

				watchTarget.state = newState;
				watchTarget.onEnterEnd();

				continue;

			}

			if (
				hasChanged &&
				prevState === 'OUT' &&
				newState === 'PART_IN'
			) {

				watchTarget.state = newState;
				watchTarget.onEnterStart();
				continue;

			}

			if (
				hasChanged &&
				prevState === 'PART_IN' &&
				newState === 'OUT'
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

		for ( let j = willRemoveIndices.length; j--; ) {

			watchTargets.splice( willRemoveIndices[ j ], 1 );

		}

	}

};

window.addEventListener( 'scroll', throttle( onViewChangeHandler, 100 ) );
window.addEventListener( 'resize', throttle( onViewChangeHandler, 250 ) );

class InViewObserver {

	constructor() {

		this.watchTargets = [];
		onScrollListeners.push( this.watchTargets );

	}

	add( option = {} ) {

		const inView = isElementInViewport( option.el, option.offsetTop, option.offsetBottom );

		if ( inView.partIn && !! option.onEnterStart ) {

			option.onEnterStart();

		}

		if ( inView.wholeIn && !! option.onEnterEnd ) {

			option.onEnterEnd();

		}

		const state = inView.wholeIn ? 'WHOLE_IN' : inView.partIn ? 'PART_IN' : 'OUT';

		this.watchTargets.push( {
			el: option.el,
			offsetTop   : option.offsetTop    || 0,
			offsetBottom: option.offsetBottom || 0,
			onEnterStart: option.onEnterStart || function () {},
			onEnterEnd  : option.onEnterEnd   || function () {},
			onLeaveStart: option.onLeaveStart || function () {},
			onLeaveEnd  : option.onLeaveEnd   || function () {},
			state: state
		} );

	}

	remove( el ) {

		this.watchTargets.some( obj => {

			if ( obj.el === el ) {

				obj.willRemove = true;
				return true;

			}

		} );

	}

	reset() {

		this.watchTargets.length = 0;

	}

	static isInView( el, offsetTop = 0, offsetBotttom = 0 ) {

		return isElementInViewport( el, offsetTop, offsetBotttom );

	}

}

export default InViewObserver;
