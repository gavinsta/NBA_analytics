import { Alert, AlertIcon, Box, Button, ButtonGroup, HStack, Icon, Stack, Text, Tooltip, useStatStyles } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SaveTeamFormat } from "../../../../server/types/SaveTeamFormat";
import { getAllTeams, collectPlayerNames } from "../../utils/DataUtils"
import { GiMoneyStack } from "react-icons/gi";
import Money from "../../components/styled_components/Money";
import SearchBar from "../../components/drafting/SearchBar";
//import { Comparator, SQLsearchterm } from "../../../../server/types/QueryRequest";
import { Comparator, SQLsearchterm } from "../../types/QueryRequest";
import { Team } from "../../../../server/types/Team";
import TeamFormatDisplay from "./TeamFormatDisplay";
const AllTeamsDisplay = ({
  selectTeam = (teamFormat: SaveTeamFormat) => { }
}) => {
  const [isThrottled, setThrottled] = useState<boolean>(false)
  const [allTeamFormats, setAllTeamFormats] = useState<SaveTeamFormat[]>([])
  const [selectedTeam, setSelectedTeam] = useState<SaveTeamFormat | null>(null)
  const [secondsWaiting, setSecondsWaiting] = useState(0);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (secondsWaiting > 0) {
        setSecondsWaiting(secondsWaiting - 1);
      }
      if (secondsWaiting === 0) {
        clearInterval(myInterval)
        setThrottled(false)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  });
  async function loadAllTeams() {
    const results = await getAllTeams()
    if (results.teams.length > 0) {
      setAllTeamFormats(results.teams)
    }
  }

  const searchTerm: SQLsearchterm = {
    type: "Team",
    term: "team_id",
    comparator: Comparator.includes,
    value: "Gifted"

  }
  const searchTeam = async (searchTerm: SQLsearchterm) => {
    //TODO search team method does nothing atm
  }
  function showAllTeams() {
    if (allTeamFormats.length > 0) {
      let index = 0
      const teamDisplays = allTeamFormats.map((team) => {

        index++;
        return (<TeamFormatDisplay
          selectTeam={(team: SaveTeamFormat) => {
            selectTeam(team)
            setSelectedTeam(team)
          }}
          selected={team == selectedTeam ? true : false}
          key={index}
          team={team}
        />);
      });
      return teamDisplays;
    }
    return <Alert variant="top-accent"
      status="info"><AlertIcon />Search for some teams, or hit refresh!</Alert>;
  }

  return (
    <Box
    >
      <HStack>
        <Button
          disabled={isThrottled}
          onClick={() => {
            loadAllTeams()
            setThrottled(true)
            //after 60 seconds you can do it again
            setSecondsWaiting(20)
          }}>
          Refresh
        </Button>
        {isThrottled ? <Alert status="loading"
        >{`Please wait ${secondsWaiting} before loading all teams again...`}
        </Alert> : <></>}
      </HStack>

      <SearchBar
        search={searchTeam}
        type="Team" />
      <Stack
        borderRadius={20}
        boxShadow={"2xl"}
        borderColor={"orange.600"}
        padding={5}
        backgroundPosition="top"
        backgroundAttachment={"fixed"}
        //padding={2}
        maxH={"500px"}
        overflowY={"scroll"}
        alignContent={"center"}>
        {showAllTeams()}
      </Stack>
    </Box>
  );
}

export default AllTeamsDisplay