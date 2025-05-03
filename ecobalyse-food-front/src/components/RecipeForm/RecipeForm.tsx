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
import "./RecipeForm.css";
import { ChartBar, CirclePlus } from "lucide-react";
import RecipeResults from "./RecipeResults/RecipeResults";

const RecipeForm = () => {
  const [products, setProducts] = useState<Product[]>([new Product()]);
  const [recipeScore, setRecipeScore] = useState<{
    greenScore: GreenScore | null;
    baseScore: number;
    meanBaseScore: number;
    productionBonus: number;
    transportBonus: number;
    packagingBonus: number;
    threatenedBonus: number;
  } | null>(null);

  const recipe = useRef(new Recipe([]));
  const resultsComputed = useRef(false);

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
    if (resultsComputed.current) computeScore();
  };

  const removeProduct = (product: Product) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p !== product));
    recipe.current.removeProduct(product);
    if (resultsComputed.current) computeScore();
  };

  const computeScore = () => {
    resultsComputed.current = true;
    console.log(recipe.current);
    recipe.current.products.forEach((product) => {
      product.computeBaseScoreFromCategory();
    });
    recipe.current.computeFullScores();
    setRecipeScore({
      greenScore: recipe.current.greenScore,
      baseScore: recipe.current.baseScore,
      meanBaseScore: recipe.current.meanBaseScore,
      productionBonus: recipe.current.bonusScore.production,
      transportBonus: recipe.current.bonusScore.transport,
      packagingBonus: recipe.current.bonusScore.packaging,
      threatenedBonus: recipe.current.bonusScore.speciesThreatened,
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
            Ajouter un produit <CirclePlus></CirclePlus>
          </Button>
        </div>
      </main>
      <div className="h-screen w-[2rem] relative">
        <SidebarTrigger className="sticky top-[50%] left-0"></SidebarTrigger>
      </div>

      <Sidebar className="results-sidebar" side="right">
        <SidebarHeader className="p-3">
          <div className="flex gap-[.5rem] justify-between">
            <img
              src={"picto-A+.svg"}
              height={30}
              width={30}
              alt="A+ GreenScore"
            ></img>
            <img
              src={"picto-A.svg"}
              height={30}
              width={30}
              alt="A GreenScore"
            ></img>
            <img
              src={"picto-B.svg"}
              height={30}
              width={30}
              alt="B GreenScore"
            ></img>
            <img
              src={"picto-C.svg"}
              height={30}
              width={30}
              alt="C GreenScore"
            ></img>
            <img
              src={"picto-D.svg"}
              height={30}
              width={30}
              alt="D GreenScore"
            ></img>
            <img
              src={"picto-E.svg"}
              height={30}
              width={30}
              alt="E GreenScore"
            ></img>
            <img
              src={"picto-F.svg"}
              height={30}
              width={30}
              alt="F GreenScore"
            ></img>
          </div>
          <Button size="lg" onClick={() => computeScore()}>
            Calculer le Green Score <ChartBar></ChartBar>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <RecipeResults
            recipeScore={recipeScore}
            products={products}
          ></RecipeResults>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-center gap-[.5rem] opacity-50">
            <span>Credits & Méthode: </span>
            <a
              className="underline"
              href="https://docs.score-environnemental.com/"
              target="_blank"
            >
              GreenScore
            </a>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default RecipeForm;
