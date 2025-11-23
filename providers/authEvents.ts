export type LogoutHandler = (() => Promise<void>) | null;

let logoutHandler: LogoutHandler = null;

export const registerLogoutHandler = (fn: LogoutHandler) => {
  logoutHandler = fn;
};

export const triggerLogout = async () => {
    if (logoutHandler) {
        try {
            await logoutHandler();
        } catch (e) {
            console.warn("Registered logout handler failed", e);
        }
    } else {
        // Fallback: clear tokens/user if no handler registered
        try {
            const { clearTokens, clearUser } = await import('@/utils/secureStore');
            await clearTokens();
            await clearUser();
        } catch (e) {
            console.warn("Fallback logout failed", e);
        }
    }
};