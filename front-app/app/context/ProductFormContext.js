// app/context/ProductFormContext.jsx
"use client";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

const emptyFormData = {
  title: "",
  description: "",
  price: "",
  category_id: "",
  stock_quantity: "",
  variants: [],
  images: [],
};

export function ProductProvider({ children }) {
  const [formData, setFormData] = useState(emptyFormData);

  const totalStock = (formData?.variants || []).reduce(
    (acc, v) => acc + (Number(v.stock_quantity) || 0),
    0
  );

  const resetForm = () => setFormData(emptyFormData);

  return (
    <ProductContext.Provider value={{ formData, setFormData, totalStock, resetForm }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProduct = () => useContext(ProductContext);