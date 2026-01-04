import { type RootMargin } from './types';
import { throttle } from './throttle';
import { isBrowser } from './is-browser';

// let viewWidth = 0;
let viewHeight = 0;

function onresize() {

	// viewWidth = ( window.innerWidth || document.documentElement.clientWidth );
	viewHeight = ( window.innerHeight || document.documentElement.clientHeight );

}

if ( isBrowser ) {

	onresize();
	window.addEventListener( 'resize', throttle( onresize, 250 ) );

}

export function isElementInViewport( el: HTMLElement, rootMarginTop: RootMargin = 0, rootMarginBottom: RootMargin = 0 ) {

	const _rootMarginTop = isNumber( rootMarginTop ) ? rootMarginTop :
		/^-?[0-9]+px$/.test( rootMarginTop.trim() ) ? parseInt( rootMarginTop, 10 ) :
		/^-?[0-9]+%$/.test( rootMarginTop.trim() ) ? viewHeight * ( parseInt( rootMarginTop, 10 ) / 100 ) :
		0;

	const _rootMarginBottom = isNumber( rootMarginBottom ) ? rootMarginBottom :
		/^-?[0-9]+px$/.test( rootMarginBottom.trim() ) ? parseInt( rootMarginBottom, 10 ) :
		/^-?[0-9]+%$/.test( rootMarginBottom.trim() ) ? viewHeight * ( parseInt( rootMarginBottom, 10 ) / 100 ) :
		0;

	const rootTop = _rootMarginTop;
	const rootBottom = viewHeight + _rootMarginBottom;
	const rect = el.getBoundingClientRect();
	const rectTop = rect.top;
	const rectBottom = rect.bottom;
	const rectHeight = rect.height;
	const hasScrollPassed = rectTop <= rootBottom;

	const partIn = (
		( rootTop < - rectTop && rootTop - rectTop < rectHeight ) ||
		( rectBottom - rectHeight < rootBottom && rootBottom < rectBottom )
	);

	const wholeIn = (
		rectTop >= rootTop &&
		// rect.left >= rootLeft &&
		// rect.right <= rootWidth &&
		rectBottom <= rootBottom
	);

	return {
		hasScrollPassed,
		partIn,
		wholeIn,
	};

}


function isNumber( value: any ): value is number {

	return ( ( typeof value === 'number' ) && ( isFinite( value ) ) );

}
