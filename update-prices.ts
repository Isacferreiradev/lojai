import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let count = 0;

  for (const product of products) {
    const newPrice = Number(product.price) * 0.5;
    const newPromoPrice = product.promoPrice ? Number(product.promoPrice) * 0.5 : null;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        price: newPrice,
        promoPrice: newPromoPrice,
      },
    });
    count++;
  }

  console.log(`Successfully reduced prices by 50% for ${count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
