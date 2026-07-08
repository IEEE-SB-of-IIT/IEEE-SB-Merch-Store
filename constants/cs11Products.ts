import { ProductRow } from '../lib/groupProducts';

/** The four merch types that make up the home-page lineup, in display order.
 *  Matched by base name (colorway suffix ignored), so admin-added colorways of
 *  these types still surface on the home page — anything else is shop-only. */
export const HOME_MERCH_NAMES = ['CS11 Zip Hoodie', 'Ember Jersey', 'Dream Tee', 'Spine Tee'];

// The CS11 lineup. Shown whenever the Supabase codesprint collection is empty,
// so the storefront never renders without the real merch. Prices are
// placeholders — set the real ones when adding products via Admin.
const IMG = '/images/codesprint-merch-images/cut';

export const CS11_FALLBACK_PRODUCTS: ProductRow[] = [
    { id: -1, name: 'CS11 Zip Hoodie', description: 'Heavyweight zip hoodie · signal-orange drawstrings', price: 4500, image: `${IMG}/hoodie-black-orange-lace.png`, sold_out: false },
    { id: -2, name: 'Ember Jersey', description: 'All-over sublimation · black-to-ember fade', price: 3000, image: `${IMG}/tee-sublimation-v5.png`, sold_out: false },
    { id: -3, name: 'Dream Tee — Black', description: 'Premium cotton · astronaut back print', price: 2500, image: `${IMG}/tee-minimal-black-v3.png`, sold_out: false },
    { id: -4, name: 'Dream Tee — White', description: 'Premium cotton · astronaut back print', price: 2500, image: `${IMG}/tee-minimal-white-v2.png`, sold_out: false },
    { id: -5, name: 'Spine Tee — Black', description: 'Premium cotton · vertical spine print', price: 2500, image: `${IMG}/tee-minimal-black-v5.png`, sold_out: false },
    { id: -6, name: 'Spine Tee — White', description: 'Premium cotton · vertical spine print', price: 2500, image: `${IMG}/tee-minimal-white-v4.png`, sold_out: false },
];
