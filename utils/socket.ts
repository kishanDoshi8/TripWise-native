// services/socket.ts
import * as SecureStore from "@/utils/secureStore";
import { io, Socket } from "socket.io-client";

type Listener = (...args: any[]) => void;

const SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

class SocketService {
    socket: Socket | null = null;
    connecting = false;
    queue: Array<{ event: string; payload: any; ack?: (r: any) => void }> = [];

    // local event registry for connect/disconnect if you need it
    private internalListeners: Record<string, Listener[]> = {};

    on(event: string, cb: Listener) {
        if (!this.internalListeners[event]) this.internalListeners[event] = [];
        this.internalListeners[event].push(cb);
    }

    emitInternal(event: string, ...args: any[]) {
        const listeners = this.internalListeners[event] || [];
        for (const fn of listeners) {
            fn(...args);
        }
    }

    async connect() {        
        if (this.socket || this.connecting) return;
        
        this.connecting = true;

        const token = await SecureStore.getAccessToken();

        this.socket = io(SERVER_URL, {
            auth: { token },
            transports: ["websocket"],
            reconnectionAttempts: 20,
            reconnectionDelayMax: 5000,
        });

        this.socket.on("connect", () => {
            this.connecting = false;
            this.emitInternal("connected", this.socket!.id);
            this.flushQueue();
        });

        this.socket.on("disconnect", reason => {
            this.emitInternal("disconnected", reason);
        });

        this.socket.on("connect_error", err => {
            this.emitInternal("connect_error", err);
        });
    }

    disconnect() {
        if (!this.socket) return;
        this.socket.disconnect();
        this.socket = null;
    }

    emitEvent(event: string, payload: any, ack?: (r: any) => void) {
        if (this.socket?.connected) {
            this.socket.emit(event, payload, ack);
        } else {
            this.queue.push({ event, payload, ack });
        }
    }

    flushQueue() {
        if (!this.socket?.connected) return;
        while (this.queue.length > 0) {
            const { event, payload, ack } = this.queue.shift()!;
            this.socket.emit(event, payload, ack);
        }
    }

    onEvent(event: string, handler: Listener) {
        this.socket?.on(event, handler);
    }

    offEvent(event: string, handler?: Listener) {
        if (!this.socket) return;
        if (handler) this.socket.off(event, handler);
        else this.socket.removeAllListeners(event);
    }

    joinRoom(roomId: string) {
        this.emitEvent("join:trip", roomId);
    }

    leaveRoom(roomId: string) {
        this.emitEvent("leave:trip", roomId);
    }

    getId() {
        return this.socket?.id;
    }
}

export const socketService = new SocketService();
