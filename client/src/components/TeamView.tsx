
import { Box, Button, ButtonGroup, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import PlayerSearchDisplay from "./PlayerSearchDisplay";
import RosterView from "./RosterView";
import SearchBar from "./SearchBar";
import SimulateView from "./SimulateView";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import { useUserContext } from "../contexts/UserContext";
const TeamView: React.FC = () => {
  const { team, budgetLeft } = useFantasyTeam();
  const { user } = useUserContext();
  return (
    team ?
      <Box>
        <Stack>
          <SearchBar />
          <PlayerSearchDisplay />
          <HStack>
            <Text
              fontSize={20}
            >
              Budget Left: ${budgetLeft.toLocaleString()}
            </Text>
          </HStack>
          <Box>
            <Heading>
              {team?.name} Roster
            </Heading>


            <Stack>
              <RosterView />
              <SimulateView />
            </Stack>
          </Box>
        </Stack>
      </Box> :
      <Text>
        Sign up and create your team!
      </Text>
  );
}

export default TeamView;