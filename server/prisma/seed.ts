import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  // Define the correct deletion order
  const deletionOrder = [
    "sales.json",          // Delete sales first (before Products)
    "purchases.json",      // Then Purchases
    "expenseByCategory.json",  // Then ExpenseByCategory
    "expenseSummary.json", // Then ExpenseSummary
    "salesSummary.json",   // Then SalesSummary
    "purchaseSummary.json", // Then PurchaseSummary
    "expenses.json",       // Then Expenses
    "users.json",          // Then Users
    "products.json",       // Finally, delete Products
  ];

  const modelNames = deletionOrder.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}


async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "products.json",  // Insert Products first (so Sales has valid productIds)
    "purchases.json",  // Purchases next
    "sales.json",  // Now insert Sales (products exist)
    "expenseSummary.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "users.json",
    "expenses.json",
    "expenseByCategory.json",
  ];
  
  
  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
