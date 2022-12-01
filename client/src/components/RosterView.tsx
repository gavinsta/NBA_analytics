import { Alert, Button, ButtonGroup, HStack, Stack, Text, List } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";
import { Player } from "../../../server/types/Player";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";

const RosterView: React.FC = () => {
  const { team } = useFantasyTeam();

  function renderTeam() {
    if (team && team.roster.length > 0) {
      return (
        team?.roster.map((player) => {
          return (
            <Stack
              direction={"row"}
              padding={2}
              borderRadius={10}
              bg={"blackAlpha.300"}
              key="{player}">
              <Stack
                alignContent={"center"}>
                <Text
                  fontWeight={"extrabold"}
                  fontSize={20}
                  textAlign={"center"}>
                  {player.PlayerName}
                </Text>
                <Text
                  textAlign={"center"}>
                  {player.Pos}
                </Text>
                <Text
                  textAlign={"center"}>
                  Mintues Played: {player.MP}
                </Text>
              </Stack>

              <Stack
                bg={"orange.400"}
                padding={2}
                borderRadius={10}
                color={"white"}>

                <Text
                  fontWeight={"bold"}>
                  Shooting:
                </Text>
                <Text>
                  Two Pointer: {(player.TwoPcent * 100).toFixed(2)}%
                </Text>
                <Text>
                  Three Pointer: {(player.ThreePcent * 100).toFixed(2)}%
                </Text>
                <Text>
                  Free Throws: {(player.FTcent * 100).toFixed(2)}%
                </Text>
              </Stack>

              <Stack
                bg={"orange.400"}
                padding={2}
                borderRadius={10}
                color={"white"}>

                <Text
                  fontWeight={"bold"}>
                  Rebounds:
                </Text>
                <Text>
                  Offensive Rebounds: {player.ORB.toFixed(2)}
                </Text>
                <Text>
                  Defensive Rebounds {player.DRB.toFixed(2)}
                </Text>
              </Stack>

              <Stack
                bg={"orange.400"}
                padding={2}
                borderRadius={10}
                color={"white"}>

                <Text
                  fontWeight={"bold"}>
                  Defense:
                </Text>
                <Text>
                  Steals: {player.STL.toFixed(2)}
                </Text>
                <Text>
                  Blocks: {player.BLK.toFixed(2)}
                </Text>
                <Text>
                  Personal Fouls: {player.PF.toFixed(2)}
                </Text>
              </Stack>

            </Stack>)
        }))
    }
    else return (<Alert
      variant={"subtle"}
      status={"warning"}>Draft some players to get started</Alert>)
  }

  return <Stack>
    {renderTeam()}
    <ButtonGroup
      colorScheme={"orange"}>
      <Button>
        Add Player
      </Button>
      <Button>
        Remove Player
      </Button>
    </ButtonGroup>
  </Stack>
}

export default RosterView