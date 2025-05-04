import { greenScoreLetterFromScore } from "@/utils/scores.utils";
import { Product } from "./products";
import { GreenScore } from "./scores";
import { MAX_RECIPE_BONUS } from "./constants";
import { OriginType } from "./countries";

export type RecipeBonuses = {
  production: number;
  transport: number;
  packaging: number;
  season: number;
  speciesThreatened: number;
};

export class Recipe {
  products: Product[] = [];
  baseScore = -1;
  meanBaseScore = -1;
  bonusScore: RecipeBonuses = {
    production: 0,
    transport: 0,
    packaging: 0,
    season: 0,
    speciesThreatened: 0,
  };
  greenScore: GreenScore | null = null;

  constructor(products: Product[]) {
    this.products = products;
  }

  public addProduct(product: Product) {
    this.products.push(product);
  }
  public removeProduct(product: Product) {
    this.products = this.products.filter((p) => p !== product);
  }

  public computeFullScores() {
    this.computeBaseScore();
    this.computeBonusScore();
    this.computeGreenScore();
  }

  public computeBaseScore() {
    const totalMass = this.computeTotalMass();
    const recipePoints = this.products.reduce((acc, product) => {
      if (!product.category || !product.active) return acc;
      return acc + (product.category.agbScore * product.quantity) / totalMass;
    }, 0);

    this.baseScore = Math.max(
      0,
      100 -
        (Math.log(10 * recipePoints + 1) /
          Math.log(2 + 1 / (100 * Math.pow(recipePoints, 4)))) *
          20
    );

    this.meanBaseScore = this.products.reduce((acc, product) => {
      if (!product.category || !product.active) return acc;
      return acc + (product.baseScore * product.quantity) / totalMass;
    }, 0);
  }

  public computeBonusScore() {
    this.computeProductionBonus();
    this.computeTransportBonus();
    this.computePackagingBonus();
    this.computeThreatMalus();
  }

  public computeProductionBonus() {
    const totalMass = this.computeTotalMass();
    const recipeProductionBonus = this.products.reduce((acc, product) => {
      if (!product.category || !product.active) return acc;
      product.computeProductionBonusScore();
      return (
        acc + (product.bonusScore.production * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.production = recipeProductionBonus;
  }

  public computeTransportBonus() {
    const totalMass = this.computeTotalMass();
    const recipeTransportBonus = this.products.reduce((acc, product) => {
      if (!product.category || !product.active) return acc;
      product.computeTransportBonusScore();
      return (
        acc + (product.bonusScore.transport * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.transport = recipeTransportBonus;
  }

  public computePackagingBonus() {
    const totalMass = this.computeTotalMass();
    const recipePackagingBonus = this.products.reduce((acc, product) => {
      if (!product.category || !product.active) return acc;
      product.computePackagingBonusScore();
      return (
        acc + (product.bonusScore.packaging * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.packaging = recipePackagingBonus;
  }

  public computeThreatMalus() {
    this.bonusScore.speciesThreatened = 0;
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product.hasPalmOil && !product.certifiedPalmOil) {
        this.bonusScore.speciesThreatened = -10;
        return;
      }
      if (product.threatenedSpecies) {
        for (let j = 0; j < product.threatenedSpecies.length; j++) {
          const threatenedSpecies = product.threatenedSpecies[j];
          if (
            threatenedSpecies.faoIds === "all" ||
            (product.origin &&
              product.origin.type === OriginType.FAO &&
              threatenedSpecies.faoIds.includes(product.origin.faoId))
          ) {
            this.bonusScore.speciesThreatened = -10;
            return;
          }
        }
      }
    }
  }

  public computeGreenScore() {
    const totalScore =
      this.baseScore +
      Math.min(
        MAX_RECIPE_BONUS,
        this.bonusScore.production +
          this.bonusScore.transport +
          this.bonusScore.packaging +
          this.bonusScore.speciesThreatened
      );
    const rangedScore = Math.max(0, Math.min(100, totalScore));

    this.greenScore = {
      letter: greenScoreLetterFromScore(rangedScore),
      value: rangedScore,
    };
  }

  public computeTotalMass() {
    return this.products.reduce((acc, product) => {
      if (!product.category || !product.active) return acc;
      return acc + product.quantity;
    }, 0);
  }
}
