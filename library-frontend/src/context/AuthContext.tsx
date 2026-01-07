import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
// import axiosInstance from '../utils/axiosInstance'; // Şimdilik kapalı, login yaparken açacağız

// Kullanıcı Tipi
interface User {
  id: number;
  email: string;
  role: 'admin' | 'member';
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // DÜZELTME: useEffect yerine Lazy Initialization kullanıyoruz.
  // Bu yöntem "setState synchronously within an effect" hatasını çözer ve daha performanslıdır.
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("User parse error", error);
        return null;
      }
    }
    return null;
  });

  // Giriş Fonksiyonu
  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    // Sayfayı yenilemeye gerek yok, state değiştiği için React otomatik günceller
    // Ama axiosInstance header'ını güncellemek gerekebilir (ileride bakacağız)
  };

  // Çıkış Fonksiyonu
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};