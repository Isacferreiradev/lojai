import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Category definitions (the 6 store groups) ──────────────────────────────
const CATEGORIES = [
  { slug: "iluminacao", name: "Iluminação", image: "/images/cat-sala.png", sortOrder: 1, description: "Luminárias, pendentes e arandelas que transformam o ambiente com luz aconchegante e design premium." },
  { slug: "quadros", name: "Quadros & Pôsteres", image: "/images/cat-quarto.png", sortOrder: 2, description: "Arte de galeria para suas paredes. Composições perfeitas para qualquer ambiente." },
  { slug: "espelhos", name: "Espelhos", image: "/images/cat-modernos.png", sortOrder: 3, description: "Espelhos orgânicos e com LED que ampliam espaços e trazem sofisticação imediata." },
  { slug: "objetos", name: "Objetos Decorativos", image: "/images/hero-2.png", sortOrder: 4, description: "Vasos, esculturas e difusores: os detalhes que fazem sua casa parecer de revista." },
  { slug: "texteis", name: "Têxteis & Aconchego", image: "/images/cat-infantil.png", sortOrder: 5, description: "Almofadas premium, mantas texturizadas e tapeçaria de parede para aquecer os ambientes." },
  { slug: "moveis-apoio", name: "Móveis de Apoio", image: "/images/cat-felpudos.png", sortOrder: 6, description: "Mesas laterais e banquinhos de design autoral para complementar seu espaço." },
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
  // ─────────────── ILUMINAÇÃO (6) ───────────────
  {
    name: "Luminária de Mesa Mushroom Glass Premium",
    slug: "luminaria-de-mesa-mushroom-glass-premium",
    sku: "ILU-001",
    category: "iluminacao",
    description: "A luminária viral com design inspirado nos anos 70 que transforma instantaneamente seu criado-mudo, aparador ou mesa lateral.\n\nFeita inteiramente em vidro translúcido de alta resistência, ela emite uma luz quente e difusa, criando o detalhe que deixa o quarto com cara de hotel boutique. Ideal para leitura suave e iluminação de ambientação.\n\n• Ficha Técnica:\n- Tipo de lâmpada: E27 (Inclusa, cor Quente)\n- Comprimento do cabo: 1.5 metros com interruptor\n- Cuidados: Limpar com pano macio e seco",
    brand: "Orna Casa Collection",
    price: 114.95,
    stock: 45,
    material: "Vidro Soprado Translúcido",
    colors: ["Branco Leitoso", "Âmbar", "Preto Fosco"],
    sizes: ["20cm de Diâmetro x 30cm de Altura"],
    weight: 1.8,
    isWashable: true, // means easy to clean
    isFeatured: true,
    images: ["/images/cat-sala.png", "/images/hero-1.png"],
  },
  {
    name: "Luminária Touch Sem Fio Recarregável em Aço",
    slug: "luminaria-touch-sem-fio-recarregavel-em-aco",
    sku: "ILU-002",
    category: "iluminacao",
    description: "Junta a mais alta estética minimalista com a utilidade que o dia a dia exige. Pode ir no centro da mesa de jantar, na bancada do banheiro, cabeceira ou varanda.\n\nLuz de ambiente suave, sem necessidade de tomada, sem fio aparente e sem obra. Possui controle de intensidade sensível ao toque.\n\n• Ficha Técnica:\n- Bateria: Lítio 5200mAh (Até 12h de duração na intensidade máxima)\n- Carregamento: USB-C (Cabo incluso)\n- Temperatura de Cor: Ajustável (3000K, 4500K, 6000K)",
    brand: "Orna Casa Tech",
    price: 94.95,
    stock: 60,
    material: "Liga de Alumínio e Acrílico",
    colors: ["Dourado Escovado", "Prata Acetinada", "Preto Matte"],
    sizes: ["10cm de Base x 35cm de Altura"],
    weight: 0.9,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Arandela de Parede Sem Fio Magnetic Light",
    slug: "arandela-de-parede-sem-fio-magnetic-light",
    sku: "ILU-003",
    category: "iluminacao",
    description: "A solução definitiva que resolve a iluminação de parede sem quebrar absolutamente nada. Ideal para apartamentos alugados ou paredes já planejadas, sem precisar chamar um eletricista.\n\nA arandela fixa magneticamente à sua base adesivada (fita 3M extra forte), permitindo a remoção do bastão luminoso para carregamento ou uso portátil.\n\n• Ficha Técnica:\n- Instalação: Sem furos (Adesivo 3M) ou com bucha (opcional)\n- Acionamento: Touch rotativo de intensidade\n- Tempo de carga total: 3h",
    brand: "Orna Casa Tech",
    price: 124.95,
    stock: 30,
    material: "Alumínio Aeronáutico e Policarbonato",
    colors: ["Preto Minimal", "Dourado Champagne"],
    sizes: ["20cm x 15cm x 5cm"],
    weight: 0.5,
    isWashable: true,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Luminária Pendente Wabi-Sabi em Papel de Arroz",
    slug: "luminaria-pendente-wabi-sabi-em-papel-de-arroz",
    sku: "ILU-004",
    category: "iluminacao",
    description: "A estética aconchegante, minimalista e com forte inspiração no design asiático. Traz uma luz extremamente difusa e suave para deixar o ambiente mais calmo, meditativo e sofisticado.\n\nFeita artesanalmente, a cúpula em papel de arroz texturizado com esqueleto em bambu é sustentável e elegante, criando o ponto de destaque flutuante perfeito para salas e quartos.\n\n• Ficha Técnica:\n- Tipo de Cúpula: Retrátil e dobrável\n- Acompanha bocal E27 e 1 metro de cabo têxtil ajustável",
    brand: "Orna Casa Autoral",
    price: 99.95,
    promoPrice: 84.95,
    stock: 40,
    material: "Papel de Arroz Autêntico e Bambu",
    colors: ["Branco Natural / Off-White"],
    sizes: ["45cm de Diâmetro"],
    weight: 0.4,
    isWashable: false, // pano seco apenas
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Luminária de Chão Minimalista Haste Fina",
    slug: "luminaria-de-chao-minimalista-haste-fina",
    sku: "ILU-005",
    category: "iluminacao",
    description: "Alto impacto visual com ocupação mínima de espaço físico. Ideal para transformar um canto vazio, uma lateral de poltrona ou sofá em um ponto de destaque arquitetônico na sua decoração.\n\nO LED é integrado diretamente ao longo da haste e voltado para a parede, criando uma iluminação indireta elegante e moderna, sem ofuscar os olhos.\n\n• Ficha Técnica:\n- Iluminação: Fita LED SMD integrada de altíssima durabilidade (Até 50.000 horas)\n- Consumo: 18W (Baixíssimo consumo de energia)",
    brand: "Orna Casa Studio",
    price: 249.95,
    promoPrice: 214.95,
    stock: 15,
    material: "Aço Carbono com Pintura Eletrostática",
    colors: ["Preto Fosco Microtexturizado"],
    sizes: ["Altura: 140cm | Base: 25cm"],
    weight: 3.2,
    isWashable: true,
    images: ["/images/cat-sala.png"],
  },
  {
    name: "Pendente Decorativo Moderno Vidro Leitoso",
    slug: "pendente-decorativo-moderno-vidro-leitoso",
    sku: "ILU-006",
    category: "iluminacao",
    description: "Iluminação statement: uma forte tendência de interiores onde a luminária deixa de ser apenas funcional para virar a peça central escultural do ambiente. A peça que muda completamente a sala de jantar sem precisar trocar os móveis.\n\nGlobo de vidro opalino (leitoso) perfeitamente simétrico acoplado a uma estrutura metálica polida, distribuindo a luz uniformemente em 360 graus.\n\n• Ficha Técnica:\n- Bocal: G9 (Lâmpada não inclusa para personalização térmica)\n- Cabo Ajustável de até 150cm",
    brand: "Orna Casa Studio",
    price: 199.95,
    stock: 20,
    material: "Vidro Opalino e Metal Latonado",
    colors: ["Dourado c/ Globo Branco", "Preto c/ Globo Branco"],
    sizes: ["Globo: 20cm de Diâmetro | Altura total: 60cm"],
    weight: 1.5,
    isWashable: true,
    images: ["/images/cat-sala.png"],
  },

  // ─────────────── QUADROS & PÔSTERES (4) ───────────────
  {
    name: "Kit 3 Quadros Abstratos Formas Orgânicas",
    slug: "kit-3-quadros-abstratos-formas-organicas",
    sku: "QUA-001",
    category: "quadros",
    description: "Resolve de uma vez o incômodo da parede vazia, que deixa sua casa com cara de inacabada. Traz textura visual, cor suave e composição de forma prática e imediata.\n\nImpressão em alta definição sobre papel fotográfico premium, protegido por vidro antirreflexo e emoldurado em madeira maciça certificada. Prontos para pendurar.\n\n• Ficha Técnica:\n- Impressão: Fine Art com pigmento mineral\n- Vidro: Cristal de 2mm (Proteção contra poeira e desbotamento)",
    brand: "Orna Casa Galeria",
    price: 84.95,
    stock: 25,
    material: "Madeira Maciça, Vidro Cristal e Papel Premium",
    colors: ["Tons Terrosos e Areia", "P&B Minimalista"],
    sizes: ["Kit de 3 Peças - 40x60cm (cada)"],
    weight: 4.8,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-quarto.png"],
  },
  {
    name: "Pôster Premium Estilo Galeria Matisse Edition",
    slug: "poster-premium-estilo-galeria-matisse",
    sku: "QUA-002",
    category: "quadros",
    description: "Arte com curadoria de galeria, sem o preço inacessível de galeria. Ótimo para colecionar, apoiar em canaletas ou montar murais de inspiração pelo escritório e home office.\n\nAs cores vibrantes e o papel fosco espesso criam uma aparência elegante, evitando reflexos e valorizando a arte impressa sob qualquer ângulo de luz.\n\n• Ficha Técnica:\n- Gramatura: 250g/m² (Extremamente espesso)\n- Obs: O anúncio refere-se APENAS ao pôster (não inclui moldura ou vidro)",
    brand: "Orna Casa Galeria",
    price: 74.95,
    stock: 50,
    material: "Papel Fotográfico Premium Fosco 250g",
    colors: ["Multicolorido", "Tons Pastel"],
    sizes: ["50cm x 70cm"],
    weight: 0.3,
    isWashable: false,
    images: ["/images/cat-quarto.png"],
  },
  {
    name: "Quadro Tela Canvas Texturizado Wabi",
    slug: "quadro-tela-canvas-texturizado-wabi",
    sku: "QUA-003",
    category: "quadros",
    description: "Muito mais premium que um quadro com vidro comum. A impressão diretamente em tecido canvas oferece textura real ao toque, profundidade visual e muita presença para a sua parede, lembrando uma pintura original.\n\nEsticado manualmente em chassi de madeira de reflorestamento de alta espessura. Ideal para ambientes grandes, como atrás do sofá ou da cama de casal.\n\n• Ficha Técnica:\n- Tela: Canvas 100% Algodão Premium Tratado\n- Borda infinita (imagem continua nas laterais do chassi de 4cm)",
    brand: "Orna Casa Galeria",
    price: 199.95,
    promoPrice: 174.95,
    stock: 12,
    material: "Chassi de Madeira e Tecido Canvas",
    colors: ["Tons Neutros e Off-White"],
    sizes: ["70cm x 100cm"],
    weight: 3.5,
    isWashable: false, // limpar com espanador
    images: ["/images/cat-quarto.png"],
  },
  {
    name: "Moldura Flutuante Filete para Canvas/Painel",
    slug: "moldura-flutuante-filete-para-canvas",
    sku: "QUA-004",
    category: "quadros",
    description: "O acabamento perfeito que aumenta instantaneamente o valor percebido de qualquer quadro ou arte em tela. Uma moldura sofisticada com distanciamento (canaleta) que faz a arte parecer 'flutuar' dentro do contorno.\n\nÉ o segredo dos escritórios de arquitetura de alto padrão para emoldurar telas canvas.\n\n• Ficha Técnica:\n- Espessura do Filete: 0.7cm (Perfil slim)\n- Fundo e Vidro: Não inclusos (Feita exclusivamente para envolver chassis de tela)",
    brand: "Orna Casa Studio",
    price: 99.95,
    stock: 35,
    material: "Madeira Pinus Premium",
    colors: ["Madeira Natural", "Preto Laca Fosco"],
    sizes: ["Para telas de 50x70cm"],
    weight: 1.0,
    isWashable: true,
    images: ["/images/cat-quarto.png"],
  },

  // ─────────────── ESPELHOS (3) ───────────────
  {
    name: "Espelho Orgânico Assoberbado Premium",
    slug: "espelho-organico-assoberbado-premium",
    sku: "ESP-001",
    category: "espelhos",
    description: "O formato orgânico virou a peça de desejo absoluta; ele quebra as linhas retas tradicionais e deixa o quarto, sala, hall de entrada ou lavabo com uma cara excepcionalmente moderna.\n\nO espelho que, sozinho, muda a parede inteira sem precisar de reforma ou papel de parede. Corte computadorizado sem molduras, com lapidação reta e polida (bordas não cortantes).\n\n• Ficha Técnica:\n- Espessura do vidro: 3mm (Garante reflexo perfeito, sem distorção)\n- Fixação dupla reforçada já instalada no verso",
    brand: "Orna Casa Studio",
    price: 139.95,
    stock: 20,
    material: "Vidro Cristal Cebrace Premium",
    colors: ["Prata (Sem Moldura)"],
    sizes: ["60cm de Largura x 90cm de Altura (Formatos Irregulares)"],
    weight: 5.5,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Espelho Redondo com Moldura Slim Metálica",
    slug: "espelho-redondo-com-moldura-slim-metalica",
    sku: "ESP-002",
    category: "espelhos",
    description: "Um clássico atemporal que serve perfeitamente para banheiros, halls de entrada aconchegantes e acima de penteadeiras. Um toque requintado de hotel boutique direto na sua parede.\n\nA moldura em metal conta com perfil slim (borda bem fina) e alta profundidade, garantindo o visual cobiçado nas revistas de decoração modernas.\n\n• Ficha Técnica:\n- Moldura: Aço com pintura eletrostática à pó antiferrugem\n- Alça de suporte opcional (Cinta não inclusa, instalação oculta por parafuso traseiro)",
    brand: "Orna Casa Studio",
    price: 134.95,
    stock: 25,
    material: "Vidro Cristal 3mm e Aço Carbono",
    colors: ["Preto Fosco", "Dourado", "Cobre"],
    sizes: ["60cm de Diâmetro"],
    weight: 4.8,
    isWashable: true,
    images: ["/images/cat-modernos.png"],
  },
  {
    name: "Espelho com Retroiluminação LED Fria/Quente",
    slug: "espelho-com-retroiluminacao-led",
    sku: "ESP-003",
    category: "espelhos",
    description: "Junta a estética de altíssimo padrão com a função imbatível. Indispensável para banheiro luxuosos, penteadeiras e estúdios de maquiagem.\n\nA fita de LED fica oculta no chassi traseiro, criando um halo de luz difusa na parede, e a face frontal jateada emite a iluminação ideal e uniforme para se arrumar todos os dias sem sombras indesejadas no rosto.\n\n• Ficha Técnica:\n- LED: Fonte blindada bivolt interna já ligada (Só plugar na tomada ou fio da parede)\n- Touch Screen frontal: Ligar/Desligar e alterar temperatura",
    brand: "Orna Casa Tech",
    price: 249.95,
    stock: 15,
    material: "Vidro Cristal 4mm e Componentes Eletrônicos",
    colors: ["Luz Quente (3000K) / Luz Fria (6000K)"],
    sizes: ["80cm de Diâmetro"],
    weight: 7.2,
    isWashable: true,
    images: ["/images/cat-modernos.png"],
  },

  // ─────────────── OBJETOS DECORATIVOS (12) ───────────────
  {
    name: "Vaso Escultórico Minimalista em Cerâmica",
    slug: "vaso-escultorico-minimalista-em-ceramica",
    sku: "OBJ-001",
    category: "objetos",
    description: "Um objeto decorativo pequeno, escultural e altamente versátil, ótimo para compor estantes, mesas laterais e bandejas. O detalhe delicado que faz a decoração da casa parecer perfeitamente pensada.\n\nCom acabamento fosco poroso intencional, ele é bonito por si só, mesmo quando não abriga nenhuma flor ou haste seca.\n\n• Ficha Técnica:\n- Impermeável por dentro, fosco por fora\n- Dica: Ideal para ramos de Capim dos Pampas ou Eucalipto seco",
    brand: "Orna Casa Studio",
    price: 89.95,
    promoPrice: 74.95,
    stock: 40,
    material: "Cerâmica Premium Matte",
    colors: ["Areia Suave", "Branco Giz"],
    sizes: ["15cm x 25cm"],
    weight: 1.1,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Vaso Cerâmico Estilo Orgânico Hand-Made",
    slug: "vaso-ceramico-estilo-organico-hand-made",
    sku: "OBJ-002",
    category: "objetos",
    description: "Cerâmica irregular com formas assimétricas naturais e cara de processo artesanal. Combina esplendidamente com decorações premium de estética 'quiet luxury' e rústico chic.\n\nÉ uma peça que exibe a autenticidade do design autoral. Parece valer múltiplos do seu preço e atrai a atenção no centro da mesa de jantar.\n\n• Ficha Técnica:\n- Acabamento com nuances únicas (por ser artesanal, cada peça varia minimamente de tom)\n- Base revestida em EVA para não riscar os móveis",
    brand: "Orna Casa Autoral",
    price: 124.95,
    stock: 22,
    material: "Cerâmica Terracota Esmaltada",
    colors: ["Terracota Natural", "Off-White Mesclado"],
    sizes: ["20cm x 30cm"],
    weight: 1.7,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Escultura Abstrata Decorativa Oito Infinito",
    slug: "escultura-abstrata-decorativa-oito-infinito",
    sku: "OBJ-003",
    category: "objetos",
    description: "Transmite sensação imediata de luxo e intelecto, combinando com a estante de livros do escritório, aparador da entrada ou mesa de centro principal.\n\nDeixe sua sala com cara de showroom assinado por arquitetos. A torção da escultura reflete a luz do ambiente de maneira sofisticada.\n\n• Ficha Técnica:\n- Peso balanceado para não tombar\n- Acompanha base de mármore sintético polido",
    brand: "Orna Casa Studio",
    price: 149.95,
    stock: 18,
    material: "Resina Sintética de Alta Densidade",
    colors: ["Preto Fosco Total", "Dourado Envelhecido Acetinado"],
    sizes: ["15cm de base x 35cm de altura"],
    weight: 2.3,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Bandeja Decorativa Retangular para Aparador",
    slug: "bandeja-decorativa-retangular-para-aparador",
    sku: "OBJ-004",
    category: "objetos",
    description: "Um produto aparentemente simples, mas com valor percebido altíssimo na montagem final da decoração. Organize seus perfumes no closet, monte o cantinho do café ou agrupe velas e livros com cara de decoração de revista.\n\nA borda elevada em metal contrasta com a base em madeira, agrupando itens que, de outra forma, ficariam soltos e bagunçados.\n\n• Ficha Técnica:\n- Alças integradas não aparentes\n- Revestimento interno resistente a respingos",
    brand: "Orna Casa Essenciais",
    price: 99.95,
    promoPrice: 84.95,
    stock: 30,
    material: "Madeira Nogueira Maciça e Alumínio",
    colors: ["Madeira e Preto Matte"],
    sizes: ["30cm x 40cm"],
    weight: 1.5,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Caixa-Livro Premium Decorativa Fashion Box",
    slug: "caixa-livro-premium-decorativa-fashion-box",
    sku: "OBJ-005",
    category: "objetos",
    description: "Item amplamente usado na montagem final de ambientes por decoradores profissionais. Fica lindo empilhado na mesa de centro, estante ou sob um vaso.\n\nÉ o truque brilhante que os arquitetos usam para elevar objetos, preencher espaços e, ao mesmo tempo, servir de porta-objetos (organizando controles remotos, chaves ou documentos).\n\n• Ficha Técnica:\n- Acabamento com laminação fosca anti-riscos\n- Tampa com fechamento magnético invisível",
    brand: "Orna Casa Essenciais",
    price: 74.95,
    stock: 60,
    material: "Papelão Cartonado Rígido 3mm Revestido",
    colors: ["Branco Capa Dura Tom Ford Style", "Preto Chanel Style"],
    sizes: ["28cm x 20cm x 5cm"],
    weight: 0.6,
    isWashable: false, // pano seco apenas
    images: ["/images/hero-2.png"],
  },
  {
    name: "Castiçal Solitário Premium Porta-Vela Longa",
    slug: "castical-solitario-premium-porta-vela",
    sku: "OBJ-006",
    category: "objetos",
    description: "Proporciona luz quente, charme analógico e presença estética elegante para sua mesa de jantar ou aparador de entrada. \n\nO perfil extremamente fino e vertical não bloqueia a visão de quem está sentado à mesa, tornando-o perfeito para jantares românticos e confraternizações intimistas.\n\n• Ficha Técnica:\n- Base inferior ampla, garantindo total estabilidade e proteção contra quedas\n- Bocal compatível com velas do tipo palito padrão (2cm a 2.5cm)",
    brand: "Orna Casa Studio",
    price: 64.95,
    stock: 45,
    material: "Liga Metálica com Banho Eletrolítico",
    colors: ["Dourado Fosco Champagne", "Preto Fosco Microtexturizado"],
    sizes: ["8cm de Base x 20cm de Altura"],
    weight: 0.4,
    isWashable: true, // lavar sem abrasivos para não tirar o banho
    images: ["/images/hero-2.png"],
  },
  {
    name: "Vela Decorativa Escultural Nó Rústico",
    slug: "vela-decorativa-escultural-no-rustico",
    sku: "OBJ-007",
    category: "objetos",
    description: "Possui um visual geométrico forte e intrigante. É excelente para composições de mesas de centro, bandejas de lavabo e opções premium de presentes rápidos.\n\nEntrega três elementos cruciais em uma única peça: o perfume marcante das essências finas, a estética decorativa moderna do nó em laço e o aconchego característico da luz à meia-luz.\n\n• Ficha Técnica:\n- Duração de queima: Aproximadamente 40 horas\n- Notas Olfativas: Vanilla suave com toque de Alecrim",
    brand: "Orna Casa Aromas",
    price: 44.95,
    stock: 100,
    material: "Mix de Cera de Coco Vegetal e Óleos Essenciais",
    colors: ["Off-White (Tom natural da cera)"],
    sizes: ["10cm x 15cm"],
    weight: 0.5,
    isWashable: false,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Difusor de Aromas Premium em Vidro Âmbar",
    slug: "difusor-de-aromas-premium-em-vidro-ambar",
    sku: "OBJ-008",
    category: "objetos",
    description: "Uma casa esteticamente bonita também precisa comunicar cuidado através da memória olfativa. O difusor de varetas traz instantaneamente o desejo de um ambiente impecável, limpo e extremamente sofisticado, comparado aos lobbies de hotéis cinco estrelas.\n\nO vidro e as varetas escuras funcionam muito bem como objeto de decoração luxuoso.\n\n• Ficha Técnica:\n- Duração média: 60 a 90 dias dependendo da circulação de ar\n- Acompanha 6 varetas longas de fibra de algodão (maior absorção que madeira)",
    brand: "Orna Casa Aromas",
    price: 79.95,
    promoPrice: 64.95,
    stock: 55,
    material: "Frasco de Vidro Espesso e Essência Oleosa",
    colors: ["Vidro Âmbar com Varetas Pretas"],
    sizes: ["250ml de Essência Premium"],
    weight: 0.8,
    isWashable: false,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Kit Lavabo Spa Premium 4 Peças",
    slug: "kit-lavabo-spa-premium-4-pecas",
    sku: "OBJ-009",
    category: "objetos",
    description: "O conjunto completo que transforma o seu lavabo ou banheiro principal, deixando-o com cara de Spa ou Hotel de luxo sem precisar de qualquer reforma ou quebra-quebra.\n\nO kit inclui: 1 Saboneteira pump líquida, 1 Porta-escovas/Pincéis, 1 Difusor (vasilhame vazio) e 1 Bandeja base perfeitamente dimensionada para organizar todas as peças juntas.\n\n• Ficha Técnica:\n- Bomba (Pump) do sabonete construída em metal inoxidável (Não descasca)\n- Bases em relevo para não acumular poça de água na bancada",
    brand: "Orna Casa Essenciais",
    price: 74.95,
    stock: 25,
    material: "Cerâmica Fria de Alta Resistência",
    colors: ["Bege Areia Granilite", "Cinza Chumbo Matte"],
    sizes: ["Kit 4 Peças (Bandeja: 25cm x 10cm)"],
    weight: 2.1,
    isWashable: true,
    isFeatured: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Gancho Porta-Toalha Adesivo Inox Premium",
    slug: "gancho-porta-toalha-adesivo-inox-premium",
    sku: "OBJ-010",
    category: "objetos",
    description: "Design altamente funcional, elegante e livre de ferramentas. Não precisa furar o revestimento delicado da parede e é ideal para banheiros e cozinhas de apartamentos alugados.\n\nProporciona uma organização visualmente bonita sem quebrar nada. O design cilíndrico não desfia as toalhas.\n\n• Ficha Técnica:\n- Carga suportada: Até 3kg garantidos pela fita 3M VHB original de fábrica\n- Superfícies adequadas: Porcelanatos, vidros, MDF, cerâmica lisa (Não indicado para parede pintada rústica)",
    brand: "Orna Casa Tech",
    price: 49.95,
    stock: 80,
    material: "Aço Inox 304 Maciço Trato Antioxidação",
    colors: ["Aço Escovado Silver", "Preto Fosco Liso"],
    sizes: ["5cm x 5cm de base"],
    weight: 0.3,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },
  {
    name: "Prateleira Flutuante Minimalista Suspensa",
    slug: "prateleira-flutuante-minimalista-suspensa",
    sku: "OBJ-011",
    category: "objetos",
    description: "A cura definitiva para qualquer parede vazia e sem graça. Cria na mesma hora uma nova superfície útil para exibir quadros menores, livros, pequenos vasos e plantas pendentes.\n\nO sistema de fixação fica 100% oculto e cravado dentro da espessura da prateleira, gerando um efeito impressionante onde a madeira parece emergir diretamente da parede, sem suportes metálicos feios aparecendo.\n\n• Ficha Técnica:\n- Carga Suportada: Até 15kg distribuídos\n- Acompanha buchas especiais e suporte embutido em T de aço",
    brand: "Orna Casa Moveleiro",
    price: 124.95,
    promoPrice: 99.95,
    stock: 28,
    material: "Madeira Maciça de Reflorestamento Premium",
    colors: ["Madeira Pinus Envernizada", "Preto Fosco (Laca)"],
    sizes: ["60cm de largura x 15cm de profundidade x 3cm espessura"],
    weight: 2.2,
    isWashable: true, // pano úmido suave
    images: ["/images/hero-2.png"],
  },
  {
    name: "Nicho Decorativo Quadrado Borda Fina",
    slug: "nicho-decorativo-quadrado-borda-fina",
    sku: "OBJ-012",
    category: "objetos",
    description: "Peça que une perfeitamente a função de armazenamento com estética. Excelente montado em agrupamentos lúdicos na sala, quarto ou até mesmo na organização compacta de pequenos banheiros.\n\nA borda apresenta acabamento 45 graus (meia-esquadria), onde a emenda da madeira não é visível de frente, revelando cuidado extremo na marcenaria.\n\n• Ficha Técnica:\n- Fixação oculta inclusa\n- Acabamento fitado em todas as bordas (resistente à umidade moderada)",
    brand: "Orna Casa Moveleiro",
    price: 139.95,
    stock: 20,
    material: "MDF Premium 15mm de Alta Densidade",
    colors: ["Branco Neve Ártico", "Amadeirado Freijó Texturizado"],
    sizes: ["30cm x 30cm x 15cm"],
    weight: 2.8,
    isWashable: true,
    images: ["/images/hero-2.png"],
  },

  // ─────────────── MÓVEIS DE APOIO (2) ───────────────
  {
    name: "Mesa Lateral Redonda Haste Industrial",
    slug: "mesa-lateral-redonda-haste-industrial",
    sku: "MOV-001",
    category: "moveis-apoio",
    description: "O móvel de apoio indispensável que faz o vazio ao lado do braço do sofá parecer intencional e completo. Possui um altíssimo valor percebido e complementa o uso de abajures, descanso de xícaras e notebooks leves.\n\nSeu pé único assimétrico em meia-lua permite que a mesa seja encaixada 'por cima' do assento do sofá, economizando espaço em salas compactas e facilitando o alcance.\n\n• Ficha Técnica:\n- Peso suportado: 8kg na superfície\n- Design ergonômico em 'C' slim",
    brand: "Orna Casa Moveleiro",
    price: 224.95,
    promoPrice: 194.95,
    stock: 12,
    material: "Estrutura em Aço Carbono, Tampo em MDF Amadeirado",
    colors: ["Preto com Madeira Natural Nogueira"],
    sizes: ["Tampo 40cm Diâmetro | Altura 65cm"],
    weight: 6.5,
    isWashable: true,
    isFeatured: true,
    images: ["/images/cat-felpudos.png"],
  },
  {
    name: "Banquinho Decorativo Rústico Entalhado",
    slug: "banquinho-decorativo-rustico-entalhado",
    sku: "MOV-002",
    category: "moveis-apoio",
    description: "A definição de charme bruto. Um banquinho baixo que não serve apenas como apoio, mas também funciona brilhantemente como criado-mudo alternativo ou pedestal majestoso para uma grande planta vaso Costela de Adão.\n\nPor ser esculpido quase que puramente na peça bruta, o banco exibe nós expostos, veios pronunciados e fissuras naturais tratadas que tornam cada unidade completamente exclusiva no mundo.\n\n• Ficha Técnica:\n- Sustentação de até 100kg\n- Proteção: Selador PU fosco que protege contra insetos e respingos",
    brand: "Orna Casa Autoral",
    price: 174.95,
    stock: 15,
    material: "Tora de Madeira Maciça Recuperada",
    colors: ["Madeira Natural Envelhecida (Varia conforme lote)"],
    sizes: ["Base Redonda 30cm | Altura 45cm"],
    weight: 8.0,
    isWashable: true,
    images: ["/images/cat-felpudos.png"],
  },

  // ─────────────── TÊXTEIS & ACONCHEGO (4) ───────────────
  {
    name: "Manta Decorativa Tricô Gigante para Sofá/Cama",
    slug: "manta-decorativa-trico-gigante-sofa-cama",
    sku: "TEX-001",
    category: "texteis",
    description: "As sobreposições têxteis continuam ditando as regras nas tendências de decoração. Uma manta fluída e volumosa sobre o braço de um sofá reto e frio deixa o ambiente instantaneamente 'abraçável' e convidativo.\n\nO tricô gigante de pontos bem largos confere textura tridimensional e muito movimento à composição da sala, sem pesar muito nas noites amenas.\n\n• Ficha Técnica:\n- Finalização das pontas com acabamento selado antidesfiamento\n- Caimento excelente (não amassa com facilidade)",
    brand: "Orna Casa Conforto",
    price: 124.95,
    promoPrice: 99.95,
    stock: 45,
    material: "Algodão Premium e Acrílico Macio (Fio Hipoalergênico)",
    colors: ["Cru / Off-White", "Mostarda Ocre", "Verde Oliva"],
    sizes: ["120cm x 180cm (Padrão para cama casal ou braço de sofá)"],
    weight: 1.5,
    isWashable: true, // ciclo suave recomendado
    images: ["/images/cat-infantil.png"],
  },
  {
    name: "Capa de Almofada Premium Veludo Liso",
    slug: "capa-de-almofada-premium-veludo-liso",
    sku: "TEX-002",
    category: "texteis",
    description: "O recurso mais rápido, barato e eficiente para trocar a cara da sala inteira sem precisar comprar um sofá novo. Uma composição com almofadas lisas de veludo renova a paleta de cores do local em cinco minutos.\n\nCostura interna reforçada de cinco fios, com zíper finíssimo invisível ton-sur-ton (no mesmo tom da almofada) que permite usá-la dos dois lados de maneira impecável.\n\n• Ficha Técnica:\n- Apenas a CAPA (Não acompanha enchimento interior)\n- Toque macio que não marca o rosto",
    brand: "Orna Casa Conforto",
    price: 49.95,
    stock: 80,
    material: "Veludo Importado 100% Poliéster de Alta Gramatura",
    colors: ["Terracota Queimado", "Off-White Neve", "Cinza Chumbo"],
    sizes: ["50cm x 50cm (Quadrada Padrão)"],
    weight: 0.2,
    isWashable: true,
    images: ["/images/cat-infantil.png"],
  },
  {
    name: "Capa de Almofada Bouclé Premium com Textura",
    slug: "capa-de-almofada-boucle-premium-com-textura",
    sku: "TEX-003",
    category: "texteis",
    description: "Se o visual liso já não empolga mais, a textura Bouclé (aquela com fios encaracolados e aparência felpuda rica) entrega a imagem de requinte moderno definitivo.\n\nTextura extremamente encorpada e cara. Renove as almofadas velhas que você já tem em casa vestindo-as com o que há de mais recente no radar de mostras de arquitetura na Europa.\n\n• Ficha Técnica:\n- Apenas a CAPA (Não acompanha enchimento)\n- Forro interno anti-raspagem do zíper invisível",
    brand: "Orna Casa Conforto",
    price: 59.95,
    stock: 120,
    material: "Tecido Bouclé e Linho Sintético Espesso",
    colors: ["Cru Nuvem", "Caramelo Torrado"],
    sizes: ["45cm x 45cm"],
    weight: 0.3,
    isWashable: true,
    images: ["/images/cat-infantil.png"],
  },
];

