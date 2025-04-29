import { BaseSyntheticEvent, useState } from "react";
import { Input } from "../ui/input";
import "./ProductForm.css";
import { Product } from "@/types/products";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import { useProductAttributes } from "@/context/ProductAttributesContext";
import { MultiSelect } from "../ui/multiselect";
import InfoTooltip from "../ui/info-tooltip";
import { Card, CardContent, CardFooter } from "../ui/card";

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
  const [originScore, setOriginScore] = useState<number>(-1);
  const [transportScore, setTransportScore] = useState<number>(-1);
  const {
    categories,
    labels: productLabels,
    countries,
  } = useProductAttributes();

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

  const countrySelected = (value: string) => {
    if (!value) {
      setOriginScore(-1);
      setTransportScore(-1);
      return;
    }
    const selectedCountry = countries.find((country) => country.name === value);
    if (selectedCountry) {
      product.origin = selectedCountry;
      updateProduct(product);
      setOriginScore(selectedCountry.originScore ?? -1);
      setTransportScore(selectedCountry.transportScore ?? -1);
    } else {
      setOriginScore(-1);
      setTransportScore(-1);
      console.error("Category not found");
    }
  };

  const categorySelected = (value: string) => {
    if (!value) {
      setCategoryScore(-1);
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
      setCategoryScore(-1);
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
    <Card>
      <CardContent>
        <form>
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
            <div className="flex gap-[.5rem] items-center">
              <label className="product-form-label">Labels</label>
              <InfoTooltip>
                <p>
                  Les labels justifient de bénéfices environnementaux sur la
                  production du produit.
                </p>
              </InfoTooltip>
            </div>
            <MultiSelect
              placeholder="ex: Demeter, Fairtrade"
              options={productLabels.map((label) => ({
                label: label.name,
                value: label.name,
              }))}
              onValueChange={(value) => labelsSelected(value)}
            ></MultiSelect>
          </div>
          <div className="mb-3">
            <div className="flex gap-[.5rem] items-center">
              <label htmlFor="origin" className="product-form-label">
                Origine
              </label>
              <InfoTooltip>
                <p>
                  L'origine géographique du produit a des impacts sur la
                  production et le transport.
                </p>
              </InfoTooltip>
            </div>
            <Combobox
              options={countries.map((country) => country.name)}
              visibleOptionsLimit={20}
              placeholder="ex: France"
              onChange={(value) => {
                countrySelected(value);
              }}
            ></Combobox>
            {originScore >= 0 && (
              <div>Country origin score: {originScore.toFixed(2)}</div>
            )}
            {transportScore >= 0 && (
              <div>Country transport score: {transportScore.toFixed(2)}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="product-form-label">
              Quantité (en kg)
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
        </form>
      </CardContent>
      <CardFooter>
        <Button className="bg-destructive" onClick={() => removeProduct()}>
          Retirer produit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
