# launchpad-2

Web MIDI library for interacting with the Novation Launchpad MK2.

`npm i launchpad-2 -s`

Example:
```ts
import { Launchpad } from 'launchpad-2';

const launchpad = new Launchpad();
launchpad.setColorForPad(11, {
	r: 255,
	g: 255,
	b: 255
});
```