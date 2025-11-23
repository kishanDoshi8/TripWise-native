// hooks/useTripSocket.ts
import { socketService } from "@/utils/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export function useTripSocket(tripId?: string) {
    const queryClient = useQueryClient();

    useEffect(() => {        
        if (!tripId) return;
        socketService.joinRoom(tripId);

        return () => {
            socketService.leaveRoom(tripId);
        };
    }, [tripId, queryClient]);

    const emit = useCallback((event: string, payload: any, ack?: (r: any) => void) => {
        socketService.emitEvent(event, payload, ack);
    }, []);
    
    return { emit, id: socketService.getId() };
}
