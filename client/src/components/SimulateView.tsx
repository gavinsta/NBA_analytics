import {
  AlertDialog, AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box, Button, ButtonGroup, Center, HStack, Stack, Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { predictNegativePoints, predictPositivePoints, randomGameStats } from "../utils/SimulationMethods";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";

const SimulateView: React.FC = () => {
  //const [PP, setPP] = useState();
  //const [NP, setNP] = useState();
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
        <Stack>
          {simulatePos()}
        </Stack>
        <Stack>
          {simulateNeg()}
        </Stack>
      </HStack>
      <ButtonGroup>
        <Button
          onClick={
            () => {
              if (team) {
                randomGameStats(team.roster[0], playerMetas[0], false)
                randomGameStats(team.roster[0], playerMetas[0], true)
              }
              //onOpen()
            }
          }>
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
  </Box>)
}

export default SimulateView