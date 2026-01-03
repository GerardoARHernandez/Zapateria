import { useState, useEffect } from 'react';
import { useAuth } from '../routes';
import { products } from '../data/products';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { user, logout } = useAuth();

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

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ya se maneja en el useEffect
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }
    
    alert(`¡Producto agregado!\n${selectedProduct.name}\nColor: ${selectedColor}\nTalla: ${selectedSize}`);
    // Aquí iría la lógica real para agregar al carrito
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
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
        onClick={() => openProductModal(product)}
      >
        {/* Imagen del producto */}
        <div 
          className="h-48 flex items-center justify-center"
          style={{ backgroundColor: `${mainColor}20` }} // Color con transparencia
        >
          <div className="text-6xl text-gray-700">👞</div>
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
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Zapatería Elite</h1>
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
            Encuentra el modelo perfecto para ti en nuestro catálogo
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar modelo (ej: MOD. 3390, Casual, Formal...)"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Buscar
              </button>
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
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 text-gray-300">👟</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h4>
              <p className="text-gray-600 mb-6">Intenta con otros términos de búsqueda</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="font-semibold text-gray-800 mb-2">Zapatería Elite © 2024</p>
            <p className="text-gray-600 text-sm">Catálogo de calzado - Todos los derechos reservados</p>
            <p className="text-xs text-gray-500 mt-2">Mostrando {products.length} modelos disponibles</p>
          </div>
        </div>
      </footer>

      {/* Modal de Detalles del Producto */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Encabezado del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Información principal */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gray-600 text-sm">{selectedProduct.category}</span>
                    <div className="text-3xl font-bold text-blue-800 mt-1">
                      {formatPrice(selectedProduct.price)}
                    </div>
                    {selectedProduct.discount > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(selectedProduct.price * (1 + selectedProduct.discount/100))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {selectedProduct.inStock ? 'Disponible' : 'Agotado'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedProduct.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>SKU: {selectedProduct.sku}</span>
                  <span>|</span>
                  <span>Rating: {selectedProduct.rating} ★</span>
                </div>
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
                        className="w-10 h-10 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">{color.name}</div>
                        <div className="text-sm text-gray-600">{color.stock} disponibles</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Características */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Características</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Modelos Similares */}
              {selectedProduct.similarModels && selectedProduct.similarModels.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Modelos Similares</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.similarModels.map((model, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={() => {
                          const similarProduct = products.find(p => p.name.includes(model));
                          if (similarProduct) {
                            openProductModal(similarProduct);
                          }
                        }}
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock || !selectedSize}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
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
                >
                  Seguir Explorando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;