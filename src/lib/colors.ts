
export function rgbToLpValues(r: number, g: number, b: number) {
	return {
		r: normalizeToLpColor(r),
		g: normalizeToLpColor(g),
		b: normalizeToLpColor(b)
	}
}

export function convertHexToLpValues(hex: string) {
	hex = hex.replace('#', '');
	hex = hex.trim();
	if (hex.length === 3) {
		return rgbToLpValues(parseHex(hex[0] + hex[0]), parseHex(hex[1] + hex[1]), parseHex(hex[2] + hex[2]));
	} else if (hex.length === 6) {
		return rgbToLpValues(parseHex(hex[0] + hex[1]), parseHex(hex[2] + hex[3]), parseHex(hex[4] + hex[5]));
	}
	throw 'Malformed Hexadecimal Color Value';
}

export function normalizeToLpColor(input: number): number {
	return Math.round(input / (255 / 63));
}

function parseHex(hex: string): number {
	return parseInt(hex, 16);
}
