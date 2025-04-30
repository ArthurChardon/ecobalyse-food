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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import "./RecipeForm.css";
import { Separator } from "../ui/separator";

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
    recipe.current.products.forEach((product) => {
      product.computeBaseScoreFromCategory();
    });
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

      <Sidebar className="results-sidebar" side="right">
        <SidebarHeader className="p-3">
          <div className="flex gap-[.5rem] justify-between">
            <img src={"picto-A+.svg"} height={30} width={30}></img>
            <img src={"picto-A.svg"} height={30} width={30}></img>
            <img src={"picto-B.svg"} height={30} width={30}></img>
            <img src={"picto-C.svg"} height={30} width={30}></img>
            <img src={"picto-D.svg"} height={30} width={30}></img>
            <img src={"picto-E.svg"} height={30} width={30}></img>
            <img src={"picto-F.svg"} height={30} width={30}></img>
          </div>
          <Button size="lg" onClick={() => computeScore()}>
            Calculer Score
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex flex-col pb-2 grow gap-[1rem]">
            {!!recipeScore && (
              <>
                <Separator></Separator>
                <div className="bg-secondary rounded-[.625rem] px-2 pt-2">
                  <h3>Produits</h3>
                  <Accordion type="single" collapsible>
                    {products
                      .filter((product) => product.category)
                      .map((product) => (
                        <AccordionItem
                          key={product.id}
                          value={product.id}
                          className="flex flex-col py-[.5rem] w-full"
                        >
                          <AccordionTrigger className="w-full">
                            <h4 className="truncate">
                              {product.category?.name}
                            </h4>
                            <span className="min-w-max ml-auto">
                              {product.quantity} kg
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex justify-between">
                              Produit:{" "}
                              <span>{product.baseScore.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              Production:{" "}
                              <span>
                                {product.bonusScore.production > 0 ? "+" : ""}
                                {product.bonusScore.production.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              Transport:{" "}
                              <span>
                                {product.bonusScore.transport > 0 ? "+" : ""}
                                {product.bonusScore.transport.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              Emballage:{" "}
                              <span>
                                {product.bonusScore.packaging > 0 ? "+" : ""}
                                {product.bonusScore.packaging.toFixed(1)}
                              </span>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
                <Separator></Separator>
                <div className="bg-secondary rounded-[.625rem] px-2 pt-2">
                  <h3 className="">Recette</h3>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="1">
                      <AccordionTrigger className="flex items-center">
                        <strong>
                          Green score:{" "}
                          {recipeScore.greenScore?.value.toFixed(1)}{" "}
                        </strong>
                        <img
                          className="ml-auto"
                          src={
                            "picto-" + recipeScore.greenScore?.letter + ".svg"
                          }
                          height={30}
                          width={30}
                        ></img>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          Base score: {recipeScore?.baseScore.toFixed(1)}
                        </div>
                        <div>
                          Bonus production:{" "}
                          {recipeScore?.productionBonus.toFixed(0)}
                        </div>
                        <div>
                          Bonus transport:{" "}
                          {recipeScore?.transportBonus.toFixed(0)}
                        </div>
                        <div>
                          Malus emballage:{" "}
                          {recipeScore?.packagingBonus.toFixed(0)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </>
            )}
            <Separator className="mt-auto"></Separator>
            <div className="bg-secondary rounded-[.625rem] py-4 px-2">
              {recipeScore && (
                <div className="flex items-center justify-around">
                  <span className="main-result">
                    <strong>{recipeScore.greenScore?.value.toFixed(1)}</strong>{" "}
                    / 100
                  </span>
                  <img
                    src={"picto-" + recipeScore.greenScore?.letter + ".svg"}
                    height={60}
                    width={60}
                  ></img>
                </div>
              )}
            </div>
            <Separator></Separator>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-center gap-[.5rem] opacity-50">
            <span>Credits & Méthode: </span>
            <a
              className="underline"
              href="https://docs.score-environnemental.com/"
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
