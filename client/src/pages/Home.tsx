import React, { useState } from "react";
import { Outlet } from "react-router-dom"
import { Alert, Box, Button, ButtonGroup, Center, Heading, Icon, Input, Spacer, Stack, Text, Tooltip } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { GiBasketballBall, GiBasketballBasket } from "react-icons/gi"
import { useUserContext } from "../contexts/UserContext"
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import Court from "../components/Court";
import NBAcourt from "../tmp/NBAcourt";
const Home: React.FC = () => {

  const { user, logout, createRoom, joinRoom } = useUserContext();
  const { clearTeam } = useFantasyTeam();
  const [roomCode, setRoomCode] = useState<string>("");
  function roomControls() {
    if (user)
      return (<>{user.room_id ?
        <ButtonGroup>

          <Tooltip
            label="We're working on this feature!"
          >
            <Button
              disabled={true}
            //TODO leave room
            >
              Leave Room
            </Button>
          </Tooltip>

        </ButtonGroup> : <Stack>{roomCode.length < 4 ? <Alert status="warning">
          Room code should be a minimum of 4 characters!
        </Alert> : roomCode.length > 10 ? <Alert status="warning">
          Room code is too long!
        </Alert> : <></>}<ButtonGroup>

            <Input
              bg={"white"}
              width={"30%"}
              textAlign={"center"}
              placeholder="ROOM CODE"
              required
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase())
              }}
            />

            <Button
              onClick={() => {
                if (roomCode.length >= 4 && roomCode.length <= 10) {
                  joinRoom(roomCode)
                }
              }}>
              Join Room
            </Button>
            <Button
              onClick={() => {
                if (roomCode.length >= 4 && roomCode.length <= 10) {
                  createRoom(roomCode)
                }
              }}
              //TODO disabled createRoom for now.
              disabled={true}
            >

              Create New Room
            </Button>
          </ButtonGroup></Stack>}
      </>
      )
  }
  function renderOptions() {
    if (user) {
      return (
        <ButtonGroup
          alignSelf={"center"}
          colorScheme={"orange"}
          variant={"solid"}>
          <Button
            onClick={() => {
              logout();
              clearTeam();
            }}>
            Log Out
          </Button>
        </ButtonGroup>
      )
    }
    else {
      return (
        <ButtonGroup
          alignSelf={"center"}
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
    <Box
      alignContent={"center"}>
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
      <Text
        fontSize={"24"}
        textAlign={"center"}>

        {user && `Welcome ${user.name}`}
      </Text>
      <Text
        textAlign={"center"}>
        {user?.team_id ? `and the ${user.team_id}` : `No Team Yet!`}
      </Text>

      <Center
        height={"100%"}
        alignContent={"center"}>
        <Stack>
          {renderOptions()}
          {roomControls()}
          {user?.room_id ? <Link to='/simulator' >
            <Button colorScheme={"green"}>
              Go to the Simulator!
            </Button>
          </Link> : <></>}
        </Stack>
      </Center>
      <Spacer height={10} />

    </Box>
  )
}

export default Home

