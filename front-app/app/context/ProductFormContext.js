// app/context/ProductFormContext.jsx
"use client";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "",
    variants: [],
    images: [],
  });

  const totalStock = formData.variants.reduce(
    (acc, v) => acc + (Number(v.stock_quantity) || 0), 0
  );

  return (
    <ProductContext.Provider value={{ formData, setFormData, totalStock }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProduct = () => useContext(ProductContext);