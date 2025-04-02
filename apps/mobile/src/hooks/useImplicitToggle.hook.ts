import { useCallback, useState } from "react";

export function useImplicitToggle(bool = false) {
	const [state, setState] = useState(bool);

	const toggle = useCallback(() => setState((x) => !x), [bool]);

	return [state, toggle] as const;
}
