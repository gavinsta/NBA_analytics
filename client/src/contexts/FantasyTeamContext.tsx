import React, { createContext, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
interface Player {

  firstName: string,
  lastName: string,
  salary: number,
  //stats are per game
  threePointers: number,
  twoPointers: number,
  minutes: number,
}

interface Team {
  roster: Player[],
  name: string,
  budget: number
}
interface ContextType {
  team: Player[];
  select: (player: Player) => void;
  clear: () => void;
}

export const FantasyTeamContext = createContext<ContextType>({
  team: [],
  select: () => { },
  clear: () => { },
});

export const FantasyTeamProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [team, setTeam] = useState<Player[]>([]);

  function select(player: Player) {
    // Prevent item select in mobile
    //if (isMobile) return;
    setTeam((prev) => [...prev, player]);
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
    setTeam([]);
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
        select,
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