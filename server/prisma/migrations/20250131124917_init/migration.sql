/*
  Warnings:

  - You are about to drop the column `totalPurchaseId` on the `PurchaseSummary` table. All the data in the column will be lost.
  - Added the required column `totalPurchased` to the `PurchaseSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseSummary" DROP COLUMN "totalPurchaseId",
ADD COLUMN     "totalPurchased" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SalesSummary" ALTER COLUMN "changePercentage" DROP NOT NULL;
