import { useState, useEffect } from 'react';

const ProductModal = ({ 
  isModalOpen, 
  selectedProduct, 
  selectedColor, 
  selectedSize, 
  selectedMarca,
  onCloseModal, 
  onSelectSize, 
  onSelectColor, 
  onSelectMarca,
  onAddToCart,
  formatPrice,
  getColorHex,
  buildImageUrl,
  getSelectedColorData,
  isSubmittingOrder,
  searchTerm,
  onSearchSugerido
}) => {
  // Todos los hooks deben ir antes de cualquier return condicional
  const [modelosSugeridos, setModelosSugeridos] = useState([]);
  const [isLoadingSugeridos, setIsLoadingSugeridos] = useState(false);
  const [errorSugeridos, setErrorSugeridos] = useState('');
  const [imageError, setImageError] = useState(false);

  // Resetear error de imagen cuando cambia el color
  useEffect(() => {
    setImageError(false);
  }, [selectedColor]);

  // Cargar modelos sugeridos cuando cambia el searchTerm
  useEffect(() => {
    const cargarModelosSugeridos = async () => {
      if (!searchTerm) return;
      
      setIsLoadingSugeridos(true);
      setErrorSugeridos('');
      
      try {
        const response = await fetch(`https://systemweb.ddns.net/planet-shoes/api/Modelos/estilo/${searchTerm}/sugeridos`);
        
        if (!response.ok) {
          throw new Error(`Error al cargar sugeridos: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setModelosSugeridos(result.data);
        } else {
          setModelosSugeridos([]);
        }
      } catch (error) {
        console.error('Error al cargar modelos sugeridos:', error);
        setErrorSugeridos('No se pudieron cargar los modelos sugeridos');
      } finally {
        setIsLoadingSugeridos(false);
      }
    };

    cargarModelosSugeridos();
  }, [searchTerm]);

  // Manejar cambios en la marca
  useEffect(() => {
    // Si hay una marca seleccionada pero no hay color seleccionado,
    // seleccionar el primer color de esa marca
    if (selectedMarca && !selectedColor && selectedProduct?.marcas) {
      const marcaSeleccionada = selectedProduct.marcas.find(m => m.marca === selectedMarca);
      if (marcaSeleccionada?.colors?.length > 0) {
        onSelectColor(marcaSeleccionada.colors[0]?.color || '');
      }
    }
  }, [selectedMarca, selectedProduct, selectedColor, onSelectColor]);

  // Ahora sí podemos hacer el return condicional
  if (!isModalOpen || !selectedProduct) return null;

  const selectedColorData = getSelectedColorData();
  
  // Función para codificar correctamente la URL
  const getEncodedImageUrl = () => {
    if (!selectedColorData?.foto) return null;
    
    try {
      // Decodificar primero por si ya viene parcialmente codificada
      const decodedUrl = decodeURIComponent(selectedColorData.foto);
      // Luego codificar correctamente los espacios y caracteres especiales
      return encodeURI(decodedUrl);
    } catch (error) {
      // Si hay error en la decodificación, intentar codificar directamente
      return encodeURI(selectedColorData.foto);
    }
  };

  const imageUrl = getEncodedImageUrl();

  // Encontrar el precio para la talla seleccionada
  const getSelectedPrice = () => {
    if (!selectedSize || !selectedColorData || !selectedColorData.allSizes) return 0;
    
    const sizeItem = selectedColorData.allSizes.find(item => 
      Math.abs(parseFloat(item.size) - parseFloat(selectedSize)) < 0.1
    );
    
    return sizeItem?.precio || 0;
  };

  const selectedPrice = getSelectedPrice();

  // Función para construir URL de imagen de modelo sugerido
  const buildSugeridoImageUrl = (fotoPath) => {
    if (!fotoPath) return null;
    
    try {
      // Limpiar la ruta
      const cleanPath = fotoPath.replace(/\\\\/g, '/').replace(/\\/g, '/');
      const fileName = cleanPath.split('/').pop();
      
      if (fileName) {
        return `https://systemweb.ddns.net/planet-shoes/Fotos/${fileName}`;
      }
    } catch (error) {
      console.error('Error construyendo URL de imagen sugerida:', error);
    }
    
    return null;
  };

  // Función para manejar clic en modelo sugerido
  const handleSugeridoClick = (estiloSugerido) => {
    if (onSearchSugerido) {
      onSearchSugerido(estiloSugerido);
    }
  };

  // Agrupar modelos sugeridos por estiloSugerido
  const agruparPorEstilo = (modelos) => {
    const grupos = {};
    modelos.forEach(modelo => {
      if (!grupos[modelo.estiloSugerido]) {
        grupos[modelo.estiloSugerido] = [];
      }
      grupos[modelo.estiloSugerido].push(modelo);
    });
    return grupos;
  };

  const gruposPorEstilo = agruparPorEstilo(modelosSugeridos);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado del Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{selectedProduct.name}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full self-start sm:self-auto">
              Modelo: {selectedProduct.modelo}
            </span>
          </div>
          <button 
            onClick={onCloseModal}
            className="text-gray-500 hover:text-gray-700 text-2xl shrink-0"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Sección superior con imagen e información */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Imagen del producto */}
            <div className="lg:w-1/3">
              <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                {imageUrl && !imageError ? (
                  <img 
                    src={imageUrl} 
                    alt={selectedProduct.name} 
                    className="w-full h-64 sm:h-72 object-cover"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-64 sm:h-72 bg-gray-100">
                    <div className="text-6xl text-gray-400 mb-2">👟</div>
                    <div className="text-gray-500 text-sm">Imagen no disponible</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Información del producto */}
            <div className="lg:w-2/3 space-y-6">
              {/* Descripción y detalles */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {selectedColorData?.descripcion || selectedProduct.descripcion}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedColorData?.marca && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {selectedColorData.marca}
                    </span>
                  )}
                  {selectedColorData?.material && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {selectedColorData.material}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Mostrar precio si hay talla seleccionada */}
              {selectedSize && selectedPrice > 0 && (
                <div className="text-2xl sm:text-3xl font-bold text-blue-800">
                  {formatPrice(selectedPrice)}
                </div>
              )}
              
              {/* Disponibilidad */}
              <div className="flex items-center">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  selectedProduct.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedProduct.inStock ? 'Disponible' : 'Agotado'}
                </span>
              </div>
            </div>
          </div>
          
          {selectedProduct.marcas && selectedProduct.marcas.length > 0 && (
            <div className="mb-8">
              {/* Selector de Marca (si hay más de una) */}
              {selectedProduct.marcas.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Marcas Disponibles</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.marcas.map((marcaData, idx) => (
                      <button
                        key={`${marcaData.marca}-${idx}`}
                        onClick={() => {
                          onSelectMarca(marcaData.marca);
                          // Seleccionar el primer color de esta marca
                          const firstColorOfMarca = marcaData.colors[0]?.color || '';
                          onSelectColor(firstColorOfMarca);
                          onSelectSize('');
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedMarca === marcaData.marca
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {marcaData.marca} ({marcaData.totalStock})
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Colores de la marca seleccionada */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Colores Disponibles {selectedMarca && `- ${selectedMarca}`}
                  </h3>
                  {selectedColor && (
                    <span className="text-sm text-blue-600 font-medium">
                      Seleccionado: <span className="font-bold">{selectedColor}</span>
                    </span>
                  )}
                </div>
                
                {/* Mostrar colores de la marca seleccionada o de todas las marcas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(selectedMarca 
                    ? selectedProduct.marcas.find(m => m.marca === selectedMarca)?.colors || []
                    : selectedProduct.marcas.flatMap(m => m.colors)
                  ).map((colorData, idx) => (
                    <button
                      key={`${colorData.color}-${idx}`}
                      onClick={() => {
                        onSelectColor(colorData.color);
                        onSelectSize('');
                      }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        selectedColor === colorData.color
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {/* Color indicator */}
                      <div 
                        className="w-12 h-12 rounded-full border border-gray-300 shadow-sm shrink-0"
                        style={{ backgroundColor: getColorHex(colorData.color) }}
                        title={colorData.color}
                      />
                      
                      {/* Color details */}
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{colorData.color}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {colorData.material}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {colorData.totalStock} unidades disponibles
                        </div>
                      </div>
                      
                      {selectedColor === colorData.color && (
                        <div className="text-blue-600 text-lg">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Sección de Tallas por Rango (solo si hay color seleccionado) */}
          {selectedColorData && selectedColorData.allSizes && selectedColorData.allSizes.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Tallas Disponibles - {selectedColorData.color}
                </h3>
                {selectedSize && (
                  <span className="text-sm text-blue-600 font-medium">
                    Talla seleccionada: <span className="font-bold">{selectedSize}</span>
                  </span>
                )}
              </div>
              
              {/* Mostrar todas las tallas juntas */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Todas las tallas:</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {selectedColorData.allSizes.map((sizeItem, idx) => (
                    <button
                      key={`${sizeItem.size}-${sizeItem.rango}-${idx}`}
                      onClick={() => onSelectSize(sizeItem.size)}
                      className={`p-3 sm:p-4 text-center rounded-lg border-2 transition-all ${
                        selectedSize === sizeItem.size
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : sizeItem.stock > 0
                          ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={sizeItem.stock === 0}
                      title={`Rango: ${sizeItem.rango} | Género: ${sizeItem.genero}`}
                    >
                      <div className="font-semibold text-sm sm:text-base">{sizeItem.size}</div>
                      <div className={`text-xs mt-1 ${sizeItem.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {sizeItem.stock > 0 ? `${sizeItem.stock} disp.` : 'Agotado'}
                      </div>
                      {sizeItem.precio > 0 && (
                        <div className="text-xs text-blue-600 font-bold mt-1">
                          {formatPrice(sizeItem.precio)}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mostrar tallas agrupadas por rango (opcional) */}
              {selectedColorData.sizesByRange && Object.keys(selectedColorData.sizesByRange).length > 1 && (
                <div className="space-y-6">
                  {Object.values(selectedColorData.sizesByRange).map((rangeData, idx) => (
                    <div key={`${rangeData.rango}-${idx}`} className="border-t border-gray-200 pt-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-3">
                        {rangeData.rango} {rangeData.genero && `- ${rangeData.genero}`}
                        {rangeData.precio > 0 && (
                          <span className="ml-2 text-blue-600 font-bold">
                            {formatPrice(rangeData.precio)}
                          </span>
                        )}
                      </h4>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {rangeData.sizes.map((sizeItem, sizeIdx) => (
                          <button
                            key={`${sizeItem.size}-${rangeData.rango}-${sizeIdx}`}
                            onClick={() => onSelectSize(sizeItem.size)}
                            className={`p-3 sm:p-4 text-center rounded-lg border-2 transition-all ${
                              selectedSize === sizeItem.size
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                                : sizeItem.stock > 0
                                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={sizeItem.stock === 0}
                          >
                            <div className="font-semibold text-sm sm:text-base">{sizeItem.size}</div>
                            <div className={`text-xs mt-1 ${sizeItem.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {sizeItem.stock > 0 ? `${sizeItem.stock} disp.` : 'Agotado'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!selectedSize && selectedColorData.totalStock > 0 && (
                <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg text-sm flex items-center gap-2 mt-4">
                  <span>⚠️</span>
                  <span>Selecciona una talla para continuar</span>
                </div>
              )}
            </div>
          )}
          
          {/* SECCIÓN DE MODELOS SUGERIDOS */}
          {searchTerm && (
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Modelos Sugeridos
                </h3>
                {modelosSugeridos.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {modelosSugeridos.length} modelos encontrados
                  </span>
                )}
              </div>
              
              {isLoadingSugeridos ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                  <span className="ml-3 text-gray-600">Cargando sugerencias...</span>
                </div>
              ) : errorSugeridos ? (
                <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm">
                  {errorSugeridos}
                </div>
              ) : modelosSugeridos.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500">No hay modelos sugeridos disponibles</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Scroll horizontal para los grupos de estilos sugeridos */}
                  <div className="overflow-x-auto pb-4 -mx-2 px-2">
                    <div className="flex gap-2 min-w-max">
                      {Object.entries(gruposPorEstilo).map(([estilo, modelos]) => (
                        <div key={estilo} className="w-45 bg-gray-200 rounded-lg py-2 px-1 border border-gray-300">
                          <h4 className="font-semibold text-blue-700 mb-3 text-lg">
                            <button
                              onClick={() => handleSugeridoClick(estilo)}
                              className="hover:text-blue-900 hover:underline flex items-center gap-2"
                              title={`Haz clic para buscar el estilo ${estilo}`}
                            >
                              Estilo: {estilo}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </button>
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                                    
                </div>
              )}
            </div>
          )}
          
          {/* Resumen y botones de acción */}
          <div className="border-t border-gray-200 pt-3">
            {/* Resumen de selección */}
            {(selectedSize || selectedColor) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Resumen de tu selección:</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {selectedColor && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-bold text-blue-700 text-lg">{selectedColor}</span>
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: getColorHex(selectedColor) }}
                      />
                    </div>
                  )}
                  {selectedSize && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Talla:</span>
                      <span className="font-bold text-blue-700 text-lg">{selectedSize}</span>
                      {selectedPrice > 0 && (
                        <span className="text-green-700 font-bold text-lg ml-2">
                          {formatPrice(selectedPrice)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Botones de acción finales */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onAddToCart}
                disabled={!selectedSize || isSubmittingOrder}
                className={`flex-1 py-3 sm:py-4 px-6 rounded-lg font-semibold transition-colors shadow-sm flex items-center justify-center ${
                  selectedSize && !isSubmittingOrder
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmittingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando pedido...
                  </>
                ) : selectedSize ? (
                  `Solicitar Producto - ${selectedProduct.modelo}`
                ) : (
                  'Selecciona una talla para solicitar'
                )}
              </button>
              
              <button
                onClick={onCloseModal}
                disabled={isSubmittingOrder}
                className={`flex-1 py-3 sm:py-4 px-6 border-2 rounded-lg font-semibold transition-colors text-base sm:text-lg ${
                  isSubmittingOrder
                    ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Seguir Explorando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;