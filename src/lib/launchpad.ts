import webmidi, { Input, /*InputEvents,*/ InputEventNoteon, InputEventNoteoff, Output } from 'webmidi';
import { normalizeToLpColor } from './colors';
const LAUNCHPAD_NAME = "Launchpad MK2";

export interface Color {
	r: number;
	g: number;
	b: number;
}

export interface PadState {
	on: boolean;
	color: Color;
}

//type InputEventType = keyof InputEvents;
//type InputEventCallback = <T extends InputEventType>(event: InputEvents[T]) => void;
//type Callback = [InputEventType, InputEventCallback];

export class Launchpad {
	private _launchpad: { input: Input, output: Output } = undefined as any as { input: Input, output: Output };
	//private _listeners: Map<string, Callback> = new Map<string, Callback>();
	private _pads: Map<number, PadState> = new Map<number, PadState>();

	// navigation
	public up: PadState = initialPadState();
	public down: PadState = initialPadState();
	public left: PadState = initialPadState();
	public right: PadState = initialPadState();

	// context
	public session: PadState = initialPadState();
	public user1: PadState = initialPadState();
	public user2: PadState = initialPadState();
	public mixer: PadState = initialPadState();

	// pads
	public pads = createPadArray();

	// triggers
	public trigger8_Volume: PadState = initialPadState();
	public trigger7_Pan: PadState = initialPadState();
	public trigger6_SendA: PadState = initialPadState();
	public trigger5_SendB: PadState = initialPadState();
	public trigger4_Stop: PadState = initialPadState();
	public trigger3_Mute: PadState = initialPadState();
	public trigger2_Solo: PadState = initialPadState();
	public trigger1_RecordArm: PadState = initialPadState();

	constructor(initDepth = 50) {
		if (initDepth < 1) {
			throw `Unable to find "${LAUNCHPAD_NAME}".`;
		}

		let launchpadInput: Input | undefined;
		let launchpadOutput: Output | undefined;

		if (!webmidi.enabled) {
			webmidi.enable((err) => {
				if (!!err) {
					console.error(err);
					throw err;
				} else {
					launchpadInput = webmidi.inputs.find(input => input.name === LAUNCHPAD_NAME);
					launchpadOutput = webmidi.outputs.find(output => output.name === LAUNCHPAD_NAME);
				}
			});
		}
		if (launchpadInput !== undefined && launchpadOutput !== undefined) {
			this._launchpad = { input: launchpadInput as Input, output: launchpadOutput };
		} else {
			return new Launchpad(initDepth - 1);
		}

		for (let i = 1; i < 9; i++) {
			for (let j = 1; j < 10; j++) {
				this._pads.set(i * 10 + j, initialPadState());
			}
		}

		this.updatePadState = this.updatePadState.bind(this);
		this._launchpad.input.addListener('noteon', 'all', this.updatePadState);
		this._launchpad.input.addListener('noteoff', 'all', this.updatePadState);
		return this;
	}

	private updatePadState(event: InputEventNoteon | InputEventNoteoff) {
		if (event.type === 'noteon') {
			const pad = this._pads.get(event.note.number);
			if (pad) {
				this._pads.set(event.note.number, {
					...pad,
					on: true
				});
			}
		} else {
			const pad = this._pads.get(event.note.number);
			if (pad) {
				this._pads.set(event.note.number, {
					...pad,
					on: false
				});
			}
		}
	}

	public setColorForPad(pad: number, color: Color) {
		this._launchpad.output.send(240, sysexColorMessage(pad, color));
	}

	// public addListener(to: InputEventType, callback: InputEventCallback): string {
	// 	const hash = uuid.v4() as string;
	// 	this._launchpad.addListener(to, 'all', callback);
	// 	this._listeners.set(hash, [to, callback]);
	// 	return hash;
	// }

	// public removeListener(hash: string) {
	// 	const [to, callback] = this._listeners.get(hash) || (() => { throw `no listener found with hash ${hash}`; })();
	// 	this._launchpad.removeListener(to, 'all', callback);
	// 	this._listeners.delete(hash);
	// }


}

function createPadArray() {
	return {
		[1]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[2]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[3]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[4]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[5]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[6]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[7]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
		[8]: {
			[1]: initialPadState(),
			[2]: initialPadState(),
			[3]: initialPadState(),
			[4]: initialPadState(),
			[5]: initialPadState(),
			[6]: initialPadState(),
			[7]: initialPadState(),
			[8]: initialPadState(),
		},
	};
}

function initialPadState() {
	return { on: false, color: { r: 0, g: 0, b: 0 } };
}

function sysexColorMessage(pad: number, color: Color): number[] {
	return [0, 32, 41, 2, 24, 11, pad, normalizeToLpColor(color.r), normalizeToLpColor(color.g), normalizeToLpColor(color.b), 247];
}