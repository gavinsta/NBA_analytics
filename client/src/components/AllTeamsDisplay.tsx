import { Box, Button, ButtonGroup, HStack, Icon, Stack, Text, useStatStyles } from "@chakra-ui/react";
import { useState } from "react";
import { SaveTeamFormat } from "../../../server/types/SaveTeamFormat";
import { useAppContext } from "../contexts/AppContext";
import { collectPlayerNames, getAllTeams } from "../utils/DataUtils"
import { GiMoneyStack } from "react-icons/gi";
const AllTeamsDisplay = () => {
  const [allTeams, setAllTeams] = useState<SaveTeamFormat[]>([])
  const { URL } = useAppContext();
  async function loadAllTeams() {
    const results = await getAllTeams(URL)
    if (results.teams.length > 0) {
      setAllTeams(results.teams)
    }
  }

  function showAllTeams() {
    let elements;
    if (allTeams.length > 0) {
      elements = allTeams.map((team) => {
        const playerNames = collectPlayerNames(team)
        return (<Stack>
          <HStack
            bg={"orange.300"}
            padding={2}
            borderRadius={15}>
            <Text
              fontWeight={"black"}
              width={"100px"}>
              {team.team_id}
            </Text>
            {playerNames.map((playerName) => {
              if (playerName == "NULL") {
                return <></>
              }
              else {
                return (<Button
                  height={"100%"}
                  padding={2}
                  colorScheme={"orange"}
                  borderRadius={10}
                  border={"4px"}>{playerName}</Button>)
              }
            })}
          </HStack>
          <HStack>
            <ButtonGroup>
              <Button colorScheme={"green"}>
                Play Against Team
              </Button>
            </ButtonGroup>
            <HStack
              padding={2}
              borderRadius={10}
              bg={"grey"}>
              <Icon
                as={GiMoneyStack}
                color={"white"}
                bg={"green"}
                borderRadius={10}
                height={25}
                width={25} />
              <Text
                color={"white"}>
                {team.budget}
              </Text>
            </HStack>
          </HStack>

        </Stack>
        )
      });
    }
    return elements;
  }
  return (
    <Box
      alignContent={"center"}>
      <Button
        onClick={() => {
          loadAllTeams()
        }}>
        Refresh
      </Button>
      <Stack
        overflowY={"scroll"}
        alignContent={"center"}
        bg={"gray.300"}
        width={"90%"}
        height={"500"}>
        {showAllTeams()}
      </Stack>
    </Box>
  );
}

export default AllTeamsDisplay