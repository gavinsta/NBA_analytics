import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import TeamView from './TeamView'
import FinancialDisplay from './FinancialDisplay'
export default function MainDisplay() {
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