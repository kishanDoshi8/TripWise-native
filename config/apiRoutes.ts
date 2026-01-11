export const apiRoutes = {
    auth: {
        me: { url: '/auth/me', method: 'GET' },
        sendOtp: { url: '/auth/otp', method: 'POST' },
        refresh: { url: '/auth/refresh-token', method: 'POST' },
        logout: { url: '', method: 'POST' },
        verifyOtp: { url: '/auth/signin', method: 'POST' },
    },
    user: {
        lastSelectedTrip: (tripId: string) => ({ url: `/users/last-trip`, method: 'POST', data: { tripId } }),
    },
    trip: {
        upcoming: { url: '/trips/accepted', method: 'GET' },
        completed: { url: '/trips/completed', method: 'GET' },
        invites: { url: '/trips/invited', method: 'GET' },
        joinTrip: (tripId: string) => ({ url: `/trips/${tripId}/respond`, method: 'POST', data: { response: 'Accepted' } }),
        declineTrip: (tripId: string) => ({ url: `/trips/${tripId}/respond`, method: 'POST', data: { response: 'Declined' } }),
        details: (tripId: string) => ({ url: `/trips/${tripId}`, method: 'GET', }),
        members: (tripId: string) => ({ url: `/trips/${tripId}/members`, method: 'GET' }),
        sharedItems: (tripId: string) => ({ url: `/packing-items/${tripId}/shared`, method: 'GET' }),
        updateSharedItem: (itemId: string) => ({ url: `/packing-items/${itemId}`, method: 'PATCH' }),
        deleteItem: (itemId: string) => ({ url: `/packing-items/${itemId}`, method: 'DELETE' }),
        checklists: (tripId: string) => ({ url: `/checklists/${tripId}`, method: 'GET' }),
        createChecklist: (tripId: string) => ({ url: `/checklists/${tripId}`, method: 'POST' }),
        updateChecklist: (checklistId: string) => ({ url: `/checklists/${checklistId}`, method: 'PATCH' }),
    },
}