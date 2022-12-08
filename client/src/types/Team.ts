import { Player } from "./Player"
export type Team = {
  roster: Player[],
  name: string,
  budget: number,
  year: number,
  owner: string,
}
