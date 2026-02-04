// src/components/Header.jsx
import { useAuth } from '../routes';

const Header = ({ onLogout }) => {
  const { user } = useAuth();

  return (
    <header className="bg-blue-50 shadow-md">
      <div className="container mx-auto px-5 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-5">
            <img 
              src="/images/logo.jpeg" 
              alt="Logo Planet Shoes" 
              className="w-24 h-auto rounded-lg border border-gray-200"                
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Planet Shoes</h1>
              <p className="text-xs text-gray-500">Tu calzado perfecto</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              Bienvenido, <span className="font-semibold text-blue-600">{user?.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;