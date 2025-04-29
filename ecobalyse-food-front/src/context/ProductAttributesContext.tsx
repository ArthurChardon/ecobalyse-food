import { ProductCategory, ProductLabel } from "@/types/products";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProductAttributesContextType {
  categories: ProductCategory[];
  labels: ProductLabel[];
}

const ProductAttributesContext =
  createContext<ProductAttributesContextType | null>(null);

export function ProductAttributesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fileContent = await fetch("agribalise-ref.json").then((res) => {
        return res.json();
      });
      try {
        const newCategories: ProductCategory[] = [];
        const trackLabels: string[] = [];
        const trackDuplicates: string[] = [];
        const trackNoValue: string[] = [];
        const arrayValues = fileContent.agribaliseRef as {
          name: string;
          agbScore: number | null;
        }[];
        arrayValues.forEach((productCategory, index) => {
          if (trackLabels.includes(productCategory.name)) {
            trackDuplicates.push(productCategory.name);
            return;
          }
          if (productCategory.agbScore === null) {
            trackNoValue.push(productCategory.name);
            return;
          }
          trackLabels.push(productCategory.name);
          newCategories.push({
            id: index,
            name: productCategory.name,
            agbScore: productCategory.agbScore,
          });
        });
        setCategories(newCategories);
        console.log("[AGB Data] Duplicates", [trackDuplicates]);
        console.log("[AGB Data] No values", [trackNoValue]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchLabels = async () => {
      const fileContent = await fetch("labels.json").then((res) => {
        return res.json();
      });
      try {
        const newLabels: ProductLabel[] = fileContent.labels.map(
          (label: any) => {
            return {
              name: label.name,
              bonus: label.bonus,
            };
          }
        );
        setLabels(newLabels);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };
    fetchLabels();
    fetchCategories();
  }, []);

  const value = {
    categories,
    labels,
  };

  return (
    <ProductAttributesContext.Provider value={value}>
      {children}
    </ProductAttributesContext.Provider>
  );
}

export function useProductAttributes(): ProductAttributesContextType {
  const context = useContext(ProductAttributesContext);
  if (context === null) {
    throw new Error(
      "useProductAttributes must be used within a ProductAttributesProvider"
    );
  }
  return context;
}
