/** "4500" | 4500 | "LKR 4,500.00" → "LKR 4,500". Falls back to the raw value when unparsable. */
export function formatPrice(price: string | number): string {
    const n = typeof price === 'number'
        ? price
        : parseFloat(String(price).replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(n) || n <= 0) return String(price);
    return `LKR ${n.toLocaleString('en-US')}`;
}
