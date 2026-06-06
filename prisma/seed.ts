import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Category definitions (the 6 store groups) ──────────────────────────────
const CATEGORIES = [
  { slug: "sala", name: "Sala de Estar", image: "/images/cat-sala.png", sortOrder: 1, description: "Tapetes amplos, elegantes e confortáveis, ideais para salas de estar e jantar." },
  { slug: "quarto", name: "Quarto", image: "/images/cat-quarto.png", sortOrder: 2, description: "Modelos aconchegantes e térmicos para proporcionar o melhor acordar." },
  { slug: "corredor", name: "Corredor", image: "/images/cat-modernos.png", sortOrder: 3, description: "Passadeiras antiderrapantes que valorizam corredores e halls de entrada." },
  { slug: "boho", name: "Boho & Artesanal", image: "/images/hero-2.png", sortOrder: 4, description: "Peças étnicas, mandalas e tramas artesanais cheias de personalidade." },
  { slug: "infantil", name: "Infantil", image: "/images/cat-infantil.png", sortOrder: 5, description: "Antialérgicos, coloridos e macios, perfeitos para a diversão das crianças." },
  { slug: "home-office", name: "Home Office", image: "/images/cat-felpudos.png", sortOrder: 6, description: "Tapetes que trazem conforto e sofisticação ao seu espaço de trabalho." },
] as const;

type Slug = (typeof CATEGORIES)[number]["slug"];

interface SeedProduct {
  name: string;
  slug: string;
  sku: string;
  category: Slug;
  description: string;
  brand: string;
  price: number;
  promoPrice?: number;
  stock: number;
  material: string;
  colors: string[];
  sizes: string[];
  weight: number;
  isWashable: boolean;
  isFeatured?: boolean;
  images: string[];
}

