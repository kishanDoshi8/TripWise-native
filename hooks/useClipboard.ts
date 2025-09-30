import * as Clipboard from "expo-clipboard";
import { useCallback, useState } from "react";

export function useClipboard(timeout = 5000) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async (text: string) => {
		await Clipboard.setStringAsync(text);
		setCopied(true);
		setTimeout(() => setCopied(false), timeout);
	}, [timeout]);

	return { copied, copy };
}
