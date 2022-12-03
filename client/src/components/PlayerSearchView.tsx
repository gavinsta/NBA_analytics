import { Box, Icon, Heading, HStack, Text, useToast, Stack } from "@chakra-ui/react"
import PlayerSearchDisplay from "./drafting/PlayerSearchDisplay"
import SearchBar from "./drafting/SearchBar"
import { useFantasyTeam } from "../contexts/FantasyTeamContext"
import Money from "./styled_components/Money"
import { useState } from "react"
import { Player } from "../../../server/types/Player"
import { SQLsearchterm } from "../../../server/types/QueryRequest"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse"
import { trySearchDatabase } from "../utils/DataUtils"
import { useAppContext } from "../contexts/AppContext"
import { MdPersonSearch } from "react-icons/md"
const PlayerSearchView = () => {
  const { currentBudget, team, addPlayer, viewPlayer, checkAvailability } = useFantasyTeam();
  const [queriedPlayers, setQueriedPlayers] = useState<Player[]>([])
  const [queriedPlayerMetas, setQueriedPlayerMetas] = useState<Player[]>([])
  const { URL } = useAppContext();
  const toast = useToast();
  const submitSearch = async (search: SQLsearchterm) => {

    const res: PlayerQueryResponse = await trySearchDatabase(
      URL + "/search", search
    )
    if (res.status === "error") {
      toast({
        status: "error",
        title: res.title,
        description: res.text,
      })
    }
    else {
      toast({
        status: "success",
        title: res.title,
        description: res.text,
      })
      setQueriedPlayers(res.players)
      setQueriedPlayerMetas(res.playerMetas)
    }
  }
  function findPlayerMeta(player: Player): Player {
    //TODO hacky method of including player meta data. Will consider changing if we keep this app longer
    for (var i = 0; i < queriedPlayerMetas.length; i++) {
      if (queriedPlayerMetas[i].PlayerName == player.PlayerName) {
        return queriedPlayerMetas[i]
      }
    }
    //FALL BACK is to return the player himself...
    return player
  }



  return (
    <Stack>
      <HStack>
        <Icon
          as={MdPersonSearch}
          color="white"
          bg="black"
          padding={2}
          borderRadius={25}
          w={20}
          h={20}
        />
        <Heading
        >
          Search for players
        </Heading> </HStack>

      <SearchBar
        search={submitSearch} />
      <PlayerSearchDisplay
        queriedPlayers={queriedPlayers}
        checkAvailability={checkAvailability}
        addPlayer={(player: Player) => {
          addPlayer(player, findPlayerMeta(player))
        }}
        viewPlayer={viewPlayer}
      />
      <HStack>
        <HStack

          padding={2}
          fontSize={20}>
          <Money
            label={"Budget: "}
            value={currentBudget()} />
        </HStack>
      </HStack>
    </Stack>

  )
}
export default PlayerSearchView