// 型ガード
export function isFireStoreError(
  error: unknown
): error is {code: string, message: string} {
  return typeof error === "object" && error !== null && "code" in error;
}