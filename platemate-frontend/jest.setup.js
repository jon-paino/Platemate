// Save the original console.error function
const originalConsoleError = console.error;

// Mock console.error to suppress specific warnings
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message) => {
    if (!message.includes("ReactDOMTestUtils.act is deprecated")) {
      originalConsoleError(message); // Call the original function safely
    }
  });
});

afterAll(() => {
  console.error.mockRestore(); // Restore the original function after tests
});

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
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
  })),
}));

// Mock window.matchMedia for jsdom compatibility
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
