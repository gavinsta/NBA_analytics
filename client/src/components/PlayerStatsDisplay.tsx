import { Button, Circle, HStack, Icon, Spacer, Stack, Text } from "@chakra-ui/react";
import { GiMoneyStack } from "react-icons/gi";

import { Player } from "../../../server/types/Player";
import Money from "./styled_components/Money";
interface PlayerDataDisplayProps {
  index: number,
  player: Player,
  select: (player: Player) => void
}
const PlayerStatsDisplay = ({ index, player, select }: PlayerDataDisplayProps) => {
  return (
    <Button
      alignSelf={"left"}
      height={"fit-content"}
      width={"full"}
      padding={2}
      borderRadius={10}
      bg={"whiteAlpha.700"}
      _hover={{
        background: "orange"
      }}
      key="{player}"
      onClick={() => {
        select(player)
      }}>
      <Stack
        alignSelf={"start"}
        direction={"row"}
      >
        <Circle
          size={"100px"}
          bg={"orange"}
        >
          <Text

            fontSize={50}>
            {index}
          </Text>
        </Circle>

        <Spacer
          width={"15px"} />
        <Stack
          alignContent={"center"}>
          <Text
            fontWeight={"extrabold"}
            fontSize={20}
            textAlign={"center"}>
            {player.PlayerName}
          </Text>
          <Text
            textAlign={"center"}>
            {player.Pos}
          </Text>
          <Text
            textAlign={"center"}>
            Mintues Played: {player.MP}
          </Text>
          <Money
            value={+player.ContractPrice}
          />
        </Stack>



        <Stack
          bg={"orange.400"}
          padding={2}
          borderRadius={10}
          color={"white"}>

          <Text
            fontWeight={"bold"}>
            Shooting:
          </Text>
          <Text>
            Two Pointer: {(player.TwoPcent * 100).toFixed(2)}%
          </Text>
          <Text>
            Three Pointer: {(player.ThreePcent * 100).toFixed(2)}%
          </Text>
          <Text>
            Free Throws: {(player.FTcent * 100).toFixed(2)}%
          </Text>
        </Stack>

        <Stack
          bg={"orange.400"}
          padding={2}
          borderRadius={10}
          color={"white"}>

          <Text
            fontWeight={"bold"}>
            Rebounds:
          </Text>
          <Text>
            Offensive Rebounds: {player.ORB.toFixed(2)}
          </Text>
          <Text>
            Defensive Rebounds {player.DRB.toFixed(2)}
          </Text>
        </Stack>

        <Stack
          bg={"orange.400"}
          padding={2}
          borderRadius={10}
          color={"white"}>

          <Text
            fontWeight={"bold"}>
            Defense:
          </Text>
          <Text>
            Steals: {player.STL.toFixed(2)}
          </Text>
          <Text>
            Blocks: {player.BLK.toFixed(2)}
          </Text>
          <Text>
            Personal Fouls: {player.PF.toFixed(2)}
          </Text>
        </Stack>

      </Stack>
    </Button>
  )
}

export default PlayerStatsDisplay