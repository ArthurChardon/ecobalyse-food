import { useState } from "react";
import { Input } from "../ui/input";
import "./ProductForm.css";
import { Product } from "@/types/products";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import { useProductAttributes } from "@/context/ProductAttributesContext";

const ProductForm = ({
  product,
  removeProduct,
}: {
  product: Product;
  removeProduct: () => void;
}) => {
  const [categoryScore, setCategoryScore] = useState<number>(0);
  const { categories, labels: productLabels } = useProductAttributes();

  const labelSelected = (value: string) => {
    console.log("Label selected", value);
  };

  const categorySelected = (value: string) => {
    if (!value) {
      setCategoryScore(0);
      return;
    }
    const selectedCategory = categories.find(
      (category) => category.name === value
    );
    if (selectedCategory) {
      setCategoryScore(computeBaseScoreFromPoints(selectedCategory.agbScore));
    } else {
      setCategoryScore(0);
      console.error("Category not found");
    }
  };

  const computeBaseScoreFromPoints = (points: number): number => {
    return (
      100 -
      (Math.log(10 * points + 1) /
        Math.log(2 + 1 / (100 * Math.pow(points, 4)))) *
        20
    );
  };

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
          visibleOptionsLimit={20}
          onChange={(value) => {
            categorySelected(value);
          }}
        ></Combobox>
        {categoryScore > 0 && (
          <div>Category base score: {categoryScore.toFixed(2)}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="product-form-label">Labels</label>
        <Combobox
          options={productLabels.map((label) => label.name)}
          onChange={(value) => labelSelected(value)}
        ></Combobox>
      </div>
      <Button onClick={() => removeProduct()}>Remove product</Button>
    </form>
  );
};

export default ProductForm;
