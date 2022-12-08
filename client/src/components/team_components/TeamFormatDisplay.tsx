import {
  Alert,
  AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Box, Button, ButtonGroup,
  Grid, GridItem,
  Heading, HStack, Spacer, Stack, Text, Tooltip, useDisclosure
} from "@chakra-ui/react"
import { useRef } from "react"
import { SaveTeamFormat } from "../../../../server/types/SaveTeamFormat"
import { useFantasyTeam } from "../../contexts/FantasyTeamContext"
import { collectPlayerNames } from "../../utils/DataUtils"
import Money from "../styled_components/Money"
const TeamFormatDisplay = ({ team, selected, selectTeam }: {
  team: SaveTeamFormat,
  selected: boolean,
  selectTeam: (team: SaveTeamFormat) => void
}) => {
  const { team: userTeam } = useFantasyTeam();
  const playerNames = collectPlayerNames(team)
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null)


  function selectionToolTip(): string {
    if (!userTeam) {
      return "You don't have a team yet!"
    }
    if (playerNames.length < 9) {
      return "Opponent Team is too small."
    }
    else return "Pick this team as your opponent"
  }

  function viewPlayers() {
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            maxH={600}
            bg={"white"}>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {team.team_name} Roster:
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <HStack>
                <Stack
                  width={"55%"}
                  boxShadow={"2xl"}
                  overflowY={"scroll"}
                  maxH={500}>
                  {playerNames.map((playerName) => {

                    if (playerName == "NULL") {
                      return <></>
                    }
                    else {
                      return (<Button
                        key={playerName}
                        width={"90%"}
                        height={"100%"}
                        padding={2}
                        colorScheme={"orange"}
                        borderRadius={10}
                        border={"4px"}>{playerName}</Button>)
                    }
                  })}
                </Stack>
                <Stack width={"50%"}
                //stats display
                ><Alert
                  status="warning">
                    Player stats to come!
                  </Alert>

                </Stack>
              </HStack>
            </AlertDialogBody>
            <AlertDialogFooter
            >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    )
  }
  return (

    <Stack
      padding={2}
      boxShadow={"2xl"}>
      <HStack
        bg={selected ? "orange" : ""}
        padding={2}
        borderRadius={15}>
        <Heading
          fontWeight={selected ? "black" : "300"}
          width={"50%"}>
          {team.team_name}
        </Heading>
        <Spacer />
        <Text>
          Owner: {team.owner}
        </Text>
        <Text>
          Wins:
        </Text>
        <Text>
          Losses:
        </Text>
      </HStack>
      <HStack>
        <ButtonGroup>

          <Button
            //TODO decide if should disable disabled={}
            colorScheme={"orange"}
            onClick={() => { selectTeam(team) }}>
            Select Team
          </Button>
          <Button
            onClick={onOpen}>
            View Roster ({playerNames.length})
          </Button>
        </ButtonGroup>
        <Money
          label="Max Budget"
          value={team.budget} />
      </HStack>
      {viewPlayers()}
    </Stack>)
}
export default TeamFormatDisplay