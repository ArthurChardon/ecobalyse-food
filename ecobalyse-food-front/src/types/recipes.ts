import { greenScoreFromScore } from "@/utils/scores.utils";
import { Product } from "./products";
import { BonusScores, GreenScore } from "./scores";

export class Recipe {
  products: Product[] = [];
  baseScore = -1;
  bonusScore: BonusScores = {
    production: 0,
    transport: 0,
    packaging: 0,
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

  public computeProductionBonus() {
    const totalMass = this.products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
    const recipeProductionBonus = this.products.reduce((acc, product) => {
      if (!product.category) return acc;
      product.computeBonusScore();
      return (
        acc + (product.bonusScore.production * product.quantity) / totalMass
      );
    }, 0);
    this.bonusScore.production = recipeProductionBonus;
  }

  public computeGreenScore() {
    const totalScore = this.baseScore + this.bonusScore.production;
    this.greenScore = greenScoreFromScore(totalScore);
  }
}
