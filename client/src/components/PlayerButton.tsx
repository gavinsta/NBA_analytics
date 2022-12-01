import {
  AlertDialog, AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button, IconButton,
  useDisclosure,
  ButtonProps as ChakraButtonProps, forwardRef, HStack, Stack, Spacer, Text, ButtonGroup, Icon, Tooltip, Alert
} from "@chakra-ui/react";
import { Player } from "../../../server/types/Player";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
import { AiOutlineUserAdd } from "react-icons/ai"
import { GiMoneyStack } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im"
import { useState, useRef } from "react";
// "available" | "unavailable" | "nobudget"
export type PlayerButtonProps = ChakraButtonProps & {
  player: Player;
  status: "success" | "error" | "warning" | "info"
  statusText: string
};
const PlayerButton: React.FC<PlayerButtonProps> = ({ player, statusText, status }) => {
  const { addPlayer } = useFantasyTeam();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  return <HStack
    borderRadius={10}
    bg="#ff9933"
    padding={2}
    width={"100%"}>


    <Alert
      variant={"left-accent"}
      status={status}
      width={"8%"}

    >{statusText}
    </Alert>

    <Text
      color={"white"}
      bg="orange.500"
      padding={2}
      borderRadius={10}
      width={"15%"}
      textAlign={"center"}
    >{player.PlayerName}</Text>
    <Spacer
      width={"5%"} />
    <HStack
      bg="green.500"
      padding={2}
      borderRadius={10}
      width={"15%"}>

      <Icon
        as={GiMoneyStack}
        color={"white"}
        height={25}
        width={25} />

      <Text
        color={"white"}
        width={'100%'}
        textAlign={"right"}
        fontWeight={"black"}>
        ${player.ContractPrice.toLocaleString('en-US')}
      </Text>
    </HStack>
    <Stack

      width={"12%"}
      spacing={.5}>
      <ButtonGroup
        alignSelf={"right"}
        colorScheme={"orange"}>
        <Tooltip
          label={status === "success" ? "Add Player to your team" : "Player Unavaiable"}
        >
          <IconButton
            disabled={status !== "success"}
            fontSize={'25px'}
            aria-label="Add Player"
            icon={<AiOutlineUserAdd />}
            onClick={() => {
              onOpen()
            }}
          >
          </IconButton>
        </Tooltip>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              bg={"white"}>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Add Player
              </AlertDialogHeader>

              <AlertDialogBody>
                Use your draft pick?
              </AlertDialogBody>

              <AlertDialogFooter
                alignContent={"center"}>
                <Button ref={cancelRef} onClick={onClose}>
                  On second thought...
                </Button>
                <Button colorScheme='green' onClick={() => {
                  console.log(`Adding ${player.PlayerName}`)
                  addPlayer(player);
                  onClose()
                }} ml={3}>
                  Draft!
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Tooltip label="View Player's Stats">
          <IconButton
            fontSize={'25px'}
            aria-label="View Player Stats"
            icon={<ImStatsDots />}
            onClick={() => {
              console.log(`Viewing ${player.PlayerName}`)
            }}
          >
          </IconButton>
        </Tooltip>
      </ButtonGroup>



    </Stack>
  </HStack >
}

export default PlayerButton;