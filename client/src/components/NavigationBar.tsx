import { Button, ButtonGroup, HStack, Text, Stack, Spacer, Heading } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import { useUserContext } from "../contexts/UserContext"
import AdminControls from "./AdminControls";

const NavigationBar = () => {
  const { user } = useUserContext();
  const { playerMetas } = useFantasyTeam();
  return (<HStack>
    <ButtonGroup>
      <Link to="/home">
        <Button>
          Home
        </Button>
      </Link>
    </ButtonGroup>
    <AdminControls />
    <Spacer />

    <Spacer />
    <Stack>
      <Heading
        fontFamily="bangers">
        {user?.team_id}
      </Heading> {user ? <Text>Logged In: <b>{user.email}</b> <br />as {user.name}</Text> : <Text>Not Logged In!</Text>}
    </Stack>

  </HStack>)
}
export default NavigationBar