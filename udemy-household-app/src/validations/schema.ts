import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, {message: "日付は必須項目です"}), //必須
  amount: z.number().min(1, {message: "金額は1円以上で登録してください"}), //1以上
  content: z
    .string()
    .min(1, {message: "内容は必須項目です"})
    .max(50, {message: "内容は50文字以内で登録してください"}),

  category: z.union([
    z.enum(["食費", "日用品", "住居費", "水道光熱費", "娯楽"]),
    z.enum(["給与", "副収入", "お小遣い"]),
    z.literal(""),
  ]).refine((val) => val !== "", {
    message: "カテゴリは必須項目です"
  }),
})

export type Schema = z.infer<typeof transactionSchema>;