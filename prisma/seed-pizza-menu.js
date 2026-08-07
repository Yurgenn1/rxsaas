const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const db = new PrismaClient();
const photos = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "menu", "attributions.json"), "utf-8")
);

const CATEGORIES = [
  {
    name: "Pizzas Salgadas",
    description:
      "Nossas pizzas salgadas vão do tradicional ao gourmet: massa artesanal de fermentação lenta, ingredientes selecionados e o toque da nossa cozinha em cada fatia.",
    order: 0,
    products: [
      { slug: "pizza-margherita", name: "Pizza Margherita", description: "Molho de tomate italiano, mussarela de búfala, manjericão fresco e um fio de azeite extra virgem. A clássica napolitana que nunca sai de moda.", basePrice: 49.9, sizes: [["Pequena", -15], ["Média", -8], ["Grande", 0]], ficha: { ingredients: ["Molho de tomate italiano", "Mussarela de búfala", "Manjericão fresco", "Azeite extra virgem", "Massa de fermentação lenta"], weightGrams: 480, prepTimeMinutes: 18, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-calabresa", name: "Pizza Calabresa", description: "Calabresa artesanal fatiada, cebola roxa em rodelas e mussarela generosa sobre molho de tomate temperado. A preferida do brasileiro em qualquer mesa.", basePrice: 46.9, sizes: [["Pequena", -14], ["Média", -7], ["Grande", 0]], ficha: { ingredients: ["Molho de tomate", "Mussarela", "Calabresa artesanal", "Cebola roxa", "Orégano"], weightGrams: 490, prepTimeMinutes: 16, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-portuguesa", name: "Pizza Portuguesa", description: "Presunto, ovos cozidos, cebola, pimentão, azeitonas pretas e mussarela sobre molho de tomate — um clássico completo e cheio de sabor.", basePrice: 52.9, sizes: [["Pequena", -16], ["Média", -9], ["Grande", 0]], ficha: { ingredients: ["Molho de tomate", "Mussarela", "Presunto", "Ovo cozido", "Cebola", "Pimentão", "Azeitona preta"], weightGrams: 520, prepTimeMinutes: 20, allergens: ["Glúten", "Lactose", "Ovo"] } },
      { slug: "pizza-frango-catupiry", name: "Pizza Frango com Catupiry", description: "Frango desfiado temperado coberto por uma camada generosa de catupiry cremoso e mussarela derretida. Combinação clássica e irresistível.", basePrice: 54.9, sizes: [["Pequena", -16], ["Média", -9], ["Grande", 0]], ficha: { ingredients: ["Molho de tomate", "Mussarela", "Frango desfiado", "Catupiry original", "Milho"], weightGrams: 510, prepTimeMinutes: 18, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-quatro-queijos", name: "Pizza Quatro Queijos", description: "Mussarela, provolone, parmesão e gorgonzola em camadas cremosas sobre molho branco. Para quem ama queijo em cada mordida.", basePrice: 56.9, sizes: [["Pequena", -17], ["Média", -9], ["Grande", 0]], ficha: { ingredients: ["Mussarela", "Provolone", "Parmesão", "Gorgonzola", "Molho branco", "Orégano"], weightGrams: 500, prepTimeMinutes: 17, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-pepperoni", name: "Pizza Pepperoni", description: "Fatias generosas de pepperoni levemente picante sobre molho de tomate e muita mussarela derretida. Estilo americano clássico.", basePrice: 51.9, sizes: [["Pequena", -15], ["Média", -8], ["Grande", 0]], ficha: { ingredients: ["Molho de tomate", "Mussarela", "Pepperoni", "Orégano"], weightGrams: 500, prepTimeMinutes: 16, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-bresaola", name: "Pizza Bresaola com Rúcula e Parmesão", description: "Fatias finas de bresaola curada, rúcula fresca, lascas de parmesão e um toque de azeite trufado sobre base de mussarela. Sofisticação em cada pedaço.", basePrice: 68.9, sizes: [["Pequena", -20], ["Média", -11], ["Grande", 0]], ficha: { ingredients: ["Mussarela", "Bresaola", "Rúcula fresca", "Lascas de parmesão", "Azeite trufado", "Tomate seco"], weightGrams: 470, prepTimeMinutes: 20, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-camarao-catupiry", name: "Pizza Camarão com Catupiry", description: "Camarões salteados no alho e azeite, catupiry cremoso e toque de cebolinha sobre mussarela derretida. Uma pizza gourmet com sabor de frutos do mar.", basePrice: 72.9, sizes: [["Pequena", -22], ["Média", -12], ["Grande", 0]], ficha: { ingredients: ["Mussarela", "Camarão salteado", "Catupiry original", "Alho", "Azeite", "Cebolinha"], weightGrams: 500, prepTimeMinutes: 22, allergens: ["Glúten", "Lactose", "Crustáceos"] } },
      { slug: "pizza-figo-gorgonzola", name: "Pizza Figo com Gorgonzola e Prosciutto", description: "Figos caramelizados, gorgonzola cremoso, prosciutto di Parma e mel sobre base de mussarela. Um encontro perfeito entre o doce e o salgado.", basePrice: 74.9, sizes: [["Pequena", -22], ["Média", -12], ["Grande", 0]], ficha: { ingredients: ["Mussarela", "Figo caramelizado", "Gorgonzola", "Prosciutto di Parma", "Mel", "Nozes"], weightGrams: 480, prepTimeMinutes: 21, allergens: ["Glúten", "Lactose", "Nozes"] } },
    ],
  },
  {
    name: "Entradas",
    description: "Acompanhamentos e petiscos para começar bem antes da pizza chegar.",
    order: 1,
    products: [
      { slug: "pao-de-alho", name: "Pão de Alho na Chapa", description: "Pão francês grelhado na chapa com manteiga de alho e ervas, crocante por fora e macio por dentro.", basePrice: 24.9, sizes: [["6 unidades", 0], ["10 unidades", 10]], ficha: { ingredients: ["Pão francês", "Manteiga", "Alho", "Salsinha", "Orégano"], weightGrams: 300, prepTimeMinutes: 12, allergens: ["Glúten", "Lactose"] } },
      { slug: "bolinho-de-queijo", name: "Bolinho de Queijo", description: "Bolinhos crocantes recheados com queijo derretido, fritos na hora e servidos com molho de pimenta doce.", basePrice: 26.9, sizes: [["8 unidades", 0], ["12 unidades", 10]], ficha: { ingredients: ["Massa de batata/mandioquinha", "Queijo mussarela", "Farinha de rosca", "Ovos", "Óleo para fritura"], weightGrams: 320, prepTimeMinutes: 15, allergens: ["Glúten", "Lactose", "Ovo"] } },
      { slug: "batata-frita", name: "Batata Frita Rústica", description: "Batatas rústicas fritas na hora, temperadas com sal grosso e alecrim, servidas com molho especial da casa.", basePrice: 29.9, sizes: [["Individual", -10], ["Para compartilhar", 0]], ficha: { ingredients: ["Batata", "Sal grosso", "Alecrim", "Óleo para fritura", "Molho especial"], weightGrams: 400, prepTimeMinutes: 10, allergens: [] } },
      { slug: "borda-recheada", name: "Borda Recheada Avulsa de Catupiry", description: "Borda de pizza crocante recheada com catupiry cremoso, perfeita para petiscar à parte.", basePrice: 19.9, sizes: [], ficha: { ingredients: ["Massa de pizza", "Catupiry", "Orégano"], weightGrams: 250, prepTimeMinutes: 8, allergens: ["Glúten", "Lactose"] } },
    ],
  },
  {
    name: "Bebidas",
    description: "Refrigerantes, sucos, águas e opções com e sem álcool para acompanhar sua pizza.",
    order: 2,
    products: [
      { slug: "refrigerante", name: "Refrigerante Guaraná/Cola", description: "Refrigerante bem gelado, o clássico parceiro da pizza, disponível em lata, 600ml ou 2L.", basePrice: 7.9, sizes: [["Lata 350ml", 0], ["600ml", 4], ["2L", 9]], ficha: { ingredients: ["Água gaseificada", "Açúcar", "Extrato de guaraná ou cola", "Corante caramelo", "Acidulante"], weightGrams: 350, prepTimeMinutes: 1, allergens: [] } },
      { slug: "suco-laranja", name: "Suco Natural de Laranja", description: "Suco de laranja espremido na hora, fresco e sem adição de açúcar.", basePrice: 11.9, sizes: [["300ml", 0], ["500ml", 4]], ficha: { ingredients: ["Laranja natural espremida"], weightGrams: 300, prepTimeMinutes: 3, allergens: [] } },
      { slug: "agua-mineral", name: "Água Mineral", description: "Água mineral gelada, com ou sem gás, para refrescar entre as fatias.", basePrice: 6.9, sizes: [["Sem gás 500ml", 0], ["Com gás 500ml", 1]], ficha: { ingredients: ["Água mineral natural"], weightGrams: 500, prepTimeMinutes: 1, allergens: [] } },
      { slug: "cerveja-ipa", name: "Cerveja Artesanal IPA Long Neck", description: "IPA artesanal lupulada e refrescante, ideal para pizzas mais robustas.", basePrice: 17.9, sizes: [], ficha: { ingredients: ["Água", "Malte de cevada", "Lúpulo", "Levedura"], weightGrams: 355, prepTimeMinutes: 1, allergens: ["Glúten"] } },
      { slug: "chopp-pilsen", name: "Chopp Pilsen Lata", description: "Chopp Pilsen leve e cremoso, servido bem gelado na lata pressurizada.", basePrice: 14.9, sizes: [], ficha: { ingredients: ["Água", "Malte de cevada", "Lúpulo", "Levedura"], weightGrams: 473, prepTimeMinutes: 1, allergens: ["Glúten"] } },
      { slug: "limonada-suica", name: "Limonada Suíça Artesanal", description: "Drink não alcoólico cremoso de limão batido com leite condensado, refrescante e levemente adocicado.", basePrice: 13.9, sizes: [], ficha: { ingredients: ["Limão", "Leite condensado", "Água", "Gelo"], weightGrams: 400, prepTimeMinutes: 4, allergens: ["Lactose"] } },
    ],
  },
  {
    name: "Pizzas Doces",
    description: "Pizzas doces artesanais para fechar a refeição com sabor, feitas com massa crocante e coberturas irresistíveis.",
    order: 3,
    products: [
      { slug: "pizza-chocolate-morango", name: "Pizza de Chocolate com Morango", description: "Cobertura generosa de chocolate ao leite derretido com morangos frescos fatiados e um toque de granulado.", basePrice: 52.9, sizes: [["Média", -12], ["Grande", 0], ["Família", 20]], ficha: { ingredients: ["Massa de pizza", "Chocolate ao leite", "Morango fresco", "Granulado de chocolate", "Leite condensado"], weightGrams: 600, prepTimeMinutes: 20, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-banana-canela", name: "Pizza de Banana com Canela", description: "Fatias de banana caramelizadas com canela em pó e fio de leite condensado sobre massa crocante.", basePrice: 46.9, sizes: [["Média", -10], ["Grande", 0], ["Família", 18]], ficha: { ingredients: ["Massa de pizza", "Banana", "Canela em pó", "Leite condensado", "Açúcar"], weightGrams: 580, prepTimeMinutes: 18, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-doce-de-leite-coco", name: "Pizza de Doce de Leite com Coco", description: "Camada cremosa de doce de leite argentino coberta com coco ralado levemente tostado.", basePrice: 49.9, sizes: [["Média", -11], ["Grande", 0], ["Família", 19]], ficha: { ingredients: ["Massa de pizza", "Doce de leite", "Coco ralado", "Leite condensado"], weightGrams: 590, prepTimeMinutes: 18, allergens: ["Glúten", "Lactose"] } },
      { slug: "pizza-nutella-morango", name: "Pizza de Nutella com Morango", description: "Nutella derretida com morangos frescos e raspas de chocolate branco por cima.", basePrice: 58.9, sizes: [["Média", -14], ["Grande", 0], ["Família", 22]], ficha: { ingredients: ["Massa de pizza", "Nutella", "Morango fresco", "Chocolate branco"], weightGrams: 610, prepTimeMinutes: 20, allergens: ["Glúten", "Lactose", "Avelã"] } },
    ],
  },
  {
    name: "Sobremesas",
    description: "Sobremesas clássicas de pizzaria, prontas para adoçar o final da noite.",
    order: 4,
    products: [
      { slug: "petit-gateau", name: "Petit Gâteau", description: "Bolinho de chocolate quente com centro cremoso, servido com uma bola de sorvete de creme.", basePrice: 24.9, sizes: [], ficha: { ingredients: ["Chocolate meio amargo", "Manteiga", "Ovos", "Farinha de trigo", "Açúcar", "Sorvete de creme"], weightGrams: 150, prepTimeMinutes: 15, allergens: ["Glúten", "Lactose", "Ovos"] } },
      { slug: "pudim-de-leite", name: "Pudim de Leite", description: "Pudim de leite condensado cremoso e macio, coberto com calda de caramelo.", basePrice: 16.9, sizes: [], ficha: { ingredients: ["Leite condensado", "Leite", "Ovos", "Açúcar caramelizado"], weightGrams: 120, prepTimeMinutes: 5, allergens: ["Lactose", "Ovos"] } },
      { slug: "brigadeiro", name: "Brigadeiro Gourmet (porção)", description: "Trio de brigadeiros gourmet artesanais, feitos com chocolate belga e rolados em granulado crocante.", basePrice: 18.9, sizes: [], ficha: { ingredients: ["Chocolate belga", "Leite condensado", "Manteiga", "Granulado de chocolate"], weightGrams: 90, prepTimeMinutes: 5, allergens: ["Lactose"] } },
      { slug: "brownie-sorvete", name: "Brownie com Sorvete", description: "Brownie de chocolate quentinho com bola de sorvete de creme, calda de chocolate e chantilly.", basePrice: 22.9, sizes: [], ficha: { ingredients: ["Brownie de chocolate", "Sorvete de creme", "Calda de chocolate", "Chantilly"], weightGrams: 180, prepTimeMinutes: 10, allergens: ["Glúten", "Lactose", "Ovos"] } },
    ],
  },
];

async function main() {
  const restaurant = await db.restaurant.findUnique({ where: { slug: "default" } });
  if (!restaurant) throw new Error("Restaurante padrão não encontrado. Rode prisma/seed.js primeiro.");
  const guest = await db.user.findUnique({ where: { email: "guest@rxsaas.local" } });

  console.log("🧹 Limpando dados de demonstração antigos...");
  await db.orderItemModifier.deleteMany({ where: { item: { order: { restaurantId: restaurant.id } } } });
  await db.orderItem.deleteMany({ where: { order: { restaurantId: restaurant.id } } });
  await db.order.deleteMany({ where: { restaurantId: restaurant.id } });
  await db.productOption.deleteMany({ where: { group: { product: { restaurantId: restaurant.id } } } });
  await db.productOptionGroup.deleteMany({ where: { product: { restaurantId: restaurant.id } } });
  await db.product.deleteMany({ where: { restaurantId: restaurant.id } });
  await db.category.deleteMany({ where: { restaurantId: restaurant.id } });

  console.log("🍕 Criando categorias e produtos...");
  const allProducts = [];

  for (const cat of CATEGORIES) {
    const category = await db.category.create({
      data: {
        name: cat.name,
        description: cat.description,
        order: cat.order,
        restaurantId: restaurant.id,
      },
    });

    for (let i = 0; i < cat.products.length; i++) {
      const p = cat.products[i];
      const photo = photos[p.slug];

      const product = await db.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.basePrice,
          image: photo ? photo.file : null,
          nutritionInfo: null,
          ingredients: JSON.stringify(p.ficha.ingredients),
          allergens: JSON.stringify(p.ficha.allergens),
          restaurantId: restaurant.id,
          categoryId: category.id,
          order: i,
        },
      });

      if (p.sizes.length > 0) {
        const group = await db.productOptionGroup.create({
          data: {
            name: "Tamanho",
            type: "SIZE",
            isRequired: true,
            minSelect: 1,
            maxSelect: 1,
            productId: product.id,
          },
        });
        for (let j = 0; j < p.sizes.length; j++) {
          const [sizeName, priceAdjustment] = p.sizes[j];
          await db.productOption.create({
            data: {
              name: sizeName,
              price: priceAdjustment,
              groupId: group.id,
              order: j,
            },
          });
        }
      }

      allProducts.push({ id: product.id, price: p.basePrice });
    }
  }

  console.log(`✅ ${CATEGORIES.length} categorias, ${allProducts.length} produtos criados.`);

  console.log("📋 Gerando pedidos de demonstração...");
  const statusPool = [
    "PENDING", "PENDING", "CONFIRMED", "CONFIRMED", "PREPARING", "PREPARING",
    "READY", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED",
    "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "CANCELLED", "CANCELLED",
  ];
  const orderTypes = ["PICKUP", "DELIVERY", "DINE_IN"];

  for (let i = 0; i < statusPool.length; i++) {
    const status = statusPool[i];
    const daysAgo = Math.floor(i / 1.5);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(11 + (i % 10), (i * 7) % 60, 0, 0);

    const itemCount = 1 + (i % 3);
    const chosen = [];
    for (let j = 0; j < itemCount; j++) {
      chosen.push(allProducts[(i * 3 + j) % allProducts.length]);
    }
    const subtotal = chosen.reduce((sum, p) => sum + Number(p.price), 0);
    const total = subtotal;

    await db.order.create({
      data: {
        orderNumber: `PED-DEMO-${1000 + i}`,
        status,
        orderType: orderTypes[i % orderTypes.length],
        restaurantId: restaurant.id,
        customerId: guest.id,
        subtotal,
        tax: 0,
        discount: 0,
        tip: 0,
        total,
        createdAt,
        updatedAt: createdAt,
        completedAt: status === "COMPLETED" ? createdAt : null,
        items: {
          create: chosen.map((p) => ({
            productId: p.id,
            quantity: 1,
            unitPrice: p.price,
          })),
        },
      },
    });
  }

  console.log(`✅ ${statusPool.length} pedidos de demonstração criados.`);
  console.log("\n🎉 Cardápio completo de pizzaria pronto!");
}

main()
  .catch((error) => {
    console.error("Erro ao rodar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
