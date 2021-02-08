import { State } from './types';
import { isElementInViewport } from "./isElementInViewport";

export class WatchTarget {

	el: HTMLElement;
	offsetTop   : number;
	offsetBottom: number;
	onEnterStart    : Function;
	onEnterEnd      : Function;
	onLeaveStart    : Function;
	onLeaveEnd      : Function;
	onScrollPassed  : Function;
	onScrollUnPassed: Function;
	state: State;
	hasScrollPassed: boolean = false;
	willRemove = false;

	constructor(
		el: HTMLElement,
		offsetTop   : number | undefined = 0,
		offsetBottom: number | undefined = 0,
		onEnterStart    : Function = () => {},
		onEnterEnd      : Function = () => {},
		onLeaveStart    : Function = () => {},
		onLeaveEnd      : Function = () => {},
		onScrollPassed  : Function = () => {},
		onScrollUnPassed: Function = () => {},
	) {

		const inView = isElementInViewport( el, offsetTop, offsetBottom );

		if ( inView.partIn && !! onEnterStart ) onEnterStart();
		if ( inView.wholeIn && !! onEnterEnd ) onEnterEnd();

		this.el = el;
		this.offsetTop        = offsetTop;
		this.offsetBottom     = offsetBottom;
		this.onEnterStart     = onEnterStart;
		this.onEnterEnd       = onEnterEnd;
		this.onLeaveStart     = onLeaveStart;
		this.onLeaveEnd       = onLeaveEnd;
		this.onScrollPassed   = onScrollPassed;
		this.onScrollUnPassed = onScrollUnPassed;
		this.state = inView.wholeIn ? State.WHOLE_IN : inView.partIn ? State.PART_IN : State.OUT;

	}

}
