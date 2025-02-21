export function generateSKU(name: string): string {
  return name.toUpperCase().split(" ").join("-") + "-" + Math.floor(1000 + Math.random() * 9000);
}
