import { Product } from "@/types/products";
import { Recipe } from "@/types/recipes";
import { useState } from "react";
import ProductForm from "../Product/ProductForm";
import { Button } from "../ui/button";

const RecipeForm = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const recipe = new Recipe([]);

  const addProduct = () => {
    const newProduct = new Product();
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    recipe.addProduct(newProduct);
  };

  const removeProduct = (product: Product) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p !== product));
    recipe.removeProduct(product);
  };

  const computeScore = () => {
    recipe.computeBaseScore();
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {products.map((product) => (
          <ProductForm
            key={product.id}
            product={product}
            removeProduct={() => {
              removeProduct(product);
            }}
          ></ProductForm>
        ))}
      </div>
      <Button onClick={() => addProduct()}>Add product</Button>
      <Button onClick={() => computeScore()}>Compute score</Button>
    </>
  );
};

export default RecipeForm;
