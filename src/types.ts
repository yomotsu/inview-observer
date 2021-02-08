export enum State {
	WHOLE_IN,
	PART_IN,
	OUT,
}

export interface WatchTargetParam {
	el: HTMLElement;
	offsetTop?   : number;
	offsetBottom?: number;
	onEnterStart?    : Function;
	onEnterEnd?      : Function;
	onLeaveStart?    : Function;
	onLeaveEnd?      : Function;
	onScrollPassed?  : Function;
	onScrollUnPassed?: Function;
}
