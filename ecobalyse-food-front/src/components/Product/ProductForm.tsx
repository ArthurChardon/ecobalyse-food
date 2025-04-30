import { BaseSyntheticEvent } from "react";
import { Input } from "../ui/input";
import { Product } from "@/types/products";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import { useProductAttributes } from "@/context/ProductAttributesContext";
import { MultiSelect } from "../ui/multiselect";
import InfoTooltip from "../ui/info-tooltip";
import { Card, CardContent, CardFooter } from "../ui/card";

import "./ProductForm.css";

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
    countries,
    packagings,
  } = useProductAttributes();

  const quantitySelected = (value: string) => {
    product.quantity = +value;
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
      console.error("Category not found");
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
              placeholder="ex: Biscuit de Savoie"
              onChange={(value) => {
                categorySelected(value);
              }}
            ></Combobox>
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
            onValueChange={(values) => {
              packagingSelected(values);
            }}
          ></MultiSelect>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => removeProduct()}>
          Retirer produit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
