/*
  Warnings:

  - The primary key for the `CategoriesOnItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnItems" DROP CONSTRAINT "CategoriesOnItems_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnItems" DROP CONSTRAINT "CategoriesOnItems_itemId_fkey";

-- AlterTable
ALTER TABLE "CategoriesOnItems" DROP CONSTRAINT "CategoriesOnItems_pkey",
ALTER COLUMN "itemId" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CategoriesOnItems_pkey" PRIMARY KEY ("itemId", "categoryId");

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Item_id_seq";

-- AddForeignKey
ALTER TABLE "CategoriesOnItems" ADD CONSTRAINT "CategoriesOnItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnItems" ADD CONSTRAINT "CategoriesOnItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
