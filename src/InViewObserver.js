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
			const inView = isElementInViewport( watchTarget.el );
			const newState = inView.wholeIn ? 'WHOLE_IN': inView.partIn ? 'PART_IN': 'OUT';
			const hasChanged = prevState !== newState;

			if ( hasChanged && newState === 'WHOLE_IN' ) {

				watchTarget.state = newState;
				watchTarget.onEnterEnd();

				if ( watchTarget.once ) {

					willRemoveIndices.push( j );

				}

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

		for ( let i = willRemoveIndices.length; i--; ) {

			watchTargets.splice( willRemoveIndices[ i ], 1 );

		}

	}

};

window.addEventListener( 'scroll', throttle( onViewChangeHandler, 100 ) );
window.addEventListener( 'resize', throttle( onViewChangeHandler, 250 ) );

class InViewObserver {

	constructor () {

		this.watchTargets = [];
		onScrollListeners.push( this.watchTargets );

	}

	add ( option = {} ) {

		const inView = isElementInViewport( option.el );

		if ( inView.partIn ) {

			option.onEnterStart();

		}

		if ( inView.wholeIn ) {

			option.onEnterEnd();

			if ( option.once ) { return; }

		}

		const state = inView.wholeIn ? 'WHOLE_IN': inView.partIn ? 'PART_IN': 'OUT';

		this.watchTargets.push( {
			el: option.el,
			onEnterStart: option.onEnterStart || function () {},
			onEnterEnd  : option.onEnterEnd   || function () {},
			onLeaveStart: option.onLeaveStart || function () {},
			onLeaveEnd  : option.onLeaveEnd   || function () {},
			once: option.once,
			state: state
		} );

	}

	remove( el ) {

		let index = 0;

		this.watchTargets.some( obj => {

			index ++;
			return obj.el === el

		} );

		this.watchTargets.splice( 1, index );

	}

	reset () {

		this.watchTargets.length = 0;

	}

	static isInView( el ) {

		return isElementInViewport( el );

	}

}

export default InViewObserver;
