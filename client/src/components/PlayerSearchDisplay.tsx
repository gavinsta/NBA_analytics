import { List, Stack } from "@chakra-ui/react";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import PlayerButton from "./PlayerButton"
import { render } from "@testing-library/react";
import { Player } from "../../../server/types/Player";
import { stat } from "fs";
const PlayerSearchDisplay: React.FC = () => {
  const { team, queriedPlayers, checkBudget } = useFantasyTeam();
  function checkAvailability(player: Player): "available" | "unavailable" | "nobudget" {
    if (!checkBudget(player.ContractPrice)) {
      return "nobudget"
    }
    if (team && team.roster.indexOf(player) !== -1) {
      return "unavailable"
    }
    else return "available"
  }

  function getStatus(status: "available" | "unavailable" | "nobudget"): "success" | "error" | "warning" | "info" {
    if (status == "available") {
      return "success"
    }
    else if (status == "nobudget") {
      return "warning"
    }
    else return "error"
  }

  function getStatusText(status: "available" | "unavailable" | "nobudget"): string {
    let text = ""
    switch (status) {
      case "nobudget":
        text = "No budget left!"
        break;
      case "available":
        text = "Available"
        break;
      default:
        text = "Unavailable"
        break;
    }
    return text;
  }
  function renderPlayerButtons() {
    return queriedPlayers.map(player => {
      //TODO add status of the button
      return <PlayerButton
        statusText={getStatusText(checkAvailability(player))}
        status={getStatus(checkAvailability(player))}
        key="{player}"
        player={player}
      />
    })
  }

  return <Stack
    width={'100%'}
    maxHeight={'300px'}
    overflow={"scroll"}
  >
    {renderPlayerButtons()}
  </Stack>
}

export default PlayerSearchDisplay;