import React, { createContext, useContext, useState } from "react";
import { ReceiptData } from "../components/common/ReceiptModal";

interface UIContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  activeReceipt: ReceiptData | null;
  openReceipt: (data: ReceiptData) => void;
  closeReceipt: () => void;
  isExplainerOpen: boolean;
  openExplainer: () => void;
  closeExplainer: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openReceipt = (data: ReceiptData) => setActiveReceipt(data);
  const closeReceipt = () => setActiveReceipt(null);
  const openExplainer = () => setIsExplainerOpen(true);
  const closeExplainer = () => setIsExplainerOpen(false);

  return (
    <UIContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        activeReceipt,
        openReceipt,
        closeReceipt,
        isExplainerOpen,
        openExplainer,
        closeExplainer,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
