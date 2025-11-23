export const KEYS = {
    user: ['user'],
    trips: {
        ALL: ['trips'],
        upcoming: ['trips', 'upcoming'],
        completed: ['trips', 'completed'],
        invites: ['trips', 'invites'],
    },
    trip: {
        ALL: ['trip'],
        details: (tripId: string) => (['trip', 'details', tripId]),
        members: (tripId: string) => (['trip', 'members', tripId]),
        sharedItems: (tripId: string) => (['trip', 'sharedItems', tripId]),
    }
}