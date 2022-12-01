import React from "react";
import { Outlet } from "react-router-dom"
import { Box, Button, ButtonGroup, Center, Heading, Icon, Spacer, Stack, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { GiBasketballBall, GiBasketballBasket } from "react-icons/gi"
import { useUserContext } from "../contexts/UserContext"
import Court from "../components/Court";
import NBAcourt from "../tmp/NBAcourt";
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
            <Button>
              Sign Up
            </Button>
          </Link>

          <Link to='/loginPage'>
            <Button>
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
        height={100} />
      <Center
        height={"100%"}
        alignContent={"center"}>
        <Stack>
          <Text
            textAlign={"center"}>

            {user && `Welcome ${user.name}\n${user.email}\n${user.password}`}
          </Text>
          {renderOptions()}
        </Stack>

      </Center>
      <Spacer height={10} />
      <Center>

        <Court
          usableWidth={500}
          height={500}
          comp={null} />

      </Center>
    </Box>
  )
}

export default Home

