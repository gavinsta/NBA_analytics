import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import TeamView from '../components/TeamView'
import FinancialDisplay from '../components/FinancialDisplay'
export default function SimulatorScreen() {
  return (
    <Tabs
      variant={"enclosed-colored"}


    >
      <TabList

      >
        <Tab
          fontWeight={"bold"}>Team View</Tab>
        <Tab
          fontWeight={"bold"}>Financials (WIP)</Tab>
      </TabList>

      <TabPanels
      >
        <TabPanel
        >
          <TeamView />
        </TabPanel>
        <TabPanel>
          <FinancialDisplay />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}