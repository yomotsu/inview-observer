import { State, type RootMargin } from './types';
import { isElementInViewport } from "./isElementInViewport";

export class WatchTarget {

	el: HTMLElement;
	rootMarginTop    : RootMargin;
	rootMarginBottom : RootMargin;
	onEnterStart     : ( () => void ) | undefined;
	onEnterEnd       : ( () => void ) | undefined;
	onLeaveStart     : ( () => void ) | undefined;
	onLeaveEnd       : ( () => void ) | undefined;
	onScrollPassed   : ( () => void ) | undefined;
	onScrollUnPassed : ( () => void ) | undefined;
	state: State;
	hasScrollPassed: boolean = false;
	willRemove = false;

	constructor(
		el: HTMLElement,
		rootMarginTop   : RootMargin | undefined = 0,
		rootMarginBottom: RootMargin | undefined = 0,
		onEnterStart?    : () => void,
		onEnterEnd?      : () => void,
		onLeaveStart?    : () => void,
		onLeaveEnd?      : () => void,
		onScrollPassed?  : () => void,
		onScrollUnPassed?: () => void,
	) {

		const inView = isElementInViewport( el, rootMarginTop, rootMarginBottom );
		this.hasScrollPassed = inView.hasScrollPassed;

		if ( inView.partIn && !! onEnterStart ) onEnterStart();
		if ( inView.wholeIn && !! onEnterEnd ) onEnterEnd();
		if ( this.hasScrollPassed ) {

			onScrollPassed && onScrollPassed();

		} else {

			onScrollUnPassed && onScrollUnPassed();

		}

		this.el = el;
		this.rootMarginTop    = rootMarginTop;
		this.rootMarginBottom = rootMarginBottom;
		this.onEnterStart     = onEnterStart;
		this.onEnterEnd       = onEnterEnd;
		this.onLeaveStart     = onLeaveStart;
		this.onLeaveEnd       = onLeaveEnd;
		this.onScrollPassed   = onScrollPassed;
		this.onScrollUnPassed = onScrollUnPassed;
		this.state = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;

	}

}
