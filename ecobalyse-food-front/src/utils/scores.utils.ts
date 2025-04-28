import { GreenScore } from "@/types/scores";

export const greenScoreFromScore = (score: number): GreenScore => {
  if (score >= 90) return "A+";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  if (score >= 30) return "D";
  if (score >= 15) return "E";
  return "F";
};
