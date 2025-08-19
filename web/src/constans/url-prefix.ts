export const UrlPrefix = {
  BUSINESS: "t", // Para cuentas de negocio
  CLIENT: "c", // Para cuentas personales
} as const;

export type UrlPrefix = typeof UrlPrefix[keyof typeof UrlPrefix];