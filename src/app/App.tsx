import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useRecoilValue } from 'recoil';

import { isInstalledState } from './globalState';
import Setup from './Setup';
import { SyntheticEvent, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import Config from './Config';
import Control from './Control';

const TabPanel = (props: { children?: any, index: number, value: number, }) => {
    return (
        <Box sx={{ py: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {props.value === props.index && props.children}
        </Box>
    );
};

const App = () => {
    const isInstalled = useRecoilValue(isInstalledState);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const handleTabChange = (_: SyntheticEvent, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };
    return (
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Minecraft Server Manager
                    </Typography>
                    <Control />
                </Toolbar>
            </AppBar>
            {
                isInstalled && <Box sx={{ mx: 6, mb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label='サーバー設定' />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabIndex} index={0}><Config /></TabPanel>
                </Box>
            }
            <Dialog
                fullScreen
                open={!isInstalled}
            >
                <AppBar position='relative'>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                        >
                            <KeyboardArrowRightIcon />
                        </IconButton>
                        <Typography variant="h6" component="div">
                            セットアップ
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Setup />
            </Dialog>
        </Box>
    );
};
export default App;