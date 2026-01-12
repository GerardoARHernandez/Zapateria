import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../routes';
import { products } from '../data/products';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductItem from '../components/ProductItem';
import QRScanner from '../components/QRScanner';
import ProductModal from '../components/ProductModal';

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
  const streamRef = useRef(null);
  const { logout } = useAuth();

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

  // Verificar compatibilidad de cámara al cargar
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaDevices API no soportada en este navegador');
      setCameraError('Tu navegador no soporta acceso a la cámara');
    }
  }, []);

  // Limpiar cámara al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Listener para reintentar cámara
  useEffect(() => {
    const handleRetryCamera = () => {
      if (showQRScanner) {
        stopCamera();
        setTimeout(() => {
          const initCamera = async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
              });
              streamRef.current = stream;
              setIsCameraActive(true);
            } catch (error) {
              setCameraError('Error al reiniciar cámara');
            }
          };
          initCamera();
        }, 500);
      }
    };

    window.addEventListener('retryCamera', handleRetryCamera);
    return () => window.removeEventListener('retryCamera', handleRetryCamera);
  }, [showQRScanner]);

  // Iniciar cámara cuando se abre el scanner
  useEffect(() => {
    if (showQRScanner && isMobile) {
      const initCamera = async () => {
        try {
          // Verificar permisos primero
          if (navigator.permissions && navigator.permissions.query) {
            try {
              const permissions = await navigator.permissions.query({ name: 'camera' });
              
              if (permissions.state === 'denied') {
                setCameraError('Permiso de cámara denegado. Por favor, habilítalo en configuración.');
                return;
              }
            } catch (permError) {
              console.log('Permissions API no disponible, continuando...');
            }
          }

          // Obtener stream con mejor configuración
          const constraints = {
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;
          setIsCameraActive(true);
          
        } catch (error) {
          console.error('Camera error:', error);
          
          // Manejar errores específicos
          if (error.name === 'NotAllowedError') {
            setCameraError('Permiso de cámara denegado. Por favor, habilita los permisos en configuración.');
          } else if (error.name === 'NotFoundError') {
            setCameraError('No se encontró cámara trasera. Intenta con la frontal.');
            // Intentar con cámara frontal
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
              });
              streamRef.current = stream;
              setIsCameraActive(true);
            } catch (frontError) {
              setCameraError('No se pudo acceder a ninguna cámara');
            }
          } else if (error.name === 'NotSupportedError') {
            setCameraError('Tu navegador no soporta esta función.');
          } else if (error.name === 'NotReadableError') {
            setCameraError('La cámara está siendo usada por otra aplicación. Cierra otras apps y reintenta.');
          } else {
            setCameraError('Error: ' + (error.message || 'No se pudo acceder a la cámara'));
          }
        }
      };

      initCamera();

      // Cleanup function
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
          });
          streamRef.current = null;
        }
      };
    }
  }, [showQRScanner, isMobile]);

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
  const startQRScan = () => {
    console.log('startQRScan called');
    console.log('isMobile:', isMobile);
    console.log('showQRScanner will be true');
    
    setCameraError('');
    setQrCodeInput('');
    setIsCameraActive(false);
    setShowQRScanner(true);
  };

  // Detener cámara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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

  const handleRetryCamera = () => {
    setCameraError('');
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setTimeout(() => {
      const event = new Event('retryCamera');
      window.dispatchEvent(event);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header onLogout={handleLogout} />

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
          {/* QR Scanner Component */}
          <QRScanner
            showQRScanner={showQRScanner}
            isMobile={isMobile}
            cameraError={cameraError}
            isCameraActive={isCameraActive}
            qrCodeInput={qrCodeInput}
            onStopQRScan={stopQRScan}
            onSimulateQRDetection={simulateQRDetection}
            onManualQRSubmit={handleManualQRSubmit}
            onQrCodeInputChange={setQrCodeInput}
            streamRef={streamRef}
            onRetryCamera={handleRetryCamera}
          />

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
          
        </div>

        {/* Resultados de búsqueda */}
        <div className="mb-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductItem 
                  key={product.id} 
                  product={product} 
                  onOpenModal={openProductModal}
                  formatPrice={formatPrice}
                />
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

      {/* Footer Component */}
      <Footer />

      {/* Product Modal Component */}
      <ProductModal
        isModalOpen={isModalOpen}
        selectedProduct={selectedProduct}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onCloseModal={closeModal}
        onSelectSize={setSelectedSize}
        onSelectColor={setSelectedColor}
        onAddToCart={handleAddToCart}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default Home;