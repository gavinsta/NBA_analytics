import { Tab, Tabs, TabList, TabPanels, TabPanel, Text, Icon, Spacer, Tooltip } from '@chakra-ui/react'
import TeamView from '../components/TeamView'
import StatisticsDisplay from '../components/StatisticsDisplay'
import { Navigate } from 'react-router-dom'
import AllTeamsDisplay from '../components/AllTeamsDisplay'
import { useUserContext } from '../contexts/UserContext'
import { BsPlayCircle } from "react-icons/bs"
import { JerseyIcon } from '../additional_resources/jerseyIcon'
import { ImStatsDots } from "react-icons/im"
import GameSimulatorView from '../components/simulator/GameSimulatorView'
export default function MainSimulatorPage() {
  const { user } = useUserContext();
  return (
    <>
      {!user ? <Navigate to={"/loginPage"} /> : <></>}
      <Tabs
        variant={"enclosed-colored"}
        colorScheme={"orange"}
        size={"lg"}
      >
        <TabList

        >
          <Tab
            _hover={{ background: "orange", color: "white" }}
            fontWeight={"bold"}>
            <JerseyIcon
              w={10}
              h={10}
            />
            <Spacer width={2} />
            <Text>
              Team View
            </Text>
          </Tab>
          <Tooltip
            label="Work in progress">
            <Tab
              //isDisabled={true}
              _hover={{ background: "orange", color: "white" }}
              fontWeight={"bold"}>
              <Icon
                as={ImStatsDots}
                w={10}
                h={10}
              />
              <Spacer width={5} />
              <Text>
                Statistics
              </Text>
            </Tab></Tooltip>
          <Tab
            _hover={{ background: "orange", color: "white" }}
            fontWeight={"bold"}>
            <Icon
              as={BsPlayCircle}
              w={10}
              h={10}
            />
            <Spacer width={5} />
            <Text>
              Game Simulator
            </Text>
          </Tab>
        </TabList>

        <TabPanels
        >
          <TabPanel
          >
            <TeamView />
          </TabPanel>
          <TabPanel>
            <StatisticsDisplay />
          </TabPanel>
          <TabPanel>
            <AllTeamsDisplay />
            <GameSimulatorView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}