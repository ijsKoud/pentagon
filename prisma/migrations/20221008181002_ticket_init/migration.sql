-- CreateTable
CREATE TABLE "ticket" (
    "ticket_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orginal_poster" TEXT NOT NULL,
    "claimed_by" TEXT NOT NULL,
    "guild_id" TEXT,
    "transcription" JSONB NOT NULL,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("ticket_id")
);
