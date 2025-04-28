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
  quantity: number = 0; // in kilograms
  baseScore = -1;
  bonusScore = 0;

  label: ProductLabel | null = null;

  constructor() {
    this.id = crypto.randomUUID();
  }

  setLabel(label: ProductLabel) {
    this.label = label;
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
}
