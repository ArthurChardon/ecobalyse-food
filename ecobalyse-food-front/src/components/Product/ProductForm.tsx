import { BaseSyntheticEvent, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Product } from "@/types/products";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import { useProductAttributes } from "@/context/ProductAttributesContext";
import { MultiSelect } from "../ui/multiselect";
import InfoTooltip from "../ui/info-tooltip";
import { Card, CardContent, CardFooter } from "../ui/card";

import "./ProductForm.css";
import { CircleMinus } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

const ProductForm = ({
  product,
  updateProduct,
  removeProduct,
}: {
  product: Product;
  updateProduct: (product: Product) => void;
  removeProduct: () => void;
}) => {
  const {
    categories,
    labels: productLabels,
    faoZones,
    countries,
    packagings,
    threatenedSpecies,
  } = useProductAttributes();
  const hasPalmOil = useRef(false);
  const certifiedPalmOil = useRef(false);
  const productQuantityInGrams = useRef(100);
  const [isFishing, setIsFishing] = useState(false);

  const quantitySelected = (value: string) => {
    productQuantityInGrams.current = +value;
    product.quantity = productQuantityInGrams.current / 1000;
    updateProduct(product);
  };

  const packagingSelected = (values: string[]) => {
    const selectedPackagings = packagings.filter((packaging) =>
      values.includes(packaging.format)
    );
    if (selectedPackagings) {
      product.packagings = selectedPackagings;
      updateProduct(product);
    } else {
      console.error("Packaging not found");
    }
  };

  const labelsSelected = (values: string[]) => {
    const selectedLabels = productLabels.filter((label) =>
      values.includes(label.name)
    );
    if (selectedLabels) {
      product.labels = selectedLabels;
      updateProduct(product);
    } else {
      console.error("Category not found");
    }
  };

  const countrySelected = (value: string) => {
    if (!value) {
      return;
    }
    const selectedCountry = countries.find((country) => country.name === value);
    if (selectedCountry) {
      product.origin = selectedCountry;
      updateProduct(product);
    } else {
      console.error("Country not found");
    }
  };

  const faoZoneSelected = (value: string) => {
    if (!value) {
      return;
    }
    const selectedFaoZone = faoZones.find((faoZone) => faoZone.ocean === value);
    if (selectedFaoZone) {
      product.origin = selectedFaoZone;
      updateProduct(product);
    } else {
      console.error("FAO Zone not found");
    }
  };

  const categorySelected = (value: string) => {
    if (!value) {
      return;
    }
    const selectedCategory = categories.find(
      (category) => category.name === value
    );
    if (selectedCategory) {
      product.category = selectedCategory;
      updateProduct(product);
    } else {
      console.error("Category not found");
    }
  };

  const theratenedSpeciesSelected = (values: string[]) => {
    const selectedThreatenedSpecies = threatenedSpecies.filter((species) =>
      values.includes(species.species)
    );
    if (selectedThreatenedSpecies) {
      product.threatenedSpecies = selectedThreatenedSpecies;
      updateProduct(product);
    } else {
      console.error("Threatened species not found");
    }
  };

  const hasPalmOilCheck = (check: boolean | string) => {
    product.nonRspoOilPalm = check ? !certifiedPalmOil.current : false;
    hasPalmOil.current = !!check;
    updateProduct(product);
  };

  const certifiedPalmOilCheck = (check: boolean | string) => {
    product.nonRspoOilPalm = check ? false : hasPalmOil.current;
    certifiedPalmOil.current = !!check;
    updateProduct(product);
  };

  const toggleActiveProduct = () => {
    product.active = !product.active;
    updateProduct(product);
  };

  const toggleIsFishing = () => {
    setIsFishing(!isFishing);
    product.origin = null;
    updateProduct(product);
  };

  return (
    <Card className={product.active ? "" : "opacity-60"}>
      <CardContent>
        <form className="relative">
          <Checkbox
            className="absolute top-0 right-0"
            aria-label="actif"
            checked={product.active}
            onCheckedChange={() => toggleActiveProduct()}
          ></Checkbox>
          <div className="mb-3">
            <label htmlFor="category" className="product-form-label">
              Catégorie
            </label>
            <Combobox
              name="category"
              options={categories.map((category) => category.name)}
              visibleOptionsLimit={20}
              placeholder="ex: Biscuit de Savoie"
              onChange={(value) => {
                categorySelected(value as string);
              }}
            ></Combobox>
          </div>
          <div className="mb-3">
            <div className="flex gap-[.5rem] items-center">
              <label className="product-form-label" htmlFor="labels">
                Labels
              </label>
              <InfoTooltip>
                <p>
                  Les labels justifient de bénéfices environnementaux sur la
                  production du produit.
                </p>
              </InfoTooltip>
            </div>
            <MultiSelect
              name="labels"
              placeholder="ex: Demeter, Fairtrade"
              options={productLabels.map((label) => ({
                label: label.name,
                value: label.name,
              }))}
              onValueChange={(value) => labelsSelected(value)}
            ></MultiSelect>
          </div>
          <div className="mb-3 flex gap-[.5rem] items-center">
            <label htmlFor="is-fishing">Produit de la pêche</label>
            <Checkbox id="is-fishing" onCheckedChange={() => toggleIsFishing()}>
              {" "}
            </Checkbox>
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
            {isFishing ? (
              <Combobox
                name="origin"
                options={faoZones.map((faoZone) => faoZone.ocean)}
                visibleOptionsLimit={20}
                placeholder="ex: Atlantique Sud-Est"
                onChange={(value) => {
                  faoZoneSelected(value as string);
                }}
              ></Combobox>
            ) : (
              <Combobox
                name="origin"
                options={countries.map((country) => country.name)}
                visibleOptionsLimit={20}
                placeholder="ex: France"
                onChange={(value) => {
                  countrySelected(value as string);
                }}
              ></Combobox>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="product-form-label">
              Quantité (en g)
            </label>
            <Input
              type="number"
              className="form-control"
              id="quantity"
              placeholder="ex: 100"
              defaultValue={productQuantityInGrams.current}
              onInput={(event: BaseSyntheticEvent) =>
                quantitySelected(event.target.value)
              }
            />
          </div>
          <div className="mb-3">
            <div className="flex gap-[.5rem] items-center">
              <label htmlFor="packaging" className="product-form-label">
                Emballages
              </label>
              <InfoTooltip>
                <p>
                  L'emballage alimentaire a un impact selon sa matière première
                  ainsi que sa fin de vie.
                </p>
              </InfoTooltip>
            </div>
            <MultiSelect
              options={packagings.map((packaging) => ({
                label: packaging.format,
                value: packaging.format,
              }))}
              placeholder="ex: Barquette en carton"
              id="packaging"
              onValueChange={(values) => {
                packagingSelected(values);
              }}
            ></MultiSelect>
          </div>
          <div className="mb-3 flex gap-[.5rem] items-center">
            <label htmlFor="palm-oil">Contient de l'huile de palme</label>
            <Checkbox id="palm-oil" onCheckedChange={(e) => hasPalmOilCheck(e)}>
              {" "}
            </Checkbox>
          </div>
          {hasPalmOil.current && (
            <div className="mb-3 flex gap-[.5rem] items-center">
              <label htmlFor="certified-palm-oil">
                Huile de palme certifiée RSPO (SG / IP)
              </label>
              <Checkbox
                id="certified-palm-oil"
                onCheckedChange={(e) => certifiedPalmOilCheck(e)}
              >
                {" "}
              </Checkbox>
            </div>
          )}
          <div className="mb-3">
            <div className="flex gap-[.5rem] items-center">
              <label
                htmlFor="threatened-species"
                className="product-form-label"
              >
                Espèces menacées
              </label>
              <InfoTooltip>
                <p>
                  La présence d'espèces non durables entraîne des malus et/ou un
                  label E.
                </p>
              </InfoTooltip>
              <InfoTooltip icon="circle-help">
                <p>Sélectionnez les espèces présentes dans le produit.</p>
              </InfoTooltip>
            </div>{" "}
            <MultiSelect
              options={threatenedSpecies.map((species) => ({
                label: species.species,
                value: species.species,
              }))}
              placeholder="ex: Thon Rouge"
              id="threatened-species"
              onValueChange={(values) => {
                theratenedSpeciesSelected(values);
              }}
            ></MultiSelect>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => removeProduct()}>
          Retirer produit <CircleMinus></CircleMinus>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
