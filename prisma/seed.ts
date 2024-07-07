import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function generateCentsCurrency(dollars: number) {
  const cents = Math.round(dollars * 100);

  return cents;
}

async function main() {
  // console.log(process.env.CASE_DEFAULT_IMG_URL);
  // return;
  // Buat phoneColors, phoneMaterials, dan phoneFinishes
  const phoneColors = await prisma.caseColor.createManyAndReturn({
    data: [
      {
        name: "Black",
        hex: "#09090b",
      },
      {
        name: "Blue",
        hex: "#172554",
      },
      {
        name: "Rose",
        hex: "#4c0519",
      },
      {
        name: "Pink",
        hex: "#ffc2e1",
      },
    ],
  });

  const phoneMaterials = await prisma.caseMaterial.createManyAndReturn({
    data: [
      {
        name: "silicone",
        price: 0,
        description: "Silicone yang nyaman di genggam",
      },
      {
        name: "polycarbonate",
        price: 8000,
        description: "Material yang tahan terhadap goresan",
      },
    ],
  });

  const phoneFinishes = await prisma.caseFinish.createManyAndReturn({
    data: [
      {
        name: "Smooth",
        price: 0,
        description: "Halus",
      },
      {
        name: "Textured",
        price: 5000,
        description: "Tekstur grip yang lembut",
      },
    ],
  });

  // Buat phoneModels
  const phoneModels = await prisma.caseModel.createManyAndReturn({
    data: [
      {
        name: "Iphone12",
        url: process.env.CASE_DEFAULT_IMG_URL!, // iphone12.png
        price: 35000,
        edgeImgUrl: process.env.CASE_DEFAULT_EDGE_IMG_URL!, // iphone12-bg-edge.png
      },
    ],
  });

  // Hubungkan phoneModels dengan phoneColors, phoneMaterials, dan phoneFinishes
  const connectPromises: any[] = [];

  phoneModels.forEach((model) => {
    connectPromises.push(
      prisma.caseModel.update({
        where: { id: model.id },
        data: {
          caseColors: {
            connect: phoneColors.map((color) => ({ id: color.id })),
          },
          caseMaterials: {
            connect: phoneMaterials.map((material) => ({ id: material.id })),
          },
          caseFinishes: {
            connect: phoneFinishes.map((finish) => ({ id: finish.id })),
          },
        },
      })
    );
  });

  await Promise.all(connectPromises);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
