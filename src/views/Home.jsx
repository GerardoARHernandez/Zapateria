import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../routes';
import { products } from '../data/products';
import Footer from '../components/Footer';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { user, logout } = useAuth();

  // Detectar si es dispositivo móvil
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Filtrar productos basado en búsqueda
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm]);

  // Limpiar cámara al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    logout();
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]?.name || '');
    setSelectedSize('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedSize('');
  };

  // Iniciar cámara para escanear QR
  const startQRScan = async () => {
    setShowQRScanner(true);
    setCameraError('');
    setQrCodeInput('');
    
    try {
      // Detener cámara si ya está activa
      if (streamRef.current) {
        stopCamera();
      }

      // Solicitar permisos y acceder a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Usar cámara trasera en móviles
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsCameraActive(false);
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Detener escaneo QR
  const stopQRScan = () => {
    stopCamera();
    setShowQRScanner(false);
    setCameraError('');
    setQrCodeInput('');
  };

  // Manejar entrada manual de código QR
  const handleManualQRSubmit = (e) => {
    e.preventDefault();
    if (qrCodeInput.trim()) {
      processQRResult(qrCodeInput.trim());
    }
  };

  // Procesar resultado del QR
  const processQRResult = (qrData) => {
    // Buscar producto por SKU
    let foundProduct = products.find(p => 
      p.sku.toLowerCase().includes(qrData.toLowerCase()) || 
      p.name.toLowerCase().includes(qrData.toLowerCase())
    );
    
    // Si no se encuentra por SKU, buscar por número de modelo
    if (!foundProduct) {
      const modelMatch = qrData.match(/\d+/);
      if (modelMatch) {
        const modelNumber = modelMatch[0];
        foundProduct = products.find(p => 
          p.name.includes(modelNumber)
        );
      }
    }
    
    if (foundProduct) {
      stopCamera();
      openProductModal(foundProduct);
      setShowQRScanner(false);
    } else {
      alert(`No se encontró un producto con el código: ${qrData}`);
    }
  };

  // Simular detección de QR (para demo)
  const simulateQRDetection = () => {
    const demoProducts = ['CASUAL-3390', 'FORMAL-5018', 'DEPORT-5021'];
    const randomQR = demoProducts[Math.floor(Math.random() * demoProducts.length)];
    setQrCodeInput(randomQR);
    processQRResult(randomQR);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }
    
    alert(`¡Producto agregado!\n${selectedProduct.name}\nColor: ${selectedColor}\nTalla: ${selectedSize}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(price);
  };

  const ProductItem = ({ product }) => {
    const mainColor = product.colors[0]?.hex || '#808080';
    
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 relative"
        onClick={() => openProductModal(product)}
      >
        {/* Indicador QR */}
        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <span className="mr-1">📱</span>
          QR
        </div>
        
        {/* Imagen del producto */}
        <div 
          className="h-48 flex flex-col items-center justify-center"
          style={{ backgroundColor: `${mainColor}20` }}
        >
          <div className="text-6xl text-gray-700 mb-2">👞</div>
          <div className="text-xs text-gray-500 px-2 text-center">Haz clic para ver detalles</div>
        </div>
        
        {/* Información básica */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.category}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-700">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                -{product.discount}%
              </span>
            )}
          </div>
          
          {/* Código QR pequeño */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">SKU: {product.sku}</span>
              <span className="text-xs text-gray-400">Código: {product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-5 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <img 
                src="/images/logo.jpeg" 
                alt="Logo Planet Shoes" 
                className="w-20 h-16 rounded-lg object-cover border border-gray-200"                
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
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Buscar Modelo
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Encuentra el modelo perfecto - Escanea un código QR o busca manualmente
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          {/* QR Scanner Section */}
          {showQRScanner && isMobile && (
            <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lector de Código QR</h3>
                <button
                  onClick={stopQRScan}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="relative">
                {/* Vista de la cámara */}
                <div className="border-2 border-blue-500 rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-900 relative">
                    {isCameraActive ? (
                      <>
                        {/* Video de la cámara */}
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                        />
                        
                        {/* Marco de escaneo superpuesto */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-48 h-48">
                            {/* Marco del scanner con esquinas */}
                            <div className="absolute inset-0 border-2 border-green-500 rounded-lg opacity-80"></div>
                            
                            {/* Esquinas decorativas */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
                            
                            {/* Línea de escaneo animada */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-scan rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Instrucciones */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center text-sm">
                          Enfoca el código QR dentro del marco
                        </div>
                      </>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-white">
                        {cameraError ? (
                          <>
                            <div className="text-4xl mb-3">⚠️</div>
                            <p className="font-medium mb-2">{cameraError}</p>
                            <p className="text-sm text-gray-300">Usa la entrada manual de código</p>
                          </>
                        ) : (
                          <>
                            <div className="text-4xl mb-3">📱</div>
                            <p className="font-medium mb-2">Iniciando cámara...</p>
                            <p className="text-sm text-gray-300">Por favor, permite el acceso a la cámara</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Botón para simular detección (solo demo) */}
                <div className="mb-4">
                  <button
                    onClick={simulateQRDetection}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
                  >
                    <span className="mr-2">🔍</span>
                    Simular detección de QR (Demo)
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    En una app real, aquí se detectaría automáticamente el código QR
                  </p>
                </div>
                
                {/* Entrada manual de código QR */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">O ingresa el código manualmente:</p>
                  <form onSubmit={handleManualQRSubmit} className="flex">
                    <input
                      type="text"
                      value={qrCodeInput}
                      onChange={(e) => setQrCodeInput(e.target.value)}
                      placeholder="Ej: CASUAL-3390"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Buscar
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-1">
                    Prueba con: CASUAL-3390, FORMAL-5018, DEPORT-5021
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar modelo (ej: MOD. 3390, Casual, Formal...)"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white pr-32"
              />
              
              {/* Botón de búsqueda */}
              <button
                type="submit"
                className="absolute right-24 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Buscar
              </button>
              
              {/* Botón de escanear QR (solo móvil) */}
              {isMobile && (
                <button
                  type="button"
                  onClick={showQRScanner ? stopQRScan : startQRScan}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl font-medium flex items-center ${
                    showQRScanner 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <span className="mr-2">{showQRScanner ? '✕' : '📱'}</span>
                  {showQRScanner ? 'Cerrar' : 'Escanear QR'}
                </button>
              )}
            </div>
          </form>
          
          {/* Contador de resultados */}
          <div className="mt-4 text-center">
            <span className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </span>
          </div>
          
          {/* Información QR para desktop */}
          {!isMobile && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <div className="text-blue-600 text-2xl mr-3">📱</div>
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">Función móvil disponible</p>
                  <p className="text-xs text-blue-700">
                    En dispositivos móviles puedes usar el botón "Escanear QR" para activar 
                    la cámara y escanear códigos QR de productos (requiere permisos de cámara).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        <div className="mb-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 text-gray-300">👟</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h4>
              <p className="text-gray-600 mb-6">Intenta con otros términos de búsqueda</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Ver todos los productos
                </button>
                {isMobile && (
                  <button 
                    onClick={startQRScan}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
                  >
                    <span className="mr-2">📱</span>
                    Escanear QR
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal de Detalles del Producto */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Encabezado del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800 mr-3">{selectedProduct.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                  SKU: {selectedProduct.sku}
                </span>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Información del producto */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gray-600 text-sm">{selectedProduct.category}</span>
                    <div className="text-3xl font-bold text-blue-800 mt-1">
                      {formatPrice(selectedProduct.price)}
                    </div>
                    {selectedProduct.discount > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        Antes: {formatPrice(selectedProduct.price * (1 + selectedProduct.discount/100))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {selectedProduct.inStock ? 'Disponible' : 'Agotado'}
                    </span>
                    {selectedProduct.isNew && (
                      <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedProduct.description}</p>
              </div>
              
              {/* Sección de Tallas */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tallas Disponibles</h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
                  {selectedProduct.sizes.map((sizeItem, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sizeItem.size)}
                      className={`p-3 text-center rounded-lg border-2 transition-all ${
                        selectedSize === sizeItem.size
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : sizeItem.stock > 0
                          ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={sizeItem.stock === 0}
                    >
                      <div className="font-semibold">{sizeItem.size}</div>
                      <div className={`text-xs ${sizeItem.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {sizeItem.stock > 0 ? `${sizeItem.stock} disp.` : 'Agotado'}
                      </div>
                    </button>
                  ))}
                </div>
                
                {!selectedSize && (
                  <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg text-sm">
                    ⚠️ Selecciona una talla para continuar
                  </div>
                )}
              </div>
              
              {/* Sección de Colores */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Colores Disponibles</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">{color.name}</div>
                        <div className="text-sm text-gray-600">{color.stock} unidades</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock || !selectedSize}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors shadow-sm ${
                    selectedProduct.inStock && selectedSize
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedProduct.inStock 
                    ? selectedSize 
                      ? `Agregar al Carrito - ${formatPrice(selectedProduct.price)}`
                      : 'Selecciona una talla'
                    : 'Producto Agotado'}
                </button>
                
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >3
                  Seguir Explorando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animación de escaneo */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(192px);
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;