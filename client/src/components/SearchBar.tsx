import { Button, HStack, Input } from "@chakra-ui/react"
import { BsSearch } from "react-icons/bs"
import { useState } from "react"
const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>();

  return <HStack>
    <Input
      bg={"white"}
      placeholder="Search for a player"
      onChange={e => {
        setSearchTerm(e.target.value)
      }}>
    </Input>
    <Button
      color={"white"}
      bg={"#ff9933"}
      onClick={() => {
        //search
      }}
      leftIcon={<BsSearch />}>
      Search
    </Button>
  </HStack>
}

export default SearchBar