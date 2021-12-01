export interface ClientDiscount {
  type: "percentage" | "cash" | null,
  amount: number | null,
  formatted: string
}