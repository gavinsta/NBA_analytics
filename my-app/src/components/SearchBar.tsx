import { Button, HStack, Input } from "@chakra-ui/react"
import { BsSearch } from "react-icons/bs"
import { useState } from "react"
const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>();

  return <HStack>
    <Input
      placeholder="Search Player"
      onChange={e => {
        setSearchTerm(e.target.value)
      }}>
    </Input>
    <Button
      onClick={() => {
        //search
      }}
      leftIcon={<BsSearch />}>
      Search
    </Button>
  </HStack>
}