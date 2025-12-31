import { useState, useEffect } from 'react';
import { useAuth } from '../routes';
import { products } from '../data/products';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const { user, logout } = useAuth();

  // Filtrar productos basado en búsqueda, categoría y marca
  useEffect(() => {
    let filtered = products;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtrar por marca
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedBrand]);

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ya se maneja en el useEffect
  };

  const handleLogout = () => {
    logout();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.toLowerCase());
    setSearchTerm('');
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand.toLowerCase());
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  // Extraer categorías y marcas únicas
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  const ProductCard = ({ product }) => {
    const discountedPrice = product.discount > 0 
      ? calculateDiscountedPrice(product.price, product.discount)
      : null;

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {/* Indicador de Nuevo */}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              NUEVO
            </span>
          )}
          
          {/* Indicador de Descuento */}
          {product.discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
          
          {/* Indicador de Stock */}
          {!product.inStock && (
            <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              AGOTADO
            </span>
          )}
          
          <div className="text-5xl">👟</div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.inStock ? 'Disponible' : 'Agotado'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{product.brand} • {product.category}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-gray-600">({product.rating})</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{product.description}</p>
          
          {/* Precios */}
          <div className="mb-4">
            {discountedPrice ? (
              <>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(discountedPrice)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>
          
          {/* Colores disponibles */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Colores disponibles:</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div key={idx} className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.stock} unidades)`}
                  />
                  <span className="text-xs text-gray-600 ml-1">{color.stock}</span>
                </div>
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 4} más</span>
              )}
            </div>
          </div>
          
          {/* Tallas disponibles */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Tallas:</p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 8).map((size, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 8 && (
                <span className="text-xs text-gray-500">+{product.sizes.length - 8} más</span>
              )}
            </div>
          </div>
          
          {/* Botón de acción */}
          <button 
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${product.inStock 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Agregar al carrito' : 'No disponible'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-2xl font-bold text-gray-800">Zapatería Elite</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Bienvenido, <span className="font-semibold">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
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
            Encuentra tu par perfecto
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explora nuestra colección de zapatos y descubre los mejores modelos del mercado
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar modelo, marca o categoría..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
          
          {/* Filtros activos */}
          {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchTerm) && (
            <div className="mt-4 flex items-center justify-center space-x-4">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Categoría: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="ml-2">×</button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Marca: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')} className="ml-2">×</button>
                </span>
              )}
              {searchTerm && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  Búsqueda: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
                </span>
              )}
              <button 
                onClick={handleClearFilters}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all' 
                ? `Resultados de búsqueda (${filteredProducts.length})`
                : 'Todos los productos'}
            </h3>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😕</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h4>
              <p className="text-gray-600 mb-6">Intenta con otros términos de búsqueda o filtros</p>
              <button 
                onClick={handleClearFilters}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Filtro por categorías */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.toLowerCase() 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por marcas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Marcas</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBrandClick('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedBrand === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Todas
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandClick(brand)}
                  className={`px-4 py-2 rounded-lg transition-colors ${selectedBrand === brand.toLowerCase() 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Nuestro Inventario
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{products.length}</div>
              <div className="text-gray-600">Modelos únicos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {products.filter(p => p.inStock).length}
              </div>
              <div className="text-gray-600">Productos disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {products.filter(p => p.isNew).length}
              </div>
              <div className="text-gray-600">Nuevos lanzamientos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {products.filter(p => p.discount > 0).length}
              </div>
              <div className="text-gray-600">En oferta</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="font-semibold text-gray-800 mb-2">Zapatería Elite © 2024</p>
            <p>Encuentra los mejores modelos de zapatos - Catálogo demostrativo</p>
            <p className="mt-2 text-xs text-gray-500">{products.length} productos en inventario</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;