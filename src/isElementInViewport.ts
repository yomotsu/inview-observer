import { throttle } from './throttle';

// let viewWidth = 0;
let viewHeight = 0;

function onresize() {

	// viewWidth = ( window.innerWidth || document.documentElement.clientWidth );
	viewHeight = ( window.innerHeight || document.documentElement.clientHeight );

};

onresize();
window.addEventListener( 'resize', throttle( onresize, 250 ) );

export function isElementInViewport( el: HTMLElement, offsetTop = 0, offsetBottom = 0 ) {

	const rect = el.getBoundingClientRect();
	const rectTop = rect.top + offsetTop;
	const rectBottom = rect.bottom + offsetBottom;
	const rectHeight = rect.height - offsetTop + offsetBottom;
	const hasScrollPassed = rectTop <= viewHeight;

	const partIn = (
		( 0 < - rectTop && - rectTop < rectHeight ) ||
		( rectBottom - rectHeight < viewHeight && viewHeight < rectBottom )
	);

	const wholeIn = (
		rectTop >= 0 &&
		// rect.left >= 0 &&
		// rect.right <= viewWidth &&
		rectBottom <= viewHeight
	);

	return {
		hasScrollPassed,
		partIn,
		wholeIn,
	};

}
