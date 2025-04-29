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
      const fileContent = await fetch("agribalise-ref.tsv").then((res) => {
        return res.text();
      });
      try {
        console.log("fileContent", fileContent);
        const newCategories: ProductCategory[] = [];
        const trackLabels: string[] = [];
        const trackDuplicates: string[] = [];
        const arrayValues = fileContent
          .split("\r\n")
          .slice(1)
          .map((row) => row.split("\t"));
        arrayValues.forEach((row, index) => {
          if (trackLabels.includes(row[0])) {
            trackDuplicates.push(row[0]);
            return;
          }
          trackLabels.push(row[0]);
          newCategories.push({
            id: index,
            name: row[0],
            agbScore: parseFloat(row[1]),
          });
        });
        setCategories(newCategories);
        console.log("Duplicates", trackDuplicates);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchLabels = async () => {
      const fileContent = await fetch("labels.json").then((res) => {
        return res.json();
      });
      try {
        console.log("fileContent", fileContent);
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
