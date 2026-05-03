-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL DEFAULT (floor(random() * 900000) + 100000)::text,
    "street" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entry" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "shift_id" TEXT,
    "clock_in" TIMESTAMP(3) NOT NULL,
    "clock_out" TIMESTAMP(3),
    "is_manual" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entry_edit" (
    "id" TEXT NOT NULL,
    "time_entry_id" TEXT NOT NULL,
    "old_clock_in" TIMESTAMP(3),
    "old_clock_out" TIMESTAMP(3),
    "new_clock_in" TIMESTAMP(3),
    "new_clock_out" TIMESTAMP(3),
    "reason" VARCHAR(255) NOT NULL,
    "edited_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_entry_edit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shift_user_id_start_time_idx" ON "shift"("user_id", "start_time");

-- CreateIndex
CREATE INDEX "shift_location_idx" ON "shift"("location");

-- CreateIndex
CREATE INDEX "time_entry_user_id_clock_in_idx" ON "time_entry"("user_id", "clock_in");

-- Enforce only one active time entry per user
CREATE UNIQUE INDEX "one_active_time_entry_per_user"
ON "time_entry"("user_id")
WHERE "clock_out" IS NULL;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry_edit" ADD CONSTRAINT "time_entry_edit_edited_by_id_fkey" FOREIGN KEY ("edited_by_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
