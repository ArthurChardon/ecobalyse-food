export type Origin = Country | FAOZone;

export type Country = {
  type: "Country";
  name: string;
  originScore?: number;
  transportScore?: number;
};

export type FAOZone = {
  type: "FAO";
  faoId: number;
  ocean: string;
  transportScore?: number;
};
