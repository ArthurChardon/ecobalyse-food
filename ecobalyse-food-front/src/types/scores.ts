export type GreenScore = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

export type BonusScores = {
  production: number;
  transport: number;
  packaging: number;
  speciesThreatened: number | "E";
};
