import { Box, Button, ButtonGroup, HStack } from "@chakra-ui/react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
const Layout: React.FC = () => {
  return (
    <Box
      height={"-webkit-fit-content"}>
      <HStack>
        <ButtonGroup>
          <Link to="/">
            <Button>
              Home
            </Button></Link>
        </ButtonGroup>
      </HStack>
      <Outlet />
    </Box>)
}

export default Layout