async function main() {
  console.log("Seeding database with enriched Orna Casa products...");

  // 1. Clean existing records
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

  // 3. Products + images + reviews
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const [first] = p.sizes;
    let w = 50, h = 50;
    if (first && first.includes("x") && first.includes("cm")) {
        const parts = first.replace(/cm|m|de Diâmetro|Largura|Comprimento|Altura|Formatos Irregulares|Tampo|\(|\)|/gi, "").trim().split("x").map((s) => Number(s.trim()));
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            w = parts[0] / 100;
            h = parts[1] / 100;
        }
    }

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
        width: w,
        height: h,
        depth: 0.05,
        isWashable: p.isWashable,
        isActive: true,
        isFeatured: p.isFeatured ?? false,
        totalSold: Math.floor(Math.random() * 120),
        categoryId: categoryIdBySlug[p.category],
        metaTitle: `${p.name} | Orna Casa`,
        metaDescription: p.description.replace(/\n/g, ' ').slice(0, 155).trim() + "...",
      },
    });

    const folderIndex = String(i + 1).padStart(2, "0");
    const folderPath = `/images/produto_${folderIndex}`;
    const gallery = [
      `${folderPath}/img1_ambiente.jpg`,
      `${folderPath}/img2_closeup.jpg`,
      `${folderPath}/img3_uso.jpg`,
      `${folderPath}/img4_lifestyle.jpg`,
    ];

    await prisma.productImage.createMany({
      data: gallery.map((url, index) => ({
        productId: product.id,
        url,
        alt: `${p.name} — Imagem Detalhada ${index + 1}`,
        sortOrder: index + 1,
      })),
    });

    // 3.5. Reviews
    const numReviews = Math.floor(Math.random() * 3) + 5; // 5, 6, or 7
    const reviewNames = ["Ana C.", "Carlos M.", "Juliana T.", "Roberto F.", "Marina S.", "Lucas P.", "Fernanda R.", "Diego A.", "Patrícia V.", "Rafael N.", "Camila M.", "Bruno K."];
    const reviewTexts = [
      "Produto excelente, superou minhas expectativas!",
      "A qualidade do material é incrível. Recomendo muito.",
      "Chegou no prazo, embalagem perfeita e muito bonito.",
      "Exatamente como na foto, estou muito satisfeito com a compra.",
      "Vale cada centavo, design maravilhoso e acabamento impecável.",
      "Perfeito para o meu ambiente, deu um toque super especial.",
      "Muito elegante e de ótima qualidade.",
      "Comprei com receio, mas me surpreendi positivamente. Comprarei novamente!",
      "Uma das melhores peças que já comprei para minha casa."
    ];

    for (let r = 0; r < numReviews; r++) {
      // Mostly 5, sometimes 4
      const rating = Math.random() > 0.8 ? 4 : 5;
      await prisma.review.create({
        data: {
          productId: product.id,
          name: reviewNames[Math.floor(Math.random() * reviewNames.length)],
          rating,
          comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        }
      });
    }
  }
  console.log(`${PRODUCTS.length} products, images, and reviews created!`);

  // 4. Default settings
  await prisma.setting.createMany({
    data: [
      { key: "store_name", value: "Orna Casa", group: "general" },
      { key: "store_description", value: "Peças de decoração premium com design autoral para transformar sua casa. Explore luminárias, quadros, espelhos e mais.", group: "general" },
      { key: "contact_phone", value: "(11) 99999-9999", group: "contact" },
      { key: "contact_email", value: "contato@ornacasa.com.br", group: "contact" },
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
