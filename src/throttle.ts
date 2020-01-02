export function throttle( fn: Function, threshold: number ) {

	let last: number, deferTimer: number;

	return function () {

		const now = Date.now();

		if ( last && now < last + threshold ) {

			clearTimeout( deferTimer );
			deferTimer = window.setTimeout( function () {

				last = now;
				fn();

			}, threshold );

		} else {

			last = now;
			fn();

		}

	};

}
