import { Box, Tabs, Tab } from '@mui/material'
import { SyntheticEvent, useState } from 'react';
import Backup from './Backup'
import Config from './Config'

const TabPanel = (props: { children?: any, index: number, value: number, }) => {
    return (
        <Box sx={{ py: 2, width: '100%', height: '100%', display: props.value === props.index ? 'flex' : 'none', flexDirection: 'column' }}>
            {props.children}
        </Box>
    );
};

const Main = () => {
    const [tabIndex, setTabIndex] = useState<number>(0);
    const handleTabChange = (_: SyntheticEvent, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };
    return (
        <Box sx={{ mx: 6, mb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label='サーバー設定' />
                    <Tab label='バックアップ' />
                </Tabs>
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
                <TabPanel value={tabIndex} index={0}><Config /></TabPanel>
                <TabPanel value={tabIndex} index={1}><Backup /></TabPanel>
            </Box>
        </Box>
    );
};
export default Main;