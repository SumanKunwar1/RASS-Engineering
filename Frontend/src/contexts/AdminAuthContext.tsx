import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the AdminUser type
export interface AdminUser {
  email: string;
  name: string;
  // Add any other user properties you need
}

// Define the context type
interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Add this
  login: (userData: AdminUser) => void;
  logout: () => void;
}

// Create the context with a default value
const AdminContext = createContext<AdminContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Add default value
  login: () => {},
  logout: () => {},
});

// Custom hook to use the admin context
export const useAdmin = () => useContext(AdminContext);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AdminUser) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;