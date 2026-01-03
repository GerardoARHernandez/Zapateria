export const products = [
  {
    id: 1,
    name: "CASUAL MOD. 3390",
    brand: "Zapatería Elite",
    category: "Casuales",
    price: 790.00,
    discount: 0,
    rating: 4.5,
    description: "Zapatos casuales elegantes para uso diario, cómodos y duraderos.",
    colors: [
      { name: "Café", hex: "#8B4513", stock: 15 },
      { name: "Marino", hex: "#000080", stock: 12 },
      { name: "Negro", hex: "#000000", stock: 10 },
      { name: "Gris", hex: "#808080", stock: 8 }
    ],
    sizes: [
      { size: "22", stock: 0 },
      { size: "22.5", stock: 2 },
      { size: "23", stock: 1 },
      { size: "23.5", stock: 0 },
      { size: "24", stock: 3 },
      { size: "24.5", stock: 4 },
      { size: "25", stock: 1 },
      { size: "25.5", stock: 0 }
    ],
    features: ["Cuero genuino", "Forro interior suave", "Suela de goma antideslizante"],
    inStock: true,
    isNew: true,
    releaseDate: "2023-11-15",
    sku: "CASUAL-3390",
    similarModels: ["MOD. 5018", "MOD. 5021", "MOD. 3395", "MOD. 3400"]
  },
  {
    id: 2,
    name: "FORMAL MOD. 5018",
    brand: "Zapatería Elite",
    category: "Formales",
    price: 950.00,
    discount: 15,
    rating: 4.7,
    description: "Zapatos formales de vestir, perfectos para ocasiones especiales y trabajo.",
    colors: [
      { name: "Negro", hex: "#000000", stock: 20 },
      { name: "Café Oscuro", hex: "#654321", stock: 15 },
      { name: "Borgoña", hex: "#800020", stock: 8 }
    ],
    sizes: [
      { size: "23", stock: 2 },
      { size: "23.5", stock: 3 },
      { size: "24", stock: 4 },
      { size: "24.5", stock: 2 },
      { size: "25", stock: 3 },
      { size: "25.5", stock: 1 },
      { size: "26", stock: 0 }
    ],
    features: ["Cuero italiano", "Costura a mano", "Plantilla acolchada"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-09-10",
    sku: "FORMAL-5018",
    similarModels: ["MOD. 5021", "MOD. 3390", "MOD. 5025"]
  },
  {
    id: 3,
    name: "DEPORTIVO MOD. 5021",
    brand: "Zapatería Elite",
    category: "Deportivos",
    price: 850.00,
    discount: 10,
    rating: 4.6,
    description: "Zapatos deportivos con tecnología de amortiguación para máximo confort.",
    colors: [
      { name: "Blanco", hex: "#FFFFFF", stock: 25 },
      { name: "Azul Marino", hex: "#000080", stock: 18 },
      { name: "Gris", hex: "#808080", stock: 12 },
      { name: "Rojo", hex: "#FF0000", stock: 10 }
    ],
    sizes: [
      { size: "22", stock: 1 },
      { size: "22.5", stock: 2 },
      { size: "23", stock: 3 },
      { size: "23.5", stock: 2 },
      { size: "24", stock: 4 },
      { size: "24.5", stock: 3 },
      { size: "25", stock: 2 }
    ],
    features: ["Amortiguación Air", "Upper transpirable", "Suela flexible"],
    inStock: true,
    isNew: true,
    releaseDate: "2023-12-01",
    sku: "DEPORT-5021",
    similarModels: ["MOD. 3390", "MOD. 5018", "MOD. 5028"]
  },
  {
    id: 4,
    name: "BOTIN MOD. 4100",
    brand: "Zapatería Elite",
    category: "Botas",
    price: 1200.00,
    discount: 20,
    rating: 4.8,
    description: "Botines casuales de diseño moderno, ideales para temporada de lluvias.",
    colors: [
      { name: "Café", hex: "#8B4513", stock: 10 },
      { name: "Negro", hex: "#000000", stock: 8 },
      { name: "Verde Militar", hex: "#556B2F", stock: 6 }
    ],
    sizes: [
      { size: "23", stock: 1 },
      { size: "23.5", stock: 2 },
      { size: "24", stock: 3 },
      { size: "24.5", stock: 2 },
      { size: "25", stock: 1 },
      { size: "25.5", stock: 0 }
    ],
    features: ["Impermeable", "Forro térmico", "Suela antiderrapante"],
    inStock: true,
    isNew: false,
    releaseDate: "2023-10-20",
    sku: "BOTIN-4100",
    similarModels: ["MOD. 4105", "MOD. 4110", "MOD. 3390"]
  },
  {
    id: 5,
    name: "SANDALIA MOD. 2550",
    brand: "Zapatería Elite",
    category: "Sandalias",
    price: 450.00,
    discount: 25,
    rating: 4.4,
    description: "Sandalias casuales cómodas para climas cálidos, diseño ergonómico.",
    colors: [
      { name: "Café", hex: "#8B4513", stock: 30 },
      { name: "Negro", hex: "#000000", stock: 25 },
      { name: "Beige", hex: "#F5F5DC", stock: 20 },
      { name: "Azul", hex: "#0000FF", stock: 15 }
    ],
    sizes: [
      { size: "22", stock: 4 },
      { size: "22.5", stock: 5 },
      { size: "23", stock: 6 },
      { size: "23.5", stock: 4 },
      { size: "24", stock: 5 },
      { size: "24.5", stock: 3 }
    ],
    features: ["Material transpirable", "Ajuste regulable", "Suela de EVA"],
    inStock: true,
    isNew: true,
    releaseDate: "2023-11-30",
    sku: "SANDAL-2550",
    similarModels: ["MOD. 2555", "MOD. 2560", "MOD. 3390"]
  }
];