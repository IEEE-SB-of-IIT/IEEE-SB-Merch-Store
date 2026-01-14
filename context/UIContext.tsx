"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define Product interface here to avoid circular deps or missing types
export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    sold_out?: boolean;
}

interface UIContextType {
    isSearchOpen: boolean;
    isLoading: boolean;
    openSearch: () => void;
    closeSearch: () => void;
    selectedProduct: Product | null;
    openProductModal: (product: Product) => void;
    closeProductModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200); // 2.2s loading time
        return () => clearTimeout(timer);
    }, []);

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    const openProductModal = (product: Product) => setSelectedProduct(product);
    const closeProductModal = () => setSelectedProduct(null);

    return (
        <UIContext.Provider value={{
            isSearchOpen,
            isLoading,
            openSearch,
            closeSearch,
            selectedProduct,
            openProductModal,
            closeProductModal
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
