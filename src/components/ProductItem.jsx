const ProductItem = ({ product, onOpenModal, formatPrice }) => {
  const mainColor = product.colors[0]?.hex || '#808080';
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 relative"
      onClick={() => onOpenModal(product)}
    >
      {/* Indicador QR */}
      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
        <span className="mr-1">📱</span>
        QR
      </div>
      
      {/* Imagen del producto */}
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              // Fallback si la imagen no carga
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="flex flex-col items-center justify-center w-full h-full" style="background-color: ${mainColor}20">
                  <div class="text-6xl text-gray-700 mb-2">👞</div>
                  <div class="text-xs text-gray-500 px-2 text-center">${product.category}</div>
                </div>
              `;
            }}
          />
        ) : (
          <div 
            className="flex flex-col items-center justify-center w-full h-full"
            style={{ backgroundColor: `${mainColor}20` }}
          >
            <div className="text-6xl text-gray-700 mb-2">👞</div>
            <div className="text-xs text-gray-500 px-2 text-center">{product.category}</div>
          </div>
        )}
        
        {/* Badge de descuento */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        
        {/* Badge de nuevo */}
        {product.isNew && (
          <div className="absolute top-2 left-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            Nuevo
          </div>
        )}
      </div>
      
      {/* Información básica */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.category}</p>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-700">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.price * (1 + product.discount/100))}
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
        
        {/* Colores disponibles */}
        <div className="flex gap-1 mb-3">
          {product.colors.slice(0, 3).map((color, idx) => (
            <div
              key={idx}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 3 && (
            <div className="text-xs text-gray-500 flex items-center">
              +{product.colors.length - 3}
            </div>
          )}
        </div>
        
        {/* Código QR pequeño */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate mr-2">SKU: {product.sku}</span>
            <span className="text-xs text-gray-400 hidden sm:block">Código: {product.sku}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;