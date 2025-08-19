export const AccountType = {
  CLIENT: "client",
  BUSINESS: "business",
  BOTH: "both",
} as const;

// tipo union derivado automáticamente
export type AccountType = typeof AccountType[keyof typeof AccountType];
