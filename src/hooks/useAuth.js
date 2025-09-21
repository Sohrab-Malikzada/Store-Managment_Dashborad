export function useAuth() {
  const login = async (email, password) => {
    // Fake auth
    return email === "admin@company.com" && password === "admin123";
  };

  return { login };
}