import milk from "../assets/amul-milk.webp";
import bread from "../assets/britannia-wheat-bread.webp";
import salt from "../assets/tata-salt-iodized.webp";
import parle from "../assets/parle-g.webp";
import oil from "../assets/fortune-oil-1l.jpg";
import colgate from "../assets/colgate.jpg";


const mockProducts = [
  {
    id: 1,
    name: "Amul Taaza Milk (1L)",
    brand: "Amul",
    category: "Dairy",
    barcode: "8901262000012",
    price: 40,
    stock: 20,
    image: milk
  },
  {
    id: 2,
    name: "Britannia Whole Wheat Bread",
    brand: "Britannia",
    category: "Bakery",
    barcode: "8901063020015",
    price: 30,
    stock: 15,
    image: bread
  },
  {
    id: 3,
    name: "Tata Salt (1kg)",
    brand: "Tata",
    category: "Groceries",
    barcode: "8901138510010",
    price: 28,
    stock: 50,
    image: salt
  },
  {
    id: 4,
    name: "Parle-G Biscuits 250g",
    brand: "Parle",
    category: "Snacks",
    barcode: "8901719100013",
    price: 20,
    stock: 40,
    image: parle
  },
  {
    id: 5,
    name: "Fortune Sunflower Oil (1L)",
    brand: "Fortune",
    category: "Cooking Oil",
    barcode: "8901236010011",
    price: 145,
    stock: 10,
    image: oil
  },
  {
    id: 6,
    name: "Colgate Strong Teeth Toothpaste",
    brand: "Colgate",
    category: "Personal Care",
    barcode: "8901314000014",
    price: 95,
    stock: 8,
    image: colgate
  }
];

export default mockProducts;
