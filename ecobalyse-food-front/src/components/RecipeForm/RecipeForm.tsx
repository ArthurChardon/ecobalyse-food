import { Product } from "@/types/products";
import { Recipe } from "@/types/recipes";
import { useRef, useState } from "react";
import ProductForm from "../Product/ProductForm";
import { Button } from "../ui/button";

const RecipeForm = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const recipe = useRef(new Recipe([]));

  const addProduct = () => {
    const newProduct = new Product();
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    recipe.current.addProduct(newProduct);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    recipe.current.products = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
  };

  const removeProduct = (product: Product) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p !== product));
    recipe.current.removeProduct(product);
  };

  const computeScore = () => {
    console.log(recipe.current);
    recipe.current.computeBaseScore();
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
            updateProduct={(updatedProduct: Product) => {
              updateProduct(updatedProduct);
            }}
          ></ProductForm>
        ))}
      </div>
      <div className="flex gap-[1rem] justify-center my-[1rem]">
        <Button onClick={() => addProduct()}>Add product</Button>
        <Button onClick={() => computeScore()}>Compute score</Button>
      </div>
    </>
  );
};

export default RecipeForm;
