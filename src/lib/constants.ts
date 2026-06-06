export const STORE_NAME = "Lojai";
export const STORE_DESCRIPTION = "Sua loja premium de tapetes artesanais, modernos e sofisticados.";
export const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CATEGORIES = [
  { name: "Sala de Estar", slug: "sala", image: "/images/cat-sala.png" },
  { name: "Quarto", slug: "quarto", image: "/images/cat-quarto.png" },
  { name: "Corredor", slug: "corredor", image: "/images/cat-modernos.png" },
  { name: "Boho & Artesanal", slug: "boho", image: "/images/hero-2.png" },
  { name: "Infantil", slug: "infantil", image: "/images/cat-infantil.png" },
  { name: "Home Office", slug: "home-office", image: "/images/cat-felpudos.png" },
];

export const SHIPPING_SIMULATION_PRICE = 45.0; // Default flat rate shipping if simulated
export const SHIPPING_FREE_LIMIT = 350.0; // Free shipping on orders over R$ 350

export const CONTACT_INFO = {
  phone: "(11) 99999-9999",
  email: "contato@lojai.com.br",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
  workingHours: "Segunda a Sexta das 9h às 18h",
};
