
import { Box, Button, ButtonGroup, Input, Stack } from "@chakra-ui/react";

const TeamView: React.FC = () => {
  return (
    <Box>
      <Stack>

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
    </Box>
  );
}

export default TeamView;