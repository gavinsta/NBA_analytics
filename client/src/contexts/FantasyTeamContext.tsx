import React, { createContext, useState, useContext, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Player } from "../../../server/types/Player"
import { Team } from "../../../server/types/Team"
import { useToast } from "@chakra-ui/react"
import { trySearchDatabase, trySaveTeam, tryLoadTeam, tryLoadTeamMetadata } from "../utils/DataUtils"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse"
import { SQLsearchterm } from "../../../server/types/QueryRequest"
import generateTeamName from "../utils/TeamNameGenerator"
import { useAppContext } from "./AppContext";
interface ContextType {
  team: Team | null;
  playerMetas: Player[];
  createNewTeam: (name?: string | null) => void;
  saveTeam: () => void;
  loadTeam: (team_id: string) => Promise<Team | null>;
  clearTeam: () => void;
  checkBudget: (cost: number) => boolean;
  currentBudget: () => number;
  budget: number;
  addPlayer: (player: Player, meta: Player) => void;
  removePlayer: (player: Player) => void;
  viewPlayer: (player: Player) => void;
  checkAvailability: (playerName: Player) => "unavailable" | "nobudget" | "available";

}

export const FantasyTeamContext = createContext<ContextType>({
  team: null,
  playerMetas: [],
  createNewTeam: () => { },
  saveTeam: () => { },
  loadTeam: async () => { return null },
  clearTeam: () => { },
  checkBudget: () => { return false },
  currentBudget: () => { return 0 },
  budget: 0,
  addPlayer: () => { },
  removePlayer: () => { },
  viewPlayer: () => { },
  checkAvailability: () => { return "unavailable" },

});

export const FantasyTeamProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { URL } = useAppContext();
  const [team, setTeam] = useState<Team | null>(null);

  const toast = useToast();
  const [budget, setBudget] = useState<number>(0)
  const [playerMetas, setPlayerMetas] = useState<Player[]>([])
  useEffect(() => {
    const savedTeam = localStorage.getItem("team");
    if (savedTeam) {
      const foundTeam = JSON.parse(savedTeam);
      setTeam(foundTeam)
    }
  }, [])
  function createNewTeam(name?: string | null) {
    const newTeam: Team = {
      name: generateTeamName(),
      roster: [],
      budget: 140000000,
      year: 2022,

    }
    setTeam(newTeam)
    setBudget(newTeam.budget)
  }
  async function saveTeam() {
    if (team) {
      const result = await trySaveTeam(URL, team)
      toast({
        status: result.status,
        title: result.title,
        description: result.text
      })
    }
    else {
      toast({
        status: "error",
        title: "User has no team!",
        description: "This is an unusual issue... sorry!"
      })
    }
  }

  async function loadTeam(team_id: string): Promise<Team | null> {
    const result = await tryLoadTeam(URL, team_id)
    toast({
      status: result.status,
      title: result.title,
      description: result.text
    })
    if (result.team) {
      setTeam(result.team)
      setBudget(result.team.budget)

      const metaResult = await tryLoadTeamMetadata(URL, team_id)
      if (metaResult.status == "success") {
        setPlayerMetas(metaResult.metaDatas)
      }

      return result.team
    }
    else return null
  }
  function clearTeam() {
    setTeam(null)
    setPlayerMetas([])
  }
  function checkBudget(cost: number): boolean {
    if (budget - cost <= 0) {
      return false;
    }
    else return true;
  }

  function currentBudget(): number {
    if (team) {
      let price: number = 0;
      for (var player of team.roster) {
        price = price + +player.ContractPrice;
      }
      return team.budget - price;
    }
    else return 140000000;
  }

  function checkAvailability(player: Player): "available" | "unavailable" | "nobudget" {

    if (!checkBudget(player.ContractPrice)) {
      return "nobudget"
    }
    if (team) {
      for (var i = 0; i < team.roster.length; i++) {
        if (team.roster[i].PlayerName === player.PlayerName) {
          return "unavailable"
        }
      }
      return "available"
    }
    else return "available"

  }
  function viewPlayer(player: Player) {

  }
  function addPlayer(player: Player, meta: Player) {
    if (team) {
      setTeam({ ...team, roster: [...team.roster, player] })
      playerMetas.push(meta)
    }
    // Prevent item select in mobile
    //if (isMobile) return;
  }

  function removePlayer(player: Player) {
    //console.log(`trying to remove ${player.PlayerName}`)
    if (team) {
      const index = team.roster.indexOf(player)
      if (index > -1) {
        team.roster.splice(index, 1)
        setTeam({ ...team })
        playerMetas.splice(index, 1)
      }
    }
  }
  return (
    <FantasyTeamContext.Provider
      value={{
        team,
        playerMetas,
        createNewTeam,
        saveTeam,
        loadTeam,
        clearTeam,
        checkBudget,
        currentBudget,
        budget,
        addPlayer,
        removePlayer,
        checkAvailability,
        viewPlayer,
      }}
    >
      {children}
    </FantasyTeamContext.Provider>
  );
};

export const useFantasyTeam = () => {
  const context = useContext(FantasyTeamContext);
  if (context === undefined) {
    throw new Error(
      "useFantasyTeam must be used within a FantasyTeamProvider"
    );
  }
  return context;
};