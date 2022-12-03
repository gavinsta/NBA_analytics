import { Alert, Box, Button, ButtonGroup, Heading, HStack, Stack, Text, List, useStatStyles, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";
import { useState } from "react";
import { Player } from "../../../server/types/Player";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import PlayerStatsDisplay from "./PlayerStatsDisplay";
import background from "../backgrounds/basketball_players_silhouette.jpeg"
import { GiBasketballJersey } from "react-icons/gi"
const RosterView: React.FC = () => {
  const { team, removePlayer, saveTeam } = useFantasyTeam();
  const [selected, setSelected] = useState<Player | null>(null)
  function selectPlayer(player: Player) {
    console.log(`Selected ${player.PlayerName}`)
    setSelected(player)
  }
  function renderTeam() {
    if (team && team.roster.length > 0) {
      return (
        team?.roster.map((player) => {
          const index = team.roster.indexOf(player);
          return (<PlayerStatsDisplay
            index={index + 1}
            key={index}
            player={player}
            select={selectPlayer} />
          )
        }))
    }
    else return (<Alert
      variant={"subtle"}
      status={"warning"}>Draft some players to get started</Alert>)
  }

  return <Stack

  >
    <HStack>
      <Icon
        as={GiBasketballJersey}
        color="white"
        bg="black"
        padding={2}
        borderRadius={25}
        w={20}
        h={20}
      />
      <Heading
      >

        {team?.name} Roster
      </Heading> </HStack>
    {team && team.roster.length > 10 ? <Alert
      variant={"solid"}
      status={"warning"}>While it's possible to have up to 15 players per NBA team, we suggest a maximum of ten for the simulations!</Alert> : <></>}
    <Stack
      borderWidth={10}
      borderRadius={20}
      borderColor={"orange.600"}
      backgroundImage={`url(${background})`}
      backgroundPosition="top"
      backgroundAttachment={"fixed"}
      padding={2}
      maxH={"500px"}
      overflowY={"scroll"}
      alignContent="start"
    >
      {renderTeam()}
    </Stack>

    <ButtonGroup
      colorScheme={"orange"}>

      <Button
        onClick={() => {
          if (selected) {
            removePlayer(selected)
            console.log(`Removing ${selected.PlayerName}`)
            setSelected(null)
          }
        }}>
        Remove Player
      </Button>
      <Button
        colorScheme={"green"}
        onClick={() => {
          saveTeam();
          //TODO Save changes to team
        }
        }>
        Save Changes
      </Button>
    </ButtonGroup>
  </Stack>
}

export default RosterView