import { Heading, Button, ButtonGroup, Text } from "@chakra-ui/react"
import { useFantasyTeam } from "../contexts/FantasyTeamContext"

const AdminControls = () => {
  const { playerMetas } = useFantasyTeam();
  return (<>
    <Text>
      Admin Controls:
    </Text>
    <ButtonGroup
      colorScheme={"purple"}>
      <Button
        onClick={() => {
          console.log(window.location.pathname)
        }}>
        Page Path
      </Button>
      <Button
        onClick={() => {
          console.log(localStorage.getItem("user"))
          console.log(localStorage.getItem("team"))
        }}>
        View Local Data
      </Button>
      <Button
        onClick={
          () => {
            console.log(playerMetas)
          }
        }>
        View metadata
      </Button>
    </ButtonGroup></>
  )
}

export default AdminControls