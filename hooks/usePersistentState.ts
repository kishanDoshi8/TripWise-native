import { getItem, setItem } from '@/utils/asyncStore';
import { useEffect, useState } from 'react';

export function usePersistentState<T>(
    key: string,
    initialValue: T
) {
    const [state, setState] = useState<T>(initialValue);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        getItem<T>(key).then(value => {
            if (value !== null) setState(value);
            setHydrated(true);
        });
    }, [key]);

    useEffect(() => {
        if (hydrated) {
            setItem(key, state);
        }
    }, [key, state, hydrated]);

    return [state, setState, hydrated] as const;
}
