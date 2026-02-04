import { useState, useEffect } from 'react';
import { useAuth } from '../routes';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Proveedor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const [filtroVendedor, setFiltroVendedor] = useState('todos');

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
        setPedidos(result.data);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      setError('Error al cargar los pedidos. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
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
    
    // Limpiar la ruta
    const cleanPath = fotoPath.replace(/\\\\/g, '/').replace(/\\/g, '/');
    
    // Extraer nombre de archivo
    const fileName = cleanPath.split('/').pop();
    
    if (fileName) {
      return `https://systemweb.ddns.net/planet-shoes/Fotos/${fileName}`;
    }
    
    return null;
  };

  // Calcular estadísticas
  const totalPedidos = pedidos.length;
  const porSurtirTotal = pedidos.reduce((total, pedido) => total + (pedido.porSurtir || 0), 0);
  const surtidoTotal = pedidos.reduce((total, pedido) => total + (pedido.surtido || 0), 0);
  const porcentajeSurtido = totalPedidos > 0 ? Math.round((surtidoTotal / (surtidoTotal + porSurtirTotal)) * 100) : 0;

  // Obtener vendedores únicos para el filtro
  const vendedoresUnicos = [...new Set(pedidos.map(p => p.vendedor?.id || 'SYS'))];

  // Filtrar pedidos solo por vendedor (se eliminó el filtro por estado)
  const pedidosFiltrados = pedidos.filter(pedido => {
    const pasaVendedor = filtroVendedor === 'todos' || pedido.vendedor?.id === filtroVendedor;
    
    return pasaVendedor;
  });

  // Función para obtener el estado de un pedido
  const getEstadoPedido = (pedido) => {
    if (pedido.surtido > 0 && pedido.porSurtir === 0) return 'completado';
    if (pedido.surtido > 0 && pedido.porSurtir > 0) return 'en-proceso';
    return 'pendiente';
  };

  // Función para obtener el color del estado
  const getColorEstado = (estado) => {
    switch(estado) {
      case 'completado': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'en-proceso': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'pendiente': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-blue-100 to-blue-200">
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Encabezado del Panel */}
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

          {/* Mensajes de error */}
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

          {/* Filtros */}
          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-400/70">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Filtros de Pedidos</h3>
                  <p className="text-sm text-slate-600">Selecciona criterios para filtrar la lista</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-50">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vendedor</label>
                    <select
                      value={filtroVendedor}
                      onChange={(e) => setFiltroVendedor(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="todos">Todos los vendedores</option>
                      <option value="SYS">Sistema</option>
                      {vendedoresUnicos.filter(v => v !== 'SYS').map(vendedor => (
                        <option key={vendedor} value={vendedor}>{vendedor}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de pedidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Órdenes Registradas</h3>
                  <p className="text-sm text-slate-600">
                    Mostrando {pedidosFiltrados.length} de {totalPedidos} pedidos
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  {isLoading ? 'Actualizando...' : ''}
                </div>
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
            ) : pedidosFiltrados.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium text-lg mb-2">No se encontraron pedidos</span>
                  <p className="text-slate-500 max-w-md">
                    {filtroVendedor !== 'todos' 
                      ? 'Intenta cambiar los filtros para encontrar más resultados.'
                      : 'No hay pedidos registrados en este momento.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pedidosFiltrados.map((pedido, index) => {
                  const imageUrl = buildImageUrl(pedido.foto);
                  const tallaFormateada = (parseInt(pedido.talla) / 10).toFixed(1).replace('.0', '');
                  const estado = getEstadoPedido(pedido);
                  
                  return (
                    <div key={`${pedido.articulo}-${index}`} className="p-6 hover:bg-blue-100/70 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Imagen y artículo */}
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

                        {/* Información del producto */}
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

                        {/* Vendedor y acciones */}
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