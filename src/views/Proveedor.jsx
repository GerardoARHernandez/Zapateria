import { useState, useEffect } from 'react';
import { useAuth } from '../routes';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Proveedor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosOriginales, setPedidosOriginales] = useState([]); // Guardar los datos originales de la API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para controlar el orden

  const obtenerPedidos = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://systemweb.ddns.net/planet-shoes/api/Pedidos');
      
      if (!response.ok) {
        throw new Error(`Error en la consulta: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setPedidosOriginales(result.data);
        // Por defecto, mostrar en el orden que viene de la API
        setPedidos(result.data);
        setOrdenAscendente(true); // Restablecer el estado de orden
      } else {
        setPedidosOriginales([]);
        setPedidos([]);
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      setError('Error al cargar los pedidos. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para alternar el orden
  const toggleOrden = () => {
    const nuevoOrden = !ordenAscendente;
    setOrdenAscendente(nuevoOrden);
    
    if (nuevoOrden) {
      // Orden ascendente (como viene de la API)
      setPedidos([...pedidosOriginales]);
    } else {
      // Orden descendente (invertir el array)
      setPedidos([...pedidosOriginales].reverse());
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Cargar pedidos al montar el componente
  useEffect(() => {
    obtenerPedidos();
  }, []);

  // Función para construir URL de imagen
  const buildImageUrl = (fotoPath) => {
    if (!fotoPath) return null;
    
    const cleanPath = fotoPath.replace(/\\\\/g, '/').replace(/\\/g, '/');
    const fileName = cleanPath.split('/').pop();
    
    if (fileName) {
      return `https://systemweb.ddns.net/planet-shoes/Fotos/${fileName}`;
    }
    
    return null;
  };

  // Formatear talla
  const formatTalla = (talla) => {
    return (parseInt(talla) / 10).toFixed(1).replace('.0', '');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-blue-100 to-blue-200">
      <Header onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
                Panel de Gestión
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-600">
                  Proveedor: <span className="font-semibold text-blue-800">{user?.email}</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-slate-500">
                  {new Date().toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">  
              <button
                onClick={obtenerPedidos}
                disabled={isLoading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                    <span>Sincronizando</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Actualizar Datos</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Órdenes Registradas</h3>
                  <p className="text-sm text-slate-600">
                    {pedidos.length} pedidos en total • Orden: {ordenAscendente ? 'Ascendente' : 'Descendente'}
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  {isLoading ? 'Actualizando...' : ''}
                </div>
                <button
                  onClick={toggleOrden}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {ordenAscendente ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    )}
                  </svg>
                </button>

              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                  <span className="text-slate-600 font-medium">Cargando información de pedidos</span>
                  <p className="text-slate-500 text-sm mt-2">Sincronizando con el servidor...</p>
                </div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium text-lg mb-2">No se encontraron pedidos</span>
                  <p className="text-slate-500 max-w-md">
                    No hay pedidos registrados en este momento.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pedidos.map((pedido, index) => {
                  const imageUrl = buildImageUrl(pedido.foto);
                  const tallaFormateada = formatTalla(pedido.talla);
                  
                  return (
                    <div key={`${pedido.articulo}-${index}`} className="p-6 hover:bg-blue-100/70 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-48">
                          <div className="flex items-start gap-4">
                            <div className="shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                              {imageUrl ? (
                                <img 
                                  src={imageUrl} 
                                  alt={pedido.modeloDescripcion} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                      <div class="flex items-center justify-center h-full w-full bg-gray-100">
                                        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-100">
                                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="lg:flex-1 bg-blue-100/60 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-3">Producto</h4>
                              <div className="space-y-2">
                                <div className="text-sm text-slate-900 font-medium">{pedido.modeloDescripcion}</div>
                                <div className="text-xs text-slate-600">{pedido.marca}</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-3">Especificaciones</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Color:</span>
                                  <span className="text-sm text-slate-900 font-medium">{pedido.color}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Material:</span>
                                  <span className="text-sm text-slate-900">{pedido.material}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Talla:</span>
                                  <span className="text-sm font-bold text-slate-900">{tallaFormateada}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-3">Inventario</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-slate-600">Surtido</span>
                                    <span className="text-sm font-medium text-emerald-600">{pedido.surtido || 0} un.</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-600">Por Surtir</span>
                                    <span className="text-sm font-medium text-amber-600">{pedido.porSurtir || 0} un.</span>
                                  </div>
                                </div>
                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ 
                                      width: `${pedido.surtido > 0 ? Math.min(100, (pedido.surtido / (pedido.surtido + pedido.porSurtir)) * 100) : 0}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-48">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Vendedor</h4>
                              <div className="flex items-center gap-3">                                
                                <div>
                                  <div className="text-sm text-slate-900 font-medium">{pedido.vendedor?.nombre || 'N/A'}</div>
                                  <div className="text-xs text-slate-500">ID: {pedido.vendedor?.id || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Proveedor;