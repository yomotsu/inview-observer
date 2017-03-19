import throttle from './throttle.js';
import isElementInViewport from './isElementInViewport.js';

const onScrollListeners = [];

window.addEventListener( 'scroll', () => {

	for ( let i = 0, l = onScrollListeners.length; i < l; i ++ ) {

		const watchTargets = onScrollListeners[ i ];
		const willRemoveIndices = [];

		for ( let j = 0, m = watchTargets.length; j < m; j ++ ) {

			const watchTarget = watchTargets[ j ];
			const prevState = watchTarget.inView;
			const inView = isElementInViewport( watchTarget.el );
			const hasChanged = prevState !== inView;

			if ( hasChanged && inView ) {

				watchTarget.inView = inView;
				watchTarget.onEnter();

				if ( watchTarget.once ) {

					willRemoveIndices.push( j );

				}

				continue;

			}

			if ( hasChanged && ! inView ) {

				watchTarget.inView = inView;
				watchTarget.onLeave();
				continue;

			}

		}

		for ( let i = willRemoveIndices.length; i--; ) {

			watchTargets.splice( i, 1 );

		}

	}

} )

class InViewObserver {

	constructor () {

		this.watchTargets = [];
		onScrollListeners.push( this.watchTargets );

	}

	add ( option = {} ) {

		const inView = isElementInViewport( option.el );

		if ( inView ) {

			option.onEnter();

			if ( option.once ) { return; }

		}

		this.watchTargets.push( {
			el: option.el,
			onEnter: option.onEnter || function () {},
			onLeave: option.onLeave || function () {},
			once: option.once,
			inView
		} );

	}

	reset () {

		this.watchTargets.length = 0;

	}

}

export default InViewObserver;
