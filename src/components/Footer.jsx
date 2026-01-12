
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="font-semibold text-gray-800 mb-2">Planet Shoes © {new Date().getFullYear()}</p>
            <p className="text-gray-600 text-sm">Catálogo de calzado - Todos los derechos reservados</p>
            
          </div>
        </div>
    </footer>
  )
}

export default Footer