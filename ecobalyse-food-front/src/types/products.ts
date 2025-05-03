import { canCumulateLabel } from "@/utils/products.utils";
import { Origin, OriginType, ThreatenedSpecies } from "./countries";
import {
  MAX_PRODUCT_LABEL_BONUS,
  MAX_PRODUCT_PACKAGING_MALUS,
} from "./constants";

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

export type ProductPackaging = {
  format: string;
  bonus: number;
};

export class Product {
  id: string;
  category: ProductCategory | null = null;
  packagings: ProductPackaging[] = [];
  quantity: number; // in kilograms
  origin: Origin | null = null;
  active: boolean;
  nonRspoOilPalm = false;
  threatenedSpecies: ThreatenedSpecies[] = [];

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
    this.active = true;
  }

  computeBaseScoreFromCategory() {
    if (!this.category) return;
    const points = this.category.agbScore;
    this.baseScore = Math.max(
      0,
      100 -
        (Math.log(10 * points + 1) /
          Math.log(2 + 1 / (100 * Math.pow(points, 4)))) *
          20
    );
  }

  computeProductionBonusScore() {
    this.bonusScore.production = 0;
    if (this.labels.length) {
      // if labels are present
      const appliedLabelsName: string[] = [];
      const productionBonus = this.labels.reduce((acc, label) => {
        if (
          acc === MAX_PRODUCT_LABEL_BONUS ||
          !canCumulateLabel(appliedLabelsName, label.name)
        ) {
          return acc;
        }
        appliedLabelsName.push(label.name);
        return Math.min(MAX_PRODUCT_LABEL_BONUS, acc + label.bonus);
      }, 0);
      this.bonusScore.production = productionBonus;
    } else {
      // else compute score from origin country
      if (this.origin && this.origin.type === OriginType.Country)
        this.bonusScore.production = this.origin.originScore
          ? this.origin.originScore / 10 - 5
          : 0;
    }
  }

  computeTransportBonusScore() {
    this.bonusScore.transport = this.origin?.transportScore
      ? this.origin.transportScore * 0.15
      : 0;
  }

  computePackagingBonusScore() {
    this.bonusScore.packaging =
      this.packagings.reduce((acc, packaging) => {
        return Math.max(MAX_PRODUCT_PACKAGING_MALUS, acc + packaging.bonus);
      }, 0) ?? 0;
  }
}
