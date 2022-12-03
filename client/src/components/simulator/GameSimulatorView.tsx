import {
  AlertDialog, AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box, Button, ButtonGroup, Center, Icon, Heading, HStack, Stack, Text,
  useDisclosure,
  Container,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { predictNegativePoints, predictPositivePoints, randomGameStats } from "../../utils/SimulationMethods";
import { useFantasyTeam } from "../../contexts/FantasyTeamContext";
import Court from "../Court";
import { BsPlayCircle } from "react-icons/bs"
import { Team } from "../../../../server/types/Team";
import { GameOutcome } from "../../../../server/types/GameOutcome";
const GameSimulatorView: React.FC = () => {
  //const [PP, setPP] = useState();
  //const [NP, setNP] = useState();
  const [userTeamResults, setUserTeamResults] = useState<GameOutcome[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Team | null>();
  const [opponentTeamResults, setOpponentTeamResults] = useState<GameOutcome[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { team, playerMetas } = useFantasyTeam();
  const cancelRef = useRef<HTMLButtonElement>(null)
  function simulatePos() {
    const pp = team?.roster.map((player) => {
      return <Text>{player.PlayerName}: {predictPositivePoints(player)}</Text>
    })
    return pp
  }
  function simulateNeg() {
    const pp = team?.roster.map((player) => {
      return <Text>{player.PlayerName}: {predictNegativePoints(player)}</Text>
    })
    return pp
  }

  function simulateGameResults() {
    if (team) {
      const userResults = team.roster.map((player) => {
        randomGameStats(team.roster[0], playerMetas[0], true)
      });
    }
    //onOpen()
  }

  function playByPlay() {
    const outcomes = team?.roster.map((player) => {
      for (var i = 0; i < playerMetas.length; i++) {
        if (playerMetas[i].PlayerName == player.PlayerName) {
          return <Text>AST: {randomGameStats(player, playerMetas[i], true).AST}</Text>
        }
      }
    });
    return outcomes;
  }
  return (<Box>
    <Stack>
      <HStack>
        <Icon
          as={BsPlayCircle}
          color="white"
          bg="black"
          padding={2}
          borderRadius={25}
          w={20}
          h={20}
        />
        <Heading
        >
          Game Simulator
        </Heading> </HStack>
      <HStack>
        <Stack>
          {simulatePos()}
        </Stack>
        <Stack>
          {simulateNeg()}
        </Stack>
      </HStack>
      <ButtonGroup>
        <Button
          onClick={simulateGameResults}>
          Simulate
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              bg={"white"}>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Add Player
              </AlertDialogHeader>

              <AlertDialogBody>
                Use your draft pick?
              </AlertDialogBody>

              <AlertDialogFooter
                alignContent={"center"}>
                <Button ref={cancelRef} onClick={onClose}>
                  On second thought...
                </Button>
                <Button colorScheme='green' onClick={() => {
                  //TODO add function
                  onClose()
                }} ml={3}>
                  Draft!
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </ButtonGroup>
    </Stack>
    <Container
      maxWidth={"1000px"}>
      <Court />
    </Container>

  </Box>)
}

export default GameSimulatorView