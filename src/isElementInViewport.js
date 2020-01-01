import throttle from './throttle.js';

// let viewWidth = 0;
let viewHeight = 0;

function onresize() {

	// viewWidth = ( window.innerWidth || document.documentElement.clientWidth );
	viewHeight = ( window.innerHeight || document.documentElement.clientHeight );

};

onresize();
window.addEventListener( 'resize', throttle( onresize, 250 ) );

function isElementInViewport( el, offsetTop = 0, offsetBotttom = 0 ) {

	const rect = el.getBoundingClientRect();
	const rectTop = rect.top + offsetTop;
	const rectBottom = rect.bottom + offsetBotttom;

	const partIn = (
		( 0 < - rectTop && - rectTop < rect.height ) ||
		( rectBottom - rect.height < viewHeight && viewHeight < rectBottom )
	);

	const wholeIn = (
		rectTop >= 0 &&
		// rect.left >= 0 &&
		// rect.right <= viewWidth &&
		rectBottom <= viewHeight
	);

	return {
		partIn,
		wholeIn
	};

};

export default isElementInViewport;
