export enum State {
	WHOLE_IN,
	PART_IN,
	OUT,
}

export type RootMargin = number | `${ string }px` | `${ string }%`;

export interface WatchTargetParam {
	el: HTMLElement;
	rootMarginTop?   : RootMargin;
	rootMarginBottom?: RootMargin;
	onEnterStart?    : () => void;
	onEnterEnd?      : () => void;
	onLeaveStart?    : () => void;
	onLeaveEnd?      : () => void;
	onScrollPassed?  : () => void;
	onScrollUnPassed?: () => void;
}
