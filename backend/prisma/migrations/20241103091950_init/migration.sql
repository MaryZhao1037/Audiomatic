-- CreateTable
CREATE TABLE "video_prompts" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "video_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_prompts" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "audio_prompts_pkey" PRIMARY KEY ("id")
);
