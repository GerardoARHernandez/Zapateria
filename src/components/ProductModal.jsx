const ProductModal = ({ 
  isModalOpen, 
  selectedProduct, 
  selectedColor, 
  selectedSize, 
  onCloseModal, 
  onSelectSize, 
  onSelectColor, 
  onAddToCart,
  formatPrice 
}) => {
  if (!isModalOpen || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado del Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{selectedProduct.name}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full self-start sm:self-auto">
              SKU: {selectedProduct.sku}
            </span>
          </div>
          <button 
            onClick={onCloseModal}
            className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
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
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-64 sm:h-72 object-cover"
                />
                {/* Badge de descuento */}
                {selectedProduct.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{selectedProduct.discount}%
                  </div>
                )}
              </div>
              
              {/* Miniaturas de colores (móvil) */}
              <div className="mt-4 lg:hidden">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Colores disponibles:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === color.name
                          ? 'border-blue-600 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Información del producto */}
            <div className="lg:w-2/3 space-y-6">
              {/* Categoría y precio */}
              <div>
                <span className="text-sm text-gray-500">{selectedProduct.category}</span>
                <div className="flex items-baseline gap-3 mt-2">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-800">
                    {formatPrice(selectedProduct.price)}
                  </div>
                  {selectedProduct.discount > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(selectedProduct.price * (1 + selectedProduct.discount/100))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Descripción */}
              <div>
                <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
              </div>
              
              {/* Disponibilidad y badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    selectedProduct.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedProduct.inStock ? 'Disponible' : 'Agotado'}
                  </span>
                  {selectedProduct.isNew && (
                    <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>
                
                {/* Botón de acción principal */}
                <button
                  onClick={onAddToCart}
                  disabled={!selectedProduct.inStock || !selectedSize}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm min-w-[160px] ${
                    selectedProduct.inStock && selectedSize
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedProduct.inStock 
                    ? selectedSize 
                      ? `Solicitar Producto`
                      : 'Selecciona talla'
                    : 'Producto Agotado'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Sección de Tallas */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Tallas Disponibles</h3>
              {selectedSize && (
                <span className="text-sm text-blue-600 font-medium">
                  Talla seleccionada: <span className="font-bold">{selectedSize}</span>
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-4">
              {selectedProduct.sizes.map((sizeItem, idx) => (
                <button
                  key={idx}
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
            
            {!selectedSize && (
              <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>Selecciona una talla para continuar</span>
              </div>
            )}
          </div>
          
          {/* Sección de Colores */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Colores Disponibles</h3>
              {selectedColor && (
                <span className="text-sm text-blue-600 font-medium">
                  Color seleccionado: <span className="font-bold">{selectedColor}</span>
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProduct.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectColor(color.name)}
                  className={`flex items-center gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    selectedColor === color.name
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">{color.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {color.stock} unidades disponibles
                    </div>
                  </div>
                  {selectedColor === color.name && (
                    <div className="text-blue-600 text-lg">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Resumen y botones de acción */}
          <div className="border-t border-gray-200 pt-6">
            {/* Resumen de selección */}
            {(selectedSize || selectedColor) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Resumen de tu selección:</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {selectedSize && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Talla:</span>
                      <span className="font-bold text-blue-700 text-lg">{selectedSize}</span>
                    </div>
                  )}
                  {selectedColor && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-bold text-blue-700 text-lg">{selectedColor}</span>
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: selectedProduct.colors.find(c => c.name === selectedColor)?.hex }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Botones de acción finales */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onAddToCart}
                disabled={!selectedProduct.inStock || !selectedSize}
                className={`flex-1 py-3 sm:py-4 px-6 rounded-lg font-semibold transition-colors shadow-sm text-base sm:text-lg ${
                  selectedProduct.inStock && selectedSize
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedProduct.inStock 
                  ? selectedSize 
                    ? `✅ Confirmar Solicitud - ${formatPrice(selectedProduct.price)}`
                    : 'Selecciona una talla primero'
                  : 'Producto Agotado'}
              </button>
              
              <button
                onClick={onCloseModal}
                className="flex-1 py-3 sm:py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-base sm:text-lg"
              >
                Seguir Explorando
              </button>
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                Al solicitar, un asesor se pondrá en contacto contigo para finalizar la compra
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;