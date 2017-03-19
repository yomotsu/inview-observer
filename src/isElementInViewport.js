import throttle from './throttle.js';

let viewWidth = 0;
let viewHeight = 0;

function onresize() {

	viewWidth = ( window.innerWidth || document.documentElement.clientWidth );
	viewHeight = ( window.innerHeight || document.documentElement.clientHeight );

};

onresize();
window.addEventListener( 'resize', throttle( onresize, 250 ) );

function isElementInViewport( el ) {

	const rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.right <= viewWidth &&
		rect.bottom <= viewHeight
	);

};

export default isElementInViewport;
