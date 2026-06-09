export const STORE_NAME = "Orna Casa";
export const STORE_DESCRIPTION = "Peças de decoração premium que transformam sua casa com design autoral e aconchego.";
export const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CATEGORIES = [
  { name: "Iluminação", slug: "iluminacao", image: "/images/produto_01/img1_ambiente.jpg" },
  { name: "Quadros & Pôsteres", slug: "quadros", image: "/images/produto_07/img1_ambiente.jpg" },
  { name: "Espelhos", slug: "espelhos", image: "/images/produto_11/img1_ambiente.jpg" },
  { name: "Objetos Decorativos", slug: "objetos", image: "/images/produto_14/img1_ambiente.jpg" },
  { name: "Têxteis & Aconchego", slug: "texteis", image: "/images/produto_28/img1_ambiente.jpg" },
  { name: "Móveis de Apoio", slug: "moveis-apoio", image: "/images/produto_26/img1_ambiente.jpg" },
];

export const SHIPPING_SIMULATION_PRICE = 0; // Free shipping for all orders
export const SHIPPING_FREE_LIMIT = 0; // Free shipping always

export const CONTACT_INFO = {
  phone: "(11) 99999-9999",
  email: "contato@lojai.com.br",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
  workingHours: "Segunda a Sexta das 9h às 18h",
};
