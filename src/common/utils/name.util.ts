export function normalizeName(
  value: string,
): string {

  return value
    .replace(/[^A-Za-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );
}

export function isValidFullName(
  value: string,
): boolean {

  return value
    .trim()
    .split(' ')
    .filter(Boolean)
    .length >= 2;
}