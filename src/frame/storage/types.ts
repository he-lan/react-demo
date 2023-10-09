
/**
 * @returns whether the provided parameter is undefined.
 */
export function isUndefined(obj: any): obj is undefined {
	return (typeof obj === 'undefined');
}

/**
 * @returns whether the provided parameter is undefined or null.
 */
export function isUndefinedOrNull(obj: any): obj is undefined | null {
	return (isUndefined(obj) || obj === null);
}