export const apiRoutes = {
    auth: {
        me: { url: '/auth/me', method: 'GET' },
        sendOtp: { url: '/auth/otp', method: 'POST' },
        refresh: { url: '/auth/refresh-token', method: 'POST' },
        logout: { url: '', method: 'POST' },
        verifyOtp: { url: '/auth/signin', method: 'POST' },
    },
    trip: {
        upcoming: { url: '/trips/accepted', method: 'GET' },
        completed: { url: '/trips/completed', method: 'GET' },
        invites: { url: '/trips/invited', method: 'GET' },
    },
}