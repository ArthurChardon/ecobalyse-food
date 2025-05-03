export type Origin = Country | FAOZone;

export enum OriginType {
  "Country",
  "FAO",
}

export type Country = {
  type: OriginType.Country;
  name: string;
  originScore?: number;
  transportScore?: number;
};

export type FAOZone = {
  type: OriginType.FAO;
  faoId: number;
  ocean: string;
  transportScore?: number;
};

export type ThreatenedSpecies = {
  species: string;
  faoIds: "all" | number[];
};
