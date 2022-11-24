import React, { createContext, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import { Player } from "../../../server/types/Player"
import { Team } from "../../../server/types/Team"

interface ContextType {
  team: Team | null;
  addPlayer: (player: Player) => void;
  clear: () => void;
}

export const FantasyTeamContext = createContext<ContextType>({
  team: null,
  addPlayer: () => { },
  clear: () => { },
});

export const FantasyTeamProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [team, setTeam] = useState<Team | null>(null);

  function addPlayer(player: Player) {
    // Prevent item select in mobile
    //if (isMobile) return;

  }
  /*
    function unselect(key: string) {
      setValues((prev) => {
        const newValues = prev.filter((val) => val !== key);
        return newValues;
      });
    }
  
    function toggleSelect(key: string) {
      // Item is already selected
      if (values.includes(key)) {
        unselect(key);
      } else {
        select(key);
      }
    }
  */
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
        addPlayer,
        clear,
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