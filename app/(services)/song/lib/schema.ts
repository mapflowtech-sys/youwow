import { z } from "zod";

// ─── Validation Schema ──────────────────────────────────────────────────────

export const songFormSchema = z.object({
  aboutPerson: z
    .string()
    .min(10, "Расскажите о человеке подробнее (минимум 10 символов)")
    .max(500, "Слишком длинное описание (максимум 500 символов)"),
  facts: z
    .string()
    .min(20, "Опишите тему песни подробнее (минимум 20 символов)")
    .max(800, "Слишком длинное описание (максимум 800 символов)"),
  mustInclude: z
    .string()
    .max(200, "Слишком много обязательных фраз (максимум 200 символов)")
    .optional(),
  occasion: z.string().min(1, "Выберите повод для песни"),
  customOccasion: z.string().optional(),
  textStyle: z.string().min(1, "Выберите стиль песни"),
  customStyle: z.string().optional(),
  genre: z.string().min(1, "Выберите жанр музыки"),
  voice: z.enum(["male", "female"]),
  email: z
    .string()
    .email("Введите корректный email адрес")
    .min(5, "Email слишком короткий"),
  agreedToPolicy: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие с условиями",
  }),
});

export type SongFormData = z.infer<typeof songFormSchema>;
