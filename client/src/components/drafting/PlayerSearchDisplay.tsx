import { List, Stack } from "@chakra-ui/react";
import { useFantasyTeam } from "../../contexts/FantasyTeamContext";
import DraftPlayerButton from "./DraftPlayerButton"
import { render } from "@testing-library/react";
import { Player } from "../../../../server/types/Player";
import { stat } from "fs";
const PlayerSearchDisplay: React.FC<{
  checkAvailability: (player: Player) => "available" | "unavailable" | "nobudget",
  queriedPlayers: Player[],
  addPlayer: (player: Player) => void,
  viewPlayer: (player: Player) => void,
}> = ({ checkAvailability, queriedPlayers, addPlayer, viewPlayer }) => {

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
      return <DraftPlayerButton
        addPlayer={addPlayer}
        viewPlayer={viewPlayer}
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