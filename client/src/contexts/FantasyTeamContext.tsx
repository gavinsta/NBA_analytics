import React, { createContext, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import { Player } from "../../../server/types/Player"
import { Team } from "../../../server/types/Team"
import { useToast } from "@chakra-ui/react"
import { trySearchDatabase } from "../utils/DataUtils"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse"
import { SQLsearchterm } from "../../../server/types/QueryRequest"
interface ContextType {
  team: Team | null;
  createNewTeam: (name: string | null) => void;
  checkBudget: (cost: number) => boolean;
  budgetLeft: number;
  addPlayer: (player: Player) => void;
  viewPlayer: (player: Player) => void;
  clear: () => void;
  submitSearch: (search: SQLsearchterm) => void;
  queriedPlayers: Player[]
}

export const FantasyTeamContext = createContext<ContextType>({
  team: null,
  createNewTeam: () => { },
  checkBudget: () => { return false },
  budgetLeft: 0,
  addPlayer: () => { },
  viewPlayer: () => { },
  clear: () => { },
  submitSearch: () => { },
  queriedPlayers: []
});
const URL = "http://localhost:8080"
export const FantasyTeamProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const toast = useToast();
  const [budgetLeft, setBudgetLeft] = useState<number>(0)
  const [queriedPlayers, setQueriedPlayers] = useState<Player[]>([])
  function createNewTeam(name: string | null) {
    const newTeam: Team = {
      name: "Test Team",
      roster: [],
      budget: 140000000,
      year: 2022
    }
    setTeam(newTeam)
    setBudgetLeft(newTeam.budget)
  }
  function checkBudget(cost: number): boolean {
    if (budgetLeft - cost <= 0) {
      return false;
    }
    else return true;
  }
  function addPlayer(player: Player) {
    if (team) {
      team?.roster.push(player)
      setBudgetLeft(budgetLeft - player.ContractPrice)
    }
    // Prevent item select in mobile
    //if (isMobile) return;
  }

  function viewPlayer(player: Player) {

  }

  const submitSearch = async (search: SQLsearchterm) => {

    const res: PlayerQueryResponse = await trySearchDatabase(
      URL + "/search", search
    )
    if (res.status === "error") {
      toast({
        status: "error",
        title: res.title,
        description: res.text,
      })
    }
    else {
      toast({
        status: "success",
        title: res.title,
        description: res.text,
      })
      setQueriedPlayers(res.players)
    }
  }



  function clear() {
    setTeam(null);
  }
  /*
    function isSelected(key: string) {
      return values.includes(key);
    }
  */
  return (
    <FantasyTeamContext.Provider
      value={{
        team,
        createNewTeam,
        checkBudget,
        budgetLeft,
        addPlayer,
        viewPlayer,
        clear,
        submitSearch,
        queriedPlayers
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