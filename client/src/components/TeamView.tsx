
import {
  AlertDialog, AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure, Box, Button, ButtonGroup, Heading, HStack, Input, Stack, Text
} from "@chakra-ui/react";
import RosterView from "./RosterView";
import GameSimulatorView from "./simulator/GameSimulatorView";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import { useUserContext } from "../contexts/UserContext";
import { useRef, useState } from "react";
import PlayerSearchView from "./PlayerSearchView";
const TeamView: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLInputElement>(null);
  const { team, budget: budgetLeft, createNewTeam } = useFantasyTeam();
  const [teamName, setTeamName] = useState<string>("");
  const { user } = useUserContext();
  return (
    team ?
      <Box>
        <Stack>
          <PlayerSearchView />
          <Box>
            <Stack>
              <RosterView />
            </Stack>
          </Box>
        </Stack>
      </Box> :
      <>
        <Text>
          Sign up and create your team!
        </Text>
        <Button
          colorScheme={"green"}
          onClick={() => { createNewTeam() }}>
          Make me a team!
        </Button>

      </>
  );
}

export default TeamView;