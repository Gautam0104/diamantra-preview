const useAuth = () => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: () => Promise.resolve({ success: false }),
  logout: () => Promise.resolve({ success: true }),
  setUser: () => {},
});

export default useAuth;