const PRODUCTS: SeedProduct[] = [
  // ─────────────── SALA DE ESTAR (10) ───────────────
  {
    name: "Tapete Felpudo Premium Antiderrapante",
    slug: "tapete-felpudo-premium-antiderrapante",
    sku: "SAL-001",
    category: "sala",
    description: "O queridinho da loja. Pelos sedosos de alta densidade com base 100% antiderrapante em látex natural, oferecendo conforto absoluto e segurança ao pisar. Não solta fiapos e mantém o aspecto novo por anos. Perfeito para deixar a sala instantaneamente mais aconchegante e sofisticada.",
    brand: "Lojai Comfort",
    price: 599.90,
    promoPrice: 449.90,
    stock: 40,
    material: "Poliéster Ultra Soft",
    colors: ["Off-White", "Cinza Grafite", "Bege Areia"],
    sizes: ["1.50x2.00m", "2.00x2.50m", "2.50x3.00m"],
    weight: 5.2,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-felpudos.png", "/images/cat-sala.png"],
  },
  {
    name: "Tapete Sala Luxo Mármore",
    slug: "tapete-sala-luxo-marmore",
    sku: "SAL-002",
    category: "sala",
    description: "Estampa de mármore italiano em altíssima definição que transforma qualquer ambiente em um espaço de luxo. Tramado em fios premium de toque aveludado, resistente ao desgaste e fácil de limpar. O ponto de partida perfeito para uma decoração elegante e atemporal.",
    brand: "Design Lab",
    price: 789.90,
    promoPrice: 649.90,
    stock: 25,
    material: "Polipropileno Soft",
    colors: ["Off-White", "Chumbo/Creme"],
    sizes: ["2.00x2.50m", "2.50x3.00m", "3.00x4.00m"],
    weight: 7.4,
    isWashable: false,
    isFeatured: true,
    images: ["/images/cat-sala.png", "/images/hero-1.png"],
  },
  {
    name: "Tapete Geométrico Moderno",
    slug: "tapete-geometrico-moderno",
    sku: "SAL-003",
    category: "sala",
    description: "Linhas geométricas contemporâneas que dão movimento e estilo à sala. Inspirado no design escandinavo, combina paleta neutra com traços marcantes. Fios super macios e antiderrapante na medida certa para ambientes de convivência.",
    brand: "Design Lab",
    price: 689.90,
    promoPrice: 539.90,
    stock: 30,
    material: "Polipropileno Soft",
    colors: ["Terracota/Creme", "Chumbo/Creme", "Cinza Mescla"],
    sizes: ["1.50x2.00m", "2.00x2.50m", "2.50x3.00m"],
    weight: 6.8,
    isWashable: false,
    isFeatured: true,
    images: ["/images/cat-modernos.png", "/images/hero-1.png"],
  },
  {
    name: "Tapete Minimalista Escandinavo",
    slug: "tapete-minimalista-escandinavo",
    sku: "SAL-004",
    category: "sala",
    description: "Menos é mais. Design limpo de inspiração nórdica, com paleta neutra e textura discreta que conversa com qualquer estilo de decoração. Toque macio e acabamento impecável nas bordas. Ideal para quem ama um visual sofisticado e descomplicado.",
    brand: "Nordic Home",
    price: 559.90,
    promoPrice: 449.90,
    stock: 28,
    material: "Algodão Orgânico",
    colors: ["Off-White", "Bege Areia", "Cinza Mescla"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 4.6,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Tapete Abstract Art Premium",
    slug: "tapete-abstract-art-premium",
    sku: "SAL-005",
    category: "sala",
    description: "Uma obra de arte contemporânea aos seus pés. Estampa abstrata exclusiva com pinceladas orgânicas que viram o ponto focal da sala. Confeccionado em fios premium de alta resiliência com acabamento antiderrapante.",
    brand: "Atelier Lojai",
    price: 849.90,
    stock: 14,
    material: "Polipropileno Soft",
    colors: ["Terracota/Creme", "Azul Estonado/Creme"],
    sizes: ["2.00x2.50m", "2.50x3.00m"],
    weight: 7.0,
    isWashable: false,
    images: ["/images/hero-1.png"],
  },
  {
    name: "Tapete Linhas Douradas Elegance",
    slug: "tapete-linhas-douradas-elegance",
    sku: "SAL-006",
    category: "sala",
    description: "Detalhes em tom dourado entrelaçados a uma base sóbria conferem requinte imediato ao ambiente. Tramado com fios de brilho sutil que captam a luz e valorizam móveis e objetos de decoração. Sofisticação para salas de jantar e estar.",
    brand: "Design Lab",
    price: 929.90,
    promoPrice: 779.90,
    stock: 12,
    material: "Polipropileno Soft",
    colors: ["Chumbo/Creme", "Off-White"],
    sizes: ["2.00x2.50m", "2.50x3.00m"],
    weight: 7.6,
    isWashable: false,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Tapete Cinza Premium Soft Touch",
    slug: "tapete-cinza-premium-soft-touch",
    sku: "SAL-007",
    category: "sala",
    description: "O cinza perfeito que combina com tudo. Toque macio Soft Touch e densidade alta que abafa ruídos e aquece o ambiente. Versátil, neutro e elegante — o coringa da decoração moderna.",
    brand: "Lojai Home",
    price: 539.90,
    stock: 35,
    material: "Poliéster Ultra Soft",
    colors: ["Cinza Mescla", "Cinza Grafite"],
    sizes: ["1.50x2.00m", "2.00x2.50m", "2.50x3.00m"],
    weight: 5.0,
    isWashable: true,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Tapete Decorativo Modern Living",
    slug: "tapete-decorativo-modern-living",
    sku: "SAL-008",
    category: "sala",
    description: "Composição moderna pensada para salas integradas. Mistura tons neutros e texturas em relevo que delimitam o ambiente com personalidade. Acabamento premium e base estável que não enruga.",
    brand: "Modern Living",
    price: 719.90,
    stock: 18,
    material: "Polipropileno Soft",
    colors: ["Bege Areia", "Cinza Mescla", "Terracota/Creme"],
    sizes: ["2.00x2.50m", "2.50x3.00m"],
    weight: 6.9,
    isWashable: false,
    images: ["/images/hero-1.png"],
  },
  {
    name: "Tapete Chevron Contemporâneo",
    slug: "tapete-chevron-contemporaneo",
    sku: "SAL-009",
    category: "sala",
    description: "O clássico padrão chevron em releitura contemporânea. Zigue-zague elegante que adiciona dinamismo sem pesar na decoração. Fios macios e resistentes, ideais para áreas de grande circulação.",
    brand: "Design Lab",
    price: 629.90,
    promoPrice: 499.90,
    stock: 22,
    material: "Polipropileno Soft",
    colors: ["Off-White", "Cinza Grafite"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 6.2,
    isWashable: false,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Tapete Velvet Confort Premium",
    slug: "tapete-velvet-confort-premium",
    sku: "SAL-010",
    category: "sala",
    description: "Toque de veludo e profundidade de cor que impressionam. O Velvet Confort traz sofisticação aveludada com fios densos que afundam suavemente ao toque. Luxo e conforto em um único produto.",
    brand: "Lojai Comfort",
    price: 869.90,
    stock: 10,
    material: "Poliéster Ultra Soft",
    colors: ["Chumbo/Creme", "Rosé Soft"],
    sizes: ["2.00x2.50m", "2.50x3.00m"],
    weight: 7.8,
    isWashable: false,
    images: ["/images/cat-felpudos.png"],
  },

  // ─────────────── QUARTO (5) ───────────────
  {
    name: "Tapete Peludo Nuvem Macia",
    slug: "tapete-peludo-nuvem-macia",
    sku: "QUA-001",
    category: "quarto",
    description: "Como pisar em uma nuvem ao acordar. Pelos longos e ultramacios que aquecem o quarto e abraçam os pés. Base antiderrapante e fibras antialérgicas. O conforto que o seu cantinho de descanso merece.",
    brand: "Lojai Comfort",
    price: 459.90,
    promoPrice: 349.90,
    stock: 38,
    material: "Poliéster Ultra Soft",
    colors: ["Off-White", "Bege Areia", "Rosé Soft"],
    sizes: ["1.00x1.50m", "1.50x2.00m"],
    weight: 3.6,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-felpudos.png", "/images/cat-quarto.png"],
  },
  {
    name: "Tapete Confort Lux Bedroom",
    slug: "tapete-confort-lux-bedroom",
    sku: "QUA-002",
    category: "quarto",
    description: "Desenvolvido especialmente para quartos, une isolamento térmico e toque luxuoso. Mantém os pés quentes no inverno e o ambiente acolhedor o ano todo. Acabamento premium e cores neutras versáteis.",
    brand: "Lojai Home",
    price: 519.90,
    stock: 20,
    material: "Poliéster Ultra Soft",
    colors: ["Bege Areia", "Cinza Mescla"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 4.4,
    isWashable: true,
    images: ["/images/cat-quarto.png"],
  },
  {
    name: "Tapete Redondo Premium Soft",
    slug: "tapete-redondo-premium-soft",
    sku: "QUA-003",
    category: "quarto",
    description: "Formato redondo que suaviza a decoração e cria pontos de aconchego ao lado da cama ou na poltrona de leitura. Toque soft e base firme. Um charme a mais para o quarto.",
    brand: "Lojai Home",
    price: 389.90,
    promoPrice: 309.90,
    stock: 24,
    material: "Poliéster Ultra Soft",
    colors: ["Off-White", "Rosé Soft", "Cinza Mescla"],
    sizes: ["1.50x1.50m", "2.00x2.00m"],
    weight: 3.2,
    isWashable: true,
    images: ["/images/cat-quarto.png"],
  },
  {
    name: "Tapete Bege Elegance",
    slug: "tapete-bege-elegance",
    sku: "QUA-004",
    category: "quarto",
    description: "O bege que nunca sai de moda. Tom quente e elegante que ilumina o quarto e combina com madeira, linho e tons terrosos. Densidade confortável e acabamento refinado.",
    brand: "Nordic Home",
    price: 479.90,
    stock: 26,
    material: "Algodão Orgânico",
    colors: ["Bege Areia", "Creme"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 4.0,
    isWashable: true,
    images: ["/images/cat-quarto.png"],
  },
  {
    name: "Tapete Plush Extra Macio",
    slug: "tapete-plush-extra-macio",
    sku: "QUA-005",
    category: "quarto",
    description: "Plush de pelos densos e altíssima maciez para o máximo de conforto descalço. Sensação de pelúcia que aquece e relaxa. Ideal para a beira da cama e cantos de descanso.",
    brand: "Lojai Comfort",
    price: 429.90,
    promoPrice: 339.90,
    stock: 30,
    material: "Poliéster Ultra Soft",
    colors: ["Off-White", "Cinza Grafite", "Rosé Soft"],
    sizes: ["1.00x1.50m", "1.50x2.00m"],
    weight: 3.4,
    isWashable: true,
    images: ["/images/cat-felpudos.png"],
  },

  // ─────────────── CORREDOR (5) ───────────────
  {
    name: "Passadeira Premium para Corredores",
    slug: "passadeira-premium-para-corredores",
    sku: "COR-001",
    category: "corredor",
    description: "A passadeira ideal para corredores e halls. Formato alongado, base 100% antiderrapante e fios resistentes que aguentam o vai e vem do dia a dia sem perder a beleza. Valoriza a entrada e protege o piso.",
    brand: "Lojai Home",
    price: 329.90,
    promoPrice: 259.90,
    stock: 34,
    material: "Polipropileno Soft",
    colors: ["Cinza Grafite", "Bege Areia", "Off-White"],
    sizes: ["0.66x2.00m", "0.66x3.00m", "0.80x3.00m"],
    weight: 3.0,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Passadeira Moderna Antiderrapante",
    slug: "passadeira-moderna-antiderrapante",
    sku: "COR-002",
    category: "corredor",
    description: "Design moderno e base aderente que não desliza. Perfeita para cozinhas, corredores e áreas de passagem. Fácil de limpar e altamente durável.",
    brand: "Modern Living",
    price: 289.90,
    stock: 28,
    material: "Polipropileno Soft",
    colors: ["Cinza Mescla", "Chumbo/Creme"],
    sizes: ["0.66x2.00m", "0.66x3.00m"],
    weight: 2.8,
    isWashable: true,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Passadeira Geométrica Luxo",
    slug: "passadeira-geometrica-luxo",
    sku: "COR-003",
    category: "corredor",
    description: "Estampa geométrica sofisticada para dar caráter ao corredor. Combina estética premium com a praticidade de uma base antiderrapante. Um detalhe de design que faz toda a diferença.",
    brand: "Design Lab",
    price: 359.90,
    promoPrice: 289.90,
    stock: 18,
    material: "Polipropileno Soft",
    colors: ["Terracota/Creme", "Chumbo/Creme"],
    sizes: ["0.66x2.00m", "0.66x3.00m", "0.80x3.00m"],
    weight: 3.1,
    isWashable: false,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Passadeira Minimalista Clean",
    slug: "passadeira-minimalista-clean",
    sku: "COR-004",
    category: "corredor",
    description: "Linhas limpas e cores neutras para um corredor elegante e discreto. A escolha certa para quem busca leveza visual com muita funcionalidade.",
    brand: "Nordic Home",
    price: 269.90,
    stock: 30,
    material: "Algodão Orgânico",
    colors: ["Off-White", "Bege Areia"],
    sizes: ["0.66x2.00m", "0.66x3.00m"],
    weight: 2.6,
    isWashable: true,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Passadeira Soft Comfort",
    slug: "passadeira-soft-comfort",
    sku: "COR-005",
    category: "corredor",
    description: "Toque macio Soft Comfort que torna a passagem mais agradável aos pés. Excelente para corredores de quartos e suítes. Antiderrapante e antialérgica.",
    brand: "Lojai Comfort",
    price: 299.90,
    promoPrice: 239.90,
    stock: 26,
    material: "Poliéster Ultra Soft",
    colors: ["Cinza Mescla", "Rosé Soft", "Off-White"],
    sizes: ["0.66x2.00m", "0.66x3.00m"],
    weight: 2.7,
    isWashable: true,
    images: ["/images/cat-felpudos.png"],
  },

  // ─────────────── BOHO & ARTESANAL (5) ───────────────
  {
    name: "Tapete Boho Elegance",
    slug: "tapete-boho-elegance",
    sku: "BOH-001",
    category: "boho",
    description: "Estilo boho chic em estado puro. Tramas artesanais, tons terrosos e franjas delicadas que trazem aconchego e personalidade ao ambiente. Para quem ama uma decoração autoral, cheia de história e textura.",
    brand: "Artesanal Co.",
    price: 649.90,
    promoPrice: 519.90,
    stock: 20,
    material: "Algodão Orgânico",
    colors: ["Terracota/Creme", "Bege Areia", "Creme"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 5.4,
    isWashable: false,
    isFeatured: true,
    images: ["/images/hero-2.png", "/images/cat-sala.png"],
  },
  {
    name: "Tapete Étnico Premium",
    slug: "tapete-etnico-premium",
    sku: "BOH-002",
    category: "boho",
    description: "Padrões étnicos ricos em detalhes inspirados em culturas ancestrais. Cada traço conta uma história. Tramado em fios premium com acabamento artesanal de alta durabilidade.",
    brand: "Artesanal Co.",
    price: 729.90,
    promoPrice: 599.90,
    stock: 14,
    material: "Algodão Orgânico",
    colors: ["Terracota/Creme", "Azul Estonado/Creme"],
    sizes: ["1.50x2.00m", "2.00x2.50m", "2.50x3.00m"],
    weight: 6.0,
    isWashable: false,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Tapete Mandala Decorativo",
    slug: "tapete-mandala-decorativo",
    sku: "BOH-003",
    category: "boho",
    description: "Mandala central que vira o ponto de atenção do ambiente. Simetria hipnótica e cores harmoniosas que acalmam e encantam. Perfeito para cantinhos de meditação, leitura ou para dar alma à sala.",
    brand: "Atelier Lojai",
    price: 549.90,
    stock: 22,
    material: "Algodão Orgânico",
    colors: ["Creme", "Terracota/Creme", "Cinza Mescla"],
    sizes: ["1.50x1.50m", "2.00x2.00m"],
    weight: 4.2,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Tapete Boho Franja Luxo",
    slug: "tapete-boho-franja-luxo",
    sku: "BOH-004",
    category: "boho",
    description: "Franjas longas e trama texturizada que dão um toque artesanal sofisticado. O boho em sua versão mais luxuosa, com fios densos e caimento impecável. Aconchego e estilo em cada detalhe.",
    brand: "Artesanal Co.",
    price: 699.90,
    promoPrice: 559.90,
    stock: 16,
    material: "Algodão Orgânico",
    colors: ["Off-White", "Bege Areia", "Terracota/Creme"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 5.8,
    isWashable: false,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Tapete Vintage Oriental Moderno",
    slug: "tapete-vintage-oriental-moderno",
    sku: "BOH-005",
    category: "boho",
    description: "Releitura moderna dos clássicos tapetes orientais, com aspecto estonado vintage que simula o charme das peças antigas. Elegância atemporal com identidade contemporânea.",
    brand: "Artesanal Co.",
    price: 899.90,
    promoPrice: 749.90,
    stock: 9,
    material: "Lã de Carneiro",
    colors: ["Azul Estonado/Creme", "Terracota/Creme"],
    sizes: ["2.00x2.50m", "2.50x3.00m", "3.00x4.00m"],
    weight: 9.5,
    isWashable: false,
    images: ["/images/hero-2.png", "/images/cat-quarto.png"],
  },

  // ─────────────── INFANTIL (3) ───────────────
  {
    name: "Tapete Infantil Nuvem",
    slug: "tapete-infantil-nuvem",
    sku: "INF-001",
    category: "infantil",
    description: "Formato fofo de nuvem que encanta o quarto das crianças. Toque macio, fibras antialérgicas e base antiderrapante para brincadeiras seguras. Lavável e fácil de manter limpo.",
    brand: "Lojai Kids",
    price: 229.90,
    stock: 30,
    material: "Nylon Antialérgico",
    colors: ["Off-White", "Rosé Soft", "Cinza Mescla"],
    sizes: ["1.00x1.50m", "1.20x1.60m"],
    weight: 2.2,
    isWashable: true,
    images: ["/images/cat-infantil.png"],
  },
  {
    name: "Tapete Infantil Estrelinhas",
    slug: "tapete-infantil-estrelinhas",
    sku: "INF-002",
    category: "infantil",
    description: "Estrelinhas delicadas que transformam o quarto em um céu de brincadeiras. Macio, antialérgico e seguro. Combina com decorações clean e lúdicas.",
    brand: "Lojai Kids",
    price: 249.90,
    promoPrice: 199.90,
    stock: 26,
    material: "Nylon Antialérgico",
    colors: ["Cinza Mescla", "Off-White"],
    sizes: ["1.00x1.50m", "1.50x2.00m"],
    weight: 2.4,
    isWashable: true,
    images: ["/images/cat-infantil.png"],
  },
  {
    name: "Tapete Infantil Arco-Íris Premium",
    slug: "tapete-infantil-arco-iris-premium",
    sku: "INF-003",
    category: "infantil",
    description: "Cores vibrantes em formato de arco-íris para alegrar e estimular a criançada. Fibras antialérgicas de toque macio e base emborrachada totalmente antiderrapante, garantindo diversão com segurança.",
    brand: "Lojai Kids",
    price: 279.90,
    promoPrice: 219.90,
    stock: 22,
    material: "Nylon Antialérgico",
    colors: ["Colorido"],
    sizes: ["1.00x1.50m", "1.20x1.80m"],
    weight: 2.6,
    isWashable: true,
    images: ["/images/cat-infantil.png"],
  },

  // ─────────────── HOME OFFICE (2) ───────────────
  {
    name: "Tapete Home Office Executive",
    slug: "tapete-home-office-executive",
    sku: "HOF-001",
    category: "home-office",
    description: "Sofisticação e foco para o seu escritório em casa. Densidade firme que acomoda cadeiras e mesas sem marcar, com visual executivo em tons neutros. Eleva o profissionalismo do seu espaço de trabalho.",
    brand: "Modern Living",
    price: 489.90,
    promoPrice: 399.90,
    stock: 18,
    material: "Polipropileno Soft",
    colors: ["Cinza Grafite", "Chumbo/Creme"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 5.0,
    isWashable: false,
    isFeatured: false,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Tapete Minimal Office Premium",
    slug: "tapete-minimal-office-premium",
    sku: "HOF-002",
    category: "home-office",
    description: "Minimalismo funcional para quem trabalha em casa. Linhas discretas, fácil limpeza e toque agradável. O equilíbrio perfeito entre conforto e produtividade no home office.",
    brand: "Nordic Home",
    price: 449.90,
    stock: 20,
    material: "Algodão Orgânico",
    colors: ["Off-White", "Bege Areia", "Cinza Mescla"],
    sizes: ["1.50x2.00m", "2.00x2.50m"],
    weight: 4.4,
    isWashable: true,
    images: ["/images/cat-modernos.png"],
  },
];

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing records (idempotent reset)
  await prisma.adminLog.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.couponUsage.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderHistory.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Categories
  const categoryIdBySlug: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
      },
    });
    categoryIdBySlug[cat.slug] = created.id;
  }
  console.log(`${CATEGORIES.length} categories created!`);

  // 3. Products + images
  for (const p of PRODUCTS) {
    const [first] = p.sizes;
    const [w, h] = (first ?? "1.50x2.00m").replace("m", "").split("x").map(Number);

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        brand: p.brand,
        price: p.price,
        promoPrice: p.promoPrice ?? null,
        stock: p.stock,
        material: p.material,
        colors: p.colors,
        sizes: p.sizes,
        weight: p.weight,
        width: isNaN(w) ? null : w,
        height: isNaN(h) ? null : h,
        depth: 0.025,
        isWashable: p.isWashable,
        isActive: true,
        isFeatured: p.isFeatured ?? false,
        totalSold: Math.floor(Math.random() * 120),
        categoryId: categoryIdBySlug[p.category],
        metaTitle: `${p.name} | Lojai`,
        metaDescription: p.description.slice(0, 155),
      },
    });

    // Ensure at least 4 images per product (main + 3 grid thumbs)
    const IMAGE_POOL = [
      "/images/cat-sala.png",
      "/images/cat-quarto.png",
      "/images/cat-modernos.png",
      "/images/cat-felpudos.png",
      "/images/hero-1.png",
      "/images/hero-2.png",
      "/images/cat-infantil.png",
    ];
    const gallery = [...p.images];
    for (const url of IMAGE_POOL) {
      if (gallery.length >= 4) break;
      if (!gallery.includes(url)) gallery.push(url);
    }

    await prisma.productImage.createMany({
      data: gallery.slice(0, 4).map((url, i) => ({
        productId: product.id,
        url,
        alt: `${p.name} — imagem ${i + 1}`,
        sortOrder: i + 1,
      })),
    });
  }
  console.log(`${PRODUCTS.length} products and images created!`);

  // 4. Default settings
  await prisma.setting.createMany({
    data: [
      { key: "store_name", value: "Lojai", group: "general" },
      { key: "store_description", value: "E-commerce de tapetes premium, artesanais e modernos.", group: "general" },
      { key: "contact_phone", value: "(11) 99999-9999", group: "contact" },
      { key: "contact_email", value: "contato@lojai.com.br", group: "contact" },
      { key: "shipping_flat_rate", value: "45.00", group: "general" },
      { key: "shipping_free_threshold", value: "350.00", group: "general" },
    ],
  });

  // 5. Default coupons
  await prisma.coupon.create({
    data: { code: "BEMVINDO10", type: "PERCENTAGE", value: 10.0, minOrderValue: 100.0, isActive: true },
  });
  await prisma.coupon.create({
    data: { code: "CASA100", type: "FIXED", value: 100.0, minOrderValue: 800.0, isActive: true },
  });

  console.log("Settings and coupons seeded successfully!");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
