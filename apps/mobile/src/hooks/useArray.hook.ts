import { useState } from "react";

export type ArrayHookMethods<T> = {
	push: (e: T) => void;
	filter: (cb: (v: T, index: number) => void) => void;
	update: (index: number, newEl: T) => void;
	remove: (index: number) => void;
	clear: () => void;
	// find: (cb: (v: T, index: number) => boolean) => T | undefined;
	setArray: React.Dispatch<React.SetStateAction<T[]>>;
};
export function useArray<T extends unknown>(
	defaultValue: T[] = []
): [T[], ArrayHookMethods<T>] {
	const [arr, setArray] = useState<T[]>(defaultValue);

	const push = (e: T) => {
		setArray((x) => [...x, e]);
	};

	const filter = (cb: (v: T, index: number) => void) => {
		setArray((x) => x.filter(cb));
	};

	const update = (index: number, newEl: T) => {
		setArray((x) => [
			...x.slice(0, index),
			newEl,
			...x.slice(index + 1, x.length - 1),
		]);
	};

	const remove = (index: number) => {
		setArray((x) => [
			...x.slice(0, index),
			...x.slice(index + 1, x.length - 1),
		]);
	};

	const clear = () => {
		setArray([]);
	};

	return [arr, { push, filter, update, remove, clear, setArray }];
}
