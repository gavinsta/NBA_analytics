import { Alert, Button, HStack, Input, Stack } from "@chakra-ui/react"
import { BsSearch } from "react-icons/bs"
import { useState, FormEvent } from "react"
import { SQLsearchterm } from "../../../server/types/QueryRequest"
import { useFantasyTeam } from "../contexts/FantasyTeamContext"
//TODO throttle requests!
const SearchBar: React.FC = () => {
  const { submitSearch } = useFantasyTeam()
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  function createSQLSearch(name: string): SQLsearchterm {
    const search: SQLsearchterm = {
      term: name,
      type: "Player",
      //TODO can change comparator later
      comparator: "includes",
      criteria: "PlayerName"
    }

    return search;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    //search
    if (searchTerm.length < 3) {
      setAlert(true)
    }
    else {
      setDisabled(true)
      setAlert(false)
      try {
        await submitSearch(createSQLSearch(searchTerm))
      } catch (err) {
        console.log(err)
      }
      finally {
        setDisabled(false)
      }


    }
  }
  return <Stack>
    {alert ? <Alert
      variant={"subtle"}>
      At least 3 characters required
    </Alert> : <></>}

    <form
      onSubmit={submit}>
      <HStack>
        <Input
          bg={"white"}
          placeholder="Search for a player"
          disabled={disabled}
          onChange={e => {
            setSearchTerm(e.target.value)
          }}>
        </Input>

        <Button
          color={"white"}
          bg={"#ff9933"}
          disabled={disabled}
          type="submit"

          leftIcon={<BsSearch />}>
          Search
        </Button>
      </HStack>
    </form>

  </Stack >
}

export default SearchBar