import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Ingresa un correo electrónico válido');
      setIsLoading(false);
      return;
    }

    // Credenciales especiales para proveedor
    if (email === 'provedor@c.com' && password) {
      // Cualquier contraseña funciona para este correo
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula proceso de login
        login(email, 'proveedor'); // Login con rol 'proveedor'
        navigate('/proveedor'); // Redirige a la ruta de proveedor
      } catch (err) {
        setError('Error al iniciar sesión. Intenta nuevamente.');
        setIsLoading(false);
      }
      return;
    }

    // Para otros usuarios (validación normal)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Simulamos inicio de sesión exitoso con un pequeño delay
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula proceso de login
      login(email, 'user'); // Login con rol 'user' por defecto
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-auto rounded-full bg-white shadow-xl p-3 border border-gray-200">
            <img 
              src="/images/logo.jpeg" 
              alt="Logo Planet Shoes" 
              className="w-full h-full rounded-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Planet Shoes
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Tu destino para encontrar el calzado perfecto
            </p>
          </div>
        </div>
      </div>

      {/* Card de login */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        {/* Header decorativo */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 h-2"></div>
        
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu cuenta para explorar nuestro catálogo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-gray-400"
                  placeholder="tucorreo@ejemplo.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-gray-400"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Nota para credenciales de prueba */}
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Credenciales de prueba:</p>
              <p>• Proveedor: provedor@c.com (cualquier contraseña)</p>
              <p>• Usuario normal: cualquier correo con contraseña de 6+ caracteres</p>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>   
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;