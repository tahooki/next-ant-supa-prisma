// contexts/UserContext.tsx
import { User } from 'models/user.model';
import { createContext, ReactNode, useContext } from 'react';

interface AuthContextType {
  user: User | any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, user }: { children: ReactNode; user: User | any | null }) => {
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
