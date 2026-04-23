-- CreateTable: MemorySlot — replaces ParentSession with persistent QR-linked album slots
CREATE TABLE "memory_slots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "prompt" TEXT NOT NULL DEFAULT '',
    "tokenHash" TEXT NOT NULL,
    "coverPhotoKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memory_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "memory_slots_tokenHash_key" ON "memory_slots"("tokenHash");
CREATE UNIQUE INDEX "memory_slots_userId_pageNumber_key" ON "memory_slots"("userId", "pageNumber");

-- AddForeignKey
ALTER TABLE "memory_slots" ADD CONSTRAINT "memory_slots_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "memory_slots" ADD CONSTRAINT "memory_slots_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: add slotId to memories
ALTER TABLE "memories" ADD COLUMN "slotId" TEXT;
ALTER TABLE "memories" ADD CONSTRAINT "memories_slotId_fkey"
    FOREIGN KEY ("slotId") REFERENCES "memory_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropTable (only if they exist — idempotent)
DROP TABLE IF EXISTS "parent_sessions";
DROP TABLE IF EXISTS "albums";
