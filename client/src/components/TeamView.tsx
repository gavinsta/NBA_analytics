
import { Box, Button, ButtonGroup, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import PlayerSearchDisplay from "./PlayerSearchDisplay";
import RosterView from "./RosterView";
import SearchBar from "./SearchBar";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
const TeamView: React.FC = () => {
  const { team, budgetLeft } = useFantasyTeam();
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

            </Stack>
          </Box>
        </Stack>
      </Box> :
      <Text>
        Log in and create your team!
      </Text>

  );
}

export default TeamView;