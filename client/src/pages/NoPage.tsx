import React from "react";
import { GiBrokenHeart } from "react-icons/gi"
import { Button, Icon, Stack } from "@chakra-ui/react"
const NoPage: React.FC = () => {
  return (
    <Stack>
      <Icon as={GiBrokenHeart} boxSize={15} />
      Whoops you're lost.
      <Button
        color={"orange.300"}>
        Take me back!
      </Button>
    </Stack>

  )
}

export default NoPage;
