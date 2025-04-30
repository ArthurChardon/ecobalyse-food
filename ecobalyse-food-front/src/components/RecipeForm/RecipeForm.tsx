import { Product } from "@/types/products";
import { Recipe } from "@/types/recipes";
import { useRef, useState } from "react";
import ProductForm from "../Product/ProductForm";
import { Button } from "../ui/button";
import { GreenScore } from "@/types/scores";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";

const RecipeForm = () => {
  const [products, setProducts] = useState<Product[]>([new Product()]);
  const [recipeScore, setRecipeScore] = useState<{
    greenScore: GreenScore | null;
    baseScore: number;
    productionBonus: number;
    transportBonus: number;
    packagingBonus: number;
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
      packagingBonus: recipe.current.bonusScore.packaging,
    });
  };

  return (
    <>
      <main className="p-[1rem] relative grow">
        <div className="col-start-1 col-end-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[1rem]">
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
          <Button
            className="h-full min-h-[25rem]"
            variant="secondary"
            onClick={() => addProduct()}
          >
            Ajouter produit
          </Button>
        </div>
      </main>
      <div className="h-screen w-[2rem] relative">
        <SidebarTrigger className="sticky top-[50%] left-0"></SidebarTrigger>
      </div>

      <Sidebar side="right">
        <SidebarHeader>
          <h2>Green score de la recette</h2>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-2">
            {!!recipeScore && (
              <>
                <div className="flex items-center gap-[.5rem]">
                  Green score: {recipeScore.greenScore?.value.toFixed(1)}{" "}
                  <img
                    src={"picto-" + recipeScore.greenScore?.letter + ".svg"}
                    height={30}
                    width={30}
                  ></img>
                </div>
                <div>Base score: {recipeScore?.baseScore.toFixed(1)}</div>
                <div>
                  Production bonus: {recipeScore?.productionBonus.toFixed(0)}
                </div>
                <div>
                  Transport bonus: {recipeScore?.transportBonus.toFixed(0)}
                </div>
                <div>
                  Packaging bonus: {recipeScore?.packagingBonus.toFixed(0)}
                </div>
              </>
            )}
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Button onClick={() => computeScore()}>Calculer Score</Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default RecipeForm;
