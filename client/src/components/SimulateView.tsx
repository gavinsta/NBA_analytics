import { Box, Button, ButtonGroup, HStack, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { predictNegativePoints, predictPositivePoints } from "../utils/SimulationMethods";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
const SimulateView: React.FC = () => {
  //const [PP, setPP] = useState();
  //const [NP, setNP] = useState();
  const { team } = useFantasyTeam();
  function simulatePos() {
    const pp = team?.roster.map((player) => {
      return <Text>{player.PlayerName}: {predictPositivePoints(player)}</Text>
    })
    return pp
  } function simulateNeg() {
    const pp = team?.roster.map((player) => {
      return <Text>{player.PlayerName}: {predictNegativePoints(player)}</Text>
    })
    return pp
  }
  return (<Box>
    <HStack>
      <Stack>
        {simulatePos()}
      </Stack>
      <Stack>
        {simulateNeg()}
      </Stack>
    </HStack>
    <ButtonGroup>
      <Button>
        Simulate
      </Button>
    </ButtonGroup>
  </Box>)
}

export default SimulateView