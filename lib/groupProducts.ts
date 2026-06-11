/** Groups per-colorway product rows ("Dream Tee — Black", "Dream Tee — White")
 *  into merch types with color variants. The DB keeps one row per colorway so
 *  admin inventory and order lines stay per-color; this is presentation only. */

export interface ProductRow {
    id: number;
    name: string;
    description: string;
    price: string | number;
    image: string;
    sold_out?: boolean;
}

export interface MerchVariant {
    color: string;
    product: ProductRow;
}

export interface MerchType {
    /** Base name, e.g. "Dream Tee" */
    name: string;
    description: string;
    variants: MerchVariant[];
}

function splitName(name: string): { base: string; color: string } {
    const parts = name.split(/\s+—\s+/);
    return parts.length === 2 ? { base: parts[0], color: parts[1] } : { base: name, color: '' };
}

export function groupProducts(rows: ProductRow[]): MerchType[] {
    const order: string[] = [];
    const map = new Map<string, MerchType>();

    for (const row of rows) {
        const { base, color } = splitName(row.name);
        let group = map.get(base);
        if (!group) {
            group = { name: base, description: row.description, variants: [] };
            map.set(base, group);
            order.push(base);
        }
        group.variants.push({ color, product: row });
    }

    return order.map((key) => map.get(key)!);
}
