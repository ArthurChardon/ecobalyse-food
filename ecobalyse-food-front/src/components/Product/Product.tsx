import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
import "./Product.css";
import { ProductCategory } from "@/types/product";
import { Combobox } from "../ui/combobox";

const Product = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fileContent = await fetch("agribalise-ref.tsv").then((res) => {
        return res.text();
      });
      try {
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
    fetchCategories();
  }, []);

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="productName" className="product-form-label">
          Name
        </label>
        <Input
          type="text"
          className="form-control"
          id="productName"
          placeholder="ex: Nutella"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="product-form-label">
          Category
        </label>
        <Combobox
          options={categories.map((category) => category.name)}
        ></Combobox>
        <div style={{ display: "none" }}>
          <Select>
            <SelectTrigger className="form-control" id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
};

export default Product;
