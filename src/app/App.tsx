import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Setup from './Setup';
import { useEffect, useState } from 'react';
import Control from './Control';
import Main from './Main';

const ServerAPI = window.ServerAPI;

const App = () => {
    const [isInstalled, setIsInstalled] = useState<boolean>(false);
    useEffect(() => {
        ServerAPI.isInstalled().then((isInstalled) => setIsInstalled(isInstalled));
    });
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
                isInstalled && <Main />
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
                <Setup setIsInstalled={setIsInstalled} />
            </Dialog>
        </Box>
    );
};
export default App;