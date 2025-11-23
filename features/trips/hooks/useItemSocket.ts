// features/packing/live/usePackingSocket.ts
import { KEYS } from "@/constants/queryKeys";
import { useSocketService } from "@/providers/SocketProvider";
import { Item } from "@/types/packingItem";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useItemSocket(tripId: string) {
    const socket = useSocketService();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket || !tripId) return;

        const handleItemCreated = (item: any) => {
            queryClient.setQueryData(KEYS.trip.sharedItems(tripId), (prev: Item[]) => {
                if (!prev) return [item];
                return [item, ...prev];
            });
        };

        const handleItemUpdated = (item: any) => {
            queryClient.setQueryData(KEYS.trip.sharedItems(tripId), (prev: Item[]) => {
                if (!prev) return prev;
                return prev.map(i => (i.id === item._id ? item : i));
            });
        };

        const handleItemDeleted = (itemId: string) => {
            queryClient.setQueryData(KEYS.trip.sharedItems(tripId), (prev: Item[]) => {
                if (!prev) return prev;
                return prev.filter(i => i.id !== itemId);
            });
        };

        socket.onEvent("item:created", handleItemCreated);
        socket.onEvent("item:updated", handleItemUpdated);
        socket.onEvent("item:deleted", handleItemDeleted);

        return () => {
            socket.offEvent("item:created", handleItemCreated);
            socket.offEvent("item:updated", handleItemUpdated);
            socket.offEvent("item:deleted", handleItemDeleted);
        };
    }, [socket, tripId, queryClient]);
}
