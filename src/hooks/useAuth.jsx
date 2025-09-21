
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

// Mock users for authentication
const mockUsers = [
  { id: 'U001', name: 'Admin User', email: 'admin@company.com', password: 'admin123', role: 'admin' },
  { id: 'U002', name: 'Cashier User', email: 'cashier@company.com', password: 'cashier123', role: 'cashier' },
  { id: 'U003', name: 'POS User', email: 'pos@company.com', password: 'pos123', role: 'pos' },
  { id: 'U004', name: 'Data Entry User', email: 'data@company.com', password: 'data123', role: 'data_entry' }
];

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    // Find user in mock data
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      userRole: user && user.role ? user.role : null,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const hasPermission = (permission) => {
    if (!context.user) return false;
    // Map roles to permissions
    const rolePermissions = {
      admin: ['dashboard', 'sales', 'inventory', 'employees', 'analytics', 'payroll', 'debts', 'purchases', 'userManagement'],
      cashier: ['dashboard', 'sales', 'debts'],
      pos: ['dashboard', 'sales', 'inventory', 'debts'],
      data_entry: ['dashboard', 'inventory', 'purchases']
    };
    return rolePermissions[context.user.role] && rolePermissions[context.user.role].includes(permission);
  };

  return {
    ...context,
    hasPermission
  };
}