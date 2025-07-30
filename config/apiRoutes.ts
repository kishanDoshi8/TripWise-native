export const apiRoutes = {
    auth: {
        me: { url: '/auth/me', method: 'GET' },
        sendOtp: { url: '/auth/otp', method: 'POST' },
        login: { url: '', method: 'POST' },
        refresh: { url: '', method: 'POST' },
        logout: { url: '', method: 'POST' },
    }
}