export const createClient = jest.fn(() => ({
    auth: {
        signIn: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    })),
}));
