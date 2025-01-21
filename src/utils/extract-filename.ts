export function extractFileName(url: string): string {
  return url.split("/").pop() || "";
}
