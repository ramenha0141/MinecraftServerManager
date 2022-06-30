import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SpeedIcon from '@mui/icons-material/Speed';
import TerminalIcon from '@mui/icons-material/Terminal';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useRecoilState } from 'recoil';

import { isInstalledState, isServerRunningState } from './globalState';
import Setup from './Setup';

const ServerAPI = window.ServerAPI;
const App = () => {
    const [isServerRunning, setIsServerRunning] = useRecoilState(isServerRunningState);
    const [isInstalled, setIsInstalled] = useRecoilState(isInstalledState);
    const handleStart = async () => {
        if (!isServerRunning) {
            if (await ServerAPI.start()) {
                setIsServerRunning(true);
            }
        }
    };
    const handleStop = async () => {
        if (isServerRunning) {
            if (await ServerAPI.stop()) {
                setIsServerRunning(false);
            }
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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
                    <ButtonGroup variant='contained' sx={{ mr: 12, backgroundColor: '#fff' }}>
                        <Button variant='outlined'
                            disabled={isServerRunning}
                            onClick={handleStart}
                        ><PlayArrowIcon /></Button>
                        <Button variant='outlined'
                            disabled={!isServerRunning}
                            onClick={handleStop}
                        ><StopIcon /></Button>
                        <Button variant='outlined'><SpeedIcon /></Button>
                        <Button variant='outlined'><TerminalIcon /></Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
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
                            Setup
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Setup />
            </Dialog>
        </Box>
    );
};
export default App;