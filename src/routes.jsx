import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import Login from './views/Login';
import Home from './views/Home';
import Proveedor from './views/Proveedor';

// Contexto para manejar el estado de autenticación
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null); // Para el nombre del vendedor

  const login = (username, role = 'user', displayName = null) => {
    setIsAuthenticated(true);
    setUser({ 
      email: displayName || username, // Usamos displayName si está disponible
      username // También guardamos el ID de usuario
    });
    setUserRole(role);
    setUserName(displayName || username);
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', username);
    localStorage.setItem('userRole', role);
    if (displayName) {
      localStorage.setItem('displayName', displayName);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    setUserName(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('displayName');
  };

  // Verificar si hay sesión guardada
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const username = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    const displayName = localStorage.getItem('displayName');
    
    if (auth === 'true' && username) {
      setIsAuthenticated(true);
      setUser({ 
        email: displayName || username,
        username 
      });
      setUserRole(role || 'user');
      setUserName(displayName || username);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      userRole, 
      userName, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente para proteger rutas
const ProtectedRoute = ({ children, allowedRoles = ['user'] }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedor"
            element={
              <ProtectedRoute allowedRoles={['proveedor']}>
                <Proveedor />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;