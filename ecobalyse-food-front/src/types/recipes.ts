import { greenScoreLetterFromScore } from "@/utils/scores.utils";
import { Product } from "./products";
import { GreenScore } from "./scores";
import { MAX_RECIPE_BONUS } from "./constants";

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
    const totalMass = this.products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
    const recipePoints = this.products.reduce((acc, product) => {
      if (!product.category) return acc;
      return acc + (product.category.agbScore * product.quantity) / totalMass;
    }, 0);

    this.baseScore =
      100 -
      (Math.log(10 * recipePoints + 1) /
        Math.log(2 + 1 / (100 * Math.pow(recipePoints, 4)))) *
        20;
  }

  public computeBonusScore() {
    this.computeProductionBonus();
    this.computeTransportBonus();
    this.computePackagingBonus();
  }

  public computeProductionBonus() {
    const totalMass = this.products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
    const recipeProductionBonus = this.products.reduce((acc, product) => {
      if (!product.category) return acc;
      product.computeProductionBonusScore();
      return (
        acc + (product.bonusScore.production * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.production = recipeProductionBonus;
  }

  public computeTransportBonus() {
    const totalMass = this.products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
    const recipeTransportBonus = this.products.reduce((acc, product) => {
      if (!product.category) return acc;
      product.computeTransportBonusScore();
      return (
        acc + (product.bonusScore.transport * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.transport = recipeTransportBonus;
  }

  public computePackagingBonus() {
    const totalMass = this.products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
    const recipePackagingBonus = this.products.reduce((acc, product) => {
      if (!product.category) return acc;
      product.computePackagingBonusScore();
      return (
        acc + (product.bonusScore.packaging * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.packaging = recipePackagingBonus;
  }

  public computeGreenScore() {
    const totalScore =
      this.baseScore +
      Math.min(
        MAX_RECIPE_BONUS,
        this.bonusScore.production +
          this.bonusScore.transport +
          this.bonusScore.packaging
      );
    const rangedScore = Math.max(0, Math.min(100, totalScore));

    this.greenScore = {
      letter: greenScoreLetterFromScore(rangedScore),
      value: rangedScore,
    };
  }
}
