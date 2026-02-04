import { useState, useEffect } from 'react';

const ProductModal = ({ 
  isModalOpen, 
  selectedProduct, 
  selectedColor, 
  selectedSize, 
  onCloseModal, 
  onSelectSize, 
  onSelectColor, 
  onAddToCart,
  formatPrice,
  getColorHex,
  buildImageUrl,
  getSelectedColorData,
  isSubmittingOrder
}) => {
  if (!isModalOpen || !selectedProduct) return null;

  const selectedColorData = getSelectedColorData();
  const imageUrl = selectedColorData?.foto ? buildImageUrl(selectedColorData.foto) : null;
  
  // Estado para manejar errores de imagen
  const [imageError, setImageError] = useState(false);

  // Resetear error de imagen cuando cambia el color
  useEffect(() => {
    setImageError(false);
  }, [selectedColor]);

  // Encontrar el precio para la talla seleccionada
  const getSelectedPrice = () => {
    if (!selectedSize || !selectedColorData || !selectedColorData.allSizes) return 0;
    
    const sizeItem = selectedColorData.allSizes.find(item => 
      Math.abs(parseFloat(item.size) - parseFloat(selectedSize)) < 0.1
    );
    
    return sizeItem?.precio || 0;
  };

  const selectedPrice = getSelectedPrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado del Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
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
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {selectedProduct.marca}
                  </span>
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
          
          {/* Sección de Colores */}
          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Colores Disponibles</h3>
                {selectedColor && (
                  <span className="text-sm text-blue-600 font-medium">
                    Seleccionado: <span className="font-bold">{selectedColor}</span>
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProduct.colors.map((colorData, idx) => (
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
                                ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
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
          
          {/* Resumen y botones de acción */}
          <div className="border-t border-gray-200 pt-6">
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