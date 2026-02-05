import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../routes';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QRScanner from '../components/QRScanner';
import ProductModal from '../components/ProductModal';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const { logout } = useAuth();

  // Detectar si es dispositivo móvil
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
              }
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
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play()
                .then(() => {
                  setIsCameraActive(true);
                  setCameraError('');
                })
                .catch(err => {
                  console.error('Error al reproducir video:', err);
                  setCameraError('Error al reproducir video: ' + err.message);
                });
            };
          } else {
            console.error('videoRef.current no está disponible');
            setIsCameraActive(true);
          }
          
        } catch (error) {
          console.error('Camera error:', error);
          
          if (error.name === 'NotAllowedError') {
            setCameraError('Permiso de cámara denegado. Por favor, habilita los permisos en configuración.');
          } else if (error.name === 'NotFoundError') {
            setCameraError('No se encontró cámara trasera. Intenta con la frontal.');
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
              });
              streamRef.current = stream;
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
              }
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

  // Función para buscar modelo en la API
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      alert('Por favor ingresa un número de modelo');
      return;
    }

    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await fetch(`https://systemweb.ddns.net/planet-shoes/api/Modelos?estilo=${searchTerm.trim()}`);
      
      if (!response.ok) {
        throw new Error(`Error en la consulta: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        // Procesar los datos de la API
        const processedProduct = processApiData(result.data, searchTerm.trim());
        setSelectedProduct(processedProduct);
        // Seleccionar la primera marca disponible
        const firstMarca = processedProduct.marcas[0]?.marca || '';
        setSelectedMarca(firstMarca);
        // Seleccionar el primer color de la primera marca
        const firstColor = processedProduct.marcas[0]?.colors[0]?.color || '';
        setSelectedColor(firstColor);
        setSelectedSize('');
        setIsModalOpen(true);
      } else {
        setApiError('No se encontró el modelo. Verifica el número e intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setApiError('Error al consultar el modelo. Verifica tu conexión e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para procesar los datos de la API 
  const processApiData = (apiData, modelo) => {
    if (!apiData || apiData.length === 0) return null;
    
    // Primero agrupar por marca
    const marcasMap = {};
    
    apiData.forEach(item => {
      const marcaKey = (item.marca || 'Sin marca').trim().toUpperCase();
      const colorKey = (item.color || 'Sin color').trim().toUpperCase();
      
      if (!marcasMap[marcaKey]) {
        marcasMap[marcaKey] = {
          marca: item.marca || 'Sin marca',
          colorsMap: {} // Ahora agrupamos colores dentro de cada marca
        };
      }
      
      // Agrupar por color dentro de la marca
      if (!marcasMap[marcaKey].colorsMap[colorKey]) {
        marcasMap[marcaKey].colorsMap[colorKey] = {
          color: item.color || 'Sin color',
          material: item.material || 'Sin material',
          descripcion: item.descripcion || `MODELO ${modelo}`,
          foto: item.foto || '',
          genero: item.genero || '',
          sizesByRange: {}, // Agrupar tamaños por rango
          allSizes: [] // Todas las tallas juntas
        };
      }
      
      // Convertir talla numérica a formato string (180 -> "18", 185 -> "18.5")
      const sizeStr = (parseInt(item.talla) / 10).toFixed(1).replace('.0', '');
      
      // Obtener o crear el rango
      const rango = item.rango || 'Sin rango';
      if (!marcasMap[marcaKey].colorsMap[colorKey].sizesByRange[rango]) {
        marcasMap[marcaKey].colorsMap[colorKey].sizesByRange[rango] = {
          rango: rango,
          precio: item.precio1 || 0,
          genero: item.genero || '',
          sizes: []
        };
      }
      
      // Agregar tamaño al rango correspondiente
      const existingSize = marcasMap[marcaKey].colorsMap[colorKey].sizesByRange[rango].sizes.find(s => s.size === sizeStr);
      if (!existingSize) {
        marcasMap[marcaKey].colorsMap[colorKey].sizesByRange[rango].sizes.push({
          size: sizeStr,
          stock: item.existencia || 0,
          precio: item.precio1 || 0
        });
        
        // También agregar a todas las tallas
        marcasMap[marcaKey].colorsMap[colorKey].allSizes.push({
          size: sizeStr,
          stock: item.existencia || 0,
          precio: item.precio1 || 0,
          rango: rango,
          genero: item.genero || ''
        });
      } else {
        // Sumar existencias si el tamaño ya existe
        existingSize.stock += item.existencia || 0;
        
        // Actualizar en allSizes también
        const allSize = marcasMap[marcaKey].colorsMap[colorKey].allSizes.find(s => s.size === sizeStr && s.rango === rango);
        if (allSize) {
          allSize.stock += item.existencia || 0;
        }
      }
    });

    // Procesar marcas
    const marcas = Object.values(marcasMap).map(marcaData => {
      // Procesar colores dentro de cada marca
      const colors = Object.values(marcaData.colorsMap).map(colorData => {
        // Ordenar todas las tallas por tamaño
        colorData.allSizes.sort((a, b) => {
          const sizeA = parseFloat(a.size);
          const sizeB = parseFloat(b.size);
          return sizeA - sizeB;
        });
        
        // Ordenar tamaños dentro de cada rango
        Object.values(colorData.sizesByRange).forEach(rangeData => {
          rangeData.sizes.sort((a, b) => {
            const sizeA = parseFloat(a.size);
            const sizeB = parseFloat(b.size);
            return sizeA - sizeB;
          });
        });
        
        // Calcular stock total para este color
        colorData.totalStock = colorData.allSizes.reduce((sum, size) => sum + size.stock, 0);
        
        // Obtener la primera foto disponible
        colorData.foto = colorData.foto || '';
        
        return colorData;
      });

      // Ordenar colores por nombre
      colors.sort((a, b) => a.color.localeCompare(b.color));
      
      // Calcular stock total para la marca
      marcaData.totalStock = colors.reduce((sum, color) => sum + color.totalStock, 0);
      marcaData.colors = colors;
      
      return marcaData;
    });

    // Ordenar marcas por nombre
    marcas.sort((a, b) => a.marca.localeCompare(b.marca));

    // Obtener información general del primer item
    const firstItem = apiData[0];
    
    // Crear objeto de producto procesado
    return {
      id: firstItem.estilo || modelo,
      name: `MODELO ${modelo}`,
      modelo: modelo,
      descripcion: firstItem.descripcion || `MODELO ${modelo}`,
      marcas: marcas,
      totalStock: marcas.reduce((sum, marca) => sum + marca.totalStock, 0),
      inStock: marcas.some(m => m.totalStock > 0),
      apiData: apiData // Guardamos los datos originales
    };
  };

  // Función para obtener el color seleccionado 
  const getSelectedColorData = () => {
    if (!selectedProduct || !selectedColor) return null;
    
    // Primero necesitamos saber qué marca está seleccionada
    // (en tu código actual no hay estado para marca seleccionada)
    // Asumiremos que mostramos todas las marcas juntas o seleccionamos la primera
    
    if (selectedProduct.marcas && selectedProduct.marcas.length > 0) {
      // Buscar en todas las marcas
      for (const marca of selectedProduct.marcas) {
        // Buscar el color que coincide EXACTAMENTE
        const colorData = marca.colors.find(c => 
          c.color.trim().toUpperCase() === selectedColor.trim().toUpperCase()
        );
        
        if (colorData) {
          return {
            ...colorData,
            marca: marca.marca // Incluir la marca en los datos
          };
        }
        
        // Si no encuentra exacto, buscar que contenga el color
        if (!colorData) {
          const partialColorData = marca.colors.find(c => 
            c.color.toUpperCase().includes(selectedColor.toUpperCase())
          );
          
          if (partialColorData) {
            return {
              ...partialColorData,
              marca: marca.marca
            };
          }
        }
      }
    }
    
    return null;
  };

  // Función auxiliar para obtener hex de color
  const getColorHex = (colorName) => {
    const colorMap = {
      'NEGRO': '#000000',
      'BLANCO': '#FFFFFF',
      'ROJO': '#FF0000',
      'AZUL': '#0000FF',
      'VERDE': '#00FF00',
      'CAFÉ': '#8B4513',
      'GRIS': '#808080',
      'AMARILLO': '#FFFF00',
      'NARANJA': '#FFA500',
      'MORADO': '#800080',
      'ROSA': '#FFC0CB',
      'BEIGE': '#F5F5DC',
      'MARINO': '#000080',
      'BORGOÑA': '#800020',
      'MERCURIO': '#E5E4E2',
      'PLATA': '#C0C0C0',
      'VINO': '#722F37',
      'CAMEL': '#C19A6B',
      'NEGRO TOTAL': '#000000',
      'FERRERO': '#8B4513', // Café similar
      'FEBRERO': '#8B4513'  // Café similar
    };
    
    const upperColor = colorName?.toUpperCase() || '';
    return colorMap[upperColor] || '#808080';
  };

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

  const handleLogout = () => {
    logout();
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    const firstColor = product.colors[0]?.color || '';
    setSelectedColor(firstColor);
    setSelectedSize('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedMarca(''); 
    setSelectedSize('');
    setSearchTerm('');
    setApiError('');
  };

  const startQRScan = () => {
    console.log('startQRScan called');
    console.log('isMobile:', isMobile);
    console.log('videoRef:', videoRef.current);
    
    setCameraError('');
    setQrCodeInput('');
    setIsCameraActive(false);
    setShowQRScanner(true);
  };

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

  const stopQRScan = () => {
    stopCamera();
    setShowQRScanner(false);
    setCameraError('');
    setQrCodeInput('');
  };

  const handleManualQRSubmit = (e) => {
    e.preventDefault();
    if (qrCodeInput.trim()) {
      processQRResult(qrCodeInput.trim());
    }
  };

  const processQRResult = (qrData) => {
    // Buscar por número de modelo en el QR
    const modelMatch = qrData.match(/\d+/);
    if (modelMatch) {
      const modelNumber = modelMatch[0];
      setSearchTerm(modelNumber);
      // Simular clic en buscar
      setTimeout(() => {
        document.querySelector('button[type="submit"]').click();
      }, 100);
    } else {
      alert(`No se encontró un número de modelo en el código: ${qrData}`);
    }
  };

  const simulateQRDetection = () => {
    const demoModels = ['01085', '35035', '31280', '31262'];
    const randomModel = demoModels[Math.floor(Math.random() * demoModels.length)];
    setQrCodeInput(randomModel);
    setSearchTerm(randomModel);
    // Simular clic en buscar después de un breve delay
    setTimeout(() => {
      document.querySelector('button[type="submit"]').click();
    }, 100);
  };

  // Función para enviar pedido a la API - CORREGIDA
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    // Obtener los datos del color seleccionado
    const selectedColorData = getSelectedColorData();
    
    if (!selectedProduct || !selectedColorData) {
      alert('Error: No hay producto seleccionado');
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const selectedSizeFloat = parseFloat(selectedSize);
      
      // Buscar en los datos originales de la API el artículo específico
      const foundItem = selectedProduct.apiData.find(item => {
        const itemColor = (item.color || '').trim().toUpperCase();
        const selectedColorUpper = (selectedColor || '').trim().toUpperCase();
        const itemSize = parseInt(item.talla) / 10;
        
        return itemColor === selectedColorUpper && 
              Math.abs(itemSize - selectedSizeFloat) < 0.1; // Tolerancia para decimales
      });

      if (!foundItem) {
        throw new Error('No se encontró el artículo específico');
      }

      // Preparar datos para la API de pedidos
      const pedidoData = {
        articulo: foundItem.id.trim(), // ID del artículo
        cantidad: 1, // Siempre 1
        precio: foundItem.precio1 || 0, // precio1 del modelo
        usuario: "SYS" // Siempre SYS por ahora
      };

      console.log('Enviando pedido:', pedidoData);

      // Enviar pedido a la API
      const response = await fetch('https://systemweb.ddns.net/planet-shoes/api/Pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert(`¡Pedido realizado con éxito!\n\nProducto: ${selectedProduct.name}\nModelo: ${selectedProduct.modelo}\nColor: ${selectedColor}\nTalla: ${selectedSize}\nPrecio: ${formatPrice(foundItem.precio1 || 0)}\n\nID del pedido: ${result.data?.id || 'N/A'}`);
        
        // Cerrar el modal después del pedido exitoso
        closeModal();
      } else {
        throw new Error(result.message || 'Error al procesar el pedido');
      }

    } catch (error) {
      console.error('Error al enviar pedido:', error);
      alert(`Error al realizar el pedido: ${error.message}`);
    } finally {
      setIsSubmittingOrder(false);
    }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Component */}
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <main className="grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Buscar Modelo
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ingresa el número de modelo o escanea el código QR para consultar disponibilidad
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
            videoRef={videoRef} 
          />

          {/* Search Bar - DISEÑO MEJORADO */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Campo de búsqueda */}
              <div className="grow relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value;
                    // Remover cualquier caracter que no sea número
                    const numericValue = value.replace(/[^\d]/g, '');
                    setSearchTerm(numericValue);
                  }}
                  placeholder="Ingresa el número de modelo (ej: 31262, 01085, 35035...)"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
              
              {/* Botones en fila para móvil, en línea para desktop */}
              <div className="flex gap-3">
                {/* Botón de búsqueda */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center min-w-30"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </div>
                  ) : (
                    'Buscar'
                  )}
                </button>
                
                {/* Botón de escanear QR (solo móvil) */}
                {isMobile && (
                  <button
                    type="button"
                    onClick={showQRScanner ? stopQRScan : startQRScan}
                    className={`flex-1 px-6 py-4 rounded-2xl font-medium flex items-center justify-center min-w-30 ${
                      showQRScanner 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <span className="mr-2 text-xl">{showQRScanner ? '✕' : '📱'}</span>
                    {showQRScanner ? 'Cerrar' : 'QR'}
                  </button>
                )}
              </div>
            </div>
          </form>          
          
          {/* Mensaje de error */}
          {apiError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
              {apiError}
            </div>
          )}
          
          {/* Instrucciones */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Modelos de ejemplo:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {['01085', '35035', '31280', '31262'].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => {
                      setSearchTerm(model);
                      // Disparar búsqueda automáticamente
                      setTimeout(() => {
                        document.querySelector('button[type="submit"]').click();
                      }, 100);
                    }}
                    className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Estado de carga */}
          {isLoading && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Consultando modelo...</span>
              </div>
            </div>
          )}
        </div>

        {/* Estado inicial (sin búsqueda) */}
        {!searchTerm && !isLoading && !apiError && (
          <div className="text-center py-12">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg max-w-md">
              <div className="text-6xl mb-6 text-gray-300">👟</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-3">Busca un modelo</h4>
              <p className="text-gray-600 mb-6">
                Ingresa el número de modelo en el buscador o escanea el código QR para ver disponibilidad, precios y tallas.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Ejemplos: 31262, 01085, 35035, 31280</p>
                <p>O usa el botón "Escanear QR" si tienes el código</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer Component */}
      <Footer />

      {/* Product Modal Component */}
      {selectedProduct && (
        <ProductModal
          isModalOpen={isModalOpen}
          selectedProduct={selectedProduct}
          selectedMarca={selectedMarca}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onCloseModal={closeModal}
          onSelectSize={setSelectedSize}
          onSelectColor={setSelectedColor}
          onSelectMarca={setSelectedMarca}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          getColorHex={getColorHex}
          buildImageUrl={buildImageUrl}
          getSelectedColorData={getSelectedColorData}
          isSubmittingOrder={isSubmittingOrder}
        />
      )}

      {/* Estilos CSS para el video */}
      <style jsx>{`
        @media (max-width: 640px) {
          video {
            transform: rotateY(180deg) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;