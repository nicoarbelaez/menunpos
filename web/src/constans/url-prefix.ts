export const UrlPrefix = {
  BUSINESS: "/c", // Para cuentas de negocio
  CLIENT: "/t", // Para cuentas personales
} as const;

export type UrlPrefix = typeof UrlPrefix[keyof typeof UrlPrefix];