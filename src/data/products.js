export const products = [
  {
    id: 1,
    name: "Nike Air Max 270",
    brand: "Nike",
    category: "Deportivos",
    price: 129.99,
    discount: 15,
    rating: 4.7,
    description: "Zapatillas deportivas con tecnología Air Max para máxima amortiguación y comodidad durante todo el día.",
    colors: [
      { name: "Negro/Rojo", hex: "#000000", stock: 25 },
      { name: "Blanco/Azul", hex: "#FFFFFF", stock: 18 },
      { name: "Gris/Verde", hex: "#808080", stock: 12 },
      { name: "Rojo/Negro", hex: "#FF0000", stock: 8 }
    ],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    features: ["Amortiguación Air Max", "Upper transpirable", "Suela de goma durable", "Soporte para arco"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-03-15",
    sku: "NIKE-AM270-2023"
  },
  {
    id: 2,
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    category: "Running",
    price: 179.99,
    discount: 10,
    rating: 4.8,
    description: "Zapatillas para running con tecnología Boost que ofrecen retorno de energía y comodidad superior.",
    colors: [
      { name: "Negro/Celeste", hex: "#000000", stock: 32 },
      { name: "Blanco/Negro", hex: "#FFFFFF", stock: 22 },
      { name: "Azul Marino", hex: "#000080", stock: 15 },
      { name: "Gris/Rosa", hex: "#808080", stock: 9 }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    features: ["Tecnología Boost", "Upper Primeknit", "Suela Continental", "Corte en calcetín"],
    inStock: true,
    isNew: true,
    releaseDate: "2023-10-05",
    sku: "ADID-UB22-2023"
  },
  {
    id: 3,
    name: "Jordan 1 Retro High",
    brand: "Jordan",
    category: "Basketball",
    price: 199.99,
    discount: 0,
    rating: 4.9,
    description: "Zapatillas de baloncesto clásicas que combinan estilo y rendimiento en la cancha.",
    colors: [
      { name: "Rojo/Negro/Blanco", hex: "#FF0000", stock: 15 },
      { name: "Azul/Negro/Blanco", hex: "#0000FF", stock: 10 },
      { name: "Negro/Gris", hex: "#000000", stock: 20 },
      { name: "Blanco/Rojo", hex: "#FFFFFF", stock: 7 }
    ],
    sizes: ["7", "8", "9", "10", "11", "12", "13", "14", "15"],
    features: ["Cuero premium", "Amortiguación Air-Sole", "Suela de goma", "Tobillo alto"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-01-20",
    sku: "JORD-1RET-2023"
  },
  {
    id: 4,
    name: "Converse Chuck Taylor All Star",
    brand: "Converse",
    category: "Casuales",
    price: 69.99,
    discount: 20,
    rating: 4.6,
    description: "Zapatillas clásicas de lona que nunca pasan de moda. Perfectas para uso casual diario.",
    colors: [
      { name: "Negro", hex: "#000000", stock: 45 },
      { name: "Blanco", hex: "#FFFFFF", stock: 38 },
      { name: "Rojo", hex: "#FF0000", stock: 25 },
      { name: "Azul Marino", hex: "#000080", stock: 18 },
      { name: "Verde Oliva", hex: "#808000", stock: 12 }
    ],
    sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    features: ["Upper de lona", "Punta de goma", "Logo All Star", "Plantilla acolchada"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-05-10",
    sku: "CONV-CTAS-2023"
  },
  {
    id: 5,
    name: "New Balance 990v6",
    brand: "New Balance",
    category: "Running",
    price: 189.99,
    discount: 5,
    rating: 4.8,
    description: "Zapatillas premium para running y uso diario con tecnología Fresh Foam X para máxima comodidad.",
    colors: [
      { name: "Gris/Naranja", hex: "#808080", stock: 28 },
      { name: "Azul/Gris", hex: "#0000FF", stock: 19 },
      { name: "Negro/Gris", hex: "#000000", stock: 22 },
      { name: "Blanco/Gris", hex: "#FFFFFF", stock: 14 }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13", "14"],
    features: ["Fresh Foam X", "Made in USA", "Upper de malla", "Soporte estabilizador"],
    inStock: false,
    isNew: true,
    releaseDate: "2023-09-15",
    sku: "NEWB-990V6-2023",
    restockDate: "2023-12-01"
  },
  {
    id: 6,
    name: "Puma RS-X",
    brand: "Puma",
    category: "Casuales",
    price: 109.99,
    discount: 25,
    rating: 4.5,
    description: "Zapatillas con diseño retro y tecnología RS (Running System) para un estilo urbano único.",
    colors: [
      { name: "Multicolor", hex: "#FF5733", stock: 16 },
      { name: "Negro/Naranja", hex: "#000000", stock: 21 },
      { name: "Blanco/Rosa", hex: "#FFFFFF", stock: 13 },
      { name: "Azul/Verde", hex: "#0000FF", stock: 9 }
    ],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    features: ["Tecnología RS", "Diseño retro", "Upper de malla y cuero", "Suela de goma"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-04-22",
    sku: "PUMA-RSX-2023"
  },
  {
    id: 7,
    name: "Vans Old Skool",
    brand: "Vans",
    category: "Skate",
    price: 79.99,
    discount: 15,
    rating: 4.7,
    description: "Zapatillas clásicas de skate con la icónica franja lateral. Duraderas y versátiles.",
    colors: [
      { name: "Negro/Blanco", hex: "#000000", stock: 40 },
      { name: "Blanco/Negro", hex: "#FFFFFF", stock: 35 },
      { name: "Rojo/Negro", hex: "#FF0000", stock: 20 },
      { name: "Azul/Negro", hex: "#0000FF", stock: 18 },
      { name: "Verde/Negro", hex: "#008000", stock: 12 }
    ],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    features: ["Suela Waffle", "Upper de lona y cuero", "Franja lateral", "Resistente para skate"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-02-18",
    sku: "VANS-OLD-2023"
  }
];