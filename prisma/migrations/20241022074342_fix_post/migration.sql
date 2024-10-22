/*
  Warnings:

  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_userId_fkey";

-- DropTable
DROP TABLE "Posts";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "auth" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "bio" TEXT,
    "createdAt" BIGINT,
    "updatedAt" BIGINT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "createdAt" BIGINT,
    "updatedAt" BIGINT,
    "userId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_key" ON "User"("auth");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
