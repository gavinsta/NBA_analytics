import {
  AlertDialog, AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box, Button, ButtonGroup, Center, Icon, Heading, HStack, Stack, Text,
  useDisclosure,
  Container,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { adjustGameOutcomeByMP, predictNegativePoints, predictPositivePoints, randomGameStats } from "../../utils/SimulationMethods";
import { useFantasyTeam } from "../../contexts/FantasyTeamContext";
import Court from "../Court";
import { BsPlayCircle } from "react-icons/bs"
import { Team } from "../../../../server/types/Team";
import { GameOutcome } from "../../../../server/types/GameOutcome";
import AllTeamsDisplay from "../team_components/AllTeamsDisplay";
import { SaveTeamFormat } from "../../../../server/types/SaveTeamFormat";
import { collectPlayerNames, currentBudget, currentContractPrices, getTeamID, tryLoadTeam, tryLoadTeamMetadata } from "../../utils/DataUtils";
import { Player } from "../../../../server/types/Player";
import GameOutcomeDisplay from "./GameOutcomeDisplay";
import Money from "../styled_components/Money";
const GameSimulatorView: React.FC = () => {
  //const [PP, setPP] = useState();
  //const [NP, setNP] = useState();
  const [userOutcomes, setUserOutcomes] = useState<GameOutcome[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Team | null>();
  const [opponentTeamFormat, setOpponentTeamFormat] = useState<SaveTeamFormat | null>(null);
  const [opponentOutcomes, setOpponentOutcomes] = useState<GameOutcome[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { team, playerMetas } = useFantasyTeam();
  const [isThrottled, setThrottled] = useState<boolean>(false);
  const [secondsWaiting, setSecondsWaiting] = useState(0);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (secondsWaiting > 0) {
        setSecondsWaiting(secondsWaiting - 1);
      }
      if (secondsWaiting === 0) {
        clearInterval(myInterval)
        setThrottled(false)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  });


  const toast = useToast();
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

  async function simulateGameResults() {
    if (opponentTeamFormat && team) {
      const opponentData = await loadOpponentTeam(opponentTeamFormat);
      const firstRunUser = simulateGameResultsForTeam(team, playerMetas);
      const firstRunOpponent = simulateGameResultsForTeam(opponentData.team, opponentData.metas);
      const userMPfactor = 1 / ((firstRunUser.reduce((partialSum, a) => partialSum + a.MP, 0)) / 240);
      const opponentMPfactor = 1 / ((firstRunOpponent.reduce((partialSum, a) => partialSum + a.MP, 0)) / 240);
      setUserOutcomes(firstRunUser.map((outcome) => adjustGameOutcomeByMP(outcome, userMPfactor)));
      setOpponentOutcomes(firstRunOpponent.map((outcome) => adjustGameOutcomeByMP(outcome, opponentMPfactor)));
    }
    else {
      toast({
        position: "top-left",
        status: "error",
        title: `Your team or opponent team is missing data!`,
        description: `This is probably an error on our end...`
      })
    }
  }

  function simulateGameResultsForTeam(team: Team, metaDatas: Player[]): GameOutcome[] {
    const outcomes: GameOutcome[] = []
    for (var player of team.roster) {
      let playerMeta;
      for (var meta of metaDatas) {
        if (meta.PlayerName == player.PlayerName) {
          playerMeta = meta;
          break;
        }
      }
      if (playerMeta) {
        outcomes.push(randomGameStats(player, playerMeta, true,));
      }
      else {
        toast({
          position: "top-left",
          status: "error",
          title: `No meta-data associated with ${player.PlayerName}.`,
          description: `This can happen if the minutes played this season is too low to draw meaningful statistical inferences from. Average Minutes Played: ${player.MP}`
        })
      }
    }
    return outcomes;
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

  async function loadOpponentTeam(teamFormat: SaveTeamFormat): Promise<{ team: Team, metas: Player[] }> {
    const result = await tryLoadTeam(teamFormat.team_id)

    console.log(result.team)
    let team: Team | null = null;
    if (result.team) {
      team = result.team;
      setOpponentTeam(team);
      const metas = await loadOpponentTeamMeta(team);
      return { team, metas }
    }
    toast({
      status: result.status,
      title: result.title,
      description: result.text,
    });
    throw new Error(`Opponent Team could not be loaded! ${result.text}`)
  }
  async function loadOpponentTeamMeta(team: Team): Promise<Player[]> {
    //TODO the meta data here is being retrieved by TEAM NAME not TEAM_ID woops
    const result = await tryLoadTeamMetadata(getTeamID(team))
    console.log(result)
    if (result.status == "success") {
      return result.metaDatas;
    }
    else throw new Error(`Meta data of ${team.name} could not be loaded! ${result.text}`)
  }
  function checkReadyToSimulate(): boolean {
    if (opponentTeamFormat && team) {
      return true
    }
    else return false;
  }

  //TODO added checks for opponent team 'validity'
  function checkValidTeamSelection(opponent: SaveTeamFormat) {
    const playerNames = collectPlayerNames(opponent)
    if (team) {
      if (Math.abs(playerNames.length - team?.roster.length) <= 2 && playerNames.length > 9) {
        return false
      }
    }
    return true;
  }
  return (<Box>
    <Stack>
      <AllTeamsDisplay
        selectTeam={setOpponentTeamFormat} />
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
      <ButtonGroup>
        <Button
          disabled={isThrottled}
          onClick={() => {
            if (checkReadyToSimulate()) {
              setThrottled(true)
              setSecondsWaiting(10)
              simulateGameResults()
            }
            else {
              toast({
                status: "warning",
                title: "Make sure youv'e selected an opponent team"
              })
            }
          }
          }>
          {isThrottled ? `Simulate Again in ${secondsWaiting}s` : `Simulate`}
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
    {team ? <Money label={`${team?.name} Expenses`} value={team ? currentContractPrices(team) : 0} /> : <></>}
    {opponentTeam ? <Money label={`${opponentTeam?.name} Expenses`} value={opponentTeam ? currentContractPrices(opponentTeam) : 0} /> : <></>}
    {userOutcomes.length > 0 && opponentOutcomes.length > 0 ?
      <GameOutcomeDisplay
        userTeamName={team ? team.name : ""}
        opponentTeamName={opponentTeam ? opponentTeam.name : ""}
        userOutcomes={userOutcomes}
        opponentOutcomes={opponentOutcomes}
      /> : opponentTeamFormat ? <Alert
        status="info">
        <AlertIcon /> Simulate when you're ready!
      </Alert> : <Alert
        status="warning">
        <AlertIcon /> You need to make a team and pick an opponent team
      </Alert>}

  </Box>)
}

export default GameSimulatorView