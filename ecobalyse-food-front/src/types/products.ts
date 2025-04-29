import { canCumulateLabel } from "@/utils/products.utils";
import { Country } from "./countries";

export type ProductBonuses = {
  production: number;
  transport: number;
  packaging: number;
  speciesThreatened: number | "E";
};

export type ProductCategory = {
  id: number;
  name: string;
  agbScore: number;
};

export type ProductLabel = {
  name: string;
  bonus: number;
};

export class Product {
  id: string;
  category: ProductCategory | null = null;
  quantity = 0; // in kilograms
  origin: Country | null = null;

  baseScore = -1;
  bonusScore: ProductBonuses = {
    production: 0,
    transport: 0,
    packaging: 0,
    speciesThreatened: 0,
  };

  labels: ProductLabel[] = [];

  constructor() {
    this.id = crypto.randomUUID();
    this.quantity = 0.1;
  }

  computeBaseScoreFromCategory() {
    if (!this.category) return;
    const points = this.category.agbScore;
    this.baseScore =
      100 -
      (Math.log(10 * points + 1) /
        Math.log(2 + 1 / (100 * Math.pow(points, 4)))) *
        20;
  }

  computeBonusScore() {
    this.bonusScore.production = 0;
    if (this.labels.length) {
      const appliedLabelsName: string[] = [];
      const productionBonus = this.labels.reduce((acc, label) => {
        if (acc === 20 || !canCumulateLabel(appliedLabelsName, label.name)) {
          return acc;
        }
        appliedLabelsName.push(label.name);
        return Math.min(acc + label.bonus, 20);
      }, 0);
      this.bonusScore.production = productionBonus;
    } else {
      //TODO: score by country: https://docs.score-environnemental.com/methodologie/produit/systeme-de-production/origine
    }
  }
}
