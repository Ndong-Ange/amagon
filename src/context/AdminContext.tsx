import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate token and get admin info
      axios.get('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setAdmin(response.data);
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/admin/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('adminToken', token);
    
    const adminInfo = await axios.get('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAdmin(adminInfo.data);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider 
      value={{ 
        admin, 
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};