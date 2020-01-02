import { State } from './types';
import { isElementInViewport } from "./isElementInViewport";

export class WatchTarget {

	el: HTMLElement;
	offsetTop   : number;
	offsetBottom: number;
	onEnterStart: Function;
	onEnterEnd  : Function;
	onLeaveStart: Function;
	onLeaveEnd  : Function;
	state: State;
	willRemove = false;

	constructor(
		el: HTMLElement,
		offsetTop   : number | undefined = 0,
		offsetBottom: number | undefined = 0,
		onEnterStart: Function | undefined = () => {},
		onEnterEnd  : Function | undefined = () => {},
		onLeaveStart: Function | undefined = () => {},
		onLeaveEnd  : Function | undefined = () => {},
	) {

		const inView = isElementInViewport( el, offsetTop, offsetBottom );

		if ( inView.partIn && !! onEnterStart ) onEnterStart();
		if ( inView.wholeIn && !! onEnterEnd ) onEnterEnd();

		this.el = el;
		this.offsetTop    = offsetTop;
		this.offsetBottom = offsetBottom;
		this.onEnterStart = onEnterStart;
		this.onEnterEnd   = onEnterEnd;
		this.onLeaveStart = onLeaveStart;
		this.onLeaveEnd   = onLeaveEnd;
		this.state = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;

	}

}
