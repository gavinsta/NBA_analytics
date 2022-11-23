import React from "react";
import { Outlet } from "react-router-dom"
import { Box, Button, ButtonGroup, Center, Heading, Icon, Spacer, Stack, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { GiBasketballBall, GiBasketballBasket } from "react-icons/gi"
import { useUserContext } from "../contexts/UserContext"
const Home: React.FC = () => {
  const { user, logout } = useUserContext();

  function renderOptions() {
    if (user) {
      return (
        <ButtonGroup
          colorScheme={"orange"}
          variant={"solid"}>
          <Link to='/simulator' >
            <Button>
              Go to the Simulator!
            </Button>
          </Link>

          <Button
            onClick={logout}>
            Log Out
          </Button>
        </ButtonGroup>
      )
    }
    else {
      return (
        <ButtonGroup
          colorScheme={"orange"}>
          <Link to='/signupPage' >
            <Button as="a">
              Sign Up
            </Button>
          </Link>

          <Link to='/loginPage'>
            <Button as="a">
              Log In
            </Button>
          </Link>
        </ButtonGroup>
      )
    }
  }
  return (
    <Box>
      <Center>
        <Stack
          height={"35%"}
          width={"50%"}
          alignItems='center'
          justifyContent='center'
        >


          <Heading
            textAlign={"center"}
            as='h3'>
            The Data Nerds present:
          </Heading>
          <Heading
            as='h1'
            textAlign={"center"}
            color={"orange"}>
            <Icon as={GiBasketballBasket}
            //color="orange"
            />
            NBA Fantasy Simulator
            <Icon as={GiBasketballBall}
            //color="orange"
            />
          </Heading>

        </Stack>
      </Center>
      <Spacer
        height={200} />
      <Center
        height={"100%"}
        alignContent={"center"}>
        <Stack>
          <Text
            textAlign={"center"}>

            {user && `Welcome ${user.name}`}
          </Text>
          {renderOptions()}
        </Stack>
      </Center>
    </Box>
  )
}

export default Home

