import { BaseSyntheticEvent, useState } from "react";
import { Input } from "../ui/input";
import "./ProductForm.css";
import { Product } from "@/types/products";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import { useProductAttributes } from "@/context/ProductAttributesContext";
import { MultiSelect } from "../ui/multiselect";

const ProductForm = ({
  product,
  updateProduct,
  removeProduct,
}: {
  product: Product;
  updateProduct: (product: Product) => void;
  removeProduct: () => void;
}) => {
  const [categoryScore, setCategoryScore] = useState<number>(-1);
  const { categories, labels: productLabels } = useProductAttributes();

  const quantitySelected = (value: string) => {
    product.quantity = +value;
    updateProduct(product);
  };

  const labelsSelected = (values: string[]) => {
    const selectedLabel = productLabels.filter((label) =>
      values.includes(label.name)
    );
    if (selectedLabel) {
      product.labels = selectedLabel;
      updateProduct(product);
    } else {
      console.error("Category not found");
    }
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
      product.category = selectedCategory;
      updateProduct(product);
      setCategoryScore(computeBaseScoreFromPoints(selectedCategory.agbScore));
    } else {
      setCategoryScore(0);
      console.error("Category not found");
    }
  };

  const computeBaseScoreFromPoints = (points: number): number => {
    // points > 3.1 => 0
    return Math.max(
      0,
      Math.min(
        100,
        100 -
          (Math.log(10 * points + 1) /
            Math.log(2 + 1 / (100 * Math.pow(points, 4)))) *
            20
      )
    );
  };

  return (
    <form className="bg-background m-[1rem] p-[1rem]">
      <div className="mb-3">
        <label htmlFor="category" className="product-form-label">
          Catégorie
        </label>
        <Combobox
          options={categories.map((category) => category.name)}
          visibleOptionsLimit={20}
          placeholder="ex: Carotte, crue"
          onChange={(value) => {
            categorySelected(value);
          }}
        ></Combobox>
        {categoryScore >= 0 && (
          <div>Catégorie base score: {categoryScore.toFixed(2)}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="product-form-label">Labels</label>
        <MultiSelect
          placeholder="ex: Fairtrade"
          options={productLabels.map((label) => ({
            label: label.name,
            value: label.name,
          }))}
          onValueChange={(value) => labelsSelected(value)}
        ></MultiSelect>
      </div>
      <div className="mb-3">
        <label htmlFor="quantity" className="product-form-label">
          Quantité (kg)
        </label>
        <Input
          type="number"
          className="form-control"
          id="quantity"
          placeholder="ex: 1.5"
          defaultValue={product.quantity}
          onInput={(event: BaseSyntheticEvent) =>
            quantitySelected(event.target.value)
          }
        />
      </div>
      <Button onClick={() => removeProduct()}>Retirer produit</Button>
    </form>
  );
};

export default ProductForm;
