import React, { createContext, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import { Player } from "../../../server/types/Player"
import { Team } from "../../../server/types/Team"
import { useToast } from "@chakra-ui/react"
import { trySearchDatabase, trySaveTeam, tryLoadTeam } from "../utils/DataUtils"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse"
import { SQLsearchterm } from "../../../server/types/QueryRequest"
interface ContextType {
  team: Team | null;
  playerMetas: Player[];
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
  playerMetas: [],
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
  const [queriedPlayerMetas, setQueriedPlayerMetas] = useState<Player[]>([])
  const [playerMetas, setPlayerMetas] = useState<Player[]>([])
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
  async function saveTeam() {
    if (team) {
      const result = await trySaveTeam(team)
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

  async function loadTeam(team_id: string) {
    const result = await tryLoadTeam(team_id)
    toast({
      status: result.status,
      title: result.title,
      description: result.text
    })
    if (result.team) {
      setTeam(result.team)
    }
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
      //TODO hacky method of including player meta data. Will consider changing if we keep this app longer
      for (var i = 0; i < queriedPlayerMetas.length; i++) {
        if (queriedPlayerMetas[i].PlayerName == player.PlayerName) {
          playerMetas.push(queriedPlayerMetas[i])
        }
      }
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
      setQueriedPlayerMetas(res.playerMetas)
    }
  }

  function clear() {
    setTeam(null);
  }

  //TODO add remove player function
  /*
    function isSelected(key: string) {
      return values.includes(key);
    }
  */
  return (
    <FantasyTeamContext.Provider
      value={{
        team,
        playerMetas,
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