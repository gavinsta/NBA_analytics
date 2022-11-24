import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import TeamView from '../components/TeamView'
import FinancialDisplay from '../components/FinancialDisplay'
export default function SimulatorScreen() {
  return (
    <Tabs>
      <TabList>
        <Tab>Team View</Tab>
        <Tab>Financials</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <TeamView />
        </TabPanel>
        <TabPanel>
          <FinancialDisplay />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}