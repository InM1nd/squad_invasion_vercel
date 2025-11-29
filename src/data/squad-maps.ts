/**
 * Squad Game Maps
 * List of all available maps in Squad game
 */

export interface SquadMap {
  id: string;
  name: string;
  region: string;
  displayName: string;
}

export const SQUAD_MAPS: SquadMap[] = [
  // Northern Europe
  { id: "harju", name: "Harju", region: "northern_europe", displayName: "Harju" },
  { id: "skorpo", name: "Skorpo", region: "northern_europe", displayName: "Skorpo" },
  
  // Eastern Europe
  { id: "narva", name: "Narva", region: "eastern_europe", displayName: "Narva" },
  { id: "yehorivka", name: "Yehorivka", region: "eastern_europe", displayName: "Yehorivka" },
  { id: "belaya", name: "Belaya", region: "eastern_europe", displayName: "Belaya" },
  { id: "gorodok", name: "Gorodok", region: "eastern_europe", displayName: "Gorodok" },
  { id: "kamdesh", name: "Kamdesh", region: "eastern_europe", displayName: "Kamdesh" },
  { id: "kohat", name: "Kohat", region: "eastern_europe", displayName: "Kohat" },
  { id: "lashkar_valley", name: "Lashkar Valley", region: "eastern_europe", displayName: "Lashkar Valley" },
  { id: "mutaha", name: "Mutaha", region: "eastern_europe", displayName: "Mutaha" },
  { id: "tallil_outskirts", name: "Tallil Outskirts", region: "eastern_europe", displayName: "Tallil Outskirts" },
  
  // Southern Asia
  { id: "logar_valley", name: "Logar Valley", region: "southern_asia", displayName: "Logar Valley" },
  { id: "sumari_bala", name: "Sumari Bala", region: "southern_asia", displayName: "Sumari Bala" },
  { id: "kokan", name: "Kokan", region: "southern_asia", displayName: "Kokan" },
  
  // Eastern Asia
  { id: "sanxian_islands", name: "Sanxian Islands", region: "eastern_asia", displayName: "Sanxian Islands" },
  
  // Middle East
  { id: "al_basrah", name: "Al Basrah", region: "middle_east", displayName: "Al Basrah" },
  { id: "fallujah", name: "Fallujah", region: "middle_east", displayName: "Fallujah" },
  { id: "mestia", name: "Mestia", region: "middle_east", displayName: "Mestia" },
  { id: "chora", name: "Chora", region: "middle_east", displayName: "Chora" },
  
  // North America
  { id: "goose_bay", name: "Goose Bay", region: "north_america", displayName: "Goose Bay" },
  { id: "manicouagan", name: "Manicouagan", region: "north_america", displayName: "Manicouagan" },
  { id: "nanisivik", name: "Nanisivik", region: "north_america", displayName: "Nanisivik" },
];

export const MAPS_BY_REGION = {
  northern_europe: SQUAD_MAPS.filter((map) => map.region === "northern_europe"),
  eastern_europe: SQUAD_MAPS.filter((map) => map.region === "eastern_europe"),
  southern_asia: SQUAD_MAPS.filter((map) => map.region === "southern_asia"),
  eastern_asia: SQUAD_MAPS.filter((map) => map.region === "eastern_asia"),
  middle_east: SQUAD_MAPS.filter((map) => map.region === "middle_east"),
  north_america: SQUAD_MAPS.filter((map) => map.region === "north_america"),
};

export function getMapById(id: string): SquadMap | undefined {
  return SQUAD_MAPS.find((map) => map.id === id);
}

export function getMapByName(name: string): SquadMap | undefined {
  return SQUAD_MAPS.find((map) => map.name.toLowerCase() === name.toLowerCase());
}

