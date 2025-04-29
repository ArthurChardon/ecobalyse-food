import { Product } from "@/types/products";
import { Recipe } from "@/types/recipes";
import { useRef, useState } from "react";
import ProductForm from "../Product/ProductForm";
import { Button } from "../ui/button";
import { GreenScore } from "@/types/scores";

const RecipeForm = () => {
  const [products, setProducts] = useState<Product[]>([new Product()]);
  const [recipeScore, setRecipeScore] = useState<{
    greenScore: GreenScore | null;
    baseScore: number;
    productionBonus: number;
    transportBonus: number;
  } | null>(null);

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
    recipe.current.computeFullScores();
    setRecipeScore({
      greenScore: recipe.current.greenScore,
      baseScore: recipe.current.baseScore,
      productionBonus: recipe.current.bonusScore.production,
      transportBonus: recipe.current.bonusScore.transport,
    });
  };

  return (
    <>
      <div className="grid grid-cols-3">
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
        <Button onClick={() => addProduct()}>Ajouter produit</Button>
        <Button onClick={() => computeScore()}>Calculer Score</Button>
      </div>
      {!!recipeScore && (
        <>
          <div className="flex items-center gap-[.5rem]">
            Green score: {recipeScore.greenScore?.value}{" "}
            <img
              src={"picto-" + recipeScore.greenScore?.letter + ".svg"}
              height={30}
              width={30}
            ></img>
          </div>
          <div>Base score: {recipeScore?.baseScore.toFixed(2)}</div>
          <div>Production bonus: {recipeScore?.productionBonus.toFixed(0)}</div>
          <div>Transport bonus: {recipeScore?.transportBonus.toFixed(0)}</div>
        </>
      )}
    </>
  );
};

export default RecipeForm;
