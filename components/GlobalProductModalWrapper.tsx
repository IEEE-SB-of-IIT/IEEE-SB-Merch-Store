'use client';

import { useUI } from "../context/UIContext";
import ProductModal from "./ProductModal";

// Wrapper to use the global context for the modal
export default function GlobalProductModalWrapper() {
    const { selectedProduct, closeProductModal } = useUI();

    if (!selectedProduct) return null;

    return (
        <ProductModal
            product={selectedProduct}
            onClose={closeProductModal}
        />
    );
}
