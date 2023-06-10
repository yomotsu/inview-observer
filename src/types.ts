export const State = {
	WHOLE_IN: 0,
	PART_IN: 1,
	OUT: 2,
} as const;
export type State = typeof State[keyof typeof State];

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
