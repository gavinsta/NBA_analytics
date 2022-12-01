import { Box, Button, ButtonGroup, HStack } from "@chakra-ui/react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import { useUserContext } from "../contexts/UserContext";
const Layout: React.FC = () => {
  const { createNewTeam } = useFantasyTeam();
  const { user } = useUserContext();
  return (
    <Box
      height={"-webkit-fit-content"}>
      <HStack>
        <ButtonGroup>
          <Link to="/">
            <Button>
              Home
            </Button></Link>
          <Button
            onClick={() => { createNewTeam("Test Team") }}>
            Create Test Team
          </Button>
        </ButtonGroup>
      </HStack>
      <Outlet />
    </Box>)
}

export default Layout