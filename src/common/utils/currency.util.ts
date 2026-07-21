export function formatCurrency(
  amount: number | string,
): string {

  return `KES ${new Intl.NumberFormat(
    'en-KE',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(Number(amount || 0))}`;
}

export function formatRexo(
  amount: number | string,
): string {

  return `☥ ${Number(
    amount || 0,
  ).toFixed(2)}`;
}