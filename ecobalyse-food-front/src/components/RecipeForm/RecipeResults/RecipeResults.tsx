import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/products";
import { GreenScore } from "@/types/scores";

const RecipeResults = ({
  recipeScore,
  products,
}: {
  recipeScore: {
    greenScore: GreenScore | null;
    baseScore: number;
    meanBaseScore: number;
    productionBonus: number;
    transportBonus: number;
    packagingBonus: number;
    threatenedBonus: number;
  } | null;
  products: Product[];
}) => {
  return (
    <div className="flex flex-col pb-2 grow gap-[1rem]">
      {!!recipeScore && (
        <>
          <Separator></Separator>
          <div className="bg-secondary rounded-[.625rem] px-2 pt-2">
            <h2>Produits</h2>
            <Accordion type="single" collapsible>
              {products
                .filter((product) => product.category && product.active)
                .map((product) => (
                  <AccordionItem
                    key={product.id}
                    value={product.id}
                    className="flex flex-col py-[.5rem] w-full"
                  >
                    <AccordionTrigger className="w-full">
                      <h4 className="truncate">{product.category?.name}</h4>
                      <span className="min-w-max ml-auto">
                        {product.quantity} kg
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between">
                        Produit: <span>{product.baseScore.toFixed(1)}</span>
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
            <h2 className="">Recette</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="1">
                <AccordionTrigger className="flex items-center">
                  <strong>
                    Green score: {recipeScore.greenScore?.value.toFixed(1)}{" "}
                  </strong>
                  <img
                    className="ml-auto"
                    src={"picto-" + recipeScore.greenScore?.letter + ".svg"}
                    height={30}
                    width={30}
                  ></img>
                </AccordionTrigger>
                <AccordionContent>
                  <div>Base score: {recipeScore?.baseScore.toFixed(1)}</div>
                  <div>
                    Moyenne base score produits:{" "}
                    {recipeScore?.meanBaseScore.toFixed(1)}
                  </div>
                  <div>
                    Bonus production: {recipeScore?.productionBonus.toFixed(0)}
                  </div>
                  <div>
                    Bonus transport: {recipeScore?.transportBonus.toFixed(0)}
                  </div>
                  <div>
                    Malus emballage: {recipeScore?.packagingBonus.toFixed(0)}
                  </div>
                  <div>
                    Malus espèces menacées:{" "}
                    {recipeScore?.threatenedBonus.toFixed(0)}
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
              <strong>{recipeScore.greenScore?.value.toFixed(1)}</strong> / 100
            </span>
            <img
              src={"picto-" + recipeScore.greenScore?.letter + ".svg"}
              height={60}
              width={60}
              alt={recipeScore.greenScore?.letter + " GreenScore"}
            ></img>
          </div>
        )}
      </div>
      <Separator></Separator>
    </div>
  );
};

export default RecipeResults;
