import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SpeedIcon from '@mui/icons-material/Speed';
import TerminalIcon from '@mui/icons-material/Terminal';
import { useRecoilState } from 'recoil';

import { isServerRunningState } from './globalState';

const ServerAPI = window.ServerAPI;
const App = () => {
    const [isServerRunning, setIsServerRunning] = useRecoilState(isServerRunningState);
    const start = async () => {
        if (!isServerRunning) {
            if (await ServerAPI.start()) {
                setIsServerRunning(true);
            }
        }
    };
    const stop = async () => {
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
                            onClick={start}
                        ><PlayArrowIcon /></Button>
                        <Button variant='outlined'
                            disabled={!isServerRunning}
                            onClick={stop}
                        ><StopIcon /></Button>
                        <Button variant='outlined'><SpeedIcon /></Button>
                        <Button variant='outlined'><TerminalIcon /></Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
export default App;