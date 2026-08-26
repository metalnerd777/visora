import { useContext } from "react";

import PortfolioContext from "./PortfolioContext";

import type { PortfolioContextType } from "./PortfolioContext";

export function usePortfolio(): PortfolioContextType {
  const ctx = useContext(PortfolioContext);

  if (!ctx) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }

  return ctx;
}
