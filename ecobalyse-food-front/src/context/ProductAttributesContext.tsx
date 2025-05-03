import {
  Country,
  FAOZone,
  OriginType,
  ThreatenedSpecies,
} from "@/types/countries";
import {
  ProductCategory,
  ProductLabel,
  ProductPackaging,
} from "@/types/products";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProductAttributesContextType {
  categories: ProductCategory[];
  labels: ProductLabel[];
  countries: Country[];
  faoZones: FAOZone[];
  packagings: ProductPackaging[];
  threatenedSpecies: ThreatenedSpecies[];
}

const ProductAttributesContext =
  createContext<ProductAttributesContextType | null>(null);

export function ProductAttributesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [faoZones, setFaoZones] = useState<FAOZone[]>([]);
  const [packagings, setPackagings] = useState<ProductPackaging[]>([]);
  const [threatenedSpecies, setThreatenedSpecies] = useState<
    ThreatenedSpecies[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fileContent = await fetch("agribalise-ref.json").then((res) => {
        return res.json();
      });
      try {
        const newCategories: ProductCategory[] = [];
        const trackLabels: string[] = [];
        const trackDuplicates: string[] = [];
        const trackNoValue: string[] = [];
        const arrayValues = fileContent.agribaliseRef as {
          name: string;
          agbScore: number | null;
        }[];
        arrayValues.forEach((productCategory, index) => {
          if (trackLabels.includes(productCategory.name)) {
            trackDuplicates.push(productCategory.name);
            return;
          }
          if (productCategory.agbScore === null) {
            trackNoValue.push(productCategory.name);
            return;
          }
          trackLabels.push(productCategory.name);
          newCategories.push({
            id: index,
            name: productCategory.name,
            agbScore: productCategory.agbScore,
          });
        });
        setCategories(newCategories);
        console.log("[AGB Data] Duplicates, No values", [
          trackDuplicates,
          trackNoValue,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchLabels = async () => {
      const fileContent = await fetch("labels.json").then((res) => {
        return res.json();
      });
      try {
        const newLabels: ProductLabel[] = fileContent.labels.map(
          (label: { name: string; bonus: number }) => {
            return {
              name: label.name,
              bonus: label.bonus,
            };
          }
        );
        setLabels(newLabels);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };
    const fetchCountries = async () => {
      const countryOriginFileContent = await fetch(
        "country-origin-ref.json"
      ).then((res) => {
        return res.json();
      });
      const countryTransportFileContent = await fetch(
        "country-transport-ref.json"
      ).then((res) => {
        return res.json();
      });

      try {
        const newCountries: Country[] = [];
        const trackDuplicates: string[] = [];
        const trackNoValue: string[] = [];
        const trackOrigin: string[] = [];
        const trackNoOrigin: string[] = [];
        let trackNoTransport: string[] = [];

        const countryOriginValues = countryOriginFileContent.originScores as {
          name: string;
          originScore: number;
        }[];

        const countryTransportValues =
          countryTransportFileContent.transportScores as {
            name: string;
            transportScore: number;
          }[];

        countryOriginValues.forEach((countryOrigin) => {
          if (trackOrigin.includes(countryOrigin.name)) {
            trackDuplicates.push(countryOrigin.name);
            return;
          }
          if (countryOrigin.originScore === null) {
            trackNoValue.push(countryOrigin.name);
            return;
          }
          trackOrigin.push(countryOrigin.name);
          trackNoTransport.push(countryOrigin.name);
          newCountries.push({
            type: OriginType.Country,
            name: countryOrigin.name,
            originScore: countryOrigin.originScore,
          });
        });

        countryTransportValues.forEach((countryTransport) => {
          const country = newCountries.find(
            (country) => country.name === countryTransport.name
          );
          if (!country) {
            trackNoOrigin.push(countryTransport.name);
            newCountries.push({
              type: OriginType.Country,
              name: countryTransport.name,
              transportScore: countryTransport.transportScore,
            });
            return;
          }
          trackNoTransport = [
            ...trackNoTransport.filter(
              (originCountry) => originCountry !== country.name
            ),
          ];
          if (countryTransport.transportScore === null) {
            trackNoValue.push(countryTransport.name);
            return;
          }
          country.transportScore = countryTransport.transportScore;
        });

        setCountries(newCountries);
        console.log(
          "[DocsScore Data] Duplicates, No values, No origin, No transport",
          [trackDuplicates, trackNoValue, trackNoOrigin, trackNoTransport]
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    const fetchPackagings = async () => {
      const fileContent = await fetch("packagings-ref.json").then((res) => {
        return res.json();
      });
      try {
        const newPackagings: ProductPackaging[] =
          fileContent.packagings as ProductPackaging[];
        setPackagings(newPackagings);
      } catch (error) {
        console.error("Error fetching packaging:", error);
      }
    };
    const fetchFAOZones = async () => {
      const fileContent = await fetch("fao-zones-ref.json").then((res) => {
        return res.json();
      });
      try {
        const newsFAOs: FAOZone[] = fileContent.faoZones.map(
          (species: Omit<FAOZone, "type">) => ({
            ...species,
            type: OriginType.FAO,
          })
        );
        setFaoZones(newsFAOs);
      } catch (error) {
        console.error("Error fetching faoZones:", error);
      }
    };
    const fetchThreatenedSpecies = async () => {
      const fileContent = await fetch("threatened-species-ref.json").then(
        (res) => {
          return res.json();
        }
      );
      try {
        const newsThreatenedSpecies: ThreatenedSpecies[] =
          fileContent.threatenedSpecies;
        setThreatenedSpecies(newsThreatenedSpecies);
      } catch (error) {
        console.error("Error fetching threatened species:", error);
      }
    };

    fetchLabels();
    fetchCategories();
    fetchFAOZones();
    fetchCountries();
    fetchPackagings();
    fetchThreatenedSpecies();
  }, []);

  const value = {
    categories,
    labels,
    faoZones,
    countries,
    packagings,
    threatenedSpecies,
  };

  return (
    <ProductAttributesContext.Provider value={value}>
      {children}
    </ProductAttributesContext.Provider>
  );
}

export function useProductAttributes(): ProductAttributesContextType {
  const context = useContext(ProductAttributesContext);
  if (context === null) {
    throw new Error(
      "useProductAttributes must be used within a ProductAttributesProvider"
    );
  }
  return context;
}
